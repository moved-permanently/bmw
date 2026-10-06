import connect from '../da.js';
import {
  topology, dependencies, buildGrid, TIMESTAMP_LABELS, pageActions,
} from './grid.js';
import {
  findBindings, staleBindings, valuesFromSheet, marketForPath,
} from '../../../scripts/aida-wdh.js';

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
      badge.className = 'radar-drift spectrum-Badge spectrum-Badge--sizeS spectrum-Badge--negative';
      const label = document.createElement('span');
      label.className = 'spectrum-Badge-label';
      label.textContent = `${stale.length} WDH values differ`;
      badge.append(label);
      badge.title = stale.map((s) => `${s.key}: ${s.text} → ${s.expected ?? '–'}`).join('\n');
      el.append(badge);
    }
  }
}

function appendActions(el, routes, missing = false) {
  const actions = document.createElement('div');
  actions.className = 'radar-actions';
  const entries = missing ? [['translate', 'Create in DA Translate'], ['workflow', 'Workflow simulation']]
    : [['edit', 'Edit'], ['preview', 'Preview'], ['preflight', 'Preflight'], ['workflow', 'Workflow simulation']];
  entries.forEach(([key, label]) => {
    const link = document.createElement('a');
    link.className = 'spectrum-Link';
    link.href = routes[key];
    link.textContent = label;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    actions.append(link);
  });
  const evidence = document.createElement('small');
  evidence.className = 'radar-evidence';
  evidence.textContent = 'No approval/release evidence available';
  el.append(actions, evidence);
}

/** Compact language -> market view (structure from the translation config only). */
function renderDependencies(main, { source, languages }) {
  const list = document.createElement('ul');
  list.className = 'radar-dependencies';
  list.setAttribute('aria-label', 'Language and market rollout structure');
  languages.forEach((language) => {
    const li = document.createElement('li');
    const markets = language.markets.map((m) => m.name.toUpperCase()).join(', ') || 'no market folders';
    li.textContent = `${source.name} → ${language.name} (${language.location}) → ${markets}`;
    list.append(li);
  });
  main.append(list);
}

(async function init() {
  const main = document.querySelector('main');
  const status = document.querySelector('#radar-status');
  if (window.parent === window) {
    status.textContent = 'Native DA source timestamps require the radar app inside DA. Open the integrated showcase for the interactive rollout and accepted-revision simulation, or DA Translate for real source and target pages.';
    return;
  }
  try {
    const da = await connect();
    const ref = da.context.ref || 'main';
    const config = JSON.parse(await da.read('/.da/translate.json'));
    const { source, targets } = topology(config);
    renderDependencies(main, dependencies(config));
    status.textContent = `Reading ${source.location} and ${targets.length} language and market folders…`;
    const sources = (await walk(da, source.location))
      .filter((p) => !targets.some((t) => p.path.startsWith(`${t.location}/`)))
      .map((p) => ({ rel: p.path.slice(source.location.length), lastModified: p.lastModified }));
    const locations = targets.map((t) => t.location)
      .filter((location, index, all) => !all.some((other, i) => i !== index && location.startsWith(`${other}/`)));
    const copies = (await Promise.all(locations.map((l) => walk(da, l)))).flat();
    const grid = buildGrid(sources, targets, new Map(copies.map((p) => [p.path, p.lastModified])));

    const table = document.createElement('table');
    table.className = 'radar spectrum-Table spectrum-Table--sizeM';
    const caption = table.createCaption();
    caption.textContent = 'Source and target edit recency — not approval or release status';
    const head = table.createTHead();
    head.className = 'spectrum-Table-head';
    const header = head.insertRow();
    header.className = 'spectrum-Table-row';
    [{ name: `${source.name} source (${source.location})`, kind: 'source' }, ...targets].forEach((target) => {
      const th = document.createElement('th');
      th.className = `spectrum-Table-headCell is-${target.kind}`;
      th.scope = 'col';
      th.textContent = target.name;
      header.append(th);
    });
    const body = table.createTBody();
    body.className = 'spectrum-Table-body';
    const drift = [];
    grid.forEach((row) => {
      const tr = body.insertRow();
      tr.className = 'spectrum-Table-row';
      const th = document.createElement('th');
      th.className = 'spectrum-Table-cell';
      th.scope = 'row';
      const title = document.createElement('span');
      title.className = 'radar-path';
      title.textContent = row.rel;
      th.append(title);
      appendActions(th, pageActions({ ...da, path: `${source.location}${row.rel}`, ref }));
      tr.append(th);
      row.cells.forEach((cell) => {
        const td = tr.insertCell();
        td.className = 'spectrum-Table-cell';
        const chip = document.createElement('span');
        const variant = cell.status === 'behind' ? 'notice' : 'neutral';
        chip.className = `radar-chip spectrum-Badge spectrum-Badge--sizeS spectrum-Badge--${variant}`;
        const label = document.createElement('span');
        label.className = 'spectrum-Badge-label';
        label.textContent = TIMESTAMP_LABELS[cell.status];
        chip.append(label);
        td.append(chip);
        appendActions(td, pageActions({ ...da, path: cell.path, ref }), cell.status === 'missing');
        if (cell.status !== 'missing') drift.push({ cell, el: td });
      });
    });
    const total = grid.length * targets.length;
    const recent = grid.flatMap((r) => r.cells).filter((c) => c.status === 'current').length;
    const summary = `${grid.length} source pages × ${targets.length} languages and markets: ${recent} of ${total} edited since source.`;
    status.textContent = `${summary} Checking WDH values…`;
    const scroll = document.createElement('div');
    scroll.className = 'radar-table-scroll';
    scroll.tabIndex = 0;
    scroll.setAttribute('role', 'region');
    scroll.setAttribute('aria-label', 'Rollout edit timestamps and page actions');
    scroll.append(table);
    main.append(scroll);
    await checkDrift(da, drift);
    status.textContent = `${summary} WDH badges identify tech values that differ from the current WDH export.`;
  } catch (e) {
    status.className = 'aida-error';
    status.textContent = `The radar could not load: ${e.message}`;
  }
}());
