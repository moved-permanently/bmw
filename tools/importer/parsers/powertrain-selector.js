/* eslint-disable */
/* global WebImporter */
// Parser for block "powertrain-selector" (source: .powertrainselector.aem-GridColumn).
// Table: optional first row = section title (h2); then one row per item: one cell with
// heading (h3), description paragraph(s) and a CTA link (the whole card links to it).
import { replaceWithBlock, cell, text } from './_utils.js';
import { contentNodes, titleNodes } from './_media.js';

export const selectors = ['.powertrainselector.aem-GridColumn'];

export default function parse(element, { document }) {
  const root = element.querySelector('.cmp-powertrainselector');
  if (!root) return;
  const cells = [];
  const title = [...root.children].find((c) => c.matches('.title'));
  if (title && text(title)) {
    const nodes = titleNodes(document, title).map((n) => {
      if (!/^H[1-6]$/.test(n.tagName)) return n;
      const h2 = document.createElement('h2');
      h2.append(...n.childNodes);
      return h2;
    });
    if (nodes.length) cells.push([cell(document, nodes)]);
  }
  root.querySelectorAll('.cmp-powertrainselector-item').forEach((item) => {
    const nodes = contentNodes(document, item, element).map((n) => {
      // item titles are h3 (some pages author h2)
      if (!/^H[1-6]$/.test(n.tagName) || n.tagName === 'H3') return n;
      const h3 = document.createElement('h3');
      h3.append(...n.childNodes);
      return h3;
    });
    if (nodes.length) cells.push([cell(document, nodes)]);
  });
  if (!cells.length) return;
  replaceWithBlock(document, element, 'Powertrain Selector', cells);
}
