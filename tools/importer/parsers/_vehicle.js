/* eslint-disable */
/* global WebImporter */
// Helpers shared by the vehicle parsers (drivetrain-switch, color-switch, technical-data, model-*, all-models).
import { cleanHref, text, imgEl, normalizeImageUrl } from './_utils.js';
import { cleanInline } from './_media.js';

/**
 * Best URL of a cosy (prod.cosy.bmw.cloud) car picture. The <img src> fallback is often a JPEG
 * (black instead of transparent background); the <source type="image/webp"> entries are
 * transparent. Prefers the source without media query (desktop), else the last webp source.
 */
export function cosyUrl(root) {
  if (!root) return '';
  const pic = root.tagName === 'PICTURE' ? root : root.querySelector('picture');
  const img = root.tagName === 'IMG' ? root : root.querySelector('img');
  if (pic) {
    const sources = [...pic.querySelectorAll('source')].filter((s) => (s.getAttribute('srcset') || s.getAttribute('data-srcset')));
    const webp = sources.filter((s) => /webp/.test(s.getAttribute('type') || '') || /webp/i.test(s.getAttribute('srcset') || ''));
    const pick = webp.find((s) => !s.getAttribute('media')) || webp[webp.length - 1]
      || sources.find((s) => !s.getAttribute('media')) || sources[sources.length - 1];
    if (pick) return normalizeImageUrl(pick.getAttribute('srcset') || pick.getAttribute('data-srcset'));
  }
  return img ? normalizeImageUrl(img.getAttribute('src') || img.getAttribute('data-src') || '') : '';
}

/** <img> for a cosy picture (alt from the img; AEM placeholders like "{model.description}" dropped). */
export function cosyImg(document, root, altOverride) {
  const url = cosyUrl(root);
  if (!url) return null;
  const img = root.tagName === 'IMG' ? root : root.querySelector('img');
  let alt = altOverride != null ? altOverride : ((img && img.getAttribute('alt')) || '').trim();
  if (/^\{.*\}$/.test(alt)) alt = '';
  return imgEl(document, url, alt);
}

export function para(document, nodes) {
  const p = document.createElement('p');
  (Array.isArray(nodes) ? nodes : [nodes]).filter(Boolean).forEach((n) => p.append(n));
  return p;
}

/** Inline content of a text/fact cell as one <p> (keeps sup/links, drops AEM wrappers). */
export function inlinePara(document, el) {
  const src = el && (el.querySelector('p') || el);
  const p = document.createElement('p');
  if (!src) return p;
  const c = cleanInline(document, src);
  c.querySelectorAll('.cmp-infoi, [data-cmp-hook-tooltip]').forEach((x) => x.remove());
  p.append(...c.childNodes);
  // trim leading/trailing whitespace text
  while (p.firstChild && p.firstChild.nodeType === 3 && !p.firstChild.nodeValue.trim()) p.firstChild.remove();
  while (p.lastChild && p.lastChild.nodeType === 3 && !p.lastChild.nodeValue.trim()) p.lastChild.remove();
  return p;
}

/** bmw.de page links with a selector suffix ("…-technische-daten.html/bmw-520d-touring") -> path#suffix. */
export function variantHref(href) {
  const m = (href || '').match(/^(?:https?:\/\/www\.bmw\.de)?(\/de\/[^?#]*?)\.html\/([^/?#]+)\/?$/);
  if (m) return `${cleanHref(`${m[1]}.html`)}#${m[2]}`;
  return cleanHref(href);
}

/** Compare-belt button -> link to the compare page, keeping the model path in the hash. */
export function compareLink(document, btn) {
  const url = btn.getAttribute('data-url') || '';
  const m = url.match(/bmw-modelle-vergleichen\.html\/(.+?)\/content\.q/);
  const a = document.createElement('a');
  a.href = `/de/bmw-modelle-vergleichen${m ? `#${m[1]}` : ''}`;
  const label = btn.querySelector('.cmp-button__text');
  a.textContent = text(label) || (label && label.getAttribute('data-hover-text')) || 'Zum Vergleich hinzufügen';
  return a;
}

/**
 * CTA paragraph for a BMW button column (.button with a.cmp-button / compare button):
 * primary -> <strong><a>, outline/secondary -> <em><a>, as-link -> <a>, default/nba (dark) -> <strong><em><a>.
 */
export function vehicleCta(document, col) {
  const btn = col.querySelector('a.cmp-button, button.cmp-button');
  if (!btn) return null;
  if (btn.tagName === 'BUTTON') {
    return btn.getAttribute('data-click-handler') === 'compareBelt' ? para(document, compareLink(document, btn)) : null;
  }
  const label = text(btn.querySelector('.cmp-button__text') || btn);
  const href = btn.getAttribute('href');
  if (!label || !href) return null;
  const a = document.createElement('a');
  a.href = variantHref(href);
  a.textContent = label;
  const cls = `${col.className || ''} ${btn.className || ''}`;
  if (/style-button--as-link(?![-\w])|style-button--link(?![-\w])/.test(cls)) return para(document, a);
  if (/primary/.test(cls)) { const s = document.createElement('strong'); s.append(a); return para(document, s); }
  if (/outline|secondary/.test(cls)) { const e = document.createElement('em'); e.append(a); return para(document, e); }
  const s = document.createElement('strong');
  const e = document.createElement('em');
  e.append(a); s.append(e);
  return para(document, s);
}
