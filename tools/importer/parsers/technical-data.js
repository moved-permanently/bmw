/* eslint-disable */
/* global WebImporter */
// Parser for block "technical-data" (source: .technicaldata.aem-GridColumn, cmp-technicaldata on the
// *-technische-daten pages). All variants are server-rendered; the model / transmission dropdowns
// switch between them. Block "Technical Data" (option "short" = 3 columns). Rows:
//   [fuel type | model | transmission]      starts a variant (first variant = default)
//   [category heading (h3, footnote sup)]   collapsible group
//   [image | "4.361 mm"]                    measurement (length, width, height images)
//   [label | value]                         fact (footnote sups kept)
//   [footnotes]                             last row: one paragraph per footnote "<sup>n</sup> text"
import { replaceWithBlock, cell, text, imgEl, normalizeImageUrl } from './_utils.js';
import { cleanInline } from './_media.js';
import { para, inlinePara, cosyImg } from './_vehicle.js';

export const selectors = ['.technicaldata.aem-GridColumn'];

/** "<sup>1</sup>" from a caption footnote link. */
function captionSup(document, caption) {
  const out = [];
  caption.querySelectorAll('a.cmp-technicaldata__footnote').forEach((a) => {
    const n = text(a);
    if (!n) return;
    const sup = document.createElement('sup');
    sup.textContent = n;
    out.push(sup);
  });
  return out;
}

/** Fact cell: paragraph with footnote links turned into plain sup numbers. */
function factCell(document, el) {
  const p = inlinePara(document, el);
  p.querySelectorAll('sup').forEach((sup) => {
    const a = sup.querySelector('a');
    if (a) sup.textContent = text(a);
    else sup.textContent = text(sup);
  });
  p.querySelectorAll('a[href^="#f"]').forEach((a) => a.replaceWith(document.createTextNode(text(a))));
  return p;
}

function variantRows(document, wrapper) {
  const rows = [];
  wrapper.querySelectorAll('table.cmp-technicaldata__table').forEach((table) => {
    const caption = table.querySelector('.cmp-technicaldata__caption');
    const title = text(caption && caption.querySelector('.cmp-technicaldata__caption-headline'));
    if (title) {
      const h = document.createElement('h3');
      h.append(document.createTextNode(title), ...captionSup(document, caption));
      rows.push([h]);
    }
    table.querySelectorAll('tr.cmp-technicaldata__measurement').forEach((tr) => {
      const img = cosyImg(document, tr.querySelector('picture') || tr);
      const label = text(tr.querySelector('.cmp-technicaldata__measurement-label'));
      if (img || label) rows.push([cell(document, img ? [para(document, img)] : []), label || ' ']);
    });
    table.querySelectorAll('tr.cmp-technicaldatafact').forEach((tr) => {
      const label = tr.querySelector('.cmp-technicaldatafact__label');
      const value = tr.querySelector('.cmp-technicaldatafact__value');
      if (!text(label) && !text(value)) return;
      rows.push([cell(document, factCell(document, label)), cell(document, factCell(document, value))]);
    });
  });
  return rows;
}

export default function parse(element, { document }) {
  const root = element.querySelector('.cmp-technicaldata');
  if (!root) return;
  const wrappers = [...root.querySelectorAll('.cmp-technicaldata__wrapper')];
  if (!wrappers.length) return;
  let data = {};
  try { data = JSON.parse(root.querySelector('.cmp-technicaldata__dropdowns')?.getAttribute('data-dropdown-data-json') || '{}'); } catch (e) { data = {}; }

  // variants in dropdown order: fuel -> model -> transmission
  const variants = [];
  Object.entries(data).forEach(([fuel, models]) => {
    (models || []).forEach((m) => {
      (m.transmissions && m.transmissions.length ? m.transmissions : [{ id: m.id, label: '' }]).forEach((t) => {
        variants.push({ fuel, model: m.label || '', transmission: t.label || '', id: t.id || m.id });
      });
    });
  });
  const byId = new Map(wrappers.map((w) => [w.id, w]));
  const cells = [];
  const used = new Set();
  variants.forEach((v) => {
    const w = byId.get(v.id);
    if (!w || used.has(w)) return;
    used.add(w);
    cells.push([v.fuel, v.model, v.transmission || ' ']);
    cells.push(...variantRows(document, w));
  });
  // wrappers without dropdown data (single variant pages)
  wrappers.filter((w) => !used.has(w)).forEach((w, i) => {
    if (used.size || i) {
      const t = text(w.querySelector('.cmp-technicaldata__caption-headline')) || `Variante ${i + 1}`;
      cells.push([' ', t, ' ']);
    }
    cells.push(...variantRows(document, w));
  });

  const notes = [...root.querySelectorAll('.cmp-technicaldata__footnote-list .cmp-technicaldata__footnote-item')].map((item) => {
    const p = document.createElement('p');
    const sup = document.createElement('sup');
    sup.textContent = text(item.querySelector('.cmp-technicaldata__footnote-link'));
    const body = item.querySelector('.cmp-technicaldata__footnote-text');
    const c = body ? cleanInline(document, body) : null;
    p.append(sup, document.createTextNode(' '));
    if (c) p.append(...c.childNodes);
    return p;
  }).filter((p) => text(p));
  if (notes.length) cells.push([cell(document, notes)]);

  const opts = /style-technicaldata--short/.test(element.className) ? ' (short)' : '';
  replaceWithBlock(document, element, `Technical Data${opts}`, cells);
}
