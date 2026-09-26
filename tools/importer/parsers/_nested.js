/* eslint-disable */
/* global WebImporter */
// Helpers for container-like components (carousel slides, accordion/tab panels, card lists, icon
// groups): nested components are flattened to default content, icon groups are detected.
import { normalizeImageUrl, text, cleanHref } from './_utils.js';
import { titleNodes, textNodes, ctaParagraph, isHiddenIn, cleanInline } from './_media.js';

const COMPONENTS = '.title, .text, .button, .image, table';

/**
 * html2md drops empty elements such as the <i data-icon> of BMW icon components before transform()
 * runs, so the icon names are copied onto the .cmp-icon wrapper. Runs when the import bundle is
 * evaluated in the page (before html2md); an onLoad hook in the import script would be cleaner.
 */
export function preserveIconNames(doc) {
  doc.querySelectorAll('.cmp-icon i[data-icon]').forEach((i) => {
    const holder = i.closest('.cmp-icon');
    if (!holder || holder.hasAttribute('data-icon')) return;
    holder.setAttribute('data-icon', i.getAttribute('data-icon'));
    if (i.hasAttribute('data-icon-size')) holder.setAttribute('data-icon-size', i.getAttribute('data-icon-size'));
  });
}
if (typeof document !== 'undefined' && document && document.querySelectorAll) {
  try { preserveIconNames(document); } catch (e) { /* not in a page */ }
}

/** BMW icon name of an AEM icon component (or any element holding an <i data-icon>). */
export function iconName(el) {
  const i = el && (el.matches('[data-icon]') ? el : el.querySelector('i[data-icon], [data-icon]'));
  return i ? (i.getAttribute('data-icon') || '').trim() : '';
}

/** Icon size token (xxs … xxl) of an icon component. */
export function iconSize(el) {
  const i = el && el.querySelector('[data-icon-size]');
  return i ? i.getAttribute('data-icon-size') : '';
}

/** Paragraph holding an ":icon_name:" token. */
export function iconParagraph(document, name) {
  const p = document.createElement('p');
  p.textContent = `:${name}:`;
  return p;
}

function fakeText(document, nodes) {
  const col = document.createElement('div');
  col.className = 'text aem-GridColumn aem-GridColumn--default--12';
  const cmp = document.createElement('div');
  cmp.className = 'cmp-text';
  nodes.forEach((n) => cmp.append(n));
  col.append(cmp);
  return col;
}

/**
 * Default content of a block table produced by an inner parser (the block name row is dropped):
 * paragraphs/headings/lists are kept, loose inline content is wrapped in paragraphs.
 */
export function tableNodes(document, table) {
  const out = [];
  const rows = [...table.querySelectorAll(':scope > tbody > tr, :scope > tr')];
  rows.forEach((tr, i) => {
    if (i === 0 && tr.querySelector('th')) return; // block name
    [...tr.children].forEach((td) => {
      let loose = null;
      [...td.childNodes].forEach((n) => {
        if (n.nodeType === 1 && /^(P|UL|OL|H[1-6]|BLOCKQUOTE|PRE)$/.test(n.tagName)) {
          loose = null;
          out.push(n);
        } else if (n.nodeType === 1 && n.tagName === 'TABLE') {
          loose = null;
          out.push(...tableNodes(document, n));
        } else if (n.nodeType === 1 && n.tagName === 'DIV') {
          loose = null;
          const inner = document.createElement('div');
          inner.append(...n.childNodes);
          const tmp = document.createElement('table');
          const row = document.createElement('tr');
          const c = document.createElement('td');
          c.append(...inner.childNodes);
          row.append(c);
          tmp.append(row);
          out.push(...tableNodes(document, tmp));
        } else if ((n.nodeType === 3 && n.nodeValue.trim()) || n.nodeType === 1) {
          if (!loose) { loose = document.createElement('p'); out.push(loose); }
          loose.append(n);
        }
      });
    });
  });
  return out.filter((n) => n.textContent.trim() || n.querySelector?.('img, a'));
}

