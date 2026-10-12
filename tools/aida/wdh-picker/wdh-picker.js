import connect from '../da.js';
import {
  marketForPath, bindingHref, valuesFromSheet, dataRootForPath,
} from '../../../scripts/aida-wdh.js';

(async function init() {
  const main = document.querySelector('main');
  if (window.parent === window) {
    main.querySelector('p').textContent = 'Insert linked WDH values from inside a page in Experience Workspace. Open the integrated showcase to explore the market data and the demo review workflow.';
    return;
  }
  try {
    const da = await connect();
    const { market = 'de', lang = 'en' } = marketForPath(da.context.path) || {};
    const sheet = `${dataRootForPath(da.context.path)}/wdh-${market}.json`;
    const [rows, models] = await Promise.all([da.rows(sheet, 'values'), da.rows(sheet, 'models')]);
    const values = valuesFromSheet({ values: rows }, lang);

    main.innerHTML = '<h1>WDH values</h1><p class="aida-muted"></p><p><label class="spectrum-FieldLabel" for="wdh-model">Model</label><select id="wdh-model" class="spectrum-Picker spectrum-Picker--sizeM" aria-label="Model"></select></p><div class="wdh-table-scroll"><table class="spectrum-Table spectrum-Table--sizeM"><thead class="spectrum-Table-head"><tr class="spectrum-Table-row"><th scope="col" class="spectrum-Table-headCell">Property</th><th scope="col" class="spectrum-Table-headCell">Current source value</th><th scope="col" class="spectrum-Table-headCell">Action</th></tr></thead><tbody class="spectrum-Table-body"></tbody></table></div>';
    const badges = [...values.values()].some((v) => v.sourceLabel);
    main.querySelector('.aida-muted').textContent = `Insert a linked value (${market.toUpperCase()} market).${badges ? ' Source badges distinguish WDH exports, demo data and derived statements.' : ''}`;
    const select = main.querySelector('select');
    models.forEach((m) => select.append(new Option(`${m.name} (${m.code})`, m.code)));

    const show = () => {
      const tbody = main.querySelector('tbody');
      tbody.replaceChildren();
      [...values.entries()].filter(([key]) => key.startsWith(`${select.value}.`)).forEach(([key, v]) => {
        const tr = document.createElement('tr');
        tr.className = 'spectrum-Table-row';
        tr.innerHTML = '<th scope="row" class="spectrum-Table-cell"></th><td class="spectrum-Table-cell"><span class="wdh-display"></span><span class="wdh-source spectrum-Badge spectrum-Badge--sizeS spectrum-Badge--neutral"><span class="spectrum-Badge-label"></span></span></td><td class="spectrum-Table-cell"><button type="button" class="spectrum-Button spectrum-Button--sizeM spectrum-Button--accent spectrum-Button--fill spectrum-Button--iconOnly"><svg class="spectrum-Icon" width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M9 3.5v11M3.5 9h11" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button></td>';
        tr.children[0].textContent = v.label;
        tr.children[0].lang = lang;
        tr.querySelector('.wdh-display').textContent = v.display.length > 90 ? `${v.display.slice(0, 87)}…` : v.display;
        tr.querySelector('.wdh-display').title = v.display;
        if (v.sourceLabel) {
          tr.querySelector('.spectrum-Badge-label').textContent = v.sourceLabel;
          tr.querySelector('.wdh-source').lang = lang;
        } else {
          tr.querySelector('.wdh-source').remove();
        }
        const button = tr.querySelector('button');
        button.title = 'Insert';
        button.setAttribute('aria-label', `Insert ${v.label}`);
        button.addEventListener('click', () => {
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
