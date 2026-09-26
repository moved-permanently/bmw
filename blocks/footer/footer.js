/*
 * Footer block. Content-first: every text, link and image comes from the footer fragment
 * (content/footer.plain.html locally, /footer.plain.html on DA/EDS); this file only builds the
 * layout shell and behaviour around it.
 *
 * Fragment model (one DA section per top-level <div>):
 * - promo section: image + text + link paragraphs -> teaser row
 * - link column sections: <h2-h6> + <ul> pairs; consecutive ones form the column grid
 * - icon list section: <ul> whose links only contain images -> social row
 * - link bar section: <ul> without heading -> legal bar (plain-text items allowed)
 * Links whose URL ends with "#_blank" open in a new tab (marker is stripped).
 */

const NEW_TAB_MARKER = '#_blank';
const ACCORDION_QUERY = '(width < 768px)';
const HEADINGS = 'h2, h3, h4, h5, h6';

/**
 * Fetches the footer fragment. Fixed, metadata-independent paths:
 * /content/footer.plain.html (local preview) first, then /footer.plain.html (DA/EDS).
 * @returns {Promise<{root: HTMLElement, base: URL}|null>}
 */
async function fetchFooterFragment() {
  let resp = await fetch('/content/footer.plain.html');
  if (!resp.ok) resp = await fetch('/footer.plain.html');
  if (!resp.ok) return null;
  const root = document.createElement('div');
  root.innerHTML = await resp.text();
  return { root, base: new URL(resp.url || '/footer.plain.html', window.location.href) };
}

/** Resolves fragment-relative media (images/x.png, ./media_x.png) against the fragment URL. */
function resolveMedia(root, base) {
  root.querySelectorAll('img[src]').forEach((img) => {
    const src = img.getAttribute('src');
    if (!/^([a-z]+:|\/\/|\/|data:)/i.test(src)) img.src = new URL(src, base).href;
    img.loading = 'lazy';
    img.decoding = 'async';
  });
  root.querySelectorAll('source[srcset]').forEach((source) => {
    const srcset = source.getAttribute('srcset');
    if (!/^([a-z]+:|\/\/|\/)/i.test(srcset)) source.srcset = new URL(srcset, base).href;
  });
}

/** Applies the "#_blank" new-tab marker and rel=noopener. */
function applyLinkTargets(root) {
  root.querySelectorAll('a[href]').forEach((a) => {
    const href = a.getAttribute('href');
    if (href.endsWith(NEW_TAB_MARKER)) {
      a.setAttribute('href', href.slice(0, -NEW_TAB_MARKER.length));
      a.target = '_blank';
      a.rel = 'noopener';
    }
  });
}

/** Unwraps DA "default-content-wrapper" style wrappers so sections are flat. */
function sectionChildren(section) {
  const inner = section.children.length === 1 && section.firstElementChild.tagName === 'DIV'
    ? section.firstElementChild : section;
  return [...inner.children];
}

function isIconOnlyList(ul) {
  const items = [...ul.querySelectorAll(':scope > li')];
  return items.length > 0 && items.every((li) => {
    const a = li.querySelector('a');
    return a && a.querySelector('img') && !a.textContent.trim();
  });
}

/** @returns {'columns'|'icons'|'bar'|'promo'} */
function classifySection(nodes) {
  const hasHeading = nodes.some((n) => n.matches(HEADINGS));
  const lists = nodes.filter((n) => n.tagName === 'UL' || n.tagName === 'OL');
  if (hasHeading && lists.length) return 'columns';
  if (lists.length && lists.every(isIconOnlyList)) return 'icons';
  if (lists.length && !hasHeading) return 'bar';
  return 'promo';
}

function createBand(name) {
  const band = document.createElement('div');
  band.className = `footer-band footer-${name}`;
  return band;
}