/**
 * Rewrites nested components below root into components that contentNodes-style walkers
 * understand: icons -> ":icon:" text, embeds with an image (e.g. COSY car renderings) -> image,
 * block tables from inner parsers -> text with their flattened content.
 * @param {object} [opts] { keepTables: boolean }
 */
export function normalizeNested(document, root, opts = {}) {
  // popover ("page" layer) content keeps its blocks: it becomes a layer section of its own
  const inLayer = (el) => { const pop = el.closest('.cmp-popover'); return !!pop && root.contains(pop); };
  root.querySelectorAll('.icon.aem-GridColumn, .icon').forEach((ic) => {
    if (!root.contains(ic) || inLayer(ic) || !ic.querySelector('[data-icon]') || ic.closest('.cmp-infoi')) return;
    if (ic.classList.contains('cmp-icon')) return;
    const name = iconName(ic);
    if (!name) { ic.remove(); return; }
    ic.replaceWith(fakeText(document, [iconParagraph(document, name)]));
  });
  root.querySelectorAll('.embed').forEach((em) => {
    if (!root.contains(em) || inLayer(em)) return;
    const img = em.querySelector('img[src]');
    if (!img) return;
    // prefer the webp source (keeps the transparency of COSY renderings)
    const webp = em.querySelector('source[type="image/webp"][srcset]');
    const col = document.createElement('div');
    col.className = 'image aem-GridColumn aem-GridColumn--default--12';
    const pic = document.createElement('picture');
    const i = document.createElement('img');
    i.setAttribute('src', webp ? webp.getAttribute('srcset').split(/\s+/)[0] : img.getAttribute('src'));
    i.setAttribute('alt', img.getAttribute('alt') || '');
    pic.append(i);
    col.append(pic);
    em.replaceWith(col);
  });
  if (!opts.keepTables) {
    [...root.querySelectorAll('table')].filter((t) => !t.parentElement.closest('table') && !inLayer(t)).forEach((t) => {
      t.replaceWith(fakeText(document, tableNodes(document, t)));
    });
  }
}

/** Visible top-level AEM components below root (document order), popovers excluded. */
export function topComponents(root, selector = COMPONENTS) {
  return [...root.querySelectorAll(selector)].filter((c) => {
    const pop = c.closest('.cmp-popover');
    if (pop && root.contains(pop)) return false;
    const inside = (sel) => {
      const a = c.parentElement && c.parentElement.closest(sel);
      return !!a && root.contains(a);
    };
    if (c.tagName !== 'TABLE' && inside('.title, .text, .button, .image')) return false;
    if (inside('table')) return false;
    return !isHiddenIn(c, root);
  });
}

function isDisclaimer(comp) {
  return /style-text--disclaimer/.test(comp.className || '');
}

/**
 * Default content of a container: { content: nodes (document order), disclaimers: the subset of
 * content nodes that come from disclaimer texts }; titles keep their tag; buttons become CTA paragraphs
 * (popover "page" layers are extracted relative to `anchor`); images become <img> paragraphs.
 * A clickable container area (cmp-container__click-area) becomes a trailing plain link.
 */
export function defaultContent(document, root, anchor, opts = {}) {
  const content = [];
  const disclaimers = [];
  const skip = opts.skip || (() => false);
  topComponents(root).forEach((c) => {
    if (skip(c)) return;
    if (c.tagName === 'TABLE') {
      if (opts.tables) opts.tables.push(c);
      else content.push(...tableNodes(document, c));
      return;
    }
    const name = (c.className || '').split(/\s+/)[0];
    if (name === 'title') {
      titleNodes(document, c).forEach((n) => {
        if (n.tagName === 'P' && opts.pTitle && !n.querySelector('img')) {
          const h = document.createElement(opts.pTitle);
          h.append(...n.childNodes);
          content.push(h);
        } else content.push(n);
      });
    }
    else if (name === 'text') {
      const nodes = textNodes(document, c);
      content.push(...nodes);
      if (isDisclaimer(c)) disclaimers.push(...nodes);
    }
    else if (name === 'button') {
      const p = ctaParagraph(document, c, anchor || root);
      if (p) content.push(p);
    } else if (name === 'image') {
      const img = c.querySelector('img');
      const src = img && (img.getAttribute('src') || img.getAttribute('data-src'));
      let url = normalizeImageUrl(src || '');
      if (!url || url.startsWith('data:')) {
        const s = c.querySelector('source[srcset]');
        url = s ? normalizeImageUrl(s.getAttribute('srcset')) : '';
      }
      if (url && !url.startsWith('data:')) {
        const p = document.createElement('p');
        const i = document.createElement('img');
        i.src = url;
        i.alt = (img && img.getAttribute('alt')) || '';
        p.append(i);
        content.push(p);
      }
    }
  });
  const click = root.querySelector('a.cmp-container__click-area[href]');
  if (click && opts.clickArea !== false) {
    const href = cleanHref(click.getAttribute('href'));
    const label = (click.getAttribute('title') || text(click) || '').trim();
    if (href && label && !content.some((n) => n.querySelector && n.querySelector(`a[href="${href}"]`))) {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.href = href;
      a.textContent = label;
      p.append(a);
      content.push(p);
    }
  }
  return { content, disclaimers };
}

