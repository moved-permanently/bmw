/* eslint-disable max-len, import/extensions */
/*
 * Review findings on the DA migration / verification (tools/semantic-styles/migrate.mjs) and the
 * vocabulary lookups (scripts/bmw-style-names.js): real class attributes, byte preservation outside
 * the allowed rewrite spans, complete inventories, serialized section classes, fail-closed parsing,
 * behavioural option order and inherited object names.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  mkdtempSync, mkdirSync, writeFileSync, rmSync, readFileSync, unlinkSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { createHash } from 'node:crypto';
import {
  expandSectionStyles, expandBlockOptions, toSemanticSectionStyles, toSemanticBlockOptions, findDeprecated,
} from '../../scripts/bmw-style-names.js';
import {
  migrateDocument, migrateExport, verifyExport, checkExport,
} from '../../tools/semantic-styles/migrate.mjs';

const sha = (s) => createHash('sha256').update(s).digest('hex');
const page = (main) => `<body><header></header><main>${main}</main><footer></footer></body>`;

/** DA source export: source/<path>.html + manifest.json (exported: path, status, sha256). */
function makeExport(dir, files) {
  Object.entries(files).forEach(([path, html]) => {
    const file = join(dir, 'source', `${path}.html`);
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, html);
  });
  const exported = Object.entries(files).map(([path, html]) => ({
    path: `${path}.html`, ext: 'html', status: 200, sha256: sha(html),
  }));
  writeFileSync(join(dir, 'manifest.json'), JSON.stringify({ exported }));
  return dir;
}

