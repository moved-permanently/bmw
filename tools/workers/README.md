# tools/workers

Backend helpers for the AEM Edge Delivery Services replica of www.bmw.de
(org `moved-permanently`, site `bmw`). This folder is listed in `.hlxignore` and is not served by EDS.
Deployment steps: [DEPLOY-PROMPT.md](DEPLOY-PROMPT.md).

| Folder | What |
|---|---|
| `bmw-proxy/` | Cloudflare Worker: allowlisted, path-preserving reverse proxy to www.bmw.de and a few other BMW upstreams, with CORS for the EDS hosts |
| `redirects/` | `redirects.csv` / `redirects.json` (EDS `redirects` sheet) + generator script |

## bmw-proxy

ES module worker, no npm dependencies. Source: `bmw-proxy/src/` (`index.js` handler, `routes.js` route
table, `cors.js`, `extract.js`).

### URL scheme

```
https://<worker>/<path>                      -> https://www.bmw.de/<path>
https://<worker>/<upstream-host>/<path>      -> https://<upstream-host>/<path>   (hosts listed in routes.js)
https://<worker>/_health                     -> JSON with the route table
```

Browser code: `const proxy = window.BMW_PROXY || 'https://bmw-proxy.aem-poc-lab.workers.dev';`
then `fetch(`${proxy}/de-de/login/bmw/api/flyout/data`)` or
`fetch(`${proxy}/${url.host}${url.pathname}${url.search}`)` for the non-bmw.de upstreams.

### Routes

| id | upstream | path | methods | TTL |
|---|---|---|---|---|
| login-flyout | www.bmw.de | `/de-de/login/bmw/api/flyout/data` | GET | 5 min |
| datastore-csv | www.bmw.de | `/content/dam/bmw/marketDE/bmw_de/datastore/*.csv` | GET | 1 day |
| compare-fragment | www.bmw.de | `/de/bmw-modelle-vergleichen.html[/seg…]/content.q` (0–6 segments), `?extract=compare` | GET | 1 h |
| stocklocator-config | www.bmw.de | `/de-de/sl/**.json` (e.g. `stocklocator/_jcr_content/stocklocator.config.json`), `t` dropped | GET | 10 min |
| epaas-bmw-de | www.bmw.de | `/etc/clientlibs/epaas/**` | GET | 1 h |
| consentcontroller-fallback | www.bmw.com | `/etc/clientlibs/wcmp/consentcontroller.fallback/**` | GET | 1 h |
| epaas-bmw-com | www.bmw.com | `/epaas/**` | GET | 1 h |
| stolo-dealers | stolo-data-service.prod.stolo.eu-central-1.aws.bmw.cloud | `/dealer/*` (e.g. `showAll`) | GET | 1 h |
| stolo-vehiclesearch | vehicle-selection.prod.stolo.eu-central-1.aws.bmw.cloud | `/vehiclesearch/search/{ll-cc}/*` | GET, POST (JSON, cached by body hash) | 5 min |
| stolo-sf-mco-api | sf-mco.aws.bmw.cloud | `/(gateway-service\|configuration-service\|display-service)/**` | GET | 10 min |

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
  upstream host + path + sorted query + extract (+ SHA-256 of the body for POST). Cookies and Origin
  are not part of the key, and CORS headers are added after the cache lookup. The Cache API only works
  when the worker runs on a custom domain or zone route; on `*.workers.dev` it does nothing. The
  subrequest also sets `cf.cacheTtlByStatus`. `CACHE=off` turns caching off.
- **Errors:** every error is JSON: `{"error": "<code>", "status": <n>, "message": "…"}` with the same
  HTTP status:
  - `not_allowlisted` 403
  - `origin_not_allowed` 403
  - `method_not_allowed` 405
  - `bad_extract` 400
  - `unsupported_media_type` 415
  - `payload_too_large` 413
  - `upstream_error` (upstream status, including the Akamai 403)
  - `upstream_unreachable` / `redirect_not_allowed` / `extract_failed` 502
  - `upstream_timeout` 504

  Error responses are never cached.

### `?extract=compare` (compare-fragment route only)

`content.q` returns the whole compare page, about 700 KB, including navigation, footer and scripts.
With `extract=compare` the worker returns only this markup:

```html
<div class="bmw-proxy-extract" data-extract="compare">
  <div class="cmp-compare" data-component-path="compare-v1" data-config="…base64 JSON of series/ranges/models…">…</div>
  <ol class="cmp-compare__footnotes">…</ol>
</div>
```

- Both elements are cut out by counting nested `<div>`/`<ol>` tags.
- HTML comments are removed and whitespace runs are collapsed. On the real capture the response shrinks
  from 698 KB to about 365 KB before gzip. Most of what remains is the component itself, whose
  `data-config` alone is 72 KB.
- `ETag` is dropped and `X-Proxy-Extract: compare` is set.
- If the `cmp-compare` element is missing, the response is a 502 `extract_failed`, so the block can fall
  back to its default.
- The `extract` parameter is never sent upstream.

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

The tests use `node:test` with a mocked global `fetch` and `caches`. If
`migration-work/raw/api/content.q` exists, the real capture is also run through `extract=compare`.

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
