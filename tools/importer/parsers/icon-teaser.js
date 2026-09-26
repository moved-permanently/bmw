/* eslint-disable */
/* global WebImporter */
// Parser for block "icon-teaser" (source: .icon.aem-GridColumn inside icon item containers).
// Grouped block: one row per item, 2 columns: cell 1 = BMW icon (":icon_name:"), cell 2 = content
// (heading, text, CTA links, disclaimers). An icon group is a run of consecutive sibling item
// containers (icon + title/text/button), nested wrapper containers of items included.
// Options: cols-S-M-D (items per row below 768 / 768-1023 / from 1024, default 1-2-3), left
// (items not centered), list (icon inline before the text), size-xs|s|m|ml|xl|xxl (icon size,
// default l).
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
  if (parts.some((p) => p.inline)) options.push('list');
  const size = parts[0].size;
  if (size && size !== 'l') options.push(`size-${size}`);
  replaceGroup(document, group, blockName('Icon Teaser', options), rows);
}
