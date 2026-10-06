/**
 * Author-facing style vocabulary for section metadata and block options.
 *
 * Authors write semantic names (docs/authoring/section-and-block-styles.md); the runtime expands
 * them to the implementation classes the CSS / block code use: BMW's numeric spacing steps
 * (source style-common--cmp-spacing-{top,bottom}-N, here spacing-{top,bottom}-N with
 * --bmw-spacing-N) and the 12-column grid spans (source aem-GridColumn--{small,medium,large}--N,
 * here content-[sm|md|lg-]N…, width-[md|lg-]N, cols-N). Legacy names stay accepted.
 * No DOM globals: also used by the DA migration (tools/semantic-styles) and the importer.
 *
 * Spacing families, grid fractions, layout names and background-secondary / background-dark are
 * project-defined (background names derived from BMW's style-container--secondary /
 * --background-dark); small / medium / large are the BMW grid breakpoint names.
 */

/** Spacing sizes (project-defined families) -> internal BMW spacing step. */
export const SPACING_SIZES = {
  'tight-xxs': 1,
  'tight-xs': 2,
  'tight-s': 3,
  'tight-m': 4,
  'tight-l': 5,
  'tight-xl': 6,
  'related-s': 8,
  'related-m': 10,
  'related-l': 12,
  regular: 16,
  'separated-s': 20,
  'separated-l': 24,
  'feature-s': 32,
  'feature-m': 40,
  'feature-l': 60,
};

/** Width fractions of the 12-column grid -> span in columns. */
export const WIDTH_FRACTIONS = {
  twelfth: 1,
  sixth: 2,
  quarter: 3,
  third: 4,
  'five-twelfths': 5,
  half: 6,
  'seven-twelfths': 7,
  'two-thirds': 8,
  'three-quarters': 9,
  'five-sixths': 10,
  'eleven-twelfths': 11,
  full: 12,
};

/** BMW grid breakpoint names -> internal breakpoint prefix. */
const BREAKPOINTS = { small: 'sm', medium: 'md', large: 'lg' };
/**
 * Section aliases -> implementation class: project-defined names derived from BMW's
 * style-container--secondary (--surface-background-secondary) / style-container--background-dark.
 */
const SECTION_ALIASES = { 'background-secondary': 'grey', 'background-dark': 'dark' };

/** Own (not inherited) property of a lookup table, else undefined. */
const own = (table, key) => (Object.hasOwn(table, key) ? table[key] : undefined);
const invert = (obj) => Object.fromEntries(Object.entries(obj).map(([k, v]) => [v, k]));
const SIZE_OF = invert(SPACING_SIZES);
const FRACTION_OF = invert(WIDTH_FRACTIONS);
const BP_NAME = invert(BREAKPOINTS);
const LEGACY_ALIAS = invert(SECTION_ALIASES);
/** Longest first: names contain hyphens ("five-twelfths" before "twelfth"). */
const alternation = (obj) => Object.keys(obj).sort((a, b) => b.length - a.length).join('|');
const SIZES = alternation(SPACING_SIZES);
const FRACTIONS = alternation(WIDTH_FRACTIONS);
const SIDE = { above: 'top', below: 'bottom' };
const SIDE_NAME = invert(SIDE);
/** Counts (slides / items per view) and ordinals (cell positions). */
const COUNTS = {
  one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9,
};
const ORDINALS = {
  first: 1,
  second: 2,
  third: 3,
  fourth: 4,
  fifth: 5,
  sixth: 6,
  seventh: 7,
  eighth: 8,
  ninth: 9,
  tenth: 10,
  eleventh: 11,
  twelfth: 12,
};
const OFFSETS = { none: 0, ...WIDTH_FRACTIONS };
const COUNT = alternation(COUNTS);
const ORDINAL = alternation(ORDINALS);

const SPACE_RE = new RegExp(`^space-(?:(above|below)-)?(${SIZES})$`);
const LEGACY_SPACING_RE = /^spacing-(top|bottom)-(\d+)$/;
const CONTENT_RE = new RegExp(`^content-(?:(small|medium|large)-)?(${FRACTIONS})(?:-(centered)|-offset-(${FRACTIONS}))?$`);
const LEGACY_CONTENT_RE = /^content-(?:(lg|md|sm)-)?(\d+)(?:-(center)|-offset-(\d+))?$/;

/** "half-five-twelfths" -> [6, 5] (words of `table` joined by "-"), or null. */
function parseList(text, table) {
  const word = new RegExp(`(${alternation(table)})(?:-|$)`, 'y');
  const values = [];
  let m = word.exec(text);
  while (m) {
    values.push(table[m[1]]);
    if (word.lastIndex === text.length) return text.endsWith('-') ? null : values;
    m = word.exec(text);
  }
  return null;
}

