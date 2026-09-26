import { buildBmwMedia, swapScene7Crop, sizedImageUrl } from '../../scripts/bmw-utils.js';

/*
 * Media Showcase (source: mediashowcase-v1): full-bleed showcase of images/videos that play one
 * after another, with the item texts on top.
 * Rows: cell 1 = media (desktop, mobile[, tablet] images, or poster image(s) + desktop/mobile video
 * links), cell 2 = h3 title + description.
 * Options: interior (dark variant: headline + "details", control bar with pagination, sound and
 * play/pause; media fade in from dark), intro (interior: first row = intro video + h2 intro title).
 * Default ("exterior"): glass panel listing all titles, the active one expands its description.
 */

const IMAGE_DURATION = 6000;
const LABELS = {
  more: '... Details anzeigen',
  less: '... Details ausblenden',
  play: 'Wiedergabe starten',
  pause: 'Wiedergabe pausieren',
  mute: 'Ton einschalten',
  unmute: 'Ton ausschalten',
  slide: 'Element',
};
const RING = 2 * Math.PI * 17;
let seq = 0;

function icon(name, cls = '') {
  const span = document.createElement('span');
  span.className = `bmw-icon ${cls}`.trim();
  span.setAttribute('aria-hidden', 'true');
  span.textContent = name;
  return span;
}

function playButton(cls) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = `media-showcase-play ${cls}`;
  button.setAttribute('aria-label', LABELS.pause);
  button.append(icon('pause', 'media-showcase-icon-pause'), icon('play', 'media-showcase-icon-play'));
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 36 36');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  svg.classList.add('media-showcase-ring');
  const circle = document.createElementNS(ns, 'circle');
  circle.setAttribute('cx', '18');
  circle.setAttribute('cy', '18');
  circle.setAttribute('r', '17');
  circle.setAttribute('fill', 'none');
  circle.setAttribute('stroke-dasharray', `0 ${RING}`);
  svg.append(circle);
  button.append(svg);
  return button;
}

/** Media of a row; exterior images get the 16:9 crop between 1024 and 1279px like the source. */
function buildMedia(cell, eager) {
  const { element, player } = buildBmwMedia(cell, {
    eager,
    sizes: '100vw',
    video: {
      autoplay: false, loop: false, playButton: false, controls: false,
    },
  });
  if (!element) return { element: null, player: null };
  const picture = element.querySelector('picture');
  const desktopSource = picture && [...picture.querySelectorAll('source')].find((s) => !s.media);
  const img = picture && picture.querySelector('img');
  if (desktopSource && img) {
    const url = new URL(img.src);
    ['wid', 'fmt', 'qlt', 'fit'].forEach((p) => url.searchParams.delete(p));
    const crop = swapScene7Crop(url.href, '16to9');
    if (crop && /:16to7$/i.test(decodeURIComponent(url.pathname))) {
      const source = document.createElement('source');
      source.media = '(max-width: 1279px)';
      source.srcset = [1024, 1280, 1920].map((w) => `${sizedImageUrl(crop, w)} ${w}w`).join(', ');
      source.sizes = '100vw';
      desktopSource.before(source);
    }
  }
  return { element, player };
}

function splitRow(row) {
  const cells = [...row.children];
  const mediaCell = cells.find((c) => c.querySelector('a[href], img, picture')) || cells[0];
  const textCell = cells.find((c) => c !== mediaCell) || null;
  return { mediaCell, textCell };
}

