import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

// Exercise the actual seeder without a model, DA credentials, or a network request.
test('all seeded news uses escaped WDH display strings, never data objects or doubled units', () => {
  const dir = mkdtempSync(join(tmpdir(), 'aida-news-'));
  const values = ['61HG', '31HR', '71FJ'].flatMap((code) => [
    { key: `${code}.electricRange`, value: '513–627', unit: 'km' },
    { key: `${code}.power`, value: '250 kW & <test>' },
    { key: `${code}.wltp`, value: 'WLTP: test statement & terms' },
  ]);
  writeFileSync(join(dir, 'wdh-de.json'), JSON.stringify({ values: { data: values }, models: { data: [] } }));
  try {
    const run = spawnSync(process.execPath, ['--input-type=module', '-e',
      "globalThis.fetch = async () => ({ text: async () => '<div><h1>Test i5</h1></div><div></div>' }); await import('./tools/aida/content/seed.mjs');",
      '--', '--no-translate'], { cwd: process.cwd(), env: { ...process.env, DA_TOKEN: '', WDH_SHEETS: dir }, encoding: 'utf8' });
    assert.equal(run.status, 0, run.stderr);
    ['bmw-i5-edrive40', 'bmw-ix3-50-xdrive', 'bmw-530e-sedan'].forEach((slug) => {
      const html = readFileSync(`tools/aida/content/out/aida/en/news/${slug}.html`, 'utf8');
      assert.doesNotMatch(html, /\[object Object\]/);
      assert.match(html, />513–627 km<\/a>/);
      assert.doesNotMatch(html, /km<\/a> km/);
      assert.match(html, /250 kW &amp; &lt;test&gt;/);
      assert.match(html, /WLTP: test statement &amp; terms/);
      assert.match(html, /NewsArticle/);
    });
  } finally {
    rmSync(dir, { recursive: true });
  }
});
