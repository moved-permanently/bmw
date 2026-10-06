# columns

Side-by-side cells of the BMW 12-column grid (text, images, an embedded video or download); the cells stack on phones.

## Authoring (Document Authoring)

One row, one cell per column: text, image links (desktop, mobile[, tablet] crops of one image), poster image + video links (an embedded Video block), or `:download:` links (an embedded Download block).

## Options

`layout-<distribution>`, `layout-medium-<distribution>`, `stack-md`, `image-<fraction>-medium-<fraction>-small-<fraction>`, `inset-<cell>-start`, `inset-<cell>-end`, `inset-<cell>-both`, `middle`, `reverse`, `title-headline-N`, `title-subsection-N`, `video-<option>` (e.g. `video-loop`, `video-controls`, `video-ratio-W-H`), `video-space-above-<size>`, `download-outline`

## Layout

| Option | Breakpoints | Meaning |
|---|---|---|
| `layout-<distribution>` | from 768 px (and 768–1023 px unless `layout-medium-…` or `stack-md` is given) | width of each cell in the 12-column grid; cells stack below 768 px |
| `layout-medium-<distribution>` | 768–1023 px | cell widths on tablets |
| `stack-md` | 768–1023 px | cells stay stacked until 1024 px |
| `image-<D>-medium-<M>-small-<S>` | D from 1024 px, M 768–1023 px, S below 768 px | width of the leading image of text cells, as a fraction of the cell |
| `inset-<cell>-start` / `-end` / `-both` | from 1024 px | the `first`, `second`, … cell gets the grid's additional side spacing at its start, end or both sides |

Distributions: `layout-halves`, `layout-thirds`, `layout-quarters`, `layout-wide-narrow` (seven-twelfths + five-twelfths), `layout-narrow-wide` (five-twelfths + seven-twelfths); otherwise the fractions of the cells joined by `-`, e.g. `layout-half-five-twelfths`, `layout-third-third`, `layout-quarter-quarter-five-twelfths`, `layout-medium-full-half`, `layout-medium-half-half-half`. Image example: `image-quarter-medium-sixth-small-quarter`. Inset example: `inset-second-start`.

Sizes, fractions and the numeric options they replace: [section and block styles](../../docs/authoring/section-and-block-styles.md).
