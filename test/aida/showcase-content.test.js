import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { test } from 'node:test';

const module = await import('../../tools/aida/showcase/content.mjs').catch((error) => {
  if (error.code !== 'ERR_MODULE_NOT_FOUND') throw error;
  return {};
});
const catalogue = JSON.parse(readFileSync(new URL('../../tools/aida/asset-picker/catalogue.json', import.meta.url)));
const contexts = ['en', 'de/de', 'fr/fr', 'fr/be'];
const slugs = ['home', 'i5', 'e-mobility', 'news/i5-launch', 'news/cannes', 'news/concept-m', 'news/interior', 'news/hydrogen', 'news/3-series'];
const build = () => {
  assert.equal(typeof module.buildContent, 'function', 'A deterministic showcase content generator is required');
  return module.buildContent({ catalogue });
};
const section = (html, name) => html.match(new RegExp(`<section[^>]*data-component="${name}"[^>]*>([\\s\\S]*?)<\\/section>`))?.[1] || '';
const factLinks = (html) => [...html.matchAll(/href="(\/aida\/showcase\/data\/wdh-(de|fr)\.json)#([A-Za-z0-9]+\.[A-Za-z0-9]+)">([^<]*)<\/a>/g)];

test('generator is deterministic, non-mutating and builds all four complete contexts', () => {
  const before = JSON.stringify(catalogue);
  const first = build();
  assert.deepEqual(first, build());
  assert.equal(JSON.stringify(catalogue), before);
  assert.deepEqual(Object.keys(first.pages).sort(), [...contexts.flatMap((context) => slugs.map((slug) => `/aida/showcase/${context}/${slug}`)), ...['home', 'i5', 'e-mobility', 'news/i5-launch'].map((slug) => `/aida/showcase/de/at/${slug}`)].sort());
  for (const html of Object.values(first.pages)) {
    assert.match(html, /^<body><header><\/header><main>/);
    assert.match(html, /class="metadata"/);
    assert.match(html, /Demo fixture|Demo-Datensatz|Données de démonstration/);
    assert.doesNotMatch(html, /<script|\[object Object\]|undefined|autoplay/i);
  }
});

