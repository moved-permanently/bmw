/* global globalThis */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const STORAGE_KEY = 'bmw-showcase-acknowledged';
let caseId = 0;

function setup(t, {
  pathname = '/de/home', search = '', acknowledged = false, framed = false,
} = {}) {
  const elements = [];
  const links = [];
  const storage = new Map(acknowledged ? [[STORAGE_KEY, 'true']] : []);
  const body = {
    append(el) { elements.push(el); },
  };
  globalThis.window = {
    location: { pathname, search },
    hlx: { codeBasePath: '' },
    localStorage: {
      getItem: (key) => storage.get(key) || null,
      setItem: (key, value) => storage.set(key, value),
    },
  };
  window.self = window;
  window.top = framed ? {} : window;
  globalThis.document = {
    head: {
      append(el) { links.push(el); el.onload?.(); },
    },
    body,
    getElementById: (id) => elements.find((el) => el.id === id) || null,
    createElement(tag) {
      const el = {
        tagName: tag.toUpperCase(),
        children: [],
        attributes: {},
        listeners: {},
        append(...children) { this.children.push(...children); },
        setAttribute(name, value) { this.attributes[name] = value; },
        addEventListener(name, fn) { this.listeners[name] = fn; },
        showModal() { this.open = true; },
        close() { this.open = false; this.listeners.close?.(); },
        remove() { elements.splice(elements.indexOf(this), 1); },
      };
      return el;
    },
  };
  t.after(() => {
    delete globalThis.window;
    delete globalThis.document;
  });
  return { elements, links, storage };
}

async function loadNotice() {
  caseId += 1;
  const { default: showNotice } = await import(`../../scripts/bmw-showcase-notice.js?case=${caseId}`);
  return showNotice;
}

test('the notice module is only imported in the delayed phase after 3.5 seconds', async () => {
  const js = await readFile(new URL('../../scripts/scripts.js', import.meta.url), 'utf8');
  const delayed = js.slice(js.indexOf('function loadDelayed()'), js.indexOf('async function loadPage()'));
  assert.match(delayed, /setTimeout\(\(\) => \{\s*import\('\.\/bmw-showcase-notice\.js'\)\.then\(\(m\) => m\.default\(\)\);\s*\}, 3500\)/);
  assert.equal(js.match(/import\([^\n]*bmw-showcase-notice/g)?.length, 1);
});

test('a visitor sees one labelled modal with an explicit acknowledgement', async (t) => {
  const { elements, links } = setup(t);
  const showNotice = await loadNotice();
  await showNotice();
  await showNotice();
  assert.equal(elements.length, 1);
  const [dialog] = elements;
  assert.equal(dialog.tagName, 'DIALOG');
  assert.equal(dialog.open, true);
  assert.equal(dialog.className, 'bmw-showcase-notice');
  assert.equal(dialog.attributes['aria-labelledby'], dialog.children[0].id);
  assert.equal(dialog.attributes['aria-describedby'], dialog.children[1].id);
  assert.match(dialog.children[1].textContent, /technical showcase, not an official BMW website/);
  assert.equal(dialog.children[2].textContent, 'I understand');
  assert.equal(links.length, 1);
  assert.equal(links[0].href, '/scripts/bmw-showcase-notice.css');
});

test('acknowledgement removes the modal and persists across a new page', async (t) => {
  const { elements, links, storage } = setup(t);
  await (await loadNotice())();
  elements[0].children[2].listeners.click();
  assert.equal(elements.length, 0);
  assert.equal(storage.get(STORAGE_KEY), 'true');
  await (await loadNotice())();
  assert.equal(elements.length, 0);
  assert.equal(links.length, 1, 'no further stylesheet request');
});

test('Escape does not silently acknowledge or dismiss the notice', async (t) => {
  const { elements, storage } = setup(t);
  await (await loadNotice())();
  let prevented = false;
  elements[0].listeners.cancel({ preventDefault: () => { prevented = true; } });
  assert.equal(prevented, true);
  assert.equal(elements[0].open, true);
  assert.equal(storage.has(STORAGE_KEY), false);
});

[
  { pathname: '/library/blocks/stage' },
  { pathname: '/library/templates/news-story' },
  { search: '?rum=off&consent=disabled&quick-edit=on&controller=parent' },
  { search: '?quick-edit=main' },
  { search: '?controller=parent' },
  { framed: true },
  { pathname: '/tools/aida/showcase/index.html' },
].forEach((location) => {
  test(`no visitor notice or CSS in authoring context ${JSON.stringify(location)}`, async (t) => {
    const { elements, links } = setup(t, location);
    await (await loadNotice())();
    assert.deepEqual(elements, []);
    assert.deepEqual(links, []);
  });
});

test('disabling cookie consent on a visitor page does not disable the disclaimer', async (t) => {
  const { elements } = setup(t, { search: '?consent=disabled' });
  await (await loadNotice())();
  assert.equal(elements.length, 1);
});

test('blocked storage does not prevent displaying or acknowledging the notice', async (t) => {
  const { elements } = setup(t);
  window.localStorage = {
    getItem() { throw new Error('storage blocked'); },
    setItem() { throw new Error('storage blocked'); },
  };
  const showNotice = await loadNotice();
  await showNotice();
  elements[0].children[2].listeners.click();
  assert.equal(elements.length, 0);
  await showNotice();
  assert.equal(elements.length, 0, 'no repeated notice within the same page');
});

test('waits for CSS before showing and rechecks acknowledgement after the request', async (t) => {
  const { elements, links, storage } = setup(t);
  document.head.append = (el) => links.push(el);
  const showing = (await loadNotice())();
  assert.equal(elements.length, 0);
  storage.set(STORAGE_KEY, 'true');
  links[0].onload();
  await showing;
  assert.equal(elements.length, 0);
});

test('does not show if the page becomes an authoring frame while CSS loads', async (t) => {
  const { elements, links } = setup(t);
  document.head.append = (el) => links.push(el);
  const showing = (await loadNotice())();
  window.location.search = '?quick-edit=on';
  links[0].onload();
  await showing;
  assert.equal(elements.length, 0);
});

test('the modal is fixed, viewport-centered and has a page-wide backdrop', async () => {
  const css = await readFile(new URL('../../scripts/bmw-showcase-notice.css', import.meta.url), 'utf8');
  assert.match(css, /\.bmw-showcase-notice\s*\{[^}]*position:\s*fixed;/);
  assert.match(css, /\.bmw-showcase-notice\s*\{[^}]*inset:\s*0;/);
  assert.match(css, /\.bmw-showcase-notice\s*\{[^}]*margin:\s*auto;/);
  assert.match(css, /\.bmw-showcase-notice::backdrop\s*\{/);
});
