/* eslint-disable max-len, import/extensions */
/*
 * Native DA Structured Content for two narrow BMW demo schemas (tools/ew-native/structured.mjs)
 * and their consuming blocks (scripts/structured-content.js, blocks/news, blocks/market-offer,
 * blocks/da-form). Schema rules follow adobe/da-sc-sdk docs/schema-spec.md (v0.5.0); the record
 * fixture is the SDK's own convertJsonToHtml output, i.e. what the form editor saves.
 * WDH stays the source of truth: offers reference a model and the fields to show, never values.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import {
  SCHEMAS, RECORDS, schemaDocument, editorRoutes, FOLDERS,
} from '../../tools/ew-native/structured.mjs';
import { readRecord, offerFacts } from '../../scripts/structured-content.js';
import { valuesFromSheet } from '../../scripts/aida-wdh.js';

const ROOT = new URL('../../', import.meta.url);
const WDH_FIELDS = ['acceleration', 'batteryCapacity', 'co2', 'co2Class', 'dcCharge10to80', 'electricConsumption', 'electricRange', 'fromPrice', 'fuelConsumption', 'leasePrice', 'power', 'topSpeed', 'wltp'];

function nodes(schema, path = '$') {
  const out = [[path, schema]];
  Object.entries(schema.properties || {}).forEach(([k, v]) => out.push(...nodes(v, `${path}.${k}`)));
  if (schema.items) out.push(...nodes(schema.items, `${path}[]`));
  return out;
}

test('two narrow schemas: news and market offer, valid against the DA schema spec subset', () => {
  assert.deepEqual(Object.keys(SCHEMAS), ['news', 'market-offer']);
  Object.entries(SCHEMAS).forEach(([id, schema]) => {
    assert.equal(schema.type, 'object', id);
    nodes(schema).forEach(([path, node]) => {
      assert.ok(['string', 'number', 'integer', 'boolean', 'object', 'array'].includes(node.type), `${id} ${path} type`);
      assert.ok(typeof node.title === 'string' && node.title, `${id} ${path} title`);
      if (node.enum) assert.equal(node.type, 'string', `${id} ${path}: enum only on strings`);
    });
    Object.keys(schema.properties).forEach((k) => {
      assert.match(k, /^[A-Za-z][A-Za-z0-9-]*$/);
      assert.ok(!['metadata', 'section-metadata'].includes(k), `${k} is reserved`);
    });
    (schema.required || []).forEach((k) => assert.ok(schema.properties[k], `${id} requires ${k}`));
    const text = JSON.stringify(schema);
    assert.doesNotMatch(text, /[<&]/, `${id}: the schema editor stores the JSON unescaped in HTML`);
    assert.ok(!/oneOf|anyOf|allOf|\$ref/.test(text), `${id}: keep the schema editable`);
  });
});

test('no second technical-data store: offers reference a WDH model and field names, never values', () => {
  const offer = SCHEMAS['market-offer'];
  Object.keys(offer.properties).forEach((k) => assert.ok(!WDH_FIELDS.includes(k), `${k} would duplicate WDH`));
  nodes(offer).forEach(([path, node]) => assert.ok(!['number', 'integer'].includes(node.type), `${path}: no numeric data`));
  assert.ok(offer.properties.modelCode.enum.length >= 1);
  assert.ok(offer.properties.wdhFields.items.enum.every((f) => WDH_FIELDS.includes(f)));
  assert.deepEqual(offer.properties.market.enum, ['de', 'fr']);
});

test('schema documents use the Schema Editor storage format', () => {
  const html = schemaDocument(SCHEMAS.news);
  assert.equal(html, `<body><header></header><main><div><pre><code>${JSON.stringify(SCHEMAS.news, null, 2)}</code></pre></div></main><footer></footer></body>`);
});

test('editor routing only for the task-owned demo folders (distinct, no prefix of another path)', () => {
  assert.deepEqual(FOLDERS, ['/aida/structured/news', '/aida/structured/offers']);
  assert.deepEqual(editorRoutes(), [
    { key: 'editor.path', value: '/moved-permanently/bmw/aida/structured/news=https://da.live/form#' },
    { key: 'editor.path', value: '/moved-permanently/bmw/aida/structured/offers=https://da.live/form#' },
  ]);
});

test('sample records are real, schema-conform demo content in the task folders', () => {
  assert.ok(RECORDS.length >= 3);
  RECORDS.forEach((r) => {
    assert.ok(FOLDERS.some((f) => r.path.startsWith(`${f}/`)), r.path);
    const schema = SCHEMAS[r.json.metadata.schemaName];
    assert.ok(schema, r.path);
    (schema.required || []).forEach((k) => assert.ok(r.json.data[k], `${r.path}: ${k}`));
    Object.keys(r.json.data).forEach((k) => assert.ok(schema.properties[k], `${r.path}: unknown field ${k}`));
    Object.entries(r.json.data).forEach(([k, v]) => {
      const p = schema.properties[k];
      if (p.enum) assert.ok(p.enum.includes(v), `${r.path}: ${k}`);
      if (p.items?.enum) v.forEach((x) => assert.ok(p.items.enum.includes(x), `${r.path}: ${k} ${x}`));
      if (p.pattern) assert.match(v, new RegExp(p.pattern), `${r.path}: ${k}`);
      if (p.format === 'date') assert.match(v, /^\d{4}-\d{2}-\d{2}$/);
    });
  });
});

/** Rows of a record block in the saved (SDK) format: [{label, text, items}]. */
function rows(html, block) {
  const inner = html.split(`<div class="${block}">`)[1].split('</div></div></main>')[0];
  return [...inner.matchAll(/<div><div><h3>([^<]*)<\/h3><\/div><div>(.*?)<\/div><\/div>/g)].map(([, label, value]) => ({
    label,
    text: value.replace(/<[^>]+>/g, ''),
    items: [...value.matchAll(/<li>([^<]*)<\/li>/g)].map((m) => m[1]),
  }));
}

