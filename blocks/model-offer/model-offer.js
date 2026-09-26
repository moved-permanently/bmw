import { createInfoButton, decorateFontIcons } from '../../scripts/bmw-utils.js';

/*
 * Model Offer (source .cmp-modeloffer): slider of leasing offer cards (flag, model name, subtitle,
 * car image linking to the offer form, monthly rate, total price, check-mark facts) with the
 * consumption small print below each card. Two cards per view on desktop (option slides-3: three),
 * one on mobile; arrows and dots.
 *  One row per offer:
 *   [car image (link) | flag paragraph, h3 model name, subtitle | price entries "label<br>value",
 *    list of leasing facts | disclaimer | info-i texts: list items "<strong>label</strong> text"]
 * Disclaimers mentioning WLTP get the shared WLTP info-i text (/de/fragments/wltp-info).
 */

const WLTP_FRAGMENT = '/de/fragments/wltp-info';
let wltpPromise;

function contentPrefix() {
  const { pathname } = window.location;
  const idx = pathname.indexOf('/de/');
  return idx > 0 ? pathname.substring(0, idx) : '';
}

function loadWltp() {
  if (!wltpPromise) {
    wltpPromise = fetch(`${contentPrefix()}${WLTP_FRAGMENT}.plain.html`)
      .then((r) => (r.ok ? r.text() : ''))
      .then((html) => {
        const d = document.createElement('div');
        d.innerHTML = html;
        const inner = d.children.length === 1 && d.firstElementChild.tagName === 'DIV' ? d.firstElementChild : d;
        return inner.innerHTML.trim();
      })
      .catch(() => '');
  }
  return wltpPromise;
}

const norm = (s) => (s || '').replace(/\s+/g, ' ').trim().toLowerCase();

function tipsOf(cell) {
  const map = new Map();
  if (!cell) return map;
  cell.querySelectorAll('li').forEach((li) => {
    const strong = li.querySelector('strong');
    if (!strong) return;
    const key = norm(strong.textContent);
    strong.remove();
    const d = document.createElement('div');
    d.append(...li.childNodes);
    map.set(key, d);
  });
  return map;
}

function buildCard(cells) {
  const [imgCell, infoCell, priceCell, discCell, tipCell] = cells;
  const tips = tipsOf(tipCell);
  const slide = document.createElement('li');
  slide.className = 'model-offer-slide';
  const card = document.createElement('div');
  card.className = 'model-offer-card';

  const info = document.createElement('div');
  info.className = 'model-offer-info';
  if (infoCell) {
    const heading = infoCell.querySelector('h1, h2, h3, h4, h5, h6');
    let beforeHeading = !!heading;
    [...infoCell.children].forEach((el) => {
      if (el === heading) {
        beforeHeading = false;
        const h = document.createElement('h3');
        h.className = 'model-offer-name';
        h.append(...el.childNodes);
        const tip = tips.get(norm(h.textContent));
        if (tip) h.append(createInfoButton(tip, { label: 'Ausstattungsdetails' }));
        info.append(h);
      } else if (beforeHeading) {
        // paragraphs before the name: first = flag, further = body type
        el.className = info.querySelector('.model-offer-flag') ? 'model-offer-bodytype' : 'model-offer-flag';
        info.append(el);
      } else {
        el.classList.add('model-offer-subtitle');
        info.append(el);
      }
    });
  }
  const flag = info.querySelector('.model-offer-flag');
  if (flag) card.append(flag);
  card.append(info);

  const content = document.createElement('div');
  content.className = 'model-offer-content';
  const pic = imgCell && imgCell.querySelector('picture, img');
  if (pic) {
    const media = document.createElement('div');
    media.className = 'model-offer-image';
    const link = pic.closest('a');
    const node = link || pic.closest('picture') || pic;
    if (link) {
      link.target = '_blank';
      link.rel = 'noopener';
    }
    const img = node.querySelector('img') || node;
    img.loading = 'lazy';
    media.append(node);
    content.append(media);
  }
  const pricing = document.createElement('div');
  pricing.className = 'model-offer-pricing';
  if (priceCell) {
    [...priceCell.children].forEach((el) => {
      if (el.tagName === 'P') {
        const br = el.querySelector('br');
        const entry = document.createElement('div');
        entry.className = 'model-offer-price';
        if (br) {
          const label = document.createElement('p');
          label.className = 'model-offer-price-label';
          while (el.firstChild && el.firstChild !== br) label.append(el.firstChild);
          br.remove();
          const tip = tips.get(norm(label.textContent));
          if (tip) label.append(createInfoButton(tip, { label: `Informationen zu ${label.textContent.trim()}` }));
          const value = document.createElement('p');
          value.className = 'model-offer-price-value';
          value.append(...el.childNodes);
          entry.append(label, value);
        } else {
          el.className = 'model-offer-price-note';
          entry.append(el);
        }
        pricing.append(entry);
      } else if (el.matches('ul, ol')) {
        el.className = 'model-offer-facts';
        pricing.append(el);
      }
    });
  }
  content.append(pricing);
  card.append(content);
  slide.append(card);

  if (discCell && discCell.textContent.trim()) {
    const disc = document.createElement('div');
    disc.className = 'model-offer-disclaimer';
    disc.append(...discCell.childNodes);
    if (/WLTP/.test(disc.textContent)) {
      const holder = document.createElement('div');
      const target = disc.querySelector('p:last-child') || disc;
      loadWltp().then((html) => {
        if (!html) return;
        holder.innerHTML = html;
        target.append(createInfoButton(holder, { label: 'WLTP-Informationen' }));
      });
    }
    slide.append(disc);
  }
  return slide;
}

