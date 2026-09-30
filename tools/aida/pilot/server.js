/* eslint-disable no-console */
import { createServer } from 'node:http';
import {
  existsSync, readFileSync, writeFileSync, mkdirSync, renameSync, chmodSync,
} from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomBytes } from 'node:crypto';
import { ACTORS, createWorkflow } from './workflow.js';
import {
  publicDocument, articleFragment, markdown, structuredData, daDocument, nativePath,
} from './render.js';

const HERE = dirname(fileURLToPath(import.meta.url));
const opaque = () => randomBytes(32).toString('base64url');
const MAX_BODY = 100000;
const ASSETS = {
  '/': ['index.html', 'text/html'],
  '/review': ['review.html', 'text/html'],
  '/ui/app.js': ['app.js', 'text/javascript'],
  '/ui/review.js': ['review.js', 'text/javascript'],
  '/ui/public.js': ['public.js', 'text/javascript'],
  '/ui/style.css': ['style.css', 'text/css'],
};
async function readJson(request) {
  if (!request.headers['content-type']?.startsWith('application/json')) throw new Error('JSON content type required');
  let body = '';
  // eslint-disable-next-line no-restricted-syntax
  for await (const chunk of request) {
    body += chunk;
    if (Buffer.byteLength(body) > MAX_BODY) throw new Error('Request too large');
  }
  return JSON.parse(body || '{}');
}

