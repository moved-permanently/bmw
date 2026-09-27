import { decorateFontIcons, bmwProxyUrl } from '../../scripts/bmw-utils.js';

/*
 * Preview Slider (source: <stl-preview-slider>, the BMW Stock Locator preview of immediately
 * available new cars). Key/value rows: headline, link (stock locator results), teaser (headline of
 * the closing teaser card), series, model-range, fuel-types, sorting, brand.
 *
 * Like the live web component (bmw.de clientlib vendor.webcom.js) the block loads the PUBLIC
 * stock locator config JSON, takes `config.general.dataService.apiKey` from it and sends it as
 * `x-api-key` with the vehicle search. Both requests go through the bmw-proxy worker (the APIs only
 * answer for Origin www.bmw.de). The original component cannot be embedded: it only accepts a
 * bmw.de/mini.de stock-locator-url. If anything fails, the block keeps the headline, the
 * "Jetzt entdecken" link and the teaser card that closes the source slider.
 */

const STOCK_LOCATOR = 'https://www.bmw.de/de-de/sl/stocklocator';
const CONFIG_PATH = '/de-de/sl/stocklocator/_jcr_content/stocklocator.config.json';
const SEARCH_HOST = 'vehicle-selection.prod.stolo.eu-central-1.aws.bmw.cloud';
const SEARCH_PATH = '/vehiclesearch/search/de-de/stocklocator';
const MAX_RESULTS = 5; // link-layout "card": 5 vehicles + teaser card

const FUEL_LABELS = {
  DIESEL: 'Diesel',
  GASOLINE: 'Benzin',
  PETROL: 'Benzin',
  ELECTRIC: 'Elektro',
  PHEV: 'Plug-in-Hybrid',
};
const FUEL_ICONS = {
  DIESEL: 'fuel_type_diesel',
  GASOLINE: 'fuel_type_petrol',
  PETROL: 'fuel_type_petrol',
  ELECTRIC: 'fuel_type_bev',
  PHEV: 'fuel_type_phev',
};
const TRANSMISSION_LABELS = { AUTOMATIC: 'Automatik', MANUAL: 'Schaltgetriebe' };
const USAGE_LABELS = { NEW: 'Neuwagen', DEMO: 'Vorführwagen', USED: 'Gebrauchtwagen' };

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

const cfgText = (cfg, key) => (cfg[key] ? cfg[key].textContent.trim() : '');
const cfgList = (cfg, key) => cfgText(cfg, key).split(/[\s,]+/).filter(Boolean);

function resultsUrl(cfg, link) {
  if (link && link.href) return link.href;
  const range = cfgText(cfg, 'model-range');
  const base = `${STOCK_LOCATOR}/results`;
  return range ? `${base}?modelRange=${encodeURIComponent(range)}` : base;
}

function get(obj, path) {
  return path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function icon(name) {
  return el('span', `icon icon-${name}`);
}

// consumption values with one decimal (5,5 l/100km; 1,0 l/100km), emissions as integers
const num = (v, digits = 1) => (typeof v === 'number'
  ? v.toLocaleString('de-DE', { minimumFractionDigits: digits, maximumFractionDigits: digits }) : '');

/* ------------------------------------------------------------------ data */

/**
 * Search request body (same shape as the live component: searchContext[0].model.series /
 * .model.modelRange / .degreeOfElectrificationBasedFuelType, resultsContext.sort).
 */
export function buildSearchBody(cfg) {
  const context = {};
  const series = cfgList(cfg, 'series');
  const ranges = cfgList(cfg, 'model-range');
  const fuels = cfgList(cfg, 'fuel-types');
  if (series.length || ranges.length) {
    context.model = {};
    if (series.length) context.model.series = { value: series };
    if (ranges.length) context.model.modelRange = { value: ranges };
  }
  if (fuels.length) context.degreeOfElectrificationBasedFuelType = { value: fuels };
  const m = (cfgText(cfg, 'sorting') || 'PRODUCTION_DATE_ASC').match(/^(.+)_(ASC|DESC)$/i);
  const sort = m ? [{ by: m[1].toUpperCase(), order: m[2].toUpperCase() }] : [];
  return { searchContext: [context], resultsContext: { sort } };
}

async function fetchJson(url, init) {
  const res = await fetch(url, init);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
}

async function loadVehicles(cfg) {
  const brand = cfgText(cfg, 'brand') || 'BMW';
  const config = await fetchJson(bmwProxyUrl(`${CONFIG_PATH}?brand=${encodeURIComponent(brand)}`));
  const apiKey = get(config, 'config.general.dataService.apiKey');
  if (!apiKey) throw new Error('no apiKey in stock locator config');
  let host = SEARCH_HOST;
  try {
    const base = get(config, 'config.general.vehicleSelection.baseUrl');
    if (base && /\.bmw\.cloud$/.test(new URL(base).hostname)) host = new URL(base).hostname;
  } catch {
    // keep the default host
  }
  const qs = new URLSearchParams({ maxResults: MAX_RESULTS, brand, context: 'preview-slider' });
  const data = await fetchJson(bmwProxyUrl(`/${host}${SEARCH_PATH}?${qs}`), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey },
    body: JSON.stringify(buildSearchBody(cfg)),
  });
  return (data.hits || []).map((h) => h.vehicle).filter(Boolean).slice(0, MAX_RESULTS);
}

