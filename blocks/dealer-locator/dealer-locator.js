/*
 * Dealer Locator (source cmp-dealerlocator): the BMW "DLO as a service" widget.
 * Loads https://dlo.api.bmw/main.js (ES module) and calls window.dloaas.api.start(config), exactly
 * like the inline script of the source component.
 * Content: key/value rows = the widget config (source JSON). Values are JSON literals when they
 * look like one (true, 60, null, [...], {...}, "5" = the string 5), otherwise plain strings.
 * The OSA CSV (osatCsvPath, a www.bmw.de DAM path without CORS) is loaded through the bmw-proxy.
 */
import { bmwProxyUrl } from '../../scripts/bmw-utils.js';

const DLO_SCRIPT = 'https://dlo.api.bmw/main.js';
const CONTAINER_ID = 'dealerLocator';
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

function proxied(path) {
  if (!path || /^https?:\/\//i.test(path)) return path;
  return bmwProxyUrl(path.startsWith('/') ? path : `/${path}`);
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
  if (config.osatCsvPath) config.osatCsvPath = proxied(config.osatCsvPath);
  config.containerSelector = `#${CONTAINER_ID}`;

  const holder = document.createElement('div');
  holder.id = CONTAINER_ID;
  holder.className = 'dealer-locator-app';
  block.replaceChildren(holder);

  const start = () => loadDlo()
    .then((api) => api.start(config))
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
