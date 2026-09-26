import {
  test, describe, beforeEach, afterEach,
} from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import worker from '../src/index.js';
import { extractCompare, outerElement } from '../src/extract.js';

const FIXTURE = `<!DOCTYPE html><html><head><script>var x = "<div>";</script></head><body>
<header><div class="cmp-globalnavigation"><div>nav</div></div></header>
<main><div class="container"><div class="cmp-compare" data-component-path="compare-v1" data-config="W10=">
  <div class="cmp-compare__header"><div><img src="a.png"/></div></div>
  <div class="cmp-compare__selection"><form><select><option>1</option></select></form></div>
  <table class="cmp-comparetable"><tr><td><div>cell</div></td></tr></table>
</div><div class="after">after</div></div>
<div class="comparefootnotes"><ol class="cmp-compare__footnotes" data-component-path="FootnotesList">
  <li class="cmp-compare__footnotes-item" id="compare-footnotes-1">note 1</li>
</ol></div></main>
<footer><div>footer</div></footer></body></html>`;

// real capture of a content.q response (not committed to the worker; used when present)
const RAW = fileURLToPath(new URL('../../../../migration-work/raw/api/content.q', import.meta.url));

describe('extractCompare', () => {
  test('keeps compare component + footnotes only', () => {
    const out = extractCompare(FIXTURE);
    assert.ok(out.startsWith('<div class="bmw-proxy-extract" data-extract="compare">'));
    assert.match(out, /<div class="cmp-compare" data-component-path="compare-v1" data-config="W10=">/);
    assert.match(out, /<div>cell<\/div>/);
    assert.match(out, /note 1/);
    assert.doesNotMatch(out, /after|footer|nav|<script/);
    // balanced
    const opens = (out.match(/<div\b/g) || []).length;
    const closes = (out.match(/<\/div>/g) || []).length;
    assert.equal(opens, closes);
  });

  test('returns null when the marker is missing', () => {
    assert.equal(extractCompare('<html><body><div>nothing</div></body></html>'), null);
  });

  test('outerElement ignores similarly named classes', () => {
    const html = '<div class="cmp-compare__x">a</div><div class="cmp-compare x"><div>b</div></div>';
    assert.equal(outerElement(html, 'div', /<div\b[^>]*\bclass="cmp-compare[\s"]/), '<div class="cmp-compare x"><div>b</div></div>');
  });

  test('real content.q capture (if available) shrinks to the compare markup', { skip: !existsSync(RAW) }, () => {
    const html = readFileSync(RAW, 'utf8');
    const out = extractCompare(html);
    assert.ok(out);
    assert.ok(out.length < html.length * 0.6, `extract ${out.length} of ${html.length}`);
    assert.match(out, /data-component-path="compare-v1"/);
    assert.match(out, /cmp-comparetable/);
    assert.match(out, /cmp-compare__footnotes-item/);
    assert.doesNotMatch(out, /cmp-globalnavigation/);
  });
});

describe('extract=compare through the worker', () => {
  const realFetch = globalThis.fetch;
  let calls;
  beforeEach(() => {
    calls = [];
    globalThis.fetch = async (url) => {
      calls.push(String(url));
      return new Response(url.includes('X/G65') ? FIXTURE : '<html>no compare</html>', {
        status: 200, headers: { 'content-type': 'text/html;charset=utf-8', etag: '"abc"' },
      });
    };
  });
  afterEach(() => { globalThis.fetch = realFetch; });

  test('returns fragment, strips extract from upstream URL', async () => {
    const res = await worker.fetch(new Request('https://w.test/de/bmw-modelle-vergleichen.html/X/G65/61JF/content.q?extract=compare'), { CACHE: 'off' }, {});
    assert.equal(res.status, 200);
    assert.equal(calls[0], 'https://www.bmw.de/de/bmw-modelle-vergleichen.html/X/G65/61JF/content.q');
    assert.equal(res.headers.get('x-proxy-extract'), 'compare');
    assert.equal(res.headers.get('etag'), null);
    assert.equal(res.headers.get('cache-control'), 'public, max-age=3600');
    const body = await res.text();
    assert.match(body, /bmw-proxy-extract/);
    assert.doesNotMatch(body, /footer/);
  });

  test('without extract the full HTML is proxied', async () => {
    const res = await worker.fetch(new Request('https://w.test/de/bmw-modelle-vergleichen.html/X/G65/61JF/content.q'), { CACHE: 'off' }, {});
    assert.equal(await res.text(), FIXTURE);
  });

  test('missing marker -> 502 extract_failed', async () => {
    const res = await worker.fetch(new Request('https://w.test/de/bmw-modelle-vergleichen.html/7/G70/81HY/A/content.q?extract=compare'), { CACHE: 'off' }, {});
    assert.equal(res.status, 502);
    assert.equal(JSON.parse(await res.text()).error, 'extract_failed');
  });

  test('bare compare path and deep paths are allowed, other suffixes are not', async () => {
    const ok = await worker.fetch(new Request('https://w.test/de/bmw-modelle-vergleichen.html/content.q'), { CACHE: 'off' }, {});
    assert.equal(ok.status, 200);
    const bad = await worker.fetch(new Request('https://w.test/de/bmw-modelle-vergleichen.html/X/G65/content.json'), { CACHE: 'off' }, {});
    assert.equal(bad.status, 403);
  });
});
