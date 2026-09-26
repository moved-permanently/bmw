/* eslint-disable */
/* global WebImporter */
// Parser for block "download" (source: .download.aem-GridColumn, cmp-download).
// Content model: one row per file: <a href="https://www.bmw.de/content/dam/…pdf">Label</a> | meta ("PDF, 113 KB").
// Consecutive download components (siblings in the same grid) are merged into one block.
// Source style "link-with-icon" (all instances) = the default rendering; "outline" → option.
import { replaceWithBlock, absUrl, text } from './_utils.js';

export const selectors = ['.download.aem-GridColumn'];

const FORMATS = {
  'application/pdf': 'PDF',
  'application/zip': 'ZIP',
  'application/msword': 'DOC',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
  'application/vnd.ms-excel': 'XLS',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'XLSX',
  'image/jpeg': 'JPG',
  'image/png': 'PNG',
};

function prop(root, name) {
  return text(root.querySelector(`.cmp-download__property--${name} .cmp-download__property-content`));
}

function blockName(el) {
  return /style-download--outline/.test(el.className) ? 'Download (outline)' : 'Download';
}

/** Header text of a block table created by WebImporter.Blocks.createBlock. */
function tableName(table) {
  const th = table && table.tagName === 'TABLE' && table.querySelector('tr > th, tr > td');
  return th ? text(th) : '';
}

export default function parse(element, { document }) {
  const cmp = element.querySelector('.cmp-download');
  if (!cmp) return;
  const a = cmp.querySelector('a.cmp-download__action, a[href]');
  if (!a || !a.getAttribute('href')) return;
  const label = text(cmp.querySelector('.cmp-download__action-text')) || text(cmp.querySelector('.cmp-download__title')) || prop(cmp, 'filename');
  const link = document.createElement('a');
  // assets stay on www.bmw.de (absolute DAM URL)
  link.href = absUrl(a.getAttribute('href'));
  link.textContent = label;

  const format = prop(cmp, 'format');
  const meta = [FORMATS[format] || (format.split('/').pop() || '').toUpperCase(), prop(cmp, 'size')].filter(Boolean).join(', ');
  const row = meta ? [link, meta] : [link];

  const name = blockName(element);
  const prev = element.previousElementSibling;
  if (prev && tableName(prev) === name) {
    // merge into the preceding download block
    const tmp = WebImporter.Blocks.createBlock(document, { name, cells: [row] });
    const rows = [...tmp.querySelectorAll('tr')].slice(1);
    const body = prev.querySelector('tbody') || prev;
    rows.forEach((r) => body.append(r));
    element.remove();
    return;
  }
  replaceWithBlock(document, element, name, [row]);
}
