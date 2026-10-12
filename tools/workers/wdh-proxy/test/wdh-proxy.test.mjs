/*
 * wdh-proxy tests: the real worker in workerd (Miniflare, real HTMLRewriter); the EDS origin is an
 * in-process stub (Miniflare outboundService), so no network is used.
 * Contract under test = scripts/scripts.js decorateWdhValues(main): every
 * a[href*="/data/wdh-"][href*="#"] in <main> becomes
 * <span class="wdh-value" data-wdh="{href attribute}">{a.textContent}</span>.
 */
import {
  test, before, after, beforeEach,
} from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { Miniflare, Response } from 'miniflare';

const SCRIPT = fileURLToPath(new URL('../src/index.js', import.meta.url));
const W = 'https://wdh-demo.example.com';
const ORIGIN = 'main--bmw--moved-permanently.aem.page';
const MEDIA = `/media_${'1a2b3c4d5e'.repeat(4)}.png`;

const PAGE = '<!DOCTYPE html><html><head><title>BMW i5</title></head><body>'
  + '<header><a href="/aida/data/wdh-de.json#61HG.head">header link</a></header>'
  + '<main><div>'
  + '<p>Leistung: <a href="/aida/data/wdh-de.json#61HG.power" title="WDH" target="_blank">250 <strong>kW</strong> (340 PS)<!-- note --></a>.</p>'
  + '<p><a href="/aida/data/wdh-de.json#61HG.x&amp;y" class="button">x &amp; y</a></p>'
  + '<p><a href="https://other.example/aida/data/wdh-fr.json#61HG.range">513 km</a></p>'
  + '<p><a href="/aida/data/wdh-de.json">sheet</a> <a href="/de/home#top">home</a> '
  + '<a href="/data/wdh-notes.html">notes</a> <a href="#data/wdh-">frag</a> <a href="./i5.plain.html">rel</a></p>'
  + '</div></main>'
  + '<footer><a href="/aida/data/wdh-de.json#61HG.foot">footer link</a></footer></body></html>';

const PAGE_DECORATED = '<!DOCTYPE html><html><head><title>BMW i5</title></head><body>'
  + '<header><a href="/aida/data/wdh-de.json#61HG.head">header link</a></header>'
  + '<main><div>'
  + '<p>Leistung: <span class="wdh-value" data-wdh="/aida/data/wdh-de.json#61HG.power">250 kW (340 PS)</span>.</p>'
  + '<p><span class="wdh-value" data-wdh="/aida/data/wdh-de.json#61HG.x&amp;y">x &amp; y</span></p>'
  + '<p><span class="wdh-value" data-wdh="https://other.example/aida/data/wdh-fr.json#61HG.range">513 km</span></p>'
  + '<p><a href="/aida/data/wdh-de.json">sheet</a> <a href="/de/home#top">home</a> '
  + '<a href="/data/wdh-notes.html">notes</a> <a href="#data/wdh-">frag</a> <a href="./i5.plain.html">rel</a></p>'
  + '</div></main>'
  + '<footer><a href="/aida/data/wdh-de.json#61HG.foot">footer link</a></footer></body></html>';

const FRAGMENT = '<div><p>Reichweite <a href="/aida/data/wdh-de.json#61HG.electricRange">513–627 km</a> '
  + 'und <a href="/de/home">home</a></p></div>';
const FRAGMENT_DECORATED = '<div><p>Reichweite '
  + '<span class="wdh-value" data-wdh="/aida/data/wdh-de.json#61HG.electricRange">513–627 km</span> '
  + 'und <a href="/de/home">home</a></p></div>';

const WDH_LINK = '<a href="/aida/data/wdh-de.json#61HG.power">250 kW</a>';

// nested inline markup: textContent = "ab c2 <d>" (void elements and comments contribute nothing)
const NESTED = '<html><body><main><p><a href="/aida/data/wdh-de.json#n1"><em>a<strong>b</strong></em> c<br>'
  + '<img src="/x.png" alt="x"><sub>2</sub><!-- c --> &lt;d&gt;</a></p></main></body></html>';
