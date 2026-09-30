import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { request as httpRequest } from 'node:http';

const implementation = await import('../../tools/aida/pilot/server.js').catch(() => ({}));

test('HTTP pilot enforces sessions, CSRF, public isolation, safe rendering and durable state', async () => {
  assert.equal(typeof implementation.createPilotServer, 'function', 'Missing server-enforced news pilot');
  const directory = mkdtempSync(join(tmpdir(), 'aida-pilot-'));
  const storePath = join(directory, 'state.json');
  let app;
  try {
    app = implementation.createPilotServer({ storePath, now: () => Date.parse('2026-09-30T10:00:00Z') });
    await new Promise((resolve) => { app.server.listen(0, '127.0.0.1', resolve); });
    const base = `http://127.0.0.1:${app.server.address().port}`;
    const request = (path, options = {}) => fetch(`${base}${path}`, options);
    assert.equal((await request('/api/state')).status, 401);
    const login = await request('/api/session', { method: 'POST', headers: { origin: 'https://evil.invalid', 'content-type': 'application/json' }, body: JSON.stringify({ actorId: 'hq-author' }) });
    assert.equal(login.status, 403);
    const signIn = async (actorId) => {
      const response = await request('/api/session', { method: 'POST', headers: { origin: base, 'content-type': 'application/json' }, body: JSON.stringify({ actorId }) });
      assert.equal(response.status, 200);
      const { csrf } = await response.json();
      return {
        origin: base, 'content-type': 'application/json', cookie: response.headers.get('set-cookie').split(';')[0], 'x-pilot-csrf': csrf,
      };
    };
    const unknown = await request('/api/session', { method: 'POST', headers: { origin: base, 'content-type': 'application/json' }, body: JSON.stringify({ actorId: 'unknown-persona' }) });
    assert.equal(unknown.status, 403);
    const author = await signIn('hq-author');
    const action = async (headers, command, payload = {}) => request('/api/action', { method: 'POST', headers, body: JSON.stringify({ action: command, ...payload }) });
    assert.equal((await action({ ...author, 'x-pilot-csrf': '' }, 'create')).status, 403);
    const created = await action(author, 'create', {
      fields: {
        slug: 'http-story', market: 'hq', title: '<img src=x onerror=alert(1)>', description: 'Summary', body: '<script>alert(1)</script>', legal: 'Legal', embargo: '2026-09-30T10:00:00Z',
      },
    });
    assert.equal(created.status, 200);
    const { id } = await created.json();
    await Promise.all(['', '.md', '.plain.html', '.json'].map(async (suffix) => {
      const response = await request(`/news/${id}${suffix}`);
      assert.equal(response.status, 404, `Draft leaked through ${suffix}`);
      assert.match(response.headers.get('cache-control'), /no-store/);
    }));
    assert.deepEqual((await (await request('/news-index.json')).json()).data, []);
    const de = await signIn('de-author');
    await action(de, 'create', { fields: { slug: 'de-story', market: 'de', title: 'DE draft', description: 'Summary', body: 'Local story', legal: 'Legal', embargo: '2026-09-30T10:00:00Z' } });
    const scoped = await (await request('/api/state', { headers: de })).json();
    assert.equal(scoped.metrics.articles, 1);
    const links = await (await request('/api/native-links', { headers: de })).json();
    assert.ok(links.articles.every((a) => a.id.startsWith('de--')));
    await action(author, 'submit', { id });
    const reviewer = await signIn('hq-reviewer');
    const grant = await action(reviewer, 'review-link', { id });
    const { token } = await grant.json();
    assert.equal((await request('/api/review')).status, 403);
    const review = await request('/api/review', { headers: { 'x-review-token': token } });
    assert.equal(review.status, 200);
    assert.equal((await review.json()).article.id, id);
    await action(reviewer, 'approve', { id, comment: 'Approved', field: 'body' });
    assert.equal((await request(`/news/${id}`)).status, 404);
    const publisher = await signIn('publisher');
    assert.equal((await action(publisher, 'publish', { id })).status, 200);
    const published = await request(`/news/${id}`);
    const html = await published.text();
    assert.match(html, /&lt;script&gt;/);
    assert.doesNotMatch(html, /<script>alert/);
    assert.match(published.headers.get('content-security-policy'), /default-src 'self'/);
    assert.equal((await request('/..%2f..%2fpackage.json')).status, 404);
    const wrongHost = await new Promise((resolve, reject) => {
      const req = httpRequest(`${base}/api/state`, { headers: { host: 'evil.invalid' } }, (res) => { res.resume(); resolve(res.statusCode); });
      req.on('error', reject);
      req.end();
    });
    assert.equal(wrongHost, 403);
    await new Promise((resolve) => { app.server.close(resolve); });
    app = implementation.createPilotServer({ storePath, now: () => Date.parse('2026-09-30T10:00:00Z') });
    assert.equal(app.workflow.publicArticle(id).title, '<img src=x onerror=alert(1)>');
  } finally {
    if (app?.server.listening) await new Promise((resolve) => { app.server.close(resolve); });
    rmSync(directory, { recursive: true });
  }
});


