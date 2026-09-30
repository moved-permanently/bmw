#!/usr/bin/env node
/*
 * Content agent CLI: what a customer-side agent does with the public Document Authoring API and
 * the customer's own model (any OpenAI-compatible chat-completions endpoint).
 * No Adobe model involved.
 *
 *   node tools/aida/agent/aida.mjs get <path>
 *   node tools/aida/agent/aida.mjs put <local-file> <path>
 *   node tools/aida/agent/aida.mjs bind <path> --code <model-code>
 *   node tools/aida/agent/aida.mjs sync <path> [<path> ...]
 *   node tools/aida/agent/aida.mjs translate <source-path> <target-path>
 *     --to <lang> [--from <lang>]
 *   node tools/aida/agent/aida.mjs review <path>
 *
 * Paths are site paths ("/aida/en/i5", "/aida/data/wdh-de.json"); documents without an extension
 * are .html. Writes go to Document Authoring only; preview/publish stays with the author.
 *
 * Environment: DA_TOKEN (IMS bearer token), AIDA_ORG / AIDA_SITE (default moved-permanently/bmw),
 * AIDA_AI_URL (default https://api.openai.com/v1), AIDA_AI_KEY (or OPENAI_API_KEY), AIDA_AI_MODEL.
 */
/* eslint-disable no-console */
import { readFileSync } from 'node:fs';
import { withVehicleJsonLd } from '../../../scripts/aida-doc.js';
import {
  autoBind, syncBindings, valuesFromSheet, marketForPath, textOf,
} from '../../../scripts/aida-wdh.js';
import {
  translateHtml, getMetadata, setMetadata, parseJsonArray,
} from './lib.js';

const ORG = process.env.AIDA_ORG || 'moved-permanently';
const SITE = process.env.AIDA_SITE || 'bmw';
const DA = 'https://admin.da.live';
const AI_URL = (process.env.AIDA_AI_URL || 'https://api.openai.com/v1').replace(/\/$/, '');
const AI_KEY = process.env.AIDA_AI_KEY || process.env.OPENAI_API_KEY;
const AI_MODEL = process.env.AIDA_AI_MODEL || 'gpt-4.1-mini';

const withExt = (path) => (/\.[a-z]+$/.test(path) ? path : `${path}.html`);
const sourceUrl = (path) => `${DA}/source/${ORG}/${SITE}${withExt(path)}`;

function auth() {
  if (!process.env.DA_TOKEN) throw new Error('DA_TOKEN is not set (IMS bearer token)');
  return { Authorization: `Bearer ${process.env.DA_TOKEN}` };
}

async function get(path) {
  const resp = await fetch(sourceUrl(path), { headers: auth() });
  if (!resp.ok) throw new Error(`GET ${path}: ${resp.status}`);
  return resp.text();
}

async function put(path, body) {
  const type = withExt(path).endsWith('.json') ? 'application/json' : 'text/html';
  const form = new FormData();
  form.append('data', new Blob([body], { type }));
  const resp = await fetch(sourceUrl(path), { method: 'PUT', headers: auth(), body: form });
  if (!resp.ok) throw new Error(`PUT ${path}: ${resp.status}`);
  console.log(`saved ${path} -> https://da.live/edit#/${ORG}/${SITE}${path.replace(/\.html$/, '')}`);
}

const sheet = async (path) => JSON.parse(await get(path));

async function complete(messages) {
  if (!AI_KEY) throw new Error('AIDA_AI_KEY (or OPENAI_API_KEY) is not set');
  const resp = await fetch(`${AI_URL}/chat/completions`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${AI_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: AI_MODEL, messages, temperature: 0.2 }),
  });
  if (!resp.ok) throw new Error(`model endpoint: ${resp.status} ${await resp.text()}`);
  return (await resp.json()).choices[0].message.content;
}

async function marketValues(path) {
  const page = marketForPath(path);
  if (!page) throw new Error(`${path} is not in a language or market folder`);
  if (page.fallback) console.log(`note: no WDH export for ${page.locale}, using ${page.market}`);
  const data = await sheet(`/aida/data/wdh-${page.market}.json`);
  return { market: page.market, values: valuesFromSheet(data), models: data.models?.data || [] };
}

