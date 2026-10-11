/*
 * Shared plumbing for the Experience Workspace plugins and apps under /tools/aida/: SDK context,
 * Document Authoring source reads/writes with the author's token.
 */
const DA_SOURCE = 'https://admin.da.live/source';
const MAIN_SDK = 'https://da.live/nx/utils/sdk.js';

// `?nx=<branch>` in the plugin URL (library sheet) loads that da-nx branch's SDK, like
// da.live's own `?nx=`. A missing branch falls back to the da.live SDK.
export function sdkUrl(search = '') {
  const nx = new URLSearchParams(search).get('nx');
  if (!nx || nx === 'main' || !/^[a-z0-9-]+$/.test(nx)) return MAIN_SDK;
  if (nx === 'local') return 'http://localhost:6456/nx/utils/sdk.js';
  return `https://${nx}--da-nx--adobe.aem.live/nx/utils/sdk.js`;
}

// DA posts its one-time handshake ~750ms after the iframe loads, then only changes (such as the
// link under the cursor). Hold the parent's messages until the SDK has loaded, then replay them.
const early = [];
const hold = (e) => { if (e.source === window.parent) early.push(e); };
window.addEventListener('message', hold);

let sdk;
function loadSdk() {
  sdk ??= import(sdkUrl(window.location.search))
    .catch(() => import(MAIN_SDK))
    .then((module) => {
      window.removeEventListener('message', hold);
      early.splice(0).forEach(({
        data, ports, origin, source,
      }) => window.dispatchEvent(new MessageEvent('message', {
        data, ports: [...ports], origin, source,
      })));
      return module.default;
    });
  return sdk;
}

export default async function connect() {
  const { context, actions, token } = await loadSdk();
  const org = context.org || context.owner;
  const site = context.site || context.repo;
  const url = (path) => `${DA_SOURCE}/${org}/${site}${/\.[a-z]+$/.test(path) ? path : `${path}.html`}`;

  const read = async (path) => {
    const resp = await actions.daFetch(url(path));
    if (!resp.ok) throw new Error(`${path}: ${resp.status}`);
    return resp.text();
  };

  const rows = async (path, name) => {
    try {
      const json = JSON.parse(await read(path));
      return (name ? json[name]?.data : json.data) || [];
    } catch (e) {
      return [];
    }
  };

  const write = async (path, body) => {
    const form = new FormData();
    const type = url(path).endsWith('.json') ? 'application/json' : 'text/html';
    form.append('data', new Blob([body], { type }));
    const resp = await actions.daFetch(url(path), { method: 'PUT', body: form });
    if (!resp.ok) throw new Error(`${path}: ${resp.status}`);
  };

  const list = async (path) => {
    const resp = await actions.daFetch(`https://admin.da.live/list/${org}/${site}${path}`);
    return resp.ok ? resp.json() : [];
  };

  return {
    context, actions, token, org, site, read, rows, write, list,
  };
}
