import {
  appendAiLabelText,
  buildBmwMedia,
  decorateFontIcons,
  eagerLoadWhenNear,
  getImageRefs,
  getVideoRefs,
  groupCtaLinks,
} from '../../scripts/bmw-utils.js';

/*
 * Carousel (BMW carousel-v1 / Swiper): teaser slides (image or video + text + CTA), image
 * galleries, offer cards. One row per slide: cell 1 media, cell 2 content.
 * Options: slides-M-T-D-X (slides per view below 768 / 768-1023 / 1024-1279 / from 1280,
 * default 1-1-3-4), no-arrows, no-pagination, cards, large-titles, small-titles; videos:
 * autoplay, hover-play, loop, controls, no-play-button, ratio-W-H, mobile-ratio-W-H.
 * Behaviour: no loop, swipe / mouse drag with edge resistance, arrow buttons from 1024px (hidden
 * at the ends), dots below (one per scroll position), arrow keys, focus follows keyboard.
 */

const DEFAULT_SLIDES = [1, 1, 3, 4];
const LABELS = {
  carousel: 'Karussell',
  slide: 'Folie',
  of: 'von',
  prev: 'Vorherige Folie',
  next: 'Nächste Folie',
  goto: 'Gehe zu Folie',
};

let carouselId = 0;

function option(block, re) {
  const cls = [...block.classList].find((c) => re.test(c));
  return cls ? cls.match(re) : null;
}

function isMediaCell(cell) {
  if (!cell) return false;
  if (cell.querySelector('h1, h2, h3, h4, h5, h6')) return false;
  const text = cell.textContent.replace(/\s+/g, ' ').trim();
  const refs = [...getImageRefs(cell), ...getVideoRefs(cell)];
  if (!refs.length) return !text && !cell.children.length;
  // only media references (link texts are alt texts / video titles)
  const refText = refs.map((r) => (r.el.textContent || '').trim()).join(' ').replace(/\s+/g, ' ').trim();
  return text.length <= refText.length + 2;
}

function navButton(dir) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = `carousel-nav carousel-${dir}`;
  button.setAttribute('aria-label', dir === 'prev' ? LABELS.prev : LABELS.next);
  const icon = document.createElement('span');
  icon.className = 'icon bmw-icon';
  icon.setAttribute('aria-hidden', 'true');
  icon.textContent = dir === 'prev' ? 'arrow_chevron_left' : 'arrow_chevron_right';
  button.append(icon);
  return button;
}

function decorateContent(content, block) {
  // disclaimer paragraphs (<p><sub>…</sub></p>)
  [...content.querySelectorAll(':scope > p')].forEach((p) => {
    const only = p.children.length === 1 && p.firstElementChild.tagName === 'SUB'
      && p.textContent.trim() === p.firstElementChild.textContent.trim();
    if (only) {
      p.classList.add('carousel-disclaimer');
      p.firstElementChild.replaceWith(...p.firstElementChild.childNodes);
    }
  });
  // body-2 slides: a value right below a disclaimer label keeps body-1 (source offer cards)
  if (block.classList.contains('body-2')) {
    content.querySelectorAll(':scope > .carousel-disclaimer + p:not(.carousel-disclaimer)')
      .forEach((p) => p.classList.add('carousel-body-1'));
  }
  // offer cards: the last plain link paragraph makes the whole card clickable
  if (block.classList.contains('cards')) {
    const last = [...content.querySelectorAll(':scope > p')].reverse()
      .find((p) => p.querySelectorAll('a').length === 1 && !p.querySelector('a.button')
        && p.textContent.trim() === p.querySelector('a').textContent.trim());
    if (last) {
      const a = last.querySelector('a');
      a.className = 'carousel-card-link';
      a.setAttribute('aria-label', a.textContent.trim());
      last.replaceWith(a);
    }
    // flag: an emphasis-only paragraph before the first heading (source style-title--flag)
    const firstHeading = content.querySelector(':scope > :is(h1, h2, h3, h4, h5, h6)');
    const flag = firstHeading && [...content.querySelectorAll(':scope > p')].find((p) => {
      const before = p.compareDocumentPosition(firstHeading) === Node.DOCUMENT_POSITION_FOLLOWING;
      if (!before) return false;
      const em = p.children.length === 1 && p.firstElementChild.tagName === 'EM'
        ? p.firstElementChild : null;
      return em && !em.querySelector('a') && em.textContent.trim() === p.textContent.trim();
    });
    if (flag) {
      flag.classList.add('carousel-flag');
      flag.firstElementChild.replaceWith(...flag.firstElementChild.childNodes);
    }
  }
  groupCtaLinks(content, 'carousel-buttons', 'carousel-link');
  decorateFontIcons(content, { text: true });
}

