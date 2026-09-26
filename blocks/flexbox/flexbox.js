/*
 * Flexbox (source cmp-flexbox / cmp-flexitem).
 *  default: grey link tiles (headline + arrow) in a centred wrapping row (1/2/3/4/5 per row at
 *    0/768/1024/1280/1920px); a truncated headline expands on hover/focus.
 *    Rows: one link per row (text = headline).
 *  expandable (source style-flexbox--3-tiles-expandable): white tiles with icon + label in a grid
 *    (1/2/3 columns); a tile opens its info panel below the tile row (one panel at a time, close
 *    button); the "live-chat" tile opens the live chat of the help sidebar.
 *    Rows: ":icon:" | label | "live-chat" | link | panel content (h3 = group title,
 *    h4 = row label followed by its values).
 */
import { openLiveChat } from '../../scripts/bmw-sidebar.js';

let panelSeq = 0;

function icon(name, className = '') {
  const span = document.createElement('span');
  span.className = `bmw-icon ${className}`.trim();
  span.dataset.icon = name;
  span.setAttribute('aria-hidden', 'true');
  span.textContent = name;
  return span;
}

function iconName(cell) {
  if (!cell) return '';
  const span = cell.querySelector('span.icon');
  if (span) {
    const cls = [...span.classList].find((c) => c.startsWith('icon-'));
    if (cls) return cls.substring(5).replace(/-/g, '_');
  }
  const m = cell.textContent.match(/:([a-z0-9_-]+):/i);
  return m ? m[1].replace(/-/g, '_') : '';
}

/* ---------------------------------------------------------------- default tiles */

function debounce(fn, ms = 200) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}

function decorateDefault(block) {
  const list = document.createElement('div');
  list.className = 'flexbox-container';
  list.setAttribute('role', 'list');
  const tiles = [];
  [...block.children].forEach((row) => {
    const a = row.querySelector('a[href]');
    if (!a) return;
    const wrapper = document.createElement('div');
    wrapper.className = 'flexbox-item-wrapper';
    wrapper.setAttribute('role', 'listitem');
    const tile = document.createElement('a');
    tile.className = 'flexbox-item';
    tile.href = a.href;
    if (a.target) tile.target = a.target;
    tile.draggable = false;
    const headline = document.createElement('p');
    headline.className = 'flexbox-headline';
    headline.textContent = a.textContent.trim();
    tile.append(headline, icon('arrow_right', 'flexbox-arrow'));
    tile.addEventListener('contextmenu', (e) => e.preventDefault());
    tile.addEventListener('keydown', (e) => {
      if (e.key === ' ') {
        e.preventDefault();
        tile.click();
      }
    });
    wrapper.append(tile);
    list.append(wrapper);
    tiles.push({ tile, headline });
  });
  list.classList.add(`flexbox-container-${tiles.length}`);
  block.replaceChildren(list);
  // source applyTruncationCheck: the tile grows to the full headline height on hover
  const check = () => tiles.forEach(({ tile, headline }) => {
    const extra = headline.scrollHeight - headline.clientHeight;
    tile.style.setProperty('--expanded-height', `${tile.scrollHeight + Math.max(0, extra)}px`);
    headline.classList.toggle('is-truncated', extra > 0);
  });
  requestAnimationFrame(check);
  window.addEventListener('resize', debounce(check));
}

/* ---------------------------------------------------------------- expandable tiles */

/** h3 = group title, h4 = row label + following values -> groups of label/value rows. */
function buildPanelContent(cell) {
  const content = document.createElement('div');
  content.className = 'flexbox-panel-content';
  let group = null;
  let row = null;
  const newGroup = (title) => {
    group = document.createElement('div');
    group.className = 'flexbox-group';
    if (title) {
      const h = document.createElement('h3');
      h.className = 'flexbox-group-title';
      h.textContent = title.textContent.trim();
      if (title.id) h.id = title.id;
      group.append(h);
    }
    content.append(group);
    row = null;
  };
  [...cell.children].forEach((el) => {
    if (el.tagName === 'H3' || el.tagName === 'H2') {
      newGroup(el);
      return;
    }
    if (!group) newGroup(null);
    if (el.tagName === 'H4') {
      row = document.createElement('div');
      row.className = 'flexbox-row';
      const label = document.createElement('p');
      label.className = 'flexbox-row-label';
      label.textContent = el.textContent.trim();
      const values = document.createElement('div');
      values.className = 'flexbox-row-values';
      row.append(label, values);
      group.append(row);
      return;
    }
    const target = row ? row.querySelector('.flexbox-row-values') : group;
    target.append(el);
  });
  // lone links: tel/mailto = underlined bold link, others = link with chevron (source as-link)
  content.querySelectorAll('p').forEach((p) => {
    const links = p.querySelectorAll('a[href]');
    if (links.length !== 1 || p.textContent.trim() !== links[0].textContent.trim()) return;
    const a = links[0];
    if (/^(tel|mailto):/i.test(a.getAttribute('href'))) a.classList.add('flexbox-contact-link');
    else a.classList.add('link-arrow');
  });
  return content;
}

