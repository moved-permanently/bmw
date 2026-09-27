import { buildBmwMedia, decorateFontIcons, eagerLoadWhenNear } from '../../scripts/bmw-utils.js';

/*
 * Multi Content Gallery (source: multicontentgallery-v1): full-bleed media (cross-fading images or
 * videos) coupled with text cards. Below 1280px the cards form a swipeable row overlapping the
 * media; from 1280px they become tiles under the media and the active tile opens its card.
 * Rows: cell 1 = media (desktop, mobile[, tablet] images, or poster image(s) + desktop/mobile video
 * links), cell 2 = card content (h3 title, text, CTA links).
 * Options (videos): no-autoplay, loop, no-play-button.
 */

const DESKTOP = window.matchMedia('(min-width: 1280px)');
const LABELS = { more: 'Mehr anzeigen', less: 'Weniger anzeigen' };
let seq = 0;

function iconEl(name, cls) {
  const i = document.createElement('span');
  i.className = `icon icon-${name} ${cls}`;
  return i;
}

function splitRow(row) {
  const cells = [...row.children];
  const mediaCell = cells.find((c) => !c.querySelector('h1, h2, h3, h4, h5, h6')
    && c.querySelector('a[href*="/is/image/"], a[href*="/is/content/"], img, picture')) || cells[0];
  const textCell = cells.find((c) => c !== mediaCell) || null;
  return { mediaCell, textCell };
}

