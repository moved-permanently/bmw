import connect from '../da.js';
import { marketForPath, bindingHref, valuesFromSheet } from '../../../scripts/aida-wdh.js';

const escape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

(async function init() {
  const main = document.querySelector('main');
  try {
    const da = await connect();
    const market = marketForPath(da.context.path)?.market || 'de';
    const sheet = `/aida/data/wdh-${market}.json`;
    const [rows, models] = await Promise.all([da.rows(sheet, 'values'), da.rows(sheet, 'models')]);
    const values = valuesFromSheet({ values: rows });

    main.innerHTML = `<p class="aida-muted">Insert a tech value from WDH (${market.toUpperCase()}). It stays linked to its source and is kept current.</p>
      <p><select aria-label="Model"></select></p><table><tbody></tbody></table>`;
    const select = main.querySelector('select');
    models.forEach((m) => select.append(new Option(`${m.name} (${m.code})`, m.code)));

    const show = () => {
      const tbody = main.querySelector('tbody');
      tbody.innerHTML = '';
      [...values.entries()].filter(([key]) => key.startsWith(`${select.value}.`)).forEach(([key, v]) => {
        const tr = document.createElement('tr');
        tr.innerHTML = '<td></td><td></td><td><button type="button">Insert</button></td>';
        tr.children[0].textContent = v.label;
        tr.children[1].textContent = v.display.length > 90 ? `${v.display.slice(0, 87)}…` : v.display;
        tr.querySelector('button').addEventListener('click', () => {
          da.actions.sendHTML(`<a href="${bindingHref(market, key)}">${escape(v.display)}</a>`);
          da.actions.closeLibrary();
        });
        tbody.append(tr);
      });
    };
    select.addEventListener('change', show);
    show();
  } catch (e) {
    main.innerHTML = '<p class="aida-error"></p>';
    main.querySelector('p').textContent = `WDH values could not be loaded: ${e.message}`;
  }
}());
