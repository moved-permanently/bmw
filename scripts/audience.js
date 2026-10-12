/**
 * Audience resolver for the generative home page (/de/home-gen).
 *
 * Picks one of five audiences from the first-page-view signals described in the
 * bmw.de "Audiences and Landing Page Redesign" report. The first matching rule wins.
 * Pure function of (URL, referrer, viewport, stored override): no network, no cookies.
 */

export const AUDIENCES = {
  navigator: {
    label: 'Brand navigator',
    share: '31% of entries',
    mobile: '39% mobile',
    today: 'Opens the main nav and goes to the model overview.',
    best: 'Decision entry points (electric, company car, available now, used, configure) into a filtered model hub.',
  },
  model: {
    label: 'Model researcher',
    share: '18% of entries',
    mobile: '64% mobile',
    today: 'Reads deep (7.8 images/videos), tries colours and drivetrains.',
    best: 'Price, monthly rate, delivery time and total cost, then configure, reserve or test drive.',
  },
  stock: {
    label: 'Specific-car shopper',
    share: '12% of entries',
    mobile: '75% mobile',
    today: 'Swipes the gallery; 40% leave without interacting.',
    best: 'Price, rate, availability and one sticky action, then reserve online or request an offer.',
  },
  owner: {
    label: 'Owner / service',
    share: '10% of entries',
    mobile: '64% mobile',
    today: 'Looks for one task; 28% leave without interacting.',
    best: 'Task-first pages: recall check, appointment, ConnectedDrive, My BMW.',
  },
  handraiser: {
    label: 'Hand-raiser',
    share: '4% of entries',
    mobile: '87% mobile',
    today: '14% start or submit the form; the test-drive form loses 44%.',
    best: 'Short mobile form with model and dealer prefilled, lead scored before routing.',
  },
};

export const DEFAULT_AUDIENCE = 'navigator';

const CLICK_IDS = ['gclid', 'gbraid', 'wbraid', 'msclkid', 'fbclid'];
const SEARCH_HOST = /(^|\.)(google|bing|duckduckgo|ecosia)\.[a-z.]+$|(^|\.)search\.yahoo\.com$/i;

const KEYWORDS = [
  ['owner', /service|rueckruf|rückruf|recall|connecteddrive|my[-_ ]?bmw|werkstatt|zubehoer|zubehör/i],
  ['handraiser', /angebot|probefahrt|testdrive|test-drive|anfrage|formular|rfo|tda/i],
  ['stock', /gebraucht|neuwagen|verfuegbar|verfügbar|lager|bestand|stock|sofort|premium[-_ ]?selection/i],
  ['model', /\b(ix[1-9]|i[3-9]|x[1-7]m?|[1-8]er|m[2-8]|z4|xm|neue[-_ ]klasse)\b/i],
];

function host(url) {
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return '';
  }
}

/**
 * @param {object} [env]
 * @param {URL} [env.url]
 * @param {string} [env.referrer]
 * @param {number} [env.width]
 * @param {string} [env.stored] audience kept for the session by the demo switcher
 * @returns {{audience: string, rule: string, why: string, signals: object}}
 */
export function resolveAudience({
  url = new URL(window.location.href),
  referrer = document.referrer,
  width = window.innerWidth,
} = {}) {
  const q = url.searchParams;
  const clickId = CLICK_IDS.find((k) => q.has(k)) || null;
  const utm = Object.fromEntries([...q.entries()].filter(([k]) => k.startsWith('utm_')));
  const refHost = host(referrer);
  const external = !!refHost && refHost !== url.hostname;
  const signals = {
    override: q.get('aud') || null,
    clickId,
    utmSource: utm.utm_source || null,
    utmMedium: utm.utm_medium || null,
    campaign: utm.utm_campaign || utm.utm_term || utm.utm_content || null,
    referrer: external ? refHost : null,
    device: width < 768 ? 'mobile' : 'desktop',
  };
  const result = (audience, rule, why) => ({ audience, rule, why, signals });

  // 0. Demo override
  if (signals.override && AUDIENCES[signals.override]) {
    return result(signals.override, 'demo-override', `?aud=${signals.override} in the URL`);
  }

  // 1. Paid click: the campaign or keyword says which page the ad was built for
  const paid = !!clickId || /^(cpc|ppc|paid|paidsocial|paid_social|display)$/i.test(signals.utmMedium || '');
  const meta = q.has('fbclid') || /^(ig|fb|facebook|instagram|meta)$/i.test(signals.utmSource || '');
  if (paid || meta) {
    const text = [signals.campaign, q.get('utm_term'), q.get('utm_content')].filter(Boolean).join(' ');
    const hit = KEYWORDS.find(([, re]) => re.test(text));
    if (hit) return result(hit[0], 'paid-keyword', `Paid click, campaign/keyword "${text.trim()}" matches ${hit[0]}`);
    if (meta) return result('stock', 'paid-meta', 'Meta ad (fbclid or Instagram/Facebook source): mostly single-vehicle landers');
    return result('navigator', 'paid-brand', 'Paid search click with no model or offer in the keyword: brand search');
  }

  // 2. Organic search
  if (external && SEARCH_HOST.test(refHost)) {
    return result('navigator', 'organic-search', `Referrer ${refHost} with no campaign tags`);
  }

  // 3. Everyone else (direct, other sites)
  return result('navigator', 'default', external ? `Referrer ${refHost}` : 'Direct visit, no campaign or referrer signals');
}

/**
 * Shows the sections authored for the matched audience and hides the others.
 * Sections opt in through a "Audience" row in their section-metadata block.
 * No-op on pages without audience sections.
 * @param {Element} main
 * @returns {object|null} the resolution, or null if the page has no audience sections
 */
export function applyAudience(main) {
  const sections = [...main.querySelectorAll('.section[data-audience]')];
  if (!sections.length) return null;
  const resolution = resolveAudience();
  sections.forEach((section) => {
    section.hidden = section.dataset.audience.toLowerCase() !== resolution.audience;
  });
  document.body.dataset.audience = resolution.audience;
  window.bmwAudience = resolution;
  return resolution;
}
