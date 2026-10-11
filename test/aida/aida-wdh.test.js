import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  parseBinding, bindingHref, marketForPath, valuesFromSheet, findBindings, syncBindings, autoBind,
  textOf, staleBindings, wdhUpdateAction, wdhUpdateTarget,
} from '../../scripts/aida-wdh.js';

const WLTP = 'BMW i5 eDrive40 Limousine: Energieverbrauch kombiniert: 17,9 kWh/100 km (WLTP); CO₂-Emissionen kombiniert: 0 g/km (WLTP); CO₂-Klasse(n): A; Elektrische Reichweite: 513–627 km (WLTP)';

const deSheet = {
  values: [
    {
      key: '61HG.electricRange', value: '513–627', unit: 'km', label: 'Elektrische Reichweite (WLTP)',
    },
    {
      key: '61HG.acceleration', value: '6', unit: 's', label: 'Beschleunigung 0–100 km/h',
    },
    {
      key: '61HG.power', value: '250 kW (340 PS)', unit: '', label: 'Max. Leistung',
    },
    {
      key: '61HG.wltp', value: WLTP, unit: '', label: 'WLTP-Pflichtangabe',
    },
  ],
};
const frSheet = {
  values: [
    {
      key: '61HG.electricRange', value: '518–627', unit: 'km', label: 'Autonomie électrique (WLTP)',
    },
    {
      key: '61HG.power', value: '250 kW (340 ch)', unit: '', label: 'Puissance max.',
    },
  ],
};

test('parseBinding reads market and key from relative and absolute links', () => {
  assert.deepEqual(parseBinding('/aida/data/wdh-fr.json#61HG.electricRange'), {
    market: 'fr', key: '61HG.electricRange', code: '61HG', field: 'electricRange',
  });
  assert.equal(
    parseBinding('https://main--bmw--moved-permanently.aem.page/aida/data/wdh-de.json#61HG.power').market,
    'de',
  );
  assert.equal(parseBinding('/de/neufahrzeuge/bmw-i/i5'), null);
  assert.equal(parseBinding('/aida/data/wdh-de.json'), null);
  assert.equal(parseBinding(''), null);
});

test('bindingHref is the inverse of parseBinding', () => {
  assert.equal(bindingHref('fr', '61HG.electricRange'), '/aida/data/wdh-fr.json#61HG.electricRange');
});

test('marketForPath resolves language pages, locales and fallbacks', () => {
  assert.deepEqual(marketForPath('/aida/en/i5'), {
    lang: 'en', locale: null, market: 'de', fallback: false,
  });
  assert.deepEqual(marketForPath('/aida/fr/fr/i5'), {
    lang: 'fr', locale: 'fr', market: 'fr', fallback: false,
  });
  assert.deepEqual(marketForPath('/aida/fr/be/i5'), {
    lang: 'fr', locale: 'be', market: 'fr', fallback: true,
  });
  assert.deepEqual(marketForPath('/aida/de/de/news/launch'), {
    lang: 'de', locale: 'de', market: 'de', fallback: false,
  });
  assert.equal(marketForPath('/aida/en/ix/overview').locale, null);
  assert.equal(marketForPath('/de/elektroauto').market, 'de');
  assert.equal(marketForPath('/tools/aida/radar'), null);
});

test('valuesFromSheet accepts fetchSheet output and raw DA multi-sheets', () => {
  const values = valuesFromSheet(deSheet);
  assert.equal(values.get('61HG.electricRange').display, '513–627 km');
  assert.equal(values.get('61HG.power').display, '250 kW (340 PS)');
  const raw = { ':names': ['values'], values: { data: deSheet.values } };
  assert.equal(valuesFromSheet(raw).get('61HG.acceleration').display, '6 s');
});

test('textOf strips tags and decodes entities', () => {
  assert.equal(textOf('<strong>513&#x26;627</strong>&nbsp;km'), '513&627 km');
  assert.equal(textOf('  a <em>b</em>\n c '), 'a b c');
});

test('findBindings lists bound values in a document', () => {
  const html = '<p>Range <a href="/aida/data/wdh-de.json#61HG.electricRange">513–627 km</a> and <a href="/de/x">link</a></p>';
  assert.deepEqual(findBindings(html), [{
    href: '/aida/data/wdh-de.json#61HG.electricRange',
    market: 'de',
    key: '61HG.electricRange',
    code: '61HG',
    field: 'electricRange',
    text: '513–627 km',
  }]);
});

