import {
  appendAiLabelText,
  getImageRefs,
  getVideoRefs,
  splitDesktopMobile,
  removeAuthoredRef,
  buildResponsivePicture,
  createBmwVideo,
  decorateFontIcons,
} from '../../scripts/bmw-utils.js';

/*
 * Hero Stage: full-bleed stage (image or autoplay video) with headline, subline, price tag
 * and CTAs.
 * Row 1: media (desktop, mobile[, tablet] images; optional desktop + mobile video links).
 * Row 2: [intro paragraphs] [branding logo] heading, subline, [**price** + label], CTAs,
 *   [disclaimer].
 * Options: light, clickable, small, model (intro = model name), disclaimer, ai-label,
 *   no-play-button, no-autoplay, loop.
 */
const INTRO_DURATION = 2200;

function isHeading(el) {
  return /^H[1-6]$/.test(el.tagName);
}

function isCta(el) {
  if (el.tagName !== 'P') return false;
  const links = el.querySelectorAll('a[href]');
  return links.length === 1 && el.textContent.trim() === links[0].textContent.trim()
    && !el.querySelector('picture, img');
}

function isPrice(el) {
  return el.tagName === 'P' && !el.querySelector('a') && el.children.length === 1
    && el.firstElementChild.tagName === 'STRONG'
    && el.textContent.trim() === el.firstElementChild.textContent.trim();
}

function decorateLinks(container) {
  container.querySelectorAll('a[href]').forEach((a) => {
    if (!a.classList.contains('button')) a.classList.add('hero-stage-link', 'link-arrow');
  });
}

function buildMedia(block, mediaRow, label) {
  const media = document.createElement('div');
  media.className = 'hero-stage-media';
  if (!mediaRow) return media;
  const videoRefs = getVideoRefs(mediaRow);
  videoRefs.forEach((v) => removeAuthoredRef(v.el));
  const [desktop, mobile, tablet] = getImageRefs(mediaRow);
  let picture = null;
  if (desktop) {
    const small = mobile || desktop;
    picture = buildResponsivePicture([
      { media: '(max-width: 767px)', url: small.url, widths: [480, 768, 1024] },
      { media: '(max-width: 1023px)', url: (tablet || small).url, widths: [768, 1024, 1536] },
      { url: desktop.url, widths: [1280, 1920, 2560] },
    ], { alt: videoRefs.length ? '' : desktop.alt, eager: true });
  }
  const videos = splitDesktopMobile(videoRefs);
  if (videos.desktop) {
    const player = createBmwVideo({
      desktop: videos.desktop,
      mobile: videos.mobile,
      poster: picture,
      autoplay: !block.classList.contains('no-autoplay'),
      loop: block.classList.contains('loop'),
      playButton: !block.classList.contains('no-play-button'),
      label: videos.desktop.title || label,
      observe: block,
    });
    player.element.classList.add('hero-stage-video');
    media.append(player.element);
    block.classList.add('has-video');
  } else if (picture) {
    picture.classList.add('hero-stage-picture');
    media.append(picture);
  }
  if (media.children.length && block.classList.contains('ai-label')) appendAiLabelText(media);
  return media;
}

function groupCtas(zone) {
  let group = null;
  [...zone.children].forEach((el) => {
    if (el.classList.contains('hero-stage-cta')) {
      if (!group) {
        group = document.createElement('div');
        group.className = 'hero-stage-buttons';
        el.before(group);
      }
      group.append(el);
    } else {
      group = null;
    }
  });
}

