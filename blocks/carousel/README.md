# carousel

Slider of teaser slides (image or video, text, CTA), image galleries or offer cards; swipe / drag, arrows from 1024 px, dots.

## Authoring (Document Authoring)

One row per slide: cell 1 media (image links or poster image + video links), cell 2 content.

## Options

`slides-<preset>`, `slides-small-<count>-medium-<count>-large-<count>-xlarge-<count>`, `no-arrows`, `no-pagination`, `cards`, `large-titles`, `small-titles`, `body-2`, `autoplay`, `hover-play`, `loop`, `controls`, `no-play-button`, `ratio-W-H`, `mobile-ratio-W-H`

## Slides per view

Breakpoints: small below 768 px, medium 768–1023 px, large 1024–1279 px, xlarge from 1280 px. Without an option: one, one, three, four.

| Option | small | medium | large | xlarge |
|---|---|---|---|---|
| `slides-single` | 1 | 1 | 1 | 1 |
| `slides-pairs` | 1 | 2 | 2 | 2 |
| `slides-triples` | 1 | 2 | 3 | 3 |
| `slides-quads` | 1 | 2 | 3 | 4 |
| `slides-pairs-from-large` | 1 | 1 | 2 | 2 |
| `slides-triples-from-large` | 1 | 1 | 3 | 3 |
| `slides-quads-from-large` | 1 | 1 | 4 | 4 |

Other combinations name every breakpoint (counts `one` … `nine`), e.g. `slides-small-one-medium-three-large-four-xlarge-five`. With fewer slides than slides per view the slides share the full width.

The numeric options they replace: [section and block styles](../../docs/authoring/section-and-block-styles.md).
