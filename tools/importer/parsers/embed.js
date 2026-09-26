/* eslint-disable */
/* global WebImporter */
// Parser for block "embed" (source: .embed.aem-GridColumn, cmp-embed). Source embed types:
//  - iframe (webservice.bmw.de calculators / interactive map, vehiclerecall.bmwgroup.com, podigee podcast)
//      -> "Embed" block (EDS convention: 1 column, 1 row, a single cell with the URL of the content).
//         The link title carries the accessible iframe title.
//         options: auto-height (source iframeheightmode resizer/autoHeight: iframe-resizer protocol),
//                  height-N (fixed height in px, source iframeheightmode manual)
//  - COSY car renderings (picture.cmp-cosyimage, prod.cosy.bmw.cloud) -> plain image component, so that it
//      becomes a default-content image (or an image inside the surrounding carousel/teaser parser)
//  - Scene7 viewer script only (no markup, e.g. weltcup) -> left alone (renders nothing on the source)
import { replaceWithBlock, absUrl } from './_utils.js';

export const selectors = ['.embed.aem-GridColumn'];

function embedBlock(document, element, iframe) {
  const src = iframe.getAttribute('data-src') || iframe.getAttribute('src') || '';
  if (!src || src.startsWith('javascript:')) return;
  const url = absUrl(src.replace(/&amp;/g, '&'));
  const title = (iframe.getAttribute('title') || iframe.getAttribute('aria-label') || '').trim();
  const link = document.createElement('a');
  link.href = url;
  link.textContent = url;
  if (title && title !== 'iframe title') link.title = title;
  const options = [];
  const mode = (iframe.getAttribute('iframeheightmode') || '').toLowerCase();
  const height = parseInt(iframe.getAttribute('height') || '', 10);
  if (mode === 'resizer' || mode === 'autoheight') options.push('auto-height');
  else if (height > 0) options.push(`height-${height}`);
  const name = options.length ? `Embed (${options.join(', ')})` : 'Embed';
  replaceWithBlock(document, element, name, [[link]]);
}

function cosyImage(document, element, picture) {
  // re-type the component as an AEM image so the default-content / media parsers treat it as one
  const img = picture.querySelector('img');
  const src = img && (img.getAttribute('src') || img.getAttribute('data-src'));
  if (!src) return;
  const holder = document.createElement('div');
  holder.className = element.className
    .replace(/(^|\s)embed(\s|$)/, '$1image$2')
    .replace(/style-embed--\S+/g, '');
  const inner = document.createElement('div');
  inner.className = 'cmp-image';
  const out = document.createElement('img');
  out.src = absUrl(src);
  out.alt = (img.getAttribute('alt') || '').trim();
  inner.append(out);
  holder.append(inner);
  element.replaceWith(holder);
}

export default function parse(element, { document }) {
  const cmp = element.querySelector('.cmp-embed') || element;
  const iframe = cmp.querySelector('iframe');
  if (iframe) {
    embedBlock(document, element, iframe);
    return;
  }
  const picture = cmp.querySelector('picture.cmp-cosyimage, picture');
  if (picture) cosyImage(document, element, picture);
}
