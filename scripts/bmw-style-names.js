/**
 * Author-facing style vocabulary for section metadata and block options.
 *
 * Authors write semantic names (docs/authoring/section-and-block-styles.md); the runtime expands
 * them to the implementation classes the CSS / block code use: BMW's numeric spacing steps
 * (source style-common--cmp-spacing-{top,bottom}-N, here spacing-{top,bottom}-N with
 * --bmw-spacing-N) and the 12-column grid spans (source aem-GridColumn--{small,medium,large}--N,
 * here content-[sm|md|lg-]N…, width-[md|lg-]N, cols-N). Legacy names stay accepted.
 * No DOM access: also used by the DA migration (tools/semantic-styles) and the importer.
 *
 * Spacing families and grid fractions are project-defined (not BMW terminology);
 * background-secondary / background-dark follow BMW's style-container--secondary /
 * --background-dark, small / medium / large the BMW grid breakpoint names.
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
/** Section aliases (BMW style-container--secondary / --background-dark) -> implementation class. */
const SECTION_ALIASES = { 'background-secondary': 'grey', 'background-dark': 'dark' };

const invert = (obj) => Object.fromEntries(Object.entries(obj).map(([k, v]) => [v, k]));
const SIZE_OF = invert(SPACING_SIZES);
const FRACTION_OF = invert(WIDTH_FRACTIONS);
const BP_NAME = invert(BREAKPOINTS);
const LEGACY_ALIAS = invert(SECTION_ALIASES);
const SIZES = Object.keys(SPACING_SIZES).join('|');
const FRACTIONS = Object.keys(WIDTH_FRACTIONS).join('|');
const SIDE = { above: 'top', below: 'bottom' };
const SIDE_NAME = invert(SIDE);

const SPACE_RE = new RegExp(`^space-(?:(above|below)-)?(${SIZES})$`);
const LEGACY_SPACING_RE = /^spacing-(top|bottom)-(\d+)$/;
const CONTENT_RE = new RegExp(`^content-(?:(small|medium|large)-)?(${FRACTIONS})(?:-(centered)|-offset-(${FRACTIONS}))?$`);
const LEGACY_CONTENT_RE = /^content-(?:(lg|md|sm)-)?(\d+)(?:-(center)|-offset-(\d+))?$/;

/**
 * Block options with their own semantic names, per block. Each rule: semantic / legacy RegExp,
 * conversions between the two, and the option "slot" a token fills (to detect conflicts).
 */
const sized = (prefix, legacy) => ({
  semantic: new RegExp(`^${prefix}-(above|below)-(${SIZES})$`),
  toLegacy: (m) => `${legacy}-${SIDE[m[1]]}-${SPACING_SIZES[m[2]]}`,
  semanticSlot: (m) => `${prefix}-${SIDE[m[1]]}`,
  legacy: new RegExp(`^${legacy}-(top|bottom)-(\\d+)$`),
  toSemantic: (m) => SIZE_OF[m[2]] && `${prefix}-${SIDE_NAME[m[1]]}-${SIZE_OF[m[2]]}`,
  legacySlot: (m) => `${prefix}-${m[1]}`,
});
const widths = {
  semantic: new RegExp(`^width-(?:(medium|large)-)?(${FRACTIONS})$`),
  toLegacy: (m) => `width-${m[1] ? `${BREAKPOINTS[m[1]]}-` : ''}${WIDTH_FRACTIONS[m[2]]}`,
  semanticSlot: (m) => `width-${m[1] ? BREAKPOINTS[m[1]] : 'xl'}`,
  legacy: /^width-(?:(lg|md)-)?(\d+)$/,
  toSemantic: (m) => FRACTION_OF[m[2]] && `width-${m[1] ? `${BP_NAME[m[1]]}-` : ''}${FRACTION_OF[m[2]]}`,
  legacySlot: (m) => `width-${m[1] || 'xl'}`,
};
const single = (semantic, toLegacy, legacy, toSemantic, slot) => ({
  semantic, toLegacy, semanticSlot: () => slot, legacy, toSemantic, legacySlot: () => slot,
});
const BLOCK_OPTIONS = {
  accordion: [widths],
  'content-table': [widths],
  'hero-teaser': [
    single(
      new RegExp(`^text-width-(${FRACTIONS})$`),
      (m) => `cols-${WIDTH_FRACTIONS[m[1]]}`,
      /^cols-(\d+)$/,
      (m) => FRACTION_OF[m[1]] && `text-width-${FRACTION_OF[m[1]]}`,
      'text-width',
    ),
    sized('text', 'text'),
    sized('cta', 'cta'),
    single(
      new RegExp(`^subline-above-(${SIZES})$`),
      (m) => `sub-top-${SPACING_SIZES[m[1]]}`,
      /^sub-top-(\d+)$/,
      (m) => SIZE_OF[m[1]] && `subline-above-${SIZE_OF[m[1]]}`,
      'subline-above',
    ),
  ],
  columns: [sized('video-space', 'video-spacing')],
};

/** Slot of a block-specific option (semantic or legacy form), or null. */
function optionSlot(rules, token) {
  const rule = rules.find((r) => r.semantic.test(token) || r.legacy.test(token));
  if (!rule) return null;
  return rule.semantic.test(token)
    ? rule.semanticSlot(token.match(rule.semantic))
    : rule.legacySlot(token.match(rule.legacy));
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
    || (SECTION_ALIASES[t] ? [SECTION_ALIASES[t]] : [t]));
}

/**
 * Block options (class names) -> implementation options; other / legacy names unchanged.
 * @param {string} block block name
 * @param {string[]} tokens
 * @returns {string[]}
 */
export function expandBlockOptions(block, tokens) {
  const own = BLOCK_OPTIONS[block] || [];
  return tokens.flatMap((t) => {
    const space = expandSpace(t);
    if (space) return space;
    const rule = own.find((r) => r.semantic.test(t));
    return rule ? [rule.toLegacy(t.match(rule.semantic))] : [t];
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
  const missing = [...sides.top, ...sides.bottom].find((s) => s.legacy && !SIZE_OF[s.step]);
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
  if (!m || !FRACTION_OF[m[2]] || (m[4] && !FRACTION_OF[m[4]])) return null;
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
  const seen = {};
  return tokens.map((t) => [slotOf(t), t]).filter(([s]) => s).find(([s, t]) => {
    if (seen[s]) return true;
    seen[s] = t;
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
  const styles = spaced.map((t) => legacyContentToSemantic(t) || LEGACY_ALIAS[t] || t);
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
  const own = BLOCK_OPTIONS[block] || [];
  const spaced = convertSpacing(tokens, exceptions, block);
  const clash = conflictingSlot(tokens, (t) => optionSlot(own, t));
  if (clash) exceptions.push(`${block}: conflicting ${clash[0]}`);
  if (!spaced || clash) return { options: [...tokens], exceptions };
  const options = spaced.map((t) => {
    const rule = own.find((r) => r.legacy.test(t));
    return (rule && rule.toSemantic(t.match(rule.legacy))) || t;
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
  const own = block ? (BLOCK_OPTIONS[block] || []) : [];
  return tokens.filter((t) => LEGACY_SPACING_RE.test(t)
    || (!block && (LEGACY_CONTENT_RE.test(t) || Boolean(LEGACY_ALIAS[t])))
    || own.some((r) => r.legacy.test(t)));
}
