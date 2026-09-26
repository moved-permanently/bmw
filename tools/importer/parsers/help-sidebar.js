/* eslint-disable */
/* global WebImporter */
// Parser for the global help sidebar fragment /de/fragments/help-sidebar (source: .cmp-stickysidebar,
// identical on all pages). NOT a page block: scripts/bmw-sidebar.js reads the fragment at runtime.
// Wiring (orchestrator): import a virtual URL /de/fragments/help-sidebar.html from a snapshot copy of the home
// page, and for that path run this parser on `.cmp-stickysidebar` BEFORE bmw-cleanup removes `.stickysidebar`
// (cleanup lists it in CHROME), then return only the block.
//
// Block "Help Sidebar":
//   key/value rows : label | intro | brand | language | hostname | tenant-id | contact-url | hide-live-chat |
//                    nudge-title | nudge-text | nudge-link | nudge-mobile-title | nudge-mobile-text |
//                    nudge-mobile-link | nudge-target
//   item rows      : ai-assistant | live-chat | link  —  ":icon_name:"  —  label  —  URL  —  options
//                    (highlighted, new-tab); the icon needs its own cell to survive the document conversion
import { cleanHref, text } from './_utils.js';

export const selectors = ['.cmp-stickysidebar'];

const TYPE_MAP = { ckmAiChatWidget: 'ai-assistant', chatGC: 'live-chat', chatGPC: 'live-chat', url: 'link' };

export function sidebarRows(document, sb) {
  const rows = [];
  const add = (k, v) => { if (v !== undefined && v !== null && v !== '') rows.push([k, v]); };
  const button = sb.querySelector('.cmp-stickysidebar__button');
  add('label', (button && (button.getAttribute('aria-label') || button.getAttribute('title'))) || 'BMW Kundenbetreuung');
  add('intro', text(sb.querySelector('.cmp-stickysidebar__intro')));
  add('brand', sb.getAttribute('data-brand'));
  add('language', sb.getAttribute('data-language'));
  add('hostname', sb.getAttribute('data-hostname'));
  add('tenant-id', sb.getAttribute('data-tenant-id'));
  add('contact-url', sb.getAttribute('data-contact-url'));
  add('hide-live-chat', sb.getAttribute('data-hide-live-chat') || 'false');
  const nudge = sb.querySelector('.cmp-stickysidebar__nudge');
  if (nudge) {
    const title = nudge.querySelector('.cmp-stickysidebar__nudge-title');
    const desc = nudge.querySelector('.cmp-stickysidebar__nudge-description');
    const link = nudge.querySelector('.cmp-stickysidebar__nudge-description-clickable');
    let descText = '';
    if (desc) {
      const clone = desc.cloneNode(true);
      clone.querySelectorAll('button').forEach((b) => b.remove());
      descText = text(clone);
    }
    add('nudge-title', text(title));
    add('nudge-text', descText);
    add('nudge-link', text(link));
    add('nudge-mobile-title', title && title.getAttribute('data-mobile-title'));
    add('nudge-mobile-text', desc && desc.getAttribute('data-mobile-description'));
    add('nudge-mobile-link', link && link.getAttribute('data-mobile-clickable-text'));
    const action = link && link.getAttribute('data-action');
    const target = action && sb.querySelector(`.cmp-stickysidebar__item-button[data-index="${action}"]`);
    if (target) add('nudge-target', TYPE_MAP[target.getAttribute('data-type')] || 'ai-assistant');
  }
  sb.querySelectorAll('.cmp-stickysidebar__item-button').forEach((b) => {
    const type = TYPE_MAP[b.getAttribute('data-type')];
    if (!type) return;
    // empty <i data-icon> elements are stripped by the importer: fall back to the source icons per type
    const icon = (b.querySelector('.cmp-stickysidebar__item-icon') || {}).getAttribute?.('data-icon')
      || { 'ai-assistant': 'animated_speech_bubble_sparkles', 'live-chat': 'speech_bubble_with_person', link: 'telephone_and_mail' }[type] || '';
    const label = text(b.querySelector('.cmp-stickysidebar__item-description'));
    const url = type === 'link' ? cleanHref(b.getAttribute('href') || '') : (b.getAttribute('data-link') || '');
    const a = document.createElement('a');
    a.href = url;
    a.textContent = url;
    const opts = [];
    if (/--highlighted/.test(b.className)) opts.push('highlighted');
    if (b.getAttribute('target') === '_blank') opts.push('new-tab');
    const iconP = document.createElement('p');
    if (icon) iconP.textContent = `:${icon}:`;
    rows.push([type, iconP, label, a, opts.join(', ')]);
  });
  return rows;
}

export default function parse(element, { document }) {
  const block = WebImporter.Blocks.createBlock(document, { name: 'Help Sidebar', cells: sidebarRows(document, element) });
  element.replaceWith(block);
}
