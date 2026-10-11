/* global globalThis */
import { test } from 'node:test';
import assert from 'node:assert/strict';

globalThis.window ??= { addEventListener() {}, removeEventListener() {}, location: { search: '' } };
const { sdkUrl } = await import('../../tools/aida/da.js');

test('plugins load the DA SDK from da.live unless their URL names a da-nx branch', () => {
  assert.equal(sdkUrl(''), 'https://da.live/nx/utils/sdk.js');
  assert.equal(sdkUrl('?nx=main'), 'https://da.live/nx/utils/sdk.js');
  assert.equal(sdkUrl('?path=/x&nx=pocasset'), 'https://pocasset--da-nx--adobe.aem.live/nx/utils/sdk.js');
  assert.equal(sdkUrl('?nx=local'), 'http://localhost:6456/nx/utils/sdk.js');
});

test('a malformed da-nx branch falls back to the da.live SDK', () => {
  assert.equal(sdkUrl('?nx=evil.example/x'), 'https://da.live/nx/utils/sdk.js');
  assert.equal(sdkUrl('?nx=Upper_Case'), 'https://da.live/nx/utils/sdk.js');
  assert.equal(sdkUrl('?nx='), 'https://da.live/nx/utils/sdk.js');
});
