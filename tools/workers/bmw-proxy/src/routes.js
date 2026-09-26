/*
 * Route table of the bmw-proxy worker.
 *
 * URL scheme of the worker:
 *   https://<worker>/<path>              -> https://www.bmw.de/<path>        (default upstream)
 *   https://<worker>/<upstream-host>/<path> -> https://<upstream-host>/<path> (other upstreams)
 *
 * A request is only proxied if a route below matches: same upstream host, method in `methods`
 * and the (normalised) path matches `path`. Everything else is answered with 403.
 *
 * Route fields
 *   id        unique name (used in logs, X-Proxy-Route header and /_health)
 *   host      upstream host name (must be listed in UPSTREAM_HOSTS)
 *   path      RegExp tested against the upstream path (without query)
 *   methods   allowed methods (HEAD is implied by GET, OPTIONS is handled by CORS)
 *   ttl       edge + browser cache lifetime in seconds (0 = no caching)
 *   query     'keep' (default) | 'drop' | array of allowed parameter names
 *   dropParams  parameter names removed before forwarding/caching (e.g. cache busters)
 *   extract   names of allowed `?extract=` HTML reducers (see extract.js)
 *   headers   extra upstream request headers (override the browser-like defaults)
 *   cachePost cache POST responses keyed by a SHA-256 of the request body
 *
 * To add a route: append an object to ROUTES (and the host to UPSTREAM_HOSTS if new),
 * add a test in test/proxy.test.mjs, redeploy.
 */

export const DEFAULT_HOST = 'www.bmw.de';

export const UPSTREAM_HOSTS = [
  'www.bmw.de',
  'www.bmw.com',
  'sf-mco.aws.bmw.cloud',
  'vehicle-selection.prod.stolo.eu-central-1.aws.bmw.cloud',
  'stolo-data-service.prod.stolo.eu-central-1.aws.bmw.cloud',
  'crm-il-api-prod.bmwgroup.com',
];

const MIN = 60;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

// Referer used for Stock Locator APIs (the web component runs on this page on bmw.de)
const STOLO_REFERER = 'https://www.bmw.de/de-de/sl/stocklocator';

