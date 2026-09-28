# AIDA demo layer

A demo layer on the migrated bmw.de: WDH-bound product data, the customer's own AI,
one content for every channel, governance and rollout. Everything lives under `/aida/` in content and
is additive; the migrated site is unchanged apart from `<html lang>` now honouring `html-lang`.

| Module | What | Code |
|---|---|---|
| M1 WDH | Extracts → per-market sheets; tech values bound in documents; drift check on preview; value picker in the editor | `wdh/`, `scripts/aida-wdh.js`, `scripts/aida.js`, `wdh-picker/` |
| M2 Agent | CLI for the customer's agent: get, put, bind, sync, translate, review over the DA API | `agent/aida.mjs`, `agent/lib.js` |
| M3 Channels | Page, `.md`, `.plain.html`, JSON-LD, data side by side; `llms.txt`; app stream from `.md` + `.plain.html` | `blocks/channels`, `/llms.txt`, `consumer/` |
| M5 Rollout | EN source → languages → markets, brand terms protected, WDH values follow the market | `agent/`, `content/da/translate.json` |
| M6 Governance | Custom Preflight: WDH current and from the page's market (one-click sync), WLTP statement, market features, brand terms, SEO basics | `preflight/` |
| M7 Radar | Source pages × languages and markets, stale copies, WDH drift | `radar/` |
| M8 News | News built from WDH values, `NewsArticle` JSON-LD, news list | `blocks/news-list`, `content/seed.mjs` |

M4 (launch release with account-free review) is product configuration; see "Release" below.

## Local

```sh
npm test                                           # 45 unit tests, node --test
node tools/aida/wdh/build.mjs <folder-with-wdh-extracts> tools/aida/wdh/out
OPENAI_API_KEY=… node tools/aida/content/seed.mjs  # drafts/, content/out/, aida/data/
npx -y @adobe/aem-cli up --html-folder drafts --html-mount /
```

Open `/aida/index`, `/aida/de/de/i5` (all values current) and `/aida/fr/fr/i5` (French copy that
still carries DE values: outlined, listed in the check panel). Locally there is no `.md` and no
JSON-LD rendering for draft pages; both come from preview.

The model is any OpenAI-compatible endpoint (`AIDA_AI_URL`, `AIDA_AI_KEY`, `AIDA_AI_MODEL`, default
`gpt-4.1-mini`), standing in for the BMW AI platform. No Adobe model is used.

## Setup in Document Authoring

Order matters; each step is outward-facing and needs a go.

1. **Code:** push branch `aida`. Code is then served from `https://aida--bmw--moved-permanently.aem.page`.
2. **Content** (org `moved-permanently`, site `bmw`, only under `/aida/`), with a DA token in
   `DA_TOKEN`:
   ```sh
   for f in $(cd tools/aida/content/out && find aida -name '*.html'); do
     node tools/aida/agent/aida.mjs put "tools/aida/content/out/$f" "/${f%.html}"
   done
   ```
   Sheets: `aida/data/wdh-de`, `wdh-fr`, `brand-terms`, `market-features`, `aida/news-index`
   (JSON from `wdh/out/`, `content/data/`, `content/out/aida/`). Then preview `/aida/**`.
3. **Site config** (`https://da.live/config#/moved-permanently/bmw/`):
   - `library` tab: `WDH values` | `https://aida--bmw--moved-permanently.aem.page/tools/aida/wdh-picker/wdh-picker.html`
   - `prepare` tab: `Preflight` | `https://aida--bmw--moved-permanently.aem.page/tools/aida/preflight/preflight.html`
     (replaces the built-in Preflight for this site; remove the row to restore it)
   - `.da/translate.json`: from `content/da/translate.json` (source English `/aida/en`; German
     `/aida/de` → `/aida/de/de`; French `/aida/fr` → `/aida/fr/fr`, `/aida/fr/be`; rollout `merge`).
     Check first whether the site already has one.
4. **Radar:** `https://da.live/app/moved-permanently/bmw/tools/aida/radar/radar?ref=aida`
   (no config needed; DA asks once to trust the app because it is not an Adobe org app).

## Release (M4, product features)

1. Protect the preview with site authentication before sharing anything with BMW
   ([docs](https://www.aem.live/docs/authentication-setup-site)); it is an Admin API config change.
2. Snapshot `i5-launch` with `/aida/de/de/i5`, `/aida/fr/fr/i5` and the news pages; set a review
   password; share the `*.aem.reviews` link (no Adobe account, no Sidekick)
   ([docs](https://www.aem.live/docs/snapshots-reviews)).
3. Reject → fix → approve → publish as a unit. Scheduled snapshot publishing is early access and
   must be enabled for the org ([docs](https://www.aem.live/docs/ew/authoring/snapshots)).

## Workshop click path

1. `/aida/de/de/i5`: bmw.de on EDS. The i5 range appears six times (three values, three WLTP
   statements); all are bound to WDH, 20 values in total. Check panel: 20 of 20 current.
2. `/aida/fr/fr/i5`: the customer's model translated the page, brand terms intact; tech values
   are still German → outlined. In DA, Preflight lists them and syncs them in one click; the
   Highway Assistant is flagged because it is not available in France.
3. `aida.mjs translate /aida/en/i5 /aida/fr/be/i5 --to fr`: an agent writes a new market copy
   through the API with French values and JSON-LD; the radar shows it appear.
4. `/aida/index`: the same page as Markdown for LLMs, HTML fragment, JSON-LD and data; news
   built from WDH values. `node tools/aida/consumer/app-stream.mjs` builds app cards from the
   same URLs.
5. Release: snapshot, review link without an account, publish as a unit.

## Known limits

- Values are kept in the document and synced by the agent or Preflight; production would re-sync
  on every WDH change (webhook → `aida.mjs sync`).
- No field-level locking, native glossary or translation memory in DA; brand terms are protected
  by the agent, translation memory stays with the customer's AI or TMS.
