import connect from '../da.js';
import {
  topology, dependencies, buildGrid, rebase,
  TIMESTAMP_LABELS, pageActions, reviewState, commentCounts,
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

const link = (href, text) => {
  const a = document.createElement('a');
  a.className = 'spectrum-Link';
  a.href = href;
  a.textContent = text;
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  return a;
};

const badge = (text, variant) => {
  const el = document.createElement('span');
  el.className = `radar-state spectrum-Badge spectrum-Badge--sizeS spectrum-Badge--${variant}`;
  const label = document.createElement('span');
  label.className = 'spectrum-Badge-label';
  label.textContent = text;
  el.append(label);
  return el;
};

function appendActions(el, routes, missing = false) {
  const actions = document.createElement('div');
  actions.className = 'radar-actions';
  const entries = missing ? [['translate', 'Create in Translate']]
    : [['edit', 'Edit'], ['preview', 'Preview'], ['preflight', 'Preflight'], ['files', 'Status in Files']];
  entries.forEach(([key, label]) => actions.append(link(routes[key], label)));
  const workflow = document.createElement('div');
  workflow.className = 'radar-workflow';
  el.append(actions, workflow);
  return workflow;
}

/** Comment files of one page: .da/comments/<document id>/<comment id>.json */
async function pageComments(da, path) {
  const head = await da.actions.daFetch(`https://admin.da.live/source/${da.org}/${da.site}${path}.html`, { method: 'HEAD' });
  const id = head.ok && head.headers.get('x-da-id');
  if (!id) return [];
  const files = await da.list(`/.da/comments/${id}`);
  const comments = await Promise.all(files.filter((f) => f.ext === 'json')
    .map((f) => da.read(`/.da/comments/${id}/${f.name}.json`).then(JSON.parse).catch(() => null)));
  return comments.filter(Boolean);
}

/** Review step from the publish requests and open comment threads, per page; returns totals. */
async function showWorkflow(da, pages) {
  const [requests, config] = await Promise.all([
    da.rows('/.da/publish-workflow-requests.json'),
    da.actions.daFetch(`https://admin.da.live/config/${da.org}/${da.site}/`).then((r) => (r.ok ? r.json() : {})),
  ]);
  const settings = config['publish-workflow-settings']?.data || [];
  const totals = { review: 0, open: 0 };
  const queue = [...pages];
  const worker = async () => {
    while (queue.length) {
      const { path, el, routes } = queue.shift();
      const review = reviewState(requests, settings, path);
      // eslint-disable-next-line no-await-in-loop
      const { open } = commentCounts(await pageComments(da, path).catch(() => []));
      if (review) {
        totals.review += 1;
        el.append(badge(`In review: ${review.title}`, 'informative'), link(routes.review, 'Review'));
      }
      if (open) {
        totals.open += open;
        el.append(badge(`${open} open comment${open === 1 ? '' : 's'}`, 'yellow'));
      }
    }
  };
  await Promise.all(Array.from({ length: 6 }, worker));
  return totals;
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
    status.textContent = 'Source timestamps require the radar app inside Experience Workspace. Open the integrated showcase for the interactive rollout and accepted-revision demo, or Translate for real source and target pages.';
    return;
  }
  try {
    const da = await connect();
    const ref = da.context.ref || 'main';
    const root = new URLSearchParams(window.location.search).get('root');
    const config = rebase(JSON.parse(await da.read('/.da/translate.json')), root);
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
    const workflow = [];
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
      const sourcePath = `${source.location}${row.rel}`;
      const sourceRoutes = pageActions({ ...da, path: sourcePath, ref });
      const sourceEl = appendActions(th, sourceRoutes);
      workflow.push({ path: sourcePath, el: sourceEl, routes: sourceRoutes });
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
        const routes = pageActions({ ...da, path: cell.path, ref });
        const el = appendActions(td, routes, cell.status === 'missing');
        if (cell.status !== 'missing') {
          drift.push({ cell, el: td });
          workflow.push({ path: cell.path, el, routes });
        }
      });
    });
    const total = grid.length * targets.length;
    const recent = grid.flatMap((r) => r.cells).filter((c) => c.status === 'current').length;
    const summary = `${grid.length} source pages × ${targets.length} languages and markets: ${recent} of ${total} edited since source.`;
    status.textContent = `${summary} Reading review state, comments and WDH values…`;
    const scroll = document.createElement('div');
    scroll.className = 'radar-table-scroll';
    scroll.tabIndex = 0;
    scroll.setAttribute('role', 'region');
    scroll.setAttribute('aria-label', 'Rollout edit timestamps and page actions');
    scroll.append(table);
    main.append(scroll);
    const [totals] = await Promise.all([showWorkflow(da, workflow), checkDrift(da, drift)]);
    status.textContent = `${summary} ${totals.review} in review, ${totals.open} open comment threads. WDH badges identify tech values that differ from the current WDH export.`;
  } catch (e) {
    status.className = 'aida-error';
    status.textContent = `The radar could not load: ${e.message}`;
  }
}());
