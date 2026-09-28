/* eslint-disable */
/* global WebImporter */
// Parser for block "hero-teaser" (source: .backgroundmedia.aem-GridColumn, AEM backgroundmedia-v2).
// With overlay text -> "Hero Teaser" (hero convention, 1 column):
//   row 1 (media): desktop/mobile/tablet images, or poster images + desktop/mobile video links
//   row 2 (content): heading(s), paragraphs, CTAs
//   options: text position (center|end, top|middle|bottom), cols-N (text width in 12ths),
//   text-top-N / text-bottom-N (spacing of the text box), cta-top-N / cta-bottom-N (spacing
//   around the CTA row), cta-stack-md (CTAs stacked on tablet), sub-top-N (spacing above the
//   text after the headline),
//   gradient-left|oblique|top|right|bottom, ai-label, contained (not full-bleed), text-start
//   (text start-aligned below 1024px instead of centred), and for video
//   media: no-autoplay, loop, no-play-button, ratio-W-H, mobile-ratio-W-H
// Without overlay text -> "Media" (full-width image or video): one row with the media cell.
import { replaceWithBlock } from './_utils.js';
import {
  mediaNodes, contentNodes, autoplayVideoOptions, blockName, divCell, isHiddenIn,
} from './_media.js';

export const selectors = ['.backgroundmedia.aem-GridColumn'];

const H_POS = ['start', 'center', 'end'];
const V_POS = ['top', 'middle', 'bottom'];

