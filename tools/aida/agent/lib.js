/*
 * Document helpers for the content agent: block-aware text segmentation for translation,
 * metadata edits and the translation pipeline (the model call is injected).
 * Works on DA source HTML (blocks are <div class="name"> tables).
 */
import { parseBinding, textOf } from '../../../scripts/aida-wdh.js';
import { getMetadata, setMetadata } from '../../../scripts/aida-doc.js';

export { getMetadata, setMetadata };

const escape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const metaName = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const CONFIG_ROWS = ['preselect', 'sort', 'style'];
const CONFIG_TEXT = /^[a-zA-Z]+: ?[\w-]+(, ?[a-zA-Z]+: ?[\w-]+)*$/;
const ICON_TEXT = /^:[a-z0-9_-]+:$/;
const TRANSLATED_META = ['title', 'description'];

function translatable(text, ctx) {
  if (!/\p{L}/u.test(text) || ICON_TEXT.test(text) || CONFIG_TEXT.test(text)) return false;
  if (/^(https?:)?\/\//.test(text) || ctx.binding) return false;
  if (!ctx.block) return true;
  if (ctx.block === 'section-metadata') return false;
  if (ctx.block === 'metadata') return ctx.cell === 1 && TRANSLATED_META.includes(metaName(ctx.key));
  if (ctx.cell > 0 && CONFIG_ROWS.includes(metaName(ctx.key))) return false;
  return !(ctx.cell === 0 && CONFIG_ROWS.includes(metaName(text)));
}

export function extractSegments(html) {
  const parts = html.split(/(<[^>]+>)/);
  const divs = [];
  const anchors = [];
  const slots = [];

  parts.forEach((part, index) => {
    if (part.startsWith('<')) {
      if (/^<div\b/i.test(part)) {
        const cls = part.match(/class="([^"]*)"/);
        const blockIdx = divs.findLastIndex((d) => d.block);
        const entry = { block: cls ? cls[1].split(/\s+/)[0] : null };
        const rel = divs.length - blockIdx;
        if (blockIdx >= 0 && rel === 2) {
          const row = divs[blockIdx + 1];
          entry.cell = row.cells;
          row.cells += 1;
        }
        if (blockIdx >= 0 && rel === 1) Object.assign(entry, { cells: 0, key: '' });
        divs.push(entry);
      } else if (/^<\/div>/i.test(part)) {
        divs.pop();
      } else if (/^<a\b/i.test(part)) {
        const href = part.match(/href="([^"]*)"/);
        anchors.push(Boolean(href && parseBinding(href[1])));
      } else if (/^<\/a>/i.test(part)) {
        anchors.pop();
      }
      return;
    }
    const text = textOf(part);
    if (!text) return;
    const blockIdx = divs.findLastIndex((d) => d.block);
    const ctx = {
      binding: anchors.some(Boolean),
      block: blockIdx >= 0 ? divs[blockIdx].block : null,
    };
    if (blockIdx >= 0) {
      const row = divs[blockIdx + 1];
      const cell = divs.slice(blockIdx + 2).find((d) => d.cell !== undefined);
      ctx.cell = cell ? cell.cell : -1;
      if (row && ctx.cell === 0) row.key += text;
      ctx.key = row ? row.key : '';
    }
    if (translatable(text, ctx)) slots.push({ index, text });
  });

  return {
    segments: slots.map((s) => s.text),
    rebuild(translations) {
      const out = [...parts];
      slots.forEach((slot, i) => {
        const [, lead, trail] = parts[slot.index].match(/^(\s*)[\s\S]*?(\s*)$/);
        out[slot.index] = `${lead}${escape(translations[i])}${trail}`;
      });
      return out.join('');
    },
  };
}

export function parseJsonArray(text) {
  const json = JSON.parse(text.trim().replace(/^```(?:json)?\s*|\s*```$/g, ''));
  if (!Array.isArray(json)) throw new Error('model output is not a JSON array');
  return json;
}

const LANGUAGE_NAMES = { de: 'German', en: 'English', fr: 'French' };
const reEscape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function batches(items, maxItems = 40, maxChars = 6000) {
  const out = [[]];
  let chars = 0;
  items.forEach((item) => {
    const current = out[out.length - 1];
    if (current.length && (current.length >= maxItems || chars + item.length > maxChars)) {
      out.push([]);
      chars = 0;
    }
    out[out.length - 1].push(item);
    chars += item.length;
  });
  return out.filter((b) => b.length);
}

/**
 * Translates a DA document with any chat-completion model.
 * @param {string} html DA source HTML
 * @param {{from: string, to: string, terms: string[], complete: Function}} opts terms are kept
 *   verbatim; complete(messages) returns the model's text answer
 */
export async function translateHtml(html, {
  from, to, terms, complete,
}) {
  const { segments, rebuild } = extractSegments(html);
  const sorted = [...terms].sort((a, b) => b.length - a.length);
  const protect = (s) => sorted.reduce(
    (acc, term, i) => acc.replace(new RegExp(reEscape(term), 'g'), `⟦${i}⟧`),
    s,
  );
  const restore = (s) => s.replace(/⟦(\d+)⟧/g, (all, i) => sorted[Number(i)] ?? all);
  const system = `You translate BMW website copy from ${LANGUAGE_NAMES[from] || from} to ${LANGUAGE_NAMES[to] || to}. `
    + 'The input is a JSON array of strings. Answer with a JSON array of the same length and order that '
    + 'holds the translations and nothing else. Keep placeholders such as ⟦0⟧ exactly as they are. '
    + 'Keep numbers, units, product names and the brand voice: confident, precise, never casual.';

  const ask = async (batch) => parseJsonArray(await complete([
    { role: 'system', content: system },
    { role: 'user', content: JSON.stringify(batch) },
  ]));
  // Models occasionally merge or drop strings: retry once, then split the batch in halves.
  const translateBatch = async (batch) => {
    let answer = await ask(batch);
    if (answer.length !== batch.length) answer = await ask(batch);
    if (answer.length === batch.length) return answer;
    if (batch.length === 1) {
      throw new Error(`model returned ${answer.length} segments, expected 1`);
    }
    const half = Math.ceil(batch.length / 2);
    return [
      ...(await translateBatch(batch.slice(0, half))),
      ...(await translateBatch(batch.slice(half))),
    ];
  };

  const translated = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const batch of batches(segments.map(protect))) {
    // eslint-disable-next-line no-await-in-loop
    const answer = await translateBatch(batch);
    translated.push(...answer.map((s) => restore(String(s))));
  }
  return setMetadata(rebuild(translated), 'html-lang', to);
}
