#!/usr/bin/env node
/* eslint-disable no-console */
/*
 * DA source migration to the semantic style vocabulary (scripts/bmw-style-names.js).
 *
 * Rewrites only (1) the plain-text value of the "style" row in section-metadata tables, (2) the
 * class attribute value of blocks (direct children of a section) and (3) the class attribute value
 * of sections (serialized styles, .plain.html / rendered shape); every other byte stays as it is.
 * Deterministic and idempotent; conflicts, values without a semantic name, style cells with markup
 * and unbalanced structure become explicit exceptions and the element (or document) is left
 * unchanged.
 * No network access: reads a DA source export, writes migrated sources + rollback snapshots +
 * diffs + a sha256 manifest. Uploading the migrated sources (DA source API) is a separate,
 * approved step.
 *
 *   node tools/semantic-styles/migrate.mjs <export-dir> <out-dir> --exclude exclusions.json
 *   node tools/semantic-styles/migrate.mjs --check <export-dir>
 *     (exit 1 if legacy names, conflicts or unsupported markup remain)
 *   node tools/semantic-styles/migrate.mjs --verify <export-dir> <out-dir> \
 *     --exclude exclusions.json
 *     (complete inventory, explicit exclusions, bytes outside the style spans identical, same
 *     implementation classes, outputs match the migration manifest, idempotent, no legacy names)
 *
 * <export-dir>/source/<path>.html = DA sources (as exported), <export-dir>/manifest.json their
 * inventory (exported: [{path, ext, status, sha256}]); exclusions.json maps a path (without .html)
 * to the reviewed reason ({} for none).
 */
import { createHash } from 'node:crypto';
import {
  readFileSync, writeFileSync, mkdirSync, readdirSync, statSync, existsSync,
} from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  toSemanticSectionStyles,
  toSemanticBlockOptions,
  findDeprecated,
  expandSectionStyles,
  expandBlockOptions,
} from '../../scripts/bmw-style-names.js';

const sha256 = (text) => createHash('sha256').update(text).digest('hex');
const toClassName = (s) => s.trim().toLowerCase().replace(/[^0-9a-z]+/g, '-').replace(/^-+|-+$/g, '');
const stripTags = (html) => html.replace(/<[^>]*>/g, '');
const own = (obj, key) => Object.hasOwn(obj, key);

/* ---------------------------------------------------------------- HTML scanning */

/** Elements whose content is raw text (no tags inside). */
const RAW_TEXT = new Set(['script', 'style', 'textarea', 'title']);
const WS = /[\t\n\f\r ]/;
const END_TAG = /<\/([^\t\n\f\r />]+)[^>]*>/y;

/**
 * Start tag at `i` (html[i] === '<', a letter follows): name, attributes with value positions
 * (quotes excluded) and the index after '>'. Null when the tag is not terminated.
 */
function startTag(html, i) {
  let j = i + 1;
  while (j < html.length && !WS.test(html[j]) && html[j] !== '/' && html[j] !== '>') j += 1;
  const tag = { name: html.slice(i + 1, j).toLowerCase(), attrs: [] };
  for (;;) {
    while (j < html.length && (WS.test(html[j]) || html[j] === '/')) j += 1;
    if (j >= html.length) return null;
    if (html[j] === '>') {
      tag.end = j + 1;
      return tag;
    }
    const nameStart = j;
    j += 1; // a first "=" belongs to the name
    while (j < html.length && !WS.test(html[j]) && !'/>='.includes(html[j])) j += 1;
    const attr = { name: html.slice(nameStart, j).toLowerCase(), value: null };
    let k = j;
    while (k < html.length && WS.test(html[k])) k += 1;
    if (html[k] === '=') {
      k += 1;
      while (k < html.length && WS.test(html[k])) k += 1;
      const quote = html[k] === '"' || html[k] === "'" ? html[k] : '';
      const valueStart = k + (quote ? 1 : 0);
      let valueEnd = valueStart;
      if (quote) {
        valueEnd = html.indexOf(quote, valueStart);
        if (valueEnd < 0) return null;
        j = valueEnd + 1;
      } else {
        while (valueEnd < html.length && !WS.test(html[valueEnd]) && html[valueEnd] !== '>') valueEnd += 1;
        j = valueEnd;
      }
      Object.assign(attr, {
        value: html.slice(valueStart, valueEnd), valueStart, valueEnd, quote,
      });
    }
    tag.attrs.push(attr);
  }
}

