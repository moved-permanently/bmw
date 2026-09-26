/* eslint-disable max-classes-per-file */
/*
 * BMW Kundenbetreuung help sidebar (source: .cmp-stickysidebar, on every www.bmw.de page).
 *
 * Speech-bubble button bottom right (draggable vertically), dropdown "Wie können wir helfen?":
 *  - BMW AI Assistant (https://faq-backend.api.bmw/widget/v1/index.js -> window.ckmAiChatWidget)
 *  - Live Chat (cctapiemea Genesys script -> window.openCCTChatWidget); like the source it is only
 *    shown when "hide-live-chat" is off or the liveChatAvailable cookie is set
 *  - links (Hilfe & Kontakt, new tab)
 * plus the "Unser neuer AI-Support." nudge (after 12.85 s, once per session / 14 days after
 * closing) and the pulsing ring animation of the button.
 *
 * Config: fragment /de/fragments/help-sidebar (block "Help Sidebar", see parseConfig) with a
 * built-in fallback identical to the source. Widgets are gated by scripts/bmw-consent.js (ePaaS
 * items CKMOnlineGeniusChatWidget / WebchatCloud).
 * Globals kept from the source for other components: window.ssb.ckmChat.open(),
 * window.ssb.gcChat.open(). URL parameter ?openAIAssistant=true opens the AI assistant.
 */
import { isUsageAllowed, loadConsent, showConsentSettings } from './bmw-consent.js';
import { bmwProxyUrl } from './bmw-utils.js';

const FRAGMENT_PATH = '/de/fragments/help-sidebar';
const CSS_PATH = '/scripts/bmw-sidebar.css';
const CHAT_CONTAINER = 'bmw-sidebar-chat';
const EVENTS = {
  CHAT_MINIMIZE: 'chatwidget_minimize',
  CHAT_CLOSE: 'chatwidget_close',
  CHAT_OPEN: 'aichat_open',
  CHAT_READY: 'chat-ready',
  CHAT_LOAD_ERROR: 'chat-load-error',
  CHAT_RETURN: 'chatwidget_return',
  CHAT_OPEN_AICHAT: 'chatwidget_aichat',
  LOAD_LIVE_CHAT: 'stickysidebar-load-live-chat-event',
};
const TIMING = {
  nudgeDelay: 12850,
  nudgeAutoHide: 8000,
  nudgeAutoHideMobile: 5000,
  pulseFirst: 52850,
  pulseEvery: 40000,
  poll: 500,
  maxAttempts: 20,
};
const DRAG = {
  threshold: 10, restrictedTop: 150, topNavGap: 12, navFallback: 70,
};

/** Built-in config = the sidebar of www.bmw.de (identical on all 221 pages, 2026-09). */
export const DEFAULT_CONFIG = {
  label: 'BMW Kundenbetreuung',
  intro: 'Wie können wir helfen?',
  brand: 'BMW',
  language: 'de_DE',
  hostname: 'https://crm-il-api-prod.bmwgroup.com/ckm-genai-chat-prod-api/api/v1',
  tenantId: '01916faa-bde2-757a-8e07-5158fd765e95',
  contactUrl: '',
  // the AI backend only answers requests with Origin https://www.bmw.de: route it through the bmw-proxy
  aiProxy: true,
  hideLiveChat: true,
  nudge: {
    title: 'Unser neuer AI-Support.',
    text: 'Soforthilfe mit maßgeschneiderten Antworten. Jetzt ausprobieren:',
    link: 'BMW AI Assistant.',
    mobileTitle: 'Unser neuer AI-Support.',
    mobileText: 'Jetzt ausprobieren:',
    mobileLink: 'BMW AI Assistant.',
    target: 'ai-assistant',
  },
  items: [
    {
      type: 'ai-assistant', icon: 'animated_speech_bubble_sparkles', label: 'BMW AI Assistant', url: 'https://faq-backend.api.bmw/widget/v1/index.js', highlighted: true,
    },
    {
      type: 'live-chat', icon: 'speech_bubble_with_person', label: 'Live Chat', url: 'https://cctapiemea.gc.azure.bmw.cloud/widget/bmw_emea_prod_de-nsc-care_web/script.js',
    },
    {
      type: 'link', icon: 'telephone_and_mail', label: 'Hilfe & Kontakt', url: '/de/mehr-bmw/kundenbetreuung', newTab: true,
    },
  ],
};

/* ---------------------------------------------------------------- helpers */

function contentPrefix() {
  const { pathname } = window.location;
  const idx = pathname.indexOf('/de/');
  return idx > 0 ? pathname.substring(0, idx) : '';
}

function getCookie(name) {
  const entry = document.cookie.split('; ').find((c) => c.startsWith(`${name}=`));
  return entry ? decodeURIComponent(entry.split('=').slice(1).join('=')) : undefined;
}