/** Typography style of the first title component below root: headline-3, subsection-1, … */
export function titleStyle(root) {
  const t = root && root.querySelector('.title');
  const m = t && (t.className || '').match(/style-title--((?:headline|subsection)-\d)/);
  return m ? m[1] : '';
}

/* ---------------------------------------------------------------- grid geometry */

const BP_CLASS = { small: 'small', medium: 'medium', large: 'large', default: 'default', xlarge: 'xlarge' };

function colWidth(el, bp) {
  const cls = el.className || '';
  const m = cls.match(new RegExp(`aem-GridColumn--${bp}--(\\d+)`));
  if (m) return Number(m[1]);
  if (bp !== 'default') return colWidth(el, 'default');
  return null;
}

function gridSize(grid, bp) {
  const cls = grid.className || '';
  const m = cls.match(new RegExp(`aem-Grid--${bp}--(\\d+)`)) || cls.match(/aem-Grid--(\d+)/);
  return m ? Number(m[1]) : 12;
}

/**
 * Width of `el` as a fraction of `stop` (or the page) at an AEM breakpoint
 * (small < 768 <= medium < 1024 <= large < 1280 <= default < 1920 <= xlarge).
 */
export function gridFraction(el, bp = 'default', stop = null) {
  let f = 1;
  let n = el;
  while (n && n !== stop && n.classList) {
    if (n.classList.contains('aem-GridColumn')) {
      const w = colWidth(n, BP_CLASS[bp] || bp);
      const grid = n.parentElement && n.parentElement.closest('.aem-Grid');
      if (w && grid) f *= Math.min(1, w / gridSize(grid, bp));
    }
    n = n.parentElement;
  }
  return f;
}

/* ---------------------------------------------------------------- icon groups */

function gridKids(el) {
  const out = [];
  const walk = (node) => {
    [...node.children].forEach((c) => {
      if (c.classList.contains('aem-GridColumn') || c.tagName === 'TABLE') out.push(c);
      else if (/^(DIV|SECTION|ARTICLE)$/.test(c.tagName)) walk(c);
    });
  };
  walk(el);
  return out;
}

function isEmptyCol(el) {
  return /aem-GridColumn--default--hide/.test(el.className || '')
    || (!el.textContent.replace(/\s+/g, '') && !el.querySelector('img, video, [data-icon], table'));
}

const FOREIGN = '.cmp-carousel, .cmp-accordion, .cmp-cardlist, .cmp-stage, .cmp-backgroundmedia, .cmp-textmediateaser, '
  + '.cmp-multi-content, .cmp-mediagallery, .cmp-modelcard, .cmp-contentteaser, .swiper';

/** The item container of an icon component: the closest container that also holds content. */
export function iconItem(icon) {
  if (icon.parentElement && icon.parentElement.closest(FOREIGN)) return null;
  let n = icon.parentElement && icon.parentElement.closest('.container.aem-GridColumn');
  while (n) {
    const hasContent = [...n.querySelectorAll('.title, .text, .button')].some((c) => !c.closest('.icon'));
    if (hasContent) break;
    n = n.parentElement && n.parentElement.closest('.container.aem-GridColumn');
  }
  if (!n || n.querySelectorAll('.icon.aem-GridColumn').length !== 1) return null;
  return n;
}

