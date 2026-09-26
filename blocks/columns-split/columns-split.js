import {
  getImageRefs,
  buildResponsivePicture,
  decorateFontIcons,
  groupButtons,
} from '../../scripts/bmw-utils.js';

// No authorable options yet; unknown tokens on the block are ignored.
const OPTION_CLASSES = [];

/** A cell whose only content is one or more images (picture/img or image links). */
function isMediaCell(cell) {
  if (cell.querySelector('h1, h2, h3, h4, h5, h6')) return false;
  const refs = getImageRefs(cell);
  if (!refs.length) return false;
  const clone = cell.cloneNode(true);
  clone.querySelectorAll('picture, img').forEach((n) => n.remove());
  clone.querySelectorAll('a[href]').forEach((a) => {
    if (refs.some((r) => r.url === a.href)) a.remove();
  });
  return !clone.textContent.trim();
}

/** Plain (non-button) links that are the only content of their paragraph -> chevron links. */
function decorateTextLinks(col) {
  col.querySelectorAll(':scope > p').forEach((p) => {
    if (p.classList.contains('button-wrapper')) return;
    const links = p.querySelectorAll('a[href]');
    if (links.length !== 1) return;
    const a = links[0];
    if (a.textContent.trim() !== p.textContent.trim() || a.querySelector('img')) return;
    p.classList.add('columns-split-link-wrapper');
    a.classList.add('columns-split-link');
    if (!a.querySelector('.bmw-icon')) {
      // ligature glyph; aria-hidden keeps the icon name out of the link's accessible name
      const icon = document.createElement('span');
      icon.className = 'icon bmw-icon columns-split-link-icon';
      icon.dataset.icon = 'arrow_chevron_right';
      icon.setAttribute('aria-hidden', 'true');
      icon.textContent = 'arrow_chevron_right';
      a.append(icon);
    }
  });
  // group consecutive link paragraphs
  let group = null;
  [...col.children].forEach((el) => {
    if (el.classList.contains('columns-split-link-wrapper')) {
      if (!group) {
        group = document.createElement('div');
        group.className = 'columns-split-links';
        el.before(group);
      }
      group.append(el);
    } else {
      group = null;
    }
  });
}

export default function decorate(block) {
  // collected once so option handling stays in one place (none defined yet)
  // eslint-disable-next-line no-unused-vars
  const active = [...block.classList].filter((c) => OPTION_CLASSES.includes(c));

  [...block.children].forEach((row) => {
    row.classList.add('columns-split-row');
    const cells = [...row.children];
    const mediaCell = cells.find(isMediaCell);
    if (!mediaCell) row.classList.add('columns-split-text-only');

    cells.forEach((cell, index) => {
      if (cell === mediaCell) {
        cell.className = 'columns-split-media';
        const [ref] = getImageRefs(cell);
        const picture = buildResponsivePicture([
          { media: '(max-width: 767px)', url: ref.url, widths: [480, 767, 1023] },
          { media: '(max-width: 1279px)', url: ref.url, widths: [1023, 1279] },
          { url: ref.url, widths: [1279, 1759, 2560] },
        ], { alt: ref.alt, sizes: '(min-width: 1024px) 58vw, 100vw' });
        cell.replaceChildren(picture);
        if (index > 0) row.classList.add('columns-split-media-right');
        return;
      }
      cell.className = 'columns-split-text';
      decorateFontIcons(cell);
      groupButtons(cell, 'columns-split-buttons');
      decorateTextLinks(cell);
    });
  });
}
