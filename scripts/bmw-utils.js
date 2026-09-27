/**
 * Shared helpers for BMW blocks: Scene7 responsive pictures and the BMW ligature icon font.
 */

const SCENE7_IMAGE_RE = /^https?:\/\/[^/]*scene7\.com\/is\/image\//i;
const IMAGE_EXT_RE = /\.(jpe?g|png|webp|avif|gif)(\?|#|$)/i;
// Scene7 smart-crop suffix on the asset name, e.g. "asset_new:3to1"
const CROP_RE = /:([0-9]+to[0-9]+)$/i;

/**
 * Whether a URL points at a Scene7 image.
 * @param {string} url
 * @returns {boolean}
 */
export function isScene7Image(url) {
  return SCENE7_IMAGE_RE.test(url || '');
}

/**
 * Returns a sized image URL. Scene7 URLs keep their asset path (incl. smart crop) and
 * any non-size params (e.g. fit); wid/fmt/qlt are set. EDS media URLs get width/format.
 * Other URLs are returned unchanged.
 * @param {string} url
 * @param {number} width
 * @returns {string}
 */
export function sizedImageUrl(url, width) {
  let u;
  try {
    u = new URL(url, window.location.href);
  } catch {
    return url;
  }
  if (isScene7Image(u.href)) {
    ['wid', 'hei', 'fmt', 'qlt', 'scl', 'size'].forEach((p) => u.searchParams.delete(p));
    if (width) u.searchParams.set('wid', width);
    u.searchParams.set('fmt', 'webp');
    u.searchParams.set('qlt', '80');
    // smart crops (":3to2") are only honoured for sized requests with fit=constrain
    if (CROP_RE.test(decodeURIComponent(u.pathname)) && !u.searchParams.has('fit')) {
      u.searchParams.set('fit', 'constrain,1');
    }
    return u.href;
  }
  if (u.origin === window.location.origin && u.pathname.includes('/media_')) {
    if (width) u.searchParams.set('width', width);
    u.searchParams.set('format', 'webply');
    u.searchParams.set('optimize', 'medium');
    return u.href;
  }
  return u.href;
}

/**
 * Swaps the Scene7 smart crop suffix of an asset (":3to1" -> ":3to2").
 * @param {string} url
 * @param {string} crop e.g. "3to2"
 * @returns {string|null} new URL, or null if the URL has no crop suffix to swap
 */
export function swapScene7Crop(url, crop) {
  if (!isScene7Image(url)) return null;
  const u = new URL(url);
  const path = decodeURIComponent(u.pathname);
  if (!CROP_RE.test(path)) return null;
  u.pathname = path.replace(CROP_RE, `:${crop}`);
  return u.href;
}

/**
 * Collects image references (in document order) from authored markup: <img> elements
 * and links pointing at images (Scene7 or common image extensions).
 * @param {Element} el
 * @returns {{url: string, alt: string, el: Element}[]}
 */
export function getImageRefs(el) {
  const refs = [];
  if (!el) return refs;
  el.querySelectorAll('img, a[href]').forEach((node) => {
    if (node.tagName === 'IMG') {
      const src = node.getAttribute('src');
      if (src) refs.push({ url: new URL(src, window.location.href).href, alt: node.alt || '', el: node });
      return;
    }
    if (node.querySelector('img')) return;
    const { href } = node;
    if (isScene7Image(href) || IMAGE_EXT_RE.test(href)) {
      const text = node.textContent.trim();
      const alt = node.title || (text && text !== href && !/^https?:/.test(text) ? text : '');
      refs.push({ url: href, alt, el: node });
    }
  });
  return refs;
}

/**
 * Builds a responsive <picture> from per-breakpoint image URLs.
 * @param {{media?: string, url: string, widths: number[]}[]} sources ordered; the last entry
 *   (without media) is the fallback
 * @param {object} [opts]
 * @param {string} [opts.alt]
 * @param {boolean} [opts.eager]
 * @param {string} [opts.sizes]
 * @returns {HTMLPictureElement}
 */
export function buildResponsivePicture(sources, { alt = '', eager = false, sizes = '100vw' } = {}) {
  const picture = document.createElement('picture');
  const valid = sources.filter((s) => s && s.url);
  valid.forEach(({ media, url, widths }) => {
    const source = document.createElement('source');
    if (media) source.media = media;
    source.srcset = widths.map((w) => `${sizedImageUrl(url, w)} ${w}w`).join(', ');
    source.sizes = sizes;
    picture.append(source);
  });
  const fallback = valid[valid.length - 1];
  const img = document.createElement('img');
  if (fallback) img.src = sizedImageUrl(fallback.url, fallback.widths[fallback.widths.length - 1]);
  img.alt = alt;
  img.loading = eager ? 'eager' : 'lazy';
  if (eager) img.fetchPriority = 'high';
  img.decoding = 'async';
  picture.append(img);
  return picture;
}

/**
 * Converts authored icons (":icon_name:" -> span.icon.icon-icon_name) to BMW icon-font
 * ligatures: the span's text becomes the icon name and the font renders the glyph.
 * With `{ text: true }`, also converts literal ":icon_name:" text nodes that were not
 * turned into spans (only use on elements meant to hold icons).
 * @param {Element} root
 * @param {{text?: boolean}} [opts]
 */
export function decorateFontIcons(root, { text = false } = {}) {
  if (!root) return;
  const toIcon = (span, name) => {
    span.className = 'icon bmw-icon';
    span.dataset.icon = name;
    span.setAttribute('aria-hidden', 'true');
    span.replaceChildren(document.createTextNode(name));
  };
  root.querySelectorAll('span.icon').forEach((span) => {
    const cls = [...span.classList].find((c) => c.startsWith('icon-'));
    if (!cls) return;
    toIcon(span, cls.substring(5).replace(/-/g, '_'));
  });
  if (!text) return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  while (walker.nextNode()) {
    if (/:[a-z0-9_]+:/i.test(walker.currentNode.nodeValue)
      && !walker.currentNode.parentElement.closest('.bmw-icon, a[href]')) {
      textNodes.push(walker.currentNode);
    }
  }
  textNodes.forEach((node) => {
    const parts = node.nodeValue.split(/(:[a-z0-9_]+:)/i);
    const frag = document.createDocumentFragment();
    parts.forEach((part) => {
      const m = part.match(/^:([a-z0-9_]+):$/i);
      if (m) {
        const span = document.createElement('span');
        toIcon(span, m[1].toLowerCase());
        frag.append(span);
      } else if (part) {
        frag.append(document.createTextNode(part));
      }
    });
    node.replaceWith(frag);
  });
}

/**
 * Moves consecutive button paragraphs (p.button-wrapper) inside a container into one
 * flex group element.
 * @param {Element} container
 * @param {string} className class for the group element
 * @returns {Element[]} the created groups
 */
export function groupButtons(container, className) {
  const groups = [];
  let current = null;
  [...container.children].forEach((child) => {
    if (child.matches('p.button-wrapper')) {
      if (!current) {
        current = document.createElement('div');
        current.className = className;
        child.before(current);
        groups.push(current);
      }
      current.append(child);
    } else {
      current = null;
    }
  });
  return groups;
}

/* ------------------------------------------------------------------------------------------
 * BMW video player (shared by hero-stage, hero-teaser, media, video, text-media-teaser)
 * ---------------------------------------------------------------------------------------- */

const VIDEO_URL_RE = /\.(m3u8|mp4|webm|mov)(\?|#|$)|\/is\/content\/|stream\.bmw\.com\.cn/i;
const MOBILE_VIDEO_NAME_RE = /[_-]mob(ile)?([_.-]|$)/i;
const HLS_JS_URL = 'https://cdn.jsdelivr.net/npm/hls.js@1/dist/hls.min.js';
const PLAYER_CSS = '/scripts/bmw-video.css';
const RING_LENGTH = 2 * Math.PI * 17;
const LABELS = {
  play: 'Video abspielen',
  pause: 'Video pausieren',
  mute: 'Ton einschalten',
  unmute: 'Ton ausschalten',
  fullscreen: 'Vollbild',
  seek: 'Video-Fortschritt',
};

let hlsPromise;
let playerCssPromise;

/**
 * Whether a URL points at a video (HLS/MP4 file, Scene7 video content, BMW China stream).
 * @param {string} url
 * @returns {boolean}
 */
export function isVideoUrl(url) {
  return VIDEO_URL_RE.test(url || '') && !SCENE7_IMAGE_RE.test(url || '');
}

/**
 * Collects video links (in document order) from authored markup.
 * @param {Element} el
 * @returns {{url: string, title: string, el: Element}[]}
 */
export function getVideoRefs(el) {
  if (!el) return [];
  return [...el.querySelectorAll('a[href]')]
    .filter((a) => isVideoUrl(a.href))
    .map((a) => {
      const text = a.textContent.trim();
      return { url: a.href, title: text && !/^https?:/.test(text) ? text : '', el: a };
    });
}

/**
 * Picks desktop and mobile refs from an ordered list (desktop first). If the first ref's file
 * name contains "_mob" and the second's does not, the two are swapped.
 * @param {{url: string}[]} list
 * @returns {{desktop: object|null, mobile: object|null}}
 */
export function splitDesktopMobile(list) {
  if (!list || !list.length) return { desktop: null, mobile: null };
  const isMobile = (r) => MOBILE_VIDEO_NAME_RE.test(r.url.split('?')[0].split('/').pop());
  // authored order is desktop, mobile; swap only when clearly reversed by the file names
  if (list.length > 1 && isMobile(list[0]) && !isMobile(list[1])) {
    return { desktop: list[1], mobile: list[0] };
  }
  return { desktop: list[0], mobile: list[1] || list[0] };
}

/**
 * Removes an authored media reference (link/picture) and its paragraph if it becomes empty.
 * @param {Element} node
 */
export function removeAuthoredRef(node) {
  if (!node) return;
  const target = node.closest('picture') || node;
  const p = target.parentElement && target.parentElement.closest('p');
  target.remove();
  if (p && !p.textContent.trim() && !p.querySelector('img, picture, a')) p.remove();
}

function loadHls() {
  if (!hlsPromise) {
    hlsPromise = new Promise((resolve, reject) => {
      if (window.Hls) {
        resolve(window.Hls);
        return;
      }
      const script = document.createElement('script');
      script.src = HLS_JS_URL;
      script.async = true;
      script.onload = () => (window.Hls ? resolve(window.Hls) : reject(new Error('hls.js missing')));
      script.onerror = () => reject(new Error('hls.js failed to load'));
      document.head.append(script);
    });
  }
  return hlsPromise;
}

function loadPlayerCss() {
  if (!playerCssPromise) {
    playerCssPromise = new Promise((resolve) => {
      const base = (window.hlx && window.hlx.codeBasePath) || '';
      const href = `${base}${PLAYER_CSS}`;
      if (document.querySelector(`head > link[href="${href}"]`)) {
        resolve();
        return;
      }
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.onload = () => resolve();
      link.onerror = () => resolve();
      document.head.append(link);
    });
  }
  return playerCssPromise;
}

/**
 * Attaches a video URL to a <video>: native playback for MP4 and Safari HLS, lazily loaded
 * hls.js (jsdelivr) for HLS elsewhere.
 * @param {HTMLVideoElement} video
 * @param {string} url
 * @returns {Promise<{destroy: function}>}
 */
export async function attachVideoSource(video, url) {
  const isHls = /\.m3u8(\?|#|$)/i.test(url) || /stream\.bmw\.com\.cn\/hls/i.test(url);
  if (!isHls || video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = url;
    return { destroy: () => { video.removeAttribute('src'); video.load(); } };
  }
  const Hls = await loadHls();
  // no MSE (or no H.264 in MSE): the stream cannot play, keep whatever poster the caller shows
  if (!Hls.isSupported()) throw new Error('HLS playback not supported');
  const hls = new Hls({ capLevelToPlayerSize: true, startLevel: -1 });
  hls.loadSource(url);
  hls.attachMedia(video);
  return { destroy: () => hls.destroy() };
}

function formatTime(sec) {
  if (!Number.isFinite(sec) || sec < 0) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

function iconSpan(name, className) {
  const span = document.createElement('span');
  span.className = `bmw-video-icon ${className || ''}`.trim();
  span.setAttribute('aria-hidden', 'true');
  span.dataset.icon = name;
  span.textContent = name;
  return span;
}

function buildProgressiveButton() {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'bmw-video-playbutton';
  button.setAttribute('aria-label', LABELS.play);
  button.append(iconSpan('play', 'bmw-video-icon-play'), iconSpan('pause', 'bmw-video-icon-pause'));
  const svgNs = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNs, 'svg');
  svg.setAttribute('class', 'bmw-video-ring');
  svg.setAttribute('viewBox', '0 0 36 36');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  const circle = document.createElementNS(svgNs, 'circle');
  circle.setAttribute('cx', '18');
  circle.setAttribute('cy', '18');
  circle.setAttribute('r', '17');
  circle.setAttribute('fill', 'none');
  circle.setAttribute('stroke-width', '1');
  circle.setAttribute('stroke-dasharray', `0 ${RING_LENGTH}`);
  svg.append(circle);
  button.append(svg);
  return { button, circle };
}

function buildControlBar() {
  const bar = document.createElement('div');
  bar.className = 'bmw-video-controls';
  bar.innerHTML = `
    <button type="button" class="bmw-video-control bmw-video-toggle" aria-label="${LABELS.play}"></button>
    <div class="bmw-video-progress" role="slider" tabindex="0" aria-label="${LABELS.seek}"
      aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" aria-valuetext="0:00">
      <div class="bmw-video-progress-track"><div class="bmw-video-progress-fill"></div>
      <div class="bmw-video-progress-knob"></div></div>
    </div>
    <div class="bmw-video-time"><span class="bmw-video-current">0:00</span>&nbsp;/&nbsp;<span class="bmw-video-total">0:00</span></div>
    <button type="button" class="bmw-video-control bmw-video-mute" aria-label="${LABELS.mute}"></button>
    <button type="button" class="bmw-video-control bmw-video-fullscreen" aria-label="${LABELS.fullscreen}"></button>`;
  bar.querySelector('.bmw-video-toggle').append(iconSpan('play', 'bmw-video-icon-play'), iconSpan('pause', 'bmw-video-icon-pause'));
  bar.querySelector('.bmw-video-mute').append(iconSpan('speaker_muted', 'bmw-video-icon-muted'), iconSpan('speaker_waves', 'bmw-video-icon-unmuted'));
  bar.querySelector('.bmw-video-fullscreen').append(iconSpan('arrows_maximize'));
  return bar;
}

/**
 * Creates a BMW-style video player (poster, lazy HLS/MP4 source per breakpoint, autoplay in
 * view, progressive play button or dark control bar).
 * @param {object} opts
 * @param {{url: string}} opts.desktop desktop video ref (required)
 * @param {{url: string}} [opts.mobile] mobile video ref (below `breakpoint`)
 * @param {HTMLPictureElement} [opts.poster] poster picture (moved into the player)
 * @param {boolean} [opts.autoplay] muted autoplay while in view
 * @param {boolean} [opts.loop]
 * @param {boolean} [opts.controls] dark control bar instead of the progressive play button
 * @param {boolean} [opts.playButton] progressive play button (default: !controls)
 * @param {string} [opts.label] accessible name of the video
 * @param {string} [opts.breakpoint] media query selecting the desktop source
 * @param {Element} [opts.observe] element observed for visibility (default: player element)
 * @returns {{element: HTMLElement, video: HTMLVideoElement, play: function, pause: function}}
 */
export function createBmwVideo(opts) {
  const {
    desktop, mobile, poster, autoplay = false, loop = false, controls = false,
    playButton = !controls, label = '', breakpoint = '(min-width: 1024px)',
  } = opts;
  const element = document.createElement('div');
  element.className = 'bmw-video is-not-started';
  if (controls) element.classList.add('has-controls');
  if (poster) {
    poster.classList.add('bmw-video-poster');
    element.append(poster);
  }
  const video = document.createElement('video');
  video.className = 'bmw-video-player';
  video.muted = true;
  video.defaultMuted = true;
  video.setAttribute('muted', '');
  video.playsInline = true;
  video.setAttribute('playsinline', '');
  video.preload = 'none';
  video.loop = loop;
  if (/scene7\.com|bmw\.com\.cn/i.test(desktop.url)) video.crossOrigin = 'anonymous';
  if (label) video.setAttribute('aria-label', label);
  video.tabIndex = -1;
  // player chrome is added once its stylesheet is available; the poster renders right away
  const chrome = [video];

  const mq = window.matchMedia(breakpoint);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let userPaused = false;
  let inView = false;
  let currentUrl = null;
  let handle = null;
  let attaching = null;

  const attach = async () => {
    const ref = (mq.matches ? desktop : (mobile || desktop));
    if (!ref || ref.url === currentUrl) return;
    const time = video.currentTime;
    const wasPlaying = !video.paused;
    currentUrl = ref.url;
    if (handle) handle.destroy();
    try {
      handle = await attachVideoSource(video, ref.url);
    } catch {
      // not playable here (no native HLS, no MSE, hls.js blocked): the poster stays
      handle = null;
      element.classList.add('is-unsupported');
      return;
    }
    if (time && currentUrl === ref.url) video.currentTime = time;
    if (wasPlaying) video.play().catch(() => {});
  };
  const ensure = () => {
    if (!attaching) attaching = attach();
    return attaching;
  };

  const play = async () => {
    userPaused = false;
    await ensure();
    if (!handle) return; // no playable source: keep the poster, don't fake playback
    const p = video.play();
    if (p && p.catch) p.catch(() => {});
  };
  const pause = () => {
    userPaused = true;
    video.pause();
  };
  const toggle = () => (video.paused || video.ended ? play() : pause());

  let circle = null;
  let pbutton = null;
  if (playButton) {
    const pb = buildProgressiveButton();
    pbutton = pb.button;
    circle = pb.circle;
    pbutton.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggle();
    });
    chrome.push(pbutton);
  }

  let bar = null;
  if (controls) {
    bar = buildControlBar();
    chrome.push(bar);
    const progress = bar.querySelector('.bmw-video-progress');
    const seekTo = (clientX) => {
      const rect = progress.getBoundingClientRect();
      const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
      if (video.duration) video.currentTime = ratio * video.duration;
    };
    let dragging = false;
    progress.addEventListener('pointerdown', (e) => {
      dragging = true;
      progress.setPointerCapture(e.pointerId);
      seekTo(e.clientX);
    });
    progress.addEventListener('pointermove', (e) => { if (dragging) seekTo(e.clientX); });
    progress.addEventListener('pointerup', () => { dragging = false; });
    progress.addEventListener('keydown', (e) => {
      if (!video.duration) return;
      if (e.key === 'ArrowRight') video.currentTime = Math.min(video.duration, video.currentTime + 5);
      if (e.key === 'ArrowLeft') video.currentTime = Math.max(0, video.currentTime - 5);
    });
    bar.querySelector('.bmw-video-toggle').addEventListener('click', toggle);
    bar.querySelector('.bmw-video-mute').addEventListener('click', () => {
      video.muted = !video.muted;
    });
    bar.querySelector('.bmw-video-fullscreen').addEventListener('click', () => {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (video.webkitEnterFullscreen) {
        video.webkitEnterFullscreen();
      }
    });
    video.addEventListener('click', toggle);
  }

  const update = () => {
    const playing = !video.paused && !video.ended;
    element.classList.toggle('is-playing', playing);
    element.classList.toggle('is-muted', video.muted);
    const labelText = playing ? LABELS.pause : LABELS.play;
    if (pbutton) pbutton.setAttribute('aria-label', labelText);
    if (bar) {
      bar.querySelector('.bmw-video-toggle').setAttribute('aria-label', labelText);
      bar.querySelector('.bmw-video-mute').setAttribute('aria-label', video.muted ? LABELS.mute : LABELS.unmute);
    }
  };
  // The poster stays until the video has really presented a frame (not merely fired "playing":
  // headless / no-MSE / throttled browsers report playback without painting anything -> black).
  let frameWatch = false;
  const markStarted = () => {
    frameWatch = false;
    if (video.paused || video.error || !video.videoWidth) return;
    element.classList.remove('is-not-started', 'is-unsupported');
    element.classList.add('is-started');
    update();
  };
  const watchFirstFrame = () => {
    if (frameWatch || element.classList.contains('is-started')) return;
    frameWatch = true;
    if (typeof video.requestVideoFrameCallback === 'function') {
      video.requestVideoFrameCallback((now, meta) => {
        if (meta && meta.presentedFrames === 0) {
          frameWatch = false;
          watchFirstFrame();
          return;
        }
        markStarted();
      });
    } else {
      const onTime = () => {
        if (video.currentTime <= 0.05) return;
        video.removeEventListener('timeupdate', onTime);
        markStarted();
      };
      video.addEventListener('timeupdate', onTime);
    }
  };
  video.addEventListener('playing', () => {
    update();
    watchFirstFrame();
  });
  video.addEventListener('error', () => {
    // source failed (e.g. HLS without MSE): keep the poster for good
    element.classList.remove('is-started', 'is-playing');
    element.classList.add('is-not-started', 'is-unsupported');
  });
  ['pause', 'play', 'ended', 'volumechange'].forEach((ev) => video.addEventListener(ev, update));
  video.addEventListener('timeupdate', () => {
    const { duration, currentTime } = video;
    if (!duration || !Number.isFinite(duration)) return;
    const ratio = currentTime / duration;
    if (circle) circle.setAttribute('stroke-dasharray', `${(ratio * RING_LENGTH).toFixed(2)} ${RING_LENGTH}`);
    if (bar) {
      bar.style.setProperty('--bmw-video-progress', `${(ratio * 100).toFixed(2)}%`);
      bar.querySelector('.bmw-video-current').textContent = formatTime(currentTime);
      const slider = bar.querySelector('.bmw-video-progress');
      slider.setAttribute('aria-valuenow', Math.round(ratio * 100));
      slider.setAttribute('aria-valuetext', formatTime(currentTime));
    }
  });
  video.addEventListener('loadedmetadata', () => {
    if (bar) bar.querySelector('.bmw-video-total').textContent = formatTime(video.duration);
  });
  video.addEventListener('ended', () => {
    if (!loop) element.classList.add('is-ended');
  });

  mq.addEventListener('change', () => {
    if (currentUrl) attaching = attach();
  });

  const ready = loadPlayerCss().then(() => {
    element.append(...chrome);
    element.classList.add('is-ready');
  });
  const start = async () => {
    await ready;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        inView = entry.isIntersecting;
        if (inView) {
          if (autoplay && !reducedMotion && !userPaused) {
            play().then(() => { userPaused = false; });
          } else if (!poster) {
            // no poster: load metadata so the first frame shows
            video.preload = 'metadata';
            ensure();
          }
        } else if (!video.paused) {
          video.pause();
        }
      });
    }, { threshold: 0.25 });
    io.observe(opts.observe || element);
  };
  // the poster is the LCP candidate: wait for page load before touching the video
  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start, { once: true });

  update();
  return {
    element, video, play, pause, toggle,
  };
}

