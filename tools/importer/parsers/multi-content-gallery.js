/* eslint-disable */
/* global WebImporter */
// Parser for block "multi-content-gallery" (source: .multicontentgallery, AEM multicontentgallery-v1:
// a media slider (fade) coupled with a slider of text cards).
// 2 columns, one row per item: cell 1 = media (desktop, mobile[, tablet] images, or poster image(s)
// + desktop/mobile video links), cell 2 = card content (h3 title, paragraphs/lists, CTA paragraphs).
// Options (videos; default muted autoplay without loop, progressive play button): no-autoplay, loop,
// no-play-button; large-titles (card titles subsection-1 instead of subsection-2).
// Also called by the tabs parser for galleries placed directly in a tab panel.
import { replaceWithBlock } from './_utils.js';
import { mediaNodes, blockName, divCell, autoplayVideoOptions } from './_media.js';
import { normalizeNested, defaultContent } from './_nested.js';

// also matches galleries nested in containers of tab panels (no grid column class there)
export const selectors = ['.multicontentgallery'];

export default function parse(element, { document }) {
  const c = element.querySelector('.cmp-multi-content');
  if (!c) return;
  const mediaSlides = [...c.querySelectorAll('.cmp-multi-content__slider--media .cmp-multi-content__slide, .cmp-multi-content__slider--media swiper-slide')];
  const contentSlides = [...c.querySelectorAll('.cmp-multi-content__slider--content .cmp-multi-content__slide, .cmp-multi-content__slider--content swiper-slide')];
  const uniq = (list) => list.filter((s, i) => list.indexOf(s) === i);
  const medias = uniq(mediaSlides);
  const contents = uniq(contentSlides);
  const count = Math.max(medias.length, contents.length);
  if (!count) return;

  let video = null;
  const rows = [];
  for (let i = 0; i < count; i += 1) {
    const m = medias[i] ? mediaNodes(document, medias[i]) : { nodes: [], video: null };
    if (m.video && !video) video = m.video;
    let content = [];
    const slide = contents[i];
    if (slide) {
      // the collapsed desktop tile repeats the title in a button: drop it
      slide.querySelectorAll('.cmp-multi-content-item__expand, .cmp-multi-content-item__content-toggle').forEach((b) => b.remove());
      normalizeNested(document, slide);
      content = defaultContent(document, slide, element, { pTitle: 'h3' }).content.map((n) => {
        if (!/^H[1-6]$/.test(n.tagName)) return n;
        // card titles are h3 whatever the source heading level
        const h = document.createElement('h3');
        h.append(...n.childNodes);
        return h;
      });
      content.forEach((n) => {
        const first = n.firstChild;
        const last = n.lastChild;
        if (first && first.nodeType === 3) first.nodeValue = first.nodeValue.replace(/^\s+/, '');
        if (last && last.nodeType === 3) last.nodeValue = last.nodeValue.replace(/\s+$/, '');
      });
    }
    if (!m.nodes.length && !content.length) continue;
    rows.push([divCell(document, m.nodes), divCell(document, content)]);
  }
  if (!rows.length) return;
  // card title typography: subsection-2 (default) or subsection-1 (large-titles), by majority
  const styles = [...c.querySelectorAll('.cmp-multi-content__slider--content .title')]
    .map((t) => ((t.className || '').match(/style-title--(subsection-[12])/) || [])[1]).filter(Boolean);
  const large = styles.filter((st) => st === 'subsection-1').length * 2 > styles.length;
  const options = [...autoplayVideoOptions(video), large ? 'large-titles' : ''];
  replaceWithBlock(document, element, blockName('Multi Content Gallery', options), rows);
}