/**
 * Tree of the <div> elements of a document (inside <main> when there is one): each node with the
 * span of its inner HTML and its class attribute (the first one, as browsers do). Comments,
 * doctype / processing instructions and raw-text elements are skipped; attribute values are
 * parsed with their quotes. Unbalanced <div> / </div> (or unterminated markup) -> { error }.
 */
function divTree(html) {
  const doc = { tag: '#document', children: [] };
  const stack = [doc];
  let main = null;
  let lower = null;
  let i = html.indexOf('<');
  const error = (message) => ({ error: `structure: ${message} at offset ${i}` });
  while (i > -1) {
    const next = html[i + 1] || '';
    if (html.startsWith('<!--', i)) {
      const close = html.indexOf('-->', i + 4);
      if (close < 0) return error('unterminated comment');
      i = html.indexOf('<', close + 3);
    } else if (next === '!' || next === '?') {
      const close = html.indexOf('>', i);
      if (close < 0) return error('unterminated declaration');
      i = html.indexOf('<', close + 1);
    } else if (next === '/' && /[a-zA-Z]/.test(html[i + 2] || '')) {
      END_TAG.lastIndex = i;
      const m = END_TAG.exec(html);
      if (!m) return error('unterminated end tag');
      const name = m[1].toLowerCase();
      if (name === 'div' || name === 'main') {
        const top = stack[stack.length - 1];
        if (top.tag !== name) return error(`</${name}> closes <${top.tag}>`);
        top.innerEnd = i;
        stack.pop();
      }
      i = html.indexOf('<', i + m[0].length);
    } else if (/[a-zA-Z]/.test(next)) {
      const tag = startTag(html, i);
      if (!tag) return error('unterminated start tag');
      if (tag.name === 'div' || tag.name === 'main') {
        const cls = tag.attrs.find((a) => a.name === 'class') || null;
        const node = {
          tag: tag.name,
          children: [],
          innerStart: tag.end,
          cls: cls && cls.value !== null ? cls : null,
        };
        stack[stack.length - 1].children.push(node);
        stack.push(node);
        if (tag.name === 'main' && !main) main = node;
        i = html.indexOf('<', tag.end);
      } else if (RAW_TEXT.has(tag.name)) {
        lower = lower || html.toLowerCase();
        const close = lower.indexOf(`</${tag.name}`, tag.end);
        if (close < 0) return error(`unterminated <${tag.name}>`);
        i = close;
      } else {
        i = html.indexOf('<', tag.end);
      }
    } else {
      i = html.indexOf('<', i + 1);
    }
  }
  i = html.length;
  if (stack.length > 1) return error(`unclosed <${stack[stack.length - 1].tag}>`);
  return { root: main || doc };
}

/** Text value of the style row of a section-metadata table: { start, end, text } or { issue }. */
function styleCell(html, meta) {
  const rows = meta.children.filter((r) => r.children.length >= 2
    && toClassName(stripTags(html.slice(r.children[0].innerStart, r.children[0].innerEnd))) === 'style');
  if (!rows.length) return null;
  if (rows.length > 1) return { issue: 'section-metadata: more than one style row left unchanged' };
  const cell = rows[0].children[1];
  const inner = html.slice(cell.innerStart, cell.innerEnd);
  const m = inner.match(/^(\s*<p>)([^<]*)(<\/p>\s*)$/) || inner.match(/^()([^<]*)()$/);
  if (!m || cell.children.length) {
    return { issue: `section-metadata: style cell with markup left unchanged (${inner.slice(0, 80)})` };
  }
  const start = cell.innerStart + m[1].length;
  return { start, end: start + m[2].length, text: m[2] };
}

const issueKind = (message) => {
  if (/conflicting/.test(message)) return 'conflict';
  if (/no semantic (?:name|size)/.test(message)) return 'unnamed';
  return 'unsupported';
};