export const ROUTES = [
  // --- www.bmw.de --------------------------------------------------------------------------
  {
    id: 'login-flyout',
    host: 'www.bmw.de',
    path: /^\/de-de\/login\/bmw\/api\/flyout\/data$/,
    methods: ['GET'],
    ttl: 5 * MIN,
    query: 'drop',
    headers: { Accept: 'application/json, text/plain, */*' },
  },
  {
    id: 'datastore-csv',
    host: 'www.bmw.de',
    path: /^\/content\/dam\/bmw\/marketDE\/bmw_de\/datastore\/[A-Za-z0-9._-]+\.csv$/,
    methods: ['GET'],
    ttl: DAY,
    query: 'drop',
    headers: { Accept: 'text/csv, text/plain, */*' },
  },
  {
    id: 'compare-fragment',
    host: 'www.bmw.de',
    // /de/bmw-modelle-vergleichen.html/content.q and
    // /de/bmw-modelle-vergleichen.html/{series}/{range}/{model}/{trans}/content.q
    path: /^\/de\/bmw-modelle-vergleichen\.html(\/[A-Za-z0-9_-]+){0,6}\/content\.q$/,
    methods: ['GET'],
    ttl: HOUR,
    query: 'drop',
    extract: ['compare'],
    headers: { Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8' },
  },
  {
    id: 'stocklocator-config',
    host: 'www.bmw.de',
    // e.g. /de-de/sl/stocklocator/_jcr_content/stocklocator.config.json?t=123&brand=BMW
    path: /^\/de-de\/sl\/[A-Za-z0-9_./-]+\.json$/,
    methods: ['GET'],
    ttl: 10 * MIN,
    dropParams: ['t', '_'],
    headers: { Accept: 'application/json, text/plain, */*', Referer: STOLO_REFERER },
  },
  {
    id: 'epaas-bmw-de',
    host: 'www.bmw.de',
    path: /^\/etc\/clientlibs\/epaas\/[A-Za-z0-9_./-]+$/,
    methods: ['GET'],
    ttl: HOUR,
  },

  // --- www.bmw.com (ePaaS consent) ----------------------------------------------------------
  {
    id: 'consentcontroller-fallback',
    host: 'www.bmw.com',
    path: /^\/etc\/clientlibs\/wcmp\/consentcontroller\.fallback\/[A-Za-z0-9_./-]+$/,
    methods: ['GET'],
    ttl: HOUR,
  },
  {
    id: 'epaas-bmw-com',
    host: 'www.bmw.com',
    path: /^\/epaas\/[A-Za-z0-9_./-]+$/,
    methods: ['GET'],
    ttl: HOUR,
  },

  // --- Stock Locator (preview-slider web component <stl-preview-slider>) --------------------
  {
    id: 'stolo-dealers',
    host: 'stolo-data-service.prod.stolo.eu-central-1.aws.bmw.cloud',
    // e.g. /dealer/showAll?country=DE&category=BM&clientid=66_STOCK_DLO&language=de_DE&stl=true
    path: /^\/dealer\/[A-Za-z0-9_-]+$/,
    methods: ['GET'],
    ttl: HOUR,
    headers: { Accept: 'application/json, text/plain, */*', Referer: STOLO_REFERER },
  },
  {
    id: 'stolo-vehiclesearch',
    host: 'vehicle-selection.prod.stolo.eu-central-1.aws.bmw.cloud',
    // POST /vehiclesearch/search/de-de/stocklocator
    //      ?maxResults=5&brand=BMW&hash=...&context=preview-slider
    path: /^\/vehiclesearch\/search\/[a-z]{2}-[a-z]{2}\/[A-Za-z0-9_-]+$/,
    methods: ['GET', 'POST'],
    ttl: 5 * MIN,
    cachePost: true,
    headers: { Accept: 'application/json, text/plain, */*', Referer: STOLO_REFERER },
  },
  {
    id: 'stolo-sf-mco-api',
    host: 'sf-mco.aws.bmw.cloud',
    // gateway-service (configurations, offers), configuration-service,
    // display-service (errorCodes.json)
    path: /^\/(gateway-service|configuration-service|display-service)\/[A-Za-z0-9_./-]+$/,
    methods: ['GET'],
    ttl: 10 * MIN,
    headers: { Accept: 'application/json, text/plain, */*', Referer: STOLO_REFERER },
  },

  // --- Additional routes (append below) -----------------------------------------------------
  {
    id: 'compare-techdata',
    host: 'www.bmw.de',
    // per-model technical data used by the compare tool:
    // /de/bmw-modelle-vergleichen/_jcr_content.technicaldata.{series}.{range}.{model}.json
    path: /^\/de\/bmw-modelle-vergleichen\/_jcr_content\.technicaldata(\.[A-Za-z0-9_-]+){1,4}\.json$/,
    methods: ['GET'],
    ttl: HOUR,
    query: 'drop',
    headers: { Accept: 'application/json, text/plain, */*', Referer: 'https://www.bmw.de/de/bmw-modelle-vergleichen.html' },
  },
  {
    id: 'ai-assistant',
    host: 'crm-il-api-prod.bmwgroup.com',
    // BMW AI Assistant (faq-backend widget) chat API — answers only for Origin www.bmw.de
    path: /^\/ckm-genai-chat-prod-api\/api\/v1\/[A-Za-z0-9_./-]+$/,
    methods: ['GET', 'POST'],
    ttl: 0,
    forwardHeaders: ['tenantId', 'language', 'brand'],
    headers: { Accept: 'application/json, text/plain, */*', Origin: 'https://www.bmw.de', Referer: 'https://www.bmw.de/' },
  },
];

/**
 * Splits a worker request path into upstream host + upstream path.
 * @param {string} pathname normalised pathname of the worker request
 * @returns {{host: string, path: string}}
 */
export function resolveUpstream(pathname) {
  const m = pathname.match(/^\/([a-z0-9.-]+\.[a-z]{2,})(\/.*)?$/i);
  if (m && UPSTREAM_HOSTS.includes(m[1].toLowerCase())) {
    return { host: m[1].toLowerCase(), path: m[2] || '/' };
  }
  return { host: DEFAULT_HOST, path: pathname };
}

/**
 * Finds the route for an upstream host + path (method is checked by the caller).
 * @returns {object|undefined}
 */
export function findRoute(host, path, routes = ROUTES) {
  return routes.find((r) => r.host === host && r.path.test(path));
}
