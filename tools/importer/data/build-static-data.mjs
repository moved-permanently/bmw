#!/usr/bin/env node
/*
 * Converts static www.bmw.de data (formerly served through the bmw-proxy worker) into Document
 * Authoring sheets under /de/data/ of the site (DA org moved-permanently, site bmw).
 *
 * Usage (from the repo root):
 *   node tools/importer/data/build-static-data.mjs      -> writes tools/importer/data/*.json
 *   tools/importer/data/upload.sh [name ...]             -> uploads to DA + previews
 *
 * Inputs (captures of the original endpoints in tools/importer/data/src/; refresh them with
 * `migration-work/withbrowser.sh node migration-work/bfetch.mjs <dir> <url>` if bmw.de changes):
 *   compare.html  www.bmw.de/de/bmw-modelle-vergleichen.html/content.q (cmp-compare component as
 *                 returned by the former bmw-proxy `?extract=compare`; the full page works too)
 *   flyout.json   www.bmw.de/de-de/login/bmw/api/flyout/data (My BMW flyout, logged-out state)
 *   otv.csv       www.bmw.de/content/dam/bmw/marketDE/bmw_de/datastore/17012022_BMW_OTV.csv
 *                 (dealer online service links, ISO-8859-1, ";" separated)
 *
 * Outputs (DA sheet JSON; multi-sheet = one tab per key):
 *   compare-models.json   multi-sheet  models | table | labels | placeholders
 *     models        one row per series/range/model/transmission (the selection tree)
 *     table         rows of the highlights / technical data tables (key = technical data key)
 *     labels        UI texts (key/value)
 *     placeholders  empty-column cosy image (one row per <source>, media empty = fallback <img>)
 *   mybmw-flyout.json     multi-sheet  labels | benefits | links
 *   dealer-services.json  sheet        Dealer, Outlet, URL, Name
 *
 * Needs jsdom (not a project dependency): resolved from JSDOM_FROM (a package.json path) or the
 * excat skill scripts folder.
 */
/* eslint-disable no-console */
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const SRC = join(HERE, 'src');
const JSDOM_FROM = process.env.JSDOM_FROM
  || '/home/node/.excat-marketplaces/excat-marketplace/excat/skills/excat-content-import/scripts/package.json';

const clean = (s) => (s || '').replace(/\s+/g, ' ').trim();
const bool = (b) => (b ? 'true' : 'false');

function sheet(rows) {
  return {
    total: rows.length, limit: rows.length, offset: 0, data: rows, ':type': 'sheet',
  };
}

function multiSheet(tabs) {
  const out = { ':names': Object.keys(tabs), ':version': 3, ':type': 'multi-sheet' };
  Object.entries(tabs).forEach(([name, rows]) => {
    out[name] = {
      total: rows.length, limit: rows.length, offset: 0, data: rows,
    };
  });
  return out;
}

function write(name, json) {
  writeFileSync(join(HERE, `${name}.json`), `${JSON.stringify(json, null, 1)}\n`);
  const tabs = json[':names'] || ['(sheet)'];
  const counts = tabs.map((t) => `${t}=${(json[t] || json).data.length}`).join(' ');
  console.log(`${name}.json  ${counts}`);
}

/* ------------------------------------------------------------------ compare */

