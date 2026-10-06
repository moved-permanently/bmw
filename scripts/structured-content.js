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
