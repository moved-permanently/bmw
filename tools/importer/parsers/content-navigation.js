/* eslint-disable */
/* global WebImporter */
// Parser for block "content-navigation" (source: .contentnavigation.aem-GridColumn, cmp-contentnavigation v3).
// Content model (one row per entry, classified by content at runtime):
//   title row      : plain text (no link)                       -> nav title (desktop >= 1280)
//   anchor/page row: plain <a> [| target hint: heading text of the anchor section]
//   CTA row        : <strong><a> (primary) / <em><a> (secondary) -> CTA buttons on the right
// Option "hide": the nav is invisible in its flow position and only appears once it is sticky.
import {
  replaceWithBlock, cleanHref, text, anchorHint,
} from './_utils.js';

export const selectors = ['.contentnavigation.aem-GridColumn:not(.scrollnavigation)'];

function linkEl(document, a, label) {
  const link = document.createElement('a');
  // author-instance links (…adobeaemcloud.com/content/bmw/marketDE/bmw_de/…) point at the live page
  // data-anchor "#https://…" (page links on some pages) is no in-page anchor: use the href
  const anchor = (a.getAttribute('data-anchor') || '').trim();
  const raw = (/^#[^/:]+$/.test(anchor) ? anchor : a.getAttribute('href') || anchor).trim()
    .replace(/^https?:\/\/author-[^/]+\.adobeaemcloud\.com\//, 'https://www.bmw.de/');
  link.href = raw.startsWith('#') ? raw.replace(/%20/g, '').trim() : cleanHref(raw);
  link.textContent = label;
  return link;
}

export default function parse(element, { document }) {
  const nav = element.querySelector('.cmp-contentnavigation');
  if (!nav) return;
  const rows = [];

  const title = text(nav.querySelector('.cmp-contentnavigation__title'));
  if (title) rows.push([title]);

  nav.querySelectorAll('.cmp-contentnavigation__list--primary a.cmp-contentnavigation__list-link').forEach((a) => {
    const label = text(a.querySelector('.cmp-contentnavigation__link-label') || a);
    if (!label) return;
    const link = linkEl(document, a, label);
    const hint = anchorHint(document, link.getAttribute('href'));
    rows.push(hint ? [link, hint] : [link]);
  });

  // CTAs: the cta list (desktop) — the secondary list repeats them for the mobile overflow menu
  const seen = new Set();
  const ctas = [...nav.querySelectorAll('.cmp-contentnavigation__list--cta a, .cmp-contentnavigation__list--secondary a')];
  ctas.forEach((a) => {
    const labelEl = a.querySelector('.cmp-contentnavigation__link-label--large') || a.querySelector('.cmp-contentnavigation__link-label') || a;
    const label = text(labelEl);
    const href = cleanHref(a.getAttribute('href'));
    if (!label || !href || seen.has(`${label}|${href}`)) return;
    seen.add(`${label}|${href}`);
    const link = document.createElement('a');
    link.href = href;
    link.textContent = label;
    const wrap = document.createElement(/cta-primary/.test(a.className) ? 'strong' : 'em');
    wrap.append(link);
    rows.push([wrap]);
  });

  if (!rows.length) return;
  const options = [];
  if (/style-contentnavigation--hide/.test(element.className)) options.push('hide');
  const name = options.length ? `Content Navigation (${options.join(', ')})` : 'Content Navigation';
  replaceWithBlock(document, element, name, rows);
}
