/* eslint-disable */
/* global WebImporter */
// Parser for block "model-overview" (source: .modeloverview.aem-GridColumn, cmp-modeloverview):
// tabs (body types / drivetrains) with a slider of model cards. Block "Model Overview". Rows:
//   [tab title]                                   starts a tab (the model count is added at runtime)
//   [car image (linked) | h3 model name (+ branding image), price paragraph, list of facts
//     ("label <strong>value</strong>", the block derives the icon from the label) or bullet list |
//     CTA links (compare link = compare icon)]
//   [price info]                                  last row: text of the info-i next to the prices
// Options: large-titles (card titles in the base h3 / headline-3 size instead of subsection-1).
import { replaceWithBlock, cell, text, imgEl, normalizeImageUrl, cleanHref } from './_utils.js';
import { cleanInline } from './_media.js';
import { para, cosyImg, vehicleCta } from './_vehicle.js';

export const selectors = ['.modeloverview.aem-GridColumn'];

function factItem(document, cellEl) {
  const label = cellEl.querySelector('.cmp-technicaldatafact__label');
  const value = cellEl.querySelector('.cmp-technicaldatafact__value');
  // facts without a value are not rendered on the source page
  if (!text(value)) return null;
  const li = document.createElement('li');
  // inline ":icon:" text does not survive the md conversion; the block maps fact labels to icons
  const l = cleanInline(document, label.querySelector('p') || label);
  li.append(...l.childNodes);
  if (text(value)) {
    const strong = document.createElement('strong');
    strong.textContent = text(value);
    li.append(document.createTextNode(' '), strong);
  }
  return li;
}

function itemRow(document, item) {
  // image (+ link)
  const imgCell = [];
  const imgWrap = item.querySelector('.cmp-modelhubcard__image');
  const img = imgWrap ? cosyImg(document, imgWrap) : null;
  if (img) {
    const a = imgWrap.querySelector('a[href]');
    if (a) {
      const link = document.createElement('a');
      link.href = cleanHref(a.getAttribute('href'));
      link.append(img);
      imgCell.push(para(document, link));
    } else imgCell.push(para(document, img));
  }
  // title, price, facts / bullets
  const content = [];
  const header = item.querySelector('.cmp-modeloverview__model-fact-header');
  const brand = header && header.querySelector('img.cmp-title__image-branding');
  if (brand && brand.getAttribute('src')) content.push(para(document, imgEl(document, normalizeImageUrl(brand.getAttribute('src')), brand.getAttribute('alt') || '')));
  const h = header && header.querySelector('h1, h2, h3, h4, h5, h6, .cmp-title__text');
  if (h && text(h)) { const h3 = document.createElement('h3'); h3.textContent = text(h); content.push(h3); }
  item.querySelectorAll('.cmp-modeloverview__model-fact-wrapper .cmp-text > p').forEach((p) => {
    if (text(p)) content.push(cleanInline(document, p));
  });
  const facts = document.createElement('ul');
  item.querySelectorAll('.cmp-modeloverview__model-fact-cell').forEach((c) => {
    if (!c.querySelector('.cmp-technicaldatafact')) return;
    const li = factItem(document, c);
    if (li) facts.append(li);
  });
  if (facts.children.length) content.push(facts);
  const bullets = document.createElement('ul');
  item.querySelectorAll('.cmp-modeloverview__model-fact__value .cmp-list__item, .cmp-modeloverview-item__techfacts li').forEach((li) => {
    const t = text(li.querySelector('.cmp-list__item-title') || li);
    if (!t) return;
    const n = document.createElement('li');
    n.textContent = t;
    bullets.append(n);
  });
  if (bullets.children.length) content.push(bullets);
  // CTAs (compare first)
  const ctas = [];
  item.querySelectorAll('.button').forEach((b) => {
    if (b.parentElement.closest('.button')) return;
    const p = vehicleCta(document, b);
    if (p) ctas.push(p);
  });
  if (!imgCell.length && !content.length) return null;
  return [cell(document, imgCell), cell(document, content), cell(document, ctas)];
}

export default function parse(element, { document }) {
  const root = element.querySelector('.cmp-modeloverview');
  if (!root) return;
  const cells = [];
  const tabs = [...root.querySelectorAll('.cmp-tabs__tab')];
  const panels = [...root.querySelectorAll('.cmp-tabs__tabpanel')];
  (panels.length ? panels : [root]).forEach((panel, i) => {
    const title = text(tabs[i] && tabs[i].querySelector('.cmp-tabs__tabtitle')).replace(/\s*\(\d+\)\s*$/, '').trim();
    if (title || panels.length > 1) cells.push([title || `Tab ${i + 1}`]);
    panel.querySelectorAll('.cmp-modeloverview-item').forEach((item) => {
      const row = itemRow(document, item);
      if (row) cells.push(row);
    });
  });
  const info = element.getAttribute('data-info-html');
  if (info) {
    const d = document.createElement('div');
    d.innerHTML = info;
    d.querySelectorAll('[class]').forEach((e) => e.removeAttribute('class'));
    cells.push([d]);
  }
  if (!cells.length) return;
  // card titles: subsection-1 (default) or the base h3 / headline style (large-titles)
  const firstTitle = root.querySelector('.cmp-modeloverview__model-fact-header .title, .cmp-modeloverview__model-fact-header .cmp-title');
  const titleCls = firstTitle ? firstTitle.className : '';
  const options = [];
  if (firstTitle && !/style-title--subsection-/.test(titleCls)) options.push('large-titles');
  replaceWithBlock(document, element, options.length ? `Model Overview (${options.join(', ')})` : 'Model Overview', cells);
}
