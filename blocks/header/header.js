import { getMetadata } from '../../scripts/aem.js';
import { fetchSheet } from '../../scripts/bmw-utils.js';

/*
 * BMW global navigation.
 * Content comes from the nav fragment (content/nav.plain.html), sections in order:
 *   1. brand: link with the light (transparent header) and dark logo image
 *   2. primary navigation: <ul>; items with a nested <ul> open a flyout whose columns are the
 *      nested <li> (first child = column heading, nested <ul> = links)
 *   3. tools: <ul> of ":icon: Label" items; links navigate, items without link open the next
 *      panel section
 *   4+. sections starting with a heading = panels for the tool items without link (in order);
 *      other sections = extra links of the mobile menu bar (tools with the same href are hidden
 *      in the closed mobile bar)
 */

const DESKTOP = window.matchMedia('(width >= 1280px)');
const TABLET = window.matchMedia('(width >= 768px)');
const STAGE_BLOCKS = ['hero-stage', 'hero-teaser'];
// My BMW flyout texts/links (DA sheet, tabs labels | benefits | links; source: bmw.de
// /de-de/login/bmw/api/flyout/data, logged-out state)
const LOGIN_DATA_PATH = '/de/data/mybmw-flyout.json';
const BMW_ORIGIN = 'https://www.bmw.de';

let uid = 0;
const nextId = (prefix) => {
  uid += 1;
  return `${prefix}-${uid}`;
};

function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (v === undefined || v === null || v === false) return;
    if (k === 'class') node.className = v;
    else node.setAttribute(k, v === true ? '' : v);
  });
  children.flat().forEach((c) => {
    if (c === undefined || c === null) return;
    node.append(typeof c === 'string' ? document.createTextNode(c) : c);
  });
  return node;
}

// BMW icon font ligature rendered by CSS (::before { content: attr(data-icon) }), like the source
const icon = (name, cls = '') => el('span', { class: `nav-icon ${cls}`.trim(), 'aria-hidden': 'true', 'data-icon': name });

/** Replaces ":icon_name:" tokens in text nodes with BMW ligature icon spans. */
function decorateIconTokens(root) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) {
    if (/:[a-z0-9_]+:/i.test(walker.currentNode.nodeValue)) nodes.push(walker.currentNode);
  }
  nodes.forEach((node) => {
    const frag = document.createDocumentFragment();
    node.nodeValue.split(/(:[a-z0-9_]+:)/i).forEach((part) => {
      const m = part.match(/^:([a-z0-9_]+):$/i);
      if (m) frag.append(icon(m[1].toLowerCase()));
      else if (part.trim()) frag.append(document.createTextNode(part.trim()));
    });
    node.replaceWith(frag);
  });
  // authored span.icon (DA/EDS rendering of :icon:) -> ligature icon
  root.querySelectorAll('span.icon').forEach((span) => {
    const cls = [...span.classList].find((c) => c.startsWith('icon-'));
    if (cls) span.replaceWith(icon(cls.substring(5).replace(/-/g, '_')));
  });
}

/**
 * Fetches the nav fragment: from the site root (DA/EDS), on pages of the local content preview
 * (/content/…) from /content first; the other location is the fallback.
 */
async function fetchNavFragment() {
  const paths = ['/nav.plain.html', '/content/nav.plain.html'];
  if (window.location.pathname.startsWith('/content/')) paths.reverse();
  let resp = await fetch(paths[0]);
  if (!resp.ok) resp = await fetch(paths[1]);
  if (!resp.ok) return null;
  // parse inertly so fragment-relative images are not requested against the page URL
  const doc = new DOMParser().parseFromString(await resp.text(), 'text/html');
  const root = document.createElement('div');
  root.append(...doc.body.childNodes);
  const base = resp.url || window.location.href;
  root.querySelectorAll('img[src]').forEach((img) => {
    img.src = new URL(img.getAttribute('src'), base).href;
  });
  root.querySelectorAll('source[srcset]').forEach((s) => {
    s.srcset = new URL(s.getAttribute('srcset'), base).href;
  });
  return root;
}

