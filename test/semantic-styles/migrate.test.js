/* eslint-disable max-len */
/*
 * DA migration to the semantic style vocabulary (tools/semantic-styles/migrate.mjs): only section
 * metadata style cells and block class attributes change; every other byte, the text, the links and
 * the media stay identical; the migration is idempotent; collisions become explicit exceptions; the
 * manifest carries per-document checksums and rollback snapshots.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, rmSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
// eslint-disable-next-line import/extensions
import { migrateDocument, migrateExport, contentFingerprint } from '../../tools/semantic-styles/migrate.mjs';

const DOC = '<body>\n  <header></header>\n  <main><div><h1>Willkommen</h1>'
  + '<div class="hero-teaser bottom cols-10 cta-top-10 sub-top-5 gradient-oblique"><div><div><p><a href="https://bmw.scene7.com/is/image/BMW/x">BMW iX3</a></p></div></div></div>'
  + '<div class="disclaimer info spacing-top-5 spacing-bottom-5"><div><div><p>CO₂-Klasse: A</p></div></div></div>'
  + '<div class="section-metadata"><div><div><p>style</p></div><div><p>spacing-top-16, spacing-bottom-16, content-8-center, center</p></div></div>'
  + '<div><div><p>id</p></div><div><p>bottom</p></div></div></div></div>'
  + '<div><p>Text with spacing-top-16 inside a paragraph stays text.</p><img src="./media_1.png" alt="spacing-top-16">'
  + '<div class="section-metadata"><div><div>Style</div><div>grey, spacing-top-12</div></div></div></div>'
  + '<div><div class="accordion width-6 width-lg-8 width-md-12"><div><div>Q</div><div>A</div></div></div></div>'
  + '</main>\n  <footer></footer>\n</body>\n';

const MIGRATED = '<body>\n  <header></header>\n  <main><div><h1>Willkommen</h1>'
  + '<div class="hero-teaser bottom text-width-five-sixths cta-above-related-m subline-above-tight-l gradient-oblique"><div><div><p><a href="https://bmw.scene7.com/is/image/BMW/x">BMW iX3</a></p></div></div></div>'
  + '<div class="disclaimer info space-tight-l"><div><div><p>CO₂-Klasse: A</p></div></div></div>'
  + '<div class="section-metadata"><div><div><p>style</p></div><div><p>space-regular, content-two-thirds-centered, center</p></div></div>'
  + '<div><div><p>id</p></div><div><p>bottom</p></div></div></div></div>'
  + '<div><p>Text with spacing-top-16 inside a paragraph stays text.</p><img src="./media_1.png" alt="spacing-top-16">'
  + '<div class="section-metadata"><div><div>Style</div><div>background-secondary, space-above-related-l</div></div></div></div>'
  + '<div><div class="accordion width-half width-large-two-thirds width-medium-full"><div><div>Q</div><div>A</div></div></div></div>'
  + '</main>\n  <footer></footer>\n</body>\n';

test('only style cells and block classes change, byte for byte', () => {
  const result = migrateDocument(DOC);
  assert.equal(result.html, MIGRATED);
  assert.equal(result.changed, true);
  assert.deepEqual(result.exceptions, []);
  assert.equal(result.changes.length, 5);
});

test('text, links and media are unchanged', () => {
  assert.deepEqual(contentFingerprint(migrateDocument(DOC).html), contentFingerprint(DOC));
});

test('the migration is idempotent', () => {
  const again = migrateDocument(MIGRATED);
  assert.equal(again.html, MIGRATED);
  assert.equal(again.changed, false);
  assert.deepEqual(again.changes, []);
});

test('collisions are reported and the element is left unchanged', () => {
  const doc = '<body><main><div><div class="carousel spacing-top-16 space-above-related-l"><div><div>x</div></div></div>'
    + '<div class="section-metadata"><div><div>style</div><div>spacing-top-16, space-above-related-l</div></div></div></div></main></body>';
  const result = migrateDocument(doc);
  assert.equal(result.html, doc);
  assert.equal(result.changed, false);
  assert.equal(result.exceptions.length, 2);
});

test('nav/footer-like documents without styles are untouched', () => {
  const doc = '<body><main><div><ul><li><a href="/de/home">Home</a></li></ul></div></main></body>';
  assert.deepEqual(migrateDocument(doc), {
    html: doc, changed: false, changes: [], exceptions: [],
  });
});

test('export migration writes migrated sources, rollback snapshots, checksums and honours exclusions', () => {
  const root = mkdtempSync(join(tmpdir(), 'semantic-migrate-'));
  try {
    const exp = join(root, 'export');
    mkdirSync(join(exp, 'source', 'de'), { recursive: true });
    writeFileSync(join(exp, 'source', 'de', 'home.html'), DOC);
    writeFileSync(join(exp, 'source', 'de', 'skip.html'), DOC);
    writeFileSync(join(exp, 'source', 'nav.html'), '<body><main><div><p>nav</p></div></main></body>');
    const out = join(root, 'out');
    const manifest = migrateExport(exp, out, { exclude: { '/de/skip': 'not previewed' } });
    const sha = (s) => createHash('sha256').update(s).digest('hex');
    const home = manifest.documents.find((d) => d.path === '/de/home');
    assert.equal(home.changed, true);
    assert.equal(home.before, sha(DOC));
    assert.equal(home.after, sha(MIGRATED));
    assert.equal(readFileSync(join(out, 'source', 'de', 'home.html'), 'utf8'), MIGRATED, 'migrated sources form a new export');
    assert.equal(readFileSync(join(out, 'rollback', 'de', 'home.html'), 'utf8'), DOC);
    assert.ok(existsSync(join(out, 'diff', 'de', 'home.diff')));
    assert.deepEqual(manifest.documents.find((d) => d.path === '/de/skip'), { path: '/de/skip', excluded: 'not previewed', before: sha(DOC) });
    assert.equal(manifest.documents.find((d) => d.path === '/nav').changed, false);
    assert.equal(manifest.summary.changed, 1);
    assert.equal(manifest.summary.excluded, 1);
    const second = migrateExport(out, join(root, 'out2'), { exclude: {} });
    assert.equal(second.summary.changed, 0, 'running on migrated sources changes nothing');
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
