/*
 * The site inside a foreign page via <aem-embed> (https://www.aem.live/docs/aem-embed).
 * Two local origins: the "site" serves the working tree's code plus fixture content
 * (test/embed/fixtures) with access-control-allow-origin: *, like the EDS origin; the "host"
 * serves only a page with the embeds and tools/embed-demo/scripts/aem-embed.js.
 * Chromium: CHROME_PATH, else playwright-core's default lookup.
 */
import {
  test, before, after,
} from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const FIXTURES = path.join(ROOT, 'test/embed/fixtures');
const CODE_DIRS = ['scripts', 'blocks', 'styles', 'fonts', 'icons'];
const TYPES = {
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.woff2': 'font/woff2',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.html': 'text/html',
};

const siteHits = [];
const hostHits = [];
let site;
let host;
let siteOrigin;
let hostOrigin;
let browser;

function inside(dir, file) {
  return file.startsWith(`${dir}${path.sep}`) && fs.existsSync(file) && fs.statSync(file).isFile();
}

function send(res, status, file, extra = {}) {
  if (!file) {
    res.writeHead(status, extra);
    res.end();
    return;
  }
  res.writeHead(status, { 'content-type': TYPES[path.extname(file)] || 'application/octet-stream', ...extra });
  fs.createReadStream(file).pipe(res);
}

/** Full page like the EDS pipeline renders it: head.html + header/main/footer. */
function sitePage(plain) {
  const head = fs.readFileSync(path.join(ROOT, 'head.html'), 'utf8')
    .replace(/<meta\s+http-equiv="Content-Security-Policy"[\s\S]*?\/>\s*/, '');
  const main = fs.readFileSync(path.join(FIXTURES, plain), 'utf8');
  return `<!DOCTYPE html><html><head><title>Embed test</title>${head}</head><body><header></header><main>${main}</main><footer></footer></body></html>`;
}

function listen(server) {
  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => resolve(`http://127.0.0.1:${server.address().port}`));
  });
}

before(async () => {
  site = http.createServer((req, res) => {
    const { pathname } = new URL(req.url, 'http://x');
    siteHits.push(pathname);
    const cors = { 'access-control-allow-origin': '*' };
    if (pathname === '/page') {
      res.writeHead(200, { 'content-type': 'text/html', ...cors });
      res.end(sitePage('page.plain.html'));
      return;
    }
    const [, top] = pathname.split('/');
    const base = CODE_DIRS.includes(top) ? ROOT : FIXTURES;
    const file = path.join(base, decodeURIComponent(pathname));
    if (inside(base, file)) send(res, 200, file, cors);
    else send(res, 404, null, cors);
  });
  host = http.createServer((req, res) => {
    const { pathname } = new URL(req.url, 'http://x');
    hostHits.push(pathname);
    if (pathname === '/') {
      res.writeHead(200, { 'content-type': 'text/html' });
      res.end(`<!DOCTYPE html><html><head><title>Host</title>
        <script src="/scripts/aem-embed.js" type="module"></script></head><body>
        <aem-embed type="header" url="${siteOrigin}/nav"></aem-embed>
        <main><aem-embed url="${siteOrigin}/page"></aem-embed></main>
        <aem-embed type="footer" url="${siteOrigin}/footer"></aem-embed>
        <div style="height: 3000px"></div>
        </body></html>`);
      return;
    }
    if (pathname === '/scripts/aem-embed.js') {
      send(res, 200, path.join(ROOT, 'tools/embed-demo/scripts/aem-embed.js'));
      return;
    }
    send(res, 404);
  });
  siteOrigin = await listen(site);
  hostOrigin = await listen(host);
  const { CHROME_PATH } = process.env;
  browser = await chromium.launch(CHROME_PATH ? { executablePath: CHROME_PATH } : {});
});

after(async () => {
  await browser?.close();
  site?.close();
  host?.close();
});

/** Header and footer as rendered under root (document or an aem-embed shadow root). */
function summarize(root) {
  const header = root.querySelector('header');
  const footer = root.querySelector('footer');
  const text = (el) => (el ? el.textContent.replace(/\s+/g, ' ').trim() : '');
  return {
    header: header && {
      classes: [...header.classList].sort(),
      height: getComputedStyle(header).height,
      drops: [...header.querySelectorAll('.nav-drop')].map(text),
      buttons: [...header.querySelectorAll('.nav-button')].map((a) => `${a.className}: ${text(a)}`),
      heading: text(header.querySelector('.nav-panel-heading')),
    },
    footer: footer && {
      bands: [...footer.querySelectorAll('.footer-band')].map((b) => b.className),
      text: text(footer),
    },
  };
}