export default function decorate(block) {
  seq += 1;
  const id = `media-showcase-${seq}`;
  const interior = block.classList.contains('interior');
  block.classList.toggle('exterior', !interior);
  const rows = [...block.children];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const stage = document.createElement('div');
  stage.className = 'media-showcase-stage';
  const slidesEl = document.createElement('div');
  slidesEl.className = 'media-showcase-slides';
  stage.append(slidesEl);

  // intro (interior only)
  let intro = null;
  if (interior && block.classList.contains('intro') && rows.length > 1) {
    const { mediaCell, textCell } = splitRow(rows.shift());
    const media = buildMedia(mediaCell, false);
    if (media.element) {
      const el = document.createElement('div');
      el.className = 'media-showcase-intro';
      el.append(media.element);
      const title = document.createElement('div');
      title.className = 'media-showcase-intro-title';
      const h = textCell && textCell.querySelector('h1, h2, h3, h4, h5, h6, p');
      if (h) {
        const heading = document.createElement('h2');
        heading.append(...h.childNodes);
        title.append(heading);
      }
      stage.append(el, title);
      intro = { el, title, player: media.player };
    }
  }

  const items = [];
  rows.forEach((row) => {
    const { mediaCell, textCell } = splitRow(row);
    const media = buildMedia(mediaCell, false);
    const heading = textCell && textCell.querySelector('h1, h2, h3, h4, h5, h6');
    const title = heading ? heading.innerHTML : '';
    if (heading) heading.remove();
    const desc = [...(textCell ? textCell.children : [])].filter((n) => n.textContent.trim() || n.querySelector('a, img'));
    if (!media.element && !title) return;
    const slide = document.createElement('div');
    slide.className = 'media-showcase-slide';
    slide.setAttribute('aria-hidden', 'true');
    if (media.element) slide.append(media.element);
    slidesEl.append(slide);
    items.push({
      slide, player: media.player, title, desc,
    });
  });
  if (!items.length) {
    block.replaceChildren();
    return;
  }

  // text panel
  const panel = document.createElement('div');
  panel.className = 'media-showcase-panel';
  items.forEach((item, i) => {
    const wrap = document.createElement('div');
    wrap.className = 'media-showcase-item';
    const descId = `${id}-desc-${i}`;
    const heading = document.createElement('h3');
    heading.className = 'media-showcase-title';
    if (interior) {
      heading.innerHTML = item.title;
    } else {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'media-showcase-bullet';
      btn.innerHTML = item.title;
      btn.addEventListener('click', () => item.select());
      heading.append(btn);
    }
    const desc = document.createElement('div');
    desc.className = 'media-showcase-desc';
    desc.id = descId;
    desc.append(...item.desc);
    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'media-showcase-toggle';
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', descId);
    toggle.innerHTML = `<span class="media-showcase-more">${LABELS.more}</span><span class="media-showcase-less">${LABELS.less}</span>`;
    if (!item.desc.length) toggle.hidden = true;
    wrap.append(heading, desc, toggle);
    panel.append(wrap);
    Object.assign(item, { wrap, desc, toggle });
  });
  stage.append(panel);

  // controls
  const buttons = [];
  let soundBtn = null;
  const bullets = [];
  if (interior) {
    const gradient = document.createElement('div');
    gradient.className = 'media-showcase-gradient';
    stage.append(gradient);
    const bar = document.createElement('div');
    bar.className = 'media-showcase-controls';
    const play = playButton('media-showcase-play-interior');
    buttons.push(play);
    soundBtn = document.createElement('button');
    soundBtn.type = 'button';
    soundBtn.className = 'media-showcase-sound';
    soundBtn.setAttribute('aria-label', LABELS.mute);
    soundBtn.append(icon('speaker_muted', 'media-showcase-icon-muted'), icon('speaker_waves', 'media-showcase-icon-unmuted'));
    const pagination = document.createElement('div');
    pagination.className = 'media-showcase-pagination';
    items.forEach((item, i) => {
      if (i) {
        const line = document.createElement('span');
        line.className = 'media-showcase-line';
        pagination.append(line);
      }
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'media-showcase-dot';
      b.setAttribute('aria-label', `${LABELS.slide} ${i + 1}`);
      b.addEventListener('click', () => item.select());
      pagination.append(b);
      bullets.push(b);
    });
    if (items.length < 2) pagination.hidden = true;
    bar.append(play, soundBtn, pagination);
    stage.append(bar);
  } else {
    const desktop = playButton('media-showcase-play-desktop');
    const mobile = playButton('media-showcase-play-mobile');
    stage.append(desktop);
    panel.append(mobile);
    buttons.push(desktop, mobile);
  }

  block.replaceChildren(stage);

  /* ---------------------------------------------------------------- playback */
  let current = -1;
  let playing = !reducedMotion;
  let inView = false;
  let introDone = !intro;
  let muted = true;
  let timer = null;
  let elapsed = 0;
  let startedAt = 0;

  const setProgress = (ratio) => {
    const dash = `${(Math.max(0, Math.min(1, ratio)) * RING).toFixed(2)} ${RING}`;
    buttons.forEach((b) => b.querySelector('circle').setAttribute('stroke-dasharray', dash));
  };
  const updateButtons = () => {
    buttons.forEach((b) => {
      b.classList.toggle('is-playing', playing);
      b.setAttribute('aria-label', playing ? LABELS.pause : LABELS.play);
    });
    if (soundBtn) {
      block.classList.toggle('is-muted', muted);
      soundBtn.setAttribute('aria-label', muted ? LABELS.mute : LABELS.unmute);
    }
  };
  const stopTimer = () => {
    if (timer) cancelAnimationFrame(timer);
    timer = null;
  };
  const activePlayer = () => (introDone ? items[current] && items[current].player : intro.player);

  let next;
  const runTimer = () => {
    stopTimer();
    startedAt = performance.now() - elapsed;
    const tick = (now) => {
      elapsed = now - startedAt;
      setProgress(elapsed / IMAGE_DURATION);
      if (elapsed >= IMAGE_DURATION) {
        timer = null;
        next();
        return;
      }
      timer = requestAnimationFrame(tick);
    };
    timer = requestAnimationFrame(tick);
  };

  const resume = () => {
    if (!inView || !playing) return;
    const player = activePlayer();
    if (player) {
      player.video.muted = muted;
      player.play();
    } else if (introDone) {
      runTimer();
    }
  };
  const halt = () => {
    stopTimer();
    const player = activePlayer();
    if (player) player.pause();
  };

  const isExpanded = () => current >= 0 && items[current].wrap.classList.contains('is-expanded');

  // animate height 0 <-> content height (capped by the CSS max-height), then release to "auto"
  const setExpanded = (item, expanded) => {
    const { desc } = item;
    if (item.wrap.classList.contains('is-expanded') === expanded) return;
    item.toggle.setAttribute('aria-expanded', String(expanded));
    if (expanded) {
      item.wrap.classList.add('is-expanded');
      desc.style.height = `${desc.scrollHeight}px`;
      const done = () => {
        if (item.wrap.classList.contains('is-expanded')) desc.style.height = 'auto';
      };
      desc.addEventListener('transitionend', done, { once: true });
      setTimeout(done, 800);
    } else {
      desc.style.height = `${desc.offsetHeight}px`;
      // force layout so the collapse animates from the current height
      desc.getBoundingClientRect();
      item.wrap.classList.remove('is-expanded');
      desc.style.height = '';
    }
  };

  const activate = (index) => {
    if (index === current || !items[index]) return;
    const prev = items[current];
    if (prev) {
      stopTimer();
      if (prev.player) prev.player.pause();
      setExpanded(prev, false);
      prev.slide.classList.remove('is-active');
      prev.slide.setAttribute('aria-hidden', 'true');
      prev.wrap.classList.remove('is-active');
    }
    current = index;
    elapsed = 0;
    setProgress(0);
    const item = items[index];
    item.slide.classList.add('is-active');
    item.slide.removeAttribute('aria-hidden');
    item.wrap.classList.add('is-active');
    bullets.forEach((b, i) => {
      b.classList.toggle('is-active', i === index);
      if (i === index) b.setAttribute('aria-current', 'true');
      else b.removeAttribute('aria-current');
    });
    if (item.player) {
      item.player.video.currentTime = 0;
      item.player.video.muted = muted;
    }
    block.classList.toggle('has-video', !!item.player);
    resume();
  };

  next = () => {
    if (isExpanded()) {
      // hold the item while its details are read: replay it
      elapsed = 0;
      const player = activePlayer();
      if (player) {
        player.video.currentTime = 0;
        resume();
      } else runTimer();
      return;
    }
    activate((current + 1) % items.length);
  };
  const prevItem = () => activate((current - 1 + items.length) % items.length);

  const finishIntro = () => {
    if (introDone) return;
    introDone = true;
    intro.player.pause();
    block.classList.add('intro-done');
    activate(0);
  };

  items.forEach((item, i) => {
    item.select = () => {
      if (!introDone) finishIntro();
      activate(i);
    };
    item.toggle.addEventListener('click', () => {
      if (current !== i) activate(i);
      setExpanded(item, !item.wrap.classList.contains('is-expanded'));
    });
    if (item.player) {
      const { video } = item.player;
      video.addEventListener('timeupdate', () => {
        if (current === i && video.duration) setProgress(video.currentTime / video.duration);
      });
      video.addEventListener('ended', () => { if (current === i) next(); });
    }
  });

  if (intro) {
    if (intro.player) {
      intro.player.video.addEventListener('ended', finishIntro);
      intro.player.video.addEventListener('error', finishIntro);
      intro.player.video.addEventListener('playing', () => block.classList.add('intro-playing'));
    } else {
      setTimeout(finishIntro, IMAGE_DURATION);
    }
    block.classList.add('has-intro');
  }

  buttons.forEach((b) => b.addEventListener('click', () => {
    playing = !playing;
    updateButtons();
    if (playing) resume(); else halt();
  }));
  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      muted = !muted;
      [...items.map((it) => it.player), intro && intro.player].filter(Boolean).forEach((p) => {
        p.video.muted = muted;
      });
      updateButtons();
    });
  }

  // swipe between items
  let startX = null;
  let startY = 0;
  stage.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse' || e.target.closest('button, a, .media-showcase-desc')) return;
    startX = e.clientX;
    startY = e.clientY;
  });
  stage.addEventListener('pointerup', (e) => {
    if (startX === null) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    startX = null;
    if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy)) return;
    if (!introDone) finishIntro();
    if (dx < 0) activate((current + 1) % items.length); else prevItem();
  });
  stage.addEventListener('pointercancel', () => { startX = null; });

  block.addEventListener('keydown', (e) => {
    if (!e.target.closest('.media-showcase-pagination')) return;
    if (e.key === 'ArrowRight') activate((current + 1) % items.length);
    if (e.key === 'ArrowLeft') prevItem();
  });

  updateButtons();
  if (introDone) activate(0);

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      inView = entry.isIntersecting;
      if (inView) {
        block.classList.add('is-in-view');
        resume();
      } else halt();
    });
  }, { threshold: 0.4 });
  // the videos wait for page load (LCP); start observing afterwards
  const observe = () => io.observe(block);
  if (document.readyState === 'complete') observe();
  else window.addEventListener('load', observe, { once: true });
}