/**
 * The rewritable style spans of a document, in document order: section class attributes, block
 * class attributes and style cells, each with its tokens and the semantic conversion; plus the
 * issues (structure, markup, conflicts, values without a name).
 * Span positions cover the attribute value including its quotes (quotes may be added).
 */
function analyse(html) {
  const tree = divTree(html);
  if (tree.error) return { spans: [], issues: [{ kind: 'structure', message: tree.error }] };
  const spans = [];
  const issues = [];
  const classSpan = (node, kind) => ({
    kind,
    start: node.cls.valueStart - (node.cls.quote ? 1 : 0),
    end: node.cls.valueEnd + (node.cls.quote ? 1 : 0),
    quote: node.cls.quote,
    text: node.cls.value,
  });
  tree.root.children.filter((n) => n.tag === 'div').forEach((section) => {
    if (section.cls) {
      const span = classSpan(section, 'section');
      span.tokens = span.text.split(/\s+/).filter(Boolean);
      const result = toSemanticSectionStyles(span.tokens);
      spans.push({ ...span, result: result.styles.join(' '), exceptions: result.exceptions });
    }
    section.children.filter((n) => n.tag === 'div' && n.cls).forEach((block) => {
      const [name, ...options] = block.cls.value.split(/\s+/).filter(Boolean);
      if (!name) return;
      if (name === 'section-metadata') {
        const cell = styleCell(html, block);
        if (!cell) return;
        if (cell.issue) {
          issues.push({ kind: 'unsupported', message: cell.issue });
          return;
        }
        const tokens = cell.text.split(',').map(toClassName).filter(Boolean);
        const result = toSemanticSectionStyles(tokens);
        spans.push({
          kind: 'style', ...cell, tokens, result: result.styles.join(', '), exceptions: result.exceptions,
        });
        return;
      }
      const result = toSemanticBlockOptions(name, options);
      spans.push({
        ...classSpan(block, 'block'),
        name,
        tokens: options,
        result: [name, ...result.options].join(' '),
        exceptions: result.exceptions,
      });
    });
  });
  spans.forEach((s) => s.exceptions
    .forEach((message) => issues.push({ kind: issueKind(message), message })));
  return { spans, issues };
}

/** Current text of a span vs. its conversion (style cells keep their own comma formatting). */
function spanChange(span) {
  if (span.exceptions.length) return null;
  const current = span.kind === 'style' ? span.tokens.join(', ') : [span.name, ...span.tokens].filter(Boolean).join(' ');
  if (span.result === current) return null;
  if (span.kind === 'style') return span.result;
  const quote = span.quote || (/[\s"'=<>`]/.test(span.result) ? '"' : '');
  return `${quote}${span.result}${quote}`;
}

/**
 * Migrates one DA source document.
 * @param {string} html
 * @returns {{html: string, changed: boolean, changes: object[], exceptions: string[]}}
 */
export function migrateDocument(html) {
  const { spans, issues } = analyse(html);
  const changes = [];
  let out = html;
  [...spans].reverse().forEach((span) => {
    const text = spanChange(span);
    if (text === null) return;
    out = out.slice(0, span.start) + text + out.slice(span.end);
    changes.unshift({ kind: span.kind, before: html.slice(span.start, span.end), after: text });
  });
  return {
    html: out, changed: out !== html, changes, exceptions: issues.map((i) => i.message),
  };
}

/* ---------------------------------------------------------------- verification */

/** Spacing classes only feed CSS (no script reads them), so their order is not behaviour. */
const SPACING = /^spacing-(?:top|bottom)-\d+$/;
const ordered = (classes) => [...classes.filter((c) => !SPACING.test(c)), '|', ...classes.filter((c) => SPACING.test(c)).sort()].join(' ');

/** Implementation classes the runtime derives from a span (behavioural order kept). */
function spanSignature(span) {
  if (span.kind === 'block') return `${span.name}: ${ordered(expandBlockOptions(span.name, span.tokens))}`;
  return `${span.kind}: ${ordered(expandSectionStyles(span.tokens))}`;
}

/** The document with every style span replaced by a placeholder: must be byte-identical. */
function skeleton(html, spans) {
  let out = '';
  let at = 0;
  spans.forEach((s) => {
    out += `${html.slice(at, s.start)}\u0000${s.kind}\u0000`;
    at = s.end;
  });
  return out + html.slice(at);
}

/**
 * The document outside its style spans (each span replaced by a placeholder), or null when the
 * structure cannot be parsed: a migration must leave it byte-identical.
 * @param {string} html
 */
export function styleSkeleton(html) {
  const { spans, issues } = analyse(html);
  return issues.some((i) => i.kind === 'structure') ? null : skeleton(html, spans);
}

/**
 * Implementation classes the runtime derives for every style span of a document, or null when the
 * structure cannot be parsed.
 * @param {string} html
 */
export function implementationSignature(html) {
  const { spans, issues } = analyse(html);
  return issues.some((i) => i.kind === 'structure') ? null : spans.map(spanSignature);
}

function listHtml(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) return listHtml(p);
    return name.endsWith('.html') ? [p] : [];
  }).sort();
}

