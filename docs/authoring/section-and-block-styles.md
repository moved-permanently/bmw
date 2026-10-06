# Section and block styles (authoring vocabulary)

Authors describe **intent** — how much space, how wide, which background — instead of internal
numbers. The site expands every name to the implementation classes the CSS and block code use
(`scripts/bmw-style-names.js`), so a name looks exactly like the numeric utility it replaces, at
every breakpoint.

| Kind of name | Origin |
|---|---|
| `background-secondary`, `background-dark` | project-defined aliases derived from BMW styles and tokens: the secondary surface (`style-container--secondary`, `--surface-background-secondary`, #f6f6f6) and the dark container (`style-container--background-dark`); see [Other section styles](#other-section-styles) for what the importer derives them from |
| `small` / `medium` / `large` in width names | **BMW** grid breakpoints (`aem-GridColumn--small/medium/large--N`) |
| `center`, `body-2`, `h1-headline-2/3`, `h1-subsection-1/2` | **BMW** (`style-container--center`, `style-text--body-2`, `style-title--headline-N`, `--subsection-N`) |
| Spacing families (`tight`, `related`, `regular`, `separated`, `feature`) and their sizes | **project-defined** (BMW numbers its spacing steps, `style-common--cmp-spacing-*-N`, and has no names for them) |
| Width fractions (`half`, `two-thirds`, …) | **project-defined** (fractions of BMW's 12-column grid) |
| Layout names (`layout-wide-narrow`, `slides-triples`, `items-small-…`, `widths-equal`, …) | **project-defined** (BMW's grid spans and slides per view, see [Layout options](#layout-options)) |

The numeric utilities (`spacing-top-16`, `content-8-center`, `cols-5`, `width-lg-8`, `cols-7-5`,
`slides-1-2-3-3`, …) are
**deprecated** for authoring. They still render (existing content keeps working) and are converted
by the DA migration (`tools/semantic-styles/migrate.mjs`); `npm test` fails if docs, block metadata
or the content generators reintroduce them.

## Spacing

Section metadata `Style`, and options of any block (they space the block):

| Name | Meaning |
|---|---|
| `space-<size>` | space above and below |
| `space-above-<size>` | space above only |
| `space-below-<size>` | space below only |

Sizes — one per BMW spacing step, grouped by what the space usually expresses:

| Size | Family / typical use | Internal step | < 1280 px | ≥ 1280 px | ≥ 1920 px |
|---|---|---|---|---|---|
| `tight-xxs` | tight: notes attached to content | 1 | 0.125rem | 0.125rem | 0.125rem |
| `tight-xs` | tight | 2 | 0.25rem | 0.25rem | 0.5rem |
| `tight-s` | tight (e.g. below legal notes) | 3 | 0.5rem | 0.5rem | 0.75rem |
| `tight-m` | tight (e.g. below a stage) | 4 | 0.5rem | 0.75rem | 1rem |
| `tight-l` | tight (e.g. above legal notes) | 5 | 0.75rem | 1rem | 1.25rem |
| `tight-xl` | tight | 6 | 1rem | 1.25rem | 1.5rem |
| `related-s` | related: within one topic (e.g. technical data) | 8 | 1.25rem | 1.5rem | 2rem |
| `related-m` | related (e.g. between galleries, below videos) | 10 | 1.5rem | 2rem | 2.5rem |
| `related-l` | related (e.g. headline after a stage, tabs) | 12 | 2rem | 2.5rem | 3rem |
| `regular` | **the standard section / component rhythm** | 16 | 2.5rem | 3rem | 4rem |
| `separated-s` | separated: feature teasers | 20 | 3rem | 4rem | 5rem |
| `separated-l` | separated | 24 | 4rem | 5rem | 6rem |
| `feature-s` | feature: exceptional large gaps | 32 | 5rem | 6rem | 8rem |
| `feature-m` | feature | 40 | 6rem | 8rem | 10rem |
| `feature-l` | feature | 60 | 8rem | 10rem | 15rem |

Examples: `space-regular` (was `spacing-top-16, spacing-bottom-16`),
`space-above-related-l, space-below-regular` (was `spacing-top-12, spacing-bottom-16`),
Disclaimer `(info, space-tight-l)` (was `info, spacing-top-5, spacing-bottom-5`).

## Width of section text (default content)

`content-<fraction>`, `content-<fraction>-centered`, `content-<fraction>-offset-<fraction>` — the
text, headings and buttons of a section span that fraction of the 12-column grid from 1280 px; the
value also applies to the large (1024–1279 px) and medium (768–1023 px) breakpoints unless they are
given; phones stay full width unless a small value is given:

| Breakpoint override | Applies |
|---|---|
| `content-large-<fraction>[-centered…]` | 1024–1279 px (and medium, unless given) |
| `content-medium-<fraction>[-centered…]` | 768–1023 px |
| `content-small-<fraction>[-centered…]` | < 768 px |

Fractions:

| Fraction | Columns | Fraction | Columns |
|---|---|---|---|
| `twelfth` | 1 | `seven-twelfths` | 7 |
| `sixth` | 2 | `two-thirds` | 8 |
| `quarter` | 3 | `three-quarters` | 9 |
| `third` | 4 | `five-sixths` | 10 |
| `five-twelfths` | 5 | `eleven-twelfths` | 11 |
| `half` | 6 | `full` | 12 |

Examples: `content-two-thirds-centered, center` (was `content-8-center, center`),
`content-half-centered, content-large-two-thirds-centered` (was `content-6-center, content-lg-8-center`),
`content-large-half-offset-third` (was `content-lg-6-offset-4`).

## Other section styles

`background-secondary` (was `grey`), `background-dark` (was `dark`); unchanged: `center`,
`tab-panel`, `layer`, `contained`, `highlight`, `body-2`, `h1-headline-2`, `h1-headline-3`,
`h1-subsection-1`, `h1-subsection-2`.

The two background names are project-defined aliases, derived from (not named by) BMW: the
importer (`tools/importer/transformers/bmw-sections.js`) writes `background-dark` for source
containers with `style-container--dark` or `style-common--dark-background`, or a
`style-container--background…` class in `ctx-mode--dark`, and `background-secondary` for any other
container with a generic `style-container--background…` class (rendered as the secondary surface,
`--bmw-surface-grey` = #f6f6f6).

## Block options

| Block | Name | Was |
|---|---|---|
| any block | `space-<size>`, `space-above-<size>`, `space-below-<size>` | `spacing-top-N`, `spacing-bottom-N` |
| Accordion, Content Table | `width-<fraction>`, `width-large-<fraction>`, `width-medium-<fraction>` | `width-N`, `width-lg-N`, `width-md-N` |
| Hero Teaser | `text-width-<fraction>` (text box width from 1024 px) | `cols-N` |
| Hero Teaser | `text-above-<size>`, `text-below-<size>` (text box) | `text-top-N`, `text-bottom-N` |
| Hero Teaser | `cta-above-<size>`, `cta-below-<size>` (button row) | `cta-top-N`, `cta-bottom-N` |
| Hero Teaser | `subline-above-<size>` (first paragraph after the headline) | `sub-top-N` |
| Columns | `video-space-above-<size>` (embedded video) | `video-spacing-top-N` |
| Columns, Carousel, Icon Teaser, Model Offer, Text Media Teaser | layout names, see [Layout options](#layout-options) | `cols-A-B…`, `md-A-B…`, `img-D-M-S`, `inset-N-…`, `slides-…`, `offsets-…`, `span-md-N`, `col-A-B` |

**Kept as they are** (not utilities): typography roles (`body-1/2`, `title-headline-1`,
`sub-headline-2/3`, `h2`); aspect ratios (`ratio-W-H`, `mobile-ratio-W-H`, `video-ratio-W-H`,
Model Card `ratio-3x2`); data parameters (Content Table `highlight-N`, `center-N`, `end-N`,
Accordion `expand-N`, Embed `height-N`). After the migration these are the only numbers left in
style names (`npm test` checks this over the DA snapshot).

Accordion and Content Table use the **first** width option of a breakpoint; the migration keeps
the authored order and treats two widths for one breakpoint as a conflict (left unchanged, reported).

## Layout options

Breakpoints: small below 768 px, medium 768–1023 px, large 1024–1279 px, xlarge from 1280 px.
Fractions as above; counts `one` … `nine`; cells `first` … `twelfth`. Every name expands to exactly
one numeric option and back; a value without a name stays as it is and is reported.

**Columns**

| Name | Applies | Was |
|---|---|---|
| `layout-halves`, `layout-thirds`, `layout-quarters` | cell widths from 768 px (cells stack below) | `cols-6-6`, `cols-4-4-4`, `cols-3-3-3-3` |
| `layout-wide-narrow`, `layout-narrow-wide` | 〃 | `cols-7-5`, `cols-5-7` |
| `layout-<fraction>-<fraction>[-…]` (other distributions) | 〃 | e.g. `layout-half-five-twelfths` = `cols-6-5`, `layout-third-third` = `cols-4-4`, `layout-quarter-quarter-five-twelfths` = `cols-3-3-5` |
| `layout-medium-<distribution>` | 768–1023 px | e.g. `layout-medium-halves` = `md-6-6`, `layout-medium-full-half` = `md-12-6`, `layout-medium-seven-twelfths-seven-twelfths-five-twelfths` = `md-7-7-5` |
| `image-<D>-medium-<M>-small-<S>` | leading image width in text cells: D from 1024 px, M medium, S small | e.g. `image-quarter-medium-sixth-small-quarter` = `img-3-2-3` |
| `inset-<cell>-start` / `-end` / `-both` | from 1024 px | e.g. `inset-second-start` = `inset-2-start` |

**Carousel** (slides per view small / medium / large / xlarge)

| Name | Per view | Was |
|---|---|---|
| `slides-single` | 1 / 1 / 1 / 1 | `slides-1-1-1-1` |
| `slides-pairs` | 1 / 2 / 2 / 2 | `slides-1-2-2-2` |
| `slides-triples` | 1 / 2 / 3 / 3 | `slides-1-2-3-3` |
| `slides-quads` | 1 / 2 / 3 / 4 | `slides-1-2-3-4` |
| `slides-pairs-from-large` | 1 / 1 / 2 / 2 | `slides-1-1-2-2` |
| `slides-triples-from-large` | 1 / 1 / 3 / 3 | `slides-1-1-3-3` |
| `slides-quads-from-large` | 1 / 1 / 4 / 4 | `slides-1-1-4-4` |
| `slides-small-<count>-medium-<count>-large-<count>-xlarge-<count>` | other combinations | e.g. `slides-small-one-medium-three-large-four-xlarge-five` = `slides-1-3-4-5` |

**Icon Teaser**

| Name | Applies | Was |
|---|---|---|
| `items-small-<count>-medium-<count>-large-<count>` | items per row: below 768 / 768–1023 / from 1024 px | e.g. `items-small-one-medium-three-large-three` = `cols-1-3-3` |
| `offsets-<fraction or none>[-…]` | offset of each item from 1024 px (with `offsets-md` from 768 px) | e.g. `offsets-twelfth-sixth` = `offsets-1-2`, `offsets-none-third` = `offsets-0-4` |
| `span-medium-<fraction>` | item width 768–1023 px | e.g. `span-medium-two-thirds` = `span-md-8` |

**Model Offer**: `slides-three` (three cards per view from 1280 px; default two) = `slides-3`.

**Text Media Teaser** (media / text widths where they sit side by side, and from 1920 px):

| Name | Media / text | From 1920 px | Was |
|---|---|---|---|
| `widths-equal` | five-twelfths / five-twelfths | third / third | `col-5-5` |
| `media-wider` | half / third | five-twelfths / quarter | `col-6-4` |
| `text-wider` | third / half | quarter / five-twelfths | `col-4-6` |

## Checks

- `npm test` — vocabulary round-trips every style combination of the DA snapshot, guards docs,
  block metadata, the showcase generator and the importer.
- `node tools/semantic-styles/migrate.mjs --check <da-export>` — lists remaining deprecated names,
  conflicts and unsupported markup (e.g. a style cell with formatting) in a DA source export (exit
  code 1 if any).
- `node tools/semantic-styles/migrate.mjs --verify <da-export> <migrated> --exclude <file>` — the
  migrated export covers the complete inventory except the reviewed exclusions, every byte outside
  the style spans is unchanged and every element gets the same implementation classes (see
  `tools/semantic-styles/README.md`).
