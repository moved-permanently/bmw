import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { daDocument, publicDocument, nativePath } from '../../tools/aida/pilot/render.js';

test('pilot shell states its boundaries and provides connected editorial and native handoff controls', () => {
  const html = readFileSync('tools/aida/pilot/ui/index.html', 'utf8');
  assert.match(html, /not IMS authentication/);
  assert.match(html, /not EDS publishing/);
  assert.match(html, /id="actor"/);
  assert.match(html, /id="editor"/);
  assert.match(html, /id="metrics"/);
  assert.match(html, /id="notifications"/);
  assert.match(html, /da.live\/apps\/snapshots/);
  assert.match(html, /da.live\/apps\/loc/);
});
test('exports remain document-native and never claim an unpublished draft has a publication date', () => {
  const article = { id: 'fr--test', slug: 'test', market: 'fr', revision: 1, title: 'A <title>', description: 'A & summary', body: 'Paragraph one\n\nParagraph two', legal: 'Legal', localIntro: '', localCta: '' };
  assert.equal(nativePath(article), '/aida/fr/fr/news/test');
  const html = daDocument(article);
  assert.match(html, /class="metadata"/);
  assert.match(html, /html-lang<\/div><div>fr/);
  assert.doesNotMatch(html, /datePublished/);
  assert.match(html, /A &lt;title&gt;/);
  assert.doesNotMatch(publicDocument({ ...article, publishedAt: '2026-09-30T10:00:00Z' }), /<title>A <title>/);
});
