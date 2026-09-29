/*
 * Cookie consent (source: BMW ePaaS consent controller, "Verwendung von Cookies." drawer).
 *
 * 1. Loads the source ePaaS exactly like www.bmw.de does:
 *      <script id="epaasScriptTag"
 *        src="https://www.bmw.com/etc/clientlibs/wcmp/consentcontroller.fallback/epaas.js"
 *        onload="epaas.api.initialize({tenant: 'ds2~bmw-de', locale: 'de_DE'})">
 *    (= the content of
 *    /etc/clientlibs/epaas/content/bmw/marketDE/bmw_de/de_DE.epaasclientlibinclude.js).
 *    If www.bmw.com cannot be reached, the same file is loaded through the bmw-proxy
 *    (window.BMW_PROXY + /www.bmw.com/etc/clientlibs/wcmp/consentcontroller.fallback/epaas.js).
 * 2. If ePaaS is not available (both loads fail, "consentcontroller.api.notavailable", no init
 *    within 8 s, or window.BMW_CONSENT_MODE === 'fallback'), a visually identical banner is
 *    shown. Its choice is stored in localStorage (bmw-consent) and gates the chat / AI widgets.
 *
 * API (also on window.bmwConsent):
 *   loadConsent()            start (idempotent), resolves with the mode ('epaas' | 'fallback')
 *   isUsageAllowed(itemId)   ePaaS consent item id (CKMOnlineGeniusChatWidget, WebchatCloud)
 *   showConsentSettings()    re-open the banner / consent drawer
 * Events on window: 'bmw-consent-change' {detail: {mode, categories}},
 *   'consent.update' {detail: {consented}}
 */
import { bmwProxyUrl } from './bmw-utils.js';

const EPAAS_SRC = 'https://www.bmw.com/etc/clientlibs/wcmp/consentcontroller.fallback/epaas.js';
const EPAAS_PROXY_PATH = '/www.bmw.com/etc/clientlibs/wcmp/consentcontroller.fallback/epaas.js';
const EPAAS_INIT = { tenant: 'ds2~bmw-de', locale: 'de_DE' };
const INIT_TIMEOUT = 8000;
const STORAGE_KEY = 'bmw-consent';
const CSS_PATH = '/scripts/bmw-consent.css';

// ePaaS consent items used by this site -> fallback category
const ITEM_CATEGORIES = {
  CKMOnlineGeniusChatWidget: 'functional',
  WebchatCloud: 'functional',
};

const TEXT = {
  title: 'Verwendung von Cookies.',
  paragraphs: [
    'Wir verwenden Cookies, einschließlich Cookies von Drittanbietern, zu Analysezwecken sowie zur Anzeige von personalisierter Werbung auf Grundlage Ihres Surfverhaltens. Mit dem Klick auf „Alle akzeptieren“ willigen Sie in das Speichern und Lesen von Informationen auf Ihrem Endgerät ein.',
    'Ebenso willigen Sie in die weitere Verarbeitung der gesammelten und gelesenen personenbezogenen Daten und deren etwaige Übertragung in Länder außerhalb der erweiterten EU (EU + CH, IS, LI, NO, UK), beispielsweise in die USA, ein.',
    'Für detaillierte Informationen über die Nutzung und Verwaltung von Cookies klicken Sie bitte auf „Anpassen“. Mit dem Klick auf „Cookies verbieten“ lehnen Sie die Verwendung von zustimmungspflichtigen Cookies ab.',
  ],
  personalize: 'Anpassen',
  reject: 'Cookies verbieten',
  accept: 'Alle akzeptieren',
  save: 'Auswahl speichern',
  categories: [
    {
      id: 'necessary', label: 'Notwendig', text: 'Für den Betrieb der Website erforderlich (z. B. Speicherung Ihrer Cookie-Auswahl).', locked: true,
    },
    { id: 'functional', label: 'Komfort', text: 'Zusätzliche Funktionen wie BMW AI Assistant und Live Chat.' },
    { id: 'analytics', label: 'Analyse', text: 'Statistiken zur Nutzung der Website, um sie zu verbessern.' },
    { id: 'marketing', label: 'Marketing', text: 'Personalisierte Werbung auf Grundlage Ihres Surfverhaltens.' },
  ],
};

const state = {
  mode: null, // 'epaas' | 'fallback'
  promise: null,
  api: null,
  banner: null,
};

function loadCss() {
  const base = (window.hlx && window.hlx.codeBasePath) || '';
  const href = `${base}${CSS_PATH}`;
  if (document.querySelector(`link[href="${href}"]`)) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  document.head.append(link);
}

function emit(categories) {
  window.dispatchEvent(new CustomEvent('bmw-consent-change', { detail: { mode: state.mode, categories } }));
  const consented = !!(categories && categories.marketing && categories.analytics);
  window.dispatchEvent(new CustomEvent('consent.update', { detail: { consented } }));
}

/* ---------------------------------------------------------------- ePaaS */

