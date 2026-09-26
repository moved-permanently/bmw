import { decorateFontIcons } from '../../scripts/bmw-utils.js';

/*
 * Preview Slider (source: <stl-preview-slider>, the BMW Stock Locator preview of immediately
 * available new cars). Key/value rows: headline, link (stock locator results), teaser (headline of
 * the closing teaser card), series, model-range, fuel-types, sorting, brand.
 * The Stock Locator APIs only answer requests from www.bmw.de, so the vehicle cards cannot be
 * loaded here; the block shows the headline, the "Jetzt entdecken" link and the teaser card that
 * closes the source slider (both lead to the stock locator results for the model range).
 */

function readConfig(block) {
  const cfg = {};
  [...block.children].forEach((row) => {
    const [k, v] = row.children;
    if (!k || !v) return;
    const key = k.textContent.trim().toLowerCase().replace(/\s+/g, '-');
    cfg[key] = v;
  });
  return cfg;
}

function resultsUrl(cfg, link) {
  if (link && link.href) return link.href;
  const range = cfg['model-range'] ? cfg['model-range'].textContent.trim() : '';
  const base = 'https://www.bmw.de/de-de/sl/stocklocator/results';
  return range ? `${base}?modelRange=${encodeURIComponent(range)}` : base;
}

export default function decorate(block) {
  const cfg = readConfig(block);
  const headingSrc = cfg.headline && (cfg.headline.querySelector('h1, h2, h3, h4, h5, h6') || cfg.headline);
  const link = cfg.link && cfg.link.querySelector('a[href]');
  const url = resultsUrl(cfg, link);
  const linkText = (link && link.textContent.trim()) || 'Jetzt entdecken';
  const teaserText = cfg.teaser ? cfg.teaser.textContent.trim() : 'Mehr sofort verfügbare Fahrzeuge?';

  const header = document.createElement('div');
  header.className = 'preview-slider-header';
  if (headingSrc && headingSrc.textContent.trim()) {
    const h = document.createElement('h2');
    h.className = 'preview-slider-headline';
    h.textContent = headingSrc.textContent.trim();
    header.append(h);
  }
  const all = document.createElement('a');
  all.className = 'preview-slider-all';
  all.href = url;
  all.target = '_blank';
  all.rel = 'noopener';
  all.innerHTML = `<span>${linkText}</span><span class="icon icon-arrow_chevron_right"></span>`;
  header.append(all);

  const slider = document.createElement('div');
  slider.className = 'preview-slider-cards';
  const card = document.createElement('div');
  card.className = 'preview-slider-teaser';
  const title = document.createElement('p');
  title.className = 'preview-slider-teaser-title';
  title.textContent = teaserText;
  const cta = document.createElement('a');
  cta.className = 'button secondary';
  cta.href = url;
  cta.target = '_blank';
  cta.rel = 'noopener';
  cta.textContent = linkText;
  const ctaWrap = document.createElement('p');
  ctaWrap.className = 'button-wrapper';
  ctaWrap.append(cta);
  card.append(title, ctaWrap);
  slider.append(card);

  block.replaceChildren(header, slider);
  decorateFontIcons(block);
}
