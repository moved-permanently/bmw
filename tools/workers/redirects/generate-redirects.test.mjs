import { test } from 'node:test';
import assert from 'node:assert/strict';
import { edsPath, buildRedirects, toCsv } from './generate-redirects.mjs';

test('edsPath follows the importer path rules', () => {
  assert.equal(edsPath('/de/index.html'), '/de/home');
  assert.equal(edsPath('/de.html'), '/de/home');
  assert.equal(edsPath('/'), '/de/home');
  assert.equal(edsPath('/de/neufahrzeuge.html'), '/de/neufahrzeuge');
  assert.equal(edsPath('/de_DE/shop-online/bmw-business-offers.html'), '/de-de/shop-online/bmw-business-offers');
  assert.equal(edsPath('/de/publicPools/sitemap/sitemap.html'), '/de/publicpools/sitemap/sitemap');
  assert.equal(edsPath('/de/elektroauto/foerderungen_privatkunden.html'), '/de/elektroauto/foerderungen-privatkunden');
  assert.equal(edsPath('/de/x/a-b.html.html'), '/de/x/a-b');
});

test('buildRedirects: legacy, html and entry rows; never shadows a migrated page', () => {
  const crawl = {
    pages: {
      'https://www.bmw.de/de/old.html': { s: 200, final: 'https://www.bmw.de/de/new.html' },
      'https://www.bmw.de/de/away.html': { s: 200, final: 'https://www.bmw.de/de/not-migrated.html' },
      'https://www.bmw.de/de/new.html': { s: 200, final: 'https://www.bmw.de/de/new.html' },
      'https://www.bmw.de/de/gone.html': { s: 404, final: 'https://www.bmw.de/de/gone.html', err: true },
    },
  };
  const scope = ['https://www.bmw.de/de/new.html', 'https://www.bmw.de/de/index.html'];
  const { list } = buildRedirects({ crawl, scope });
  const map = Object.fromEntries(list.map((r) => [r.source, r.destination]));
  assert.equal(map['/de/old.html'], '/de/new');
  assert.equal(map['/de/old'], '/de/new');
  assert.equal(map['/de/away.html'], 'https://www.bmw.de/de/not-migrated.html');
  assert.equal(map['/de/new.html'], '/de/new');
  assert.equal(map['/de/index.html'], '/de/home');
  assert.equal(map['/'], '/de/home');
  assert.equal(map['/de/new'], undefined);
  assert.equal(map['/de/home'], undefined);
  assert.equal(map['/de/gone.html'], undefined);
  assert.match(toCsv(list), /^Source,Destination\n/);
});
