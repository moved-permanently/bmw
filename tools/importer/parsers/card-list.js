/* eslint-disable */
/* global WebImporter */
// Parser for block "card-list" (source: .cardlist.aem-GridColumn, AEM cardlist-v1): intro text on
// the left, a (scrolling) list of expandable cards with icon + title on the right.
// Row 1 (1 column): intro = heading, text, CTAs (a CTA can open a #layer-N layer section).
// Rows 2..n (3 columns): icon (":icon_name:") | card title | card content (text, CTA links).
// Nested components in the card texts are flattened to default content.
import { replaceWithBlock, text } from './_utils.js';
import { blockName, divCell, cleanInline } from './_media.js';
import { normalizeNested, defaultContent, iconName, iconParagraph } from './_nested.js';

export const selectors = ['.cardlist.aem-GridColumn'];

export default function parse(element, { document }) {
  const cl = element.querySelector('.cmp-cardlist');
  if (!cl) return;
  const rows = [];

  const left = cl.querySelector('.cmp-cardlist__left-container');
  if (left) {
    // CTAs exist twice (mobile-only / desktop-only copies): keep the desktop ones
    left.querySelectorAll('.cmp-cardlist__mobile-only').forEach((m) => {
      if (left.querySelector('.cmp-cardlist__desktop-only')) m.remove();
    });
    normalizeNested(document, left);
    const { content } = defaultContent(document, left, element);
    if (content.length) rows.push([divCell(document, content)]);
  }

  cl.querySelectorAll('.cmp-cardlist__item').forEach((item) => {
    const iconEl = item.querySelector('.cmp-cardlist__item-icon');
    const name = iconName(iconEl);
    const titleEl = item.querySelector('.cmp-cardlist__item-title .cmp-title__text') || item.querySelector('.cmp-cardlist__item-title');
    const title = document.createElement('p');
    if (titleEl) title.append(...cleanInline(document, titleEl).childNodes);
    if (!text(title)) return;
    const body = item.querySelector('.cmp-cardlist__expandable') || item;
    normalizeNested(document, body);
    const { content } = defaultContent(document, body, element);
    rows.push([
      divCell(document, name ? [iconParagraph(document, name)] : []),
      divCell(document, [title]),
      divCell(document, content),
    ]);
  });
  if (!rows.length) return;
  replaceWithBlock(document, element, blockName('Card List', []), rows);
}
