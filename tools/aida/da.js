/*
 * Shared plumbing for the Experience Workspace plugins and apps under /tools/aida/: SDK context,
 * Document Authoring source reads/writes with the author's token.
 */
// eslint-disable-next-line import/no-unresolved
import DA_SDK from 'https://da.live/nx/utils/sdk.js';

const DA_SOURCE = 'https://admin.da.live/source';

export default async function connect() {
  const { context, actions, token } = await DA_SDK;
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
