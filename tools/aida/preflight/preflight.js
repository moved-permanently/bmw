import connect from '../da.js';
import { runChecks } from './checks.js';
import { marketForPath, valuesFromSheet, syncBindings } from '../../../scripts/aida-wdh.js';
import { getMetadata, setMetadata } from '../../../scripts/aida-doc.js';

const ICONS = { pass: '✓', warn: '!', fail: '✕' };

async function load(da, path) {
  const page = marketForPath(path);
  const market = page ? page.market : 'de';
  const [html, values, models, features, terms] = await Promise.all([
    da.read(path),
    da.rows(`/aida/data/wdh-${market}.json`, 'values'),
    da.rows(`/aida/data/wdh-${market}.json`, 'models'),
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
  main.innerHTML = '';
  const head = document.createElement('p');
  head.className = 'aida-muted';
  head.textContent = `${state.path} · market ${state.market.toUpperCase()}${state.page?.fallback ? ` (no WDH export for ${state.page.locale})` : ''} · ${failed ? `${failed} of ${results.length} checks need attention` : 'ready to publish'}`;
  main.append(head);

  results.forEach((r) => {
    const item = document.createElement('section');
    item.className = `aida-check is-${r.status}`;
    item.innerHTML = '<h2><span class="aida-icon"></span><span class="aida-title"></span></h2><p class="aida-summary"></p>';
    item.querySelector('.aida-icon').textContent = ICONS[r.status];
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
      button.textContent = `Update ${r.fixable} values from WDH (${state.market.toUpperCase()})`;
      button.addEventListener('click', () => onSync(button));
      item.append(button);
    }
    main.append(item);
  });
}

(async function init() {
  const main = document.querySelector('main');
  try {
    const da = await connect();
    const { path } = da.context;
    const refresh = async () => {
      const state = { ...(await load(da, path)), path };
      render(main, state, async (button) => {
        button.disabled = true;
        button.textContent = 'Updating…';
        const { html } = syncBindings(state.html, state.market, state.values);
        const model = state.models.find((m) => m.code === getMetadata(html, 'wdh-model'));
        await da.write(path, model?.jsonld ? setMetadata(html, 'json-ld', model.jsonld) : html);
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
