#!/usr/bin/env node
/* eslint-disable no-console, import/extensions */
/*
 * Regenerates all EW native showcase content and config steps locally (no network): files for the
 * guarded DA upload and site / org config steps for the append-only config apply.
 *   node tools/ew-native/write-content.mjs <wdh-de.json> <out-dir>
 *   -> <out-dir>/files/<DA path>, <out-dir>/steps-site.json, <out-dir>/steps-org.json
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { contentFiles, siteConfigSteps, orgConfigSteps } from './content.mjs';

const [wdhFile, outDir] = process.argv.slice(2);
if (!wdhFile || !outDir) {
  console.error('usage: write-content.mjs <wdh-de.json> <out-dir>');
  process.exit(2);
}
const files = contentFiles({ wdh: JSON.parse(readFileSync(wdhFile, 'utf8')) });
Object.entries(files).forEach(([path, body]) => {
  const file = join(outDir, 'files', path);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, typeof body === 'string' ? body : `${JSON.stringify(body)}\n`);
});
writeFileSync(join(outDir, 'steps-site.json'), JSON.stringify(siteConfigSteps(), null, 1));
writeFileSync(join(outDir, 'steps-org.json'), JSON.stringify(orgConfigSteps(), null, 1));
console.log(`${Object.keys(files).length} files, site + org config steps`);