/** Opens a page at 1440px and collects page errors. */
async function open(url) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.addInitScript(`window.summarize = ${summarize}`);
  await page.goto(url);
  return { page, errors };
}

/** Waits until the shadow root of the nth <aem-embed> matches selector. */
async function waitInEmbed(page, index, selector, count = 1) {
  await page.waitForFunction(([i, sel, n]) => {
    const root = document.querySelectorAll('aem-embed')[i]?.shadowRoot;
    return !!root && root.querySelectorAll(sel).length >= n;
  }, [index, selector, count], { timeout: 10000 });
}

/** Evaluates fn(shadowRoot) in the shadow root of the nth <aem-embed>, once it has rendered. */
async function inEmbed(page, index, fn, arg) {
  await waitInEmbed(page, index, 'body.appear');
  return page.evaluate(([i, src, a]) => {
    // eslint-disable-next-line no-new-func
    const f = new Function(`return (${src})`)();
    return f(document.querySelectorAll('aem-embed')[i].shadowRoot, a);
  }, [index, fn.toString(), arg]);
}

test('embedded: code and content load from the site origin only', async () => {
  const { page, errors } = await open(`${hostOrigin}/`);
  await inEmbed(page, 0, () => true);
  await inEmbed(page, 1, () => true);
  await inEmbed(page, 2, () => true);
  await page.waitForTimeout(1000);
  await page.close();
  assert.deepEqual([...new Set(hostHits)].filter((p) => p !== '/favicon.ico').sort(), ['/', '/scripts/aem-embed.js']);
  assert.deepEqual(errors, []);
});

test('embedded: scripts.js does not run the page load (no consent, sidebar, own header)', async () => {
  siteHits.length = 0;
  const { page } = await open(`${hostOrigin}/`);
  await inEmbed(page, 1, () => true);
  await page.waitForTimeout(1000);
  const hostDoc = await page.evaluate(() => ({
    lang: document.documentElement.lang,
    sections: document.querySelectorAll('main > .section, main .block').length,
    appear: document.body.classList.contains('appear'),
  }));
  await page.close();
  assert.deepEqual(hostDoc, { lang: '', sections: 0, appear: false }, 'the host document is not decorated');
  assert.equal(siteHits.includes('/scripts/bmw-consent.js'), false);
  assert.equal(siteHits.includes('/scripts/bmw-sidebar.js'), false);
  assert.equal(siteHits.filter((p) => p === '/nav.plain.html').length, 1, 'only aem-embed fetches the nav');
  assert.equal(siteHits.filter((p) => p === '/footer.plain.html').length, 1, 'only aem-embed fetches the footer');
});

test('embedded header and footer: built from the content aem-embed passes in, same as on the site', async () => {
  const onSite = await open(`${siteOrigin}/page`);
  await onSite.page.waitForFunction(() => document.querySelector('.nav-panel-heading')?.textContent.includes('Sheet')
    && document.querySelector('.footer-band'), null, { timeout: 10000 });
  const expected = await onSite.page.evaluate(() => window.summarize(document));
  await onSite.page.close();

  const { page } = await open(`${hostOrigin}/`);
  await waitInEmbed(page, 0, '.nav-panel-heading');
  await page.waitForTimeout(500);
  const header = await inEmbed(page, 0, (root) => window.summarize(root).header);
  const footer = await inEmbed(page, 2, (root) => window.summarize(root).footer);
  const blue = await inEmbed(page, 0, (root) => getComputedStyle(root.querySelector('body')).getPropertyValue('--bmw-blue').trim());
  await page.close();

  assert.equal(expected.header.heading, 'Willkommen aus dem Sheet.', 'login panel texts come from the site sheet');
  assert.deepEqual(header, expected.header);
  assert.deepEqual(footer, expected.footer);
  assert.equal(blue, '#1c69d4', ':host gets the :root custom properties');
});

