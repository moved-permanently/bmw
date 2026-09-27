/* eslint-disable */
/* global WebImporter */
// Parser for block "icon-teaser" (source: .icon.aem-GridColumn inside icon item containers).
// Grouped block: one row per item, 2 columns: cell 1 = BMW icon (":icon_name:"), cell 2 = content
// (heading, text, CTA links, disclaimers). An icon group is a run of consecutive sibling item
// containers (icon + title/text/button), nested wrapper containers of items included.
// Options: cols-S-M-D (items per row below 768 / 768-1023 / from 1024, default 1-2-3), left
// (items not centered), list (icon inline before the text), size-xs|s|m|ml|xl|xxl (icon size,
// default l), offsets-A-B[-…] (desktop grid offsets of the items in 12ths, source
// aem-GridColumn--offset--default--N on flat item rows; offsets-md: also 768-1023), body-1 (item texts in body-1 size;
// default body-2).
// Groups whose items all have a CTA button and no body text are icon quick links: they are left
// for the cards-quicklink parser. Icons inside other components (stage, teaser, carousel, card
// list, accordion) are left to those components.
import { replaceWithBlock } from './_utils.js';
import { blockName, divCell } from './_media.js';
import {
  iconGroup, iconItemParts, iconParagraph, isQuicklinkGroup, itemColumns,
} from './_nested.js';

export const selectors = ['.icon.aem-GridColumn'];

/** Builds the rows of an icon group (shared with cards-quicklink). */
export function iconRows(document, group, anchor) {
  const rows = [];
  const parts = group.items.map((it) => iconItemParts(document, it, anchor));
  parts.forEach((p) => {
    if (!p.name && !p.content.length) return;
    rows.push([divCell(document, p.name ? [iconParagraph(document, p.name)] : []), divCell(document, p.content)]);
  });
  return { rows, parts };
}

/** Replaces the group members with the block. */
export function replaceGroup(document, group, name, rows) {
  const [first, ...rest] = group.members;
  rest.forEach((m) => m.remove());
  return replaceWithBlock(document, first, name, rows);
}

/** Grid offsets (12ths of the parent grid) of a flat row of items at a breakpoint, '' when none. */
function itemOffsets(group, bp = 'default') {
  // flat row: all items are columns of one grid
  if (group.items.length < 2 || group.items.length > 6) return '';
  const grids = new Set(group.items.map((it) => it.parentElement && it.parentElement.closest('.aem-Grid')));
  if (grids.size !== 1) return '';
  const offsets = group.items.map((m) => {
    const cls = m.className || '';
    const o = cls.match(new RegExp(`aem-GridColumn--offset--${bp}--(\\d+)`)) || cls.match(/aem-GridColumn--offset--default--(\d+)/);
    const grid = m.parentElement && m.parentElement.closest('.aem-Grid');
    const size = grid && ((grid.className || '').match(/aem-Grid--default--(\d+)/) || grid.className.match(/aem-Grid--(\d+)/));
    const n = o ? Number(o[1]) : 0;
    return size ? Math.round((n * 12) / Number(size[1])) : n;
  });
  return offsets.some((o) => o > 0) ? offsets.join('-') : '';
}

export default function parse(element, { document }) {
  const group = iconGroup(element);
  if (!group || !group.members.length || !group.items.length) return;
  if (isQuicklinkGroup(group)) return; // cards-quicklink
  const { rows, parts } = iconRows(document, group, element);
  if (!rows.length) return;
  const options = [];
  const cols = itemColumns(group);
  if (cols !== '1-2-3') options.push(`cols-${cols}`);
  if (!parts.every((p) => p.centered)) options.push('left');
  const texts = group.items.flatMap((it) => [...it.querySelectorAll('.text.aem-GridColumn')]);
  if (texts.length && texts.every((t) => /style-text--body-1\b/.test(t.className))) options.push('body-1');
  const offsets = itemOffsets(group);
  if (offsets) {
    options.push(`offsets-${offsets}`);
    // same offsets on tablet (no medium override) and tablet rows as wide as desktop rows
    if (itemOffsets(group, 'medium') === offsets && cols.split('-')[1] === cols.split('-')[2]) options.push('offsets-md');
  }
  if (parts.some((p) => p.inline)) options.push('list');
  const size = parts[0].size;
  if (size && size !== 'l') options.push(`size-${size}`);
  replaceGroup(document, group, blockName('Icon Teaser', options), rows);
}
