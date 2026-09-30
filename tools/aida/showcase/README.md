# BMW RfP I + III · connected showcase

[Start the playground](https://main--bmw--moved-permanently.aem.page/tools/aida/showcase/index.html)

A repeatable BMW launch journey connects news creation, quality gates, review/rejection, full-page translation fixtures, translation memory corrections, four market rollouts, structural/property conflict resolution, source-bound approval, a frozen dry-run release, and a status/action radar.

## Real and substituted boundaries

- **Real:** Document Authoring source documents and editor links; EDS preview/live publication; HTML, Markdown and fragments; public BMW Scene7/COSY delivery; supplied WDH extracts; editor extensions using the author's existing DA context; official vendored Adobe Spectrum CSS.
- **Migrated:** existing EMA BMW blocks and default content compose the authoring documents; no showcase-specific composition block is generated.
- **Custom:** deterministic composition generator, public-catalogue asset picker, WDH bindings, Preflight and navigation/status surfaces.
- **Simulated:** browser-local personas and permission checks, secure/embargo policy, approval/notifications/tasks, deterministic AI-provider fixture, translation memory, market conflict operations, scheduling/release status and sample insights. These never call a publication API. This UI is not an IAM or security boundary.
- **Not connected:** OTMM, Salesforce, BMW private IMS/DAM, protected review/media, external task/mail delivery, real BMW analytics, generative outpainting. Format extension uses a neutral canvas and preserves the complete photograph.

Do not enter confidential launch information. Everything linked publicly is safe demonstration content. All simulated decisions stay in the `bmw-aida-showcase-v1` localStorage key for this origin. Reset only resets that key's state; it does not change DA or EDS. Export evidence/tasks before resetting if required.

## Compositions and contexts

- `/aida/showcase/en/{home,i5,e-mobility,news/i5-launch}`: source fixtures.
- `/aida/showcase/de/de/…`, `/de/at/…`, `/fr/fr/…`, `/fr/be/…`: populated market fixtures.
- Austria uses an explicit DE data fallback and references DE secondary news; Belgium uses an explicit FR data fallback. This is not authoritative AT/BE product data.
- 64 planning slots are represented, but only four markets have populated fixtures. Sixty placeholders do not prove production-scale rollout.
- Distinct proposed organization spaces, language, region, market, importer, dealer and environment dimensions preserve independence. Only the BMW space is populated.

Home includes i5, iX3 video, e-mobility, the mandatory Cannes/Concept M/X list and the DE summer offer. Car includes KPIs, shared charging facts, shortened shared interior news, attribute-selected electrified models and market availability of assistance features. Topic includes stage/range/charging, product lineup and hydrogen news. Supplied WDH values take precedence over exemplary prices/figures in the briefing copy; all offers and snapshots are labelled demo data.

### Authoring contracts, not fixture wrappers

The generator uses the original migrated contracts, verified against [the migrated i5 native `.plain.html`](https://main--bmw--moved-permanently.aem.page/de/neufahrzeuge/bmw-i/i5/bmw-i5-ueberblick.plain.html), [the migrated iX3 native `.plain.html`](https://main--bmw--moved-permanently.aem.page/de/neufahrzeuge/x/ix3/bmw-ix3.plain.html) (including Hero Stage, Car KPIs and Card List), and the implementations below. Sections carry `section-metadata` tables for spacing and article width. Block options describe actual supported block capabilities, not page types or workflow identities.

| Composition | Existing contract |
| --- | --- |
| Home/Car i5 main teaser | [Hero Teaser](https://github.com/moved-permanently/bmw/blob/main/blocks/hero-teaser/hero-teaser.js): media row, content row; `no-autoplay`; legal copy in an adjacent [Disclaimer](https://github.com/moved-permanently/bmw/blob/main/blocks/disclaimer/disclaimer.js) block. |
| iX3 video and image/text features | [Columns](https://github.com/moved-permanently/bmw/blob/main/blocks/columns/columns.js): one row, separate media and content cells. Poster/video-only cells already become nested [Video](https://github.com/moved-permanently/bmw/blob/main/blocks/video/video.js) blocks; `video-controls` enables the existing player without autoplay. |
| Mandatory curated teaser list, charging teasers, product lineup | [Carousel](https://github.com/moved-permanently/bmw/blob/main/blocks/carousel/carousel.js): one row per item, media cell then content cell; product rows use the supported `cards` option. |
| Car figures | [Car KPIs](https://github.com/moved-permanently/bmw/blob/main/blocks/car-kpis/car-kpis.js): one row per figure. Its supported two-cell value/label form keeps each full WDH display value and unit in one bound authoring link instead of inventing separate data keys. |
| Assistance features | [Card List](https://github.com/moved-permanently/bmw/blob/main/blocks/card-list/card-list.js): one intro row followed by supported title/content rows without optional icons. The FR/BE fixture omits Highway Assistant. |
| Topic and News stage | [Hero Stage](https://github.com/moved-permanently/bmw/blob/main/blocks/hero-stage/hero-stage.js): separate media and content rows. |
| News body | Default paragraphs, lists and CTAs in a width-constrained section; `NewsArticle` and optional `about: Vehicle` stay in page metadata, not in a body block. |

[Cards](https://github.com/moved-permanently/bmw/blob/main/blocks/cards/cards.js), [Media](https://github.com/moved-permanently/bmw/blob/main/blocks/media/media.js), [Fragment](https://github.com/moved-permanently/bmw/blob/main/blocks/fragment/fragment.js) and [News List](https://github.com/moved-permanently/bmw/blob/main/blocks/news-list/news-list.js) were also inspected. They are not prerequisites for these compositions: the mandatory list is curated and repeats particular long/short news teasers, whereas News List selects the newest indexed articles. No new fragments or migrated-block changes are required to express the supplied composition.

The previous generator flattened every row/cell into one cell of generic `stage`, `feature`, `grid`, `kpi` or `article` variants, then embedded a visible `component:` paragraph so a custom decorator could infer structure again. That preserved the simulation's identities at the expense of the real authoring contracts. New documents contain neither that marker nor the generic block. `compositions.json` explicitly marks `fixtureOnly: true` and maps stable fixture IDs to section indices and native block names; the separate browser-local workflow model retains its own IDs. Neither constitutes native DA inheritance or workflow metadata. Legacy generic-block tests remain only for compatibility with previously published documents, not as the model for new content.

## Rebuild, verify and publish

```sh
npm ci
npm test
npm run lint
node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON tools/aida/showcase/content.mjs --plain
npx -y @adobe/aem-cli up --html-folder drafts --no-open
```

The generator writes forty HTML documents and six JSON sheets to ignored `tools/aida/content/out/showcase/`. It never mutates remote content. Use registered DA tools to create/update, preview **and** publish each path, then read back preview/live bodies. Code shipping and content publication remain independent. The output can be rebuilt without any AI credential.

Generated pages use authored WDH-bound links and have no fact refresh CTA or initial WDH request. The existing bounded refresh installer is invoked by the legacy generic block, not globally by the migrated page runtime; emitting its JSON link in default content would therefore be an inert CTA. Native Car KPIs also rebuilds its display from value text, so runtime refresh of its counter is not claimed. The independent Delivery demonstration measures its explicit request and shows a separately labelled synthetic WDH update into repeated stored HTML, Markdown and `NewsArticle.about` metadata. Its one-request, timeout, safe-text and initial-value-retention behavior remains regression-tested. That local propagation is not a live content write, and the page CTA must not be restored merely to imply such a capability.

Full RfP traceability, exact click script, presentation and screenshot evidence are delivered with the showcase handoff. The simulation is an operating-model demonstration, not a claim that DA natively provides all these workflows or protected preview guarantees.
