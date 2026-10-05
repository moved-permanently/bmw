import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { valuesFromSheet, marketForPath } from '../../scripts/aida-wdh.js';

const read = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const sheet = JSON.parse(read('tools/aida/showcase/data/wdh-de.json'));
const expected = {
  electricRange: 'Max. range (WLTP)',
  electricConsumption: 'Combined electric power consumption (WLTP)',
  co2: 'Combined CO₂ emissions (WLTP)',
  co2Class: 'CO₂ class',
  acceleration: 'Acceleration, 0–100 km/h',
  additionalRangeDC: 'Range (WLTP) after 10 minutes of DC charging',
  power: 'Power',
  fromPrice: 'Starting price',
  leasePrice: 'Monthly lease price',
  drivingAssistantSpeed: 'Driving Assistant Professional — speed limit',
  highwayAssistantSpeed: 'BMW Highway Assistant — speed limit',
  dcCharge10to80: 'DC charging, 10–80 %',
};

test('unlabelled showcase rows receive meaningful BMW-based property labels', () => {
  const values = valuesFromSheet(sheet, 'en');
  [...values.values()].forEach((row) => {
    assert.equal(row.label, expected[row.field], row.key);
    assert.ok(row.label.trim(), row.key);
  });
  assert.equal(values.get('61HG.co2Class').display, 'A');
  assert.equal(values.get('61HG.electricRange').display, '513–627 km');
  assert.equal(sheet.values.data[0].label, undefined, 'Source data must not be mutated');
});

test('property labels follow document language independently of the data market', () => {
  const rows = [{ key: '61HG.co2Class', label: 'CO₂-Klasse', value: 'A' }];
  ['en', 'de/de', 'de/at', 'fr/fr', 'fr/be'].forEach((context) => {
    const { lang } = marketForPath(`/aida/showcase/${context}/news/i5-film-v2`);
    const value = valuesFromSheet({ values: rows }, lang).get('61HG.co2Class');
    assert.equal(value.label, { en: 'CO₂ class', de: 'CO₂-Klasse', fr: 'Classe de CO₂' }[lang]);
    assert.equal(value.display, 'A');
  });
  assert.equal(valuesFromSheet({ values: rows }, 'it').get('61HG.co2Class').label, 'CO₂ class');
});

test('labels also cover legacy sheet rows and the derived full WLTP statement', () => {
  const rows = [
    { key: '61HG.name', value: 'BMW i5 eDrive40 Limousine' },
    { key: '61HG.topSpeed', value: '193', unit: 'km/h' },
    { key: '61HG.batteryCapacity', value: '81,2', unit: 'kWh' },
    { key: '61HG.wltp', value: 'BMW i5: CO₂ class A', sourceKind: 'derived-demo-wltp-statement' },
  ];
  const values = valuesFromSheet({ values: rows });
  assert.deepEqual([...values.values()].map((row) => row.label), [
    'Model', 'Top speed', 'Battery capacity', 'Full WLTP statement',
  ]);
  assert.equal(values.get('61HG.wltp').display, rows[3].value);
});

test('unknown properties use a supplied label, readable field name or technical key, never blank', () => {
  const rows = [
    { key: '61HG.customFact', label: '  BMW custom property  ', value: 'x' },
    { key: '61HG.newChargingRate', label: ' ', value: 'x' },
    { key: '61HG.custom', field: 'DC_charge_limit', value: 'x' },
    { key: 'opaque-key', field: '', value: 'x' },
    { key: '61HG.constructor', value: 'x' },
  ];
  const values = valuesFromSheet({ values: rows });
  assert.deepEqual([...values.values()].map((row) => row.label), [
    'BMW custom property', 'New charging rate', 'DC charge limit', 'opaque-key', 'Constructor',
  ]);
});

test('source labels distinguish supplied data, demo fixtures and derived statements', () => {
  const rows = [
    ...sheet.values.data,
    { key: '61HG.wltp', value: 'BMW i5: CO₂ class A', sourceKind: 'derived-demo-wltp-statement' },
    { key: '61HG.external', value: 'x', sourceKind: 'external-wdh' },
    { key: '61HG.legacy', value: 'x' },
  ];
  const values = valuesFromSheet({ values: rows });
  assert.equal(values.get('61HG.electricRange').sourceLabel, 'WDH export');
  assert.equal(values.get('61HG.leasePrice').sourceLabel, 'Demo fixture');
  assert.equal(values.get('61HG.drivingAssistantSpeed').sourceLabel, 'Demo fixture');
  assert.equal(values.get('61HG.wltp').sourceLabel, 'Derived WLTP statement');
  assert.equal(values.get('61HG.external').sourceLabel, 'WDH export');
  assert.equal(values.get('61HG.legacy').sourceLabel, 'Source not specified');
  assert.equal(valuesFromSheet({ values: rows }, 'de').get('61HG.leasePrice').sourceLabel, 'Demo-Datensatz');
  assert.equal(valuesFromSheet({ values: rows }, 'fr').get('61HG.leasePrice').sourceLabel, 'Données de démonstration');
});

test('picker requests document-language labels and shows property and source context', () => {
  const source = read('tools/aida/wdh-picker/wdh-picker.js');
  assert.match(source, /valuesFromSheet\(\{ values: rows \},[^)]*lang/);
  assert.match(source, /<th[^>]*>Property<\/th>/);
  assert.match(source, /<th[^>]*>Current source value<\/th>/);
  assert.match(source, /sourceLabel/);
  assert.match(source, /spectrum-Badge/);
  assert.match(source, /link\.textContent = v\.display;/, 'Insertion must remain the value, not its label');
  assert.match(source, /setAttribute\('aria-label', `Insert \$\{v\.label\}`\)/);
});
