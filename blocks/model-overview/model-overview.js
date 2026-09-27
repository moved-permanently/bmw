import { createInfoButton, decorateFontIcons } from '../../scripts/bmw-utils.js';

/*
 * Model Overview (source .cmp-modeloverview): tabs (e.g. body types) with a horizontal slider of
 * model cards — car on a street backdrop, compare link, name, price (info-i), key facts with icons
 * or check-mark bullets, CTAs. Fact rows line up across the cards. Arrows on desktop, dots below
 * 1280px, swipe / scroll everywhere. The tab bar is hidden when there is only one tab.
 *  Rows:
 *   [tab title]                                    starts a tab ("(n)" model count is added)
 *   [car image (link) | h3 (+ branding image), price, facts list ("label <strong>value</strong>",
 *     icon from the label or a leading :icon:) or bullet list |
 *     CTA links (link to the compare page = compare icon on the image)]
 *   [text]                                         last row: info-i text shown next to the prices
 */

let seq = 0;
// source fact types (electricrange, chargingtime, additionalRangeDC, chargeAC, batteryCapacity)
const FACT_ICONS = [
  [/nachgeladen|high-power|hpc|added range/i, 'range_bev'],
  [/reichweite|range/i, 'battery_cell_loading'],
  [/ladezeit\s*ac|ac[\s-]*charg|wallbox/i, 'charging_wallbox'],
  [/ladezeit|charging time|dc/i, 'charging_electric'],
  [/batterie|battery|kapazit/i, 'battery'],
];
const isCompare = (a) => /vergleich/i.test(a.getAttribute('href') || '') || /vergleich/i.test(a.textContent);

function parse(block) {
  const tabs = [];
  let tab = null;
  let info = null;
  const rows = [...block.children];
  rows.forEach((row, i) => {
    const cells = [...row.children];
    if (!cells.some((c) => c.textContent.trim() || c.querySelector('img'))) return;
    if (cells.length === 1) {
      const isLast = rows.slice(i + 1).every((r) => r.children.length <= 1);
      if (isLast && tabs.some((t) => t.items.length)) {
        [info] = cells;
      } else {
        tab = { title: cells[0].textContent.replace(/\s+/g, ' ').trim(), items: [] };
        tabs.push(tab);
      }
      return;
    }
    if (!tab) {
      tab = { title: '', items: [] };
      tabs.push(tab);
    }
    const [imgCell, contentCell, ctaCell] = cells;
    tab.items.push({ imgCell, contentCell, ctaCell });
  });
  return { tabs: tabs.filter((t) => t.items.length), info };
}

