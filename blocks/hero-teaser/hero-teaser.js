import {
  getImageRefs,
  getVideoRefs,
  buildBmwMedia,
  decorateFontIcons,
  groupCtaLinks,
} from '../../scripts/bmw-utils.js';

/*
 * Hero Teaser: full-bleed background image or video with overlaid heading, text and CTAs.
 * Row 1: media (desktop, mobile[, tablet] images, or poster images + desktop/mobile video links).
 * Row 2: heading(s), paragraphs, CTAs.
 * Options: center | end (horizontal text position), top | middle | bottom, cols-N (text width in
 *   12ths from 1024px), gradient-left | gradient-oblique | gradient-top | gradient-right |
 *   gradient-bottom, contained, ai-label, video: no-autoplay, loop, no-play-button,
 *   ratio-W-H, mobile-ratio-W-H.
 */

function ratioOption(block, prefix) {
  const cls = [...block.classList].find((c) => new RegExp(`^${prefix}\\d+-\\d+$`).test(c));
  if (!cls) return '';
  const [w, h] = cls.substring(prefix.length).split('-');
  return `${w} / ${h}`;
}

export default function decorate(block) {
  const rows = [...block.children];
  const isMediaRow = (r) => !r.querySelector('h1, h2, h3, h4, h5, h6')
    && (getImageRefs(r).length || getVideoRefs(r).length);
  const mediaRow = rows.find(isMediaRow) || null;
  const contentRows = rows.filter((r) => r !== mediaRow);

  const mediaBox = document.createElement('div');
  mediaBox.className = 'hero-teaser-media';
  if (mediaRow) {
    const { element } = buildBmwMedia(mediaRow, {
      video: {
        autoplay: !block.classList.contains('no-autoplay'),
        loop: block.classList.contains('loop'),
        playButton: !block.classList.contains('no-play-button'),
        observe: block,
      },
    });
    if (element) mediaBox.append(element);
  }
  if (!mediaBox.children.length) block.classList.add('no-media');
  const large = ratioOption(block, 'ratio-');
  const small = ratioOption(block, 'mobile-ratio-');
  if (large) mediaBox.style.setProperty('--ht-ar-large', large);
  if (small || large) mediaBox.style.setProperty('--ht-ar-small', small || large);

  const overlay = document.createElement('div');
  overlay.className = 'hero-teaser-overlay ctx-dark';
  const content = document.createElement('div');
  content.className = 'hero-teaser-content';
  contentRows.forEach((r) => [...r.children].forEach((cell) => {
    while (cell.firstChild) content.append(cell.firstChild);
  }));
  [...content.children].forEach((el) => {
    if (el.tagName === 'P' && !el.textContent.trim() && !el.querySelector('img, picture, .icon')) el.remove();
  });
  // model branding: a "THE" paragraph (source iconization title), optionally followed by a
  // short model designation paragraph ("1", "X5", "iX2"; source stage-model title)
  [...content.querySelectorAll(':scope > p')].forEach((p) => {
    if (p.textContent.trim() !== 'THE' || p.children.length) return;
    p.classList.add('hero-teaser-iconization');
    const next = p.nextElementSibling;
    const model = next && next.tagName === 'P' && !next.querySelector('a, img, picture')
      ? next.textContent.trim() : '';
    if (model && model.length <= 4 && !/\s/.test(model)) next.classList.add('hero-teaser-model');
  });
  const cols = [...block.classList].find((c) => /^cols-\d+$/.test(c));
  if (cols) content.style.setProperty('--ht-cols', cols.substring(5));
  decorateFontIcons(content);
  groupCtaLinks(content, 'hero-teaser-buttons', 'hero-teaser-link');
  overlay.append(content);

  const teaser = document.createElement('div');
  teaser.className = 'hero-teaser-teaser';
  teaser.append(mediaBox, overlay);
  block.replaceChildren(teaser);
}
