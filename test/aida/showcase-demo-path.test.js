import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { chapters, RFP } from '../../tools/aida/showcase/script.js';
import * as view from '../../tools/aida/showcase/view.js';

const read = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
// 'brief-fixture' is a WDH sheet source key, never displayed (its label is 'Demo data').
const stripComments = (code) => code.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|\s)\/\/.*$/gm, '$1').replace(/'brief-fixture'/g, '');

// Wording BMW must not see on screen: internal product codenames and rehearsal jargon.
const BANNED = /edge delivery|rehears|fixture|synthetic|substitut|simulat|\bfake\b|\bmock|dry[- ]?run|master|document authoring|sandbox/i;
const BANNED_CASE = /\bEDS\b|\bDA\b/;
const visible = [
  'tools/aida/showcase/index.html', 'tools/aida/showcase/app.js', 'tools/aida/showcase/view.js',
  'tools/aida/showcase/model.js', 'tools/aida/showcase/connectors.js', 'tools/aida/showcase/script.js',
  'tools/aida/radar/radar.html', 'tools/aida/radar/radar.js',
  'tools/aida/preflight/preflight.html', 'tools/aida/preflight/preflight.js',
  'tools/aida/wdh-picker/wdh-picker.html', 'tools/aida/wdh-picker/wdh-picker.js',
  'tools/aida/asset-picker/asset-picker.html', 'tools/aida/asset-picker/asset-picker.js',
  'scripts/aida-wdh.js',
];

test('the demo path is the first tab and the default route', () => {
  assert.deepEqual(view.tabs[0], ['path', 'Demo path']);
  assert.equal(view.defaultTab, 'path');
});

test('every chapter is show-tell-show: links to show, at most three points to tell, one recap', () => {
  assert.ok(chapters.length >= 12);
  assert.equal(new Set(chapters.map((c) => c.id)).size, chapters.length);
  chapters.forEach((c) => {
    assert.ok(c.title && c.recap, c.id);
    assert.ok(c.tell.length >= 1 && c.tell.length <= 3, c.id);
    assert.ok(c.show.length >= 1, c.id);
    assert.ok(c.rfp.length >= 1 && c.rfp.every((r) => RFP[r]), c.id);
  });
});

test('the chapters tell the full RfP story of Briefings I and III', () => {
  const covered = new Set(chapters.flatMap((c) => c.rfp));
  Object.keys(RFP).forEach((ref) => assert.ok(covered.has(ref), `${ref} is not covered`));
});

test('show links open known BMW demo surfaces or a tab of this app', () => {
  const hosts = ['da.live', 'main--bmw--moved-permanently.aem.page', 'main--bmw--moved-permanently.aem.live', 'da-sc.adobeaem.workers.dev'];
  const ids = view.tabs.map(([id]) => id);
  chapters.flatMap((c) => c.show).forEach(({ label, href }) => {
    assert.ok(label, href);
    if (href.startsWith('#')) {
      const [id, n] = href.slice(1).split('/');
      assert.ok(ids.includes(id), href);
      if (n !== undefined) assert.ok(Number(n) >= 0 && Number(n) < chapters.length, href);
      return;
    }
    const url = new URL(href);
    assert.equal(url.protocol, 'https:');
    assert.ok(hosts.includes(url.host), href);
    if (url.host === 'da.live' && url.pathname !== '/apps/scheduler') assert.match(href, /moved-permanently\/bmw/, href);
  });
});

test('a chapter renders with full navigation, previous/next and escaped text', () => {
  const html = view.demoPath([{ ...chapters[1], title: '<b>x</b>' }, ...chapters.slice(2)], 0);
  assert.match(html, /&lt;b&gt;x&lt;\/b&gt;/);
  const all = view.demoPath(chapters, 3);
  chapters.forEach((c) => assert.ok(all.includes(view.escape(c.title)), c.title));
  assert.match(all, /href="#path\/2"/);
  assert.match(all, /href="#path\/4"/);
  assert.match(all, /aria-current="step"/);
  assert.ok(all.includes(view.escape(chapters[3].recap)));
  assert.match(view.demoPath(chapters, 99), new RegExp(view.escape(chapters.at(-1).title)));
  assert.match(view.demoPath(chapters, -5), new RegExp(view.escape(chapters[0].title)));
});

test('the presenter can step through chapters with the arrow keys', () => {
  const app = read('tools/aida/showcase/app.js');
  assert.match(app, /ArrowRight/);
  assert.match(app, /ArrowLeft/);
  assert.equal(view.chapterFromHash('#path/4', chapters.length), 4);
  assert.equal(view.chapterFromHash('#path', chapters.length), 0);
  assert.equal(view.chapterFromHash('#path/x', chapters.length), 0);
  assert.equal(view.chapterFromHash('#path/77', chapters.length), chapters.length - 1);
});

test('nothing BMW sees uses internal codenames or rehearsal jargon', () => {
  visible.forEach((file) => {
    const code = stripComments(read(file));
    const hit = code.match(BANNED) || code.match(BANNED_CASE);
    assert.equal(hit, null, `${file}: "${hit?.[0]}" near "${hit ? code.slice(Math.max(0, hit.index - 40), hit.index + 40) : ''}"`);
  });
});
