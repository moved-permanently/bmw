import { decorateFontIcons } from '../../scripts/bmw-utils.js';

/*
 * Technical Data (source .cmp-technicaldata on the *-technische-daten pages): model (and
 * transmission) dropdowns switching between all variants of a model range; per variant collapsible
 * groups (Antrieb, Motor, Fahrleistung, Verbrauch, Abmessungen …) with zebra fact grids,
 * measurement images and the footnotes referenced by the visible variant.
 *  Rows:
 *   [fuel type | model | transmission]   starts a variant; the first variant is the default
 *                                        (a URL hash with the model slug, e.g. #bmw-120, selects)
 *   [heading]                            group title (h3, may carry a footnote sup)
 *   [image | dimension]                  measurement image with its dimension ("4.361 mm")
 *   [label | value]                      fact
 *   [paragraphs with leading sup]        footnotes (last row)
 * Options: short (three fact columns on desktop).
 */

const LABELS = {
  model: 'Modell auswählen',
  transmission: 'Getriebe auswählen',
};
let seq = 0;

const cellText = (c) => (c ? c.textContent.replace(/\s+/g, ' ').trim() : '');
const slug = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '');

function unwrapCell(c) {
  if (!c) return [];
  if (c.children.length === 1 && c.firstElementChild.tagName === 'P') return [...c.firstElementChild.childNodes];
  return [...c.childNodes];
}

function parseRows(block) {
  const variants = [];
  let footnotes = null;
  let variant = null;
  let group = null;
  const ensureVariant = () => {
    if (!variant) {
      variant = {
        fuel: '', model: '', transmission: '', groups: [],
      };
      variants.push(variant);
    }
    return variant;
  };
  const ensureGroup = () => {
    const v = ensureVariant();
    if (!group) {
      group = { title: null, measurements: [], facts: [] };
      v.groups.push(group);
    }
    return group;
  };
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (!cells.some((c) => c.textContent.trim() || c.querySelector('img'))) return;
    if (cells.length >= 3) {
      variant = {
        fuel: cellText(cells[0]),
        model: cellText(cells[1]),
        transmission: cellText(cells[2]),
        groups: [],
      };
      variants.push(variant);
      group = null;
      return;
    }
    if (cells.length === 1) {
      const c = cells[0];
      const heading = c.querySelector('h1, h2, h3, h4, h5, h6');
      if (heading) {
        ensureVariant();
        group = { title: heading, measurements: [], facts: [] };
        variant.groups.push(group);
      } else {
        footnotes = c;
      }
      return;
    }
    const [a, b] = cells;
    if (a.querySelector('img')) {
      ensureGroup().measurements.push({ img: a.querySelector('picture') || a.querySelector('img'), label: cellText(b) });
    } else {
      ensureGroup().facts.push({ label: unwrapCell(a), value: unwrapCell(b) });
    }
  });
  return { variants: variants.filter((v) => v.groups.length), footnotes };
}

function buildGroup(g, idx) {
  seq += 1;
  const section = document.createElement('section');
  section.className = 'technical-data-group';
  const bodyId = `technical-data-body-${seq}`;
  if (g.title) {
    const head = document.createElement('h3');
    head.className = 'technical-data-group-title';
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'technical-data-toggle';
    btn.setAttribute('aria-expanded', 'true');
    btn.setAttribute('aria-controls', bodyId);
    const label = document.createElement('span');
    label.className = 'technical-data-toggle-label';
    label.append(...g.title.childNodes);
    const icon = document.createElement('span');
    icon.className = 'bmw-icon technical-data-toggle-icon';
    icon.dataset.icon = 'arrow_chevron_up';
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = 'arrow_chevron_up';
    btn.append(label, icon);
    head.append(btn);
    section.append(head);
  } else if (idx === 0) {
    section.classList.add('no-title');
  }
  const body = document.createElement('div');
  body.className = 'technical-data-body';
  body.id = bodyId;
  const inner = document.createElement('div');
  inner.className = 'technical-data-body-inner';
  if (g.measurements.length) {
    const m = document.createElement('div');
    m.className = 'technical-data-measurements';
    g.measurements.forEach(({ img, label }) => {
      const item = document.createElement('figure');
      item.className = 'technical-data-measurement';
      if (img) {
        const i = img.tagName === 'IMG' ? img : img.querySelector('img');
        if (i) i.loading = 'lazy';
        item.append(img);
      }
      if (label) {
        const cap = document.createElement('figcaption');
        cap.textContent = label;
        item.append(cap);
      }
      m.append(item);
    });
    inner.append(m);
  }
  if (g.facts.length) {
    const dl = document.createElement('dl');
    dl.className = 'technical-data-facts';
    g.facts.forEach(({ label, value }) => {
      const f = document.createElement('div');
      f.className = 'technical-data-fact';
      const dt = document.createElement('dt');
      dt.append(...label);
      const dd = document.createElement('dd');
      dd.append(...value);
      f.append(dt, dd);
      dl.append(f);
    });
    inner.append(dl);
  }
  body.append(inner);
  section.append(body);
  return section;
}