function itemSet(root) {
  const set = new Set();
  root.querySelectorAll('.icon.aem-GridColumn').forEach((ic) => {
    const it = iconItem(ic);
    if (it) set.add(it);
  });
  return set;
}

/**
 * Icon group containing `icon`: { members: [sibling elements replaced by the block], items: [item
 * containers in order], root: common parent } or null. A container whose visible grid children are
 * all items (or containers of items) is promoted; groups are maximal runs of consecutive items.
 */
export function iconGroup(icon) {
  const item = iconItem(icon);
  if (!item) return null;
  const doc = icon.ownerDocument;
  const items = itemSet(doc.body);
  const pure = (el) => items.has(el) || (el.classList.contains('container')
    && gridKids(el).filter((k) => !isEmptyCol(k)).length > 0
    && gridKids(el).every((k) => isEmptyCol(k) || pure(k)));
  let node = item;
  for (;;) {
    const parent = node.parentElement && node.parentElement.closest('.container.aem-GridColumn');
    if (!parent || !pure(parent) || parent.parentElement.closest(FOREIGN)) break;
    node = parent;
  }
  const parent = node.parentElement && node.parentElement.closest('.aem-GridColumn, main, body');
  const siblings = parent ? gridKids(parent) : [node];
  const idx = siblings.indexOf(node);
  let start = idx;
  let end = idx;
  while (start > 0 && (pure(siblings[start - 1]) || isEmptyCol(siblings[start - 1]))) start -= 1;
  while (end < siblings.length - 1 && (pure(siblings[end + 1]) || isEmptyCol(siblings[end + 1]))) end += 1;
  const members = siblings.slice(start, end + 1);
  while (members.length && isEmptyCol(members[0])) members.shift();
  while (members.length && isEmptyCol(members[members.length - 1])) members.pop();
  const groupItems = [];
  members.forEach((m) => {
    if (items.has(m)) groupItems.push(m);
    else [...items].filter((it) => m.contains(it)).forEach((it) => groupItems.push(it));
  });
  return { members, items: groupItems, root: parent };
}

/** Parts of an icon item: { icon, size, centered, inline, content } */
export function iconItemParts(document, item, anchor) {
  const icon = item.querySelector('.icon.aem-GridColumn');
  const name = iconName(icon);
  const size = iconSize(icon);
  const flexRow = !!item.querySelector(':scope > .cmp-container.cmp-container--flex-row, :scope > .cmp-container--flex-row');
  const centered = /style-container--center/.test(item.className)
    && !!(item.querySelector('.title, .text, .button')?.closest('.style-container--center'));
  const { content } = defaultContent(document, item, anchor, { skip: (c) => c.closest('.icon'), pTitle: 'h3' });
  return {
    name, size, centered, inline: flexRow, content,
  };
}

/** Distinct CTA count / text count in an icon item (for choosing quicklink vs icon teaser). */
export function iconItemKind(item) {
  const comps = topComponents(item);
  return {
    buttons: comps.filter((c) => c.classList.contains('button')).length,
    texts: comps.filter((c) => c.classList.contains('text') && !isDisclaimer(c)).length,
    titles: comps.filter((c) => c.classList.contains('title')).length,
  };
}

/** Quicklink icon cards: 2+ centered items, each with a CTA button and no body text. */
export function isQuicklinkGroup(group) {
  if (!group || group.items.length < 2) return false;
  return group.items.every((it) => {
    const k = iconItemKind(it);
    return k.buttons > 0 && k.texts === 0 && /style-container--center/.test(it.className);
  });
}

/** Items per row at small/medium/default breakpoints, e.g. "2-2-4". */
export function itemColumns(group) {
  const first = group.items[0];
  const stop = group.root;
  const cols = (bp) => {
    const f = gridFraction(first, bp, stop);
    return Math.max(1, Math.min(6, Math.round(1 / (f || 1))));
  };
  return `${cols('small')}-${cols('medium')}-${cols('default')}`;
}

export { cleanInline };
