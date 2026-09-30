# BMW RfP I + III · connected showcase

[Start the playground](https://main--bmw--moved-permanently.aem.page/tools/aida/showcase/index.html)

A repeatable BMW launch journey connects news creation, quality gates, review/rejection, full-page translation fixtures, translation memory corrections, four market rollouts, structural/property conflict resolution, source-bound approval, a frozen dry-run release, and a status/action radar.

## Real and substituted boundaries

- **Real:** Document Authoring source documents and editor links; EDS preview/live publication; HTML, Markdown and fragments; public BMW Scene7/COSY delivery; supplied WDH extracts; editor extensions using the author's existing DA context; official vendored Adobe Spectrum CSS.
- **Custom:** composition blocks, public-catalogue asset picker, WDH bindings, Preflight and navigation/status surfaces.
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

## Rebuild, verify and publish

```sh
npm ci
npm test
npm run lint
node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON tools/aida/showcase/content.mjs --plain
npx -y @adobe/aem-cli up --html-folder drafts --no-open
```

The generator writes forty HTML documents and six JSON sheets to ignored `tools/aida/content/out/showcase/`. It never mutates remote content. Use registered DA tools to create/update, preview **and** publish each path, then read back preview/live bodies. Code shipping and content publication remain independent. The output can be rebuilt without any AI credential.

The block has zero initial WDH fetches and one explicit fact refresh request per page session. The Delivery tab measures its actual refresh request and demonstrates a separate, explicitly synthetic WDH update into repeated stored HTML, Markdown and `NewsArticle.about` metadata. That local propagation is not a live content write.

Full RfP traceability, exact click script, presentation and screenshot evidence are delivered with the showcase handoff. The simulation is an operating-model demonstration, not a claim that DA natively provides all these workflows or protected preview guarantees.