function injectEpaas(src) {
  return new Promise((resolve, reject) => {
    const old = document.getElementById('epaasScriptTag');
    if (old) old.remove();
    const script = document.createElement('script');
    script.id = 'epaasScriptTag';
    script.src = src;
    script.onload = () => {
      try {
        window.epaas.api.initialize(EPAAS_INIT);
        resolve(window.epaas.api);
      } catch (e) {
        reject(e);
      }
    };
    script.onerror = () => {
      window.epaasNotAvailable = true;
      reject(new Error(`epaas failed to load: ${src}`));
    };
    document.head.append(script);
  });
}

function waitForInit(api) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('epaas init timeout')), INIT_TIMEOUT);
    const done = () => {
      clearTimeout(timer);
      resolve(api);
    };
    const target = api.addEventListener ? api : window;
    target.addEventListener('consentcontroller.api.initialized', done, { once: true });
    target.addEventListener('consentcontroller.api.notavailable', () => {
      clearTimeout(timer);
      reject(new Error('epaas not available'));
    }, { once: true });
    const poll = setInterval(() => {
      if (api.isInitialized && api.isInitialized()) {
        clearInterval(poll);
        done();
      }
    }, 200);
    setTimeout(() => clearInterval(poll), INIT_TIMEOUT);
  });
}

/*
 * ePaaS also injects BMW's tag management ("processing wrapper" www.bmw.com/p15r.js -> Adobe
 * Launch, Google Ads/DoubleClick once cookies are accepted) and its consent audit logger. On this
 * replica those would report visits of a non-BMW domain into BMW's accounts, so they are dropped
 * unless window.BMW_EPAAS_TRACKING === true. ePaaS adds them with
 * document.head.appendChild(script).
 */
const TRACKING_SCRIPTS = [/\/p15r\.js(\?|$)/, /\/epaas\/onlineaudit-[^/]*\.js/];

function blockTrackingScripts() {
  if (window.BMW_EPAAS_TRACKING === true || document.head.dataset.bmwTrackingBlocked) return;
  document.head.dataset.bmwTrackingBlocked = 'true';
  const { head } = document;
  const original = head.appendChild.bind(head);
  head.appendChild = (node) => {
    if (node && node.tagName === 'SCRIPT' && TRACKING_SCRIPTS.some((re) => re.test(node.src || ''))) {
      return node; // never attached: not loaded
    }
    return original(node);
  };
}

async function startEpaas() {
  const existing = window.epaas && window.epaas.api;
  if (existing && existing.isInitialized && existing.isInitialized()) return existing;
  blockTrackingScripts();
  let api;
  try {
    api = await injectEpaas(EPAAS_SRC);
  } catch {
    window.epaasNotAvailable = false;
    api = await injectEpaas(bmwProxyUrl(EPAAS_PROXY_PATH));
  }
  return waitForInit(api);
}

/* ---------------------------------------------------------------- fallback banner */

function readChoice() {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    return value && value.categories ? value : null;
  } catch {
    return null;
  }
}

function storeChoice(categories) {
  const value = { categories: { ...categories, necessary: true }, timestamp: Date.now() };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    // storage disabled: the choice lasts for this page view
  }
  state.choice = value;
  return value;
}

function button(label, className, onClick) {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = `bmw-consent-button ${className}`;
  const span = document.createElement('span');
  span.textContent = label;
  b.append(span);
  b.addEventListener('click', onClick);
  return b;
}

function closeBanner() {
  const { banner } = state;
  if (!banner) return;
  banner.classList.remove('is-open');
  setTimeout(() => { banner.hidden = true; }, 300);
}

function decide(categories) {
  const choice = storeChoice(categories);
  closeBanner();
  emit(choice.categories);
}