function buildDropdown(label, onSelect) {
  seq += 1;
  const wrap = document.createElement('div');
  wrap.className = 'technical-data-dropdown';
  const lab = document.createElement('span');
  lab.className = 'technical-data-dropdown-label';
  lab.id = `technical-data-dd-${seq}`;
  lab.textContent = label;
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'technical-data-dropdown-button';
  button.setAttribute('aria-haspopup', 'listbox');
  button.setAttribute('aria-expanded', 'false');
  button.setAttribute('aria-labelledby', `${lab.id} technical-data-dd-${seq}-value`);
  const value = document.createElement('span');
  value.id = `technical-data-dd-${seq}-value`;
  button.append(value);
  const list = document.createElement('ul');
  list.className = 'technical-data-dropdown-list';
  list.setAttribute('role', 'listbox');
  list.setAttribute('aria-labelledby', lab.id);
  list.hidden = true;
  let options = [];
  const close = () => {
    list.hidden = true;
    button.setAttribute('aria-expanded', 'false');
  };
  const open = () => {
    list.hidden = false;
    button.setAttribute('aria-expanded', 'true');
    const sel = list.querySelector('[aria-selected="true"]') || list.querySelector('[role="option"]');
    if (sel) sel.focus();
  };
  button.addEventListener('click', () => (list.hidden ? open() : close()));
  list.addEventListener('keydown', (e) => {
    const opts = [...list.querySelectorAll('[role="option"]')];
    const i = opts.indexOf(document.activeElement);
    if (e.key === 'ArrowDown') { e.preventDefault(); opts[Math.min(opts.length - 1, i + 1)].focus(); }
    if (e.key === 'ArrowUp') { e.preventDefault(); opts[Math.max(0, i - 1)].focus(); }
    if (e.key === 'Escape') { close(); button.focus(); }
    if ((e.key === 'Enter' || e.key === ' ') && i >= 0) { e.preventDefault(); opts[i].click(); }
  });
  document.addEventListener('click', (e) => { if (!wrap.contains(e.target)) close(); });
  wrap.append(lab, button, list);
  return {
    element: wrap,
    /** @param {{group?: string, label: string, value: string}[]} opts @param {string} selected */
    set(opts, selected) {
      options = opts;
      list.replaceChildren();
      let lastGroup = null;
      options.forEach((o) => {
        if (o.group && o.group !== lastGroup) {
          const g = document.createElement('li');
          g.className = 'technical-data-dropdown-group';
          g.setAttribute('role', 'presentation');
          g.textContent = o.group;
          list.append(g);
        }
        lastGroup = o.group;
        const li = document.createElement('li');
        li.setAttribute('role', 'option');
        li.tabIndex = -1;
        li.className = 'technical-data-dropdown-option';
        li.textContent = o.label;
        li.setAttribute('aria-selected', String(o.value === selected));
        li.addEventListener('click', () => {
          close();
          button.focus();
          onSelect(o.value);
        });
        list.append(li);
      });
      const cur = options.find((o) => o.value === selected);
      value.textContent = cur ? cur.label : '';
      button.disabled = options.length < 2;
      wrap.hidden = !options.length;
    },
  };
}

