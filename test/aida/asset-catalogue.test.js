import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildCatalogue } from '../../tools/aida/content/asset-catalogue.mjs';

const page = {
  path: '/de/neufahrzeuge/bmw-i/i5/bmw-i5-ueberblick', model: 'i5', family: '5 Series', brand: 'BMW',
  html: '<h1>BMW i5</h1><p><a href="https://bmw.scene7.com/is/image/BMW/g60_exterior:3to2?wid=1600&amp;fmt=webp">Exterior</a></p>'
    + '<p><a href="https://bmw.scene7.com/is/image/BMW/g60_exterior:1to1?wid=750">Exterior</a></p>'
    + '<p><a href="https://bmw.scene7.com/is/image/BMW/g60_exterior:3to2?wid=750">Exterior</a></p>'
    + '<p><a href="https://bmw.scene7.com/is/image/BMW/g60_charging_de">Charging in Germany</a></p>'
    + '<p><a href="https://bmw.scene7.com/is/content/BMW/video-AVS.m3u8">Video</a></p>'
    + '<p><a href="https://prod.cosy.bmw.cloud/bmwweb/cosySec?COSY-EU-100-a%25b">BMW i5 eDrive40</a></p>'
    + '<p><a href="https://www.bmw.de/de/home">Home</a></p>',
};

test('catalogue extracts only supported public image providers and groups observed smart crops', () => {
  const catalogue = buildCatalogue([page]);
  assert.equal(catalogue.length, 3);
  const exterior = catalogue.find((a) => a.url.includes('g60_exterior'));
  assert.equal(exterior.kind, 'marketing');
  assert.deepEqual(Object.keys(exterior.crops).sort(), ['1to1', '3to2']);
  assert.ok(!exterior.url.includes('wid='));
  assert.deepEqual(exterior.models, ['i5']);
  assert.deepEqual(exterior.families, ['5 Series']);
  assert.deepEqual(exterior.brands, ['BMW']);
  assert.deepEqual(exterior.countries, []);
  assert.deepEqual(exterior.sources, [page.path]);
  assert.ok(exterior.id);
});

test('country tags come from explicit asset markers, not the language or source-page country', () => {
  const assets = buildCatalogue([page]);
  assert.deepEqual(assets.find((a) => a.url.includes('charging_de')).countries, ['de']);
  const english = buildCatalogue([{ ...page, html: '<a href="https://bmw.scene7.com/is/image/BMW/g60_charging_en">Charging</a>' }]);
  assert.deepEqual(english[0].countries, []);
});

test('COSY URLs and descriptive link text are preserved without Scene7 transforms', () => {
  const asset = buildCatalogue([page]).find((a) => a.kind === 'cosy');
  assert.equal(asset.url, 'https://prod.cosy.bmw.cloud/bmwweb/cosySec?COSY-EU-100-a%25b');
  assert.equal(asset.title, 'BMW i5 eDrive40');
  assert.deepEqual(asset.crops, {});
});

test('shared assets merge model associations and keep deterministic IDs without duplicating images', () => {
  const other = { ...page, path: '/de/neufahrzeuge/5er/5er-limousine', model: '5 Series Sedan' };
  const first = buildCatalogue([page, other]);
  const reversed = buildCatalogue([other, page]);
  assert.equal(first.length, 3);
  const exterior = first.find((a) => a.url.includes('g60_exterior'));
  assert.deepEqual(exterior.models.sort(), ['5 Series Sedan', 'i5']);
  assert.equal(exterior.id, reversed.find((a) => a.url.includes('g60_exterior')).id);
});

test('catalogue rejects lookalike hosts, unsafe URLs and empty markup', () => {
  assert.deepEqual(buildCatalogue([{ ...page, html: '<a href="https://bmw.scene7.com.evil.example/is/image/BMW/car">Car</a><img src="javascript:alert(1)">' }]), []);
  assert.deepEqual(buildCatalogue([{ ...page, html: '' }]), []);
});