test('embedded: clicks inside the shadow root do not count as outside clicks', async () => {
  const { page } = await open(`${hostOrigin}/`);
  await waitInEmbed(page, 0, '.nav-panel-heading');
  await page.locator('aem-embed').nth(0).locator('.nav-drop', { hasText: 'Kaufen' }).click();
  await page.locator('aem-embed').nth(0).locator('.nav-flyout.is-open .nav-flyout-body').click({ position: { x: 5, y: 5 } });
  const flyoutOpen = await inEmbed(page, 0, (root) => !!root.querySelector('.nav-flyout.is-open'));

  await page.setViewportSize({ width: 390, height: 844 });
  const dropdown = page.locator('aem-embed').nth(1).locator('.drivetrain-switch-dropdown-button');
  await dropdown.click();
  const listOpen = await inEmbed(page, 1, (root) => !root.querySelector('.drivetrain-switch-dropdown-list').hidden);
  await page.close();
  assert.equal(flyoutOpen, true, 'header flyout stays open');
  assert.equal(listOpen, true, 'drivetrain dropdown opens');
});

test('embedded: in-page navigation finds its targets in the shadow root', async () => {
  const { page } = await open(`${hostOrigin}/`);
  await waitInEmbed(page, 1, '.content-navigation-link');
  await page.locator('aem-embed').nth(1).locator('.content-navigation-link', { hasText: 'Ziel' }).click();
  await page.waitForTimeout(1000);
  const { scrollY, top } = await page.evaluate(() => ({
    scrollY: window.scrollY,
    top: [...document.querySelectorAll('aem-embed')[1].shadowRoot.querySelectorAll('h2')]
      .find((h) => h.textContent === 'Ziel-Abschnitt').getBoundingClientRect().top,
  }));
  await page.close();
  assert.ok(scrollY > 0, 'the page scrolled');
  assert.ok(top >= 0 && top < 300, `the target is at the top (${top}px)`);
});

test('embedded main: nested blocks and fragments load from the site into the shadow root', async () => {
  const { page } = await open(`${hostOrigin}/`);
  await waitInEmbed(page, 1, '.download-link', 2).catch(() => {});
  const main = await inEmbed(page, 1, (root) => ({
    downloads: [...root.querySelectorAll('.download-label')].map((l) => l.textContent),
    fragment: root.textContent.includes('Fragment text'),
    downloadCss: [...root.querySelectorAll('link[rel="stylesheet"]')]
      .map((l) => l.href).filter((h) => h.endsWith('/blocks/download/download.css')),
    headCss: [...document.head.querySelectorAll('link[rel="stylesheet"]')].map((l) => l.href),
  }));
  await page.close();
  assert.deepEqual(main.downloads.sort(), ['Fragment-Liste', 'Preisliste']);
  assert.equal(main.fragment, true);
  assert.deepEqual(main.downloadCss, [`${siteOrigin}/blocks/download/download.css`]);
  assert.equal(main.headCss.some((h) => h.includes('/blocks/')), false, 'block CSS stays out of the host document');
});

test('embedded: BMW fonts are registered on the host document, so the shadow roots can use them', async () => {
  const { page } = await open(`${hostOrigin}/`);
  await inEmbed(page, 1, () => true);
  const fonts = await page.evaluate(async () => ({
    link: [...document.head.querySelectorAll('link[rel="stylesheet"]')].map((l) => l.href).filter((h) => h.endsWith('/styles/fonts.css')),
    loaded: (await document.fonts.load('300 16px bmwTypeNextWeb')).length,
  }));
  await page.close();
  assert.deepEqual(fonts.link, [`${siteOrigin}/styles/fonts.css`]);
  assert.ok(fonts.loaded > 0, 'bmwTypeNextWeb loads cross-origin');
});

test('site page itself: loadPage still runs (header from /nav.plain.html, consent loads)', async () => {
  siteHits.length = 0;
  const { page, errors } = await open(`${siteOrigin}/page`);
  await page.waitForSelector('header .nav-drop', { timeout: 10000 });
  await page.waitForFunction(() => document.querySelectorAll('.download-link').length === 2, null, { timeout: 10000 });
  await page.waitForTimeout(500);
  await page.close();
  assert.ok(siteHits.includes('/nav.plain.html'));
  assert.ok(siteHits.includes('/scripts/bmw-consent.js'));
  assert.deepEqual(errors, []);
});
