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

export function bindingHref(market, key) {
  return `/aida/data/wdh-${market}.json#${key}`;
}

export function marketForPath(path) {
  const m = (path || '').match(/^(?:\/aida)?\/([a-z]{2})(?:\/([a-z]{2}))?(?=\/|$)/);
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

export function valuesFromSheet(sheet) {
  const rows = Array.isArray(sheet?.values) ? sheet.values : sheet?.values?.data || [];
  return new Map(rows.map((r) => [r.key, {
    ...r,
    display: r.unit ? `${r.value} ${r.unit}` : r.value,
  }]));
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
    return `<a${before}href="${bindingHref(market, binding.key)}"${after}>${escape(current.display)}</a>`;
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
