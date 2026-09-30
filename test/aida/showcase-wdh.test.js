import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as wdh from '../../scripts/aida-wdh.js';

test('showcase paths resolve explicit market context without silently losing the prefix', () => {
  assert.equal(wdh.marketForPath('/aida/showcase/fr/be/i5')?.market, 'fr');
  assert.equal(wdh.marketForPath('/aida/showcase/fr/be/i5')?.locale, 'be');
  assert.equal(wdh.marketForPath('/aida/showcase/de/at/i5')?.market, 'de');
  assert.equal(wdh.marketForPath('/aida/showcase/en/i5')?.lang, 'en');
});

test('synchronization preserves the showcase connector namespace when correcting values and markets', () => {
  const values = wdh.valuesFromSheet({ values: [{ key: '61HG.electricRange', value: '518–627', unit: 'km' }] });
  const html = '<a href="/aida/showcase/data/wdh-de.json#61HG.electricRange">513–627 km</a>';
  assert.equal(wdh.syncBindings(html, 'fr', values).html, '<a href="/aida/showcase/data/wdh-fr.json#61HG.electricRange">518–627 km</a>');
});

test('preflight and WDH picker use the matching connector data root for the current document', () => {
  assert.equal(typeof wdh.dataRootForPath, 'function');
  assert.equal(wdh.dataRootForPath('/aida/showcase/fr/be/i5'), '/aida/showcase/data');
  assert.equal(wdh.dataRootForPath('/aida/fr/be/i5'), '/aida/data');
  ['preflight/preflight.js', 'wdh-picker/wdh-picker.js'].forEach((path) => {
    const source = readFileSync(new URL(`../../tools/aida/${path}`, import.meta.url), 'utf8');
    assert.match(source, /dataRootForPath/);
  });
});