/**
 * Aspect ratio encoded in a Scene7 smart-crop suffix (":16to7" -> "16 / 7").
 * @param {string} url
 * @returns {string} CSS aspect-ratio value or '' when unknown
 */
export function scene7CropRatio(url) {
  if (!isScene7Image(url)) return '';
  let path;
  try {
    path = decodeURIComponent(new URL(url).pathname);
  } catch {
    return '';
  }
  const m = path.match(/:([0-9]+)to([0-9]+)$/i);
  return m ? `${m[1]} / ${m[2]}` : '';
}

/**
 * Builds the media of a block from an authored cell: images (desktop, mobile, tablet) become a
 * responsive <picture>; with video links (desktop, mobile) the picture becomes the poster of a
 * BMW video player. Consumed links/pictures are removed from the cell.
 * Aspect ratios from Scene7 crops are exposed as --bmw-media-ar-{mobile,tablet,desktop} on the
 * returned wrapper (class "bmw-media").
 * @param {Element} cell
 * @param {object} [opts]
 * @param {boolean} [opts.eager] load the image eagerly (LCP)
 * @param {string} [opts.sizes] sizes attribute
 * @param {object} [opts.video] createBmwVideo options (autoplay, loop, controls, playButton)
 * @param {string} [opts.videoBreakpoint] media query for the desktop video source
 * @returns {{element: HTMLElement|null, player: object|null, alt: string}}
 */
