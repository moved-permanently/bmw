/* eslint-disable */
/* global WebImporter */
// Shared helpers for bmw.de block parsers (bundled into the import script).

const SCENE7_RE = /\/is\/image\//;
const SIZE_PARAMS = ['wid', 'hei', 'fmt', 'qlt', 'fit', 'scl', 'size', 'resMode', 'op_usm', 'dpr'];

/** Absolute URL against the source site. */
export function absUrl(href, base = 'https://www.bmw.de/') {
  if (!href) return '';
  try { return new URL(href.trim(), base).href; } catch (e) { return href; }
}

/**
 * Normalizes an image URL: Scene7 URLs keep the asset path (incl. smart-crop suffix like
 * ":3to1") and lose size/format params (the blocks re-add them); other URLs are absolutized.
 */
export function normalizeImageUrl(src) {
  if (!src) return '';
  const first = src.split(',')[0].trim().split(/\s+/)[0];
  const abs = absUrl(first);
  if (!SCENE7_RE.test(abs)) return abs.replace('/content/bmw/marketDE/bmw_de/', '/');
  const [base, query = ''] = abs.replace(/&amp;/g, '&').split('?');
  const keep = query.split('&').filter((p) => p && !SIZE_PARAMS.includes(decodeURIComponent(p.split('=')[0])));
  return keep.length ? `${base}?${keep.join('&')}` : base;
}

export function isScene7(url) { return SCENE7_RE.test(url || ''); }

/**
 * Reads a source <picture>/<img> and returns per-breakpoint image URLs.
 * BMW pictures carry <source media="(min-width: 0px) and (max-width: 767px)"> etc.
 * @returns {{desktop: string, tablet: string, mobile: string, alt: string}}
 */
export function readPicture(root) {
  const out = { desktop: '', tablet: '', mobile: '', alt: '' };
  if (!root) return out;
  const img = root.tagName === 'IMG' ? root : root.querySelector('img');
  const picture = root.tagName === 'PICTURE' ? root : root.querySelector('picture');
  if (img) {
    out.desktop = normalizeImageUrl(img.getAttribute('src') || img.getAttribute('data-src') || '');
    out.alt = (img.getAttribute('alt') || '').trim();
  }
  if (picture) {
    picture.querySelectorAll('source').forEach((s) => {
      const media = s.getAttribute('media') || '';
      const url = normalizeImageUrl(s.getAttribute('srcset') || s.getAttribute('data-srcset') || '');
      if (!url) return;
      const max = Number((media.match(/max-width:\s*(\d+)/) || [])[1] || 0);
      if (max && max <= 767) out.mobile = out.mobile || url;
      else if (max && max <= 1023) out.tablet = out.tablet || url;
      else if (!out.desktop) out.desktop = url;
    });
  }
  if (!out.desktop) out.desktop = out.tablet || out.mobile;
  return out;
}

/** Creates an <img> for the block table (the DM transformer turns Scene7 imgs into links). */
export function imgEl(document, url, alt = '') {
  if (!url) return null;
  const img = document.createElement('img');
  img.src = url;
  img.alt = alt || '';
  return img;
}

/**
 * Returns an array of <img> elements for desktop[, mobile[, tablet]] — only distinct URLs.
 * Order convention used by all BMW blocks: desktop, mobile, tablet.
 */
export function pictureCell(document, root) {
  const p = readPicture(root);
  const list = [];
  const seen = new Set();
  [p.desktop, p.mobile, p.tablet].forEach((u) => {
    if (u && !seen.has(u)) { seen.add(u); list.push(imgEl(document, u, p.alt)); }
  });
  return list;
}

/** Collapses whitespace in text nodes; trims. */
export function text(el) { return (el?.textContent || '').replace(/\s+/g, ' ').trim(); }

/**
 * Converts BMW button/link components inside `root` into authored links:
 * primary -> <strong><a>, outline/secondary -> <em><a>, link-style -> <a>. Returns <p> elements.
 */
export function buttonLinks(document, root) {
  const out = [];
  if (!root) return out;
  const btns = root.matches?.('.button, .cmp-button') ? [root] : [...root.querySelectorAll('.button.aem-GridColumn, a.cmp-button')];
  btns.forEach((b) => {
    const a = b.tagName === 'A' ? b : b.querySelector('a.cmp-button, a[href]');
    if (!a) return;
    const col = b.closest('.button') || b;
    const cls = `${col.className} ${a.className}`;
    const link = document.createElement('a');
    link.href = cleanHref(a.getAttribute('href'));
    link.textContent = text(a.querySelector('.cmp-button__text') || a);
    const p = document.createElement('p');
    if (/primary/.test(cls)) { const s = document.createElement('strong'); s.append(link); p.append(s); }
    else if (/outline|secondary/.test(cls)) { const e = document.createElement('em'); e.append(link); p.append(e); }
    else p.append(link);
    out.push(p);
  });
  return out;
}

/** Rewrites bmw.de links to site-relative EDS paths (drops .html and the AEM content prefix). */
export function cleanHref(href) {
  if (!href) return '';
  let h = href.trim();
  if (h.startsWith('#') || h.startsWith('mailto:') || h.startsWith('tel:') || h.startsWith('javascript:')) return h;
  try {
    const u = new URL(h, 'https://www.bmw.de/');
    if (u.hostname === 'www.bmw.de') {
      u.pathname = u.pathname.replace('/content/bmw/marketDE/bmw_de/', '/');
      // only EDS-migrated pages (/de/*.html) become relative; apps (/de-de/, /faas/, shop...) stay absolute
      if (/^\/de\/.*\.html$/.test(u.pathname) && !/\/(shop|s|sl|dlo|faas)\//.test(u.pathname) && !u.pathname.includes('.asset.')) {
        u.pathname = u.pathname.replace(/\.html$/, '');
        if (u.pathname === '/de/index') u.pathname = '/de/home';
        return `${u.pathname}${u.search}${u.hash}`;
      }
    }
    return u.href;
  } catch (e) { return h; }
}

/** Builds a block table and replaces `element` with it. */
export function replaceWithBlock(document, element, name, cells) {
  const block = WebImporter.Blocks.createBlock(document, { name, cells });
  element.replaceWith(block);
  return block;
}

/** Wraps nodes into a single div cell (handy for multi-element cells). */
export function cell(document, nodes) {
  const d = document.createElement('div');
  (Array.isArray(nodes) ? nodes : [nodes]).filter(Boolean).forEach((n) => d.append(n));
  return d;
}
