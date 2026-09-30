import test from 'node:test';
import assert from 'node:assert/strict';
import * as connectors from '../../tools/aida/showcase/connectors.js';
import { getMetadata } from '../../scripts/aida-doc.js';

test('mock WDH update synchronizes repeated stored HTML bindings and NewsArticle vehicle facts', () => {
  assert.equal(typeof connectors.mockFactUpdate, 'function');
  const result = connectors.mockFactUpdate({ values: { data: [{ key: '61HG.electricRange', value: '513–627', unit: 'km' }] } });
  assert.equal(result.simulated, true);
  assert.equal(result.changes.length, 2);
  assert.equal((result.html.match(/520–630 km/g) || []).length, 3);
  const ld = JSON.parse(getMetadata(result.html, 'json-ld'));
  assert.equal(ld['@type'], 'NewsArticle');
  assert.equal(ld.about.additionalProperty[0].value, '520–630 km');
  assert.match(result.markdown, /520–630 km/);
  assert.match(result.boundary, /not published/i);
});

test('connector substitute requires an actual loaded WDH source and never mutates it', () => {
  assert.equal(typeof connectors.mockFactUpdate, 'function');
  const sheet = { values: { data: [{ key: '61HG.electricRange', value: '513–627', unit: 'km' }] } };
  const before = structuredClone(sheet);
  connectors.mockFactUpdate(sheet);
  assert.deepEqual(sheet, before);
  assert.throws(() => connectors.mockFactUpdate({}), /source/i);
});
