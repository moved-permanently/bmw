#!/usr/bin/env node
/* eslint-disable no-console */
/*
 * Writes the curated library (tools/ew-native/library.mjs) to a local folder, ready for review and
 * the guarded DA upload (tools/ew-native/da-upload.mjs). No network access.
 *   node tools/ew-native/write-library.mjs <wdh-de.json> <out-dir>
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
// eslint-disable-next-line import/extensions
import { buildLibrary } from './library.mjs';

const [wdhFile, outDir] = process.argv.slice(2);
if (!wdhFile || !outDir) {
  console.error('usage: write-library.mjs <wdh-de.json> <out-dir>');
  process.exit(2);
}
const { files } = buildLibrary({ wdh: JSON.parse(readFileSync(wdhFile, 'utf8')) });
Object.entries(files).forEach(([path, body]) => {
  const file = join(outDir, path);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, typeof body === 'string' ? body : `${JSON.stringify(body)}\n`);
  console.log(path);
});
