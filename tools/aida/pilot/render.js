export const escapeHtml = (value) => String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

const language = (market) => ({
  hq: 'en', de: 'de', at: 'de', fr: 'fr', be: 'fr',
}[market]);

export function nativePath(article) {
  const folders = {
    hq: 'en', de: 'de/de', at: 'de/at', fr: 'fr/fr', be: 'fr/be',
  };
  return `/aida/${folders[article.market]}/news/${article.slug}`;
}
export function articleFragment(article) {
  const e = escapeHtml;
  return `<div><h1>${e(article.title)}</h1><p>${e(article.description)}</p>`
    + `${article.localIntro ? `<p>${e(article.localIntro)}</p>` : ''}`
    + `${article.body.split(/\n\n+/).map((p) => `<p>${e(p)}</p>`).join('')}`
    + `<p><small>${e(article.legal)}</small></p>`
    + `${article.localCta ? `<p>${e(article.localCta)}</p>` : ''}</div>`;
}
export function structuredData(article) {
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.description,
    ...(article.publishedAt ? { datePublished: article.publishedAt } : {}),
    publisher: { '@type': 'Organization', name: 'BMW demonstration' },
  };
}
export function daDocument(article) {
  const metadata = {
    Title: article.title,
    Description: article.description,
    'html-lang': {
      hq: 'en', de: 'de', at: 'de', fr: 'fr', be: 'fr',
    }[article.market],
    'json-ld': JSON.stringify(structuredData(article)),
    Robots: 'noindex, nofollow',
  };
  return `<body><header></header><main>${articleFragment(article)}<div><div class="metadata">${
    Object.entries(metadata).map(([key, value]) => `<div><div>${escapeHtml(key)}</div><div>${escapeHtml(value)}</div></div>`).join('')
  }</div></div></main><footer></footer></body>`;
}
export function markdown(article) {
  const text = (value) => escapeHtml(value).replace(/([\\`*_{}[\]()#+.!|>-])/g, '\\$1');
  return [`# ${text(article.title)}`, ...[article.description, article.localIntro, article.body, article.legal, article.localCta].filter(Boolean).map(text)].join('\n\n');
}
export function publicDocument(article) {
  const ld = JSON.stringify(structuredData(article)).replace(/</g, '\\u003c');
  return `<!doctype html><html lang="${language(article.market)}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${escapeHtml(article.title)}</title><link rel="stylesheet" href="/ui/style.css"><script type="application/ld+json">${ld}</script></head><body><main><p class="notice">Local pilot public release — not published to BMW or EDS.</p>${articleFragment(article)}<p>Revision ${article.revision} · ${escapeHtml(article.publishedAt)}</p><button id="conversion" data-id="${escapeHtml(article.id)}">Demo CTA (records a local event)</button><p><a href="/">Pilot desk</a> · <a href="/news/${article.id}.md">Markdown</a> · <a href="/news/${article.id}.plain.html">HTML fragment</a> · <a href="/news/${article.id}.json">JSON</a></p></main><script type="module" src="/ui/public.js"></script></body></html>`;
}
