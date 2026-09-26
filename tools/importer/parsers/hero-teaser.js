/* eslint-disable */
/* global WebImporter */
// Parser for block "hero-teaser" (source: .backgroundmedia.aem-GridColumn, AEM backgroundmedia-v2).
// With overlay text -> "Hero Teaser" (hero convention, 1 column):
//   row 1 (media): desktop/mobile/tablet images, or poster images + desktop/mobile video links
//   row 2 (content): heading(s), paragraphs, CTAs
//   options: text position (center|end, top|middle|bottom), cols-N (text width in 12ths),
//   gradient-left|oblique|top|right|bottom, ai-label, contained (not full-bleed), and for video
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
    const w = (cls.match(/aem-GridColumn--default--(\d+)/) || [])[1];
    if (w && Number(w) < 12) options.push(`cols-${w}`);
  }
  const gradient = mediaRoot.querySelector('.cmp-gradient');
  if (gradient) {
    const g = (gradient.className.match(/cmp-gradient--(left|oblique|top|right|bottom)/) || [])[1];
    if (g) options.push(`gradient-${g}`);
  }

  const content = contentNodes(document, overlay, element, extras);
  const block = replaceWithBlock(document, element, blockName('Hero Teaser', options), [
    [divCell(document, media.nodes)],
    [divCell(document, content)],
  ]);
  if (extras.length) block.after(...extras);
}
