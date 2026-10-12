import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { chapters, RFP } from '../../tools/aida/showcase/script.js';
import { DA_EDITOR } from '../../tools/aida/editor.js';
import * as view from '../../tools/aida/showcase/view.js';

const read = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
// 'brief-fixture' is a WDH sheet source key, never displayed (its label is 'Demo data').
const stripComments = (code) => code.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|\s)\/\/.*$/gm, '$1').replace(/'brief-fixture'/g, '');

// Wording BMW must not see on screen: internal product codenames and rehearsal jargon.
const BANNED = /edge delivery|rehears|fixture|synthetic|substitut|simulat|\bfake\b|\bmock|dry[- ]?run|master|document authoring|sandbox/i;
const BANNED_CASE = /\bEDS\b|\bDA\b/;
const visible = [
  'tools/aida/showcase/index.html', 'tools/aida/showcase/app.js', 'tools/aida/showcase/view.js',
  'tools/aida/showcase/connectors.js', 'tools/aida/showcase/script.js',
  'tools/aida/radar/radar.html', 'tools/aida/radar/radar.js',
  'tools/aida/preflight/preflight.html', 'tools/aida/preflight/preflight.js',
  'tools/aida/wdh-picker/wdh-picker.html', 'tools/aida/wdh-picker/wdh-picker.js',
  'tools/aida/asset-picker/asset-picker.html', 'tools/aida/asset-picker/asset-picker.js',
  'tools/aida/icon-picker/icon-picker.html', 'tools/aida/icon-picker/icon-picker.js', 'tools/aida/icon-picker/icons.js',
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
    assert.ok((c.agenda || c.rfp.length >= 1) && c.rfp.every((r) => RFP[r]), c.id);
  });
});

test('the chapters tell the full RfP story of Briefings I and III', () => {
  const covered = new Set(chapters.flatMap((c) => c.rfp));
  Object.keys(RFP).forEach((ref) => assert.ok(covered.has(ref), `${ref} is not covered`));
});

