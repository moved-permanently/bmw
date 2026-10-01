/*
 * Browser harness for the mobile performance regression tests.
 * Starts an in-process server that serves the local code (/scripts, /blocks, /styles, /fonts,
 * /icons) and proxies everything else from the preview, swapping the page <head> snippet for the
 * local head.html (CSP sent as a header with the fixed "aem" nonce) — like `aem up`, no daemon.
 * Chromium: CHROME_PATH, else playwright-core's default lookup (PLAYWRIGHT_BROWSERS_PATH /
 * `npx playwright install chromium`).
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
export const PREVIEW = process.env.PERF_PREVIEW || 'https://main--bmw--moved-permanently.aem.page';
const CODE_PATH = /^\/(scripts|blocks|styles|fonts|icons)\//;
const TYPES = {
  '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.json': 'application/json',
};
// head.html snippet as rendered into preview pages (viewport meta .. styles.css link)
const HEAD_SNIPPET = /<meta name="viewport"[\s\S]*?<link rel="stylesheet" href="\/styles\/styles\.css">/;
const HOP_HEADERS = /^(content-encoding|content-length|transfer-encoding|connection|keep-alive|content-security-policy|location|strict-transport-security)$/;

function localHead() {
  const head = fs.readFileSync(path.join(ROOT, 'head.html'), 'utf8');
  const csp = head.match(/http-equiv="Content-Security-Policy"\s+content="([^"]+)"/);
  return {
    csp: csp ? csp[1] : '',
    markup: head.replace(/<meta\s+http-equiv="Content-Security-Policy"[\s\S]*?\/>\s*/, '').trim(),
  };
}

async function handle(req, res) {
  const url = new URL(req.url, 'http://localhost');
  if (CODE_PATH.test(url.pathname)) {
    const file = path.join(ROOT, decodeURIComponent(url.pathname));
    if (file.startsWith(ROOT) && fs.existsSync(file) && fs.statSync(file).isFile()) {
      res.writeHead(200, { 'content-type': TYPES[path.extname(file)] || 'application/octet-stream', 'cache-control': 'no-store' });
      fs.createReadStream(file).pipe(res);
      return;
    }
  }
  const upstream = await fetch(`${PREVIEW}${url.pathname}${url.search}`, {
    redirect: 'manual',
    headers: { 'user-agent': req.headers['user-agent'] || 'perf-harness', accept: req.headers.accept || '*/*' },
  });
  const headers = {};
  upstream.headers.forEach((v, k) => { if (!HOP_HEADERS.test(k)) headers[k] = v; });
  const location = upstream.headers.get('location');
  if (location) headers.location = location.replace(PREVIEW, '');
  let body = Buffer.from(await upstream.arrayBuffer());
  const type = upstream.headers.get('content-type') || '';
  if (type.startsWith('text/html') && !url.pathname.endsWith('.plain.html') && upstream.ok) {
    const html = body.toString('utf8');
    if (!HEAD_SNIPPET.test(html)) throw new Error(`head snippet not found in ${url.pathname}`);
    const head = localHead();
    body = Buffer.from(html.replace(HEAD_SNIPPET, head.markup));
    if (head.csp) headers['content-security-policy'] = head.csp;
  }
  res.writeHead(upstream.status, headers);
  res.end(body);
}

/** @returns {Promise<{origin: string, close: function}>} */
export async function startServer() {
  const server = http.createServer((req, res) => {
    handle(req, res).catch((e) => {
      if (!res.headersSent) res.writeHead(502, { 'content-type': 'text/plain' });
      res.end(String(e && e.message));
    });
  });
  await new Promise((resolve) => { server.listen(0, '127.0.0.1', resolve); });
  const { port } = server.address();
  return {
    origin: `http://127.0.0.1:${port}`,
    close: () => new Promise((resolve) => { server.closeAllConnections(); server.close(resolve); }),
  };
}

export async function launchBrowser() {
  return chromium.launch({
    headless: true,
    executablePath: process.env.CHROME_PATH || undefined,
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });
}

/** PSI / Lighthouse mobile emulation (Moto G Power: 412x823, DPR 1.75). */
export function mobileContext(browser) {
  return browser.newContext({
    viewport: { width: 412, height: 823 },
    deviceScaleFactor: 1.75,
    isMobile: true,
    hasTouch: true,
    locale: 'de-DE',
    userAgent: 'Mozilla/5.0 (Linux; Android 11; moto g power (2022)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36',
  });
}
