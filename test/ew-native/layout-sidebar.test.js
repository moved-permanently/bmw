/* global globalThis */
/*
 * Experience Workspace "Layout" view renders the page in an editor frame
 * (adobe/da-live blocks/canvas/ew-editor-wysiwyg/ew-editor-wysiwyg.js):
 *   <ref>--<site>--<org>.preview.da.live/<path>
 *   ?rum=off&consent=disabled&quick-edit=on&controller=parent
 * The standalone quick edit shell on aem.page carries ?quick-edit=<ref> (adobe/da-nx
 * nx/public/plugins/quick-edit/src/standalone.js). The BMW help sidebar (AI assistant, live chat,
 * nudge) floats over the page there and gets in the way of editing, so it must not start.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';

const LAYOUT_SEARCH = '?rum=off&consent=disabled&quick-edit=on&controller=parent';

test('help sidebar never starts in the Experience Workspace layout frame', async (t) => {
  const requests = [];
  const appended = [];
  globalThis.window = { location: { pathname: '/de/home', search: LAYOUT_SEARCH } };
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

test('authoring frames: library documents, quick edit and the layout frame, not plain pages', async () => {
  const { isAuthoringFrame } = await import('../../scripts/bmw-utils.js');
  const at = (pathname, search = '') => isAuthoringFrame({ pathname, search });
  assert.equal(at('/library/blocks/stage'), true);
  assert.equal(at('/de/home', LAYOUT_SEARCH), true);
  assert.equal(at('/de/home', '?quick-edit=main'), true);
  assert.equal(at('/de/home', '?controller=parent'), true);
  assert.equal(at('/de/home'), false);
  // perf tests load plain pages with ?consent=disabled: those keep the sidebar
  assert.equal(at('/de/home', '?consent=disabled'), false);
  assert.equal(at('/de/home', '?controller=bootstrap'), false);
});
