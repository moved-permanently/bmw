import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { assetContextMessage } from '../../tools/aida/asset-picker/model.js';

const read = (path) => readFileSync(new URL(`../../tools/aida/asset-picker/${path}`, import.meta.url), 'utf8');

test('market documents show no context message; the country picker already shows the preselection', () => {
  assert.equal(assetContextMessage({ path: '/aida/showcase/fr/be/news/i5' }), '');
  assert.equal(assetContextMessage({ path: '/aida/showcase/fr/fr/i5' }), '');
  assert.match(read('asset-picker.js'), /find\('context'\)\.hidden = !/, 'An empty context note is hidden');
});

test('the header drops the demo catalogue disclaimer', () => {
  assert.doesNotMatch(read('asset-picker.html'), /Published demo catalogue|DAM permissions/);
});

test('source-language documents ask for a target country rather than report failed detection', () => {
  assert.equal(
    assetContextMessage({ path: '/aida/showcase/en/news/i5' }),
    'English source document. Choose the target country; unlocalized images are included.',
  );
  assert.equal(
    assetContextMessage({ path: '/aida/fr/i5' }),
    'French source document. Choose the target country; unlocalized images are included.',
  );
  assert.doesNotMatch(assetContextMessage({ path: '/aida/en/i5' }), /not detected|no document country/i);
});

test('missing or unrecognized document context asks for country without inventing one', () => {
  assert.equal(
    assetContextMessage({}),
    'Choose a country for this document; unlocalized images are included.',
  );
  assert.equal(
    assetContextMessage({ path: '/unknown/news' }),
    'Choose a country for this document; unlocalized images are included.',
  );
});