export function buildBmwMedia(cell, opts = {}) {
  const videoRefs = getVideoRefs(cell);
  videoRefs.forEach((v) => removeAuthoredRef(v.el));
  const [desktop, mobile, tablet] = getImageRefs(cell);
  getImageRefs(cell).forEach((r) => removeAuthoredRef(r.el));
  const wrapper = document.createElement('div');
  wrapper.className = 'bmw-media';
  let picture = null;
  if (desktop) {
    const small = mobile || desktop;
    const mid = tablet || small;
    picture = buildResponsivePicture([
      { media: '(max-width: 767px)', url: small.url, widths: [480, 768, 1024] },
      { media: '(max-width: 1023px)', url: mid.url, widths: [768, 1024, 1536] },
      { url: desktop.url, widths: [1024, 1440, 1920, 2560] },
    ], { alt: desktop.alt, eager: !!opts.eager, sizes: opts.sizes || '100vw' });
    [['mobile', small.url], ['tablet', mid.url], ['desktop', desktop.url]].forEach(([bp, url]) => {
      const ar = scene7CropRatio(url);
      if (ar) wrapper.style.setProperty(`--bmw-media-ar-${bp}`, ar);
    });
  }
  const videos = splitDesktopMobile(videoRefs);
  let player = null;
  if (videos.desktop) {
    player = createBmwVideo({
      ...(opts.video || {}),
      desktop: videos.desktop,
      mobile: videos.mobile,
      poster: picture,
      label: videos.desktop.title || (desktop && desktop.alt) || '',
      breakpoint: opts.videoBreakpoint || '(min-width: 1024px)',
    });
    if (picture) picture.querySelector('img').alt = '';
    wrapper.classList.add('bmw-media-video');
    wrapper.append(player.element);
  } else if (picture) {
    wrapper.append(picture);
  } else {
    return { element: null, player: null, alt: '' };
  }
  return { element: wrapper, player, alt: desktop ? desktop.alt : '' };
}

