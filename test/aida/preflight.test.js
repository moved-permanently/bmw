import { test } from 'node:test';
import assert from 'node:assert/strict';
import { runChecks } from '../../tools/aida/preflight/checks.js';
import { valuesFromSheet } from '../../scripts/aida-wdh.js';

const WLTP_FR = 'BMW i5 eDrive40 Berline : consommation d’énergie combinée : 14,7–17,8 kWh/100 km (WLTP)';
const values = valuesFromSheet({
  values: [
    { key: '61HG.electricRange', value: '518–627', unit: 'km' },
    { key: '61HG.power', value: '250 kW (340 ch)', unit: '' },
    { key: '61HG.wltp', value: WLTP_FR, unit: '' },
  ],
});
const features = [
  {
    feature: 'Highway Assistant', terms: 'BMW Highway Assistant, Autobahnassistent', de: 'yes', fr: 'no',
  },
  {
    feature: 'Parking Assistant', terms: 'Parking Assistant', de: 'yes', fr: 'yes',
  },
];
const terms = [{ term: 'xDrive', variants: 'XDrive, x-Drive' }, { term: 'BMW i5', variants: 'BMW I5' }];

const page = (body, meta = '<div><div>Title</div><div>BMW i5 Berline</div></div><div><div>Description</div><div>La BMW i5 Berline 100 % électrique : autonomie, recharge et équipements en un coup d’œil.</div></div>') => `<body><main><div>${body}<div class="metadata">${meta}</div></div></main></body>`;
const run = (html) => runChecks({
  html, market: 'fr', values, features, terms,
});
const check = (results, id) => results.find((r) => r.id === id);

const GOOD = page('<h1>La BMW i5.</h1>'
  + '<p>Autonomie <a href="/aida/data/wdh-fr.json#61HG.electricRange">518–627 km</a>.</p>'
  + `<div class="disclaimer"><div><div><a href="/aida/data/wdh-fr.json#61HG.wltp">${WLTP_FR}</a></div></div></div>`);

test('a clean page passes every check', () => {
  const results = run(GOOD);
  assert.deepEqual(results.map((r) => [r.id, r.status]), [
    ['wdh', 'pass'], ['wltp', 'pass'], ['features', 'pass'], ['brand', 'pass'], ['seo', 'pass'],
  ]);
});

test('wdh fails on outdated and foreign-market values and offers a sync', () => {
  const results = run(page('<h1>X</h1><p><a href="/aida/data/wdh-de.json#61HG.electricRange">513–627 km</a> '
    + '<a href="/aida/data/wdh-fr.json#61HG.power">250 kW (340 PS)</a></p>'
    + `<p><a href="/aida/data/wdh-fr.json#61HG.wltp">${WLTP_FR}</a></p>`));
  const wdh = check(results, 'wdh');
  assert.equal(wdh.status, 'fail');
  assert.equal(wdh.fixable, 2);
  assert.equal(wdh.details.length, 2);
});

test('wdh warns about hard-coded values that could be bound', () => {
  const results = runChecks({
    html: page('<h1>X</h1><p>Autonomie 518–627 km.</p>', '<div><div>WDH Model</div><div>61HG</div></div>'),
    market: 'fr',
    values,
    features,
    terms,
  });
  assert.equal(check(results, 'wdh').status, 'warn');
});

test('wltp fails when range or consumption is shown without the statement', () => {
  const results = run(page('<h1>X</h1><p>Autonomie <a href="/aida/data/wdh-fr.json#61HG.electricRange">518–627 km</a>.</p>'));
  assert.equal(check(results, 'wltp').status, 'fail');
});

test('features fails when an unavailable feature is mentioned in this market', () => {
  const results = run(page('<h1>X</h1><p>Avec le BMW Highway Assistant et le Parking Assistant.</p>'));
  const f = check(results, 'features');
  assert.equal(f.status, 'fail');
  assert.equal(f.details.length, 1);
  assert.match(f.details[0], /Highway Assistant/);
});

test('brand warns about misspelled brand terms', () => {
  const results = run(page('<h1>X</h1><p>La BMW I5 avec XDrive.</p>'));
  const brand = check(results, 'brand');
  assert.equal(brand.status, 'warn');
  assert.equal(brand.details.length, 2);
});

test('seo checks title, description and a single h1', () => {
  const results = run(page('<h1>A</h1><h1>B</h1>', '<div><div>Title</div><div>T</div></div>'));
  const seo = check(results, 'seo');
  assert.equal(seo.status, 'warn');
  assert.equal(seo.details.length, 2);
});
