/* eslint-disable */
/* global WebImporter */
// Parser for block "accordion" (source: .accordion.aem-GridColumn, AEM accordion-v1).
// 2 columns, one row per item: cell 1 = title (text), cell 2 = panel content as default content
// (paragraphs, lists, links, CTAs, images, disclaimers). Nested components are flattened (icons ->
// :icon:, embeds -> image, inner block tables -> their text), so there are no nested tables.
// Options: faq (FAQ spacing), h2 (item headers are h2, default h3), expand-first (first item open
// on load), single (only one item open at a time), width-N / width-lg-N (desktop width in 12ths
// from 1280px / 1024-1279px, centered; derived from the source grid).
import { replaceWithBlock } from './_utils.js';
import { blockName, divCell, cleanInline } from './_media.js';
import { normalizeNested, defaultContent, gridFraction } from './_nested.js';

export const selectors = ['.accordion.aem-GridColumn'];

function widthOption(element, bp, prefix) {
  const f = gridFraction(element, bp);
  const cols = Math.round(f * 12);
  return cols >= 4 && cols < 12 ? `${prefix}-${cols}` : '';
}

export default function parse(element, { document }) {
  const acc = element.querySelector('.cmp-accordion');
  if (!acc) return;
  const items = [...acc.querySelectorAll('.cmp-accordion__item')].filter((it) => it.closest('.cmp-accordion') === acc);
  if (!items.length) return;
  const options = [];
  if (/style-accordion--faq/.test(element.className)) options.push('faq');
  const header = items[0].querySelector('.cmp-accordion__header');
  if (header && header.tagName === 'H2') options.push('h2');
  if (items[0].hasAttribute('data-cmp-expanded') && items[0].getAttribute('data-cmp-expanded') !== 'false') options.push('expand-first');
  if (acc.hasAttribute('data-cmp-single-expansion')) options.push('single');
  const w = widthOption(element, 'default', 'width');
  if (w) options.push(w);
  const wl = widthOption(element, 'large', 'width-lg');
  if (wl && wl.replace('width-lg', 'width') !== w) options.push(wl);
  // tablet (768-1023): its own source width (full width = width-md-12) when it differs from large
  const lgCols = Number((wl || w).replace(/\D+/g, '')) || 12;
  const mdCols = Math.round(gridFraction(element, 'medium') * 12);
  if (mdCols >= 4 && mdCols !== lgCols) options.push(`width-md-${Math.min(12, mdCols)}`);

  const cells = [];
  items.forEach((it) => {
    const titleEl = it.querySelector('.cmp-accordion__title');
    if (!titleEl) return;
    const title = cleanInline(document, titleEl);
    title.querySelectorAll('sup').forEach((s) => { if (!s.textContent.trim()) s.remove(); });
    const titleCell = document.createElement('div');
    titleCell.append(...title.childNodes);
    if (!titleCell.textContent.trim()) return;
    const panel = it.querySelector('.cmp-accordion__panel, [data-cmp-hook-accordion="panel"]');
    let content = [];
    if (panel) {
      normalizeNested(document, panel);
      content = defaultContent(document, panel, element).content;
      if (!content.length && panel.textContent.trim()) {
        // loose markup without AEM components
        panel.querySelectorAll('p, ul, ol, h3, h4, h5, h6').forEach((n) => {
          if (!n.parentElement.closest('p, ul, ol')) content.push(cleanInline(document, n));
        });
      }
    }
    cells.push([titleCell, divCell(document, content)]);
  });
  if (!cells.length) return;
  replaceWithBlock(document, element, blockName('Accordion', options), cells);
}
