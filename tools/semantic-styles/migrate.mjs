#!/usr/bin/env node
/*
 * DA source migration to the semantic style vocabulary (scripts/bmw-style-names.js).
 *
 * Rewrites only (1) the value cell of the "style" row in section-metadata tables and (2) the class
 * attribute of blocks (direct children of a section); every other byte stays as it is.
 * Deterministic and idempotent; conflicts become explicit exceptions and the element is left
 * unchanged.
 * No network access: reads a DA source export, writes migrated sources + rollback snapshots +
 * diffs + a sha256 manifest. Uploading the migrated sources (DA source API) is a separate,
 * approved step.
 *
 *   node tools/semantic-styles/migrate.mjs <export-dir> <out-dir> [--exclude exclusions.json]
 *   node tools/semantic-styles/migrate.mjs --check <export-dir>     (exit 1 if legacy names remain)
 *
 * <export-dir>/source/<path>.html = DA sources (as exported); <out-dir>/source is again an export.
 */
import { createHash } from 'node:crypto';
import {
  readFileSync, writeFileSync, mkdirSync, readdirSync, statSync,
} from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  toSemanticSectionStyles, toSemanticBlockOptions, findDeprecated,
} from '../../scripts/bmw-style-names.js';

const sha256 = (text) => createHash('sha256').update(text).digest('hex');
const toClassName = (s) => s.trim().toLowerCase().replace(/[^0-9a-z]+/g, '-').replace(/^-+|-+$/g, '');
const stripTags = (html) => html.replace(/<[^>]*>/g, '');

/**
 * Tree of the <div> elements inside <main> (or the whole document): positions of each opening
 * tag, its class attribute and its inner HTML.
 */
function divTree(html) {
  const start = html.includes('<main>') ? html.indexOf('<main>') + 6 : 0;
  const end = html.includes('</main>') ? html.lastIndexOf('</main>') : html.length;
  const root = { children: [], depth: 0 };
  const stack = [root];
  const re = /<div\b([^>]*)>|<\/div>/g;
  re.lastIndex = start;
  let m = re.exec(html);
  while (m && m.index < end) {
    if (m[0] === '</div>') {
      const node = stack.pop();
      node.innerEnd = m.index;
    } else {
      const attr = m[1].match(/\bclass="([^"]*)"/);
      const node = {
        children: [],
        depth: stack.length,
        innerStart: m.index + m[0].length,
        classValue: attr ? attr[1] : null,
        classStart: attr ? m.index + 4 + m[1].indexOf(attr[0]) + 7 : -1,
      };
      stack[stack.length - 1].children.push(node);
      stack.push(node);
    }
    m = re.exec(html);
  }
  return root;
}

/** Style cell of a section-metadata table: { start, end, text } of its plain-text value. */
function styleCell(html, meta) {
  const row = meta.children.find((r) => r.children.length >= 2
    && toClassName(stripTags(html.slice(r.children[0].innerStart, r.children[0].innerEnd))) === 'style');
  if (!row) return null;
  const cell = row.children[1];
  const inner = html.slice(cell.innerStart, cell.innerEnd);
  const m = inner.match(/^(\s*(?:<p>)?)([^<]*)((?:<\/p>)?\s*)$/);
  if (!m) return { complex: inner };
  const start = cell.innerStart + m[1].length;
  return { start, end: start + m[2].length, text: m[2] };
}

/**
 * Migrates one DA source document.
 * @param {string} html
 * @returns {{html: string, changed: boolean, changes: object[], exceptions: string[]}}
 */
export function migrateDocument(html) {
  const edits = [];
  const changes = [];
  const exceptions = [];
  divTree(html).children.forEach((section) => section.children.forEach((block) => {
    if (!block.classValue) return;
    const [name, ...options] = block.classValue.split(/\s+/).filter(Boolean);
    if (name === 'section-metadata') {
      const cell = styleCell(html, block);
      if (!cell) return;
      if (cell.complex !== undefined) {
        exceptions.push(`section-metadata: style cell with markup left unchanged (${cell.complex.slice(0, 60)})`);
        return;
      }
      const tokens = cell.text.split(',').map(toClassName).filter(Boolean);
      const result = toSemanticSectionStyles(tokens);
      exceptions.push(...result.exceptions);
      if (!result.exceptions.length && result.styles.join(',') !== tokens.join(',')) {
        const text = result.styles.join(', ');
        edits.push({ start: cell.start, end: cell.end, text });
        changes.push({ kind: 'section', before: cell.text, after: text });
      }
      return;
    }
    const result = toSemanticBlockOptions(name, options);
    exceptions.push(...result.exceptions);
    if (!result.exceptions.length && result.options.join(' ') !== options.join(' ')) {
      const text = [name, ...result.options].join(' ');
      const start = block.classStart;
      edits.push({ start, end: start + block.classValue.length, text });
      changes.push({ kind: 'block', before: block.classValue, after: text });
    }
  }));
  let out = html;
  edits.sort((a, b) => b.start - a.start).forEach((e) => {
    out = out.slice(0, e.start) + e.text + out.slice(e.end);
  });
  return {
    html: out, changed: out !== html, changes, exceptions,
  };
}

