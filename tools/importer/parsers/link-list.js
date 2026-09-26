/* eslint-disable */
/* global WebImporter */
// Parser for block "link-list" (source: .list.aem-GridColumn, cmp-list).
// Content model: one cell: optional <h3> list title, then a <ul> of links (items without a link stay text;
// icon items keep their icon image, the link text is the icon's alt/aria-label).
// Options: horizontal (style-list--orientation-horizontal), overflow (…-with-overflow: one scrollable row),
// thin (style-list--font-thin), collapsible (title toggles the list on mobile), center (mobile centered).
import { replaceWithBlock, cleanHref, text, normalizeImageUrl } from './_utils.js';

export const selectors = ['.list.aem-GridColumn'];

export default function parse(element, { document }) {
  if (/aem-GridColumn--default--hide/.test(element.className)) return;
  const inner = element.querySelector('[data-component-path="list-v1"]') || element.firstElementChild || element;
  const menu = element.querySelector('menu.cmp-list, ul.cmp-list, .cmp-list');
  if (!menu) return;
  const cls = `${element.className} ${inner.className || ''}`;

  const cell = document.createElement('div');
  const titleEl = element.querySelector('.cmp-list__title');
  const title = text(titleEl);
  if (title) {
    const h = document.createElement('h3');
    h.textContent = title;
    cell.append(h);
  }
  const ul = document.createElement('ul');
  menu.querySelectorAll(':scope > li, :scope > .cmp-list__item').forEach((li) => {
    const item = document.createElement('li');
    const a = li.querySelector('a[href]');
    const label = text(li.querySelector('.cmp-list__item-title')) || (a && (a.getAttribute('aria-label') || '').trim()) || text(li);
    const icon = li.querySelector('img.cmp-list__item-link--icon, img');
    if (a) {
      const link = document.createElement('a');
      link.href = cleanHref(a.getAttribute('href'));
      if (icon && icon.getAttribute('src')) {
        const img = document.createElement('img');
        img.src = normalizeImageUrl(icon.getAttribute('src'));
        img.alt = icon.getAttribute('alt') || label;
        link.append(img);
        if (!li.querySelector('.cmp-list__item-title')) link.title = label;
        else link.append(document.createTextNode(` ${label}`));
      } else {
        link.textContent = label;
      }
      item.append(link);
    } else if (label) {
      item.textContent = label;
    } else return;
    ul.append(item);
  });
  if (!ul.children.length) return;
  cell.append(ul);

  const options = [];
  if (/style-list--orientation-horizontal/.test(cls)) options.push('horizontal');
  if (/style-list--orientation-horizontal-with-overflow/.test(cls)) options.push('overflow');
  if (/style-list--font-thin/.test(cls)) options.push('thin');
  if (titleEl && /cmp-list__title--collapsable-mobile/.test(titleEl.className)) options.push('collapsible');
  if (/style-list--align-mobile-center/.test(cls)) options.push('center');
  const name = options.length ? `Link List (${options.join(', ')})` : 'Link List';
  replaceWithBlock(document, element, name, [[cell]]);
}
