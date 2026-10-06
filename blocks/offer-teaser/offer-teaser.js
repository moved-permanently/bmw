import {
  deliveryUrl, recordFromDelivery, offerFacts,
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

async function teaser(path) {
  const li = el('li', 'offer-teaser-item');
  try {
    const resp = await fetch(deliveryUrl(window.location, path));
    const r = recordFromDelivery(await resp.json(), 'market-offer');
    const market = r.market || 'de';
    const lang = LANG[market] || 'en';
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
  const paths = [...block.querySelectorAll('a')]
    .map((a) => new URL(a.href, window.location.href).pathname)
    .filter((p) => p.startsWith('/aida/structured/offers/'));
  const list = el('ul', 'offer-teaser-list');
  block.replaceChildren(list);
  (await Promise.all(paths.map(teaser))).forEach((li) => list.append(li));
}
