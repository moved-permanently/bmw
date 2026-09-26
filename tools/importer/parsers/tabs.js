/* eslint-disable */
/* global WebImporter */
// Parser for block "tabs" (source: .tabs.aem-GridColumn, AEM tabs-v1).
// 2 columns, one row per tab: cell 1 = tab label, cell 2 = tab content.
//  - panels with default content only (titles, texts, buttons, images) keep it in cell 2;
//  - panels holding components that become blocks (multi content gallery, carousel, content
//    table, ...) move into their own section right after the section of the tabs (Section
//    Metadata style "tab-panel", id "tabs-N-M"); cell 2 then holds a link "#tabs-N-M" to that
//    section and the block moves the section into the tab at runtime. So nested blocks never end
//    up inside a table cell.
// Options: buttons (segmented button tab bar, source style-tabs--buttons; default: underline tab
// bar), left (tab bar left-aligned; default centered).
// Components placed directly in a panel carry no .aem-GridColumn class, so their parsers never
// matched them: known ones are parsed here (multicontentgallery, carousel).
import { replaceWithBlock, text } from './_utils.js';
import { blockName, divCell } from './_media.js';
import { normalizeNested, defaultContent } from './_nested.js';
import parseMultiContentGallery from './multi-content-gallery.js';
import parseCarousel from './carousel.js';

export const selectors = ['.tabs.aem-GridColumn'];

const INNER_PARSERS = [
  ['multicontentgallery', parseMultiContentGallery],
  ['carousel', parseCarousel],
];
// grid components that are default content; anything else in a panel -> own section
const DEFAULT_ONLY = /^(title|text|button|image|container|ghost|separator)$/;

function hasBlocks(panel) {
  if (panel.querySelector('table')) return true;
  return [...panel.querySelectorAll('.aem-GridColumn')].some((n) => !DEFAULT_ONLY.test(n.classList[0] || ''));
}

function topLevelColumn(el) {
  let top = el;
  while (top.parentElement && top.parentElement.closest('.aem-GridColumn')) {
    top = top.parentElement.closest('.aem-GridColumn');
  }
  return top;
}

function linkPara(document, href, label) {
  const p = document.createElement('p');
  const a = document.createElement('a');
  a.href = href;
  a.textContent = label;
  p.append(a);
  return p;
}

let tabsSeq = 0;

export default function parse(element, ctx) {
  const { document } = ctx;
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;
  const labels = [...tabs.querySelectorAll('.cmp-tabs__tab')].filter((t) => t.closest('.cmp-tabs') === tabs);
  const panels = [...tabs.querySelectorAll('.cmp-tabs__tabpanel')].filter((p) => p.closest('.cmp-tabs') === tabs);
  if (!labels.length || !panels.length) return;
  tabsSeq += 1;

  const options = [];
  if (/style-tabs--buttons/.test(element.className)) options.push('buttons');
  if (!/style-tabs-horizontal-alignment--center/.test(element.className)) options.push('left');

  const rows = [];
  const holders = [];
  labels.forEach((tab, i) => {
    const label = text(tab.querySelector('.cmp-tabs__tabtitle') || tab);
    const panel = panels[i];
    if (!label || !panel) return;

    // components placed directly in the panel: give them the grid class (and parse known ones)
    [...panel.children].forEach((child) => {
      if (child.tagName !== 'DIV' || child.classList.contains('aem-GridColumn')) return;
      child.classList.add('aem-GridColumn', 'aem-GridColumn--default--12');
      const entry = INNER_PARSERS.find(([name]) => child.classList.contains(name));
      if (!entry) return;
      try { entry[1](child, ctx); } catch (e) { console.error('tabs: inner parser failed', e); }
    });

    if (hasBlocks(panel)) {
      const id = `tabs-${tabsSeq}-${i + 1}`;
      const holder = document.createElement('div');
      holder.className = 'container aem-GridColumn aem-GridColumn--default--12 bmw-tab-holder';
      holder.append(...panel.childNodes);
      holder.append(WebImporter.Blocks.createBlock(document, {
        name: 'Section Metadata',
        cells: [['style', 'tab-panel'], ['id', id]],
      }));
      holders.push(holder);
      rows.push([label, divCell(document, [linkPara(document, `#${id}`, label)])]);
    } else {
      normalizeNested(document, panel);
      const { content } = defaultContent(document, panel, element);
      rows.push([label, divCell(document, content)]);
    }
  });
  if (!rows.length) return;
  if (holders.length) {
    let after = topLevelColumn(element);
    while (after.nextElementSibling && /bmw-(layer|tab)-holder/.test(after.nextElementSibling.className)) {
      after = after.nextElementSibling;
    }
    after.after(...holders);
  }
  replaceWithBlock(document, element, blockName('Tabs', options), rows);
}
