/*
 * Model Card (source .cmp-modelhubcard): large light-grey series name ("i5", "X3") behind a
 * cut-out car image; an optional second image (back view) replaces the front view on hover.
 *  Row 1: series name (+ optional subtitle paragraph) | car image(s) (front view, back view)
 *  Row 2 (optional): list of USPs shown as chips at the bottom.
 * Options: ratio-3x2 | ratio-4x3 | ratio-16x9 | ratio-21x9, light | transparent (background),
 * text-left | text-center | text-right (series name alignment).
 */

/**
 * Builds the model card markup (also used by other vehicle blocks).
 * @param {{name: string, subtitle?: string, images: Element[], usps?: string[]}} data
 * @returns {HTMLElement}
 */
export function buildModelCard({
  name, subtitle = '', images = [], usps = [],
}) {
  const card = document.createElement('div');
  card.className = 'model-card-card';
  const series = document.createElement('div');
  series.className = 'model-card-series';
  series.setAttribute('aria-hidden', 'true');
  const n = document.createElement('p');
  n.className = 'model-card-name';
  n.textContent = name || '';
  series.append(n);
  if (subtitle) {
    const s = document.createElement('p');
    s.className = 'model-card-subtitle';
    s.textContent = subtitle;
    series.append(s);
  }
  card.append(series);
  images.slice(0, 2).forEach((node, i) => {
    const wrap = document.createElement('div');
    wrap.className = `model-card-image ${i ? 'model-card-image-back' : 'model-card-image-front'}`;
    const holder = document.createElement('div');
    holder.className = 'model-card-image-holder';
    holder.append(node);
    wrap.append(holder);
    card.append(wrap);
  });
  if (images.length > 1) card.classList.add('has-backview');
  if (usps.length) {
    const ul = document.createElement('ul');
    ul.className = 'model-card-usps';
    usps.forEach((u) => {
      const li = document.createElement('li');
      li.textContent = u;
      ul.append(li);
    });
    card.append(ul);
  }
  return card;
}

/** Car image nodes (img / picture, kept inside their link) of a cell, in authored order. */
export function cellImages(cell) {
  if (!cell) return [];
  return [...cell.querySelectorAll('picture, img')]
    .filter((el) => !(el.tagName === 'IMG' && el.closest('picture')))
    .map((el) => {
      const a = el.closest('a[href]');
      return a && cell.contains(a) ? a : el;
    })
    .filter((el, i, arr) => arr.indexOf(el) === i);
}

export default function decorate(block) {
  const [row, uspRow] = [...block.children];
  if (!row) return;
  const [nameCell, imageCell] = [...row.children];
  const paras = nameCell ? [...nameCell.querySelectorAll('p, h1, h2, h3, h4, h5, h6')] : [];
  const name = (paras[0] || nameCell || { textContent: '' }).textContent.trim();
  const subtitle = paras[1] ? paras[1].textContent.trim() : '';
  const images = cellImages(imageCell || nameCell);
  images.forEach((node) => {
    const img = node.tagName === 'IMG' ? node : node.querySelector('img');
    if (img) {
      img.loading = 'lazy';
      if (!img.alt) img.alt = name;
    }
  });
  const usps = uspRow ? [...uspRow.querySelectorAll('li')].map((li) => li.textContent.trim()) : [];
  block.replaceChildren(buildModelCard({
    name, subtitle, images, usps,
  }));
}