const NESTED_DECORATED = '<html><body><main><p>'
  + '<span class="wdh-value" data-wdh="/aida/data/wdh-de.json#n1">ab c2 &lt;d&gt;</span></p></main></body></html>';

// streamed in tiny chunks: splits inside the start tag, the attribute value, the entity and the
// multi-byte characters (₂, –)
const CHUNKED = '<html><body><main><p>CO₂: <a href="/aida/data/wdh-de.json#61HG.x&amp;y" title="t">0 g/km '
  + '– <strong>A</strong></a> und <a href="/de/home">home</a></p></main></body></html>';
const CHUNKED_DECORATED = '<html><body><main><p>CO₂: '
  + '<span class="wdh-value" data-wdh="/aida/data/wdh-de.json#61HG.x&amp;y">0 g/km – A</span> '
  + 'und <a href="/de/home">home</a></p></main></body></html>';

// > 64 KB of link text: many text chunks inside one decorated link
const LONG_TEXT = 'x'.repeat(70000);
const LONG = `<html><body><main><a href="/aida/data/wdh-de.json#long">${LONG_TEXT}<b>B</b>${LONG_TEXT}</a></main></body></html>`;
const LONG_DECORATED = '<html><body><main><span class="wdh-value" data-wdh="/aida/data/wdh-de.json#long">'
  + `${LONG_TEXT}B${LONG_TEXT}</span></main></body></html>`;

// HTML is case-insensitive and allows unquoted / single-quoted values; the browser matches them all
const CASING = '<html><body><MAIN><p><A HREF="/aida/data/wdh-de.json#u" TITLE="t">upper</A> '
  + '<a href=/aida/data/wdh-de.json#unq>unquoted</a> <a href=\'/aida/data/wdh-de.json#sq\'>single</a></p></MAIN></body></html>';
const CASING_DECORATED = '<html><body><MAIN><p>'
  + '<span class="wdh-value" data-wdh="/aida/data/wdh-de.json#u">upper</span> '
  + '<span class="wdh-value" data-wdh="/aida/data/wdh-de.json#unq">unquoted</span> '
  + '<span class="wdh-value" data-wdh="/aida/data/wdh-de.json#sq">single</span></p></MAIN></body></html>';

/** Body that arrives in 1–7 byte chunks with a pause between them. */
function trickle(text) {
  const bytes = new TextEncoder().encode(text);
  let pos = 0;
  let n = 0;
  return new ReadableStream({
    async pull(controller) {
      if (pos >= bytes.length) { controller.close(); return; }
      await new Promise((resolve) => { setTimeout(resolve, 1); });
      const size = (n % 7) + 1;
      n += 1;
      controller.enqueue(bytes.slice(pos, pos + size));
      pos += size;
    },
  });
}
// PNG signature, then bytes that are not valid UTF-8 / contain "<a "
const PNG = new Uint8Array([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x3c, 0x61, 0x20, 0xff,
]);

const HTML_HEADERS = {
  'content-type': 'text/html; charset=utf-8',
  etag: '"html-etag"',
  'content-md5': 'abc',
  age: '12',
  'cache-control': 'max-age=60, must-revalidate',
  'content-security-policy': "script-src 'nonce-abc' 'strict-dynamic'",
  'last-modified': 'Fri, 02 Oct 2026 06:17:20 GMT',
  'x-robots-tag': 'noindex, nofollow',
  vary: 'Accept-Encoding,X-Forwarded-Host',
};