/* ------------------------------------------------------------------ cards */

function vehicleImage(v) {
  const cosy = get(v, 'media.cosyImages') || {};
  return cosy['exteriorImage-null'] || cosy['exterior360ViewImage-0']
    || (get(v, 'media.usedCarImageList.OTHER') || [])[0] || '';
}

function powerText(v) {
  const raw = {};
  (get(v, 'vehicleSpecification.technicalAndEmission.technicalData.otdRawData') || [])
    .forEach(({ key, value }) => { raw[key] = value; });
  const kw = raw.C_LEIST_GES_KOMM || raw.C_LEISTUNG;
  const ps = raw.C_LEIST_GES_KOMM_PS || raw.C_LEISTUNG_PS;
  if (!kw) return '';
  return ps ? `${kw} kW (${ps} PS)` : `${kw} kW`;
}

/** Pkw-EnVKV consumption / emission lines of a vehicle. */
export function emissionLines(v) {
  const e = get(v, 'vehicleSpecification.technicalAndEmission.emissionData') || {};
  const fuel = get(v, 'vehicleSpecification.technicalAndEmission.technicalData.degreeOfElectrificationBasedFuelType');
  const cls = get(e, 'efficiencyClassEnVkv.combined');
  const lines = [];
  const add = (label, value) => { if (value) lines.push([label, value]); };
  if (fuel === 'PHEV') {
    const kwh = get(e, 'wltpElectricConsumptionAcWeighted.kWh/100km');
    const l = get(e, 'wltpFuelConsumptionWeighted.l/100km');
    add('Energieverbrauch gewichtet kombiniert (WLTP)', [kwh !== undefined && `${num(kwh)} kWh/100km`, l !== undefined && `${num(l)} l/100km`].filter(Boolean).join(' und '));
    const co2 = get(e, 'wltpCo2Weighted.g/km');
    add('CO₂-Emissionen gewichtet kombiniert (WLTP)', co2 !== undefined && `${num(co2, 0)} g/km`);
    add('CO₂-Klasse gewichtet kombiniert', cls);
    const lNoBat = get(e, 'wltpFuelConsumptionChargeSustaining.l/100km.combined');
    add('Kraftstoffverbrauch bei entladener Batterie kombiniert (WLTP)', lNoBat !== undefined && `${num(lNoBat)} l/100km`);
    const noBat = get(e, 'efficiencyClassEnVkv.noBat');
    add('CO₂-Klasse bei entladener Batterie', noBat && noBat !== '-' && noBat);
    return lines;
  }
  if (fuel === 'ELECTRIC') {
    const kwh = get(e, 'wltpElectricConsumption.kWh/100km.combined');
    add('Energieverbrauch (WLTP, kombiniert)', kwh !== undefined && `${num(kwh)} kWh/100km`);
    add('CO₂-Emissionen (WLTP, kombiniert)', '0 g/km');
  } else {
    const l = get(e, 'wltpFuelConsumption.l/100km.combined');
    add('Energieverbrauch (WLTP, kombiniert)', l !== undefined && `${num(l)} l/100km`);
    const co2 = get(e, 'wltpCo2.g/km.combined');
    add('CO₂-Emissionen (WLTP, kombiniert)', co2 !== undefined && `${num(co2, 0)} g/km`);
  }
  add('CO₂-Klasse', cls);
  return lines;
}

