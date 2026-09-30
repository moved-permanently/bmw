const COUNTRY_CODES = ['de', 'fr', 'at', 'be', 'gb', 'us', 'ch', 'it', 'es', 'nl', 'ca', 'au', 'cn', 'jp', 'pl', 'se', 'no', 'dk', 'fi', 'pt', 'za'];
const plural = { brand: 'brands', family: 'families', model: 'models' };

export function countryForContext(context = {}) {
  const country = String(context.country || '').toLowerCase();
  if (COUNTRY_CODES.includes(country)) return country;
  let path = context.path || '';
  try { path = new URL(path, 'https://example.invalid').pathname; } catch { return ''; }
  const parts = path.toLowerCase().split('/').filter(Boolean);
  const isAida = parts[0] === 'aida';
  if (isAida) parts.shift();
  if (isAida && parts[0] === 'showcase') parts.shift();
  const locale = parts[0]?.match(/^[a-z]{2}[-_]([a-z]{2})$/);
  if (locale && COUNTRY_CODES.includes(locale[1])) return locale[1];
  if (COUNTRY_CODES.includes(parts[1])) return parts[1];
  if (isAida) return '';
  return COUNTRY_CODES.includes(parts[0]) ? parts[0] : '';
}

export function assetContextMessage(context = {}) {
  const country = countryForContext(context);
  if (country) {
    const name = new Intl.DisplayNames(['en'], { type: 'region' }).of(country.toUpperCase());
    return `${name} preselected from this document. Unlocalized images are included.`;
  }
  let path;
  try { path = new URL(context.path || '', 'https://example.invalid').pathname; } catch { path = ''; }
  const language = path.match(/^\/aida\/(?:showcase\/)?(en|de|fr)(?:\/|$)/)?.[1];
  if (language) {
    const name = new Intl.DisplayNames(['en'], { type: 'language' }).of(language);
    return `${name} source document. Choose the target country; unlocalized images are included.`;
  }
  return 'Choose a country for this document; unlocalized images are included.';
}

export function filterAssets(assets, filters = {}) {
  const words = String(filters.search || '').toLowerCase().trim().split(/\s+/)
    .filter(Boolean);
  return assets.filter((asset) => {
    if (filters.kind && asset.kind !== filters.kind) return false;
    if (filters.country && asset.countries?.length
        && !asset.countries.includes(filters.country)) return false;
    if (Object.entries(plural).some(([key, field]) => filters[key]
        && !asset[field]?.includes(filters[key]))) return false;
    const text = [asset.title, asset.id, ...(asset.brands || []),
      ...(asset.families || []), ...(asset.models || [])].join(' ').toLowerCase();
    return words.every((word) => text.includes(word));
  });
}

export function facetValues(assets, filters, key) {
  const relevant = filterAssets(assets, { ...filters, [key]: '' });
  return [...new Set(relevant.flatMap((asset) => asset[plural[key]] || []))]
    .sort((a, b) => a.localeCompare(b, 'en', { numeric: true }));
}

export function cropRegion(width, height, ratio, position = 'center') {
  const values = String(ratio).match(/^(\d+):(\d+)$/);
  if (!values || !(width > 0 && height > 0
      && Number(values[1]) > 0 && Number(values[2]) > 0)) return null;
  const target = Number(values[1]) / Number(values[2]);
  const source = width / height;
  const w = Math.min(1, target / source);
  const h = Math.min(1, source / target);
  const anchors = {
    center: [0.5, 0.5], left: [0, 0.5], right: [1, 0.5], top: [0.5, 0], bottom: [0.5, 1],
  };
  const [x, y] = anchors[position] || anchors.center;
  return [(1 - w) * x, (1 - h) * y, w, h];
}

function supportedUrl(src) {
  try {
    const url = new URL(src);
    if (url.protocol !== 'https:' || url.username || url.password) return false;
    return (url.hostname === 'bmw.scene7.com' && url.pathname.startsWith('/is/image/BMW/'))
      || (url.hostname === 'prod.cosy.bmw.cloud' && url.pathname === '/bmwweb/cosySec');
  } catch { return false; }
}

function setParam(src, key, value) {
  const hashIndex = src.indexOf('#');
  const hash = hashIndex >= 0 ? src.slice(hashIndex) : '';
  const full = hashIndex >= 0 ? src.slice(0, hashIndex) : src;
  const queryIndex = full.indexOf('?');
  const base = queryIndex >= 0 ? full.slice(0, queryIndex) : full;
  const query = queryIndex >= 0 ? full.slice(queryIndex + 1) : '';
  const pairs = query.split('&').filter((part) => part && part.split('=')[0] !== key);
  if (value !== undefined && value !== null) pairs.push(`${key}=${value}`);
  return `${base}${pairs.length ? `?${pairs.join('&')}` : ''}${hash}`;
}

function validRegion(region) {
  return Array.isArray(region) && region.length === 4
    && region.every((n) => Number.isFinite(n) && n >= 0 && n <= 1)
    && region[2] > 0 && region[3] > 0
    && region[0] + region[2] <= 1.000001 && region[1] + region[3] <= 1.000001;
}

export function scene7Url(asset, options = {}) {
  let src = asset.url;
  if (!supportedUrl(src)) throw new Error('Unsupported asset URL');
  if (asset.kind === 'cosy') return src;
  if (options.crop) {
    src = asset.crops?.[options.crop];
    if (!src || !supportedUrl(src)) throw new Error('That smart crop is not in the catalogue');
  }
  if (/:[0-9]+to[0-9]+$/.test(new URL(src).pathname)) src = setParam(src, 'fit', 'constrain,1');
  if (options.region !== undefined) {
    let { region } = options;
    if (!validRegion(region)) throw new Error('Invalid crop region');
    const existing = new URL(src).searchParams.get('cropN');
    if (existing) {
      const bounds = existing.split(',').map(Number);
      if (!validRegion(bounds)) throw new Error('Invalid existing crop region');
      region = [bounds[0] + bounds[2] * region[0], bounds[1] + bounds[3] * region[1],
        bounds[2] * region[2], bounds[3] * region[3]];
    }
    src = setParam(src, 'cropN', region.map((n) => Number(n.toFixed(8))).join(','));
  }
  if (options.sharpen !== undefined) {
    if (typeof options.sharpen !== 'boolean') throw new Error('Invalid sharpen option');
    src = setParam(src, 'op_sharpen', options.sharpen ? '1' : null);
  }
  if (options.width !== undefined) {
    if (!Number.isFinite(options.width) || options.width <= 0) throw new Error('Invalid width');
    src = setParam(src, 'wid', Math.max(1, Math.min(2000, Math.round(options.width))));
    src = setParam(src, 'fmt', 'webp');
  }
  return src;
}

const escape = (value) => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

export function assetLink(asset, url, alt, decorative = false) {
  if (!supportedUrl(asset.url) || !supportedUrl(url)) throw new Error('Unsupported asset URL');
  if (!decorative && !String(alt || '').trim()) throw new Error('Add alt text or mark the image decorative');
  return `<p><a href="${escape(url)}">${escape(decorative ? 'Image without alt text' : alt.trim())}</a></p>`;
}
