/* eslint-disable max-len */
/*
 * Compact language -> market dependency view of the rollout radar: derived from the translation
 * config only (structure), never from timestamps, WDH drift or approval status.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dependencies } from '../../tools/aida/radar/grid.js';

const config = {
  config: { data: [{ key: 'source.language', value: 'English' }] },
  languages: {
    data: [
      { name: 'English', code: 'en', location: '/aida/en' },
      { name: 'German', code: 'de', location: '/aida/de', locales: '/aida/de/de, /aida/de/at' },
      { name: 'French', code: 'fr', location: '/aida/fr', locales: '/aida/fr/fr, /aida/fr/be' },
    ],
  },
};

test('dependencies: source language -> languages -> their markets (EN -> DE/FR -> DE, AT / FR, BE)', () => {
  assert.deepEqual(dependencies(config), {
    source: { name: 'English', location: '/aida/en' },
    languages: [
      { name: 'German', location: '/aida/de', markets: [{ name: 'de', location: '/aida/de/de' }, { name: 'at', location: '/aida/de/at' }] },
      { name: 'French', location: '/aida/fr', markets: [{ name: 'fr', location: '/aida/fr/fr' }, { name: 'be', location: '/aida/fr/be' }] },
    ],
  });
});

test('the radar shows the dependency view separately from drift and approval status', () => {
  const src = readFileSync(new URL('../../tools/aida/radar/radar.js', import.meta.url), 'utf8');
  assert.match(src, /dependencies\(config\)/);
  assert.match(src, /radar-dependencies/);
  const view = src.slice(src.indexOf('function renderDependencies'), src.indexOf('(async function init'));
  assert.ok(view.length > 0, 'renderDependencies exists');
  assert.doesNotMatch(view, /status|drift|approv|TIMESTAMP_LABELS/i, 'structure only');
});
