import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const scene7Host = 'bmw.scene7.com';
const cosyHost = 'prod.cosy.bmw.cloud';
const scene7Prefix = '/is/image/BMW/';
const cosyPath = '/bmwweb/cosySec';
const countryCodes = new Set([
  'at', 'au', 'be', 'br', 'ca', 'ch', 'cn', 'cz', 'de', 'dk', 'es', 'fi', 'fr', 'gb', 'gr', 'hk',
  'hu', 'ie', 'in', 'it', 'jp', 'kr', 'lu', 'mx', 'nl', 'no', 'nz', 'pl', 'pt', 'ro', 'se', 'sg',
  'th', 'tr', 'tw', 'us', 'za',
]);
const rendererParams = new Set(['wid', 'width', 'hei', 'height', 'fmt', 'format', 'dpr', 'qlt', 'quality']);

const decodeEntities = (value = '') => value
  .replace(/&amp;/gi, '&')
  .replace(/&quot;/gi, '"')
  .replace(/&#(?:x([\da-f]+)|(\d+));/gi, (match, hex, decimal) => {
    const code = Number.parseInt(hex || decimal, hex ? 16 : 10);
    return Number.isNaN(code) ? match : String.fromCodePoint(code);
  })
  .replace(/&apos;|&#39;/gi, "'")
  .replace(/&lt;/gi, '<')
  .replace(/&gt;/gi, '>');

const textContent = (value = '') => decodeEntities(value.replace(/<[^>]*>/g, ' '))
  .replace(/\s+/g, ' ')
  .trim();

function attributes(markup = '') {
  const result = {};
  const matcher = /\b([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/g;
  let match = matcher.exec(markup);
  while (match) {
    result[match[1].toLowerCase()] = decodeEntities(match[2] ?? match[3] ?? match[4] ?? '');
    match = matcher.exec(markup);
  }
  return result;
}

function imageReferences(html = '') {
  const references = [];
  const matcher = /<a\b([^>]*)>([\s\S]*?)<\/a\s*>|<img\b([^>]*)>/gi;
  let match = matcher.exec(html);
  while (match) {
    const isAnchor = match[1] !== undefined;
    const attrs = attributes(isAnchor ? match[1] : match[3]);
    const rawURL = isAnchor ? attrs.href : attrs.src;
    if (rawURL) {
      references.push({
        url: rawURL,
        title: isAnchor ? textContent(match[2]) : textContent(attrs.alt || attrs.title),
      });
    }
    match = matcher.exec(html);
  }
  return references;
}

function withoutRendererParams(rawURL) {
  const [withoutFragment, fragment = ''] = rawURL.split('#', 2);
  const queryAt = withoutFragment.indexOf('?');
  if (queryAt < 0) return rawURL;
  const base = withoutFragment.slice(0, queryAt);
  const query = withoutFragment.slice(queryAt + 1)
    .split('&')
    .filter((part) => !rendererParams.has(part.split('=', 1)[0].toLowerCase()))
    .join('&');
  return `${base}${query ? `?${query}` : ''}${fragment ? `#${fragment}` : ''}`;
}

const semanticQuery = (rawURL) => withoutRendererParams(rawURL).split('?')[1]?.split('#')[0] || '';

function knownProvider(rawURL) {
  let url;
  try {
    url = new URL(rawURL);
  } catch {
    return null;
  }

  if (url.protocol !== 'https:') return null;
  if (url.hostname === scene7Host && url.pathname.startsWith(scene7Prefix)) {
    const name = decodeURIComponent(url.pathname.slice(scene7Prefix.length));
    if (!name) return null;
    const crop = name.match(/^(.*):([a-z\d]+to[a-z\d]+)$/i);
    const imageName = crop ? crop[1] : name;
    if (!imageName) return null;
    const stem = `https://${scene7Host}${scene7Prefix}${imageName}`;
    return {
      kind: 'marketing',
      key: `${stem}?${semanticQuery(rawURL)}`,
      stem,
      crop: crop?.[2].toLowerCase(),
      fullURL: rawURL,
      observedURL: withoutRendererParams(rawURL),
      marker: `${imageName}${url.search}`,
    };
  }

  if (url.hostname === cosyHost && url.pathname === cosyPath) {
    return {
      kind: 'cosy',
      key: rawURL,
      stem: rawURL,
      marker: `${url.pathname}${url.search}`,
      fullURL: rawURL,
      observedURL: rawURL,
    };
  }
  return null;
}

function countryTags(marker = '') {
  const countries = new Set();
  const decoded = decodeURIComponent(marker).toLowerCase();
  const filenameMarkers = /(?:^|_)([a-z]{2})(?=$|[_-]|\.)|(?:^|-)([a-z]{2})(?=$|[-_]\d|\.|$)/g;
  let filenameMarker = filenameMarkers.exec(decoded);
  while (filenameMarker) {
    const country = filenameMarker[1] || filenameMarker[2];
    if (countryCodes.has(country)) countries.add(country);
    filenameMarker = filenameMarkers.exec(decoded);
  }

  try {
    const url = new URL(`https://asset.invalid${marker.startsWith('/') ? marker : `/${marker}`}`);
    ['market', 'country', 'marketcode'].forEach((parameter) => {
      const country = url.searchParams.get(parameter)?.toLowerCase();
      if (countryCodes.has(country)) countries.add(country);
    });
  } catch {
    // The marker has already passed URL validation; this only guards unusual encoded values.
  }
  return [...countries].sort();
}

const stableID = (kind, url) => `bmw-${createHash('sha256').update(`${kind}:${url}`).digest('hex').slice(0, 16)}`;

const values = (value) => (Array.isArray(value) ? value : [value])
  .filter((item) => typeof item === 'string' && item.trim())
  .map((item) => item.trim());

const generalAsset = (asset) => /(?:^|[/_.-])(logo|icon|favicon|social|header|footer|ncap|rating|award)(?:[/_.-]|$)/i.test(asset.url);

const renditionScore = (fullURL) => {
  try {
    const url = new URL(fullURL);
    const width = Number.parseInt(url.searchParams.get('wid') || url.searchParams.get('width'), 10) || 0;
    const height = Number.parseInt(url.searchParams.get('hei') || url.searchParams.get('height'), 10) || 0;
    return width * height || width || height;
  } catch {
    return 0;
  }
};

function preferredURL(current, candidate) {
  if (!current) return candidate;
  const currentScore = renditionScore(current);
  const candidateScore = renditionScore(candidate);
  if (candidateScore !== currentScore) return candidateScore > currentScore ? candidate : current;
  return candidate < current ? candidate : current;
}

const preferredTitle = (current, candidate, fallback) => {
  if (!candidate) return current || fallback;
  if (!current || candidate.length > current.length) return candidate;
  return candidate.length === current.length && candidate < current ? candidate : current;
};

const placeholderCaption = (title = '') => /^(?:blueprint|placeholder|image(?: without alt text)?|bild)$/i.test(title.trim());

const readableAssetName = (url) => decodeURIComponent(url.split('/').pop() || '')
  .replace(/([a-z])([A-Z])/g, '$1 $2')
  .replace(/[_.-]+/g, ' ')
  .replace(/\s+/g, ' ')
  .replace(/^./, (character) => character.toUpperCase())
  .trim();

function fallbackTitle(provider, page) {
  const model = values(page.model).sort()[0] || values(page.family).sort()[0] || values(page.brand).sort()[0] || 'BMW';
  if (provider.kind === 'cosy') return `${model} vehicle render`;
  return `${model} · ${readableAssetName(provider.stem) || 'marketing image'}`;
}

const browseKey = (asset) => asset.models[0] || asset.families[0] || asset.brands[0] || '';

function browseOrder(left, right) {
  const kind = (left.kind === 'marketing' ? 0 : 1) - (right.kind === 'marketing' ? 0 : 1);
  if (kind) return kind;
  const model = browseKey(left).localeCompare(browseKey(right), 'en', { numeric: true });
  if (model) return model;
  const title = left.title.localeCompare(right.title, 'en', { numeric: true });
  if (title) return title;
  return left.id.localeCompare(right.id);
}

/**
 * Extract public BMW marketing and COSY images from verified page markup.
 * @param {Array<{path: string, html: string, brand?: string|string[], family?: string|string[],
 * model?: string|string[]}>} pages
 * @param {{perPageLimit?: number}} options limits distinct provider images per page when set
 * @returns {Array<object>} a deterministic picker catalogue
 */
// eslint-disable-next-line import/prefer-default-export
export function buildCatalogue(pages = [], { perPageLimit = Infinity } = {}) {
  const assets = new Map();
  [...pages]
    .filter((page) => page && typeof page.html === 'string' && typeof page.path === 'string')
    .sort((left, right) => left.path.localeCompare(right.path))
    .forEach((page) => {
      const pageAssets = new Set();
      imageReferences(page.html).forEach(({ url, title }) => {
        const provider = knownProvider(url);
        if (!provider) return;

        const key = `${provider.kind}:${provider.key}`;
        if (!pageAssets.has(key) && pageAssets.size >= perPageLimit) return;
        pageAssets.add(key);
        const asset = assets.get(key) || {
          id: stableID(provider.kind, provider.key),
          url: provider.observedURL,
          defaultRendition: provider.fullURL,
          title: fallbackTitle(provider, page),
          hasCaption: false,
          kind: provider.kind,
          brands: new Set(),
          families: new Set(),
          models: new Set(),
          countries: new Set(),
          sources: new Set(),
          crops: {},
        };
        if (title && !placeholderCaption(title)) {
          asset.title = asset.hasCaption
            ? preferredTitle(asset.title, title, asset.title)
            : title;
          asset.hasCaption = true;
        }
        asset.sources.add(page.path);
        countryTags(provider.marker).forEach((country) => asset.countries.add(country));
        if (!generalAsset(asset)) {
          values(page.brand).forEach((brand) => asset.brands.add(brand));
          values(page.family).forEach((family) => asset.families.add(family));
          values(page.model).forEach((model) => asset.models.add(model));
        }
        if (provider.crop) {
          const cropURL = preferredURL(asset.crops[provider.crop], provider.fullURL);
          asset.crops[provider.crop] = cropURL;
        }
        asset.defaultRendition = preferredURL(asset.defaultRendition, provider.fullURL);
        assets.set(key, asset);
      });
    });

  return [...assets.values()]
    .map((asset) => ({
      id: asset.id,
      url: asset.kind === 'marketing' ? withoutRendererParams(asset.defaultRendition) : asset.url,
      title: !asset.hasCaption && asset.kind === 'cosy' && asset.models.size > 1
        ? `${[...asset.families].sort()[0] || 'Shared'} vehicle render` : asset.title,
      alt: asset.hasCaption ? asset.title : '',
      kind: asset.kind,
      brands: [...asset.brands].sort(),
      families: [...asset.families].sort(),
      models: [...asset.models].sort(),
      countries: [...asset.countries].sort(),
      sources: [...asset.sources].sort(),
      crops: Object.fromEntries(
        Object.entries(asset.crops)
          .sort(([left], [right]) => left.localeCompare(right))
          .map(([crop, url]) => [crop, withoutRendererParams(url)]),
      ),
    }))
    .sort(browseOrder);
}

async function main() {
  const here = dirname(fileURLToPath(import.meta.url));
  const manifestPath = resolve(here, 'asset-pages.json');
  const outputPath = resolve(here, '../asset-picker/catalogue.json');
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  const pages = await Promise.all(manifest.pages.map(async (page) => {
    const source = `https://main--bmw--moved-permanently.aem.page${page.path}.plain.html`;
    const response = await fetch(source);
    if (!response.ok) throw new Error(`${response.status} ${source}`);
    return { ...page, html: await response.text() };
  }));
  const catalogue = buildCatalogue(pages, { perPageLimit: 24 });
  await writeFile(outputPath, `${JSON.stringify(catalogue, null, 2)}\n`);
  console.log(`Generated ${catalogue.length} assets from ${pages.length} public BMW pages.`); // eslint-disable-line no-console
}

const invokedPath = process.argv[1] && resolve(process.argv[1]);
if (invokedPath === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error); // eslint-disable-line no-console
    process.exitCode = 1;
  });
}
