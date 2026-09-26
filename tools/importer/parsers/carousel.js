/* eslint-disable */
/* global WebImporter */
// Parser for block "carousel" (source: .carousel.aem-GridColumn, AEM carousel-v1 / Swiper).
// 2 columns, one row per slide: cell 1 = media (desktop, mobile[, tablet] images, or poster
// image(s) + desktop/mobile video links; empty when the slide has no leading media), cell 2 =
// text content (heading, paragraphs, CTAs; inner images/icons stay in place; disclaimer text
// paragraphs are wrapped in <sub> so the block can style them as footnotes).
// Options: slides-M-T-D-X (slides per view mobile/tablet/desktop/desktop-xl, default 1-1-3-4),
// no-arrows, no-pagination, cards (grey card slides, whole card clickable via the last plain
// link), large-titles | small-titles (headline-3 / subsection-2 slide titles; p titles become h3); videos: autoplay, hover-play, loop, controls, no-play-button, ratio-W-H, mobile-ratio-W-H.
// Nested components are flattened (icons -> :icon:, embeds -> image, inner block tables -> text).
import { replaceWithBlock } from './_utils.js';
import { mediaNodes, blockName, divCell } from './_media.js';
import { normalizeNested, defaultContent, topComponents, titleStyle } from './_nested.js';

export const selectors = ['.carousel.aem-GridColumn'];

const DEFAULT_SLIDES = ['1', '1', '3', '4'];
const MEDIA = '.image, .video, .onemedia';

function leadingMedia(slide) {
  const comps = topComponents(slide, `${MEDIA}, .title, .text, .button`);
  const first = comps[0];
  if (!first || !first.matches(MEDIA)) return null;
  return first;
}

/** Disclaimer paragraphs as <p><sub>…</sub></p> (lists are kept as they are). */
function footnotes(document, nodes, disclaimers) {
  return nodes.map((n) => {
    if (n.tagName !== 'P' || !disclaimers.includes(n)) return n;
    const p = document.createElement('p');
    const sub = document.createElement('sub');
    sub.append(...n.childNodes);
    p.append(sub);
    return p;
  });
}

export default function parse(element, { document }) {
  const c = element.querySelector('.cmp-carousel');
  if (!c) return;
  const slides = [...c.querySelectorAll('.swiper-slide')]
    .filter((s) => s.closest('.cmp-carousel') === c && !(s.parentElement && s.parentElement.closest('.swiper-slide')));
  if (!slides.length) return;

  const options = [];
  const slidesCfg = ['data-mobile-slides', 'data-tablet-slides', 'data-desktop-slides', 'data-desktopxl-slides']
    .map((a, i) => (/^\d+$/.test(c.getAttribute(a) || '') ? c.getAttribute(a) : DEFAULT_SLIDES[i]));
  if (slidesCfg.join('-') !== DEFAULT_SLIDES.join('-')) options.push(`slides-${slidesCfg.join('-')}`);
  if (c.getAttribute('data-cmp-arrow-navigation') !== 'true') options.push('no-arrows');
  const sw = c.querySelector('.swiper');
  if (sw && sw.classList.contains('cmp-carousel__no-pagination')) options.push('no-pagination');
  if (slides.some((s) => s.querySelector('.style-container--secondary'))) options.push('cards');
  // slide title typography (default subsection-1)
  const ts = titleStyle(slides.find((s) => s.querySelector('.title')) || null);
  if (/^headline-[1-3]$/.test(ts)) options.push('large-titles');
  else if (ts === 'subsection-2') options.push('small-titles');

  let videoOpts = null;
  const rows = [];
  slides.forEach((slide) => {
    normalizeNested(document, slide);
    const mediaComp = leadingMedia(slide);
    let media = { nodes: [], video: null };
    if (mediaComp) {
      const vid = mediaComp.querySelector('video');
      media = mediaNodes(document, mediaComp);
      if (media.video && !videoOpts) {
        const v = media.video;
        videoOpts = [];
        if (v.autoplay) videoOpts.push('autoplay');
        else if (vid && vid.hasAttribute('data-is-autoplayonhover')) videoOpts.push('hover-play');
        if (v.loop) videoOpts.push('loop');
        if (v.controls) videoOpts.push('controls');
        else if (!v.playButton) videoOpts.push('no-play-button');
        if (v.ratioLarge) videoOpts.push(`ratio-${v.ratioLarge}`);
        if (v.ratioSmall && v.ratioSmall !== v.ratioLarge) videoOpts.push(`mobile-ratio-${v.ratioSmall}`);
      }
      mediaComp.remove();
    }
    const { content, disclaimers } = defaultContent(document, slide, element, { pTitle: 'h3' });
    if (!media.nodes.length && !content.length) return;
    rows.push([divCell(document, media.nodes), divCell(document, footnotes(document, content, disclaimers))]);
  });
  if (!rows.length) return;
  if (videoOpts) options.push(...videoOpts);
  replaceWithBlock(document, element, blockName('Carousel', options), rows);
}
