/*
 * Compact per-model campaign media for the bmw-find-campaign-media skill.
 * The assistant cannot read the full Media Library index (.da/media-insights, ~4 MB) or the full
 * BMW assets catalogue in one turn, so each catalogue model gets one small DA sheet
 * (/aida/data/media/<model>.json) with Scene7 originals, alt text, crops and the pages using them.
 * A model's pages are its catalogue source pages plus pages with the model slug as a path segment.
 */

const SCENE7 = 'https://bmw.scene7.com/is/';

export const modelSlug = (model) => String(model).trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '');

const base = (url) => String(url).split(':').slice(0, 2).join(':'); // drop a ":16to7" smart-crop suffix
const page = (doc) => String(doc).replace(/\.md$/, '');

function original(row) {
  if (String(row.url).startsWith(SCENE7)) return base(row.url);
  if (row.originalPath?.startsWith('/BMW/')) return `${SCENE7}image${row.originalPath}`;
  return null;
}

export function campaignMedia(catalogue, index, { max = 40 } = {}) {
  const usage = new Map(); // Scene7 original -> { kind, pages:Set }
  index.forEach((row) => {
    const url = original(row);
    if (!url || !row.doc) return;
    const u = usage.get(url) || { kind: row.type === 'video' ? 'film' : 'image', pages: new Set() };
    u.pages.add(page(row.doc));
    usage.set(url, u);
  });

  const models = [...new Set(catalogue.flatMap((a) => a.models || []))];
  return Object.fromEntries(models.map((model) => {
    const slug = modelSlug(model);
    const own = catalogue.filter((a) => (a.models || []).includes(model));
    const modelPages = new Set(own.flatMap((a) => a.sources || []));
    const onModelPage = (p) => modelPages.has(p) || p.split('/').includes(slug);
    const rows = new Map();
    own.forEach((a) => {
      const url = base(a.url);
      const pages = new Set([...(a.sources || []), ...(usage.get(url)?.pages || [])]);
      rows.set(url, {
        kind: 'image', url, alt: a.alt || '', crops: Object.keys(a.crops || {}).join(', '), pages,
      });
    });
    usage.forEach((u, url) => {
      const pages = [...u.pages].filter(onModelPage);
      if (!pages.length || rows.has(url)) return;
      rows.set(url, {
        kind: u.kind, url, alt: '', crops: '', pages: new Set(pages),
      });
    });
    const list = [...rows.values()]
      .map((r) => ({ ...r, uses: r.pages.size, pages: [...r.pages].sort().join(', ') }))
      .sort((a, b) => Number(!!b.alt) - Number(!!a.alt) || b.uses - a.uses || a.url.localeCompare(b.url))
      .slice(0, max)
      .map(({
        kind, url, alt, crops, uses, pages,
      }) => ({
        kind, url, alt, crops, uses, pages,
      }));
    return [slug, list];
  }));
}

export const toSheet = (rows) => ({
  ':type': 'sheet', total: rows.length, offset: 0, limit: rows.length, data: rows,
});
