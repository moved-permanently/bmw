/*
 * Library template documents carry a template-metadata table (it becomes the page metadata when the
 * template is inserted). On the template's own preview it must not 404 or show: it hides itself.
 * (Found on the previewed /library/templates/news-story: 404 for blocks/template-metadata/*.)
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const root = new URL('../../blocks/template-metadata/', import.meta.url);

test('template-metadata has block code that hides the table', async () => {
  assert.ok(existsSync(new URL('template-metadata.js', root)), 'block JS exists (no 404 on template previews)');
  const { default: decorate } = await import(new URL('template-metadata.js', root));
  const block = { hidden: false, setAttribute(name, value) { this[name] = value; } };
  decorate(block);
  assert.equal(block.hidden, true);
  assert.equal(block['aria-hidden'], 'true');
  assert.match(readFileSync(new URL('template-metadata.css', root), 'utf8'), /\.template-metadata\s*\{\s*display:\s*none;?\s*\}/);
});
