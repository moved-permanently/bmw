import { sampleFactUpdate } from './connectors.js';
import { chapters, RFP } from './script.js';
import {
  tabs, defaultTab, demoPath, chapterFromHash, json,
  architectureView, assetView, deliveryView,
} from './view.js';

let requests = 0;
let currentSheet;
const main = document.querySelector('#content');
const message = document.querySelector('#message');
let messageTimer;

function notify(text, error = false) {
  message.textContent = text;
  message.classList.toggle('is-error', error);
  clearTimeout(messageTimer);
  messageTimer = setTimeout(() => { message.textContent = ''; }, error ? 12000 : 6500);
}

const views = {
  architecture: architectureView,
  assets: assetView,
  delivery: deliveryView,
};

const currentTab = () => window.location.hash.slice(1).split('/')[0] || defaultTab;

function render() {
  const tab = currentTab();
  document.querySelector('#navigation').innerHTML = tabs.map(([id, label]) => `<a href="#${id}" ${id === tab ? 'aria-current="page"' : ''}>${label}</a>`).join('');
  main.innerHTML = views[tab]
    ? views[tab]()
    : demoPath(chapters, chapterFromHash(window.location.hash, chapters.length), RFP);
}

main.addEventListener('click', async (event) => {
  const target = event.target.closest('[data-action]');
  if (!target) return;
  try {
    const type = target.dataset.action;
    if (type.startsWith('EXTEND_')) {
      document.querySelector('#extension').style.aspectRatio = type === 'EXTEND_WIDE' ? '16/9' : '4/5';
      notify('Format extended with neutral canvas. Not generated pixels or AI outpainting.'); return;
    }
    if (type === 'SAMPLE_WDH') {
      const result = sampleFactUpdate(currentSheet);
      document.querySelector('#delivery-result').textContent = json(result);
      notify(result.boundary); return;
    }
    if (type === 'REFRESH_DATA') {
      target.disabled = true;
      const start = performance.now();
      requests += 1;
      const response = await fetch('/aida/showcase/data/wdh-de.json');
      if (!response.ok) throw new Error(`WDH response ${response.status}`);
      const text = await response.text();
      document.querySelector('#request-count').textContent = requests;
      document.querySelector('#request-time').textContent = `${Math.round(performance.now() - start)} ms`;
      document.querySelector('#request-bytes').textContent = `${new TextEncoder().encode(text).length.toLocaleString()} B`;
      document.querySelector('#delivery-result').textContent = JSON.stringify(JSON.parse(text), null, 2);
      currentSheet = JSON.parse(text);
      target.disabled = false;
    }
  } catch (error) { target.disabled = false; notify(error.message, true); }
});
window.addEventListener('hashchange', render);
document.addEventListener('keydown', (event) => {
  if (currentTab() !== 'path' || event.target.closest('input, textarea, select') || event.altKey || event.metaKey || event.ctrlKey) return;
  const step = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
  if (!step) return;
  const next = chapterFromHash(window.location.hash, chapters.length) + step;
  if (next >= 0 && next < chapters.length) window.location.hash = `#path/${next}`;
});
render();
