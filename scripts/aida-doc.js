/*
 * Document helpers for DA source HTML (blocks are <div class="name"> tables): metadata reads and
 * edits. Pure string functions shared by the editor plugins and the content agent.
 */
import { textOf } from './aida-wdh.js';

const escape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const metaName = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// top-level <div> elements of a fragment: [{ start, end, inner }]
function topDivs(html, from = 0, to = html.length) {
  const re = /<\/?div\b[^>]*>/gi;
  re.lastIndex = from;
  const found = [];
  let depth = 0;
  let start;
  let open;
  for (let m = re.exec(html); m && m.index < to; m = re.exec(html)) {
    if (m[0][1] !== '/') {
      if (depth === 0) {
        start = m.index;
        open = m.index + m[0].length;
      }
      depth += 1;
    } else {
      depth -= 1;
      if (depth === 0) {
        found.push({ start, end: m.index + m[0].length, inner: html.slice(open, m.index) });
      }
    }
  }
  return found;
}

function metadataBlock(html) {
  const m = html.match(/<div class="metadata(?: [^"]*)?">/);
  if (!m) return null;
  const [block] = topDivs(html, m.index);
  const innerStart = m.index + m[0].length;
  const rows = topDivs(html, innerStart, block.end).map((row) => {
    const cells = topDivs(row.inner);
    return {
      ...row,
      key: cells[0] ? textOf(cells[0].inner) : '',
      value: cells[1] ? cells[1].inner : '',
    };
  });
  return { ...block, rows };
}

export function getMetadata(html, name) {
  const row = metadataBlock(html)?.rows.find((r) => metaName(r.key) === metaName(name));
  return row ? textOf(row.value) : null;
}

export function setMetadata(html, name, value) {
  const block = metadataBlock(html);
  if (!block) {
    const row = `<div><div>${escape(name)}</div><div>${escape(value)}</div></div>`;
    const newBlock = `<div class="metadata">${row}</div>`;
    const at = html.lastIndexOf('</div>', html.lastIndexOf('</main>'));
    return `${html.slice(0, at)}${newBlock}${html.slice(at)}`;
  }
  const row = block.rows.find((r) => metaName(r.key) === metaName(name));
  if (row) {
    return `${html.slice(0, row.start)}<div><div>${escape(row.key)}</div><div>${escape(value)}</div></div>${html.slice(row.end)}`;
  }
  const at = block.end - '</div>'.length;
  return `${html.slice(0, at)}<div><div>${escape(name)}</div><div>${escape(value)}</div></div>${html.slice(at)}`;
}

export function withVehicleJsonLd(html, vehicleJson) {
  const vehicle = JSON.parse(vehicleJson);
  const currentJson = getMetadata(html, 'json-ld');
  const current = currentJson ? JSON.parse(currentJson) : null;
  const types = [].concat(current?.['@type'] || []);
  if (!types.includes('NewsArticle')) return setMetadata(html, 'json-ld', vehicleJson);
  const about = { ...vehicle };
  delete about['@context'];
  return setMetadata(html, 'json-ld', JSON.stringify({
    ...current,
    headline: getMetadata(html, 'title') || current.headline,
    description: getMetadata(html, 'description') || current.description,
    about,
  }));
}
