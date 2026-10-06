import { readRecord, blockRows, offerFacts } from '../../scripts/structured-content.js';
import { valuesFromSheet, dataRootForPath } from '../../scripts/aida-wdh.js';
import { buildResponsivePicture, fetchSheet } from '../../scripts/bmw-utils.js';

/*
 * Market offer record (DA Structured Content schema "market-offer", edited in da.live/form): an
 * editorial offer for one market. Tech values and prices are NOT part of the record: the block
 * reads the requested fields (wdhFields) of the model (modelCode) from the market's WDH sheet at
 * render time, so WDH stays the only source of technical data.
 */

const LANG = { de: 'de', fr: 'fr' };
const TEXT = {
  en: {
    source: 'Values: WDH', missing: 'Not in WDH', unavailable: 'This model is not in the WDH data of this market.', valid: 'Valid',
  },
  de: {
    source: 'Werte: WDH', missing: 'Nicht in WDH', unavailable: 'Dieses Modell ist in den WDH-Daten dieses Marktes nicht enthalten.', valid: 'Gültig',
  },
  fr: {
    source: 'Valeurs : WDH', missing: 'Absent de WDH', unavailable: 'Ce modèle ne figure pas dans les données WDH de ce marché.', valid: 'Valable',
  },
};
const el = (tag, className, textContent) => Object.assign(
  document.createElement(tag),
  { className, textContent },
);

function validity(r, lang, t) {
  const fmt = (v) => new Intl.DateTimeFormat(lang, { dateStyle: 'medium', timeZone: 'UTC' }).format(new Date(`${v}T00:00:00Z`));
  if (r.validFrom && r.validUntil) return `${t.valid}: ${fmt(r.validFrom)} – ${fmt(r.validUntil)}`;
  if (r.validFrom) return `${t.valid}: ${fmt(r.validFrom)}`;
  return '';
}

export default async function decorate(block) {
  const r = readRecord(blockRows(block));
  const market = r.market || 'de';
  const lang = LANG[market] || 'en';
  const t = TEXT[lang];
  const card = el('div', 'market-offer-card');
  if (r.image) {
    const media = el('div', 'market-offer-media');
    media.append(buildResponsivePicture([{ url: r.image, widths: [750, 1280] }], { alt: r.imageAlt || '' }));
    card.append(media);
  }
  const body = el('div', 'market-offer-body');
  if (r.headline) body.append(el('h2', 'market-offer-headline', r.headline));
  if (r.claim) body.append(el('p', 'market-offer-claim', r.claim));
  card.append(body);
  block.replaceChildren(card);

  let values = new Map();
  try {
    values = valuesFromSheet(await fetchSheet(`${dataRootForPath(window.location.pathname)}/wdh-${market}.json`), lang);
  } catch (e) {
    // no sheet for this market: the facts are reported as missing below
  }
  const facts = offerFacts(r, values);
  if (!facts.modelAvailable) {
    body.append(el('p', 'market-offer-notice', t.unavailable));
  } else {
    const dl = el('dl', 'market-offer-facts');
    facts.values.forEach((f) => {
      const value = el('dd', 'wdh-value', f.display);
      value.title = `WDH ${f.key} (${market.toUpperCase()})`;
      dl.append(el('dt', '', f.label), value);
    });
    facts.missing.forEach((key) => dl.append(el('dt', '', key), el('dd', 'market-offer-missing', t.missing)));
    body.append(dl);
  }
  const valid = validity(r, lang, t);
  if (valid) body.append(el('p', 'market-offer-validity', valid));
  if (r.ctaLabel && r.ctaUrl) {
    const p = el('p', 'button-wrapper');
    const a = el('a', 'button primary', r.ctaLabel);
    a.href = r.ctaUrl;
    p.append(a);
    body.append(p);
  }
  const legal = el('div', 'market-offer-legal');
  if (facts.wltp) legal.append(el('p', '', facts.wltp.display));
  if (r.legalNote) legal.append(el('p', '', r.legalNote));
  legal.append(el('p', 'market-offer-source', [`${t.source} (${market.toUpperCase()})`, r.source].filter(Boolean).join(' · ')));
  body.append(legal);
}
