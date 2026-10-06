/* eslint-disable max-len */
/*
 * Layout / density options of blocks (scripts/bmw-style-names.js): named presets and systematic
 * names with exact, reversible legacy expansion, and a scope check over the DA snapshot: after the
 * conversion only aspect ratios, BMW typography roles and data parameters still contain numbers.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  expandBlockOptions, toSemanticBlockOptions, toSemanticSectionStyles, findDeprecated,
} from '../../scripts/bmw-style-names.js';

const fixture = JSON.parse(readFileSync(new URL('./fixtures/da-tokens.json', import.meta.url)));

const CASES = {
  columns: [
    ['layout-halves', 'cols-6-6'], ['layout-thirds', 'cols-4-4-4'], ['layout-quarters', 'cols-3-3-3-3'],
    ['layout-wide-narrow', 'cols-7-5'], ['layout-narrow-wide', 'cols-5-7'],
    ['layout-half-five-twelfths', 'cols-6-5'], ['layout-third-third', 'cols-4-4'],
    ['layout-quarter-quarter-five-twelfths', 'cols-3-3-5'], ['layout-sixth-sixth-sixth-sixth-sixth', 'cols-2-2-2-2-2'],
    ['layout-medium-halves', 'md-6-6'], ['layout-medium-half-half-half', 'md-6-6-6'], ['layout-medium-half-half-half-half', 'md-6-6-6-6'],
    ['layout-medium-full-half', 'md-12-6'], ['layout-medium-half-full', 'md-6-12'],
    ['layout-medium-seven-twelfths-seven-twelfths-five-twelfths', 'md-7-7-5'], ['layout-medium-third-third-third-third-third', 'md-4-4-4-4-4'],
    ['image-quarter-medium-sixth-small-quarter', 'img-3-2-3'], ['image-half-medium-quarter-small-quarter', 'img-6-3-3'], ['image-quarter-medium-quarter-small-quarter', 'img-3-3-3'],
    ['inset-first-both', 'inset-1-both'], ['inset-second-start', 'inset-2-start'], ['inset-second-end', 'inset-2-end'],
    ['inset-second-both', 'inset-2-both'], ['inset-third-start', 'inset-3-start'], ['inset-third-both', 'inset-3-both'],
  ],
  carousel: [
    ['slides-single', 'slides-1-1-1-1'], ['slides-pairs', 'slides-1-2-2-2'], ['slides-triples', 'slides-1-2-3-3'], ['slides-quads', 'slides-1-2-3-4'],
    ['slides-pairs-from-large', 'slides-1-1-2-2'], ['slides-triples-from-large', 'slides-1-1-3-3'], ['slides-quads-from-large', 'slides-1-1-4-4'],
    ['slides-small-one-medium-one-large-four-xlarge-three', 'slides-1-1-4-3'], ['slides-small-one-medium-three-large-four-xlarge-five', 'slides-1-3-4-5'],
  ],
  'icon-teaser': [
    ['items-small-one-medium-three-large-three', 'cols-1-3-3'], ['items-small-one-medium-three-large-six', 'cols-1-3-6'],
    ['items-small-one-medium-one-large-one', 'cols-1-1-1'], ['items-small-one-medium-two-large-two', 'cols-1-2-2'], ['items-small-one-medium-two-large-four', 'cols-1-2-4'],
    ['offsets-twelfth-sixth', 'offsets-1-2'], ['offsets-none-third', 'offsets-0-4'], ['span-medium-two-thirds', 'span-md-8'],
  ],
  'model-offer': [['slides-three', 'slides-3']],
  'text-media-teaser': [['widths-equal', 'col-5-5'], ['media-wider', 'col-6-4'], ['text-wider', 'col-4-6']],
};

Object.entries(CASES).forEach(([block, cases]) => {
  test(`${block}: layout names expand exactly to the implementation options and back`, () => {
    cases.forEach(([semantic, legacy]) => {
      assert.deepEqual(expandBlockOptions(block, [semantic]), [legacy], semantic);
      assert.deepEqual(toSemanticBlockOptions(block, [legacy]), { options: [semantic], exceptions: [] }, legacy);
      assert.deepEqual(findDeprecated([legacy], block), [legacy], `${legacy} is deprecated for ${block}`);
      assert.deepEqual(findDeprecated([semantic], block), [], semantic);
    });
  });
});

test('layout names are block-specific (other blocks keep the token)', () => {
  assert.deepEqual(expandBlockOptions('carousel', ['layout-halves', 'items-small-one-medium-one-large-one']), ['layout-halves', 'items-small-one-medium-one-large-one']);
  assert.deepEqual(toSemanticBlockOptions('hero-teaser', ['slides-1-2-3-3']).options, ['slides-1-2-3-3']);
});

test('conflicting layout options for one property are exceptions', () => {
  assert.equal(toSemanticBlockOptions('columns', ['cols-7-5', 'layout-halves']).exceptions.length, 1);
  assert.equal(toSemanticBlockOptions('carousel', ['slides-1-2-3-3', 'slides-pairs']).exceptions.length, 1);
});

const ALLOWED_NUMERIC = [
  /^(?:mobile-|video-)?ratio-\d+(?:-\d+|x\d+)$/, // aspect ratios
  /^(?:body-[123]|title-headline-\d|title-subsection-\d|sub-headline-\d|h[1-6])$/, // BMW typography roles
];
const DATA_PARAMETERS = {
  'content-table': /^(?:highlight|center|end)-\d+$/,
  accordion: /^expand-\d+$/,
  embed: /^height-\d+$/,
};

test('scope: after conversion only aspect ratios, typography roles and data parameters contain numbers', () => {
  const left = [];
  fixture.blockClasses.forEach((combo) => {
    const [block, ...legacy] = combo.split(' ');
    const { options, exceptions } = toSemanticBlockOptions(block, legacy);
    assert.deepEqual(exceptions, [], combo);
    options.filter((o) => /\d/.test(o))
      .filter((o) => !ALLOWED_NUMERIC.some((re) => re.test(o)) && !(DATA_PARAMETERS[block] && DATA_PARAMETERS[block].test(o)))
      .forEach((o) => left.push(`${block} ${o}`));
  });
  fixture.sectionStyles.forEach((combo) => {
    toSemanticSectionStyles(combo.split(', ')).styles.filter((s) => /\d/.test(s))
      .filter((s) => !/^(?:body-[123]|h1-headline-\d|h1-subsection-\d)$/.test(s))
      .forEach((s) => left.push(`section ${s}`));
  });
  assert.deepEqual([...new Set(left)], []);
});
