import {
  test, describe, beforeEach, afterEach,
} from 'node:test';
import assert from 'node:assert/strict';
import worker from '../src/index.js';

const W = 'https://bmw-proxy.moved-permanently.workers.dev';
const PREVIEW = 'https://main--bmw--moved-permanently.aem.page';

let calls;
let responder;
let store;
const realFetch = globalThis.fetch;

function mockCaches() {
  store = new Map();
  globalThis.caches = {
    default: {
      match: async (req) => {
        const hit = store.get(req.url);
        return hit ? hit.clone() : undefined;
      },
      put: async (req, res) => { store.set(req.url, res.clone()); },
    },
  };
}

beforeEach(() => {
  calls = [];
  responder = () => new Response('ok', { status: 200, headers: { 'content-type': 'text/plain' } });
  globalThis.fetch = async (url, init = {}) => {
    calls.push({ url: String(url), init });
    return responder(String(url), init);
  };
  mockCaches();
});

afterEach(() => {
  globalThis.fetch = realFetch;
  delete globalThis.caches;
});

const call = (path, init = {}, env = {}) => worker.fetch(new Request(`${W}${path}`, init), env, {});
const readJson = async (res) => JSON.parse(await res.text());

describe('allowlist', () => {
  test('health endpoint lists routes', async () => {
    const res = await call('/_health');
    assert.equal(res.status, 200);
    const body = await readJson(res);
    assert.ok(body.routes.some((r) => r.id === 'compare-fragment'));
    assert.equal(calls.length, 0);
  });

  test('non-allowlisted bmw.de path -> 403 JSON, no upstream call', async () => {
    const res = await call('/de/index.html');
    assert.equal(res.status, 403);
    assert.match(res.headers.get('content-type'), /application\/json/);
    const body = await readJson(res);
    assert.equal(body.error, 'not_allowlisted');
    assert.equal(body.status, 403);
    assert.equal(calls.length, 0);
  });

  test('unknown host prefix is treated as bmw.de path and rejected', async () => {
    const res = await call('/evil.example.com/de-de/login/bmw/api/flyout/data');
    assert.equal(res.status, 403);
    assert.equal(calls.length, 0);
  });

  test('path traversal is normalised / rejected', async () => {
    const r1 = await call('/de-de/login/bmw/api/flyout/data/../../../../../de/index.html');
    assert.equal(r1.status, 403);
    const r2 = await call('/content/dam/bmw/marketDE/bmw_de/datastore/%2e%2e/x.csv');
    assert.equal(r2.status, 403);
    const r3 = await call('/content/dam/bmw/marketDE/bmw_de/datastore//x.csv');
    assert.equal(r3.status, 403);
    assert.equal(calls.length, 0);
  });

  test('wrong method on a GET route -> 405 with Allow', async () => {
    const res = await call('/de-de/login/bmw/api/flyout/data', { method: 'POST', body: '{}', headers: { 'content-type': 'application/json' } });
    assert.equal(res.status, 405);
    assert.match(res.headers.get('allow'), /GET/);
    assert.equal(calls.length, 0);
  });

  test('unsupported extract -> 400', async () => {
    const res = await call('/de-de/login/bmw/api/flyout/data?extract=compare');
    assert.equal(res.status, 400);
  });
});

