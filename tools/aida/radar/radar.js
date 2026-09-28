import connect from '../da.js';
import { topology, buildGrid } from './grid.js';
import {
  findBindings, staleBindings, valuesFromSheet, marketForPath,
} from '../../../scripts/aida-wdh.js';

const LABELS = {
  missing: 'not started', behind: 'source changed', current: 'up to date',
};

async function walk(da, location) {
  const pages = [];
  const items = await da.list(location);
  // eslint-disable-next-line no-restricted-syntax
  for (const item of items) {
    const path = item.path.replace(`/${da.org}/${da.site}`, '');
    // eslint-disable-next-line no-await-in-loop
    if (!item.ext) pages.push(...await walk(da, path));
    else if (item.ext === 'html') pages.push({ path: path.replace(/\.html$/, ''), lastModified: item.lastModified });
  }
  return pages;
}

async function checkDrift(da, cells) {
  const sheets = new Map();
  const values = (market) => {
    if (!sheets.has(market)) {
      sheets.set(market, da.rows(`/aida/data/wdh-${market}.json`, 'values').then((rows) => valuesFromSheet({ values: rows })));
    }
    return sheets.get(market);
  };
  // eslint-disable-next-line no-restricted-syntax
  for (const { cell, el } of cells) {
    const { market } = marketForPath(cell.path) || {};
    if (!market) continue; // eslint-disable-line no-continue
    // eslint-disable-next-line no-await-in-loop
    const [html, current] = await Promise.all([da.read(cell.path), values(market)]);
    const stale = staleBindings(findBindings(html), market, current);
    if (stale.length) {
      const badge = document.createElement('span');
      badge.className = 'radar-drift';
      badge.textContent = `${stale.length} WDH`;
      badge.title = stale.map((s) => `${s.key}: ${s.text} → ${s.expected ?? '–'}`).join('\n');
      el.append(badge);
    }
  }
}

(async function init() {
  const main = document.querySelector('main');
  const status = main.querySelector('p');
  try {
    const da = await connect();
    const config = JSON.parse(await da.read('/.da/translate.json'));
    const { source, targets } = topology(config);
    status.textContent = `Reading ${source.location} and ${targets.length} language and market folders…`;
    const sources = (await walk(da, source.location))
      .filter((p) => !targets.some((t) => p.path.startsWith(`${t.location}/`)))
      .map((p) => ({ rel: p.path.slice(source.location.length), lastModified: p.lastModified }));
    const locations = targets.filter((t) => t.kind === 'language').map((t) => t.location);
    const copies = (await Promise.all(locations.map((l) => walk(da, l)))).flat();
    const grid = buildGrid(sources, targets, new Map(copies.map((p) => [p.path, p.lastModified])));

    const table = document.createElement('table');
    table.className = 'radar';
    table.innerHTML = `<thead><tr><th>${source.name} source (${source.location})</th>${targets.map((t) => `<th class="is-${t.kind}">${t.name}</th>`).join('')}</tr></thead><tbody></tbody>`;
    const drift = [];
    grid.forEach((row) => {
      const tr = document.createElement('tr');
      const th = document.createElement('th');
      th.textContent = row.rel;
      tr.append(th);
      row.cells.forEach((cell) => {
        const td = document.createElement('td');
        const chip = document.createElement(cell.status === 'missing' ? 'span' : 'a');
        chip.className = `radar-chip is-${cell.status}`;
        chip.textContent = LABELS[cell.status];
        if (cell.status !== 'missing') {
          chip.href = `https://da.live/edit#/${da.org}/${da.site}${cell.path}`;
          chip.target = '_blank';
          drift.push({ cell, el: td });
        }
        td.append(chip);
        tr.append(td);
      });
      table.querySelector('tbody').append(tr);
    });
    const total = grid.length * targets.length;
    const done = grid.flatMap((r) => r.cells).filter((c) => c.status === 'current').length;
    status.textContent = `${grid.length} source pages × ${targets.length} languages and markets: ${done} of ${total} up to date. Checking WDH values…`;
    main.append(table);
    await checkDrift(da, drift);
    status.textContent = `${grid.length} source pages × ${targets.length} languages and markets: ${done} of ${total} up to date. Red badges: tech values that differ from WDH.`;
  } catch (e) {
    status.className = 'aida-error';
    status.textContent = `The radar could not load: ${e.message}`;
  }
}());