async function brandTerms() {
  try {
    return (await sheet('/aida/data/brand-terms.json')).data.map((r) => r.term).filter(Boolean);
  } catch (e) {
    return [];
  }
}

function applyWdh(html, { market, values, models }) {
  const result = syncBindings(html, market, values);
  const model = models.find((m) => m.code === getMetadata(result.html, 'wdh-model'));
  const withLd = model?.jsonld ? withVehicleJsonLd(result.html, model.jsonld) : result.html;
  return { ...result, html: withLd };
}

const commands = {
  async get([path]) {
    console.log(await get(path));
  },

  async put([file, path]) {
    await put(path, readFileSync(file, 'utf8'));
  },

  async bind([path], { code }) {
    const wdh = await marketValues(path);
    const { html, bound } = autoBind(await get(path), wdh.market, wdh.values, code);
    console.log(`${path}: ${bound.length} values bound (${wdh.market})`);
    bound.forEach((b) => console.log(`  ${b.key}  ${b.text.slice(0, 80)}`));
    if (bound.length) await put(path, setMetadata(html, 'wdh-model', code));
  },

  async sync(paths) {
    // eslint-disable-next-line no-restricted-syntax
    for (const path of paths) {
      // eslint-disable-next-line no-await-in-loop
      const wdh = await marketValues(path);
      // eslint-disable-next-line no-await-in-loop
      const before = await get(path);
      const { html, changes, unknown } = applyWdh(before, wdh);
      console.log(`${path}: ${changes.length} values updated (${wdh.market})`);
      changes.forEach((c) => console.log(`  ${c.key}  ${c.from.slice(0, 60)} -> ${c.to.slice(0, 60)}`));
      unknown.forEach((k) => console.log(`  ${k}  not in WDH`));
      // eslint-disable-next-line no-await-in-loop
      if (html !== before) await put(path, html);
    }
  },

  async translate([source, target], { to, from }) {
    const html = await get(source);
    const fromLang = from || marketForPath(source)?.lang || 'en';
    const toLang = to || marketForPath(target)?.lang;
    const terms = await brandTerms();
    console.log(`translating ${source} (${fromLang}) -> ${target} (${toLang}) with ${AI_MODEL}, ${terms.length} protected terms`);
    const translated = await translateHtml(html, {
      from: fromLang, to: toLang, terms, complete,
    });
    const { html: out, changes } = applyWdh(translated, await marketValues(target));
    console.log(`  ${changes.length} WDH values switched to the target market`);
    await put(target, out);
  },

  async review([path]) {
    const text = textOf((await get(path)).replace(/<div class="(section-)?metadata">[\s\S]*?<\/div><\/div><\/div>/g, ''));
    const answer = await complete([
      {
        role: 'system',
        content: 'You review BMW web pages before publication. Check brand voice (confident, precise, '
          + 'never casual), legal hygiene (claims about range, consumption or availability need a WLTP '
          + 'reference; no absolute claims such as "the best"), and clarity. Answer with a JSON array of '
          + 'findings {"severity": "error"|"warning"|"info", "quote": "...", "issue": "...", '
          + '"suggestion": "..."} and nothing else. Return [] when there is nothing to report.',
      },
      { role: 'user', content: text.slice(0, 20000) },
    ]);
    const findings = parseJsonArray(answer);
    console.log(`${path}: ${findings.length} findings (${AI_MODEL})`);
    findings.forEach((f) => console.log(`  [${f.severity}] "${f.quote}"\n    ${f.issue}\n    -> ${f.suggestion}`));
  },
};

const [command, ...rest] = process.argv.slice(2);
const args = rest.filter((a, i) => !a.startsWith('--') && !rest[i - 1]?.startsWith('--'));
const opts = Object.fromEntries(rest.flatMap((a, i) => (a.startsWith('--') ? [[a.slice(2), rest[i + 1]]] : [])));

if (!commands[command]) {
  console.error('commands: get, put, bind, sync, translate, review (see header of aida.mjs)');
  process.exit(1);
}
commands[command](args, opts).catch((e) => {
  console.error(e.message);
  process.exit(1);
});