test('syncBindings rewrites stale values and foreign-market links', () => {
  const html = '<div><a href="/aida/data/wdh-de.json#61HG.electricRange">513–627 km</a></div>'
    + '<div><a href="/aida/data/wdh-de.json#61HG.power">250 kW (340 PS)</a></div>'
    + '<div><a href="/aida/data/wdh-de.json#99XX.power">1 kW</a></div>';
  const result = syncBindings(html, 'fr', valuesFromSheet(frSheet));
  assert.equal(
    result.html,
    '<div><a href="/aida/data/wdh-fr.json#61HG.electricRange">518–627 km</a></div>'
    + '<div><a href="/aida/data/wdh-fr.json#61HG.power">250 kW (340 ch)</a></div>'
    + '<div><a href="/aida/data/wdh-de.json#99XX.power">1 kW</a></div>',
  );
  assert.deepEqual(result.changes, [
    {
      key: '61HG.electricRange', from: '513–627 km', to: '518–627 km', fromMarket: 'de',
    },
    {
      key: '61HG.power', from: '250 kW (340 PS)', to: '250 kW (340 ch)', fromMarket: 'de',
    },
  ]);
  assert.deepEqual(result.unknown, ['99XX.power']);
});

test('syncBindings leaves current values untouched', () => {
  const html = '<p><a href="/aida/data/wdh-de.json#61HG.electricRange">513–627 km</a></p>';
  const result = syncBindings(html, 'de', valuesFromSheet(deSheet));
  assert.equal(result.html, html);
  assert.deepEqual(result.changes, []);
});

test('autoBind turns hard-coded values of one model into bindings', () => {
  const html = '<div><div>Max. Leistung</div><div>250 kW (340 PS)</div></div>'
    + '<div><div>0-100 km/h</div><div>6 s</div></div>'
    + '<div><div>Reichweite</div><div>513–627 km</div></div>'
    + `<div><div>${WLTP}</div></div>`
    + '<p>Strecken von 513–627 km zurück. In 6 s auf 100.</p>'
    + '<p><a href="/x">513–627 km</a></p>';
  const { html: out, bound } = autoBind(html, 'de', valuesFromSheet(deSheet), '61HG');
  const a = (key, text) => `<a href="/aida/data/wdh-de.json#${key}">${text}</a>`;
  assert.equal(
    out,
    `<div><div>Max. Leistung</div><div>${a('61HG.power', '250 kW (340 PS)')}</div></div>`
    + `<div><div>0-100 km/h</div><div>${a('61HG.acceleration', '6 s')}</div></div>`
    + `<div><div>Reichweite</div><div>${a('61HG.electricRange', '513–627 km')}</div></div>`
    + `<div><div>${a('61HG.wltp', WLTP)}</div></div>`
    + `<p>Strecken von ${a('61HG.electricRange', '513–627 km')} zurück. In 6 s auf 100.</p>`
    + '<p><a href="/x">513–627 km</a></p>',
  );
  assert.equal(bound.length, 5);
});

test('a value with a non-breaking space is not reported or rewritten as changed', () => {
  const values = valuesFromSheet({ values: [{ key: '31HR.fromPrice', value: '70.900\u00a0€', unit: '' }] });
  const html = '<p><a href="/aida/data/wdh-de.json#31HR.fromPrice">70.900\u00a0€</a></p>';
  assert.deepEqual(staleBindings(findBindings(html), 'de', values), []);
  assert.deepEqual(syncBindings(html, 'de', values), { html, changes: [], unknown: [] });
});

test('autoBind leaves metadata and section metadata untouched', () => {
  const meta = '<div class="section-metadata"><div><div>style</div><div>250 kW (340 PS)</div></div></div>'
    + '<div class="metadata"><div><div>json-ld</div><div>{"range":"513–627 km"}</div></div></div>';
  const html = `<div><p>Reichweite 513–627 km</p>${meta}</div><div><p>250 kW (340 PS)</p></div>`;
  const { html: out, bound } = autoBind(html, 'de', valuesFromSheet(deSheet), '61HG');
  assert.equal(
    out,
    `<div><p>Reichweite <a href="/aida/data/wdh-de.json#61HG.electricRange">513–627 km</a></p>${meta}</div>`
    + '<div><p><a href="/aida/data/wdh-de.json#61HG.power">250 kW (340 PS)</a></p></div>',
  );
  assert.deepEqual(bound.map((b) => b.key), ['61HG.electricRange', '61HG.power']);
});

