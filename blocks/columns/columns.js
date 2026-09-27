import {
  getImageRefs,
  buildResponsivePicture,
  decorateFontIcons,
  groupCtaLinks,
} from '../../scripts/bmw-utils.js';

/*
 * Columns: side-by-side cells of a source aem-Grid.
 * Option cols-A-B[-C…]: 12-column grid spans per cell (e.g. "cols-7-5", "cols-4-4-4"); cells stack
 * below 768px. Without it, cells share the row equally (boilerplate behaviour).
 * Tablet (768-1023px): stack-md (cells stay stacked until 1024px) or md-A-B (tablet spans).
 * middle: cells vertically centred. inset-N-start|end|both: cell N gets the source grid's
 * additional side spacing from 1024px. title-<headline-N|subsection-N>: heading typography.
 * Image-only cells become responsive Scene7 pictures; stand-alone links become chevron text links,
 * formatted links buttons (grouped like default content).
 */

const SPAN_RE = /^cols-(\d+(?:-\d+)+)$/;
const MD_SPAN_RE = /^md-(\d+(?:-\d+)+)$/;
const INSET_RE = /^inset-(\d+)-(start|end|both)$/;

/** A cell whose only content is one or more images (picture/img or image links). */
function isMediaCell(cell) {
  if (cell.querySelector('h1, h2, h3, h4, h5, h6')) return false;
  const refs = getImageRefs(cell);
  if (!refs.length) return false;
  const clone = cell.cloneNode(true);
  clone.querySelectorAll('picture, img').forEach((n) => n.remove());
  clone.querySelectorAll('a[href]').forEach((a) => {
    if (refs.some((r) => r.url === a.href)) a.remove();
  });
  return !clone.textContent.trim();
}

function decorateMediaCell(cell, spanOf12) {
  const [desktop, mobile, tablet] = getImageRefs(cell);
  const vw = Math.round((spanOf12 / 12) * 100);
  const picture = buildResponsivePicture([
    { media: '(max-width: 767px)', url: (mobile || desktop).url, widths: [480, 767, 1023] },
    { media: '(max-width: 1279px)', url: (tablet || mobile || desktop).url, widths: [767, 1023, 1279] },
    { url: desktop.url, widths: [767, 1279, 1919, 2560] },
  ], { alt: desktop.alt, sizes: `(min-width: 768px) ${vw}vw, 100vw` });
  cell.replaceChildren(picture);
  cell.classList.add('columns-img-col');
}

/** Text cells: loose text into a paragraph, links/buttons grouped like default content. */
function decorateTextCell(cell) {
  // runs of text/inline nodes directly in the cell (a single paragraph arrives unwrapped)
  const BLOCK_RE = /^(H[1-6]|P|UL|OL|DIV|TABLE|PICTURE|BLOCKQUOTE)$/;
  let run = null;
  [...cell.childNodes].forEach((n) => {
    const isBlock = n.nodeType === Node.ELEMENT_NODE && BLOCK_RE.test(n.tagName);
    if (isBlock) {
      run = null;
      return;
    }
    if (!run) {
      if (n.nodeType === Node.TEXT_NODE && !n.textContent.trim()) return;
      run = document.createElement('p');
      n.before(run);
    }
    run.append(n);
  });
  // formatted lone links that arrived without a paragraph missed decorateButtons: same rules here
  cell.querySelectorAll(':scope > p').forEach((p) => {
    const links = p.querySelectorAll('a[href]');
    if (links.length !== 1 || p.classList.contains('button-wrapper')) return;
    const a = links[0];
    if (a.classList.contains('button') || p.textContent.trim() !== a.textContent.trim()) return;
    const strong = a.closest('strong');
    const em = a.closest('em');
    if (!strong && !em) return;
    p.className = 'button-wrapper';
    a.className = 'button';
    if (strong && em) a.classList.add('accent');
    else a.classList.add(strong ? 'primary' : 'secondary');
    let outer = strong || em;
    if (strong && em) outer = strong.contains(em) ? strong : em;
    outer.replaceWith(a);
  });
  decorateFontIcons(cell);
  groupCtaLinks(cell, 'columns-links').forEach((group) => {
    // text links only (source "as link" buttons, each on its own grid row): stacked list
    if (!group.querySelector('.button')) group.classList.add('columns-links-text');
  });
}

export default function decorate(block) {
  const rows = [...block.children];
  const firstRow = rows[0];
  const cols = firstRow ? [...firstRow.children] : [];
  block.classList.add(`columns-${cols.length}-cols`);

  const spanClass = [...block.classList].find((c) => SPAN_RE.test(c));
  const spans = spanClass ? spanClass.match(SPAN_RE)[1].split('-').map(Number) : [];
  if (spans.length) block.classList.add('columns-grid');
  const mdClass = [...block.classList].find((c) => MD_SPAN_RE.test(c));
  const mdSpans = mdClass ? mdClass.match(MD_SPAN_RE)[1].split('-').map(Number) : [];
  const insets = {};
  [...block.classList].forEach((c) => {
    const [, index, side] = c.match(INSET_RE) || [];
    if (side) insets[Number(index) - 1] = side;
  });

  rows.forEach((row) => {
    row.classList.add('columns-row');
    [...row.children].forEach((cell, i) => {
      const span = spans[i] || Math.max(1, Math.floor(12 / row.children.length));
      if (spans.length) cell.style.setProperty('--columns-span', Math.min(12, span));
      if (spans.length && mdSpans[i]) cell.style.setProperty('--columns-md-span', Math.min(12, mdSpans[i]));
      if (insets[i]) cell.classList.add(`columns-inset-${insets[i]}`);
      if (isMediaCell(cell)) {
        decorateMediaCell(cell, span);
      } else {
        cell.classList.add('columns-text-col');
        decorateTextCell(cell);
      }
    });
  });
}
