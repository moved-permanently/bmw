import { loadBlock } from '../../scripts/aem.js';
import {
  getImageRefs,
  getVideoRefs,
  buildResponsivePicture,
  decorateFontIcons,
  decorateResponsiveImages,
  groupCtaLinks,
  isAiLabelMarker,
  markAiLabel,
} from '../../scripts/bmw-utils.js';

/*
 * Columns: side-by-side cells of a source aem-Grid.
 * Option cols-A-B[-C…]: 12-column grid spans per cell (e.g. "cols-7-5", "cols-4-4-4"); cells stack
 * below 768px. Without it, cells share the row equally (boilerplate behaviour).
 * Tablet (768-1023px): stack-md (cells stay stacked until 1024px) or md-A-B (tablet spans).
 * middle: cells vertically centred. inset-N-start|end|both: cell N gets the source grid's
 * additional side spacing from 1024px. title-<headline-N|subsection-N>: heading typography.
 * reverse: cells side by side in reverse order (source cmp-container--flex-row-reverse); stacked
 * cells keep the authored order.
 * Image-only cells become responsive Scene7 pictures; stand-alone links become chevron text links,
 * formatted links buttons (grouped like default content).
 * Images: 2-3 image links of one image (desktop, mobile[, tablet] crops) form one responsive
 * picture; a ":ai_eu_label:" paragraph after an image shows the EU AI label on it.
 * Embedded blocks (source video / download components beside text):
 *  - video cell: only poster image link(s) + video link(s) → a nested Video block; its options come
 *    from the columns options video-<option> (e.g. video-loop, video-controls, video-ratio-3-2)
 *  - download: paragraphs ":download: <a href title="PDF, 1 MB">Label</a>" → a nested Download
 *    block (download-outline: outline variant)
 */

const SPAN_RE = /^cols-(\d+(?:-\d+)+)$/;
const MD_SPAN_RE = /^md-(\d+(?:-\d+)+)$/;
const INSET_RE = /^inset-(\d+)-(start|end|both)$/;
const IMG_RE = /^img-(\d+)-(\d+)-(\d+)$/;
const DOWNLOAD_TOKEN = ':download:';

/**
 * aem.js wrapTextNodes wraps a cell that starts with a picture and has more content into one <p>
 * (e.g. image + heading + text of a card): unwrap it again.
 */
function unwrapCell(cell) {
  const only = cell.children.length === 1 ? cell.firstElementChild : null;
  if (!only || only.tagName !== 'P') return;
  if (!only.querySelector(':scope > :is(p, h1, h2, h3, h4, h5, h6, ul, ol, div, picture)')) return;
  if (only.firstElementChild.tagName !== 'PICTURE') return;
  only.replaceWith(...only.childNodes);
}

/** Block row: one div per cell (string = text, element(s) = content). */
function blockRow(cells) {
  const row = document.createElement('div');
  cells.forEach((content) => {
    const c = document.createElement('div');
    if (typeof content === 'string') c.textContent = content;
    else c.append(...[].concat(content));
    row.append(c);
  });
  return row;
}

/** Nested block element inside a cell, loaded like a section block. */
function nestedBlock(name, classes, rows) {
  const el = document.createElement('div');
  el.className = [name, ...classes].join(' ');
  rows.forEach((cells) => el.append(blockRow(cells)));
  el.classList.add('block');
  el.dataset.blockName = name;
  el.dataset.blockStatus = 'initialized';
  return el;
}

/** A cell holding only a video (poster image + video links), no headings or other text. */
function isVideoCell(cell) {
  if (cell.querySelector('h1, h2, h3, h4, h5, h6')) return false;
  const videos = getVideoRefs(cell);
  if (!videos.length) return false;
  const clone = cell.cloneNode(true);
  clone.querySelectorAll('picture, img').forEach((n) => n.remove());
  clone.querySelectorAll(':scope > p').forEach((n) => { if (isAiLabelMarker(n)) n.remove(); });
  const refs = [...videos.map((v) => v.url), ...getImageRefs(cell).map((r) => r.url)];
  clone.querySelectorAll('a[href]').forEach((a) => { if (refs.includes(a.href)) a.remove(); });
  return !clone.textContent.trim();
}

