# BMW showcase on native Document Authoring / Experience Workspace capabilities

Not served (`.hlxignore`). Labels: **product** = native DA / Experience Workspace capability,
**custom** = this repository, **blocked** = needs access or an Adobe service not available here.

| Capability | Where | Label |
|---|---|---|
| Block library: Stage, Key figures, Video, Assist features, News teaser, Disclaimer, Call to action | DA `/library/blocks/*`, sheet `/library/blocks.json`; site config `library` row "Blocks" | product library, custom content (`library.mjs`) |
| Templates: News story, Vehicle launch, E-mobility topic | DA `/library/templates/*`, sheet `/library/templates.json`; row "Templates" | product library, custom content |
| Media Library plugin (fullsize-dialog) + app | config `library` row "Media Library", `apps` row; index `.da/media-insights/` | product; index not yet built (needs one signed-in app run) |
| Structured content: schemas `news`, `market-offer` | DA `/.da/forms/schemas/*`; Schema Editor `https://da.live/apps/schema#/moved-permanently/bmw` | product (schemas custom, `structured.mjs`) |
| Form routing | org config `editor.path` for `/aida/structured/news` and `/aida/structured/offers` → `https://da.live/form#` (classic DA browser; the Workspace canvas tree ignores it) | product |
| Records → rendered page | DA `/aida/structured/{news,offers}/*`; `blocks/news`, `blocks/market-offer` (WDH values read at render time), `blocks/da-form` | custom blocks |
| Skills + prompts | DA `/.da/skills/bmw-*/skill.md`; config `prompts`; Skills Lab `https://da.live/apps/skills#/moved-permanently/bmw` | product editor, custom skills (`skills.mjs`) |
| Launch review | apps row → `https://da.live/apps/snapshots#/moved-permanently/bmw` | product; snapshot creation needs the publish/admin role (admin API) |
| Canvas default view | site config `flags`: `ew.canvasDefaultView = layout` (no `ew.canvasDefaultPanel`) | product setting |
| Request Publish / Inbox, Scheduler, RUM Explorer | not registered | blocked: Adobe worker onboarding + email provider; admin-role scheduler registration; Adobe-issued domain key |

Native Media Library discovery indexes Scene7 videos (`/is/content/…`) and bmw.de files, but not
extension-less Scene7 images (`/is/image/…`); the BMW assets picker stays the image picker.
Structured content is not AEM Content Fragments: no references, workflow or ownership governance.
WDH stays the only source of technical data (records reference a model and field names only).
