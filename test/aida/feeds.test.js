import { test } from 'node:test';
import assert from 'node:assert/strict';
import { representations, selectNews } from '../../scripts/aida-feeds.js';
import { toStreamItem } from '../../tools/aida/consumer/stream.js';

test('representations lists the formats one page is served in', () => {
  assert.deepEqual(representations('/aida/fr/fr/i5', '/aida/data/wdh-fr.json'), [
    { id: 'html', label: 'Web page', url: '/aida/fr/fr/i5' },
    { id: 'md', label: 'Markdown for LLMs', url: '/aida/fr/fr/i5.md' },
    { id: 'plain', label: 'HTML fragment', url: '/aida/fr/fr/i5.plain.html' },
    { id: 'jsonld', label: 'Structured data (JSON-LD)', url: '/aida/fr/fr/i5' },
    { id: 'data', label: 'Data (JSON)', url: '/aida/data/wdh-fr.json' },
  ]);
  assert.equal(representations('/x').length, 4);
});

test('selectNews filters by folder, skips the folder index and sorts newest first', () => {
  const rows = [
    { path: '/aida/en/news/a', title: 'A', date: '1790000000' },
    { path: '/aida/en/news/', title: 'News' },
    { path: '/aida/en/news/b', title: 'B', date: '1795000000' },
    { path: '/aida/en/i5', title: 'i5', date: '1799000000' },
    { path: '/aida/en/news/c', title: 'C', date: '2026-12-01' },
  ];
  assert.deepEqual(selectNews(rows, '/aida/en/news/').map((r) => r.title), ['C', 'B', 'A']);
  assert.deepEqual(selectNews(rows, '/aida/en/news/', 1).map((r) => r.title), ['C']);
});

test('toStreamItem turns a page into an app stream card', () => {
  const markdown = '# The BMW i5.\n\n![Hero](https://example.com/i5.jpg)\n\nUp to 627 km of range.\n\nMore text.';
  const html = '<p>Range <a href="/aida/data/wdh-de.json#61HG.electricRange">513–627 km</a></p>';
  assert.deepEqual(toStreamItem({ path: '/aida/en/i5', markdown, html }), {
    id: '/aida/en/i5',
    title: 'The BMW i5.',
    teaser: 'Up to 627 km of range.',
    image: 'https://example.com/i5.jpg',
    values: { '61HG.electricRange': '513–627 km' },
  });
});
