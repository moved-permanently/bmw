# BMW RfP I + III · connected showcase

[Open the demo path](https://main--bmw--moved-permanently.aem.page/tools/aida/showcase/index.html#path)

The demo path walks the BMW launch story chapter by chapter and links each step to the real product surface: the editor, Snapshots, Translate, Request Publish and its inbox, the rollout radar, Files and the published pages. The other tabs explain the architecture, the BMW asset picker and delivery formats. The showcase keeps no workflow state of its own: review, translation, rollout and publication happen in Experience Workspace.

The opening agenda lists all six Briefing I steps and all nine in-scope Briefing III sections. Each row links to every demo chapter tagged with that reference, excluding the recap. Regression tests check both section and chapter coverage. This maps the demo story; it does not claim that the production connections described in the architecture view are already configured.

The WDH chapter at `#path/3` also links to [the worker-served German i5 page](https://wdh-proxy.aem-poc-lab.workers.dev/aida/showcase/de/de/i5). The deployed [worker implementation](https://github.com/moved-permanently/bmw/blob/af335eb73d7ff315f5250c7fb3f4bc5df21e5c9e/tools/workers/wdh-proxy/src/index.js) replaces authored WDH anchors with non-clickable spans in the HTML response, before browser JavaScript runs. It preserves the saved figures and source references; it does not fetch fresh WDH values. Direct AEM preview pages keep the browser-side cleanup.

Editor and DA app links (canvas, document view, forms, Translate, Media Library, Snapshots, Schemas, Scheduler, Rollout radar) open the da-live branch the demo is pinned to: `DA_EDITOR` in [`tools/aida/editor.js`](../editor.js), currently `ewdemo` (the editor with Request Publish and the live comparison), the same branch as the `editor.path` rows of the site and org config. To unpin, set it to `https://da.live` and update the Translate link in `radar/radar.html`.

## Real and substituted boundaries

- **Real:** Document Authoring source documents and editor links; EDS preview/live publication; HTML, Markdown and fragments; public BMW Scene7/COSY delivery; supplied WDH extracts; editor extensions using the author's existing DA context; official vendored Adobe Spectrum CSS.
- **Migrated:** existing EMA BMW blocks and default content compose the authoring documents; no showcase-specific composition block is generated.
- **Custom:** deterministic composition generator, public-catalogue asset picker, WDH bindings, Preflight and navigation/status surfaces.
- **Not connected:** OTMM, Salesforce, BMW private IMS/DAM, protected review/media, external task/mail delivery, real BMW analytics, generative outpainting. Format extension uses a neutral canvas and preserves the complete photograph.

Do not enter confidential launch information. Everything linked publicly is safe demonstration content.

## Compositions and contexts

- `/aida/showcase/en/{home,i5,e-mobility,news/i5-launch}`: source fixtures.
- `/aida/showcase/de/de/…`, `/de/at/…`, `/fr/fr/…`, `/fr/be/…`: populated market fixtures.
- Austria uses an explicit DE data fallback and references DE secondary news; Belgium uses an explicit FR data fallback. This is not authoritative AT/BE product data.
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

The previous generator flattened every row/cell into one cell of generic `stage`, `feature`, `grid`, `kpi` or `article` variants, then embedded a visible `component:` paragraph so a custom decorator could infer structure again. That preserved the simulation's identities at the expense of the real authoring contracts. New documents contain neither that marker nor the generic block. `compositions.json` explicitly marks `fixtureOnly: true` and maps stable fixture IDs to section indices and native block names. It is not native DA inheritance or workflow metadata. Legacy generic-block tests remain only for compatibility with previously published documents, not as the model for new content.

## Rebuild, verify and publish

```sh
npm ci
npm test
npm run lint
node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON tools/aida/showcase/content.mjs --plain
npx -y @adobe/aem-cli up --html-folder drafts --no-open
```

The generator writes forty HTML documents and six JSON sheets to ignored `tools/aida/content/out/showcase/`. It never mutates remote content. Use registered DA tools to create/update, preview **and** publish each path, then read back preview/live bodies. Code shipping and content publication remain independent. The output can be rebuilt without any AI credential.

Generated pages use authored WDH-bound links and have no fact refresh CTA or initial WDH request. The existing refresh installer is invoked by the legacy generic block, not globally by the migrated page runtime; emitting its JSON link in default content would therefore be an inert CTA. Native Car KPIs also rebuilds its display from value text, so runtime refresh of its counter is not claimed. The page CTA must not be restored merely to imply such a capability.

- Legacy installer: [the existing runtime](https://github.com/moved-permanently/bmw/blob/main/scripts/aida-showcase.js) has a one-request guard, a five-second timeout, response-size/row limits, safe text updates and initial-value retention on failure. Its separate regression tests cover the guard and safe text updates; they do not establish Delivery tab behavior.
- Delivery tab: [the independent playground action](https://github.com/moved-permanently/bmw/blob/main/tools/aida/showcase/app.js) measures explicit requests to the DE fixture sheet, permits repeated manual requests and has no timeout. The action temporarily disables its button while fetching, then re-enables it on completion or error. It renders the response as text and reports elapsed time/bytes. A separate mock update demonstrates synthetic propagation into repeated stored HTML, Markdown and `NewsArticle.about` metadata. Neither fetching nor mock propagation writes live content.

Full RfP traceability, exact click script, presentation and screenshot evidence are delivered with the showcase handoff.
