/* eslint-disable max-len */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import {
  parseBinding, marketForPath, valuesFromSheet, staleBindings, dataRootForPath, findBindings,
} from '../../scripts/aida-wdh.js';

const STORAGE_KEY = 'bmw-wdh-check-collapsed';
const source = readFileSync(new URL('../../scripts/aida.js', import.meta.url), 'utf8')
  .replace(/^import[\s\S]*?from '[^']+';\n/gm, '')
  .replace('export async function checkWdhValues', 'async function checkWdhValues');

function element(tag) {
  const el = {
    tagName: tag.toUpperCase(), className: '', children: [], attributes: {}, listeners: {},
    hidden: false, textContent: '',
    set innerHTML(html) {
      this.children = [...html.matchAll(/<(button|p|div|span|code|strong|em)\b([^>]*)>/g)].map(([, name, attrs]) => {
        const child = element(name);
        [...attrs.matchAll(/([\w-]+)="([^"]*)"/g)].forEach(([, key, value]) => child.setAttribute(key, value));
        return child;
      });
    },
    setAttribute(name, value) {
      this.attributes[name] = String(value);
      if (name === 'class') this.className = value;
    },
    getAttribute(name) { return this.attributes[name] ?? null; },
    querySelector(selector) {
      return this.children.find((child) => (selector.startsWith('.')
        ? child.classList.contains(selector.slice(1)) : child.tagName === selector.toUpperCase())) || null;
    },
    append(...children) { this.children.push(...children); },
    prepend(...children) { this.children.unshift(...children); },
    replaceChildren(...children) { this.children = children; },
    addEventListener(name, fn) { this.listeners[name] = fn; },
    remove() { this.removed = true; },
  };
  el.classList = {
    contains: (name) => el.className.split(' ').includes(name),
    toggle(name, force = !el.classList.contains(name)) {
      el.className = [...el.className.split(' ').filter((c) => c && c !== name), ...(force ? [name] : [])].join(' ');
      return force;
    },
    add: (name) => el.classList.toggle(name, true),
    remove: (name) => el.classList.toggle(name, false),
  };
  return el;
}

function setup({ saved, text = '627 km', blocked = false } = {}) {
  const panels = [];
  const storage = new Map(saved === undefined ? [] : [[STORAGE_KEY, saved]]);
  const sheet = { values: [{ key: '61HG.electricRange', value: '627', unit: 'km' }] };
  const check = runInNewContext(`${source}\ncheckWdhValues;`, {
    URLSearchParams,
    parseBinding, marketForPath, valuesFromSheet, staleBindings, dataRootForPath, findBindings,
    loadCSS: async () => {},
    fetchSheet: async () => sheet,
    window: {
      location: { pathname: '/aida/showcase/de/de/i5' },
      hlx: { codeBasePath: '' },
      localStorage: {
        getItem(key) {
          if (blocked) throw new Error('storage blocked');
          return storage.get(key) ?? null;
        },
        setItem(key, value) {
          if (blocked) throw new Error('storage blocked');
          storage.set(key, value);
        },
      },
    },
    document: {
      createElement: element,
      querySelectorAll: (selector) => (selector === 'aside.wdh-check' ? panels.filter((p) => !p.removed) : []),
      body: { append: (panel) => panels.push(panel) },
    },
  });
  const session = {
    generation: 1, isCurrent: () => true,
    bindings: [{ href: '/aida/showcase/data/wdh-de.json#61HG.electricRange', text }],
  };
  const render = async () => { await check(session); return panels.at(-1); };
  return { render, storage, sheet };
}

function toggleOf(panel) {
  const toggle = panel.querySelector('.wdh-check-toggle');
  assert.ok(toggle, 'the panel has a collapse/expand button');
  return toggle;
}

test('starts expanded with a minus toggle, an accessible label, and a match indicator', async () => {
  const { render, storage } = setup();
  const panel = await render();
  const toggle = toggleOf(panel);
  assert.equal(toggle.textContent, '−');
  assert.equal(toggle.getAttribute('aria-label'), 'Collapse WDH check');
  assert.equal(toggle.getAttribute('aria-expanded'), 'true');
  assert.equal(panel.querySelector('.wdh-check-body').hidden, false);
  const status = panel.querySelector('.wdh-check-status');
  assert.ok(status, 'the panel has a status indicator outside its body');
  assert.equal(status.textContent, '✅');
  assert.equal(status.getAttribute('aria-label'), 'All 1 values match WDH (DE)');
  assert.equal(storage.size, 0, 'only user toggles write the preference');
});

test('minus collapses, plus expands, and both states persist across new renders', async () => {
  const { render, storage } = setup();
  let panel = await render();
  toggleOf(panel).listeners.click();
  assert.equal(panel.querySelector('.wdh-check-body').hidden, true);
  assert.equal(panel.classList.contains('is-collapsed'), true);
  assert.equal(toggleOf(panel).textContent, '+');
  assert.equal(toggleOf(panel).getAttribute('aria-label'), 'Expand WDH check');
  assert.equal(toggleOf(panel).getAttribute('aria-expanded'), 'false');
  assert.equal(storage.get(STORAGE_KEY), 'true');
  panel = await render();
  assert.equal(panel.querySelector('.wdh-check-body').hidden, true);
  assert.equal(panel.querySelector('.wdh-check-status').textContent, '✅');
  toggleOf(panel).listeners.click();
  assert.equal(panel.querySelector('.wdh-check-body').hidden, false);
  assert.equal(toggleOf(panel).textContent, '−');
  assert.equal(storage.get(STORAGE_KEY), 'false');
  panel = await render();
  assert.equal(panel.querySelector('.wdh-check-body').hidden, false);
});

test('a saved collapsed panel still shows a warning for stale values', async () => {
  const { render } = setup({ saved: 'true', text: 'old value' });
  const panel = await render();
  assert.equal(panel.querySelector('.wdh-check-body').hidden, true);
  assert.equal(toggleOf(panel).textContent, '+');
  const status = panel.querySelector('.wdh-check-status');
  assert.equal(status.textContent, '⚠️');
  assert.equal(status.getAttribute('aria-label'), '1 of 1 values need an update (DE)');
});

test('checking again updates the status without expanding the panel', async () => {
  const { render, sheet } = setup({ saved: 'true' });
  const panel = await render();
  assert.equal(panel.querySelector('.wdh-check-status')?.textContent, '✅');
  sheet.values[0].value = '640';
  await panel.querySelector('.wdh-check-reload').listeners.click();
  assert.equal(panel.querySelector('.wdh-check-status').textContent, '⚠️');
  assert.equal(panel.querySelector('.wdh-check-body').hidden, true);
  assert.equal(toggleOf(panel).textContent, '+');
  sheet.values[0].value = '627';
  await panel.querySelector('.wdh-check-reload').listeners.click();
  assert.equal(panel.querySelector('.wdh-check-status').textContent, '✅');
});

test('blocked localStorage does not break the panel or its toggle', async () => {
  const { render } = setup({ blocked: true });
  const panel = await render();
  const toggle = toggleOf(panel);
  toggle.listeners.click();
  assert.equal(panel.querySelector('.wdh-check-body').hidden, true);
  toggle.listeners.click();
  assert.equal(panel.querySelector('.wdh-check-body').hidden, false);
});

test('unrecognized stored values leave the panel expanded', async () => {
  const { render } = setup({ saved: 'not-a-boolean' });
  const panel = await render();
  assert.equal(toggleOf(panel).getAttribute('aria-expanded'), 'true');
  assert.equal(panel.querySelector('.wdh-check-body').hidden, false);
});