/** Text of an element without its nested lists. */
function ownText(li) {
  const clone = li.cloneNode(true);
  clone.querySelectorAll('ul, ol').forEach((l) => l.remove());
  return clone.textContent.replace(/\s+/g, ' ').trim();
}

/** First non-list child nodes of a list item (its label content). */
function labelNodes(li) {
  const nodes = [];
  [...li.childNodes].forEach((n) => {
    if (n.nodeType === Node.ELEMENT_NODE && /^(UL|OL)$/.test(n.tagName)) return;
    if (n.nodeType === Node.TEXT_NODE && !n.nodeValue.trim()) return;
    if (n.nodeType === Node.ELEMENT_NODE && n.tagName === 'P') nodes.push(...n.childNodes);
    else nodes.push(n);
  });
  return nodes;
}

/* ------------------------------------------------------------------ header style */

/** Page metadata; falls back to the metadata table of the local preview (.plain.html). */
function pageMetadata(name) {
  const value = getMetadata(name);
  if (value) return value;
  const row = [...document.querySelectorAll('main .metadata > div')].find((r) => r.children.length > 1
    && r.children[0].textContent.trim().toLowerCase().replace(/\s+/g, '-') === name);
  return row ? row.children[1].textContent.trim() : '';
}

function headerStyle() {
  const meta = (pageMetadata('header-style') || '').toLowerCase().trim();
  if (meta.includes('gradient')) return 'gradient';
  if (meta.startsWith('trans')) return 'transparent';
  if (meta.startsWith('solid')) return 'solid';
  const firstSection = document.querySelector('main > .section, main > div');
  const firstBlock = firstSection && firstSection.querySelector('[data-block-name], .block');
  const name = firstBlock && (firstBlock.dataset.blockName || firstBlock.classList[0]);
  return STAGE_BLOCKS.includes(name) ? 'transparent' : 'solid';
}

/* ------------------------------------------------------------------ builders */

/** Skip links authored in the brand section (links without image), e.g. "Skip to main content". */
function buildSkipLinks(section) {
  if (!section) return [];
  return [...section.querySelectorAll('a')].filter((a) => !a.querySelector('img')).map((a) => {
    const skip = el('a', { class: 'nav-skip', href: a.getAttribute('href') }, a.textContent.trim());
    skip.addEventListener('click', (e) => {
      const main = document.querySelector('main');
      if (!main || !skip.getAttribute('href').startsWith('#')) return;
      e.preventDefault();
      if (!main.id) main.id = skip.getAttribute('href').substring(1) || 'main';
      main.setAttribute('tabindex', '-1');
      main.focus();
    });
    return skip;
  });
}

function buildBrand(section) {
  const link = section && [...section.querySelectorAll('a')].find((a) => a.querySelector('img'));
  const brand = el('a', { class: 'nav-brand', href: link ? link.getAttribute('href') : '/', 'aria-label': 'BMW Logo' });
  const imgs = section ? [...section.querySelectorAll('img')] : [];
  imgs.slice(0, 2).forEach((img, i) => {
    const logo = el('img', {
      class: i === 0 ? 'nav-logo nav-logo-light' : 'nav-logo nav-logo-dark',
      src: img.src,
      alt: '',
      role: 'presentation',
      title: img.getAttribute('alt') || 'BMW Logo',
      width: 52,
      height: 52,
    });
    brand.append(logo);
  });
  if (imgs.length === 1) brand.querySelector('.nav-logo').classList.add('nav-logo-dark');
  return brand;
}

