/* eslint-disable max-len, import/extensions */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const model = () => import('../../tools/aida/offer-picker/offers.js');

test('records are the html documents of the offers folder, as site paths without extension', async () => {
  const { OFFERS, offerPaths } = await model();
  assert.equal(OFFERS, '/aida/structured/offers');
  const listing = [
    { path: '/moved-permanently/bmw/aida/structured/offers/bmw-i5-launch-fr.html', name: 'bmw-i5-launch-fr', ext: 'html' },
    { path: '/moved-permanently/bmw/aida/structured/offers/drafts', name: 'drafts' },
    { path: '/moved-permanently/bmw/aida/structured/offers/prices.json', name: 'prices', ext: 'json' },
    { path: '/moved-permanently/bmw/aida/structured/offers/bmw-i5-launch-de.html', name: 'bmw-i5-launch-de', ext: 'html' },
  ];
  assert.deepEqual(offerPaths(listing), ['/aida/structured/offers/bmw-i5-launch-de', '/aida/structured/offers/bmw-i5-launch-fr']);
  assert.deepEqual(offerPaths([]), []);
  assert.deepEqual(offerPaths({ error: 'not found' }), []);
});

test('a market-offer record becomes a picker entry with its form title, market and headline', async () => {
  const { offerEntry } = await model();
  const path = '/aida/structured/offers/bmw-i5-launch-de';
  const form = { 'x-schema-name': 'market-offer', title: 'BMW i5 launch offer (DE)' };
  const offer = { headline: 'Der neue BMW i5. Jetzt bei Ihrem BMW Partner.', market: 'de', modelCode: '61HG' };
  assert.deepEqual(offerEntry(path, form, offer), {
    path, title: 'BMW i5 launch offer (DE)', market: 'DE', headline: 'Der neue BMW i5. Jetzt bei Ihrem BMW Partner.',
  });
  assert.equal(offerEntry(path, { 'x-schema-name': 'market-offer' }, offer).title, offer.headline, 'no form title: headline');
  assert.equal(offerEntry(path, { 'x-schema-name': 'market-offer' }, {}).title, 'bmw-i5-launch-de', 'nothing else: record name');
  assert.equal(offerEntry(path, { 'x-schema-name': 'news', title: 'x' }, offer), null, 'other schemas are not offers');
  assert.equal(offerEntry(path, {}, offer), null);
});

test('the inserted link is one the offer-teaser block turns into a card', async () => {
  const { OFFERS, offerLink } = await model();
  const entry = { path: '/aida/structured/offers/bmw-i5-launch-fr', title: 'BMW i5 launch offer (FR)' };
  assert.deepEqual(offerLink(entry), { href: '/aida/structured/offers/bmw-i5-launch-fr', text: 'BMW i5 launch offer (FR)' });
  const block = read('blocks/offer-teaser/offer-teaser.js');
  assert.ok(block.includes(`path.startsWith('${OFFERS}/')`), 'the block keeps links under the offers folder');
});

test('picker lists the records through the editor connection and inserts the link into the document', () => {
  const html = read('tools/aida/offer-picker/offer-picker.html');
  assert.match(html, /<title>Offer records<\/title>/);
  assert.match(html, /<script src="\.\/offer-picker\.js" type="module"><\/script>/);
  const js = read('tools/aida/offer-picker/offer-picker.js');
  assert.match(js, /window\.parent === window/, 'outside the editor there is no document to insert into');
  assert.match(js, /\.list\(OFFERS\)/);
  assert.match(js, /readRecord\(blockRows\(/, 'record fields are read like the record blocks read them');
  assert.match(js, /actions\.sendHTML\(/);
  assert.match(js, /actions\.closeLibrary\(\)/);
  assert.doesNotMatch(js, /innerHTML/, 'record text is rendered as text only');
});

test('the site library offers the picker under its own title', async () => {
  const { siteConfigSteps } = await import('../../tools/ew-native/content.mjs');
  const library = siteConfigSteps().find((s) => s.sheet === 'library');
  assert.deepEqual(library.rows.find((r) => r.title === 'Offer records'), {
    title: 'Offer records', path: 'https://main--bmw--moved-permanently.aem.page/tools/aida/offer-picker/offer-picker.html',
  });
});
