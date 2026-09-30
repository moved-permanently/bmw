/* eslint-disable no-restricted-syntax */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
// eslint-disable-next-line import/extensions
import { buildContent } from '../../tools/aida/showcase/content.mjs';

const catalogue = JSON.parse(readFileSync(new URL('../../tools/aida/asset-picker/catalogue.json', import.meta.url)));
const contexts = ['en', 'de/de', 'de/at', 'fr/fr', 'fr/be'];

// Only div nesting is relevant to EDS block rows/cells; retain the original cell HTML.
function divs(html) {
  const root = { children: [] };
  const stack = [root];
  for (const match of html.matchAll(/<div\b([^>]*)>|<\/div>/g)) {
    if (match[0] === '</div>') {
      const node = stack.pop();
      node.html = html.slice(node.start, match.index);
    } else {
      const node = { className: match[1].match(/class="([^"]+)"/)?.[1] || '', start: match.index + match[0].length, children: [] };
      stack.at(-1).children.push(node);
      stack.push(node);
    }
  }
  assert.equal(stack.length, 1, 'Balanced authored div structure');
  return root.children;
}
const blocks = (section) => section.children.filter((node) => node.className && node.className !== 'section-metadata');
const names = (section) => blocks(section).map((node) => node.className.split(' ')[0]);
const native = (html) => divs(html.match(/<main>([\s\S]*)<\/main>/)[1]).filter((section) => !section.children.some((node) => node.className === 'metadata'));

function composed(content, path, id) {
  const row = content.data['/aida/showcase/data/compositions.json'].data.find((entry) => entry.path === path);
  assert.ok(Array.isArray(row.fixtureComponents), 'Explicit fixture section mapping is required outside the document');
  const component = row.fixtureComponents.find((entry) => entry.id === id);
  assert.ok(component, `Missing explicit fixture identity: ${path}/${id}`);
  const section = native(content.pages[path])[component.sectionIndex];
  assert.deepEqual(component.blocks, names(section));
  return section;
}

function shape(block, cells) {
  assert.deepEqual(block.children.map((row) => row.children.length), cells);
  for (const row of block.children) {
    for (const cell of row.children) assert.equal(cell.children.length, 0, 'Cells contain DA content, not synthetic div wrappers');
  }
}

test('new authoring documents use migrated blocks and section metadata, never generic fixture markers', () => {
  const { pages } = buildContent({ catalogue });
  const allowed = new Set(['hero-teaser', 'hero-stage', 'columns', 'carousel', 'car-kpis', 'card-list', 'disclaimer']);
  for (const [path, html] of Object.entries(pages)) {
    assert.doesNotMatch(html, /aida-showcase|component:|data-component|data-fixture|<article\b|<section\b/, path);
    assert.doesNotMatch(html, /href="\/aida\/showcase\/data\/wdh-(de|fr)\.json"/, 'No inert refresh CTA without a runtime installer');
    for (const section of native(html)) {
      assert.ok(section.children.some((node) => node.className === 'section-metadata'), 'Composition is authored as section-metadata');
      for (const name of names(section)) assert.ok(allowed.has(name), `Unexpected artificial block: ${name}`);
    }
  }
});

test('RfP IDs remain explicit fixture data, separately mapped to native sections', () => {
  const content = buildContent({ catalogue });
  for (const row of content.data['/aida/showcase/data/compositions.json'].data) {
    assert.equal(row.fixtureOnly, true);
    assert.equal(row.components, row.fixtureComponents.map((component) => component.id).join(','));
    assert.equal(
      new Set(row.fixtureComponents.map((component) => component.id)).size,
      row.fixtureComponents.length,
    );
    assert.deepEqual(
      row.fixtureComponents.map((component) => component.sectionIndex),
      row.fixtureComponents.map((_, index) => index),
    );
    for (const component of row.fixtureComponents) composed(content, row.path, component.id);
  }
});