function takeAiLabelMarkers(cell) {
  const markers = [...cell.querySelectorAll(':scope > p')].filter(isAiLabelMarker);
  markers.forEach((m) => m.remove());
  return markers.length > 0;
}

function decorateVideoCell(cell, block) {
  const opts = [...block.classList].filter((c) => c.startsWith('video-')).map((c) => c.substring(6));
  if (takeAiLabelMarkers(cell) && !opts.includes('ai-label')) opts.push('ai-label');
  const video = nestedBlock('video', opts, [[[...cell.childNodes]]]);
  cell.replaceChildren(video);
  cell.classList.add('columns-video-col');
  return loadBlock(video);
}

/**
 * Leading video of a text cell (source video component above the cell's title/text): the first
 * paragraphs holding only the poster picture(s) and video link(s) → a nested Video block.
 */
function decorateLeadingVideo(cell, block) {
  const lead = [];
  const kids = [...cell.children];
  for (let i = 0; i < kids.length; i += 1) {
    const el = kids[i];
    if (el.tagName !== 'P' && el.tagName !== 'PICTURE') break;
    const clone = el.cloneNode(true);
    clone.querySelectorAll('picture, img').forEach((n) => n.remove());
    const refs = [...getVideoRefs(el).map((v) => v.url), ...getImageRefs(el).map((r) => r.url)];
    clone.querySelectorAll('a[href]').forEach((a) => { if (refs.includes(a.href)) a.remove(); });
    const media = el.querySelector('picture, img') || refs.length;
    if (!media || (clone.textContent.trim() && !isAiLabelMarker(el))) break;
    lead.push(el);
  }
  if (!lead.length || !lead.some((el) => getVideoRefs(el).length)) return null;
  const opts = [...block.classList].filter((c) => c.startsWith('video-')).map((c) => c.substring(6));
  if (lead.some((el) => isAiLabelMarker(el)) && !opts.includes('ai-label')) opts.push('ai-label');
  lead.filter((el) => isAiLabelMarker(el)).forEach((el) => el.remove());
  const media = lead.filter((el) => el.isConnected);
  const video = nestedBlock('video', opts, [[media]]);
  cell.prepend(video);
  return loadBlock(video);
}

/** Option link-lists: each (heading +) list of a text cell → a nested Link List block with the
 * link-list-<option> options (e.g. the sitemap columns). */
function decorateLinkLists(cell, block) {
  const opts = [...block.classList].filter((c) => c.startsWith('link-list-')).map((c) => c.substring(10));
  const loads = [];
  let pending = [];
  [...cell.children].forEach((el) => {
    if (/^H[1-6]$/.test(el.tagName)) {
      pending = [el];
      return;
    }
    if (el.tagName !== 'UL' && el.tagName !== 'OL') {
      pending = [];
      return;
    }
    const nodes = [...pending, el];
    const list = nestedBlock('link-list', opts, []);
    nodes[0].before(list);
    list.append(blockRow([nodes]));
    loads.push(loadBlock(list));
    pending = [];
  });
  return loads;
}

/** ":download: <a>" paragraph (the published pipeline turns the token into span.icon-download). */
function isDownloadParagraph(el) {
  if (el.tagName !== 'P' || el.querySelectorAll('a[href]').length !== 1) return false;
  if (el.textContent.trim().startsWith(DOWNLOAD_TOKEN)) return true;
  const first = el.firstElementChild;
  return !!first && first.matches('span.icon-download') && !el.firstChild.textContent.trim()
    && el.textContent.trim() === el.querySelector('a[href]').textContent.trim();
}

/** Consecutive ":download:" paragraphs of a text cell → one nested Download block. */
function decorateDownloads(cell, block) {
  const loads = [];
  let group = null;
  [...cell.children].forEach((el) => {
    if (!isDownloadParagraph(el)) {
      group = null;
      return;
    }
    const a = el.querySelector('a[href]');
    const link = document.createElement('a');
    link.href = a.href;
    link.textContent = a.textContent.trim();
    const meta = (a.title || '').trim();
    if (!group) {
      group = nestedBlock('download', block.classList.contains('download-outline') ? ['outline'] : [], []);
      el.before(group);
      loads.push(group);
    }
    group.append(blockRow(meta ? [link, meta] : [link]));
    el.remove();
  });
  return loads.map((d) => loadBlock(d));
}

