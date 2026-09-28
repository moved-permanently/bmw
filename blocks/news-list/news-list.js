import { createOptimizedPicture } from '../../scripts/aem.js';
import { fetchSheet } from '../../scripts/bmw-utils.js';
import { selectNews, toTime } from '../../scripts/aida-feeds.js';

/*
 * News list: newest articles of a folder from the query index (or any sheet with path, title,
 * description, image, date).
 *  Row 1: index (link or path, e.g. /aida/query-index.json).  Row 2: folder (e.g. /aida/en/news/).
 *  Row 3 (optional): number of articles.
 */
export default async function decorate(block) {
  const [source, folder, limit] = [...block.children].map((row) => {
    const cell = row.firstElementChild;
    return cell?.querySelector('a')?.getAttribute('href') || cell?.textContent.trim();
  });
  if (!source || !folder) return;
  const { pathname } = new URL(source, window.location.href);
  const prefix = new URL(folder, window.location.href).pathname;
  let rows = [];
  try {
    rows = selectNews((await fetchSheet(pathname)).data || [], prefix, Number(limit) || 12);
  } catch (e) {
    rows = [];
  }
  const lang = document.documentElement.lang || 'en';
  const ul = document.createElement('ul');
  rows.forEach((row) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = row.path;
    if (row.image && !row.image.includes('default-meta-image')) {
      const img = new URL(row.image, window.location.href);
      if (img.origin === window.location.origin) {
        a.append(createOptimizedPicture(img.pathname, row.title || '', false, [{ width: '750' }]));
      } else {
        const picture = document.createElement('picture');
        picture.append(Object.assign(document.createElement('img'), { src: img.href, alt: row.title || '', loading: 'lazy' }));
        a.append(picture);
      }
    }
    const body = document.createElement('div');
    body.className = 'news-list-body';
    if (row.date) {
      const time = document.createElement('time');
      const date = new Date(toTime(row.date));
      time.dateTime = date.toISOString().slice(0, 10);
      time.textContent = date.toLocaleDateString(lang, { day: 'numeric', month: 'long', year: 'numeric' });
      body.append(time);
    }
    const h3 = document.createElement('h3');
    h3.textContent = row.title || row.path;
    body.append(h3);
    if (row.description) {
      const p = document.createElement('p');
      p.textContent = row.description;
      body.append(p);
    }
    a.append(body);
    li.append(a);
    ul.append(li);
  });
  block.replaceChildren(rows.length ? ul : Object.assign(document.createElement('p'), { textContent: '–' }));
}
