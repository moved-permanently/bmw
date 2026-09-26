import { decorateFontIcons, groupCtaLinks } from '../../scripts/bmw-utils.js';

/*
 * Card List (BMW cardlist-v1): intro on the left, a list of expandable cards (icon, title, "+")
 * on the right; from 1024px the list scrolls inside a fixed-ratio box.
 * Row 1 (1 cell): intro. Rows 2..n (3 cells): icon | title | content.
 */

let cardListId = 0;

function toggle(card, open) {
  const button = card.querySelector('.card-list-header');
  const panel = card.querySelector('.card-list-content');
  card.classList.toggle('is-open', open);
  button.setAttribute('aria-expanded', String(open));
  panel.setAttribute('aria-hidden', String(!open));
  if (open) panel.removeAttribute('inert');
  else panel.setAttribute('inert', '');
  panel.style.height = open ? `${panel.scrollHeight}px` : '0px';
}

export default function decorate(block) {
  cardListId += 1;
  const rows = [...block.children];
  const intro = document.createElement('div');
  intro.className = 'card-list-intro';
  const introInner = document.createElement('div');
  introInner.className = 'card-list-intro-inner';
  intro.append(introInner);
  const scroller = document.createElement('div');
  scroller.className = 'card-list-scroller';
  const list = document.createElement('ul');
  list.className = 'card-list-items';
  scroller.append(list);

  rows.forEach((row, i) => {
    const cells = [...row.children];
    if (cells.length < 2) {
      cells.forEach((c) => introInner.append(...c.childNodes));
      return;
    }
    const [iconCell, titleCell, ...contentCells] = cells.length === 2 ? [null, ...cells] : cells;
    const id = `card-list-${cardListId}-${i}`;
    const li = document.createElement('li');
    li.className = 'card-list-item';

    const heading = document.createElement('h3');
    heading.className = 'card-list-heading';
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'card-list-header';
    button.id = `${id}-button`;
    button.setAttribute('aria-controls', `${id}-panel`);
    if (iconCell && iconCell.textContent.trim()) {
      const icon = document.createElement('span');
      icon.className = 'card-list-icon';
      icon.setAttribute('aria-hidden', 'true');
      icon.append(...iconCell.childNodes);
      decorateFontIcons(icon, { text: true });
      button.append(icon);
    }
    const title = document.createElement('span');
    title.className = 'card-list-title';
    const titleInner = titleCell.querySelector(':scope > :is(p, h1, h2, h3, h4, h5, h6)');
    const titleSource = titleInner && titleCell.children.length === 1 ? titleInner : titleCell;
    title.append(...titleSource.childNodes);
    const plus = document.createElement('span');
    plus.className = 'card-list-toggle';
    plus.setAttribute('aria-hidden', 'true');
    button.append(title, plus);
    heading.append(button);

    const panel = document.createElement('div');
    panel.className = 'card-list-content';
    panel.id = `${id}-panel`;
    panel.setAttribute('role', 'region');
    panel.setAttribute('aria-labelledby', button.id);
    const inner = document.createElement('div');
    inner.className = 'card-list-content-inner';
    contentCells.forEach((c) => inner.append(...c.childNodes));
    decorateFontIcons(inner);
    groupCtaLinks(inner, 'card-list-buttons', 'card-list-link');
    panel.append(inner);

    li.append(heading, panel);
    list.append(li);
    toggle(li, false);
    button.addEventListener('click', () => toggle(li, !li.classList.contains('is-open')));
    // the whole card is clickable (source cursor: pointer on the card)
    li.addEventListener('click', (e) => {
      if (e.target.closest('a, button, .card-list-content')) return;
      button.click();
    });
  });

  decorateFontIcons(introInner);
  groupCtaLinks(introInner, 'card-list-buttons', 'card-list-link');
  block.replaceChildren(...(introInner.children.length ? [intro] : []), scroller);
  if (!introInner.children.length) block.classList.add('no-intro');

  // open panels follow content size changes (fonts, viewport)
  if (window.ResizeObserver) {
    const ro = new ResizeObserver(() => {
      list.querySelectorAll('.card-list-item.is-open .card-list-content').forEach((p) => {
        p.style.height = `${p.firstElementChild.scrollHeight}px`;
      });
    });
    ro.observe(list);
  }
}
