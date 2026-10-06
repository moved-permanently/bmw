/*
 * Append-only changes to a DA config (multi-sheet JSON as returned by admin.da.live/config):
 * existing rows and sheets stay as they are, rows are added at the end of a sheet with the sheet's
 * columns, re-running is a no-op and a different row under an existing key is reported as a
 * conflict instead of being overwritten. No network access.
 */

const clone = (value) => JSON.parse(JSON.stringify(value));

/**
 * @param {object} config DA multi-sheet config
 * @param {string} sheet sheet name (created when missing)
 * @param {string} key column that identifies a row (e.g. title, key)
 * @param {object[]} rows rows to append
 * @returns {{config: object, added: string[], conflicts: string[]}}
 */
export function appendRows(config, sheet, key, rows) {
  const out = clone(config);
  const added = [];
  const conflicts = [];
  if (!out[sheet]) {
    out[sheet] = {
      total: 0, limit: 0, offset: 0, data: [],
    };
    out[':names'] = [...(out[':names'] || []), sheet];
  }
  const target = out[sheet];
  const columns = target.data.length ? Object.keys(target.data[0]) : [];
  rows.forEach((row) => {
    const existing = target.data.find((r) => r[key] === row[key]);
    const filled = columns.length
      ? Object.fromEntries([...new Set([...columns, ...Object.keys(row)])].map((c) => [c, row[c] ?? '']))
      : { ...row };
    if (existing) {
      const same = Object.keys(filled).every((c) => (existing[c] ?? '') === filled[c]);
      if (!same) conflicts.push(row[key]);
      return;
    }
    target.data.push(filled);
    added.push(row[key]);
  });
  target.total = target.data.length;
  target.limit = target.data.length;
  return { config: added.length ? out : clone(config), added, conflicts };
}

/**
 * Several appendRows steps: [{sheet, key, rows}] -> {config, added: {sheet: []}, conflicts: {}}.
 */
export function planConfig(config, steps) {
  const added = {};
  const conflicts = {};
  const result = steps.reduce((current, { sheet, key, rows }) => {
    const step = appendRows(current, sheet, key, rows);
    added[sheet] = [...(added[sheet] || []), ...step.added];
    conflicts[sheet] = [...(conflicts[sheet] || []), ...step.conflicts];
    return step.config;
  }, config);
  return { config: result, added, conflicts };
}

/**
 * Updates rows this task owns (same key) in place; other rows and sheets stay as they are.
 * Identical rows are a no-op; keys not found are reported, never appended.
 * @returns {{config: object, replaced: string[], missing: string[]}}
 */
export function replaceOwnedRows(config, sheet, key, rows) {
  const out = clone(config);
  const replaced = [];
  const missing = [];
  const data = out[sheet]?.data || [];
  rows.forEach((row) => {
    const i = data.findIndex((r) => r[key] === row[key]);
    if (i < 0) {
      missing.push(row[key]);
      return;
    }
    const next = { ...data[i], ...row };
    if (JSON.stringify(next) !== JSON.stringify(data[i])) {
      data[i] = next;
      replaced.push(row[key]);
    }
  });
  return { config: replaced.length ? out : clone(config), replaced, missing };
}
