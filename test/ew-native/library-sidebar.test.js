/* global globalThis */
/*
 * Library documents (/library/blocks/*, /library/templates/*) are authoring-only block previews:
 * the BMW help sidebar (AI assistant, live chat, nudge) must never start there.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';

test('help sidebar never starts on block library and template documents', async (t) => {
  const requests = [];
  const appended = [];
  globalThis.window = { location: { pathname: '/library/blocks/stage', search: '' } };
  globalThis.document = {
    querySelector: () => null,
    createElement: () => ({}),
    head: {
      append: (el) => {
        appended.push(el);
        el.onload?.();
      },
    },
    body: { append: (el) => appended.push(el) },
  };
  globalThis.fetch = async (url) => {
    requests.push(url);
    return { ok: false };
  };
  t.after(() => {
    delete globalThis.window;
    delete globalThis.document;
    delete globalThis.fetch;
  });

  const { default: loadSidebar } = await import('../../scripts/bmw-sidebar.js');
  await loadSidebar();
  assert.deepEqual(requests, []);
  assert.deepEqual(appended, []);
});

test('library documents are recognized by their path only', async () => {
  const { isLibraryDocument } = await import('../../scripts/bmw-utils.js');
  assert.equal(isLibraryDocument('/library/blocks/stage'), true);
  assert.equal(isLibraryDocument('/library/templates/news-story'), true);
  assert.equal(isLibraryDocument('/de/home'), false);
  assert.equal(isLibraryDocument('/de/library/blocks/stage'), false);
  assert.equal(isLibraryDocument('/library'), false);
});
