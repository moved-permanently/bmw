/*
 * Download (source cmp-download, style "link-with-icon"): file links with a download icon.
 * Rows: <a href="https://www.bmw.de/content/dam/…pdf">Label</a> | meta (e.g. "PDF, 113 KB").
 * The meta is visually hidden (as on the source) and read as the link description.
 * Option outline: outline button instead of the icon link.
 */

let idCounter = 0;

function iconSpan(name) {
  const span = document.createElement('span');
  span.className = 'bmw-icon download-icon';
  span.dataset.icon = name;
  span.setAttribute('aria-hidden', 'true');
  span.textContent = name;
  return span;
}

export default function decorate(block) {
  const list = document.createElement('ul');
  list.className = 'download-list';
  [...block.children].forEach((row) => {
    const [linkCell, metaCell] = [...row.children];
    const src = linkCell && linkCell.querySelector('a[href]');
    if (!src) return;
    idCounter += 1;
    const li = document.createElement('li');
    li.className = 'download-item';
    const a = document.createElement('a');
    a.className = 'download-link';
    a.href = src.href;
    a.setAttribute('download', '');
    if (src.title && src.title !== src.textContent) a.title = src.title;
    const label = document.createElement('span');
    label.className = 'download-label';
    label.textContent = src.textContent.trim();
    a.append(iconSpan('download'), label);
    li.append(a);
    const meta = metaCell ? metaCell.textContent.trim() : '';
    if (meta) {
      const m = document.createElement('span');
      m.className = 'download-meta';
      m.id = `download-meta-${idCounter}`;
      m.textContent = meta;
      a.setAttribute('aria-describedby', m.id);
      li.append(m);
    }
    list.append(li);
  });
  block.replaceChildren(list);
}
