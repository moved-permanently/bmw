/**
 * BMW section runtime:
 *  - section metadata (style → classes, other keys → data-*), incl. spacing/center/dark/grey
 *  - visually hidden page title (home: the H1 only exists for screen readers on the source)
 *  - default-content text links with chevron + button groups
 *  - "layer" sections → BMW new-teaser-modal popover, opened by links to #<layer id>
 *
 * Call decorateBmwSections(main) at the end of decorateMain (after decorateButtons).
 */
import { readBlockConfig, toClassName, toCamelCase } from './aem.js';

const LAYER_OPEN_CLASS = 'bmw-layer-open';
const ANIMATION_MS = 300;
const layers = new Map();
let lastTrigger = null;
let listenersBound = false;

/**
 * Applies section metadata tables (whether or not decorateBlocks already ran) and removes them.
 * @param {Element} main
 */
function applySectionMetadata(main) {
  main.querySelectorAll(':scope .section .section-metadata').forEach((meta) => {
    const section = meta.closest('.section');
    const config = readBlockConfig(meta);
    Object.entries(config).forEach(([key, value]) => {
      const val = Array.isArray(value) ? value.join(',') : String(value || '');
      if (key === 'style') {
        val.split(',')
          .map((s) => toClassName(s.trim()))
          .filter(Boolean)
          .forEach((cls) => section.classList.add(cls));
      } else if (val) {
        section.dataset[toCamelCase(key)] = val.trim();
      }
    });
    const wrapper = meta.parentElement;
    meta.remove();
    if (wrapper && wrapper !== section && !wrapper.children.length) wrapper.remove();
    section.classList.remove('section-metadata-container');
  });
}

/**
 * The source home page renders its H1 for screen readers only (.a11y-only-screen-reader):
 * a standalone H1 that opens the page and is directly followed by the stage headline / hero.
 * @param {Element} main
 */
function hidePageTitle(main) {
  const first = main.querySelector(':scope > .section');
  const wrapper = first && first.firstElementChild;
  if (!wrapper || !wrapper.classList.contains('default-content-wrapper')) return;
  const h1 = wrapper.firstElementChild;
  if (!h1 || h1.tagName !== 'H1') return;
  const next = h1.nextElementSibling;
  const nextWrapper = wrapper.nextElementSibling;
  const followedByHeading = next && /^H[1-3]$/.test(next.tagName);
  const followedByHero = !next && nextWrapper
    && [...nextWrapper.classList].some((c) => /^hero.*-wrapper$/.test(c));
  if (followedByHeading || followedByHero) h1.classList.add('visually-hidden');
}

/**
 * Whether a paragraph only holds a single link (optionally wrapped in strong/em).
 * @param {Element} p
 * @returns {HTMLAnchorElement|null}
 */
function soleLink(p) {
  const links = p.querySelectorAll('a[href]');
  if (links.length !== 1) return null;
  const a = links[0];
  if (a.querySelector('picture, img')) return null;
  if (p.textContent.trim() !== a.textContent.trim()) return null;
  return a;
}

/**
 * Plain stand-alone links become chevron text links; consecutive button/link paragraphs are
 * grouped into div.button-group (source button containers).
 * @param {Element} main
 */
