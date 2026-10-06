/* eslint-disable max-len */
/*
 * Integration of the vocabulary with the runtime decoration (applyStyleNames, called by
 * scripts/bmw-sections.js decorateBmwSections) and the importer's final DOM step
 * (tools/importer/semantic-names.js), exercised with minimal DOM stand-ins (no runtime framework).
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { applyStyleNames } from '../../scripts/bmw-style-names.js';
import semanticNamesTransformer from '../../tools/importer/semantic-names.js';

/** Element stand-in: classList (iterable), className (setter), dataset. */
function element(classes, dataset = {}) {
  const el = { dataset, cls: classes.split(' ').filter(Boolean) };
  Object.defineProperty(el, 'classList', { get() { return el.cls; } });
  Object.defineProperty(el, 'className', {
    get() { return el.cls.join(' '); },
    set(v) { el.cls = v.split(' ').filter(Boolean); },
  });
  return el;
}

test('runtime: semantic section styles and block options become the implementation classes before blocks load', () => {
  const sections = [
    element('section space-regular content-two-thirds-centered center background-secondary'),
    element('section tab-panel space-above-related-l'),
  ];
  const blocks = [
    element('columns layout-wide-narrow middle inset-second-start block', { blockName: 'columns' }),
    element('carousel slides-triples space-above-regular block', { blockName: 'carousel' }),
    element('hero-teaser bottom text-width-five-sixths cta-above-related-m block', { blockName: 'hero-teaser' }),
    element('disclaimer info spacing-top-5 block', { blockName: 'disclaimer' }),
  ];
  const main = {
    querySelectorAll(selector) {
      if (selector === ':scope > .section') return sections;
      if (selector === '.block[data-block-name]') return blocks;
      throw new Error(`unexpected selector ${selector}`);
    },
  };
  applyStyleNames(main);
  assert.deepEqual(sections.map((s) => s.className), [
    'section spacing-top-16 spacing-bottom-16 content-8-center center grey',
    'section tab-panel spacing-top-12',
  ]);
  assert.deepEqual(blocks.map((b) => b.className), [
    'columns cols-7-5 middle inset-2-start block',
    'carousel slides-1-2-3-3 spacing-top-16 block',
    'hero-teaser bottom cols-10 cta-top-10 block',
    'disclaimer info spacing-top-5 block',
  ]);
});

test('runtime: decorateBmwSections applies the style names first (before section metadata and content widths)', () => {
  const src = readFileSync(new URL('../../scripts/bmw-sections.js', import.meta.url), 'utf8');
  assert.match(src, /import \{[^}]*applyStyleNames[^}]*\} from '\.\/bmw-style-names\.js';/);
  const body = src.slice(src.indexOf('export function decorateBmwSections'));
  assert.ok(body.indexOf('applyStyleNames(main)') > -1 && body.indexOf('applyStyleNames(main)') < body.indexOf('applySectionMetadata(main)'));
});

/** Importer table stand-ins (WebImporter.Blocks.createBlock output). */
function cell(text) { return { textContent: text }; }
function table(name, rows = []) {
  const header = cell(name);
  const trs = [{ children: [header] }, ...rows.map((r) => ({ children: r.map(cell) }))];
  return {
    header,
    trs,
    querySelector: (sel) => (sel === 'tr > th, tr > td' ? header : null),
    querySelectorAll: (sel) => (sel === 'tr' ? trs : []),
  };
}

test('importer: the final DOM step renames generated block options and section-metadata styles', () => {
  const tables = [
    table('Columns (cols-7-5, middle, inset-2-start)'),
    table('Carousel (slides-1-2-3-3, spacing-top-16)'),
    table('Section Metadata', [['style', 'spacing-top-16, spacing-bottom-16, content-8-center, center'], ['id', 'bottom']]),
    table('Cards'),
  ];
  const root = { querySelectorAll: (sel) => (sel === 'table' ? tables : []) };
  semanticNamesTransformer('afterTransform', root, {});
  assert.equal(tables[0].header.textContent, 'Columns (layout-wide-narrow, middle, inset-second-start)');
  assert.equal(tables[1].header.textContent, 'Carousel (slides-triples, space-above-regular)');
  assert.equal(tables[2].trs[1].children[1].textContent, 'space-regular, content-two-thirds-centered, center');
  assert.equal(tables[2].trs[2].children[1].textContent, 'bottom', 'other metadata untouched');
  assert.equal(tables[3].header.textContent, 'Cards');
  semanticNamesTransformer('beforeTransform', root, {});
  assert.equal(tables[0].header.textContent, 'Columns (layout-wide-narrow, middle, inset-second-start)', 'only afterTransform');
});
