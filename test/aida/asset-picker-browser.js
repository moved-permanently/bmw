import mountPicker from '../../tools/aida/asset-picker/asset-picker.js';

const results = [];
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const tick = () => new Promise((resolve) => { setTimeout(resolve, 10); });
const change = (element, value) => {
  element.value = value;
  element.dispatchEvent(new Event('change', { bubbles: true }));
};

const originalImage = window.Image;
window.Image = function TestImage() {
  const img = document.createElement('img');
  Object.defineProperties(img, {
    naturalWidth: { value: 960 },
    naturalHeight: { value: 640 },
    src: {
      set(value) { img.dataset.src = value; setTimeout(() => img.onload?.(), 0); },
      get() { return img.dataset.src; },
    },
  });
  return img;
};

const assets = [
  {
    id: 'i5-front',
    title: 'BMW i5 front',
    alt: 'BMW i5 front',
    kind: 'marketing',
    url: 'https://bmw.scene7.com/is/image/BMW/g60-front:3to2',
    crops: { '3to2': 'https://bmw.scene7.com/is/image/BMW/g60-front:3to2' },
    brands: ['BMW'],
    families: ['5 Series'],
    models: ['i5'],
    countries: [],
    sources: ['/de/home'],
  },
  {
    id: 'm5-render',
    title: 'BMW M5 render',
    alt: '',
    kind: 'cosy',
    url: 'https://prod.cosy.bmw.cloud/bmwweb/cosySec?COSY-EU-100-fixture',
    crops: {},
    brands: ['BMW M'],
    families: ['5 Series'],
    models: ['M5'],
    countries: [],
    sources: ['/de/home'],
  },
];
const html = await (await fetch('/tools/aida/asset-picker/asset-picker.html')).text();
const main = new DOMParser().parseFromString(html, 'text/html').querySelector('main');
document.body.append(main);
const find = (id) => main.querySelector(`#asset-${id}`);
const inserted = [];
let closed = false;
mountPicker(main, {
  assets,
  context: { path: '/aida/fr/be/i5' },
  actions: { sendHTML: (value) => inserted.push(value), closeLibrary: () => { closed = true; } },
});

async function test(name, run) {
  try { await run(); results.push({ name, pass: true }); } catch (error) {
    results.push({ name, pass: false, error: error.message });
  }
}

await test('explicit document country and all five facets are wired', () => {
  assert(find('country').value === 'be', 'Belgium must win over French language');
  assert(main.querySelectorAll('#asset-filters select').length === 5, 'Exactly five facets');
  change(find('kind'), 'marketing');
  change(find('model'), 'i5');
  assert(find('results').children.length === 1, 'Kind and model filters must combine');
});

await test('selection shows observed crops and enables direct-reference insertion', async () => {
  find('results').querySelector('button').click();
  await tick();
  assert(!find('detail').hidden, 'Selected image must open');
  assert(!find('scene7').hidden, 'Scene7 options must be visible');
  assert(find('crop').options.length === 2, 'No invented smart crops');
  assert(!find('insert').disabled, 'Loaded image with alt text must be insertable');
});

await test('framing and sharpening are encoded in the persistent URL', async () => {
  change(find('framing'), '1:1');
  change(find('anchor'), 'left');
  find('sharpen').checked = true;
  find('sharpen').dispatchEvent(new Event('change'));
  await tick();
  const url = new URL(find('url').value);
  assert(url.searchParams.get('cropN') === '0,0,0.66666667,1', 'Normalized square crop expected');
  assert(url.searchParams.get('op_sharpen') === '1', 'Sharpen must survive insertion');
  assert(!url.searchParams.has('wid'), 'Output width must remain responsive');
});

