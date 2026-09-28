import {
  parseBinding, marketForPath, valuesFromSheet, staleBindings,
} from './aida-wdh.js';
import { fetchSheet } from './bmw-utils.js';
import { loadCSS } from './aem.js';

const short = (text) => (text && text.length > 70 ? `${text.slice(0, 67)}…` : text);

const REASONS = {
  value: 'differs from WDH',
  market: 'taken from another market',
  unknown: 'not in WDH',
};

/**
 * Preview only: compares the page's WDH values with the current market sheet, marks outdated
 * values and summarises them in a small panel.
 * @param {{href: string, text: string}[]} found bindings collected while decorating the page
 */
// eslint-disable-next-line import/prefer-default-export
export async function checkWdhValues(found) {
  const bindings = found.map((b) => ({ ...parseBinding(b.href), ...b })).filter((b) => b.key);
  if (!bindings.length) return;
  const market = marketForPath(window.location.pathname)?.market || bindings[0].market;
  let values = new Map();
  try {
    values = valuesFromSheet(await fetchSheet(`/aida/data/wdh-${market}.json`));
  } catch (e) {
    // no sheet for this market: every value is reported as unknown
  }
  const stale = staleBindings(bindings, market, values);

  stale.forEach((s) => {
    document.querySelectorAll('.wdh-value').forEach((el) => {
      if (el.dataset.wdh !== s.href) return;
      el.classList.add('wdh-stale');
      el.title = `WDH ${s.key}: ${s.expected ?? '–'}`;
    });
  });

  await loadCSS(`${window.hlx.codeBasePath}/styles/aida.css`);
  const panel = document.createElement('aside');
  panel.className = `wdh-check${stale.length ? ' has-drift' : ''}`;
  const unique = [...new Map(stale.map((s) => [`${s.key}|${s.reason}|${s.text}`, s])).values()];
  const summary = stale.length
    ? `${stale.length} of ${bindings.length} values need an update (${market.toUpperCase()})`
    : `All ${bindings.length} values match WDH (${market.toUpperCase()})`;
  panel.innerHTML = `<button type="button" class="wdh-check-close" aria-label="Close">×</button>
    <p class="wdh-check-title">WDH check · preview only</p>
    <p class="wdh-check-summary">${summary}</p>`;
  if (unique.length) {
    const list = document.createElement('ul');
    unique.forEach((s) => {
      const li = document.createElement('li');
      li.innerHTML = '<code></code> <span class="wdh-check-from"></span> → <strong></strong> <em></em>';
      li.querySelector('code').textContent = s.key;
      li.querySelector('.wdh-check-from').textContent = short(s.text);
      li.querySelector('strong').textContent = short(s.expected) ?? '–';
      li.title = `${s.text} → ${s.expected ?? '–'}`;
      li.querySelector('em').textContent = REASONS[s.reason];
      list.append(li);
    });
    panel.append(list);
  }
  panel.querySelector('.wdh-check-close').addEventListener('click', () => panel.remove());
  document.body.append(panel);
}
