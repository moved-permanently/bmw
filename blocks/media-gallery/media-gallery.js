import {
  buildResponsivePicture, getImageRefs, swapScene7Crop, sizedImageUrl,
} from '../../scripts/bmw-utils.js';

/*
 * Media Gallery (source: mediagallery-v1): full-bleed strip of portrait images. From 768px the
 * strip scrolls continuously (pause/play, previous/next while paused); hovering an image shows its
 * title and text, a click opens the lightbox. Below 768px it is a swipeable slider with counter,
 * progress bar and the caption of the current image below.
 * Rows: cell 1 = image (desktop, mobile[, tablet]), cell 2 = h3 title + paragraph.
 * Options: no-autoplay.
 */

const MOBILE = window.matchMedia('(max-width: 767px)');
const SPEED = 40; // px per second of the auto-scroll
const LABELS = {
  play: 'Autoplay starten',
  pause: 'Autoplay pausieren',
  prev: 'Zurück',
  next: 'Weiter',
  close: 'Schließen (Esc)',
  viewer: 'Bildbetrachter',
  open: 'Bild vergrößern',
};

function roundButton(iconName, label, cls) {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = `mg-round ${cls}`;
  b.setAttribute('aria-label', label);
  const i = document.createElement('span');
  i.className = 'bmw-icon';
  i.setAttribute('aria-hidden', 'true');
  i.textContent = iconName;
  b.append(i);
  return b;
}

function counter(cls) {
  const el = document.createElement('div');
  el.className = cls;
  el.setAttribute('aria-hidden', 'true');
  el.innerHTML = '<span class="mg-current">1</span>&nbsp;/&nbsp;<span class="mg-total"></span>';
  return el;
}

function lightboxUrl(url) {
  return swapScene7Crop(url, '16to7') || url;
}

