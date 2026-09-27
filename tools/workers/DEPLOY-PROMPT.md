# Deploy prompt: bmw.de replica backend (paste into Claude Code in a local checkout)

> Copy everything below the line into Claude Code, running at the root of a local clone of the
> repository on branch `main` (the migration is merged). Claude should run the commands,
> show each result and stop to ask me when a step needs a browser login or a decision.
>
> **What you need to provide / create — summary:** one Cloudflare Worker (`bmw-proxy`, in
> `tools/workers/bmw-proxy`). **No secrets, no KV namespaces, no D1/R2/Durable Objects**; configuration is
> plain `[vars]` in `wrangler.toml` (`ALLOWED_ORIGINS`, `REQUIRE_ORIGIN`, `UPSTREAM_TIMEOUT_MS`, `CACHE`).
> Optional: a custom domain on a Cloudflare zone (needed for edge caching). The DA redirects sheet and the
> DA site config (`aem.assets.image.type = link`) were already uploaded during the migration — steps 5 and 6
> are verification (plus publishing when you go live).

---

You are deploying the backend helpers of the AEM Edge Delivery Services (EDS) replica of www.bmw.de.

- EDS org `moved-permanently`, site `bmw`
- Preview `https://main--bmw--moved-permanently.aem.page`
- Live `https://main--bmw--moved-permanently.aem.live`
- Document Authoring (DA) at `https://da.live/#/moved-permanently/bmw`

Everything lives in `tools/workers/`, which EDS does not serve (it is in `.hlxignore`). Read
`tools/workers/README.md` first. Do not edit `blocks/`, `scripts/aem.js` or `content/` unless a step
below tells you to. Work through the steps in order and report the result of each.

## 0. Prerequisites

1. Node.js 20 or newer (`node -v`), plus `npx`. The worker has no npm dependencies. Wrangler runs through
   `npx -y wrangler@4`.
2. A Cloudflare account, with the Workers free plan or better. Log in with `npx -y wrangler@4 login`
   (a browser opens; ask me to confirm), then run `npx -y wrangler@4 whoami` and note the account id.
3. The account's workers.dev subdomain. The browser code falls back to
   `https://bmw-proxy.aem-poc-lab.workers.dev`, which only works if the account's workers.dev
   subdomain is `moved-permanently`. Check it in Dashboard, then Workers & Pages, then the Subdomain
   box on the right.
   - If the subdomain is free and I agree, set it to `moved-permanently`.
   - Otherwise use the real URL `https://bmw-proxy.<subdomain>.workers.dev` (or a custom domain, see
     step 2) and set it in step 4.
4. Run the unit tests: `cd tools/workers/bmw-proxy && node --test`. All tests must pass.

## 1. Deploy bmw-proxy

```bash
cd tools/workers/bmw-proxy
npx -y wrangler@4 deploy --dry-run      # validates wrangler.toml and the bundle (~17 KiB)
npx -y wrangler@4 deploy                # prints https://bmw-proxy.<subdomain>.workers.dev
```

Configuration is plain vars in `wrangler.toml` `[vars]`. There are no secrets, no KV, no D1, no Durable
Objects and no R2.

| var | value | notes |
|---|---|---|
| `ALLOWED_ORIGINS` | `https://*--bmw--moved-permanently.aem.page,https://*--bmw--moved-permanently.aem.live,http://localhost:3000` | Add the production domain when there is one, e.g. `,https://www.example.com`. `*` matches one label (`[a-z0-9-]+`) |
| `REQUIRE_ORIGIN` | `false` | Keep `false`. ePaaS scripts are loaded with `<script src>`, which sends no Origin |
| `UPSTREAM_TIMEOUT_MS` | `15000` | |
| `CACHE` | `on` | `off` disables the Cache API |

To change a var, edit `wrangler.toml` and redeploy. You can also use
`npx -y wrangler@4 deploy --var ALLOWED_ORIGINS:"…"`, but the next plain deploy overwrites it.

## 2. Custom domain (recommended; needed for edge caching)

The Cloudflare Cache API has no effect on `*.workers.dev`. With a zone on Cloudflare (for example
`example.com`), bind a custom domain.

1. Uncomment and edit the `routes` line in `wrangler.toml`:
   `routes = [{ pattern = "bmw-proxy.example.com", custom_domain = true }]`
