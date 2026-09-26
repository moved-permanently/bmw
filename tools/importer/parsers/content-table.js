/* eslint-disable */
/* global WebImporter */
// Parser for block "content-table" (source: .contenttable.aem-GridColumn, cmp-contenttable).
// Content model: one block row per table row, one cell per table cell (titles/texts/buttons/images inside
// a cell become paragraphs/links/images).
// Options: header (first row is the table head), highlight-N (row N, 1-based incl. header, has the grey
// background of the source), center-N / end-N (column N is centered / end aligned).
import { replaceWithBlock, text, pictureCell } from './_utils.js';
import { cleanInline, ctaParagraph } from './_media.js';

export const selectors = ['.contenttable.aem-GridColumn'];

function cellNodes(document, td) {
  const out = [];
  const comps = [...td.querySelectorAll('.cmp-contenttable__title, .cmp-contenttable__text, .cmp-contenttable__button, .cmp-contenttable__image')];
  if (!comps.length) {
    const t = text(td);
    if (t) { const p = document.createElement('p'); p.textContent = t; out.push(p); }
    return out;
  }
  comps.forEach((c) => {
    if (c.matches('.cmp-contenttable__title')) {
      const h = c.querySelector('.cmp-title__text, h1, h2, h3, h4, h5, h6, p');
      if (!h) return;
      const p = document.createElement('p');
      p.append(...cleanInline(document, h).childNodes);
      if (p.textContent.replace(/\u00a0/g, ' ').trim()) out.push(p);
    } else if (c.matches('.cmp-contenttable__text')) {
      const root = c.querySelector('.cmp-text') || c;
      [...root.children].forEach((n) => {
        if (n.matches('.cmp-infoi, [data-cmp-hook-tooltip], script, style')) return;
        const clean = cleanInline(document, n);
        // drop empty duplicate links (source often repeats a phone link without text)
        clean.querySelectorAll('a').forEach((a) => { if (!a.textContent.trim()) a.remove(); });
        if (!clean.textContent.replace(/\u00a0/g, ' ').trim() && !clean.querySelector('img')) return;
        if (/^(P|UL|OL)$/.test(clean.tagName)) out.push(clean);
        else { const p = document.createElement('p'); p.append(...clean.childNodes); out.push(p); }
      });
    } else if (c.matches('.cmp-contenttable__button')) {
      c.querySelectorAll('.button').forEach((b) => {
        const p = ctaParagraph(document, b, b);
        if (p) out.push(p);
      });
    } else if (c.matches('.cmp-contenttable__image')) {
      pictureCell(document, c).slice(0, 1).forEach((img) => { const p = document.createElement('p'); p.append(img); out.push(p); });
    }
  });
  return out;
}

function alignment(td) {
  const m = (td.className || '').match(/cmp-contenttable__cell--align-horizontal-(start|center|end)/);
  return m ? m[1] : 'start';
}

export default function parse(element, { document }) {
  const table = element.querySelector('table.cmp-contenttable__table, table');
  if (!table) return;
  const trs = [...table.querySelectorAll('tr')].filter((tr) => tr.closest('table') === table);
  if (!trs.length) return;
  const options = [];
  if (trs[0].closest('thead')) options.push('header');
  const rows = [];
  const colAlign = [];
  trs.forEach((tr, i) => {
    const tds = [...tr.children].filter((c) => /^T[HD]$/.test(c.tagName));
    if (!tds.length) return;
    const cells = tds.map((td, ci) => {
      if (!tr.closest('thead')) {
        const al = alignment(td);
        colAlign[ci] = colAlign[ci] || new Set();
        if (text(td)) colAlign[ci].add(al);
      }
      const d = document.createElement('div');
      cellNodes(document, td).forEach((n) => d.append(n));
      return d;
    });
    rows.push(cells);
    if (/cmp-contenttable__row--(background|zebra)/.test(tr.className)) options.push(`highlight-${rows.length}`);
  });
  colAlign.forEach((set, ci) => {
    if (set && set.size === 1) {
      const [al] = [...set];
      if (al !== 'start') options.push(`${al}-${ci + 1}`);
    }
  });
  const name = options.length ? `Content Table (${options.join(', ')})` : 'Content Table';
  replaceWithBlock(document, element, name, rows);
}