function defaultUpstream(req) {
  const { pathname } = new URL(req.url);
  const html = (body, status = 200) => new Response(body, {
    status, headers: { ...HTML_HEADERS, 'content-length': String(new TextEncoder().encode(body).length) },
  });
  const raw = (body, type) => new Response(body, { headers: { 'content-type': type, etag: '"raw-etag"' } });
  if (req.headers.get('if-modified-since')) return new Response(null, { status: 304, headers: HTML_HEADERS });
  switch (pathname) {
    case '/aida/de/de/i5': return html(PAGE);
    case '/aida/de/de/i5.plain.html': return html(FRAGMENT);
    case '/aida/data/wdh-de.json': return raw(`{"data":[{"html":"${WDH_LINK.replace(/"/g, '\\"')}"}]}`, 'application/json');
    case '/scripts/x.js': return raw(`const s = '${WDH_LINK}';`, 'text/javascript');
    case '/styles/x.css': return raw(`a[href*="/data/wdh-"] { content: '${WDH_LINK}'; }`, 'text/css');
    case '/aida/de/de/i5.md': return raw(`Leistung: [250 kW](/aida/data/wdh-de.json#61HG.power)\n${WDH_LINK}\n`, 'text/markdown; charset=utf-8');
    case MEDIA: return raw(PNG, 'image/png');
    case '/': return new Response(null, { status: 301, headers: { location: '/de/home' } });
    case '/with-query': return new Response(null, { status: 302, headers: { location: '/de/home?x=1' } });
    case '/absolute': return new Response(null, { status: 301, headers: { location: `https://${ORIGIN}/de/home` } });
    case '/external': return new Response(null, { status: 301, headers: { location: 'https://www.bmw.de/de/home.html' } });
    case '/missing': return html(`<html><body><main>${WDH_LINK}</main></body></html>`, 404);
    case '/nested': return html(NESTED);
    case '/long': return html(LONG);
    case '/casing': return html(CASING);
    case '/chunked': return new Response(trickle(CHUNKED), { headers: { 'content-type': 'text/html; charset=utf-8' } });
    default: return new Response('upstream default', { status: 404, headers: { 'content-type': 'text/plain' } });
  }
}

let calls;
let upstream = defaultUpstream;
const instances = [];

function worker(bindings) {
  const mf = new Miniflare({
    modules: true,
    scriptPath: SCRIPT,
    compatibilityDate: '2025-09-01',
    bindings,
    outboundService: async (req) => {
      calls.push({ url: req.url, method: req.method, headers: Object.fromEntries(req.headers) });
      return upstream(req);
    },
  });
  instances.push(mf);
  return mf;
}

let mf;
const get = (path, init = {}) => mf.dispatchFetch(`${W}${path}`, { redirect: 'manual', ...init });

before(() => { mf = worker({ ORIGIN_HOSTNAME: ORIGIN }); });
after(async () => { await Promise.all(instances.map((i) => i.dispose())); });
beforeEach(() => { calls = []; upstream = defaultUpstream; });

test('HTML page: WDH value links in <main> become wdh-value spans exactly like decorateWdhValues', async () => {
  const res = await get('/aida/de/de/i5');
  assert.equal(res.status, 200);
  assert.equal(await res.text(), PAGE_DECORATED);
});

test('.plain.html served as HTML is decorated too (fragments have no <main>)', async () => {
  const res = await get('/aida/de/de/i5.plain.html');
  assert.equal(res.status, 200);
  assert.equal(await res.text(), FRAGMENT_DECORATED);
});

test('runtime: nested inline markup collapses to the link text (textContent)', async () => {
  assert.equal(await (await get('/nested')).text(), NESTED_DECORATED);
});

test('runtime: a body streamed in tiny chunks (split in tags, attributes, entities, UTF-8) decorates identically', async () => {
  const res = await get('/chunked');
  assert.equal(res.status, 200);
  assert.equal(await res.text(), CHUNKED_DECORATED);
});

test('runtime: very long link text (many text chunks) is kept in full', async () => {
  const text = await (await get('/long')).text();
  assert.equal(text.length, LONG_DECORATED.length);
  assert.equal(text, LONG_DECORATED);
});