test('staleBindings reports outdated values, foreign markets and unknown keys', () => {
  const bindings = [
    {
      href: '/aida/data/wdh-fr.json#61HG.electricRange', key: '61HG.electricRange', market: 'fr', text: '513–627 km',
    },
    {
      href: '/aida/data/wdh-de.json#61HG.power', key: '61HG.power', market: 'de', text: '250 kW (340 ch)',
    },
    {
      href: '/aida/data/wdh-fr.json#61HG.power', key: '61HG.power', market: 'fr', text: '250 kW (340 ch)',
    },
    {
      href: '/aida/data/wdh-fr.json#99XX.power', key: '99XX.power', market: 'fr', text: '1 kW',
    },
  ];
  assert.deepEqual(staleBindings(bindings, 'fr', valuesFromSheet(frSheet)), [
    {
      href: '/aida/data/wdh-fr.json#61HG.electricRange', key: '61HG.electricRange', text: '513–627 km', expected: '518–627 km', reason: 'value',
    },
    {
      href: '/aida/data/wdh-de.json#61HG.power', key: '61HG.power', text: '250 kW (340 ch)', expected: '250 kW (340 ch)', reason: 'market',
    },
    {
      href: '/aida/data/wdh-fr.json#99XX.power', key: '99XX.power', text: '1 kW', expected: null, reason: 'unknown',
    },
  ]);
});

const EDITOR = {
  hostname: 'main--bmw--moved-permanently.preview.da.live',
  pathname: '/aida/fr/be/i5',
  search: '?rum=off&consent=disabled&quick-edit=on&controller=parent',
};
const STALE = [
  { key: '61HG.power', expected: '250 kW (340 ch)' },
  { key: '61HG.name', expected: 'BMW i5 eDrive40 Berline' },
  { key: '99XX.power', expected: null },
];
const APP = 'https://da.live/app/moved-permanently/bmw/tools/aida/preflight/preflight';

test('the editor overlay offers to update the fixable values through the Preflight app', () => {
  assert.deepEqual(wdhUpdateAction(STALE, EDITOR), {
    count: 2,
    url: `${APP}?update=%2Faida%2Ffr%2Fbe%2Fi5`,
  });
  const branch = { ...EDITOR, hostname: 'wdhupd--bmw--moved-permanently.preview.da.live' };
  assert.equal(wdhUpdateAction(STALE, branch).url, `${APP}?update=%2Faida%2Ffr%2Fbe%2Fi5&ref=wdhupd`);
});

test('the overlay update is only offered while editing and when a value can be fixed', () => {
  assert.equal(wdhUpdateAction(STALE, { ...EDITOR, hostname: 'main--bmw--moved-permanently.aem.page', search: '' }), null);
  assert.equal(wdhUpdateAction(STALE, { ...EDITOR, hostname: 'localhost' }), null);
  assert.equal(wdhUpdateAction([STALE[2]], EDITOR), null);
  assert.equal(wdhUpdateAction([], EDITOR), null);
});

test('Preflight takes the page to update from the menu context or from the overlay link', () => {
  assert.equal(wdhUpdateTarget('', '/aida/fr/be/i5.html'), null);
  assert.deepEqual(wdhUpdateTarget('?update', '/aida/fr/be/i5.html'), { path: '/aida/fr/be/i5.html', fromLink: false });
  assert.deepEqual(
    wdhUpdateTarget('?update=%2Faida%2Ffr%2Fbe%2Fi5&ref=wdhupd', 'tools/aida/preflight/preflight'),
    { path: '/aida/fr/be/i5', fromLink: true },
  );
});

test('Preflight ignores an update link that does not name a page of this site', () => {
  assert.equal(wdhUpdateTarget('?update=%2F..%2Fother%2Fsite%2Fpage', 'x'), null);
  assert.equal(wdhUpdateTarget('?update=https%3A%2F%2Fevil.example%2Fpage', 'x'), null);
  assert.equal(wdhUpdateTarget('?update=aida%2Ffr%2Fbe%2Fi5', 'x'), null);
});
