import { test } from 'node:test';
import assert from 'node:assert/strict';
import { topology, cellStatus, buildGrid } from '../../tools/aida/radar/grid.js';
import * as radar from '../../tools/aida/radar/grid.js';
import { DA_EDITOR } from '../../tools/aida/editor.js';

const config = {
  config: { data: [{ key: 'source.language', value: 'English' }] },
  languages: {
    data: [
      { name: 'English', code: 'en', location: '/aida/en' },
      {
        name: 'German', code: 'de', location: '/aida/de', locales: '/aida/de/de',
      },
      {
        name: 'French', code: 'fr', location: '/aida/fr', locales: '/aida/fr/fr, /aida/fr/be',
      },
    ],
  },
};

test('topology reads source, languages and locales from the translation config', () => {
  assert.deepEqual(topology(config), {
    source: { name: 'English', location: '/aida/en' },
    targets: [
      { name: 'German', location: '/aida/de', kind: 'language' },
      { name: 'de', location: '/aida/de/de', kind: 'locale' },
      { name: 'French', location: '/aida/fr', kind: 'language' },
      { name: 'fr', location: '/aida/fr/fr', kind: 'locale' },
      { name: 'be', location: '/aida/fr/be', kind: 'locale' },
    ],
  });
});

test('cellStatus compares edit times with the source', () => {
  assert.equal(cellStatus(100, undefined), 'missing');
  assert.equal(cellStatus(200, 100), 'behind');
  assert.equal(cellStatus(100, 200), 'current');
});

test('buildGrid lays out source pages against every target', () => {
  const { targets } = topology(config);
  const modified = new Map([
    ['/aida/de/i5', 300], ['/aida/de/de/i5', 400], ['/aida/fr/i5', 100],
  ]);
  const grid = buildGrid([{ rel: '/i5', lastModified: 200 }], targets, modified);
  assert.deepEqual(grid, [{
    rel: '/i5',
    cells: [
      { target: 'German', path: '/aida/de/i5', status: 'current' },
      { target: 'de', path: '/aida/de/de/i5', status: 'current' },
      { target: 'French', path: '/aida/fr/i5', status: 'behind' },
      { target: 'fr', path: '/aida/fr/fr/i5', status: 'missing' },
      { target: 'be', path: '/aida/fr/be/i5', status: 'missing' },
    ],
  }]);
});

test('timestamp labels never claim approval or publishing evidence', () => {
  assert.deepEqual(radar.TIMESTAMP_LABELS, {
    missing: 'not started', behind: 'source newer', current: 'edited since source', unknown: 'timestamp unavailable',
  });
});

test('source and target pages link to the editor, review inbox, Files and Snapshots on the demo branch', () => {
  assert.equal(typeof radar.pageActions, 'function');
  const actions = radar.pageActions({
    org: 'moved-permanently', site: 'bmw', path: '/aida/fr/be/i5', ref: 'demo',
  });
  assert.deepEqual(actions, {
    edit: `${DA_EDITOR}/canvas#/moved-permanently/bmw/aida/fr/be/i5`,
    preview: 'https://demo--bmw--moved-permanently.aem.page/aida/fr/be/i5',
    preflight: '/tools/aida/preflight/preflight.html?path=%2Faida%2Ffr%2Fbe%2Fi5&org=moved-permanently&site=bmw&ref=demo',
    review: `${DA_EDITOR}/app/adobe-rnd/aem-apps/tools/apps/publish-requests-inbox/publish-requests-inbox?org=moved-permanently&site=bmw&path=%2Faida%2Ffr%2Fbe%2Fi5&env=ci&ref=ewdemo&nx=ewdemo`,
    files: `${DA_EDITOR}/#/moved-permanently/bmw/aida/fr/be`,
    snapshots: `${DA_EDITOR}/apps/snapshots#/moved-permanently/bmw`,
    translate: `${DA_EDITOR}/apps/loc#/moved-permanently/bmw`,
  });
});

const SETTINGS = [
  { key: 'workflow.step.1.title', value: 'Market review' },
  { key: 'workflow.step.2.title', value: 'Legal review' },
];

