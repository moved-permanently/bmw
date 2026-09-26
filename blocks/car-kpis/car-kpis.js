import { decorateFontIcons } from '../../scripts/bmw-utils.js';

/*
 * Car KPIs (source .cmp-carKPIs): up to 3-4 big key figures with unit and label, separated by
 * diagonal lines on desktop, stacked on mobile. Figures roll in digit by digit when scrolled into
 * view (source "counter" animation).
 *  Rows: [value | unit | label]  (one row per KPI)
 *  Row with only links: CTA(s) below the figures (plain link = link with chevron).
 *  Row with only text (no link): footnotes.
 * Options: light (white text on dark backgrounds).
 */

const DIGIT_RE = /\d/;

function buildCounter(value) {
  const wrap = document.createElement('span');
  wrap.className = 'car-kpis-counter';
  wrap.setAttribute('aria-hidden', 'true');
  [...value].forEach((ch) => {
    if (DIGIT_RE.test(ch)) {
      const col = document.createElement('span');
      col.className = 'car-kpis-digit';
      const set = document.createElement('span');
      set.className = 'car-kpis-digit-set';
      set.dataset.target = ch;
      for (let d = 0; d <= 9; d += 1) {
        const n = document.createElement('span');
        n.textContent = d;
        set.append(n);
      }
      col.append(set);
      wrap.append(col);
    } else {
      const s = document.createElement('span');
      s.className = 'car-kpis-char';
      s.textContent = ch === ' ' ? ' ' : ch;
      wrap.append(s);
    }
  });
  return wrap;
}

function runCounters(block) {
  block.querySelectorAll('.car-kpis-digit-set').forEach((set, i) => {
    const target = Number(set.dataset.target);
    set.style.transitionDelay = `${(i % 6) * 40}ms`;
    set.style.transform = `translateY(-${target * 10}%)`;
  });
  block.classList.add('is-counted');
}

function isLinkRow(cells) {
  return cells.length && cells.every((c) => {
    const links = c.querySelectorAll('a[href]');
    const linkText = [...links].map((a) => a.textContent).join('').replace(/\s+/g, '');
    return links.length && c.textContent.replace(/\s+/g, '') === linkText;
  });
}

export default function decorate(block) {
  const list = document.createElement('ul');
  list.className = 'car-kpis-list';
  const ctas = document.createElement('div');
  ctas.className = 'car-kpis-ctas';
  const notes = document.createElement('div');
  notes.className = 'car-kpis-footnotes';

  [...block.children].forEach((row) => {
    const cells = [...row.children].filter((c) => c.textContent.trim() || c.querySelector('a, img'));
    if (!cells.length) return;
    if (isLinkRow(cells)) {
      cells.forEach((c) => c.querySelectorAll('a[href]').forEach((a) => {
        if (!a.classList.contains('button')) a.classList.add('link-arrow');
        const p = a.closest('p') || document.createElement('p');
        if (!p.contains(a)) p.append(a);
        ctas.append(p);
      }));
      return;
    }
    if (cells.length === 1) {
      // footnote row
      const note = document.createElement('div');
      note.className = 'car-kpis-footnote';
      note.append(...cells[0].childNodes);
      notes.append(note);
      return;
    }
    const [valueCell, unitCell, labelCell] = cells.length >= 3 ? cells : [cells[0], null, cells[1]];
    const value = valueCell.textContent.replace(/\s+/g, ' ').trim();
    const unit = unitCell ? unitCell.textContent.replace(/\s+/g, ' ').trim() : '';
    const li = document.createElement('li');
    li.className = 'car-kpis-item';
    const figure = document.createElement('p');
    figure.className = 'car-kpis-figure';
    const sr = document.createElement('span');
    sr.className = 'car-kpis-sr';
    sr.textContent = `${value} ${unit}`.trim();
    figure.append(sr, buildCounter(value));
    if (unit) {
      const u = document.createElement('span');
      u.className = 'car-kpis-unit';
      u.setAttribute('aria-hidden', 'true');
      u.textContent = unit;
      figure.append(u);
    }
    li.append(figure);
    if (labelCell) {
      const label = document.createElement('p');
      label.className = 'car-kpis-label';
      const src = labelCell.querySelector('p') && labelCell.children.length === 1
        ? labelCell.firstElementChild : labelCell;
      label.append(...src.childNodes);
      li.append(label);
    }
    list.append(li);
  });

  block.replaceChildren(list);
  if (ctas.children.length) block.append(ctas);
  if (notes.children.length) block.append(notes);
  decorateFontIcons(block);

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced || !('IntersectionObserver' in window)) {
    block.classList.add('no-animation');
    runCounters(block);
    return;
  }
  const io = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) {
      io.disconnect();
      runCounters(block);
    }
  }, { threshold: 0.4 });
  io.observe(list);
}
