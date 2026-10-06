# icon-teaser

Grid of items with a BMW icon (or image), title, text and link.

## Authoring (Document Authoring)

One row per item: cell 1 icon (`:icon_name:` or an image), cell 2 content.

## Options

`items-small-<count>-medium-<count>-large-<count>`, `offsets-<fraction>[-<fraction>…]`, `offsets-md`, `span-medium-<fraction>`, `left`, `list`, `size-xxs`, `size-xs`, `size-s`, `size-m`, `size-ml`, `size-xl`, `size-xxl`, `body-1`

## Layout

| Option | Breakpoints | Meaning |
|---|---|---|
| `items-small-<count>-medium-<count>-large-<count>` | small below 768 px, medium 768–1023 px, large from 1024 px | items per row (counts `one` … `nine`; default one, two, three), e.g. `items-small-one-medium-three-large-three` |
| `offsets-<fraction>-<fraction>…` | from 1024 px (also 768–1023 px with `offsets-md`) | grid offset before each item, in order; `none` for no offset, e.g. `offsets-twelfth-sixth`, `offsets-none-third` |
| `span-medium-<fraction>` | 768–1023 px | each item spans that fraction of the grid, e.g. `span-medium-two-thirds` (with `items-small-one-medium-one-large-three`: one centred row per item) |

Fractions and the numeric options they replace: [section and block styles](../../docs/authoring/section-and-block-styles.md).
