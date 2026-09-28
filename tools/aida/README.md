# AIDA demo: composable without headless

A demo layer on the migrated bmw.de that answers the RfP's content-creator and Vendor Briefing I/III
scenarios, told as the BMW i5 launch. It is built, live on preview, and everything below can be
clicked. Content lives under `/aida/`; the migrated site is unchanged.

## Check it yourself

1. **Open formats, LLM visibility.** [Hub](https://aida--bmw--moved-permanently.aem.page/aida/):
   one page as web page, Markdown for LLMs, HTML fragment, JSON-LD and data, plus a news list built
   from WDH data. Also: [i5 as Markdown](https://aida--bmw--moved-permanently.aem.page/aida/fr/fr/i5.md),
   [llms.txt](https://aida--bmw--moved-permanently.aem.page/llms.txt),
   [a news article](https://aida--bmw--moved-permanently.aem.page/aida/en/news/bmw-i5-edrive40).
2. **One source for every tech value (WDH).**
   [i5, Germany](https://aida--bmw--moved-permanently.aem.page/aida/de/de/i5): all 20 tech values
   come from WDH; the panel bottom right says "All 20 values match WDH (DE)". The data as served:
   [DE](https://aida--bmw--moved-permanently.aem.page/aida/data/wdh-de.json),
   [FR](https://aida--bmw--moved-permanently.aem.page/aida/data/wdh-fr.json).
3. **Translate and roll out.** In [Translate](https://da.live/apps/loc#/moved-permanently/bmw),
   open the project *i5-launch--rehearsal-* to see a finished run, or create a new one:
   - URL: `https://main--bmw--moved-permanently.aem.page/aida/en/i5` (the
     [English source](https://aida--bmw--moved-permanently.aem.page/aida/en/i5)) → *Validate sources*
     → *Confirm options*: choose *Translate* for all languages (Austria and Belgium are preselected,
     rollout uses *merge*) → *Start project* → *Translate all* → *Rollout locales* → *Rollout all ready*.
   - Results: [German](https://aida--bmw--moved-permanently.aem.page/aida/de/i5),
     [Austria](https://aida--bmw--moved-permanently.aem.page/aida/de/at/i5),
     [French](https://aida--bmw--moved-permanently.aem.page/aida/fr/i5),
     [Belgium](https://aida--bmw--moved-permanently.aem.page/aida/fr/be/i5). Brand terms such as
     "eDrive" stay untranslated (translation config).
   - Local edits survive: [Belgium in the editor](https://da.live/edit#/moved-permanently/bmw/aida/fr/be/i5)
     has a local launch-offer line under the headline. After French was rolled out again, the line is
     still there and the editor marks where the page differs from the French version, to keep or drop.
   - Translation runs on Google by default; Lionbridge, Smartling and Trados connectors exist, and
     BMW's own AI would be a custom connector. The [English source](https://aida--bmw--moved-permanently.aem.page/aida/en/i5)
     and the [French market page](https://aida--bmw--moved-permanently.aem.page/aida/fr/fr/i5) were
     translated by a model through the API instead, standing in for BMW's AI platform.
4. **Governance before publishing.** The translated
   [Belgium page](https://aida--bmw--moved-permanently.aem.page/aida/fr/be/i5) still carries German
   data: the panel says "20 of 20 values need an update (FR)". In the
   [editor](https://da.live/edit#/moved-permanently/bmw/aida/fr/be/i5), prepare menu → *Preflight*
   lists them and updates them in one click. It also checks the WLTP statement, market features
   (the Highway Assistant is not available in France, see the
   [French page in the editor](https://da.live/edit#/moved-permanently/bmw/aida/fr/fr/i5)), brand
   terms and SEO basics. The side panel → *WDH values* inserts tech values for the page's market
   (pick the i5 in the list).
5. **Rollout status across markets.**
   [Rollout radar](https://da.live/app/moved-permanently/bmw/tools/aida/radar/radar?ref=aida)
   (confirm the trust prompt once): pages × languages and markets, status, and red badges for tech
   values that differ from WDH.
6. **Baseline.** [The plain 1:1 migration](https://main--bmw--moved-permanently.aem.page/de/home),
   migrated by EMA in under three days.

Translate and the radar are also listed under *Apps* for the site.

## RfP coverage

| RfP ask | Step |
|---|---|
| VB III: WDH connector, single tech value, per-market formatting, feature availability | 2, 4 |
| Architecture session: fragments for web/app/banner, LLM visibility; questionnaire BCK-009, LEG-007 (export as JSON/Markdown) | 1 |
| Content creators #1, #8; VB III localisation; VB I rollout | 3 |
| Architecture session: BMW's own AI, API read/write for their agents | 3 |
| Content creators #10; VB III governance | 4 |
| VB III: work status within one country and across countries | 5 |
| VB I news pilot (proposed first production step) | 1 |
| Content creators #4–6: release calendar, review without accounts, publish with CDN purge | product features (snapshots, review link, Akamai purge on publish); not prepared in this demo |

Not covered, and said openly: no field- or block-level locking (#11), no native glossary or
translation memory (#8), no workflow engine (#9); "chat with your analytics" (#7) would be a build.

## How it works

- WDH extract → connector → one sheet per market in Document Authoring (`/aida/data/wdh-<market>.json`).
- Pages link each tech value to its sheet row and keep the formatted value, so HTML, Markdown,
  crawlers and LLMs get it without JavaScript. On preview, a small script compares values with the sheet.
- Every page is also `.md` and `.plain.html`; sheets are JSON. No headless tier, nothing extra to run.
- Translate is Document Authoring's app, driven by `.da/translate.json` (English `/aida/en` → German
  `/aida/de` → `/aida/de/de`, `/aida/de/at`; French `/aida/fr` → `/aida/fr/fr`, `/aida/fr/be`).
- Preflight, the WDH picker and the radar are editor extensions served from this repository.
- The agent (`agent/aida.mjs`) reads and writes content through the Document Authoring API with any
  OpenAI-compatible model.

## Operating the demo

- Reset after a rehearsal: restore the French page with
  `node tools/aida/agent/aida.mjs put tools/aida/content/out/aida/fr/fr/i5.html /aida/fr/fr/i5`, and
  delete `/aida/de/i5`, `/aida/de/at`, `/aida/fr/i5` and `/aida/fr/be` in the editor before a fresh
  translation run.
- Rebuild content: `OPENAI_API_KEY=… node tools/aida/content/seed.mjs` (needs the WDH market sheets in
  `aida/data/`). Tests: `npm test`.
- Site config: `library` (WDH values), `prepare` (Preflight, replaces the built-in one for this site)
  and `apps` (Translate, Rollout radar) in the
  [site config](https://da.live/config#/moved-permanently/bmw/).
