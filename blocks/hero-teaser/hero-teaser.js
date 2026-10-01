import {
  appendAiLabelText,
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
 *   gradient-bottom, contained, ai-label, text-top-N | text-bottom-N (source spacing of the
 *   text box, N = --bmw-spacing-N), cta-top-N | cta-bottom-N (spacing above / below the CTAs,
 *   bottom default 12), cta-stack-md (CTAs stacked on tablet), sub-top-N (spacing above the
 *   first paragraph after the headline), text-start (text start-aligned below 1024px, where it
 *   is centred by default),
 *   video: no-autoplay, loop, no-play-button,
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
      // leading block: its image / video poster is the LCP candidate
      eager: document.querySelector('main .block') === block,
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
  else if (block.classList.contains('ai-label')) appendAiLabelText(mediaBox);
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
  // short model designation ("1", "X5", "iX2"; source stage-model title)
  [...content.querySelectorAll(':scope > p')].forEach((p) => {
    if (p.textContent.trim() !== 'THE' || p.children.length) return;
    p.classList.add('hero-teaser-iconization');
    const next = p.nextElementSibling;
    // (imported as a paragraph, or as a heading when the source title was a heading)
    const model = next && /^(P|H[1-6])$/.test(next.tagName) && !next.querySelector('a, img, picture')
      ? next.textContent.trim() : '';
    if (model && model.length <= 4 && !/\s/.test(model)) next.classList.add('hero-teaser-model');
  });
  // title branding logo (source cmp-title__image-branding: inline-block, 1em high, in front of the
  // title text): a logo-only picture / paragraph right before a heading moves into the heading
  [...content.children].forEach((el) => {
    const next = el.nextElementSibling;
    if (!next || !/^H[1-6]$/.test(next.tagName)) return;
    const logo = el.tagName === 'PICTURE' ? el : null;
    const para = !logo && el.tagName === 'P' && !el.textContent.trim() && el.children.length === 1
      && el.firstElementChild.tagName === 'PICTURE' ? el.firstElementChild : null;
    const img = (logo || para)?.querySelector('img');
    if (!img || !/logo/i.test(img.getAttribute('src') || '')) return;
    const inline = document.createElement('span');
    inline.className = 'hero-teaser-branding';
    inline.append(logo || para);
    next.prepend(inline);
    if (para) el.remove();
  });
  // price tag (source style-container--price-tag): a bold price paragraph ("Ab 339 €") and the
  // plain paragraphs after it ("im Monat leasen.") as its label
  const isPrice = (el) => el.tagName === 'P' && el.children.length === 1
    && el.firstElementChild.tagName === 'STRONG' && !el.querySelector('a')
    && el.textContent.trim() === el.firstElementChild.textContent.trim()
    && /\d[\d.,\s]*(€|EUR)|€\s*\d/.test(el.textContent);
  const priceEl = [...content.children].find(isPrice);
  if (priceEl) {
    const tag = document.createElement('div');
    tag.className = 'hero-teaser-pricetag';
    const label = document.createElement('div');
    label.className = 'hero-teaser-price-label';
    let next = priceEl.nextElementSibling;
    while (next && next.tagName === 'P' && !next.querySelector('a, picture, img') && next.textContent.trim()) {
      const el = next;
      next = next.nextElementSibling;
      label.append(el);
    }
    priceEl.before(tag);
    priceEl.classList.add('hero-teaser-price');
    tag.append(priceEl);
    if (label.children.length) tag.append(label);
  }
  const cols = [...block.classList].find((c) => /^cols-\d+$/.test(c));
  if (cols) content.style.setProperty('--ht-cols', cols.substring(5));
  // source spacing of the text box / CTA row -> global spacing tokens (responsive)
  [...block.classList].forEach((c) => {
    const [, kind, n] = c.match(/^(text-top|text-bottom|cta-top|cta-bottom|sub-top)-(\d+)$/) || [];
    if (!kind) return;
    const prop = {
      'text-top': '--ht-text-mt',
      'text-bottom': '--ht-text-mb',
      'cta-top': '--ht-cta-mt',
      'cta-bottom': '--ht-cta-mb',
      'sub-top': '--ht-sub-mt',
    }[kind];
    content.style.setProperty(prop, `var(--bmw-spacing-${n}, 0px)`);
  });
  decorateFontIcons(content);
  groupCtaLinks(content, 'hero-teaser-buttons', 'hero-teaser-link');
  overlay.append(content);

  const teaser = document.createElement('div');
  teaser.className = 'hero-teaser-teaser';
  teaser.append(mediaBox, overlay);
  block.replaceChildren(teaser);
}
