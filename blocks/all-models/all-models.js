import { decorateFontIcons } from '../../scripts/bmw-utils.js';

/*
 * All Models (source .cmp-allmodels on /de/neufahrzeuge, "esi" variant on the elektroauto pages):
 * the model finder. Filter sidebar (categories, series, drivetrains, BMW M, further categories) —
 * OR within a group, AND across groups, options without results are disabled — plus a sort
 * dropdown; model cards grouped by drivetrain. Clicking a card opens its detail panel (side view,
 * CTAs) below the card row (full-screen layer on mobile). Filters are read from and written to
 * the URL (?series=x, ?bmwM=yes, ?category=li, ?specialCategory=c, ?fuelType=e …).
 *  Rows:
 *   [filter key | heading | list of options "Label (value)" (an image may replace the label)]
 *   [sort | label | list "Label (default)", "Label (new)"]
 *   [preselect | "key: value"]           filters applied up front (ESI variant)
 *   [h2 group heading | group code]      e.g. "Vollelektrisch | e"
 *   [images: car, side view | body type, *flag*, h3 series, description, fuel text, M logo,
 *     USP list | CTA links (+ compare link) | tags "fuelType: e, series: x, category: suv, …"]
 * Options: no-filter (no filter UI / sorting).
 */

const ICONS = {
  category: {
    suv: 'car_model_sav',
    to: 'car_model_touring',
    li: 'car_model_sedan',
    cp: 'car_model_coupe',
    comp: 'car_model_compact',
    caro: 'car_model_convertible',
  },
  fuelType: {
    e: 'fuel_type_bev', h: 'fuel_type_phev', o: 'fuel_type_petrol', d: 'fuel_type_diesel',
  },
};
// URL / preselect aliases -> tag keys
const KEY_ALIASES = { fuelTypes: 'fuelType', categories: 'category', specialCategories: 'specialCategory' };
const IGNORED_PARAMS = ['maxPrice', 'minPrice', 'price'];
const MOBILE_MQ = window.matchMedia('(max-width: 767px)');
let seq = 0;

const txt = (el) => (el ? el.textContent.replace(/\s+/g, ' ').trim() : '');
const optionRe = /^(.*?)\s*\(([^()]+)\)\s*$/;

function icon(name, cls = '') {
  const s = document.createElement('span');
  s.className = `bmw-icon ${cls}`.trim();
  s.dataset.icon = name;
  s.setAttribute('aria-hidden', 'true');
  s.textContent = name;
  return s;
}

function parseTags(str) {
  const tags = {};
  (str || '').split(/[,;\n]/).forEach((part) => {
    const m = part.match(/^\s*([\w-]+)\s*[:=]\s*(.*)$/);
    if (!m) return;
    const key = KEY_ALIASES[m[1]] || m[1];
    tags[key] = m[2].trim().split(/[\s|/]+/).filter(Boolean);
  });
  return tags;
}

function parseBlock(block) {
  const filters = [];
  const sort = [];
  const preselect = {};
  const groups = [];
  let group = null;
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const first = txt(cells[0]);
    if (cells.length >= 4) {
      if (!group) {
        group = { title: '', code: '', cards: [] };
        groups.push(group);
      }
      const [imgCell, textCell, ctaCell, tagCell] = cells;
      group.cards.push({
        imgCell, textCell, ctaCell, tags: parseTags(txt(tagCell)),
      });
      return;
    }
    if (cells.length >= 2 && cells[0].querySelector('h1, h2, h3, h4')) {
      group = { title: txt(cells[0]), code: txt(cells[1]), cards: [] };
      groups.push(group);
      return;
    }
    if (first === 'preselect') {
      const m = txt(cells[1]).match(/^([\w-]+)\s*:\s*(.+)$/);
      if (m) preselect[KEY_ALIASES[m[1]] || m[1]] = m[2].split(/[\s,]+/).filter(Boolean);
      return;
    }
    if (cells.length >= 3) {
      const opts = [...cells[2].querySelectorAll('li')].map((li) => {
        const t = txt(li);
        const m = t.match(optionRe);
        return {
          label: m ? m[1] : t,
          value: m ? m[2] : t,
          img: li.querySelector('img'),
        };
      });
      if (first === 'sort') sort.push(...opts);
      else filters.push({ key: KEY_ALIASES[first] || first, label: txt(cells[1]), options: opts });
    }
  });
  return {
    filters, sort, preselect, groups: groups.filter((g) => g.cards.length),
  };
}