test('failed persistence cannot create a draft, approve a guest revision, or release content', async () => {
  const directory = mkdtempSync(join(tmpdir(), 'aida-disk-failure-'));
  const storePath = join(directory, 'state.json');
  let clock = Date.parse('2026-09-30T10:00:00Z');
  const app = implementation.createPilotServer({ storePath, now: () => clock });
  const author = { id: 'hq-author', role: 'author', market: 'hq' };
  const reviewer = { id: 'hq-reviewer', role: 'reviewer', market: 'hq' };
  const source = app.workflow.create(author, { slug: 'failure', market: 'hq', title: 'Story', description: 'Summary', body: 'Body', legal: 'Legal', embargo: '2026-09-30T10:00:00Z' });
  app.workflow.submit(author, source.id);
  const token = 'synthetic-review-capability-token';
  app.workflow.grantReview(reviewer, source.id, token, '2026-09-30T11:00:00Z');
  await new Promise((resolve) => { app.server.listen(0, '127.0.0.1', resolve); });
  const base = `http://127.0.0.1:${app.server.address().port}`;
  mkdirSync(storePath);
  try {
    const guest = await fetch(`${base}/api/review`, { method: 'POST', headers: { origin: base, 'content-type': 'application/json', 'x-review-token': token }, body: JSON.stringify({ decision: 'approve', field: 'body', comment: '' }) });
    assert.equal(guest.status, 409);
    assert.equal(app.workflow.get(source.id).status, 'in-review');
    app.workflow.decide(reviewer, source.id, 'approve', '', 'body');
    const login = await fetch(`${base}/api/session`, { method: 'POST', headers: { origin: base, 'content-type': 'application/json' }, body: JSON.stringify({ actorId: 'publisher' }) });
    const { csrf } = await login.json();
    const headers = { origin: base, 'content-type': 'application/json', cookie: login.headers.get('set-cookie').split(';')[0], 'x-pilot-csrf': csrf };
    const release = await fetch(`${base}/api/action`, { method: 'POST', headers, body: JSON.stringify({ action: 'publish', id: source.id }) });
    assert.equal(release.status, 409);
    assert.equal(app.workflow.publicArticle(source.id), null);
    assert.deepEqual((await (await fetch(`${base}/news-index.json`)).json()).data, []);
    app.workflow.schedule({ id: 'publisher', role: 'publisher', market: '*' }, source.id, '2026-09-30T11:00:00Z');
    clock += 3600000;
    await new Promise((resolve) => { setTimeout(resolve, 1100); });
    assert.equal(app.workflow.publicArticle(source.id), null);
    assert.equal(app.workflow.get(source.id).status, 'scheduled');
  } finally {
    await new Promise((resolve) => { app.server.close(resolve); });
    rmSync(directory, { recursive: true });
  }
});