/**
 * Whether el is an authored CTA paragraph (a paragraph containing exactly one link and no image).
 * @param {Element} el
 * @returns {boolean}
 */
export function isCtaParagraph(el) {
  if (!el || el.tagName !== 'P') return false;
  const links = el.querySelectorAll('a[href]');
  return links.length === 1 && el.textContent.trim() === links[0].textContent.trim()
    && !el.querySelector('picture, img');
}

/**
 * Groups consecutive CTA paragraphs (buttons and plain links) of a container into flex groups.
 * Plain (non-button) links get `linkClass` and the global "link-arrow" class (BMW "as link"
 * style with a trailing chevron).
 * @param {Element} container
 * @param {string} className class of the group element
 * @param {string} [linkClass] class added to plain links
 * @returns {Element[]} the groups
 */
export function groupCtaLinks(container, className, linkClass = 'bmw-link') {
  const groups = [];
  let group = null;
  [...container.children].forEach((el) => {
    if (isCtaParagraph(el)) {
      const a = el.querySelector('a');
      if (!a.classList.contains('button')) a.classList.add(linkClass, 'link-arrow');
      if (!group) {
        group = document.createElement('div');
        group.className = className;
        el.before(group);
        groups.push(group);
      }
      group.append(el);
    } else {
      group = null;
    }
  });
  return groups;
}

