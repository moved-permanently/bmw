import { test } from 'node:test';
import assert from 'node:assert/strict';
import { topology, cellStatus, buildGrid } from '../../tools/aida/radar/grid.js';

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
