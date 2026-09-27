/*
 * Content Table (source cmp-contenttable): data table rendered as a CSS grid with row rules;
 * scrolls horizontally on small screens.
 * Rows = table rows, cells = table cells.
 * Options: header (first row is the table head), highlight-N (row N, 1-based, grey background),
 * center-N / end-N (column N centered / end aligned), width-N / width-lg-N / width-md-N (centered
 * width in 12ths from 1280px / 1024-1279px / 768-1023px), accordion (a row with a single heading
 * cell starts a collapsed item titled by it; the rows below form its table; source tyre lists).
 */

let seq = 0;

function option(block, re) {
  const cls = [...block.classList].find((c) => re.test(c));
  return cls ? Number(cls.match(re)[1]) : null;
}

/** Builds a scrollable <table> from block rows. */
function buildTable(rows, block) {
  const cols = Math.max(...rows.map((r) => r.children.length));
  const header = block.classList.contains('header');
  const opts = [...block.classList];
  const accordion = block.classList.contains('accordion');
  const highlight = new Set(accordion ? [] : opts.filter((c) => /^highlight-\d+$/.test(c)).map((c) => Number(c.split('-')[1])));
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
  scroller.style.setProperty('--content-table-cols', cols);
  scroller.append(table);
  return { scroller, cols };
}

function isTitleRow(row) {
  return row.children.length === 1 && !!row.querySelector('h1, h2, h3, h4, h5, h6');
}

function buildAccordion(block, rows) {
  seq += 1;
  const items = [];
  rows.forEach((row) => {
    if (isTitleRow(row)) items.push({ title: row.textContent.replace(/\s+/g, ' ').trim(), rows: [] });
    else if (items.length) items[items.length - 1].rows.push(row);
  });
  return items.filter((it) => it.rows.length).map((it, i) => {
    const id = `content-table-${seq}-${i}`;
    const item = document.createElement('div');
    item.className = 'content-table-item';
    const h = document.createElement('h3');
    h.className = 'content-table-item-header';
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'content-table-item-button';
    button.id = `${id}-button`;
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-controls', `${id}-panel`);
    const title = document.createElement('span');
    title.className = 'content-table-item-title';
    title.textContent = it.title;
    const icon = document.createElement('span');
    icon.className = 'bmw-icon content-table-item-icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = 'arrow_chevron_down';
    button.append(title, icon);
    h.append(button);
    const panel = document.createElement('div');
    panel.className = 'content-table-item-panel';
    panel.id = `${id}-panel`;
    panel.setAttribute('role', 'region');
    panel.setAttribute('aria-labelledby', button.id);
    panel.hidden = true;
    panel.append(buildTable(it.rows, block).scroller);
    button.addEventListener('click', () => {
      const open = button.getAttribute('aria-expanded') !== 'true';
      button.setAttribute('aria-expanded', String(open));
      item.classList.toggle('is-open', open);
      panel.hidden = !open;
    });
    item.append(h, panel);
    return item;
  });
}

export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;
  const cols = option(block, /^width-(\d+)$/);
  const colsLg = option(block, /^width-lg-(\d+)$/) || cols;
  const colsMd = option(block, /^width-md-(\d+)$/) || colsLg;
  if (cols && cols < 12) block.style.setProperty('--content-table-width', cols);
  if (colsLg && colsLg < 12) block.style.setProperty('--content-table-width-lg', colsLg);
  if (colsMd && colsMd < 12) block.style.setProperty('--content-table-width-md', colsMd);

  if (block.classList.contains('accordion') && rows.some(isTitleRow)) {
    block.replaceChildren(...buildAccordion(block, rows));
    return;
  }
  const { scroller, cols: n } = buildTable(rows, block);
  block.style.setProperty('--content-table-cols', n);
  block.dataset.cols = n;
  block.replaceChildren(scroller);
}
