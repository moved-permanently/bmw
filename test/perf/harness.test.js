/*
 * Path containment of the perf test harness (test/perf/harness.js): only files inside the code
 * directories may be served locally; escapes are rejected before anything is fetched upstream.
 * Self-contained: the preview is replaced by a local stub that counts upstream requests.
 */
import {
  test, before, after, beforeEach,
} from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const SECRET = 'perf-harness-secret-outside-root';

let upstream;
let upstreamHits = [];
let server;
// fixtures unique to this run (safe for parallel runs); only these are removed afterwards
let tmpDir;
let linkDir;
let linkPath;

/** GET with the request target sent verbatim (no client-side normalization). */
function get(origin, target) {
  const { hostname, port } = new URL(origin);
  return new Promise((resolve, reject) => {
    http.get({ hostname, port, path: target }, (res) => {
      let body = '';
      res.setEncoding('utf8');
      res.on('data', (c) => { body += c; });
      res.on('end', () => resolve({ status: res.statusCode, body }));
    }).on('error', reject);
  });
}

before(async () => {
  upstream = http.createServer((req, res) => {
    upstreamHits.push(req.url);
    res.writeHead(200, { 'content-type': 'text/plain' });
    res.end('UPSTREAM');
  });
  await new Promise((resolve) => { upstream.listen(0, '127.0.0.1', resolve); });
  process.env.PERF_PREVIEW = `http://127.0.0.1:${upstream.address().port}`;
  const { startServer } = await import('./harness.js');
  server = await startServer();
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'perf-harness-'));
  fs.writeFileSync(path.join(tmpDir, 'secret.txt'), SECRET);
  linkDir = fs.mkdtempSync(path.join(ROOT, 'scripts', '.perf-harness-'));
  linkPath = path.join(linkDir, 'escape.js');
  fs.symlinkSync(path.join(tmpDir, 'secret.txt'), linkPath);
});

after(async () => {
  // removes the link itself (not its target) and the directories created above
  if (linkDir) fs.rmSync(linkDir, { recursive: true, force: true });
  if (tmpDir) fs.rmSync(tmpDir, { recursive: true, force: true });
  if (server) await server.close();
  if (upstream) await new Promise((resolve) => { upstream.close(resolve); });
});

beforeEach(() => { upstreamHits = []; });

test('serves an allowlisted local code file byte-for-byte without an upstream fetch', async () => {
  const r = await get(server.origin, '/scripts/scripts.js');
  assert.equal(r.status, 200);
  assert.equal(r.body, fs.readFileSync(path.join(ROOT, 'scripts/scripts.js'), 'utf8'));
  assert.deepEqual(upstreamHits, []);
});

test('rejects encoded traversal out of a code directory to package.json', async () => {
  const targets = ['/scripts/%2e%2e%2fpackage.json', '/scripts/..%2Fpackage.json', '/blocks/header/%2e%2e%2f%2e%2e%2fpackage.json'];
  const results = await Promise.all(targets.map((target) => get(server.origin, target)));
  results.forEach((r, i) => {
    assert.notEqual(r.status, 200, `${targets[i]} answered 200`);
    assert.ok(!r.body.includes('"devDependencies"'), `${targets[i]} exposed package.json`);
    assert.ok(r.status >= 400 && r.status < 500, `${targets[i]}: expected a 4xx rejection, got ${r.status}`);
  });
  assert.deepEqual(upstreamHits, [], 'escapes must be rejected before any upstream fetch');
});

test('rejects encoded traversal to repository files outside the code directories', async () => {
  const targets = ['/styles/%2e%2e%2f.git%2fconfig', '/fonts/%2e%2e%2fhead.html', '/icons/%2e%2e%2ftest%2fperf%2fharness.js'];
  const results = await Promise.all(targets.map((target) => get(server.origin, target)));
  results.forEach((r, i) => {
    assert.ok(r.status >= 400 && r.status < 500, `${targets[i]}: expected a 4xx rejection, got ${r.status} ${r.body.slice(0, 60)}`);
  });
  assert.deepEqual(upstreamHits, [], 'escapes must be rejected before any upstream fetch');
});

test('rejects a traversal that leaves the repository through a prefix-matching sibling path', async () => {
  const sibling = `${path.basename(ROOT)}-sibling`;
  const target = `/scripts/%2e%2e%2f%2e%2e%2f${sibling}%2fx.js`;
  const r = await get(server.origin, target);
  assert.ok(r.status >= 400 && r.status < 500, `expected a 4xx rejection, got ${r.status} ${r.body.slice(0, 60)}`);
  assert.deepEqual(upstreamHits, [], 'escapes must be rejected before any upstream fetch');
});

test('rejects a symlink inside a code directory that resolves outside it', async () => {
  const r = await get(server.origin, `/scripts/${path.basename(linkDir)}/escape.js`);
  assert.ok(!r.body.includes(SECRET), 'the symlink target outside the repository was served');
  assert.ok(r.status >= 400 && r.status < 500, `expected a 4xx rejection, got ${r.status}`);
  assert.deepEqual(upstreamHits, []);
});

test('rejects malformed percent-encoding without an upstream fetch', async () => {
  const r = await get(server.origin, '/scripts/%E0%A4%A.js');
  assert.ok(r.status >= 400 && r.status < 500, `expected a 4xx rejection, got ${r.status}`);
  assert.deepEqual(upstreamHits, []);
});

test('still proxies non-code paths and missing code files to the preview', async () => {
  const page = await get(server.origin, '/de/home');
  const missing = await get(server.origin, '/scripts/perf-harness-does-not-exist.js');
  assert.equal(page.body, 'UPSTREAM');
  assert.equal(missing.body, 'UPSTREAM');
  assert.deepEqual(upstreamHits, ['/de/home', '/scripts/perf-harness-does-not-exist.js']);
});
