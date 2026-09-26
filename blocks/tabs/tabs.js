import { decorateFontIcons, groupCtaLinks } from '../../scripts/bmw-utils.js';

/*
 * Tabs (BMW tabs-v1). One row per tab: cell 1 label, cell 2 content. A content cell holding only a
 * link to "#<id>" takes the section with that id (section metadata style "tab-panel") as the tab
 * panel, so panels can contain other blocks.
 * Options: buttons (segmented button bar; default underline bar), left (bar left-aligned).
 * Behaviour: click / arrow keys / Home / End switch tabs (automatic activation); the bar scrolls
 * horizontally (touch, wheel, mouse drag) when the labels do not fit, with faded edges.
 */

let tabsId = 0;

function sectionForLink(block, cell) {
  const links = cell.querySelectorAll('a[href]');
  if (links.length !== 1 || cell.textContent.trim() !== links[0].textContent.trim()) return null;
  const href = links[0].getAttribute('href') || '';
  if (!href.startsWith('#') || href.length < 2) return null;
  const id = decodeURIComponent(href.substring(1));
  const main = block.closest('main') || document;
  return [...main.querySelectorAll('.section.tab-panel')].find((s) => s.dataset.id === id) || null;
}

function setupScroller(list, nav) {
  const updateMask = () => {
    const max = list.scrollWidth - list.clientWidth;
    nav.classList.toggle('mask-left', list.scrollLeft > 1);
    nav.classList.toggle('mask-right', max - list.scrollLeft > 1);
  };
  list.addEventListener('scroll', updateMask, { passive: true });
  if (window.ResizeObserver) new ResizeObserver(updateMask).observe(list);
  updateMask();

  // mouse drag scrolling (source style-draggable)
  let drag = null;
  let suppress = false;
  list.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse' || e.button !== 0 || list.scrollWidth <= list.clientWidth) return;
    drag = { x: e.clientX, left: list.scrollLeft, moved: false };
  });
  list.addEventListener('pointermove', (e) => {
    if (!drag) return;
    const dx = e.clientX - drag.x;
    if (!drag.moved && Math.abs(dx) < 5) return;
    drag.moved = true;
    nav.classList.add('is-dragging');
    list.scrollLeft = drag.left - dx;
  });
  const end = () => {
    if (drag && drag.moved) {
      suppress = true;
      setTimeout(() => { suppress = false; }, 0);
    }
    drag = null;
    nav.classList.remove('is-dragging');
  };
  list.addEventListener('pointerup', end);
  list.addEventListener('pointerleave', end);
  list.addEventListener('click', (e) => {
    if (!suppress) return;
    e.preventDefault();
    e.stopPropagation();
  }, true);
}

export default function decorate(block) {
  tabsId += 1;
  const id = `tabs-${tabsId}`;
  const nav = document.createElement('div');
  nav.className = 'tabs-nav';
  const list = document.createElement('div');
  list.className = 'tabs-list';
  list.setAttribute('role', 'tablist');
  nav.append(list);
  const panelsBox = document.createElement('div');
  panelsBox.className = 'tabs-panels';

  const tabs = [];
  const panels = [];
  [...block.children].forEach((row, i) => {
    const [labelCell, ...rest] = [...row.children];
    const label = labelCell ? labelCell.textContent.replace(/\s+/g, ' ').trim() : '';
    if (!label) return;
    const tab = document.createElement('button');
    tab.type = 'button';
    tab.className = 'tabs-tab';
    tab.id = `${id}-tab-${i + 1}`;
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', `${id}-panel-${i + 1}`);
    const span = document.createElement('span');
    span.className = 'tabs-tab-label';
    span.textContent = label;
    tab.append(span);

    const panel = document.createElement('div');
    panel.className = 'tabs-panel';
    panel.id = `${id}-panel-${i + 1}`;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', tab.id);
    panel.tabIndex = 0;
    const cell = rest[0];
    const section = cell ? sectionForLink(block, cell) : null;
    if (section) {
      panel.append(section);
      panel.classList.add('has-section');
    } else {
      rest.forEach((c) => panel.append(...c.childNodes));
      decorateFontIcons(panel, { text: true });
      groupCtaLinks(panel, 'tabs-buttons', 'tabs-link');
    }
    tabs.push(tab);
    panels.push(panel);
    list.append(tab);
    panelsBox.append(panel);
  });
  nav.dataset.items = String(tabs.length);
  // a single tab has no tab bar (source cmp-tabs__navigation--hide)
  nav.hidden = tabs.length < 2;

  const select = (index, focus = false) => {
    tabs.forEach((t, i) => {
      const active = i === index;
      t.setAttribute('aria-selected', String(active));
      t.tabIndex = active ? 0 : -1;
      t.classList.toggle('is-active', active);
      panels[i].hidden = !active;
    });
    const tab = tabs[index];
    if (!tab) return;
    if (focus) tab.focus();
    // keep the active tab visible in a scrolling bar
    const l = tab.offsetLeft - list.offsetLeft;
    if (l < list.scrollLeft || l + tab.offsetWidth > list.scrollLeft + list.clientWidth) {
      list.scrollTo({ left: l - (list.clientWidth - tab.offsetWidth) / 2, behavior: 'smooth' });
    }
  };

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(i));
    tab.addEventListener('keydown', (e) => {
      let next = -1;
      if (e.key === 'ArrowRight') next = (i + 1) % tabs.length;
      else if (e.key === 'ArrowLeft') next = (i - 1 + tabs.length) % tabs.length;
      else if (e.key === 'Home') next = 0;
      else if (e.key === 'End') next = tabs.length - 1;
      if (next < 0) return;
      e.preventDefault();
      select(next, true);
    });
  });

  block.replaceChildren(nav, panelsBox);
  if (tabs.length) select(0);
  setupScroller(list, nav);
}
