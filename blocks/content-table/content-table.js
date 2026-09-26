/*
 * Content Table (source cmp-contenttable): data table rendered as a CSS grid with row rules;
 * scrolls horizontally on small screens.
 * Rows = table rows, cells = table cells.
 * Options: header (first row is the table head), highlight-N (row N, 1-based, grey background),
 * center-N / end-N (column N centered / end aligned).
 */

export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;
  const cols = Math.max(...rows.map((r) => r.children.length));
  const header = block.classList.contains('header');
  const opts = [...block.classList];
  const highlight = new Set(opts.filter((c) => /^highlight-\d+$/.test(c)).map((c) => Number(c.split('-')[1])));
  const align = {};
  opts.forEach((c) => {
    const m = c.match(/^(center|end)-(\d+)$/);
    if (!m) return;
    const [, kind, col] = m;
    align[Number(col)] = kind;
  });

  const table = document.createElement('table');
  table.className = 'content-table-table';
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');
  rows.forEach((row, ri) => {
    const tr = document.createElement('tr');
    tr.className = 'content-table-row';
    if (highlight.has(ri + 1)) tr.classList.add('is-highlight');
    const inHead = header && ri === 0;
    const cells = [...row.children];
    for (let ci = 0; ci < cols; ci += 1) {
      const src = cells[ci];
      const cell = document.createElement(inHead ? 'th' : 'td');
      if (inHead) cell.scope = 'col';
      cell.className = 'content-table-cell';
      if (align[ci + 1]) cell.classList.add(`align-${align[ci + 1]}`);
      if (src) {
        // a single paragraph arrives unwrapped; keep paragraphs otherwise
        cell.append(...src.childNodes);
      }
      if (!cell.textContent.trim() && !cell.querySelector('img, a')) cell.classList.add('is-empty');
      tr.append(cell);
    }
    (inHead ? thead : tbody).append(tr);
  });
  if (thead.children.length) table.append(thead);
  table.append(tbody);

  const scroller = document.createElement('div');
  scroller.className = 'content-table-scroller';
  scroller.append(table);
  block.style.setProperty('--content-table-cols', cols);
  block.dataset.cols = cols;
  block.replaceChildren(scroller);
}
