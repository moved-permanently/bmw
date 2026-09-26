#!/usr/bin/env node
/*
 * Generates tools/workers/redirects/redirects.csv (columns Source,Destination) for the EDS
 * `redirects` sheet of the bmw.de replica, plus redirects.json (same rows in DA sheet format).
 *
 * Usage (from the repo root):
 *   node tools/workers/redirects/generate-redirects.mjs [--check-content]
 *
 * Inputs
 *   migration-work/crawl.json     live crawl of www.bmw.de ({pages: {url: {s, final, err, ...}}})
 *   migration-work/urls-all.txt   migration scope (pages imported into EDS)
 *   content/                      (optional, --check-content) imported documents, used to warn
 *                                 about redirect destinations that are not imported (yet)
 *
 * Rows
 *   1. legacy pages that redirected on www.bmw.de (url !== final)  -> EDS path of the final page
 *      (+ the extensionless / sanitised form of the legacy path)
 *   2. every migrated page with its original .html path           -> extensionless EDS path
 *      (+ the original extensionless path if it differs by case / "_")
 *   3. entry points: /, /index.html, /de, /de/, /de.html, /de/index      -> /de/home
 *
 * EDS path rules (same as tools/importer/import-bmw-content-page.js + helix-importer sanitizePath):
 *   strip ".html", /de/index -> /de/home, every segment lowercased, [^a-z0-9]+ -> "-".
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..', '..', '..');
const OUT = join(HERE, 'redirects.csv');
const OUT_JSON = join(HERE, 'redirects.json');
const ORIGIN = 'https://www.bmw.de';
const HOME = '/de/home';

const sanitizeSegment = (s) => decodeURIComponent(s).toLowerCase()
  .normalize('NFD')
  .replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '');

/** www.bmw.de pathname -> EDS document path */
export function edsPath(pathname) {
  let p = pathname.replace(/\/+$/, '');
  while (/\.html?$/i.test(p)) p = p.replace(/\.html?$/i, '');
  p = p.split('/').filter(Boolean).map(sanitizeSegment).join('/');
  p = `/${p}`;
  if (p === '/de/index' || p === '/de' || p === '/' || p === '/index') return HOME;
  return p;
}

function csvCell(v) {
  return /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
}

export function buildRedirects({ crawl, scope, imported = null }) {
  const rows = new Map();
  const notes = [];
  const add = (source, destination, why) => {
    if (!source || source === destination) return;
    if (rows.has(source) && rows.get(source).destination !== destination) {
      notes.push(`conflict for ${source}: ${rows.get(source).destination} vs ${destination} (kept first)`);
      return;
    }
    if (!rows.has(source)) rows.set(source, { source, destination, why });
  };

  const scopePaths = new Set(scope.map((u) => edsPath(new URL(u).pathname)));
  const target = (finalUrl) => {
    const u = new URL(finalUrl);
    const p = edsPath(u.pathname);
    return u.origin === ORIGIN && scopePaths.has(p) ? p : finalUrl;
  };

  // 1. legacy redirects observed in the crawl
  Object.entries(crawl.pages).forEach(([url, page]) => {
    if (!page || page.s !== 200 || page.err || page.blocked) return;
    if (!page.final || page.final === url) return;
    const src = new URL(url).pathname;
    const dest = target(page.final);
    if (scopePaths.has(edsPath(src))) {
      notes.push(`legacy ${src} is itself a migrated page -> no redirect`);
      return;
    }
    add(src, dest, 'legacy');
    add(edsPath(src), dest, 'legacy (extensionless)');
    if (!scopePaths.has(dest) && dest.startsWith('/')) notes.push(`legacy target ${dest} not in scope`);
  });

  // 2. .html -> extensionless for every migrated page
  scope.forEach((url) => {
    const src = new URL(url).pathname;
    const dest = edsPath(src);
    add(src, dest, 'html');
    const bare = src.replace(/(\.html?)+$/i, '');
    if (bare !== dest && edsPath(bare) === dest) add(bare, dest, 'case/underscore');
  });

  // 3. entry points
  ['/', '/index.html', '/de', '/de/', '/de.html', '/de/index', '/de/index.html'].forEach((s) => add(s, HOME, 'entry'));

  // a redirect source must never shadow a migrated page
  [...rows.keys()].forEach((s) => {
    if (scopePaths.has(s)) {
      notes.push(`dropped ${s}: would hide a migrated page`);
      rows.delete(s);
    }
  });

  if (imported) {
    const missing = [...new Set([...rows.values()].map((r) => r.destination))]
      .filter((d) => d.startsWith('/') && !imported.has(d));
    if (missing.length) notes.push(`destinations not imported (yet): ${missing.join(', ')}`);
  }

  const list = [...rows.values()].sort((a, b) => (a.source < b.source ? -1 : 1));
  return { list, notes };
}

export function toCsv(list) {
  return `Source,Destination\n${list.map((r) => `${csvCell(r.source)},${csvCell(r.destination)}`).join('\n')}\n`;
}

/** DA (da.live) single-sheet JSON, uploadable via POST https://admin.da.live/source/{org}/{site}/redirects.json */
export function toDaSheet(list) {
  const data = list.map((r) => ({ Source: r.source, Destination: r.destination }));
  return {
    total: data.length, limit: data.length, offset: 0, data, ':type': 'sheet',
  };
}

async function main() {
  const crawl = JSON.parse(readFileSync(join(ROOT, 'migration-work', 'crawl.json'), 'utf8'));
  const scope = readFileSync(join(ROOT, 'migration-work', 'urls-all.txt'), 'utf8')
    .split('\n').map((l) => l.trim()).filter((l) => l.startsWith('http'));
  let imported = null;
  if (process.argv.includes('--check-content') && existsSync(join(ROOT, 'content'))) {
    const { readdirSync, statSync } = await import('node:fs');
    imported = new Set();
    const walk = (d, rel) => readdirSync(d).forEach((f) => {
      const abs = join(d, f);
      if (statSync(abs).isDirectory()) walk(abs, `${rel}/${f}`);
      else if (f.endsWith('.plain.html')) imported.add(`${rel}/${f.replace(/\.plain\.html$/, '')}`);
    });
    walk(join(ROOT, 'content'), '');
  }
  const { list, notes } = buildRedirects({ crawl, scope, imported });
  writeFileSync(OUT, toCsv(list));
  writeFileSync(OUT_JSON, `${JSON.stringify(toDaSheet(list), null, 1)}\n`);
  const by = list.reduce((a, r) => ({ ...a, [r.why]: (a[r.why] || 0) + 1 }), {});
  console.log(`wrote ${OUT}: ${list.length} rows`, by);
  notes.forEach((n) => console.log(`note: ${n}`));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main();
}
