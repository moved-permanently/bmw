import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  extractSegments, getMetadata, setMetadata, parseJsonArray, translateHtml,
} from '../../tools/aida/agent/lib.js';

const DOC = '<body><header></header><main><div>'
  + '<h1 id="x">Der BMW i5.</h1>'
  + '<p>Reichweite <a href="/aida/data/wdh-de.json#61HG.electricRange">513–627 km</a> mit xDrive &amp; mehr.</p>'
  + '<div class="all-models"><div><div>preselect</div><div>fuelTypes: e</div></div>'
  + '<div><div><p>Limousine</p></div><div>fuelType: e, series: 5</div></div></div>'
  + '<div class="icon-teaser"><div><div>:fuel_car_bev:</div><div><p>Lokal emissionsfrei.</p></div></div></div>'
  + '<div class="section-metadata"><div><div>style</div><div>center</div></div></div>'
  + '<div class="metadata"><div><div>Title</div><div>BMW i5 Überblick</div></div>'
  + '<div><div>Robots</div><div>index,follow</div></div></div>'
  + '</div></main><footer></footer></body>';

test('extractSegments picks translatable text only', () => {
  const { segments } = extractSegments(DOC);
  assert.deepEqual(segments, [
    'Der BMW i5.',
    'Reichweite',
    'mit xDrive & mehr.',
    'Limousine',
    'Lokal emissionsfrei.',
    'BMW i5 Überblick',
  ]);
});

test('extractSegments rebuilds the document with translations in place', () => {
  const { segments, rebuild } = extractSegments(DOC);
  const out = rebuild(segments.map((s) => `[${s}]`));
  assert.match(out, /<h1 id="x">\[Der BMW i5\.\]<\/h1>/);
  assert.match(out, /<p>\[Reichweite\] <a href="\/aida\/data\/wdh-de\.json#61HG\.electricRange">513–627 km<\/a> \[mit xDrive &amp; mehr\.\]<\/p>/);
  assert.match(out, /<div>preselect<\/div><div>fuelTypes: e<\/div>/);
  assert.match(out, /<div>style<\/div><div>center<\/div>/);
  assert.match(out, /<div>Title<\/div><div>\[BMW i5 Überblick\]<\/div>/);
  assert.match(out, /<div>Robots<\/div><div>index,follow<\/div>/);
});

test('getMetadata and setMetadata read, replace and add rows', () => {
  assert.equal(getMetadata(DOC, 'title'), 'BMW i5 Überblick');
  assert.equal(getMetadata(DOC, 'wdh-model'), null);
  const replaced = setMetadata(DOC, 'Title', 'BMW i5 overview');
  assert.equal(getMetadata(replaced, 'Title'), 'BMW i5 overview');
  const added = setMetadata(replaced, 'html-lang', 'en');
  assert.equal(getMetadata(added, 'html-lang'), 'en');
  assert.equal(getMetadata(added, 'robots'), 'index,follow');
  const json = setMetadata(added, 'json-ld', '{"name":"A & B <x>"}');
  assert.equal(getMetadata(json, 'json-ld'), '{"name":"A & B <x>"}');
});

test('setMetadata creates a metadata block when a page has none', () => {
  const doc = '<body><header></header><main><div><p>Hi</p></div></main><footer></footer></body>';
  const out = setMetadata(doc, 'html-lang', 'fr');
  assert.equal(getMetadata(out, 'html-lang'), 'fr');
  assert.match(out, /<p>Hi<\/p><div class="metadata">/);
});

test('parseJsonArray accepts plain and fenced model output', () => {
  assert.deepEqual(parseJsonArray('["a","b"]'), ['a', 'b']);
  assert.deepEqual(parseJsonArray('```json\n["a"]\n```'), ['a']);
  assert.throws(() => parseJsonArray('{"a":1}'));
});

test('translateHtml protects brand terms and keeps the structure', async () => {
  const seen = [];
  const complete = async (messages) => {
    const input = JSON.parse(messages.at(-1).content);
    seen.push(...input);
    return JSON.stringify(input.map((s) => s.toUpperCase()));
  };
  const out = await translateHtml(DOC, {
    from: 'de', to: 'en', terms: ['xDrive', 'BMW i5'], complete,
  });
  assert.ok(seen.every((s) => !s.includes('xDrive') && !s.includes('BMW i5')));
  assert.match(out, /<h1 id="x">DER BMW i5\.<\/h1>/);
  assert.match(out, /MIT xDrive &amp; MEHR\./);
  assert.match(out, /<div>Title<\/div><div>BMW i5 ÜBERBLICK<\/div>/);
  assert.equal(getMetadata(out, 'html-lang'), 'en');
});

test('translateHtml fails loudly when the model drops segments', async () => {
  const complete = async () => '["only one"]';
  await assert.rejects(translateHtml(DOC, {
    from: 'de', to: 'en', terms: [], complete,
  }), /expected 6/);
});
