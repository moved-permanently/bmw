/*
 * Governance checks for a document (DA source HTML): deterministic rules, no model involved.
 * Used by the Preflight plugin (preflight.js); pure functions, covered by tests.
 */
import {
  findBindings, staleBindings, findUnboundValues, textOf, parseBinding, withoutMetadata,
} from '../../../scripts/aida-wdh.js';
import { getMetadata } from '../../../scripts/aida-doc.js';

const LEGAL_FIELDS = ['electricRange', 'electricConsumption', 'fuelConsumption'];
const CONSUMPTION_TEXT = /\d\s*(kWh|l)\/100\s*km/;
const FOOTNOTES = /<sup\b[^>]*>[\s\S]*?<\/sup>/gi;
const list = (s) => (s || '').split(',').map((t) => t.trim()).filter(Boolean);
const reEscape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const status = (details, level) => (details.length ? level : 'pass');

function countSame(items, id) {
  const groups = new Map();
  items.forEach((item) => {
    const group = groups.get(id(item)) || { ...item, count: 0 };
    group.count += 1;
    groups.set(id(item), group);
  });
  return [...groups.values()].map((g) => ({ ...g, label: g.count > 1 ? `${g.key} (${g.count}×)` : g.key }));
}

// one line per distinct value; same text from another market's sheet is named as such
function describeStale(stale, market) {
  return countSame(stale, (s) => `${s.key}|${s.text}|${s.expected}|${s.reason}`).map((g) => {
    if (g.reason === 'market') {
      const from = parseBinding(g.href)?.market?.toUpperCase() || 'other';
      return `${g.label}: "${g.text}" is ${from} data, ${market.toUpperCase()} has the same text`;
    }
    return `${g.label}: "${g.text}" → "${g.expected ?? 'not in WDH'}"`;
  });
}

// text of the page content (no metadata, no footnote markers), compared with sheet values
const contentText = (html) => textOf(withoutMetadata(html).replace(FOOTNOTES, ''));
const fieldValues = (values, field) => [...values.entries()]
  .filter(([key, v]) => key.endsWith(`.${field}`) && v.display);

function wdhCheck(html, market, values) {
  const bindings = findBindings(html);
  const stale = staleBindings(bindings, market, values);
  if (stale.length) {
    return {
      status: 'fail',
      summary: `${stale.length} values differ from WDH (${market.toUpperCase()})`,
      details: describeStale(stale, market),
      fixable: stale.filter((s) => s.expected).length,
    };
  }
  const unbound = findUnboundValues(html, market, values, getMetadata(html, 'wdh-model'));
  if (unbound.length) {
    const codes = [...new Set(unbound.map((binding) => binding.key.split('.')[0]))];
    return {
      status: 'warn',
      summary: `${unbound.length} hard-coded values of ${codes.join(', ')} could be bound to WDH`,
      details: countSame(unbound, (b) => `${b.key}|${b.text}`).map((g) => `${g.label}: "${g.text}"`),
    };
  }
  if (!bindings.length) return { status: 'pass', summary: 'No WDH-linked values on this page', details: [] };
  return { status: 'pass', summary: 'All tech values match WDH', details: [] };
}

function wltpCheck(html, values) {
  const bindings = findBindings(html);
  const showsValues = bindings.some((b) => LEGAL_FIELDS.includes(b.field))
    || CONSUMPTION_TEXT.test(textOf(html));
  if (!showsValues || bindings.some((b) => b.field === 'wltp')) {
    return { status: 'pass', summary: 'WLTP statement present where required', details: [] };
  }
  const text = contentText(html);
  if (fieldValues(values, 'wltp').some(([, v]) => text.includes(v.display))) {
    return {
      status: 'warn',
      summary: 'WLTP statement written as text, not linked to WDH',
      details: ['Replace it with the model\'s WLTP statement (WDH value "wltp") so it follows WDH updates'],
    };
  }
  return {
    status: 'fail',
    summary: 'Range or consumption shown without the WLTP statement',
    details: ['Insert the model\'s WLTP statement (WDH value "wltp") on this page'],
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
    { id: 'wltp', title: 'WLTP statement', ...wltpCheck(html, values) },
    { id: 'features', title: 'Market availability', ...featuresCheck(text, market, features) },
    { id: 'brand', title: 'Brand terms', ...brandCheck(text, terms) },
    { id: 'seo', title: 'SEO basics', ...seoCheck(html) },
  ];
}
