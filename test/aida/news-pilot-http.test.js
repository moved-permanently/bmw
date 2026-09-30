import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
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
