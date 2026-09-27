import { decorateFontIcons, groupCtaLinks } from '../../scripts/bmw-utils.js';

/*
 * Accordion (BMW accordion-v1). One row per item: cell 1 title, cell 2 content.
 * Options: faq, h2 (header level, default h3), expand-first, single (one item open at a time),
 * width-N / width-lg-N / width-md-N (centered width in 12ths from 1280px / 1024-1279px /
 * 768-1023px; lg falls back to N, md to lg).
 */

let accordionId = 0;

function option(block, re) {
  const cls = [...block.classList].find((c) => re.test(c));
  return cls ? Number(cls.match(re)[1]) : 0;
}

function setOpen(item, open) {
  const button = item.querySelector('.accordion-button');
  const panel = item.querySelector('.accordion-panel');
  button.setAttribute('aria-expanded', String(open));
  item.classList.toggle('is-open', open);
  panel.hidden = !open;
}

export default function decorate(block) {
  accordionId += 1;
  const cols = option(block, /^width-(\d+)$/);
  const colsLg = option(block, /^width-lg-(\d+)$/) || cols;
  // a tablet / small-desktop width alone keeps the full width from 1280px
  if (cols || colsLg) block.style.setProperty('--accordion-cols', cols || 12);
  if (colsLg) block.style.setProperty('--accordion-cols-lg', colsLg);
  const colsMd = option(block, /^width-md-(\d+)$/) || colsLg;
  if (colsMd && colsMd < 12) block.style.setProperty('--accordion-cols-md', colsMd);
  const level = block.classList.contains('h2') ? 'h2' : 'h3';
  const single = block.classList.contains('single');

  const items = [];
  [...block.children].forEach((row, i) => {
    const [titleCell, ...rest] = [...row.children];
    if (!titleCell || !titleCell.textContent.trim()) return;
    const id = `accordion-${accordionId}-${i + 1}`;
    const item = document.createElement('div');
    item.className = 'accordion-item';

    const heading = document.createElement(level);
    heading.className = 'accordion-header';
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'accordion-button';
    button.id = `${id}-button`;
    button.setAttribute('aria-controls', `${id}-panel`);
    const title = document.createElement('span');
    title.className = 'accordion-title';
    // a title authored as a heading/paragraph: keep its inline content only
    const inner = titleCell.querySelector(':scope > :is(p, h1, h2, h3, h4, h5, h6)');
    const titleSource = inner && titleCell.children.length === 1 ? inner : titleCell;
    title.append(...titleSource.childNodes);
    const icon = document.createElement('span');
    icon.className = 'accordion-icon bmw-icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = 'arrow_chevron_down';
    button.append(title, icon);
    heading.append(button);

    const panel = document.createElement('div');
    panel.className = 'accordion-panel';
    panel.id = `${id}-panel`;
    panel.setAttribute('role', 'region');
    panel.setAttribute('aria-labelledby', button.id);
    rest.forEach((cell) => panel.append(...cell.childNodes));
    decorateFontIcons(panel, { text: true });
    groupCtaLinks(panel, 'accordion-buttons', 'accordion-link');

    item.append(heading, panel);
    items.push(item);
    setOpen(item, false);

    button.addEventListener('click', () => {
      const open = !item.classList.contains('is-open');
      if (open && single) items.forEach((other) => { if (other !== item) setOpen(other, false); });
      setOpen(item, open);
    });
  });

  if (items.length && block.classList.contains('expand-first')) setOpen(items[0], true);
  block.replaceChildren(...items);
}
