import { findBindings } from '../../../scripts/aida-wdh.js';

// eslint-disable-next-line import/prefer-default-export
export function toStreamItem({ path, markdown, html }) {
  const lines = markdown.split('\n').map((l) => l.trim()).filter(Boolean);
  const title = (lines.find((l) => l.startsWith('# ')) || '').slice(2);
  const image = (markdown.match(/!\[[^\]]*\]\(([^)\s]+)/) || [])[1] || null;
  const teaser = lines.find((l) => /^[\p{L}\d]/u.test(l) && !l.startsWith('|')) || '';
  const values = Object.fromEntries(findBindings(html).map((b) => [b.key, b.text]));
  return {
    id: path, title, teaser, image, values,
  };
}
