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
// the only directories served from the working tree; everything else comes from the preview
const CODE_DIRS = ['scripts', 'blocks', 'styles', 'fonts', 'icons'];
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

const within = (dir, file) => file.startsWith(`${dir}${path.sep}`);

/**
 * Where a request is answered from: { status } = rejected, { file } = local code file,
 * {} = proxied to the preview. Decoded once; dot segments (only possible percent-encoded, the
 * URL parser resolves plain ones), NUL and backslashes are rejected for every path. A local file
 * must stay inside its code directory both as joined path and as realpath (symlinks).
 * @param {string} pathname URL pathname (still percent-encoded)
 */
export function resolveRequest(pathname) {
  let decoded;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    return { status: 400 };
  }
  const segments = decoded.split('/').slice(1);
  if (/[\0\\]/.test(decoded) || segments.some((s) => s === '.' || s === '..')) return { status: 400 };
  if (!CODE_DIRS.includes(segments[0]) || segments.length < 2) return {};
  const dir = path.join(ROOT, segments[0]);
  const file = path.join(dir, ...segments.slice(1));
  if (!within(dir, file)) return { status: 403 };
  if (!fs.existsSync(file)) return {}; // not in the working tree: the preview's copy
  const real = fs.realpathSync(file);
  if (!within(fs.realpathSync(dir), real)) return { status: 403 };
  return fs.statSync(real).isFile() ? { file: real } : {};
}

async function handle(req, res) {
  const url = new URL(req.url, 'http://localhost');
  const target = resolveRequest(url.pathname);
  if (target.status) {
    res.writeHead(target.status, { 'content-type': 'text/plain' });
    res.end('rejected');
    return;
  }
  if (target.file) {
    res.writeHead(200, { 'content-type': TYPES[path.extname(target.file)] || 'application/octet-stream', 'cache-control': 'no-store' });
    fs.createReadStream(target.file).pipe(res);
    return;
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
    // real sandbox: playwright-core adds --no-sandbox unless this is true
    chromiumSandbox: true,
    args: ['--disable-dev-shm-usage'],
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
