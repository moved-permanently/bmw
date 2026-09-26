/* eslint-disable */
/* global WebImporter */
// Parser for block "text-media-teaser" (source: .textmediateaser.aem-GridColumn, textmediateaser-v1).
// 1 column: row 1 media (desktop/mobile/tablet images, or poster images + video links; omitted
// when the teaser has no media), row 2 content (heading, paragraphs, CTAs).
// Options: media-right (default media left), col-5-5 | col-6-4 | col-4-6 (media/text widths in
// 12ths), intro (special intro), section (special section: title left, text right, no media),
// collapsible (text clamped to 3 lines with a toggle), ai-label; video: autoplay, loop, controls,
// no-play-button, ratio-W-H, mobile-ratio-W-H.
// CTAs opening a "page" popover become #layer-N links; the popover content is moved into its own
// layer section (see extractLayer in _media.js). Nested teasers inside layers are parsed first.
import { replaceWithBlock } from './_utils.js';
import { mediaNodes, contentNodes, blockName, divCell } from './_media.js';

export const selectors = ['.textmediateaser.aem-GridColumn'];

export default function parse(element, { document }) {
  const t = element.querySelector('.cmp-textmediateaser');
  if (!t) return;
  const cls = t.className;
  const options = [];
  const extras = []; // nested block tables found in the content, placed after the block
  if (/--special-intro/.test(cls)) options.push('intro');
  if (/--special-section/.test(cls)) options.push('section');
  if (/--media-right/.test(cls)) options.push('media-right');
  const col = (cls.match(/--col-(\d)to(\d)/) || []);
  if (col[1]) options.push(`col-${col[1]}-${col[2]}`);

  const mediaWrap = t.querySelector(':scope > .cmp-textmediateaser__media-wrapper');
  const contentWrap = t.querySelector(':scope > .cmp-textmediateaser__content') || t;
  if (contentWrap.querySelector('.cmp-textmediateaser__description--collapsible')) options.push('collapsible');

  const media = /--special-section/.test(cls) ? { nodes: [], hasMedia: false } : mediaNodes(document, mediaWrap);
  if (mediaWrap && mediaWrap.querySelector('[class*="__ai-label"]')) options.push('ai-label');
  if (media.video) {
    if (media.video.controls) options.push('controls');
    if (media.video.autoplay) options.push('autoplay');
    if (media.video.loop) options.push('loop');
    if (!media.video.controls && !media.video.playButton) options.push('no-play-button');
    if (media.video.ratioLarge) options.push(`ratio-${media.video.ratioLarge}`);
    if (media.video.ratioSmall && media.video.ratioSmall !== media.video.ratioLarge) options.push(`mobile-ratio-${media.video.ratioSmall}`);
  }

  const content = contentNodes(document, contentWrap, element, extras);
  const cells = [];
  if (media.hasMedia) cells.push([divCell(document, media.nodes)]);
  cells.push([divCell(document, content)]);
  const block = replaceWithBlock(document, element, blockName('Text Media Teaser', options), cells);
  if (extras.length) block.after(...extras);
}