test('show links open known BMW demo surfaces or a tab of this app', () => {
  const editor = new URL(DA_EDITOR).host;
  const hosts = [editor, 'main--bmw--moved-permanently.aem.page', 'main--bmw--moved-permanently.aem.live', 'i5-launch-news--main--bmw--moved-permanently.aem.reviews', 'da-sc.adobeaem.workers.dev', 'wdh-proxy.aem-poc-lab.workers.dev', 'www.aem.live'];
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
    if (url.host === editor && url.pathname !== '/apps/scheduler') assert.match(href, /moved-permanently(\/|&site=)bmw/, href);
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

test('chapters name their RfP references in full', () => {
  const html = view.demoPath(chapters, 1, RFP);
  chapters[1].rfp.forEach((r) => assert.ok(html.includes(view.escape(RFP[r])), r));
});

test('chapter 1 is the agenda: it claims no RfP step itself and links every Briefing I step to the chapters that show it', () => {
  const [intro] = chapters;
  assert.deepEqual(intro.rfp, []);
  const steps = Object.keys(RFP).filter((r) => r.startsWith('I '));
  assert.deepEqual(intro.agenda.map((a) => a.rfp).filter((r) => r.startsWith('I ')), steps);
  const html = view.demoPath(chapters, 0, RFP);
  assert.match(html, /Agenda/);
  intro.agenda.forEach(({ rfp, chapters: ids }) => {
    assert.ok(html.includes(view.escape(RFP[rfp])), rfp);
    assert.ok(ids.length >= 1, rfp);
    ids.forEach((id) => {
      const i = chapters.findIndex((c) => c.id === id);
      assert.ok(i > 0, `${rfp}: unknown chapter ${id}`);
      assert.ok(chapters[i].rfp.includes(rfp), `${id} does not cover ${rfp}`);
      assert.ok(html.includes(`href="#path/${i}"`), `${rfp} → ${id}`);
    });
  });
});

test('the agenda lists every Briefing I and III section and all its demo chapters, excluding the recap', () => {
  const [intro] = chapters;
  assert.deepEqual(intro.agenda.map((a) => a.rfp), Object.keys(RFP));
  const html = view.demoPath(chapters, 0, RFP);
  intro.agenda.forEach(({ rfp, chapters: ids }) => {
    const expected = chapters.filter((c) => c.id !== 'recap' && c.rfp.includes(rfp));
    assert.deepEqual(ids, expected.map((c) => c.id), rfp);
    assert.ok(html.includes(view.escape(RFP[rfp])), rfp);
    const row = html.match(/<tr>[\s\S]*?<\/tr>/g).find((r) => r.includes(view.escape(RFP[rfp])));
    expected.forEach((c) => {
      assert.ok(row.includes(`href="#path/${chapters.indexOf(c)}"`), `${rfp} → ${c.id}`);
    });
  });
  chapters.filter((c) => !['journey', 'recap'].includes(c.id)).forEach((c) => {
    assert.ok(intro.agenda.some((a) => a.chapters.includes(c.id)), `${c.id} is missing from the agenda`);
  });
});

test('the WDH chapter keeps path/3 and links to server-side HTML cleanup without claiming live value resolution', () => {
  const data = chapters[3];
  assert.equal(data.id, 'data');
  const href = 'https://wdh-proxy.aem-poc-lab.workers.dev/aida/showcase/de/de/i5';
  assert.ok(data.show.some((s) => s.href === href));
  const html = view.demoPath(chapters, 3, RFP);
  assert.ok(html.includes(`href="${href}"`));
  assert.match(data.tell.join(' '), /worker.*removes.*links.*without.*JavaScript/i);
  assert.match(data.tell.join(' '), /does not fetch.*WDH/i);
  assert.doesNotMatch(data.recap, /always.*current/i);
});

test('long briefing labels can wrap in the agenda on narrow screens', () => {
  const css = read('tools/aida/showcase/showcase.css');
  const th = css.match(/\.showcase-path-agenda th\s*\{([^}]+)\}/)[1];
  assert.doesNotMatch(th, /white-space:\s*nowrap/);
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

test('the demo path shows Experience Workspace itself, not the click-through workflow tabs', () => {
  const links = chapters.flatMap((c) => c.show.map((s) => ({ id: c.id, href: s.href })));
  links.forEach(({ id, href }) => assert.doesNotMatch(href, /^#(overview|workflow|translate|rollout|radar)\b/, `${id}: ${href}`));
  const of = (id) => chapters.find((c) => c.id === id).show.map((s) => s.href);
  assert.ok(of('review').includes(`${DA_EDITOR}/canvas#/moved-permanently/bmw/aida/showcase/en/news/i5-launch`));
  assert.ok(of('review').includes(`${DA_EDITOR}/apps/snapshots?nx=ewdemo&snapshot=i5-launch-news#/moved-permanently/bmw`));
  assert.ok(of('rollout').includes(`${DA_EDITOR}/canvas#/moved-permanently/bmw/aida/showcase/fr/be/news/i5-launch`));
  assert.ok(of('rollout').some((h) => h.includes('/app/adobe-rnd/aem-apps/tools/apps/publish-requests-inbox/publish-requests-inbox?org=moved-permanently&site=bmw')));
  assert.ok(of('status').some((h) => h.includes('/tools/aida/radar/radar')));
  assert.ok(of('status').includes(`${DA_EDITOR}/#/moved-permanently/bmw/aida/showcase/fr/be/news`));
});

test('insights point to AEM operational telemetry and show no sample numbers', () => {
  const insights = chapters.find((c) => c.id === 'insights');
  assert.ok(insights.show.some((s) => s.href === 'https://www.aem.live/docs/operational-telemetry'));
  assert.doesNotMatch(insights.tell.join(' '), /sample/i);
});

test('the delivery chapter (#path/11) links the car screen\'s news and places and where authors edit them', () => {
  const index = chapters.findIndex((c) => c.id === 'delivery');
  assert.equal(index, 11, 'the chapter keeps its number, so #path/11 stays the delivery chapter');
  const delivery = chapters[index];
  const hrefs = delivery.show.map((s) => s.href);
  const preview = 'https://main--bmw--moved-permanently.aem.page';
  assert.ok(hrefs.includes(`${preview}/aida/showcase/news-index.json`));
  assert.ok(hrefs.includes(`${preview}/aida/showcase/data/places.json`));
  assert.ok(hrefs.includes(`${DA_EDITOR}/sheet#/moved-permanently/bmw/aida/showcase/data/places`));
  assert.ok(hrefs.includes(`${DA_EDITOR}/canvas#/moved-permanently/bmw/aida/showcase/de/de/news/cannes`));
  assert.ok(hrefs.includes(`${DA_EDITOR}/canvas#/moved-permanently/bmw/de/mehr-bmw/sport-und-events/bmw-basketball/bmw-park`));
  assert.match(delivery.tell.join(' '), /car screen/i);
  assert.match(delivery.recap, /car screen/i);
  const html = view.demoPath(chapters, index, RFP);
  assert.ok(html.includes('href="https://main--bmw--moved-permanently.aem.page/aida/showcase/data/places.json"'));
});

test('the car app reads the same news and places sheets the delivery chapter links', () => {
  const client = read('tools/aida/carplay/Sources/Content/ContentClient.swift');
  assert.ok(client.includes('/aida/showcase/news-index.json'));
  assert.ok(client.includes('/aida/showcase/data/places.json'));
});
