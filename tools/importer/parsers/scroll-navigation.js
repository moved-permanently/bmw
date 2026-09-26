/* eslint-disable */
/* global WebImporter */
// Parser for block "scroll-navigation" (source: .scrollnavigation.aem-GridColumn, cmp-scrollnavigation).
// Content model: one row per section bullet: <a href="#anchor">Label</a> [| target hint: heading text].
import { replaceWithBlock, text, anchorHint } from './_utils.js';

export const selectors = ['.scrollnavigation.aem-GridColumn'];

export default function parse(element, { document }) {
  const rows = [];
  element.querySelectorAll('a.cmp-scrollnavigation__list-item-link, .cmp-scrollnavigation a[href]').forEach((a) => {
    const href = (a.getAttribute('data-anchor') || a.getAttribute('href') || '').trim();
    const label = text(a.querySelector('.cmp-scrollnavigation__list-item-tooltip') || a);
    if (!href.startsWith('#') || !label) return;
    if (rows.some((r) => r[0].getAttribute('href') === href)) return;
    const link = document.createElement('a');
    link.href = href;
    link.textContent = label;
    const hint = anchorHint(document, href);
    rows.push(hint ? [link, hint] : [link]);
  });
  if (!rows.length) return;
  replaceWithBlock(document, element, 'Scroll Navigation', rows);
}