export default function decorate(block) {
  const rows = [...block.children].filter((r) => r.textContent.trim() || r.querySelector('img'));
  const track = document.createElement('ul');
  track.className = 'model-offer-track';
  rows.forEach((row) => track.append(buildCard([...row.children])));

  const prev = document.createElement('button');
  const next = document.createElement('button');
  [[prev, 'arrow_chevron_left', 'Zurück', 'prev'], [next, 'arrow_chevron_right', 'Weiter', 'next']].forEach(([b, icon, label, cls]) => {
    b.type = 'button';
    b.className = `model-offer-arrow model-offer-${cls}`;
    b.setAttribute('aria-label', label);
    b.innerHTML = `<span class="bmw-icon" data-icon="${icon}" aria-hidden="true">${icon}</span>`;
  });
  const dots = document.createElement('div');
  dots.className = 'model-offer-dots';
  const slides = [...track.children];
  const step = () => (slides[1] ? slides[1].offsetLeft - slides[0].offsetLeft : track.clientWidth);
  const perView = () => Math.max(1, Math.round(track.clientWidth / (step() || 1)));
  const renderDots = () => {
    const pages = Math.max(1, slides.length - perView() + 1);
    if (dots.children.length !== pages) {
      dots.replaceChildren();
      for (let i = 0; i < pages; i += 1) {
        const d = document.createElement('button');
        d.type = 'button';
        d.className = 'model-offer-dot';
        d.setAttribute('aria-label', `Angebot ${i + 1}`);
        d.addEventListener('click', () => track.scrollTo({ left: i * step(), behavior: 'smooth' }));
        dots.append(d);
      }
    }
    dots.hidden = pages < 2;
  };
  const update = () => {
    renderDots();
    const max = track.scrollWidth - track.clientWidth - 2;
    prev.hidden = track.scrollLeft <= 2;
    next.hidden = track.scrollLeft >= max;
    const idx = Math.round(track.scrollLeft / (step() || 1));
    [...dots.children].forEach((d, i) => d.classList.toggle('is-active', i === idx));
  };
  prev.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
  next.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
  track.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);

  const viewport = document.createElement('div');
  viewport.className = 'model-offer-viewport';
  viewport.append(track, prev, next);
  block.replaceChildren(viewport, dots);
  decorateFontIcons(block);
  requestAnimationFrame(update);
}
