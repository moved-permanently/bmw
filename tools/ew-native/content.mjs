/* eslint-disable max-len, import/extensions */
/*
 * Everything the EW native showcase writes to DA, from one checked-in source: content files and the
 * append-only config steps (applied with tools/ew-native/config.mjs appendRows, i.e. existing rows
 * are never replaced; re-running is a no-op). Consumers as deployed: Skills Editor = flat
 * .da/skills/<id>.md + config `skills` sheet (inline content, explicit status); assistant slash
 * menu = `skills` sheet keys (status not draft) and `prompts`; prepare action "Schedule Publish"
 * by title. Structured-content records are serialized with the official da-sc SDK (not here).
 */
import { buildLibrary } from './library.mjs';
import {
  skillFiles, flatSkillFiles, skillsSheetRows, PROMPTS,
} from './skills.mjs';
import {
  SCHEMAS, schemaDocument, teaserPage, editorRoutes,
} from './structured.mjs';

const SITE = 'moved-permanently/bmw';

/** DA path -> body (string or sheet object). */
export function contentFiles({ wdh }) {
  const files = { ...buildLibrary({ wdh }).files, ...skillFiles(), ...flatSkillFiles() };
  files['/aida/structured/teasers.html'] = teaserPage();
  Object.entries(SCHEMAS).forEach(([id, schema]) => { files[`/.da/forms/schemas/${id}.html`] = schemaDocument(schema); });
  return files;
}

/** Site config (moved-permanently/bmw) append-only steps. */
export function siteConfigSteps() {
  return [
    {
      sheet: 'library',
      key: 'title',
      rows: [
        { title: 'Blocks', path: 'https://content.da.live/moved-permanently/bmw/library/blocks.json' },
        { title: 'Templates', path: 'https://content.da.live/moved-permanently/bmw/library/templates.json' },
        { title: 'Media Library', path: 'https://main--aem-apps--adobe-rnd.aem.live/tools/plugins/media-library/media-library.html', experience: 'fullsize-dialog' },
      ],
    },
    { sheet: 'prepare', key: 'title', rows: [{ title: 'Schedule Publish', path: '' }] },
    {
      sheet: 'apps',
      key: 'title',
      rows: [
        { title: 'Media Library', description: 'Native media library: BMW media inventory and reuse across pages (index in .da/media-insights)', path: `https://da.live/apps/media-library#/${SITE}` },
        { title: 'Launch review (Snapshots)', description: 'Native snapshots for launch reviews with review links and comments. Approve & publish publishes immediately', path: `https://da.live/apps/snapshots#/${SITE}` },
        { title: 'Structured content schemas', description: 'Native Schema Editor: BMW news and market-offer schemas', path: `https://da.live/apps/schema#/${SITE}` },
        { title: 'Skills Lab', description: 'Native Skills Editor: prepared BMW skills and prompts for the assistant', path: `https://da.live/apps/skills#/${SITE}` },
        { title: 'Scheduler', description: 'Native scheduler: scheduled publishes of this site (registered once by a site admin). Schedule from the editor via Prepare > Schedule Publish', path: 'https://da.live/apps/scheduler' },
      ],
    },
    { sheet: 'prompts', key: 'title', rows: PROMPTS },
    { sheet: 'skills', key: 'key', rows: skillsSheetRows() },
    { sheet: 'flags', key: 'key', rows: [{ key: 'ew.canvasDefaultView', value: 'layout' }] },
  ];
}

/** Org config (moved-permanently) append-only steps: form routing for the demo folders only. */
export function orgConfigSteps() {
  return [{ sheet: 'data', key: 'value', rows: editorRoutes() }];
}