test('a pending publish request shows the step it waits on', () => {
  const rows = [
    {
      path: '/aida/fr/be/i5', status: 'pending', requester: 'author@example.com', step: '',
    },
    {
      path: '/aida/de/de/i5', status: 'pending', requester: 'other@example.com', step: 'reviewer@example.com:1:2026-10-12T11:00:00Z',
    },
    { path: '/aida/fr/fr/i5', status: 'approved', requester: 'author@example.com' },
  ];
  assert.deepEqual(radar.reviewState(rows, SETTINGS, '/aida/fr/be/i5'), { step: 1, title: 'Market review', requester: 'author@example.com' });
  assert.deepEqual(radar.reviewState(rows, SETTINGS, '/aida/de/de/i5'), { step: 2, title: 'Legal review', requester: 'other@example.com' });
  assert.equal(radar.reviewState(rows, SETTINGS, '/aida/fr/fr/i5'), null);
  assert.equal(radar.reviewState(rows, SETTINGS, '/aida/en/i5'), null);
  assert.equal(radar.reviewState(rows, [], '/aida/fr/be/i5').title, 'Step 1');
});

test('comment counts are per thread: open and resolved roots, replies ignored', () => {
  const comments = [
    { id: 'a', threadId: null, resolved: false },
    { id: 'b', threadId: 'a' },
    { id: 'c', threadId: null, resolved: true },
    { id: 'd', threadId: null, resolved: false },
  ];
  assert.deepEqual(radar.commentCounts(comments), { open: 2, resolved: 1 });
  assert.deepEqual(radar.commentCounts([]), { open: 0, resolved: 0 });
});

test('action routes encode authored names and reject unsafe site/path input', () => {
  assert.equal(typeof radar.pageActions, 'function');
  const routes = radar.pageActions({ org: 'demo', site: 'demo', path: '/aida/car & range' });
  assert.equal(routes.preview, 'https://main--demo--demo.aem.page/aida/car%20%26%20range');
  assert.equal(routes.edit, `${DA_EDITOR}/canvas#/demo/demo/aida/car%20%26%20range`);
  assert.throws(() => radar.pageActions({ org: 'bad.example/', site: 'demo', path: '/aida/i5' }), /site/i);
  ['/../outside', '//evil.example/x', '/aida/<img>', '/aida/x?y=1', '/aida/x#y'].forEach((path) => {
    assert.throws(() => radar.pageActions({ org: 'demo', site: 'demo', path }), /path/i);
  });
});

test('unknown timestamps do not count as edited since source; ISO dates compare chronologically', () => {
  assert.equal(cellStatus(undefined, 100), 'unknown');
  assert.equal(cellStatus(100, null), 'unknown');
  assert.equal(cellStatus('bad', 100), 'unknown');
  assert.equal(cellStatus('2026-09-30T12:00:00Z', '2026-09-30T13:00:00+02:00'), 'behind');
  assert.equal(cellStatus(100, 100), 'current');
});

test('empty translation setup reports a clear configuration problem', () => {
  assert.throws(() => topology({}), /translation config/i);
});

test('rebase moves the translation layout to another root, e.g. the showcase tree', () => {
  const showcase = radar.rebase(config, '/aida/showcase');
  assert.deepEqual(topology(showcase), {
    source: { name: 'English', location: '/aida/showcase/en' },
    targets: [
      { name: 'German', location: '/aida/showcase/de', kind: 'language' },
      { name: 'de', location: '/aida/showcase/de/de', kind: 'locale' },
      { name: 'French', location: '/aida/showcase/fr', kind: 'language' },
      { name: 'fr', location: '/aida/showcase/fr/fr', kind: 'locale' },
      { name: 'be', location: '/aida/showcase/fr/be', kind: 'locale' },
    ],
  });
  assert.equal(config.languages.data[0].location, '/aida/en', 'the original config is unchanged');
});

test('rebase keeps the config without a root and rejects unsafe roots', () => {
  assert.deepEqual(radar.rebase(config, ''), config);
  assert.deepEqual(radar.rebase(config, null), config);
  ['aida/showcase', '/aida/../x', '/aida//x', '/aida/x?y', '/aida/<x>', '/aida/x/'].forEach((root) => {
    assert.throws(() => radar.rebase(config, root), /Invalid radar root/, root);
  });
});