/** [6, 5] -> "half-five-twelfths", or null when a value has no name. */
function nameList(values, table) {
  const names = invert(table);
  const words = values.map((v) => own(names, v));
  return words.every(Boolean) ? words.join('-') : null;
}

/**
 * Block options with their own semantic names, per block. Each rule:
 *   expand(semantic token) -> implementation option, or null (not a name of this rule);
 *   legacy: RegExp of the implementation option; name(legacy token) -> semantic name, or null when
 *   the value has none (left unchanged with an exception); slot(legacy token): the property the
 *   option sets (two options for one slot conflict).
 */
function rule(legacy, expand, name, slot) {
  return {
    legacy, expand, name, slot: typeof slot === 'string' ? () => slot : slot,
  };
}
const match = (re, fn) => (t) => {
  const m = t.match(re);
  return m ? fn(m) : null;
};
const sized = (prefix, legacy) => rule(
  new RegExp(`^${legacy}-(top|bottom)-(\\d+)$`),
  match(new RegExp(`^${prefix}-(above|below)-(${SIZES})$`), (m) => `${legacy}-${SIDE[m[1]]}-${SPACING_SIZES[m[2]]}`),
  match(new RegExp(`^${legacy}-(top|bottom)-(\\d+)$`), (m) => own(SIZE_OF, m[2]) && `${prefix}-${SIDE_NAME[m[1]]}-${SIZE_OF[m[2]]}`),
  (t) => `${prefix}-${t.match(/-(top|bottom)-/)[1]}`,
);
const widths = rule(
  /^width-(?:(lg|md)-)?(\d+)$/,
  match(new RegExp(`^width-(?:(medium|large)-)?(${FRACTIONS})$`), (m) => `width-${m[1] ? `${BREAKPOINTS[m[1]]}-` : ''}${WIDTH_FRACTIONS[m[2]]}`),
  match(/^width-(?:(lg|md)-)?(\d+)$/, (m) => own(FRACTION_OF, m[2]) && `width-${m[1] ? `${BP_NAME[m[1]]}-` : ''}${FRACTION_OF[m[2]]}`),
  (t) => `width-${t.match(/^width-(?:(lg|md)-)?/)[1] || 'xl'}`,
);
/** Named values of one option (presets): semantic name <-> implementation option. */
function presets(legacy, table, slot) {
  const names = invert(table);
  return rule(legacy, (t) => own(table, t) || null, (t) => own(names, t) || null, slot);
}

/** Column distributions with a name of their own (otherwise the fractions are listed). */
const DISTRIBUTIONS = {
  halves: '6-6', thirds: '4-4-4', quarters: '3-3-3-3', 'wide-narrow': '7-5', 'narrow-wide': '5-7',
};
const DISTRIBUTION_OF = invert(DISTRIBUTIONS);
/** layout[-medium]-<distribution | fraction-fraction[-…]> <-> <legacy>-A-B[-…] (2+ cells). */
function distribution(prefix, legacy, slot) {
  const legacyRe = new RegExp(`^${legacy}-(\\d+(?:-\\d+)+)$`);
  const expand = (t) => {
    if (!t.startsWith(`${prefix}-`)) return null;
    const rest = t.slice(prefix.length + 1);
    const preset = own(DISTRIBUTIONS, rest);
    if (preset) return `${legacy}-${preset}`;
    const spans = parseList(rest, WIDTH_FRACTIONS);
    if (!spans || spans.length < 2 || own(DISTRIBUTION_OF, spans.join('-'))) return null;
    return `${legacy}-${spans.join('-')}`;
  };
  const name = match(legacyRe, (m) => {
    const preset = own(DISTRIBUTION_OF, m[1]);
    const list = preset || nameList(m[1].split('-').map(Number), WIDTH_FRACTIONS);
    return list && `${prefix}-${list}`;
  });
  return rule(legacyRe, expand, name, slot);
}