test('runtime: uppercase, unquoted and single-quoted markup is matched like the browser does', async () => {
  assert.equal(await (await get('/casing')).text(), CASING_DECORATED);
});

test('decorated HTML drops body-dependent headers and keeps the others', async () => {
  const res = await get('/aida/de/de/i5');
  await res.text();
  ['content-length', 'etag', 'content-md5', 'age'].forEach((h) => assert.equal(res.headers.get(h), null, `${h} kept`));
  assert.equal(res.headers.get('content-type'), HTML_HEADERS['content-type']);
  ['cache-control', 'content-security-policy', 'last-modified', 'x-robots-tag', 'vary']
    .forEach((h) => assert.equal(res.headers.get(h), HTML_HEADERS[h], `${h} changed`));
});

test('non-HTML bodies (JSON, JS, CSS, Markdown, binary) pass through byte-for-byte with their validators', async () => {
  const cases = [['/aida/data/wdh-de.json', 'application/json'], ['/scripts/x.js', 'text/javascript'],
    ['/styles/x.css', 'text/css'], ['/aida/de/de/i5.md', 'text/markdown; charset=utf-8'], [MEDIA, 'image/png']];
  const results = await Promise.all(cases.map(async ([path]) => {
    const res = await get(path);
    return { res, bytes: new Uint8Array(await res.arrayBuffer()) };
  }));
  const expected = await Promise.all(cases.map(async ([path]) => new Uint8Array(
    await defaultUpstream(new Request(`https://${ORIGIN}${path}`)).arrayBuffer(),
  )));
  results.forEach(({ res, bytes }, i) => {
    assert.equal(res.status, 200, cases[i][0]);
    assert.equal(res.headers.get('content-type'), cases[i][1]);
    assert.equal(res.headers.get('etag'), '"raw-etag"', `${cases[i][0]} lost its etag`);
    assert.deepEqual(bytes, expected[i], `${cases[i][0]} body changed`);
  });
});

test('HTML error pages keep their status and are decorated', async () => {
  const res = await get('/missing');
  assert.equal(res.status, 404);
  assert.equal(await res.text(), '<html><body><main><span class="wdh-value" data-wdh="/aida/data/wdh-de.json#61HG.power">250 kW</span></main></body></html>');
});

test('redirects pass through unfollowed; the visitor query is carried over like the origin does', async () => {
  const r1 = await get('/?utm_source=x');
  assert.equal(r1.status, 301);
  assert.equal(r1.headers.get('location'), '/de/home?utm_source=x');
  const r2 = await get('/with-query?utm_source=x');
  assert.equal(r2.status, 302);
  assert.equal(r2.headers.get('location'), '/de/home?x=1');
  const r3 = await get('/absolute');
  assert.equal(r3.status, 301);
  assert.equal(r3.headers.get('location'), '/de/home', 'a Location on the origin host must stay on the proxy host');
  const r4 = await get('/external');
  assert.equal(r4.headers.get('location'), 'https://www.bmw.de/de/home.html');
  assert.equal(calls.length, 4, 'redirects must not be followed by the worker');
});

test('304 Not Modified passes through without a body and without CSP', async () => {
  const res = await get('/aida/de/de/i5', { headers: { 'if-modified-since': 'Fri, 02 Oct 2026 06:17:20 GMT' } });
  assert.equal(res.status, 304);
  assert.equal(await res.text(), '');
  assert.equal(res.headers.get('content-security-policy'), null);
});

test('upstream request: fixed origin host, query stripped for pages, forwarded host, no visitor credentials', async () => {
  await (await get('/aida/de/de/i5?foo=1&bar=2', { headers: { cookie: 'session=1', authorization: 'Bearer secret' } })).text();
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, `https://${ORIGIN}/aida/de/de/i5`);
  assert.equal(calls[0].method, 'GET');
  assert.equal(calls[0].headers['x-forwarded-host'], 'wdh-demo.example.com');
  assert.equal(calls[0].headers['x-byo-cdn-type'], 'cloudflare');
  assert.equal(calls[0].headers.cookie, undefined);
  assert.equal(calls[0].headers.authorization, undefined);
});