export default function decorate(block) {
  const { variants, footnotes } = parseRows(block);
  if (!variants.length) return;

  // panels (one per variant)
  const panels = variants.map((v) => {
    const panel = document.createElement('div');
    panel.className = 'technical-data-variant';
    panel.hidden = true;
    v.groups.forEach((g, i) => panel.append(buildGroup(g, i)));
    return panel;
  });

  // footnotes
  const notes = document.createElement('div');
  notes.className = 'technical-data-footnotes';
  const noteItems = footnotes ? [...footnotes.querySelectorAll('p')].map((p) => {
    const sup = p.querySelector('sup');
    const n = sup ? sup.textContent.trim() : '';
    p.classList.add('technical-data-footnote');
    if (n) p.id = p.id || `technical-data-fn-${n}`;
    notes.append(p);
    return { n, p };
  }) : [];

  // model / transmission selection
  const models = [];
  variants.forEach((v, i) => {
    let m = models.find((x) => x.model === v.model && x.fuel === v.fuel);
    if (!m) {
      m = { model: v.model, fuel: v.fuel, variants: [] };
      models.push(m);
    }
    m.variants.push(i);
  });
  let current = 0;
  const dropdowns = document.createElement('div');
  dropdowns.className = 'technical-data-dropdowns';
  // eslint-disable-next-line no-use-before-define
  const modelDd = buildDropdown(LABELS.model, (val) => show(models[Number(val)].variants[0]));
  // eslint-disable-next-line no-use-before-define
  const transDd = buildDropdown(LABELS.transmission, (val) => show(Number(val)));
  dropdowns.append(modelDd.element, transDd.element);

  function show(index) {
    current = index;
    panels.forEach((p, i) => { p.hidden = i !== index; });
    const v = variants[index];
    const mIndex = models.findIndex((m) => m.variants.includes(index));
    modelDd.set(models.map((m, i) => ({
      group: m.fuel, label: m.model, value: String(i),
    })), String(mIndex));
    const trans = models[mIndex].variants.filter((i) => variants[i].transmission);
    const transOpts = trans.map((i) => ({ label: variants[i].transmission, value: String(i) }));
    transDd.set(trans.length > 1 ? transOpts : [], String(index));
    // footnotes referenced by the visible variant
    const refs = new Set([...panels[index].querySelectorAll('sup')].map((s) => s.textContent.replace(/[[\]\s]/g, '')));
    const anyRef = noteItems.some(({ n }) => refs.has(n));
    noteItems.forEach(({ n, p }) => { p.hidden = anyRef && !refs.has(n); });
    block.dataset.variant = slug(v.model);
  }

  // collapse / expand groups
  block.addEventListener('click', (e) => {
    const btn = e.target.closest('.technical-data-toggle');
    if (!btn || !block.contains(btn)) return;
    const section = btn.closest('.technical-data-group');
    const body = section.querySelector('.technical-data-body');
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    body.style.maxHeight = `${body.scrollHeight}px`;
    // force layout so the transition starts from the measured height
    // eslint-disable-next-line no-unused-expressions
    body.offsetHeight;
    btn.setAttribute('aria-expanded', String(!expanded));
    section.classList.toggle('is-collapsed', expanded);
    if (expanded) {
      body.style.maxHeight = '0px';
    } else {
      body.addEventListener('transitionend', () => { body.style.maxHeight = ''; }, { once: true });
    }
  });

  block.replaceChildren(dropdowns, ...panels);
  if (noteItems.length) block.append(notes);
  if (models.length < 2 && !variants.some((v) => v.transmission)) dropdowns.hidden = true;

  // preselect from the URL hash (e.g. "#bmw-520d-touring" from "Technische Daten" links)
  const hash = decodeURIComponent(window.location.hash.replace(/^#/, '')).toLowerCase();
  const fromHash = hash ? variants.findIndex((v) => slug(v.model) === hash
    || slug(`${v.model} ${v.transmission}`) === hash) : -1;
  show(fromHash >= 0 ? fromHash : current);
  decorateFontIcons(block);
}
