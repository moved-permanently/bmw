/*
 * Link List (source cmp-list): an optional title and a list of links.
 * Content: one cell — optional heading (list title), then a bulleted list of links (items without
 * a link stay plain text).
 * Options: horizontal (links in a row), overflow (one scrollable row, drag to scroll), thin
 * (large light title, light links), collapsible (the title toggles the list below 768px),
 * center (centered below 1280px).
 */

const MOBILE_MQ = window.matchMedia('(max-width: 767px)');
let idCounter = 0;

function enableDragScroll(list) {
  let startX = 0;
  let startLeft = 0;
  let dragging = false;
  let moved = false;
  list.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse') return;
    dragging = true;
    moved = false;
    startX = e.clientX;
    startLeft = list.scrollLeft;
  });
  list.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 4) {
      moved = true;
      list.classList.add('is-dragging');
    }
    list.scrollLeft = startLeft - dx;
  });
  const end = () => {
    dragging = false;
    list.classList.remove('is-dragging');
  };
  list.addEventListener('pointerup', end);
  list.addEventListener('pointerleave', end);
  // a drag must not follow the link under the pointer
  list.addEventListener('click', (e) => {
    if (moved) {
      e.preventDefault();
      moved = false;
    }
  }, true);
}

function updateMasks(list, wrap) {
  const max = list.scrollWidth - list.clientWidth;
  wrap.classList.toggle('has-prev', list.scrollLeft > 1);
  wrap.classList.toggle('has-next', max - list.scrollLeft > 1);
}

export default function decorate(block) {
  const cell = block.querySelector(':scope > div > div') || block;
  const heading = cell.querySelector('h1, h2, h3, h4, h5, h6');
  const srcList = cell.querySelector('ul, ol');
  const items = srcList ? [...srcList.children] : [...cell.querySelectorAll('a[href]')];
  if (!items.length) return;

  const list = document.createElement('ul');
  list.className = 'link-list-items';
  items.forEach((item) => {
    const li = document.createElement('li');
    li.className = 'link-list-item';
    if (item.tagName === 'A') {
      li.append(item);
    } else {
      li.append(...item.childNodes);
    }
    li.querySelectorAll('a').forEach((a) => a.classList.add('link-list-link'));
    if (!li.querySelector('a')) li.classList.add('link-list-text');
    if (li.querySelector('img') && !li.textContent.trim()) li.classList.add('link-list-icon-only');
    list.append(li);
  });

  const wrap = document.createElement('div');
  wrap.className = 'link-list-inner';
  let title = null;
  if (heading) {
    heading.classList.add('link-list-title');
    title = heading;
  }

  if (title && block.classList.contains('collapsible')) {
    idCounter += 1;
    list.id = `link-list-${idCounter}`;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'link-list-toggle';
    button.setAttribute('aria-controls', list.id);
    button.append(...title.childNodes);
    title.append(button);
    const sync = () => {
      const collapsible = MOBILE_MQ.matches;
      const expanded = block.classList.contains('is-expanded');
      if (collapsible) button.setAttribute('aria-expanded', String(expanded));
      else button.removeAttribute('aria-expanded');
      button.disabled = !collapsible;
    };
    button.addEventListener('click', () => {
      block.classList.toggle('is-expanded');
      sync();
    });
    MOBILE_MQ.addEventListener('change', sync);
    sync();
  }

  if (title) wrap.append(title);
  if (block.classList.contains('overflow')) {
    const scroller = document.createElement('div');
    scroller.className = 'link-list-scroller';
    scroller.append(list);
    wrap.append(scroller);
    enableDragScroll(list);
    list.addEventListener('scroll', () => updateMasks(list, scroller), { passive: true });
    window.addEventListener('resize', () => updateMasks(list, scroller));
    window.requestAnimationFrame(() => updateMasks(list, scroller));
  } else {
    wrap.append(list);
  }
  block.replaceChildren(wrap);
}