function priceBlock(v) {
  const wrap = el('div', 'preview-slider-card-prices');
  const price = get(v, 'pricing.price');
  const rate = get(v, 'pricing.monthlyInstallment');
  if (rate && rate.value) {
    const col = el('div', 'preview-slider-card-price is-rate');
    col.append(el('p', 'preview-slider-card-price-label', rate.label || 'Monatliche Rate'));
    // API value: "1.077,18 €/Monat ¹" -> "1.077,18 €" + footnote marker (as rendered live)
    const amount = String(rate.value).replace(/[\s\u00a0]*¹\s*$/, '').replace(/\/\s*Monat$/i, '').trim();
    const value = el('p', 'preview-slider-card-price-value', amount);
    value.append(el('sup', '', '1'));
    col.append(value);
    wrap.append(col);
  }
  if (price && price.formattedPrice) {
    const col = el('div', 'preview-slider-card-price');
    col.append(el('p', 'preview-slider-card-price-label', price.label || 'Preis'));
    col.append(el('p', 'preview-slider-card-price-value', price.formattedPrice));
    wrap.append(col);
  }
  const out = [wrap];
  if (rate && rate.rateInfo) {
    const note = el('p', 'preview-slider-card-footnote');
    note.append(el('span', 'preview-slider-card-footnote-index', '1'));
    const text = el('span', '', `${rate.rateInfo}, `);
    if (rate.sumOfAllTotalPayments) text.append(el('strong', '', rate.sumOfAllTotalPayments));
    note.append(text);
    out.push(note);
  }
  return out;
}

function keyFacts(v) {
  const spec = get(v, 'vehicleSpecification') || {};
  const fuel = get(spec, 'technicalAndEmission.technicalData.degreeOfElectrificationBasedFuelType');
  const facts = [
    [FUEL_ICONS[fuel] || 'fuel_type_petrol', FUEL_LABELS[fuel] || get(spec, 'technicalAndEmission.technicalData.recommendedFuelType')],
    [get(spec, 'modelAndOption.transmission') === 'AUTOMATIC' ? 'transmission_automatic' : 'transmission',
      TRANSMISSION_LABELS[get(spec, 'modelAndOption.transmission')]],
    ['gauge', powerText(v)],
  ].filter(([, text]) => text);
  const list = el('ul', 'preview-slider-card-facts');
  facts.forEach(([name, text]) => {
    const li = el('li');
    li.append(icon(name), el('span', '', text));
    list.append(li);
  });
  return list;
}

export function buildCard(v, detailsBase = STOCK_LOCATOR) {
  const model = get(v, 'vehicleSpecification.modelAndOption.model.modelName') || '';
  const brand = get(v, 'vehicleSpecification.modelAndOption.brand') || 'BMW';
  const name = `${brand} ${model}`.trim();
  const range = get(v, 'vehicleSpecification.modelAndOption.modelRange.name');
  const details = `${detailsBase}/details/${encodeURIComponent(v.vssId || '')}${range ? `?modelRange=${encodeURIComponent(range)}` : ''}`;

  const card = el('div', 'preview-slider-card');
  const media = el('div', 'preview-slider-card-media');
  const src = vehicleImage(v);
  if (src) {
    const img = el('img');
    img.src = src;
    img.alt = name;
    img.loading = 'lazy';
    media.append(img);
  }
  const body = el('div', 'preview-slider-card-body');
  body.append(el('h3', 'preview-slider-card-title', name));
  const usage = USAGE_LABELS[get(v, 'ordering.orderData.usageStateOnline')];
  if (usage) body.append(el('span', 'preview-slider-card-tag', usage));
  const pricing = el('div', 'preview-slider-card-pricing');
  pricing.append(...priceBlock(v));
  body.append(pricing);
  body.append(keyFacts(v));
  const emissions = el('ul', 'preview-slider-card-emissions');
  emissionLines(v).forEach(([label, value]) => emissions.append(el('li', '', `${label} ${value}`)));
  body.append(emissions);
  const cta = el('a', 'button secondary', 'Details anzeigen');
  cta.href = details;
  cta.target = '_blank';
  cta.rel = 'noopener';
  cta.setAttribute('aria-label', `Details anzeigen: ${name}`);
  const ctaWrap = el('p', 'button-wrapper preview-slider-card-cta');
  ctaWrap.append(cta);
  body.append(ctaWrap);
  card.append(media, body);
  return card;
}