describe('upstream request', () => {
  test('path-preserving flyout with browser-like headers, no cookies', async () => {
    responder = () => new Response('{"a":1}', {
      status: 200,
      headers: { 'content-type': 'application/json', 'set-cookie': 'akm=1; Path=/', 'x-internal': 'y' },
    });
    const res = await call('/de-de/login/bmw/api/flyout/data?foo=bar', {
      headers: { Origin: PREVIEW, Cookie: 'session=secret' },
    });
    assert.equal(res.status, 200);
    assert.equal(calls.length, 1);
    assert.equal(calls[0].url, 'https://www.bmw.de/de-de/login/bmw/api/flyout/data');
    const h = calls[0].init.headers;
    assert.match(h['User-Agent'], /Chrome/);
    assert.match(h['Accept-Language'], /^de-DE/);
    assert.equal(h.Referer, 'https://www.bmw.de/');
    assert.equal(h.Origin, undefined); // same-origin GET: browsers send no Origin
    assert.ok(!Object.keys(h).some((k) => k.toLowerCase() === 'cookie'));
    assert.equal(calls[0].init.redirect, 'manual');
    assert.equal(res.headers.get('set-cookie'), null);
    assert.equal(res.headers.get('x-internal'), null);
    assert.equal(res.headers.get('access-control-allow-origin'), PREVIEW);
    assert.equal(res.headers.get('cache-control'), 'public, max-age=300');
    assert.equal(await res.text(), '{"a":1}');
  });

  test('datastore CSV is cached for a day and served from cache the 2nd time', async () => {
    responder = () => new Response('a;b\n1;2\n', { status: 200, headers: { 'content-type': 'text/csv' } });
    const p = '/content/dam/bmw/marketDE/bmw_de/datastore/17012022_BMW_OTV.csv';
    const r1 = await call(p);
    assert.equal(r1.status, 200);
    assert.equal(r1.headers.get('cache-control'), 'public, max-age=86400');
    assert.equal(r1.headers.get('x-proxy-cache'), 'MISS');
    assert.equal(await r1.text(), 'a;b\n1;2\n');
    const r2 = await call(p, { headers: { Origin: 'http://localhost:3000' } });
    assert.equal(r2.headers.get('x-proxy-cache'), 'HIT');
    assert.equal(r2.headers.get('access-control-allow-origin'), 'http://localhost:3000');
    assert.equal(await r2.text(), 'a;b\n1;2\n');
    assert.equal(calls.length, 1);
    assert.equal(calls[0].url, `https://www.bmw.de${p}`);
  });

  test('CACHE=off bypasses the cache', async () => {
    const p = '/content/dam/bmw/marketDE/bmw_de/datastore/x.csv';
    await call(p, {}, { CACHE: 'off' });
    const r2 = await call(p, {}, { CACHE: 'off' });
    assert.equal(r2.headers.get('x-proxy-cache'), 'BYPASS');
    assert.equal(calls.length, 2);
  });

  test('upstream errors are not cached and returned as JSON with upstream status', async () => {
    responder = () => new Response('<html>Access Denied</html>', { status: 403 });
    const p = '/content/dam/bmw/marketDE/bmw_de/datastore/x.csv';
    const r1 = await call(p);
    assert.equal(r1.status, 403);
    const body = await readJson(r1);
    assert.equal(body.error, 'upstream_error');
    assert.equal(body.upstreamStatus, 403);
    assert.equal(r1.headers.get('cache-control'), 'no-store');
    await call(p);
    assert.equal(calls.length, 2);
  });

  test('network failure -> 502 JSON', async () => {
    responder = () => { throw new TypeError('fetch failed'); };
    const res = await call('/de-de/login/bmw/api/flyout/data');
    assert.equal(res.status, 502);
    assert.equal((await readJson(res)).error, 'upstream_unreachable');
  });

  test('timeout -> 504 JSON', async () => {
    responder = () => { throw new DOMException('timeout', 'TimeoutError'); };
    const res = await call('/de-de/login/bmw/api/flyout/data');
    assert.equal(res.status, 504);
  });

  test('redirects on upstream hosts are followed', async () => {
    responder = (url) => (url.endsWith('/old.csv')
      ? new Response(null, { status: 301, headers: { location: '/content/dam/bmw/marketDE/bmw_de/datastore/new.csv' } })
      : new Response('new', { status: 200 }));
    const res = await call('/content/dam/bmw/marketDE/bmw_de/datastore/old.csv');
    assert.equal(res.status, 200);
    assert.equal(await res.text(), 'new');
    assert.equal(calls[1].url, 'https://www.bmw.de/content/dam/bmw/marketDE/bmw_de/datastore/new.csv');
  });

  test('redirects to foreign hosts are refused', async () => {
    responder = () => new Response(null, { status: 302, headers: { location: 'https://evil.example.com/x' } });
    const res = await call('/content/dam/bmw/marketDE/bmw_de/datastore/old.csv');
    assert.equal(res.status, 502);
    assert.equal((await readJson(res)).error, 'redirect_not_allowed');
    assert.equal(calls.length, 1);
  });

  test('HEAD returns headers without body', async () => {
    const res = await call('/content/dam/bmw/marketDE/bmw_de/datastore/x.csv', { method: 'HEAD' });
    assert.equal(res.status, 200);
    assert.equal(await res.text(), '');
    assert.equal(calls[0].init.method, 'GET');
  });
});

