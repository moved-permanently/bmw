/*
 * Model Compare (source cmp-compare, www.bmw.de/de/bmw-modelle-vergleichen.html): compare up to
 * three BMW models side by side (series / model / engine / transmission selection, cosy images,
 * prices,
 * CTAs, highlights, design view exterior/interior, technical data with "only differences" toggle,
 * footnotes, sticky header, delete with confirmation).
 * Content: row 1 = headline, row 2 = link to the source compare page.
 * Runtime data (www.bmw.de endpoints without CORS, through the bmw-proxy / window.BMW_PROXY):
 *   app template + model tree: {page}.html/content.q?extract=compare  (series/range/model tree in
 *                              data-config, rows of the technical data tables with their data keys)
 *   model data:                {page}/_jcr_content.technicaldata.{series}.{range}.{model}.json
 * Selections live in the URL hash: #{series}/{range}/{model}/{transmission}[/{...} x3]
 * (vehicle pages link here as /de/bmw-modelle-vergleichen#X/U11/21HM/A).
 */
import { bmwProxyUrl, createInfoButton } from '../../scripts/bmw-utils.js';

const MAX_COLUMNS = 3;
const FIELDS = 4; // series, range, model, transmission
const DEFAULT_PAGE = '/de/bmw-modelle-vergleichen.html';

const TEXT = {
  addVehicle: 'BMW Fahrzeug hinzufügen',
  chooseVehicle: 'Bitte wählen Sie ein Fahrzeug aus.',
  series: 'Serie',
  range: 'Modell',
  model: 'Motorisierung',
  transmission: 'Getriebe',
  emptySeries: 'Serie auswählen',
  emptyRange: 'Modell auswählen',
  emptyModel: 'Motorisierung auswählen',
  from: 'Ab',
  priceInfo: 'Preisinformation',
  cta1: 'Konfigurieren & Preise',
  cta2: 'Neuwagensuche',
  remove: 'Löschen',
  confirmRemove: 'Möchten Sie dieses Fahrzeug wirklich entfernen?',
  yes: 'Ja',
  no: 'Nein',
  exterior: 'Exterior',
  interior: 'Innenansicht',
  galleryHint: 'Bitte wählen Sie mindestens ein Fahrzeug aus.',
  onlyDifferences: 'Nur Unterschiede anzeigen',
  differencesShown: 'Nur Unterschiede werden angezeigt.',
  noDifferences: 'Die ausgewählten Modelle weisen in diesem Abschnitt keine Unterschiede auf.',
  loadError: 'Der Modellvergleich ist momentan nicht verfügbar.',
};

/* ------------------------------------------------------------------ helpers */

const clean = (s) => (s || '').replace(/\s+/g, ' ').trim();

function el(tag, className, textContent) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  if (textContent !== undefined) e.textContent = textContent;
  return e;
}

function icon(name, className = '') {
  const span = el('span', `bmw-icon ${className}`.trim(), name);
  span.dataset.icon = name;
  span.setAttribute('aria-hidden', 'true');
  return span;
}