test('the consuming block reads a record exactly as the form editor saves it', () => {
  const html = readFileSync(new URL('test/ew-native/fixtures/market-offer-record.html', ROOT), 'utf8');
  assert.deepEqual(readRecord(rows(html, 'market-offer')), {
    headline: 'The new BMW i5. Now at your BMW partner.',
    claim: '100% electric. Book a test drive today.',
    market: 'de',
    modelCode: '61HG',
    wdhFields: ['electricRange', 'electricConsumption', 'fromPrice'],
    image: 'https://bmw.scene7.com/is/image/BMW/P001_SL_G60-8135_Ext_Dsk_v001',
    imageAlt: 'BMW i5 exterior',
    validFrom: '2026-10-01',
    ctaLabel: 'Book a test drive',
    ctaUrl: 'https://www.bmw.de/faas/form/de-de/bmw/tda/test-drive-request.html',
  });
});

test('offer facts come from the WDH market sheet; missing models / fields are reported, not invented', () => {
  const sheet = {
    values: {
      data: [
        { key: '61HG.electricRange', value: '518–627', unit: 'km' },
        { key: '61HG.fromPrice', value: '73 900', unit: '€' },
        { key: '61HG.wltp', value: 'BMW i5 eDrive40 : consommation électrique combinée : 17,9 kWh/100 km (WLTP)', unit: '' },
      ],
    },
  };
  const values = valuesFromSheet(sheet, 'fr');
  const facts = offerFacts({ modelCode: '61HG', wdhFields: ['electricRange', 'fromPrice', 'acceleration'] }, values);
  assert.deepEqual(facts.values.map((f) => [f.key, f.display]), [['61HG.electricRange', '518–627 km'], ['61HG.fromPrice', '73 900 €']]);
  assert.equal(facts.values[0].label, 'Autonomie maximale (WLTP)');
  assert.deepEqual(facts.missing, ['61HG.acceleration']);
  assert.equal(facts.wltp.display, sheet.values.data[2].value);
  const none = offerFacts({ modelCode: '31HR', wdhFields: ['electricRange'] }, values);
  assert.deepEqual(none.values, []);
  assert.equal(none.modelAvailable, false);
});

test('blocks for the schemas exist (record pages load their schema block and the hidden da-form block)', () => {
  ['news/news.js', 'news/news.css', 'market-offer/market-offer.js', 'market-offer/market-offer.css', 'da-form/da-form.js', 'da-form/da-form.css'].forEach((f) => {
    assert.ok(existsSync(new URL(`blocks/${f}`, ROOT)), f);
  });
  assert.match(readFileSync(new URL('blocks/market-offer/market-offer.js', ROOT), 'utf8'), /wdh-\$\{[^}]*market[^}]*\}\.json/, 'reads the market WDH sheet at render time');
});