function setCookie(name, value, maxAgeSeconds) {
  let c = `${name}=${encodeURIComponent(JSON.stringify(value))}; Path=/; SameSite=Lax`;
  if (maxAgeSeconds) c += `; Max-Age=${maxAgeSeconds}`;
  if (window.location.protocol === 'https:') c += '; Secure';
  document.cookie = c;
}

function removeCookie(name) {
  document.cookie = `${name}=; Path=/; Max-Age=0`;
}

const HOUR = 3600;
const DAY = 24 * HOUR;

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const existing = [...document.scripts].find((s) => s.src === src);
    if (existing && existing.dataset.loaded) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => {
      script.dataset.loaded = 'true';
      resolve();
    };
    script.onerror = () => reject(new Error(`failed to load ${src}`));
    document.head.append(script);
  });
}

function poll(check, { interval = TIMING.poll, max = TIMING.maxAttempts } = {}) {
  return new Promise((resolve, reject) => {
    let n = 0;
    const tick = () => {
      if (check()) {
        resolve();
        return;
      }
      n += 1;
      if (n >= max) reject(new Error('timeout'));
      else setTimeout(tick, interval);
    };
    tick();
  });
}

function icon(name, className = '') {
  const span = document.createElement('span');
  span.className = `bmw-icon ${className}`.trim();
  span.dataset.icon = name;
  span.setAttribute('aria-hidden', 'true');
  span.textContent = name;
  return span;
}

function loadCss() {
  const base = (window.hlx && window.hlx.codeBasePath) || '';
  const href = `${base}${CSS_PATH}`;
  if (document.querySelector(`link[href="${href}"]`)) return Promise.resolve();
  return new Promise((resolve) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.onload = resolve;
    link.onerror = resolve;
    document.head.append(link);
  });
}

/* ---------------------------------------------------------------- config (fragment) */

const KEY_MAP = {
  label: 'label',
  intro: 'intro',
  brand: 'brand',
  language: 'language',
  hostname: 'hostname',
  'tenant-id': 'tenantId',
  'contact-url': 'contactUrl',
  'ai-proxy': 'aiProxy',
  'hide-live-chat': 'hideLiveChat',
  'nudge-title': 'nudge.title',
  'nudge-text': 'nudge.text',
  'nudge-link': 'nudge.link',
  'nudge-mobile-title': 'nudge.mobileTitle',
  'nudge-mobile-text': 'nudge.mobileText',
  'nudge-mobile-link': 'nudge.mobileLink',
  'nudge-target': 'nudge.target',
};
const ITEM_TYPES = ['ai-assistant', 'live-chat', 'link'];

function cellIcon(cell) {
  const span = cell.querySelector('span.icon');
  if (span) {
    const cls = [...span.classList].find((c) => c.startsWith('icon-'));
    span.remove();
    if (cls) return cls.substring(5).replace(/-/g, '_');
  }
  const m = cell.textContent.match(/:([a-z0-9_-]+):/i);
  return m ? m[1].replace(/-/g, '_') : '';
}

/**
 * Reads the "Help Sidebar" block of the fragment.
 *  Key/value rows: label, intro, brand, language, hostname, tenant-id, contact-url, hide-live-chat,
 *    nudge-title, nudge-text, nudge-link, nudge-mobile-title, nudge-mobile-text, nudge-mobile-link,
 *    nudge-target (item type the nudge link opens, default ai-assistant), ai-proxy (true/false).
 *    Empty nudge-title = no nudge.
 *  Item rows: ai-assistant | live-chat | link  —  ":icon:"  —  label  —  URL (script or page)  —
 *    options (highlighted, new-tab, same-tab)
 * @param {Element} root
 * @returns {object|null}
 */
export function parseConfig(root) {
  const block = root && root.querySelector('.help-sidebar');
  if (!block) return null;
  const config = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
  config.items = [];
  let hasNudge = false;
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (!cells.length) return;
    const key = cells[0].textContent.trim().toLowerCase();
    if (ITEM_TYPES.includes(key)) {
      // type | :icon: | label | url | options  (the icon may also lead the label cell)
      const rest = cells.slice(1);
      const iconOnly = (c) => c && !c.textContent.replace(/:[a-z0-9_-]+:/gi, '').trim()
        && (c.querySelector('span.icon') || /:[a-z0-9_-]+:/i.test(c.textContent));
      const iconCell = iconOnly(rest[0]) || (rest.length >= 3 && !rest[0].textContent.trim())
        ? rest.shift() : null;
      const labelCell = rest[0];
      if (!labelCell) return;
      const name = cellIcon(iconCell || labelCell);
      const linkInLabel = labelCell.querySelector('a[href]');
      const urlCell = rest[1];
      const a = (urlCell && urlCell.querySelector('a[href]')) || linkInLabel;
      let url = urlCell ? urlCell.textContent.trim() : '';
      if (a) url = a.getAttribute('href');
      const opts = rest[2] ? rest[2].textContent.toLowerCase() : '';
      const label = labelCell.textContent.replace(/:[a-z0-9_-]+:/gi, '').replace(/\s+/g, ' ').trim();
      if (!label) return;
      const fallback = DEFAULT_CONFIG.items.find((i) => i.type === key);
      config.items.push({
        type: key,
        icon: name || (fallback ? fallback.icon : ''),
        label,
        url,
        highlighted: /highlight/.test(opts),
        // source: "Hilfe & Kontakt" opens in a new tab; "same-tab" switches that off
        newTab: /new-tab|_blank/.test(opts) || (key === 'link' && !/same-tab/.test(opts)),
      });
      return;
    }
    const target = KEY_MAP[key];
    if (!target || !cells[1]) return;
    let value = cells[1].textContent.replace(/\s+/g, ' ').trim();
    if (key === 'contact-url') {
      const a = cells[1].querySelector('a[href]');
      if (a) value = a.getAttribute('href');
    }
    if (key === 'hide-live-chat' || key === 'ai-proxy') value = /^(true|ja|yes|1)$/i.test(value);
    if (target.startsWith('nudge.')) {
      hasNudge = true;
      config.nudge[target.substring(6)] = value;
    } else {
      config[target] = value;
    }
  });
  if (hasNudge && !config.nudge.title) config.nudge = null;
  if (!config.items.length) config.items = DEFAULT_CONFIG.items;
  return config;
}

