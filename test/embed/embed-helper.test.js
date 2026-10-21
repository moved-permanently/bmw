/* global globalThis */
import { test } from 'node:test';
import assert from 'node:assert/strict';

const MODULE = new URL('../../scripts/embed.js', import.meta.url);
let caseId = 0;

function link() {
  return {
    rel: '', href: '', onload: null, onerror: null,
  };
}

/** A node that records appended links and finds them like querySelector('link[href="…"]'). */
function container() {
  const links = [];
  return {
    links,
    append(el) { links.push(el); },
    querySelector(sel) {
      const m = sel.match(/^link\[href="(.*)"\]$/);
      return (m && links.find((l) => l.href === m[1])) || null;
    },
  };
}

function setup(t, { embedded = false, codeBasePath = '', embeds = 0 } = {}) {
  const head = container();
  const roots = Array.from({ length: embeds }, container);
  globalThis.window = { hlx: { codeBasePath, ...(embedded ? { suppressLoadPage: true } : {}) } };
  globalThis.document = {
    head,
    createElement: () => link(),
    querySelectorAll: (sel) => (sel === 'aem-embed' ? roots.map((shadowRoot) => ({ shadowRoot })) : []),
  };
  t.after(() => {
    delete globalThis.window;
    delete globalThis.document;
  });
  return { head, roots };
}

async function load() {
  caseId += 1;
  return import(`${MODULE.href}?case=${caseId}`);
}

test('on the site: paths stay as they are', async (t) => {
  setup(t, { codeBasePath: '/sub' });
  const { isEmbedded, siteUrl, codeUrl } = await load();
  assert.equal(isEmbedded(), false);
  assert.equal(siteUrl('/de/data/x.json'), '/de/data/x.json');
  assert.equal(codeUrl('/scripts/bmw-media.css'), '/sub/scripts/bmw-media.css');
});

test('embedded: content and code resolve against the site that served scripts/embed.js', async (t) => {
  setup(t, { embedded: true });
  const { isEmbedded, siteUrl, codeUrl } = await load();
  assert.equal(isEmbedded(), true);
  assert.equal(siteUrl('/de/data/x.json'), new URL('/de/data/x.json', MODULE).href);
  assert.equal(codeUrl('/blocks/video/video.css'), new URL('../blocks/video/video.css', MODULE).href);
});

test('on the site: loadStyles adds one link to the document head and waits for it', async (t) => {
  const { head } = setup(t);
  const { loadStyles } = await load();
  let done = false;
  const first = loadStyles('/scripts/bmw-media.css').then(() => { done = true; });
  const second = loadStyles('/scripts/bmw-media.css');
  assert.equal(head.links.length, 1);
  assert.equal(head.links[0].rel, 'stylesheet');
  assert.equal(head.links[0].href, '/scripts/bmw-media.css');
  await Promise.resolve();
  assert.equal(done, false, 'pending until the stylesheet loaded');
  head.links[0].onload();
  await Promise.all([first, second]);
  assert.equal(done, true);
});

test('on the site: a stylesheet that fails still resolves', async (t) => {
  const { head } = setup(t);
  const { loadStyles } = await load();
  const p = loadStyles('/x.css');
  head.links[0].onerror();
  await p;
});

test('embedded: loadStyles adds the link to every aem-embed shadow root, not the host head', async (t) => {
  const { head, roots } = setup(t, { embedded: true, embeds: 2 });
  const { loadStyles } = await load();
  const p = loadStyles('https://site.example/scripts/bmw-media.css');
  loadStyles('https://site.example/scripts/bmw-media.css');
  assert.equal(head.links.length, 0);
  assert.deepEqual(roots.map((r) => r.links.map((l) => l.href)), [
    ['https://site.example/scripts/bmw-media.css'],
    ['https://site.example/scripts/bmw-media.css'],
  ]);
  roots.forEach((r) => r.links[0].onload());
  await p;
});

test('embedded: an aem-embed added later gets the stylesheet on the next call', async (t) => {
  const { roots } = setup(t, { embedded: true, embeds: 1 });
  const { loadStyles } = await load();
  loadStyles('https://site.example/a.css');
  roots[0].links[0].onload();
  const later = container();
  roots.push(later);
  const p = loadStyles('https://site.example/a.css');
  assert.equal(roots[0].links.length, 1);
  assert.equal(later.links.length, 1);
  later.links[0].onload();
  await p;
});
