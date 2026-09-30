import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = (path) => readFile(new URL(`../../tools/aida/${path}`, import.meta.url), 'utf8');

['radar', 'asset-picker', 'preflight', 'wdh-picker'].forEach((tool) => {
  test(`${tool} loads shared Spectrum and declares medium/light theme`, async () => {
    const html = await read(`${tool}/${tool}.html`);
    assert.match(html, /href="\.\.\/spectrum\.css"/);
    assert.match(html, /<body class="spectrum spectrum--medium spectrum--light">/);
  });
});

test('asset controls use real Spectrum classes without replacing native form behavior', async () => {
  const html = await read('asset-picker/asset-picker.html');
  assert.match(html, /<input[^>]*id="asset-search"[^>]*class="[^"]*spectrum-Textfield-input/);
  assert.match(html, /<select[^>]*id="asset-country"[^>]*class="[^"]*spectrum-Picker/);
  assert.match(html, /<input[^>]*id="asset-decorative"[^>]*class="[^"]*spectrum-Checkbox-input/);
  assert.match(html, /<button[^>]*id="asset-insert"[^>]*class="[^"]*spectrum-Button/);
  assert.match(html, /spectrum-Checkbox-box/);
  const js = await read('asset-picker/asset-picker.js');
  assert.match(js, /spectrum-Card/);
  assert.match(js, /spectrum-Badge/);
});

test('runtime-generated preflight and WDH controls use Spectrum components', async () => {
  const preflight = await read('preflight/preflight.js');
  const picker = await read('wdh-picker/wdh-picker.js');
  assert.match(preflight, /spectrum-Button/);
  assert.match(preflight, /spectrum-Badge/);
  ['spectrum-Picker', 'spectrum-Button', 'spectrum-Table'].forEach((name) => assert.ok(picker.includes(name), name));
});

test('local layout styles do not redraw Spectrum inputs or buttons with custom branding', async () => {
  const shared = await read('aida-plugin.css');
  const picker = await read('asset-picker/asset-picker.css');
  assert.doesNotMatch(shared, /\.aida-plugin button\s*\{/);
  assert.doesNotMatch(picker, /\.asset-picker button\s*\{/);
  assert.doesNotMatch(picker, /\.asset-picker input\[type="search"\],/);
});

test('native radar has actionable navigation, a timestamp disclaimer and no HTML interpolation', async () => {
  const html = await read('radar/radar.html');
  const js = await read('radar/radar.js');
  assert.match(html, /href="\/tools\/aida\/showcase\/index\.html"/);
  assert.match(html, /href="https:\/\/da\.live\/apps\/loc#\/moved-permanently\/bmw"/);
  assert.match(html, /href="\/governance"/);
  assert.match(html, /href="\/tools\/aida\/showcase\/index\.html#workflow"/);
  assert.match(html, /timestamps[^<]*not[^<]*approval/i);
  assert.match(js, /No approval\/release evidence available/);
  assert.match(js, /spectrum-Table/);
  assert.doesNotMatch(js, /\.innerHTML\s*=/);
  assert.match(js, /window\.parent === window/);
  assert.match(js, /pageActions/);
});
