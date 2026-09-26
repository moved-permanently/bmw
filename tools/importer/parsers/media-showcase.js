/* eslint-disable */
/* global WebImporter */
// Parser for block "media-showcase" (source: .mediashowcase.aem-GridColumn, AEM mediashowcase-v1).
// 2 columns, one row per showcase item: cell 1 = media (desktop, mobile[, tablet] images, or poster
// image(s) + desktop/mobile video links), cell 2 = item title (h3) + description paragraphs.
// Options: interior (dark "interior" showcase: headline + control bar with pagination and sound;
// default is the "exterior" showcase with a glass panel listing all item titles),
// intro (interior only: the FIRST row is the intro media, its cell 2 holds the intro title as h2).
import { replaceWithBlock, text } from './_utils.js';
import { mediaNodes, cleanInline, blockName, divCell } from './_media.js';

export const selectors = ['.mediashowcase.aem-GridColumn'];

function heading(document, tag, node) {
  const h = document.createElement(tag);
  if (!node) return h;
  const clean = cleanInline(document, node);
  h.append(...clean.childNodes);
  // collapse whitespace of the text nodes
  [...h.childNodes].forEach((n) => { if (n.nodeType === 3) n.nodeValue = n.nodeValue.replace(/\s+/g, ' '); });
  if (h.firstChild && h.firstChild.nodeType === 3) h.firstChild.nodeValue = h.firstChild.nodeValue.replace(/^\s+/, '');
  if (h.lastChild && h.lastChild.nodeType === 3) h.lastChild.nodeValue = h.lastChild.nodeValue.replace(/\s+$/, '');
  return h;
}

function description(document, info) {
  const desc = info && info.querySelector('.cmp-mediashowcase__description');
  if (!desc) return [];
  const out = [];
  [...desc.children].forEach((c) => {
    if (/^(P|UL|OL)$/.test(c.tagName)) {
      const n = cleanInline(document, c);
      if (n.textContent.replace(/ /g, ' ').trim()) out.push(n);
    } else if (text(c)) {
      const p = document.createElement('p');
      p.append(...cleanInline(document, c).childNodes);
      out.push(p);
    }
  });
  if (!out.length && text(desc)) {
    const p = document.createElement('p');
    p.textContent = text(desc);
    out.push(p);
  }
  return out;
}

export default function parse(element, { document }) {
  const c = element.querySelector('.cmp-mediashowcase');
  if (!c) return;
  const interior = c.classList.contains('cmp-mediashowcase__interior') || c.classList.contains('cmp-mediashowcase__interiormini');
  const slides = [...c.querySelectorAll('.cmp-mediashowcase__slide')];
  const infos = [...c.querySelectorAll('.cmp-mediashowcase__info-wrapper')];
  if (!slides.length) return;

  const options = [];
  if (interior) options.push('interior');
  const rows = [];

  const introMedia = c.querySelector('.cmp-mediashowcase__intro-media');
  if (interior && introMedia) {
    const media = mediaNodes(document, introMedia);
    if (media.hasMedia) {
      const title = c.querySelector('.cmp-mediashowcase__intro-title');
      const content = [];
      if (title && text(title)) content.push(heading(document, 'h2', title));
      rows.push([divCell(document, media.nodes), divCell(document, content)]);
      options.push('intro');
    }
  }

  slides.forEach((slide, i) => {
    const media = mediaNodes(document, slide);
    const info = infos[i];
    const content = [];
    if (info) {
      const t = info.querySelector('.cmp-mediashowcase__headline') || info.querySelector('.cmp-mediashowcase__bullet')
        || info.querySelector('.cmp-mediashowcase__info-header');
      if (t && text(t)) content.push(heading(document, 'h3', t));
      content.push(...description(document, info));
    }
    if (!media.hasMedia && !content.length) return;
    rows.push([divCell(document, media.nodes), divCell(document, content)]);
  });
  if (!rows.length) return;
  replaceWithBlock(document, element, blockName('Media Showcase', options), rows);
}