/**
 * Offer cards: the trailing disclaimers (consumption / emission texts) sit below the grey card.
 * @returns {HTMLElement|null} the footnote container
 */
function takeCardFootnotes(content) {
  const kids = [...content.children].filter((c) => !c.classList.contains('carousel-card-link'));
  const trailing = [];
  for (let i = kids.length - 1; i >= 0 && kids[i].classList.contains('carousel-disclaimer'); i -= 1) {
    trailing.unshift(kids[i]);
  }
  if (!trailing.length || trailing.length === kids.length) return null;
  const notes = document.createElement('div');
  notes.className = 'carousel-card-footnotes';
  notes.append(...trailing);
  return notes;
}

function videoOptions(block) {
  const has = (c) => block.classList.contains(c);
  const controls = has('controls');
  return {
    autoplay: has('autoplay'),
    loop: has('loop'),
    controls,
    playButton: !controls && !has('no-play-button'),
  };
}

/**
 * Removes the ":ai_eu_label:" marker (EU AI label of the slide image) from a media cell.
 * @returns {boolean} whether the cell carried the marker
 */
function takeAiLabel(cell) {
  if (!cell || !/ai_eu_label/.test(cell.innerHTML)) return false;
  cell.querySelectorAll('span.icon-ai_eu_label').forEach((s) => s.remove());
  const walker = document.createTreeWalker(cell, NodeFilter.SHOW_TEXT);
  const hits = [];
  while (walker.nextNode()) if (walker.currentNode.nodeValue.includes(':ai_eu_label:')) hits.push(walker.currentNode);
  hits.forEach((n) => { n.nodeValue = n.nodeValue.replace(/:ai_eu_label:/g, ''); });
  cell.querySelectorAll('p').forEach((p) => { if (!p.textContent.trim() && !p.children.length) p.remove(); });
  return true;
}

