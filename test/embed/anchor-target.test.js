/* global globalThis */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { findAnchorTarget } from '../../scripts/bmw-utils.js';

// inside an aem-embed, anchor targets live in the shadow root, not in the host document
test('findAnchorTarget looks up the id in the given root (a shadow root when embedded)', (t) => {
  const target = { id: 'preisliste' };
  const root = {
    getElementById: (id) => (id === 'preisliste' ? target : null),
    querySelector: () => null,
  };
  globalThis.document = {
    getElementById: () => null,
    querySelector: () => null,
  };
  t.after(() => delete globalThis.document);
  assert.equal(findAnchorTarget('#preisliste', '', root), target);
});

test('findAnchorTarget finds the section by heading text in the root\'s main', (t) => {
  const section = { id: '' };
  const heading = { textContent: 'Preise und Produktinformationen.', closest: (sel) => (sel === '.section' ? section : null) };
  const main = { querySelector: () => null, querySelectorAll: () => [heading] };
  const root = { getElementById: () => null, querySelector: (sel) => (sel === 'main' ? main : null) };
  globalThis.document = { getElementById: () => null, querySelector: () => null };
  globalThis.window = {};
  t.after(() => {
    delete globalThis.document;
    delete globalThis.window;
  });
  assert.equal(findAnchorTarget('#preisliste', 'Preise und Produktinformationen.', root), section);
  assert.equal(section.id, 'preisliste');
});
