/* eslint-disable */
/* global WebImporter */
// Parser for block "car-kpis" (source: .carKPIs.aem-GridColumn).
// Table: one row per KPI [value | unit | label], last row: CTA link(s).
import { replaceWithBlock, cleanHref, text, cell } from './_utils.js';

export const selectors = ['.carKPIs.aem-GridColumn'];

function inlineCopy(document, el) {
  const d = document.createElement('div');
  if (!el) return d;
  const c = el.cloneNode(true);
  c.querySelectorAll('span, p').forEach((s) => {
    if (s.tagName === 'P' && s.nextElementSibling) s.after(document.createElement('br'));
    s.replaceWith(...s.childNodes);
  });
  c.querySelectorAll('[class]').forEach((e) => e.removeAttribute('class'));
  d.innerHTML = c.innerHTML.replace(/\s+/g, ' ').trim();
  return d;
}

export default function parse(element, { document }) {
  const root = element.querySelector('.cmp-carKPIs');
  if (!root) return;
  const table = root.querySelector('.cmp-carKPIs__desktop-only table') || root.querySelector('table');
  if (!table) return;
  const contents = [...table.querySelectorAll('td.cmp-carKPIs__content')];
  const labels = [...table.querySelectorAll('td.cmp-carKPIs__label')];
  const cells = [];
  contents.forEach((c, i) => {
    const value = text(c.querySelector('.cmp-carKPIs__text-section .cmp-carKPIs__value'))
      || (c.querySelector('.cmp-carKPIs__animation-wrapper')?.getAttribute('data-counter-string') || '').trim();
    const unit = [...c.querySelectorAll('.cmp-carKPIs__text-section .cmp-carKPIs__unit')].map((u) => text(u)).join(' ');
    const label = inlineCopy(document, labels[i]?.querySelector('.cmp-carKPIs__label-text') || labels[i]);
    cells.push([value, unit, label]);
  });
  const links = [...root.querySelectorAll('.cmp-carKPIs__button-wrapper a.cmp-button')].map((a) => {
    const p = document.createElement('p');
    const link = document.createElement('a');
    link.href = cleanHref(a.getAttribute('href'));
    link.textContent = text(a.querySelector('.cmp-button__text') || a);
    p.append(link);
    return p;
  });
  if (links.length) cells.push([cell(document, links)]);
  const footnotes = [...root.querySelectorAll('.cmp-carKPIs__footnote')].filter((f) => text(f));
  if (footnotes.length) cells.push([cell(document, footnotes.map((f) => inlineCopy(document, f)))]);
  replaceWithBlock(document, element, 'Car KPIs', cells);
}
