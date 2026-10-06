/* eslint-disable max-len, import/extensions */
/*
 * Prepared BMW skills for the Experience Workspace Skills Editor (tools/ew-native/skills.mjs):
 * stored as .da/skills/<id>/skill.md with the Skills Editor frontmatter rules
 * (adobe-rnd/ew-extensions blocks/skills/utils/skill-frontmatter.js) and prompts for the
 * config `prompts` sheet. Skills use public/synthetic inputs only and never preview or publish.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SKILLS, PROMPTS, skillFiles } from '../../tools/ew-native/skills.mjs';

const frontmatter = (md) => {
  const m = md.match(/^---\n([\s\S]*?)\n---\n/);
  assert.ok(m, 'frontmatter block');
  return Object.fromEntries(m[1].split('\n').map((l) => l.split(/:\s(.+)/).slice(0, 2)).map(([k, v]) => [k.trim().toLowerCase(), v.trim()]));
};

test('three purposeful skills: campaign media, drafting from approved facts, brand/market readiness', () => {
  assert.deepEqual(SKILLS.map((s) => s.id), ['bmw-find-campaign-media', 'bmw-draft-from-approved-facts', 'bmw-brand-market-readiness']);
});

test('skill files follow the Skills Editor storage and frontmatter rules', () => {
  const files = skillFiles();
  assert.deepEqual(Object.keys(files), SKILLS.map((s) => `/.da/skills/${s.id}/skill.md`));
  Object.entries(files).forEach(([path, md]) => {
    const fm = frontmatter(md);
    const id = path.split('/')[3];
    assert.equal(fm.name, id, 'name equals the folder');
    assert.match(fm.name, /^[a-z0-9-]{1,64}$/);
    assert.doesNotMatch(fm.name, /\b(anthropic|claude)\b/i);
    assert.ok(fm.description && fm.description.length <= 1024 && !/[<>]/.test(fm.description), 'single-line description without XML');
    assert.match(fm.version, /^[1-9]\d*$/);
    assert.equal(fm.status, 'approved');
    assert.ok(md.split('---\n')[2].trim().length > 200, 'a real skill body');
  });
});

test('skills stay on public / synthetic inputs and never preview, publish or invent tech values', () => {
  Object.values(skillFiles()).forEach((md) => {
    assert.match(md, /never (preview|publish)/i);
    assert.doesNotMatch(md, /content_publish|content_preview|da_bulk_publish|da_bulk_preview/);
    assert.match(md, /WDH/);
  });
  const draft = skillFiles()['/.da/skills/bmw-draft-from-approved-facts/skill.md'];
  assert.match(draft, /\/aida\/data\/wdh-<market>\.json/);
  assert.match(draft, /\/aida\/data\/brand-terms\.json/);
  const media = skillFiles()['/.da/skills/bmw-find-campaign-media/skill.md'];
  assert.match(media, /bmw\.scene7\.com/);
  assert.match(media, /catalogue\.json/);
});

test('prompts for the config prompts sheet (title, prompt) point to the skills', () => {
  assert.equal(PROMPTS.length, 3);
  PROMPTS.forEach((p, i) => {
    assert.deepEqual(Object.keys(p), ['title', 'prompt']);
    assert.ok(p.prompt.includes(SKILLS[i].id), p.title);
  });
});
