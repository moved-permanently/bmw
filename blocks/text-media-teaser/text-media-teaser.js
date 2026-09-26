import {
  getImageRefs,
  getVideoRefs,
  buildBmwMedia,
  decorateFontIcons,
  groupCtaLinks,
  isCtaParagraph,
} from '../../scripts/bmw-utils.js';

/*
 * Text Media Teaser: text next to (or stacked with) an image or video.
 * Row 1 (optional): media (desktop, mobile[, tablet] images, or poster images + video links).
 * Row 2: heading, paragraphs, CTAs.
 * Options: media-right, col-5-5 | col-6-4 | col-4-6 (media/text widths), intro, section,
 *   collapsible, ai-label; video: autoplay, loop, controls, no-play-button, ratio-W-H,
 *   mobile-ratio-W-H.
 */
const LABEL_MORE = 'Mehr anzeigen';
const LABEL_LESS = 'Weniger anzeigen';

function ratioOption(block, prefix) {
  const cls = [...block.classList].find((c) => new RegExp(`^${prefix}\\d+-\\d+$`).test(c));
  if (!cls) return '';
  const [w, h] = cls.substring(prefix.length).split('-');
  return `${w} / ${h}`;
}

let toggleId = 0;

function setupCollapsible(description) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'text-media-teaser-toggle';
  toggleId += 1;
  description.id = description.id || `text-media-teaser-description-${toggleId}`;
  button.setAttribute('aria-controls', description.id);
  button.setAttribute('aria-expanded', 'false');
  const icon = document.createElement('span');
  icon.className = 'icon bmw-icon';
  icon.setAttribute('aria-hidden', 'true');
  icon.textContent = 'arrow_chevron_down';
  const label = document.createElement('span');
  label.textContent = LABEL_MORE;
  button.append(icon, label);
  button.addEventListener('click', () => {
    const expanded = description.classList.toggle('is-expanded');
    button.setAttribute('aria-expanded', String(expanded));
    label.textContent = expanded ? LABEL_LESS : LABEL_MORE;
    icon.textContent = expanded ? 'arrow_chevron_up' : 'arrow_chevron_down';
  });
  description.after(button);
  // only offer the toggle when the text is actually clamped
  const check = () => {
    if (description.classList.contains('is-expanded')) return;
    button.hidden = description.scrollHeight <= description.clientHeight + 1;
  };
  if (window.ResizeObserver) new ResizeObserver(check).observe(description);
  else check();
}

export default function decorate(block) {
  const rows = [...block.children];
  const isMediaRow = (r) => !r.querySelector('h1, h2, h3, h4, h5, h6')
    && (getImageRefs(r).length || getVideoRefs(r).length);
  const mediaRow = rows.find(isMediaRow) || null;
  const contentRows = rows.filter((r) => r !== mediaRow);

  const mediaBox = document.createElement('div');
  mediaBox.className = 'text-media-teaser-media';
  if (mediaRow && !block.classList.contains('section')) {
    const controls = block.classList.contains('controls');
    const { element } = buildBmwMedia(mediaRow, {
      sizes: '(min-width: 1024px) 50vw, 100vw',
      video: {
        autoplay: block.classList.contains('autoplay'),
        loop: block.classList.contains('loop'),
        controls,
        playButton: !controls && !block.classList.contains('no-play-button'),
      },
    });
    if (element) mediaBox.append(element);
  }
  const large = ratioOption(block, 'ratio-');
  const small = ratioOption(block, 'mobile-ratio-');
  if (large) mediaBox.style.setProperty('--tmt-ar-large', large);
  if (small || large) mediaBox.style.setProperty('--tmt-ar-small', small || large);

  const content = document.createElement('div');
  content.className = 'text-media-teaser-content';
  const items = [];
  contentRows.forEach((r) => [...r.children].forEach((cell) => items.push(...cell.children)));
  const headingIndex = items.findIndex((el) => /^H[1-6]$/.test(el.tagName));
  const title = document.createElement('div');
  title.className = 'text-media-teaser-title';
  const description = document.createElement('div');
  description.className = 'text-media-teaser-description';
  const ctas = [];
  items.forEach((el, i) => {
    if (i <= headingIndex) title.append(el);
    else if (isCtaParagraph(el)) ctas.push(el);
    else if (el.textContent.trim() || el.querySelector('img, picture')) description.append(el);
  });
  if (title.children.length) content.append(title);
  const descriptionWrapper = document.createElement('div');
  descriptionWrapper.className = 'text-media-teaser-description-wrapper';
  if (description.children.length) descriptionWrapper.append(description);
  if (ctas.length) {
    const ctaBox = document.createElement('div');
    ctaBox.append(...ctas);
    groupCtaLinks(ctaBox, 'text-media-teaser-buttons', 'text-media-teaser-link');
    descriptionWrapper.append(...ctaBox.children);
  }
  if (descriptionWrapper.children.length) content.append(descriptionWrapper);
  decorateFontIcons(content);
  if (block.classList.contains('collapsible') && description.children.length) {
    setupCollapsible(description);
  }

  const children = [];
  if (mediaBox.children.length) children.push(mediaBox);
  else block.classList.add('no-media');
  children.push(content);
  block.replaceChildren(...children);
}
