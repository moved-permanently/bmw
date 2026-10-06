/*
 * WDH value bindings. A tech value in a document is a link to its market sheet row, e.g.
 * <a href="/aida/data/wdh-fr.json#61HG.electricRange">518–627 km</a>: the link text is the
 * formatted value (so HTML, .md and crawlers see real values), the href is its source.
 * Pure string functions (no DOM): shared by the page runtime, the editor plugins and the CLI.
 */

export const WDH_MARKETS = ['de', 'fr'];

// language folder -> default market; locale folders per language
const LANGUAGES = {
  en: { market: 'de', locales: [] },
  de: { market: 'de', locales: ['de', 'at'] },
  fr: { market: 'fr', locales: ['fr', 'be'] },
};

const BINDING_RE = /\/data\/wdh-([a-z]{2})\.json#([A-Za-z0-9]+)\.([A-Za-z0-9]+)$/;

// BMW RfP III wording where supplied; concise UI descriptions for the remaining fields.
const VALUE_LABELS = {
  name: ['Model', 'Modell', 'Modèle'],
  electricRange: ['Max. range (WLTP)', 'Max. Reichweite (WLTP)', 'Autonomie maximale (WLTP)'],
  electricConsumption: ['Combined electric power consumption (WLTP)', 'Energieverbrauch elektrisch, kombiniert (WLTP)', 'Consommation électrique combinée (WLTP)'],
  co2: ['Combined CO₂ emissions (WLTP)', 'CO₂-Emissionen kombiniert (WLTP)', 'Émissions de CO₂ combinées (WLTP)'],
  co2Class: ['CO₂ class', 'CO₂-Klasse', 'Classe de CO₂'],
  acceleration: ['Acceleration, 0–100 km/h', 'Beschleunigung, 0–100 km/h', 'Accélération, 0–100 km/h'],
  additionalRangeDC: ['Range (WLTP) after 10 minutes of DC charging', 'Reichweite (WLTP) nach 10 Minuten DC-Laden', 'Autonomie (WLTP) après 10 minutes de recharge CC'],
  power: ['Power', 'Leistung', 'Puissance'],
  fromPrice: ['Starting price', 'Preis ab', 'Prix à partir de'],
  leasePrice: ['Monthly lease price', 'Monatliche Leasingrate', 'Loyer mensuel'],
  drivingAssistantSpeed: ['Driving Assistant Professional — speed limit', 'Driving Assistant Professional — Geschwindigkeitsgrenze', 'Driving Assistant Professional — limite de vitesse'],
  highwayAssistantSpeed: ['BMW Highway Assistant — speed limit', 'BMW Autobahnassistent — Geschwindigkeitsgrenze', 'BMW Highway Assistant — limite de vitesse'],
  topSpeed: ['Top speed', 'Höchstgeschwindigkeit', 'Vitesse maximale'],
  batteryCapacity: ['Battery capacity', 'Batteriekapazität', 'Capacité de la batterie'],
  dcCharge10to80: ['DC charging, 10–80 %', 'DC-Laden, 10–80 %', 'Recharge CC, 10–80 %'],
  wltp: ['Full WLTP statement', 'Vollständige WLTP-Angabe', 'Mention WLTP complète'],
};
const SOURCE_LABELS = {
  'supplied-wdh': ['WDH export', 'WDH-Export', 'Export WDH'],
  'external-wdh': ['WDH export', 'WDH-Export', 'Export WDH'],
  'brief-fixture': ['Demo fixture', 'Demo-Datensatz', 'Données de démonstration'],
  'derived-demo-wltp-statement': ['Derived WLTP statement', 'Abgeleitete WLTP-Angabe', 'Mention WLTP dérivée'],
};
const UNKNOWN_SOURCE = ['Source not specified', 'Quelle nicht angegeben', 'Source non précisée'];

export function parseBinding(href) {
  if (!href) return null;
  let path = href;
  try {
    const url = new URL(href, 'https://x.invalid');
    path = `${url.pathname}${url.hash}`;
  } catch (e) {
    return null;
  }
  const m = path.match(BINDING_RE);
  if (!m) return null;
  return {
    market: m[1], key: `${m[2]}.${m[3]}`, code: m[2], field: m[3],
  };
}

export function dataRootForPath(path) {
  return (path || '').startsWith('/aida/showcase/') ? '/aida/showcase/data' : '/aida/data';
}

export function bindingHref(market, key, root = '/aida/data') {
  return `${root}/wdh-${market}.json#${key}`;
}

export function marketForPath(path) {
  const m = (path || '').replace(/^\/aida\/showcase(?=\/)/, '/aida').match(/^(?:\/aida)?\/([a-z]{2})(?:\/([a-z]{2}))?(?=\/|$)/);
  if (!m || !LANGUAGES[m[1]]) return null;
  const [, lang, second] = m;
  const locale = LANGUAGES[lang].locales.includes(second) ? second : null;
  const available = locale && WDH_MARKETS.includes(locale);
  return {
    lang,
    locale,
    market: available ? locale : LANGUAGES[lang].market,
    fallback: Boolean(locale && !available),
  };
}

