/* eslint-disable max-len, import/extensions, no-await-in-loop */
import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { mkdtempSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createHelper } from '../../tools/aida/carplay/demo/tts-helper.mjs';

// Servers are closed after the file even when an assertion fails, so a red test cannot hang the run.
const open = [];
after(() => { open.forEach((srv) => { srv.close(); srv.closeAllConnections?.(); }); });

// A stand-in for api.openai.com: records every request and answers with fake audio bytes.
async function upstream(status = 200) {
  const calls = [];
  const server = http.createServer((req, res) => {
    let body = '';
    req.on('data', (c) => { body += c; });
    req.on('end', () => {
      calls.push({
        method: req.method, url: req.url, auth: req.headers.authorization, body: body ? JSON.parse(body) : null,
      });
      if (status !== 200) { res.writeHead(status, { 'content-type': 'application/json' }); res.end('{"error":{"message":"nope"}}'); return; }
      res.writeHead(200, { 'content-type': 'audio/mpeg' });
      // the audio is the text it was asked for, so a test can see which chunks came back and in which order
      const input = body ? JSON.parse(body).input : '';
      res.end(Buffer.from(input.length < 40 && input.startsWith('Hallo Chiemgau') ? 'ID3-fake-audio' : input));
    });
  });
  open.push(server);
  await new Promise((r) => { server.listen(0, '127.0.0.1', r); });
  return { calls, url: `http://127.0.0.1:${server.address().port}/v1`, close: () => new Promise((r) => { server.close(r); }) };
}

