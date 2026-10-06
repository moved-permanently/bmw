import { readRecord, blockRows } from '../../scripts/structured-content.js';
import { buildResponsivePicture } from '../../scripts/bmw-utils.js';

/*
 * News story record (DA Structured Content schema "news", edited in da.live/form): renders the
 * record fields as a BMW news article. Fields: headline, teaser, body, publishDate, category,
 * image (Scene7 URL), imageAlt, ctaLabel / ctaUrl, source.
 */

function formatDate(value, lang) {
  const d = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return value;
  return new Intl.DateTimeFormat(lang, { dateStyle: 'long', timeZone: 'UTC' }).format(d);
}

const el = (tag, className, textContent) => Object.assign(
  document.createElement(tag),
  { className, textContent },
);

export default function decorate(block) {
  const r = readRecord(blockRows(block));
  const lang = document.documentElement.lang || 'en';
  const article = el('article', 'news-article');
  if (r.image) {
    const media = el('div', 'news-media');
    const sources = [{ url: r.image, widths: [750, 1280, 1920] }];
    media.append(buildResponsivePicture(sources, { alt: r.imageAlt || '', eager: true }));
    article.append(media);
  }
  const body = el('div', 'news-body');
  const meta = [r.category, r.publishDate && formatDate(r.publishDate, lang)].filter(Boolean).join(' · ');
  if (meta) body.append(el('p', 'news-meta', meta));
  if (r.headline) body.append(el('h1', 'news-headline', r.headline));
  if (r.teaser) body.append(el('p', 'news-teaser', r.teaser));
  (r.body || '').split(/\n+/).filter((t) => t.trim()).forEach((t) => body.append(el('p', '', t.trim())));
  if (r.ctaLabel && r.ctaUrl) {
    const p = el('p', 'button-wrapper');
    const a = el('a', 'button primary', r.ctaLabel);
    a.href = r.ctaUrl;
    p.append(a);
    body.append(p);
  }
  if (r.source) body.append(el('p', 'news-source', r.source));
  article.append(body);
  block.replaceChildren(article);
}
