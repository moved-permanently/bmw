/* eslint-disable */
/* global WebImporter */
// Parser for block "preview-slider" (source: .previewslider.aem-GridColumn = <stl-preview-slider>, the
// BMW Stock Locator web component that loads available new cars at runtime).
// Key/value rows (col 1 = key, col 2 = value):
//   headline   h2 headline
//   link       link to the stock locator results ("Jetzt entdecken")
//   teaser     headline of the closing teaser card ("Mehr sofort verfügbare Fahrzeuge?")
//   series, model-range, fuel-types, sorting, brand   stock locator search parameters
import { replaceWithBlock } from './_utils.js';

export const selectors = ['.previewslider.aem-GridColumn'];

export default function parse(element, { document }) {
  const c = element.querySelector('stl-preview-slider, .cmp-previewslider');
  if (!c) return;
  const attr = (n) => (c.getAttribute(n) || '').trim();
  const base = attr('stock-locator-url') || 'https://www.bmw.de/de-de/sl/stocklocator';
  const range = attr('model-range');
  const results = `${base.replace(/\/$/, '')}/results${range ? `?modelRange=${encodeURIComponent(range)}` : ''}`;

  const rows = [];
  if (attr('headline')) {
    const h = document.createElement('h2');
    h.textContent = attr('headline');
    rows.push(['headline', h]);
  }
  const a = document.createElement('a');
  a.href = results;
  a.textContent = attr('link-text') || 'Jetzt entdecken';
  rows.push(['link', a]);
  if (attr('link-headline')) rows.push(['teaser', attr('link-headline')]);
  [['series', 'series'], ['model-range', 'model-range'], ['fuel-types', 'fuel-types'], ['sorting', 'sorting'], ['brand', 'brand']]
    .forEach(([key, name]) => { if (attr(name)) rows.push([key, attr(name)]); });
  replaceWithBlock(document, element, 'Preview Slider', rows);
}
