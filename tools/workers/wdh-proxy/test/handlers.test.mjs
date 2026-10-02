/*
 * Unit tests of the WDH decoration handlers (no runtime: fake HTMLRewriter elements/comments).
 * The same handlers run in workerd in wdh-proxy.test.mjs.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { wdhLinkHandler, wdhInnerHandler, wdhSelector } from '../src/index.js';

/** Minimal HTMLRewriter Element stand-in that records what a handler does. */
function fakeElement(tagName, attrs) {
  const map = new Map(Object.entries(attrs));
  const calls = [];
  return {
    tagName,
    map,
    calls,
    get attributes() { return [...map.entries()][Symbol.iterator](); },
    getAttribute: (name) => (map.has(name) ? map.get(name) : null),
    removeAttribute: (name) => { calls.push(['remove', name]); map.delete(name); },
    setAttribute: (name, value) => { calls.push(['set', name, value]); map.set(name, value); },
    removeAndKeepContent: () => { calls.push(['unwrap']); },
    remove: () => { calls.push(['remove-element']); },
  };
}

test('link handler: <a> becomes <span class="wdh-value" data-wdh="{raw href}"> with no other attributes', () => {
  const el = fakeElement('a', {
    href: '/aida/data/wdh-de.json#61HG.x&amp;y', title: 'WDH', target: '_blank', class: 'button', id: 'k',
  });
  wdhLinkHandler.element(el);
  assert.equal(el.tagName, 'span');
  assert.deepEqual([...el.map.entries()], [['class', 'wdh-value'], ['data-wdh', '/aida/data/wdh-de.json#61HG.x&amp;y']]);
  assert.ok(!el.calls.some(([op]) => op === 'unwrap' || op === 'remove-element'), 'the link content must be kept');
});

test('link handler: comments inside the link are dropped (textContent has no comments)', () => {
  const calls = [];
  wdhLinkHandler.comments({ text: ' note ', remove: () => calls.push('remove') });
  assert.deepEqual(calls, ['remove']);
});

test('inner handler: nested elements are unwrapped, their text is kept (textContent)', () => {
  const el = fakeElement('strong', { class: 'x' });
  wdhInnerHandler.element(el);
  assert.deepEqual(el.calls, [['unwrap']]);
});

test('link handler defines no text handler, so text chunk boundaries cannot change the output', () => {
  assert.equal(wdhLinkHandler.text, undefined);
  assert.equal(wdhInnerHandler.text, undefined);
});

test('selector: <main> scope for pages, whole document for .plain.html fragments', () => {
  assert.equal(wdhSelector('/aida/de/de/i5'), 'main a[href*="/data/wdh-"][href*="#"]');
  assert.equal(wdhSelector('/aida/de/de/i5.html'), 'main a[href*="/data/wdh-"][href*="#"]');
  assert.equal(wdhSelector('/aida/de/de/i5.plain.html'), 'a[href*="/data/wdh-"][href*="#"]');
});