export default function decorate(block) {
  eagerLoadWhenNear(block);
  seq += 1;
  const id = `mcg-${seq}`;
  const autoplay = !block.classList.contains('no-autoplay');
  const rows = [...block.children];

  const mediaEl = document.createElement('div');
  mediaEl.className = 'mcg-media';
  const viewport = document.createElement('div');
  viewport.className = 'mcg-cards';
  const track = document.createElement('div');
  track.className = 'mcg-track';
  viewport.append(track);

  const items = [];
  rows.forEach((row, i) => {
    const { mediaCell, textCell } = splitRow(row);
    const { element, player } = buildBmwMedia(mediaCell, {
      eager: false,
      sizes: '100vw',
      video: {
        autoplay: false,
        loop: block.classList.contains('loop'),
        playButton: !block.classList.contains('no-play-button'),
      },
    });
    const heading = textCell && textCell.querySelector('h1, h2, h3, h4, h5, h6');
    const content = textCell ? [...textCell.children] : [];
    if (!element && !content.length) return;

    const slide = document.createElement('div');
    slide.className = 'mcg-media-slide';
    slide.setAttribute('aria-hidden', 'true');
    if (element) slide.append(element);
    mediaEl.append(slide);

    const card = document.createElement('div');
    card.className = 'mcg-card';
    card.setAttribute('role', 'group');
    card.setAttribute('aria-roledescription', 'slide');
    const tile = document.createElement('button');
    tile.type = 'button';
    tile.className = 'mcg-tile';
    tile.setAttribute('aria-controls', `${id}-content-${i}`);
    const tileTitle = document.createElement('span');
    tileTitle.className = 'mcg-tile-title';
    tileTitle.textContent = heading ? heading.textContent.trim() : '';
    tile.append(tileTitle, iconEl('arrow_chevron_up', 'mcg-tile-icon'));
    if (heading) card.setAttribute('aria-label', heading.textContent.trim());

    const body = document.createElement('div');
    body.className = 'mcg-content';
    body.id = `${id}-content-${i}`;
    const scroll = document.createElement('div');
    scroll.className = 'mcg-scroll';
    scroll.append(...content);
    // CTA paragraphs at the end of the card
    const ctas = [...scroll.querySelectorAll(':scope > p.button-wrapper, :scope > p')]
      .filter((p) => p.querySelector('a') && p.textContent.trim() === p.querySelector('a').textContent.trim());
    if (ctas.length && ctas[ctas.length - 1] === scroll.lastElementChild) {
      const group = document.createElement('div');
      group.className = 'mcg-links';
      let n = scroll.lastElementChild;
      const trailing = [];
      while (n && ctas.includes(n)) {
        trailing.unshift(n);
        n = n.previousElementSibling;
      }
      group.append(...trailing);
      scroll.append(group);
      trailing.forEach((p) => {
        const a = p.querySelector('a');
        if (a && !a.classList.contains('button')) a.classList.add('link-arrow');
      });
    }
    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'mcg-toggle';
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', body.id);
    const toggleText = document.createElement('span');
    toggleText.textContent = LABELS.more;
    toggle.append(iconEl('arrow_chevron_down', 'mcg-toggle-icon'), toggleText);
    toggle.hidden = true;
    body.append(scroll, toggle);
    card.append(tile, body);
    track.append(card);

    items.push({
      slide, card, tile, body, scroll, toggle, toggleText, player,
    });
  });
  if (!items.length) {
    block.replaceChildren();
    return;
  }
  block.replaceChildren(mediaEl, viewport);
  decorateFontIcons(viewport);
  if (items.length === 1) block.classList.add('single');

  /* ---------------------------------------------------------------- state */
  let current = -1;
  let offset = 0;
  let inView = false;

  const maxOffset = () => Math.max(0, track.scrollWidth - track.clientWidth);

  const position = (animate = true) => {
    const card = items[current] && items[current].card;
    if (!card) return;
    const base = items[0].card.offsetLeft;
    // below 1280px the active card moves to the left edge (also the last one); tiles only scroll
    // when there are more than fit
    offset = card.offsetLeft - base;
    if (DESKTOP.matches) offset = Math.min(offset, maxOffset());
    track.style.transition = animate ? '' : 'none';
    track.style.transform = `translateX(${-offset}px)`;
  };

  const updateMasks = (item) => {
    const { scroll } = item;
    const overflow = scroll.scrollHeight > scroll.clientHeight + 2;
    const atTop = scroll.scrollTop <= 1;
    const atEnd = scroll.scrollTop + scroll.clientHeight >= scroll.scrollHeight - 1;
    item.body.classList.toggle('mask-top', overflow && !atTop);
    item.body.classList.toggle('mask-bottom', overflow && !atEnd);
  };

  const measure = (item) => {
    const expanded = item.body.classList.contains('is-expanded');
    if (!expanded) {
      item.toggle.hidden = false;
      const overflow = item.scroll.scrollHeight > item.scroll.clientHeight + 2;
      item.toggle.hidden = !overflow;
    }
    updateMasks(item);
  };

  const setExpanded = (item, expanded) => {
    item.body.classList.toggle('is-expanded', expanded);
    item.toggle.setAttribute('aria-expanded', String(expanded));
    item.toggleText.textContent = expanded ? LABELS.less : LABELS.more;
    if (expanded) {
      // the card may grow up to the top of the media
      const limit = mediaEl.offsetHeight + viewport.offsetHeight - 24;
      item.body.style.setProperty('--mcg-expanded-max', `${Math.max(limit, 200)}px`);
    } else {
      item.scroll.scrollTop = 0;
    }
    updateMasks(item);
  };

  const playActive = () => {
    items.forEach((item, i) => {
      if (!item.player) return;
      if (i === current && inView && autoplay) item.player.play();
      else if (i !== current) item.player.pause();
    });
  };

  const activate = (index, animate = true) => {
    if (!items[index]) return;
    if (index !== current) {
      const prev = items[current];
      if (prev) {
        setExpanded(prev, false);
        prev.slide.classList.remove('is-active');
        prev.slide.setAttribute('aria-hidden', 'true');
        prev.card.classList.remove('is-active');
        prev.tile.setAttribute('aria-expanded', 'false');
      }
      current = index;
      const item = items[index];
      item.slide.classList.add('is-active');
      item.slide.removeAttribute('aria-hidden');
      item.card.classList.add('is-active');
      item.tile.setAttribute('aria-expanded', 'true');
      playActive();
      requestAnimationFrame(() => measure(item));
    }
    position(animate);
  };

  items.forEach((item, i) => {
    item.tile.addEventListener('click', () => activate(i));
    item.card.addEventListener('click', (e) => {
      if (current !== i && !DESKTOP.matches && !e.target.closest('a')) {
        e.preventDefault();
        activate(i);
      }
    });
    item.card.addEventListener('focusin', () => { if (!DESKTOP.matches && current !== i) activate(i); });
    item.toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      setExpanded(item, !item.body.classList.contains('is-expanded'));
    });
    item.scroll.addEventListener('scroll', () => updateMasks(item), { passive: true });
  });

  /* ---------------------------------------------------------------- swipe (cards and media) */
  let drag = null;
  const onDown = (e) => {
    if (items.length < 2 || (DESKTOP.matches && maxOffset() === 0) || e.button > 0) return;
    if (e.target.closest('.mcg-toggle, .bmw-video-playbutton')) return;
    drag = {
      x: e.clientX, y: e.clientY, dx: 0, moved: false, id: e.pointerId,
    };
  };
  const onMove = (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    drag.dx = e.clientX - drag.x;
    const dy = e.clientY - drag.y;
    if (!drag.moved && Math.abs(drag.dx) > 8 && Math.abs(drag.dx) > Math.abs(dy)) {
      drag.moved = true;
      block.classList.add('is-dragging');
    }
    if (drag.moved) {
      track.style.transition = 'none';
      track.style.transform = `translateX(${-offset + drag.dx}px)`;
    }
  };
  const onUp = () => {
    if (!drag) return;
    const { dx, moved } = drag;
    drag = null;
    block.classList.remove('is-dragging');
    if (!moved) return;
    let target = current;
    if (dx < -50) target = Math.min(items.length - 1, current + 1);
    if (dx > 50) target = Math.max(0, current - 1);
    activate(target);
    // swallow the click that follows a drag
    block.addEventListener('click', (ev) => { ev.preventDefault(); ev.stopPropagation(); }, { capture: true, once: true });
    setTimeout(() => position(), 0);
  };
  [viewport, mediaEl].forEach((el) => {
    el.addEventListener('pointerdown', onDown);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerup', onUp);
    el.addEventListener('pointercancel', onUp);
    el.addEventListener('pointerleave', onUp);
  });
  viewport.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') activate(Math.min(items.length - 1, current + 1));
    if (e.key === 'ArrowLeft') activate(Math.max(0, current - 1));
  });

  /* ---------------------------------------------------------------- layout / visibility */
  const relayout = () => {
    position(false);
    if (items[current]) measure(items[current]);
  };
  new ResizeObserver(relayout).observe(block);
  DESKTOP.addEventListener('change', relayout);

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      inView = entry.isIntersecting;
      if (inView) playActive();
      else items.forEach((item) => item.player && item.player.pause());
    });
  }, { threshold: 0.25 });
  if (document.readyState === 'complete') io.observe(block);
  else window.addEventListener('load', () => io.observe(block), { once: true });

  activate(0, false);
}