export function valuesFromSheet(sheet, lang = 'en') {
  const rows = Array.isArray(sheet?.values) ? sheet.values : sheet?.values?.data || [];
  const language = Math.max(0, ['en', 'de', 'fr'].indexOf(lang));
  return new Map(rows.map((r) => {
    const field = (typeof r.field === 'string' && r.field.trim()) || r.key?.split('.')[1] || '';
    const labels = Object.hasOwn(VALUE_LABELS, field) ? VALUE_LABELS[field] : null;
    const supplied = typeof r.label === 'string' ? r.label.trim() : '';
    const readable = field.replace(/([a-z\d])([A-Z])/g, (all, before, after) => `${before} ${after.toLowerCase()}`)
      .replace(/[_-]+/g, ' ').trim();
    const source = Object.hasOwn(SOURCE_LABELS, r.sourceKind)
      ? SOURCE_LABELS[r.sourceKind] : UNKNOWN_SOURCE;
    return [r.key, {
      ...r,
      label: labels?.[language] || supplied || readable.replace(/^./, (c) => c.toUpperCase()) || r.key?.trim() || 'Unknown property',
      sourceLabel: source[language],
      display: r.unit ? `${r.value} ${r.unit}` : r.value,
    }];
  }));
}

const ENTITIES = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
};

export function textOf(html) {
  return (html || '')
    .replace(/<[^>]*>/g, '')
    .replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (all, ent) => {
      if (ent[0] !== '#') return ENTITIES[ent.toLowerCase()] ?? all;
      const code = ent[1].toLowerCase() === 'x' ? parseInt(ent.slice(2), 16) : Number(ent.slice(1));
      return String.fromCodePoint(code);
    })
    .replace(/[\s\u00a0]+/g, ' ')
    .trim();
}

const escape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const ANCHOR_RE = /<a\b([^>]*?)\bhref="([^"]*)"([^>]*)>([\s\S]*?)<\/a>/g;

export function findBindings(html) {
  return [...(html || '').matchAll(ANCHOR_RE)]
    .map(([, , href, , inner]) => {
      const binding = parseBinding(href);
      return binding && { href, ...binding, text: textOf(inner) };
    })
    .filter(Boolean);
}

export function syncBindings(html, market, values) {
  const changes = [];
  const unknown = [];
  const out = html.replace(ANCHOR_RE, (all, before, href, after, inner) => {
    const binding = parseBinding(href);
    if (!binding) return all;
    const current = values.get(binding.key);
    if (!current) {
      unknown.push(binding.key);
      return all;
    }
    const text = textOf(inner);
    if (text === current.display && binding.market === market) return all;
    changes.push({
      key: binding.key, from: text, to: current.display, fromMarket: binding.market,
    });
    return `<a${before}href="${bindingHref(market, binding.key, href.includes('/aida/showcase/data/') ? '/aida/showcase/data' : '/aida/data')}"${after}>${escape(current.display)}</a>`;
  });
  return { html: out, changes, unknown };
}

const MIN_INLINE = 8;

export function autoBind(html, market, values, code) {
  const candidates = [...values.entries()]
    .filter(([key]) => key.startsWith(`${code}.`))
    .map(([key, v]) => ({ key, text: escape(v.display) }))
    .sort((a, b) => b.text.length - a.text.length);
  const anchor = (c) => `<a href="${bindingHref(market, c.key)}">${c.text}</a>`;
  const bound = [];

  const bindText = (text) => {
    const trimmed = text.trim();
    const whole = candidates.find((c) => c.text === trimmed);
    if (whole) {
      bound.push({ key: whole.key, text: whole.text });
      return text.replace(trimmed, anchor(whole));
    }
    const inline = candidates.filter((c) => c.text.length >= MIN_INLINE);
    const nextHit = (rest) => inline.reduce((hit, c) => {
      const idx = rest.indexOf(c.text);
      return idx >= 0 && (!hit || idx < hit.idx) ? { ...c, idx } : hit;
    }, null);
    let out = '';
    let rest = text;
    let hit = nextHit(rest);
    while (hit) {
      bound.push({ key: hit.key, text: hit.text });
      out += rest.slice(0, hit.idx) + anchor(hit);
      rest = rest.slice(hit.idx + hit.text.length);
      hit = nextHit(rest);
    }
    return out + rest;
  };

  let depth = 0;
  const out = html.split(/(<[^>]+>)/).map((part) => {
    if (part.startsWith('<')) {
      if (/^<a\b/i.test(part)) depth += 1;
      else if (/^<\/a>/i.test(part)) depth -= 1;
      return part;
    }
    return depth > 0 || !part.trim() ? part : bindText(part);
  }).join('');
  return { html: out, bound };
}

export function staleBindings(bindings, market, values) {
  return bindings.map(({
    href, key, text, ...binding
  }) => {
    const current = values.get(key);
    let reason = null;
    if (!current) reason = 'unknown';
    else if (text !== current.display) reason = 'value';
    else if (binding.market !== market) reason = 'market';
    return reason && {
      href, key, text, expected: current ? current.display : null, reason,
    };
  }).filter(Boolean);
}

/**
 * WDH bindings of the current page render. Experience Workspace quick edit replaces the body and
 * calls loadPage again: start() begins a fresh collection, and a check started for an earlier
 * render can tell that it was superseded (isCurrent).
 */
export function createWdhSession() {
  let generation = 0;
  let bindings = [];
  return {
    start() {
      generation += 1;
      bindings = [];
      return generation;
    },
    add(binding) {
      bindings.push(binding);
    },
    get bindings() {
      return bindings;
    },
    get generation() {
      return generation;
    },
    isCurrent(value) {
      return value === generation;
    },
  };
}
