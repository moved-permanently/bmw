/*
 * wdh-proxy: Cloudflare Worker in front of ONE BMW EDS origin (env ORIGIN_HOSTNAME, default
 * main--bmw--moved-permanently.aem.page). GET/HEAD are proxied to that fixed host; nothing in the
 * request can choose another upstream.
 *
 * HTML responses get the WDH value-link decoration of scripts/scripts.js decorateWdhValues()
 * applied server-side: every a[href*="/data/wdh-"][href*="#"] becomes
 * <span class="wdh-value" data-wdh="{href attribute}">{the link's text}</span> (inner markup and
 * comments dropped, other attributes dropped). Pages: inside <main> (as decorateMain(main));
 * .plain.html fragments: the whole document (blocks/fragment.js runs decorateMain on it).
 * The browser decorator stays as the fallback; on decorated HTML it finds no links.
 * Only the authored links are cleaned up; no WDH values are fetched or resolved here.
 * Non-HTML bodies (JSON, JS, CSS, Markdown, media, ...) pass through untouched.
 *
 * Request handling follows adobe/aem-cloudflare-prod-worker (query allowlists, X-Forwarded-Host,
 * X-BYO-CDN-Type, 301 query carry-over, 304 without CSP), adapted for a preview demo: /drafts/
 * stays reachable, no port redirect (wrangler dev), no push invalidation, x-robots-tag kept.
 */
/* global HTMLRewriter */

const DEFAULT_ORIGIN = 'main--bmw--moved-permanently.aem.page';
// only refs of this site on aem.page / aem.live
const ORIGIN_RE = /^[a-z0-9-]+--bmw--moved-permanently\.aem\.(?:page|live)$/;
const WDH_LINK = 'a[href*="/data/wdh-"][href*="#"]';
const MEDIA_RE = /\/media_[0-9a-f]{40,}[/a-zA-Z0-9_-]*\.[0-9a-z]+$/;
const MEDIA_PARAMS = ['format', 'height', 'optimize', 'width'];
const JSON_PARAMS = ['limit', 'offset', 'sheet'];
// headers that describe the upstream body bytes and are wrong once the HTML is rewritten
const BODY_HEADERS = ['content-length', 'etag', 'content-md5'];
// visitor credentials are never forwarded to the origin
const DROPPED_REQUEST_HEADERS = ['authorization', 'cookie'];

const getExtension = (path) => {
  const basename = path.split('/').pop();
  const pos = basename.lastIndexOf('.');
  return (basename === '' || pos < 1) ? '' : basename.slice(pos + 1);
};

/** Upstream URL: same path, origin host, query reduced to what EDS uses. */
function upstreamUrl(requestUrl, origin) {
  const url = new URL(requestUrl);
  url.protocol = 'https:';
  url.username = '';
  url.password = '';
  url.hostname = origin;
  url.port = '';
  const { searchParams } = url;
  const keep = MEDIA_RE.test(url.pathname) ? MEDIA_PARAMS
    : (getExtension(url.pathname) === 'json' && JSON_PARAMS) || [];
  [...searchParams.keys()].forEach((key) => { if (!keep.includes(key)) searchParams.delete(key); });
  searchParams.sort();
  url.hash = '';
  return url;
}

/** The decorateWdhValues() equivalent; `scope` limits it to <main> for full pages. */
function decorateWdhLinks(response, scope) {
  const selector = scope ? `${scope} ${WDH_LINK}` : WDH_LINK;
  return new HTMLRewriter()
    .on(selector, {
      element(el) {
        const href = el.getAttribute('href');
        [...el.attributes].forEach(([name]) => el.removeAttribute(name));
        el.tagName = 'span';
        el.setAttribute('class', 'wdh-value');
        el.setAttribute('data-wdh', href);
      },
      comments(comment) { comment.remove(); },
    })
    // a.textContent: keep only the text of nested elements
    .on(`${selector} *`, {
      element(el) { el.removeAndKeepContent(); },
    })
    .transform(response);
}

async function handleRequest(request, env) {
  const origin = env.ORIGIN_HOSTNAME ?? DEFAULT_ORIGIN;
  if (typeof origin !== 'string' || !ORIGIN_RE.test(origin)) {
    return new Response('Invalid ORIGIN_HOSTNAME', { status: 500 });
  }
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return new Response('Method Not Allowed', { status: 405, headers: { allow: 'GET, HEAD' } });
  }

  const url = new URL(request.url);
  const target = upstreamUrl(url, origin);
  const headers = new Headers(request.headers);
  DROPPED_REQUEST_HEADERS.forEach((h) => headers.delete(h));
  headers.set('x-forwarded-host', url.host);
  headers.set('x-byo-cdn-type', 'cloudflare');

  let upstream;
  try {
    upstream = await fetch(target, {
      method: request.method,
      headers,
      redirect: 'manual',
      // HTML is not cached by default; the origin's Cache-Control decides the TTL
      cf: { cacheEverything: true },
    });
  } catch {
    return new Response('Bad Gateway', { status: 502 });
  }

  const response = new Response(upstream.body, upstream);
  response.headers.delete('age');

  const location = response.headers.get('location');
  if (location) {
    let next = location;
    // keep visitors on the proxy host when the origin answers with an absolute own URL
    if (next.startsWith(`https://${origin}/`)) next = next.substring(`https://${origin}`.length);
    if (response.status === 301 && url.search && !next.includes('?')) next = `${next}${url.search}`;
    if (next !== location) response.headers.set('location', next);
  }
  if (response.status === 304) {
    response.headers.delete('content-security-policy');
    return response;
  }

  const type = (response.headers.get('content-type') || '').toLowerCase();
  if (!type.startsWith('text/html') || response.status === 204) return response;
  BODY_HEADERS.forEach((h) => response.headers.delete(h));
  if (request.method === 'HEAD' || !response.body) return response;
  return decorateWdhLinks(response, url.pathname.endsWith('.plain.html') ? '' : 'main');
}

export default {
  fetch: handleRequest,
};