const pathOf = (src, file) => `/${relative(src, file).replace(/\.html$/, '')}`;
const fileOf = (dir, path) => join(dir, 'source', `${path.slice(1)}.html`);

const write = (file, text) => {
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, text);
};

/**
 * The complete document inventory of an export (manifest.json, html entries) checked against the
 * files: { docs: Map(path -> sha256), failures: [{path, kind: 'inventory', detail}] }.
 * @param {string} exportDir
 */
export function readInventory(exportDir) {
  const failures = [];
  const docs = new Map();
  const fail = (path, detail) => failures.push({ path, kind: 'inventory', detail });
  const file = join(exportDir, 'manifest.json');
  if (!existsSync(file)) {
    fail('/', 'no manifest.json (inventory) in the export');
    return { docs, failures };
  }
  const manifest = JSON.parse(readFileSync(file, 'utf8'));
  if (!Array.isArray(manifest.exported)) fail('/', 'manifest.json has no exported[] inventory');
  const { errors: reported = 0 } = manifest;
  const errors = Array.isArray(reported) ? reported.length : Number(reported);
  if (errors) fail('/', `export reported ${errors} errors`);
  (manifest.exported || []).filter((e) => e.ext === 'html' || /\.html$/.test(e.path)).forEach((e) => {
    const path = e.path.replace(/\.html$/, '');
    if (e.status !== 200) fail(path, `exported with status ${e.status}`);
    else if (!/^[0-9a-f]{64}$/.test(e.sha256 || '')) fail(path, 'no sha256 in the inventory');
    else docs.set(path, e.sha256);
  });
  const src = join(exportDir, 'source');
  const onDisk = new Set(listHtml(src).map((f) => pathOf(src, f)));
  onDisk.forEach((path) => { if (!docs.has(path)) fail(path, 'file not in the inventory'); });
  docs.forEach((hash, path) => {
    if (!onDisk.has(path)) fail(path, 'inventory document missing on disk');
    else if (sha256(readFileSync(fileOf(exportDir, path), 'utf8')) !== hash) fail(path, 'file differs from the inventory sha256');
  });
  return { docs, failures };
}

/** Exclusions must be reviewed reasons for documents of the inventory. */
function exclusionFailures(exclude, docs) {
  return Object.entries(exclude).flatMap(([path, reason]) => {
    if (!docs.has(path)) return [{ path, kind: 'unknown-exclusion', detail: 'not in the inventory' }];
    if (typeof reason !== 'string' || !reason.trim()) return [{ path, kind: 'unknown-exclusion', detail: 'no reason' }];
    return [];
  });
}

function requireExclusions(exclude, fn) {
  if (!exclude || typeof exclude !== 'object' || Array.isArray(exclude)) {
    throw new Error(`${fn}: explicit exclusions required ({} for none)`);
  }
}

/**
 * Migrates a DA source export into <outDir> (source/, rollback/, diff/, manifest.json): every
 * document of the inventory except the explicit exclusions. Throws when the export does not match
 * its inventory or an exclusion is unknown.
 * @param {string} exportDir directory containing source/ and manifest.json
 * @param {string} outDir
 * @param {{exclude: Object<string, string>}} opts path (without .html) -> reviewed reason
 */