function buildColumn(colLi, panelTitle) {
  const col = el('div', { class: 'nav-column' });
  const headingNodes = labelNodes(colLi);
  const headingText = ownText(colLi);
  const panelId = nextId('nav-col');
  const toggle = el('button', {
    type: 'button', class: 'nav-column-toggle', 'aria-expanded': 'false', 'aria-controls': panelId,
  });
  headingNodes.forEach((n) => toggle.append(n));
  const img = toggle.querySelector('img');
  if (img) {
    img.classList.add('nav-column-image');
    img.removeAttribute('width');
    img.removeAttribute('height');
    col.classList.add('nav-column-has-image');
  }
  const heading = el('h3', { class: 'nav-column-heading' }, toggle);
  const links = el('ul', { class: 'nav-column-links' });
  const list = colLi.querySelector(':scope > ul, :scope > ol');
  if (list) {
    [...list.children].forEach((li) => {
      const a = li.querySelector('a');
      const item = el('li', { class: 'nav-column-item' });
      if (a) {
        a.className = 'nav-column-link';
        a.textContent = a.textContent.trim();
        item.append(a);
      } else {
        item.append(el('span', { class: 'nav-column-text' }, li.textContent.trim()));
      }
      links.append(item);
    });
  }
  const back = el('button', { type: 'button', class: 'nav-back', 'aria-label': `Zurück zu ${panelTitle}` }, icon('arrow_chevron_left'));
  const subHeader = el('div', { class: 'nav-panel-header nav-column-header' }, back, img ? img.cloneNode(true) : el('span', { class: 'nav-panel-title' }, headingText));
  const panel = el('div', { class: 'nav-column-panel', id: panelId }, subHeader, links);
  col.append(heading, panel);
  return col;
}

function buildFlyout(label, colsList) {
  const id = nextId('nav-flyout');
  const cols = colsList ? [...colsList.children] : [];
  const content = el('div', { class: `nav-flyout-content nav-cols-${cols.length}` });
  cols.forEach((c) => content.append(buildColumn(c, label)));
  const back = el('button', { type: 'button', class: 'nav-back', 'aria-label': 'Zurück zum Menü' }, icon('arrow_chevron_left'));
  const flyout = el(
    'div',
    {
      class: 'nav-flyout nav-panel', id, role: 'region', 'aria-label': label,
    },
    el('div', { class: 'nav-panel-header' }, back, el('span', { class: 'nav-panel-title' }, label)),
    el('div', { class: 'nav-flyout-body' }, content),
  );
  return flyout;
}

function buildPrimary(section, layerWrapper) {
  const list = el('ul', { class: 'nav-list' });
  const src = section && section.querySelector('ul');
  if (!src) return el('div', { class: 'nav-sections' }, list);
  [...src.children].forEach((li) => {
    const sub = li.querySelector(':scope > ul, :scope > ol');
    const item = el('li', { class: 'nav-item' });
    if (sub) {
      const label = ownText(li);
      const flyout = buildFlyout(label, sub);
      layerWrapper.append(flyout);
      const btn = el(
        'button',
        {
          type: 'button', class: 'nav-link nav-drop', 'aria-expanded': 'false', 'aria-controls': flyout.id,
        },
        el('span', { class: 'nav-label' }, label),
        icon('arrow_chevron_down', 'nav-chevron-desktop'),
        icon('arrow_chevron_right', 'nav-chevron-mobile'),
      );
      item.append(btn);
    } else {
      const a = li.querySelector('a');
      if (!a) return;
      const link = el('a', { class: 'nav-link', href: a.getAttribute('href') }, el('span', { class: 'nav-label' }, a.textContent.trim()));
      item.append(link);
    }
    list.append(item);
  });
  return el('div', { class: 'nav-sections' }, list);
}

function buildButtons(container) {
  const group = el('div', { class: 'nav-panel-buttons' });
  [...container.querySelectorAll(':scope > p')].forEach((p) => {
    const a = p.querySelector('a');
    if (!a || p.textContent.trim() !== a.textContent.trim()) return;
    const primary = !!(p.querySelector('strong') && p.querySelector('em'));
    a.className = `nav-button ${primary ? 'nav-button-primary' : 'nav-button-secondary'}`;
    group.append(a);
    p.remove();
  });
  return group;
}