export default function decorate(block) {
  eagerLoadWhenNear(block);
  carouselId += 1;
  const id = `carousel-${carouselId}`;
  const slidesOpt = option(block, /^slides-(\d)-(\d)-(\d)-(\d)$/);
  const perView = slidesOpt ? slidesOpt.slice(1, 5).map(Number) : DEFAULT_SLIDES;
  const ratio = option(block, /^ratio-(\d+)-(\d+)$/);
  const mobileRatio = option(block, /^mobile-ratio-(\d+)-(\d+)$/);
  if (ratio) block.style.setProperty('--carousel-media-ar', `${ratio[1]} / ${ratio[2]}`);
  if (mobileRatio || ratio) {
    const r = mobileRatio || ratio;
    block.style.setProperty('--carousel-media-ar-mobile', `${r[1]} / ${r[2]}`);
  }

  const viewport = document.createElement('div');
  viewport.className = 'carousel-viewport';
  const track = document.createElement('ul');
  track.className = 'carousel-track';
  viewport.append(track);

  const hoverPlay = block.classList.contains('hover-play');
  const rows = [...block.children];
  const slides = [];
  rows.forEach((row, i) => {
    const cells = [...row.children];
    if (!cells.length) return;
    const aiLabel = cells.length > 1 && takeAiLabel(cells[0]);
    const mediaCell = isMediaCell(cells[0]) && cells.length > 1 ? cells[0] : null;
    const contentCells = cells.filter((c) => c !== mediaCell);
    const li = document.createElement('li');
    li.className = 'carousel-slide';
    li.setAttribute('role', 'group');
    li.setAttribute('aria-roledescription', LABELS.slide);
    li.id = `${id}-slide-${i + 1}`;

    if (mediaCell) {
      const { element, player } = buildBmwMedia(mediaCell, {
        sizes: '(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, 100vw',
        video: videoOptions(block),
      });
      if (element) {
        const media = document.createElement('div');
        media.className = 'carousel-slide-media';
        media.append(element);
        if (aiLabel) {
          media.classList.add('ai-label');
          appendAiLabelText(media);
        }
        li.append(media);
        if (player && hoverPlay) {
          li.addEventListener('mouseenter', () => player.play());
          li.addEventListener('mouseleave', () => player.pause());
        }
      }
    }
    const content = document.createElement('div');
    content.className = 'carousel-slide-content';
    contentCells.forEach((cell) => content.append(...cell.childNodes));
    if (content.textContent.trim() || content.querySelector('picture, img')) {
      decorateContent(content, block);
      li.append(content);
    }
    if (!li.children.length) return;
    if (content.querySelector('.carousel-card-link')) li.classList.add('is-clickable');
    if (block.classList.contains('cards')) {
      const notes = takeCardFootnotes(content);
      const card = document.createElement('div');
      card.className = 'carousel-card';
      card.append(...li.childNodes);
      li.append(card);
      if (notes) li.append(notes);
    }
    slides.push(li);
    track.append(li);
  });
  slides.forEach((s, i) => s.setAttribute('aria-label', `${i + 1} ${LABELS.of} ${slides.length}`));
  // fewer slides than slides per view: the slides share the full width (source behaviour)
  ['m', 't', 'd', 'x'].forEach((bp, i) => {
    block.style.setProperty(`--carousel-per-view-${bp}`, Math.max(1, Math.min(perView[i], slides.length)));
  });

  const prev = navButton('prev');
  const next = navButton('next');
  prev.setAttribute('aria-controls', `${id}-track`);
  next.setAttribute('aria-controls', `${id}-track`);
  track.id = `${id}-track`;
  const pagination = document.createElement('div');
  pagination.className = 'carousel-pagination';

  block.setAttribute('role', 'region');
  block.setAttribute('aria-roledescription', LABELS.carousel);
  block.replaceChildren(viewport, prev, next, pagination);

  /* ------------------------------------------------------------ slider engine */
  let index = 0;
  let maxIndex = 0;
  let offset = 0;

  const perViewNow = () => {
    const v = parseInt(getComputedStyle(block).getPropertyValue('--carousel-per-view'), 10);
    return Number.isFinite(v) && v > 0 ? v : 1;
  };
  const positionOf = (i) => (slides[i] ? slides[i].offsetLeft : 0);
  const maxOffset = () => {
    if (!slides.length) return 0;
    const last = slides[slides.length - 1];
    return Math.max(0, last.offsetLeft + last.offsetWidth - viewport.clientWidth);
  };
  const setOffset = (x, animate) => {
    offset = x;
    track.style.transition = animate ? '' : 'none';
    track.style.transform = `translate3d(${-x}px, 0, 0)`;
  };

  const renderDots = () => {
    const count = maxIndex + 1;
    if (pagination.children.length !== count) {
      pagination.replaceChildren();
      for (let i = 0; i < count; i += 1) {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'carousel-dot';
        dot.setAttribute('aria-label', `${LABELS.goto} ${i + 1}`);
        dot.setAttribute('aria-controls', track.id);
        dot.addEventListener('click', () => goTo(i)); // eslint-disable-line no-use-before-define
        pagination.append(dot);
      }
    }
    pagination.hidden = count <= 1;
    [...pagination.children].forEach((d, i) => {
      d.classList.toggle('is-active', i === index);
      if (i === index) d.setAttribute('aria-current', 'true');
      else d.removeAttribute('aria-current');
    });
  };

  const update = () => {
    const pv = perViewNow();
    const visible = new Set();
    for (let i = index; i < Math.min(slides.length, index + pv); i += 1) visible.add(i);
    slides.forEach((s, i) => s.classList.toggle('is-visible', visible.has(i)));
    prev.hidden = index <= 0;
    next.hidden = index >= maxIndex;
    block.classList.toggle('is-static', maxIndex === 0);
    renderDots();
  };

  function goTo(i, animate = true) {
    index = Math.max(0, Math.min(maxIndex, i));
    setOffset(Math.min(positionOf(index), maxOffset()), animate);
    update();
  }

  const layout = () => {
    maxIndex = Math.max(0, slides.length - perViewNow());
    goTo(index, false);
  };

  prev.addEventListener('click', () => goTo(index - 1));
  next.addEventListener('click', () => goTo(index + 1));

  block.addEventListener('keydown', (e) => {
    if (e.target.closest('.bmw-video-controls, input, textarea, select')) return;
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goTo(index - 1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      goTo(index + 1);
    }
  });

  // keyboard focus inside a slide that is out of view: bring it in
  track.addEventListener('focusin', (e) => {
    const slide = e.target.closest('.carousel-slide');
    const i = slides.indexOf(slide);
    if (i < 0) return;
    viewport.scrollLeft = 0;
    const pv = perViewNow();
    if (i < index) goTo(i);
    else if (i >= index + pv) goTo(i - pv + 1);
  });

  /* ------------------------------------------------------------ drag / swipe */
  let drag = null;
  let suppressClick = false;
  viewport.addEventListener('pointerdown', (e) => {
    if (maxIndex === 0 || (e.pointerType === 'mouse' && e.button !== 0)) return;
    if (e.target.closest('.bmw-video-controls, .bmw-video-playbutton')) return;
    drag = {
      x: e.clientX, y: e.clientY, base: offset, moved: false, id: e.pointerId, t: performance.now(),
    };
  });
  viewport.addEventListener('pointermove', (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const dx = e.clientX - drag.x;
    const dy = e.clientY - drag.y;
    if (!drag.moved) {
      if (Math.abs(dx) < 6 || Math.abs(dx) < Math.abs(dy)) {
        if (Math.abs(dy) > 10) drag = null; // vertical scroll wins
        return;
      }
      drag.moved = true;
      viewport.setPointerCapture(e.pointerId);
      block.classList.add('is-dragging');
    }
    const max = maxOffset();
    let x = drag.base - dx;
    if (x < 0) x *= 0.3;
    else if (x > max) x = max + (x - max) * 0.3;
    setOffset(x, false);
  });
  const endDrag = (e) => {
    if (!drag || (e && e.pointerId !== drag.id)) return;
    const { moved, base, t } = drag;
    drag = null;
    block.classList.remove('is-dragging');
    if (!moved) return;
    suppressClick = true;
    setTimeout(() => { suppressClick = false; }, 0);
    const delta = offset - base;
    const step = slides.length > 1 ? positionOf(1) - positionOf(0) : viewport.clientWidth;
    let steps = Math.round(delta / step);
    const fast = Math.abs(delta) > 30 && performance.now() - t < 300;
    if (steps === 0 && (fast || Math.abs(delta) > step * 0.15)) steps = Math.sign(delta);
    goTo(index + steps);
  };
  viewport.addEventListener('pointerup', endDrag);
  viewport.addEventListener('pointercancel', endDrag);
  viewport.addEventListener('lostpointercapture', endDrag);
  viewport.addEventListener('click', (e) => {
    if (!suppressClick) return;
    e.preventDefault();
    e.stopPropagation();
    suppressClick = false;
  }, true);
  viewport.addEventListener('dragstart', (e) => e.preventDefault());

  if (window.ResizeObserver) new ResizeObserver(() => layout()).observe(viewport);
  layout();
}
