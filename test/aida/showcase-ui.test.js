import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as view from '../../tools/aida/showcase/view.js';

const { escape, links, tabs } = view;

const read = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');

test('showcase has one coherent route for every RfP demo activity', () => {
  assert.deepEqual(tabs.map(([id]) => id), ['overview', 'workflow', 'translate', 'rollout', 'radar', 'architecture', 'assets', 'delivery']);
});

test('public links connect DA authoring, preview, live and open representations', () => {
  const urls = links('/aida/showcase/fr/be/i5');
  assert.equal(urls.edit, 'https://da.live/canvas#/moved-permanently/bmw/aida/showcase/fr/be/i5');
  assert.equal(urls.preview, 'https://main--bmw--moved-permanently.aem.page/aida/showcase/fr/be/i5');
  assert.equal(urls.live, 'https://main--bmw--moved-permanently.aem.live/aida/showcase/fr/be/i5');
  assert.equal(urls.markdown, `${urls.preview}.md`);
  assert.equal(urls.fragment, `${urls.preview}.plain.html`);
  assert.throws(() => links('//example.org'), /path/i);
});

test('author supplied copy is escaped before rendering', () => {
  assert.equal(escape('<img src=x onerror="attack()"> & \'bad\''), '&lt;img src=x onerror=&quot;attack()&quot;&gt; &amp; &#39;bad&#39;');
});

test('showcase ships real vendored Spectrum styles and a labelled rehearsal boundary', () => {
  const page = read('tools/aida/showcase/index.html');
  assert.match(page, /\.\.\/spectrum\.css/);
  assert.match(page, /spectrum--light/);
  assert.match(page, /Synthetic rehearsal/);
  const css = read('tools/aida/spectrum.css');
  ['vars', 'button', 'textfield', 'picker', 'checkbox', 'table', 'badge', 'fieldlabel', 'typography', 'card', 'link'].forEach((component) => {
    assert.match(css, new RegExp(`vendor/spectrum/${component}\\.css`));
    assert.ok(read(`tools/aida/vendor/spectrum/${component}.css`).length > 1000);
  });
  assert.match(read('tools/aida/vendor/spectrum/NOTICE.md'), /Adobe|Spectrum/);
});

test('playground persists only its own versioned rehearsal state and never publishes implicitly', () => {
  const app = read('tools/aida/showcase/app.js');
  assert.match(app, /bmw-aida-showcase-v1/);
  assert.doesNotMatch(app, /localStorage\.clear\(/);
  assert.doesNotMatch(app, /admin\.hlx\.page|api\.aem\.live|Bearer/);
  assert.match(app, /Storage unavailable/);
});

test('reviewers can preview the exact rehearsal revision without mistaking a static published fixture for it', () => {
  const app = read('tools/aida/showcase/app.js');
  assert.match(app, /Preview rehearsal revision/);
  assert.match(app, /simulated-preview/);
  assert.match(app, /doc\.fields\.title/);
  assert.match(app, /doc\.fields\.body/);
});

test('radar deep links select only a known market context and never imply authentication', () => {
  assert.equal(typeof view.marketFromSearch, 'function');
  assert.equal(view.marketFromSearch('?market=be'), 'be');
  assert.equal(view.marketFromSearch('?market=unknown'), null);
  assert.equal(view.marketFromSearch('?actor=publisher'), null);
});
