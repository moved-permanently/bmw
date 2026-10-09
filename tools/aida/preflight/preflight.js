import connect from '../da.js';
import { runChecks } from './checks.js';
import {
  marketForPath, valuesFromSheet, syncBindings, dataRootForPath,
} from '../../../scripts/aida-wdh.js';
import { getMetadata, withVehicleJsonLd } from '../../../scripts/aida-doc.js';
import { pageActions } from '../radar/grid.js';

const LABELS = { pass: 'Pass', warn: 'Review', fail: 'Issue' };
const VARIANTS = { pass: 'positive', warn: 'notice', fail: 'negative' };

async function load(da, path) {
  const page = marketForPath(path);
  const market = page ? page.market : 'de';
  const [html, values, models, features, terms] = await Promise.all([
    da.read(path),
    da.rows(`${dataRootForPath(path)}/wdh-${market}.json`, 'values'),
    da.rows(`${dataRootForPath(path)}/wdh-${market}.json`, 'models'),
    da.rows('/aida/data/market-features.json'),
    da.rows('/aida/data/brand-terms.json'),
  ]);
  return {
    page, market, html, values: valuesFromSheet({ values }), models, features, terms,
  };
}

function render(main, state, onSync) {
  const results = runChecks(state);
  const failed = results.filter((r) => r.status !== 'pass').length;
  main.replaceChildren();
  const title = document.createElement('h1');
  title.textContent = 'Preflight';
  main.append(title);
  const head = document.createElement('p');
  head.className = 'aida-muted';
  head.textContent = `${state.path} · market ${state.market.toUpperCase()}${state.page?.fallback ? ` (no WDH export for ${state.page.locale})` : ''} · ${failed ? `${failed} of ${results.length} checks need attention` : 'all local checks passed'}`;
  main.append(head);
  const limitation = document.createElement('p');
  limitation.className = 'aida-muted';
  limitation.textContent = 'Deterministic content checks only — not editorial approval, legal sign-off or release evidence.';
  main.append(limitation);

  results.forEach((r) => {
    const item = document.createElement('section');
    item.className = `aida-check is-${r.status}`;
    item.innerHTML = '<h2><span class="aida-status"><span class="spectrum-Badge-label"></span></span><span class="aida-title"></span></h2><p class="aida-summary"></p>';
    item.querySelector('.aida-status').className = `aida-status spectrum-Badge spectrum-Badge--sizeS spectrum-Badge--${VARIANTS[r.status]}`;
    item.querySelector('.spectrum-Badge-label').textContent = LABELS[r.status];
    item.querySelector('.aida-title').textContent = r.title;
    item.querySelector('.aida-summary').textContent = r.summary;
    if (r.details.length) {
      const ul = document.createElement('ul');
      r.details.slice(0, 12).forEach((d) => {
        const li = document.createElement('li');
        li.textContent = d.length > 160 ? `${d.slice(0, 157)}…` : d;
        ul.append(li);
      });
      item.append(ul);
    }
    if (r.fixable) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'spectrum-Button spectrum-Button--sizeM spectrum-Button--accent spectrum-Button--fill';
      const label = document.createElement('span');
      label.className = 'spectrum-Button-label';
      label.textContent = `Update ${r.fixable} values from WDH (${state.market.toUpperCase()})`;
      button.append(label);
      button.addEventListener('click', () => onSync(button));
      item.append(button);
    }
    main.append(item);
  });
}

(async function init() {
  const main = document.querySelector('main');
  if (window.parent === window) {
    const query = new URLSearchParams(window.location.search);
    const path = query.get('path');
    main.querySelector('p').textContent = 'Preflight checks the current page source, not a published snapshot. Open the page in Experience Workspace and choose Preflight from the plugin menu to run checks and update WDH values.';
    if (path) {
      try {
        const routes = pageActions({
          org: query.get('org') || 'moved-permanently',
          site: query.get('site') || 'bmw',
          ref: query.get('ref') || 'main',
          path,
        });
        const link = document.createElement('a');
        link.className = 'spectrum-Button spectrum-Button--sizeM spectrum-Button--accent spectrum-Button--fill';
        link.href = routes.edit;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        const label = document.createElement('span');
        label.className = 'spectrum-Button-label';
        label.textContent = `Open ${path} in Experience Workspace`;
        link.append(label);
        main.append(link);
      } catch (e) {
        main.querySelector('p').textContent = `Preflight needs a valid page: ${e.message}`;
      }
    }
    return;
  }
  try {
    const da = await connect();
    const { path } = da.context;
    const refresh = async () => {
      const state = { ...(await load(da, path)), path };
      render(main, state, async (button) => {
        button.disabled = true;
        button.querySelector('.spectrum-Button-label').textContent = 'Updating…';
        const { html } = syncBindings(state.html, state.market, state.values);
        const model = state.models.find((m) => m.code === getMetadata(html, 'wdh-model'));
        await da.write(path, model?.jsonld ? withVehicleJsonLd(html, model.jsonld) : html);
        await refresh();
        const done = document.createElement('p');
        done.className = 'aida-note';
        done.textContent = 'Values updated in the document. Preview the page to see them.';
        main.prepend(done);
      });
    };
    await refresh();
  } catch (e) {
    main.innerHTML = '<p class="aida-error"></p>';
    main.querySelector('p').textContent = `Preflight could not run: ${e.message}`;
  }
}());