/** A cell whose only content is one or more images (picture/img or image links). */
function isMediaCell(cell) {
  if (cell.querySelector('h1, h2, h3, h4, h5, h6')) return false;
  const refs = getImageRefs(cell);
  if (!refs.length) return false;
  const clone = cell.cloneNode(true);
  clone.querySelectorAll('picture, img').forEach((n) => n.remove());
  clone.querySelectorAll(':scope > p').forEach((n) => { if (isAiLabelMarker(n)) n.remove(); });
  clone.querySelectorAll('a[href]').forEach((a) => {
    if (refs.some((r) => r.url === a.href)) a.remove();
  });
  return !clone.textContent.trim();
}

function decorateMediaCell(cell, spanOf12) {
  const aiLabel = takeAiLabelMarkers(cell);
  const [desktop, mobile, tablet] = getImageRefs(cell);
  const vw = Math.round((spanOf12 / 12) * 100);
  const picture = buildResponsivePicture([
    { media: '(max-width: 767px)', url: (mobile || desktop).url, widths: [480, 767, 1023] },
    { media: '(max-width: 1279px)', url: (tablet || mobile || desktop).url, widths: [767, 1023, 1279] },
    { url: desktop.url, widths: [767, 1279, 1919, 2560] },
  ], { alt: desktop.alt, sizes: `(min-width: 768px) ${vw}vw, 100vw` });
  cell.replaceChildren(picture);
  cell.classList.add('columns-img-col');
  if (aiLabel) markAiLabel(picture);
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

export default async function decorate(block) {
  const loads = [];
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

  // img-D-M-S: leading images of text cells span D/M/S twelfths of the cell (desktop/tablet/phone)
  const imgClass = [...block.classList].find((c) => IMG_RE.test(c));
  if (imgClass) {
    const [, d, m, sm] = imgClass.match(IMG_RE);
    block.style.setProperty('--columns-img-span', d);
    block.style.setProperty('--columns-img-md-span', m);
    block.style.setProperty('--columns-img-sm-span', sm);
  }

  const reverse = block.classList.contains('reverse');
  rows.forEach((row) => {
    row.classList.add('columns-row');
    [...row.children].forEach((cell, i) => {
      if (reverse) cell.style.setProperty('--columns-order', row.children.length - i);
      const span = spans[i] || Math.max(1, Math.floor(12 / row.children.length));
      if (spans.length) cell.style.setProperty('--columns-span', Math.min(12, span));
      if (spans.length && mdSpans[i]) cell.style.setProperty('--columns-md-span', Math.min(12, mdSpans[i]));
      if (insets[i]) cell.classList.add(`columns-inset-${insets[i]}`);
      unwrapCell(cell);
      if (isVideoCell(cell)) {
        loads.push(decorateVideoCell(cell, block));
      } else if (isMediaCell(cell)) {
        decorateMediaCell(cell, span);
      } else {
        cell.classList.add('columns-text-col');
        decorateResponsiveImages(cell, { sizes: `(min-width: 768px) ${Math.round((span / 12) * 100)}vw, 100vw` });
        const leadVideo = decorateLeadingVideo(cell, block);
        if (leadVideo) loads.push(leadVideo);
        if (imgClass) {
          const lead = cell.firstElementChild;
          const pic = lead && (lead.tagName === 'PICTURE' ? lead : lead.querySelector(':scope > picture'));
          if (pic && (lead === pic || !lead.textContent.trim())) lead.classList.add('columns-lead-img');
        }
        loads.push(...decorateDownloads(cell, block));
        if (block.classList.contains('link-lists')) loads.push(...decorateLinkLists(cell, block));
        decorateTextCell(cell);
      }
    });
  });
  await Promise.all(loads);
}
