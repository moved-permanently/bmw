import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { DA_EDITOR } from '../../tools/aida/editor.js';

const read = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const APPS = [
  'tools/aida/showcase/script.js', 'tools/aida/showcase/view.js', 'tools/aida/showcase/app.js',
  'tools/aida/radar/grid.js', 'tools/aida/radar/radar.js', 'tools/aida/radar/radar.html',
];

test('the AIDA apps link to the da-live branch the demo is pinned to', () => {
  assert.equal(DA_EDITOR, 'https://pocasset--da-live--adobe.aem.live');
});

test('no AIDA app link bypasses the pinned editor', () => {
  APPS.forEach((file) => assert.doesNotMatch(read(file), /https:\/\/da\.live\/(?!nx\/)/, file));
});

test('static radar navigation uses the pinned editor', () => {
  assert.ok(read('tools/aida/radar/radar.html').includes(`${DA_EDITOR}/apps/loc#/moved-permanently/bmw`));
});