function buildCard(data) {
  const card = document.createElement('li');
  card.className = 'all-models-card';
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'all-models-card-button';
  btn.setAttribute('aria-expanded', 'false');

  const t = data.textCell || document.createElement('div');
  const heading = t.querySelector('h1, h2, h3, h4, h5, h6');
  const paras = [...t.querySelectorAll(':scope > p')];
  const kids = [...t.children];
  const hIndex = heading ? kids.indexOf(heading) : -1;
  const before = paras.filter((p) => kids.indexOf(p) < hIndex);
  const after = paras.filter((p) => !before.includes(p));
  const flagP = before.find((p) => p.querySelector('em'));
  const bodyP = before.find((p) => p !== flagP);
  // (an image link alone in its paragraph arrives as a bare <picture>, see buildExternalImageLinks)
  const imgP = after.find((p) => p.querySelector('img'))
    || kids.find((k, i) => i > hIndex && k.tagName === 'PICTURE');
  const textPs = after.filter((p) => p !== imgP);
  const parts = {
    body: txt(bodyP),
    flag: txt(flagP),
    series: heading ? [...heading.childNodes] : [],
    seriesText: txt(heading),
    description: txt(textPs[0]),
    fuel: txt(textPs[1]),
    mLogo: imgP ? imgP.querySelector('img') : null,
    usps: [...t.querySelectorAll('li')].map(txt),
  };

  const labels = document.createElement('div');
  labels.className = 'all-models-labels';
  const header = document.createElement('div');
  header.className = 'all-models-labels-header';
  if (parts.body) {
    const s = document.createElement('span');
    s.className = 'all-models-bodytype';
    s.textContent = parts.body;
    header.append(s);
  }
  if (parts.flag) {
    const s = document.createElement('span');
    s.className = 'all-models-flag';
    s.textContent = parts.flag;
    header.append(s);
  }
  labels.append(header);
  const series = document.createElement('span');
  series.className = 'all-models-series';
  parts.series.forEach((n) => {
    if (n.nodeType === 1 && n.tagName === 'SUB') {
      const small = document.createElement('span');
      small.className = 'all-models-series-small';
      small.textContent = n.textContent;
      series.append(small);
    } else series.append(n.cloneNode(true));
  });
  // source __series-manual: free-text names (concept cars, special vehicles), not a series code
  const code = [...series.childNodes]
    .filter((n) => !n.classList?.contains('all-models-series-small'))
    .map((n) => n.textContent).join('').trim();
  if (code.length > 8) series.classList.add('all-models-series-manual');
  labels.append(series);
  if (parts.description) {
    const s = document.createElement('span');
    s.className = 'all-models-description';
    s.textContent = parts.description;
    labels.append(s);
  }

  const imgs = data.imgCell ? [...data.imgCell.querySelectorAll('img')] : [];
  const media = document.createElement('span');
  media.className = 'all-models-image';
  const fuelCode = (data.tags.fuelType || [])[0];
  if (ICONS.fuelType[fuelCode]) media.append(icon(ICONS.fuelType[fuelCode], 'all-models-fuel-icon'));
  if (imgs[0]) {
    const img = imgs[0].cloneNode();
    img.loading = 'lazy';
    img.alt = imgs[0].alt || '';
    media.append(img);
  }

  const foot = document.createElement('span');
  foot.className = 'all-models-card-foot';
  const fuel = document.createElement('span');
  fuel.className = 'all-models-fueltext';
  fuel.textContent = parts.fuel;
  foot.append(fuel);
  if (parts.mLogo) {
    const m = parts.mLogo.cloneNode();
    m.className = 'all-models-mlogo';
    m.loading = 'lazy';
    foot.append(m);
  }

  btn.append(labels, media, foot);
  btn.setAttribute('aria-label', `${parts.seriesText} ${parts.description}`.trim());
  card.append(btn);

  // compare link (icon, top right) and CTAs for the detail panel
  const links = data.ctaCell ? [...data.ctaCell.querySelectorAll('a[href]')] : [];
  const compare = links.find((a) => /vergleich/i.test(a.getAttribute('href') || '') || /vergleich/i.test(a.textContent));
  if (compare) {
    const c = document.createElement('a');
    c.href = compare.href;
    c.className = 'all-models-compare';
    c.title = txt(compare);
    c.setAttribute('aria-label', txt(compare));
    c.append(icon('compare'));
    card.append(c);
  }
  const ctas = links.filter((a) => a !== compare).map((a) => a.closest('p') || a);
  return {
    card, btn, parts, imgs, ctas, tags: data.tags,
  };
}

