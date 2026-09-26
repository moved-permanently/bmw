/* eslint-disable */
/* global WebImporter */
// Parser for block "all-models" (source: .allmodels.aem-GridColumn on /de/neufahrzeuge and
// .allmodelsesi.aem-GridColumn on the elektroauto pages): the model finder. All cards and their
// filter data are server-rendered (data-card-filter-info JSON). Block "All Models"
// (option no-filter for the ESI variant without filter UI). Rows:
//   [filter key | heading | list of options "Label (value)"]   filter group (category, series,
//        fuelType, bmwM, specialCategory, …) — key/values are the URL parameters (?series=x)
//   [sort | label | list "Antriebsvarianten (default)", "Neuerscheinungen (new)"]  sort dropdown
//   [preselect | key: value]                                   preselected filters (ESI variant)
//   [h2 group heading | group code]                            e.g. "Vollelektrisch | e"
//   [images: car, side view | body type, *Neu* flag (em), h3 series (sub = small "er"),
//     description, fuel text, M logo image, USP list | CTA links (+ compare link) |
//     filter tags "fuelType: e, series: x, category: suv, bmwM: no, driveType: ar, offers: new"]
import { replaceWithBlock, cell, text, imgEl, normalizeImageUrl, cleanHref } from './_utils.js';
import { para, cosyImg, vehicleCta } from './_vehicle.js';

export const selectors = ['.allmodels.aem-GridColumn', '.allmodelsesi.aem-GridColumn'];

function list(document, items) {
  const ul = document.createElement('ul');
  items.forEach((n) => {
    const li = document.createElement('li');
    (Array.isArray(n) ? n : [n]).forEach((x) => li.append(typeof x === 'string' ? document.createTextNode(x) : x));
    ul.append(li);
  });
  return ul;
}

function seriesHeading(document, el) {
  const h = document.createElement('h3');
  el.childNodes.forEach((n) => {
    if (n.nodeType === 3) { if (n.nodeValue.trim()) h.append(document.createTextNode(n.nodeValue.trim())); return; }
    if (n.nodeType !== 1) return;
    if (/series-small/.test(n.className || '')) {
      if (text(n)) { const sub = document.createElement('sub'); sub.textContent = text(n); h.append(sub); }
    } else h.append(document.createTextNode(text(n)));
  });
  return h;
}

