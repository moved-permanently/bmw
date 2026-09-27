/* eslint-disable */
/* global WebImporter */
// Parser for block "carousel" (source: .carousel.aem-GridColumn, AEM carousel-v1 / Swiper).
// 2 columns, one row per slide: cell 1 = media (desktop, mobile[, tablet] images, or poster
// image(s) + desktop/mobile video links; empty when the slide has no leading media), cell 2 =
// text content (heading, paragraphs, CTAs; inner images/icons stay in place; disclaimer text
// paragraphs are wrapped in <sub> so the block can style them as footnotes).
// Options: slides-M-T-D-X (slides per view mobile/tablet/desktop/desktop-xl, default 1-1-3-4),
// no-arrows, no-pagination, center (centered slide texts), body-2 (body text in the smaller body size; a
// paragraph right below a disclaimer label keeps body-1 — source offer cards: label + value), cards (grey card slides, whole card clickable via the last plain
// link), large-titles | small-titles (headline-3 / subsection-2 slide titles; p titles become h3); videos: autoplay, hover-play, loop, controls, no-play-button, ratio-W-H, mobile-ratio-W-H.
// Nested components are flattened (icons -> :icon:, embeds -> image, inner block tables -> text).
import { replaceWithBlock } from './_utils.js';
import { mediaNodes, blockName, divCell } from './_media.js';
import { normalizeNested, defaultContent, topComponents, titleStyle } from './_nested.js';

// non-grid carousels placed directly in a top-level container (not inside another component such as tabs or
// model offer, whose parsers handle their own carousels)
export const selectors = ['.carousel.aem-GridColumn', '.cmp-container > .carousel.panelcontainer:not(.aem-GridColumn):not(.aem-GridColumn:not(.container) *)'];

const DEFAULT_SLIDES = ['1', '1', '3', '4'];
const MEDIA = '.image, .video, .onemedia';

function leadingMedia(slide) {
  const comps = topComponents(slide, `${MEDIA}, .title, .text, .button`);
  const first = comps[0];
  if (!first || !first.matches(MEDIA)) return null;
  return first;
}

const textKind = (c) => {
  if (!c.matches('.text')) return 'o';
  if (/style-text--disclaimer/.test(c.className)) return 'd';
  return /style-text--body-1(?=\s|$)/.test(c.className) ? 'b1' : 'b2';
};

/**
 * Whether the "body-2" rule (body-2 text, body-1 right after a disclaimer label) reproduces the
 * source text sizes better than the default (all body-1).
 */
function prefersBody2(slides) {
  let rule = 0;
  let def = 0;
  slides.forEach((slide) => {
    let prev = 'o';
    topComponents(slide, `${MEDIA}, .title, .text, .button`).forEach((c) => {
      const k = textKind(c);
      if ((k === 'b1' || k === 'b2') && c.textContent.trim()) {
        if (k === (prev === 'd' ? 'b1' : 'b2')) rule += 1;
        if (k === 'b1') def += 1;
      }
      if (k !== 'd' || c.textContent.trim()) prev = k;
    });
  });
  return rule > def;
}

/** Slide texts centered (source style-container--center around the slide texts). */
function isCentered(slides) {
  return slides.every((s) => {
    const t = s.querySelector('.title, .text');
    const cen = t && t.closest('.style-container--center');
    return !!cen && s.contains(cen);
  });
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
  if (isCentered(slides)) options.push('center');
  if (prefersBody2(slides)) options.push('body-2');
  // slide title typography (default subsection-1)
  const ts = titleStyle(slides.find((s) => s.querySelector('.title')) || null);
  if (/^headline-[1-3]$/.test(ts)) options.push('large-titles');
  else if (ts === 'subsection-2') options.push('small-titles');

  let videoOpts = null;
  const rows = [];
  slides.forEach((slide) => {
    normalizeNested(document, slide);
    // offer card flags (style-title--flag) -> emphasis-only paragraph before the card title
    if (options.includes('cards')) {
      topComponents(slide, '.title').filter((t) => /style-title--flag/.test(t.className)).forEach((t) => {
        const label = (t.querySelector('.cmp-title__text') || t).textContent.replace(/\s+/g, ' ').trim();
        if (!label) return;
        const comp = document.createElement('div');
        comp.className = 'text';
        const inner = document.createElement('div');
        inner.className = 'cmp-text';
        const p = document.createElement('p');
        const em = document.createElement('em');
        em.textContent = label;
        p.append(em);
        inner.append(p);
        comp.append(inner);
        t.replaceWith(comp);
      });
    }
    const mediaComp = leadingMedia(slide);
    let media = { nodes: [], video: null };
    if (mediaComp) {
      const vid = mediaComp.querySelector('video');
      media = mediaNodes(document, mediaComp);
      // EU AI label on the slide image -> ":ai_eu_label:" marker paragraph in the media cell
      if (media.nodes.length && mediaComp.querySelector('[class*="__ai-label"]')) {
        const mark = document.createElement('p');
        mark.textContent = ':ai_eu_label:';
        media.nodes = [...media.nodes, mark];
      }
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
