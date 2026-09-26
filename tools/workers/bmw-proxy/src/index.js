/*
 * bmw-proxy: allowlisted, path-preserving reverse proxy to www.bmw.de (and a few other BMW
 * upstreams) for browser code running on the AEM Edge Delivery hosts of the bmw.de replica.
 * See ../README.md and ./routes.js.
 *
 * Env (wrangler.toml [vars] or dashboard):
 *   ALLOWED_ORIGINS      comma separated origins, `*` wildcard per label (default: see cors.js)
 *   REQUIRE_ORIGIN       "true" -> reject requests without Origin header
 *                        (default: allow, e.g. curl, <script src> without crossorigin)
 *   UPSTREAM_TIMEOUT_MS  per upstream hop (default 15000)
 *   CACHE                "off" disables the edge cache (default on)
 */
import {
  ROUTES, UPSTREAM_HOSTS, resolveUpstream, findRoute,
} from './routes.js';
import {
  parseAllowedOrigins, isAllowedOrigin, corsHeaders, preflightHeaders,
} from './cors.js';
import { EXTRACTORS } from './extract.js';

const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36';
const ACCEPT_LANGUAGE = 'de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7';
const MAX_REDIRECTS = 5;
const MAX_BODY = 64 * 1024;
const PASS_HEADERS = ['content-type', 'content-language', 'last-modified', 'etag'];
const POST_TYPES = /^(application\/json|text\/plain)\b/i;

function json(status, body, headers = {}) {
  return new Response(`${JSON.stringify(body)}\n`, {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      ...headers,
    },
  });
}

function error(status, code, message, headers = {}, extra = {}) {
  return json(status, {
    error: code, status, message, ...extra,
  }, headers);
}

function methodsOf(route) {
  return route.methods.includes('GET') ? [...route.methods, 'HEAD'] : route.methods;
}

/**
 * Query string forwarded upstream (sorted, so it doubles as cache key part).
 */
export function upstreamQuery(route, searchParams) {
  const params = new URLSearchParams();
  if (route.query === 'drop') return params;
  const allow = Array.isArray(route.query) ? route.query : null;
  const drop = ['extract', ...(route.dropParams || [])];
  [...searchParams.entries()]
    .filter(([k]) => !drop.includes(k) && (!allow || allow.includes(k)))
    .sort(([a], [b]) => (a < b ? -1 : Number(a > b)))
    .forEach(([k, v]) => params.append(k, v));
  return params;
}

function upstreamHeaders(route, host, method, body, contentType, request) {
  const crossSite = host !== 'www.bmw.de';
  const headers = {
    'User-Agent': USER_AGENT,
    Accept: '*/*',
    'Accept-Language': ACCEPT_LANGUAGE,
    Referer: 'https://www.bmw.de/',
    'Sec-Fetch-Site': crossSite ? 'cross-site' : 'same-origin',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Dest': 'empty',
  };
  // browsers send Origin on cross-origin and non-GET requests only
  if (crossSite || method !== 'GET') headers.Origin = 'https://www.bmw.de';
  if (body !== undefined) headers['Content-Type'] = contentType;
  // explicitly allow-listed request headers (e.g. tenantId/language/brand for the AI chat API)
  (route.forwardHeaders || []).forEach((name) => {
    const v = request?.headers.get(name);
    if (v && /^[\x20-\x7e]{1,200}$/.test(v)) headers[name] = v;
  });
  return { ...headers, ...(route.headers || {}) };
}

