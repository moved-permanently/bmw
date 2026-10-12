/*
 * WDH panel in Experience Workspace: read and update the document in the editor over the
 * quick-edit port (captured by captureEditorPort in scripts/wdh-session.js). The messages are the
 * ones adobe/da-nx quick-edit.js uses to edit text in the page frame
 * (adobe/da-live blocks/canvas/ew-editor-wysiwyg/quick-edit-controller.js):
 * - reload -> set-body {body}: the document as page HTML (prose2aem: blocks as divs, metadata
 *   removed), outermost text blocks carry data-prose-index (their position in the document)
 * - get-editor {cursorOffset} -> set-editor-state {editorState, cursorOffset}: one text block as
 *   ProseMirror JSON
 * - node-update {node, cursorOffset}: replaces that block, as an author edit
 * Replies to the panel's own requests are held back from quick edit (it would open an editor on
 * the block or redraw the page).
 */
import { parseBinding, bindingHref, flat } from './aida-wdh.js';

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

/**
 * Positions of the text blocks in the editor body that hold WDH links, last first (updating one
 * does not move the ones before it).
 */
export function wdhOffsets(body) {
  const offsets = new Set();
  let current = null;
  [...body.matchAll(TOKEN_RE)].forEach(([, offset, href]) => {
    if (offset !== undefined) current = Number(offset);
    else if (current !== null && parseBinding(href.replace(/&amp;/g, '&'))) offsets.add(current);
  });
  return [...offsets].sort((a, b) => b - a);
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
 * The panel's Update: the linked values of the page from WDH, as edits in the editor (Cmd+Z undoes
 * them), then the page is redrawn. The vehicle JSON-LD is metadata, which the editor body does not
 * include: "…" → Update WDH values (Preflight) refreshes it.
 * @returns {Promise<number>} number of values changed
 */
export async function updateEditorValues(editor, { market, values }) {
  const offsets = wdhOffsets(await editor.readDocument());
  const count = await offsets.reduce(async (done, offset) => {
    const total = await done;
    const { node, cursorOffset } = await editor.getNode(offset);
    const { node: next, changes } = syncNodeBindings(node, market, values);
    if (changes.length) editor.updateNode(next, cursorOffset);
    return total + changes.length;
  }, Promise.resolve(0));
  editor.reload();
  return count;
}
