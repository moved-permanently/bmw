/*
 * BMW icon font names (icons.json, generated from the font by icons.py): search and the authored
 * ":name:" text that blocks with icon support render as a ligature glyph. No DOM.
 */

const words = (text) => text.toLowerCase().split(/[\s:_-]+/).filter(Boolean);

/** Names containing every typed word, in their original order. */
export function matchIcons(names, query = '') {
  const terms = words(query);
  return names.filter((name) => terms.every((term) => name.includes(term)));
}

export const iconText = (name) => `:${name}:`;

export const iconLabel = (name) => name.replace(/_/g, ' ');