/**
 * What must not change: visible text (without section metadata), link targets and media.
 * @param {string} html
 */
export function contentFingerprint(html) {
  const meta = /<div class="section-metadata">(?:(?!<div class="section-metadata">)[\s\S])*?<\/div><\/div><\/div>/g;
  const body = html.replace(meta, '');
  return {
    text: stripTags(body).replace(/\s+/g, ' ').trim(),
    links: [...html.matchAll(/\bhref="([^"]*)"/g)].map((m) => m[1]),
    media: [...html.matchAll(/\b(src|srcset|alt)="([^"]*)"/g)].map((m) => `${m[1]}=${m[2]}`),
  };
}

function listHtml(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) return listHtml(p);
    return name.endsWith('.html') ? [p] : [];
  }).sort();
}

const write = (file, text) => {
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, text);
};

/**
 * Migrates a DA source export into <outDir> (source/, rollback/, diff/, manifest.json).
 * @param {string} exportDir directory containing source/
 * @param {string} outDir
 * @param {{exclude?: Object<string, string>}} [opts] path (without .html) -> reason
 */
export function migrateExport(exportDir, outDir, { exclude = {} } = {}) {
  const src = join(exportDir, 'source');
  const documents = listHtml(src).map((file) => {
    const rel = relative(src, file);
    const path = `/${rel.replace(/\.html$/, '')}`;
    const html = readFileSync(file, 'utf8');
    if (exclude[path]) return { path, excluded: exclude[path], before: sha256(html) };
    const result = migrateDocument(html);
    write(join(outDir, 'source', rel), result.html);
    if (result.changed) {
      write(join(outDir, 'rollback', rel), html);
      write(join(outDir, 'diff', rel.replace(/\.html$/, '.diff')), result.changes
        .map((c) => `@@ ${c.kind}\n- ${c.before}\n+ ${c.after}\n`).join(''));
    }
    return {
      path,
      changed: result.changed,
      before: sha256(html),
      after: sha256(result.html),
      changes: result.changes,
      exceptions: result.exceptions,
    };
  });
  const migrated = documents.filter((d) => !d.excluded);
  const manifest = {
    source: exportDir,
    generated: new Date().toISOString(),
    documents,
    summary: {
      documents: documents.length,
      changed: migrated.filter((d) => d.changed).length,
      unchanged: migrated.filter((d) => !d.changed).length,
      excluded: documents.length - migrated.length,
      exceptions: migrated.reduce((n, d) => n + d.exceptions.length, 0),
      changes: migrated.reduce((n, d) => n + d.changes.length, 0),
    },
  };
  write(join(outDir, 'manifest.json'), `${JSON.stringify(manifest, null, 1)}\n`);
  return manifest;
}

/**
 * Legacy author-facing names still present in an export: [{path, token, where}].
 * @param {string} exportDir
 */
export function checkExport(exportDir) {
  const src = join(exportDir, 'source');
  return listHtml(src).flatMap((file) => {
    const html = readFileSync(file, 'utf8');
    const path = `/${relative(src, file).replace(/\.html$/, '')}`;
    const hits = [];
    divTree(html).children.forEach((section) => section.children.forEach((block) => {
      if (!block.classValue) return;
      const [name, ...options] = block.classValue.split(/\s+/).filter(Boolean);
      if (name === 'section-metadata') {
        const cell = styleCell(html, block);
        if (cell && cell.text !== undefined) {
          findDeprecated(cell.text.split(',').map(toClassName))
            .forEach((token) => hits.push({ path, token, where: 'section' }));
        }
      } else {
        findDeprecated(options, name).forEach((token) => hits.push({ path, token, where: name }));
      }
    }));
    return hits;
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  if (args[0] === '--check') {
    const hits = checkExport(args[1]);
    hits.forEach((h) => console.log(`${h.path}\t${h.where}\t${h.token}`));
    console.log(`${hits.length} legacy author-facing style names`);
    process.exit(hits.length ? 1 : 0);
  }
  const [exportDir, outDir] = args;
  const i = args.indexOf('--exclude');
  const exclude = i > -1 ? JSON.parse(readFileSync(args[i + 1], 'utf8')) : {};
  const { summary } = migrateExport(exportDir, outDir, { exclude });
  console.log(JSON.stringify(summary));
}