async function loadConfig() {
  try {
    const resp = await fetch(`${contentPrefix()}${FRAGMENT_PATH}.plain.html`);
    if (resp.ok) {
      const div = document.createElement('div');
      div.innerHTML = await resp.text();
      const config = parseConfig(div);
      if (config) return config;
    }
  } catch {
    // use the built-in config
  }
  return DEFAULT_CONFIG;
}

/* ---------------------------------------------------------------- chat items */

class Item {
  constructor(sidebar, config, element) {
    this.sidebar = sidebar;
    this.config = config;
    this.element = element;
    this.loader = element.querySelector('.bmw-sidebar-loader');
    this.arrow = element.querySelector('.bmw-sidebar-item-arrow');
  }

  // eslint-disable-next-line class-methods-use-this
  async init() { return true; }

  isAvailable() { return !this.element.classList.contains('hidden'); }

  toggleLoader(on) {
    if (this.loader) this.loader.classList.toggle('hidden', !on);
    if (this.arrow) this.arrow.classList.toggle('hidden', on);
  }
}

class LinkItem extends Item {}

/** Consent gate: ePaaS decides; in fallback mode an unanswered banner is shown first. */
async function ensureAllowed(itemId) {
  if (await isUsageAllowed(itemId)) return true;
  const mode = await loadConsent();
  if (mode !== 'fallback') return false;
  showConsentSettings();
  return new Promise((resolve) => {
    window.addEventListener('bmw-consent-change', async () => {
      resolve(await isUsageAllowed(itemId));
    }, { once: true });
  });
}

class AiItem extends Item {
  appId = 'ckm';

  consentId = 'CKMOnlineGeniusChatWidget';

  async init() {
    this.loaded = false;
    this.isOpen = false;
    this.element.addEventListener('click', (e) => {
      e.preventDefault();
      this.openChat();
    });
    window.ssb = window.ssb || {};
    window.ssb.ckmChat = window.ssb.ckmChat || {};
    window.ssb.ckmChat.open = this.openChat.bind(this);
    window.ssb.ckmChat.minimize = this.minimizeChat.bind(this);
    ['CHAT_RETURN', 'CHAT_CLOSE'].forEach((ev) => window.addEventListener(EVENTS[ev], ({ detail }) => {
      if (detail && detail.appId === this.appId) this.isOpen = false;
    }));
    const params = new URLSearchParams(window.location.search);
    if (params.get('openAIAssistant') === 'true') {
      this.openChat();
      const url = new URL(window.location.href);
      url.searchParams.delete('openAIAssistant');
      window.history.replaceState(null, '', url);
    }
    return true;
  }

  async loadChat(userMessage) {
    const { config } = this.sidebar;
    try {
      this.toggleLoader(true);
      await loadScript(this.config.url);
      await poll(() => window.ckmAiChatWidget && window.ckmAiChatWidget.init);
      await window.ckmAiChatWidget.init({
        skipDelay: true,
        hideButton: true,
        brand: config.brand,
        hostname: config.aiProxy
          ? bmwProxyUrl(`/${config.hostname.replace(/^https?:\/\//, '')}`)
          : config.hostname,
        language: config.language,
        tenantId: config.tenantId,
        handoverUrl: config.contactUrl || undefined,
        ...(userMessage ? { userMessage } : {}),
      }, `.${CHAT_CONTAINER}`);
      this.loaded = true;
    } catch (e) {
      this.element.dataset.chatLoadError = 'true';
      this.element.dataset.chatError = e.message;
      window.dispatchEvent(new Event(EVENTS.CHAT_LOAD_ERROR));
    } finally {
      this.toggleLoader(false);
    }
  }