export default function decorate(block) {
  const autoplay = !block.classList.contains('no-autoplay')
    && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const items = [];
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const refs = cells.flatMap((c) => getImageRefs(c));
    const textCell = cells.find((c) => c.querySelector('h1, h2, h3, h4, h5, h6, p') && !getImageRefs(c).length)
      || cells[1];
    if (!refs.length) return;
    const [desktop, mobile, tablet] = refs;
    const heading = textCell && textCell.querySelector('h1, h2, h3, h4, h5, h6');
    const paras = textCell ? [...textCell.querySelectorAll('p')].filter((p) => p.textContent.trim()) : [];
    items.push({
      url: desktop.url,
      alt: desktop.alt,
      sources: [
        { media: '(max-width: 767px)', url: (mobile || desktop).url, widths: [300, 600] },
        { media: '(max-width: 1279px)', url: (tablet || mobile || desktop).url, widths: [300, 600] },
        { url: desktop.url, widths: [330, 660, 1100] },
      ],
      title: heading ? heading.innerHTML.trim() : '',
      titleText: heading ? heading.textContent.trim() : '',
      text: paras.map((p) => p.innerHTML.trim()).join('<br>'),
    });
  });
  if (!items.length) {
    block.replaceChildren();
    return;
  }

  /* ---------------------------------------------------------------- strip */
  const viewport = document.createElement('div');
  viewport.className = 'mg-viewport';
  const track = document.createElement('ul');
  track.className = 'mg-track';
  viewport.append(track);

  const makeItem = (item, i, clone) => {
    const li = document.createElement('li');
    li.className = 'mg-item';
    if (clone) {
      li.classList.add('mg-clone');
      li.setAttribute('aria-hidden', 'true');
    }
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'mg-media';
    btn.dataset.index = i;
    if (clone) btn.tabIndex = -1;
    btn.setAttribute('aria-label', `${item.titleText || item.alt} – ${LABELS.open}`);
    const pic = buildResponsivePicture(item.sources, { alt: item.alt, sizes: '(max-width: 1279px) 300px, (max-width: 1919px) 330px, 548px' });
    const imgWrap = document.createElement('span');
    imgWrap.className = 'mg-image';
    imgWrap.append(pic);
    btn.append(imgWrap);
    if (item.title || item.text) {
      const overlay = document.createElement('span');
      overlay.className = 'mg-overlay';
      overlay.setAttribute('aria-hidden', 'true');
      overlay.innerHTML = `<span class="mg-overlay-content"><span class="mg-title">${item.title}</span><span class="mg-text">${item.text}</span></span>`;
      const arrow = document.createElement('span');
      arrow.className = 'bmw-icon mg-arrow';
      arrow.textContent = 'arrow_up_right';
      overlay.append(arrow);
      btn.append(overlay);
    }
    li.append(btn);
    return li;
  };
  items.forEach((item, i) => track.append(makeItem(item, i, false)));

  // mobile: counter on the image, progress bar and caption below
  const mobileCounter = counter('mg-counter');
  const progress = document.createElement('div');
  progress.className = 'mg-progress';
  progress.innerHTML = '<div class="mg-progress-fill"></div>';
  progress.style.setProperty('--mg-count', items.length);
  const caption = document.createElement('div');
  caption.className = 'mg-caption';
  caption.setAttribute('aria-live', 'polite');
  items.forEach((item, i) => {
    const c = document.createElement('div');
    c.className = 'mg-caption-item';
    if (!i) c.classList.add('is-active');
    c.innerHTML = `${item.title ? `<h3>${item.title}</h3>` : ''}${item.text ? `<p>${item.text}</p>` : ''}`;
    caption.append(c);
  });

  // desktop navigation
  const nav = document.createElement('div');
  nav.className = 'mg-nav';
  const prevBtn = roundButton('arrow_left', LABELS.prev, 'mg-prev');
  const nextBtn = roundButton('arrow_right', LABELS.next, 'mg-next');
  const pauseBtn = roundButton('pause', LABELS.pause, 'mg-pause');
  const playBtn = roundButton('play', LABELS.play, 'mg-play');
  nav.append(prevBtn, nextBtn, pauseBtn, playBtn);

  const strip = document.createElement('div');
  strip.className = 'mg-strip';
  strip.append(viewport, mobileCounter, progress);
  block.replaceChildren(strip, caption, nav);
  block.querySelectorAll('.mg-total').forEach((t) => { t.textContent = items.length; });

  /* ---------------------------------------------------------------- lightbox */
  const dialog = document.createElement('dialog');
  dialog.className = 'mg-lightbox';
  dialog.setAttribute('aria-label', LABELS.viewer);
  const stage = document.createElement('div');
  stage.className = 'mg-lightbox-stage';
  const lbImg = document.createElement('img');
  lbImg.className = 'mg-lightbox-img';
  lbImg.alt = '';
  const lbClose = roundButton('close', LABELS.close, 'mg-lightbox-close');
  const lbNav = document.createElement('div');
  lbNav.className = 'mg-lightbox-nav';
  const lbCounter = counter('mg-lightbox-counter');
  const lbButtons = document.createElement('div');
  lbButtons.className = 'mg-lightbox-buttons';
  const lbPrev = roundButton('arrow_left', LABELS.prev, 'mg-lightbox-prev');
  const lbNext = roundButton('arrow_right', LABELS.next, 'mg-lightbox-next');
  lbButtons.append(lbPrev, lbNext);
  lbNav.append(lbCounter, lbButtons);
  stage.append(lbImg, lbClose, lbNav);
  dialog.append(stage);
  dialog.querySelector('.mg-total').textContent = items.length;
  block.append(dialog);

  let lbIndex = 0;
  let resumeAfterDialog = false;
  const showLightbox = (i) => {
    lbIndex = (i + items.length) % items.length;
    const item = items[lbIndex];
    lbImg.onerror = () => {
      lbImg.onerror = null;
      lbImg.src = sizedImageUrl(item.url, 1920);
    };
    lbImg.src = sizedImageUrl(lightboxUrl(item.url), window.innerWidth > 1440 ? 2560 : 1920);
    lbImg.alt = item.alt;
    lbCounter.querySelector('.mg-current').textContent = lbIndex + 1;
  };
  let pauseMarquee;
  let playMarquee;
  let paused = !autoplay;
  const openLightbox = (i) => {
    showLightbox(i);
    resumeAfterDialog = !paused;
    pauseMarquee();
    dialog.showModal();
    document.documentElement.classList.add('mg-lightbox-open');
  };
  dialog.addEventListener('close', () => {
    document.documentElement.classList.remove('mg-lightbox-open');
    if (resumeAfterDialog) playMarquee();
  });
  dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
  lbClose.addEventListener('click', () => dialog.close());
  lbPrev.addEventListener('click', () => showLightbox(lbIndex - 1));
  lbNext.addEventListener('click', () => showLightbox(lbIndex + 1));
  dialog.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') showLightbox(lbIndex - 1);
    if (e.key === 'ArrowRight') showLightbox(lbIndex + 1);
  });

  /* ---------------------------------------------------------------- desktop marquee */
  let pos = 0;
  let setWidth = 0;
  let raf = null;
  let last = 0;
  let hover = false;
  let inView = false;

  const itemWidth = () => {
    const first = track.firstElementChild;
    const w = first ? first.getBoundingClientRect().width : 0;
    return w || 300;
  };
  // enough copies of the set to fill the viewport while the strip wraps around
  const ensureClones = () => {
    const setW = itemWidth() * items.length;
    const needed = Math.min(8, Math.max(1, Math.ceil((window.innerWidth + 1) / setW)));
    const have = track.querySelectorAll('.mg-clone').length / items.length;
    for (let c = have; c < needed; c += 1) {
      items.forEach((item, i) => track.append(makeItem(item, i, true)));
    }
  };
  const measure = () => { setWidth = itemWidth() * items.length; };
  const apply = () => {
    if (setWidth) pos = ((pos % setWidth) + setWidth) % setWidth;
    track.style.transform = `translateX(${-pos}px)`;
  };
  const frame = (now) => {
    const dt = last ? Math.min(100, now - last) : 0;
    last = now;
    if (!hover) {
      pos += (SPEED * dt) / 1000;
      apply();
    }
    raf = requestAnimationFrame(frame);
  };
  const run = () => {
    if (raf || paused || !inView || MOBILE.matches) return;
    last = 0;
    track.classList.remove('is-stepping');
    raf = requestAnimationFrame(frame);
  };
  const stop = () => {
    if (raf) cancelAnimationFrame(raf);
    raf = null;
  };
  const updateNav = () => {
    block.classList.toggle('is-paused', paused);
    pauseBtn.hidden = paused;
    playBtn.hidden = !paused;
    prevBtn.hidden = !paused;
    nextBtn.hidden = !paused;
  };
  pauseMarquee = () => {
    paused = true;
    stop();
    updateNav();
  };
  playMarquee = () => {
    paused = false;
    updateNav();
    run();
  };
  pauseBtn.addEventListener('click', () => { pauseMarquee(); playBtn.focus(); });
  playBtn.addEventListener('click', () => { playMarquee(); pauseBtn.focus(); });
  const step = (dir) => {
    const w = itemWidth();
    let base = Math.round(pos / w) * w;
    if (dir < 0 && base - w < 0) {
      // jump to the identical view one set further (clones), then step back from there
      base += setWidth;
      track.classList.remove('is-stepping');
      track.style.transform = `translateX(${-base}px)`;
      track.getBoundingClientRect();
    }
    pos = base + dir * w;
    track.classList.add('is-stepping');
    track.style.transform = `translateX(${-pos}px)`;
    const done = () => {
      track.classList.remove('is-stepping');
      apply();
    };
    track.addEventListener('transitionend', done, { once: true });
    setTimeout(done, 700);
  };
  prevBtn.addEventListener('click', () => step(-1));
  nextBtn.addEventListener('click', () => step(1));
  viewport.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') hover = true; });
  viewport.addEventListener('pointerleave', () => { hover = false; });
  viewport.addEventListener('focusin', () => { hover = true; });
  viewport.addEventListener('focusout', () => { hover = false; });

  /* ---------------------------------------------------------------- mobile slider */
  let current = 0;
  const setCurrent = (i, animate = true) => {
    current = Math.max(0, Math.min(items.length - 1, i));
    const w = itemWidth();
    track.style.transition = animate ? '' : 'none';
    track.style.transform = `translateX(${-current * w}px)`;
    mobileCounter.querySelector('.mg-current').textContent = current + 1;
    progress.style.setProperty('--mg-index', current);
    [...caption.children].forEach((c, k) => c.classList.toggle('is-active', k === current));
  };
  let drag = null;
  viewport.addEventListener('pointerdown', (e) => {
    if (!MOBILE.matches) return;
    drag = {
      x: e.clientX, y: e.clientY, dx: 0, moved: false,
    };
  });
  viewport.addEventListener('pointermove', (e) => {
    if (!drag) return;
    drag.dx = e.clientX - drag.x;
    const horizontal = Math.abs(drag.dx) > Math.abs(e.clientY - drag.y);
    if (!drag.moved && Math.abs(drag.dx) > 8 && horizontal) drag.moved = true;
    if (drag.moved) {
      track.style.transition = 'none';
      track.style.transform = `translateX(${-current * itemWidth() + drag.dx}px)`;
    }
  });
  const endDrag = () => {
    if (!drag) return;
    const { dx, moved } = drag;
    drag = null;
    if (!moved) return;
    let target = current;
    if (dx < -40) target += 1;
    if (dx > 40) target -= 1;
    setCurrent(target);
    viewport.addEventListener('click', (ev) => { ev.preventDefault(); ev.stopPropagation(); }, { capture: true, once: true });
  };
  viewport.addEventListener('pointerup', endDrag);
  viewport.addEventListener('pointercancel', endDrag);

  track.addEventListener('click', (e) => {
    const btn = e.target.closest('.mg-media');
    if (!btn) return;
    const i = Number(btn.dataset.index);
    if (MOBILE.matches && i !== current) {
      setCurrent(i);
      return;
    }
    openLightbox(i);
  });

  /* ---------------------------------------------------------------- modes */
  const setMode = () => {
    stop();
    if (MOBILE.matches) {
      track.querySelectorAll('.mg-clone').forEach((c) => c.remove());
      setCurrent(current, false);
    } else {
      track.style.transition = '';
      ensureClones();
      measure();
      apply();
      run();
    }
  };
  MOBILE.addEventListener('change', setMode);
  new ResizeObserver(() => {
    if (MOBILE.matches) setCurrent(current, false);
    else {
      ensureClones();
      measure();
      apply();
    }
  }).observe(viewport);
  new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      inView = entry.isIntersecting;
      if (inView) run(); else stop();
    });
  }).observe(block);

  updateNav();
  setMode();
}
