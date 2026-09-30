import assert from 'node:assert/strict';
import test from 'node:test';
import { assetContextMessage } from '../../tools/aida/asset-picker/model.js';

test('market documents identify the preselected country without losing unlocalized assets', () => {
  assert.equal(
    assetContextMessage({ path: '/aida/showcase/fr/be/news/i5' }),
    'Belgium preselected from this document. Unlocalized images are included.',
  );
  assert.equal(
    assetContextMessage({ path: '/aida/showcase/fr/fr/i5' }),
    'France preselected from this document. Unlocalized images are included.',
  );
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