// eslint-disable-next-line import/prefer-default-export
export function createPilotServer({ storePath, now = Date.now } = {}) {
  const workflow = createWorkflow(storePath && existsSync(storePath) ? JSON.parse(readFileSync(storePath, 'utf8')) : undefined, now);
  const sessions = new Map();
  const save = () => {
    if (!storePath) return;
    mkdirSync(dirname(storePath), { recursive: true, mode: 0o700 });
    const temporary = `${storePath}.tmp`;
    writeFileSync(temporary, JSON.stringify(workflow.snapshot(), null, 2), { mode: 0o600 });
    chmodSync(temporary, 0o600);
    renameSync(temporary, storePath);
  };
  const transact = (operation) => {
    const previous = workflow.snapshot();
    try {
      const result = operation();
      save();
      return result;
    } catch (error) {
      workflow.restore(previous);
      throw error;
    }
  };
  const visibleTo = (actor) => workflow.list()
    .filter((a) => ['hq', '*'].includes(actor.market) || a.market === actor.market);
  const server = createServer(async (request, response) => {
    const base = `http://127.0.0.1:${server.address().port}`;
    const localhost = `http://localhost:${server.address().port}`;
    const allowedHosts = [new URL(base).host, new URL(localhost).host];
    const securityHeaders = {
      'cache-control': 'no-store',
      'x-content-type-options': 'nosniff',
      'referrer-policy': 'no-referrer',
      'x-robots-tag': 'noindex, nofollow',
      'x-frame-options': 'DENY',
      'content-security-policy': "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'",
    };
    const send = (code, body, type = 'application/json', headers = {}) => {
      response.writeHead(code, { ...securityHeaders, 'content-type': `${type}; charset=utf-8`, ...headers });
      response.end(type === 'application/json' ? JSON.stringify(body) : body);
    };
    if (!allowedHosts.includes(request.headers.host)) { send(403, { error: 'Invalid host' }); return; }
    if (request.headers.origin && ![base, localhost].includes(request.headers.origin)) { send(403, { error: 'Invalid origin' }); return; }
    const mutation = !['GET', 'HEAD'].includes(request.method);
    if (mutation && ![base, localhost].includes(request.headers.origin)) { send(403, { error: 'Same-origin request required' }); return; }
    const path = new URL(request.url, base).pathname;
    const sessionId = request.headers.cookie?.match(/(?:^|;\s*)pilot=([A-Za-z0-9_-]+)/)?.[1];
    const session = sessions.get(sessionId);
    const actor = session && now() < session.expiresAt ? session.actor : null;
    try {
      if (request.method === 'GET' && ASSETS[path]) {
        const [file, type] = ASSETS[path];
        send(200, readFileSync(join(HERE, 'ui', file), 'utf8'), type);
        return;
      }
      if (request.method === 'GET' && path === '/api/actors') {
        send(200, { actors: ACTORS, boundary: 'Loopback rehearsal. Personas are simulated, not verified IMS identities.' });
        return;
      }
      if (request.method === 'POST' && path === '/api/session') {
        const { actorId } = await readJson(request);
        const selected = ACTORS.find((a) => a.id === actorId);
        if (!selected) { send(403, { error: 'Unknown demo persona' }); return; }
        if (sessionId) sessions.delete(sessionId);
        const id = opaque();
        const csrf = opaque();
        sessions.set(id, { actor: selected, csrf, expiresAt: now() + 4 * 3600000 });
        send(200, { actor: selected, csrf }, 'application/json', { 'set-cookie': `pilot=${id}; HttpOnly; SameSite=Strict; Path=/; Max-Age=14400` });
        return;
      }
      if (path === '/api/review') {
        const token = request.headers['x-review-token'];
        const review = workflow.guestReview(token);
        if (!review) { send(403, { error: 'Invalid or expired review link' }); return; }
        if (request.method === 'GET') {
          const { article } = review;
          send(200, {
            article: { ...article, versions: undefined, release: undefined },
            expiresAt: review.expiresAt,
          });
          return;
        }
        if (request.method === 'POST') {
          const { decision, comment, field } = await readJson(request);
          transact(() => workflow.guestDecide(token, decision, comment, field));
          send(200, {
            message: 'Decision recorded. The link is revoked. No EDS publishing occurred.',
          });
          return;
        }
      }
      const publicMatch = path.match(/^\/news\/([a-z0-9-]+)(\.md|\.plain\.html|\.json)?$/);
      if (request.method === 'GET' && publicMatch) {
        const [, id, suffix] = publicMatch;
        const article = workflow.publicArticle(id);
        if (!article) { send(404, { error: 'No public release' }); return; }
        if (suffix === '.md') send(200, markdown(article), 'text/markdown');
        else if (suffix === '.plain.html') send(200, articleFragment(article), 'text/html');
        else if (suffix === '.json') send(200, { ...article, structuredData: structuredData(article) });
        else {
          transact(() => workflow.recordPageRequest(id));
          send(200, publicDocument(article), 'text/html');
        }
        return;
      }
      if (request.method === 'GET' && path === '/news-index.json') {
        const rows = workflow.publicIndex().map((a) => ({
          path: `/news/${a.id}`, title: a.title, description: a.description, market: a.market, date: a.publishedAt,
        }));
        send(200, { data: rows, total: rows.length, ':type': 'sheet' });
        return;
      }
      if (request.method === 'POST' && path === '/api/cta') {
        const { id } = await readJson(request);
        transact(() => workflow.recordConversion(id));
        send(200, { message: 'Local demo CTA event recorded; not a BMW conversion.' });
        return;
      }
      if (!path.startsWith('/api/')) { send(404, { error: 'Not found' }); return; }
      if (!actor) { send(401, { error: 'Select a demo persona first' }); return; }
      if (mutation && request.headers['x-pilot-csrf'] !== session.csrf) { send(403, { error: 'Invalid CSRF token' }); return; }
      if (request.method === 'GET' && path === '/api/state') {
        const snapshot = workflow.snapshot();
        const visible = visibleTo(actor);
        const ids = new Set(visible.map((a) => a.id));
        send(200, {
          actor,
          articles: visible,
          metrics: workflow.metrics(['hq', '*'].includes(actor.market) ? undefined : actor.market),
          notifications: workflow.notifications(actor),
          events: snapshot.events.filter((e) => ids.has(e.id)),
        });
        return;
      }
      const exportMatch = path.match(/^\/api\/export\/([a-z0-9-]+)$/);
      if (request.method === 'GET' && exportMatch) {
        const article = workflow.get(exportMatch[1]);
        if (!['hq', '*', article.market].includes(actor.market)) { send(403, { error: 'Permission denied' }); return; }
        if (article.approvedRevision !== article.revision
          || !workflow.currentSource(article.id) || now() < Date.parse(article.embargo)) { send(409, { error: 'Export requires current approval and elapsed embargo. Protect DA/EDS before uploading anything confidential.' }); return; }
        send(200, daDocument(article), 'text/html', { 'content-disposition': `attachment; filename="${article.slug}-${article.market}.html"` });
        return;
      }
      if (request.method === 'POST' && path === '/api/action') {
        const data = await readJson(request);
        let result;
        if (data.action === 'create') result = transact(() => workflow.create(actor, data.fields));
        else {
          const article = workflow.get(data.id);
          if (!['hq', '*', article.market].includes(actor.market)) { send(403, { error: 'Permission denied' }); return; }
          const commands = {
            edit: () => workflow.edit(actor, data.id, data.fields),
            submit: () => workflow.submit(actor, data.id),
            approve: () => workflow.decide(actor, data.id, 'approve', data.comment, data.field),
            reject: () => workflow.decide(actor, data.id, 'reject', data.comment, data.field),
            rollout: () => workflow.rollout(actor, data.id, data.markets),
            publish: () => workflow.publish(actor, data.id),
            schedule: () => workflow.schedule(actor, data.id, data.when),
            'review-link': () => {
              const token = opaque();
              const expiresAt = new Date(now() + 3600000).toISOString();
              workflow.grantReview(actor, data.id, token, expiresAt);
              return {
                token, expiresAt, path: `/review#${token}`, message: 'Bearer review capability: anyone with this link on this machine can decide this revision. No email was sent.',
              };
            },
          };
          if (!commands[data.action]) { send(400, { error: 'Unknown action' }); return; }
          result = transact(commands[data.action]);
        }
        send(200, result);
        return;
      }
      if (request.method === 'GET' && path === '/api/native-links') {
        send(200, {
          snapshots: 'https://da.live/apps/snapshots#/moved-permanently/bmw',
          translate: 'https://da.live/apps/loc#/moved-permanently/bmw',
          articles: visibleTo(actor).map((a) => ({
            id: a.id, path: nativePath(a), edit: `https://da.live/edit#/moved-permanently/bmw${nativePath(a)}`, preview: `https://main--bmw--moved-permanently.aem.page${nativePath(a)}`,
          })),
        });
        return;
      }
      send(404, { error: 'Not found' });
    } catch (error) {
      send(/Permission|Self approval/i.test(error.message) ? 403 : 409, { error: error.message });
    }
  });
  const timer = setInterval(() => {
    try {
      const due = workflow.list().some((a) => a.status === 'scheduled'
        && Date.parse(a.scheduledAt) <= now());
      if (due) transact(() => workflow.publishDue());
    } catch (error) {
      console.error(`Local scheduler stopped release: ${error.message}`);
    }
  }, 1000);
  timer.unref();
  server.on('close', () => clearInterval(timer));
  return { server, workflow };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const storePath = process.env.AIDA_PILOT_DATA || join(process.cwd(), '.aida-pilot', 'state.json');
  const port = Number(process.env.PORT || 3001);
  const { server } = createPilotServer({ storePath });
  server.listen(port, '127.0.0.1', () => {
    console.log(`AIDA connected news pilot: http://127.0.0.1:${port}`);
    console.log('Loopback only. Demo personas are not IMS authentication; local release is not EDS publishing.');
    console.log(`Durable rehearsal state: ${storePath}`);
  });
}