function decodeB64Unicode(s) {
  const hex = (c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`;
  return decodeURIComponent(atob(s).split('').map(hex).join(''));
}

function pagePath(block) {
  const a = block.querySelector('a[href]');
  if (!a) return DEFAULT_PAGE;
  try {
    const u = new URL(a.getAttribute('href'), 'https://www.bmw.de/');
    let p = u.pathname;
    if (!p.endsWith('.html')) p = `${p.replace(/\/$/, '')}.html`;
    return p;
  } catch {
    return DEFAULT_PAGE;
  }
}

/** <picture> from a cosy image object {sources: [{url, media, mimeType}], fallback: {url}}. */
function cosyPicture(image, alt = '', className = '') {
  const picture = el('picture', className);
  if (!image) return picture;
  (image.sources || []).forEach((s) => {
    const source = document.createElement('source');
    source.srcset = s.url || s.srcset;
    if (s.media) source.media = s.media;
    if (s.mimeType) source.type = s.mimeType;
    picture.append(source);
  });
  const img = document.createElement('img');
  const fb = image.fallback || (image.sources || []).slice(-1)[0] || {};
  img.src = fb.url || fb.src || '';
  img.alt = alt || fb.alt || '';
  img.loading = 'lazy';
  img.decoding = 'async';
  picture.append(img);
  return picture;
}

/** Cosy image object from a template <picture>. */
function pictureData(picture) {
  if (!picture) return null;
  const sources = [...picture.querySelectorAll('source')].map((s) => ({
    url: s.getAttribute('srcset'), media: s.getAttribute('media'), mimeType: s.getAttribute('type'),
  }));
  const img = picture.querySelector('img');
  return { sources, fallback: { url: img ? img.getAttribute('src') : '' } };
}

/* ------------------------------------------------------------------ template */

function readTemplate(doc) {
  const cmp = doc.querySelector('.cmp-compare');
  if (!cmp) throw new Error('compare template missing');
  const config = JSON.parse(decodeB64Unicode(cmp.dataset.config || ''));
  const t = { ...TEXT };
  const q = (sel) => clean((cmp.querySelector(sel) || {}).textContent);
  t.addVehicle = q('.cmp-compare__placeholder .cmp-title__text') || t.addVehicle;
  t.chooseVehicle = q('.cmp-compare__placeholder p') || t.chooseVehicle;
  t.confirmRemove = q('.cmp-compare__popover .cmp-popover__title') || t.confirmRemove;
  t.onlyDifferences = q('.cmp-toggleswitch') || t.onlyDifferences;
  t.galleryHint = q('#cmp-compare__galleryhint .cmp-notification__message') || t.galleryHint;
  const selection = cmp.querySelector('.cmp-compare__selection');
  if (selection) {
    t.emptySeries = selection.dataset.emptySeriesText || t.emptySeries;
    t.emptyRange = selection.dataset.emptyRangeText || t.emptyRange;
    t.emptyModel = selection.dataset.emptyModelText || t.emptyModel;
    const label = (type) => clean((selection.querySelector(`.cmp-compare__dropdown--${type} .cmp-dropdown__label`) || {}).textContent);
    t.series = label('series') || t.series;
    t.range = label('ranges') || t.range;
    t.model = label('models') || t.model;
  }
  const ctas = [...cmp.querySelectorAll(
    '.cmp-compare__column-description .cmp-compare__column-cta .cmp-button__text',
  )];
  if (ctas[0]) t.cta1 = clean(ctas[0].textContent);
  if (ctas[1]) t.cta2 = clean(ctas[1].textContent);
  const tabs = [...cmp.querySelectorAll('.cmp-compare__designcomparison .cmp-tabs__tab')]
    .map((b) => clean(b.textContent));
  if (tabs[0]) [t.exterior] = tabs;
  if (tabs[1]) [, t.interior] = tabs;
  const priceInfo = cmp.querySelector('.cmp-compare__column-price [data-cmp-hook-tooltip="template"]');
  if (priceInfo) {
    t.priceInfo = q('.cmp-compare__column-price [data-cmp-hook-tooltip="heading"]') || t.priceInfo;
    const body = priceInfo.querySelector('[data-cmp-hook-tooltip="content"]');
    t.priceInfoHtml = body ? body.innerHTML.trim() : '';
  }
  t.disclaimer = q('.cmp-compare__disclaimer-item');

  const sections = [];
  const SECTIONS = [['highlights', '.cmp-compare__highlights'], ['technicaldetails', '.cmp-compare__technicaldetails']];
  SECTIONS.forEach(([id, sel]) => {
    const sec = cmp.querySelector(sel);
    if (!sec) return;
    const groups = [...sec.querySelectorAll('.cmp-accordion__item')].map((item) => {
      const button = item.querySelector('.cmp-accordion__button');
      const titleEl = item.querySelector('.cmp-accordion__title, .cmp-accordion__button-content') || button;
      const groupRef = item.querySelector('.cmp-accordion__header [data-path]');
      const rows = [...item.querySelectorAll('tr.cmp-comparetable__row')].map((tr) => {
        const th = tr.querySelector('th');
        const sup = th && th.querySelector('[data-path]');
        const labelEl = th ? th.cloneNode(true) : null;
        if (labelEl) labelEl.querySelectorAll('sup').forEach((s) => s.remove());
        const valueSup = tr.querySelector('td [data-path]');
        return {
          key: tr.dataset.key,
          label: clean(labelEl ? labelEl.textContent : tr.dataset.key),
          labelRef: sup ? sup.dataset.path : '',
          valueRef: valueSup ? valueSup.dataset.path.replace(/_\d+$/, '') : '',
          isEnergy: !!tr.querySelector('[data-is-energy]'),
        };
      }).filter((r) => r.key);
      return {
        title: clean(titleEl ? titleEl.textContent : ''),
        titleRef: groupRef ? groupRef.dataset.path : '',
        expanded: !button || button.classList.contains('cmp-accordion__button--expanded'),
        rows,
      };
    });
    sections.push({ id, title: clean((sec.querySelector('.cmp-title__text') || {}).textContent), groups });
  });
  const designTitle = q('.cmp-compare__designcomparison .cmp-title__text');
  const placeholders = [...cmp.querySelectorAll('.cmp-compare__header-area')]
    .map((area) => pictureData(area.querySelector('picture')));
  return {
    config, text: t, sections, designTitle, placeholders,
  };
}

/* ------------------------------------------------------------------ state */

function parseHash() {
  let hash = window.location.hash.replace(/^#/, '');
  try {
    hash = decodeURIComponent(hash);
  } catch {
    // keep raw
  }
  const parts = hash.split('/').filter(Boolean).map((p) => (p.toLowerCase() === 'null' ? null : p));
  const cols = [];
  for (let i = 0; i < parts.length && cols.length < MAX_COLUMNS; i += FIELDS) {
    const [series, range, model, transmission] = parts.slice(i, i + FIELDS);
    if (series && model) {
      cols.push({
        series, range, model, transmission: transmission || null,
      });
    }
  }
  return cols;
}

function writeHash(columns) {
  const parts = [];
  columns.forEach((c) => {
    if (c.selection.model) {
      const s = c.selection;
      parts.push(s.series || 'null', s.range || 'null', s.model, s.transmission || 'null');
    }
  });
  const url = new URL(window.location.href);
  url.hash = parts.length ? parts.join('/') : '';
  window.history.replaceState(window.history.state, '', url.href.replace(/#$/, ''));
}

const emptyColumn = () => ({
  selection: {
    series: null, range: null, model: null, transmission: null,
  },
  data: null,
  vehicle: null,
});

/* ------------------------------------------------------------------ block */

export default async function decorate(block) {
  const headline = block.querySelector('h1, h2, h3') || el('h1', '', 'BMW Modelle vergleichen.');
  const page = pagePath(block);
  const dataBase = page.replace(/\.html$/, '');
  block.replaceChildren();

  const head = el('div', 'model-compare-headline');
  headline.classList.add('model-compare-title');
  head.append(headline);
  const status = el('p', 'model-compare-status');
  block.append(head, status);

  let tpl;
  try {
    const resp = await fetch(bmwProxyUrl(`${page}/content.q?extract=compare`));
    if (!resp.ok) throw new Error(`template ${resp.status}`);
    const doc = new DOMParser().parseFromString(await resp.text(), 'text/html');
    tpl = readTemplate(doc);
  } catch {
    status.textContent = TEXT.loadError;
    block.classList.add('model-compare-error');
    return;
  }
  status.remove();
  const T = tpl.text;
  const { config } = tpl;

  const findSeries = (code) => config.find((s) => s.code === code);
  const findRange = (sel) => (findSeries(sel.series)?.modelRanges || [])
    .find((r) => r.code === sel.range);
  const findModel = (sel) => (findRange(sel)?.vehicles || []).find((v) => v.code === sel.model);

  const modelCache = new Map();
  const fetchModel = (sel) => {
    const key = `${sel.series}.${sel.range}.${sel.model}`;
    if (!modelCache.has(key)) {
      modelCache.set(key, fetch(bmwProxyUrl(`${dataBase}/_jcr_content.technicaldata.${key}.json`))
        .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`data ${r.status}`))))
        .catch((e) => {
          modelCache.delete(key);
          throw e;
        }));
    }
    return modelCache.get(key);
  };
  const pickVehicle = (data, transmission) => {
    if (!data || !data.data || !data.data.length) return null;
    const match = transmission && data.data.find((d) => d.transmissionId === transmission);
    return match || data.data[0];
  };

  /* ---------------- DOM skeleton ---------------- */
  const header = el('div', 'model-compare-header');
  const columnsEl = el('div', 'model-compare-columns');
  header.append(columnsEl);
  block.append(header);

  const sticky = el('div', 'model-compare-sticky');
  sticky.setAttribute('aria-hidden', 'true');
  const stickyInner = el('div', 'model-compare-sticky-inner');
  sticky.append(stickyInner);
  block.append(sticky);

  const sectionsEl = el('div', 'model-compare-sections');
  block.append(sectionsEl);
  const footnotesEl = el('ol', 'model-compare-footnotes');
  block.append(footnotesEl);

  const state = { columns: [emptyColumn()], onlyDifferences: false };
  let refs = new Map(); // footnote numbers by footnote path

  /* ---------------- selection panel ---------------- */
  const makeSelect = (label, id) => {
    const wrap = el('div', 'model-compare-field');
    const lab = el('label', 'model-compare-label', label);
    lab.htmlFor = id;
    const box = el('div', 'model-compare-select');
    const select = el('select');
    select.id = id;
    box.append(select, icon('arrow_chevron_down', 'model-compare-select-icon'));
    const single = el('p', 'model-compare-single');
    wrap.append(lab, box, single);
    return {
      wrap, select, single, box,
    };
  };

  const fillSelect = (field, items, current, emptyText, group) => {
    const { select } = field;
    select.replaceChildren();
    const ph = el('option', '', emptyText);
    ph.value = '';
    ph.disabled = !!current;
    select.append(ph);
    if (group) {
      // engines grouped by fuel type like the source dropdown (otherFuelType last)
      const groups = new Map();
      items.forEach((it) => {
        const k = it.otherFuelType ? '\u0000' : (it.fuelType || '');
        if (!groups.has(k)) groups.set(k, []);
        groups.get(k).push(it);
      });
      [...groups.entries()].forEach(([k, list]) => {
        const og = el('optgroup');
        og.label = k === '\u0000' ? '' : k;
        list.forEach((it) => {
          const o = el('option', '', it.description);
          o.value = it.code;
          o.selected = it.code === current;
          og.append(o);
        });
        select.append(og);
      });
    } else {
      items.forEach((it) => {
        const o = el('option', '', it.description);
        o.value = it.code;
        o.selected = it.code === current;
        select.append(o);
      });
    }
    if (!current) ph.selected = true;
    select.disabled = !items.length;
    field.wrap.classList.toggle('is-disabled', !items.length);
    const isSingle = items.length === 1 && !group;
    field.wrap.classList.toggle('is-single', isSingle);
    field.single.textContent = isSingle ? items[0].description : '';
  };

  /* ---------------- columns ---------------- */
  const columnEls = [];
  for (let i = 0; i < MAX_COLUMNS; i += 1) {
    const col = el('div', 'model-compare-column');
    col.dataset.index = i;
    const media = el('div', 'model-compare-media');
    const del = el('button', 'model-compare-delete');
    del.type = 'button';
    del.setAttribute('aria-label', T.remove);
    del.append(icon('close'));
    const hybrid = el('span', 'model-compare-hybrid');
    hybrid.setAttribute('aria-hidden', 'true');
    const picHolder = el('div', 'model-compare-picture');
    media.append(del, hybrid, picHolder);

    const placeholder = el('div', 'model-compare-placeholder');
    placeholder.append(el('h2', 'model-compare-name', T.addVehicle), el('p', 'model-compare-hint', T.chooseVehicle));

    const desc = el('div', 'model-compare-description');
    const name = el('h2', 'model-compare-name');
    const ctas = el('div', 'model-compare-ctas');
    const price = el('div', 'model-compare-price');
    desc.append(name, ctas, price);

    const panel = el('form', 'model-compare-panel');
    panel.addEventListener('submit', (e) => e.preventDefault());
    const fs = el('fieldset', 'model-compare-fieldset');
    const legend = el('legend', 'model-compare-legend', T.chooseVehicle);
    const fSeries = makeSelect(T.series, `mc-series-${i}`);
    const fRange = makeSelect(T.range, `mc-range-${i}`);
    const fModel = makeSelect(T.model, `mc-model-${i}`);
    const fTrans = el('div', 'model-compare-field model-compare-transmission');
    fTrans.append(el('p', 'model-compare-label', T.transmission), el('div', 'model-compare-transmission-value', '--'));
    fs.append(legend, fSeries.wrap, fRange.wrap, fModel.wrap, fTrans);
    panel.append(fs);

    col.append(media, placeholder, desc, panel);
    columnsEl.append(col);
    const ref = {
      col,
      del,
      hybrid,
      picHolder,
      placeholder,
      desc,
      name,
      ctas,
      price,
      fSeries,
      fRange,
      fModel,
      fTrans,
    };
    columnEls.push(ref);

    fSeries.select.addEventListener('change', () => {
      // eslint-disable-next-line no-use-before-define
      changeSelection(i, { series: fSeries.select.value || null });
    });
    fRange.select.addEventListener('change', () => {
      // eslint-disable-next-line no-use-before-define
      changeSelection(i, {
        series: state.columns[i].selection.series, range: fRange.select.value || null,
      });
    });
    fModel.select.addEventListener('change', () => {
      const s = state.columns[i].selection;
      // eslint-disable-next-line no-use-before-define
      changeSelection(i, { series: s.series, range: s.range, model: fModel.select.value || null });
    });
    fTrans.addEventListener('change', (e) => {
      if (e.target.name !== `mc-trans-${i}`) return;
      const c = state.columns[i];
      c.selection.transmission = e.target.value;
      c.vehicle = pickVehicle(c.data, e.target.value);
      // eslint-disable-next-line no-use-before-define
      render();
    });
    del.addEventListener('click', () => {
      // eslint-disable-next-line no-use-before-define
      confirmRemove(i);
    });
  }

  /* ---------------- confirm dialog ---------------- */
  const dialog = el('dialog', 'model-compare-dialog');
  const dTitle = el('h2', 'model-compare-dialog-title', T.confirmRemove);
  const dClose = el('button', 'model-compare-dialog-close');
  dClose.type = 'button';
  dClose.setAttribute('aria-label', 'Schließen');
  dClose.append(icon('close'));
  const dActions = el('div', 'model-compare-dialog-actions');
  const dYes = el('button', 'button accent', T.yes);
  dYes.type = 'button';
  const dNo = el('button', 'button secondary', T.no);
  dNo.type = 'button';
  dActions.append(dYes, dNo);
  dialog.append(dClose, dTitle, dActions);
  block.append(dialog);
  let pendingRemove = -1;
  const closeDialog = () => {
    if (dialog.open) dialog.close();
    pendingRemove = -1;
  };
  dClose.addEventListener('click', closeDialog);
  dNo.addEventListener('click', closeDialog);
  dialog.addEventListener('click', (e) => { if (e.target === dialog) closeDialog(); });
  const confirmRemove = (i) => {
    pendingRemove = i;
    if (dialog.showModal) dialog.showModal();
    else dialog.setAttribute('open', '');
  };
  dYes.addEventListener('click', () => {
    const i = pendingRemove;
    closeDialog();
    if (i < 0) return;
    state.columns.splice(i, 1);
    const last = state.columns[state.columns.length - 1];
    if (!state.columns.length || (last.selection.model && state.columns.length < MAX_COLUMNS)) {
      state.columns.push(emptyColumn());
    }
    // eslint-disable-next-line no-use-before-define
    render();
  });

  /* ---------------- sections ---------------- */
  const rowEls = []; // {row, cells[], def, groupEl}
  const groupEls = [];
  const buildTable = (group, groupEl) => {
    const table = el('div', 'model-compare-table');
    table.setAttribute('role', 'table');
    table.setAttribute('aria-label', group.title);
    group.rows.forEach((def) => {
      const row = el('div', 'model-compare-row');
      row.setAttribute('role', 'row');
      row.dataset.key = def.key;
      const title = el('div', 'model-compare-row-title');
      title.setAttribute('role', 'rowheader');
      title.append(document.createTextNode(def.label));
      const labelSup = el('sup', 'model-compare-ref');
      title.append(labelSup);
      row.append(title);
      const cells = [];
      for (let i = 0; i < MAX_COLUMNS; i += 1) {
        const cell = el('div', 'model-compare-cell');
        cell.setAttribute('role', 'cell');
        cell.dataset.index = i;
        const value = el('span', 'model-compare-value', '-');
        const sup = el('sup', 'model-compare-ref');
        cell.append(value, sup);
        row.append(cell);
        cells.push({ cell, value, sup });
      }
      table.append(row);
      rowEls.push({
        row, cells, def, groupEl, labelSup,
      });
    });
    return table;
  };

  let accordionSeq = 0;
  const buildAccordion = (section) => {
    const acc = el('div', 'model-compare-accordion');
    section.groups.forEach((group) => {
      accordionSeq += 1;
      const item = el('div', 'model-compare-group');
      const h = el('h3', 'model-compare-group-header');
      const btn = el('button', 'model-compare-group-button');
      btn.type = 'button';
      const pid = `mc-group-${accordionSeq}`;
      btn.setAttribute('aria-controls', pid);
      btn.setAttribute('aria-expanded', String(group.expanded));
      const bt = el('span', 'model-compare-group-title', group.title);
      const titleSup = el('sup', 'model-compare-ref');
      bt.append(titleSup);
      btn.append(bt, icon('arrow_chevron_down', 'model-compare-group-icon'));
      h.append(btn);
      const panel = el('div', 'model-compare-group-panel');
      panel.id = pid;
      panel.hidden = !group.expanded;
      const note = el('p', 'model-compare-note', T.noDifferences);
      note.hidden = true;
      panel.append(note, buildTable(group, item));
      btn.addEventListener('click', () => {
        const open = btn.getAttribute('aria-expanded') !== 'true';
        btn.setAttribute('aria-expanded', String(open));
        panel.hidden = !open;
      });
      item.append(h, panel);
      acc.append(item);
      groupEls.push({
        item, note, group, titleSup,
      });
    });
    return acc;
  };

  // toggle "only differences" (above the technical data)
  const toggleWrap = el('div', 'model-compare-toggle');
  const toggle = el('button', 'model-compare-switch');
  toggle.type = 'button';
  toggle.setAttribute('aria-pressed', 'false');
  toggle.append(el('span', 'model-compare-switch-track'), el('span', 'model-compare-switch-label', T.onlyDifferences));
  const toast = el('div', 'model-compare-toast');
  toast.setAttribute('role', 'status');
  toast.hidden = true;
  const toastClose = el('button', 'model-compare-toast-close');
  toastClose.type = 'button';
  toastClose.setAttribute('aria-label', 'Schließen');
  toastClose.append(icon('close'));
  toast.append(icon('checkmark', 'model-compare-toast-icon'), el('p', '', T.differencesShown), toastClose);
  toastClose.addEventListener('click', () => { toast.hidden = true; });
  toggleWrap.append(toggle, toast);
  toggle.addEventListener('click', () => {
    if (toggle.getAttribute('aria-disabled') === 'true') return;
    state.onlyDifferences = !state.onlyDifferences;
    toggle.setAttribute('aria-pressed', String(state.onlyDifferences));
    toast.hidden = !state.onlyDifferences;
    if (state.onlyDifferences) setTimeout(() => { toast.hidden = true; }, 4000);
    // eslint-disable-next-line no-use-before-define
    updateRows();
  });

  // design comparison (exterior / interior cosy images per column)
  const design = el('section', 'model-compare-section model-compare-design');
  const designImgs = { exterior: [], interior: [] };
  const galleryHint = el('p', 'model-compare-hint-box', T.galleryHint);
  if (tpl.designTitle) {
    design.append(el('h2', 'model-compare-section-title', tpl.designTitle));
    const tabs = el('div', 'model-compare-tabs');
    tabs.setAttribute('role', 'tablist');
    const panels = el('div', 'model-compare-tabpanels');
    ['exterior', 'interior'].forEach((view, vi) => {
      const tab = el('button', 'model-compare-tab', view === 'exterior' ? T.exterior : T.interior);
      tab.type = 'button';
      tab.setAttribute('role', 'tab');
      tab.id = `mc-tab-${view}`;
      tab.setAttribute('aria-selected', String(vi === 0));
      tab.setAttribute('aria-controls', `mc-panel-${view}`);
      const panel = el('div', 'model-compare-tabpanel');
      panel.id = `mc-panel-${view}`;
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('aria-labelledby', tab.id);
      panel.hidden = vi !== 0;
      const grid = el('div', 'model-compare-gallery');
      for (let i = 0; i < MAX_COLUMNS; i += 1) {
        const cellEl = el('div', 'model-compare-gallery-item');
        cellEl.dataset.index = i;
        grid.append(cellEl);
        designImgs[view].push(cellEl);
      }
      panel.append(grid);
      tab.addEventListener('click', () => {
        tabs.querySelectorAll('[role="tab"]').forEach((t) => t.setAttribute('aria-selected', String(t === tab)));
        panels.querySelectorAll('[role="tabpanel"]').forEach((p) => { p.hidden = p !== panel; });
      });
      tabs.append(tab);
      panels.append(panel);
    });
    const disclaimer = el('p', 'model-compare-disclaimer', T.disclaimer || '');
    design.append(tabs, galleryHint, panels, disclaimer);
  }

  tpl.sections.forEach((section) => {
    const sec = el('section', `model-compare-section model-compare-${section.id}`);
    if (section.title) sec.append(el('h2', 'model-compare-section-title', section.title));
    if (section.id === 'technicaldetails') sec.append(toggleWrap);
    sec.append(buildAccordion(section));
    sectionsEl.append(sec);
    if (section.id === 'highlights' && tpl.designTitle) sectionsEl.append(design);
  });
  if (!tpl.sections.some((s) => s.id === 'highlights') && tpl.designTitle) sectionsEl.prepend(design);

  /* ---------------- rendering ---------------- */
  const valueOf = (col, def) => {
    const v = col && col.vehicle;
    if (!v) return '';
    if (def.isEnergy) {
      // energy label rows show the CO2 class range, e.g. "A" or "AC" (source updateTableCell)
      const min = v.efficiencyCategoryMin && v.efficiencyCategoryMin !== '-' ? v.efficiencyCategoryMin : '-';
      const max = v.efficiencyCategoryMax && v.efficiencyCategoryMax !== '-' ? v.efficiencyCategoryMax : '-';
      return `${min}${min !== max ? max : ''}`;
    }
    return v[def.key] ? String(v[def.key]) : '-';
  };

  const buildFootnotes = () => {
    // unique footnote texts over all columns, numbered in order (source buildFootnoteState)
    const texts = [];
    const byPath = new Map();
    state.columns.forEach((col, i) => {
      const fn = col.vehicle && col.vehicle.footnotes;
      if (!fn) return;
      Object.entries(fn).forEach(([path, list]) => {
        const key = path.endsWith('_value') ? `${path}_${i}` : path;
        (list || []).forEach((txt) => {
          let n = texts.indexOf(txt) + 1;
          if (!n) {
            texts.push(txt);
            n = texts.length;
          }
          if (!byPath.has(key)) byPath.set(key, []);
          if (!byPath.get(key).includes(n)) byPath.get(key).push(n);
        });
      });
    });
    footnotesEl.replaceChildren(...texts.map((txt, i) => {
      const li = el('li', 'model-compare-footnote');
      li.id = `mc-fn-${i + 1}`;
      li.dataset.counter = String(i + 1);
      li.innerHTML = txt;
      return li;
    }));
    footnotesEl.hidden = !texts.length;
    refs = byPath;
  };

  const fillRef = (sup, path) => {
    sup.replaceChildren();
    const nums = path ? refs.get(path) : null;
    if (!nums || !nums.length) return;
    nums.forEach((n, idx) => {
      if (idx) sup.append(document.createTextNode(', '));
      const a = el('a', 'model-compare-ref-link', String(n));
      a.href = `#mc-fn-${n}`;
      sup.append(a);
    });
  };

  const updateRows = () => {
    const filled = state.columns.filter((c) => c.vehicle).length;
    const anyVehicle = filled > 0;
    rowEls.forEach(({
      row, cells, def, labelSup,
    }) => {
      const values = [];
      cells.forEach(({ value, sup, cell }, i) => {
        const col = state.columns[i];
        const v = col ? valueOf(col, def) : '';
        let shown = col ? '-' : '';
        if (col && col.vehicle) shown = v;
        value.textContent = shown;
        cell.classList.toggle('is-hidden-column', !col);
        fillRef(sup, def.valueRef ? `${def.valueRef}_${i}` : '');
        if (col && col.vehicle) values.push(v);
      });
      fillRef(labelSup, def.labelRef);
      const isNull = values.some((v) => v === 'null');
      const isDash = anyVehicle && values.every((v) => v === '-' || v === 'null' || v === '');
      const identical = values.length > 1 && values.every((v) => v === values[0]);
      row.dataset.isNull = String(isNull);
      row.dataset.isDash = String(isDash);
      row.classList.toggle('is-identical', identical);
      row.hidden = isNull || isDash || (state.onlyDifferences && identical);
    });
    let stripe = 0;
    groupEls.forEach(({
      item, note, group, titleSup,
    }) => {
      const rows = rowEls.filter((r) => r.groupEl === item);
      const visible = rows.filter((r) => !r.row.hidden);
      const allEmpty = anyVehicle && rows.every((r) => r.row.dataset.isNull === 'true' || r.row.dataset.isDash === 'true');
      item.hidden = allEmpty;
      note.hidden = !(state.onlyDifferences && !visible.length && !allEmpty);
      stripe = 0;
      visible.forEach((r) => {
        r.row.classList.toggle('is-odd', stripe % 2 === 0);
        stripe += 1;
      });
      fillRef(titleSup, group.titleRef);
    });
    const canToggle = filled > 1;
    toggle.setAttribute('aria-disabled', String(!canToggle));
    toggle.classList.toggle('is-disabled', !canToggle);
    if (!canToggle && state.onlyDifferences) {
      state.onlyDifferences = false;
      toggle.setAttribute('aria-pressed', 'false');
      updateRows();
    }
  };

  const renderSticky = () => {
    stickyInner.replaceChildren();
    state.columns.forEach((col, i) => {
      const item = el('div', 'model-compare-sticky-item');
      item.dataset.index = i;
      const imgs = col.data && col.data.cosyImages;
      const pic = col.vehicle && imgs
        ? cosyPicture(imgs.frontSticky || imgs.model, col.vehicle.name)
        : cosyPicture(tpl.placeholders[i] || tpl.placeholders[0], '');
      pic.classList.add('model-compare-sticky-picture');
      if (!col.vehicle) pic.classList.add('model-compare-cosy-empty');
      const textBox = el('div', 'model-compare-sticky-text');
      if (col.vehicle) {
        const del = el('button', 'model-compare-delete');
        del.type = 'button';
        del.setAttribute('aria-label', T.remove);
        del.append(icon('close'));
        del.addEventListener('click', () => confirmRemove(i));
        textBox.append(el('p', 'model-compare-sticky-name', col.vehicle.name));
        const link = col.data.carLink;
        if (link && link.href) {
          const a = el('a', 'link-arrow', T.cta1);
          a.href = link.href;
          if (link.target) a.target = link.target;
          textBox.append(a);
        }
        item.append(del);
      } else {
        textBox.append(el('p', 'model-compare-sticky-name', T.addVehicle));
        pic.addEventListener('click', () => header.scrollIntoView({ behavior: 'smooth' }));
      }
      item.append(pic, textBox);
      stickyInner.append(item);
    });
  };

  const renderColumn = (i) => {
    const ref = columnEls[i];
    const col = state.columns[i];
    ref.col.classList.toggle('is-hidden-column', !col);
    if (!col) return;
    const sel = col.selection;
    const { vehicle, data } = col;
    const selected = !!vehicle;
    ref.col.classList.toggle('is-selected', selected);
    ref.del.hidden = !selected;
    ref.placeholder.hidden = selected;
    ref.desc.hidden = !selected;

    // picture
    const imgs = data && data.cosyImages;
    const pic = selected && imgs ? cosyPicture(imgs.model, vehicle.name, 'model-compare-cosy')
      : cosyPicture(tpl.placeholders[i] || tpl.placeholders[0], '', 'model-compare-cosy model-compare-cosy-empty');
    if (selected && imgs && imgs.model) pic.querySelector('img').loading = 'eager';
    ref.picHolder.replaceChildren(pic);
    const hybrid = selected ? String(data.hybridIdIcon || vehicle.hybridId || '').toLowerCase() : '';
    ref.hybrid.replaceChildren();
    ref.hybrid.className = 'model-compare-hybrid';
    if (hybrid === 'beve' || hybrid === 'phev') {
      ref.hybrid.append(icon(hybrid === 'beve' ? 'fuel_type_bev' : 'fuel_type_phev'));
      ref.hybrid.classList.add(`is-${hybrid}`);
    }

    // description
    if (selected) {
      ref.name.textContent = vehicle.name;
      ref.ctas.replaceChildren();
      [[data.carLink, T.cta1, 'accent'], [data.stocklocatorCarlink, T.cta2, 'secondary']].forEach(([link, label, style]) => {
        if (!link || !link.href) return;
        const a = el('a', `button ${style}`, label);
        a.href = link.href;
        if (link.target) {
          a.target = link.target;
          if (link.target === '_blank') a.rel = 'noopener';
        }
        const p = el('p', 'button-wrapper');
        p.append(a);
        ref.ctas.append(p);
      });
      ref.price.replaceChildren();
      if (vehicle.fromPrice) {
        const p = el('p', 'model-compare-price-text');
        p.append(el('strong', '', `${T.from}\u00a0${vehicle.fromPrice}`));
        if (T.priceInfoHtml) {
          const box = el('div');
          box.append(el('p', 'model-compare-price-info-title', T.priceInfo));
          const body = el('div');
          body.innerHTML = T.priceInfoHtml;
          box.append(body);
          p.append(createInfoButton(box, { label: T.priceInfo }));
        }
        ref.price.append(p);
      }
    }

    // selection panel
    const series = config;
    fillSelect(ref.fSeries, series, sel.series, T.emptySeries);
    const ranges = findSeries(sel.series)?.modelRanges || [];
    fillSelect(ref.fRange, ranges, sel.range, T.emptyRange);
    const models = findRange(sel)?.vehicles || [];
    fillSelect(ref.fModel, models, sel.model, T.emptyModel, models.length > 1);
    const trans = findModel(sel)?.transmissions || [];
    const tv = ref.fTrans.querySelector('.model-compare-transmission-value');
    tv.replaceChildren();
    if (trans.length > 1) {
      trans.forEach((tr, ti) => {
        const lab = el('label', 'model-compare-radio');
        const input = el('input');
        input.type = 'radio';
        input.name = `mc-trans-${i}`;
        input.value = tr.code;
        input.checked = tr.code === sel.transmission || (!sel.transmission && ti === 0);
        lab.append(input, el('span', '', clean(tr.description)));
        tv.append(lab);
      });
    } else {
      tv.textContent = trans.length ? clean(trans[0].description) : '--';
    }
  };

  const renderDesign = () => {
    const anyVehicle = state.columns.some((c) => c.vehicle);
    galleryHint.hidden = anyVehicle;
    design.classList.toggle('has-vehicle', anyVehicle);
    ['exterior', 'interior'].forEach((view) => {
      designImgs[view].forEach((cellEl, i) => {
        const col = state.columns[i];
        cellEl.replaceChildren();
        cellEl.hidden = !(col && col.vehicle);
        if (col && col.vehicle && col.data.cosyImages && col.data.cosyImages[view]) {
          cellEl.append(cosyPicture(col.data.cosyImages[view], `${col.vehicle.name} – ${view === 'exterior' ? T.exterior : T.interior}`));
          cellEl.append(el('p', 'model-compare-gallery-name', col.vehicle.name));
        }
      });
    });
  };

  const render = () => {
    // keep one trailing empty column (max 3)
    const last = state.columns[state.columns.length - 1];
    if (last && last.selection.model && last.vehicle && state.columns.length < MAX_COLUMNS) {
      state.columns.push(emptyColumn());
    }
    if (!state.columns.length) state.columns.push(emptyColumn());
    block.dataset.columns = String(state.columns.length);
    for (let i = 0; i < MAX_COLUMNS; i += 1) renderColumn(i);
    buildFootnotes();
    updateRows();
    renderDesign();
    renderSticky();
    writeHash(state.columns);
  };

  let seq = 0;
  const changeSelection = async (i, partial) => {
    const col = state.columns[i];
    const sel = {
      series: partial.series ?? null,
      range: partial.range ?? null,
      model: partial.model ?? null,
      transmission: null,
    };
    // auto-select single options like the source
    if (sel.series && !sel.range) {
      const ranges = findSeries(sel.series)?.modelRanges || [];
      if (ranges.length === 1) sel.range = ranges[0].code;
    }
    if (sel.range && !sel.model) {
      const models = findRange(sel)?.vehicles || [];
      if (models.length === 1) sel.model = models[0].code;
    }
    if (sel.model) sel.transmission = (findModel(sel)?.transmissions || [])[0]?.code || null;
    col.selection = sel;
    col.data = null;
    col.vehicle = null;
    if (!sel.model) {
      render();
      return;
    }
    seq += 1;
    const mySeq = seq;
    columnEls[i].col.classList.add('is-loading');
    render();
    try {
      const data = await fetchModel(sel);
      if (mySeq !== seq && state.columns[i] !== col) return;
      col.data = data;
      col.vehicle = pickVehicle(data, sel.transmission);
      if (col.vehicle && !sel.transmission) sel.transmission = col.vehicle.transmissionId;
    } catch {
      col.vehicle = null;
    }
    columnEls[i].col.classList.remove('is-loading');
    render();
  };

  /* ---------------- sticky header ---------------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      const visible = !e.isIntersecting && e.boundingClientRect.top < 0;
      sticky.classList.toggle('is-visible', visible);
      sticky.setAttribute('aria-hidden', String(!visible));
    });
  }, { threshold: 0 });
  io.observe(columnsEl);

  /* ---------------- initial state ---------------- */
  const initial = parseHash();
  if (initial.length) {
    state.columns = initial.map((s) => ({ selection: { ...s }, data: null, vehicle: null }));
    render();
    await Promise.all(state.columns.map(async (col) => {
      try {
        col.data = await fetchModel(col.selection);
        col.vehicle = pickVehicle(col.data, col.selection.transmission);
        if (col.vehicle && !col.selection.transmission) {
          col.selection.transmission = col.vehicle.transmissionId;
        }
      } catch {
        col.vehicle = null;
      }
    }));
  }
  render();
  window.addEventListener('hashchange', () => {
    const cols = parseHash();
    const current = state.columns.filter((c) => c.selection.model).map((c) => Object.values(c.selection).join('/'));
    if (cols.map((c) => Object.values(c).join('/')).join('|') === current.join('|')) return;
    state.columns = cols.length
      ? cols.map((sel) => ({ selection: { ...sel }, data: null, vehicle: null }))
      : [emptyColumn()];
    Promise.all(state.columns.map(async (col) => {
      if (!col.selection.model) return;
      try {
        col.data = await fetchModel(col.selection);
        col.vehicle = pickVehicle(col.data, col.selection.transmission);
      } catch {
        col.vehicle = null;
      }
    })).then(render);
  });
}
