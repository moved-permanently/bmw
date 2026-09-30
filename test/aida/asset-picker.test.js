import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  countryForContext, filterAssets, facetValues, cropRegion, scene7Url, assetLink,
} from '../../tools/aida/asset-picker/model.js';

const unsafeScript = ['javascript', 'alert(1)'].join(':');

const marketing = {
  id: 'i5-exterior',
  title: 'BMW i5 exterior',
  kind: 'marketing',
  url: 'https://bmw.scene7.com/is/image/BMW/g60-exterior:3to2?fit=constrain,1',
  brands: ['BMW'],
  families: ['5 Series'],
  models: ['i5'],
  countries: [],
  crops: { '3to2': 'https://bmw.scene7.com/is/image/BMW/g60-exterior:3to2?fit=constrain,1', '1to1': 'https://bmw.scene7.com/is/image/BMW/g60-exterior:1to1' },
};
const german = {
  ...marketing, id: 'german', title: 'German charging', countries: ['de'],
};
const french = {
  ...marketing, id: 'french', title: 'French charging', countries: ['fr'],
};
const cosy = {
  id: 'm5-render',
  title: 'BMW M5 vehicle render',
  kind: 'cosy',
  url: 'https://prod.cosy.bmw.cloud/bmwweb/cosySec?COSY-EU-100-a%25b',
  brands: ['BMW M'],
  families: ['5 Series'],
  models: ['M5'],
  countries: [],
  crops: {},
};
const assets = [marketing, german, french, cosy];

test('country follows the explicit document country, not WDH market fallback or language', () => {
  assert.equal(countryForContext({ path: '/aida/de/at/i5' }), 'at');
  assert.equal(countryForContext({ path: '/aida/fr/be/i5' }), 'be');
  assert.equal(countryForContext({ path: '/aida/fr/fr/i5.html' }), 'fr');
  assert.equal(countryForContext({ path: '/de/home' }), 'de');
  assert.equal(countryForContext({ path: '/de-de/news' }), 'de');
  assert.equal(countryForContext({ path: '/en-gb/news' }), 'gb');
  assert.equal(countryForContext({ path: '/aida/en/i5' }), '');
  assert.equal(countryForContext({ path: '/aida/de/i5' }), '');
  assert.equal(countryForContext({ path: '/aida/fr/i5' }), '');
  assert.equal(countryForContext({ path: '/unknown', country: 'FR' }), 'fr');
  assert.equal(countryForContext({ path: '/aida/de/de/i5', country: unsafeScript }), 'de');
  assert.equal(countryForContext({}), '');
});

test('country filtering includes unlocalized imagery but excludes other country tags', () => {
  assert.deepEqual(filterAssets(assets, { country: 'fr' }).map((a) => a.id), ['i5-exterior', 'french', 'm5-render']);
  assert.deepEqual(filterAssets(assets, { country: 'at' }).map((a) => a.id), ['i5-exterior', 'm5-render']);
  assert.equal(filterAssets(assets, {}).length, 4);
});

test('kind, brand, family, model and multiword search combine without mutating the catalogue', () => {
  assert.deepEqual(filterAssets(assets, {
    kind: 'cosy', brand: 'BMW M', family: '5 Series', model: 'M5', search: 'm5 render',
  }), [cosy]);
  assert.deepEqual(filterAssets(assets, { kind: 'marketing', model: 'M5' }), []);
  assert.deepEqual(filterAssets(assets, { search: 'I5 EXTERIOR' }), [marketing]);
  assert.equal(assets.length, 4);
});

test('facet options honor other filters without hiding the current facet alternatives', () => {
  assert.deepEqual(facetValues(assets, { kind: 'cosy' }, 'model'), ['M5']);
  assert.deepEqual(facetValues(assets, { brand: 'BMW', model: 'i5' }, 'brand'), ['BMW']);
  assert.deepEqual(facetValues(assets, { brand: 'BMW' }, 'brand'), ['BMW', 'BMW M']);
  assert.deepEqual(facetValues(assets, { country: 'at' }, 'family'), ['5 Series']);
});