/** Carousel slides per view: small (< 768) / medium (768-1023) / large (1024-1279) / xlarge. */
const SLIDE_PRESETS = {
  'slides-single': '1-1-1-1',
  'slides-pairs': '1-2-2-2',
  'slides-triples': '1-2-3-3',
  'slides-quads': '1-2-3-4',
  'slides-pairs-from-large': '1-1-2-2',
  'slides-triples-from-large': '1-1-3-3',
  'slides-quads-from-large': '1-1-4-4',
};
const SLIDE_PRESET_OF = invert(SLIDE_PRESETS);
const SLIDES_RE = new RegExp(`^slides-small-(${COUNT})-medium-(${COUNT})-large-(${COUNT})-xlarge-(${COUNT})$`);
const carouselSlides = rule(
  /^slides-(\d)-(\d)-(\d)-(\d)$/,
  (t) => {
    const preset = own(SLIDE_PRESETS, t);
    if (preset) return `slides-${preset}`;
    const m = t.match(SLIDES_RE);
    const counts = m && m.slice(1, 5).map((c) => COUNTS[c]).join('-');
    return m && !own(SLIDE_PRESET_OF, counts) ? `slides-${counts}` : null;
  },
  match(/^slides-(\d-\d-\d-\d)$/, (m) => {
    const preset = own(SLIDE_PRESET_OF, m[1]);
    if (preset) return preset;
    const [s, md, lg, xl] = m[1].split('-').map((c) => own(invert(COUNTS), c));
    return s && md && lg && xl && `slides-small-${s}-medium-${md}-large-${lg}-xlarge-${xl}`;
  }),
  'slides',
);

const BLOCK_OPTIONS = {
  accordion: [widths],
  'content-table': [widths],
  'hero-teaser': [
    rule(
      /^cols-(\d+)$/,
      match(new RegExp(`^text-width-(${FRACTIONS})$`), (m) => `cols-${WIDTH_FRACTIONS[m[1]]}`),
      match(/^cols-(\d+)$/, (m) => own(FRACTION_OF, m[1]) && `text-width-${FRACTION_OF[m[1]]}`),
      'text-width',
    ),
    sized('text', 'text'),
    sized('cta', 'cta'),
    rule(
      /^sub-top-(\d+)$/,
      match(new RegExp(`^subline-above-(${SIZES})$`), (m) => `sub-top-${SPACING_SIZES[m[1]]}`),
      match(/^sub-top-(\d+)$/, (m) => own(SIZE_OF, m[1]) && `subline-above-${SIZE_OF[m[1]]}`),
      'subline-above',
    ),
  ],
  columns: [
    sized('video-space', 'video-spacing'),
    distribution('layout', 'cols', 'layout'),
    distribution('layout-medium', 'md', 'layout-medium'),
    rule(
      /^img-(\d+)-(\d+)-(\d+)$/,
      match(new RegExp(`^image-(${FRACTIONS})-medium-(${FRACTIONS})-small-(${FRACTIONS})$`), (m) => `img-${m.slice(1, 4).map((f) => WIDTH_FRACTIONS[f]).join('-')}`),
      match(/^img-(\d+)-(\d+)-(\d+)$/, (m) => {
        const [d, md, sm] = m.slice(1, 4).map((n) => own(FRACTION_OF, n));
        return d && md && sm && `image-${d}-medium-${md}-small-${sm}`;
      }),
      'image',
    ),
    rule(
      /^inset-(\d+)-(start|end|both)$/,
      match(new RegExp(`^inset-(${ORDINAL})-(start|end|both)$`), (m) => `inset-${ORDINALS[m[1]]}-${m[2]}`),
      match(/^inset-(\d+)-(start|end|both)$/, (m) => own(invert(ORDINALS), m[1]) && `inset-${invert(ORDINALS)[m[1]]}-${m[2]}`),
      (t) => `inset-${Number(t.split('-')[1])}`,
    ),
  ],
  carousel: [carouselSlides],
  'icon-teaser': [
    rule(
      /^cols-(\d)-(\d)-(\d)$/,
      match(new RegExp(`^items-small-(${COUNT})-medium-(${COUNT})-large-(${COUNT})$`), (m) => `cols-${m.slice(1, 4).map((c) => COUNTS[c]).join('-')}`),
      match(/^cols-(\d)-(\d)-(\d)$/, (m) => {
        const [s, md, lg] = m.slice(1, 4).map((c) => own(invert(COUNTS), c));
        return s && md && lg && `items-small-${s}-medium-${md}-large-${lg}`;
      }),
      'items',
    ),
    rule(
      /^offsets-(\d+(?:-\d+)*)$/,
      (t) => {
        const values = t.startsWith('offsets-') && parseList(t.slice(8), OFFSETS);
        return values ? `offsets-${values.join('-')}` : null;
      },
      match(/^offsets-(\d+(?:-\d+)*)$/, (m) => {
        const list = nameList(m[1].split('-').map(Number), OFFSETS);
        return list && `offsets-${list}`;
      }),
      'offsets',
    ),
    rule(
      /^span-md-(\d+)$/,
      match(new RegExp(`^span-medium-(${FRACTIONS})$`), (m) => `span-md-${WIDTH_FRACTIONS[m[1]]}`),
      match(/^span-md-(\d+)$/, (m) => own(FRACTION_OF, m[1]) && `span-medium-${FRACTION_OF[m[1]]}`),
      'span-medium',
    ),
  ],
  'model-offer': [presets(/^slides-\d+$/, { 'slides-three': 'slides-3' }, 'slides')],
  'text-media-teaser': [presets(/^col-\d+-\d+$/, {
    'widths-equal': 'col-5-5', 'media-wider': 'col-6-4', 'text-wider': 'col-4-6',
  }, 'widths')],
};

