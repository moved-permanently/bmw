/*
 * Embed (source cmp-embed): external content in an iframe, loaded when it comes near the viewport.
 * Content: one cell with the URL of the content (the link title is the iframe title).
 *  - YouTube / Vimeo: responsive 16:9 player
 *  - other URLs (BMW calculators, interactive map, vehicle recall, podcast player …):
 *    full-width iframe
 * Options: auto-height (height follows the embedded page: iframe-resizer protocol as used by the
 * webservice.bmw.de apps, or a {height} postMessage), height-N (fixed height in px).
 */

const IFRAME_RESIZER = 'https://cdn.jsdelivr.net/npm/iframe-resizer@4.3.9/js/iframeResizer.min.js';
const DEFAULT_HEIGHT = 400;
let resizerPromise;

function loadResizer() {
  if (!resizerPromise) {
    resizerPromise = new Promise((resolve, reject) => {
      if (window.iFrameResize) {
        resolve(window.iFrameResize);
        return;
      }
      const script = document.createElement('script');
      script.src = IFRAME_RESIZER;
      script.async = true;
      script.onload = () => (window.iFrameResize ? resolve(window.iFrameResize) : reject(new Error('iframe-resizer missing')));
      script.onerror = () => reject(new Error('iframe-resizer failed to load'));
      document.head.append(script);
    });
  }
  return resizerPromise;
}

function videoEmbed(url) {
  const { hostname, pathname, searchParams } = url;
  if (/(^|\.)youtube\.com$/.test(hostname) || hostname === 'youtu.be') {
    const id = hostname === 'youtu.be' ? pathname.slice(1) : (searchParams.get('v') || pathname.split('/').pop());
    return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?rel=0`;
  }
  if (/(^|\.)vimeo\.com$/.test(hostname)) {
    const id = pathname.split('/').filter(Boolean).pop();
    return `https://player.vimeo.com/video/${encodeURIComponent(id)}?dnt=1`;
  }
  return '';
}

/** Generic height messages ({height: n} objects or JSON strings) from the embedded page. */
function listenForHeight(iframe) {
  window.addEventListener('message', (e) => {
    if (e.source !== iframe.contentWindow) return;
    let { data } = e;
    if (typeof data === 'string') {
      if (data.startsWith('[iFrameSizer]')) return; // handled by iframe-resizer
      try {
        data = JSON.parse(data);
      } catch {
        return;
      }
    }
    const h = data && Number(data.height || (data.data && data.data.height));
    if (h > 0 && h < 20000) iframe.style.height = `${Math.ceil(h)}px`;
  });
}

function buildIframe(block, src, title) {
  const iframe = document.createElement('iframe');
  iframe.src = src;
  iframe.title = title;
  iframe.loading = 'lazy';
  iframe.setAttribute('allow', 'geolocation; fullscreen; encrypted-media; picture-in-picture');
  iframe.setAttribute('frameborder', '0');
  const fixed = [...block.classList].map((c) => c.match(/^height-(\d+)$/)).find(Boolean);
  if (fixed) {
    iframe.style.height = `${fixed[1]}px`;
  } else if (block.classList.contains('auto-height')) {
    iframe.style.height = `${DEFAULT_HEIGHT}px`;
    iframe.scrolling = 'no';
    listenForHeight(iframe);
    iframe.addEventListener('load', () => {
      loadResizer().then((iFrameResize) => {
        iFrameResize({
          checkOrigin: false,
          heightCalculationMethod: 'bodyOffset',
          warningTimeout: 0,
          log: false,
        }, iframe);
      }).catch(() => { /* keep the default height */ });
    }, { once: true });
  } else {
    iframe.style.height = `${DEFAULT_HEIGHT}px`;
    listenForHeight(iframe);
  }
  return iframe;
}

export default function decorate(block) {
  const link = block.querySelector('a[href]');
  const href = link ? link.href : block.textContent.trim();
  let url;
  try {
    url = new URL(href, window.location.href);
  } catch {
    return;
  }
  const title = (link && link.title) || (link && link.textContent.trim() !== href ? link.textContent.trim() : '') || url.hostname;
  const holder = document.createElement('div');
  holder.className = 'embed-frame';
  const video = videoEmbed(url);
  if (video) block.classList.add('embed-video');
  block.replaceChildren(holder);

  const load = () => {
    if (holder.firstChild) return;
    holder.append(buildIframe(block, video || url.href, title));
    block.classList.add('embed-is-loaded');
  };
  const observer = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) {
      observer.disconnect();
      load();
    }
  }, { rootMargin: '300px' });
  observer.observe(block);
}
