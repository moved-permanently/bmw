# Section and block styles (authoring vocabulary)

Authors describe **intent** — how much space, how wide, which background — instead of internal
numbers. The site expands every name to the implementation classes the CSS and block code use
(`scripts/bmw-style-names.js`), so a name looks exactly like the numeric utility it replaces, at
every breakpoint.

| Kind of name | Origin |
|---|---|
| `background-secondary`, `background-dark` | **BMW** (`style-container--secondary` with `--surface-background-secondary`, `style-container--background-dark`) |
| `small` / `medium` / `large` in width names | **BMW** grid breakpoints (`aem-GridColumn--small/medium/large--N`) |
| `center`, `body-2`, `h1-headline-2/3`, `h1-subsection-1/2` | **BMW** (`style-container--center`, `style-text--body-2`, `style-title--headline-N`, `--subsection-N`) |
| Spacing families (`tight`, `related`, `regular`, `separated`, `feature`) and their sizes | **project-defined** (BMW numbers its spacing steps, `style-common--cmp-spacing-*-N`, and has no names for them) |
| Width fractions (`half`, `two-thirds`, …) | **project-defined** (fractions of BMW's 12-column grid) |

The numeric utilities (`spacing-top-16`, `content-8-center`, `cols-5`, `width-lg-8`, …) are
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

**Kept as they are** (not utilities): typography roles (`body-1/2`, `title-headline-1`,
`sub-headline-2/3`, `h2`); aspect ratios (`ratio-W-H`, `mobile-ratio-W-H`, `video-ratio-W-H`,
Model Card `ratio-3x2`); layout distributions (Columns `cols-7-5`, `md-6-6`, `img-…`, `inset-…`,
Carousel `slides-a-b-c-d`, Icon Teaser `cols-m-t-d`, `offsets-…`); data parameters (Content Table
`highlight-N`, `center-N`, `end-N`, Accordion `expand-N`, Embed `height-N`).

## Checks

- `npm test` — vocabulary round-trips every style combination of the DA snapshot, guards docs,
  block metadata, the showcase generator and the importer.
- `node tools/semantic-styles/migrate.mjs --check <da-export>` — lists remaining deprecated names in
  a DA source export (exit code 1 if any).
