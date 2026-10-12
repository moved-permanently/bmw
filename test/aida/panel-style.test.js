import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(`../../tools/aida/${path}`, import.meta.url), 'utf8');
const PANELS = ['wdh-picker', 'asset-picker', 'icon-picker', 'offer-picker', 'preflight'];

PANELS.forEach((tool) => {
  test(`${tool} uses the shared Experience Workspace panel styling`, () => {
    const html = read(`${tool}/${tool}.html`);
    const links = [...html.matchAll(/<link rel="stylesheet" href="([^"]+)">/g)].map((m) => m[1]);
    assert.deepEqual(links.slice(0, 4), [
      'https://da.live/nx2/styles/styles.css', '../spectrum.css', '../aida-plugin.css', '../aida-panel.css',
    ], 'DA tokens first, panel layer after the Spectrum base');
    assert.match(html, /<main class="[^"]*\baida-panel\b/);
  });
});

test('panel layer takes its colours, spacing and type from the DA S2 tokens', () => {
  const css = read('aida-panel.css');
  assert.doesNotMatch(css, /#[0-9a-f]{3,6}\b|rgb\(/i, 'no hard-coded colours');
  assert.doesNotMatch(css, /--spectrum-/, 'no Spectrum 1 tokens');
  assert.match(css, /font-family:\s*var\(--s2-font-family\)/);
  assert.match(css, /\.aida-panel h1\s*\{[^}]*font-size:\s*var\(--s2-component-l-bold-font-size\)/);
  assert.match(css, /height:\s*32px/, 'controls follow the 32px EW field height');
});

test('plugin-specific styles use DA tokens instead of Spectrum 1 colours', () => {
  ['wdh-picker', 'asset-picker', 'icon-picker', 'offer-picker', 'preflight'].forEach((tool) => {
    const css = read(`${tool}/${tool}.css`);
    assert.doesNotMatch(css, /--spectrum-(gray|neutral|corner|font-size|negative|focus)/, tool);
  });
});

test('WDH table fits a 400px panel without fixed column widths', () => {
  const css = read('wdh-picker/wdh-picker.css');
  assert.doesNotMatch(css, /min-width:\s*(140|180|360)px/);
});

test('icon picker drops the insertion explainer', () => {
  assert.doesNotMatch(read('icon-picker/icon-picker.html'), /Inserts the icon name between colons/);
});
