/*
 * Library block documents carry a library-metadata table (description / searchtags for the DA
 * block library). On a page preview it must not 404 (no block code) or show: the block hides itself.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const root = new URL('../../blocks/library-metadata/', import.meta.url);

test('library-metadata has block code that hides the table', async () => {
  assert.ok(existsSync(new URL('library-metadata.js', root)), 'block JS exists (no 404 on library previews)');
  const { default: decorate } = await import(new URL('library-metadata.js', root));
  const block = { hidden: false, setAttribute(name, value) { this[name] = value; } };
  decorate(block);
  assert.equal(block.hidden, true);
  assert.equal(block['aria-hidden'], 'true');
  assert.match(readFileSync(new URL('library-metadata.css', root), 'utf8'), /\.library-metadata\s*\{\s*display:\s*none;?\s*\}/);
});
