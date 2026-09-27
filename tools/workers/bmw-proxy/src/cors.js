/*
 * CORS helpers. ALLOWED_ORIGINS is a comma (or whitespace) separated list of origins;
 * `*` matches one DNS label fragment ([a-z0-9-]+), so it can never match a dot or a port.
 *   https://*--bmw--moved-permanently.aem.page  matches  https://main--bmw--moved-permanently.aem.page
 *                                              and       https://feat-x--bmw--moved-permanently.aem.page
 */

export const DEFAULT_ALLOWED_ORIGINS = [
  'https://*--bmw--moved-permanently.aem.page',
  'https://*--bmw--moved-permanently.aem.live',
  'http://localhost:3000',
];

const escapeRe = (s) => s.replace(/[.+?^${}()|[\]\\]/g, '\\$&');

/**
 * @param {string|undefined} value env.ALLOWED_ORIGINS
 * @returns {RegExp[]}
 */
export function parseAllowedOrigins(value) {
  const list = value && value.trim()
    ? value.split(/[\s,]+/).filter(Boolean)
    : DEFAULT_ALLOWED_ORIGINS;
  return list.map((o) => new RegExp(`^${o.replace(/\/+$/, '').split('*').map(escapeRe).join('[a-z0-9-]+')}$`, 'i'));
}

export function isAllowedOrigin(origin, patterns) {
  if (!origin || origin === 'null') return false;
  return patterns.some((re) => re.test(origin));
}

/**
 * CORS headers for an allowed origin (actual request).
 */
export function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Expose-Headers': 'X-Proxy-Cache, X-Proxy-Route, X-Upstream-Status',
    Vary: 'Origin',
  };
}

/**
 * CORS headers for a preflight response.
 * @param {string} origin
 * @param {string[]} methods allowed methods of the route
 * @param {string|null} requestHeaders Access-Control-Request-Headers
 */
export function preflightHeaders(origin, methods, requestHeaders) {
  const headers = {
    ...corsHeaders(origin),
    'Access-Control-Allow-Methods': [...methods, 'OPTIONS'].join(', '),
    'Access-Control-Max-Age': '86400',
  };
  // reflecting is safe: the worker builds its own upstream headers and copies only the per-route
  // `forwardHeaders` allowlist (routes.js) from the browser request
  const allowHeaders = (requestHeaders || '')
    .split(',')
    .map((h) => h.trim())
    .filter((h) => /^[A-Za-z0-9-]+$/.test(h));
  headers['Access-Control-Allow-Headers'] = allowHeaders.length ? allowHeaders.join(', ') : 'Content-Type, Accept';
  return headers;
}
