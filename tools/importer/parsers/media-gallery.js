/* eslint-disable */
/* global WebImporter */
// Parser for block "media-gallery" (source: .mediagallery.aem-GridColumn, AEM mediagallery-v1:
// auto-scrolling strip of portrait images with hover overlay and a lightbox) and standalone
// .onemedia components.
// Media Gallery: 2 columns, one row per item: cell 1 = image (desktop, mobile[, tablet]),
// cell 2 = h3 title + description paragraph (shown on hover, in the mobile caption and lightbox).
// Options: no-autoplay (source data-autoscroll-enabled="false").
// .onemedia: a single image/video. Inside other components (carousel slides, teasers, ...) it is left
// untouched for the parent's parser; a standalone one becomes a "Media (contained)" block.
import { replaceWithBlock, text } from './_utils.js';
import { mediaNodes, blockName, divCell, autoplayVideoOptions, cleanInline } from './_media.js';

export const selectors = ['.mediagallery.aem-GridColumn, .onemedia.aem-GridColumn'];

const PARENTS = '.cmp-carousel, .swiper, .cmp-accordion, .cmp-tabs, .cmp-cardlist, .cmp-textmediateaser, '
  + '.cmp-backgroundmedia, .cmp-stage, .cmp-multi-content, .cmp-mediashowcase, .cmp-mediagallery, .cmp-contentteaser, '
  + '.cmp-modelcard, .cmp-hotspotgallery, .cmp-bentogallery, .cmp-popover';

function parseOneMedia(element, document) {
  if (element.parentElement && element.parentElement.closest(PARENTS)) return;
  const media = mediaNodes(document, element);
  if (!media.hasMedia) return;
  replaceWithBlock(document, element, blockName('Media', ['contained', ...autoplayVideoOptions(media.video)]), [
    [divCell(document, media.nodes)],
  ]);
}

export default function parse(element, { document }) {
  if (element.classList.contains('onemedia')) {
    parseOneMedia(element, document);
    return;
  }
  const g = element.querySelector('.cmp-mediagallery');
  if (!g) return;
  const items = [...g.querySelectorAll('.cmp-media-gallery-item')];
  const rows = [];
  items.forEach((item) => {
    const mediaRoot = item.querySelector('.cmp-media-gallery-item__image, .cmp-media-gallery-item__video') || item;
    const media = mediaNodes(document, mediaRoot);
    const box = item.querySelector('.cmp-media-gallery-item__media');
    const content = [];
    const t = item.querySelector('.cmp-media-gallery-item__title');
    const titleText = t ? text(t) : (box && (box.getAttribute('aria-label') || '').trim());
    if (titleText) {
      const h = document.createElement('h3');
      if (t) h.append(...cleanInline(document, t).childNodes);
      else h.textContent = titleText;
      [...h.childNodes].forEach((n) => { if (n.nodeType === 3) n.nodeValue = n.nodeValue.replace(/\s+/g, ' '); });
      h.innerHTML = h.innerHTML.trim();
      content.push(h);
    }
    const d = item.querySelector('.cmp-media-gallery-item__text');
    const descText = d ? text(d) : (box && (box.getAttribute('aria-description') || '').trim());
    if (descText) {
      const p = document.createElement('p');
      if (d) p.append(...cleanInline(document, d).childNodes);
      else p.textContent = descText;
      p.innerHTML = p.innerHTML.trim();
      content.push(p);
    }
    if (!media.hasMedia && !content.length) return;
    rows.push([divCell(document, media.nodes), divCell(document, content)]);
  });
  if (!rows.length) return;
  const options = [];
  if (g.getAttribute('data-autoscroll-enabled') === 'false') options.push('no-autoplay');
  replaceWithBlock(document, element, blockName('Media Gallery', options), rows);
}
