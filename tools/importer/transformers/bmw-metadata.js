/* eslint-disable */
/* global WebImporter */
// Page metadata block from the source <head> (runs afterTransform, after sections).

function normalizeImageUrl(src) {
  if (!src) return '';
  let abs;
  try { abs = new URL(src.trim(), 'https://www.bmw.de/').href; } catch (e) { return ''; }
  if (!/\/is\/image\//.test(abs)) return abs;
  const [base, query = ''] = abs.split('?');
  const keep = query.split('&').filter((p) => p && !['wid', 'hei', 'fmt', 'qlt', 'fit'].includes(p.split('=')[0]));
  return keep.length ? `${base}?${keep.join('&')}` : base;
}

// Header variant as authored on the source page (the header markup itself is removed by cleanup before
// this runs, so read it from the original HTML string the importer passes as payload.html):
// cmp-globalnavigation--solid → solid bar; --transparent-wGradient → transparent with the white
// gradient; --transparent → transparent overlay with the dark gradient. Always emitted: the runtime
// fallback (first block is a stage → transparent) is wrong on ~10% of the pages.
function sourceHeaderStyle(html) {
  const m = html.match(/class="(cmp-globalnavigation\s[^"]*)"/);
  if (!m) return '';
  const mods = m[1].split(/\s+/).filter((c) => c.startsWith('cmp-globalnavigation--')).map((c) => c.slice(22));
  if (mods.some((c) => c.startsWith('transparent-wGradient'))) return 'gradient';
  if (mods.some((c) => c.startsWith('transparent'))) return 'transparent';
  if (mods.some((c) => c.startsWith('solid'))) return 'solid';
  return '';
}

export default function transform(hookName, element, payload) {
  if (hookName !== 'afterTransform') return;
  const { document } = payload;
  const doc = element.ownerDocument;
  const main = element.querySelector('main') || element;
  const meta = (sel) => document.querySelector(sel)?.getAttribute('content')?.trim() || '';
  const rows = [];
  const title = (document.title || meta('meta[property="og:title"]')).trim();
  if (title) rows.push(['Title', title]);
  const desc = meta('meta[name="description"]') || meta('meta[property="og:description"]');
  if (desc) rows.push(['Description', desc]);
  // og:image: bmw.de often emits a broken og:image (just the host) — fall back to the first stage/hero image
  let og = meta('meta[property="og:image"]');
  if (!og || /^https?:\/\/[^/]+\/?$/.test(og)) {
    const poster = payload.stagePoster
      || [...main.querySelectorAll('img, a[href*="/is/image/"]')].map((n) => n.getAttribute('src') || n.getAttribute('href')).find((u) => u && /\/is\/image\//.test(u));
    og = poster || '';
  }
  if (og) {
    const img = doc.createElement('img');
    img.src = normalizeImageUrl(og);
    rows.push(['Image', img]);
  }
  const robots = meta('meta[name="robots"]');
  if (robots) rows.push(['Robots', robots]);
  const kw = meta('meta[name="keywords"]');
  if (kw) rows.push(['Keywords', kw]);
  const tmpl = meta('meta[name="template"]');
  if (tmpl && tmpl !== 'content-page') rows.push(['Template', tmpl]);
  const headerStyle = sourceHeaderStyle(payload.html || '');
  if (headerStyle) rows.push(['Header Style', headerStyle]);
  if (!rows.length) return;
  main.append(WebImporter.Blocks.createBlock(doc, { name: 'Metadata', cells: rows }));
}