function buildBanner() {
  loadCss();
  const banner = document.createElement('section');
  banner.className = 'bmw-consent';
  banner.setAttribute('role', 'dialog');
  banner.setAttribute('aria-labelledby', 'bmw-consent-title');
  banner.tabIndex = -1;
  banner.hidden = true;

  const title = document.createElement('h2');
  title.id = 'bmw-consent-title';
  title.className = 'bmw-consent-title';
  title.textContent = TEXT.title;

  const content = document.createElement('div');
  content.className = 'bmw-consent-content';
  TEXT.paragraphs.forEach((t) => {
    const p = document.createElement('p');
    p.textContent = t;
    content.append(p);
  });

  const settings = document.createElement('fieldset');
  settings.className = 'bmw-consent-settings';
  settings.hidden = true;
  const legend = document.createElement('legend');
  legend.className = 'bmw-consent-legend';
  legend.textContent = TEXT.personalize;
  settings.append(legend);
  TEXT.categories.forEach((c) => {
    const label = document.createElement('label');
    label.className = 'bmw-consent-category';
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.name = c.id;
    input.checked = !!c.locked;
    input.disabled = !!c.locked;
    const name = document.createElement('span');
    name.className = 'bmw-consent-category-name';
    name.textContent = c.label;
    const text = document.createElement('span');
    text.className = 'bmw-consent-category-text';
    text.textContent = c.text;
    label.append(input, name, text);
    settings.append(label);
  });
  content.append(settings);

  const all = (value) => Object.fromEntries(
    TEXT.categories.map((c) => [c.id, c.locked ? true : value]),
  );
  const actions = document.createElement('div');
  actions.className = 'bmw-consent-actions';
  const personalize = button(TEXT.personalize, 'bmw-consent-personalize', () => {
    if (settings.hidden) {
      const current = (state.choice || readChoice() || {}).categories || {};
      settings.querySelectorAll('input:not([disabled])').forEach((i) => { i.checked = !!current[i.name]; });
      settings.hidden = false;
      personalize.querySelector('span').textContent = TEXT.save;
      settings.scrollIntoView({ block: 'nearest' });
      return;
    }
    const categories = {};
    settings.querySelectorAll('input').forEach((i) => { categories[i.name] = i.checked; });
    decide(categories);
  });
  const reject = button(TEXT.reject, 'bmw-consent-reject', () => decide(all(false)));
  const accept = button(TEXT.accept, 'bmw-consent-accept', () => decide(all(true)));
  actions.append(personalize, reject, accept);

  banner.append(title, content, actions);
  document.body.append(banner);
  state.banner = banner;
  state.resetBanner = () => {
    settings.hidden = true;
    personalize.querySelector('span').textContent = TEXT.personalize;
  };
  return banner;
}

function openBanner() {
  const banner = state.banner || buildBanner();
  if (state.resetBanner) state.resetBanner();
  banner.hidden = false;
  requestAnimationFrame(() => requestAnimationFrame(() => banner.classList.add('is-open')));
  banner.focus({ preventScroll: true });
}

function startFallback() {
  state.mode = 'fallback';
  const choice = readChoice();
  state.choice = choice;
  if (!choice) openBanner();
  else emit(choice.categories);
  return 'fallback';
}

/* ---------------------------------------------------------------- public API */

/**
 * DA Quick Edit renders the page inside an editor iframe, where the (modal) consent banner would
 * block authoring. How Quick Edit loads the page:
 * - da.live editor (adobe/da-live ew-editor-wysiwyg.js):
 *   <ref>--<site>--<org>.preview.da.live/<path>
 *   ?rum=off&consent=disabled&quick-edit=on&controller=parent
 * - standalone from aem.page (adobe/da-nx quick-edit standalone.js): the aem.page shell carries
 *   ?quick-edit=…, the embedded preview.da.live page gets quick-edit=on&controller=parent.
 * In all of these, consent is not initialised at all (no ePaaS, no fallback banner).
 * @returns {boolean}
 */
export function isConsentDisabled() {
  const params = new URLSearchParams(window.location.search);
  return params.get('consent') === 'disabled'
    || params.has('quick-edit')
    || params.get('controller') === 'parent';
}

export function loadConsent() {
  if (!state.promise && isConsentDisabled()) {
    state.mode = 'disabled';
    window.bmwConsent.mode = 'disabled';
    state.promise = Promise.resolve('disabled');
  }
  if (!state.promise) {
    const forced = window.BMW_CONSENT_MODE === 'fallback';
    state.promise = (forced ? Promise.reject(new Error('forced fallback')) : startEpaas())
      .then((api) => {
        state.mode = 'epaas';
        state.api = api;
        if (api.registerOnUserConsentChange) {
          try {
            api.registerOnUserConsentChange(() => emit(null));
          } catch {
            // older api
          }
        }
        window.bmwConsent.mode = 'epaas';
        return 'epaas';
      })
      .catch(() => {
        const mode = startFallback();
        window.bmwConsent.mode = mode;
        return mode;
      });
  }
  return state.promise;
}

/**
 * Whether a consent item may be used (source semantics: ePaaS decides; while ePaaS is unreachable
 * the fallback choice decides; no choice yet = not allowed).
 * @param {string} itemId ePaaS consent item id
 * @returns {Promise<boolean>}
 */
export async function isUsageAllowed(itemId) {
  await loadConsent();
  if (state.mode === 'epaas' && state.api) {
    try {
      return !!state.api.isUsageAllowed(itemId);
    } catch {
      return true;
    }
  }
  const choice = state.choice || readChoice();
  if (!choice) return false;
  const category = ITEM_CATEGORIES[itemId] || 'marketing';
  return !!choice.categories[category];
}

/** Opens the consent drawer (ePaaS) or the fallback banner. */
export async function showConsentSettings() {
  await loadConsent();
  if (state.mode === 'disabled') return;
  if (state.mode === 'epaas' && state.api && state.api.showDisclaimer) {
    try {
      state.api.showDisclaimer();
      return;
    } catch {
      // fall through to the banner
    }
  }
  openBanner();
}

window.bmwConsent = window.bmwConsent || {};
Object.assign(window.bmwConsent, {
  load: loadConsent, isUsageAllowed, show: showConsentSettings, mode: null,
});

export default loadConsent;