function withExport(files, fn) {
  const root = mkdtempSync(join(tmpdir(), 'semantic-hardening-'));
  try {
    const exp = makeExport(join(root, 'export'), files);
    const out = join(root, 'out');
    return fn({ root, exp, out });
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

const tamper = (out, path, from, to) => {
  const file = join(out, 'source', `${path}.html`);
  const html = readFileSync(file, 'utf8');
  assert.ok(html.includes(from), `fixture contains ${from}`);
  writeFileSync(file, html.replace(from, to));
};
const kinds = (report) => [...new Set(report.failures.map((f) => f.kind))].sort();

/* ---------------------------------------------------------------- 1. real class attribute */

test('only the real class attribute is rewritten, not data-class or class-like text in other attributes', () => {
  const doc = page('<div><div data-class="hero-teaser cols-5" class="hero-teaser cols-6" title=\'class="cols-7"\'><div><div>x</div></div></div></div>');
  assert.equal(
    migrateDocument(doc).html,
    page('<div><div data-class="hero-teaser cols-5" class="hero-teaser text-width-half" title=\'class="cols-7"\'><div><div>x</div></div></div></div>'),
  );
});

test('single-quoted, unquoted and upper-case class attributes are recognised; quotes are kept or added safely', () => {
  assert.equal(
    migrateDocument(page("<div><div class='disclaimer spacing-top-5'><div><div>x</div></div></div></div>")).html,
    page("<div><div class='disclaimer space-above-tight-l'><div><div>x</div></div></div></div>"),
  );
  assert.equal(
    migrateDocument(page('<div><div CLASS="carousel spacing-top-16"><div><div>x</div></div></div></div>')).html,
    page('<div><div CLASS="carousel space-above-regular"><div><div>x</div></div></div></div>'),
  );
  assert.equal(
    migrateDocument(page('<div><div id=a class=cards-quicklink data-x=1><div><div>x</div></div></div></div>')).html,
    page('<div><div id=a class=cards-quicklink data-x=1><div><div>x</div></div></div></div>'),
  );
  assert.equal(migrateDocument(page('<div class=spacing-top-16><p>x</p></div>')).html, page('<div class=space-above-regular><p>x</p></div>'));
});

/* ---------------------------------------------------------------- 2. byte preservation */

const RICH = page('<div><p><a href="/de/x" title="https://bmw.scene7.com/is/image/BMW/x:3to2">Bild</a></p>'
  + '<div class="carousel spacing-top-16" data-x="1"><div><div>Slide</div></div></div>'
  + '<div class="section-metadata"><div><div><p>style</p></div><div><p>spacing-top-16, spacing-bottom-16</p></div></div>'
  + '<div><div><p>id</p></div><div><p>bottom</p></div></div><div><div><p>title</p></div><div><p>Fußnoten</p></div></div></div></div>');

[
  ['section-metadata id', '<p>bottom</p>', '<p>top</p>'],
  ['section-metadata title', '<p>Fußnoten</p>', '<p>Footnotes</p>'],
  ['linked image title URL', 'BMW/x:3to2', 'BMW/y:3to2'],
  ['data attribute', 'data-x="1"', 'data-x="2"'],
  ['structure', '<div><div>Slide</div></div>', '<div><div>Slide</div><div>new cell</div></div>'],
].forEach(([what, from, to]) => {
  test(`verify rejects any non-style mutation: ${what}`, () => withExport({ '/de/rich': RICH }, ({ exp, out }) => {
    migrateExport(exp, out, { exclude: {} });
    assert.equal(verifyExport(exp, out, { exclude: {} }).ok, true, 'untampered migration verifies');
    tamper(out, '/de/rich', from, to);
    const report = verifyExport(exp, out, { exclude: {} });
    assert.equal(report.ok, false);
    assert.ok(kinds(report).includes('bytes'), JSON.stringify(report.failures));
  }));
});

/* ---------------------------------------------------------------- 3. complete inventory */

test('verify is bound to the complete before inventory and explicit exclusions', () => withExport({
  '/de/a': RICH, '/de/b': RICH, '/de/c': RICH,
}, ({ exp, out }) => {
  migrateExport(exp, out, { exclude: { '/de/c': 'reviewed: owner decision pending' } });
  assert.equal(verifyExport(exp, out, { exclude: { '/de/c': 'reviewed: owner decision pending' } }).ok, true);
  // absent output is not an exclusion (and the exclusions differ from the migration's)
  assert.deepEqual(kinds(verifyExport(exp, out, { exclude: {} })), ['manifest', 'missing']);
  unlinkSync(join(out, 'source', 'de', 'b.html'));
  assert.ok(kinds(verifyExport(exp, out, { exclude: { '/de/c': 'x' } })).includes('missing'));
  // extra output documents
  writeFileSync(join(out, 'source', 'de', 'b.html'), migrateDocument(RICH).html);
  writeFileSync(join(out, 'source', 'de', 'extra.html'), RICH);
  assert.ok(kinds(verifyExport(exp, out, { exclude: { '/de/c': 'x' } })).includes('extra'));
  // exclusions must name documents of the inventory
  assert.ok(kinds(verifyExport(exp, out, { exclude: { '/de/c': 'x', '/de/nope': 'x' } })).includes('unknown-exclusion'));
}));

test('verify rejects an empty output, drift of the before export and drift of outputs against the manifest', () => withExport({ '/de/a': RICH }, ({ root, exp, out }) => {
  const empty = join(root, 'empty');
  mkdirSync(join(empty, 'source'), { recursive: true });
  const report = verifyExport(exp, empty, { exclude: {} });
  assert.equal(report.ok, false);
  assert.equal(report.verified, 0);
  migrateExport(exp, out, { exclude: {} });
  writeFileSync(join(exp, 'source', 'de', 'a.html'), RICH.replace('Bild', 'Foto'));
  assert.ok(kinds(verifyExport(exp, out, { exclude: {} })).includes('inventory'), 'before export no longer matches its inventory');
  writeFileSync(join(exp, 'source', 'de', 'a.html'), RICH);
  tamper(out, '/de/a', 'space-regular', 'space-above-regular, space-below-regular');
  assert.ok(kinds(verifyExport(exp, out, { exclude: {} })).includes('drift'), 'output differs from the migration manifest');
}));

test('the inventory accepts an empty errors list and rejects an export that reported errors', () => withExport({ '/de/a': RICH }, ({ root, exp }) => {
  const file = join(exp, 'manifest.json');
  const manifest = JSON.parse(readFileSync(file, 'utf8'));
  writeFileSync(file, JSON.stringify({ ...manifest, errors: [] }));
  migrateExport(exp, join(root, 'ok'), { exclude: {} });
  assert.equal(verifyExport(exp, join(root, 'ok'), { exclude: {} }).ok, true);
  writeFileSync(file, JSON.stringify({ ...manifest, errors: [{ path: '/de/b.html', status: 500 }] }));
  assert.throws(() => migrateExport(exp, join(root, 'bad'), { exclude: {} }), /export reported 1 errors/);
  assert.ok(kinds(verifyExport(exp, join(root, 'ok'), { exclude: {} })).includes('inventory'));
}));

/* ------------------------------------------- 3b. the migration manifest is bound to the inventory */

const readJson = (file) => JSON.parse(readFileSync(file, 'utf8'));
const writeJson = (file, value) => writeFileSync(file, JSON.stringify(value));
const manifestFailures = (report) => report.failures.filter((f) => f.kind === 'manifest');

test('verify rejects a pruned before inventory even when it is self-consistent', () => withExport({ '/de/a': RICH, '/de/b': RICH }, ({ exp, out }) => {
  migrateExport(exp, out, { exclude: {} });
  assert.deepEqual(verifyExport(exp, out, { exclude: {} }), {
    ok: true, verified: 2, excluded: [], failures: [],
  });
  // drop /de/b from the before inventory, the before source and the output; migration manifest untouched
  const file = join(exp, 'manifest.json');
  const inventory = readJson(file);
  writeJson(file, { ...inventory, exported: inventory.exported.filter((e) => e.path !== '/de/b.html') });
  unlinkSync(join(exp, 'source', 'de', 'b.html'));
  unlinkSync(join(out, 'source', 'de', 'b.html'));
  const report = verifyExport(exp, out, { exclude: {} });
  assert.equal(report.ok, false);
  assert.ok(manifestFailures(report).some((f) => /inventory digest/.test(f.detail)), JSON.stringify(report.failures));
  assert.ok(manifestFailures(report).some((f) => f.path === '/de/b' && /not in the inventory/.test(f.detail)), JSON.stringify(report.failures));
}));

test('verify rejects a replaced before inventory (same paths, other checksums)', () => withExport({ '/de/a': RICH }, ({ exp, out }) => {
  migrateExport(exp, out, { exclude: {} });
  const other = RICH.replace('Bild', 'Foto');
  writeFileSync(join(exp, 'source', 'de', 'a.html'), other);
  writeJson(join(exp, 'manifest.json'), {
    exported: [{
      path: '/de/a.html', ext: 'html', status: 200, sha256: sha(other),
    }],
  });
  const report = verifyExport(exp, out, { exclude: {} });
  assert.equal(report.ok, false);
  assert.ok(manifestFailures(report).some((f) => /inventory digest/.test(f.detail)), JSON.stringify(report.failures));
}));

test('verify rejects missing, extra and duplicate migration-manifest records', () => withExport({ '/de/a': RICH, '/de/b': RICH }, ({ exp, out }) => {
  migrateExport(exp, out, { exclude: { '/de/b': 'reviewed' } });
  const file = join(out, 'manifest.json');
  const manifest = readJson(file);
  const check = (documents, pattern, path) => {
    writeJson(file, { ...manifest, documents });
    const report = verifyExport(exp, out, { exclude: { '/de/b': 'reviewed' } });
    assert.equal(report.ok, false, pattern.source);
    assert.ok(manifestFailures(report).some((f) => f.path === path && pattern.test(f.detail)), `${pattern.source}: ${JSON.stringify(report.failures)}`);
  };
  const [a, b] = manifest.documents;
  check([a], /no record/, '/de/b'); // excluded record dropped
  check([b], /no record/, '/de/a');
  check([a, b, { ...a, path: '/de/zzz' }], /not in the inventory/, '/de/zzz');
  check([a, a, b], /duplicate/, '/de/a');
  writeJson(file, manifest);
  assert.equal(verifyExport(exp, out, { exclude: { '/de/b': 'reviewed' } }).ok, true, 'restored manifest verifies');
}));

test('verify rejects exclusions that differ from the migration (paths, reasons, excluded checksums)', () => withExport({ '/de/a': RICH, '/de/b': RICH, '/de/c': RICH }, ({ exp, out }) => {
  const exclude = { '/de/b': 'reviewed: stale preview' };
  migrateExport(exp, out, { exclude });
  assert.equal(verifyExport(exp, out, { exclude }).ok, true);
  const reasons = verifyExport(exp, out, { exclude: { '/de/b': 'something else' } });
  assert.ok(manifestFailures(reasons).some((f) => /exclusions differ/.test(f.detail)), JSON.stringify(reasons.failures));
  // an extra exclusion at verify time (with its output removed) is not what was migrated
  unlinkSync(join(out, 'source', 'de', 'c.html'));
  const added = verifyExport(exp, out, { exclude: { ...exclude, '/de/c': 'later' } });
  assert.equal(added.ok, false);
  assert.ok(manifestFailures(added).some((f) => f.path === '/de/c' && /excluded/.test(f.detail)), JSON.stringify(added.failures));
  writeFileSync(join(out, 'source', 'de', 'c.html'), migrateDocument(RICH).html);
  // excluded record with another checksum than the inventory
  const file = join(out, 'manifest.json');
  const manifest = readJson(file);
  writeJson(file, { ...manifest, documents: manifest.documents.map((d) => (d.excluded ? { ...d, before: sha('other') } : d)) });
  const checksum = verifyExport(exp, out, { exclude });
  assert.ok(manifestFailures(checksum).some((f) => f.path === '/de/b' && /checksum/.test(f.detail)), JSON.stringify(checksum.failures));
}));

/* ---------------------------------------------------------------- 4. serialized section classes */

test('serialized styles on section class attributes (.plain.html / rendered shape) are migrated and checked', () => {
  const doc = page('<div class="spacing-top-16 content-8-center"><p>Genuine data</p></div>');
  assert.equal(migrateDocument(doc).html, page('<div class="space-above-regular content-two-thirds-centered"><p>Genuine data</p></div>'));
  const plain = '<div class="spacing-top-16 spacing-bottom-16 grey"><p>x</p><div class="columns cols-7-5"><div><div>a</div><div>b</div></div></div></div>';
  assert.equal(migrateDocument(plain).html, '<div class="space-regular background-secondary"><p>x</p><div class="columns layout-wide-narrow"><div><div>a</div><div>b</div></div></div></div>');
  withExport({ '/de/plain': doc }, ({ exp }) => {
    assert.deepEqual(checkExport(exp).map((h) => h.token).sort(), ['content-8-center', 'spacing-top-16']);
  });
});

test('the AIDA seed path converts copied content before writing DA documents', () => {
  const seed = readFileSync(new URL('../../tools/aida/content/seed.mjs', import.meta.url), 'utf8');
  assert.match(seed, /import \{ migrateDocument \} from '\.\.\/\.\.\/semantic-styles\/migrate\.mjs';/);
  assert.match(seed, /migrateDocument\(/);
});

/* ---------------------------------------------------------------- 5. fail closed */

test('a style cell with markup is an actionable exception and makes check and verify fail', () => withExport({
  '/de/strong': page('<div><p>x</p><div class="section-metadata"><div><div>style</div><div><strong>spacing-top-16</strong></div></div></div></div>'),
}, ({ exp, out }) => {
  const result = migrateDocument(readFileSync(join(exp, 'source', 'de', 'strong.html'), 'utf8'));
  assert.equal(result.changed, false);
  assert.match(result.exceptions.join('\n'), /style cell/);
  assert.ok(checkExport(exp).some((h) => h.kind === 'unsupported'), 'check reports the unsupported cell');
  const manifest = migrateExport(exp, out, { exclude: {} });
  assert.equal(manifest.summary.exceptions, 1);
  assert.ok(kinds(verifyExport(exp, out, { exclude: {} })).includes('exception'));
}));

test('comments, raw text and attribute values are not parsed as structure', () => {
  const doc = page('<div><!-- <div class="old"> --><script>const s = "<div>";</script><p title="<div>">t</p>'
    + '<div class="carousel spacing-top-16"><div><div>x</div></div></div></div>');
  assert.equal(migrateDocument(doc).html, doc.replace('carousel spacing-top-16', 'carousel space-above-regular'));
});

test('unbalanced div structure fails closed', () => {
  const doc = page('<div><div class="carousel spacing-top-16"><div><div>x</div></div></div></div></div>');
  const result = migrateDocument(doc);
  assert.equal(result.changed, false);
  assert.match(result.exceptions.join('\n'), /structure/);
});

/* ---------------------------------------------------------------- 6. behavioural order */

test('verify keeps behavioural option order and rejects conflicting options', () => withExport({
  '/de/acc': page('<div><div class="accordion width-6 width-lg-8"><div><div>Q</div><div>A</div></div></div></div>'),
}, ({ exp, out }) => {
  migrateExport(exp, out, { exclude: {} });
  assert.equal(verifyExport(exp, out, { exclude: {} }).ok, true);
  tamper(out, '/de/acc', 'width-half width-large-two-thirds', 'width-large-two-thirds width-half');
  assert.ok(kinds(verifyExport(exp, out, { exclude: {} })).includes('classes'), 'reordered options change behaviour');
  tamper(out, '/de/acc', 'width-large-two-thirds width-half', 'width-half width-full');
  assert.ok(kinds(verifyExport(exp, out, { exclude: {} })).includes('conflict'));
}));

test('accordion uses the first width option, so the migration never reorders behavioural options', () => {
  const { options } = toSemanticBlockOptions('accordion', ['width-md-12', 'width-6', 'width-lg-8']);
  assert.deepEqual(options, ['width-medium-full', 'width-half', 'width-large-two-thirds']);
});

/* ---------------------------------------------------------------- 7. inherited object names */

test('inherited object property names are ordinary unknown styles and block names', () => {
  const names = ['constructor', '__proto__', 'toString', 'hasOwnProperty', 'valueOf'];
  assert.deepEqual(expandSectionStyles(names), names);
  assert.deepEqual(toSemanticSectionStyles(names), { styles: names, exceptions: [] });
  assert.deepEqual(findDeprecated(names), []);
  names.forEach((block) => {
    assert.deepEqual(expandBlockOptions(block, ['made-up', 'constructor']), ['made-up', 'constructor']);
    assert.deepEqual(toSemanticBlockOptions(block, ['made-up']), { options: ['made-up'], exceptions: [] });
    assert.deepEqual(findDeprecated(['constructor'], block), []);
  });
  assert.deepEqual(expandBlockOptions('accordion', names), names);
});