2. Redeploy. Cloudflare creates the DNS record and certificate.
3. Use `https://bmw-proxy.example.com` as the proxy URL in steps 3 and 4.

Skip this step if there is no zone. The proxy still works, but every request goes upstream; only the
browser honours `Cache-Control`.

## 3. Verify every route with curl

Set `P=https://bmw-proxy.aem-poc-lab.workers.dev` (or the real URL) and
`O=https://main--bmw--moved-permanently.aem.page`. For every command, check:

- the HTTP status
- `access-control-allow-origin` equals `$O`
- `x-proxy-route`, `x-proxy-cache` and `cache-control` are present
- the first bytes of the body

```bash
P=https://bmw-proxy.aem-poc-lab.workers.dev
O=https://main--bmw--moved-permanently.aem.page
H() { curl -sS -D - -o /tmp/body -H "Origin: $O" "$@"; head -c 300 /tmp/body; echo; echo; }

H "$P/_health"                                                     # 200, JSON route table
# login-flyout (5 min)
H "$P/de-de/login/bmw/api/flyout/data"                             # 200 JSON
# datastore-csv (1 day)
H "$P/content/dam/bmw/marketDE/bmw_de/datastore/17012022_BMW_OTV.csv"   # 200 text/csv
# compare-fragment (1 h): full HTML, then reduced
H "$P/de/bmw-modelle-vergleichen.html/X/G65/61JF/content.q" | head -5
H "$P/de/bmw-modelle-vergleichen.html/X/G65/61JF/content.q?extract=compare"   # starts with <div class="bmw-proxy-extract"
H "$P/de/bmw-modelle-vergleichen.html/7/G70/61HZ/S02TB/content.q?extract=compare"
# stocklocator-config (10 min)
H "$P/de-de/sl/stocklocator/_jcr_content/stocklocator.config.json?t=1&brand=BMW"
# stolo-dealers (1 h)
H "$P/stolo-data-service.prod.stolo.eu-central-1.aws.bmw.cloud/dealer/showAll?country=DE&category=BM&clientid=66_STOCK_DLO&language=de_DE&stl=true"
# stolo-vehiclesearch (POST, 5 min). The real body is sent by the <stl-preview-slider> component;
# {} only proves the route and CORS work (the upstream may answer 4xx for an empty query)
curl -sS -D - -o /tmp/body -X OPTIONS -H "Origin: $O" -H 'Access-Control-Request-Method: POST' \
  -H 'Access-Control-Request-Headers: content-type' \
  "$P/vehicle-selection.prod.stolo.eu-central-1.aws.bmw.cloud/vehiclesearch/search/de-de/stocklocator"   # 204
H -X POST -H 'content-type: application/json' --data '{}' \
  "$P/vehicle-selection.prod.stolo.eu-central-1.aws.bmw.cloud/vehiclesearch/search/de-de/stocklocator?maxResults=5&brand=BMW&context=preview-slider"
# stolo-sf-mco-api (10 min)
H "$P/sf-mco.aws.bmw.cloud/display-service/DE/bmwCar/de/STOCKLOCATOR/errorCodes.json"
H "$P/sf-mco.aws.bmw.cloud/configuration-service/app/discover/confi/channels/STOCKLOCATOR/brands/bmwCar/countries/DE/languages"
# compare-techdata (1 h): per-model technical data JSON used by the compare tool
H "$P/de/bmw-modelle-vergleichen/_jcr_content.technicaldata.3.G20.28FF.json"
# ai-assistant (no cache): BMW AI Assistant chat API, forwards tenantId/language/brand, sends Origin www.bmw.de
curl -sS -D - -o /tmp/body -X OPTIONS -H "Origin: $O" -H 'Access-Control-Request-Method: POST' \
  -H 'Access-Control-Request-Headers: content-type, tenantid, language, brand' \
  "$P/crm-il-api-prod.bmwgroup.com/ckm-genai-chat-prod-api/api/v1/chat"                  # 204
# (a real POST needs the widget's payload; test it by opening "BMW AI Assistant" in the help sidebar)
# ePaaS / consent (1 h)
H "$P/www.bmw.com/etc/clientlibs/wcmp/consentcontroller.fallback/epaas.js"
H "$P/etc/clientlibs/epaas/content/bmw/marketDE/bmw_de/de_DE.epaasclientlibinclude.js"   # seen on bmw.de pages
# /www.bmw.com/epaas/** is allowlisted for files that epaas.js loads at runtime; no concrete file name was
# captured. Open epaas.js from the previous call, find a /epaas/... URL in it and curl "$P/www.bmw.com/epaas/<file>"

# negative checks
H "$P/de/index.html"                                   # 403 {"error":"not_allowlisted"}
curl -sS -o /dev/null -w '%{http_code}\n' -H 'Origin: https://evil.example.com' "$P/de-de/login/bmw/api/flyout/data"   # 403
H "$P/content/dam/bmw/marketDE/bmw_de/datastore/17012022_BMW_OTV.csv"   # repeat: x-proxy-cache HIT (custom domain only)
```

