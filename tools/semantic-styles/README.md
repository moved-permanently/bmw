# tools/semantic-styles

Migration of existing Document Authoring content to the semantic section / block style vocabulary
([docs/authoring/section-and-block-styles.md](../../docs/authoring/section-and-block-styles.md),
`scripts/bmw-style-names.js`). Not served (`.hlxignore`).

```bash
node tools/semantic-styles/migrate.mjs <export> <out> [--exclude exclusions.json]   # dry run, no network
node tools/semantic-styles/migrate.mjs --verify <export> <out>   # classes / text / links / media / idempotence
node tools/semantic-styles/migrate.mjs --check <export-or-out>   # remaining legacy names (exit 1 if any)
```

`<export>/source/<path>.html` is a DA source export (list + source API, read-only). `<out>` gets
`source/` (migrated sources, again an export), `rollback/` (originals of changed documents),
`diff/` and `manifest.json` (per document: sha256 before/after, changes, exceptions, exclusions).

Only the value cell of the `style` row in section-metadata tables and the class attribute of blocks
are rewritten; every other byte stays. Conflicting names for one property (e.g. two top spacings)
are reported as exceptions and the element is left unchanged.

## Runbook (order matters)

1. **Code first.** The code (semantic names + legacy compatibility) must be merged and live on the
   `main` preview before any DA document uses the new names; the current `main` code does not know them.
2. Fresh DA export (read-only); `migrate.mjs` dry run; `--verify` must be `ok`; review `manifest.json`
   exceptions and the exclusions.
3. Compare each to-be-uploaded document's DA source sha256 with `manifest.json` `before` right
   before uploading: a different checksum means the document was edited since the export — re-export
   and re-run instead of overwriting.
4. Upload the `source/` files of changed documents (DA source API), then preview them; do not preview
   documents that were never previewed (keep their state) or whose preview was stale (excluded).
5. Re-export, `--verify <first-export> <new-export>` and `--check <new-export>`; visual parity on
   representative pages.

**Rollback:** upload the `rollback/` file of a document (its original source) and preview it again;
the runtime keeps rendering legacy names, so a rollback never breaks a page.
