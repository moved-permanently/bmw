/* eslint-disable */
/* global WebImporter */
// Parser for block "model-compare" (source: the compare app root .compare.container > .cmp-compare,
// AEM template bmw-web-compare-page; .comparefootnotes is only the footnote list and is rendered by the block).
// On the source the page <main> (stage "Sofort verfügbare Neuwagen", footnotes) sits INSIDE .cmp-compare, after
// the app: the parser moves <main> out, puts the block table first in it and replaces the app with it.
// Block "Model Compare":
//   row 1: headline (h1)
//   row 2: link to the source compare page (www.bmw.de path used through the bmw-proxy for the app template
//          /de/bmw-modelle-vergleichen.html/content.q and the model data .../_jcr_content.technicaldata.*.json)
// Preselected models come from the URL hash: #{series}/{range}/{model}/{transmission}[/...] (up to 3).
import { text } from './_utils.js';

export const selectors = ['.compare.container:has(> .cmp-compare)', '.cmp-compare[data-component-path="compare-v1"]'];

export default function parse(element, { document }) {
  const root = element.classList.contains('cmp-compare') ? (element.closest('.compare.container') || element) : element;
  const cmp = root.querySelector('.cmp-compare') || root;
  const main = cmp.querySelector('main');
  const headline = text(cmp.querySelector('.cmp-compare__headline .cmp-title__text, .cmp-compare__header-headlines h1, h1')) || 'BMW Modelle vergleichen.';
  const h1 = document.createElement('h1');
  h1.textContent = headline;
  const link = document.createElement('a');
  link.href = 'https://www.bmw.de/de/bmw-modelle-vergleichen.html';
  link.textContent = link.href;
  const block = WebImporter.Blocks.createBlock(document, { name: 'Model Compare', cells: [[h1], [link]] });

  // the footnotes of the source page are filled by the compare app: drop the empty component
  if (main) main.querySelectorAll('.comparefootnotes').forEach((f) => f.remove());
  if (main) {
    const grid = main.querySelector('.aem-Grid') || main;
    grid.prepend(block);
    root.replaceWith(main);
  } else {
    root.replaceWith(block);
  }
}