describe('other upstreams', () => {
  test('stock locator config: cache buster t is dropped, other params kept', async () => {
    await call('/de-de/sl/stocklocator/_jcr_content/stocklocator.config.json?t=1790436971354&brand=BMW');
    assert.equal(calls[0].url, 'https://www.bmw.de/de-de/sl/stocklocator/_jcr_content/stocklocator.config.json?brand=BMW');
    assert.equal(calls[0].init.headers.Referer, 'https://www.bmw.de/de-de/sl/stocklocator');
  });

  test('stolo dealer service via host prefix', async () => {
    await call('/stolo-data-service.prod.stolo.eu-central-1.aws.bmw.cloud/dealer/showAll?country=DE&category=BM&clientid=66_STOCK_DLO&language=de_DE&stl=true');
    assert.equal(calls[0].url, 'https://stolo-data-service.prod.stolo.eu-central-1.aws.bmw.cloud/dealer/showAll?category=BM&clientid=66_STOCK_DLO&country=DE&language=de_DE&stl=true');
    assert.equal(calls[0].init.headers.Origin, 'https://www.bmw.de');
    assert.equal(calls[0].init.headers['Sec-Fetch-Site'], 'cross-site');
  });

  test('vehicle search POST: body forwarded, cached by body hash', async () => {
    responder = () => new Response('{"hits":[]}', { status: 200, headers: { 'content-type': 'application/json' } });
    const p = '/vehicle-selection.prod.stolo.eu-central-1.aws.bmw.cloud/vehiclesearch/search/de-de/stocklocator?maxResults=5&brand=BMW&context=preview-slider';
    const post = (b) => call(p, { method: 'POST', body: b, headers: { 'content-type': 'application/json', Origin: PREVIEW } });
    const r1 = await post('{"a":1}');
    assert.equal(r1.status, 200);
    assert.equal(calls[0].init.method, 'POST');
    assert.equal(calls[0].init.body, '{"a":1}');
    assert.equal(calls[0].init.headers['Content-Type'], 'application/json');
    assert.equal(calls[0].init.headers.Origin, 'https://www.bmw.de');
    const r2 = await post('{"a":1}');
    assert.equal(r2.headers.get('x-proxy-cache'), 'HIT');
    await post('{"a":2}');
    assert.equal(calls.length, 2);
  });

  test('POST with a form content type -> 415', async () => {
    const res = await call('/vehicle-selection.prod.stolo.eu-central-1.aws.bmw.cloud/vehiclesearch/search/de-de/stocklocator', {
      method: 'POST', body: 'a=1', headers: { 'content-type': 'application/x-www-form-urlencoded' },
    });
    assert.equal(res.status, 415);
  });

  test('sf-mco gateway API', async () => {
    const res = await call('/sf-mco.aws.bmw.cloud/display-service/DE/bmwCar/de/STOCKLOCATOR/errorCodes.json');
    assert.equal(res.status, 200);
    assert.equal(calls[0].url, 'https://sf-mco.aws.bmw.cloud/display-service/DE/bmwCar/de/STOCKLOCATOR/errorCodes.json');
    const bad = await call('/sf-mco.aws.bmw.cloud/frontend-components/STOCKLOCATOR/fs_mco_bundle.js');
    assert.equal(bad.status, 403);
  });

  test('ePaaS resources on bmw.de and bmw.com', async () => {
    responder = () => new Response('/* js */', { status: 200, headers: { 'content-type': 'application/javascript' } });
    await call('/etc/clientlibs/epaas/content/bmw/marketDE/bmw_de/de_DE.epaasclientlibinclude.js');
    await call('/www.bmw.com/etc/clientlibs/wcmp/consentcontroller.fallback/epaas.js');
    await call('/www.bmw.com/epaas/v2/epaas.js');
    assert.deepEqual(calls.map((c) => c.url), [
      'https://www.bmw.de/etc/clientlibs/epaas/content/bmw/marketDE/bmw_de/de_DE.epaasclientlibinclude.js',
      'https://www.bmw.com/etc/clientlibs/wcmp/consentcontroller.fallback/epaas.js',
      'https://www.bmw.com/epaas/v2/epaas.js',
    ]);
    const bad = await call('/www.bmw.com/de/index.html');
    assert.equal(bad.status, 403);
  });
});

