/*
 * WDH panel in Experience Workspace: read and update the document in the editor over the
 * quick-edit port (captured by captureEditorPort in scripts/wdh-session.js). The messages are the
 * ones adobe/da-nx quick-edit.js uses to edit text in the page frame
 * (adobe/da-live blocks/canvas/ew-editor-wysiwyg/quick-edit-controller.js):
 * - reload -> set-body {body}: the document as editor HTML, outermost text blocks carry
 *   data-prose-index (their position in the document)
 * - get-editor {cursorOffset} -> set-editor-state {editorState, cursorOffset}: one text block as
 *   ProseMirror JSON
 * - node-update {node, cursorOffset}: replaces that block, as an author edit
 * Replies to the panel's own requests are held back from quick edit (it would open an editor on
 * the block or redraw the page).
 */
import {
  parseBinding, bindingHref, textOf, flat,
} from './aida-wdh.js';
import { vehicleJsonLd, metaName } from './aida-doc.js';

const linkOf = (node) => node.marks?.find((m) => m.type === 'link');
const sameMark = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const sheetRoot = (href) => (href.includes('/aida/showcase/data/') ? '/aida/showcase/data' : '/aida/data');

function syncContent(content, market, values, changes, unknown) {
  const out = [];
  let i = 0;
  while (i < content.length) {
    const child = content[i];
    const mark = linkOf(child);
    const binding = mark && parseBinding(mark.attrs?.href);
    if (!binding) {
      out.push(child.content
        ? { ...child, content: syncContent(child.content, market, values, changes, unknown) }
        : child);
      i += 1;
    } else {
      // a link is a run of inline nodes with the same link mark (inline formatting splits it)
      let end = i + 1;
      const { href: runHref } = mark.attrs;
      while (end < content.length && linkOf(content[end])?.attrs?.href === runHref) end += 1;
      const run = content.slice(i, end);
      i = end;
      const current = values.get(binding.key);
      const text = flat(run.map((n) => n.text || '').join(''));
      if (!current?.display) {
        unknown.push(binding.key);
        out.push(...run);
      } else if (text === flat(current.display) && binding.market === market) {
        out.push(...run);
      } else {
        changes.push({
          key: binding.key, from: text, to: current.display, fromMarket: binding.market,
        });
        const href = bindingHref(market, binding.key, sheetRoot(mark.attrs.href));
        // like syncBindings on HTML: formatting inside the link goes, formatting around it stays
        const marks = run[0].marks
          .filter((m) => m.type === 'link' || run.every((n) => n.marks?.some((o) => sameMark(o, m))))
          .map((m) => (m.type === 'link' ? { ...m, attrs: { ...m.attrs, href } } : m));
        out.push({ type: 'text', text: current.display, marks });
      }
    }
  }
  return out;
}

/**
 * syncBindings for one editor node (ProseMirror JSON): WDH links get the market's value as text
 * and point to the market's sheet. Returns the node unchanged when nothing changes.
 */
export function syncNodeBindings(node, market, values) {
  const changes = [];
  const unknown = [];
  const next = node.content
    ? { ...node, content: syncContent(node.content, market, values, changes, unknown) }
    : node;
  return { node: changes.length ? next : node, changes, unknown };
}

const TOKEN_RE = /<(?:p|h[1-6]|ul|ol|pre|blockquote)\b[^>]*?\bdata-prose-index="(\d+)"|<a\b[^>]*?\bhref="([^"]*)"/gi;

function metadataValues(body) {
  const meta = new Map();
  [...body.matchAll(/<table\b[\s\S]*?<\/table>/gi)].forEach(([table]) => {
    const rows = [...table.matchAll(/<tr\b[\s\S]*?<\/tr>/gi)]
      .map(([row]) => [...row.matchAll(/<t[dh]\b[^>]*>([\s\S]*?)<\/t[dh]>/gi)].map((cell) => cell[1]));
    if (metaName(textOf(rows[0]?.[0] || '')) !== 'metadata') return;
    rows.slice(1).forEach(([key, value]) => {
      if (value === undefined) return;
      const paragraphs = [...value.matchAll(/<p\b[^>]*?\bdata-prose-index="(\d+)"[^>]*>([\s\S]*?)<\/p>/gi)];
      if (paragraphs.length !== 1) return;
      const [, offset, inner] = paragraphs[0];
      meta.set(metaName(textOf(key)), { offset: Number(offset), text: textOf(inner) });
    });
  });
  return meta;
}