function buildCard(item, infoNode) {
  const card = document.createElement('li');
  card.className = 'model-overview-card';
  const parts = { facts: [], bullets: null };

  // image + compare
  const media = document.createElement('div');
  media.className = 'model-overview-media';
  const pic = item.imgCell && item.imgCell.querySelector('picture, img');
  if (pic) {
    const link = pic.closest('a');
    const node = link || pic.closest('picture') || pic;
    const img = node.querySelector('img') || node;
    img.loading = 'lazy';
    if (link) link.classList.add('model-overview-image-link');
    media.append(node);
  }
  const links = item.ctaCell ? [...item.ctaCell.querySelectorAll('a[href]')] : [];
  const compare = links.find(isCompare);
  if (compare) {
    compare.className = 'model-overview-compare';
    compare.title = compare.textContent.trim();
    compare.setAttribute('aria-label', compare.textContent.trim());
    compare.textContent = '';
    media.append(compare);
  }
  parts.media = media;

  // header (branding + name)
  const content = item.contentCell || document.createElement('div');
  const header = document.createElement('div');
  header.className = 'model-overview-header';
  const heading = content.querySelector('h1, h2, h3, h4, h5, h6');
  const brandP = [...content.querySelectorAll('p')].find((p) => p.querySelector('img') && !p.textContent.trim());
  if (brandP) {
    const img = brandP.querySelector('img');
    img.className = 'model-overview-branding';
    header.append(img);
    brandP.remove();
  }
  if (heading) {
    const h = document.createElement('h3');
    h.append(...heading.childNodes);
    header.append(h);
    heading.remove();
  }
  parts.header = header;

  // price(s)
  const price = document.createElement('div');
  price.className = 'model-overview-price';
  [...content.querySelectorAll(':scope > p')].forEach((p, i) => {
    if (!p.textContent.trim()) return;
    if (i === 0 && infoNode) {
      // keep the price text in its own element, separate from the info-i button
      const value = document.createElement('span');
      value.className = 'model-overview-price-value';
      value.append(...p.childNodes);
      p.append(value, createInfoButton(infoNode, { label: 'Preisinformationen' }));
    }
    price.append(p);
  });
  parts.price = price;

  // facts (with icons) and bullets
  [...content.querySelectorAll(':scope > ul, :scope > ol')].forEach((list) => {
    const lis = [...list.children];
    const iconic = lis.some((li) => /^\s*:[a-z0-9_]+:/i.test(li.textContent) || li.querySelector('.icon, strong'));
    if (iconic) {
      lis.forEach((li) => {
        const fact = document.createElement('div');
        fact.className = 'model-overview-fact';
        const strong = li.querySelector('strong');
        const value = document.createElement('p');
        value.className = 'model-overview-fact-value';
        if (strong) value.append(...strong.childNodes);
        if (strong) strong.remove();
        const label = document.createElement('p');
        label.className = 'model-overview-fact-label';
        label.append(...li.childNodes);
        // leading ":icon:" text or span.icon
        const m = label.textContent.match(/^\s*:([a-z0-9_]+):\s*/i);
        if (m) {
          const walker = document.createTreeWalker(label, NodeFilter.SHOW_TEXT);
          const first = walker.nextNode();
          if (first) first.nodeValue = first.nodeValue.replace(/^\s*:[a-z0-9_]+:\s*/i, '');
          const icon = document.createElement('span');
          icon.className = 'icon';
          icon.classList.add(`icon-${m[1]}`);
          fact.append(icon);
        } else if (!li.querySelector('.icon')) {
          const hit = FACT_ICONS.find(([re]) => re.test(label.textContent));
          if (hit) {
            const icon = document.createElement('span');
            icon.className = `icon icon-${hit[1]}`;
            fact.append(icon);
          }
        }
        fact.append(label, value);
        parts.facts.push(fact);
      });
    } else {
      list.className = 'model-overview-bullets';
      parts.bullets = list;
    }
  });

  // CTAs
  const ctas = document.createElement('div');
  ctas.className = 'model-overview-ctas';
  links.filter((a) => a !== compare).forEach((a) => {
    const p = a.closest('p') || document.createElement('p');
    if (!p.contains(a)) p.append(a);
    if (!a.classList.contains('button')) a.classList.add('link-arrow');
    ctas.append(p);
  });
  parts.ctas = ctas;
  return { card, parts };
}

