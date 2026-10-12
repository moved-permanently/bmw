/* global globalThis */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseStory, createChannel, SOURCE_URL } from '../../tools/aida/phone-story/consumer.js';

const html = (title = 'An electric story') => `<div class="hero-stage"><a href="https://bmw.scene7.com/is/image/BMW/photo">BMW exterior</a><h1>${title}</h1><p>Authored introduction.</p></div><p><a href="/aida/showcase/data/wdh-de.json#61HG.electricRange">513–627 km</a></p><p><a href="/aida/showcase/data/wdh-de.json#61HG.wltp">WLTP statement.</a></p>`;
const response = (text, ok = true) => ({ ok, status: ok ? 200 : 503, text: async () => text });

test('phone reads authored heading, native image bookmarks and WDH value text', () => {
  const item = parseStory({ markdown: '# An electric story\n\nAuthored introduction.', html: html() });
  assert.equal(item.title, 'An electric story');
  assert.equal(item.teaser, 'Authored introduction.');
  assert.equal(item.image.url, 'https://bmw.scene7.com/is/image/BMW/photo');
  assert.equal(item.facts[0].text, '513–627 km');
  assert.equal(item.legal, 'WLTP statement.');
});

test('missing cells do not invent facts, images or a title', () => {
  const item = parseStory({ markdown: '# Plain story', html: '<h1>Plain story</h1>' });
  assert.deepEqual(item.facts, []);
  assert.equal(item.image, null);
  assert.throws(() => parseStory({ markdown: 'Unavailable', html: '<h2>No story</h2>' }), /title/);
});

test('does not accept unsafe images or facts from another origin', () => {
  const item = parseStory({ markdown: '# Safe\n![bad](javascript:alert)', html: '<h1>Safe</h1><a href="https://other.test/aida/data/wdh-de.json#61HG.power">Fake</a>' });
  assert.equal(item.image, null);
  assert.deepEqual(item.facts, []);
});

test('no fetch until explicit refresh; exactly the two public formats, without credentials', async () => {
  const calls = [];
  const channel = createChannel({ fetcher: async (url, options) => {
    calls.push({ url, options });
    return response(url.includes('.plain.html') ? html() : '# An electric story');
  } });
  assert.equal(calls.length, 0);
  assert.equal(channel.state.status, 'unfetched');
  await channel.refresh();
  assert.deepEqual(calls.map(({ url }) => url), [`${SOURCE_URL}.md`, `${SOURCE_URL}.plain.html`]);
  calls.forEach(({ options }) => {
    assert.equal(options.credentials, 'omit');
    assert.equal(options.cache, 'no-store');
    assert.ok(options.signal);
  });
  assert.equal(channel.state.status, 'fetched');
});

test('explicit refresh detects an authored change and retains the previous version', async () => {
  let title = 'First headline';
  const channel = createChannel({ fetcher: async (url) => response(url.includes('.plain.html') ? html(title) : `# ${title}`) });
  await channel.refresh();
  title = 'Updated headline';
  assert.equal(channel.state.item.title, 'First headline');
  await channel.refresh();
  assert.equal(channel.state.item.title, title);
  assert.equal(channel.state.previousItem.title, 'First headline');
  assert.equal(channel.state.contentChanged, true);
});

test('a failed refresh keeps the last successful content and its timestamp, labelled stale', async () => {
  let failed = false;
  const channel = createChannel({ fetcher: async (url) => response(url.includes('.plain.html') ? html() : '# An electric story', !failed), clock: () => new Date('2026-10-12T10:00:00Z') });
  await channel.refresh();
  const item = channel.state.item;
  failed = true;
  await channel.refresh();
  assert.equal(channel.state.status, 'stale');
  assert.equal(channel.state.item, item);
  assert.equal(channel.state.fetchedAt, '2026-10-12T10:00:00.000Z');
  assert.match(channel.state.error, /503/);
});

test('one in-flight refresh only, with a readable initial failure', async () => {
  let finish;
  const pending = new Promise((resolve) => { finish = resolve; });
  let calls = 0;
  const channel = createChannel({ fetcher: async () => { calls += 1; await pending; return response('', false); } });
  const first = channel.refresh();
  await channel.refresh();
  assert.equal(calls, 2);
  finish();
  await first;
  assert.equal(channel.state.status, 'error');
  assert.equal(channel.state.item, null);
});

test('reset only clears this reading session and does not request or mutate content', async () => {
  let calls = 0;
  const channel = createChannel({ fetcher: async (url) => { calls += 1; return response(url.includes('.plain.html') ? html() : '# An electric story'); } });
  await channel.refresh();
  channel.reset();
  assert.equal(channel.state.item, null);
  assert.equal(channel.state.status, 'unfetched');
  assert.equal(calls, 2);
});

test('app tells the source/edit/preview/refresh story and has no localhost broker', () => {
  const markup = readFileSync(new URL('../../tools/aida/phone-story/phone-story.html', import.meta.url), 'utf8');
  assert.match(markup, /Refresh content/);
  assert.match(markup, /Edit the source/);
  assert.match(markup, /Preview/);
  assert.match(markup, /does not publish/i);
  assert.doesNotMatch(markup, /localhost|127\.0\.0\.1/);
});
