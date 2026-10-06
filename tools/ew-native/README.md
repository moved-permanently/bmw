# BMW showcase on native Document Authoring / Experience Workspace capabilities

Not served (`.hlxignore`). Labels: **product** = native DA / Experience Workspace capability,
**custom** = this repository, **blocked** = needs access or an Adobe service not available here.

| Capability | Where | Label |
|---|---|---|
| Block library: Stage, Key figures, Video, Assist features, News teaser, Disclaimer, Call to action | DA `/library/blocks/*`, sheet `/library/blocks.json`; site config `library` row "Blocks" | product library, custom content (`library.mjs`) |
| Templates: News story, Vehicle launch, E-mobility topic | DA `/library/templates/*`, sheet `/library/templates.json`; row "Templates" | product library, custom content |
| Media Library plugin (fullsize-dialog) + app | config `library` row "Media Library", `apps` row; index `.da/media-insights/` (built by a signed-in discovery run: 5094 entries, schemaVersion 2, 1 chunk) | product; usage coverage limited (below) |
| Structured content: schemas `news`, `market-offer` | DA `/.da/forms/schemas/*`; Schema Editor `https://da.live/apps/schema#/moved-permanently/bmw` | product (schemas custom, `structured.mjs`) |
| Form routing | org config `editor.path` for `/aida/structured/news` and `/aida/structured/offers` → `https://da.live/form#` (classic DA browser; the Workspace canvas tree ignores it) | product |
| Records → rendered page | DA `/aida/structured/{news,offers}/*`; `blocks/news`, `blocks/market-offer` (WDH values read at render time), `blocks/da-form` | custom blocks |
| Records → JSON → consumer | `https://da-sc.adobeaem.workers.dev/<preview, review or live>/moved-permanently/bmw/<record>` (SDK `convertHtmlToJson` of the previewed record); `blocks/offer-teaser` on DA `/aida/structured/teasers` | product delivery endpoint, custom block |
| Skills + prompts | DA `/.da/skills/bmw-*.md` + site config `skills` sheet (key, content, status `approved`), as the deployed Skills Editor reads them; same content in `/.da/skills/bmw-*/skill.md` for the folder-layout agent loader; config `prompts`; Skills Lab `https://da.live/apps/skills#/moved-permanently/bmw` | product editor, custom skills (`skills.mjs`); slash-command visibility needs a signed-in check |
| Launch review | apps row → `https://da.live/apps/snapshots#/moved-permanently/bmw` | product; snapshot creation needs the publish/admin role (admin API) |
| Canvas default view | site config `flags`: `ew.canvasDefaultView = layout` (no `ew.canvasDefaultPanel`) | product setting |
| Schedule Publish | site config `prepare` row "Schedule Publish" (no path: built-in action) and apps row → `https://da.live/apps/scheduler`; the site was registered once by an admin in the native app (no second key) | product |
| Request Publish / Inbox | not registered | blocked: the client defaults to `publish-requests.aem-poc-lab.workers.dev` (source `cloudadoption/publish-requests-worker`), which needs a per-site registration (KV) by its operator; mail via AWS SES; forwarded user IMS permissions; authorized demo recipients only. Native approval publishes |
| OpTel (RUM) Explorer | no app row, no key in config | blocked: domain-key and bundle requests return 403 for main--bmw--moved-permanently.aem.page; needs an Adobe-issued domain key. Zero KPIs are not measured traffic |

Native Media Library (observed index, 2026-10-06): 3425 image, 1584 video and 85 document rows; the
app shows 1986 images and finds Scene7 images such as `P001_SL_G60-8135_Ext_Dsk_v001`. Scene7
images enter only as preview copies (`media_<hash>` URLs, `originalPath` `/BMW/<name>`, operation
`ingest` / `reuse`) without a page (`doc` empty), so they show 0 references despite real use;
linked Scene7 images (`/is/image/…`, no extension) are not parsed as external media. Scene7 films
and bmw.de files are indexed with their pages. Native insertion sends `<img src=URL>` without alt
(the media-bus copy, not the Scene7 original or its crop), so the BMW assets picker stays the image
insertion path (carrier link, alt, crops); no BMW rights / alt / original-reference behaviour is
claimed for the native plugin.

`discover-media` (adobe-rnd/aem-agentic-plugins) is a skill resource of the public MCP connector
`https://aem-agentic-plugins.adobeaem.workers.dev/mcp` (initialize 200, resource
`skill://discover-media`); it reads the same index through DA source tools. The connector is not
registered here because it also exposes write tools (permissions, publish requests, scheduling,
e-mail). The BMW skill `bmw-find-campaign-media` (v2) reads the index the same way, read-only, and
maps preview copies back to their Scene7 originals.
Structured content is not AEM Content Fragments: no references, workflow or ownership governance.
WDH stays the only source of technical data (records reference a model and field names only).