await test('edited and decorative alt text update both insertion and preview', () => {
  find('alt').value = 'Front of a blue BMW i5';
  find('alt').dispatchEvent(new Event('input'));
  assert(find('preview').querySelector('img').alt === find('alt').value, 'Preview alt must follow editing');
  assert(find('markup').value.includes('Front of a blue BMW i5'), 'Insertion alt must follow editing');
  find('decorative').checked = true;
  find('decorative').dispatchEvent(new Event('change'));
  assert(find('preview').querySelector('img').alt === '', 'Decorative preview must have empty alt');
  assert(find('markup').value.includes('Image without alt text'), 'Use the existing decorative sentinel');
});

await test('alt validation prevents empty meaningful images, then inserts through the DA SDK', async () => {
  find('decorative').checked = false;
  find('decorative').dispatchEvent(new Event('change'));
  find('alt').value = '';
  find('alt').dispatchEvent(new Event('input'));
  assert(find('insert').disabled, 'Missing alt must disable insertion');
  find('alt').value = 'BMW i5 front';
  find('alt').dispatchEvent(new Event('input'));
  find('insert').click();
  await tick();
  assert(inserted.length === 1 && closed, 'SDK insertion and library close must happen once');
  assert(inserted[0].includes('cropN=') && !inserted[0].includes('<img'), 'Preserve an external delivery link');
});

await test('COSY selection hides Scene7 controls and preserves its URL', async () => {
  find('back').click();
  change(find('kind'), 'cosy');
  find('results').querySelector('button').click();
  await tick();
  assert(find('scene7').hidden, 'No Scene7 options for COSY');
  assert(find('url').value === assets[1].url, 'COSY URL must be unchanged');
  assert(find('alt').value === '' && find('insert').disabled, 'Derived labels must not become default alt');
});

await test('reset keeps the document country but clears other filters', () => {
  find('back').click();
  find('reset').click();
  assert(find('country').value === 'be', 'Reset must retain document country');
  assert(find('kind').value === '' && find('model').value === '', 'Reset must clear other facets');
  assert(find('results').children.length === 2, 'Both image kinds must return');
});

await test('double-click sends only one insertion while the SDK call is in flight', async () => {
  const clean = new DOMParser().parseFromString(html, 'text/html').querySelector('main');
  main.replaceWith(clean);
  let sends = 0;
  let closes = 0;
  let finish;
  mountPicker(clean, {
    assets: [assets[0]],
    actions: {
      sendHTML: () => { sends += 1; return new Promise((resolve) => { finish = resolve; }); },
      closeLibrary: () => { closes += 1; },
    },
  });
  clean.querySelector('#asset-results button').click();
  await tick();
  const button = clean.querySelector('#asset-insert');
  button.click();
  button.click();
  finish();
  await tick();
  assert(sends === 1 && closes === 1, 'Only one SDK insertion and close allowed');
  clean.replaceWith(main);
});

window.Image = originalImage;

await test('DA context is received even when the catalogue loads after the initial handshake', async () => {
  const frame = document.createElement('iframe');
  const delayedFetch = `<script>
    const originalFetch = window.fetch;
    window.fetch = (input, ...args) => String(input).endsWith('catalogue.json')
      ? new Promise(resolve => setTimeout(() => resolve(new Response('[]')), 1400))
      : originalFetch(input, ...args);
  </script>`;
  const markup = html.replace('<head>', `<head><base href="${location.origin}/tools/aida/asset-picker/">${delayedFetch}`);
  frame.onload = () => {
    const channel = new MessageChannel();
    frame.contentWindow.postMessage({
      ready: true,
      context: { org: 'demo', repo: 'demo', path: '/aida/fr/be/check' },
    }, location.origin, [channel.port2]);
  };
  frame.srcdoc = markup;
  document.body.append(frame);
  await new Promise((resolve) => { setTimeout(resolve, 2400); });
  const country = frame.contentDocument.querySelector('#asset-country').value;
  const count = frame.contentDocument.querySelector('#asset-count').textContent;
  frame.remove();
  assert(country === 'be' && count.includes('0 images'), 'Early DA context must survive slow catalogue loading');
});

window.assetPickerTests = results;
document.querySelector('#results').textContent = JSON.stringify(results, null, 2);
