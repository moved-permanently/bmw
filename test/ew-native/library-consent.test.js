/* global globalThis */
/*
 * Library documents (/library/blocks/*, /library/templates/*) are authoring-only. The Experience
 * Workspace block library frames them on aem.page without consent=disabled (adobe/da-live
 * blocks/canvas/ew-panel-extensions/helpers.js getItemPreviewUrl), where the banner covers the
 * block preview and a choice made in that frame does not stick, so consent must never start there.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';

const at = (pathname, search = '') => {
  globalThis.window = { location: { pathname, search } };
};

test('consent never starts on block library and template documents', async (t) => {
  t.after(() => { delete globalThis.window; });
  at('/library/blocks/stage');
  const { isConsentDisabled, loadConsent } = await import('../../scripts/bmw-consent.js');
  assert.equal(isConsentDisabled(), true);
  assert.equal(await loadConsent(), 'disabled');

  at('/library/templates/news-story');
  assert.equal(isConsentDisabled(), true);

  at('/de/home');
  assert.equal(isConsentDisabled(), false);
  at('/de/library/blocks/stage');
  assert.equal(isConsentDisabled(), false);
  at('/de/home', '?quick-edit=on');
  assert.equal(isConsentDisabled(), true);
});
