import { appendAiLabelText, buildBmwMedia } from '../../scripts/bmw-utils.js';

/*
 * Media: full-width responsive image or background video without text (source: backgroundmedia
 * without overlay text).
 * One row / one cell: desktop, mobile[, tablet] images, or poster images + desktop/mobile video
 * links. Options: contained (inside the content grid instead of full-bleed), ai-label,
 * video: no-autoplay, loop, no-play-button, ratio-W-H, mobile-ratio-W-H.
 */

function ratioOption(block, prefix) {
  const cls = [...block.classList].find((c) => new RegExp(`^${prefix}\\d+-\\d+$`).test(c));
  if (!cls) return '';
  const [w, h] = cls.substring(prefix.length).split('-');
  return `${w} / ${h}`;
}

export default function decorate(block) {
  const cells = [...block.querySelectorAll(':scope > div > div')];
  const box = document.createElement('div');
  box.className = 'media-box';
  cells.some((cell) => {
    const { element } = buildBmwMedia(cell, {
      video: {
        autoplay: !block.classList.contains('no-autoplay'),
        loop: block.classList.contains('loop'),
        playButton: !block.classList.contains('no-play-button'),
      },
    });
    if (element) box.append(element);
    return !!element;
  });
  const large = ratioOption(block, 'ratio-');
  const small = ratioOption(block, 'mobile-ratio-');
  if (large) box.style.setProperty('--media-ar-large', large);
  if (small || large) box.style.setProperty('--media-ar-small', small || large);
  if (box.querySelector('.bmw-video')) block.classList.add('is-video');
  block.replaceChildren(box);
  if (block.classList.contains('ai-label')) appendAiLabelText(box);
}
