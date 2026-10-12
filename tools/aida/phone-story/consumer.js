/* global globalThis */
export const SOURCE_ORIGIN = 'https://main--bmw--moved-permanently.aem.page';
export const SOURCE_PATH = '/aida/showcase/en/news/i5-film-v2';
export const SOURCE_URL = `${SOURCE_ORIGIN}${SOURCE_PATH}`;

export function publicReadURL(url, origin) {
  return origin === SOURCE_ORIGIN ? url
    : `https://da-etc.adobeaem.workers.dev/cors?url=${encodeURIComponent(url)}`;
}

const ENTITIES = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
};
const decode = (text) => text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (all, entity) => {
  if (!entity.startsWith('#')) return ENTITIES[entity.toLowerCase()] ?? all;
  const point = entity[1].toLowerCase() === 'x' ? parseInt(entity.slice(2), 16) : Number(entity.slice(1));
  return point >= 0 && point <= 0x10ffff ? String.fromCodePoint(point) : all;
});
const textOf = (text) => decode(text.replace(/<[^>]*>/g, '')).replace(/[\s\u00a0]+/g, ' ').trim();
const markdownText = (text) => textOf(text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/\*\*|__|`/g, ''));
const FIELD_LABELS = {
  electricRange: 'Range · WLTP',
  electricConsumption: 'Consumption · WLTP',
  power: 'Power',
  acceleration: '0–100 km/h',
  co2: 'CO₂ · WLTP',
  additionalRangeDC: 'Charging range',
};

const safeImage = (href, alt) => {
  if (!href) return null;
  try {
    const url = new URL(decode(href), SOURCE_URL);
    return url.protocol === 'https:' && !url.username && !url.password
      ? { url: url.href, alt: textOf(alt || '') } : null;
  } catch { return null; }
};
const attribute = (tag, name) => tag?.match(new RegExp(`\\b${name}\\s*=\\s*(["'])(.*?)\\1`, 'i'))?.[2];

export function parseStory({ markdown, html }) {
  const lines = markdown.split('\n').map((line) => line.trim()).filter(Boolean);
  const heading = lines.find((line) => line.startsWith('# '));
  const nativeHeading = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i);
  const title = heading ? markdownText(heading.slice(2)) : textOf(nativeHeading?.[1] || '');
  if (!title) throw new Error('The preview did not return an authored title heading.');
  const nativeTeaser = html.match(/<h1\b[^>]*>[\s\S]*?<\/h1>[\s\S]*?<p\b[^>]*>([\s\S]*?)<\/p>/i);
  const teaser = markdownText(lines.find((line) => /^[\p{L}\d]/u.test(line) && !line.startsWith('|')) || '')
    || textOf(nativeTeaser?.[1] || '');
  const match = markdown.match(/!\[([^\]]*)\]\(([^)\s]+)/);
  let image = match ? safeImage(match[2], match[1]) : null;
  if (!image) {
    const tag = html.match(/<img\b[^>]*>/i)?.[0];
    image = safeImage(attribute(tag, 'src'), attribute(tag, 'alt'));
  }
  const anchors = [...html.matchAll(/<a\b[^>]*?\bhref\s*=\s*(["'])(.*?)\1[^>]*>([\s\S]*?)<\/a>/gi)];
  if (!image) {
    image = anchors.map(([, , href, alt]) => safeImage(href, alt)).find((candidate) => {
      if (!candidate) return false;
      const url = new URL(candidate.url);
      return (url.hostname === 'bmw.scene7.com' && url.pathname.startsWith('/is/image/'))
        || url.hostname === 'prod.cosy.bmw.cloud'
        || (url.origin === SOURCE_ORIGIN && /\/media_[^/]+\.(?:jpe?g|png|webp|avif)$/i.test(url.pathname));
    }) || null;
  }
  const bindings = new Map();
  anchors.forEach(([, , rawHref, inner]) => {
    try {
      const url = new URL(decode(rawHref), SOURCE_URL);
      if (url.origin !== SOURCE_ORIGIN || url.username || url.password) return;
      const binding = `${url.pathname}${url.hash}`.match(/^\/aida\/(?:showcase\/)?data\/wdh-([a-z]{2})\.json#([A-Za-z0-9]+)\.([A-Za-z0-9]+)$/);
      if (!binding) return;
      const [, market, code, field] = binding;
      const key = `${code}.${field}`;
      if (!bindings.has(key)) {
        bindings.set(key, {
          key, market, field, text: textOf(inner), href: url.href,
        });
      }
    } catch { /* Unparseable links are not technical facts. */ }
  });
  const values = Object.fromEntries([...bindings.values()].map(({ key, text }) => [key, text]));
  const facts = [...bindings.values()]
    .filter(({ field, text }) => Object.hasOwn(FIELD_LABELS, field) && text)
    .slice(0, 3).map((binding) => ({ ...binding, label: FIELD_LABELS[binding.field] }));
  const legal = [...bindings.values()].filter(({ field }) => field === 'wltp').map(({ text }) => text).join(' ');
  return {
    id: SOURCE_PATH, title, teaser, image, values, facts, legal,
  };
}

export function createChannel({
  fetcher = globalThis.fetch, clock = () => new Date(), onChange = () => {},
} = {}) {
  const state = {
    status: 'unfetched', item: null, previousItem: null, fetchedAt: null, error: null, contentChanged: false,
  };
  const notify = () => onChange(state);
  return {
    state,
    reset() {
      if (state.status === 'fetching') return;
      Object.assign(state, {
        status: 'unfetched', item: null, previousItem: null, fetchedAt: null, error: null, contentChanged: false,
      });
      notify();
    },
    async refresh() {
      if (state.status === 'fetching') return;
      state.status = 'fetching';
      state.error = null;
      state.contentChanged = false;
      notify();
      try {
        const [markdown, html] = await Promise.all([`${SOURCE_URL}.md`, `${SOURCE_URL}.plain.html`].map(async (url) => {
          const response = await fetcher(url, { cache: 'no-store', credentials: 'omit', signal: AbortSignal.timeout(15000) });
          if (!response.ok) throw new Error(`Source request failed (${response.status}).`);
          const text = await response.text();
          if (text.length > 2000000) throw new Error('Source response is too large.');
          return text;
        }));
        const item = parseStory({ markdown, html });
        state.contentChanged = !!state.item && JSON.stringify(item) !== JSON.stringify(state.item);
        state.previousItem = state.item;
        state.item = item;
        state.fetchedAt = clock().toISOString();
        state.status = 'fetched';
      } catch (error) {
        state.error = error.message || 'Source request failed.';
        state.status = state.item ? 'stale' : 'error';
      }
      notify();
    },
  };
}
