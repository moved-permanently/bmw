#!/usr/bin/env node
// Local text-to-speech helper for the BMW CarPlay demo. The app asks it for the audio when "Vorlesen" is pressed;
// it calls OpenAI's speech endpoint and caches the result on disk, so a text is paid for and rendered only once.
//
//   OPENAI_API_KEY=... node demo/tts-helper.mjs          (./demo/run.sh tts loads the key from ~/.secrets)
//
//   POST /tts   {"text": "...", "lang": "de-DE"}  ->  audio/mpeg      (X-TTS-Cache: hit | miss)
//   POST /warm  {"items": [{"text": "...", "lang": "de-DE"}, ...]}  ->  202, renders them in the background
//   GET  /health                                                    ->  {ok, key, model, voice, cached}
//
// Environment: OPENAI_API_KEY (needed for texts that are not cached yet), PORT (8765), OPENAI_TTS_MODEL
// (gpt-4o-mini-tts), OPENAI_TTS_VOICE (marin), TTS_CACHE_DIR (demo/.tts-cache), OPENAI_BASE_URL.
// The key is read from the environment only and is never logged or returned. The server listens on 127.0.0.1.
// The audio is an AI-generated voice, as OpenAI's usage policy asks users to be told: the README says so.
import http from 'node:http';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, renameSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const LIMIT = 4000; // OpenAI accepts 4096 characters per request

const INSTRUCTIONS = {
  de: 'Sprich akzentfreies Deutsch (Hochdeutsch aus Deutschland) wie eine freundliche, ruhige Sprecherin im Autoradio: weibliche Stimme, natürlicher Rhythmus und natürliche Betonung, klare Aussprache von Namen wie BMW, kurze Pausen am Satzende. Nicht übertrieben, kein Verkaufston.',
  fr: 'Parle un français naturel et clair, comme une présentatrice calme et chaleureuse à la radio de la voiture : voix féminine, rythme naturel, prononciation nette des noms propres comme BMW, de courtes pauses en fin de phrase. Sans exagération.',
  en: 'Speak natural British English like a calm, friendly female presenter on the car radio: natural rhythm and stress, clear pronunciation of names such as BMW, short pauses at the end of sentences. Not exaggerated, no sales tone.',
};
const instructionsFor = (lang = 'de-DE') => INSTRUCTIONS[String(lang).slice(0, 2).toLowerCase()] || INSTRUCTIONS.de;

/** Cuts text to the request limit, at a sentence end when there is one. */
export function fit(text, limit = LIMIT) {
  const t = text.trim();
  if (t.length <= limit) return t;
  const head = t.slice(0, limit);
  const end = Math.max(head.lastIndexOf('. '), head.lastIndexOf('! '), head.lastIndexOf('? '), head.lastIndexOf('.\n'));
  if (end > limit / 2) return head.slice(0, end + 1).trim();
  const space = head.lastIndexOf(' ');
  return (space > limit / 2 ? head.slice(0, space) : head).trim();
}

const ABBREVIATIONS = new Set(['ca', 'z', 'b', 'nr', 'dr', 'prof', 'bzw', 'd', 'h', 'u', 'a', 'usw', 'vgl', 'ggf', 'mio', 'mrd', 'st', 'str', 'tel', 'inkl', 'evtl', 'etc', 'max', 'min', 'abb', 'vs', 'mr', 'mrs', 'no', 'approx']);

/**
 * Splits text into pieces of about `target` characters at sentence ends, so a long text can be rendered in parallel
 * (one request takes 8-9 s for an article, a chunk takes 3-4 s). A full stop after an abbreviation or a number
 * ("ca. 25", "z. B.", "der 3. Satz") does not end a sentence.
 */
export function chunks(text, target = 220) {
  const words = text.trim().split(/\s+/);
  const sentences = [];
  let current = [];
  words.forEach((w, i) => {
    current.push(w);
    const next = words[i + 1];
    const stem = w.replace(/^[„"»(]+/, '').replace(/[.!?…]+["“«)]*$/, '').toLowerCase();
    const ends = /[.!?…]["“«)]*$/.test(w) && next !== undefined && !(/\.$/.test(w) && (ABBREVIATIONS.has(stem) || /^\d+$/.test(stem)));
    if (ends || next === undefined) { sentences.push(current.join(' ')); current = []; }
  });
  const out = [];
  let acc = '';
  sentences.forEach((sentence) => {
    if (acc && acc.length + 1 + sentence.length > target) { out.push(acc); acc = sentence; } else acc = acc ? `${acc} ${sentence}` : sentence;
  });
  if (acc) out.push(acc);
  return out;
}

