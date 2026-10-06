/* eslint-disable max-len, import/extensions */
/*
 * Curated BMW library for Document Authoring / Experience Workspace (tools/ew-native/library.mjs):
 * block documents (one per block family, variants + library-metadata), page templates and the
 * blocks / templates sheets, in the formats da-live reads (blocks/edit/da-library,
 * blocks/canvas/ew-panel-extensions/helpers.js).
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildLibrary, BLOCKS, TEMPLATES } from '../../tools/ew-native/library.mjs';
import { migrateDocument } from '../../tools/semantic-styles/migrate.mjs';

const WDH = {
  values: {
    data: [
      { key: '61HG.electricRange', value: '513–627', unit: 'km' },
      { key: '61HG.electricConsumption', value: '17,9', unit: 'kWh/100 km' },
      { key: '61HG.acceleration', value: '6', unit: 's' },
      { key: '61HG.power', value: '250 kW (340 PS)', unit: '' },
      { key: '61HG.dcCharge10to80', value: '30', unit: 'min' },
      { key: '61HG.wltp', value: 'BMW i5 eDrive40: Energieverbrauch kombiniert: 17,9 kWh/100 km (WLTP)', unit: '' },
    ],
  },
};
const ORIGIN = 'https://content.da.live/moved-permanently/bmw';
const lib = buildLibrary({ wdh: WDH });
const doc = (path) => lib.files[path];

/** Direct children (blocks) of the sections of a DA document, in order: [{cls}]. */
function sections(html) {
  const main = html.slice(html.indexOf('<main>') + 6, html.lastIndexOf('</main>'));
  const blocks = [];
  let depth = 0;
  [...main.matchAll(/<div\b[^>]*>|<\/div>/g)].forEach(([tag]) => {
    if (tag === '</div>') {
      depth -= 1;
      return;
    }
    if (depth === 1) blocks.push({ cls: (tag.match(/class="([^"]*)"/) || [])[1] || '' });
    depth += 1;
  });
  return { blocks };
}

test('the block library covers stage, KPI, video, assist features, news teaser, disclaimer and CTA', () => {
  assert.deepEqual(BLOCKS.map((b) => b.name), ['Stage', 'Key figures', 'Video', 'Assist features', 'News teaser', 'Disclaimer', 'Call to action']);
  const sheet = doc('/library/blocks.json');
  assert.equal(sheet[':type'], 'sheet');
  assert.equal(sheet.total, BLOCKS.length);
  sheet.data.forEach((row, i) => {
    assert.equal(row.name, BLOCKS[i].name);
    assert.equal(row.path, `${ORIGIN}/library/blocks/${BLOCKS[i].id}`, 'absolute content.da.live path: works in the classic and the Workspace editor without publishing');
    assert.ok(doc(`/library/blocks/${BLOCKS[i].id}.html`), `document for ${row.name}`);
  });
});

test('every block variant is followed by library-metadata with a friendly description and search tags', () => {
  BLOCKS.forEach((b) => {
    const html = doc(`/library/blocks/${b.id}.html`);
    const { blocks } = sections(html);
    const variants = blocks.filter((x) => x.cls !== 'library-metadata');
    assert.ok(variants.length >= 1, b.id);
    blocks.forEach((x, i) => {
      if (x.cls === 'library-metadata') return;
      assert.equal(blocks[i + 1]?.cls, 'library-metadata', `${b.id}: ${x.cls} is followed by library-metadata`);
    });
    const metas = [...html.matchAll(/<div class="library-metadata"><div><div>description<\/div><div>([^<]+)<\/div><\/div><div><div>searchtags<\/div><div>([^<]+)<\/div><\/div><\/div>/g)];
    assert.equal(metas.length, variants.length, `${b.id}: one description + searchtags per variant`);
    metas.forEach(([, description]) => assert.ok(description.length > 20 && !/lorem/i.test(description), description));
  });
});

test('templates: news story, vehicle launch and e-mobility topic, inserted with their page metadata', () => {
  assert.deepEqual(TEMPLATES.map((t) => t.key), ['News story', 'Vehicle launch', 'E-mobility topic']);
  const sheet = doc('/library/templates.json');
  sheet.data.forEach((row, i) => {
    assert.equal(row.key, TEMPLATES[i].key);
    assert.equal(row.value, `${ORIGIN}/library/templates/${TEMPLATES[i].id}`, 'classic editor reads value, canvas path || value');
    const html = doc(`/library/templates/${TEMPLATES[i].id}.html`);
    assert.match(html, /<div class="template-metadata">/, 'becomes the page metadata on insertion');
    assert.doesNotMatch(html, /<div class="metadata">/, 'the template document itself carries no page metadata');
  });
});

test('all documents use the semantic style vocabulary only (nothing for the migration to rewrite)', () => {
  Object.entries(lib.files).filter(([p]) => p.endsWith('.html')).forEach(([path, html]) => {
    assert.match(html, /^<body><header><\/header><main>.*<\/main><footer><\/footer><\/body>\n$/s, path);
    const result = migrateDocument(html);
    assert.deepEqual(result.exceptions, [], path);
    assert.equal(result.changed, false, `${path} contains deprecated style names`);
  });
});

test('media are existing public BMW Scene7 references (link convention, no generated imagery)', () => {
  Object.entries(lib.files).filter(([p]) => p.endsWith('.html')).forEach(([path, html]) => {
    [...html.matchAll(/<a href="([^"]+)">/g)].map((m) => m[1])
      .filter((u) => /\.(jpe?g|png|webp|mp4|m3u8)$|scene7|\/is\//.test(u))
      .forEach((u) => assert.match(u, /^https:\/\/bmw\.scene7\.com\/is\/(image|content)\/BMW\/[\w.:-]+$/, `${path}: ${u}`));
    assert.doesNotMatch(html, /<img\b/, `${path}: images are links (aem.assets.image.type=link)`);
  });
});

test('tech values are WDH bindings with the sheet value as text (WDH stays the source of truth)', () => {
  const html = doc('/library/blocks/key-figures.html') + doc('/library/templates/vehicle-launch.html');
  const links = [...html.matchAll(/<a href="\/aida\/data\/wdh-de\.json#([^"]+)">([^<]*)<\/a>/g)];
  assert.ok(links.length >= 3);
  const values = new Map(WDH.values.data.map((r) => [r.key, r.unit ? `${r.value} ${r.unit}` : r.value]));
  links.forEach(([, key, text]) => assert.equal(text, values.get(key), key));
});