function buildToolPanel(section, label) {
  const id = nextId('nav-flyout');
  const content = el('div', { class: 'nav-panel-content' });
  [...section.childNodes].forEach((n) => content.append(n));
  const buttons = buildButtons(content);
  const heading = content.querySelector('h1, h2, h3');
  if (heading) heading.classList.add('nav-panel-heading');
  content.querySelectorAll('ul').forEach((ul) => ul.classList.add('nav-panel-benefits'));
  if (buttons.children.length) content.append(buttons);
  const back = el('button', { type: 'button', class: 'nav-back', 'aria-label': 'Zurück zum Menü' }, icon('arrow_chevron_left'));
  return el(
    'div',
    {
      class: 'nav-flyout nav-panel nav-flyout-small', id, role: 'region', 'aria-label': label,
    },
    el('div', { class: 'nav-panel-header' }, back, el('span', { class: 'nav-panel-title' }, label)),
    el('div', { class: 'nav-flyout-body' }, content),
  );
}

function toolParts(li) {
  const a = li.querySelector('a');
  const holder = a || li;
  decorateIconTokens(holder);
  const iconEl = holder.querySelector('.nav-icon');
  const label = holder.textContent.replace(/\s+/g, ' ').trim();
  return { a, iconEl: iconEl || icon('arrow_chevron_right'), label };
}

function buildTools(section, panelSections, mobileLinks, layerWrapper) {
  const list = el('ul', { class: 'nav-tools-list' });
  const src = section && section.querySelector('ul');
  const panels = [...panelSections];
  const mobileHrefs = mobileLinks.map((a) => a.getAttribute('href'));
  if (src) {
    [...src.children].forEach((li) => {
      const { a, iconEl, label } = toolParts(li);
      const item = el('li', { class: 'nav-tool' });
      const hiddenLabel = el('span', { class: 'nav-tool-label' }, label);
      if (a) {
        const href = a.getAttribute('href');
        item.append(el('a', {
          class: 'nav-tool-link', href, title: label, 'aria-label': label,
        }, iconEl, hiddenLabel));
        if (mobileHrefs.includes(href)) item.classList.add('nav-tool-desktop');
      } else {
        const panelSection = panels.shift();
        if (!panelSection) return;
        const panel = buildToolPanel(panelSection, label);
        layerWrapper.append(panel);
        item.append(el('button', {
          type: 'button', class: 'nav-tool-link nav-drop', title: label, 'aria-label': label, 'aria-expanded': 'false', 'aria-controls': panel.id,
        }, iconEl, hiddenLabel));
      }
      list.append(item);
    });
  }
  const hamburger = el('button', {
    type: 'button', class: 'nav-tool-link nav-hamburger', title: 'Navigationsmenü öffnen', 'aria-label': 'Navigationsmenü öffnen', 'aria-expanded': 'false', 'aria-controls': 'nav',
  }, icon('menu'), el('span', { class: 'nav-tool-label' }, 'Navigationsmenü öffnen'));
  list.append(el('li', { class: 'nav-tool nav-tool-mobile' }, hamburger));
  return el('div', { class: 'nav-tools' }, list);
}

function buildMobileBar(brand, mobileLinks) {
  const list = el('ul', { class: 'nav-tools-list' });
  mobileLinks.forEach((a) => {
    const { iconEl, label } = toolParts(a.parentElement);
    list.append(el('li', { class: 'nav-tool' }, el('a', {
      class: 'nav-tool-link', href: a.getAttribute('href'), title: label, 'aria-label': label,
    }, iconEl, el('span', { class: 'nav-tool-label' }, label))));
  });
  const close = el('button', {
    type: 'button', class: 'nav-tool-link nav-close', title: 'Navigationsmenü schließen', 'aria-label': 'Navigationsmenü schließen',
  }, icon('close'), el('span', { class: 'nav-tool-label' }, 'Navigationsmenü schließen'));
  list.append(el('li', { class: 'nav-tool' }, close));
  const logo = brand.cloneNode(true);
  logo.querySelectorAll('.nav-logo-light').forEach((l) => l.remove());
  return el('div', { class: 'nav-mobile-bar' }, logo, el('div', { class: 'nav-tools' }, list));
}

/* ------------------------------------------------------------------ My BMW data */

