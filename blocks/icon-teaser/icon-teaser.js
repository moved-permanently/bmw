import { decorateFontIcons, groupCtaLinks } from '../../scripts/bmw-utils.js';

/*
 * Icon Teaser (BMW icon component + title / text / link items in a grid).
 * One row per item: cell 1 icon (":icon_name:" or an image), cell 2 content.
 * Options: cols-S-M-D (items per row below 768 / 768-1023 / from 1024; default 1-2-3), left
 * (not centered), list (icon inline before the text), size-xxs|xs|s|m|ml|xl|xxl (default l).
 */

const ICON_TEXT_RE = /^:[a-z0-9_-]+:$/i;

function isIconCell(cell) {
  if (!cell || cell.querySelector('h1, h2, h3, h4, h5, h6, a')) return false;
  const text = cell.textContent.trim();
  if (ICON_TEXT_RE.test(text)) return true;
  if (cell.querySelector('span.icon') && !text) return true;
  return !!cell.querySelector('picture, img') && !text;
}

export default function decorate(block) {
  const cols = [...block.classList].map((c) => c.match(/^cols-(\d)-(\d)-(\d)$/)).find(Boolean);
  if (cols) {
    block.style.setProperty('--icon-teaser-cols-m', cols[1]);
    block.style.setProperty('--icon-teaser-cols-t', cols[2]);
    block.style.setProperty('--icon-teaser-cols-d', cols[3]);
  }

  const list = document.createElement('ul');
  list.className = 'icon-teaser-list';
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (!cells.some((c) => c.textContent.trim() || c.querySelector('picture, img, span.icon'))) return;
    const iconCell = cells.find(isIconCell) || null;
    const li = document.createElement('li');
    li.className = 'icon-teaser-item';
    if (iconCell) {
      const icon = document.createElement('div');
      icon.className = 'icon-teaser-icon';
      icon.setAttribute('aria-hidden', 'true');
      icon.append(...iconCell.childNodes);
      decorateFontIcons(icon, { text: true });
      li.append(icon);
    }
    const body = document.createElement('div');
    body.className = 'icon-teaser-body';
    cells.filter((c) => c !== iconCell).forEach((c) => body.append(...c.childNodes));
    // a single loose text line (cell without paragraphs) becomes a paragraph
    if (body.firstChild && body.firstChild.nodeType === Node.TEXT_NODE) {
      const p = document.createElement('p');
      while (body.firstChild && (body.firstChild.nodeType === Node.TEXT_NODE || !/^(P|H[1-6]|UL|OL|DIV)$/.test(body.firstChild.tagName))) {
        p.append(body.firstChild);
      }
      body.prepend(p);
    }
    decorateFontIcons(body);
    groupCtaLinks(body, 'icon-teaser-buttons', 'icon-teaser-link');
    li.append(body);
    list.append(li);
  });
  block.replaceChildren(list);
}