async function start(up, overrides = {}) {
  const cacheDir = mkdtempSync(join(tmpdir(), 'tts-'));
  const helper = createHelper({
    apiKey: 'sk-test-secret', baseUrl: up.url, cacheDir, ...overrides,
  });
  open.push(helper);
  await new Promise((r) => { helper.listen(0, '127.0.0.1', r); });
  const base = `http://127.0.0.1:${helper.address().port}`;
  return {
    helper, base, cacheDir, stop: () => new Promise((r) => { helper.close(r); helper.closeAllConnections?.(); }),
  };
}
const post = (base, body, path = '/tts') => fetch(`${base}${path}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: typeof body === 'string' ? body : JSON.stringify(body) });

test('sends the text to OpenAI speech with a female German voice and returns the audio', async () => {
  const up = await upstream();
  const s = await start(up);
  const res = await post(s.base, { text: 'Hallo Chiemgau Arena.', lang: 'de-DE' });
  assert.equal(res.status, 200);
  assert.equal(res.headers.get('content-type'), 'audio/mpeg');
  assert.equal(res.headers.get('x-tts-cache'), 'miss');
  assert.equal(Buffer.from(await res.arrayBuffer()).toString(), 'ID3-fake-audio');
  assert.equal(up.calls.length, 1);
  const [call] = up.calls;
  assert.equal(call.method, 'POST');
  assert.equal(call.url, '/v1/audio/speech');
  assert.equal(call.auth, 'Bearer sk-test-secret');
  assert.equal(call.body.model, 'gpt-4o-mini-tts');
  assert.equal(call.body.voice, 'marin');
  assert.equal(call.body.input, 'Hallo Chiemgau Arena.');
  assert.equal(call.body.response_format, 'mp3');
  assert.match(call.body.instructions, /Deutsch/);
  assert.match(call.body.instructions, /Sprecherin/);
  await s.stop(); await up.close();
});

test('the same text is served from the disk cache the second time', async () => {
  const up = await upstream();
  const s = await start(up);
  await post(s.base, { text: 'Einmal.', lang: 'de-DE' });
  const again = await post(s.base, { text: 'Einmal.', lang: 'de-DE' });
  assert.equal(again.headers.get('x-tts-cache'), 'hit');
  assert.equal(up.calls.length, 1);
  assert.equal(readdirSync(s.cacheDir).filter((f) => f.endsWith('.mp3')).length, 1);
  // a new helper on the same folder still finds it
  const s2 = await start(up, { cacheDir: s.cacheDir });
  assert.equal((await post(s2.base, { text: 'Einmal.', lang: 'de-DE' })).headers.get('x-tts-cache'), 'hit');
  assert.equal(up.calls.length, 1);
  await s.stop(); await s2.stop(); await up.close();
});

test('the language selects the instructions and its own cache entry', async () => {
  const up = await upstream();
  const s = await start(up);
  await post(s.base, { text: 'Bonjour', lang: 'fr-FR' });
  await post(s.base, { text: 'Bonjour', lang: 'de-DE' });
  assert.equal(up.calls.length, 2);
  assert.match(up.calls[0].body.instructions, /français/);
  assert.match(up.calls[1].body.instructions, /Deutsch/);
  await s.stop(); await up.close();
});

test('identical requests that arrive together make one upstream call', async () => {
  const up = await upstream();
  const s = await start(up);
  const rs = await Promise.all([1, 2, 3].map(() => post(s.base, { text: 'Gleichzeitig.', lang: 'de-DE' })));
  rs.forEach((r) => assert.equal(r.status, 200));
  assert.equal(up.calls.length, 1);
  await s.stop(); await up.close();
});

test('text over the OpenAI limit is cut at a sentence end', async () => {
  const up = await upstream();
  const s = await start(up);
  const sentence = 'Dies ist ein Satz mit etwas Länge. ';
  const res = await post(s.base, { text: sentence.repeat(200), lang: 'de-DE' });
  const total = up.calls.reduce((n, c) => n + c.body.input.length, 0);
  assert.ok(total <= 4000, `${total}`);
  assert.ok(Buffer.from(await res.arrayBuffer()).toString().endsWith('.'));
  await s.stop(); await up.close();
});

test('a long text is rendered as sentence chunks in parallel and joined in order', async () => {
  const up = await upstream();
  const s = await start(up);
  const sentences = Array.from({ length: 12 }, (_, i) => `Das ist der ${i + 1}. Satz des Artikels über die Chiemgau Arena in Ruhpolding.`);
  const text = sentences.join(' ');
  const res = await post(s.base, { text, lang: 'de-DE' });
  assert.equal(res.status, 200);
  assert.ok(up.calls.length >= 3, `${up.calls.length} chunks`);
  up.calls.forEach((c) => assert.ok(c.body.input.length <= 260, `${c.body.input.length}`));
  assert.equal(Buffer.from(await res.arrayBuffer()).toString().replace(/\s+/g, ''), text.replace(/\s+/g, ''), 'the audio parts come back in text order');
  await s.stop(); await up.close();
});

test('abbreviations do not end a chunk', async () => {
  const { chunks } = await import('../../tools/aida/carplay/demo/tts-helper.mjs');
  const text = 'Die Arena liegt ca. 25 km entfernt, z. B. an der A8. Der Weltcup startet im Januar. Tickets gibt es online.';
  assert.deepEqual(chunks(text, 60), ['Die Arena liegt ca. 25 km entfernt, z. B. an der A8.', 'Der Weltcup startet im Januar. Tickets gibt es online.']);
  assert.deepEqual(chunks('Kurz.', 220), ['Kurz.']);
});

test('without a key it answers 503 and never calls OpenAI; health says so', async () => {
  const up = await upstream();
  const s = await start(up, { apiKey: '' });
  const res = await post(s.base, { text: 'Hallo', lang: 'de-DE' });
  assert.equal(res.status, 503);
  assert.equal(up.calls.length, 0);
  const health = await (await fetch(`${s.base}/health`)).json();
  assert.equal(health.ok, true);
  assert.equal(health.key, false);
  await s.stop(); await up.close();
});

test('an upstream error is a 502, is not cached, and never leaks the key', async () => {
  const up = await upstream(500);
  const s = await start(up);
  const res = await post(s.base, { text: 'Fehler', lang: 'de-DE' });
  assert.equal(res.status, 502);
  const text = await res.text();
  assert.doesNotMatch(text, /sk-test-secret/);
  await post(s.base, { text: 'Fehler', lang: 'de-DE' });
  assert.equal(up.calls.length, 2, 'failures are not cached');
  assert.doesNotMatch(JSON.stringify(await (await fetch(`${s.base}/health`)).json()), /sk-test-secret/);
  await s.stop(); await up.close();
});

test('rejects empty text, bad JSON and other methods; listens on localhost only', async () => {
  const up = await upstream();
  const s = await start(up);
  assert.equal((await post(s.base, { text: '  ', lang: 'de-DE' })).status, 400);
  assert.equal((await post(s.base, '{nope')).status, 400);
  assert.equal((await fetch(`${s.base}/tts`)).status, 405);
  assert.equal((await fetch(`${s.base}/other`)).status, 404);
  assert.equal(s.helper.address().address, '127.0.0.1');
  assert.equal(up.calls.length, 0);
  await s.stop(); await up.close();
});

test('/warm renders several texts into the cache without returning audio', async () => {
  const up = await upstream();
  const s = await start(up);
  const res = await post(s.base, { items: [{ text: 'Eins.', lang: 'de-DE' }, { text: 'Zwei.', lang: 'de-DE' }, { text: 'Eins.', lang: 'de-DE' }] }, '/warm');
  assert.equal(res.status, 202);
  // wait until the background work is done
  for (let i = 0; i < 50 && up.calls.length < 2; i += 1) await new Promise((r) => { setTimeout(r, 20); });
  assert.equal(up.calls.length, 2);
  assert.equal((await post(s.base, { text: 'Zwei.', lang: 'de-DE' })).headers.get('x-tts-cache'), 'hit');
  await s.stop(); await up.close();
});
