/* eslint-disable */
/* global WebImporter */
// Parser for block "hero-stage" (source: .stage.aem-GridColumn, AEM stage-v1).
// Hero convention, 1 column:
//   row 1 (media): desktop/mobile/tablet images, or poster images + desktop/mobile video links
//   row 2 (content), in order: optional intro paragraphs (zone 0: "THE" + **X5** model name or a
//     one-line claim), optional branding logo, heading, subline, optional price tag
//     (**price** + label), CTAs, optional disclaimer paragraph(s) after the CTAs.
import { replaceWithBlock } from './_utils.js';
import {
  mediaNodes, contentNodes, autoplayVideoOptions, textNodes, blockName, divCell,
} from './_media.js';

export const selectors = ['.stage.aem-GridColumn'];

export default function parse(element, { document }) {
  const stage = element.querySelector('.cmp-stage');
  if (!stage) return;
  const options = [];
  const extras = []; // nested block tables found in the content, placed after the block
  if (element.classList.contains('cmp-stage__light') || stage.classList.contains('cmp-stage__light')) options.push('light');
  if (stage.classList.contains('cmp-stage--clickable')) options.push('clickable');

  const mediaRoot = stage.querySelector('.cmp-stage__media') || stage;
  const media = mediaNodes(document, mediaRoot);
  if (mediaRoot.querySelector('[class*="__ai-label"]')) options.push('ai-label');
  options.push(...autoplayVideoOptions(media.video));

  const zones = [...stage.querySelectorAll('.cmp-stage__overlay .zone')];
  const zone0 = zones.length > 1 ? zones[0] : null;
  const zone1 = zones.length ? zones[zones.length - 1] : stage.querySelector('.cmp-stage__overlay');

  // zone 0: intro shown before the headline (model name or claim)
  const intro = [];
  if (zone0) {
    zone0.querySelectorAll('.title').forEach((t) => {
      const h = t.querySelector('.cmp-title__text');
      if (!h || !h.textContent.trim()) return;
      const p = document.createElement('p');
      const txt = h.textContent.replace(/\s+/g, ' ').trim();
      if (/style-title--stage-model-1/.test(t.className)) {
        const s = document.createElement('strong');
        s.textContent = txt;
        p.append(s);
      } else {
        p.textContent = txt;
      }
      intro.push(p);
    });
  }

  // zone 1: branding, headline, subline, price tag, CTAs
  const content = contentNodes(document, zone1, element, extras);
  const title = zone1 && zone1.querySelector('.title');
  if (title && /style-title--stage-zone-1-small/.test(title.className)) options.push('small');
  if (intro.length && title && !/stage-zone-1/.test(title.className)) options.push('model');

  // disclaimer overlay (bottom right)
  const disclaimer = [];
  stage.querySelectorAll('.cmp-stage__disclaimer-wrapper .text').forEach((t) => disclaimer.push(...textNodes(document, t)));
  if (disclaimer.length) options.push('disclaimer');

  const cells = [
    [divCell(document, media.nodes)],
    [divCell(document, [...intro, ...content, ...disclaimer])],
  ];
  const block = replaceWithBlock(document, element, blockName('Hero Stage', options), cells);
  if (extras.length) block.after(...extras);
}
