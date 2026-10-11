/*
 * Offer records picker model: the market-offer records the offer-teaser block links to, from the
 * DA folder listing and each record's da-form / market-offer block fields. No DOM.
 */

export const OFFERS = '/aida/structured/offers';

/** Record page paths (site paths, no extension) of a DA folder listing, sorted. */
export function offerPaths(listing) {
  if (!Array.isArray(listing)) return [];
  return listing
    .filter((item) => item.ext === 'html' && item.name)
    .map((item) => `${OFFERS}/${item.name}`)
    .sort();
}

/**
 * Picker entry of a record, or null when the record is not a market offer.
 * @param {string} path record page path
 * @param {Object} form fields of the da-form block (x-schema-name, title)
 * @param {Object} offer fields of the market-offer block
 */
export function offerEntry(path, form, offer) {
  if (form?.['x-schema-name'] !== 'market-offer') return null;
  return {
    path,
    title: form.title || offer?.headline || path.split('/').pop(),
    market: (offer?.market || '').toUpperCase(),
    headline: offer?.headline || '',
  };
}

/** The link the offer-teaser block reads: the record page path, the record title as text. */
export const offerLink = ({ path, title }) => ({ href: path, text: title });