function buildCompare() {
  const require = createRequire(JSDOM_FROM);
  // eslint-disable-next-line import/no-unresolved
  const { JSDOM } = require('jsdom');
  const { document } = new JSDOM(readFileSync(join(SRC, 'compare.html'), 'utf8')).window;
  const cmp = document.querySelector('.cmp-compare');
  if (!cmp) throw new Error('compare.html: .cmp-compare missing');
  const q = (sel) => clean((cmp.querySelector(sel) || {}).textContent);

  // model tree (data-config, base64 JSON)
  const tree = JSON.parse(Buffer.from(cmp.dataset.config, 'base64').toString('utf8'));
  const models = [];
  tree.forEach((s) => (s.modelRanges || []).forEach((r) => (r.vehicles || []).forEach((v) => {
    const trans = v.transmissions && v.transmissions.length ? v.transmissions : [{ code: '', description: '' }];
    trans.forEach((t) => models.push({
      series: s.code,
      seriesName: clean(s.description),
      range: r.code,
      rangeName: clean(r.description),
      model: v.code,
      modelName: clean(v.description),
      fuelType: v.fuelType || '',
      otherFuelType: bool(v.otherFuelType),
      transmission: t.code,
      transmissionName: clean(t.description),
    }));
  })));

  // labels
  const selection = cmp.querySelector('.cmp-compare__selection');
  const dd = (type) => clean((selection.querySelector(`.cmp-compare__dropdown--${type} .cmp-dropdown__label`) || {}).textContent);
  const ctas = [...cmp.querySelectorAll('.cmp-compare__column-description .cmp-compare__column-cta .cmp-button__text')]
    .map((b) => clean(b.textContent));
  const tabs = [...cmp.querySelectorAll('.cmp-compare__designcomparison .cmp-tabs__tab')].map((b) => clean(b.textContent));
  const priceBody = cmp.querySelector('.cmp-compare__column-price [data-cmp-hook-tooltip="template"] [data-cmp-hook-tooltip="content"]');
  const labels = {
    addVehicle: q('.cmp-compare__placeholder .cmp-title__text'),
    chooseVehicle: q('.cmp-compare__placeholder p'),
    series: dd('series'),
    range: dd('ranges'),
    model: dd('models'),
    transmission: 'Getriebe',
    emptySeries: selection.dataset.emptySeriesText,
    emptyRange: selection.dataset.emptyRangeText,
    emptyModel: selection.dataset.emptyModelText,
    from: 'Ab',
    priceInfo: q('.cmp-compare__column-price [data-cmp-hook-tooltip="heading"]'),
    priceInfoHtml: priceBody ? priceBody.innerHTML.trim() : '',
    cta1: ctas[0],
    cta2: ctas[1],
    remove: 'Löschen',
    confirmRemove: q('.cmp-compare__popover .cmp-popover__title'),
    yes: 'Ja',
    no: 'Nein',
    exterior: tabs[0],
    interior: tabs[1],
    designTitle: q('.cmp-compare__designcomparison .cmp-title__text'),
    galleryHint: q('#cmp-compare__galleryhint .cmp-notification__message'),
    onlyDifferences: q('.cmp-toggleswitch'),
    differencesShown: 'Nur Unterschiede werden angezeigt.',
    noDifferences: 'Die ausgewählten Modelle weisen in diesem Abschnitt keine Unterschiede auf.',
    disclaimer: q('.cmp-compare__disclaimer-item'),
    loadError: 'Der Modellvergleich ist momentan nicht verfügbar.',
  };
  const labelRows = Object.entries(labels).map(([key, value]) => ({ key, value: value || '' }));

  // table rows (labelRef/valueRef are always {dataGroup}_{key}_label|_value)
  const table = [];
  [['highlights', '.cmp-compare__highlights'], ['technicaldetails', '.cmp-compare__technicaldetails']].forEach(([id, sel]) => {
    const sec = cmp.querySelector(sel);
    if (!sec) return;
    const sectionTitle = clean((sec.querySelector('.cmp-title__text') || {}).textContent);
    sec.querySelectorAll('.cmp-accordion__item').forEach((item) => {
      const button = item.querySelector('.cmp-accordion__button');
      const titleEl = item.querySelector('.cmp-accordion__title, .cmp-accordion__button-content') || button;
      const groupRef = item.querySelector('.cmp-accordion__header [data-path]');
      const group = {
        section: id,
        sectionTitle,
        groupTitle: clean(titleEl ? titleEl.textContent : ''),
        groupFootnote: groupRef ? groupRef.dataset.path : '',
        expanded: bool(!button || button.classList.contains('cmp-accordion__button--expanded')),
      };
      item.querySelectorAll('tr.cmp-comparetable__row').forEach((tr) => {
        const { key } = tr.dataset;
        if (!key) return;
        const th = tr.querySelector('th');
        const sup = th && th.querySelector('[data-path]');
        const labelEl = th ? th.cloneNode(true) : null;
        if (labelEl) labelEl.querySelectorAll('sup').forEach((s) => s.remove());
        const valueSup = tr.querySelector('td [data-path]');
        const labelRef = sup ? sup.dataset.path : '';
        const valueRef = valueSup ? valueSup.dataset.path.replace(/_\d+$/, '') : '';
        const dataGroup = labelRef.endsWith(`_${key}_label`) ? labelRef.slice(0, -`_${key}_label`.length) : '';
        if (labelRef !== (dataGroup ? `${dataGroup}_${key}_label` : '')
          || valueRef !== (dataGroup ? `${dataGroup}_${key}_value` : '')) {
          throw new Error(`unexpected footnote refs for ${key}: ${labelRef} / ${valueRef}`);
        }
        table.push({
          ...group,
          key,
          label: clean(labelEl ? labelEl.textContent : key),
          dataGroup,
          energy: bool(!!tr.querySelector('[data-is-energy]')),
        });
      });
    });
  });

  // empty-column placeholder image (the source repeats the same picture in all 3 columns)
  const placeholders = [];
  cmp.querySelectorAll('.cmp-compare__header-area').forEach((area, i) => {
    const picture = area.querySelector('picture');
    if (!picture) return;
    picture.querySelectorAll('source').forEach((s) => placeholders.push({
      column: String(i + 1), media: s.getAttribute('media') || '', type: s.getAttribute('type') || '', url: s.getAttribute('srcset'),
    }));
    const img = picture.querySelector('img');
    if (img) {
      placeholders.push({
        column: String(i + 1), media: '', type: '', url: img.getAttribute('src'),
      });
    }
  });
  // identical columns -> keep column 1 only (the block falls back to column 1)
  const byCol = (c) => JSON.stringify(placeholders
    .filter((p) => p.column === c)
    .map(({ column, ...r }) => r));
  const imgRows = ['2', '3'].every((c) => byCol(c) === byCol('1'))
    ? placeholders.filter((p) => p.column === '1') : placeholders;

  write('compare-models', multiSheet({
    models, table, labels: labelRows, placeholders: imgRows,
  }));
}

