/* eslint-disable */
/* global WebImporter */
// Parser for block "content-table" (source: .contenttable.aem-GridColumn, cmp-contenttable).
// Content model: one block row per table row, one cell per table cell (titles/texts/buttons/images inside
// a cell become paragraphs/links/images).
// Options: header (first row is the table head), highlight-N (row N, 1-based incl. header, has the grey
// background of the source), center-N / end-N (column N is centered / end aligned), width-N / width-lg-N /
// width-md-N (centered narrower table), accordion (collapsible tables, see .tireinfo below).
import { replaceWithBlock, text, pictureCell } from './_utils.js';
import { cleanInline, ctaParagraph } from './_media.js';
import { gridFraction } from './_nested.js';

// .tireinfo (tyre label lists, bmw-reifenkennzeichnung): per series an h2 title and an accordion of plain
// cmp-table tables (one per model) -> h2, then one "Content Table (accordion, header)" per series (a row
// with a single h3 cell starts a collapsed item = model, the next row is its table head); footnotes -> <p>.
export const selectors = ['.contenttable.aem-GridColumn', '.tireinfo.aem-GridColumn'];

function loose(document, tag, txt) {
  const el = document.createElement(tag);
  if (txt) el.textContent = txt;
  el.setAttribute('data-bmw-loose', ''); // picked up as default content by bmw-sections
  return el;
}

/** plain AEM table (cmp-table) -> block table rows; icon-only links get a text label. */
function plainTableRows(document, table) {
  const trs = [...table.querySelectorAll('tr')].filter((tr) => tr.closest('table') === table);
  return trs.map((tr) => [...tr.children].filter((c) => c.tagName === 'TD' || c.tagName === 'TH').map((td) => {
    const d = document.createElement('div');
    const a = td.querySelector('a[href]');
    if (a) {
      const link = document.createElement('a');
      link.href = a.getAttribute('href');
      link.textContent = text(a) || 'EPREL';
      d.append(link);
    } else if (text(td)) d.textContent = text(td);
    return d;
  })).filter((r) => r.length);
}

function parseTireInfo(element, document) {
  const out = [];
  element.querySelectorAll('.accordionblock').forEach((ab) => {
    const h = text(ab.querySelector('.cmp-title__text'));
    if (h) out.push(loose(document, 'h2', h));
    // one collapsible table per series: [h3 model] row starts an item, its first table row is the head
    const cells = [];
    ab.querySelectorAll('.cmp-accordion__item').forEach((it) => {
      const t = text(it.querySelector('.cmp-accordion__title'));
      const table = it.querySelector('table');
      if (!table) return;
      const rows = plainTableRows(document, table);
      if (!rows.length) return;
      const h3 = document.createElement('h3');
      h3.textContent = t || '–';
      cells.push([h3], ...rows);
    });
    if (cells.length) out.push(WebImporter.Blocks.createBlock(document, { name: 'Content Table (accordion, header)', cells }));
  });
  element.querySelectorAll('.text .cmp-text > p, .text .cmp-text > ul').forEach((p) => {
    if (p.closest('.accordionblock') || !text(p)) return;
    const el = loose(document, p.tagName === 'UL' ? 'ul' : 'p', '');
    el.append(...cleanInline(document, p).childNodes);
    out.push(el);
  });
  if (!out.length) return;
  element.replaceWith(...out);
}

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

/**
 * Centered narrower tables (a grid column with an offset around the table): width-N / width-lg-N /
 * width-md-N in 12ths from 1280px / 1024-1279px / 768-1023px.
 */
function widthOptions(element) {
  let n = element;
  let centered = false;
  while (n && n.classList) {
    if (n.classList.contains('aem-GridColumn') && /aem-GridColumn--offset--default--[1-9]/.test(n.className)) centered = true;
    n = n.parentElement;
  }
  if (!centered) return [];
  const cols = (bp) => Math.max(1, Math.min(12, Math.round(gridFraction(element, bp) * 12)));
  const [d, l, m] = [cols('default'), cols('large'), cols('medium')];
  const out = [];
  if (d < 12) out.push(`width-${d}`);
  if (l !== d) out.push(`width-lg-${l}`);
  if (m !== l) out.push(`width-md-${m}`);
  return out;
}

function alignment(td) {
  const m = (td.className || '').match(/cmp-contenttable__cell--align-horizontal-(start|center|end)/);
  return m ? m[1] : 'start';
}

export default function parse(element, { document }) {
  if (element.classList.contains('tireinfo')) { parseTireInfo(element, document); return; }
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
  options.push(...widthOptions(element));
  const name = options.length ? `Content Table (${options.join(', ')})` : 'Content Table';
  replaceWithBlock(document, element, name, rows);
}