const rulesOf = (block) => (block ? own(BLOCK_OPTIONS, block) || [] : []);

/** Slot of a block-specific option (semantic or legacy form), or null. */
function optionSlot(rules, token) {
  let legacy = token;
  let found = rules.find((r) => r.legacy.test(token));
  if (!found) {
    found = rules.find((r) => r.expand(token));
    legacy = found && found.expand(token);
  }
  return found ? found.slot(legacy) : null;
}

/* ---------------------------------------------------------------- expansion (runtime) */

function expandSpace(token) {
  const m = token.match(SPACE_RE);
  if (!m) return null;
  const step = SPACING_SIZES[m[2]];
  return m[1] ? [`spacing-${SIDE[m[1]]}-${step}`] : [`spacing-top-${step}`, `spacing-bottom-${step}`];
}

function expandContent(token) {
  const m = token.match(CONTENT_RE);
  if (!m) return null;
  const bp = m[1] ? `${BREAKPOINTS[m[1]]}-` : '';
  let suffix = '';
  if (m[3]) suffix = '-center';
  else if (m[4]) suffix = `-offset-${WIDTH_FRACTIONS[m[4]]}`;
  return [`content-${bp}${WIDTH_FRACTIONS[m[2]]}${suffix}`];
}

/**
 * Section styles (class names) -> implementation classes; other / legacy names unchanged.
 * @param {string[]} tokens
 * @returns {string[]}
 */
export function expandSectionStyles(tokens) {
  return tokens.flatMap((t) => expandSpace(t) || expandContent(t)
    || [own(SECTION_ALIASES, t) || t]);
}

/**
 * Block options (class names) -> implementation options; other / legacy names unchanged.
 * @param {string} block block name
 * @param {string[]} tokens
 * @returns {string[]}
 */
export function expandBlockOptions(block, tokens) {
  const rules = rulesOf(block);
  return tokens.flatMap((t) => {
    const space = expandSpace(t);
    if (space) return space;
    const expanded = rules.map((r) => r.expand(t)).find(Boolean);
    return [expanded || t];
  });
}

/* ---------------------------------------------------------- conversion (migration, generators) */

/**
 * Converts legacy spacing in a token list (merging equal top/bottom into one name). Returns null
 * and records an exception when one side gets more than one value.
 */
function convertSpacing(tokens, exceptions, label) {
  const sides = { top: [], bottom: [] };
  tokens.forEach((t, i) => {
    const legacy = t.match(LEGACY_SPACING_RE);
    if (legacy) sides[legacy[1]].push({ i, step: Number(legacy[2]), legacy: true });
    const space = t.match(SPACE_RE);
    if (space) {
      (space[1] ? [SIDE[space[1]]] : ['top', 'bottom'])
        .forEach((side) => sides[side].push({ i, step: SPACING_SIZES[space[2]], legacy: false }));
    }
  });
  const conflict = Object.entries(sides).find(([, list]) => list.length > 1);
  if (conflict) {
    exceptions.push(`${label}: conflicting space-${SIDE_NAME[conflict[0]]} (${conflict[1].map(({ i }) => tokens[i]).join(', ')})`);
    return null;
  }
  const missing = [...sides.top, ...sides.bottom].find((s) => s.legacy && !own(SIZE_OF, s.step));
  if (missing) {
    exceptions.push(`${label}: no semantic size for spacing step ${missing.step} (${tokens[missing.i]})`);
    return null;
  }
  const out = tokens.map((t) => [t]);
  const [top] = sides.top;
  const [bottom] = sides.bottom;
  if (top && bottom && top.legacy && bottom.legacy && top.step === bottom.step) {
    out[Math.min(top.i, bottom.i)] = [`space-${SIZE_OF[top.step]}`];
    out[Math.max(top.i, bottom.i)] = [];
  } else {
    [[top, 'above'], [bottom, 'below']].forEach(([s, side]) => {
      if (s && s.legacy) out[s.i] = [`space-${side}-${SIZE_OF[s.step]}`];
    });
  }
  return out.flat();
}