function tileButton(name, label, tag = 'button') {
  const tile = document.createElement(tag);
  tile.className = 'flexbox-tile';
  if (tag === 'button') tile.type = 'button';
  const header = document.createElement('span');
  header.className = 'flexbox-tile-header';
  if (name) header.append(icon(name, 'flexbox-tile-icon'));
  const body = document.createElement('span');
  body.className = 'flexbox-tile-text';
  body.textContent = label;
  header.append(body);
  tile.append(icon('arrows_maximize', 'flexbox-tile-maximize'), header);
  return tile;
}

function decorateExpandable(block) {
  const grid = document.createElement('div');
  grid.className = 'flexbox-grid';
  const items = [];
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (!cells.length) return;
    // ":icon:" | label | action/content  (icon cell optional)
    let idx = 0;
    const name = iconName(cells[0]);
    const iconOnly = !cells[0].textContent.replace(/:[a-z0-9_-]+:/gi, '').trim();
    if (cells.length >= 3 || (name && iconOnly)) idx = 1;
    const labelCell = cells[idx];
    const actionCell = cells[idx + 1];
    const label = labelCell ? labelCell.textContent.replace(/:[a-z0-9_-]+:/gi, '').trim() : '';
    if (!label) return;
    const action = actionCell ? actionCell.textContent.trim().toLowerCase() : '';
    const link = actionCell && actionCell.children.length === 1 ? actionCell.querySelector('a[href]') : null;

    if (action === 'live-chat') {
      const tile = tileButton(name, label);
      tile.classList.add('flexbox-tile-live-chat');
      tile.addEventListener('click', () => openLiveChat());
      grid.append(tile);
      items.push({ tile });
      return;
    }
    if (link && actionCell.textContent.trim() === link.textContent.trim()) {
      const tile = tileButton(name, label, 'a');
      tile.href = link.href;
      grid.append(tile);
      items.push({ tile });
      return;
    }
    // expandable tile + panel
    panelSeq += 1;
    const panelId = `flexbox-panel-${panelSeq}`;
    const heading = document.createElement('h3');
    heading.className = 'flexbox-tile-heading';
    const tile = tileButton(name, label);
    tile.id = `${panelId}-tile`;
    tile.setAttribute('aria-controls', panelId);
    tile.setAttribute('aria-expanded', 'false');
    heading.append(tile);
    const panel = document.createElement('div');
    panel.className = 'flexbox-panel';
    panel.id = panelId;
    panel.hidden = true;
    panel.setAttribute('role', 'region');
    panel.setAttribute('aria-labelledby', tile.id);
    const inner = document.createElement('div');
    inner.className = 'flexbox-panel-inner';
    const close = document.createElement('button');
    close.type = 'button';
    close.className = 'flexbox-panel-close';
    close.setAttribute('aria-label', 'Schließen');
    close.append(icon('close'));
    const content = actionCell ? buildPanelContent(actionCell) : document.createElement('div');
    inner.append(close, content);
    panel.append(inner);
    grid.append(heading, panel);
    const hasContent = content.textContent.trim().length > 0;
    if (!hasContent) tile.classList.add('single-item');
    items.push({ tile, panel, close });
  });
  grid.classList.add(`flexbox-grid-${items.length}`);
  block.replaceChildren(grid);

  const closeAll = () => items.forEach(({ tile, panel }) => {
    if (!panel) return;
    tile.classList.remove('selected');
    tile.setAttribute('aria-expanded', 'false');
    panel.hidden = true;
  });
  items.forEach(({ tile, panel, close }) => {
    if (!panel || tile.classList.contains('single-item')) return;
    tile.addEventListener('click', () => {
      const open = tile.classList.contains('selected');
      closeAll();
      if (open) return;
      tile.classList.add('selected');
      tile.setAttribute('aria-expanded', 'true');
      panel.hidden = false;
    });
    close.addEventListener('click', () => {
      closeAll();
      tile.focus({ preventScroll: true });
    });
  });
}

export default function decorate(block) {
  if (block.classList.contains('expandable') || block.classList.contains('3-tiles-expandable')) decorateExpandable(block);
  else decorateDefault(block);
}