function buildDetail(entry, onClose) {
  const panel = document.createElement('div');
  panel.className = 'all-models-detail';
  panel.setAttribute('role', 'region');
  panel.tabIndex = -1;
  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'all-models-detail-close';
  close.setAttribute('aria-label', 'Schließen');
  close.append(icon('close'));
  close.addEventListener('click', onClose);

  const info = document.createElement('div');
  info.className = 'all-models-detail-info';
  info.append(entry.btn.querySelector('.all-models-labels').cloneNode(true));
  const media = document.createElement('div');
  media.className = 'all-models-detail-image';
  const side = entry.imgs[1] || entry.imgs[0];
  if (side) {
    const img = side.cloneNode();
    img.loading = 'eager';
    media.append(img);
  }
  const fuelIcon = entry.btn.querySelector('.all-models-fuel-icon');
  if (fuelIcon) media.append(fuelIcon.cloneNode(true));
  const foot = entry.btn.querySelector('.all-models-card-foot').cloneNode(true);
  const ctas = document.createElement('div');
  ctas.className = 'all-models-detail-ctas';
  entry.ctas.forEach((c) => ctas.append(c.cloneNode(true)));
  ctas.querySelectorAll('a').forEach((a) => {
    if (!a.classList.contains('button')) a.classList.add('button', 'secondary');
  });
  if (entry.parts.usps.length) {
    const ul = document.createElement('ul');
    ul.className = 'all-models-usps';
    entry.parts.usps.forEach((u) => {
      const li = document.createElement('li');
      li.textContent = u;
      ul.append(li);
    });
    info.append(ul);
  }
  panel.append(info, media, foot, ctas, close);
  return panel;
}