export function createHelper({
  apiKey = '', baseUrl = 'https://api.openai.com/v1', model = 'gpt-4o-mini-tts', voice = 'marin',
  cacheDir = join(HERE, '.tts-cache'), log = () => {},
} = {}) {
  mkdirSync(cacheDir, { recursive: true });
  const inflight = new Map();

  const keyFor = (input, instructions) => createHash('sha256').update(JSON.stringify([model, voice, instructions, input])).digest('hex');

  /** Audio for the text: from the cache, from a request that is already running, or from OpenAI. */
  async function render(rawText, lang) {
    const input = fit(rawText);
    const instructions = instructionsFor(lang);
    const hash = keyFor(input, instructions);
    const file = join(cacheDir, `${hash}.mp3`);
    if (existsSync(file)) return { audio: readFileSync(file), cache: 'hit' };
    if (!apiKey) { const e = new Error('OPENAI_API_KEY is not set, and this text is not cached'); e.status = 503; throw e; }
    if (!inflight.has(hash)) {
      const started = Date.now();
      const speak = async (piece) => {
        const res = await fetch(`${baseUrl}/audio/speech`, {
          method: 'POST',
          headers: { authorization: `Bearer ${apiKey}`, 'content-type': 'application/json' },
          body: JSON.stringify({ model, voice, input: piece, instructions, response_format: 'mp3' }),
          signal: AbortSignal.timeout(60000),
        });
        if (!res.ok) { const e = new Error(`upstream ${res.status}`); e.status = 502; throw e; }
        return Buffer.from(await res.arrayBuffer());
      };
      inflight.set(hash, (async () => {
        const pieces = chunks(input);
        // The parts are rendered at the same time and joined in text order; MP3 frames can simply be appended.
        const audio = Buffer.concat(await Promise.all(pieces.map(speak)));
        const tmp = `${file}.${process.pid}.tmp`;
        writeFileSync(tmp, audio);
        renameSync(tmp, file);
        log(`rendered ${input.length} chars in ${pieces.length} part(s) (${lang}) in ${((Date.now() - started) / 1000).toFixed(1)} s: ${input.slice(0, 40).replace(/\s+/g, ' ')}`);
        return audio;
      })().finally(() => inflight.delete(hash)));
    }
    return { audio: await inflight.get(hash), cache: 'miss' };
  }

  const readJson = (req) => new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (c) => { body += c; if (body.length > 512 * 1024) { reject(Object.assign(new Error('body too large'), { status: 413 })); req.destroy(); } });
    req.on('end', () => { try { resolve(JSON.parse(body || '{}')); } catch { reject(Object.assign(new Error('invalid JSON'), { status: 400 })); } });
    req.on('error', reject);
  });
  const send = (res, status, body, type = 'application/json', headers = {}) => {
    res.writeHead(status, { 'content-type': type, 'cache-control': 'no-store', ...headers });
    res.end(typeof body === 'string' || Buffer.isBuffer(body) ? body : JSON.stringify(body));
  };

  return http.createServer(async (req, res) => {
    try {
      const path = new URL(req.url, 'http://localhost').pathname;
      if (path === '/health') {
        return send(res, 200, { ok: true, key: Boolean(apiKey), model, voice, cached: readdirSync(cacheDir).filter((f) => f.endsWith('.mp3')).length });
      }
      if (path !== '/tts' && path !== '/warm') return send(res, 404, { error: 'not found' });
      if (req.method !== 'POST') return send(res, 405, { error: 'POST only' }, 'application/json', { allow: 'POST' });
      const body = await readJson(req);
      if (path === '/warm') {
        const items = (Array.isArray(body.items) ? body.items : []).filter((i) => typeof i?.text === 'string' && i.text.trim()).slice(0, 50);
        send(res, 202, { queued: items.length });
        (async () => {
          for (const i of items) { try { await render(i.text, i.lang); } catch (e) { log(`warm failed: ${e.message}`); } }
        })();
        return undefined;
      }
      if (typeof body.text !== 'string' || !body.text.trim()) return send(res, 400, { error: 'text is required' });
      const { audio, cache } = await render(body.text, body.lang);
      return send(res, 200, audio, 'audio/mpeg', { 'x-tts-cache': cache });
    } catch (e) {
      log(`error: ${e.message}`);
      return send(res, e.status || 500, { error: e.message });
    }
  });
}

// Started directly (not imported by a test).
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const env = process.env;
  const port = Number(env.PORT || 8765);
  const helper = createHelper({
    apiKey: env.OPENAI_API_KEY || '', baseUrl: env.OPENAI_BASE_URL || undefined, model: env.OPENAI_TTS_MODEL || undefined,
    voice: env.OPENAI_TTS_VOICE || undefined, cacheDir: env.TTS_CACHE_DIR || undefined,
    log: (m) => console.log(`${new Date().toISOString().slice(11, 19)} ${m}`),
  });
  helper.on('error', (e) => { console.error(`tts helper: ${e.message}`); process.exit(1); });
  helper.listen(port, '127.0.0.1', () => {
    console.log(`tts helper on http://127.0.0.1:${port} (OpenAI key: ${env.OPENAI_API_KEY ? 'set' : 'MISSING, only cached texts will play'}, voice ${env.OPENAI_TTS_VOICE || 'marin'})`);
  });
}
