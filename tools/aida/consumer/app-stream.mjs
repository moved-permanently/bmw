#!/usr/bin/env node
/*
 * A channel that is not the website: builds an app "stream" (JSON cards) from pages as a backend
 * (Next.js server component, mobile app BFF, in-car screen) would, using only what every page
 * already serves: .md for text, .plain.html for bound tech values.
 *
 *   node tools/aida/consumer/app-stream.mjs https://main--bmw--moved-permanently.aem.page /aida/fr/fr/i5 ...
 */
/* eslint-disable no-console */
import { toStreamItem } from './stream.js';

const [origin, ...paths] = process.argv.slice(2);
const text = async (url) => {
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`${url}: ${resp.status}`);
  return resp.text();
};

const items = await Promise.all(paths.map(async (path) => toStreamItem({
  path,
  markdown: await text(`${origin}${path}.md`),
  html: await text(`${origin}${path}.plain.html`),
})));
console.log(JSON.stringify({ generated: new Date().toISOString(), source: origin, items }, null, 2));