  minimizeChat() {
    if (this.isOpen && window.ckmAiChatWidget && window.ckmAiChatWidget.minimize) {
      window.ssb.ckm = { skipMinimize: true };
      window.ckmAiChatWidget.minimize();
    }
  }

  /**
   * Opens the AI assistant (loads the widget on first use).
   * @param {{userMessage?: string}} [opts] message sent right away (ai-entry search field)
   */
  async openChat(opts = {}) {
    if (this.isOpening) return;
    this.isOpening = true;
    try {
      if (!(await ensureAllowed(this.consentId))) return;
      if (!this.loaded) await this.loadChat(opts.userMessage);
      await poll(() => window.ckmAiChatWidget && window.ckmAiChatWidget.open);
      window.dispatchEvent(new CustomEvent(EVENTS.CHAT_READY, { detail: { type: 'ckmAiChatWidget', appId: this.appId } }));
      window.dispatchEvent(new Event(EVENTS.CHAT_OPEN));
      window.ckmAiChatWidget.open();
      this.isOpen = true;
    } catch {
      window.dispatchEvent(new Event(EVENTS.CHAT_LOAD_ERROR));
    } finally {
      this.isOpening = false;
    }
  }
}

class LiveChatItem extends Item {
  appId = 'gc';

  consentId = 'WebchatCloud';

  async init() {
    this.loaded = false;
    this.hideLiveChat = !!this.sidebar.config.hideLiveChat;
    this.element.addEventListener('click', (e) => {
      e.preventDefault();
      this.openChat();
    });
    window.ssb = window.ssb || {};
    window.ssb.gcChat = window.ssb.gcChat || {};
    window.ssb.gcChat.open = this.openChat.bind(this);
    document.addEventListener(EVENTS.LOAD_LIVE_CHAT, async (e) => {
      if (!this.loaded) await this.loadChat();
      if (e.detail && e.detail.callback) e.detail.callback();
    });
    if (getCookie('cct_isChatSessionActive') || getCookie('cct_isCoBrowseSessionActive')) this.loadChat();
    this.updateAvailability();
    return true;
  }

  updateAvailability() {
    const hidden = this.hideLiveChat && !getCookie('liveChatAvailable');
    this.element.classList.toggle('hidden', hidden);
  }

  async loadChat() {
    try {
      this.toggleLoader(true);
      await loadScript(this.config.url);
      this.loaded = true;
    } catch (e) {
      this.element.dataset.chatLoadError = 'true';
      this.element.dataset.chatError = e.message;
      window.dispatchEvent(new Event(EVENTS.CHAT_LOAD_ERROR));
    } finally {
      this.toggleLoader(false);
    }
  }

  async openChat() {
    if (!(await ensureAllowed(this.consentId))) return;
    if (!this.loaded) await this.loadChat();
    try {
      await poll(() => typeof window.openCCTChatWidget === 'function');
      setCookie('liveChatAvailable', true, 12 * HOUR);
      this.updateAvailability();
      window.dispatchEvent(new CustomEvent(EVENTS.CHAT_READY, { detail: { type: 'chatGC', appId: this.appId } }));
      window.openCCTChatWidget();
    } catch {
      window.dispatchEvent(new Event(EVENTS.CHAT_LOAD_ERROR));
    }
  }
}

const ITEM_CLASSES = { 'ai-assistant': AiItem, 'live-chat': LiveChatItem, link: LinkItem };

/* ---------------------------------------------------------------- DOM */

const LOADER_SVG = '<svg class="bmw-sidebar-loader-icon" fill="none" height="20" viewBox="0 0 52 52" width="20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path clip-rule="evenodd" d="M50 26L42 26C42 34.8366 34.8366 42 26 42L26 50C39.2548 50 50 39.2548 50 26ZM10 26L2 26C2 12.7452 12.7452 2 26 2L26 10C17.1634 10 10 17.1634 10 26Z" fill="#262626" fill-rule="evenodd"></path></svg>';

function buildItem(item, index) {
  const li = document.createElement('li');
  li.className = 'bmw-sidebar-item';
  li.setAttribute('role', 'none');
  const isLink = item.type === 'link';
  const el = document.createElement(isLink ? 'a' : 'button');
  el.className = 'bmw-sidebar-item-button with-divider';
  if (item.highlighted) el.classList.add('bmw-sidebar-item-highlighted');
  el.id = `bmw-sidebar-item-${index}`;
  el.setAttribute('role', 'option');
  el.setAttribute('aria-selected', 'false');
  el.dataset.type = item.type;
  if (isLink) {
    el.href = item.url;
    if (item.newTab) {
      el.target = '_blank';
      el.rel = 'noopener';
    }
  } else {
    el.type = 'button';
  }
  const textWrap = document.createElement('span');
  textWrap.className = 'bmw-sidebar-item-text';
  if (item.icon) textWrap.append(icon(item.icon, 'bmw-sidebar-item-icon'));
  const desc = document.createElement('span');
  desc.className = 'bmw-sidebar-item-description';
  desc.textContent = item.label;
  textWrap.append(desc);
  const icons = document.createElement('span');
  icons.className = 'bmw-sidebar-item-icons';
  if (isLink && item.newTab) icons.append(icon('external_link', 'bmw-sidebar-item-arrow'));
  const loader = document.createElement('span');
  loader.className = 'bmw-sidebar-loader hidden';
  loader.innerHTML = LOADER_SVG;
  icons.append(loader);
  el.append(textWrap, icons);
  li.append(el);
  return { li, el };
}

