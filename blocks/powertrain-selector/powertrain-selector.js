import { decorateFontIcons } from '../../scripts/bmw-utils.js';

/*
 * Powertrain Selector (source .cmp-powertrainselector): centered title and 1-4 gradient cards
 * pointing to other drivetrains/variants of the model. Desktop: cards side by side, always open,
 * the whole card links to its CTA. Mobile (< 1024px): cards are accordions (plus / minus).
 *  Row 1 (optional): title (heading only).
 *  Other rows: one card each — heading, description, CTA link.
 */

const DESKTOP_MQ = window.matchMedia('(min-width: 1024px)');
let seq = 0;

function isTitleRow(row) {
  const c = row.querySelector(':scope > div');
  if (!c) return false;
  const heading = c.querySelector('h1, h2, h3, h4, h5, h6');
  return !!heading && !c.querySelector('a[href]')
    && [...c.children].every((e) => /^H[1-6]$/.test(e.tagName) || (e.tagName === 'P' && e.querySelector('picture, img')));
}

export default function decorate(block) {
  seq += 1;
  const rows = [...block.children].filter((r) => r.textContent.trim());
  let title = null;
  if (rows.length && isTitleRow(rows[0])) {
    title = document.createElement('div');
    title.className = 'powertrain-selector-title';
    title.append(...rows.shift().firstElementChild.childNodes);
  }

  const items = document.createElement('div');
  items.className = 'powertrain-selector-items';
  const detailsList = [];
  rows.forEach((row, i) => {
    const content = document.createElement('div');
    [...row.children].forEach((c) => content.append(...c.childNodes));
    const heading = content.querySelector('h1, h2, h3, h4, h5, h6');
    const link = [...content.querySelectorAll('a[href]')].pop();

    const card = document.createElement('div');
    card.className = 'powertrain-selector-item';
    const details = document.createElement('details');
    details.className = 'powertrain-selector-details';
    const summary = document.createElement('summary');
    summary.className = 'powertrain-selector-summary';
    summary.id = `powertrain-selector-${seq}-${i}`;
    const summaryTitle = document.createElement('div');
    summaryTitle.className = 'powertrain-selector-item-title';
    if (heading) {
      // branding image in front of the heading (e.g. BMW M logo)
      const prev = heading.previousElementSibling;
      if (prev && prev.querySelector('picture, img') && !prev.textContent.trim()) {
        prev.classList.add('powertrain-selector-branding');
        summaryTitle.append(prev);
      }
      summaryTitle.append(heading);
    }
    summary.append(summaryTitle);
    const body = document.createElement('div');
    body.className = 'powertrain-selector-content';
    body.setAttribute('role', 'region');
    body.setAttribute('aria-labelledby', summary.id);
    [...content.children].forEach((el) => {
      const a = el.querySelector('a[href]');
      if (a && a === link && el.textContent.trim() === a.textContent.trim()) {
        el.className = 'powertrain-selector-cta';
        if (!a.classList.contains('button')) a.classList.add('link-arrow');
      } else if (!el.classList.contains('powertrain-selector-cta')) {
        el.classList.add('powertrain-selector-description');
      }
      body.append(el);
    });
    details.append(summary, body);
    card.append(details);
    if (link) {
      card.classList.add('has-link');
      // the whole card is clickable on desktop (like the source)
      card.addEventListener('click', (e) => {
        if (!DESKTOP_MQ.matches || e.target.closest('a')) return;
        link.click();
      });
    }
    detailsList.push(details);
    items.append(card);
  });
  items.dataset.items = String(Math.min(4, detailsList.length));

  const sync = () => {
    detailsList.forEach((d) => { d.open = DESKTOP_MQ.matches; });
  };
  detailsList.forEach((d) => {
    d.querySelector('summary').addEventListener('click', (e) => {
      if (DESKTOP_MQ.matches) e.preventDefault();
    });
  });
  sync();
  DESKTOP_MQ.addEventListener('change', sync);

  block.replaceChildren(...[title, items].filter(Boolean));
  decorateFontIcons(block);
}
