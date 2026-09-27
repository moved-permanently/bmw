import { appendAiLabelText, buildBmwMedia } from '../../scripts/bmw-utils.js';

/*
 * Video: BMW inline video player.
 * One row / one cell: poster image(s) (desktop, mobile) + video link(s) (desktop, mobile; HLS
 * .m3u8 or MP4, e.g. bmw.scene7.com/is/content/..., link text = video title).
 * Options: autoplay (muted, while in view), loop, controls (dark play bar; default is the round
 * progressive play button), no-play-button, ratio-W-H (default 16-9), mobile-ratio-W-H
 * (below 768px), ai-label.
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
  box.className = 'video-box';
  const controls = block.classList.contains('controls');
  cells.some((cell) => {
    const { element } = buildBmwMedia(cell, {
      sizes: '(min-width: 1024px) 66vw, 100vw',
      video: {
        autoplay: block.classList.contains('autoplay'),
        loop: block.classList.contains('loop'),
        controls,
        playButton: !controls && !block.classList.contains('no-play-button'),
      },
    });
    if (element) box.append(element);
    return !!element;
  });
  const large = ratioOption(block, 'ratio-') || '16 / 9';
  const small = ratioOption(block, 'mobile-ratio-') || large;
  box.style.setProperty('--video-ar-large', large);
  box.style.setProperty('--video-ar-small', small);
  block.replaceChildren(box);
  if (block.classList.contains('ai-label')) appendAiLabelText(box);
}
