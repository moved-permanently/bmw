import { decorateFontIcons, groupButtons } from '../../scripts/bmw-utils.js';

// No authorable options yet; unknown tokens on the block are ignored.
const OPTION_CLASSES = [];

const ICON_TEXT_RE = /^:[a-z0-9_]+:$/i;

/** A cell that only holds an icon (span.icon, literal :icon:) or a single picture. */
function isIconCell(cell) {
  const text = cell.textContent.trim();
  if (cell.querySelector('h1, h2, h3, h4, h5, h6, a')) return false;
  if (cell.querySelector('span.icon') && !text.replace(/\s+/g, '')) return true;
  if (ICON_TEXT_RE.test(text)) return true;
  return !!cell.querySelector('picture, img') && !text;
}

/** Pulls a leading icon (or picture) out of a combined single-cell item. */
function extractLeadingIcon(cell) {
  const first = cell.firstElementChild;
  if (!first) return null;
  if (first.tagName === 'P' && isIconCell(first)) {
    const wrap = document.createElement('div');
    wrap.append(first);
    return wrap;
  }
  return null;
}

export default function decorate(block) {
  // collected once so option handling stays in one place (none defined yet)
  // eslint-disable-next-line no-unused-vars
  const active = [...block.classList].filter((c) => OPTION_CLASSES.includes(c));

  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const cells = [...row.children].filter((c) => c.textContent.trim() || c.querySelector('picture, img, span.icon'));
    if (!cells.length) return;

    let iconCell = cells.find(isIconCell) || null;
    const bodyCells = cells.filter((c) => c !== iconCell);
    if (!iconCell && bodyCells.length) iconCell = extractLeadingIcon(bodyCells[0]);

    const li = document.createElement('li');
    li.className = 'cards-quicklink-item';

    if (iconCell) {
      iconCell.className = 'cards-quicklink-icon';
      decorateFontIcons(iconCell, { text: true });
      li.append(iconCell);
    }

    const body = document.createElement('div');
    body.className = 'cards-quicklink-body';
    bodyCells.forEach((cell) => {
      while (cell.firstChild) body.append(cell.firstChild);
    });
    decorateFontIcons(body);
    groupButtons(body, 'cards-quicklink-buttons');
    li.append(body);

    ul.append(li);
  });

  block.replaceChildren(ul);
}
