/*
 * DA Structured Content records (da.live/form, adobe/da-sc-sdk wire format): the record page
 * holds a block named after the schema whose rows are "<h3>key</h3> | value" (<p> text or
 * <ul><li> list).
 * Pure functions (no DOM): shared by the schema blocks and tests.
 */

/**
 * Record fields from the rows of a schema block.
 * @param {{label: string, text: string, items: string[]}[]} rows
 * @returns {Object<string, string|string[]>}
 */
export function readRecord(rows) {
  const record = {};
  rows.forEach(({ label, text, items }) => {
    const key = (label || '').trim();
    if (!key) return;
    if (items && items.length) record[key] = items.map((i) => i.trim()).filter(Boolean);
    else if ((text || '').trim()) record[key] = text.trim();
  });
  return record;
}

/**
 * Tech values an offer shows, taken from the WDH market sheet at render time (records never store
 * values): the requested fields of the record's model, the fields the sheet does not have, the
 * WLTP statement and whether the model is in the market's WDH data at all.
 * @param {{modelCode?: string, wdhFields?: string[]}} record
 * @param {Map<string, {label: string, display: string}>} values valuesFromSheet(...) of the market
 */
export function offerFacts(record, values) {
  const code = record.modelCode || '';
  const fields = Array.isArray(record.wdhFields) ? record.wdhFields : [];
  const keys = fields.map((f) => `${code}.${f}`);
  const found = keys.filter((k) => values.has(k));
  const modelAvailable = [...values.keys()].some((k) => k.startsWith(`${code}.`));
  return {
    modelAvailable,
    model: values.get(`${code}.name`)?.display || '',
    values: modelAvailable ? found.map((key) => ({ key, ...values.get(key) })) : [],
    missing: modelAvailable ? keys.filter((k) => !values.has(k)) : keys,
    wltp: values.get(`${code}.wltp`) || null,
  };
}

/** Rows of a schema block element (DOM): [{label, text, items}]. */
export function blockRows(block) {
  return [...block.children].map((row) => {
    const [labelCell, valueCell] = row.children;
    return {
      label: labelCell?.textContent || '',
      text: valueCell?.textContent || '',
      items: valueCell ? [...valueCell.querySelectorAll('li')].map((li) => li.textContent) : [],
    };
  });
}

const DELIVERY = 'https://da-sc.adobeaem.workers.dev';
const TIERS = { page: 'preview', live: 'live' };

/** Snapshot review host (<snapshot>--<ref>--<site>--<org>.aem.reviews or <ref>--…aem.reviews). */
export function isSnapshotReview(location) {
  return /\.aem\.reviews$/.test(location.hostname);
}

/**
 * Official structured-content JSON delivery URL (adobe-rnd/da-sc) of a record for the current host:
 * <ref>--<site>--<org>.aem.page|live -> preview|live; other hosts -> preview of
 * moved-permanently/bmw. Not available in snapshot reviews: da-sc's review tier reads
 * main--<site>--<org>.aem.reviews, not the named (frozen) snapshot, so it would show other content.
 * @param {URL|Location} location the page location
 * @param {string} path site path of the record (e.g. /aida/structured/offers/x)
 */
export function deliveryUrl(location, path) {
  if (!/^\/[a-z0-9/_-]+$/i.test(path || '')) throw new Error(`invalid record path ${path}`);
  if (isSnapshotReview(location)) throw new Error('JSON delivery is not available in a snapshot review');
  const m = location.hostname.match(/^(?:[a-z0-9-]+--)?[a-z0-9-]+--([a-z0-9-]+)--([a-z0-9-]+)\.aem\.(page|live)$/);
  const [site, org, tier] = m ? [m[1], m[2], TIERS[m[3]]] : ['bmw', 'moved-permanently', 'preview'];
  return `${DELIVERY}/${tier}/${org}/${site}${path}`;
}

/**
 * Record fields from a delivery response ({ metadata: { schemaName }, data }).
 * @param {object} json
 * @param {string} schemaName expected schema
 */
export function recordFromDelivery(json, schemaName) {
  if (!json || json.error) throw new Error(`record not delivered: ${json?.error || 'empty'}`);
  if (json.metadata?.schemaName !== schemaName) throw new Error(`unexpected schema ${json.metadata?.schemaName}`);
  return { ...json.data };
}