/* ------------------------------------------------------------------ slider */

function setupSlider(block, track) {
  const nav = el('div', 'preview-slider-nav');
  const prev = el('button', 'preview-slider-arrow prev');
  const next = el('button', 'preview-slider-arrow next');
  prev.type = 'button';
  next.type = 'button';
  prev.setAttribute('aria-label', 'Zurück');
  next.setAttribute('aria-label', 'Weiter');
  prev.append(icon('arrow_chevron_left'));
  next.append(icon('arrow_chevron_right'));
  const dots = el('div', 'preview-slider-dots');
  nav.append(dots);
  const frame = track.parentElement;
  frame.append(prev, next);
  block.append(nav);

  const step = () => {
    const card = track.firstElementChild;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    return card ? card.getBoundingClientRect().width + gap : track.clientWidth;
  };
  const perPage = () => Math.max(1, Math.round(track.clientWidth / step()));
  const pages = () => Math.max(1, Math.ceil(track.children.length / perPage()));
  const scrollToPage = (i) => track.scrollTo({ left: i * perPage() * step(), behavior: 'smooth' });

  // like the source, price areas share one height so key facts / emissions line up across cards
  let lastWidth = 0;
  const equalize = () => {
    if (track.clientWidth === lastWidth) return;
    lastWidth = track.clientWidth;
    const areas = [...track.querySelectorAll('.preview-slider-card-pricing')];
    areas.forEach((a) => { a.style.minHeight = ''; });
    const max = Math.max(0, ...areas.map((a) => a.offsetHeight));
    areas.forEach((a) => { a.style.minHeight = `${max}px`; });
  };

  const update = () => {
    equalize();
    const total = pages();
    const max = track.scrollWidth - track.clientWidth;
    const current = max <= 1 ? 0 : Math.round((track.scrollLeft / max) * (total - 1));
    if (dots.children.length !== total) {
      dots.replaceChildren(...Array.from({ length: total }, (_, i) => {
        const dot = el('button', 'preview-slider-dot');
        dot.type = 'button';
        dot.setAttribute('aria-label', `Seite ${i + 1} von ${total}`);
        dot.addEventListener('click', () => scrollToPage(i));
        return dot;
      }));
    }
    [...dots.children].forEach((d, i) => d.classList.toggle('is-active', i === current));
    prev.hidden = track.scrollLeft <= 1;
    next.hidden = track.scrollLeft >= max - 1;
    nav.hidden = total < 2;
  };
  prev.addEventListener('click', () => track.scrollBy({ left: -perPage() * step(), behavior: 'smooth' }));
  next.addEventListener('click', () => track.scrollBy({ left: perPage() * step(), behavior: 'smooth' }));
  track.addEventListener('scroll', () => window.requestAnimationFrame(update), { passive: true });
  if (window.ResizeObserver) new ResizeObserver(update).observe(track);
  update();
}

async function renderVehicles(block, cfg, slider) {
  let vehicles;
  try {
    vehicles = await loadVehicles(cfg);
  } catch {
    return; // fallback (headline, link, teaser card) stays
  }
  if (!vehicles.length) return;
  const cards = vehicles.map((v) => buildCard(v));
  slider.prepend(...cards);
  block.classList.add('has-vehicles');
  decorateFontIcons(block);
  setupSlider(block, slider);
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

  const frame = document.createElement('div');
  frame.className = 'preview-slider-frame';
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
  frame.append(slider);

  block.replaceChildren(header, frame);
  decorateFontIcons(block);
  // vehicles load in the background; decorate does not wait for the Stock Locator APIs
  renderVehicles(block, cfg, slider);
}
