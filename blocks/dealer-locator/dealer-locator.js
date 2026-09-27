/*
 * Dealer Locator (source cmp-dealerlocator): the BMW "DLO as a service" widget.
 * Loads https://dlo.api.bmw/main.js (ES module) and calls window.dloaas.api.start(config), exactly
 * like the inline script of the source component.
 * Content: key/value rows = the widget config (source JSON). Values are JSON literals when they
 * look like one (true, 60, null, [...], {...}, "5" = the string 5), otherwise plain strings.
 * Online service links (osatCsvPath): the widget expects a ";" CSV (dealer; outlet; url; name, one
 * header row) and loads it with `${osatCsvPath}?_=${Date.now()}`. The rows come from the site sheet
 * /de/data/dealer-services.json (source: www.bmw.de DAM 17012022_BMW_OTV.csv); the CSV is built
 * in the browser and handed over as a Blob URL ending in "#", so the appended query lands in the
 * fragment (blob URLs with a query fail). osatCsvPath may name another .json sheet or an absolute
 * CSV URL; any other value (e.g. the original DAM path) maps to the default sheet.
 */
import { fetchSheet } from '../../scripts/bmw-utils.js';

const DLO_SCRIPT = 'https://dlo.api.bmw/main.js';
const CONTAINER_ID = 'dealerLocator';
const OSAT_SHEET = '/de/data/dealer-services.json';
const OSAT_COLUMNS = ['Dealer', 'Outlet', 'URL', 'Name'];
const JSON_LITERAL_RE = /^(true|false|null|-?\d+(\.\d+)?([eE][+-]?\d+)?|".*"|\[.*\]|\{.*\})$/s;

function parseValue(raw) {
  const value = raw.trim();
  if (JSON_LITERAL_RE.test(value)) {
    try {
      return JSON.parse(value);
    } catch {
      // not valid JSON: keep the string
    }
  }
  return value;
}

/** Reads the key/value rows (keys keep their case: the widget config is camelCase). */
export function readConfig(block) {
  const config = {};
  [...block.children].forEach((row) => {
    const [keyCell, valueCell] = row.children;
    if (!keyCell || !valueCell) return;
    const key = keyCell.textContent.trim();
    if (!key) return;
    config[key] = parseValue(valueCell.textContent);
  });
  return config;
}

const csvField = (v) => {
  const s = String(v ?? '').trim();
  return /[";\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

/** CSV text (as the source file: ";" separated, CRLF, header row) from the sheet rows. */
export function osatCsv(rows) {
  const lines = [['Dealer', 'Outlate', 'URL', 'Name'].join(';')];
  rows.forEach((row) => {
    if (!String(row.Dealer ?? '').trim()) return;
    lines.push(OSAT_COLUMNS.map((c) => csvField(row[c])).join(';'));
  });
  return `${lines.join('\r\n')}\r\n`;
}

async function osatCsvUrl(path) {
  const isSheet = /\.json(\?|#|$)/i.test(path);
  // absolute CSV URLs (served with CORS) are used as they are
  if (!isSheet && /^(https?|blob|data):/i.test(path)) return path;
  const sheet = isSheet ? path : OSAT_SHEET;
  try {
    const { data } = await fetchSheet(sheet);
    const blob = new Blob([osatCsv(data || [])], { type: 'text/csv;charset=utf-8' });
    return `${URL.createObjectURL(blob)}#`;
  } catch {
    // no online service links: the widget works without them
    return undefined;
  }
}

let dloPromise;

function loadDlo() {
  if (window.dloaas && window.dloaas.api) return Promise.resolve(window.dloaas.api);
  if (!dloPromise) {
    dloPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.id = 'dloaasScriptTag';
      script.type = 'module';
      script.src = DLO_SCRIPT;
      script.addEventListener('load', () => {
        if (window.dloaas && window.dloaas.api) resolve(window.dloaas.api);
        else reject(new Error('dloaas api missing'));
      });
      script.addEventListener('error', () => reject(new Error('dlo main.js failed to load')));
      document.head.append(script);
    });
  }
  return dloPromise;
}

export default function decorate(block) {
  const config = readConfig(block);
  if (!config.country) config.country = 'DE';
  if (!config.language) config.language = 'de';
  if (!config.configId) config.configId = 'master';
  config.containerSelector = `#${CONTAINER_ID}`;

  const holder = document.createElement('div');
  holder.id = CONTAINER_ID;
  holder.className = 'dealer-locator-app';
  block.replaceChildren(holder);

  const osat = config.osatCsvPath ? osatCsvUrl(config.osatCsvPath) : Promise.resolve();
  const start = () => Promise.all([loadDlo(), osat])
    .then(([api, osatUrl]) => {
      if (osatUrl) config.osatCsvPath = osatUrl;
      else delete config.osatCsvPath;
      return api.start(config);
    })
    .catch(() => {
      block.classList.add('dealer-locator-error');
    });

  // the widget is the main content of its page: start right away when visible, else lazily
  const observer = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) {
      observer.disconnect();
      start();
    }
  }, { rootMargin: '400px' });
  observer.observe(block);
}
