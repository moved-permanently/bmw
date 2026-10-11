/* eslint-disable max-len, import/extensions */
/*
 * Compact per-model campaign media for the bmw-find-campaign-media skill
 * (tools/ew-native/campaign-media.mjs). The assistant cannot read the full Media Library index
 * (4 MB) or the full assets catalogue in one turn, so each model gets one small DA sheet.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { modelSlug, campaignMedia, toSheet } from '../../tools/ew-native/campaign-media.mjs';

const S7 = 'https://bmw.scene7.com/is';
const catalogue = [
  {
    url: `${S7}/image/BMW/i5-stage:16to7`, title: 'i5 stage', alt: 'BMW i5 Limousine vor einem Haus.', kind: 'marketing', models: ['i5'], families: ['5 Series'], sources: ['/de/neufahrzeuge/bmw-i/i5/bmw-i5-ueberblick'], crops: { '16to7': `${S7}/image/BMW/i5-stage:16to7`, '3to2': `${S7}/image/BMW/i5-stage:3to2` },
  },
  {
    url: `${S7}/image/BMW/i5-cosy-render`, title: 'i5 render', alt: '', kind: 'cosy', models: ['i5'], families: ['5 Series'], sources: [], crops: {},
  },
  {
    url: `${S7}/image/BMW/x5-stage`, title: 'X5 stage', alt: 'BMW X5.', kind: 'marketing', models: ['X5'], families: ['X5'], sources: ['/de/neufahrzeuge/x/x5/bmw-x5'], crops: {},
  },
];
const index = [
  // film on two i5 pages, not in the catalogue
  { url: `${S7}/content/BMW/P001_SL_G60_Ext_Dsk`, originalPath: '', type: 'video', doc: '/aida/showcase/de/de/i5.md' },
  { url: `${S7}/content/BMW/P001_SL_G60_Ext_Dsk`, originalPath: '', type: 'video', doc: '/aida/showcase/fr/be/i5.md' },
  // catalogue image used on a further page (preview-copy row, original in originalPath)
  { url: 'https://main--bmw--moved-permanently.aem.page/media_abc.webp', originalPath: '/BMW/i5-stage', type: 'image', doc: '/aida/de/de/i5.md' },
  // media on an X5 page
  { url: `${S7}/image/BMW/x5-detail`, originalPath: '', type: 'image', doc: '/de/neufahrzeuge/x/x5/bmw-x5.md' },
  // row without a page
  { url: `${S7}/image/BMW/orphan`, originalPath: '', type: 'image', doc: '' },
];

test('model slugs are lowercase path segments', () => {
  assert.equal(modelSlug('i5'), 'i5');
  assert.equal(modelSlug('5 Series Sedan'), '5-series-sedan');
  assert.equal(modelSlug('BMW ALPINA'), 'bmw-alpina');
});

test('a model collects its catalogue assets and the media used on its pages, with merged page usage', () => {
  const rows = campaignMedia(catalogue, index).i5;
  const byUrl = Object.fromEntries(rows.map((r) => [r.url, r]));
  assert.deepEqual(Object.keys(byUrl).sort(), [`${S7}/content/BMW/P001_SL_G60_Ext_Dsk`, `${S7}/image/BMW/i5-cosy-render`, `${S7}/image/BMW/i5-stage`]);
  const stage = byUrl[`${S7}/image/BMW/i5-stage`];
  assert.equal(stage.kind, 'image');
  assert.equal(stage.alt, 'BMW i5 Limousine vor einem Haus.');
  assert.equal(stage.crops, '16to7, 3to2');
  assert.equal(stage.pages, '/aida/de/de/i5, /de/neufahrzeuge/bmw-i/i5/bmw-i5-ueberblick');
  const film = byUrl[`${S7}/content/BMW/P001_SL_G60_Ext_Dsk`];
  assert.equal(film.kind, 'film');
  assert.equal(film.pages, '/aida/showcase/de/de/i5, /aida/showcase/fr/be/i5');
});

test('rows are ordered by usage and only use Scene7 originals', () => {
  const rows = campaignMedia(catalogue, index).i5;
  assert.deepEqual(rows.map((r) => r.uses), [2, 2, 0]);
  rows.forEach((r) => assert.match(r.url, /^https:\/\/bmw\.scene7\.com\/is\//));
});

test('models stay separate and are capped', () => {
  const media = campaignMedia(catalogue, index, { max: 1 });
  assert.deepEqual(media.x5.map((r) => r.url), [`${S7}/image/BMW/x5-stage`]);
  assert.ok(!campaignMedia(catalogue, index).i5.some((r) => r.url.includes('x5')));
  assert.ok(campaignMedia(catalogue, index).x5.some((r) => r.url.endsWith('x5-detail')));
});

test('DA sheet shape', () => {
  const sheet = toSheet(campaignMedia(catalogue, index).i5);
  assert.equal(sheet[':type'], 'sheet');
  assert.deepEqual(Object.keys(sheet.data[0]), ['kind', 'url', 'alt', 'crops', 'uses', 'pages']);
  assert.equal(sheet.total, 3);
});
