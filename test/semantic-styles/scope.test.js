/* eslint-disable max-len, no-restricted-syntax */
/*
 * Guards over the full promised scope: every block README and metadata.json (all text, not just an
 * "Options" heading), the AIDA generators and the style guide's attribution of names.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { findDeprecated } from '../../scripts/bmw-style-names.js';

const ROOT = new URL('../../', import.meta.url).pathname;
const read = (p) => readFileSync(join(ROOT, p), 'utf8');
const words = (text) => [...text.matchAll(/[a-z][a-z0-9]*(?:-[a-z0-9]+)+/g)].map((m) => m[0]);
const strings = (value) => (typeof value === 'string' ? [value] : Object.values(value || {}).flatMap(strings));

test('no block README or metadata.json (any text) names a legacy utility of that block or of sections', () => {
  readdirSync(join(ROOT, 'blocks')).forEach((block) => {
    const readme = join('blocks', block, 'README.md');
    const meta = join('blocks', block, 'metadata.json');
    const texts = [];
    if (existsSync(join(ROOT, readme))) texts.push([readme, read(readme)]);
    if (existsSync(join(ROOT, meta))) texts.push([meta, strings(JSON.parse(read(meta))).join('\n')]);
    texts.forEach(([file, text]) => {
      const tokens = words(text.replace(/-N\b/g, '-1').replace(/-W-H\b/g, '-16-9').replace(/-A-B(?:-C)?\b/g, '-6-6'));
      assert.deepEqual([...new Set([...findDeprecated(tokens, block), ...findDeprecated(tokens.filter((t) => /^(spacing|content)-/.test(t)))])], [], file);
    });
  });
});

test('the layout blocks document their semantic layout names', () => {
  const expected = {
    columns: ['layout-wide-narrow', 'layout-medium-', 'image-', 'inset-second-start'],
    carousel: ['slides-triples', 'slides-small-'],
    'icon-teaser': ['items-small-', 'offsets-', 'span-medium-'],
    'model-offer': ['slides-three'],
    'text-media-teaser': ['widths-equal', 'media-wider', 'text-wider'],
  };
  Object.entries(expected).forEach(([block, names]) => {
    const docs = ['README.md', 'metadata.json'].map((f) => join('blocks', block, f)).filter((f) => existsSync(join(ROOT, f))).map(read).join('\n');
    names.forEach((name) => assert.ok(docs.includes(name), `${block} documents ${name}`));
  });
});

test('AIDA generators write no legacy style names', () => {
  const sources = ['tools/aida/showcase/content.mjs', 'tools/aida/content/seed.mjs'];
  sources.forEach((file) => {
    const text = read(file);
    const classes = [...text.matchAll(/(?:block\(\s*['`]|class=\\?["'])([a-z][a-z0-9 -]*)/g)].map((m) => m[1].trim().split(/\s+/));
    classes.forEach(([block, ...options]) => assert.deepEqual(findDeprecated(options, block), [], `${file}: ${block} ${options.join(' ')}`));
    const styles = [...text.matchAll(/'((?:spacing|content|space)-[a-z0-9, -]+)'/g)].map((m) => m[1].split(',').map((s) => s.trim()));
    styles.forEach((list) => assert.deepEqual(findDeprecated(list), [], `${file}: ${list.join(', ')}`));
  });
});

function codeFiles() {
  const files = [];
  const walk = (dir) => readdirSync(join(ROOT, dir), { withFileTypes: true }).forEach((e) => {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.(css|js)$/.test(e.name) && p !== join('scripts', 'bmw-style-names.js') && p !== join('scripts', 'aem.js')) files.push(p);
  });
  ['styles', 'blocks', 'scripts'].forEach(walk);
  return files;
}

test('layout names have no CSS or JS of their own (styling only via the implementation options)', () => {
  const layout = /(?:^|[^a-z0-9-])(?:layout-(?:halves|thirds|quarters|wide-narrow|narrow-wide|medium-[a-z-]+|(?:half|third|quarter|sixth|full)[a-z-]*)|slides-(?:single|pairs|triples|quads|three|small-[a-z-]+)(?:-from-large)?|items-small-[a-z-]+|offsets-(?:none|twelfth|sixth|quarter|third|half)[a-z-]*|span-medium-[a-z-]+|inset-(?:first|second|third|fourth|fifth|sixth)-[a-z]+|image-[a-z-]+-medium-[a-z-]+|widths-equal|media-wider|text-wider)(?![a-z0-9-])/;
  codeFiles().forEach((f) => {
    const hits = read(f).split('\n').filter((line) => (/\.[a-z]/.test(line) || /classList|className|querySelector/.test(line)) && layout.test(line));
    assert.deepEqual(hits, [], f);
  });
});

test('spacing classes are consumed by CSS only (their order is not behaviour), so verification may compare them as a set', () => {
  codeFiles().filter((f) => f.endsWith('.js')).forEach((f) => {
    const hits = read(f).split('\n').filter((line) => /spacing-(?:top|bottom)/.test(line) && !/^\s*(?:\*|\/\/)/.test(line));
    assert.deepEqual(hits, [], f);
  });
});

test('style guide: background names are project-defined aliases derived from BMW styles, not BMW vocabulary', () => {
  const doc = read('docs/authoring/section-and-block-styles.md');
  const row = doc.split('\n').find((line) => line.includes('`background-secondary`') && line.startsWith('|'));
  assert.ok(row, 'origin table row for the background names');
  assert.match(row, /project-defined alias/i);
  assert.match(row, /derived from/i);
  assert.match(doc, /style-container--background\b/, 'documents what the importer actually derives grey from');
  assert.doesNotMatch(row, /\*\*BMW\*\*/);
});
