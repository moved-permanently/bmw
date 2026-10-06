/* eslint-disable max-len */
/*
 * Verification of a migrated DA export against the original (tools/semantic-styles/migrate.mjs
 * verifyExport): per document the same implementation classes for every section and block, the
 * same text / links / media, idempotence and no remaining legacy names; tampering is reported.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  mkdtempSync, mkdirSync, writeFileSync, rmSync, readFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
// eslint-disable-next-line import/extensions
import { migrateExport, verifyExport } from '../../tools/semantic-styles/migrate.mjs';

const DOC = '<body><main><div><h2>Finden</h2><div class="disclaimer info spacing-bottom-4 spacing-top-4"><div><div><p>WLTP</p></div></div></div>'
  + '<div class="section-metadata"><div><div><p>style</p></div><div><p>spacing-top-16, spacing-bottom-16, content-6-center, content-lg-8-center, center</p></div></div></div></div>'
  + '<div><div class="hero-teaser middle cols-5 sub-top-8 cta-top-10 ratio-16-7"><div><div><a href="/de/x">x</a></div></div></div></div></main></body>';

function setup() {
  const root = mkdtempSync(join(tmpdir(), 'semantic-verify-'));
  const exp = join(root, 'export');
  mkdirSync(join(exp, 'source', 'de'), { recursive: true });
  writeFileSync(join(exp, 'source', 'de', 'home.html'), DOC);
  writeFileSync(join(exp, 'source', 'de', 'stale.html'), DOC);
  const out = join(root, 'out');
  migrateExport(exp, out, { exclude: { '/de/stale': 'preview stale' } });
  return { root, exp, out };
}

test('a correct migration verifies: same classes, same content, idempotent, no legacy names', () => {
  const { root, exp, out } = setup();
  try {
    const report = verifyExport(exp, out);
    assert.equal(report.ok, true, JSON.stringify(report.failures));
    assert.deepEqual(report.failures, []);
    assert.equal(report.verified, 1);
    assert.deepEqual(report.excluded, ['/de/stale']);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('changed text, changed classes and leftover legacy names are reported', () => {
  const { root, exp, out } = setup();
  try {
    const file = join(out, 'source', 'de', 'home.html');
    const migrated = readFileSync(file, 'utf8');
    writeFileSync(file, migrated.replace('Finden', 'Suchen').replace('text-width-five-twelfths', 'text-width-half').replace('space-tight-m', 'spacing-top-4 spacing-bottom-4'));
    const report = verifyExport(exp, out);
    assert.equal(report.ok, false);
    const kinds = report.failures.map((f) => f.kind).sort();
    assert.deepEqual(kinds, ['classes', 'content', 'legacy']);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
