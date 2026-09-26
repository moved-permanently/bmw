/* eslint-disable */
/* global WebImporter */
// Parser for block "flexbox" (source: .flexbox.aem-GridColumn, cmp-flexbox with cmp-flexitem tiles).
//  - default tiles (flexitem-default: grey link tile, headline + arrow):
//      Block "Flexbox": one row per tile, cell = link (text = headline).
//  - style-flexbox--3-tiles-expandable (white tiles with icon; a tile opens an info panel below the row,
//    the live chat tile opens the live chat):
//      Block "Flexbox (expandable)": one row per tile:
//        cell 1 = ":icon_name:", cell 2 = label
//        cell 3 = "live-chat" (opens the live chat) | link (plain link tile) | panel content:
//                 h3 = group title, h4 = row label, followed by the row values (paragraphs, links).
import { replaceWithBlock, text, cleanHref } from './_utils.js';
import { textNodes, ctaParagraph } from './_media.js';

export const selectors = ['.flexbox.aem-GridColumn'];

function h(document, tag, str) {
  const el = document.createElement(tag);
  el.textContent = str;
  return el;
}

/** [":icon_name:", label] (the icon needs its own cell to survive the document conversion) */
// The importer strips empty <i data-icon> elements before the parsers run: icons of the known tiles
// (www.bmw.de/de/mehr-bmw/kundenbetreuung.html, 2026-09) by label.
const KNOWN_ICONS = {
  'Live Chat starten': 'speech_bubble_with_person',
  'Kundenbetreuung kontaktieren': 'services',
  'Unfall- und Pannenhilfe anrufen': 'accident_service',
};

function tileIcon(tile, label) {
  const own = tile.querySelector('[data-icon]:not(.cmp-flexitem__icon--maximize)');
  if (own) return own.getAttribute('data-icon');
  return KNOWN_ICONS[label] || (tile.classList.contains('cmp-flexitem--live-chat') ? 'speech_bubble_with_person' : '');
}

function iconLabel(document, tile) {
  const label = text(tile.querySelector('.cmp-flexitem__text, .cmp-flexitem__headline')) || text(tile);
  const name = tileIcon(tile, label);
  const p = document.createElement('p');
  if (name) p.textContent = `:${name}:`;
  return [p, label];
}

function valueNodes(document, col) {
  const out = [];
  col.querySelectorAll('.text.aem-GridColumn, .button.aem-GridColumn').forEach((c) => {
    if (c.classList.contains('text')) out.push(...textNodes(document, c));
    else {
      const p = ctaParagraph(document, c, c);
      if (p) out.push(p);
    }
  });
  return out;
}

/** Info panel of an expandable tile -> h3 group titles, h4 row labels, values. */
function panelNodes(document, content) {
  const out = [];
  const root = content.querySelector('.cmp-flexitem--expandable__content--content') || content;
  const rows = [...root.children];
  rows.forEach((row) => {
    const title = row.querySelector('.cmp-title__text, h1, h2, h3, h4');
    if (title && !row.querySelector('.text.aem-GridColumn')) {
      out.push(h(document, 'h3', text(title)));
      return;
    }
    const cols = [...row.querySelectorAll('.container.aem-GridColumn')];
    const top = cols.filter((c) => !cols.some((o) => o !== c && o.contains(c)));
    if (top.length >= 2) {
      const label = text(top[0]);
      if (label) out.push(h(document, 'h4', label));
      top.slice(1).forEach((c) => out.push(...valueNodes(document, c)));
    } else {
      out.push(...valueNodes(document, row));
    }
  });
  return out;
}

function cell(document, nodes) {
  const d = document.createElement('div');
  nodes.forEach((n) => d.append(n));
  return d;
}

export default function parse(element, { document }) {
  const cmp = element.querySelector('.cmp-flexbox');
  if (!cmp) return;
  const expandable = /style-flexbox--3-tiles-expandable/.test(element.className);
  const rows = [];
  if (!expandable) {
    cmp.querySelectorAll('a.cmp-flexitem, .cmp-flexitem-wrapper a[href]').forEach((a) => {
      const link = document.createElement('a');
      link.href = cleanHref(a.getAttribute('href'));
      link.textContent = text(a.querySelector('.cmp-flexitem__headline')) || text(a);
      rows.push([link]);
    });
  } else {
    const container = cmp.querySelector('.cmp-flexbox__container') || cmp;
    [...container.children].forEach((child) => {
      if (child.matches('.cmp-flexitem--expandable__content')) return;
      const tile = child.matches('.cmp-flexitem') ? child : child.querySelector('.cmp-flexitem');
      if (!tile) return;
      if (tile.classList.contains('cmp-flexitem--live-chat')) {
        rows.push([...iconLabel(document, tile), 'live-chat']);
        return;
      }
      if (tile.tagName === 'A') {
        const link = document.createElement('a');
        link.href = cleanHref(tile.getAttribute('href'));
        link.textContent = link.href;
        rows.push([...iconLabel(document, tile), link]);
        return;
      }
      const id = tile.getAttribute('aria-controls');
      const content = id ? cmp.querySelector(`[id="${id}"]`) : null;
      rows.push([...iconLabel(document, tile), content ? cell(document, panelNodes(document, content)) : '']);
    });
  }
  if (!rows.length) return;
  replaceWithBlock(document, element, expandable ? 'Flexbox (expandable)' : 'Flexbox', rows);
}
