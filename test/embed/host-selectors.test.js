import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// aem-embed renders the site inside a shadow root, where :root matches nothing: every rule that
// sets custom properties or styles on :root also needs :host (the <aem-embed> element)
const FILES = ['styles/styles.css', 'blocks/header/header.css'];

FILES.forEach((file) => {
  test(`${file}: every :root selector list also targets :host`, () => {
    const css = readFileSync(new URL(`../../${file}`, import.meta.url), 'utf8')
      .replace(/\/\*[\s\S]*?\*\//g, '');
    const selectors = [...css.matchAll(/([^{}]+)\{/g)].map((m) => m[1].trim())
      .filter((s) => !s.startsWith('@') && s.includes(':root'));
    assert.ok(selectors.length > 0);
    selectors.forEach((list) => {
      const parts = list.split(',').map((p) => p.trim());
      parts.filter((p) => p.startsWith(':root')).forEach((p) => {
        assert.ok(parts.includes(p.replace(/^:root/, ':host')), `${file}: "${p}" has no :host twin`);
      });
    });
  });
});