describe('CORS', () => {
  const flyout = '/de-de/login/bmw/api/flyout/data';

  test('branch preview, live and localhost origins are reflected', async () => {
    const origins = [
      'https://main--bmw--moved-permanently.aem.page',
      'https://feature-x--bmw--moved-permanently.aem.page',
      'https://main--bmw--moved-permanently.aem.live',
      'http://localhost:3000',
    ];
    const results = await Promise.all(origins.map((o) => call(flyout, { headers: { Origin: o } })));
    results.forEach((r, i) => {
      assert.equal(r.status, 200);
      assert.equal(r.headers.get('access-control-allow-origin'), origins[i]);
      assert.equal(r.headers.get('vary'), 'Origin');
    });
  });

  test('foreign origins are rejected with 403', async () => {
    const bad = [
      'https://evil.example.com',
      'https://main--bmw--moved-permanently.aem.page.evil.com',
      'https://a.b--bmw--moved-permanently.aem.page',
      'http://main--bmw--moved-permanently.aem.page',
      'http://localhost:3001',
    ];
    const results = await Promise.all(bad.map((o) => call(flyout, { headers: { Origin: o } })));
    results.forEach((r) => {
      assert.equal(r.status, 403);
      assert.equal(r.headers.get('access-control-allow-origin'), null);
    });
    assert.equal(calls.length, 0);
  });

  test('ALLOWED_ORIGINS env overrides the default', async () => {
    const env = { ALLOWED_ORIGINS: 'https://www.example.org, https://*.example.net' };
    const ok = await call(flyout, { headers: { Origin: 'https://cdn.example.net' } }, env);
    assert.equal(ok.headers.get('access-control-allow-origin'), 'https://cdn.example.net');
    const no = await call(flyout, { headers: { Origin: PREVIEW } }, env);
    assert.equal(no.status, 403);
  });

  test('REQUIRE_ORIGIN=true rejects requests without Origin', async () => {
    const res = await call(flyout, {}, { REQUIRE_ORIGIN: 'true' });
    assert.equal(res.status, 403);
  });

  test('preflight for an allowed route', async () => {
    const res = await call('/vehicle-selection.prod.stolo.eu-central-1.aws.bmw.cloud/vehiclesearch/search/de-de/stocklocator', {
      method: 'OPTIONS',
      headers: {
        Origin: PREVIEW,
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'content-type, x-foo',
      },
    });
    assert.equal(res.status, 204);
    assert.equal(res.headers.get('access-control-allow-origin'), PREVIEW);
    assert.match(res.headers.get('access-control-allow-methods'), /POST/);
    assert.equal(res.headers.get('access-control-allow-headers'), 'content-type, x-foo');
    assert.equal(res.headers.get('access-control-max-age'), '86400');
    assert.equal(calls.length, 0);
  });

  test('preflight for a disallowed method / path / origin', async () => {
    const m = await call(flyout, { method: 'OPTIONS', headers: { Origin: PREVIEW, 'Access-Control-Request-Method': 'DELETE' } });
    assert.equal(m.status, 405);
    const p = await call('/de/index.html', { method: 'OPTIONS', headers: { Origin: PREVIEW, 'Access-Control-Request-Method': 'GET' } });
    assert.equal(p.status, 403);
    const o = await call(flyout, { method: 'OPTIONS', headers: { Origin: 'https://evil.example.com', 'Access-Control-Request-Method': 'GET' } });
    assert.equal(o.status, 403);
  });
});

describe('compare tech data + AI assistant routes', () => {
  test('compare technical data JSON is proxied to www.bmw.de', async () => {
    const res = await call('/de/bmw-modelle-vergleichen/_jcr_content.technicaldata.3.G20.28FF.json', { headers: { Origin: PREVIEW } });
    assert.equal(res.status, 200);
    assert.equal(calls[0].url, 'https://www.bmw.de/de/bmw-modelle-vergleichen/_jcr_content.technicaldata.3.G20.28FF.json');
  });

  test('AI assistant POST forwards only allow-listed headers and sends bmw.de origin', async () => {
    const res = await call('/crm-il-api-prod.bmwgroup.com/ckm-genai-chat-prod-api/api/v1/chat', {
      method: 'POST',
      headers: {
        Origin: PREVIEW, 'content-type': 'application/json', tenantId: 'bmw-de', language: 'de', brand: 'bmw', Cookie: 'x=1', 'X-Evil': '1',
      },
      body: JSON.stringify({ q: 'Hallo' }),
    });
    assert.equal(res.status, 200);
    const { url, init } = calls[0];
    assert.equal(url, 'https://crm-il-api-prod.bmwgroup.com/ckm-genai-chat-prod-api/api/v1/chat');
    assert.equal(init.headers.tenantId, 'bmw-de');
    assert.equal(init.headers.language, 'de');
    assert.equal(init.headers.brand, 'bmw');
    assert.equal(init.headers.Origin, 'https://www.bmw.de');
    assert.equal(init.headers.Cookie, undefined);
    assert.equal(init.headers['X-Evil'], undefined);
  });
});