/* ------------------------------------------------------------------------------------------
 * In-page anchors (content-navigation, scroll-navigation, disclaimer "#bottom" links)
 * ---------------------------------------------------------------------------------------- */

const normText = (s) => (s || '').replace(/\s+/g, ' ').trim().toLowerCase();

/**
 * Finds the element an in-page anchor points at. Order: element with that id, section with
 * section-metadata id/anchor (data-id / data-anchor), then the section containing a heading (or
 * paragraph) whose text equals `hint` (the importer stores the target's heading next to nav links).
 * The found section gets the id so plain hash links and :target work afterwards.
 * @param {string} hash "#id" or "id"
 * @param {string} [hint] heading text of the target section
 * @returns {Element|null}
 */
export function findAnchorTarget(hash, hint = '') {
  let id = (hash || '').replace(/^#/, '');
  try {
    id = decodeURIComponent(id).trim();
  } catch {
    id = id.trim();
  }
  if (!id) return null;
  const byId = document.getElementById(id);
  if (byId) return byId;
  const main = document.querySelector('main');
  if (!main) return null;
  const esc = window.CSS && CSS.escape ? CSS.escape(id) : id.replace(/"/g, '\\"');
  let target = main.querySelector(`.section[data-id="${esc}"], .section[data-anchor="${esc}"]`);
  const wanted = normText(hint);
  if (!target && wanted) {
    const skip = '.content-navigation, .scroll-navigation, .cta-collection, dialog, header, footer';
    const nodes = [...main.querySelectorAll('h1, h2, h3, h4, h5, h6, p')]
      .filter((n) => !n.closest(skip));
    const match = nodes.find((n) => normText(n.textContent) === wanted)
      || nodes.find((n) => normText(n.textContent).startsWith(wanted.slice(0, 40)));
    target = match ? (match.closest('.section') || match) : null;
  }
  if (target && !target.id) target.id = id;
  return target;
}

/**
 * Smoothly scrolls to an element, leaving room for fixed bars at the top.
 * @param {Element} el
 * @param {number} [offset] px kept free above the element
 */
export function scrollToElement(el, offset = 0) {
  if (!el) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const top = el.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top: Math.max(0, top), behavior: reduced ? 'auto' : 'smooth' });
}

