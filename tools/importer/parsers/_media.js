/* eslint-disable */
/* global WebImporter */
// Media/CTA helpers shared by the hero-stage, hero-teaser/media, video and text-media-teaser parsers.
import {
  absUrl, normalizeImageUrl, pictureCell, imgEl, cleanHref, text,
} from './_utils.js';

const HIDDEN_RE = /aem-GridColumn--default--hide/;

/** Absolute video URL (bmw.de DAM paths become https://www.bmw.de/...). */
export function videoUrl(src) {
  if (!src) return '';
  return absUrl(src.trim());
}

/**
 * Reads a BMW video component (.cmp-video / <video>) below root.
 * @returns {null | {desktop, mobile, title, description, posters: {desktop, mobile, alt},
 *   autoplay, loop, controls, playButton, ratioLarge, ratioSmall}}
 */
export function readVideo(root) {
  const video = root && (root.tagName === 'VIDEO' ? root : root.querySelector('video'));
  if (!video) return null;
  let desktop = '';
  let mobile = '';
  const sources = [...video.querySelectorAll('source')];
  sources.forEach((s) => {
    const src = videoUrl(s.getAttribute('src') || s.getAttribute('data-src'));
    if (!src) return;
    const media = s.getAttribute('media') || '';
    if (/max-width/.test(media)) mobile = mobile || src;
    else desktop = desktop || src;
  });
  if (!desktop && video.getAttribute('src')) desktop = videoUrl(video.getAttribute('src'));
  if (!desktop) desktop = mobile;
  if (mobile === desktop) mobile = '';
  if (!desktop) return null;

  const cmp = video.closest('.cmp-video') || root;
  const posters = { desktop: '', mobile: '', alt: '' };
  const poster = cmp.querySelector('picture[data-video-poster], .cmp-video__poster');
  if (poster) {
    const pic = poster.tagName === 'PICTURE' ? poster : poster.closest('picture');
    const img = poster.tagName === 'IMG' ? poster : poster.querySelector('img');
    if (img) posters.desktop = normalizeImageUrl(img.getAttribute('src') || img.getAttribute('data-src') || '');
    if (pic) {
      const s = [...pic.querySelectorAll('source')].find((x) => /max-width/.test(x.getAttribute('media') || ''));
      // some source posters carry the video file itself as mobile <source> (authoring error): skip it
      if (s && !/\.(mp4|m3u8|webm|mov)(\?|$)/i.test(s.getAttribute('srcset') || '')) posters.mobile = normalizeImageUrl(s.getAttribute('srcset') || '');
    }
    if (posters.mobile === posters.desktop) posters.mobile = '';
  }
  if (!posters.desktop && video.getAttribute('poster')) posters.desktop = normalizeImageUrl(video.getAttribute('poster'));
  const title = (video.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim();
  posters.alt = title;
  const style = cmp.getAttribute('style') || '';
  const ratio = (name) => {
    const m = style.match(new RegExp(`--video-a-r-${name}:\\s*([0-9.]+)\\s*/\\s*([0-9.]+)`));
    return m ? `${m[1]}-${m[2]}` : '';
  };
  return {
    desktop,
    mobile,
    title,
    description: (video.getAttribute('aria-description') || '').trim(),
    posters,
    autoplay: video.hasAttribute('autoplay'),
    loop: video.hasAttribute('loop'),
    controls: !!cmp.querySelector('.cmp-control-bar'),
    playButton: !!cmp.querySelector('.cmp-progressiveplaybutton'),
    ratioLarge: ratio('large'),
    ratioSmall: ratio('small'),
  };
}

function para(document, node) {
  const p = document.createElement('p');
  p.append(node);
  return p;
}

/** A link to a video file as a paragraph (link text = video title). */
export function videoLink(document, url, label) {
  const a = document.createElement('a');
  a.href = url;
  a.textContent = label || url;
  return para(document, a);
}

/**
 * Media cell content for an image or video below root, in the order
 * desktop image, mobile image[, tablet image][, desktop video link, mobile video link].
 * @returns {{nodes: Element[], video: object|null, hasMedia: boolean}}
 */
export function mediaNodes(document, root) {
  const nodes = [];
  if (!root) return { nodes, video: null, hasMedia: false };
  const video = readVideo(root);
  if (video) {
    const seen = new Set();
    [video.posters.desktop, video.posters.mobile].forEach((u) => {
      if (u && !seen.has(u)) { seen.add(u); nodes.push(para(document, imgEl(document, u, video.posters.alt))); }
    });
    nodes.push(videoLink(document, video.desktop, video.title || 'Video'));
    if (video.mobile) nodes.push(videoLink(document, video.mobile, `${video.title || 'Video'} (mobil)`));
    return { nodes, video, hasMedia: true };
  }
  const pic = root.querySelector('picture') || root.querySelector('img');
  if (pic) {
    pictureCell(document, pic).forEach((img) => nodes.push(para(document, img)));
  }
  return { nodes, video: null, hasMedia: nodes.length > 0 };
}

/** Whether el (or an ancestor up to stop) is a grid column hidden on the default breakpoint. */
export function isHiddenIn(el, stop) {
  let n = el;
  while (n && n !== stop) {
    if (n.className && HIDDEN_RE.test(n.className)) return true;
    n = n.parentElement;
  }
  return false;
}

/** Keeps inline formatting and links of a source node, drops AEM classes/wrappers. */
export function cleanInline(document, node) {
  const clone = node.cloneNode(true);
  clone.querySelectorAll('.cmp-infoi, [data-cmp-hook-tooltip], script, style').forEach((e) => e.remove());
  // responsive line breaks (source .text__linebreak--mobile|tablet|desktop, display:none otherwise):
  // content has no breakpoints, so keep the desktop ones and turn the others into a space
  clone.querySelectorAll('br.text__linebreak').forEach((br) => {
    if (!br.classList.contains('text__linebreak--desktop')) br.replaceWith(document.createTextNode(' '));
  });
  clone.querySelectorAll('[class]').forEach((e) => e.removeAttribute('class'));
  clone.querySelectorAll('span').forEach((s) => s.replaceWith(...s.childNodes));
  clone.querySelectorAll('a[href]').forEach((a) => {
    a.setAttribute('href', cleanHref(a.getAttribute('href')));
    [...a.attributes].forEach((at) => { if (!['href', 'title'].includes(at.name)) a.removeAttribute(at.name); });
  });
  clone.removeAttribute && clone.removeAttribute('class');
  clone.removeAttribute && clone.removeAttribute('id');
  return clone;
}

/** Heading/paragraph for a BMW title component. */
export function titleNodes(document, col) {
  const out = [];
  const branding = col.querySelector('img.cmp-title__image-branding');
  if (branding) {
    const src = branding.getAttribute('src');
    if (src) out.push(para(document, imgEl(document, normalizeImageUrl(src), branding.getAttribute('alt') || '')));
  }
  const h = col.querySelector('.cmp-title__text') || col.querySelector('h1, h2, h3, h4, h5, h6');
  if (!h || !text(h)) return out;
  const tag = /^H[1-6]$/.test(h.tagName) ? h.tagName.toLowerCase() : 'p';
  const el = document.createElement(tag);
  el.append(...cleanInline(document, h).childNodes);
  out.push(el);
  return out;
}

/** Paragraphs/lists of a BMW text component. */
export function textNodes(document, col) {
  const root = col.querySelector('.cmp-text') || col;
  const nodes = [];
  [...root.children].forEach((c) => {
    if (c.matches('.cmp-infoi, [data-cmp-hook-tooltip]')) return;
    if (/^(P|UL|OL|H[1-6]|BLOCKQUOTE)$/.test(c.tagName)) {
      const n = cleanInline(document, c);
      if (n.textContent.replace(/ /g, ' ').trim() || n.querySelector('img')) nodes.push(n);
    } else if (c.textContent.trim()) {
      const p = document.createElement('p');
      p.append(...cleanInline(document, c).childNodes);
      nodes.push(p);
    }
  });
  return nodes;
}

let layerSeq = 0;

/**
 * Moves the content of a "page" popover out of the component into its own top-level
 * "layer" section (container column + Section Metadata style=layer), placed after the
 * top-level grid column that contains `anchor`. Returns the layer id.
 */
export function extractLayer(document, popover, anchor, title) {
  const content = popover.querySelector('[data-cmp-hook-popover="content"], .cmp-popover__content');
  if (!content || !content.querySelector('.aem-GridColumn, table')) return '';
  content.querySelectorAll('.cmp-popover__close-button, [data-cmp-hook-popover="close-button"]').forEach((b) => b.remove());
  const idNum = ((content.id || '').match(/\d+/) || [])[0] || String(900000 + (layerSeq += 1));
  const id = `layer-${idNum}`;
  const holder = document.createElement('div');
  holder.className = 'container aem-GridColumn aem-GridColumn--default--12 bmw-layer-holder';
  const main = content.querySelector('main, [data-cmp-hook-popover="main"]') || content;
  const inner = main.tagName === 'MAIN' ? main : (main.querySelector('main') || main);
  holder.append(...inner.childNodes);
  holder.append(WebImporter.Blocks.createBlock(document, {
    name: 'Section Metadata',
    cells: [['style', 'layer'], ['id', id], ['title', title || '']],
  }));
  // top-level grid column that contains the anchor
  let top = anchor;
  while (top.parentElement && top.parentElement.closest('.aem-GridColumn')) {
    top = top.parentElement.closest('.aem-GridColumn');
  }
  let after = top;
  while (after.nextElementSibling && after.nextElementSibling.classList.contains('bmw-layer-holder')) {
    after = after.nextElementSibling;
  }
  after.after(holder);
  popover.remove();
  return id;
}

/**
 * Converts a BMW button component into an authored CTA paragraph:
 * primary -> <strong><a>, outline/secondary -> <em><a>, link style -> plain <a>.
 * Buttons opening a "page" popover link to an extracted layer section (#layer-N).
 */
export function ctaParagraph(document, col, anchor) {
  const btn = col.querySelector('a.cmp-button, button.cmp-button, a[href]');
  if (!btn) return null;
  const label = text(btn.querySelector('.cmp-button__text') || btn);
  if (!label) return null;
  let href = btn.tagName === 'A' ? cleanHref(btn.getAttribute('href')) : '';
  const popover = col.querySelector('.cmp-popover');
  if (popover) {
    const type = popover.getAttribute('data-popover-type');
    if (type === 'page') {
      const id = extractLayer(document, popover, anchor || col, label);
      if (id) href = `#${id}`;
    } else if (type === 'ctacollection') {
      const first = popover.querySelector('a[href]');
      if (first && !href) href = cleanHref(first.getAttribute('href'));
    }
  }
  if (!href) return null;
  const cls = col.className || '';
  const link = document.createElement('a');
  link.href = href;
  link.textContent = label;
  const p = document.createElement('p');
  if (/style-button--primary/.test(cls)) {
    const s = document.createElement('strong'); s.append(link); p.append(s);
  } else if (/style-button--(outline|secondary|nba)/.test(cls) && !/as-link/.test(cls)) {
    const e = document.createElement('em'); e.append(link); p.append(e);
  } else if (!/as-link|style-button--link/.test(cls)) {
    // default BMW button (dark filled): high-impact CTA <strong><em><a>
    const s = document.createElement('strong');
    const e = document.createElement('em');
    e.append(link); s.append(e); p.append(s);
  } else {
    p.append(link);
  }
  return p;
}

/**
 * Walks the AEM components below root (document order) and returns default content:
 * titles -> headings, texts -> paragraphs, buttons -> CTA paragraphs, images -> imgs.
 * Components hidden on the default breakpoint are skipped.
 */
export function contentNodes(document, root, anchor, extras) {
  const out = [];
  if (!root) return out;
  const comps = [...root.querySelectorAll('.title, .text, .button, .image, table')]
    .filter((c) => {
      const pop = c.closest('.cmp-popover');
      if (pop && root.contains(pop)) return false; // layer content, extracted separately
      const inside = (sel) => {
        const a = c.parentElement.closest(sel);
        return !!a && root.contains(a);
      };
      if (c.tagName !== 'TABLE' && inside('.title, .text, .button, .image')) return false;
      if (inside('table')) return false;
      return !isHiddenIn(c, root);
    });
  comps.forEach((c) => {
    // nested blocks cannot live inside a block cell: hand them back to be placed after the block
    if (c.tagName === 'TABLE') { if (extras) extras.push(c); else c.remove(); return; }
    const name = (c.className || '').split(/\s+/)[0];
    if (name === 'title') out.push(...titleNodes(document, c));
    else if (name === 'text') out.push(...textNodes(document, c));
    else if (name === 'button') {
      const p = ctaParagraph(document, c, anchor || root);
      if (p) out.push(p);
    } else if (name === 'image') {
      pictureCell(document, c).slice(0, 1).forEach((img) => out.push(para(document, img)));
    }
  });
  return out;
}

/** Block name with options, e.g. "Hero Teaser (center, bottom)". */
export function blockName(name, options) {
  const opts = [...new Set(options.filter(Boolean))];
  return opts.length ? `${name} (${opts.join(', ')})` : name;
}

/** Wraps nodes into a div cell. */
export function divCell(document, nodes) {
  const d = document.createElement('div');
  nodes.filter(Boolean).forEach((n) => d.append(n));
  return d;
}

/** Video behaviour options for blocks that autoplay by default (stage, teaser, media). */
export function autoplayVideoOptions(video) {
  if (!video) return [];
  const out = [];
  if (!video.autoplay) out.push('no-autoplay');
  if (video.loop) out.push('loop');
  if (!video.playButton && !video.controls) out.push('no-play-button');
  return out;
}