/**
 * What to update in the editor body: positions of the text blocks holding WDH links (last first,
 * so updating one does not move the next) and the metadata values ({offset, text} by name).
 */
export function editorTargets(body) {
  const offsets = new Set();
  let current = null;
  [...body.matchAll(TOKEN_RE)].forEach(([, offset, href]) => {
    if (offset !== undefined) current = Number(offset);
    else if (current !== null && parseBinding(href.replace(/&amp;/g, '&'))) offsets.add(current);
  });
  return { offsets: [...offsets].sort((a, b) => b - a), meta: metadataValues(body) };
}

const links = new WeakMap();

/**
 * Requests to the editor over the captured quick-edit port (one at a time).
 * @param {{port: MessagePort, canWrite: boolean, connected: boolean, listeners: Set}} editor
 */
export function createEditorLink(editor, { timeout = 4000 } = {}) {
  if (links.has(editor)) return links.get(editor);
  let pending = null;
  const ownUpdates = new Set();
  editor.listeners.add((e) => {
    const { type, payload = {} } = e.data ?? {};
    if (type === 'node-update' && ownUpdates.delete(payload.nodeUpdateId)) {
      e.stopImmediatePropagation();
      return;
    }
    if (!pending || type !== pending.type || !pending.matches(payload)) return;
    e.stopImmediatePropagation();
    pending.resolve(payload);
  });
  const request = (message, type, matches = () => true) => new Promise((resolve, reject) => {
    if (pending) {
      reject(new Error('the editor is still answering the previous WDH request'));
      return;
    }
    const timer = setTimeout(() => {
      pending = null;
      reject(new Error(`the editor did not answer (${message.type})`));
    }, timeout);
    pending = {
      type,
      matches,
      resolve: (payload) => {
        clearTimeout(timer);
        pending = null;
        resolve(payload);
      },
    };
    editor.port.postMessage(message);
  });
  const link = {
    get ready() {
      return Boolean(editor.port && editor.connected);
    },
    get canWrite() {
      return editor.canWrite;
    },
    async readDocument() {
      return (await request({ type: 'reload' }, 'set-body')).body;
    },
    async getNode(cursorOffset) {
      const payload = await request(
        { type: 'get-editor', payload: { cursorOffset } },
        'set-editor-state',
        (p) => p.cursorOffset === cursorOffset,
      );
      return { node: payload.editorState, cursorOffset: payload.cursorOffset };
    },
    updateNode(node, cursorOffset) {
      const nodeUpdateId = crypto.randomUUID();
      ownUpdates.add(nodeUpdateId);
      editor.port.postMessage({ type: 'node-update', payload: { node, cursorOffset, nodeUpdateId } });
    },
    reload() {
      editor.port.postMessage({ type: 'reload' });
    },
  };
  links.set(editor, link);
  return link;
}

/**
 * The panel's Update: the same result as Preflight's update (linked values and an existing
 * json-ld metadata value), made as edits in the editor, then the page is redrawn.
 * @returns {Promise<number>} number of values changed
 */
export async function updateEditorValues(editor, { market, values, models = [] }) {
  const { offsets, meta } = editorTargets(await editor.readDocument());
  const targets = offsets.map((offset) => ({ offset }));
  const jsonld = meta.get('json-ld');
  const vehicle = models.find((m) => m.code === meta.get('wdh-model')?.text)?.jsonld;
  if (jsonld && vehicle) {
    try {
      const text = vehicleJsonLd(jsonld.text, vehicle, {
        title: meta.get('title')?.text, description: meta.get('description')?.text,
      });
      if (text !== jsonld.text) targets.push({ offset: jsonld.offset, text });
    } catch (e) {
      // invalid JSON-LD in the page or the sheet: leave it for Preflight to report
    }
  }
  targets.sort((a, b) => b.offset - a.offset);
  const count = await targets.reduce(async (done, target) => {
    const total = await done;
    const { node, cursorOffset } = await editor.getNode(target.offset);
    if (target.text !== undefined) {
      editor.updateNode({ ...node, content: [{ type: 'text', text: target.text }] }, cursorOffset);
      return total;
    }
    const { node: next, changes } = syncNodeBindings(node, market, values);
    if (changes.length) editor.updateNode(next, cursorOffset);
    return total + changes.length;
  }, Promise.resolve(0));
  editor.reload();
  return count;
}
