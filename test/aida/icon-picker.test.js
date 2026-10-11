import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const icons = JSON.parse(read('tools/aida/icon-picker/icons.json'));

test('icon list holds the BMW icon font ligature names authors write between colons', () => {
  assert.ok(icons.length > 900, `${icons.length} icons`);
  assert.deepEqual(icons, [...new Set(icons)].sort());
  assert.ok(icons.every((name) => /^[a-z0-9_]+$/.test(name)), 'only spellings decorateFontIcons converts');
  // names used by migrated navigation and content
  ['location_pin', 'download', 'shopping_cart', 'person', 'heart', 'add_car', 'arrow_chevron_right', 'ai_eu_label']
    .forEach((name) => assert.ok(icons.includes(name), name));
});

test('search matches every typed word in any order, ignoring case, colons, spaces and underscores', async () => {
  const { matchIcons } = await import('../../tools/aida/icon-picker/icons.js');
  const names = ['arrow_chevron_left', 'arrow_left', 'charging_station', 'heart'];
  assert.deepEqual(matchIcons(names, ''), names);
  assert.deepEqual(matchIcons(names, '  '), names);
  assert.deepEqual(matchIcons(names, 'Left Arrow'), ['arrow_chevron_left', 'arrow_left']);
  assert.deepEqual(matchIcons(names, ':arrow_left:'), ['arrow_chevron_left', 'arrow_left']);
  assert.deepEqual(matchIcons(names, 'charg'), ['charging_station']);
  assert.deepEqual(matchIcons(names, 'xyz'), []);
});

test('an icon is inserted as its authored text and labelled readably', async () => {
  const { iconText, iconLabel } = await import('../../tools/aida/icon-picker/icons.js');
  assert.equal(iconText('arrow_chevron_right'), ':arrow_chevron_right:');
  assert.equal(iconLabel('arrow_chevron_right'), 'arrow chevron right');
});

test('picker renders glyphs with the site icon font and inserts text through the editor', () => {
  const html = read('tools/aida/icon-picker/icon-picker.html');
  assert.match(html, /href="\.\.\/spectrum\.css"/);
  assert.match(html, /<body class="spectrum spectrum--medium spectrum--light">/);
  assert.match(html, /<input[^>]*id="icon-search"[^>]*class="[^"]*spectrum-Textfield-input/);
  assert.match(html, /<label[^>]*for="icon-search"/);
  const css = read('tools/aida/icon-picker/icon-picker.css');
  assert.match(css, /font-family:\s*"?bmw_next_icons"?/);
  assert.match(css, /url\('\/fonts\/bmw_next_icons_regular\.woff2'\)/);
  const js = read('tools/aida/icon-picker/icon-picker.js');
  assert.match(js, /fetch\('\.\/icons\.json'\)/);
  assert.match(js, /actions\.sendText\(iconText\(/);
  assert.match(js, /actions\.closeLibrary\(\)/);
  assert.match(js, /window\.parent === window/, 'outside the editor the grid is browse-only');
  assert.doesNotMatch(js, /\.innerHTML\s*=/);
});
