/* eslint-disable max-len */
/*
 * Experience Workspace quick edit (adobe/da-nx quick-edit.js setBody) replaces document.body and
 * calls the site's loadPage(document) again. WDH bindings collected per page render must not
 * accumulate across renders (observed: "40 of 40 values need an update" on /aida/fr/be/i5, whose
 * source has 20 bindings) and a superseded render must not add a second WDH check panel.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createWdhSession } from '../../scripts/aida-wdh.js';

const read = (p) => readFileSync(new URL(`../../${p}`, import.meta.url), 'utf8');
const binding = (i) => ({ href: `/aida/data/wdh-de.json#61HG.v${i % 7}`, text: `value ${i}` });

test('a new page render starts a fresh binding collection (quick edit re-runs loadPage)', () => {
  const session = createWdhSession();
  session.start();
  for (let i = 0; i < 20; i += 1) session.add(binding(i));
  session.start(); // quick edit: setBody -> loadPage(document)
  for (let i = 0; i < 20; i += 1) session.add(binding(i));
  assert.equal(session.bindings.length, 20);
});

test('repeated values within one render are kept (they are separate occurrences on the page)', () => {
  const session = createWdhSession();
  session.start();
  session.add(binding(1));
  session.add(binding(1));
  assert.equal(session.bindings.length, 2);
});

test('a check started for an earlier render is superseded by a newer render', () => {
  const session = createWdhSession();
  const first = session.start();
  assert.equal(session.isCurrent(first), true);
  const second = session.start();
  assert.equal(session.isCurrent(first), false);
  assert.equal(session.isCurrent(second), true);
  assert.equal(session.generation, second);
});

test('runtime wiring: every loadPage starts a session before decorating, the check panel is single-instance', () => {
  const scripts = read('scripts/scripts.js');
  const eager = scripts.slice(scripts.indexOf('async function loadEager'), scripts.indexOf('async function loadLazy'));
  assert.ok(eager.indexOf('wdhSession.start()') > -1 && eager.indexOf('wdhSession.start()') < eager.indexOf('decorateMain(main)'), 'loadEager starts a new WDH session before decorateMain');
  assert.doesNotMatch(scripts, /const wdhBindings = \[\]/, 'no module-level array that grows across renders');
  assert.match(scripts, /wdhSession\.add\(/);
  assert.match(scripts, /checkWdhValues\(wdhSession\)/);
  const aida = read('scripts/aida.js');
  assert.match(aida, /isCurrent\(generation\)/, 'a superseded render does not render its panel');
  assert.match(aida, /querySelectorAll\('aside\.wdh-check'\)\.forEach\(\(p\) => p\.remove\(\)\)/, 'an existing panel is replaced, not duplicated');
});