function buildSlider(tab, infoNode) {
  const built = tab.items.map((it) => buildCard(it, infoNode));
  const factRows = Math.max(0, ...built.map((b) => b.parts.facts.length));
  const hasBullets = built.some((b) => b.parts.bullets);
  built.forEach(({ card, parts }) => {
    card.append(parts.media, parts.header, parts.price);
    for (let i = 0; i < factRows; i += 1) {
      card.append(parts.facts[i] || Object.assign(document.createElement('div'), { className: 'model-overview-fact is-empty' }));
    }
    if (hasBullets) {
      // bullets mode (source): primary CTA above the check-mark list, links below
      const ctaEls = [...parts.ctas.children];
      const top = document.createElement('div');
      top.className = 'model-overview-ctas';
      if (ctaEls[0]) top.append(ctaEls[0]);
      card.append(top);
      card.append(parts.bullets || Object.assign(document.createElement('ul'), { className: 'model-overview-bullets' }));
      card.append(parts.ctas);
    } else {
      card.append(parts.ctas);
    }
  });
  const rows = 3 + factRows + (hasBullets ? 3 : 1);

  const slider = document.createElement('div');
  slider.className = 'model-overview-slider';
  const track = document.createElement('ul');
  track.className = 'model-overview-track';
  track.style.setProperty('--mo-rows', rows);
  built.forEach(({ card }) => {
    card.style.gridRow = `span ${rows}`;
    track.append(card);
  });
  const prev = document.createElement('button');
  const next = document.createElement('button');
  [[prev, 'arrow_chevron_left', 'Zurück', 'prev'], [next, 'arrow_chevron_right', 'Weiter', 'next']].forEach(([b, icon, label, cls]) => {
    b.type = 'button';
    b.className = `model-overview-arrow model-overview-${cls}`;
    b.setAttribute('aria-label', label);
    b.innerHTML = `<span class="bmw-icon" data-icon="${icon}" aria-hidden="true">${icon}</span>`;
  });
  const dots = document.createElement('div');
  dots.className = 'model-overview-dots';
  const cards = [...track.children];
  cards.forEach((c, i) => {
    const d = document.createElement('button');
    d.type = 'button';
    d.className = 'model-overview-dot';
    d.setAttribute('aria-label', `Modell ${i + 1}`);
    d.addEventListener('click', () => track.scrollTo({ left: c.offsetLeft - track.offsetLeft, behavior: 'smooth' }));
    dots.append(d);
  });
  const step = () => (cards[1] ? cards[1].offsetLeft - cards[0].offsetLeft : track.clientWidth);
  prev.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
  next.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
  const update = () => {
    const max = track.scrollWidth - track.clientWidth - 2;
    prev.hidden = track.scrollLeft <= 2;
    next.hidden = track.scrollLeft >= max;
    const idx = Math.round(track.scrollLeft / (step() || 1));
    [...dots.children].forEach((d, i) => d.classList.toggle('is-active', i === idx));
    dots.hidden = max <= 0;
  };
  track.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  slider.append(track, prev, next, dots);
  requestAnimationFrame(update);
  slider.update = update;
  return slider;
}

export default function decorate(block) {
  seq += 1;
  const { tabs, info } = parse(block);
  if (!tabs.length) return;
  const infoNode = info && info.textContent.trim() ? info : null;
  if (infoNode) infoNode.remove();

  const nav = document.createElement('div');
  nav.className = 'model-overview-tabs';
  const list = document.createElement('div');
  list.className = 'model-overview-tablist';
  list.setAttribute('role', 'tablist');
  nav.append(list);
  const panels = [];
  const buttons = [];
  const select = (i, focus = false) => {
    buttons.forEach((b, k) => {
      b.setAttribute('aria-selected', String(k === i));
      b.tabIndex = k === i ? 0 : -1;
      b.classList.toggle('is-active', k === i);
    });
    panels.forEach((p, k) => {
      p.hidden = k !== i;
      if (k === i) p.querySelector('.model-overview-slider').update();
    });
    if (focus) buttons[i].focus();
  };
  tabs.forEach((t, i) => {
    const id = `model-overview-${seq}-${i}`;
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'model-overview-tab';
    b.setAttribute('role', 'tab');
    b.id = `${id}-tab`;
    b.setAttribute('aria-controls', id);
    b.textContent = `${t.title || `Tab ${i + 1}`} (${t.items.length})`;
    b.addEventListener('click', () => select(i));
    b.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') select((i + 1) % tabs.length, true);
      if (e.key === 'ArrowLeft') select((i - 1 + tabs.length) % tabs.length, true);
    });
    buttons.push(b);
    list.append(b);
    const panel = document.createElement('div');
    panel.className = 'model-overview-panel';
    panel.id = id;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', b.id);
    panel.append(buildSlider(t, infoNode));
    panels.push(panel);
  });
  block.replaceChildren(...(tabs.length > 1 ? [nav] : []), ...panels);
  if (tabs.length < 2) block.classList.add('single-tab');
  decorateFontIcons(block);
  select(0);
}