function decorateDefaultContent(main) {
  main.querySelectorAll('.default-content-wrapper').forEach((wrapper) => {
    let group = null;
    [...wrapper.children].forEach((el) => {
      const link = el.tagName === 'P' ? soleLink(el) : null;
      if (!link) {
        group = null;
        return;
      }
      if (!link.classList.contains('button')) link.classList.add('link-arrow');
      if (!group) {
        group = document.createElement('div');
        group.className = 'button-group';
        el.before(group);
      }
      group.append(el);
    });
  });
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function closeLayer(dialog) {
  if (!dialog.open || dialog.classList.contains('is-closing')) return;
  const finish = () => {
    dialog.classList.remove('is-open', 'is-closing');
    dialog.close();
    if (![...layers.values()].some((d) => d.open)) {
      document.documentElement.classList.remove(LAYER_OPEN_CLASS);
    }
    if (lastTrigger && document.contains(lastTrigger)) lastTrigger.focus({ preventScroll: true });
    lastTrigger = null;
  };
  if (prefersReducedMotion()) {
    finish();
    return;
  }
  dialog.classList.add('is-closing');
  setTimeout(finish, ANIMATION_MS);
}

function openLayer(dialog, trigger) {
  if (dialog.open) return;
  lastTrigger = trigger || document.activeElement;
  document.documentElement.classList.add(LAYER_OPEN_CLASS);
  dialog.classList.remove('is-closing');
  dialog.classList.add('is-open');
  const wrapper = dialog.querySelector('.bmw-layer-wrapper');
  if (wrapper) wrapper.scrollTop = 0;
  dialog.showModal();
  const close = dialog.querySelector('.bmw-layer-close');
  if (close) close.focus({ preventScroll: true });
}

/**
 * Finds the layer dialog for a link, if it points at a layer on the current page.
 * @param {HTMLAnchorElement} a
 * @returns {HTMLDialogElement|null}
 */
function layerForLink(a) {
  const href = a.getAttribute('href') || '';
  const hashIndex = href.indexOf('#');
  if (hashIndex < 0) return null;
  const id = decodeURIComponent(href.substring(hashIndex + 1));
  if (!layers.has(id)) return null;
  if (hashIndex > 0) {
    // allow absolute links to the same page
    try {
      const url = new URL(href, window.location.href);
      if (url.pathname !== window.location.pathname) return null;
    } catch {
      return null;
    }
  }
  return layers.get(id);
}

function bindListeners() {
  if (listenersBound) return;
  listenersBound = true;
  document.addEventListener('click', (e) => {
    const a = e.target.closest && e.target.closest('a[href*="#"]');
    if (!a) return;
    const dialog = layerForLink(a);
    if (!dialog) return;
    e.preventDefault();
    openLayer(dialog, a);
  });
}

/**
 * Builds the dialog around a layer section (kept inside <main> so its blocks still load).
 * @param {Element} section
 * @param {number} index
 */
function buildLayer(section, index) {
  const id = section.dataset.id || `layer-${index + 1}`;
  const title = section.dataset.title || '';

  const dialog = document.createElement('dialog');
  dialog.className = 'bmw-layer';
  dialog.dataset.layerId = id;
  if (title) dialog.setAttribute('aria-label', title);

  const wrapper = document.createElement('div');
  wrapper.className = 'bmw-layer-wrapper';
  const content = document.createElement('div');
  content.className = 'bmw-layer-content';

  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'bmw-layer-close';
  close.setAttribute('aria-label', 'Schließen');
  const icon = document.createElement('span');
  icon.className = 'bmw-icon';
  icon.dataset.icon = 'close';
  icon.setAttribute('aria-hidden', 'true');
  icon.textContent = 'close';
  close.append(icon);

  const layerMain = document.createElement('div');
  layerMain.className = 'bmw-layer-main';

  section.replaceWith(dialog);
  layerMain.append(section);
  content.append(close, layerMain);
  wrapper.append(content);
  dialog.append(wrapper);

  close.addEventListener('click', () => closeLayer(dialog));
  dialog.addEventListener('cancel', (e) => {
    // Escape: animate out instead of closing instantly
    e.preventDefault();
    closeLayer(dialog);
  });
  dialog.addEventListener('click', (e) => {
    // click on the backdrop / around the white content box
    if (e.target === dialog || e.target === wrapper) closeLayer(dialog);
  });

  layers.set(id, dialog);
}

/**
 * Opens a layer when the page is loaded with its hash (e.g. /page#layer-1).
 */
function openLayerFromHash() {
  const id = decodeURIComponent(window.location.hash.substring(1));
  if (!id || !layers.has(id)) return;
  const open = () => openLayer(layers.get(id));
  if (document.readyState === 'complete') setTimeout(open, 0);
  else window.addEventListener('load', open, { once: true });
}

/**
 * Decorates BMW sections, default content and layers.
 * @param {Element} main
 */
// eslint-disable-next-line import/prefer-default-export
export function decorateBmwSections(main) {
  if (!main) return;
  applySectionMetadata(main);
  hidePageTitle(main);
  decorateDefaultContent(main);

  const layerSections = [...main.querySelectorAll(':scope > .section.layer')];
  layerSections.forEach((section) => buildLayer(section, layers.size));
  if (layerSections.length) {
    bindListeners();
    openLayerFromHash();
  }
}
