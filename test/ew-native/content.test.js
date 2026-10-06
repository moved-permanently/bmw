/* eslint-disable max-len, import/extensions */
/*
 * One checked-in source for everything this task writes to DA (tools/ew-native/content.mjs): the
 * content files and the append-only config steps (site + org), consistent with the deployed
 * consumers (Skills Editor: flat .md + skills sheet; assistant: skills sheet keys; prepare action by
 * title). Records are serialized with the official da-sc SDK (migration-work script).
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { contentFiles, siteConfigSteps, orgConfigSteps } from '../../tools/ew-native/content.mjs';
import {
  flatSkillFiles, skillFiles, skillsSheetRows, PROMPTS,
} from '../../tools/ew-native/skills.mjs';
import {
  editorRoutes, teaserPage, SCHEMAS, schemaDocument,
} from '../../tools/ew-native/structured.mjs';

const WDH = {
  values: {
    data: ['electricRange', 'electricConsumption', 'acceleration', 'wltp'].map((f) => ({ key: `61HG.${f}`, value: f, unit: '' })),
  },
};

test('content files: library, both skill layouts, teaser page and schema documents', () => {
  const files = contentFiles({ wdh: WDH });
  ['/library/blocks.json', '/library/templates.json', '/library/blocks/stage.html', '/library/templates/news-story.html', '/aida/structured/teasers.html', '/.da/forms/schemas/news.html', '/.da/forms/schemas/market-offer.html']
    .forEach((p) => assert.ok(files[p], p));
  Object.entries({ ...flatSkillFiles(), ...skillFiles() }).forEach(([p, md]) => assert.equal(files[p], md, p));
  assert.equal(files['/aida/structured/teasers.html'], teaserPage());
  assert.equal(files['/.da/forms/schemas/news.html'], schemaDocument(SCHEMAS.news));
});

test('site config steps: library, prepare Schedule Publish, apps, prompts, inline skills sheet, canvas flag', () => {
  const steps = Object.fromEntries(siteConfigSteps().map((s) => [s.sheet, s]));
  assert.deepEqual(steps.library.rows.map((r) => r.title), ['Blocks', 'Templates', 'Media Library']);
  assert.deepEqual(steps.prepare.rows, [{ title: 'Schedule Publish', path: '' }]);
  assert.deepEqual(steps.apps.rows.map((r) => r.title), ['Media Library', 'Launch review (Snapshots)', 'Structured content schemas', 'Skills Lab', 'Scheduler']);
  assert.ok(!steps.apps.rows.some((r) => /optel|rum|domainkey|publish requests/i.test(`${r.title} ${r.path}`)), 'no dead tiles, no keys in config');
  assert.deepEqual(steps.prompts.rows, PROMPTS);
  assert.deepEqual(steps.skills.rows, skillsSheetRows());
  assert.ok(steps.skills.rows.every((r) => r.status === 'approved' && r.content.startsWith('---\nname: ')));
  assert.deepEqual(steps.flags.rows, [{ key: 'ew.canvasDefaultView', value: 'layout' }]);
});

test('org config steps: editor.path only for the task-owned structured content folders', () => {
  assert.deepEqual(orgConfigSteps(), [{ sheet: 'data', key: 'value', rows: editorRoutes() }]);
});