test('normalized framing crops preserve aspect ratio with center or edge anchors', () => {
  assert.deepEqual(cropRegion(1600, 900, '1:1', 'center'), [0.21875, 0, 0.5625, 1]);
  assert.deepEqual(cropRegion(1600, 900, '1:1', 'left'), [0, 0, 0.5625, 1]);
  assert.deepEqual(cropRegion(900, 1600, '16:9', 'bottom'), [0, 0.68359375, 1, 0.31640625]);
  assert.equal(cropRegion(0, 0, '1:1'), null);
  assert.equal(cropRegion(1600, 900, 'broken'), null);
});

test('Scene7 named crops must be observed variants, not fabricated asset names', () => {
  const url = scene7Url(marketing, { crop: '1to1' });
  assert.equal(new URL(url).pathname, '/is/image/BMW/g60-exterior:1to1');
  assert.equal(new URL(url).searchParams.get('fit'), 'constrain,1');
  assert.throws(() => scene7Url(marketing, { crop: '9to7' }), /crop/i);
});

test('Scene7 framing and sharpening survive responsive sizing and preserve raw template parameters', () => {
  const template = { ...marketing, url: 'https://bmw.scene7.com/is/image/BMW/template?$image=BMW/car&$badge=BMW/logo&wid=500&fmt=png&op_sharpen=0' };
  const url = scene7Url(template, { region: [0.2, 0, 0.6, 1], sharpen: true, width: 960 });
  assert.ok(url.includes('$image=BMW/car&$badge=BMW/logo'));
  assert.ok(!url.includes('%24image'));
  assert.equal(new URL(url).searchParams.get('cropN'), '0.2,0,0.6,1');
  assert.equal(new URL(url).searchParams.get('op_sharpen'), '1');
  assert.equal(new URL(url).searchParams.get('wid'), '960');
  assert.equal(new URL(url).searchParams.get('fmt'), 'webp');
});

test('no Scene7 modifiers are added to COSY URLs', () => {
  assert.equal(scene7Url(cosy, { crop: '1to1', sharpen: true, width: 800 }), cosy.url);
});

test('Scene7 modifiers precede fragments and preserve literal template values', () => {
  const asset = { ...marketing, url: 'https://bmw.scene7.com/is/image/BMW/template?$image=BMW/car#source' };
  const result = scene7Url(asset, { sharpen: true, width: 960 });
  const url = new URL(result);
  assert.equal(url.hash, '#source');
  assert.equal(url.searchParams.get('op_sharpen'), '1');
  assert.equal(url.searchParams.get('wid'), '960');
  assert.equal(url.searchParams.get('fmt'), 'webp');
  assert.ok(result.includes('$image=BMW/car'));
});

test('Scene7 framing composes with existing crop bounds', () => {
  const asset = { ...marketing, url: 'https://bmw.scene7.com/is/image/BMW/car?cropN=0.1,0.2,0.8,0.5' };
  const result = scene7Url(asset, { region: [0.25, 0, 0.5, 1] });
  assert.equal(new URL(result).searchParams.get('cropN'), '0.3,0.2,0.4,0.5');
});

test('Scene7 options reject invalid widths, crop types and sharpen values', () => {
  assert.throws(() => scene7Url(marketing, { width: 'oops' }), /width/i);
  assert.throws(() => scene7Url(marketing, { width: Infinity }), /width/i);
  assert.throws(() => scene7Url(marketing, { region: 'oops' }), /crop region/i);
  assert.throws(() => scene7Url(marketing, { sharpen: 'false' }), /sharpen/i);
});

test('asset insertion keeps remote URLs as escaped image-carrier links and requires alt text', () => {
  assert.equal(assetLink(marketing, `${marketing.url}&op_sharpen=1`, 'Car <front> & "side"'), `<p><a href="${marketing.url.replace('&', '&amp;')}&amp;op_sharpen=1">Car &lt;front&gt; &amp; &quot;side&quot;</a></p>`);
  assert.equal(assetLink(cosy, cosy.url, '', true), `<p><a href="${cosy.url}">Image without alt text</a></p>`);
  assert.throws(() => assetLink(marketing, marketing.url, ''), /alt/i);
  assert.throws(() => assetLink(marketing, unsafeScript, 'Car'), /URL/i);
  assert.throws(() => assetLink(marketing, 'https://evil.example/image.jpg', 'Car'), /URL/i);
});
