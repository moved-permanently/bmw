/* eslint-disable */
/* global WebImporter */
// Parser for block "video" (source: .video.aem-GridColumn, AEM video component).
// Video convention, 1 column, 1 content row: poster image(s) (desktop, mobile) + video link(s)
// (desktop, mobile; link text = video title). Options: autoplay, loop, controls (dark play bar;
// default is the round progressive play button), no-play-button, ratio-W-H (desktop),
// mobile-ratio-W-H (below 768px), ai-label.
// Videos inside galleries/carousels are left to the containing component's parser.
import { replaceWithBlock } from './_utils.js';
import { mediaNodes, blockName, divCell } from './_media.js';

export const selectors = ['.video.aem-GridColumn'];

const OWNED_BY_OTHERS = '.cmp-carousel, .cmp-mediagallery, .cmp-multicontentgallery, .cmp-mediashowcase, '
  + '.cmp-previewslider, .cmp-onemedia, .cmp-stage, .cmp-backgroundmedia, .cmp-textmediateaser, .cmp-modelcard, .swiper';

export default function parse(element, { document }) {
  if (element.parentElement && element.parentElement.closest(OWNED_BY_OTHERS)) return;
  const media = mediaNodes(document, element);
  if (!media.video) return;
  const v = media.video;
  const options = [];
  if (v.autoplay) options.push('autoplay');
  if (v.loop) options.push('loop');
  if (v.controls) options.push('controls');
  else if (!v.playButton) options.push('no-play-button');
  if (v.ratioLarge) options.push(`ratio-${v.ratioLarge}`);
  if (v.ratioSmall && v.ratioSmall !== v.ratioLarge) options.push(`mobile-ratio-${v.ratioSmall}`);
  if (element.querySelector('[class*="__ai-label"]')) options.push('ai-label');
  replaceWithBlock(document, element, blockName('Video', options), [[divCell(document, media.nodes)]]);
}