**If upstream calls return `403 {"error":"upstream_error","upstreamStatus":403}`**, Akamai is blocking
Cloudflare's egress IPs. The proxy itself is working. Tell me, and do not try to get around bot
protection. The options are asking BMW for an allowlist, or keeping the blocks' built-in fallbacks.

## 4. Point the site at the proxy

The browser code reads `window.BMW_PROXY || 'https://bmw-proxy.aem-poc-lab.workers.dev'`.

1. Find the places that read it:
   `grep -rn "BMW_PROXY\|bmw-proxy.aem-poc-lab.workers.dev" blocks scripts head.html`.
2. If the deployed URL equals the default, nothing needs to change.
3. Otherwise pick one of these:
   - **a. head.html (no code change in blocks).** Add this line to `head.html` right after the viewport
     meta:

     ```html
     <script nonce="aem">window.BMW_PROXY = 'https://bmw-proxy.example.com';</script>
     ```

     The `nonce="aem"` is required because the CSP in head.html is `script-src 'nonce-aem' 'strict-dynamic'`.
     EDS purges the HTML cache on head.html changes automatically.
   - **b. Change the default in code.** Replace the default URL string in every file found by the grep,
     preferably in one shared helper in `scripts/`. Then run `npm run lint`.
4. Commit on a branch and push. Open the branch preview
   `https://<branch>--bmw--moved-permanently.aem.page/de/bmw-modelle-vergleichen` and check the browser
   network tab for proxy requests: status 200 and the CORS header present.
5. Open a PR. It must include a `https://<branch>--bmw--moved-permanently.aem.page/<path>` link
   (AGENTS.md). Merging to `main` ships the code. Remember to add the production origin to
   `ALLOWED_ORIGINS` at go-live.

## 5. Redirects sheet in Document Authoring

**Status: already uploaded to DA and previewed on main during the migration (248 rows) — NOT published.**
Only verify below; publish (`admin.hlx.page/live/...redirects.json`, or Publish in the DA UI) when going live.
If the content import changes, regenerate and re-upload with the steps that follow.

The rows are in `tools/workers/redirects/redirects.csv` (columns `Source,Destination`, 249 rows) and in
DA sheet JSON in `tools/workers/redirects/redirects.json`. Regenerate both first with
`node tools/workers/redirects/generate-redirects.mjs --check-content` if the import changed. The sheet
must be named `redirects` and sit at the site root, with one tab (or a tab named `helix-default`).

**Option A: DA admin API.**

1. Get an IMS token: log in to da.live, then in the browser devtools console run
   `(await window.adobeIMS.getAccessToken()).token`, or ask me for it.
2. Upload and publish:

   ```bash
   TOKEN=...   # never commit it
   curl -sS -X POST 'https://admin.da.live/source/moved-permanently/bmw/redirects.json' \
     -H "Authorization: Bearer $TOKEN" \
     -F 'data=@tools/workers/redirects/redirects.json;type=application/json'
   # preview + publish through the AEM admin API (same IMS token)
   curl -sS -X POST 'https://admin.hlx.page/preview/moved-permanently/bmw/main/redirects.json' -H "Authorization: Bearer $TOKEN"
   curl -sS -X POST 'https://admin.hlx.page/live/moved-permanently/bmw/main/redirects.json'    -H "Authorization: Bearer $TOKEN"
   ```

**Option B: DA UI.**

1. At `https://da.live/#/moved-permanently/bmw`, click **+**, choose **Sheet**, name it `redirects`.
2. Open `redirects.csv` in a spreadsheet app, copy all cells including the header row, and paste into
   cell A1. The first row must be `Source | Destination`.
