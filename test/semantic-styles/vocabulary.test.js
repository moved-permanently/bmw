/* eslint-disable max-len */
/*
 * Author-facing style vocabulary (scripts/bmw-style-names.js): semantic section styles and block
 * options expand to exactly the internal implementation classes (BMW numeric spacing steps and
 * 12-column grid spans), legacy names keep working, and every style combination found in the DA
 * snapshot converts to the semantic vocabulary and back without changing the implementation
 * classes.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  SPACING_SIZES,
  WIDTH_FRACTIONS,
  expandSectionStyles,
  expandBlockOptions,
  toSemanticSectionStyles,
  toSemanticBlockOptions,
  findDeprecated,
} from '../../scripts/bmw-style-names.js';

const fixture = JSON.parse(readFileSync(new URL('./fixtures/da-tokens.json', import.meta.url)));
const sorted = (list) => [...list].sort();

test('spacing sizes: five project-defined families, one size per internal BMW spacing step', () => {
  assert.deepEqual(SPACING_SIZES, {
    'tight-xxs': 1,
    'tight-xs': 2,
    'tight-s': 3,
    'tight-m': 4,
    'tight-l': 5,
    'tight-xl': 6,
    'related-s': 8,
    'related-m': 10,
    'related-l': 12,
    regular: 16,
    'separated-s': 20,
    'separated-l': 24,
    'feature-s': 32,
    'feature-m': 40,
    'feature-l': 60,
  });
});

test('widths: fractions of the 12-column grid', () => {
  assert.deepEqual(WIDTH_FRACTIONS, {
    twelfth: 1,
    sixth: 2,
    quarter: 3,
    third: 4,
    'five-twelfths': 5,
    half: 6,
    'seven-twelfths': 7,
    'two-thirds': 8,
    'three-quarters': 9,
    'five-sixths': 10,
    'eleven-twelfths': 11,
    full: 12,
  });
});

test('section styles: semantic names expand to exactly the implementation classes', () => {
  const cases = [
    [['space-regular'], ['spacing-top-16', 'spacing-bottom-16']],
    [['space-above-related-l', 'space-below-regular'], ['spacing-top-12', 'spacing-bottom-16']],
    [['space-below-tight-m'], ['spacing-bottom-4']],
    [['space-above-tight-xxs', 'space-below-feature-l'], ['spacing-top-1', 'spacing-bottom-60']],
    [['content-two-thirds-centered', 'center'], ['content-8-center', 'center']],
    [['content-half-centered', 'content-large-two-thirds-centered'], ['content-6-center', 'content-lg-8-center']],
    [['content-medium-full'], ['content-md-12']],
    [['content-small-five-sixths'], ['content-sm-10']],
    [['content-large-half-offset-third'], ['content-lg-6-offset-4']],
    [['content-third'], ['content-4']],
    [['background-secondary'], ['grey']],
    [['background-dark'], ['dark']],
  ];
  cases.forEach(([input, expected]) => assert.deepEqual(expandSectionStyles(input), expected, input.join(', ')));
});

test('section styles: legacy names and other styles pass through unchanged', () => {
  const kept = ['spacing-top-16', 'spacing-bottom-4', 'content-8-center', 'content-lg-8-center', 'grey', 'dark',
    'center', 'tab-panel', 'layer', 'body-2', 'h1-headline-2', 'h1-subsection-1', 'contained', 'highlight'];
  assert.deepEqual(expandSectionStyles(kept), kept);
});

test('block options: semantic names expand to the implementation options', () => {
  const cases = [
    ['disclaimer', ['info', 'space-above-tight-l', 'space-below-tight-s'], ['info', 'spacing-top-5', 'spacing-bottom-3']],
    ['carousel', ['space-above-regular', 'slides-1-2-3-4', 'ratio-3-2'], ['spacing-top-16', 'slides-1-2-3-4', 'ratio-3-2']],
    ['text-media-teaser', ['space-separated-s'], ['spacing-top-20', 'spacing-bottom-20']],
    ['accordion', ['width-half', 'width-large-two-thirds', 'width-medium-full'], ['width-6', 'width-lg-8', 'width-md-12']],
    ['content-table', ['width-two-thirds', 'highlight-3', 'center-2'], ['width-8', 'highlight-3', 'center-2']],
    ['hero-teaser', ['bottom', 'text-width-five-twelfths', 'cta-above-related-m', 'cta-below-related-m', 'subline-above-tight-l',
      'text-above-regular', 'text-below-related-m', 'sub-headline-3', 'ratio-16-7', 'mobile-ratio-3-4'],
    ['bottom', 'cols-5', 'cta-top-10', 'cta-bottom-10', 'sub-top-5', 'text-top-16', 'text-bottom-10', 'sub-headline-3', 'ratio-16-7', 'mobile-ratio-3-4']],
    ['columns', ['cols-7-5', 'video-space-above-regular', 'video-ratio-3-2'], ['cols-7-5', 'video-spacing-top-16', 'video-ratio-3-2']],
    ['embed', ['height-500', 'space-below-related-m'], ['height-500', 'spacing-bottom-10']],
  ];
  cases.forEach(([block, input, expected]) => assert.deepEqual(expandBlockOptions(block, input), expected, `${block}: ${input.join(' ')}`));
});

test('block options: width and text-box names only apply to the blocks that implement them', () => {
  assert.deepEqual(expandBlockOptions('columns', ['width-half']), ['width-half']);
  assert.deepEqual(expandBlockOptions('carousel', ['text-width-half']), ['text-width-half']);
  assert.deepEqual(expandBlockOptions('hero-teaser', ['cols-5']), ['cols-5']);
});

test('to semantic: equal top/bottom spacing merges, order and other styles are kept', () => {
  assert.deepEqual(
    toSemanticSectionStyles(['spacing-top-16', 'spacing-bottom-16', 'content-8-center', 'center']),
    { styles: ['space-regular', 'content-two-thirds-centered', 'center'], exceptions: [] },
  );
  assert.deepEqual(
    toSemanticSectionStyles(['content-8-center', 'spacing-top-12', 'spacing-bottom-16']),
    { styles: ['content-two-thirds-centered', 'space-above-related-l', 'space-below-regular'], exceptions: [] },
  );
  assert.deepEqual(toSemanticSectionStyles(['grey', 'tab-panel']), { styles: ['background-secondary', 'tab-panel'], exceptions: [] });
  assert.deepEqual(
    toSemanticBlockOptions('hero-teaser', ['bottom', 'cols-10', 'cta-top-10', 'cta-stack-md', 'sub-top-5', 'gradient-oblique']),
    { options: ['bottom', 'text-width-five-sixths', 'cta-above-related-m', 'cta-stack-md', 'subline-above-tight-l', 'gradient-oblique'], exceptions: [] },
  );
});

test('to semantic: conflicting spacing for one side is an exception and left unchanged', () => {
  const input = ['spacing-top-16', 'space-above-related-l', 'center'];
  const { styles, exceptions } = toSemanticSectionStyles(input);
  assert.deepEqual(styles, input);
  assert.equal(exceptions.length, 1);
  assert.match(exceptions[0], /space-above/);
});

test('to semantic is idempotent', () => {
  fixture.sectionStyles.forEach((combo) => {
    const once = toSemanticSectionStyles(combo.split(', ')).styles;
    assert.deepEqual(toSemanticSectionStyles(once).styles, once, combo);
  });
});

test('every DA section style combination converts without exceptions and round-trips to the same classes', () => {
  fixture.sectionStyles.forEach((combo) => {
    const legacy = combo.split(', ');
    const { styles, exceptions } = toSemanticSectionStyles(legacy);
    assert.deepEqual(exceptions, [], combo);
    assert.deepEqual(findDeprecated(styles), [], `${combo} -> ${styles.join(', ')}`);
    assert.deepEqual(sorted(expandSectionStyles(styles)), sorted(legacy), combo);
  });
});

test('every DA block class combination converts without exceptions and round-trips to the same classes', () => {
  fixture.blockClasses.forEach((combo) => {
    const [block, ...legacy] = combo.split(' ');
    const { options, exceptions } = toSemanticBlockOptions(block, legacy);
    assert.deepEqual(exceptions, [], combo);
    assert.deepEqual(findDeprecated(options, block), [], `${combo} -> ${options.join(' ')}`);
    assert.deepEqual(sorted(expandBlockOptions(block, options)), sorted(legacy), combo);
  });
});

test('findDeprecated names legacy author-facing utilities only', () => {
  assert.deepEqual(
    findDeprecated(['spacing-top-16', 'content-8-center', 'grey', 'center', 'body-2', 'space-regular']),
    ['spacing-top-16', 'content-8-center', 'grey'],
  );
  assert.deepEqual(findDeprecated(['cols-5', 'cta-top-10', 'sub-headline-3', 'ratio-16-9'], 'hero-teaser'), ['cols-5', 'cta-top-10']);
  assert.deepEqual(findDeprecated(['width-lg-8', 'expand-9'], 'accordion'), ['width-lg-8']);
  // layout distributions have semantic names too (review finding 8); carousel slides are not a Columns option
  assert.deepEqual(findDeprecated(['cols-7-5', 'video-spacing-top-16', 'slides-1-2-3-4'], 'columns'), ['cols-7-5', 'video-spacing-top-16']);
  assert.deepEqual(findDeprecated(['highlight-3', 'height-500', 'ratio-3x2'], 'content-table'), []);
});
