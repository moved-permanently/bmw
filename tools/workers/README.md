# tools/workers

Backend helpers for the AEM Edge Delivery Services replica of www.bmw.de
(org `moved-permanently`, site `bmw`). This folder is listed in `.hlxignore` and is not served by EDS.
Deployment steps: [DEPLOY-PROMPT.md](DEPLOY-PROMPT.md).

| Folder | What |
|---|---|
| `bmw-proxy/` | Cloudflare Worker: allowlisted, path-preserving reverse proxy to www.bmw.de and a few other BMW upstreams, with CORS for the EDS hosts |
| `redirects/` | `redirects.csv` / `redirects.json` (EDS `redirects` sheet) + generator script |
| `wdh-proxy/` | Cloudflare Worker (demo): reverse proxy to one BMW EDS origin that turns WDH value links into `wdh-value` spans server-side (see [wdh-proxy](#wdh-proxy)) |

## bmw-proxy

ES module worker, no npm dependencies. Source: `bmw-proxy/src/` (`index.js` handler, `routes.js` route
table, `cors.js`).

### URL scheme

```
https://<worker>/<path>                      -> https://www.bmw.de/<path>
https://<worker>/<upstream-host>/<path>      -> https://<upstream-host>/<path>   (hosts listed in routes.js)
https://<worker>/_health                     -> JSON with the route table
```

Browser code: `const proxy = window.BMW_PROXY || 'https://bmw-proxy.aem-poc-lab.workers.dev';`
then `fetch(`${proxy}/de/bmw-modelle-vergleichen/_jcr_content.technicaldata.3.G20.28FF.json`)` or
`fetch(`${proxy}/${url.host}${url.pathname}${url.search}`)` for the non-bmw.de upstreams
(`bmwProxyUrl()` in `scripts/bmw-utils.js` does this).

Static data is not proxied: the My BMW flyout texts, the compare template + model tree and the dealer
online-service CSV are site sheets under `/de/data/` (see "Static data sheets" below).

### Routes

| id | upstream | path | methods | TTL |
|---|---|---|---|---|
| stocklocator-config | www.bmw.de | `/de-de/sl/**.json` (e.g. `stocklocator/_jcr_content/stocklocator.config.json`), `t` dropped | GET | 10 min |
| epaas-bmw-de | www.bmw.de | `/etc/clientlibs/epaas/**` | GET | 1 h |
| consentcontroller-fallback | www.bmw.com | `/etc/clientlibs/wcmp/consentcontroller.fallback/**` | GET | 1 h |
| epaas-bmw-com | www.bmw.com | `/epaas/**` | GET | 1 h |
| stolo-dealers | stolo-data-service.prod.stolo.eu-central-1.aws.bmw.cloud | `/dealer/*` (e.g. `showAll`) | GET | 1 h |
| stolo-vehiclesearch | vehicle-selection.prod.stolo.eu-central-1.aws.bmw.cloud | `/vehiclesearch/search/{ll-cc}/*` | GET, POST (JSON, cached by body hash) | 5 min |
| stolo-sf-mco-api | sf-mco.aws.bmw.cloud | `/(gateway-service\|configuration-service\|display-service)/**` | GET | 10 min |
| compare-techdata | www.bmw.de | `/de/bmw-modelle-vergleichen/_jcr_content.technicaldata.{series}.{range}.{model}.json` (blocks/model-compare), query dropped | GET | 1 h |
| ai-assistant | crm-il-api-prod.bmwgroup.com | `/ckm-genai-chat-prod-api/api/v1/**` (AI Assistant sidebar; forwards `tenantId`, `language`, `brand`, `conversationSessionId`) | GET, POST | – |

HEAD is allowed wherever GET is. OPTIONS preflight is answered for every route.
Upstream hosts and routes come from `routes.js`. To add one, append an entry, add a test, and redeploy.

### Behaviour

- **Allowlist:** anything that is not in the table gets a 403 JSON response, and the upstream is never
  called. Paths containing `//`, `/../`, or encoded `.`, `/` or `\` are rejected. The wrong method on a
  matching route gets a 405 with an `Allow` header.
- **CORS:** `Origin` is echoed back only when it matches `ALLOWED_ORIGINS` (default
  `https://*--bmw--moved-permanently.aem.page`, `https://*--bmw--moved-permanently.aem.live`,
  `http://localhost:3000`). `*` matches only `[a-z0-9-]+`. A request with a foreign `Origin` gets a
  403. A request with no `Origin` (curl, or `<script src>` without `crossorigin`) is allowed unless
  `REQUIRE_ORIGIN=true`.
- **Upstream request:** the worker builds a fresh set of headers: a Chrome User-Agent,
  `Accept-Language: de-DE…`, `Referer: https://www.bmw.de/` (the Stock Locator routes use
  `https://www.bmw.de/de-de/sl/stocklocator` instead) and `Sec-Fetch-*`. It sends
  `Origin: https://www.bmw.de` only on cross-host or non-GET requests, as a browser would. Client
  headers, including cookies, are never forwarded. POST bodies must be `application/json` or
  `text/plain`, 64 KB at most.
- **Redirects:** the worker follows up to 5 redirects by hand, and only to https URLs on the upstream
  hosts. Any other redirect gets a 502 `redirect_not_allowed`.
- **Response:** only `content-type`, `content-language`, `last-modified` and `etag` are copied from
  upstream. `Set-Cookie` and all other headers are dropped. The worker adds
  `Cache-Control: public, max-age=<ttl>`, `X-Proxy-Route`, `X-Proxy-Cache` (HIT/MISS/BYPASS) and
  `X-Upstream-Status`.
- **Caching:** 200 responses go into the Cloudflare Cache API (`caches.default`). The cache key is the
  upstream host + path + sorted query (+ SHA-256 of the body for POST). Cookies and Origin
  are not part of the key, and CORS headers are added after the cache lookup. The Cache API only works
  when the worker runs on a custom domain or zone route; on `*.workers.dev` it does nothing. The
  subrequest also sets `cf.cacheTtlByStatus`. `CACHE=off` turns caching off.
- **Errors:** every error is JSON: `{"error": "<code>", "status": <n>, "message": "…"}` with the same
  HTTP status:
  - `not_allowlisted` 403
  - `origin_not_allowed` 403
  - `method_not_allowed` 405
  - `unsupported_media_type` 415
  - `payload_too_large` 413
  - `upstream_error` (upstream status, including the Akamai 403)
  - `upstream_unreachable` / `redirect_not_allowed` 502
  - `upstream_timeout` 504

  Error responses are never cached.

### Retired routes: static data moved into the site

`login-flyout` (`/de-de/login/bmw/api/flyout/data`), `datastore-csv`
(`/content/dam/bmw/marketDE/bmw_de/datastore/*.csv`) and `compare-fragment`
(`/de/bmw-modelle-vergleichen.html/**/content.q?extract=compare`, incl. `extract.js`) were removed.
Their data changes rarely, so it now lives in Document Authoring sheets (same-origin, no proxy):

| DA sheet (`/de/data/…`) | tabs | used by | former route |
|---|---|---|---|
| `mybmw-flyout.json` | labels (key/value), benefits (text), links (group, groupTitle, id, text, path, icon, …) | blocks/header (My BMW panel) | login-flyout |
| `compare-models.json` | models (series → range → model → transmission, one row per transmission), table (highlights / technical data rows), labels, placeholders | blocks/model-compare | compare-fragment |
| `dealer-services.json` | Dealer, Outlet, URL, Name | blocks/dealer-locator (CSV for DLO's `osatCsvPath`, built in the browser as Blob URL) | datastore-csv |

Sources and generator: `tools/importer/data/` (`src/` = captures of the original endpoints,
`build-static-data.mjs` → `*.json`, `upload.sh` → DA source API + preview). These paths now answer 403
on the worker.

### Env vars (`wrangler.toml` `[vars]`)

| var | default | meaning |
|---|---|---|
| `ALLOWED_ORIGINS` | the three origins above | comma-separated. `*` is a label wildcard |
| `REQUIRE_ORIGIN` | `false` | `true` rejects requests with no Origin (this breaks plain `<script src>` loads) |
| `UPSTREAM_TIMEOUT_MS` | `15000` | timeout for each upstream hop |
| `CACHE` | `on` | `off` turns the Cache API off |

No secrets and no KV are used.

### Tests

```
cd tools/workers/bmw-proxy && node --test        # or: node --test 'tools/workers/**/*.test.mjs'
```

The tests use `node:test` with a mocked global `fetch` and `caches`.

## redirects

`redirects/redirects.csv` has the columns `Source,Destination`. `redirects/redirects.json` holds the
same rows in DA sheet JSON (`{total, limit, offset, data, ":type": "sheet"}`), ready for the DA source
API. Regenerate both from the repo root with:

```
node tools/workers/redirects/generate-redirects.mjs [--check-content]
```

The generator reads `migration-work/crawl.json` and `migration-work/urls-all.txt`. With
`--check-content` it also warns about destinations that are not in `content/` yet. It writes these rows:

1. **Legacy redirects:** pages that redirected on www.bmw.de during the crawl point to the EDS path of
   their final page. Both the `.html` and the extensionless source are listed.
2. **`.html` paths:** each migrated page's original `.html` path points to its extensionless EDS path.
   If the original path differs from the EDS path only by case or `_`, the extensionless original is
   listed too.
3. **Entry points:** `/`, `/index.html`, `/de`, `/de/`, `/de.html`, `/de/index` and `/de/index.html`
   all point to `/de/home`.

EDS paths follow the importer's rules: strip `.html`, map `/de/index` to `/de/home`, lowercase, and
replace `[^a-z0-9]+` with `-` (so `de_DE` becomes `de-de` and `publicPools` becomes `publicpools`).
A source is never allowed to shadow a migrated page.

Why the `.html` rows are needed:

- EDS does not map `/foo.html` to the `/foo` document. It returns 404, as checked on
  www.aem.live/docs/redirects.html.
- The redirects sheet only matches exact paths (no wildcards).
- aem.live recommends handling a "remove .html" pattern with a CDN rule. Once a production CDN sits in
  front of the site, add a generic `*.html -> *` 301 there, and the rows in step 2 are then only a
  safety net.

The legacy sitemap redirect results (migration-plan.md mentions 199 legacy sitemap URLs) are not on disk,
and www.bmw.de is not reachable from the migration container (Akamai 403). The file is therefore built
from `crawl.json` only. Add more legacy URLs to the crawl and rerun the generator.

## wdh-proxy

Demo worker: a reverse proxy to ONE BMW EDS origin, `ORIGIN_HOSTNAME`, which defaults to
`main--bmw--moved-permanently.aem.page`. For HTML responses it applies the WDH value-link decoration of
`decorateWdhValues()` (`scripts/scripts.js`) on the server. It is an ES module worker. Source:
`wdh-proxy/src/index.js`. Tests: `wdh-proxy/test/`, which run in workerd through Miniflare, the only
devDependency.

**What it does:**
- **Decoration:** every `a[href*="/data/wdh-"][href*="#"]` becomes
  `<span class="wdh-value" data-wdh="{href attribute}">{the link's text}</span>`. This is the same output as
  the browser decorator: inner markup and comments are dropped, and so are all other attributes.
  - Full pages: only inside `<main>`, like `decorateMain(main)`.
  - `.plain.html` served as `text/html`: the whole fragment, like `blocks/fragment` → `decorateMain`. This
    also applies to fragments that the browser does not run through `decorateMain`, such as nav, footer,
    the WLTP fragment and the help sidebar. None of them contain WDH links today.
- **What it does not do:** it only cleans up the authored links. It does not fetch, resolve or ingest any
  WDH values.
- **Browser JS is unchanged and stays the fallback:**
  - Direct `.aem.page` / `.aem.live` pages are still decorated in the browser.
  - On worker-served HTML the browser decorator finds no matching links and does nothing. As a result,
    `wdhBindings` stays empty there.
  - The preview-only `aida.js` drift check only runs on `*.aem.page`, `*.preview.da.live` and `localhost`.
    The rendered `.wdh-value` spans themselves are the same.
- **Behaviour depends on the format:**
  - Only `text/html` bodies are rewritten (this includes HTML error pages, which keep their status).
  - JSON, JS, CSS, Markdown (`.md` is `text/markdown`, with `[text](/…/wdh-…#…)` link syntax), media and any
    other bodies pass through byte-for-byte, with their `etag` and `content-length`.
  - Markdown links are NOT transformed.

### Upstream and safety

- **Fixed upstream host:**
  - Only `<ref>--bmw--moved-permanently.aem.page` or `.aem.live` is accepted. Any other `ORIGIN_HOSTNAME`
    returns `500 Invalid ORIGIN_HOSTNAME` without calling any upstream.
  - The request path is kept as is. Paths that look like URLs, including `//host/x`, query parameters and
    the `Host` header never change the upstream host.
- **Methods:** only GET and HEAD are allowed. Anything else returns `405` with `Allow: GET, HEAD`, and the
  origin is not called. RUM beacons go to `ot.aem.live` directly, not through this worker.
- **Query (as in `adobe/aem-cloudflare-prod-worker`):**
  - media `/media_…` keeps `format`, `height`, `optimize` and `width`;
  - `.json` keeps `limit`, `offset` and `sheet`;
  - everything else is stripped before the upstream call, and the kept parameters are sorted.
  - Client-side JS still sees the visitor's full URL.
  - A `301` without a query gets the visitor's query re-appended. The origin does the same, for example
    `/?utm_source=x` → `/de/home?utm_source=x`.
- **Redirects:**
  - Redirects are not followed. Status and `Location` pass through.
  - A `Location` that points at the origin host is made relative, so visitors stay on the proxy host.
  - Relative links in the HTML are left alone, so they resolve against the proxy host.
- **Headers:**
  - The visitor's `Cookie` and `Authorization` headers are not forwarded. There is no origin
    authentication: the preview origin is public, so no token or secret is involved.
  - The worker sets `X-Forwarded-Host` to the proxy host, replacing any value the client sent, and
    `X-BYO-CDN-Type: cloudflare`. Push invalidation is not enabled.
  - On rewritten HTML (and HEAD on HTML), `content-length`, `etag` and `content-md5` are removed, because
    they describe the upstream bytes. `age` is always removed.
  - A `304` drops `content-security-policy`.
  - `cache-control`, `vary`, `last-modified`, the CSP nonce header and `x-robots-tag: noindex` (aem.page)
    are kept.
- **Caching:** `fetch(…, { cf: { cacheEverything: true } })`, so Cloudflare caches the upstream response for
  the origin's `Cache-Control` (aem.page: `max-age=60, must-revalidate`). The decoration runs on every
  request. The Cache API and `cf` options have no effect on `*.workers.dev`; they apply on a zone route or
  custom domain.
- **Kept on purpose, unlike the prod worker:**
  - `/drafts/` stays reachable (the aida showcase uses `/drafts/aida/showcase/`);
  - there is no port redirect (`wrangler dev` uses port 8787);
  - `x-robots-tag` is kept, so the demo stays unindexed.

### Test and deploy

```bash
cd tools/workers/wdh-proxy
npm ci && npm test            # 13 tests, workerd via Miniflare, stub origin (no network)
npx -y wrangler@4 dev         # http://localhost:8787/aida/de/de/i5 (WDH links already spans in the HTML)
npx -y wrangler@4 login       # with your own Cloudflare account
npx -y wrangler@4 deploy      # deploys to https://wdh-proxy.<your-subdomain>.workers.dev
# optional, another ref of this site:
npx -y wrangler@4 deploy --var ORIGIN_HOSTNAME:aida--bmw--moved-permanently.aem.page
```

No secrets, KV or routes are needed. `wrangler.toml` defines no routes or custom domains; add them yourself
if wanted. Quick checks after the deploy:
- `curl -s https://<worker>/aida/de/de/i5 | grep -c 'class="wdh-value"'` should print 20, and
  `curl -s https://<worker>/aida/de/de/i5 | grep -c 'href="/aida/data/wdh-'` should print 0.
- `curl -sI https://<worker>/` should show `301` with `location: /de/home`.
- `/aida/de/de/i5.md` and `/aida/data/wdh-de.json` should be identical to the origin.
