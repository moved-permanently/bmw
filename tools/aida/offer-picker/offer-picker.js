import connect from '../da.js';
import { readRecord, blockRows } from '../../../scripts/structured-content.js';
import {
  OFFERS, offerPaths, offerEntry, offerLink,
} from './offers.js';

const el = (tag, className, textContent = '') => Object.assign(
  document.createElement(tag),
  { className, textContent },
);

const fields = (doc, name) => {
  const block = doc.querySelector(`main .${name}`);
  return block ? readRecord(blockRows(block)) : {};
};

(async function init() {
  const status = document.getElementById('offer-status');
  const list = document.getElementById('offer-list');
  if (window.parent === window) {
    status.textContent = 'Open Offer records from the library in the editor, with the cursor in an offer-teaser row, to insert a record link.';
    return;
  }
  try {
    const da = await connect();
    const entries = (await Promise.all(offerPaths(await da.list(OFFERS)).map(async (path) => {
      const doc = new DOMParser().parseFromString(await da.read(path), 'text/html');
      return offerEntry(path, fields(doc, 'da-form'), fields(doc, 'market-offer'));
    }))).filter(Boolean);
    status.textContent = entries.length
      ? 'Put the cursor in an offer-teaser row, then insert the record link.'
      : `No market-offer records in ${OFFERS}.`;
    list.replaceChildren(...entries.map((entry) => {
      const li = el('li', 'offer-item');
      li.append(el('p', 'offer-title', entry.title));
      const meta = [entry.market, entry.headline].filter(Boolean).join(' · ');
      if (meta) li.append(el('p', 'aida-muted offer-meta', meta));
      const button = el('button', 'spectrum-Button spectrum-Button--sizeM spectrum-Button--accent spectrum-Button--fill');
      button.type = 'button';
      button.append(el('span', 'spectrum-Button-label', 'Insert link'));
      button.setAttribute('aria-label', `Insert link to ${entry.title}`);
      button.addEventListener('click', () => {
        const { href, text } = offerLink(entry);
        const link = document.createElement('a');
        link.setAttribute('href', href);
        link.textContent = text;
        da.actions.sendHTML(link.outerHTML);
        da.actions.closeLibrary();
      });
      li.append(button);
      return li;
    }));
  } catch (e) {
    status.textContent = `Offer records could not be loaded: ${e.message}`;
    status.classList.add('aida-error');
  }
}());
