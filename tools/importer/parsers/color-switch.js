/* eslint-disable */
/* global WebImporter */
// Parser for block "color-switch" (source: .colorswitch.aem-GridColumn, cmp-colorswitch exterior/interior).
// Block "Color Switch (exterior|interior)". Rows, per vehicle (several vehicles = arrows next to the title):
//   [vehicle title]                                   (single text cell, starts a vehicle)
//   [swatch image | colour name (+ availability note) | car images: desktop, mobile, tablet
//     [| hotspot layer: image, h3, text (opened by the "+" hotspot on the car)]]   one row per colour
//   [CTA link]                                        ("Mehr Farben entdecken" -> configurator)
import { replaceWithBlock, cell, text, imgEl, normalizeImageUrl } from './_utils.js';
import { blockName, cleanInline } from './_media.js';
import { para } from './_vehicle.js';

export const selectors = ['.colorswitch.aem-GridColumn'];

/** desktop (1280-1920), mobile (360-767 portrait), tablet (768-1023 portrait) URLs of a colour image. */
function carImages(document, pic, alt) {
  if (!pic) return [];
  const bySrc = {};
  pic.querySelectorAll('source').forEach((s) => {
    const media = s.getAttribute('media') || '';
    const url = normalizeImageUrl(s.getAttribute('srcset') || '');
    if (!url) return;
    if (/min-width:\s*1280px/.test(media)) bySrc.desktop = url;
    else if (/min-width:\s*360px/.test(media) && /portrait/.test(media)) bySrc.mobile = url;
    else if (/min-width:\s*768px/.test(media) && /portrait/.test(media)) bySrc.tablet = url;
    else if (/min-width:\s*1024px/.test(media)) bySrc.desktop = bySrc.desktop || url;
  });
  const img = pic.querySelector('img');
  if (!bySrc.desktop && img) bySrc.desktop = normalizeImageUrl(img.getAttribute('src') || '');
  const seen = new Set();
  return [bySrc.desktop, bySrc.mobile, bySrc.tablet].filter((u) => u && !seen.has(u) && seen.add(u))
    .map((u) => para(document, imgEl(document, u, alt)));
}

function slideoutNodes(document, wrapper) {
  if (!wrapper) return [];
  const out = [];
  const img = wrapper.querySelector('.cmp-colorswitchitem__slideout-image img');
  if (img) out.push(para(document, imgEl(document, normalizeImageUrl(img.getAttribute('src') || ''), img.getAttribute('alt') || '')));
  const t = text(wrapper.querySelector('.cmp-colorswitchitem__slideout-title'));
  if (t) { const h = document.createElement('h3'); h.textContent = t; out.push(h); }
  const body = wrapper.querySelector('.cmp-colorswitchitem__slideout-text');
  if (body) {
    [...body.children].forEach((c) => { if (text(c)) out.push(cleanInline(document, c)); });
    if (!body.children.length && text(body)) out.push(para(document, document.createTextNode(text(body))));
  }
  return out;
}

export default function parse(element, { document }) {
  const root = element.querySelector('.cmp-colorswitch');
  if (!root) return;
  const variant = /--interior/.test(root.className) ? 'interior' : 'exterior';
  let titles = [];
  try { titles = JSON.parse(root.querySelector('.cmp-colorswitch__title')?.getAttribute('data-vehicle-titles') || '[]'); } catch (e) { titles = []; }
  let items = [...root.querySelectorAll('[data-cmp-hook-colorswitch="item"]')];
  if (!items.length) items = [...root.querySelectorAll('.cmp-colorswitchitem__content')];
  const cells = [];
  const opts = [variant];
  items.forEach((item, idx) => {
    const title = (titles[idx] || (idx === 0 ? text(root.querySelector('.cmp-colorswitch__title')) : '') || '').trim();
    if (title) cells.push([title]);
    const content = item.querySelector('.cmp-colorswitchitem__content') || item;
    const hotspot = content.querySelector('.cmp-colorswitchitem__hotspot-button');
    if (hotspot) {
      const pos = (hotspot.className.match(/hotspot-button--([a-z]+-[a-z]+)/) || [])[1];
      if (pos && pos !== 'middle-center') opts.push(`hotspot-${pos}`);
    }
    const slideouts = [...content.querySelectorAll('.cmp-colorswitchitem__slideout-wrapper')];
    content.querySelectorAll('.cmp-colorswitchitem__swatch').forEach((sw, i) => {
      const index = sw.getAttribute('data-index') || String(i);
      const swImg = sw.querySelector('img');
      const swatch = swImg ? imgEl(document, normalizeImageUrl(swImg.getAttribute('src') || ''), '') : null;
      const name = (sw.getAttribute('data-name') || '').trim();
      const nameCell = [para(document, document.createTextNode(name))];
      const note = (sw.getAttribute('data-disclaimer') || '').trim();
      if (note) nameCell.push(para(document, document.createTextNode(note)));
      const imgWrap = content.querySelector(`.cmp-colorswitchitem__image[data-index="${index}"]`)
        || content.querySelectorAll('.cmp-colorswitchitem__image')[i];
      const alt = ((imgWrap && imgWrap.querySelector('img')?.getAttribute('alt')) || '').trim().replace(/^in\s+/, `${title} in `);
      const row = [cell(document, swatch ? [swatch] : []), cell(document, nameCell), cell(document, carImages(document, imgWrap && imgWrap.querySelector('picture'), alt))];
      const so = slideouts.find((s) => s.getAttribute('data-index') === index) || (slideouts.length === 1 && hotspot ? slideouts[0] : null);
      const soNodes = hotspot ? slideoutNodes(document, so) : [];
      if (soNodes.length) row.push(cell(document, soNodes));
      cells.push(row);
    });
    const cta = content.querySelector('a.cmp-colorswitchitem__cta-button');
    if (cta && cta.getAttribute('href')) {
      const a = document.createElement('a');
      a.href = cta.getAttribute('href');
      a.textContent = text(cta.querySelector('.cmp-button__text') || cta);
      cells.push([para(document, a)]);
    }
  });
  if (!cells.length) return;
  replaceWithBlock(document, element, blockName('Color Switch', opts), cells);
}
