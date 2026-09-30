import connect from '../da.js';
import {
  marketForPath, bindingHref, valuesFromSheet, dataRootForPath,
} from '../../../scripts/aida-wdh.js';

(async function init() {
  const main = document.querySelector('main');
  if (window.parent === window) {
    main.querySelector('p').textContent = 'Insert linked WDH values from inside a DA document. Open the integrated showcase to explore the market data and simulated review workflow.';
    return;
  }
  try {
    const da = await connect();
    const market = marketForPath(da.context.path)?.market || 'de';
    const sheet = `${dataRootForPath(da.context.path)}/wdh-${market}.json`;
    const [rows, models] = await Promise.all([da.rows(sheet, 'values'), da.rows(sheet, 'models')]);
    const values = valuesFromSheet({ values: rows });

    main.innerHTML = '<h1>WDH values</h1><p class="aida-muted"></p><p><label class="spectrum-FieldLabel" for="wdh-model">Model</label><select id="wdh-model" class="spectrum-Picker spectrum-Picker--sizeM" aria-label="Model"></select></p><div class="wdh-table-scroll"><table class="spectrum-Table spectrum-Table--sizeM"><caption>Linked technical values</caption><thead class="spectrum-Table-head"><tr class="spectrum-Table-row"><th scope="col" class="spectrum-Table-headCell">Value</th><th scope="col" class="spectrum-Table-headCell">Current WDH export</th><th scope="col" class="spectrum-Table-headCell">Action</th></tr></thead><tbody class="spectrum-Table-body"></tbody></table></div>';
    main.querySelector('.aida-muted').textContent = `Insert a tech value from WDH (${market.toUpperCase()}). The link preserves its source; preflight checks for changes against the current export.`;
    const select = main.querySelector('select');
    models.forEach((m) => select.append(new Option(`${m.name} (${m.code})`, m.code)));

    const show = () => {
      const tbody = main.querySelector('tbody');
      tbody.replaceChildren();
      [...values.entries()].filter(([key]) => key.startsWith(`${select.value}.`)).forEach(([key, v]) => {
        const tr = document.createElement('tr');
        tr.className = 'spectrum-Table-row';
        tr.innerHTML = '<th scope="row" class="spectrum-Table-cell"></th><td class="spectrum-Table-cell"></td><td class="spectrum-Table-cell"><button type="button" class="spectrum-Button spectrum-Button--sizeM spectrum-Button--accent spectrum-Button--fill"><span class="spectrum-Button-label">Insert</span></button></td>';
        tr.children[0].textContent = v.label;
        tr.children[1].textContent = v.display.length > 90 ? `${v.display.slice(0, 87)}…` : v.display;
        tr.querySelector('button').addEventListener('click', () => {
          const link = document.createElement('a');
          link.setAttribute('href', bindingHref(market, key, dataRootForPath(da.context.path)));
          link.textContent = v.display;
          da.actions.sendHTML(link.outerHTML);
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
