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
import { showWdhCheck } from '../../scripts/wdh-session.js';

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

test('a render keeps its undecorated source and model, then resets both on the next page', () => {
  const session = createWdhSession();
  session.start('<p>627 km</p>', '61HG');
  assert.equal(session.html, '<p>627 km</p>');
  assert.equal(session.model, '61HG');
  session.start();
  assert.equal(session.html, '');
  assert.equal(session.model, '');
});

test('runtime wiring: every loadPage starts a session before decorating, the check panel is single-instance', () => {
  const scripts = read('scripts/scripts.js');
  const eager = scripts.slice(scripts.indexOf('async function loadEager'), scripts.indexOf('async function loadLazy'));
  assert.ok(eager.indexOf('wdhSession.start(') > -1 && eager.indexOf('wdhSession.start(') < eager.indexOf('decorateMain(main)'), 'loadEager starts a new WDH session before decorateMain');
  assert.match(eager, /wdhSession\.start\(main\?\.innerHTML/, 'capture the authored source before blocks rewrite it');
  assert.doesNotMatch(scripts, /const wdhBindings = \[\]/, 'no module-level array that grows across renders');
  assert.match(scripts, /wdhSession\.add\(/);
  assert.match(scripts, /checkWdhValues\(wdhSession, wdhEditor\)/);
  assert.match(scripts, /showWdhCheck\(window\.location\)/, 'the panel shows where showWdhCheck allows it');
  assert.doesNotMatch(scripts, /if \(wdhSession\.bindings\.length && showWdhCheck/, 'EW pages with only unlinked values also run the check');
  assert.ok(scripts.indexOf('captureEditorPort()') > -1 && scripts.indexOf('captureEditorPort()') < scripts.lastIndexOf('loadPage();'), 'the editor port is captured before quick edit loads (appended after loadPage())');
  const aida = read('scripts/aida.js');
  assert.match(aida, /isCurrent\(generation\)/, 'a superseded render does not render its panel');
  assert.match(aida, /<p class="wdh-check-title">[^\n]*WDH check<\/p>/, 'the panel title is "WDH check", optionally with a status icon');
  assert.match(aida, /panel\.addEventListener\('mousedown', \(e\) => \{\s*e\.preventDefault\(\);\s*e\.stopPropagation\(\);/, 'clicks on the panel neither focus the editor frame (canvas selection toolbar) nor reach quick edit');
  assert.match(aida, /querySelectorAll\('aside\.wdh-check'\)\.forEach\(\(p\) => p\.remove\(\)\)/, 'an existing panel is replaced, not duplicated');
});

test('the WDH panel shows on preview hosts, not on showcase pages or block library documents', () => {
  const at = (hostname, pathname) => showWdhCheck({ hostname, pathname });
  assert.equal(at('main--bmw--moved-permanently.preview.da.live', '/aida/fr/be/i5'), true);
  assert.equal(at('main--bmw--moved-permanently.aem.page', '/aida/fr/be/i5'), true);
  assert.equal(at('localhost', '/aida/fr/be/i5'), true);
  assert.equal(at('main--bmw--moved-permanently.aem.live', '/aida/fr/be/i5'), false);
  assert.equal(at('main--bmw--moved-permanently.preview.da.live', '/library/blocks/model-offer'), false);
  assert.equal(at('main--bmw--moved-permanently.preview.da.live', '/library/templates/model-page'), false);
  assert.equal(at('main--bmw--moved-permanently.preview.da.live', '/aida/showcase/fr/be/i5'), false);
  assert.equal(at('main--bmw--moved-permanently.preview.da.live', '/drafts/aida/showcase/fr/be/i5'), false);
});

const LAYOUT_SEARCH = '?rum=off&consent=disabled&quick-edit=on&controller=parent';

test('showcase pages show the WDH panel in the EW Layout frame', () => {
  const hosts = ['main--bmw--moved-permanently.preview.da.live', 'main--bmw--moved-permanently.aem.page', 'localhost'];
  const paths = ['/aida/showcase/de/de/i5', '/aida/showcase/fr/be/i5', '/drafts/aida/showcase/fr/be/i5'];
  hosts.forEach((hostname) => paths.forEach((pathname) => {
    assert.equal(showWdhCheck({ hostname, pathname, search: LAYOUT_SEARCH }), true, `${hostname}${pathname}`);
  }));
});

test('showcase previews outside EW keep the WDH panel hidden', () => {
  const hostname = 'main--bmw--moved-permanently.preview.da.live';
  ['', '?quick-edit=on', '?controller=bootstrap'].forEach((search) => {
    assert.equal(showWdhCheck({ hostname, pathname: '/aida/showcase/de/de/i5', search }), false);
  });
});

test('the EW query does not enable the WDH panel in library documents or on live hosts', () => {
  const hostname = 'main--bmw--moved-permanently.preview.da.live';
  ['/library/blocks/model-offer', '/library/templates/model-page'].forEach((pathname) => {
    assert.equal(showWdhCheck({ hostname, pathname, search: LAYOUT_SEARCH }), false);
  });
  assert.equal(showWdhCheck({
    hostname: 'main--bmw--moved-permanently.aem.live',
    pathname: '/aida/showcase/de/de/i5',
    search: LAYOUT_SEARCH,
  }), false);
});
