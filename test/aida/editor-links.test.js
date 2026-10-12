import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { DA_EDITOR, DEMO_BRANCH } from '../../tools/aida/editor.js';

const read = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const APPS = [
  'tools/aida/showcase/script.js', 'tools/aida/showcase/view.js', 'tools/aida/showcase/app.js',
  'tools/aida/radar/grid.js', 'tools/aida/radar/radar.js', 'tools/aida/radar/radar.html',
];

test('the AIDA apps link to the da-live branch the demo is pinned to', () => {
  assert.equal(DEMO_BRANCH, 'ewdemo');
  assert.equal(DA_EDITOR, 'https://ewdemo--da-live--adobe.aem.live');
});

test('no AIDA app link bypasses the pinned editor', () => {
  APPS.forEach((file) => assert.doesNotMatch(read(file), /https:\/\/da\.live\/(?!nx\/)/, file));
});

test('static radar navigation uses the pinned editor', () => {
  const html = read('tools/aida/radar/radar.html');
  assert.ok(html.includes(`${DA_EDITOR}/apps/loc#/moved-permanently/bmw`));
  assert.ok(html.includes(`${DA_EDITOR}/app/adobe-rnd/aem-apps/tools/apps/publish-requests-inbox/publish-requests-inbox?org=moved-permanently&amp;site=bmw&amp;env=ci&amp;ref=ewdemo&amp;nx=ewdemo`));
});