3. Click **Preview**, then **Publish**.

Verify:

```bash
curl -s https://main--bmw--moved-permanently.aem.page/redirects.json | head -c 300
for p in /de/index.html /de/neufahrzeuge.html /de/fastlane/bmw-partner.html /de_DE/shop-online/bmw-business-offers.html /; do
  curl -s -o /dev/null -w "%{http_code} %{redirect_url}  $p\n" "https://main--bmw--moved-permanently.aem.live$p"
done   # expect 301 -> /de/home, /de/neufahrzeuge, /de/fastlane/dealer-locator, /de-de/shop-online/bmw-business-offers, /de/home
```

Notes:

- Redirects take precedence over pages. `/` → `/de/home` intentionally hides the boilerplate root
  `index` document.
- The source `/de/neufahrzeuge/5er/limousine/bmw-5er-limousine-ueberblick.html` hides a stray imported
  duplicate document of that name. That document can be deleted in DA.
- The sheet only matches exact paths. At go-live on a production CDN, also add a generic
  `/(.*)\.html$ → /$1` 301 rule there, as aem.live recommends for "remove .html" patterns.

## 6. Site config: `aem.assets.image.type = link`

**Status: already created during the migration** (`https://admin.da.live/config/moved-permanently/bmw`, data sheet
row `aem.assets.image.type = link`). Only verify step 4 below.

The key is documented at aem.live /docs/ew/administering/set-up-aem-assets. It is a key in the **data**
sheet of the site configuration: "Insert images as links instead of image tags. Useful for Dynamic
Media URLs that need to bypass Media Bus."

1. Open `https://da.live/config#/moved-permanently/bmw/`. This is the same config you reach by opening the
   site root in DA and clicking the gear icon at the end of the breadcrumbs.
2. In the `data` tab, add a row with key `aem.assets.image.type` and value `link`. Keep existing rows.
   If the sheet has no `key`/`value` columns yet, create them.
3. Save. The config is used by the DA editor and asset picker, so there is nothing to preview or publish.
4. To verify, reopen the config and check the row. A newly inserted AEM Assets image in a doc should
   appear as a link, not an `<img>`.

This setting only changes how DA inserts images from the AEM Assets picker. It does not rewrite images
that are already imported (the Scene7 URLs in the imported content stay as they are).

## 7. Report back

Give me:

- the deployed proxy URL, and the custom domain if any
- the status of every curl in step 3 (flag any Akamai 403)
- which option you used in step 4 and the PR link
- the redirects verification output
- confirmation of the config row

## Additional routes

<!-- Add further upstream endpoints here. For each: upstream URL example, method, TTL, CORS needs.
     Then: append to ROUTES (and UPSTREAM_HOSTS if new host) in tools/workers/bmw-proxy/src/routes.js,
     add a test in tools/workers/bmw-proxy/test/proxy.test.mjs, run `node --test`, redeploy (step 1)
     and add a curl check to step 3. -->

| id | upstream example | method | TTL | notes |
|---|---|---|---|---|
| compare-techdata | `https://www.bmw.de/de/bmw-modelle-vergleichen/_jcr_content.technicaldata.3.G20.28FF.json` | GET | 1 h | used by blocks/model-compare (already in routes.js) |
| ai-assistant | `https://crm-il-api-prod.bmwgroup.com/ckm-genai-chat-prod-api/api/v1/…` | GET, POST | 0 | help-sidebar AI assistant; forwards `tenantId`, `language`, `brand`; upstream only answers Origin www.bmw.de (already in routes.js) |
| _(next)_ | | | | |

## Notes for go-live (not part of this deployment)

- `head.html` CSP allows `'unsafe-eval'` and no longer requires Trusted Types — needed by the HERE map
  (Tangram) of the dealer locator. Revisit if the dealer locator is dropped.
- BMW's tag manager (loaded by ePaaS after "Alle akzeptieren") is blocked by default so the replica does not
  report into BMW's ad/analytics accounts; `window.BMW_EPAAS_TRACKING = true` restores the source behaviour.
- The Live Chat widget (cctapiemea) only answers requests with a bmw.de referer; it stays hidden like on the
  source until it runs on the real domain.
- Content is previewed only; nothing has been published to `.aem.live`.

