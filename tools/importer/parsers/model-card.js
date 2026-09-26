/* eslint-disable */
/* global WebImporter */
// Parser for block "model-card" (source: .modelcard.aem-GridColumn, cmp-modelhubcard).
// Table: row 1 = [series name (+ subtitle paragraph) | car image(s): front view[, back view shown on hover]]
// optional row 2 = USP list. Options from source styles: ratio-3x2|4x3|16x9|21x9, light|transparent
// (background), text-left|text-center|text-right (series name alignment).
import { replaceWithBlock, cell, text, imgEl, normalizeImageUrl } from './_utils.js';
import { blockName } from './_media.js';
import { cosyImg } from './_vehicle.js';

export const selectors = ['.modelcard.aem-GridColumn'];

export function modelCardImages(document, root) {
  const imgs = [];
  root.querySelectorAll('.cmp-modelhubcard__image').forEach((wrap) => {
    const el = cosyImg(document, wrap);
    if (!el) return;
    const p = document.createElement('p');
    const a = wrap.querySelector('a[href]');
    if (a) {
      const link = document.createElement('a');
      link.href = a.getAttribute('href');
      link.append(el);
      p.append(link);
    } else p.append(el);
    imgs.push(p);
  });
  return imgs;
}

export default function parse(element, { document }) {
  const root = element.querySelector('.cmp-modelhubcard');
  if (!root) return;
  const cls = element.className || '';
  const opts = [];
  const ratio = cls.match(/style-modelhubcard__ratio--(\w+)/);
  if (ratio) opts.push(`ratio-${ratio[1]}`);
  const bg = cls.match(/style-modelhubcard__background--(transparent|light)/);
  if (bg) opts.push(bg[1]);
  const align = cls.match(/style-modelhubcard__background-text--(left|center|right)/);
  if (align) opts.push(`text-${align[1]}`);

  const nameCell = [];
  const series = text(root.querySelector('.cmp-modelhubcard__seriesname'));
  const subtitle = text(root.querySelector('.cmp-modelhubcard__seriessubtitle'));
  if (series) { const p = document.createElement('p'); p.textContent = series; nameCell.push(p); }
  if (subtitle) { const p = document.createElement('p'); p.textContent = subtitle; nameCell.push(p); }
  const imgs = modelCardImages(document, root);
  if (!imgs.length && !series) return;
  const cells = [[cell(document, nameCell), cell(document, imgs)]];
  const usps = [...root.querySelectorAll('.cmp-modelhubcard__usp-item')].map((li) => text(li)).filter(Boolean);
  if (usps.length) {
    const ul = document.createElement('ul');
    usps.forEach((u) => { const li = document.createElement('li'); li.textContent = u; ul.append(li); });
    cells.push([ul]);
  }
  replaceWithBlock(document, element, blockName('Model Card', opts), cells);
}