export default function parse(element, { document }) {
  const bm = element.querySelector('.cmp-backgroundmedia');
  if (!bm) return;
  const overlay = bm.querySelector('.cmp-backgroundmedia__overlay');
  // media = everything except the overlay
  const mediaRoot = [...bm.children].find((c) => c !== overlay && c.querySelector('picture, img, video')) || bm;
  const media = mediaNodes(document, mediaRoot);
  const options = [];
  const extras = []; // nested block tables found in the content, placed after the block
  if (bm.querySelector('[class*="__ai-label"]')) options.push('ai-label');
  options.push(...autoplayVideoOptions(media.video));
  if (media.video) {
    if (media.video.ratioLarge) options.push(`ratio-${media.video.ratioLarge}`);
    if (media.video.ratioSmall && media.video.ratioSmall !== media.video.ratioLarge) options.push(`mobile-ratio-${media.video.ratioSmall}`);
  }
  if (!/style-backgroundmedia--fullwidth/.test(element.className)) options.push('contained');

  const hasText = overlay && [...overlay.querySelectorAll('.title, .text, .button')]
    .some((c) => !isHiddenIn(c, overlay) && c.textContent.trim());

  if (!hasText) {
    // background media without text: full-width responsive image / video
    if (!media.hasMedia) return;
    replaceWithBlock(document, element, blockName('Media', options), [[divCell(document, media.nodes)]]);
    return;
  }

  // text position/width from the first overlay container
  const box = overlay.querySelector('.container.aem-GridColumn');
  if (box) {
    const cls = box.className;
    const h = H_POS.find((p) => cls.includes(`style-container--${p}`));
    const v = V_POS.find((p) => cls.includes(`style-container--${p}`));
    if (h && h !== 'start') options.push(h);
    if (v) options.push(v);
    // mobile/tablet (text under the media): the source centres the text, except in a flex
    // column container aligned to the start (cmp-container--layout-flex + flex-align-flex-start:
    // live keeps title, text and CTAs start-aligned there)
    const titleCol = [...overlay.querySelectorAll('.title')].find((t) => !isHiddenIn(t, overlay));
    const titleBox = titleCol && titleCol.closest('.cmp-container');
    const tb = titleBox ? titleBox.className : '';
    if (h !== 'center' && /cmp-container--layout-flex/.test(tb) && /cmp-container--flex-align-flex-start/.test(tb)
      && titleBox !== overlay.querySelector(':scope > .cmp-container')) options.push('text-start');
    const w = (cls.match(/aem-GridColumn--default--(\d+)/) || [])[1];
    if (w && Number(w) < 12) options.push(`cols-${w}`);
    // spacing of the positioned text box (source margin on style-container--top/bottom: moves
    // the text away from the media edge on desktop, adds space under the text on mobile/tablet)
    const mt = (cls.match(/cmp-spacing-top-(\d+)/) || [])[1];
    const mb = (cls.match(/cmp-spacing-bottom-(\d+)/) || [])[1];
    if (mt) options.push(`text-top-${mt}`);
    if (mb) options.push(`text-bottom-${mb}`);
    // spacing below the CTA row (source: spacing-bottom of the container holding the buttons;
    // the block default equals spacing-bottom-12)
    const ctaBox = [...box.querySelectorAll('.container')].reverse()
      .find((c) => c.querySelector(':scope > .cmp-container > .aem-Grid > .button'));
    const cb = ctaBox && (ctaBox.className.match(/cmp-spacing-bottom-(\d+)/) || [])[1];
    if (cb && cb !== '12') options.push(`cta-bottom-${cb}`);
    // spacing above the CTA row and above the first text after the headline
    const ct = ctaBox && (ctaBox.className.match(/cmp-spacing-top-(\d+)/) || [])[1];
    if (ct) options.push(`cta-top-${ct}`);
    // tablet: CTAs whose medium grid widths (+ offsets) exceed the row are stacked in the source
    if (ctaBox) {
      const grid = ctaBox.querySelector(':scope > .cmp-container > .aem-Grid');
      const size = Number(((grid && grid.className.match(/aem-Grid--medium--(\d+)/)) || [])[1] || 12);
      const btns = [...ctaBox.querySelectorAll(':scope > .cmp-container > .aem-Grid > .button')];
      const md = btns.reduce((sum, b) => {
        const w = Number((b.className.match(/aem-GridColumn--medium--(\d+)(?=\s|$)/) || [])[1] || 0);
        const o = Number((b.className.match(/aem-GridColumn--offset--medium--(\d+)/) || [])[1] || 0);
        return sum + w + o;
      }, 0);
      if (btns.length > 1 && md > size) options.push('cta-stack-md');
    }
    const sub = [...box.querySelectorAll('.text')].find((t) => {
      const prev = t.previousElementSibling;
      return prev && prev.classList.contains('title') && !isHiddenIn(t, overlay);
    });
    const st = sub && (sub.className.match(/cmp-spacing-top-(\d+)/) || [])[1];
    if (st) options.push(`sub-top-${st}`);
  }
  // subline typography: a second title in headline-2/3 style (default: subsection-1 size)
  const titles = overlay ? [...overlay.querySelectorAll('.title')].filter((t) => !isHiddenIn(t, overlay) && t.textContent.trim()) : [];
  const subStyle = titles[1] && (titles[1].className.match(/style-title--headline-([23])(?=\s|$)/) || [])[1];
  if (subStyle) options.push(`sub-headline-${subStyle}`);
  const gradient = mediaRoot.querySelector('.cmp-gradient');
  if (gradient) {
    const g = (gradient.className.match(/cmp-gradient--(left|oblique|top|right|bottom)/) || [])[1];
    if (g) options.push(`gradient-${g}`);
  }

  // titles marked up as <p> in the source (e.g. a subsection-1 subline under the H1, or a
  // headline-2 stage title) keep their title typography: emitted as headings (the block styles
  // the first heading as the title, later ones as sublines). Model branding (iconization /
  // stage-model) stays paragraphs.
  let level = 1;
  [...overlay.querySelectorAll('.title')].forEach((t) => {
    const x = t.querySelector('.cmp-title__text');
    if (!x) return;
    if (/^H[1-6]$/.test(x.tagName)) { level = Number(x.tagName[1]); return; }
    if (x.tagName !== 'P' || !/style-title--(headline|subsection)-\d/.test(t.className)) return;
    level = Math.min(6, Math.max(2, level + 1));
    const hx = document.createElement(`h${level}`);
    hx.className = x.className;
    hx.append(...x.childNodes);
    x.replaceWith(hx);
  });
  const content = contentNodes(document, overlay, element, extras);
  const block = replaceWithBlock(document, element, blockName('Hero Teaser', options), [
    [divCell(document, media.nodes)],
    [divCell(document, content)],
  ]);
  if (extras.length) block.after(...extras);
}