test('Austria is a populated German context with explicit DE fallback and no German summer offer', () => {
  const { pages } = build();
  for (const slug of ['home', 'i5', 'e-mobility', 'news/i5-launch']) {
    const html = pages[`/aida/showcase/de/at/${slug}`];
    assert.ok(html, `Missing AT fixture ${slug}`);
    assert.match(html, /Österreich/);
    assert.match(html, /DE.*Fallback|Fallback.*DE/);
    assert.doesNotMatch(html, /data-component="summer-offer"/);
    assert.match(html, /wdh-de\.json#61HG\./);
  }
});

test('home follows PDF mandatory composition plus shared interior and Germany-only summer offer', () => {
  const { pages } = build();
  for (const context of contexts) {
    const html = pages[`/aida/showcase/${context}/home`];
    const order = [...html.matchAll(/data-component="([^"]+)"/g)].map((m) => m[1]);
    assert.deepEqual(order.slice(0, 4), ['main-teaser-i5', 'video-teaser-ix3', 'small-teaser-emob', 'teaser-list']);
    for (const slug of ['cannes', 'concept-m', 'interior', '3-series']) assert.match(section(html, 'teaser-list'), new RegExp(`/news/${slug}`));
    assert.match(section(html, 'teaser-list'), /BMW X/);
    assert.equal(order.includes('summer-offer'), context === 'de/de');
    assert.match(section(html, 'video-teaser-ix3'), /bmw\.scene7\.com\/is\/content\/BMW\/.*m3u8/);
  }
});

test('car has mandatory KPI, shortened shared interior, attribute-derived M5/iX3 and market feature omission', () => {
  const { pages, data } = build();
  for (const context of contexts) {
    const html = pages[`/aida/showcase/${context}/i5`];
    assert.deepEqual([...html.matchAll(/data-component="([^"]+)"/g)].map((m) => m[1]), ['main-teaser-i5', 'car-kpi', 'emob-section', 'news-teaser', 'electrified-models', 'assist-features', 'fact-refresh']);
    assert.equal(factLinks(section(html, 'car-kpi')).length, 3);
    assert.match(section(html, 'news-teaser'), /news\/interior/);
    assert.ok(section(pages[`/aida/showcase/${context}/home`], 'teaser-list').length > section(html, 'news-teaser').length);
    const models = section(html, 'electrified-models');
    assert.match(models, /BMW M5/);
    assert.match(models, /BMW iX3/);
    assert.doesNotMatch(models, /BMW 530e/);
    assert.match(section(html, 'assist-features'), /Driving Assistant Professional/);
    assert.equal(/Highway Assistant|Autobahnassistent|Assistant autoroutier/.test(html), !context.startsWith('fr'));
  }
  assert.ok(data['/aida/showcase/data/models.json'].data.some((model) => model.code === '81FK' && model.drivetrain === 'PHEV'));
});

test('topic has range, i5+iX3 model range, charging and reusable hydrogen news', () => {
  const { pages } = build();
  for (const context of contexts) {
    const html = pages[`/aida/showcase/${context}/e-mobility`];
    assert.deepEqual([...html.matchAll(/data-component="([^"]+)"/g)].map((m) => m[1]), ['stage-emob', 'topic-range', 'model-range', 'topic-charging', 'news-hydrogen']);
    const models = section(html, 'model-range');
    assert.match(models, /BMW i5/);
    assert.match(models, /BMW iX3/);
    assert.doesNotMatch(models, /BMW M5/);
    assert.match(section(html, 'news-hydrogen'), /news\/hydrogen/);
    assert.match(models, /61HG\.acceleration/);
  }
});

test('initial HTML contains exact market WDH display values, provenance, prices and repeated same facts', () => {
  const { pages, data } = build();
  for (const html of Object.values(pages)) {
    for (const [, path, , key, text] of factLinks(html)) {
      const row = data[path].values.data.find((value) => value.key === key);
      assert.ok(row, `Missing ${path}#${key}`);
      assert.equal(text, `${row.value}${row.unit ? ` ${row.unit}` : ''}`.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;'));
      assert.ok(row.source && row.sourceKey, `Missing source trail for ${key}`);
    }
  }
  assert.match(pages['/aida/showcase/de/de/i5'], /513–627 km/);
  assert.match(pages['/aida/showcase/fr/fr/i5'], /518–627 km/);
  assert.match(pages['/aida/showcase/fr/fr/i5'], /14,7–17,8 kWh\/100 km/);
  assert.ok(data['/aida/showcase/data/wdh-fr.json'].values.data.filter((row) => row.key.startsWith('31HR.')).every((row) => row.sourceMarket === 'de' && row.fallback === true));
  assert.match(pages['/aida/showcase/fr/be/i5'], /Belgique|Belgium/);
  const boundRange = /<a href="\/aida\/showcase\/data\/wdh-de\.json#61HG\.electricRange">513–627 km<\/a>/g;
  for (const slug of ['home', 'i5', 'e-mobility', 'news/i5-launch']) assert.match(pages[`/aida/showcase/en/${slug}`], boundRange);
});

test('news, models and metadata share stable entities and supplied WDH takes priority over illustrative DOCX numbers', () => {
  const { pages, data } = build();
  assert.match(pages['/aida/showcase/en/i5'], /Vehicle/);
  assert.match(pages['/aida/showcase/en/news/interior'], /NewsArticle/);
  assert.match(pages['/aida/showcase/en/e-mobility'], /WebPage/);
  const news = data['/aida/showcase/data/news.json'].data;
  assert.deepEqual([...new Set(news.map((item) => item.id))].sort(), ['3-series', 'cannes', 'concept-m', 'hydrogen', 'i5-launch', 'interior']);
  const interior = news.find((item) => item.id === 'interior' && item.lang === 'en');
  assert.ok(interior.teaserLong.length > interior.teaserShort.length);
  assert.ok(pages['/aida/showcase/en/home'].includes(interior.teaserLong));
  assert.ok(pages['/aida/showcase/en/i5'].includes(interior.teaserShort));
  assert.equal(data['/aida/showcase/data/wdh-de.json'].values.data.find((row) => row.key === '61HG.fromPrice').value, '70.900');
});

test('only observed catalogue images are authored and missing catalogue assets fail closed', () => {
  const { pages } = build();
  const urls = new Set(catalogue.map((asset) => asset.url));
  for (const html of Object.values(pages)) {
    const images = [...html.matchAll(/<img[^>]+src="([^"]+)"[^>]+alt="([^"]+)"/g)];
    assert.ok(images.length > 0);
    for (const [, url, alt] of images) {
      assert.ok(urls.has(url.replaceAll('&amp;', '&')), url);
      assert.ok(alt.length > 2);
    }
  }
  assert.throws(() => module.buildContent({ catalogue: [] }), /catalogue|asset/i);
});

test('generator accepts an external sheet without mutation and refresh is explicit one-request-only', () => {
  const initial = build();
  const wdh = { de: structuredClone(initial.data['/aida/showcase/data/wdh-de.json']), fr: structuredClone(initial.data['/aida/showcase/data/wdh-fr.json']) };
  wdh.de.values.data.find((row) => row.key === '61HG.electricRange').value = '500–600';
  const before = JSON.stringify(wdh);
  const updated = module.buildContent({ catalogue, wdh });
  assert.equal(JSON.stringify(wdh), before);
  assert.match(updated.pages['/aida/showcase/en/i5'], /500–600 km/);
  assert.ok(existsSync(new URL('../../blocks/aida-showcase/aida-showcase.js', import.meta.url)));
  assert.ok(existsSync(new URL('../../blocks/aida-showcase/aida-showcase.css', import.meta.url)));
  const runtime = readFileSync(new URL('../../scripts/aida-showcase.js', import.meta.url), 'utf8');
  assert.equal((runtime.match(/\bfetch\(/g) || []).length, 1);
  assert.match(runtime, /click/);
  assert.match(runtime, /disabled/);
  assert.doesNotMatch(runtime, /setInterval|autoplay/);
});
