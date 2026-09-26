import { decorateFontIcons } from '../../scripts/bmw-utils.js';

/*
 * Drivetrain Switch (source .cmp-drivetrain-switch): switch between the drivetrain variants of a
 * model (each variant is its own page, linked with #drivetrain). Desktop: drivetrain cards on the
 * left (current one framed + check mark), model card (series name + car), key facts and CTAs on the
 * right. Mobile: the cards become a dropdown above the car.
 *  Rows (any order, all optional):
 *   [group label (+ branding image) | list: car image + name per drivetrain; plain text = current
 *    page, link = other drivetrain page]
 *   [series name | car image]            model card
 *   [label | value]                      key facts (label may carry footnote sup)
 *   [links]                              CTAs (strong/em = button, plain = link; compare links get
 *                                        the compare icon)
 *   [text]                               disclaimer (small print)
 */

let seq = 0;

const hasImage = (c) => !!(c && c.querySelector('picture, img'));
const onlyLinks = (c) => {
  const links = [...c.querySelectorAll('a[href]')];
  return links.length > 0
    && c.textContent.replace(/\s+/g, '') === links.map((a) => a.textContent).join('').replace(/\s+/g, '');
};

function buildGroups(groupRows) {
  const nav = document.createElement('div');
  nav.className = 'drivetrain-switch-models';
  const options = [];
  groupRows.forEach(([labelCell, listCell]) => {
    const group = document.createElement('div');
    group.className = 'drivetrain-switch-group';
    const label = document.createElement('div');
    label.className = 'drivetrain-switch-group-label';
    const labelText = labelCell ? labelCell.textContent.replace(/\s+/g, ' ').trim() : '';
    if (labelText) {
      const span = document.createElement('span');
      span.textContent = labelText;
      label.append(span);
    }
    const brand = labelCell && labelCell.querySelector('img');
    if (brand) {
      brand.className = 'drivetrain-switch-subbrand';
      brand.loading = 'lazy';
      label.append(brand);
    }
    if (label.children.length) group.append(label);
    const ul = document.createElement('ul');
    ul.className = 'drivetrain-switch-cards';
    [...listCell.querySelectorAll('li')].forEach((li) => {
      const link = li.querySelector('a[href]');
      const img = li.querySelector('img');
      const name = (link || li).textContent.replace(/\s+/g, ' ').trim();
      const item = document.createElement('li');
      item.className = 'drivetrain-switch-card-item';
      const card = document.createElement(link ? 'a' : 'span');
      card.className = 'drivetrain-switch-card';
      if (link) {
        card.href = link.getAttribute('href');
      } else {
        card.classList.add('is-selected');
        card.setAttribute('aria-current', 'page');
      }
      if (img) {
        const iw = document.createElement('span');
        iw.className = 'drivetrain-switch-card-image';
        img.alt = '';
        img.loading = 'lazy';
        iw.append(img.closest('picture') || img);
        card.append(iw);
      }
      const n = document.createElement('span');
      n.className = 'drivetrain-switch-card-name';
      n.textContent = name;
      card.append(n);
      item.append(card);
      ul.append(item);
      options.push({
        group: labelText, name, href: link ? link.getAttribute('href') : '', selected: !link,
      });
    });
    group.append(ul);
    nav.append(group);
  });
  return { nav, options };
}

function buildDropdown(options) {
  seq += 1;
  const current = options.find((o) => o.selected) || options[0];
  const wrap = document.createElement('div');
  wrap.className = 'drivetrain-switch-dropdown';
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'drivetrain-switch-dropdown-button';
  button.setAttribute('aria-haspopup', 'listbox');
  button.setAttribute('aria-expanded', 'false');
  const listId = `drivetrain-switch-list-${seq}`;
  button.setAttribute('aria-controls', listId);
  const title = document.createElement('span');
  title.textContent = current ? current.name : '';
  button.append(title);
  const list = document.createElement('ul');
  list.className = 'drivetrain-switch-dropdown-list';
  list.id = listId;
  list.hidden = true;
  let lastGroup = null;
  options.forEach((o) => {
    if (o.group && o.group !== lastGroup) {
      const g = document.createElement('li');
      g.className = 'drivetrain-switch-dropdown-group';
      g.textContent = o.group;
      g.setAttribute('role', 'presentation');
      list.append(g);
    }
    lastGroup = o.group;
    const li = document.createElement('li');
    const el = document.createElement(o.href ? 'a' : 'span');
    el.className = 'drivetrain-switch-dropdown-option';
    el.textContent = o.name;
    if (o.href) el.href = o.href;
    else {
      el.classList.add('is-selected');
      el.setAttribute('aria-current', 'page');
    }
    li.append(el);
    list.append(li);
  });
  const close = () => {
    list.hidden = true;
    button.setAttribute('aria-expanded', 'false');
  };
  button.addEventListener('click', () => {
    const open = list.hidden;
    list.hidden = !open;
    button.setAttribute('aria-expanded', String(open));
  });
  list.addEventListener('click', (e) => {
    if (e.target.closest('.is-selected')) close();
  });
  document.addEventListener('click', (e) => {
    if (!wrap.contains(e.target)) close();
  });
  wrap.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      close();
      button.focus();
    }
  });
  if (options.length < 2) button.disabled = true;
  wrap.append(button, list);
  return wrap;
}

