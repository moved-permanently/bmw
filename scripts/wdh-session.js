/*
 * Per-render WDH binding collection (no DOM; kept tiny because scripts.js loads it on every page).
 */
/**
 * WDH bindings of the current page render. Experience Workspace quick edit replaces the body and
 * calls loadPage again: start() begins a fresh collection, and a check started for an earlier
 * render can tell that it was superseded (isCurrent).
 */
// eslint-disable-next-line import/prefer-default-export
export function createWdhSession() {
  let generation = 0;
  let bindings = [];
  return {
    start() {
      generation += 1;
      bindings = [];
      return generation;
    },
    add(binding) {
      bindings.push(binding);
    },
    get bindings() {
      return bindings;
    },
    get generation() {
      return generation;
    },
    isCurrent(value) {
      return value === generation;
    },
  };
}

/**
 * Where the WDH check panel shows: preview hosts (aem.page, the Experience Workspace frame on
 * preview.da.live, local aem up), not on showcase pages and not on block library documents
 * (/library/…, previewed in the block library).
 * @param {{hostname: string, pathname: string}} location
 */
export function showWdhCheck({ hostname, pathname }) {
  if (/^\/(?:drafts\/)?aida\/showcase\//.test(pathname) || pathname.startsWith('/library/')) return false;
  return /(\.aem\.page|\.preview\.da\.live|^localhost)$/.test(hostname);
}

/**
 * Experience Workspace (?controller=parent) hands the page a MessagePort in its `init` message
 * and resends `init` with a new port until adobe/da-nx quick-edit.js answers on one. Listening
 * before quick edit loads keeps that port and sees each message on it before quick edit does, so
 * the WDH panel (scripts/wdh-editor.js) can read and update the document in the editor.
 * Call it at module level of scripts.js: the preview proxy appends the quick-edit loader there.
 * @returns {{port: MessagePort|null, canWrite: boolean, connected: boolean, listeners: Set}}
 */
export function captureEditorPort(win = window) {
  const editor = {
    port: null, canWrite: false, connected: false, listeners: new Set(),
  };
  if (new URLSearchParams(win.location.search).get('controller') !== 'parent') return editor;
  win.addEventListener('message', (e) => {
    if (e.source !== win.parent || e.data?.type !== 'init' || !e.ports?.length) return;
    const [port] = e.ports;
    editor.port = port;
    editor.canWrite = (e.data.payload?.config ?? e.data.init)?.canWrite === true;
    editor.connected = false;
    // runs before quick edit's port.onmessage (set after this listener): it can hold messages back
    port.addEventListener('message', (ev) => {
      if (editor.port !== port) return;
      editor.connected = true;
      editor.listeners.forEach((listener) => listener(ev));
    });
  });
  return editor;
}
