/*
 * HTML reducers for `?extract=<name>`.
 *
 * compare: the model compare endpoint
 *   /de/bmw-modelle-vergleichen.html/{series}/{range}/{model}/{trans}/content.q
 * returns the full compare page (~700 KB incl. global navigation, footer, scripts).
 * `extract=compare` keeps only
 *   1. the compare component
 *      <div class="cmp-compare" data-component-path="compare-v1" data-config="...base64 JSON...">
 *      (selection dropdowns, cosy images, prices, accordion with compare tables, gallery tabs)
 *   2. the footnotes list     <ol class="cmp-compare__footnotes">
 * and wraps them in <div class="bmw-proxy-extract" data-extract="compare">, without HTML
 * comments and with whitespace runs collapsed (real capture: 698 KB -> ~365 KB before gzip).
 * The element end is found by counting nested <div>/<ol> tags (no DOM parser in the worker).
 * If the compare marker is missing the worker answers 502 {"error":"extract_failed"}.
 */

/**
 * Returns the outer HTML of the first element named `tag` whose start tag matches `startRe`,
 * by counting nested open/close tags of the same name. Returns '' if not found or unbalanced.
 * @param {string} html
 * @param {string} tag element name (div, ol, ...)
 * @param {RegExp} startRe regex matching the start tag (without g flag)
 * @returns {string}
 */
export function outerElement(html, tag, startRe) {
  const start = html.search(startRe);
  if (start < 0) return '';
  const re = new RegExp(`<(/?)${tag}(?=[\\s>/])[^>]*>`, 'gi');
  re.lastIndex = start;
  let depth = 0;
  let m = re.exec(html);
  while (m) {
    if (m[1]) depth -= 1;
    else if (!m[0].endsWith('/>')) depth += 1;
    if (depth === 0) return html.slice(start, m.index + m[0].length);
    m = re.exec(html);
  }
  return '';
}

/**
 * Drops HTML comments and collapses whitespace runs (the AEM markup is ~30 % indentation).
 * Safe for the compare markup, which contains no <pre>/<textarea>.
 */
export function squeeze(html) {
  return html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/[ \t\r]*\n\s*/g, '\n')
    .replace(/[ \t]{2,}/g, ' ');
}

export function extractCompare(html) {
  const compare = outerElement(html, 'div', /<div\b[^>]*\bclass="cmp-compare[\s"]/i);
  if (!compare) return null;
  const footnotes = outerElement(html, 'ol', /<ol\b[^>]*\bclass="cmp-compare__footnotes[\s"]/i);
  return squeeze(`<div class="bmw-proxy-extract" data-extract="compare">\n${compare}\n${footnotes}\n</div>\n`);
}

export const EXTRACTORS = {
  compare: extractCompare,
};
