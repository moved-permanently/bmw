/* global globalThis */
/*
 * WDH panel in Experience Workspace: the page reads and updates the document over the quick-edit
 * port the canvas hands it (adobe/da-live quick-edit-controller.js: reload -> set-body,
 * get-editor -> set-editor-state, node-update), so "Update" needs no Preflight window.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  syncNodeBindings, wdhOffsets, createEditorLink, updateEditorValues,
} from '../../scripts/wdh-editor.js';
import { captureEditorPort } from '../../scripts/wdh-session.js';

const DE = (key) => `/aida/data/wdh-de.json#${key}`;
const FR = (key) => `/aida/data/wdh-fr.json#${key}`;
const link = (href) => ({ type: 'link', attrs: { href, title: null } });
const text = (t, marks) => (marks ? { type: 'text', text: t, marks } : { type: 'text', text: t });
const para = (...content) => ({ type: 'paragraph', content });
const item = (...content) => ({ type: 'list_item', content });
const VALUES = new Map([
  ['61HG.name', { display: 'BMW i5 eDrive40 Berline' }],
  ['61HG.power', { display: '250 kW (340 ch)' }],
  ['61HG.electricRange', { display: '518–627 km' }],
  ['61HG.wltp', { display: 'BMW i5 eDrive40 Berline : CO₂ 0 g/km' }],
]);

test('a WDH link in an editor node gets the market value and the market sheet link', () => {
  const node = para(text('Autonomie : '), text('513–627 km', [link(DE('61HG.electricRange'))]), text(' (WLTP)'));
  const { node: next, changes } = syncNodeBindings(node, 'fr', VALUES);
  assert.deepEqual(next, para(text('Autonomie : '), text('518–627 km', [link(FR('61HG.electricRange'))]), text(' (WLTP)')));
  assert.deepEqual(changes, [{
    key: '61HG.electricRange', from: '513–627 km', to: '518–627 km', fromMarket: 'de',
  }]);
  assert.equal(node.content[1].text, '513–627 km', 'the input node is not changed');
});

test('a link split by inline formatting becomes one text run with the marks the whole link had', () => {
  const wltp = link(DE('61HG.wltp'));
  const node = para(
    text('BMW i5 : CO', [{ type: 'strong' }, wltp]),
    text('2', [{ type: 'strong' }, wltp, { type: 'sub' }]),
    text(' 0 g/km', [{ type: 'strong' }, wltp]),
    text(' fin'),
  );
  const { node: next } = syncNodeBindings(node, 'fr', VALUES);
  assert.deepEqual(next.content, [
    text('BMW i5 eDrive40 Berline : CO₂ 0 g/km', [{ type: 'strong' }, link(FR('61HG.wltp'))]),
    text(' fin'),
  ]);
});

test('values that already match (also with non-breaking spaces) and unknown keys stay as they are', () => {
  const node = para(
    text('250\u00a0kW (340 ch)', [link(FR('61HG.power'))]),
    text(' et '),
    text('?', [link(DE('99XX.power'))]),
  );
  const result = syncNodeBindings(node, 'fr', VALUES);
  assert.deepEqual(result.changes, []);
  assert.deepEqual(result.node, node);
  assert.deepEqual(result.unknown, ['99XX.power']);
});

test('links in nested nodes are synced, other links stay, showcase links keep the showcase sheet', () => {
  const list = {
    type: 'bullet_list',
    content: [
      item(para(text('250 kW (340 ch)', [link('/aida/showcase/data/wdh-de.json#61HG.power')]))),
      item(para(text('bmw.fr', [link('https://www.bmw.fr/')]))),
    ],
  };
  const { node: next, changes } = syncNodeBindings(list, 'fr', VALUES);
  assert.deepEqual(next.content[0].content[0].content[0].marks, [link('/aida/showcase/data/wdh-fr.json#61HG.power')]);
  assert.deepEqual(next.content[1], list.content[1]);
  assert.equal(changes.length, 1);
});

// editor body (quick-edit set-body): the canvas converts its document with prose2aem (blocks as
// divs, metadata removed); outermost text blocks carry data-prose-index
const BODY = `<main><div><div class="hero-teaser" data-block-index="0"><div><div><p data-prose-index="3">Titre</p></div></div>
<div><div><p data-prose-index="18">La <a href="${DE('61HG.name')}">BMW i5</a></p></div></div></div>
<h2 data-prose-index="40">Puissance <a href="${DE('61HG.power')}" title="x">250 kW</a></h2>
<p class="x" data-prose-index="60">Plain text <a href="https://www.bmw.fr/">bmw.fr</a></p>
<ul data-prose-index="80"><li>A <a href="${DE('61HG.power')}">250 kW</a></li><li>B <a href="${DE('61HG.electricRange')}">513 km</a></li></ul>
</div></main>`;

test('the editor body tells which text blocks hold WDH links, last first', () => {
  assert.deepEqual(wdhOffsets(BODY), [80, 40, 18]);
  assert.deepEqual(wdhOffsets('<main><div><p data-prose-index="2">no values</p></div></main>'), []);
});

test('updating in the editor syncs every text block with WDH links, last first, then redraws the page', async () => {
  const nodes = new Map([
    [80, {
      type: 'bullet_list',
      content: [
        item(para(text('A '), text('250 kW', [link(DE('61HG.power'))]))),
        item(para(text('B '), text('513 km', [link(DE('61HG.electricRange'))]))),
      ],
    }],
    [40, { type: 'heading', attrs: { level: 2 }, content: [text('Puissance '), text('250 kW', [link(DE('61HG.power'))])] }],
    [18, para(text('La '), text('BMW i5 eDrive40 Berline', [link(FR('61HG.name'))]))],
  ]);
  const calls = [];
  const updates = new Map();
  const editor = {
    readDocument: async () => { calls.push('read'); return BODY; },
    getNode: async (offset) => { calls.push(`get ${offset}`); return { node: nodes.get(offset), cursorOffset: offset }; },
    updateNode: (node, offset) => { calls.push(`update ${offset}`); updates.set(offset, node); },
    reload: () => calls.push('reload'),
  };
  const count = await updateEditorValues(editor, { market: 'fr', values: VALUES });
  assert.deepEqual(calls, ['read', 'get 80', 'update 80', 'get 40', 'update 40', 'get 18', 'reload']);
  assert.equal(count, 3);
  assert.equal(updates.get(80).content[1].content[0].content[1].text, '518–627 km');
  assert.deepEqual(updates.get(40).content[1].marks, [link(FR('61HG.power'))]);
});

// quick-edit port: a fake window and MessagePorts (EventTargets)
class FakePort extends EventTarget {
  sent = [];

  postMessage(data) {
    this.sent.push(data);
  }

  receive(data) {
    const event = new Event('message');
    Object.defineProperty(event, 'data', { value: data });
    this.dispatchEvent(event);
  }
}

function editorWindow(search = '?rum=off&quick-edit=on&controller=parent') {
  const win = new EventTarget();
  win.parent = {};
  win.location = { search };
  win.init = (port, { canWrite = true, source = win.parent, type = 'init' } = {}) => {
    const event = new Event('message');
    Object.defineProperties(event, {
      source: { value: source },
      ports: { value: port ? [port] : [] },
      data: { value: { type, payload: { config: { canWrite } } } },
    });
    win.dispatchEvent(event);
  };
  return win;
}

function connectedEditor() {
  const win = editorWindow();
  const editor = captureEditorPort(win);
  const port = new FakePort();
  win.init(port);
  const quickEdit = [];
  port.addEventListener('message', (e) => quickEdit.push(e.data.type)); // quick edit attaches after us
  port.receive({ type: 'set-cursors', payload: {} });
  quickEdit.length = 0;
  return { editor, port, quickEdit };
}

test('in the editor the page keeps the port quick edit answers on (the canvas resends init)', () => {
  const win = editorWindow();
  const editor = captureEditorPort(win);
  const first = new FakePort();
  const second = new FakePort();
  win.init(first, { canWrite: false });
  win.init(second);
  assert.equal(editor.connected, false);
  second.receive({ type: 'set-body', payload: { body: '<p>x</p>' } });
  assert.equal(editor.port, second);
  assert.equal(editor.connected, true);
  assert.equal(editor.canWrite, true);
});

test('only init messages with a port from the parent frame count, and only in the editor', () => {
  const win = editorWindow();
  const editor = captureEditorPort(win);
  win.init(new FakePort(), { source: {} });
  win.init(new FakePort(), { type: 'set-body' });
  win.init(null);
  assert.equal(editor.port, null);
  const visitor = editorWindow('');
  const none = captureEditorPort(visitor);
  visitor.init(new FakePort());
  assert.equal(none.port, null);
});

test('the editor link reads the document without letting quick edit redraw the page', async () => {
  const { editor, port, quickEdit } = connectedEditor();
  const editorLink = createEditorLink(editor);
  assert.equal(editorLink.ready, true);
  assert.equal(editorLink.canWrite, true);
  const reading = editorLink.readDocument();
  assert.deepEqual(port.sent.at(-1), { type: 'reload' });
  port.receive({ type: 'set-body', payload: { body: '<p>doc</p>' } });
  assert.equal(await reading, '<p>doc</p>');
  assert.deepEqual(quickEdit, []);
  port.receive({ type: 'set-body', payload: { body: '<p>later</p>' } });
  assert.deepEqual(quickEdit, ['set-body'], 'later redraws still reach quick edit');
  assert.equal(createEditorLink(editor), editorLink, 'one link per editor port');
});

test('the editor link fetches and updates a node; only its own replies and acks are held back', async () => {
  const { editor, port, quickEdit } = connectedEditor();
  const editorLink = createEditorLink(editor);
  const node = para(text('x'));
  const getting = editorLink.getNode(18);
  assert.deepEqual(port.sent.at(-1), { type: 'get-editor', payload: { cursorOffset: 18 } });
  port.receive({ type: 'set-editor-state', payload: { editorState: para(), cursorOffset: 99 } });
  port.receive({ type: 'set-editor-state', payload: { editorState: node, cursorOffset: 18 } });
  assert.deepEqual(await getting, { node, cursorOffset: 18 });
  assert.deepEqual(quickEdit, ['set-editor-state'], 'the reply to an author click still reaches quick edit');

  editorLink.updateNode(node, 18);
  const sent = port.sent.at(-1);
  assert.equal(sent.type, 'node-update');
  assert.deepEqual(sent.payload.node, node);
  assert.equal(sent.payload.cursorOffset, 18);
  assert.ok(sent.payload.nodeUpdateId);
  port.receive({ type: 'node-update', payload: { nodeUpdateId: sent.payload.nodeUpdateId } });
  port.receive({ type: 'node-update', payload: { nodeUpdateId: 'author-edit' } });
  assert.deepEqual(quickEdit, ['set-editor-state', 'node-update']);

  editorLink.reload();
  assert.deepEqual(port.sent.at(-1), { type: 'reload' });
});

test('the editor link gives up when the editor does not answer', async () => {
  const { editor } = connectedEditor();
  const editorLink = createEditorLink(editor, { timeout: 20 });
  await assert.rejects(editorLink.readDocument(), /editor/);
  await assert.rejects(editorLink.getNode(3), /editor/);
});

test('a sheet can be loaded again past the page cache (WDH panel reload)', async (t) => {
  const calls = [];
  globalThis.fetch = async (url, init) => {
    calls.push(init?.cache);
    return { ok: true, json: async () => ({ data: [{ n: calls.length }], total: 1 }) };
  };
  globalThis.window = { hlx: {} };
  t.after(() => {
    delete globalThis.fetch;
    delete globalThis.window;
  });
  const { fetchSheet } = await import('../../scripts/bmw-utils.js');
  assert.equal((await fetchSheet('/aida/data/wdh-test.json')).data[0].n, 1);
  assert.equal((await fetchSheet('/aida/data/wdh-test.json')).data[0].n, 1);
  assert.equal((await fetchSheet('/aida/data/wdh-test.json', { reload: true })).data[0].n, 2);
  assert.deepEqual(calls, [undefined, 'reload']);
  assert.equal((await fetchSheet('/aida/data/wdh-test.json')).data[0].n, 2);
});