function legacyContentToSemantic(token) {
  const m = token.match(LEGACY_CONTENT_RE);
  if (!m || !own(FRACTION_OF, m[2]) || (m[4] && !own(FRACTION_OF, m[4]))) return null;
  const bp = m[1] ? `${BP_NAME[m[1]]}-` : '';
  let suffix = '';
  if (m[3]) suffix = '-centered';
  else if (m[4]) suffix = `-offset-${FRACTION_OF[m[4]]}`;
  return `content-${bp}${FRACTION_OF[m[2]]}${suffix}`;
}

/** Slot of a (legacy or semantic) content width token, e.g. "content-xl" / "content-lg". */
function contentSlot(token) {
  const legacy = token.match(LEGACY_CONTENT_RE);
  if (legacy) return `content-${legacy[1] || 'xl'}`;
  const semantic = token.match(CONTENT_RE);
  return semantic ? `content-${semantic[1] ? BREAKPOINTS[semantic[1]] : 'xl'}` : null;
}

function conflictingSlot(tokens, slotOf) {
  const seen = new Set();
  return tokens.map((t) => [slotOf(t), t]).filter(([s]) => s).find(([s]) => {
    if (seen.has(s)) return true;
    seen.add(s);
    return false;
  });
}

/**
 * Legacy section styles -> semantic names. Unchanged (with an exception) on conflicts.
 * @param {string[]} tokens
 * @returns {{styles: string[], exceptions: string[]}}
 */
export function toSemanticSectionStyles(tokens) {
  const exceptions = [];
  const spaced = convertSpacing(tokens, exceptions, 'section');
  const clash = conflictingSlot(tokens, contentSlot);
  if (clash) exceptions.push(`section: conflicting ${clash[0]} (${tokens.filter((t) => contentSlot(t) === clash[0]).join(', ')})`);
  if (!spaced || clash) return { styles: [...tokens], exceptions };
  const styles = spaced.map((t) => legacyContentToSemantic(t) || own(LEGACY_ALIAS, t) || t);
  return { styles, exceptions };
}

/**
 * Legacy block options -> semantic names. Unchanged (with an exception) on conflicts.
 * @param {string} block block name
 * @param {string[]} tokens
 * @returns {{options: string[], exceptions: string[]}}
 */
export function toSemanticBlockOptions(block, tokens) {
  const exceptions = [];
  const rules = rulesOf(block);
  const spaced = convertSpacing(tokens, exceptions, block);
  const clash = conflictingSlot(tokens, (t) => optionSlot(rules, t));
  if (clash) exceptions.push(`${block}: conflicting ${clash[0]} (${tokens.filter((t) => optionSlot(rules, t) === clash[0]).join(', ')})`);
  const nameless = tokens.filter((t) => rules.some((r) => r.legacy.test(t) && !r.name(t)));
  if (nameless.length) exceptions.push(`${block}: no semantic name for ${nameless.join(', ')}`);
  if (!spaced || clash || nameless.length) return { options: [...tokens], exceptions };
  const options = spaced.map((t) => {
    const found = rules.find((r) => r.legacy.test(t));
    return found ? found.name(t) : t;
  });
  return { options, exceptions };
}

/**
 * Legacy author-facing utility names in a token list (section styles, or block options when a
 * block name is given). Typography roles, aspect ratios and data parameters are not reported.
 * @param {string[]} tokens
 * @param {string} [block]
 * @returns {string[]}
 */
export function findDeprecated(tokens, block) {
  const rules = rulesOf(block);
  return tokens.filter((t) => LEGACY_SPACING_RE.test(t)
    || (!block && (LEGACY_CONTENT_RE.test(t) || Boolean(own(LEGACY_ALIAS, t))))
    || rules.some((r) => r.legacy.test(t)));
}

/**
 * Runtime: replaces the semantic names on sections (rendered section metadata arrives as classes)
 * and blocks by the implementation classes, before section metadata and blocks are decorated.
 * @param {Element} main
 */
export function applyStyleNames(main) {
  const replace = (el, expand) => {
    const classes = [...el.classList];
    const expanded = expand(classes);
    if (expanded.join(' ') !== classes.join(' ')) el.className = expanded.join(' ');
  };
  main.querySelectorAll(':scope > .section').forEach((section) => replace(section, expandSectionStyles));
  main.querySelectorAll('.block[data-block-name]').forEach((block) => {
    replace(block, (classes) => expandBlockOptions(block.dataset.blockName, classes));
  });
}