async function hydrateLoginPanel(panel) {
  if (!panel) return;
  try {
    const sheets = await fetchSheet(LOGIN_DATA_PATH);
    // only the logged-out state (login/register) is rendered: the site has no BMW session
    const data = Object.fromEntries((sheets.labels || [])
      .filter((r) => r.key)
      .map((r) => [r.key.trim(), (r.value || '').trim()]));
    data.loginBenefits = (sheets.benefits || []).map((r) => (r.text || '').trim()).filter(Boolean);
    const content = panel.querySelector('.nav-panel-content');
    const abs = (p) => (p && p.startsWith('/') ? `${BMW_ORIGIN}${p}` : p);
    const heading = content.querySelector('.nav-panel-heading');
    if (heading && data.loginHeadline) heading.textContent = data.loginHeadline;
    const sub = content.querySelector('.nav-panel-heading + p');
    if (sub && data.loginSubHeadline) sub.textContent = data.loginSubHeadline;
    const benefits = content.querySelector('.nav-panel-benefits');
    if (benefits && data.loginBenefits.length) {
      benefits.replaceChildren(...data.loginBenefits.map((b) => el('li', {}, b)));
    }
    const [login, register] = content.querySelectorAll('.nav-button');
    if (login && data.loginButtonText) {
      login.textContent = data.loginButtonText;
      if (data.loginUrl) login.href = abs(data.loginUrl);
    }
    if (register && data.registerButtonText) {
      register.textContent = data.registerButtonText;
      if (data.registerUrl) register.href = abs(data.registerUrl);
    }
  } catch (e) {
    // keep the authored fallback content
  }
}

/* ------------------------------------------------------------------ behaviour */

function setupBehaviour(block, parts) {
  const {
    wrapper, nav, layer, sections,
  } = parts;
  const triggers = () => [...nav.querySelectorAll('.nav-drop')];
  const flyoutFor = (btn) => nav.querySelector(`#${btn.getAttribute('aria-controls')}`);
  const hamburger = nav.querySelector('.nav-hamburger');

  const closeColumns = () => {
    nav.querySelectorAll('.nav-column-toggle[aria-expanded="true"]').forEach((t) => {
      t.setAttribute('aria-expanded', 'false');
      t.closest('.nav-column').classList.remove('is-open');
    });
  };

  const closeFlyouts = () => {
    triggers().forEach((t) => {
      t.setAttribute('aria-expanded', 'false');
      t.classList.remove('is-active');
      const f = flyoutFor(t);
      if (f) f.classList.remove('is-open');
    });
    closeColumns();
    layer.classList.remove('is-open');
    sections.classList.remove('is-out');
  };

  const menuOpen = () => wrapper.classList.contains('is-menu-open');

  const updateState = () => {
    const anyFlyout = triggers().some((t) => t.classList.contains('is-active'));
    wrapper.classList.toggle('is-open', anyFlyout || menuOpen());
    document.documentElement.style.overflow = menuOpen() && !DESKTOP.matches ? 'hidden' : '';
  };

  // slide-ins: display first, move on the next frame so the CSS transition runs
  const nextFrame = (fn) => requestAnimationFrame(() => requestAnimationFrame(fn));

  const openFlyout = (btn) => {
    closeFlyouts();
    const f = flyoutFor(btn);
    if (!f) return;
    btn.setAttribute('aria-expanded', 'true');
    btn.classList.add('is-active');
    f.classList.add('is-open');
    f.querySelector('.nav-flyout-body').scrollTop = 0;
    if (DESKTOP.matches) {
      layer.classList.add('is-open');
    } else {
      if (!menuOpen()) wrapper.classList.add('is-menu-open', 'is-menu-visible', 'is-tool-open');
      sections.classList.add('is-out');
      nextFrame(() => { if (btn.classList.contains('is-active')) layer.classList.add('is-open'); });
    }
    updateState();
  };

  const toggleMenu = (force) => {
    const open = typeof force === 'boolean' ? force : !menuOpen();
    closeFlyouts();
    wrapper.classList.toggle('is-menu-open', open);
    wrapper.classList.remove('is-tool-open', 'is-menu-visible');
    if (open) nextFrame(() => { if (menuOpen()) wrapper.classList.add('is-menu-visible'); });
    if (hamburger) hamburger.setAttribute('aria-expanded', String(open));
    updateState();
  };

  triggers().forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      // state lives in the class, not in aria-expanded (assistive tech / tools may touch it)
      if (btn.classList.contains('is-active')) {
        if (!DESKTOP.matches && wrapper.classList.contains('is-tool-open')) {
          toggleMenu(false);
          return;
        }
        closeFlyouts();
        updateState();
      } else {
        openFlyout(btn);
      }
    });
  });

  // back buttons: level 3 -> level 2, level 2 -> main menu
  nav.querySelectorAll('.nav-back').forEach((back) => {
    back.addEventListener('click', (e) => {
      e.stopPropagation();
      const col = back.closest('.nav-column');
      if (col) {
        closeColumns();
        return;
      }
      if (wrapper.classList.contains('is-tool-open')) {
        toggleMenu(false);
        return;
      }
      closeFlyouts();
      updateState();
    });
  });

  // column headings open a level-3 panel on small screens only
  nav.querySelectorAll('.nav-column-toggle').forEach((toggle) => {
    toggle.addEventListener('click', (e) => {
      if (TABLET.matches) return;
      e.stopPropagation();
      const col = toggle.closest('.nav-column');
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      closeColumns();
      toggle.setAttribute('aria-expanded', String(open));
      col.classList.toggle('is-open', open);
    });
  });

  if (hamburger) hamburger.addEventListener('click', (e) => { e.stopPropagation(); toggleMenu(true); });
  nav.querySelectorAll('.nav-close').forEach((c) => c.addEventListener('click', (e) => { e.stopPropagation(); toggleMenu(false); }));

  // click outside the open panel closes it (desktop); the backdrop is part of the layer
  document.addEventListener('click', (e) => {
    if (!DESKTOP.matches) return;
    if (!layer.classList.contains('is-open')) return;
    if (e.target.closest('.nav-flyout-wrapper') || e.target.closest('.nav-drop')) return;
    closeFlyouts();
    updateState();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (layer.classList.contains('is-open') && DESKTOP.matches) {
      const active = nav.querySelector('.nav-drop.is-active');
      closeFlyouts();
      updateState();
      if (active) active.focus();
    }
  });

  // viewport changes: reset every open state when crossing the desktop breakpoint
  const reset = () => {
    closeFlyouts();
    wrapper.classList.remove('is-menu-open', 'is-menu-visible', 'is-tool-open');
    if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
    updateState();
  };
  DESKTOP.addEventListener('change', reset);
  TABLET.addEventListener('change', closeColumns);
  block.navReset = reset;
}

