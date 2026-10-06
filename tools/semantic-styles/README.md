# tools/semantic-styles

Migration of existing Document Authoring content to the semantic section / block style vocabulary
([docs/authoring/section-and-block-styles.md](../../docs/authoring/section-and-block-styles.md),
`scripts/bmw-style-names.js`). Not served (`.hlxignore`).

```bash
node tools/semantic-styles/migrate.mjs <export> <out> --exclude exclusions.json           # dry run, no network
node tools/semantic-styles/migrate.mjs --verify <export> <out> --exclude exclusions.json  # strict verification
node tools/semantic-styles/migrate.mjs --check <export-or-out>   # legacy names, conflicts, unsupported markup
```

`<export>/source/<path>.html` is a DA source export (list + source API, read-only) and
`<export>/manifest.json` its complete inventory (`exported[]`: path, status, sha256). `<out>` gets
`source/` (migrated sources), `rollback/` (originals of changed documents), `diff/` and
`manifest.json` (inventory checksum, the exclusions, per document sha256 before/after, changes,
exceptions). `exclusions.json` maps document paths (without `.html`) to the reviewed reason; it is
required (`{}` for none) and every path must be in the inventory. A document is never treated as
excluded because it is absent.

Rewritten are only the plain-text value of the `style` row in section-metadata tables, the class
attribute value of blocks and the class attribute value of sections (serialized styles in the
`.plain.html` / rendered shape); every other byte stays. The scanner skips comments, raw-text
elements and attribute values and uses the real `class` attribute only (not `data-class`).
Exceptions leave the element (or, for unbalanced structure, the whole document) unchanged:
conflicting names for one property (two top spacings, two widths for one breakpoint), values
without a semantic name, style cells with markup (`<strong>` …) and unbalanced `<div>` structure.

`--verify` fails unless all of these hold:

- the export matches its inventory (no missing / extra files, sha256 per document, no export errors);
- every inventory document is either explicitly excluded or present in the output (`missing`),
  nothing else is there (`extra`), exclusions name inventory documents (`unknown-exclusion`) and at
  least one document is verified (`empty`);
- each output matches the migration manifest (`drift`: before = inventory sha256, after = file);
- the bytes outside the rewritten style spans are identical (`bytes`) and each span expands to the
  same implementation classes in the same order (`classes`; only `spacing-*` classes, which no
  script reads, are compared as a set);
- the source had no exceptions (`exception`), the output has no conflicts, unsupported markup or
  legacy names (`conflict`, `unsupported`, `legacy`) and migrating it again changes nothing
  (`idempotence`).

## Runbook (order matters)

1. **Code first.** The code (semantic names + legacy compatibility) must be merged and live on the
   `main` preview before any DA document uses the new names; the current `main` code does not know them.
2. Fresh DA export (read-only); `migrate.mjs` dry run with the reviewed exclusions; `--verify` (same
   exclusions) must be `ok`; review `manifest.json`, `diff/` and the exclusions.
3. Compare each to-be-uploaded document's DA source sha256 with `manifest.json` `before` right
   before uploading: a different checksum means the document was edited since the export — re-export
   and re-run instead of overwriting.
4. Upload the `source/` files of changed documents (DA source API), then preview them; do not preview
   documents that were never previewed (keep their state) or whose preview was stale (excluded).
5. Re-export; every uploaded document's sha256 must equal its manifest `after`, every other
   document's its `before`; `--check <new-export>`; visual parity on representative pages.

**Rollback:** upload the `rollback/` file of a document (its original source) and preview it again;
the runtime keeps rendering legacy names, so a rollback never breaks a page.