test('Home preserves mandatory ordered teasers with two-row hero and real video/teaser cells', () => {
  const content = buildContent({ catalogue });
  for (const context of contexts) {
    const path = `/aida/showcase/${context}/home`;
    const hero = blocks(composed(content, path, 'main-teaser-i5'))[0];
    assert.equal(hero.className.split(' ')[0], 'hero-teaser');
    assert.match(hero.className, /no-autoplay/);
    shape(hero, [1, 1]);
    assert.match(hero.children[0].html, /is\/image\//);
    assert.match(hero.children[0].html, /is\/content\/BMW\/P001_SL_G60-8135_Ext_Dsk_v001/);
    assert.doesNotMatch(hero.children[0].html, /<h[1-6]/);
    assert.match(hero.children[1].html, /<h1>/);
    const video = blocks(composed(content, path, 'video-teaser-ix3'))[0];
    assert.match(video.className, /^columns .*video-controls/);
    shape(video, [2]);
    assert.match(video.children[0].children[0].html, /is\/content\/BMW\/na5_stage_1920_1024_sl/);
    assert.doesNotMatch(video.children[0].children[0].html, /<h[1-6]/);
    const list = blocks(composed(content, path, 'teaser-list'))[0];
    assert.match(list.className, /^carousel /);
    shape(list, [2, 2, 2, 2, 2]);
    for (const slug of ['cannes', 'concept-m', 'interior', '3-series']) assert.match(list.html, new RegExp(`/news/${slug}`));
    assert.match(list.html, /BMW X/);
  }
});

test('Car/Topic use native KPI, carousel, columns and assistance-list contracts', () => {
  const content = buildContent({ catalogue });
  for (const context of contexts) {
    const car = `/aida/showcase/${context}/i5`;
    const kpis = blocks(composed(content, car, 'car-kpi'))[0];
    assert.equal(kpis.className, 'car-kpis');
    shape(kpis, [2, 2, 2]);
    for (const row of kpis.children) assert.match(row.children[0].html, /wdh-(de|fr)\.json#61HG\./);
    shape(blocks(composed(content, car, 'emob-section'))[0], [2, 2, 2]);
    shape(blocks(composed(content, car, 'news-teaser'))[0], [2]);
    const models = blocks(composed(content, car, 'electrified-models'))[0];
    assert.match(models.className, /^carousel cards /);
    shape(models, [2, 2]);
    const features = blocks(composed(content, car, 'assist-features'))[0];
    assert.equal(features.className, 'card-list');
    shape(features, context.startsWith('fr') ? [1, 2, 2] : [1, 2, 2, 2]);
    const topic = `/aida/showcase/${context}/e-mobility`;
    const stage = blocks(composed(content, topic, 'stage-emob'))[0];
    assert.equal(stage.className.split(' ')[0], 'hero-stage');
    shape(stage, [1, 1]);
    shape(blocks(composed(content, topic, 'topic-range'))[0], [2]);
    shape(blocks(composed(content, topic, 'model-range'))[0], [2, 2]);
    shape(blocks(composed(content, topic, 'topic-charging'))[0], [2]);
    shape(blocks(composed(content, topic, 'news-hydrogen'))[0], [2]);
  }
});

test('NewsArticle body is default content, independent from article metadata and native stage', () => {
  const content = buildContent({ catalogue });
  for (const [path, html] of Object.entries(content.pages).filter(([key]) => key.includes('/news/'))) {
    const stage = blocks(composed(content, path, 'news-stage'))[0];
    assert.match(stage.className, /^hero-stage /);
    shape(stage, [1, 1]);
    const body = composed(content, path, 'news-body');
    assert.deepEqual(names(body), []);
    assert.match(body.html, /^<p>/);
    assert.doesNotMatch(body.html, /NewsArticle|json-ld/);
    assert.match(html, /NewsArticle/);
    assert.match(html, /class="metadata"/);
  }
});
