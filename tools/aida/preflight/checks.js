/*
 * Governance checks for a document (DA source HTML): deterministic rules, no model involved.
 * Used by the Preflight plugin (preflight.js); pure functions, covered by tests.
 */
import {
  findBindings, staleBindings, autoBind, textOf, parseBinding,
} from '../../../scripts/aida-wdh.js';
import { getMetadata } from '../../../scripts/aida-doc.js';

const LEGAL_FIELDS = ['electricRange', 'electricConsumption', 'fuelConsumption'];
const CONSUMPTION_TEXT = /\d\s*(kWh|l)\/100\s*km/;
const list = (s) => (s || '').split(',').map((t) => t.trim()).filter(Boolean);
const reEscape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const status = (details, level) => (details.length ? level : 'pass');

// one line per distinct value; same text from another market's sheet is named as such
function describeStale(stale, market) {
  const groups = new Map();
  stale.forEach((s) => {
    const id = `${s.key}|${s.text}|${s.expected}|${s.reason}`;
    const group = groups.get(id) || { ...s, count: 0 };
    group.count += 1;
    groups.set(id, group);
  });
  return [...groups.values()].map((g) => {
    const label = g.count > 1 ? `${g.key} (${g.count}×)` : g.key;
    if (g.reason === 'market') {
      const from = parseBinding(g.href)?.market?.toUpperCase() || 'other';
      return `${label}: "${g.text}" is ${from} data, ${market.toUpperCase()} has the same text`;
    }
    return `${label}: "${g.text}" → "${g.expected ?? 'not in WDH'}"`;
  });
}

function wdhCheck(html, market, values) {
  const stale = staleBindings(findBindings(html), market, values);
  if (stale.length) {
    return {
      status: 'fail',
      summary: `${stale.length} values differ from WDH (${market.toUpperCase()})`,
      details: describeStale(stale, market),
      fixable: stale.filter((s) => s.expected).length,
    };
  }
  const code = getMetadata(html, 'wdh-model');
  const unbound = code ? autoBind(html, market, values, code).bound : [];
  if (unbound.length) {
    return {
      status: 'warn',
      summary: `${unbound.length} hard-coded values of ${code} could be bound to WDH`,
      details: unbound.map((b) => `${b.key}: "${b.text}"`),
    };
  }
  return { status: 'pass', summary: 'All tech values match WDH', details: [] };
}

function wltpCheck(html) {
  const bindings = findBindings(html);
  const showsValues = bindings.some((b) => LEGAL_FIELDS.includes(b.field))
    || CONSUMPTION_TEXT.test(textOf(html));
  const hasStatement = bindings.some((b) => b.field === 'wltp');
  const ok = !showsValues || hasStatement;
  return {
    status: ok ? 'pass' : 'fail',
    summary: ok ? 'WLTP statement present where required' : 'Range or consumption shown without the WLTP statement',
    details: ok ? [] : ['Insert the model\'s WLTP statement (WDH value "wltp") on this page'],
  };
}

function featuresCheck(text, market, features) {
  const lower = text.toLowerCase();
  const details = features
    .filter((f) => (f[market] || '').toLowerCase() === 'no')
    .filter((f) => list(f.terms).some((t) => lower.includes(t.toLowerCase())))
    .map((f) => `${f.feature} is mentioned but not available in ${market.toUpperCase()}`);
  return {
    status: status(details, 'fail'),
    summary: details.length ? 'Unavailable features mentioned' : 'Only features available in this market',
    details,
  };
}

function brandCheck(text, terms) {
  const details = terms.flatMap(({ term, variants }) => list(variants)
    .filter((v) => new RegExp(`(?<![\\p{L}\\d])${reEscape(v)}(?![\\p{L}\\d])`, 'u').test(text))
    .map((v) => `Write "${term}", not "${v}"`));
  return {
    status: status(details, 'warn'),
    summary: details.length ? 'Brand terms misspelled' : 'Brand terms spelled correctly',
    details,
  };
}

function seoCheck(html) {
  const details = [];
  if (!getMetadata(html, 'title')) details.push('No title in the metadata');
  const description = getMetadata(html, 'description') || '';
  if (description.length < 50 || description.length > 160) {
    details.push(`Description should have 50–160 characters (has ${description.length})`);
  }
  const h1 = (html.match(/<h1\b/g) || []).length;
  if (h1 !== 1) details.push(`Page should have exactly one h1 (has ${h1})`);
  return {
    status: status(details, 'warn'),
    summary: details.length ? 'SEO basics incomplete' : 'Title, description and h1 in place',
    details,
  };
}

/**
 * @param {{html: string, market: string, values: Map, features: object[], terms: object[]}} input
 * @returns {{id, title, status: 'pass'|'warn'|'fail', summary, details: string[], fixable?}[]}
 */
// eslint-disable-next-line import/prefer-default-export
export function runChecks({
  html, market, values, features, terms,
}) {
  const text = textOf(html);
  return [
    { id: 'wdh', title: 'WDH tech values', ...wdhCheck(html, market, values) },
    { id: 'wltp', title: 'WLTP statement', ...wltpCheck(html) },
    { id: 'features', title: 'Market availability', ...featuresCheck(text, market, features) },
    { id: 'brand', title: 'Brand terms', ...brandCheck(text, terms) },
    { id: 'seo', title: 'SEO basics', ...seoCheck(html) },
  ];
}
