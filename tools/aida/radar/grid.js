import { DA_EDITOR, DEMO_BRANCH } from '../editor.js';

/*
 * Rollout radar model: which language and market copies of each source page exist, and whether the
 * source changed after a copy was last edited. Topology comes from the site's translation config
 * (.da/translate.json, tabs config + languages).
 */
const rowsOf = (sheet) => sheet?.data || [];
const split = (s) => (s || '').split(',').map((t) => t.trim()).filter(Boolean);

export function topology(config) {
  const sourceName = rowsOf(config?.config).find((r) => r.key === 'source.language')?.value;
  const languages = rowsOf(config?.languages);
  if (!languages.length || languages.some((l) => typeof l.name !== 'string' || typeof l.location !== 'string')) {
    throw new Error('The translation config must define language names and folder locations');
  }
  const source = languages.find((l) => l.name === sourceName) || languages[0];
  const targets = languages.flatMap((l) => [
    ...(l === source ? [] : [{ name: l.name, location: l.location, kind: 'language' }]),
    ...split(l.locales).map((location) => ({ name: location.split('/').pop(), location, kind: 'locale' })),
  ]);
  return { source: { name: source.name, location: source.location }, targets };
}

/**
 * Language -> market structure of the rollout (translation config only; no status): the source
 * language, each target language and the market folders that are rolled out from it.
 */
export function dependencies(config) {
  const { source } = topology(config);
  const languages = rowsOf(config.languages)
    .filter((l) => l.name !== source.name)
    .map((l) => ({
      name: l.name,
      location: l.location,
      markets: split(l.locales).map((location) => ({ name: location.split('/').pop(), location })),
    }));
  return { source, languages };
}

export function cellStatus(sourceModified, targetModified) {
  if (targetModified === undefined) return 'missing';
  const time = (value) => {
    if (value == null || value === '') return NaN;
    return typeof value === 'number' || /^\d+$/.test(value) ? Number(value) : Date.parse(value);
  };
  const source = time(sourceModified);
  const target = time(targetModified);
  if (!Number.isFinite(source) || !Number.isFinite(target)) return 'unknown';
  return target < source ? 'behind' : 'current';
}

export const TIMESTAMP_LABELS = {
  missing: 'not started', behind: 'source newer', current: 'edited since source', unknown: 'timestamp unavailable',
};

export function pageActions({
  org, site, path, ref = 'main',
}) {
  if (![org, site, ref].every((value) => /^[a-z0-9-]+$/.test(value))) throw new Error('Invalid site or branch');
  let decoded;
  try { decoded = decodeURIComponent(path); } catch { throw new Error('Invalid page path'); }
  if (!decoded.startsWith('/') || /[<>?#\\]/.test(decoded)
    || [...decoded].some((char) => char.charCodeAt(0) < 32)
    || decoded.includes('//') || decoded.split('/').some((part) => part === '.' || part === '..')) {
    throw new Error('Invalid page path');
  }
  const encoded = decoded.split('/').map((part) => encodeURIComponent(part)).join('/');
  const query = new URLSearchParams({
    path: decoded, org, site, ref,
  });
  const inbox = new URLSearchParams({
    org, site, path: decoded, env: 'ci', ref: DEMO_BRANCH, nx: DEMO_BRANCH,
  });
  return {
    edit: `${DA_EDITOR}/canvas#/${org}/${site}${encoded}`,
    preview: `https://${ref}--${site}--${org}.aem.page${encoded}`,
    preflight: `/tools/aida/preflight/preflight.html?${query}`,
    review: `${DA_EDITOR}/app/adobe-rnd/aem-apps/tools/apps/publish-requests-inbox/publish-requests-inbox?${inbox}`,
    files: `${DA_EDITOR}/#/${org}/${site}${encoded.slice(0, encoded.lastIndexOf('/'))}`,
    snapshots: `${DA_EDITOR}/apps/snapshots#/${org}/${site}`,
    translate: `${DA_EDITOR}/apps/loc#/${org}/${site}`,
  };
}

/**
 * Review state of a page from the publish requests sheet (/.da/publish-workflow-requests.json):
 * the step a pending request waits on (one past the highest approved step in its `step` log of
 * `email:step:date` entries) and that step's title from publish-workflow-settings.
 */
export function reviewState(rows, settings, path) {
  const row = rows.find((r) => r.path === path && r.status === 'pending');
  if (!row) return null;
  const approved = split(row.step).map((entry) => parseInt(entry.split(':')[1], 10))
    .filter((n) => Number.isInteger(n) && n > 0);
  const step = Math.max(0, ...approved) + 1;
  const title = settings.find((s) => s.key === `workflow.step.${step}.title`)?.value || `Step ${step}`;
  return { step, title, requester: row.requester };
}

/** Editor comment threads of a page: roots (threadId null) that are open or resolved. */
export function commentCounts(comments) {
  const roots = comments.filter((c) => c.threadId == null);
  const resolved = roots.filter((c) => c.resolved).length;
  return { open: roots.length - resolved, resolved };
}

export function buildGrid(sourcePages, targets, modified) {
  return sourcePages.map(({ rel, lastModified }) => ({
    rel,
    cells: targets.map((t) => {
      const path = `${t.location}${rel}`;
      return { target: t.name, path, status: cellStatus(lastModified, modified.get(path)) };
    }),
  }));
}
