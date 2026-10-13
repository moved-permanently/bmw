import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { chapters, RFP } from '../../tools/aida/showcase/script.js';
import { DA_EDITOR, DEMO_BRANCH } from '../../tools/aida/editor.js';
import * as view from '../../tools/aida/showcase/view.js';

const read = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');

// #path/6 to #path/10 tell the rollout story; their Show card carries a step-by-step list.
const STORY = ['review', 'translate', 'rollout', 'status', 'release'];
const story = STORY.map((id) => chapters.find((c) => c.id === id));
const stepLinks = (steps) => steps.flatMap((s) => [...s.matchAll(/\[([^\]]+)\]\(([^)\s]+)\)/g)])
  .map(([, label, href]) => ({ label, href }));
const PACKAGE = `${DA_EDITOR}/apps/snapshots?nx=${DEMO_BRANCH}&snapshot=i5-launch-news#/moved-permanently/bmw`;
const REVIEW = 'https://i5-launch-news--main--bmw--moved-permanently.aem.reviews/aida/showcase/en/news/i5-launch';

test('the rollout story keeps its place: #path/6 to #path/10', () => {
  assert.deepEqual(chapters.slice(6, 11).map((c) => c.id), STORY);
});

test('each story chapter has a short step list, one action per step', () => {
  story.forEach((c) => {
    assert.ok(Array.isArray(c.steps) && c.steps.length >= 2 && c.steps.length <= 7, c.id);
    c.steps.forEach((s) => {
      const spoken = s.replace(/\]\([^)]*\)/g, ']');
      assert.ok(spoken.length <= 200, `${c.id}: step too long (${spoken.length}): ${spoken}`);
    });
  });
  chapters.filter((c) => !STORY.includes(c.id))
    .forEach((c) => assert.equal(c.steps, undefined, c.id));
});

test('steps stand on their own: no pointers to other chapters, scripts or notes', () => {
  story.forEach((c) => c.steps.forEach((s) => {
    assert.doesNotMatch(s, /chapter|script|obsidian|\breset|previous|above|below|earlier|as before/i, `${c.id}: ${s}`);
  }));
});

test('steps use every link the chapter shows, and only known demo surfaces', () => {
  const editor = new URL(DA_EDITOR).host;
  const hosts = [editor, 'main--bmw--moved-permanently.aem.page', 'main--bmw--moved-permanently.aem.live', new URL(REVIEW).host];
  story.forEach((c) => {
    const used = stepLinks(c.steps);
    assert.ok(used.length >= c.steps.length - 1, `${c.id}: most steps start from a link`);
    used.forEach(({ label, href }) => {
      assert.ok(label.trim(), href);
      const url = new URL(href);
      assert.equal(url.protocol, 'https:');
      assert.ok(hosts.includes(url.host), `${c.id}: ${href}`);
    });
    const hrefs = used.map((l) => l.href);
    c.show.forEach(({ label, href }) => assert.ok(hrefs.includes(href), `${c.id}: show link "${label}" has no step`));
  });
});

test('the launch review package opens on the demo branch of the Snapshots app, where Save takes in corrected pages', () => {
  const links = chapters.flatMap((c) => [...c.show, ...stepLinks(c.steps || [])])
    .map((l) => l.href);
  const packages = links.filter((h) => h.includes('/apps/snapshots'));
  assert.ok(packages.length >= 2);
  packages.forEach((h) => assert.equal(h, PACKAGE));
  const review = chapters.find((c) => c.id === 'review');
  assert.ok(stepLinks(review.steps).some((l) => l.href === REVIEW));
  assert.match(review.steps.join(' '), /\*\*Reject & unlock\*\*/);
  assert.match(review.steps.join(' '), /\*\*Save\*\*/);
  assert.match(review.steps.join(' '), /\*\*Request review\*\*/);
});

test('the story names the buttons on screen', () => {
  const all = (id) => chapters.find((c) => c.id === id).steps.join(' ');
  assert.match(all('translate'), /\*\*Create new project\*\*.*\*\*Start project\*\*.*\*\*Translate all\*\*/);
  assert.match(all('rollout'), /\*\*Rollout all ready\*\*/);
  assert.match(all('rollout'), /\*\*Upstream\*\*/);
  assert.match(all('rollout'), /\*\*Request Publish\*\*.*\*\*Review changes\*\*.*\*\*Request publish\*\*/);
  assert.match(all('rollout'), /\*\*Approve Step\*\*/);
  assert.match(all('status'), /In review: Legal review/);
  assert.match(all('release'), /\*\*Approve & Publish\*\*/);
  assert.match(all('release'), /\*\*Approve & publish\*\*/);
});

test('Request Publish opens from the right-hand panel, where the editor can save and compare; the ⋯ dialog cannot', () => {
  const rollout = chapters.find((c) => c.id === 'rollout').steps.join(' ');
  assert.match(rollout, /right-hand panel[^.]*\*\*Request Publish\*\*/);
  assert.doesNotMatch(rollout, /⋯[^.]*\*\*Request Publish\*\*/);
});

test('the Show card renders the steps as an expandable, numbered list with links, labels and escaped text', () => {
  const i = chapters.findIndex((c) => c.id === 'review');
  const html = view.demoPath(chapters, i, RFP);
  const show = html.slice(html.indexOf('<h2>Show</h2>'), html.indexOf('<h2>Tell</h2>'));
  assert.match(show, /<details class="showcase-path-steps"><summary>Step by step<\/summary><ol>/);
  assert.equal((show.match(/<li>/g) || []).length, chapters[i].steps.length);
  assert.match(show, /<strong>Request review<\/strong>/);
  assert.ok(show.includes(`<a href="${view.escape(PACKAGE)}" target="_blank" rel="noopener">`));

  const odd = { ...chapters[i], steps: ['Type <b>x</b> in [a "page"](https://example.com/?a=1&b=2), then **OK** and `code`'] };
  const rendered = view.demoPath([odd], 0);
  assert.ok(rendered.includes('Type &lt;b&gt;x&lt;/b&gt; in <a href="https://example.com/?a=1&amp;b=2" target="_blank" rel="noopener">a &quot;page&quot;</a>, then <strong>OK</strong> and <code>code</code>'));
  assert.doesNotMatch(view.demoPath(chapters, 1, RFP), /showcase-path-steps/);
});

test('the step list is styled as part of the Show card', () => {
  const css = read('tools/aida/showcase/showcase.css');
  assert.match(css, /\.showcase-path-steps\s*\{/);
  assert.match(css, /\.showcase-path-steps summary\s*\{/);
});
