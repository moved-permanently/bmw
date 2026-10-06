/* eslint-disable max-len, import/extensions */
/*
 * DA config changes for this task only ever append rows (tools/ew-native/config.mjs): existing
 * picker / app / prepare rows and other sheets stay byte-for-byte as they are; re-running is a
 * no-op; a conflicting row with the same key is reported instead of overwritten.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { appendRows, planConfig } from '../../tools/ew-native/config.mjs';

const SITE = {
  ':type': 'multi-sheet',
  ':names': ['data', 'library', 'prepare', 'apps'],
  ':version': 3,
  data: {
    total: 1, limit: 1, offset: 0, data: [{ key: 'aem.assets.image.type', value: 'link' }],
  },
  library: {
    total: 2,
    limit: 2,
    offset: 0,
    data: [
      {
        title: 'WDH values', path: 'https://main--bmw--moved-permanently.aem.page/tools/aida/wdh-picker/wdh-picker.html', format: '', ref: '', icon: '', experience: '',
      },
      {
        title: 'BMW assets', path: 'https://main--bmw--moved-permanently.aem.page/tools/aida/asset-picker/asset-picker.html', format: '', ref: '', icon: '', experience: '',
      },
    ],
  },
  prepare: {
    total: 1,
    limit: 1,
    offset: 0,
    data: [{
      title: 'Preflight', path: 'x', icon: '', ref: '', experience: '',
    }],
  },
  apps: {
    total: 1,
    limit: 1,
    offset: 0,
    data: [{
      title: 'Translate', description: 'd', path: 'p', image: '', ref: '',
    }],
  },
};

test('appending keeps existing rows first and unchanged, fills the sheet columns and updates counts', () => {
  const { config, added, conflicts } = appendRows(SITE, 'library', 'title', [
    { title: 'Blocks', path: 'https://content.da.live/moved-permanently/bmw/library/blocks.json' },
    { title: 'Media Library', path: 'https://main--aem-apps--adobe-rnd.aem.live/tools/plugins/media-library/media-library.html', experience: 'fullsize-dialog' },
  ]);
  assert.deepEqual(conflicts, []);
  assert.deepEqual(added, ['Blocks', 'Media Library']);
  assert.deepEqual(config.library.data.slice(0, 2), SITE.library.data);
  assert.deepEqual(config.library.data[3], {
    title: 'Media Library', path: 'https://main--aem-apps--adobe-rnd.aem.live/tools/plugins/media-library/media-library.html', format: '', ref: '', icon: '', experience: 'fullsize-dialog',
  });
  assert.equal(config.library.total, 4);
  assert.equal(config.library.limit, 4);
  ['data', 'prepare', 'apps', ':names', ':type', ':version'].forEach((k) => assert.deepEqual(config[k], SITE[k], k));
  assert.equal(SITE.library.data.length, 2, 'input not mutated');
});

test('re-running is a no-op; a different row under an existing key is a conflict, not an overwrite', () => {
  const once = appendRows(SITE, 'library', 'title', [{ title: 'Blocks', path: 'a' }]).config;
  const twice = appendRows(once, 'library', 'title', [{ title: 'Blocks', path: 'a' }]);
  assert.deepEqual(twice.added, []);
  assert.deepEqual(twice.config, once);
  const clash = appendRows(SITE, 'library', 'title', [{ title: 'BMW assets', path: 'other' }]);
  assert.deepEqual(clash.added, []);
  assert.deepEqual(clash.conflicts, ['BMW assets']);
  assert.deepEqual(clash.config, SITE);
});

test('a missing sheet is created and registered in :names (multi-sheet stays multi-sheet)', () => {
  const { config } = appendRows(SITE, 'prompts', 'title', [{ title: 'Find campaign media', prompt: 'p' }]);
  assert.deepEqual(config[':names'], [...SITE[':names'], 'prompts']);
  assert.deepEqual(config.prompts.data, [{ title: 'Find campaign media', prompt: 'p' }]);
});

test('planConfig applies several sheets and reports every addition and conflict', () => {
  const plan = planConfig(SITE, [
    { sheet: 'library', key: 'title', rows: [{ title: 'Templates', path: 't' }] },
    { sheet: 'apps', key: 'title', rows: [{ title: 'Translate', description: 'changed', path: 'p' }, { title: 'Launch review', description: 'Snapshots', path: 's' }] },
  ]);
  assert.deepEqual(plan.added, { library: ['Templates'], apps: ['Launch review'] });
  assert.deepEqual(plan.conflicts, { library: [], apps: ['Translate'] });
  assert.deepEqual(plan.config.apps.data[0], SITE.apps.data[0]);
});
