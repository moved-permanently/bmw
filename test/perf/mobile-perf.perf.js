/*
 * Mobile performance regressions (PSI / Lighthouse mobile audit, 2026-10-01).
 * Real Chromium against local code + preview content (see harness.js).
 * Run: npm run test:perf   (needs network access to the preview and a Chromium, see harness.js)
 */
import {
  test, before, after,
} from 'node:test';
import assert from 'node:assert/strict';
import { startServer, launchBrowser, mobileContext } from './harness.js';

const CARD_IMAGE_HOST = /^https:\/\/(prod\.cosy\.bmw\.cloud\/|www\.bmw\.de\/content\/dam\/)/;
// generous upper bound of Chromium's lazy-load distance (1250 px on fast, 2500 px on slow networks)
const LAZY_MARGIN = 3000;

let server;
let browser;

before(async () => {
  server = await startServer();
  browser = await launchBrowser();
});

after(async () => {
  if (browser) await browser.close();
  if (server) await server.close();
});

/** Opens a page (consent layer suppressed: it is not under test) and waits for decoration. */
async function open(path, { onRequest, settle = 3000 } = {}) {
  const ctx = await mobileContext(browser);
  const page = await ctx.newPage();
  if (onRequest) page.on('request', onRequest);
  const sep = path.includes('?') ? '&' : '?';
  await page.goto(`${server.origin}${path}${sep}consent=disabled`, { waitUntil: 'load', timeout: 60000 });
  await page.waitForFunction(() => document.querySelector('main .section[data-section-status="loaded"]'), null, { timeout: 30000 });
  await page.waitForTimeout(settle);
  return { page, close: () => ctx.close() };
}

test('all-models: off-screen model card images are not requested before they near the viewport', async () => {
  // initiator "script" = requested by the block code itself (not by the browser's lazy loading)
  const requested = new Map();
  const ctx = await mobileContext(browser);
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  await cdp.send('Network.enable');
  cdp.on('Network.requestWillBeSent', (e) => {
    if (CARD_IMAGE_HOST.test(e.request.url)) requested.set(e.request.url, e.initiator.type);
  });
  await page.goto(`${server.origin}/de/neufahrzeuge?consent=disabled`, { waitUntil: 'load', timeout: 60000 });
  await page.waitForTimeout(3000);
  const cards = await page.evaluate(() => [...document.querySelectorAll('.all-models-card .all-models-image img')]
    .map((img) => ({ src: img.src, top: img.getBoundingClientRect().top + window.scrollY })));
  const vh = await page.evaluate(() => window.innerHeight);
  await ctx.close();
  assert.ok(cards.length > 50, `expected the full model grid, got ${cards.length} cards`);
  const near = new Set(cards.filter((c) => c.top < vh + LAZY_MARGIN).map((c) => c.src));
  const farOnly = [...new Set(cards.filter((c) => !near.has(c.src)).map((c) => c.src))];
  const scripted = farOnly.filter((src) => requested.get(src) === 'script');
  assert.equal(scripted.length, 0, `${scripted.length} of ${farOnly.length} far-off card images were requested by script without scrolling`);
  // the grid grows while images load: a card just past the margin may be lazy-loaded legitimately
  const early = farOnly.filter((src) => requested.has(src));
  assert.ok(early.length <= 2, `${early.length} of ${farOnly.length} far-off card images were requested without scrolling`);
});

// no fetchpriority hints on card / teaser images: Lighthouse's simulated LCP (Lantern) leaves
// low-priority images out of its estimate, so a high-priority hint raised the lab LCP by 0.2–0.45 s
['/de/neufahrzeuge', '/de/elektroauto'].forEach((path) => {
  test(`all-models guard: model card images stay lazy without high priority (${path})`, async () => {
    const { page, close } = await open(path);
    const imgs = await page.evaluate(() => [...document.querySelectorAll('.all-models-card .all-models-image img')]
      .map((img) => ({ loading: img.loading, priority: img.getAttribute('fetchpriority') })));
    await close();
    assert.ok(imgs.length > 0);
    assert.ok(imgs.every((i) => i.loading === 'lazy' && i.priority !== 'high'));
  });
});

test('guard: hero teasers below the first block stay lazy; the hero-stage poster stays eager/high', async () => {
  const { page, close } = await open('/de/home');
  const r = await page.evaluate(() => ({
    stage: [...document.querySelectorAll('.hero-stage .hero-stage-media img')].slice(0, 1)
      .map((img) => [img.loading, img.getAttribute('fetchpriority')]),
    teasers: [...document.querySelectorAll('main .hero-teaser .hero-teaser-media img')]
      .map((img) => [img.loading, img.getAttribute('fetchpriority')]),
  }));
  await close();
  assert.deepEqual(r.stage, [['eager', 'high']]);
  assert.ok(r.teasers.length > 0);
  assert.ok(r.teasers.every(([loading, priority]) => loading === 'lazy' && priority !== 'high'), JSON.stringify(r.teasers));
});

test('head.html preconnects to the Scene7 image host', async () => {
  const { page, close } = await open('/de/home', { settle: 0 });
  const links = await page.evaluate(() => [...document.head.querySelectorAll('link[rel="preconnect"]')].map((l) => l.href));
  await close();
  assert.ok(links.includes('https://bmw.scene7.com/'), `preconnect links: ${JSON.stringify(links)}`);
});

test('header and footer load their fragments from the site root without a /content/ 404 first', async () => {
  const fragments = [];
  const { page, close } = await open('/de/home', {
    onRequest: (r) => { const u = new URL(r.url()); if (/\/(nav|footer)\.plain\.html$/.test(u.pathname)) fragments.push(u.pathname); },
  });
  await page.waitForSelector('header .nav-hamburger', { timeout: 20000 });
  await page.waitForSelector('footer a[href]', { timeout: 20000 });
  await close();
  assert.deepEqual(fragments.sort(), ['/footer.plain.html', '/nav.plain.html']);
});

test('header/footer guard: pages of the local content preview (/content/…) still read /content/ fragments first', async () => {
  const fragments = [];
  const ctx = await mobileContext(browser);
  const page = await ctx.newPage();
  // serve the /de/home document under /content/de/home (the local content-directory preview URL)
  await page.route('**/content/de/home', async (route) => {
    const resp = await route.fetch({ url: `${server.origin}/de/home?consent=disabled` });
    route.fulfill({ response: resp });
  });
  page.on('request', (r) => { const u = new URL(r.url()); if (/\/(nav|footer)\.plain\.html$/.test(u.pathname)) fragments.push(u.pathname); });
  await page.goto(`${server.origin}/content/de/home`, { waitUntil: 'load', timeout: 60000 });
  await page.waitForSelector('header .nav-hamburger', { timeout: 20000 });
  await page.waitForSelector('footer a[href]', { timeout: 20000 });
  await ctx.close();
  assert.equal(fragments.find((f) => f.endsWith('nav.plain.html')), '/content/nav.plain.html');
  assert.equal(fragments.find((f) => f.endsWith('footer.plain.html')), '/content/footer.plain.html');
});