export default function decorate(block) {
  const groupRows = [];
  let modelRow = null;
  const facts = [];
  const ctaCells = [];
  const disclaimers = [];

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (!cells.some((c) => c.textContent.trim() || hasImage(c))) return;
    if (cells.length >= 2 && cells[1].querySelector('ul, ol')) {
      groupRows.push(cells);
    } else if (cells.length >= 2 && hasImage(cells[1]) && !modelRow) {
      modelRow = cells;
    } else if (cells.length >= 2) {
      facts.push(cells);
    } else if (onlyLinks(cells[0])) {
      ctaCells.push(cells[0]);
    } else {
      disclaimers.push(cells[0]);
    }
  });

  const selection = document.createElement('div');
  selection.className = 'drivetrain-switch-selection';
  const details = document.createElement('div');
  details.className = 'drivetrain-switch-details';

  if (groupRows.length) {
    const { nav, options } = buildGroups(groupRows);
    selection.append(nav);
    if (options.length) details.append(buildDropdown(options));
  }

  if (modelRow) {
    const [nameCell, imgCell] = modelRow;
    const card = document.createElement('div');
    card.className = 'drivetrain-switch-modelcard';
    const series = nameCell.textContent.replace(/\s+/g, ' ').trim();
    if (series) {
      const s = document.createElement('p');
      s.className = 'drivetrain-switch-series';
      s.setAttribute('aria-hidden', 'true');
      s.textContent = series;
      card.append(s);
    } else card.classList.add('no-series');
    const img = imgCell.querySelector('img');
    if (img) {
      const iw = document.createElement('div');
      iw.className = 'drivetrain-switch-car';
      img.loading = 'lazy';
      iw.append(img.closest('picture') || img);
      card.append(iw);
    }
    details.append(card);
  }

  const data = document.createElement('div');
  data.className = 'drivetrain-switch-data';
  const techRow = document.createElement('div');
  techRow.className = 'drivetrain-switch-techdata-wrapper';
  if (facts.length) {
    const dl = document.createElement('dl');
    dl.className = 'drivetrain-switch-facts';
    facts.forEach(([l, v]) => {
      const item = document.createElement('div');
      item.className = 'drivetrain-switch-fact';
      const dt = document.createElement('dt');
      const dd = document.createElement('dd');
      const unwrap = (c) => (c.children.length === 1 && c.firstElementChild.tagName === 'P' ? c.firstElementChild.childNodes : c.childNodes);
      dt.append(...unwrap(l));
      dd.append(...unwrap(v));
      item.append(dt, dd);
      dl.append(item);
    });
    techRow.append(dl);
  }
  if (ctaCells.length) {
    const ctas = document.createElement('div');
    ctas.className = 'drivetrain-switch-ctas';
    ctaCells.forEach((c) => {
      c.querySelectorAll('a[href]').forEach((a) => {
        const p = a.closest('p') || document.createElement('p');
        if (!p.contains(a)) p.append(a);
        if (/vergleich/i.test(a.getAttribute('href')) || /vergleich/i.test(a.textContent)) {
          a.classList.add('drivetrain-switch-compare');
          p.classList.add('drivetrain-switch-secondary');
        } else {
          p.classList.add('drivetrain-switch-primary');
        }
        if (!a.classList.contains('button') && !a.classList.contains('drivetrain-switch-compare')) {
          a.classList.add('link-arrow');
        }
        ctas.append(p);
      });
    });
    techRow.append(ctas);
  }
  if (techRow.children.length) data.append(techRow);
  if (disclaimers.length) {
    const disc = document.createElement('div');
    disc.className = 'drivetrain-switch-disclaimer';
    disclaimers.forEach((c) => disc.append(...c.childNodes));
    data.append(disc);
  }
  if (data.children.length) details.append(data);

  block.replaceChildren(...[selection, details].filter((e) => e.children.length));
  if (!selection.children.length) block.classList.add('no-selection');
  // in-page target of the "#drivetrain" links from the sibling pages
  if (!document.getElementById('drivetrain')) block.id = 'drivetrain';
  decorateFontIcons(block);
}