/**
 * loads and decorates the header
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const fragment = await fetchNavFragment();
  block.textContent = '';
  if (!fragment) return;

  const sectionsSrc = [...fragment.children].filter((c) => c.tagName === 'DIV');
  const [brandSec, primarySec, toolsSec, ...rest] = sectionsSrc;
  const panelSections = rest.filter((s) => /^H[1-6]$/.test((s.firstElementChild || {}).tagName || ''));
  const mobileLinks = rest.filter((s) => !panelSections.includes(s)).flatMap((s) => [...s.querySelectorAll('a')]);

  const layerWrapper = el('div', { class: 'nav-flyout-wrapper' });
  const layer = el('div', { class: 'nav-flyout-layer' }, layerWrapper);

  const brand = buildBrand(brandSec);
  const sections = buildPrimary(primarySec, layerWrapper);
  const tools = buildTools(toolsSec, panelSections, mobileLinks, layerWrapper);
  const mobileBar = buildMobileBar(brand, mobileLinks);

  const bar = el('div', { class: 'nav-bar' }, brand, sections, tools);
  const border = el('div', { class: 'nav-border' });
  const nav = el('nav', { id: 'nav', 'aria-label': 'Hauptnavigation' }, bar, border, mobileBar, layer);
  const style = headerStyle();
  const wrapper = el('div', { class: `nav-wrapper nav-${style}` }, ...buildSkipLinks(brandSec), nav);
  block.append(wrapper);
  block.closest('header')?.classList.add(`header-${style}`);

  setupBehaviour(block, {
    wrapper, nav, layer, sections,
  });
  hydrateLoginPanel(layerWrapper.querySelector('.nav-flyout-small'));
}
