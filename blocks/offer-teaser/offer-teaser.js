import {
  deliveryUrl, recordFromDelivery, offerFacts, offerNotes, isSnapshotReview,
} from '../../scripts/structured-content.js';
import { valuesFromSheet, dataRootForPath } from '../../scripts/aida-wdh.js';
import { buildResponsivePicture, fetchSheet } from '../../scripts/bmw-utils.js';

/*
 * Offer teaser: one row per market-offer record (link to the record page). Reads each record as
 * JSON from the structured-content delivery endpoint (da.live/form -> JSON) and its tech values
 * from the market's WDH sheet; records hold no values. Links to the record page for details.
 */

const LANG = { de: 'de', fr: 'fr' };
const DETAILS = { de: 'Details', fr: 'Détails', en: 'Details' };
const el = (tag, className, textContent) => Object.assign(
  document.createElement(tag),
  { className, textContent },
);

/** Snapshot review: no JSON delivery for frozen snapshots; link the same-origin record page. */
function reviewLink(path, text) {
  const li = el('li', 'offer-teaser-item offer-teaser-unavailable');
  li.append(el('p', '', 'Offer data is not loaded in a snapshot review.'));
  const p = el('p', 'button-wrapper');
  const a = el('a', 'button secondary', text);
  a.href = path;
  p.append(a);
  li.append(p);
  return li;
}

async function teaser(path, text) {
  if (isSnapshotReview(window.location)) return reviewLink(path, text);
  const li = el('li', 'offer-teaser-item');
  try {
    const resp = await fetch(deliveryUrl(window.location, path));
    const r = recordFromDelivery(await resp.json(), 'market-offer');
    const market = r.market || 'de';
    const lang = LANG[market] || 'en';
    li.lang = lang;
    if (r.image) {
      const sources = [{ url: r.image, widths: [750] }];
      li.append(buildResponsivePicture(sources, { alt: r.imageAlt || '' }));
    }
    li.append(el('p', 'offer-teaser-market', market.toUpperCase()));
    if (r.headline) li.append(el('h3', 'offer-teaser-headline', r.headline));
    if (r.claim) li.append(el('p', 'offer-teaser-claim', r.claim));
    const sheet = await fetchSheet(`${dataRootForPath(window.location.pathname)}/wdh-${market}.json`);
    const facts = offerFacts(r, valuesFromSheet(sheet, lang));
    const dl = el('dl', 'offer-teaser-facts');
    facts.values.slice(0, 3).forEach((f) => {
      const dd = el('dd', 'wdh-value', f.display);
      dd.title = `WDH ${f.key} (${market.toUpperCase()})`;
      dl.append(el('dt', '', f.label), dd);
    });
    li.append(dl);
    const notes = el('div', 'offer-teaser-notes');
    offerNotes(r, facts).forEach((t) => notes.append(el('p', '', t)));
    if (notes.children.length) li.append(notes);
    const p = el('p', 'button-wrapper');
    const a = el('a', 'button secondary', DETAILS[lang]);
    a.href = path;
    p.append(a);
    li.append(p);
  } catch (e) {
    li.classList.add('offer-teaser-unavailable');
    li.append(el('p', '', `${path}: ${e.message}`));
  }
  return li;
}

export default async function decorate(block) {
  const offers = [...block.querySelectorAll('a')]
    .map((a) => ({
      path: new URL(a.href, window.location.href).pathname,
      text: a.textContent.trim(),
    }))
    .filter(({ path }) => path.startsWith('/aida/structured/offers/'));
  const list = el('ul', 'offer-teaser-list');
  block.replaceChildren(list);
  const items = await Promise.all(offers.map(({ path, text }) => teaser(path, text)));
  items.forEach((li) => list.append(li));
}
