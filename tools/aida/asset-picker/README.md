# BMW asset picker

A DA library extension backed by a curated catalogue of images already referenced by the public BMW demo. It does not connect to a private BMW DAM or require BMW IMS access.

## Open it

- [Standalone branch preview](https://assetpick--bmw--moved-permanently.aem.page/tools/aida/asset-picker/asset-picker.html?path=/aida/fr/be/i5)
- In DA's library, use **BMW assets**. The host supplies the current document path and insertion actions.

Standalone mode previews selections and can copy insertion markup; it does not write a DA document. The `path` query parameter supplies a document path only for standalone previews.

## Filters

- **Asset kind:** marketing photography or vehicle renders (COSY).
- **Country:** preselected from the current document's explicit country/locale, including Austria and Belgium independently of the WDH market. No country is assumed for language-only AIDA sources, including English, German and French. Unlocalized images are included in every country selection.
- **Brand:** BMW, BMW M or BMW ALPINA, where associated source pages establish the tag.
- **Family:** vehicle family such as 5 Series or X3.
- **Model:** vehicle model such as i5 or M5.

Text search matches captions, asset identifiers and the above metadata. Filters combine. Reset restores the document country and clears the other filters. Reopen the library after navigating to a different document: DA supplies context when the library opens, not as a continuous country feed.

Catalogue tags are derived from published pages and explicit URL markers, not authoritative DAM metadata or rights permissions. A missing country marker means unlocalized, not a licence to reuse worldwide. This demo catalogue contains German-specific and unlocalized assets; it does not invent French/Belgian rights metadata.

## Scene7 image options

- **Smart crop:** only named variants observed on source pages. “As authored” preserves an observed rendition; it does not invent an original URL or an unobserved crop name.
- **Framing:** square 1:1, landscape 16:9 or 3:2, portrait 4:5. Normalized `cropN` is computed from the selected rendition's loaded dimensions.
- **Subject position:** center, left, right, top or bottom within that framing crop.
- **Sharpen after resizing:** `op_sharpen=1`.

The server-rendered preview updates before insertion is enabled. Responsive image width, format and quality remain controlled by the website, so the picker does not expose settings the runtime would overwrite. COSY images do not receive Scene7 modifiers.

[Adobe crop/cropN reference](https://experienceleague.adobe.com/en/docs/dynamic-media-developer-resources/image-serving-api/image-serving-api/http-protocol-reference/command-reference/r-crop)

## Insertion

Both providers use the site's existing external image-carrier link convention:

```html
<p><a href="https://bmw.scene7.com/is/image/BMW/asset:3to2?fit=constrain,1">Descriptive alt text</a></p>
```

The website turns these links into pictures before block decoration, preserving upstream delivery rather than requesting a Media Bus copy. This works in ordinary document content or an image cell of an existing block. Alt text is required unless **Decorative image** is selected; decorative insertion uses the existing `Image without alt text` sentinel. Only observed descriptive captions prefill alt text; derived catalogue labels require the author to supply it. Shared uncaptained renders use a family-level label, and all observed source pages are available in the details. Insertion targets the current DA selection and closes the library.

A direct reference still depends on the upstream delivery URL, availability and cache behavior. The picker does not enforce source-DAM expiry, approval or licensing.

## Catalogue maintenance

The curated source manifest contains verified public page paths and model/family/brand associations. The generator fetches these public `.plain.html` pages, groups observed smart crops, keeps semantic Scene7/template parameters, and preserves COSY URLs. It samples a bounded number of distinct images per page and is not an exhaustive DAM export.

```sh
node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON tools/aida/content/asset-catalogue.mjs
npm test
npm run lint
npx stylelint tools/aida/asset-picker/asset-picker.css
```

The generator and tests are excluded from EDS delivery by `.hlxignore`; only the extension and public catalogue are runtime files. No new dependencies or build step are required.

## Browser regression tests

Start the local AEM CLI against the existing preview content:

```sh
aem up --port 3002 --no-open --no-livereload --url https://main--bmw--moved-permanently.aem.page --no-stop-other
```

Open `http://localhost:3002/test/aida/asset-picker-browser.html`. The fixture uses mock image loading and DA actions; it does not modify any real document. Results are displayed on the page and exposed as `window.assetPickerTests`. Verify real Scene7 previews and live DA insertion separately.

## DA library configuration

Append the following row to the existing site's `library` sheet without replacing its other rows:

| title | path |
|---|---|
| BMW assets | https://assetpick--bmw--moved-permanently.aem.page/tools/aida/asset-picker/asset-picker.html |

The branch URL deliberately isolates the demo implementation from `main`. After an approved merge, switch the row to the `main` preview URL.