/* ------------------------------------------------------------------ My BMW flyout */

function buildFlyout() {
  const { data } = JSON.parse(readFileSync(join(SRC, 'flyout.json'), 'utf8'));
  const labels = Object.entries(data)
    .filter(([, v]) => typeof v === 'string' || typeof v === 'boolean')
    .filter(([k]) => !['gcid', 'ucid', 'isLoggedIn'].includes(k))
    .map(([key, value]) => ({ key, value: String(value) }));
  const benefits = (data.loginBenefits || []).map((text) => ({ text }));
  const links = [];
  (data.groups || []).forEach((g) => (g.links || []).forEach((l) => links.push({
    group: g.id,
    groupTitle: g.title,
    groupTracking: g.trackingID || '',
    id: l.id,
    text: l.text,
    path: l.path,
    tracking: l.trackingID || '',
    icon: l.icon || '',
    disabled: bool(l.disabled),
  })));
  write('mybmw-flyout', multiSheet({ labels, benefits, links }));
}

/* ------------------------------------------------------------------ dealer online services */

function parseCsv(text, delimiter = ';') {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') {
        field += '"';
        i += 1;
      } else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === delimiter) {
      row.push(field);
      field = '';
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i += 1;
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else field += c;
  }
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

function buildDealers() {
  const text = new TextDecoder('latin1').decode(readFileSync(join(SRC, 'otv.csv')));
  const [, ...rows] = parseCsv(text).filter((r) => r.some((f) => f.trim()));
  const data = rows.map(([Dealer, Outlet, URL, Name]) => ({
    Dealer: Dealer.trim(), Outlet: Outlet.trim(), URL: URL.trim(), Name: (Name || '').trim(),
  }));
  write('dealer-services', sheet(data));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  buildCompare();
  buildFlyout();
  buildDealers();
}
