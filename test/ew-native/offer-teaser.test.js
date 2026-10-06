/* eslint-disable max-len, import/extensions */
/*
 * Structured content JSON consumer: the offer-teaser block reads records through the official
 * delivery endpoint (adobe-rnd/da-sc: SDK convertHtmlToJson of the previewed record page) and
 * shows WDH values from the market sheet. The fixture is the SDK's own delivery JSON.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { deliveryUrl, recordFromDelivery } from '../../scripts/structured-content.js';
import { teaserPage } from '../../tools/ew-native/structured.mjs';
import { migrateDocument } from '../../tools/semantic-styles/migrate.mjs';

const ROOT = new URL('../../', import.meta.url);

test('delivery URL follows the host tier (preview / live) and the site', () => {
  const at = (href) => new URL(href);
  assert.equal(deliveryUrl(at('https://main--bmw--moved-permanently.aem.page/aida/structured/teasers'), '/aida/structured/offers/bmw-i5-launch-fr'), 'https://da-sc.adobeaem.workers.dev/preview/moved-permanently/bmw/aida/structured/offers/bmw-i5-launch-fr');
  assert.equal(deliveryUrl(at('https://main--bmw--moved-permanently.aem.live/x'), '/aida/structured/offers/a'), 'https://da-sc.adobeaem.workers.dev/live/moved-permanently/bmw/aida/structured/offers/a');
  assert.equal(deliveryUrl(at('http://localhost:3000/x'), '/a'), 'https://da-sc.adobeaem.workers.dev/preview/moved-permanently/bmw/a');
  assert.throws(() => deliveryUrl(at('https://main--bmw--moved-permanently.aem.page/x'), 'https://evil.example/a'), /path/);
});

test('snapshot reviews: no JSON delivery (da-sc review tier reads main--site--org.aem.reviews, not the named snapshot)', () => {
  const at = (href) => new URL(href);
  ['https://launch--main--bmw--moved-permanently.aem.reviews/aida/structured/teasers', 'https://main--bmw--moved-permanently.aem.reviews/x'].forEach((href) => {
    assert.throws(() => deliveryUrl(at(href), '/aida/structured/offers/bmw-i5-launch-de'), /snapshot review/);
  });
  const src = readFileSync(new URL('blocks/offer-teaser/offer-teaser.js', ROOT), 'utf8');
  assert.match(src, /isSnapshotReview\(window\.location\)/, 'the block checks review mode before any fetch');
  assert.ok(src.indexOf('isSnapshotReview(window.location)') < src.indexOf('fetch('), 'guard comes before the JSON fetch');
});

test('a delivered record (SDK JSON) becomes the same record the record page renders', () => {
  const json = JSON.parse(readFileSync(new URL('test/ew-native/fixtures/market-offer-delivery.json', ROOT), 'utf8'));
  const record = recordFromDelivery(json, 'market-offer');
  assert.equal(record.market, 'fr');
  assert.deepEqual(record.wdhFields, ['electricRange', 'electricConsumption', 'fromPrice']);
  assert.equal(record.headline, 'La nouvelle BMW i5. Chez votre partenaire BMW.');
  assert.throws(() => recordFromDelivery({ ...json, metadata: { ...json.metadata, schemaName: 'news' } }, 'market-offer'), /schema/);
  assert.throws(() => recordFromDelivery({ error: '404 Not Found' }, 'market-offer'), /404/);
});

test('the offer-teaser block consumes the delivery JSON and WDH, never record-stored values', () => {
  ['offer-teaser/offer-teaser.js', 'offer-teaser/offer-teaser.css'].forEach((f) => assert.ok(existsSync(new URL(`blocks/${f}`, ROOT)), f));
  const src = readFileSync(new URL('blocks/offer-teaser/offer-teaser.js', ROOT), 'utf8');
  assert.match(src, /deliveryUrl\(/);
  assert.match(src, /recordFromDelivery\(/);
  assert.match(src, /offerFacts\(/);
});

test('teaser demo page: a normal BMW page with offer-teaser rows for both market records', () => {
  const html = teaserPage();
  assert.match(html, /^<body><header><\/header><main>.*<\/main><footer><\/footer><\/body>\n$/s);
  assert.match(html, /<div class="offer-teaser">.*\/aida\/structured\/offers\/bmw-i5-launch-de.*\/aida\/structured\/offers\/bmw-i5-launch-fr/s);
  const result = migrateDocument(html);
  assert.equal(result.changed, false);
  assert.deepEqual(result.exceptions, []);
});
