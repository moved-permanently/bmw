import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as documents from '../../scripts/aida-doc.js';

const reconcile = (html, car) => {
  assert.equal(typeof documents.withVehicleJsonLd, 'function', 'News-safe WDH structured-data synchronization is missing');
  return documents.withVehicleJsonLd(html, car);
};
const html = (ld) => `<body><main><div><h1>News</h1></div><div><div class="metadata"><div><div>Title</div><div>French headline</div></div><div><div>Description</div><div>French description</div></div><div><div>json-ld</div><div>${JSON.stringify(ld)}</div></div></div></div></main></body>`;

test('WDH sync preserves NewsArticle and updates localized headline and vehicle about', () => {
  const updated = reconcile(html({ '@context': 'https://schema.org', '@type': 'NewsArticle', headline: 'English headline', datePublished: '2026-09-15', about: { name: 'DE vehicle' } }), JSON.stringify({ '@context': 'https://schema.org', '@type': 'Car', name: 'FR vehicle' }));
  const ld = JSON.parse(documents.getMetadata(updated, 'json-ld'));
  assert.equal(ld['@type'], 'NewsArticle');
  assert.equal(ld.headline, 'French headline');
  assert.equal(ld.description, 'French description');
  assert.equal(ld.datePublished, '2026-09-15');
  assert.equal(ld.about.name, 'FR vehicle');
  assert.equal(ld.about['@context'], undefined);
});
test('product page synchronization still replaces the Car data', () => {
  const updated = reconcile(html({ '@type': 'Car', name: 'Old' }), '{"@type":"Car","name":"Current"}');
  assert.equal(JSON.parse(documents.getMetadata(updated, 'json-ld')).name, 'Current');
});
test('invalid existing JSON-LD stops synchronization without silently dropping article metadata', () => {
  const broken = html({ '@type': 'NewsArticle' }).replace('{"@type":"NewsArticle"}', '{broken');
  assert.throws(() => reconcile(broken, '{"@type":"Car"}'), /JSON/i);
});