export function migrateExport(exportDir, outDir, { exclude } = {}) {
  requireExclusions(exclude, 'migrateExport');
  const inventory = readInventory(exportDir);
  const problems = [...inventory.failures, ...exclusionFailures(exclude, inventory.docs)];
  if (problems.length) {
    throw new Error(`migrateExport: ${problems.map((p) => `${p.path} ${p.kind} (${p.detail})`).join('; ')}`);
  }
  const documents = [...inventory.docs.keys()].sort().map((path) => {
    const rel = `${path.slice(1)}.html`;
    const html = readFileSync(fileOf(exportDir, path), 'utf8');
    if (own(exclude, path)) return { path, excluded: exclude[path], before: sha256(html) };
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
    inventory: sha256(readFileSync(join(exportDir, 'manifest.json'), 'utf8')),
    generated: new Date().toISOString(),
    exclude,
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

/** Findings of one document: legacy names, conflicts, values without a name, unsupported markup. */
function checkDocument(path, html) {
  const { spans, issues } = analyse(html);
  const hits = issues.map((i) => ({
    path, kind: i.kind === 'structure' ? 'unsupported' : i.kind, where: 'document', token: i.message,
  }));
  spans.forEach((s) => {
    const where = s.kind === 'block' ? s.name : 'section';
    findDeprecated(s.tokens, s.kind === 'block' ? s.name : undefined)
      .forEach((token) => hits.push({
        path, kind: 'legacy', where, token,
      }));
  });
  return hits;
}

/**
 * Legacy author-facing names, conflicts and unsupported markup in an export:
 * [{path, kind: 'legacy' | 'conflict' | 'unnamed' | 'unsupported', where, token}].
 * @param {string} exportDir
 */
export function checkExport(exportDir) {
  const src = join(exportDir, 'source');
  return listHtml(src).flatMap((file) => checkDocument(pathOf(src, file), readFileSync(file, 'utf8')));
}

/**
 * The migration manifest must describe exactly the inventory it was made from (recorded digest of
 * <before>/manifest.json, one record per inventory document with its checksum) and the same
 * exclusions (paths and reasons): [[path, detail]].
 */
function manifestFailures(manifest, beforeDir, docs, exclude) {
  const out = [];
  const file = join(beforeDir, 'manifest.json');
  const digest = existsSync(file) ? sha256(readFileSync(file, 'utf8')) : null;
  if (!manifest.inventory || manifest.inventory !== digest) {
    out.push(['/', 'inventory digest differs from the inventory the migration was made from']);
  }
  const recorded = manifest.exclude && typeof manifest.exclude === 'object' ? manifest.exclude : null;
  const same = recorded && Object.keys(recorded).length === Object.keys(exclude).length
    && Object.entries(exclude)
      .every(([path, reason]) => own(recorded, path) && recorded[path] === reason);
  if (!same) out.push(['/', 'exclusions differ from the migration\'s']);
  if (!Array.isArray(manifest.documents)) out.push(['/', 'no documents[] in the migration manifest']);
  const seen = new Set();
  (Array.isArray(manifest.documents) ? manifest.documents : []).forEach((d) => {
    const path = d && d.path;
    if (seen.has(path)) {
      out.push([path, 'duplicate record']);
      return;
    }
    seen.add(path);
    if (!docs.has(path)) {
      out.push([path, 'record not in the inventory']);
      return;
    }
    if (Boolean(d.excluded) !== own(exclude, path)) {
      out.push([path, d.excluded ? 'record excluded, not excluded now' : 'excluded now, migrated by the record']);
    }
    if (d.before !== docs.get(path)) out.push([path, 'record checksum differs from the inventory']);
  });
  docs.forEach((hash, path) => { if (!seen.has(path)) out.push([path, 'no record']); });
  return out;
}

/**
 * Verifies a migrated export (<after>/source + manifest.json) against the original export and its
 * complete inventory (<before>/manifest.json) with explicit exclusions.
 * @param {string} beforeDir
 * @param {string} afterDir
 * @param {{exclude: Object<string, string>}} opts the reviewed exclusions ({} for none)
 * @returns {{ok: boolean, verified: number, excluded: string[], failures: object[]}}
 */
export function verifyExport(beforeDir, afterDir, { exclude } = {}) {
  requireExclusions(exclude, 'verifyExport');
  const inventory = readInventory(beforeDir);
  const failures = [...inventory.failures, ...exclusionFailures(exclude, inventory.docs)];
  const fail = (path, kind, detail) => failures.push({ path, kind, ...(detail ? { detail } : {}) });
  const after = join(afterDir, 'source');
  const outputs = new Set(listHtml(after).map((f) => pathOf(after, f)));
  const manifestFile = join(afterDir, 'manifest.json');
  const entries = new Map();
  if (existsSync(manifestFile)) {
    const manifest = JSON.parse(readFileSync(manifestFile, 'utf8'));
    manifestFailures(manifest, beforeDir, inventory.docs, exclude)
      .forEach(([path, detail]) => fail(path, 'manifest', detail));
    (manifest.documents || []).forEach((d) => {
      if (d && !entries.has(d.path)) entries.set(d.path, d);
    });
  } else fail('/', 'manifest', 'no migration manifest.json in the output');
  outputs.forEach((path) => {
    if (!inventory.docs.has(path) || own(exclude, path)) fail(path, 'extra');
  });
  const excluded = [];
  let verified = 0;
  [...inventory.docs.keys()].sort().forEach((path) => {
    if (own(exclude, path)) {
      excluded.push(path);
      return;
    }
    if (!outputs.has(path)) {
      fail(path, 'missing');
      return;
    }
    verified += 1;
    const a = readFileSync(fileOf(beforeDir, path), 'utf8');
    const b = readFileSync(fileOf(afterDir, path), 'utf8');
    const entry = entries.get(path);
    if (!entry || entry.excluded || entry.before !== inventory.docs.get(path)
      || entry.after !== sha256(b)) {
      fail(path, 'drift', 'output differs from the migration manifest');
    }
    const before = analyse(a);
    const result = analyse(b);
    if (before.issues.length) fail(path, 'exception', before.issues.map((i) => i.message).join('; '));
    const parsed = !result.issues.some((i) => i.kind === 'structure');
    if (!parsed || skeleton(a, before.spans) !== skeleton(b, result.spans)) {
      fail(path, 'bytes', 'bytes outside the style spans differ');
    }
    const sa = before.spans.map(spanSignature);
    const sb = result.spans.map(spanSignature);
    const i = sa.findIndex((s, n) => s !== sb[n]);
    if (parsed && (i > -1 || sa.length !== sb.length)) {
      fail(path, 'classes', i > -1 ? `${sa[i]} -> ${sb[i]}` : 'different number of styled elements');
    }
    const hits = checkDocument(path, b);
    [...new Set(hits.map((h) => h.kind))].forEach((kind) => fail(path, kind, hits.filter((h) => h.kind === kind).map((h) => h.token).join(', ')));
    if (!hits.length && migrateDocument(b).changed) fail(path, 'idempotence');
  });
  if (!verified) fail('/', 'empty', 'no document verified');
  return {
    ok: failures.length === 0, verified, excluded, failures,
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const i = args.indexOf('--exclude');
  const exclude = () => {
    if (i < 0) {
      console.error('--exclude <exclusions.json> is required (a file containing {} for none)');
      process.exit(2);
    }
    return JSON.parse(readFileSync(args[i + 1], 'utf8'));
  };
  if (args[0] === '--verify') {
    const report = verifyExport(args[1], args[2], { exclude: exclude() });
    report.failures.forEach((f) => console.log(`${f.path}\t${f.kind}${f.detail ? `\t${f.detail}` : ''}`));
    const { ok, verified, excluded } = report;
    console.log(JSON.stringify({
      ok, verified, excluded, failures: report.failures.length,
    }));
    process.exit(report.ok ? 0 : 1);
  }
  if (args[0] === '--check') {
    const hits = checkExport(args[1]);
    hits.forEach((h) => console.log(`${h.path}\t${h.kind}\t${h.where}\t${h.token}`));
    console.log(`${hits.length} findings (legacy names, conflicts, unsupported markup)`);
    process.exit(hits.length ? 1 : 0);
  }
  const [exportDir, outDir] = args;
  const { summary } = migrateExport(exportDir, outDir, { exclude: exclude() });
  console.log(JSON.stringify(summary));
}
