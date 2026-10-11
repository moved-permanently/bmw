import { matchIcons, iconText, iconLabel } from './icons.js';

(async function init() {
  const search = document.getElementById('icon-search');
  const count = document.getElementById('icon-count');
  const grid = document.getElementById('icon-grid');
  const standalone = window.parent === window;
  const editor = standalone ? null : import('../da.js').then((m) => m.default());

  let names;
  try {
    const resp = await fetch('./icons.json');
    if (!resp.ok) throw new Error(resp.status);
    names = await resp.json();
  } catch (e) {
    count.textContent = `Icons could not be loaded: ${e.message}`;
    count.classList.add('aida-error');
    return;
  }

  const tile = (name) => {
    const li = document.createElement('li');
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'icon-tile';
    button.dataset.icon = name;
    button.title = iconText(name);
    button.disabled = standalone;
    const glyph = document.createElement('span');
    glyph.className = 'icon-glyph';
    glyph.setAttribute('aria-hidden', 'true');
    glyph.textContent = name;
    const label = document.createElement('span');
    label.className = 'icon-name';
    label.textContent = iconLabel(name);
    button.append(glyph, label);
    li.append(button);
    return li;
  };

  const show = () => {
    const matches = matchIcons(names, search.value);
    grid.replaceChildren(...matches.map(tile));
    const total = matches.length === names.length ? `${names.length} icons` : `${matches.length} of ${names.length} icons`;
    count.textContent = standalone ? `${total}. Open BMW icons from the library in the editor to insert one.` : total;
  };

  grid.addEventListener('click', async (e) => {
    const button = e.target.closest('button[data-icon]');
    if (!button || !editor) return;
    const { actions } = await editor;
    actions.sendText(iconText(button.dataset.icon));
    actions.closeLibrary();
  });
  search.addEventListener('input', show);
  show();
}());