function buildPromo(nodes) {
  const band = createBand('teaser');
  const row = document.createElement('div');
  row.className = 'footer-teaser-row';
  nodes.forEach((n) => {
    if (n.querySelector('img') && !n.textContent.trim()) n.classList.add('footer-teaser-icon');
    else if (n.querySelector('a') && n.textContent.trim() === n.querySelector('a').textContent.trim()) {
      n.classList.add('footer-teaser-cta');
      n.querySelector('a').classList.add('link-arrow');
    }
    row.append(n);
  });
  band.append(row);
  return band;
}

let groupCounter = 0;

/** Groups each heading + following list; the heading is the mobile accordion toggle. */
function buildColumn(nodes) {
  const column = document.createElement('div');
  column.className = 'footer-column';
  let group = null;
  nodes.forEach((n) => {
    if (n.matches(HEADINGS)) {
      group = document.createElement('div');
      group.className = 'footer-group';
      n.classList.add('footer-group-title');
      group.append(n);
      column.append(group);
    } else if (group) {
      if (n.tagName === 'UL' || n.tagName === 'OL') {
        groupCounter += 1;
        n.id = `footer-group-list-${groupCounter}`;
        n.classList.add('footer-group-list');
        group.querySelector('.footer-group-title').dataset.controls = n.id;
      }
      group.append(n);
    } else {
      column.append(n);
    }
  });
  return column;
}

function buildList(nodes, name) {
  const band = createBand(name);
  nodes.forEach((n) => band.append(n));
  return band;
}

/**
 * Mobile accordion (below 768px): one group open at a time, list height animated via max-height.
 * Static columns above 768px.
 */
function setupAccordion(block) {
  const mq = window.matchMedia(ACCORDION_QUERY);
  const titles = [...block.querySelectorAll('.footer-group-title')];
  const setState = (title, expanded) => {
    const group = title.closest('.footer-group');
    const list = group.querySelector('.footer-group-list');
    title.setAttribute('aria-expanded', String(expanded));
    group.classList.toggle('is-expanded', expanded);
    if (list) list.style.maxHeight = expanded ? `${list.scrollHeight}px` : '';
  };
  const toggle = (title) => {
    if (!mq.matches) return;
    const open = title.getAttribute('aria-expanded') !== 'true';
    if (open) titles.forEach((t) => { if (t !== title) setState(t, false); });
    setState(title, open);
  };
  titles.forEach((title) => {
    title.addEventListener('click', () => toggle(title));
    title.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle(title);
      }
    });
  });
  const apply = () => {
    titles.forEach((title) => {
      if (mq.matches) {
        title.setAttribute('role', 'button');
        title.tabIndex = 0;
        title.setAttribute('aria-controls', title.dataset.controls || '');
        setState(title, false);
      } else {
        ['role', 'tabindex', 'aria-controls', 'aria-expanded'].forEach((a) => title.removeAttribute(a));
        const group = title.closest('.footer-group');
        group.classList.remove('is-expanded');
        const list = group.querySelector('.footer-group-list');
        if (list) list.style.maxHeight = '';
      }
    });
  };
  mq.addEventListener('change', apply);
  apply();
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const fragment = await fetchFooterFragment();
  block.textContent = '';
  if (!fragment) return;
  const { root, base } = fragment;
  resolveMedia(root, base);
  applyLinkTargets(root);

  let columns = null;
  [...root.children].forEach((section) => {
    const nodes = sectionChildren(section);
    if (!nodes.length) return;
    const kind = classifySection(nodes);
    if (kind === 'columns') {
      if (!columns) {
        const band = createBand('links');
        columns = document.createElement('div');
        columns.className = 'footer-columns';
        band.append(columns);
        block.append(band);
      }
      columns.append(buildColumn(nodes));
      return;
    }
    columns = null;
    if (kind === 'promo') block.append(buildPromo(nodes));
    else if (kind === 'icons') block.append(buildList(nodes, 'social'));
    else block.append(buildList(nodes, 'legal'));
  });

  setupAccordion(block);
}
