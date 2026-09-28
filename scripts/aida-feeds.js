/*
 * Channel helpers: the representations every page is served in, and the news feed selection.
 */
export function representations(path, dataUrl) {
  return [
    { id: 'html', label: 'Web page', url: path },
    { id: 'md', label: 'Markdown for LLMs', url: `${path}.md` },
    { id: 'plain', label: 'HTML fragment', url: `${path}.plain.html` },
    { id: 'jsonld', label: 'Structured data (JSON-LD)', url: path },
    ...(dataUrl ? [{ id: 'data', label: 'Data (JSON)', url: dataUrl }] : []),
  ];
}

export function toTime(value) {
  const s = String(value ?? '').trim();
  if (/^\d+$/.test(s)) return Number(s) < 1e12 ? Number(s) * 1000 : Number(s);
  const t = Date.parse(s);
  return Number.isNaN(t) ? 0 : t;
}

export function selectNews(rows, prefix, limit = 12) {
  return rows
    .filter((r) => r.path?.startsWith(prefix) && r.path !== prefix && !r.path.endsWith('/index'))
    .sort((a, b) => toTime(b.date) - toTime(a.date))
    .slice(0, limit);
}