/* ------------------------------------------------------------------------------------------
 * Info-i tooltip (source .cmp-infoi / tippy): popover beside the icon on desktop, bottom sheet
 * on mobile. Styles: /scripts/bmw-infoi.css (loaded on first use).
 * ---------------------------------------------------------------------------------------- */

let infoCssPromise;
let openInfo = null;

function loadInfoCss() {
  if (!infoCssPromise) {
    infoCssPromise = new Promise((resolve) => {
      const base = (window.hlx && window.hlx.codeBasePath) || '';
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = `${base}/scripts/bmw-infoi.css`;
      link.onload = () => resolve();
      link.onerror = () => resolve();
      document.head.append(link);
    });
  }
  return infoCssPromise;
}

function closeInfo(focus = true) {
  if (!openInfo) return;
  const { button, pop } = openInfo;
  pop.remove();
  button.setAttribute('aria-expanded', 'false');
  if (focus) button.focus({ preventScroll: true });
  openInfo = null;
}

/**
 * Creates an info-i button that shows `content` in a tooltip.
 * @param {Node|string} content tooltip content (nodes are cloned on open; strings are HTML)
 * @param {{label?: string, className?: string}} [opts]
 * @returns {HTMLButtonElement}
 */
export function createInfoButton(content, { label = 'Weitere Informationen', className = '' } = {}) {
  loadInfoCss();
  const button = document.createElement('button');
  button.type = 'button';
  button.className = `bmw-infoi ${className}`.trim();
  button.setAttribute('aria-label', label);
  button.setAttribute('aria-expanded', 'false');
  const icon = document.createElement('span');
  icon.className = 'bmw-icon';
  icon.dataset.icon = 'information';
  icon.setAttribute('aria-hidden', 'true');
  icon.textContent = 'information';
  button.append(icon);
  button.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (openInfo && openInfo.button === button) {
      closeInfo();
      return;
    }
    closeInfo(false);
    const pop = document.createElement('div');
    pop.className = 'bmw-infoi-pop';
    pop.setAttribute('role', 'dialog');
    pop.tabIndex = -1;
    const body = document.createElement('div');
    body.className = 'bmw-infoi-body';
    if (typeof content === 'string') body.innerHTML = content;
    else if (content) body.append(content.cloneNode(true));
    const close = document.createElement('button');
    close.type = 'button';
    close.className = 'bmw-infoi-close';
    close.setAttribute('aria-label', 'Schließen');
    close.innerHTML = '<span class="bmw-icon" data-icon="close" aria-hidden="true">close</span>';
    close.addEventListener('click', () => closeInfo());
    pop.append(close, body);
    document.body.append(pop);
    const mobile = window.matchMedia('(max-width: 767px)').matches;
    if (mobile) {
      pop.classList.add('is-sheet');
    } else {
      const r = button.getBoundingClientRect();
      const w = pop.offsetWidth;
      const h = pop.offsetHeight;
      const vw = document.documentElement.clientWidth;
      const left = Math.min(Math.max(8, r.left + r.width / 2 - w / 2), vw - w - 8);
      const below = window.innerHeight - r.bottom > h + 16 || r.top < h + 16;
      pop.style.left = `${left + window.scrollX}px`;
      pop.style.top = `${(below ? r.bottom + 10 : r.top - h - 10) + window.scrollY}px`;
      pop.dataset.placement = below ? 'bottom' : 'top';
    }
    button.setAttribute('aria-expanded', 'true');
    openInfo = { button, pop };
    pop.focus({ preventScroll: true });
  });
  if (!createInfoButton.bound) {
    createInfoButton.bound = true;
    document.addEventListener('click', (e) => {
      if (openInfo && !openInfo.pop.contains(e.target)) closeInfo(false);
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeInfo(); });
    window.addEventListener('resize', () => closeInfo(false));
  }
  return button;
}

