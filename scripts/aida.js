import {
  parseBinding, marketForPath, valuesFromSheet, staleBindings, dataRootForPath, findBindings,
} from './aida-wdh.js';
import { fetchSheet } from './bmw-utils.js';
import { loadCSS } from './aem.js';
import { createEditorLink, updateEditorValues } from './wdh-editor.js';

const short = (text) => (text && text.length > 70 ? `${text.slice(0, 67)}…` : text);
const COLLAPSED_KEY = 'bmw-wdh-check-collapsed';

const REASONS = {
  value: 'differs from WDH',
  market: 'taken from another market',
  unknown: 'not in WDH',
};

// three quarters of a circle with an arrow (check again)
const RELOAD_ICON = `<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" fill="none"
  stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
  <path d="M13.5 8A5.5 5.5 0 1 1 8 2.5"/><path d="M6.4 0.9 8 2.5 6.4 4.1"/></svg>`;

const parsed = (bindings) => bindings
  .map((b) => ({ ...parseBinding(b.href), ...b })).filter((b) => b.key);

// outline the values that need an update (decorated spans only, never quick edit's editors)
function markStale(stale) {
  document.querySelectorAll('.wdh-value').forEach((el) => {
    const s = stale.find((x) => x.href === el.dataset.wdh);
    el.classList.toggle('wdh-stale', Boolean(s));
    if (s) el.title = `WDH ${s.key}: ${s.expected ?? '–'}`;
    else el.removeAttribute('title');
  });
}

function listOf(stale) {
  const unique = [...new Map(stale.map((s) => [`${s.key}|${s.reason}|${s.text}`, s])).values()];
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
  return list;
}

/**
 * Preview only: compares the page's WDH values with the current market sheet, marks outdated
 * values and summarises them in a small panel (one per page; a check superseded by a newer render,
 * e.g. Experience Workspace quick edit, renders nothing). In the editor the panel updates the
 * values in the document (scripts/wdh-editor.js); ↻ checks again without redrawing the page.
 * @param {{bindings: {href: string, text: string}[], generation: number,
 *   isCurrent: function(number): boolean}} session WDH bindings of the current render
 * @param {object} [editor] quick-edit port captured by captureEditorPort (scripts/wdh-session.js)
 */
// eslint-disable-next-line import/prefer-default-export
export async function checkWdhValues(session, editor) {
  const { generation } = session;
  if (!parsed(session.bindings).length) return;
  const { pathname } = window.location;
  const market = marketForPath(pathname)?.market || parsed(session.bindings)[0].market;
  const sheetPath = `${dataRootForPath(pathname)}/wdh-${market}.json`;
  const link = editor?.port ? createEditorLink(editor) : null;
  const MARKET = market.toUpperCase();

  // the document as it is now: from the editor when there is one, else this render's values
  const load = async ({ reload = false } = {}) => {
    const bindings = parsed(reload && link?.ready
      ? findBindings(await link.readDocument())
      : session.bindings);
    let sheet = {};
    try {
      sheet = await fetchSheet(sheetPath, { reload });
    } catch (e) {
      // no sheet for this market: every value is reported as unknown
    }
    return { bindings, values: valuesFromSheet(sheet) };
  };

  let state = await load();
  if (!session.isCurrent(generation)) return;
  await loadCSS(`${window.hlx.codeBasePath}/styles/aida.css`);
  if (!session.isCurrent(generation)) return;

  const panel = document.createElement('aside');
  panel.className = 'wdh-check';
  panel.innerHTML = `<button type="button" class="wdh-check-reload" aria-label="Check again" title="Check again">${RELOAD_ICON}</button>
    <button type="button" class="wdh-check-close" aria-label="Close">×</button>
    <button type="button" class="wdh-check-toggle"></button>
    <p class="wdh-check-title"><span class="wdh-check-status" role="img"></span> WDH check</p>
    <div class="wdh-check-body"></div>`;
  const body = panel.querySelector('.wdh-check-body');
  const status = panel.querySelector('.wdh-check-status');
  const toggle = panel.querySelector('.wdh-check-toggle');
  let collapsed = false;
  try {
    collapsed = window.localStorage.getItem(COLLAPSED_KEY) === 'true';
  } catch { /* storage may be blocked in the preview frame */ }
  const showCollapsed = () => {
    panel.classList.toggle('is-collapsed', collapsed);
    body.hidden = collapsed;
    toggle.textContent = collapsed ? '+' : '−';
    toggle.setAttribute('aria-expanded', String(!collapsed));
    toggle.setAttribute('aria-label', `${collapsed ? 'Expand' : 'Collapse'} WDH check`);
    toggle.title = `${collapsed ? 'Expand' : 'Collapse'} WDH check`;
  };
  showCollapsed();
  toggle.addEventListener('click', () => {
    collapsed = !collapsed;
    showCollapsed();
    try {
      window.localStorage.setItem(COLLAPSED_KEY, String(collapsed));
    } catch { /* the toggle still works without storage */ }
  });
  const note = (text) => {
    status.textContent = '⚠️';
    status.setAttribute('aria-label', text);
    const p = document.createElement('p');
    p.className = 'wdh-check-note';
    p.textContent = text;
    body.prepend(p);
  };

  const show = () => {
    const { bindings, values } = state;
    const stale = staleBindings(bindings, market, values);
    markStale(stale);
    panel.classList.toggle('has-drift', stale.length > 0);
    const summary = document.createElement('p');
    summary.className = 'wdh-check-summary';
    if (!bindings.length) summary.textContent = 'No WDH values on this page';
    else if (stale.length) summary.textContent = `${stale.length} of ${bindings.length} values need an update (${MARKET})`;
    else summary.textContent = `All ${bindings.length} values match WDH (${MARKET})`;
    status.textContent = stale.length || !bindings.length ? '⚠️' : '✅';
    status.setAttribute('aria-label', summary.textContent);
    body.replaceChildren(summary);
    const fixable = stale.filter((s) => s.expected).length;
    if (fixable && link?.ready && link.canWrite) {
      const update = document.createElement('button');
      update.type = 'button';
      update.className = 'wdh-check-update';
      update.textContent = 'Update';
      update.title = `Update ${fixable} values from WDH (${MARKET}) in the document`;
      update.addEventListener('click', async () => {
        update.disabled = true;
        update.textContent = 'Updating…';
        try {
          // the editor then redraws the page, whose new render shows its own panel
          await updateEditorValues(link, { market, values });
        } catch (e) {
          update.disabled = false;
          update.textContent = 'Update';
          note(`Could not update: ${e.message}`);
        }
      });
      body.append(update);
    }
    if (stale.length) body.append(listOf(stale));
  };

  panel.querySelector('.wdh-check-reload').addEventListener('click', async () => {
    if (panel.classList.contains('is-checking')) return;
    panel.classList.add('is-checking');
    try {
      state = await load({ reload: true });
      show();
    } catch (e) {
      note(`Could not check again: ${e.message}`);
    } finally {
      panel.classList.remove('is-checking');
    }
  });
  panel.querySelector('.wdh-check-close').addEventListener('click', () => panel.remove());
  // clicks on the panel stay out of the editor: the frame does not take focus (the canvas would
  // show its selection toolbar over the panel) and quick edit does not select or edit anything
  panel.addEventListener('mousedown', (e) => {
    e.preventDefault();
    e.stopPropagation();
  });
  show();
  document.querySelectorAll('aside.wdh-check').forEach((p) => p.remove());
  document.body.append(panel);
}