export default function decorate(block) {
  const rows = [...block.children];
  const hasMedia = (r) => !r.querySelector('h1, h2, h3, h4, h5, h6')
    && (getImageRefs(r).length || getVideoRefs(r).length);
  const mediaRow = rows.find(hasMedia) || null;
  const contentRows = rows.filter((r) => r !== mediaRow);

  // collect authored content (all non-media rows, in order)
  const items = [];
  contentRows.forEach((r) => [...r.children].forEach((cell) => items.push(...cell.children)));

  const headingIndex = items.findIndex(isHeading);
  const heading = headingIndex >= 0 ? items[headingIndex] : null;
  const label = heading ? heading.textContent.trim().replace(/\s+/g, ' ') : '';

  const stage = document.createElement('div');
  stage.className = 'hero-stage-stage';
  stage.append(buildMedia(block, mediaRow, label));

  const overlay = document.createElement('div');
  overlay.className = 'hero-stage-overlay';
  const intro = document.createElement('div');
  intro.className = 'hero-stage-zone hero-stage-intro';
  const zone = document.createElement('div');
  zone.className = 'hero-stage-zone hero-stage-main';

  const before = headingIndex >= 0 ? items.slice(0, headingIndex) : [];
  const after = headingIndex >= 0 ? items.slice(headingIndex + 1) : items;
  before.forEach((el) => {
    if (el.querySelector('picture, img')) {
      el.classList.add('hero-stage-branding');
      zone.append(el);
    } else if (el.textContent.trim()) {
      if (el.querySelector('strong') && el.textContent.trim() === el.querySelector('strong').textContent.trim()) {
        el.classList.add('hero-stage-model');
      } else {
        el.classList.add('hero-stage-claim');
      }
      intro.append(el);
    }
  });
  if (heading) {
    heading.classList.add('hero-stage-heading');
    // model stages use a regular headline title: its branding logo (source
    // cmp-title__image-branding, inline-block 1em) sits inline in front of the text;
    // stage-zone-1 titles keep it on its own row
    const branding = zone.querySelector(':scope > .hero-stage-branding');
    const logo = branding && (branding.tagName === 'PICTURE' ? branding
      : branding.querySelector('picture') || branding.querySelector('img'));
    if (block.classList.contains('model') && logo) {
      const inline = document.createElement('span');
      inline.className = 'hero-stage-branding-inline';
      inline.append(logo);
      heading.prepend(inline);
      if (branding !== logo) branding.remove();
    }
    zone.append(heading);
  }

  const lastCta = after.reduce((idx, el, i) => (isCta(el) ? i : idx), -1);
  const disclaimer = document.createElement('div');
  disclaimer.className = 'hero-stage-disclaimer';
  let price = null;
  after.forEach((el, i) => {
    if (block.classList.contains('disclaimer') && lastCta >= 0 && i > lastCta) {
      disclaimer.append(el);
    } else if (isCta(el)) {
      el.classList.add('hero-stage-cta');
      zone.append(el);
    } else if (isPrice(el)) {
      price = document.createElement('div');
      price.className = 'hero-stage-pricetag';
      el.classList.add('hero-stage-price');
      price.append(el);
      zone.append(price);
    } else if (price && el.tagName === 'P') {
      let labelBox = price.querySelector('.hero-stage-price-label');
      if (!labelBox) {
        labelBox = document.createElement('div');
        labelBox.className = 'hero-stage-price-label';
        price.append(labelBox);
      }
      labelBox.append(el);
    } else {
      el.classList.add('hero-stage-subline');
      zone.append(el);
    }
  });
  groupCtas(zone);
  decorateLinks(zone);
  decorateFontIcons(zone);

  if (intro.children.length) overlay.append(intro);
  overlay.append(zone);
  stage.append(overlay);
  if (disclaimer.children.length) {
    decorateFontIcons(disclaimer);
    stage.append(disclaimer);
  }

  // whole stage links to the first CTA
  if (block.classList.contains('clickable')) {
    const first = zone.querySelector('a[href]');
    if (first) {
      const area = document.createElement('a');
      area.className = 'hero-stage-click-area';
      area.href = first.href;
      area.tabIndex = -1;
      area.setAttribute('aria-hidden', 'true');
      stage.prepend(area);
    }
  }

  block.replaceChildren(stage);
  if (!block.classList.contains('light')) block.classList.add('ctx-dark');

  // intro zone (model name / claim) first, then the headline zone
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (intro.children.length && !reduced) {
    block.classList.add('is-intro');
    setTimeout(() => {
      block.classList.remove('is-intro');
      block.classList.add('is-main');
    }, INTRO_DURATION);
  } else {
    block.classList.add('is-main');
  }
}