/* ------------------------------------------------------------------------------------------
 * bmw-proxy (Cloudflare worker, tools/workers/bmw-proxy): www.bmw.de endpoints without CORS.
 * Paths are identical to www.bmw.de; other upstream hosts are addressed as /<host>/<path>.
 * The base URL can be overridden with window.BMW_PROXY (e.g. a local mock).
 * ---------------------------------------------------------------------------------------- */

export const BMW_PROXY_DEFAULT = 'https://bmw-proxy.moved-permanently.workers.dev';

/**
 * URL of a www.bmw.de resource through the bmw-proxy worker.
 * @param {string} path absolute www.bmw.de path ("/de-de/login/...") or "/<host>/<path>"
 * @returns {string}
 */
export function bmwProxyUrl(path = '/') {
  const base = String(window.BMW_PROXY || BMW_PROXY_DEFAULT).replace(/\/+$/, '');
  return `${base}${path.startsWith('/') ? '' : '/'}${path}`;
}

/**
 * Adds the screen-reader text of the source's EU AI label ("AI-generated content", source
 * `.cmp-image__ai-label > .a11y-only-screen-reader`) to a media container. The visible label
 * (ai_eu_label icon) is drawn by the block CSS; this only adds the visually hidden text.
 * @param {Element} container media element that carries the label
 * @param {string} [text]
 * @returns {HTMLSpanElement|null}
 */
export function appendAiLabelText(container, text = 'AI-generated content') {
  if (!container) return null;
  const existing = container.querySelector(':scope > .bmw-ai-label-text');
  if (existing) return existing;
  const span = document.createElement('span');
  span.className = 'bmw-ai-label-text';
  span.textContent = text;
  span.style.cssText = 'position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;'
    + 'clip:rect(0,0,0,0);clip-path:inset(50%);white-space:nowrap;border:0;';
  container.append(span);
  return span;
}

/**
 * Horizontal sliders: native lazy loading never fetches the images of slides that sit outside
 * the (overflow: hidden) viewport, so they pop in only while swiping. Once the slider gets close
 * to the viewport, switch all its images to eager loading (the source Swiper preloads them too).
 * @param {Element} block slider root
 * @param {string} [rootMargin]
 */
export function eagerLoadWhenNear(block, rootMargin = '400px 0px') {
  if (!block) return;
  const load = () => block.querySelectorAll('img[loading="lazy"]').forEach((img) => { img.loading = 'eager'; });
  if (!('IntersectionObserver' in window)) { load(); return; }
  const io = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) { io.disconnect(); load(); }
  }, { rootMargin });
  io.observe(block);
}