export default function decorate(block) {
  seq += 1;
  const noFilter = block.classList.contains('no-filter');
  const {
    filters, sort, preselect, groups,
  } = parseBlock(block);
  if (!groups.length) return;

  // ---- state from URL + preselect
  const state = {};
  const filterKeys = filters.map((f) => f.key);
  Object.entries(preselect).forEach(([k, v]) => { state[k] = new Set(v); });
  const params = new URLSearchParams(window.location.search);
  params.forEach((value, rawKey) => {
    const key = KEY_ALIASES[rawKey] || rawKey;
    if (IGNORED_PARAMS.includes(key)) return;
    if (!filterKeys.includes(key) && !['driveType', 'offers'].includes(key)) return;
    state[key] = new Set(value.split(',').map((v) => v.trim()).filter(Boolean));
  });

  // ---- cards
  const entries = [];
  const results = document.createElement('div');
  results.className = 'all-models-results';
  results.id = `all-models-results-${seq}`;
  const groupEls = groups.map((g) => {
    const section = document.createElement('section');
    section.className = 'all-models-group';
    const h = document.createElement('h2');
    h.className = 'all-models-group-title';
    if (ICONS.fuelType[g.code]) h.append(icon(ICONS.fuelType[g.code], 'all-models-group-icon'));
    // label and count in one text run (source: "Vollelektrisch (15)")
    const count = document.createElement('span');
    count.className = 'all-models-group-label';
    count.textContent = g.title;
    h.append(count);
    const ul = document.createElement('ul');
    ul.className = 'all-models-grid';
    const cards = g.cards.map((c, i) => {
      const e = buildCard(c);
      e.order = i;
      e.group = g;
      entries.push(e);
      ul.append(e.card);
      return e;
    });
    if (g.title) section.append(h);
    section.append(ul);
    results.append(section);
    return {
      section, ul, count, cards, title: g.title,
    };
  });

  // ---- detail panel
  let open = null;
  const closeDetail = (focus = true) => {
    if (!open) return;
    open.panel.remove();
    open.entry.card.classList.remove('is-selected');
    open.entry.btn.setAttribute('aria-expanded', 'false');
    document.documentElement.classList.remove('all-models-layer-open');
    if (focus) open.entry.btn.focus({ preventScroll: true });
    open = null;
  };
  const openDetail = (entry) => {
    if (open && open.entry === entry) {
      closeDetail();
      return;
    }
    closeDetail(false);
    const panel = buildDetail(entry, () => closeDetail());
    const { ul } = groupEls.find((g) => g.cards.includes(entry));
    if (MOBILE_MQ.matches) {
      panel.classList.add('is-layer');
      document.documentElement.classList.add('all-models-layer-open');
      block.append(panel);
    } else {
      const visible = [...ul.children].filter((li) => li.classList.contains('all-models-card') && !li.hidden);
      const cols = getComputedStyle(ul).gridTemplateColumns.split(' ').filter(Boolean).length || 1;
      const idx = visible.indexOf(entry.card);
      const last = Math.min(visible.length - 1, Math.floor(idx / cols) * cols + cols - 1);
      const rowEnd = visible[last];
      rowEnd.after(panel);
    }
    entry.card.classList.add('is-selected');
    entry.btn.setAttribute('aria-expanded', 'true');
    open = { entry, panel };
    panel.focus({ preventScroll: true });
    if (!MOBILE_MQ.matches) {
      const r = panel.getBoundingClientRect();
      if (r.bottom > window.innerHeight) panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };
  entries.forEach((e) => e.btn.addEventListener('click', () => openDetail(e)));
  block.addEventListener('keydown', (ev) => { if (ev.key === 'Escape') closeDetail(); });

  // ---- filtering
  const matches = (entry, skipKey) => Object.entries(state).every(([k, set]) => {
    if (k === skipKey || !set.size) return true;
    const vals = entry.tags[k] || [];
    return vals.some((v) => set.has(v));
  });
  const filterUi = [];
  let sortMode = 'default';
  const reset = document.createElement('a');
  const syncUrl = () => {
    if (noFilter) return;
    const url = new URL(window.location.href);
    [...url.searchParams.keys()].forEach((k) => {
      if (filterKeys.includes(KEY_ALIASES[k] || k)) url.searchParams.delete(k);
    });
    Object.entries(state).forEach(([k, set]) => {
      if (set.size && filterKeys.includes(k)) url.searchParams.set(k, [...set].join(','));
    });
    window.history.replaceState(window.history.state, '', url);
  };
  const apply = () => {
    closeDetail(false);
    groupEls.forEach((g) => {
      let n = 0;
      const ordered = sortMode === 'new'
        ? [...g.cards].sort((a, b) => ((b.tags.offers || []).includes('new') - (a.tags.offers || []).includes('new')) || a.order - b.order)
        : g.cards;
      ordered.forEach((e) => {
        const ok = matches(e);
        e.card.hidden = !ok;
        if (ok) n += 1;
        g.ul.append(e.card);
      });
      g.count.textContent = `${g.title} (${n})`;
      g.section.hidden = n === 0;
    });
    filterUi.forEach(({ key, buttons, heading }) => {
      const pool = entries.filter((e) => matches(e, key));
      const selected = state[key] || new Set();
      buttons.forEach(({ b, value }) => {
        const on = selected.has(value);
        b.setAttribute('aria-pressed', String(on));
        b.disabled = !on && !pool.some((e) => (e.tags[key] || []).includes(value));
      });
      heading.textContent = selected.size ? ` (${selected.size})` : '';
    });
    const any = Object.entries(state).some(([k, s]) => s.size && filterKeys.includes(k));
    reset.hidden = !any;
    block.classList.toggle('is-filtered', any);
  };

  // ---- filter UI
  let aside = null;
  if (!noFilter && filters.length) {
    aside = document.createElement('div');
    aside.className = 'all-models-filters';
    const skip = document.createElement('a');
    skip.className = 'all-models-skip';
    skip.href = `#${results.id}`;
    skip.textContent = 'Zu den Modellen springen';
    aside.append(skip);
    filters.forEach((f) => {
      const group = document.createElement('div');
      group.className = `all-models-filter all-models-filter-${f.key.toLowerCase()}`;
      const head = document.createElement('button');
      head.type = 'button';
      head.className = 'all-models-filter-heading';
      head.setAttribute('aria-expanded', 'true');
      const label = document.createElement('span');
      label.textContent = f.label;
      const count = document.createElement('span');
      count.className = 'all-models-filter-count';
      label.append(count);
      head.append(label, icon('arrow_chevron_up', 'all-models-filter-chevron'));
      const toggles = document.createElement('div');
      toggles.className = 'all-models-toggles';
      head.addEventListener('click', () => {
        const exp = head.getAttribute('aria-expanded') === 'true';
        head.setAttribute('aria-expanded', String(!exp));
        group.classList.toggle('is-collapsed', exp);
      });
      const buttons = f.options.map((o) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'all-models-toggle';
        b.dataset.value = o.value;
        b.title = o.label || o.value;
        const ic = (ICONS[f.key] || {})[o.value];
        if (ic) {
          b.classList.add('has-icon');
          b.append(icon(ic, 'all-models-toggle-icon'));
        }
        if (o.img) {
          const img = o.img.cloneNode();
          img.className = 'all-models-toggle-img';
          b.append(img);
          b.setAttribute('aria-label', o.img.alt || o.label || o.value);
        }
        if (o.label) {
          const s = document.createElement('span');
          s.textContent = o.label;
          b.append(s);
        }
        b.addEventListener('click', () => {
          const set = state[f.key] || new Set();
          if (set.has(o.value)) set.delete(o.value);
          else set.add(o.value);
          state[f.key] = set;
          apply();
          syncUrl();
        });
        toggles.append(b);
        return { b, value: o.value };
      });
      group.append(head, toggles);
      aside.append(group);
      filterUi.push({ key: f.key, buttons, heading: count });
    });
    reset.href = '#';
    reset.className = 'all-models-reset';
    reset.append(document.createTextNode('Filter zurücksetzen'), icon('trash_can'));
    reset.addEventListener('click', (e) => {
      e.preventDefault();
      filterKeys.forEach((k) => { state[k] = new Set(); });
      apply();
      syncUrl();
    });
    aside.append(reset);
  }

  // ---- sorting
  let sortEl = null;
  if (!noFilter && sort.length) {
    sortEl = document.createElement('div');
    sortEl.className = 'all-models-sort';
    const select = document.createElement('select');
    select.setAttribute('aria-label', 'Sortierung');
    sort.forEach((o) => {
      const opt = document.createElement('option');
      opt.value = o.value;
      opt.textContent = o.label;
      select.append(opt);
    });
    select.addEventListener('change', () => {
      sortMode = select.value;
      apply();
    });
    sortEl.append(select);
  }

  const layout = document.createElement('div');
  layout.className = 'all-models-layout';
  if (aside) layout.append(aside);
  layout.append(results);
  block.replaceChildren(...[sortEl, layout].filter(Boolean));
  if (!aside) block.classList.add('no-sidebar');
  decorateFontIcons(block);
  apply();
}
