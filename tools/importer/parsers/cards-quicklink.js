/* eslint-disable */
/* global WebImporter */
// Parser for block "cards-quicklink" (home "Finden Sie Ihren BMW." and the same pattern elsewhere):
// a group of 2+ centered icon items (container with an icon component, a title and a CTA button,
// no body text). One row per item, 2 columns: cell 1 = ":icon_name:", cell 2 = heading + CTA link
// (outline button -> <em><a>, as-link -> plain link).
// Candidates are containers holding icons and buttons; the exact group (a run of item containers,
// wrapper containers of items included) is resolved in JS, see iconGroup in _nested.js. Other icon
// groups become "Icon Teaser" blocks (icon-teaser parser).
import { blockName } from './_media.js';
import { iconGroup, isQuicklinkGroup } from './_nested.js';
import { iconRows, replaceGroup } from './icon-teaser.js';

export const selectors = ['.container.aem-GridColumn:has(.icon.aem-GridColumn):has(.button.aem-GridColumn)'];

export default function parse(element, { document }) {
  const icon = element.querySelector('.icon.aem-GridColumn');
  if (!icon) return;
  const group = iconGroup(icon);
  if (!group || group.members[0] !== element || !isQuicklinkGroup(group)) return;
  const { rows } = iconRows(document, group, element);
  if (rows.length < 2) return;
  replaceGroup(document, group, blockName('Cards Quicklink', []), rows);
}
