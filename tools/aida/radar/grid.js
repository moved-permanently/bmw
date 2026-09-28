/*
 * Rollout radar model: which language and market copies of each source page exist, and whether the
 * source changed after a copy was last edited. Topology comes from the site's translation config
 * (.da/translate.json, tabs config + languages).
 */
const rowsOf = (sheet) => sheet?.data || [];
const split = (s) => (s || '').split(',').map((t) => t.trim()).filter(Boolean);

export function topology(config) {
  const sourceName = rowsOf(config.config).find((r) => r.key === 'source.language')?.value;
  const languages = rowsOf(config.languages);
  const source = languages.find((l) => l.name === sourceName) || languages[0];
  const targets = languages.flatMap((l) => [
    ...(l === source ? [] : [{ name: l.name, location: l.location, kind: 'language' }]),
    ...split(l.locales).map((location) => ({ name: location.split('/').pop(), location, kind: 'locale' })),
  ]);
  return { source: { name: source.name, location: source.location }, targets };
}

export function cellStatus(sourceModified, targetModified) {
  if (targetModified === undefined) return 'missing';
  return targetModified < sourceModified ? 'behind' : 'current';
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