function buildNudge(nudge) {
  const el = document.createElement('div');
  el.className = 'bmw-sidebar-nudge hidden';
  el.setAttribute('aria-live', 'polite');
  const content = document.createElement('div');
  content.className = 'bmw-sidebar-nudge-content';
  const title = document.createElement('div');
  title.className = 'bmw-sidebar-nudge-title';
  const desc = document.createElement('p');
  desc.className = 'bmw-sidebar-nudge-description';
  const link = document.createElement('button');
  link.type = 'button';
  link.className = 'bmw-sidebar-nudge-link';
  content.append(title, desc);
  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'bmw-sidebar-nudge-close';
  close.setAttribute('aria-label', 'Schließen');
  close.append(icon('close'));
  const mask = document.createElement('div');
  mask.className = 'bmw-sidebar-nudge-mask hidden';
  mask.append(icon('speech_bubbles'));
  el.append(content, close, mask);
  const setCopy = (mobile) => {
    title.textContent = mobile ? nudge.mobileTitle || nudge.title : nudge.title;
    link.textContent = mobile ? nudge.mobileLink || nudge.link : nudge.link;
    desc.replaceChildren(document.createTextNode(`${(mobile ? nudge.mobileText || nudge.text : nudge.text).trim()} `), link);
  };
  setCopy(false);
  return {
    el, title, desc, link, close, mask, setCopy,
  };
}

/* ---------------------------------------------------------------- sidebar */

const waitAnimation = (el, name, fallback = 1500) => new Promise((resolve) => {
  const timer = setTimeout(resolve, fallback);
  const onEnd = (e) => {
    if (e.target === el && (!name || e.animationName === name)) {
      clearTimeout(timer);
      el.removeEventListener('animationend', onEnd);
      resolve();
    }
  };
  el.addEventListener('animationend', onEnd);
});

