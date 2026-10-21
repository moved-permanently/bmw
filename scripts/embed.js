/*
 * The site inside another page via <aem-embed> (https://www.aem.live/docs/aem-embed): the
 * component sets window.hlx.suppressLoadPage, imports scripts.js from the site origin and renders
 * blocks into its shadow root. Paths then resolve against the host page, so code and content URLs
 * are made absolute against the origin that served this module, and stylesheets go into the
 * shadow roots instead of the host's <head>.
 */

export function isEmbedded() {
  return !!(window.hlx && window.hlx.suppressLoadPage);
}

/** Site content path ("/de/data/x.json"), absolute when embedded. */
export function siteUrl(path) {
  return isEmbedded() ? new URL(path, import.meta.url).href : path;
}

/** Code path below the code base ("/blocks/x/x.css"), absolute when embedded. */
export function codeUrl(path) {
  if (isEmbedded()) return new URL(`..${path}`, import.meta.url).href;
  return `${(window.hlx && window.hlx.codeBasePath) || ''}${path}`;
}

const pending = new WeakMap();

function addStylesheet(target, href) {
  if (!pending.has(target)) pending.set(target, new Map());
  const loads = pending.get(target);
  if (loads.has(href)) return loads.get(href);
  if (target.querySelector(`link[href="${href}"]`)) return Promise.resolve();
  const load = new Promise((resolve) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.onload = () => resolve();
    link.onerror = () => resolve();
    target.append(link);
  });
  loads.set(href, load);
  return load;
}

/**
 * Loads a stylesheet once into the document head, or into the shadow root of every <aem-embed>
 * when embedded. Resolves when it loaded or failed.
 */
export function loadStyles(href) {
  const targets = isEmbedded()
    ? [...document.querySelectorAll('aem-embed')].map((e) => e.shadowRoot).filter(Boolean)
    : [document.head];
  return Promise.all(targets.map((t) => addStylesheet(t, href)));
}

/**
 * Loads a block that a block creates itself (aem.js loadBlock), from the site and with its
 * stylesheet in the shadow roots when embedded.
 */
export async function loadNestedBlock(block) {
  if (!isEmbedded()) {
    const { loadBlock } = await import('./aem.js');
    return loadBlock(block);
  }
  const status = block.dataset.blockStatus;
  if (status === 'loading' || status === 'loaded') return block;
  block.dataset.blockStatus = 'loading';
  const { blockName } = block.dataset;
  try {
    const [, mod] = await Promise.all([
      loadStyles(codeUrl(`/blocks/${blockName}/${blockName}.css`)),
      import(codeUrl(`/blocks/${blockName}/${blockName}.js`)),
    ]);
    if (mod.default) await mod.default(block);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`failed to load block ${blockName}`, error);
  }
  block.dataset.blockStatus = 'loaded';
  return block;
}