async function sha256(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * fetch with manual redirect handling: only https redirects to known upstream hosts are followed.
 */
async function fetchUpstream(target, init, timeoutMs, hops = 0) {
  const res = await fetch(target, {
    ...init,
    redirect: 'manual',
    signal: AbortSignal.timeout(timeoutMs),
  });
  if (![301, 302, 303, 307, 308].includes(res.status) || !res.headers.get('location')) return res;
  if (hops >= MAX_REDIRECTS) throw Object.assign(new Error('too many redirects'), { code: 'redirect_loop' });
  const next = new URL(res.headers.get('location'), target);
  if (next.protocol !== 'https:' || !UPSTREAM_HOSTS.includes(next.hostname)) {
    throw Object.assign(new Error(`redirect to ${next.origin} not allowed`), { code: 'redirect_not_allowed' });
  }
  const keepMethod = [307, 308].includes(res.status);
  const nextInit = keepMethod ? init : { ...init, method: 'GET', body: undefined };
  if (!keepMethod) {
    const { 'Content-Type': ct, ...rest } = init.headers;
    nextInit.headers = rest;
  }
  return fetchUpstream(next.href, nextInit, timeoutMs, hops + 1);
}

function getCache(env) {
  if (env.CACHE === 'off') return null;
  return globalThis.caches?.default || null;
}

function withHeaders(response, headers) {
  const res = new Response(response.body, response);
  Object.entries(headers).forEach(([k, v]) => res.headers.set(k, v));
  return res;
}

async function proxy(request, env, ctx, url, route, host, path, cors) {
  const extract = url.searchParams.get('extract');
  if (extract && !(route.extract || []).includes(extract)) {
    return error(400, 'bad_extract', `extract=${extract} is not supported on this route`, cors);
  }

  let body;
  let contentType;
  if (request.method === 'POST') {
    contentType = request.headers.get('content-type') || 'application/json';
    if (!POST_TYPES.test(contentType)) {
      return error(415, 'unsupported_media_type', 'POST body must be application/json or text/plain', cors);
    }
    body = await request.text();
    if (body.length > MAX_BODY) return error(413, 'payload_too_large', `max ${MAX_BODY} bytes`, cors);
  }

  const query = upstreamQuery(route, url.searchParams);
  const qs = query.toString();
  const target = `https://${host}${path}${qs ? `?${qs}` : ''}`;
  const ttl = route.ttl || 0;
  const isRead = request.method === 'GET' || request.method === 'HEAD';
  const cache = ttl > 0 && (isRead || (route.cachePost && request.method === 'POST')) ? getCache(env) : null;

  let cacheKey;
  if (cache) {
    const keyParams = new URLSearchParams(query);
    if (extract) keyParams.set('~extract', extract);
    if (body !== undefined) keyParams.set('~body', await sha256(`${contentType}\n${body}`));
    cacheKey = new Request(`${url.origin}/~cache/${host}${path}?${keyParams}`, { method: 'GET' });
    const hit = await cache.match(cacheKey);
    if (hit) {
      const res = withHeaders(hit, { ...cors, 'X-Proxy-Cache': 'HIT', 'X-Proxy-Route': route.id });
      return request.method === 'HEAD' ? new Response(null, res) : res;
    }
  }

  const method = request.method === 'HEAD' ? 'GET' : request.method;
  const init = {
    method,
    headers: upstreamHeaders(route, host, method, body, contentType, request),
    body,
  };
  if (method === 'GET' && ttl > 0) {
    init.cf = { cacheEverything: true, cacheTtlByStatus: { '200-299': ttl, '300-599': 0 } };
  }

  let upstream;
  try {
    upstream = await fetchUpstream(target, init, Number(env.UPSTREAM_TIMEOUT_MS) || 15000);
  } catch (e) {
    if (e.name === 'TimeoutError' || e.name === 'AbortError') {
      return error(504, 'upstream_timeout', `no answer from ${host}`, cors, { route: route.id });
    }
    return error(502, e.code || 'upstream_unreachable', e.message, cors, { route: route.id });
  }

  const meta = { 'X-Proxy-Route': route.id, 'X-Upstream-Status': String(upstream.status) };
  if (upstream.status >= 400) {
    return error(upstream.status, 'upstream_error', `${host} answered ${upstream.status}`, { ...cors, ...meta }, {
      route: route.id, upstreamStatus: upstream.status,
    });
  }
  if (upstream.status >= 300) {
    return error(502, 'upstream_redirect', `unfollowed redirect ${upstream.status}`, { ...cors, ...meta }, { route: route.id });
  }

  const headers = new Headers();
  PASS_HEADERS.forEach((h) => {
    const v = upstream.headers.get(h);
    if (v) headers.set(h, v);
  });
  headers.set('Cache-Control', ttl > 0 ? `public, max-age=${ttl}` : 'no-store');
  headers.set('X-Content-Type-Options', 'nosniff');
  Object.entries(meta).forEach(([k, v]) => headers.set(k, v));

  let payload = upstream.body;
  if (extract) {
    const html = await upstream.text();
    const fragment = EXTRACTORS[extract](html);
    if (fragment === null) {
      return error(502, 'extract_failed', `marker for extract=${extract} not found in upstream HTML`, { ...cors, ...meta }, { route: route.id });
    }
    payload = fragment;
    headers.set('Content-Type', 'text/html; charset=utf-8');
    headers.delete('etag');
    headers.set('X-Proxy-Extract', extract);
  }

  let res = new Response(payload, { status: upstream.status, headers });
  if (cache && upstream.status === 200) {
    const put = cache.put(cacheKey, res.clone());
    if (ctx && typeof ctx.waitUntil === 'function') ctx.waitUntil(put);
    else await put;
  }
  res = withHeaders(res, { ...cors, 'X-Proxy-Cache': cache ? 'MISS' : 'BYPASS' });
  return request.method === 'HEAD' ? new Response(null, res) : res;
}

export async function handleRequest(request, env = {}, ctx = {}) {
  const url = new URL(request.url);
  const origin = request.headers.get('Origin');
  const originOk = isAllowedOrigin(origin, parseAllowedOrigins(env.ALLOWED_ORIGINS));
  const cors = originOk ? corsHeaders(origin) : {};

  if (origin && !originOk) {
    return error(403, 'origin_not_allowed', `origin ${origin} is not allowed`);
  }
  if (!origin && env.REQUIRE_ORIGIN === 'true') {
    return error(403, 'origin_required', 'requests must carry an allowed Origin header');
  }

  if (url.pathname === '/_health' || url.pathname === '/') {
    return json(200, {
      ok: true,
      service: 'bmw-proxy',
      routes: ROUTES.map((r) => ({
        id: r.id, host: r.host, path: r.path.source, methods: methodsOf(r), ttl: r.ttl || 0,
      })),
    }, cors);
  }

  if (/\/\/|\/\.\.?(\/|$)|%2e|%2f|%5c|\\/i.test(url.pathname)) {
    return error(403, 'not_allowlisted', 'path not allowed', cors);
  }
  const { host, path } = resolveUpstream(url.pathname);
  const route = findRoute(host, path);
  if (!route) {
    return error(403, 'not_allowlisted', `https://${host}${path} is not on the allowlist`, cors);
  }

  const methods = methodsOf(route);
  if (request.method === 'OPTIONS') {
    const wanted = request.headers.get('Access-Control-Request-Method');
    if (!originOk) return error(403, 'origin_not_allowed', 'preflight without allowed Origin');
    if (wanted && !methods.includes(wanted.toUpperCase())) {
      return error(405, 'method_not_allowed', `${wanted} not allowed`, { ...cors, Allow: methods.join(', ') });
    }
    return new Response(null, {
      status: 204,
      headers: preflightHeaders(origin, methods, request.headers.get('Access-Control-Request-Headers')),
    });
  }
  if (!methods.includes(request.method)) {
    return error(405, 'method_not_allowed', `${request.method} not allowed`, { ...cors, Allow: methods.join(', ') });
  }

  try {
    return await proxy(request, env, ctx, url, route, host, path, cors);
  } catch (e) {
    return error(500, 'internal_error', e.message, cors);
  }
}

export default {
  fetch: handleRequest,
};