class Sidebar {
  constructor(config) {
    this.config = config;
    this.items = [];
    this.mobileMq = window.matchMedia('(max-width: 767px)');
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  build() {
    const root = document.createElement('aside');
    root.className = 'bmw-sidebar';
    root.setAttribute('aria-label', this.config.label);

    const wrapper = document.createElement('div');
    wrapper.className = 'bmw-sidebar-wrapper';
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'bmw-sidebar-button pulsing-double';
    button.setAttribute('role', 'combobox');
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-controls', 'bmw-sidebar-dropdown');
    button.setAttribute('aria-label', this.config.label);
    button.title = this.config.label;
    button.append(icon('speech_bubbles', 'bmw-sidebar-button-icon-open'), icon('close', 'bmw-sidebar-button-icon-close'));

    if (this.config.nudge && this.config.nudge.title) {
      this.nudge = buildNudge(this.config.nudge);
      wrapper.append(this.nudge.el);
    }
    wrapper.append(button);

    const dropdown = document.createElement('div');
    dropdown.className = 'bmw-sidebar-dropdown';
    dropdown.id = 'bmw-sidebar-dropdown';
    const intro = document.createElement('div');
    intro.className = 'bmw-sidebar-intro';
    intro.textContent = this.config.intro;
    const list = document.createElement('ul');
    list.className = 'bmw-sidebar-list';
    list.setAttribute('role', 'listbox');
    list.setAttribute('aria-label', this.config.intro);
    dropdown.append(intro, list);

    root.append(wrapper, dropdown);
    const chat = document.createElement('div');
    chat.className = CHAT_CONTAINER;

    this.root = root;
    this.button = button;
    this.dropdown = dropdown;
    this.list = list;
    document.body.append(root, chat);
  }

  async initItems() {
    const results = await Promise.all(this.config.items.map(async (item, i) => {
      const Cls = ITEM_CLASSES[item.type];
      if (!Cls) return null;
      const { li, el } = buildItem(item, i);
      const obj = new Cls(this, item, el);
      obj.li = li;
      if (!(await obj.init())) return null;
      el.addEventListener('click', () => this.resetPulse());
      return obj;
    }));
    this.items = results.filter(Boolean);
    this.items.forEach((item) => this.list.append(item.li));
    this.updateIndices();
  }

  updateIndices() {
    let n = 0;
    this.items.forEach((item) => {
      if (item.isAvailable()) {
        n += 1;
        item.li.style.setProperty('--ssb-item-index', n);
      }
    });
  }

  availableItems() { return this.items.filter((i) => i.isAvailable()); }

  /* ---- open / close ---- */

  isOpen() { return this.dropdown.classList.contains('bmw-sidebar-dropdown-opened'); }

  minimizedChat() {
    const id = getCookie('chatMinimized');
    if (!id) return null;
    let appId = id;
    try {
      appId = JSON.parse(id);
    } catch {
      // plain value
    }
    return this.items.find((i) => i.appId === appId) || null;
  }

  async toggle(force) {
    this.resetPulse();
    const minimized = force !== false ? this.minimizedChat() : null;
    if (minimized) {
      minimized.openChat();
      return;
    }
    await this.hideNudge(true);
    const open = force ?? !this.isOpen();
    if (open === this.isOpen()) return;
    this.resetSelection();
    if (open) {
      this.updateIndices();
      this.repositionMenu();
    }
    this.dropdown.classList.toggle('bmw-sidebar-dropdown-opened', open);
    this.button.setAttribute('aria-expanded', String(open));
    if (open) this.button.focus({ preventScroll: true, focusVisible: false });
  }

  /* ---- keyboard (source stickysidebar-a11y) ---- */

  focusables() { return this.availableItems().map((i) => i.element); }

  resetSelection() {
    this.focusables().forEach((el) => el.setAttribute('aria-selected', 'false'));
    this.button.removeAttribute('aria-activedescendant');
    this.dropdown.scrollTop = 0;
    this.current = -1;
  }

  highlight(index) {
    const els = this.focusables();
    els.forEach((el, i) => el.setAttribute('aria-selected', String(i === index)));
    const el = els[index];
    if (!el) return;
    this.button.setAttribute('aria-activedescendant', el.id);
    this.current = index;
    el.scrollIntoView({ block: 'nearest' });
  }

  onKeydown(e) {
    const els = this.focusables();
    if (!this.isOpen()) {
      if (['ArrowDown', 'ArrowUp'].includes(e.key)) {
        e.preventDefault();
        this.toggle(true).then(() => setTimeout(() => this.highlight(0), 300));
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.toggle(true).then(() => setTimeout(() => this.highlight(0), 300));
      }
      return;
    }
    if (!els.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      this.highlight((this.current + 1) % els.length);
      this.resetPulse();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      this.highlight((this.current - 1 + els.length) % els.length);
      this.resetPulse();
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (this.current >= 0 && els[this.current]) els[this.current].click();
      else this.toggle(false);
    } else if (e.key === 'Escape') {
      this.toggle(false);
    }
  }

  /* ---- pulse ---- */

  schedulePulse(initial = false) {
    clearTimeout(this.pulseTimer);
    const run = () => {
      this.button.classList.remove('pulsing-double');
      this.button.classList.add('pulsing-single');
      this.button.addEventListener('animationend', () => this.button.classList.remove('pulsing-single'), { once: true });
      this.pulseTimer = setTimeout(run, TIMING.pulseEvery);
    };
    this.pulseTimer = setTimeout(run, initial ? TIMING.pulseFirst : TIMING.pulseEvery);
  }

  resetPulse() {
    clearTimeout(this.resetTimer);
    this.resetTimer = setTimeout(() => {
      clearTimeout(this.pulseTimer);
      this.button.classList.remove('pulsing-double', 'pulsing-single');
      this.schedulePulse();
    }, 100);
  }

  /* ---- drag (vertical) ---- */

  minBottom() {
    const v = getComputedStyle(this.root).getPropertyValue('--bmw-sidebar-initial-bottom').trim();
    if (v.endsWith('vh')) return (parseFloat(v) * window.innerHeight) / 100;
    return parseFloat(v) || 0;
  }

  setBottom(px) {
    this.root.style.setProperty('--bmw-sidebar-bottom', `${px}px`);
    this.position = px;
  }

  bindDrag() {
    const onMove = (e) => {
      const y = e.touches ? e.touches[0].clientY : e.clientY;
      const delta = y - this.startY;
      const next = this.startBottom - delta;
      const allowed = next > this.minBottom() && next < window.innerHeight - DRAG.restrictedTop;
      if (Math.abs(delta) > DRAG.threshold && allowed && next !== this.position) {
        e.preventDefault();
        this.setBottom(next);
        this.dragged = true;
      }
    };
    const onEnd = (e) => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onEnd);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onEnd);
      this.button.classList.remove('is-active');
      this.resetPulse();
      if (this.dragged) {
        this.dragged = false;
        this.repositionMenu();
        this.repositionNudge();
        return;
      }
      if (e.type === 'touchend') e.preventDefault();
      this.toggle();
    };
    const onStart = (e) => {
      if (e.type === 'mousedown' && e.button !== 0) return;
      e.preventDefault();
      this.button.classList.add('is-active');
      this.startBottom = window.innerHeight - this.root.getBoundingClientRect().bottom;
      this.startY = e.touches ? e.touches[0].clientY : e.clientY;
      if (e.touches) {
        window.addEventListener('touchmove', onMove, { passive: false });
        window.addEventListener('touchend', onEnd);
      } else {
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onEnd);
      }
    };
    this.button.addEventListener('mousedown', onStart);
    this.button.addEventListener('touchstart', onStart, { passive: false });
  }

  // eslint-disable-next-line class-methods-use-this
  navHeight() {
    const header = document.querySelector('header .nav-wrapper, header nav, header');
    return (header && header.clientHeight) || DRAG.navFallback;
  }

  repositionMenu() {
    const gap = 8;
    const nav = window.scrollY <= this.navHeight() ? this.navHeight() - window.scrollY : 0;
    const { bottom } = this.root.getBoundingClientRect();
    const above = bottom - nav - this.button.clientHeight - gap - DRAG.topNavGap;
    const below = window.innerHeight - bottom - 2 * gap;
    this.dropdown.style.setProperty('--max-height', 'auto');
    if (above > this.dropdown.scrollHeight) {
      this.dropdown.classList.remove('bmw-sidebar-dropdown-reversed');
    } else if (above >= below) {
      this.dropdown.classList.remove('bmw-sidebar-dropdown-reversed');
      this.dropdown.style.setProperty('--max-height', `${above}px`);
    } else {
      this.dropdown.classList.add('bmw-sidebar-dropdown-reversed');
      this.dropdown.style.setProperty('--max-height', `${below}px`);
    }
  }

  keepInView() {
    const rect = this.button.getBoundingClientRect();
    const min = this.minBottom();
    if (rect.y < this.navHeight() + DRAG.topNavGap) {
      this.setBottom(window.innerHeight - min - this.navHeight() - DRAG.topNavGap);
    } else if (window.innerHeight - rect.bottom < min) {
      this.setBottom(min);
    }
  }

  /* ---- nudge ---- */

  nudgeVariant() { return this.mobileMq.matches ? 'mobile' : 'desktop'; }

  repositionNudge() {
    if (!this.nudge || this.nudge.el.classList.contains('hidden') || this.nudgeVariant() !== 'desktop') return;
    const limit = window.innerHeight - (this.nudge.el.offsetHeight + 110);
    this.nudge.el.classList.toggle('bmw-sidebar-nudge-reversed', (this.position || this.minBottom()) > limit);
  }

  async showNudge() {
    const { nudge } = this;
    if (!nudge || getCookie('nudgeAcknowledged') || getCookie('nudgeDisplayed') || this.isOpen()) return;
    const variant = this.nudgeVariant();
    nudge.el.dataset.variant = variant;
    nudge.setCopy(variant === 'mobile');
    nudge.link.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.resetPulse();
      this.hideNudge(true).then(() => this.nudgeAction());
    };
    nudge.close.onclick = (e) => {
      e.stopPropagation();
      this.hideNudge(true).then(() => this.button.focus({ preventScroll: true }));
      this.resetPulse();
    };
    const autoHide = () => {
      if (nudge.el.contains(document.activeElement)) {
        const onOut = (ev) => {
          if (!nudge.el.contains(ev.relatedTarget)) {
            nudge.el.removeEventListener('focusout', onOut);
            this.hideNudge(false);
          }
        };
        nudge.el.addEventListener('focusout', onOut);
      } else {
        this.hideNudge(false);
      }
    };
    if (variant === 'desktop') {
      nudge.el.classList.remove('hidden', 'fadeout');
      nudge.el.classList.add('fadein');
      this.repositionNudge();
      await waitAnimation(nudge.el, 'bmw-sidebar-effect-grow');
      this.nudgeTimer = setTimeout(autoHide, TIMING.nudgeAutoHide);
      return;
    }
    // mobile: the nudge grows out of the button
    nudge.close.classList.add('hidden');
    nudge.mask.classList.remove('hidden');
    nudge.mask.classList.add('show');
    nudge.el.classList.remove('hidden', 'is-collapsing', 'is-expanding');
    const start = nudge.el.getBoundingClientRect();
    nudge.el.style.width = 'max-content';
    nudge.el.style.height = 'auto';
    const full = nudge.el.getBoundingClientRect();
    nudge.el.style.width = '';
    nudge.el.style.height = '';
    nudge.el.style.setProperty('--bmw-sidebar-nudge-width-grow', `${Math.max(0, Math.ceil(full.width - start.width))}px`);
    nudge.el.style.setProperty('--bmw-sidebar-nudge-height-grow', `${Math.max(0, Math.ceil(full.height - start.height))}px`);
    nudge.el.classList.add('is-expanding');
    await waitAnimation(nudge.el, 'bmw-sidebar-expand-width');
    nudge.mask.classList.remove('show');
    nudge.mask.classList.add('hidden');
    nudge.close.classList.remove('hidden');
    requestAnimationFrame(() => nudge.close.classList.add('show'));
    await waitAnimation(nudge.el, 'bmw-sidebar-expand-height', 2500);
    const cs = getComputedStyle(nudge.el);
    nudge.el.style.width = cs.width;
    nudge.el.style.height = cs.height;
    nudge.el.style.borderRadius = cs.borderRadius;
    this.nudgeTimer = setTimeout(autoHide, TIMING.nudgeAutoHideMobile);
  }

  async hideNudge(acknowledged) {
    const { nudge } = this;
    if (!nudge || nudge.el.classList.contains('hidden')) return;
    clearTimeout(this.nudgeTimer);
    if (acknowledged) setCookie('nudgeAcknowledged', true, 14 * DAY);
    else setCookie('nudgeDisplayed', true);
    if (nudge.el.dataset.variant === 'mobile') {
      nudge.el.classList.remove('is-expanding');
      nudge.el.classList.add('is-collapsing');
      nudge.close.classList.remove('show');
      nudge.mask.classList.remove('hidden');
      requestAnimationFrame(() => nudge.mask.classList.add('show'));
      await waitAnimation(nudge.el, 'bmw-sidebar-collapse-width', 2500);
      nudge.el.style.width = '';
      nudge.el.style.height = '';
      nudge.el.style.borderRadius = '';
      nudge.el.classList.remove('is-collapsing');
      nudge.el.classList.add('hidden');
      nudge.close.classList.remove('hidden');
      nudge.mask.classList.add('hidden');
      return;
    }
    nudge.el.classList.add('fadeout');
    await new Promise((r) => { setTimeout(r, 900); });
    nudge.el.classList.remove('fadein');
    nudge.el.classList.add('hidden');
  }

  nudgeAction() {
    const target = (this.config.nudge && this.config.nudge.target) || 'ai-assistant';
    const item = this.items.find((i) => i.config.type === target && i.isAvailable());
    if (item && item.openChat) item.openChat();
    else if (item) item.element.click();
    else this.toggle(true);
  }

  /* ---- init ---- */

  async init() {
    this.build();
    await this.initItems();
    if (!this.availableItems().length) {
      this.root.remove();
      return;
    }
    this.button.addEventListener('keydown', (e) => this.onKeydown(e));
    this.root.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen()) this.toggle(false);
    });
    this.root.addEventListener('focusout', (e) => {
      const to = e.relatedTarget;
      if (this.isOpen() && to && !this.root.contains(to)) this.toggle(false);
    });
    document.addEventListener('click', (e) => {
      if (this.isOpen() && !this.root.contains(e.target)) this.toggle(false);
    });
    this.bindDrag();
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        this.keepInView();
        this.repositionMenu();
        this.repositionNudge();
      }, 500);
    });
    window.addEventListener('scrollend', () => {
      this.keepInView();
      this.repositionMenu();
    });
    window.addEventListener(EVENTS.CHAT_READY, () => {
      removeCookie('chatMinimized');
      this.toggle(false);
      this.updateIndices();
      this.resetPulse();
    });
    window.addEventListener(EVENTS.CHAT_RETURN, () => {
      removeCookie('chatMinimized');
      this.toggle(true);
    });
    window.addEventListener(EVENTS.CHAT_MINIMIZE, ({ detail }) => {
      const appId = detail && detail.appId;
      if (appId && !(window.ssb && window.ssb[appId] && window.ssb[appId].skipMinimize)) {
        setCookie('chatMinimized', appId, 12 * HOUR);
      }
      if (appId && window.ssb && window.ssb[appId]) delete window.ssb[appId].skipMinimize;
    });
    window.addEventListener(EVENTS.CHAT_CLOSE, () => removeCookie('chatMinimized'));
    window.addEventListener(EVENTS.CHAT_OPEN_AICHAT, () => {
      const ai = this.items.find((i) => i instanceof AiItem);
      if (ai) ai.openChat();
    });

    this.root.classList.add('is-ready');
    this.repositionMenu();
    if (!this.reducedMotion) this.schedulePulse(true);
    else this.button.classList.remove('pulsing-double');
    if (this.nudge) setTimeout(() => this.showNudge(), TIMING.nudgeDelay);
  }
}

let started;

/** Opens the AI assistant (used by the ai-entry block). */
export async function openAiAssistant(userMessage) {
  await started;
  if (window.ssb && window.ssb.ckmChat && window.ssb.ckmChat.open) {
    window.ssb.ckmChat.open(userMessage ? { userMessage } : {});
  }
}

/** Opens the live chat (used by the flexbox live chat tile). */
export async function openLiveChat() {
  await started;
  if (window.ssb && window.ssb.gcChat && window.ssb.gcChat.open) window.ssb.gcChat.open();
}

/**
 * Starts the help sidebar (idempotent).
 * @returns {Promise<void>}
 */
export default function loadSidebar() {
  if (!started) {
    started = (async () => {
      if (document.querySelector('.bmw-sidebar')) return;
      const [config] = await Promise.all([loadConfig(), loadCss()]);
      loadConsent();
      await new Sidebar(config).init();
    })().catch(() => {});
  }
  return started;
}