test('query allowlists: JSON keeps limit/offset/sheet, media keeps width/height/format/optimize (sorted)', async () => {
  await (await get('/aida/data/wdh-de.json?sheet=de&url=https://evil.example&limit=10&offset=5')).text();
  await (await get(`${MEDIA}?width=750&origin=evil.example&optimize=medium&format=webply`)).arrayBuffer();
  assert.equal(calls[0].url, `https://${ORIGIN}/aida/data/wdh-de.json?limit=10&offset=5&sheet=de`);
  assert.equal(calls[1].url, `https://${ORIGIN}${MEDIA}?format=webply&optimize=medium&width=750`);
});

test('no open proxy: URL-like paths, host-like parameters and a spoofed Host never change the upstream host', async () => {
  await (await get('/https://evil.example/x?host=evil.example&upstream=https://evil.example')).text();
  await (await get('/de/home', { headers: { host: 'evil.example', 'x-forwarded-host': 'evil.example' } })).text();
  await (await get('//evil.example/x')).text(); // protocol-relative path
  assert.equal(calls.length, 3);
  calls.forEach((c) => assert.equal(new URL(c.url).hostname, ORIGIN));
  assert.equal(calls[0].url, `https://${ORIGIN}/https://evil.example/x`);
  assert.equal(calls[1].headers['x-forwarded-host'], 'wdh-demo.example.com');
  assert.equal(calls[2].url, `https://${ORIGIN}//evil.example/x`);
});

test('only GET and HEAD reach the origin', async () => {
  const results = await Promise.all(['POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
    .map((method) => get('/aida/de/de/i5', { method, body: method === 'OPTIONS' ? undefined : 'x' })));
  results.forEach((res) => {
    assert.equal(res.status, 405);
    assert.equal(res.headers.get('allow'), 'GET, HEAD');
  });
  assert.equal(calls.length, 0);
});

test('HEAD on HTML: no body, body-dependent headers dropped', async () => {
  const res = await get('/aida/de/de/i5', { method: 'HEAD' });
  assert.equal(res.status, 200);
  assert.equal(await res.text(), '');
  assert.equal(res.headers.get('content-length'), null);
  assert.equal(res.headers.get('etag'), null);
  assert.equal(calls[0].method, 'HEAD');
});

test('ORIGIN_HOSTNAME: defaults to main, accepts other BMW site refs, refuses anything else before any upstream request', async () => {
  const dflt = worker({});
  await (await dflt.dispatchFetch(`${W}/aida/de/de/i5`)).text();
  assert.equal(new URL(calls[0].url).hostname, ORIGIN);
  const live = worker({ ORIGIN_HOSTNAME: 'aida--bmw--moved-permanently.aem.live' });
  await (await live.dispatchFetch(`${W}/aida/de/de/i5`)).text();
  assert.equal(new URL(calls[1].url).hostname, 'aida--bmw--moved-permanently.aem.live');
  const bad = ['evil.example', 'main--other--moved-permanently.aem.page', 'main--bmw--moved-permanently.aem.page.evil.example',
    'main--bmw--moved-permanently.aem.page:8080', 'user@main--bmw--moved-permanently.aem.page'];
  const responses = await Promise.all(bad.map((h) => worker({ ORIGIN_HOSTNAME: h }).dispatchFetch(`${W}/aida/de/de/i5`)));
  await Promise.all(responses.map(async (res, i) => {
    assert.equal(res.status, 500, bad[i]);
    assert.match(await res.text(), /Invalid ORIGIN_HOSTNAME/);
  }));
  assert.equal(calls.length, 2, 'an invalid ORIGIN_HOSTNAME must not reach any upstream');
});
