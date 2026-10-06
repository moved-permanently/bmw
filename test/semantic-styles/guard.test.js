/* eslint-disable max-len */
/*
 * Guards against reintroducing legacy author-facing utility names (spacing-top-16, content-8-center,
 * cols-5, width-lg-8, …) in authoring docs, block metadata and content generators, and proves that
 * the semantic names have no styling of their own (CSS / JS only ever see the implementation
 * classes they expand to, so computed styles are identical by construction).
 */
/* eslint-disable no-restricted-syntax */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import {
  SPACING_SIZES, WIDTH_FRACTIONS, findDeprecated, expandSectionStyles, expandBlockOptions,
} from '../../scripts/bmw-style-names.js';
// eslint-disable-next-line import/extensions
import { buildContent } from '../../tools/aida/showcase/content.mjs';
import { semanticBlockName, semanticSectionStyle } from '../../tools/importer/semantic-names.js';

const ROOT = new URL('../../', import.meta.url).pathname;
const read = (p) => readFileSync(join(ROOT, p), 'utf8');
const blocks = readdirSync(join(ROOT, 'blocks'));

test('block metadata options and README option lists use no legacy utility names', () => {
  blocks.forEach((block) => {
    const meta = join('blocks', block, 'metadata.json');
    if (existsSync(join(ROOT, meta))) {
      const { options = [] } = JSON.parse(read(meta));
      assert.deepEqual(findDeprecated(options.map((o) => o.replace(/-N$/, '-1').replace(/-W-H$/, '-16-9')), block), [], meta);
    }
    const readme = join('blocks', block, 'README.md');
    if (existsSync(join(ROOT, readme))) {
      const options = (read(readme).split('## Options')[1] || '').split('\n## ')[0];
      const tokens = [...options.matchAll(/`([a-z0-9-]+)`/g)].map((m) => m[1].replace(/-N$/, '-1'));
      assert.deepEqual(findDeprecated(tokens, block), [], readme);
    }
  });
});

test('the style guide documents every spacing size and width fraction and marks them as project-defined', () => {
  const doc = read('docs/authoring/section-and-block-styles.md');
  Object.keys(SPACING_SIZES).forEach((size) => assert.match(doc, new RegExp(`\`${size}\``), size));
  Object.keys(WIDTH_FRACTIONS).forEach((fraction) => assert.match(doc, new RegExp(`\`${fraction}\``), fraction));
  assert.match(doc, /project-defined/i);
  assert.match(doc, /style-container--secondary/);
});

test('the showcase generator writes semantic style names only', () => {
  const catalogue = JSON.parse(read('tools/aida/asset-picker/catalogue.json'));
  const { pages } = buildContent({ catalogue });
  const html = Object.values(pages).map((p) => (typeof p === 'string' ? p : p.html || JSON.stringify(p))).join('\n');
  const styleCells = [...html.matchAll(/<div>Style<\/div><div>([^<]*)<\/div>/g)].map((m) => m[1]);
  assert.ok(styleCells.length > 0, 'the generator writes section styles');
  styleCells.forEach((cell) => {
    const styles = cell.split(',').map((s) => s.trim());
    assert.deepEqual(findDeprecated(styles), [], cell);
    assert.ok(expandSectionStyles(styles).length >= styles.length, cell);
  });
  [...html.matchAll(/<div class="([a-z0-9- ]+)">/g)].forEach(([, cls]) => {
    const [block, ...options] = cls.split(' ');
    assert.deepEqual(findDeprecated(options, block), [], cls);
  });
});

test('importer: generated block names and section styles are converted to semantic names', () => {
  assert.equal(
    semanticBlockName('Hero Teaser (bottom, cols-10, cta-top-10, sub-top-5, gradient-oblique)'),
    'Hero Teaser (bottom, text-width-five-sixths, cta-above-related-m, subline-above-tight-l, gradient-oblique)',
  );
  assert.equal(semanticBlockName('Disclaimer (info, spacing-top-5, spacing-bottom-5)'), 'Disclaimer (info, space-tight-l)');
  assert.equal(semanticBlockName('Accordion (width-6, width-lg-8, width-md-12)'), 'Accordion (width-half, width-large-two-thirds, width-medium-full)');
  assert.equal(semanticBlockName('Columns (cols-7-5, middle, inset-2-start)'), 'Columns (cols-7-5, middle, inset-2-start)');
  assert.equal(semanticBlockName('Cards'), 'Cards');
  assert.equal(semanticSectionStyle('spacing-top-16, spacing-bottom-16, content-8-center, center'), 'space-regular, content-two-thirds-centered, center');
  assert.equal(semanticSectionStyle('grey'), 'background-secondary');
  // the import script runs the semantic step last (the bundle is a local, git-ignored build output)
  const importer = read('tools/importer/import-bmw-content-page.js');
  assert.match(importer, /import semanticNamesTransformer from '\.\/semantic-names\.js';/);
  assert.match(importer, /const AFTER = \[[^\]]*, semanticNamesTransformer\];/);
});

test('semantic names have no CSS or JS of their own (styling only via the implementation classes)', () => {
  const sizes = Object.keys(SPACING_SIZES).join('|');
  const fractions = Object.keys(WIDTH_FRACTIONS).join('|');
  const semantic = new RegExp(`(?:^|[^a-z0-9-])(?:space-(?:above-|below-)?(?:${sizes})|(?:video-)?space-above-(?:${sizes})`
    + `|(?:content|width)-(?:small-|medium-|large-)?(?:${fractions})(?:-centered|-offset-(?:${fractions}))?`
    + `|text-width-(?:${fractions})|(?:text|cta)-(?:above|below)-(?:${sizes})|subline-above-(?:${sizes})|background-(?:secondary|dark))(?![a-z0-9-])`);
  const files = [];
  const walk = (dir) => readdirSync(join(ROOT, dir), { withFileTypes: true }).forEach((e) => {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.(css|js)$/.test(e.name) && p !== join('scripts', 'bmw-style-names.js') && p !== join('scripts', 'aem.js')) files.push(p);
  });
  ['styles', 'blocks', 'scripts'].forEach(walk);
  files.forEach((f) => {
    const hits = read(f).split('\n').filter((line) => (/\.[a-z]/.test(line) || /classList|className|querySelector/.test(line)) && semantic.test(line));
    assert.deepEqual(hits, [], f);
  });
  assert.deepEqual(expandBlockOptions('disclaimer', ['space-regular']), ['spacing-top-16', 'spacing-bottom-16']);
});
