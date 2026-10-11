/* eslint-disable max-len */
/*
 * Prepared BMW skills for the Experience Workspace assistant: flat .da/skills/<id>.md plus the
 * config `skills` sheet (deployed Skills Editor) and .da/skills/<id>/skill.md (folder-layout agent
 * loader), same content (frontmatter: name, description, version, status). Plus prompts for the
 * DA config `prompts` sheet. Public / synthetic inputs only;
 * the skills never preview or publish and never type tech values (WDH is the source of truth).
 */

const CATALOGUE = 'https://main--bmw--moved-permanently.aem.page/tools/aida/asset-picker/catalogue.json';

export const SKILLS = [
  {
    id: 'bmw-find-campaign-media',
    version: 3,
    description: 'Finds existing public BMW Scene7 images and films for a model or campaign from a compact per-model media sheet, shows where they are used and returns them in the site link convention with crops and alt text.',
    body: `# Find campaign media (BMW)

Use when an author asks for images or films for a campaign, a model or a topic (for example "media for the BMW i5 launch").

## Source (read only, small)
1. Read \`/aida/data/media/index.json\`: one row per model (model, sheet, assets). Pick the model the author means (e.g. "BMW i5" → i5; G60 is the i5 / 5 Series generation).
2. Read only that model's sheet \`/aida/data/media/<model>.json\` (rows: kind image/film, url = Scene7 original, alt, crops, uses = number of pages, pages). It is built from the BMW assets catalogue and this site's Media Library index.
3. Never read \`.da/media-insights\` index chunks and never read the full assets catalogue (${CATALOGUE}): both are too large for one conversation. For anything beyond the sheet, point the author to the Media Library app (https://da.live/apps/media-library#/moved-permanently/bmw) or the BMW assets picker.

## Steps
1. Ask for the model if it is not given.
2. Prefer images with alt text and assets used on several pages; add films only when asked or when they are the obvious stage media.
3. Return at most 10 candidates as a table: preview thumbnail link (\`<url>?wid=400\` for images), alt text, used on (pages as https://main--bmw--moved-permanently.aem.page<path>, at most three), crops.
4. Insert only on request, as a link in the site convention: \`[alt text](https://bmw.scene7.com/is/image/BMW/<name>)\`, keeping a smart-crop suffix such as \`:16to7\` or \`:3to2\` when the block needs a ratio. Films are \`https://bmw.scene7.com/is/content/BMW/<name>\` links after the poster image. The BMW assets picker does the same with alt and crop checks.

## Rules
- Only existing public BMW Scene7 references; never generate, upload or edit imagery.
- Never insert media_ preview URLs; always the Scene7 original from the sheet.
- Do not change tech values in captions; WDH values are inserted with the WDH values panel.
- Never preview or publish; the author decides.`,
  },
  {
    id: 'bmw-draft-from-approved-facts',
    description: 'Drafts BMW page or news copy only from approved facts: WDH market values as bound links, approved brand terms and the author\'s brief.',
    body: `# Draft from approved facts (BMW)

Use when an author asks for a first draft of a news story, a launch page section or a teaser.

## Approved facts (read only)
- Tech values: the WDH market sheet \`/aida/data/wdh-<market>.json\` (sheet \`values\`: key = <model code>.<field>, value, unit). Markets: de, fr.
- Brand terms that must not be translated or changed: \`/aida/data/brand-terms.json\`.
- Market features (e.g. assistance systems not offered in a market): \`/aida/data/market-features.json\`.
- The author's brief in the conversation.

## Steps
1. Confirm market and model (WDH code). Read the WDH sheet of that market.
2. Draft headline, lead and body from the brief. Every tech value is inserted as a WDH binding: \`[<value> <unit>](/aida/data/wdh-<market>.json#<code>.<field>)\` with the sheet value as text. If WDH has no value, write "[value missing in WDH]" instead of a number.
3. Add the WLTP statement of the model (field \`wltp\`) wherever consumption, range or emissions are mentioned.
4. Show the draft in the conversation first. Create a page only when the author asks, under \`/aida/drafts/\`, and say that it is a draft.

## Rules
- No facts beyond WDH, the brand terms and the brief; no prices or offers that are not in WDH.
- Never preview or publish; the author reviews and runs Preflight.`,
  },
  {
    id: 'bmw-brand-market-readiness',
    description: 'Reviews a page for brand and market readiness: WDH values of the right market, WLTP statement, market features, brand terms and basic SEO, with findings and fixes.',
    body: `# Brand and market readiness review (BMW)

Use when an author asks whether a page is ready for a market ("is the Belgian i5 page ready?").

## Checks (read the page with content_read)
1. **WDH market**: every tech value is a WDH binding of the page's market (\`/aida/fr/be/...\` → fr, \`/aida/de/at/...\` → de). Compare each binding with \`/aida/data/wdh-<market>.json\`; report bindings from another market and values that differ.
2. **WLTP statement**: present wherever consumption, range or emissions appear.
3. **Market features**: features listed as unavailable for the market in \`/aida/data/market-features.json\` must not be promised.
4. **Brand terms**: terms from \`/aida/data/brand-terms.json\` are spelled exactly and not translated.
5. **SEO basics**: title, description, one H1, image alt texts.

## Output
A short table: check, status (ok / needs attention), evidence (quote or binding), suggested fix. Point to the editor's Preflight for the one-click WDH update.

## Rules
- Report findings; do not hide valid warnings. Change the page only when the author asks.
- Approval status is the author's or approver's decision; WDH drift is a separate finding.
- Never preview or publish.`,
  },
];

export const PROMPTS = [
  { title: 'Find campaign media', prompt: 'Use the skill bmw-find-campaign-media: find existing BMW images and films for the BMW i5 launch and show where they are already used.' },
  { title: 'Draft from approved facts', prompt: 'Use the skill bmw-draft-from-approved-facts: draft a short news story about the BMW i5 eDrive40 for market de, with WDH-bound values only.' },
  { title: 'Brand and market readiness', prompt: 'Use the skill bmw-brand-market-readiness: review this page for its market and list what needs attention.' },
];

/** .da/skills/<id>/skill.md files (version 1, approved). */
export function skillFiles() {
  return Object.fromEntries(SKILLS.map((s) => [
    `/.da/skills/${s.id}/skill.md`,
    `---\nname: ${s.id}\ndescription: ${JSON.stringify(s.description)}\nversion: ${s.version || 1}\nstatus: approved\n---\n${s.body}\n`,
  ]));
}

/** Deployed Skills Editor layout: flat .da/skills/<id>.md (same content as the folder layout). */
export function flatSkillFiles() {
  const folder = skillFiles();
  return Object.fromEntries(SKILLS.map((s) => [`/.da/skills/${s.id}.md`, folder[`/.da/skills/${s.id}/skill.md`]]));
}

/** Rows for the site config `skills` sheet (key, content, explicit status). */
export function skillsSheetRows() {
  const flat = flatSkillFiles();
  return SKILLS.map((s) => ({ key: s.id, content: flat[`/.da/skills/${s.id}.md`], status: 'approved' }));
}