function cardRow(document, card) {
  const d = card.querySelector('.cmp-allmodelscarddetail') || card;
  // images: car + expand view (side)
  const imgs = [];
  const car = cosyImg(document, d.querySelector('.cmp-allmodelscarddetail__car-image') || d);
  if (car) imgs.push(para(document, car));
  const side = d.querySelector('.cmp-allmodelscarddetail__expandview-image');
  const sideImg = side ? cosyImg(document, side) : null;
  if (sideImg && sideImg.getAttribute('src') !== (car && car.getAttribute('src'))) imgs.push(para(document, sideImg));

  // text
  const content = [];
  const body = text(d.querySelector('.cmp-allmodelscarddetail__top-wrapper .cmp-allmodelscarddetail__body-type'));
  if (body) content.push(para(document, document.createTextNode(body)));
  const flagEl = d.querySelector('.cmp-allmodelscarddetail__top-wrapper .cmp-allmodelscarddetail__additional-label');
  if (flagEl && text(flagEl)) { const em = document.createElement('em'); em.textContent = text(flagEl); content.push(para(document, em)); }
  const series = d.querySelector('.cmp-allmodelscarddetail__series');
  if (series && text(series)) content.push(seriesHeading(document, series));
  const desc = text(d.querySelector('.cmp-allmodelscarddetail__description'));
  if (desc) content.push(para(document, document.createTextNode(desc)));
  const fuel = text(d.querySelector('.cmp-allmodelscarddetail__fuelTypeText'));
  if (fuel) content.push(para(document, document.createTextNode(fuel)));
  const m = d.querySelector('img.cmp-allmodelscarddetail__m-branding-image');
  if (m && m.getAttribute('src')) content.push(para(document, imgEl(document, normalizeImageUrl(m.getAttribute('src')), m.getAttribute('alt') || 'BMW M')));
  const usps = [...d.querySelectorAll('.cmp-allmodelscarddetail__usp-list li')].map((li) => text(li)).filter(Boolean);
  if (usps.length) content.push(list(document, usps));

  // CTAs
  const ctas = [];
  card.querySelectorAll('.cmp-allmodelscard__buttons .button, .cmp-allmodelscard__compare .button').forEach((b) => {
    const p = vehicleCta(document, b);
    if (p) ctas.push(p);
  });

  // tags
  let info = {};
  try { info = JSON.parse(card.getAttribute('data-card-filter-info') || '{}'); } catch (e) { info = {}; }
  const tags = Object.entries(info)
    .filter(([k, v]) => v !== '' && v != null && !(k === 'price' && /^0(\.0)?$/.test(String(v))))
    .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(' ') : v}`).join(', ');
  return [cell(document, imgs), cell(document, content), cell(document, ctas), tags || ' '];
}

export default function parse(element, { document }) {
  const root = element.querySelector('.cmp-allmodels');
  if (!root) return;
  const cells = [];
  // ESI variant: no filter UI on the elektroauto pages (data-nofilter), but /de/konfigurator renders one
  const noFilter = root.getAttribute('data-nofilter') === 'true'
    || (element.matches('.allmodelsesi') && !root.querySelector('.cmp-allmodelsfilter__filter[data-filter-type]'));

  // filter groups
  if (!noFilter) {
    root.querySelectorAll('.cmp-allmodelsfilter__filter[data-filter-type]').forEach((f) => {
      const key = f.getAttribute('data-filter-type');
      const heading = (f.querySelector('.cmp-allmodelsfilter__heading')?.getAttribute('data-heading-label') || text(f.querySelector('.cmp-allmodelsfilter__heading'))).trim();
      const opts = [...f.querySelectorAll('.js-filter-input')].map((b) => {
        const value = b.getAttribute('data-filter-value');
        const label = text(b) || '';
        const img = b.querySelector('img');
        const parts = [];
        if (img && img.getAttribute('src')) parts.push(imgEl(document, normalizeImageUrl(img.getAttribute('src')), img.getAttribute('alt') || b.getAttribute('title') || ''));
        parts.push(`${label ? `${label} ` : ''}(${value})`);
        return parts;
      });
      if (opts.length) cells.push([key, heading, list(document, opts)]);
    });
    const sortItems = [...root.querySelectorAll('.cmp-allmodels--sorting-item')].map((s) => `${text(s)} (${s.getAttribute('data-value')})`);
    if (sortItems.length) cells.push(['sort', text(root.querySelector('.cmp-allmodels--sorting-item')) || 'Sortierung', list(document, sortItems)]);
  }
  let pre = {};
  try { pre = JSON.parse(root.getAttribute('data-preselected-filters') || '{}'); } catch (e) { pre = {}; }
  Object.entries(pre).forEach(([k, v]) => { if (v) cells.push(['preselect', `${k}: ${v}`]); });

  // groups + cards (document order)
  const container = root.querySelector('.cmp-allmodelscontainer__root') || root;
  container.querySelectorAll('.cmp-allmodelscontainer__category-head, .cmp-allmodelscard').forEach((el) => {
    if (el.classList.contains('cmp-allmodelscontainer__category-head')) {
      const h = document.createElement('h2');
      h.textContent = el.querySelector('.cmp-allmodelscontainer__category-label')?.getAttribute('data-label') || text(el);
      cells.push([h, el.getAttribute('data-category') || ' ']);
    } else {
      cells.push(cardRow(document, el));
    }
  });
  if (!cells.length) return;
  replaceWithBlock(document, element, noFilter ? 'All Models (no-filter)' : 'All Models', cells);
}
