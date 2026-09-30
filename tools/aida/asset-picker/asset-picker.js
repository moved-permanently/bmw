import {
  countryForContext, filterAssets, facetValues, cropRegion, scene7Url, assetLink,
} from './model.js';

const PAGE_SIZE = 36;
const COUNTRY_NAMES = new Intl.DisplayNames(['en'], { type: 'region' });
const countryName = (code) => COUNTRY_NAMES.of(code.toUpperCase());
const sourceOrigin = 'https://main--bmw--moved-permanently.aem.page';

function options(select, values, label) {
  const selected = select.value;
  select.replaceChildren(new Option(label, ''));
  values.forEach((value) => select.append(new Option(value, value)));
  if (selected && !values.includes(selected)) select.append(new Option(selected, selected));
  select.value = selected;
}

export default function mountPicker(main, { assets, context = {}, actions = null }) {
  const find = (id) => main.querySelector(`#asset-${id}`);
  const initialCountry = countryForContext(context);
  const filters = { country: initialCountry };
  let limit = PAGE_SIZE;
  let selected = null;
  let dimensions = null;
  let previewRequest = 0;
  let loaded = false;
  let deliveryUrl = '';
  let inserting = false;
  const countries = [...new Set(['de', 'fr', 'at', 'be', initialCountry,
    ...assets.flatMap((asset) => asset.countries || [])])].filter(Boolean);
  countries.sort((a, b) => countryName(a).localeCompare(countryName(b)))
    .forEach((code) => find('country').append(new Option(countryName(code), code)));
  find('country').value = initialCountry;
  find('context').textContent = initialCountry
    ? `${countryName(initialCountry)} preselected from this document. Unlocalized images are included.`
    : 'No document country detected. Choose a country; unlocalized images are included.';
  if (!actions) find('context').textContent += ' Standalone preview: open through DA to insert.';

  function insertion() {
    find('message').textContent = '';
    const img = find('preview').querySelector('img');
    if (img) img.alt = find('decorative').checked ? '' : find('alt').value;
    let html = '';
    try {
      if (selected && deliveryUrl) {
        html = assetLink(selected, deliveryUrl, find('alt').value, find('decorative').checked);
      }
    } catch { /* alt text is still being edited */ }
    find('url').value = deliveryUrl;
    find('markup').value = html;
    find('insert').disabled = inserting || !actions || !loaded || !html;
    find('copy').disabled = !loaded || !html;
  }

  function preview() {
    if (!selected) return;
    previewRequest += 1;
    const request = previewRequest;
    const crop = find('crop').value;
    const ratio = find('framing').value;
    const region = ratio && dimensions
      ? cropRegion(dimensions.width, dimensions.height, ratio, find('anchor').value) : null;
    const modifiers = { crop, sharpen: find('sharpen').checked, ...(region ? { region } : {}) };
    deliveryUrl = scene7Url(selected, modifiers);
    loaded = false;
    insertion();
    const img = new Image();
    img.alt = find('decorative').checked ? '' : find('alt').value;
    img.onload = () => {
      if (request !== previewRequest) return;
      if (!dimensions) {
        dimensions = { width: img.naturalWidth, height: img.naturalHeight };
        if (ratio) { preview(); return; }
      }
      loaded = true;
      find('preview-status').textContent = `${img.naturalWidth} × ${img.naturalHeight} preview`;
      insertion();
    };
    img.onerror = () => {
      if (request !== previewRequest) return;
      loaded = false;
      find('preview-status').textContent = 'This rendition is unavailable. Try another crop or image.';
      insertion();
    };
    find('preview').replaceChildren(img);
    find('preview-status').textContent = 'Loading preview…';
    img.src = scene7Url(selected, { ...modifiers, width: 960 });
  }

  function choose(asset) {
    selected = asset;
    dimensions = null;
    find('browser').hidden = true;
    find('detail').hidden = false;
    find('title').textContent = asset.title;
    find('tags').textContent = [...asset.brands, ...asset.models,
      asset.kind === 'cosy' ? 'Vehicle render (COSY)' : 'Marketing'].join(' · ');
    find('alt').value = asset.alt || '';
    find('decorative').checked = false;
    find('alt').disabled = false;
    find('scene7').hidden = asset.kind === 'cosy';
    const crops = Object.keys(asset.crops || {}).sort();
    const crop = find('crop');
    crop.replaceChildren(new Option('As authored', ''));
    crops.forEach((name) => crop.append(new Option(name.replace('to', ':'), name)));
    crop.disabled = crops.length === 0;
    find('framing').value = '';
    find('anchor').value = 'center';
    find('anchor').disabled = true;
    find('sharpen').checked = new URL(asset.url).searchParams.get('op_sharpen') === '1';
    find('sources').replaceChildren(...asset.sources.map((path) => {
      const li = document.createElement('li');
      const link = document.createElement('a');
      link.href = new URL(path, sourceOrigin).href;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = path;
      li.append(link);
      return li;
    }));
    preview();
    find('back').focus();
  }

  function results() {
    ['brand', 'family', 'model'].forEach((key) => {
      options(find(key), facetValues(assets, filters, key), `All ${key === 'family' ? 'families' : `${key}s`}`);
    });
    const matched = filterAssets(assets, filters);
    find('count').textContent = `${matched.length} images · ${Math.min(limit, matched.length)} shown`;
    find('empty').hidden = matched.length !== 0;
    find('more').hidden = matched.length <= limit;
    const cards = matched.slice(0, limit).map((asset) => {
      const li = document.createElement('li');
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'asset-card';
      const img = new Image();
      img.alt = '';
      img.loading = 'lazy';
      img.decoding = 'async';
      img.src = scene7Url(asset, { width: 320 });
      const title = document.createElement('span');
      title.className = 'asset-card-title';
      title.textContent = asset.title;
      const tag = document.createElement('span');
      tag.className = 'asset-card-tag';
      tag.textContent = asset.kind === 'cosy' ? 'COSY' : 'Marketing';
      img.onerror = () => { tag.textContent = 'Unavailable'; button.disabled = true; };
      button.append(img, title, tag);
      button.addEventListener('click', () => choose(asset));
      li.append(button);
      return li;
    });
    find('results').replaceChildren(...cards);
  }

  find('filters').addEventListener('submit', (event) => event.preventDefault());
  ['kind', 'country', 'brand', 'family', 'model'].forEach((key) => {
    find(key).addEventListener('change', () => {
      filters[key] = find(key).value;
      if (['kind', 'country', 'brand'].includes(key)) {
        ['family', 'model'].forEach((child) => { filters[child] = ''; find(child).value = ''; });
      }
      if (key === 'family') { filters.model = ''; find('model').value = ''; }
      limit = PAGE_SIZE;
      results();
    });
  });
  find('search').addEventListener('input', () => {
    filters.search = find('search').value;
    limit = PAGE_SIZE;
    results();
  });
  find('reset').addEventListener('click', () => {
    find('filters').reset();
    Object.keys(filters).forEach((key) => { filters[key] = ''; });
    filters.country = initialCountry;
    find('country').value = initialCountry;
    limit = PAGE_SIZE;
    results();
  });
  find('more').addEventListener('click', () => { limit += PAGE_SIZE; results(); });
  find('back').addEventListener('click', () => {
    selected = null;
    previewRequest += 1;
    find('detail').hidden = true;
    find('browser').hidden = false;
    find('results').querySelector('button:not(:disabled)')?.focus();
  });
  find('crop').addEventListener('change', () => { dimensions = null; preview(); });
  find('framing').addEventListener('change', () => {
    find('anchor').disabled = !find('framing').value;
    preview();
  });
  find('anchor').addEventListener('change', preview);
  find('sharpen').addEventListener('change', preview);
  find('alt').addEventListener('input', insertion);
  find('decorative').addEventListener('change', () => {
    find('alt').disabled = find('decorative').checked;
    insertion();
  });
  find('insert').addEventListener('click', async () => {
    if (inserting || find('insert').disabled) return;
    inserting = true;
    find('insert').disabled = true;
    try {
      await actions.sendHTML(assetLink(selected, deliveryUrl, find('alt').value, find('decorative').checked));
      actions.closeLibrary();
    } catch {
      inserting = false;
      insertion();
      find('message').textContent = 'Could not insert the image. Please reopen the picker.';
    }
  });
  find('copy').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(find('markup').value);
      find('message').textContent = 'Image markup copied.';
    } catch {
      find('markup').closest('details').open = true;
      find('markup').select();
      find('message').textContent = 'Copy the selected markup manually.';
    }
  });
  results();
}

async function init() {
  const main = document.querySelector('.asset-picker');
  if (!main) return;
  try {
    const response = await fetch(new URL('./catalogue.json', import.meta.url));
    if (!response.ok) throw new Error('Catalogue could not be loaded');
    const assets = await response.json();
    let connection = { context: { path: new URLSearchParams(window.location.search).get('path') || '' } };
    if (window.parent !== window) {
      const { default: connect } = await import('../da.js');
      connection = await connect();
    }
    mountPicker(main, { assets, ...connection });
  } catch {
    main.querySelector('#asset-error').hidden = false;
    main.querySelector('#asset-error').textContent = 'BMW assets could not be loaded. Reopen the picker to try again.';
    main.querySelector('#asset-count').textContent = 'Catalogue unavailable';
  }
}

init();
