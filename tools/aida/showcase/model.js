const clone = (value) => structuredClone(value);
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const ensure = (condition, message) => { if (!condition) throw new Error(message); };
const text = (value) => typeof value === 'string' && value.trim().length > 0;
const SOURCE_FIELDS = ['title', 'description', 'body', 'legal'];
const LOCAL_FIELDS = ['localIntro', 'localCta', 'headline', 'heroAsset', 'disclaimer'];
const START = '2030-05-01T08:00:00.000Z';
const EMBARGO = '2030-05-01T10:00:00.000Z';
const SAMPLE_ASSET = '/aida/showcase/data/asset-i5-launch';
const COPY = {
  en: {
    title: 'The all-electric BMW i5 launch.',
    description: 'Discover the BMW i5 with eDrive technology, refined design and electric driving pleasure.',
    body: 'The BMW i5 combines eDrive innovation with electric driving pleasure. Discover the new launch. Consumption and range according to WLTP.',
    legal: 'BMW i5 eDrive40 Sedan: combined energy consumption: 17.9 kWh/100 km (WLTP); combined CO₂ emissions: 0 g/km (WLTP); CO₂ class: A; electric range: 513–627 km (WLTP).',
    headline: 'The BMW i5.',
    cta: 'Discover the BMW i5',
    teaser: 'BMW i5 eDrive: electric driving pleasure.',
    feature: 'Parking Assistant',
    updatedTitle: 'The BMW i5 launch. Now with a charging story.',
    updatedHeadline: 'The BMW i5. A new charging chapter.',
    updatedDisclaimer: 'Updated WLTP statement from source data.',
    updatedTeaser: 'BMW i5 eDrive: the updated upstream electric story.',
    updatedFeature: 'Parking Assistant, updated availability.',
    charging: 'BMW Charging: a new upstream section.',
  },
  de: {
    title: 'Die vollelektrische BMW i5 Premiere.',
    description: 'Entdecken Sie den BMW i5 mit eDrive Technologie, elegantem Design und elektrischer Fahrfreude.',
    body: 'Der BMW i5 verbindet eDrive Innovation mit elektrischer Fahrfreude. Entdecken Sie die Premiere. Verbrauch und Reichweite nach WLTP.',
    legal: 'BMW i5 eDrive40 Limousine: Energieverbrauch kombiniert: 17,9 kWh/100 km (WLTP); CO₂-Emissionen kombiniert: 0 g/km (WLTP); CO₂-Klasse: A; Elektrische Reichweite: 513–627 km (WLTP).',
    headline: 'Der BMW i5.',
    cta: 'BMW i5 entdecken',
    teaser: 'BMW i5 eDrive: elektrische Fahrfreude.',
    feature: 'Parking Assistant',
    updatedTitle: 'Die BMW i5 Premiere. Jetzt mit einer Geschichte rund ums Laden.',
    updatedHeadline: 'Der BMW i5. Ein neues Kapitel beim Laden.',
    updatedDisclaimer: 'Aktualisierter WLTP-Hinweis aus den Quelldaten.',
    updatedTeaser: 'BMW i5 eDrive: die aktualisierte elektrische Geschichte der Quelle.',
    updatedFeature: 'Parking Assistant: aktualisierte Verfügbarkeit.',
    charging: 'BMW Charging: ein neuer Abschnitt aus der Quelle.',
  },
  fr: {
    title: 'La première de la BMW i5 entièrement électrique.',
    description: 'Découvrez la BMW i5 avec la technologie eDrive, un design raffiné et le plaisir électrique.',
    body: 'La BMW i5 associe innovation eDrive et plaisir de conduire électrique. Découvrez son lancement. Consommation et autonomie selon WLTP.',
    legal: 'BMW i5 eDrive40 : consommation électrique combinée : 14,7–17,8 kWh/100 km (WLTP) ; émissions de CO₂ combinées : 0 g/km (WLTP) ; classe de CO₂ : A ; autonomie électrique : 518–627 km (WLTP).',
    headline: 'La BMW i5.',
    cta: 'Découvrir la BMW i5',
    teaser: 'BMW i5 eDrive : le plaisir électrique.',
    feature: 'Parking Assistant',
    updatedTitle: 'Le lancement de la BMW i5. Avec une nouvelle histoire de recharge.',
    updatedHeadline: 'La BMW i5. Un nouveau chapitre de recharge.',
    updatedDisclaimer: 'Mention WLTP mise à jour depuis les données source.',
    updatedTeaser: 'BMW i5 eDrive : le récit électrique actualisé de la source.',
    updatedFeature: 'Parking Assistant : disponibilité mise à jour.',
    charging: 'BMW Charging : une nouvelle section issue de la source.',
  },
};
const MARKET_LANGUAGE = {
  de: 'de', fr: 'fr', be: 'fr', at: 'de',
};
const PERSONAS = [
  ['hq-author', 'HQ author', 'hq-author'], ['hq-reviewer', 'HQ reviewer', 'hq-reviewer'],
  ['market-author', 'Market author', 'market-author'], ['market-reviewer', 'Market reviewer', 'market-reviewer'],
  ['publisher', 'Release publisher', 'publisher'], ['translator', 'Translation specialist', 'translator'],
].map(([id, label, role]) => ({
  id, label, role, demo: true,
}));

export function createDemo() {
  const contexts = Object.fromEntries(['hq', ...Object.keys(MARKET_LANGUAGE)].map((market) => [market, {
    brand: 'BMW',
    org: 'BMW Group',
    language: MARKET_LANGUAGE[market] || 'en',
    region: market === 'hq' ? 'global' : 'Europe',
    market,
    importer: market === 'hq' ? null : `${market}-importer`,
    dealer: null,
    env: 'showcase',
    vehicle: 'BMW i5',
    topic: 'launch',
  }]));
  const fields = {
    title: COPY.en.title,
    description: COPY.en.description,
    body: COPY.en.body,
    legal: COPY.en.legal,
    localIntro: '',
    localCta: '',
    headline: COPY.en.headline,
    heroAsset: SAMPLE_ASSET,
    disclaimer: '',
  };
  const components = [
    {
      id: 'hero', type: 'hero', headline: fields.headline, asset: SAMPLE_ASSET, cta: COPY.en.cta,
    },
    { id: 'story', type: 'text', text: fields.body },
    { id: 'teaser', type: 'teaser', text: COPY.en.teaser },
    { id: 'disclaimer', type: 'legal', text: fields.legal },
    { id: 'features', type: 'features', text: COPY.en.feature },
  ];
  const document = (market) => ({
    market,
    context: clone(contexts[market]),
    path: `/aida/showcase/${market === 'hq' ? 'en' : `${MARKET_LANGUAGE[market]}/${market}`}/news/i5-launch`,
    fields: clone(fields),
    components: clone(components),
    revision: 1,
    sourceRevision: 1,
    translationRevision: null,
    acceptedSourceRevision: market === 'hq' ? 1 : 0,
    review: 'draft',
    submitter: null,
    submittedRevision: null,
    approvedRevision: null,
    feedback: null,
    conflicts: [],
    schedule: null,
    release: 'unreleased',
    publishedRevision: null,
    published: null,
    rolledOut: market === 'hq',
    assignment: { team: 'Editorial', stakeholder: market === 'hq' ? 'hq-reviewer' : 'market-reviewer' },
    history: [{
      revision: 1, type: 'SEED', at: START, demo: true,
    }],
    baseDocument: null,
  });
  const hq = document('hq');
  return {
    demo: true,
    boundary: 'Workflow state is local to the app: roles map to AEM identity, publishing happens in AEM and metrics are sample values.',
    actor: 'hq-author',
    market: 'hq',
    clock: START,
    embargo: EMBARGO,
    contexts,
    architecture: {
      organizations: ['BMW', 'MINI', 'Motorrad', 'M', 'Alpina', 'Rolls-Royce', 'Alphabet', 'BMW Group / Jobs', 'BMW Welt', 'BMW BKK', 'BMW Golfsport'].map((name) => ({
        name,
        space: name.toLowerCase().replace(/[^a-z]+/g, '-'),
        shareCapabilities: true,
        shareContent: false,
        populated: name === 'BMW',
      })),
      environments: ['DEV', 'TEST', 'STAGE', 'LIVE'],
      dimensions: ['organization', 'source-language', 'derived-language', 'region', 'market', 'importer', 'dealer', 'environment'],
      productDimensions: ['vehicle', 'type', 'series', 'trim', 'drivetrain', 'subbrand'],
    },
    personas: clone(PERSONAS),
    rightsPolicy: {
      demo: true,
      separationOfDuties: true,
      sampleAsset: SAMPLE_ASSET,
      assets: 'Sample asset reference, not an image URL or production rights clearance.',
    },
    hq,
    source: hq,
    markets: Object.fromEntries(Object.keys(MARKET_LANGUAGE)
      .map((market) => [market, document(market)])),
    translations: {},
    translationMemory: {},
    planning: [...Object.keys(MARKET_LANGUAGE), ...Array.from({ length: 60 }, (_, i) => `planning-${String(i + 1).padStart(2, '0')}`)]
      .map((id) => ({
        id, populated: Boolean(MARKET_LANGUAGE[id]), demo: true, status: MARKET_LANGUAGE[id] ? 'populated market' : 'planning slot, no content yet',
      })),
    metrics: Object.fromEntries(['hq', ...Object.keys(MARKET_LANGUAGE)].map((market) => [market, { visits: 0, conversions: 0, demo: true }])),
    events: [],
    notices: ['Roles, releases, translation provenance and metrics are sample data.'],
    inbox: [],
    taskExport: [],
  };
}

function getDocument(state, market) {
  const document = market === 'hq' ? state.hq : state.markets[market];
  ensure(document, `Unknown market: ${market}`);
  return document;
}

export function checks(state, market = 'hq') {
  const doc = getDocument(state, market);
  const copy = `${doc.fields.body} ${doc.fields.headline} ${doc.components.map((c) => c.text || c.headline || '').join(' ')}`;
  const legal = doc.fields.disclaimer || doc.components.find((c) => c.id === 'disclaimer')?.text || '';
  const conditions = [
    ['seo', 'Metadata', text(doc.fields.title) && text(doc.fields.description) && text(doc.fields.body), 'Title, description and body are required.'],
    ['legal', 'WLTP legal statement', /WLTP/.test(doc.fields.legal) && /WLTP/.test(legal), 'A WLTP legal statement is required.'],
    ['brand', 'BMW glossary', /BMW i5/.test(copy) && /eDrive/.test(copy) && !/bmw|BMW I5|e-drive/.test(copy), 'Preserve BMW i5 and eDrive glossary spelling.'],
    ['assets', 'Asset policy', text(doc.fields.heroAsset) && doc.fields.heroAsset.startsWith('/') && doc.components.filter((c) => c.asset !== undefined).every((c) => text(c.asset) && c.asset.startsWith('/')), 'Use governed asset references.'],
    ['features', 'Market feature availability', !['fr', 'be'].includes(market) || !/Highway Assistant/.test(copy), 'Highway Assistant is not offered in France and Belgium.'],
    ['source', 'Source freshness', market === 'hq' || (doc.rolledOut && doc.acceptedSourceRevision === state.hq.revision && state.hq.approvedRevision === state.hq.revision), 'Accept the current approved source revision.'],
    ['conflicts', 'Resolved inheritance', doc.conflicts.length === 0, 'Resolve all component and property conflicts.'],
    ['translation', 'Current translation acceptance', market === 'hq' || (doc.rolledOut && doc.translationRevision === state.translations[MARKET_LANGUAGE[market]]?.revision && state.translations[MARKET_LANGUAGE[market]]?.sourceRevision === state.hq.revision), 'The translation changed: re-roll out and review the current language revision.'],
    ['approval', 'Current source-bound approval', doc.approvedRevision === doc.revision && (market === 'hq' || (doc.acceptedSourceRevision === state.hq.revision && state.hq.approvedRevision === state.hq.revision)), 'Current revision needs approval; source changes invalidate market release approval.'],
  ];
  return conditions.map(([id, label, pass, message]) => ({
    id, label, pass: Boolean(pass), message: pass ? 'Passed.' : message,
  }));
}

function invalidate(doc) {
  doc.review = 'draft'; doc.approvedRevision = null; doc.submittedRevision = null;
  doc.submitter = null; doc.schedule = null; doc.release = 'unreleased';
}

function revise(doc) { doc.revision += 1; invalidate(doc); }
function approved(state) { ensure(state.hq.approvedRevision === state.hq.revision, 'Current HQ source approval required.'); }
function gates(state, market, requireApproval = false) {
  const failed = checks(state, market)
    .filter((check) => !check.pass && (requireApproval || check.id !== 'approval'));
  ensure(!failed.length, `Governance checks blocked: ${failed.map((check) => check.message).join(' ')}`);
}
function patchFields(doc, fields, allowed) {
  ensure(fields && typeof fields === 'object' && !Array.isArray(fields), 'Editable fields required.');
  Object.entries(fields).forEach(([key, value]) => {
    ensure(allowed.includes(key), `Invalid editable field: ${key}`);
    ensure(typeof value === 'string', `Field ${key} must be text.`);
    doc.fields[key] = value;
    const componentId = { body: 'story', legal: 'disclaimer' }[key];
    const component = doc.components.find((item) => item.id === componentId);
    if (component) component.text = value;
  });
}

function componentEdits(doc, edits = {}) {
  ensure(edits && typeof edits === 'object' && !Array.isArray(edits), 'Component operations required.');
  ensure(Object.keys(edits).every((key) => ['update', 'add', 'remove', 'move'].includes(key)), 'Invalid component operation.');
  Object.values(edits).forEach((list) => ensure(Array.isArray(list), 'Component operations must be arrays.'));
  (edits.update || []).forEach(({ id, fields }) => {
    const c = doc.components.find((item) => item.id === id);
    ensure(c && fields && typeof fields === 'object', 'Valid component id and fields required.');
    Object.entries(fields).forEach(([key, value]) => {
      ensure(Object.hasOwn(c, key) && !['id', 'type'].includes(key) && text(value), 'Component property must be valid nonempty text.');
      c[key] = value;
    });
  });
  (edits.remove || []).forEach((id) => {
    ensure(doc.components.some((c) => c.id === id), 'Unknown component removal id.');
    doc.components = doc.components.filter((c) => c.id !== id);
  });
  (edits.add || []).forEach((c) => {
    ensure(c && /^[a-z][a-z0-9-]*$/.test(c.id) && text(c.type) && !doc.components.some((item) => item.id === c.id), 'Valid unique component id and type required.');
    ensure(Object.values(c).every(text), 'Component properties must be nonempty text.');
    doc.components.push(clone(c));
  });
  (edits.move || []).forEach(({ id, index }) => {
    const current = doc.components.findIndex((c) => c.id === id);
    ensure(current >= 0 && Number.isInteger(index) && index >= 0 && index < doc.components.length, 'Valid component move id/index required.');
    const [c] = doc.components.splice(current, 1);
    doc.components.splice(index, 0, c);
  });
}

function snapshot(doc) { return { fields: clone(doc.fields), components: clone(doc.components) }; }
function localizedCopy(value, language) {
  if (!value || value.startsWith('/') || /^https?:\/\//i.test(value)) return value;
  const key = Object.keys(COPY.en).find((id) => COPY.en[id] === value);
  if (key) return COPY[language][key];
  return `Not translated yet — source copy: ${value}`;
}

function translationDocument(source, language, bodyCorrection) {
  const result = snapshot(source);
  [...SOURCE_FIELDS, ...LOCAL_FIELDS.filter((key) => key !== 'heroAsset')].forEach((key) => {
    result.fields[key] = localizedCopy(result.fields[key], language);
  });
  result.components.forEach((component) => {
    ['headline', 'text', 'cta'].filter((key) => Object.hasOwn(component, key)).forEach((key) => {
      component[key] = localizedCopy(component[key], language);
    });
  });
  if (bodyCorrection) {
    result.fields.body = bodyCorrection;
    const story = result.components.find((c) => c.id === 'story');
    if (story) story.text = bodyCorrection;
  }
  return result;
}

function translatedSource(state, market) {
  const translation = state.translations[MARKET_LANGUAGE[market]];
  ensure(
    translation && translation.sourceRevision === state.hq.revision,
    'Current source translation required (stale or missing translation).',
  );
  return clone(translation.document);
}

function setPath(doc, path, value) {
  const [root, id, property] = path.split('.');
  if (root === 'fields') doc.fields[id] = value;
  else if (root === 'order') {
    doc.components.sort((a, b) => {
      const index = (c) => (value.includes(c.id) ? value.indexOf(c.id) : value.length);
      return index(a) - index(b);
    });
  } else if (property) {
    const component = doc.components.find((c) => c.id === id);
    ensure(component, 'Conflict component no longer exists.');
    component[property] = value;
  } else {
    const index = doc.components.findIndex((c) => c.id === id);
    if (value === null) doc.components = doc.components.filter((c) => c.id !== id);
    else if (index >= 0) doc.components[index] = clone(value);
    else doc.components.push(clone(value));
  }
}

function merge(doc, incoming) {
  ensure(doc.baseDocument && !doc.conflicts.length, 'Roll out first and resolve existing conflicts before rerollout.');
  const base = doc.baseDocument;
  const mergeValue = (path, oldValue, local, upstream) => {
    if (same(oldValue, upstream)) return;
    if (same(oldValue, local) || same(local, upstream)) setPath(doc, path, upstream);
    else {
      doc.conflicts.push({
        id: `${doc.market}:${path}`, path, base: clone(oldValue), local: clone(local), upstream: clone(upstream),
      });
    }
  };
  Object.keys(incoming.fields).filter((key) => !['localIntro', 'localCta'].includes(key)).forEach((key) => {
    mergeValue(`fields.${key}`, base.fields[key], doc.fields[key], incoming.fields[key]);
  });
  const oldOrder = base.components.map((c) => c.id);
  const localOrder = doc.components.map((c) => c.id);
  const upstreamOrder = incoming.components.map((c) => c.id);
  const relative = (order) => order.filter((id) => oldOrder.includes(id));
  const common = oldOrder.filter((id) => localOrder.includes(id) && upstreamOrder.includes(id));
  const onCommon = (order) => order.filter((id) => common.includes(id));
  const upstreamMoved = !same(onCommon(oldOrder), onCommon(upstreamOrder));
  const localMoved = !same(onCommon(oldOrder), onCommon(localOrder));
  const ids = new Set([...oldOrder, ...localOrder, ...upstreamOrder]);
  ids.forEach((id) => {
    const old = base.components.find((c) => c.id === id) || null;
    const local = doc.components.find((c) => c.id === id) || null;
    const upstream = incoming.components.find((c) => c.id === id) || null;
    if (!old || !local || !upstream) mergeValue(`components.${id}`, old, local, upstream);
    else {
      Object.keys(upstream).filter((key) => !['id', 'type'].includes(key)).forEach((key) => {
        mergeValue(`components.${id}.${key}`, old[key], local[key], upstream[key]);
      });
    }
  });
  if (upstreamMoved && localMoved && !same(relative(localOrder), relative(upstreamOrder))) {
    doc.conflicts.push({
      id: `${doc.market}:order`, path: 'order', base: oldOrder, local: localOrder, upstream: upstreamOrder,
    });
  } else if (upstreamMoved || !localMoved) setPath(doc, 'order', upstreamOrder);
  doc.baseDocument = clone(incoming);
}

export function transition(state, action) {
  ensure(action && typeof action.type === 'string', 'Action type required.');
  if (action.type === 'RESET') return createDemo();
  if (action.type === 'AUTO_TRANSLATE_ROLLOUT') {
    ensure((action.actor || state.actor) === 'hq-author', 'HQ author role must trigger the automation.');
    const translated = transition(state, {
      type: 'TRANSLATE', actor: 'translator', market: 'hq', languages: ['de', 'fr'],
    });
    return transition(translated, {
      type: 'ROLLOUT', actor: 'hq-author', market: 'hq', markets: ['de', 'at', 'fr', 'be'],
    });
  }
  const next = clone(state);
  next.source = next.hq;
  const market = action.market || next.market || 'hq';
  const doc = getDocument(next, market);
  const actor = action.actor || next.actor;
  const persona = next.personas.find((item) => item.id === actor);
  ensure(persona, 'Unknown actor role.');
  const role = (...roles) => ensure(roles.includes(persona.role), `Role required: ${roles.join(' or ')}.`);
  const author = () => role(market === 'hq' ? 'hq-author' : 'market-author');
  const reviewer = () => role(market === 'hq' ? 'hq-reviewer' : 'market-reviewer');
  const hqOnly = () => { ensure(market === 'hq', 'HQ action only.'); role('hq-author'); };
  switch (action.type) {
    case 'ACTOR':
      ensure(next.personas.some((p) => p.id === action.id), 'Unknown actor role.'); next.actor = action.id; break;
    case 'MARKET': getDocument(next, action.market); next.market = action.market; break;
    case 'SAVE':
      hqOnly(); patchFields(doc, action.fields, SOURCE_FIELDS); revise(doc);
      doc.sourceRevision = doc.revision; doc.acceptedSourceRevision = doc.revision; break;
    case 'UPDATE_SOURCE':
      hqOnly();
      ensure(action.fields || action.components, 'Source fields or component change required.');
      if (action.fields) patchFields(doc, action.fields, [...SOURCE_FIELDS, ...LOCAL_FIELDS.filter((key) => !key.startsWith('local'))]);
      if (action.components) componentEdits(doc, action.components);
      revise(doc); doc.sourceRevision = doc.revision;
      doc.acceptedSourceRevision = doc.revision; break;
    case 'SUBMIT':
      author(); gates(next, market); invalidate(doc); doc.review = 'submitted';
      doc.submitter = actor; doc.submittedRevision = doc.revision; break;
    case 'REJECT': {
      reviewer(); ensure(doc.review === 'submitted', 'Submitted review required.');
      const f = action.feedback;
      ensure(f && text(f.field) && text(f.message) && text(f.team) && next.personas.some((p) => p.id === f.mention), 'Required feedback: field, message, mention and team.');
      ensure(Object.hasOwn(doc.fields, f.field) || doc.components.some((c) => c.id === f.field), 'Feedback field must exist.');
      doc.feedback = clone(f); doc.review = 'rejected'; doc.approvedRevision = null;
      next.inbox.push({
        ...clone(f), market, at: next.clock, demo: true,
      }); break;
    }
    case 'APPROVE':
      reviewer(); ensure(doc.review === 'submitted', 'Submitted review required.');
      ensure(actor !== doc.submitter, 'Self approval is forbidden.');
      ensure(action.revision === doc.revision && doc.submittedRevision === doc.revision, 'Approval requires current submitted revision.');
      gates(next, market); doc.review = 'approved'; doc.approvedRevision = doc.revision; break;
    case 'TRANSLATE': {
      role('translator'); approved(next);
      const languages = action.languages || ['de', 'fr'];
      ensure(Array.isArray(languages) && languages.length > 0 && languages.every((language) => ['de', 'fr'].includes(language)), 'Supported translation languages: de, fr.');
      languages.forEach((language) => {
        const key = `${language}:${next.hq.fields.body}`;
        const memory = next.translationMemory[key];
        const document = translationDocument(next.hq, language, memory?.text);
        next.translations[language] = {
          language,
          document,
          text: document.fields.body,
          title: document.fields.title,
          sourceRevision: next.hq.revision,
          revision: (next.translations[language]?.revision || 0) + 1,
          glossary: ['BMW', 'eDrive', 'WLTP'],
          style: 'BMW concise premium editorial; untranslated prose stays labelled source copy',
          provenance: memory ? 'manual correction / translation memory' : 'full-page AI translation / glossary / style / translation memory',
        };
      }); break;
    }
    case 'CORRECT_TRANSLATION': {
      role('translator'); approved(next);
      const translation = next.translations[action.language];
      ensure(translation && translation.sourceRevision === next.hq.revision && text(action.text) && ['BMW', 'eDrive', 'WLTP'].every((term) => action.text.includes(term)), 'Current translation and nonempty glossary-preserving text required.');
      translation.text = action.text; translation.document.fields.body = action.text;
      const story = translation.document.components.find((c) => c.id === 'story');
      if (story) story.text = action.text;
      translation.revision += 1; translation.provenance = 'manual correction / translation memory';
      next.translationMemory[`${action.language}:${next.hq.fields.body}`] = { text: action.text, demo: true }; break;
    }
    case 'ROLLOUT':
    case 'REROLLOUT': {
      hqOnly(); approved(next);
      const markets = action.markets || Object.keys(next.markets);
      ensure(Array.isArray(markets) && markets.length > 0 && markets.every((id) => Object.hasOwn(next.markets, id)), 'Valid rollout markets required.');
      markets.forEach((id) => {
        const target = next.markets[id];
        ensure(action.type !== 'REROLLOUT' || target.rolledOut, 'Initial rollout must run first.');
        const incoming = translatedSource(next, id);
        if (target.rolledOut) merge(target, incoming);
        else {
          Object.assign(target.fields, incoming.fields);
          target.components = clone(incoming.components);
          target.baseDocument = clone(incoming);
        }
        revise(target); target.rolledOut = true; target.sourceRevision = next.hq.revision;
        target.translationRevision = next.translations[MARKET_LANGUAGE[id]].revision;
        if (!target.conflicts.length) target.acceptedSourceRevision = next.hq.revision;
        target.history.push({
          revision: target.revision,
          type: action.type,
          at: next.clock,
          sourceRevision: target.sourceRevision,
          demo: true,
        });
      }); break;
    }
    case 'LOCALIZE':
      ensure(market !== 'hq' && doc.rolledOut, 'Rolled out market required.'); author();
      ensure(!doc.conflicts.length, 'Resolve pending conflicts before localizing.');
      ensure(action.fields || action.components, 'Local fields or component change required.');
      if (action.fields) patchFields(doc, action.fields, LOCAL_FIELDS);
      if (action.components) componentEdits(doc, action.components);
      revise(doc); break;
    case 'RESOLVE': {
      ensure(market !== 'hq', 'Market conflict required.'); author();
      const conflict = doc.conflicts.find((item) => item.id === action.conflictId);
      ensure(conflict, 'Valid conflict id required.');
      ensure(['upstream', 'local', 'manual'].includes(action.choice), 'Valid conflict choice required.');
      const value = action.choice === 'manual' ? action.value : conflict[action.choice];
      if (action.choice === 'manual') {
        if (conflict.path === 'order') ensure(Array.isArray(value) && new Set(value).size === doc.components.length && value.length === doc.components.length && doc.components.every((c) => value.includes(c.id)), 'Manual order must contain every component id once.');
        else if (conflict.path.startsWith('components.') && conflict.path.split('.').length === 2) {
          ensure(value && value.id === conflict.path.split('.')[1] && text(value.type) && Object.values(value).every(text), 'Manual component must have matching id, type and text.');
        } else ensure(text(value), 'Manual text must be nonempty.');
      }
      setPath(doc, conflict.path, clone(value));
      doc.conflicts = doc.conflicts.filter((item) => item.id !== conflict.id); revise(doc);
      if (!doc.conflicts.length) doc.acceptedSourceRevision = doc.sourceRevision;
      break;
    }
    case 'SCHEDULE':
      role('publisher'); ensure(doc.approvedRevision === doc.revision, 'Current approval required for scheduling.'); gates(next, market, true);
      ensure(text(action.at) && Number.isFinite(Date.parse(action.at)), 'Valid release date/time required.');
      ensure(Date.parse(action.at) >= Date.parse(next.embargo), 'Release time must be at or after embargo.');
      ensure(Date.parse(action.at) >= Date.parse(next.clock), 'Release time cannot precede the release clock.');
      doc.schedule = {
        at: new Date(action.at).toISOString(),
        revision: doc.revision,
        sourceRevision: next.hq.revision,
        document: snapshot(doc),
        demo: true,
      };
      doc.release = 'scheduled'; break;
    case 'PUBLISH':
      role('publisher'); ensure(action.demoRelease === true, 'A release must come from the scheduled release workflow.');
      ensure(doc.schedule && doc.schedule.revision === doc.revision && doc.approvedRevision === doc.revision && doc.schedule.sourceRevision === next.hq.revision, 'Current source-bound approved frozen schedule required.'); gates(next, market, true);
      ensure(Date.parse(next.clock) >= Date.parse(next.embargo) && Date.parse(next.clock) >= Date.parse(doc.schedule.at), 'The release clock must reach the embargo and scheduled time.');
      doc.publishedRevision = doc.schedule.revision;
      doc.published = { ...clone(doc.schedule), at: next.clock, demo: true };
      doc.release = 'released'; break;
    case 'ADVANCE_TIME': {
      ensure(Number.isInteger(action.minutes) && action.minutes >= 0 && action.minutes <= 10080, 'Clock advance must be 0–10080 minutes.');
      const time = Date.parse(next.clock) + action.minutes * 60000;
      ensure(time <= Date.parse(START) + 10080 * 60000, 'Clock exceeds the one-week bound.');
      next.clock = new Date(time).toISOString(); break;
    }
    case 'METRIC': {
      const metric = next.metrics[market];
      ensure(Number.isSafeInteger(action.visits) && Number.isSafeInteger(action.conversions) && action.visits >= 0 && action.conversions >= 0 && action.conversions <= action.visits, 'Sample metric counters require visits >= conversions >= 0.');
      ensure(Number.isSafeInteger(metric.visits + action.visits) && Number.isSafeInteger(metric.conversions + action.conversions), 'Sample metric counter overflow.');
      metric.visits += action.visits; metric.conversions += action.conversions; break;
    }
    case 'ASSIGN':
      author(); ensure(text(action.team) && next.personas.some((p) => p.id === action.stakeholder), 'Review team and stakeholder role required.');
      doc.assignment = { team: action.team, stakeholder: action.stakeholder }; break;
    case 'NOTIFY':
      ensure(text(action.message), 'Notification message required.');
      next.inbox.push({
        market,
        message: action.message,
        mention: doc.assignment.stakeholder,
        team: doc.assignment.team,
        at: next.clock,
        demo: true,
      });
      if (action.exportTasks) next.taskExport = clone(next.inbox); break;
    default: throw new Error(`Unknown action: ${action.type}`);
  }
  const event = {
    id: `event-${next.events.length + 1}`, type: action.type, actor, market, revision: doc.revision, at: next.clock, demo: true,
  };
  next.events.push(event);
  if (!['ACTOR', 'MARKET', 'ADVANCE_TIME', 'METRIC', 'TRANSLATE', 'CORRECT_TRANSLATION', 'ROLLOUT', 'REROLLOUT'].includes(action.type)) doc.history.push({ ...event, document: snapshot(doc) });
  next.notices.push(`${action.type} completed.`);
  return next;
}

export function radarRows(state) {
  return ['hq', ...Object.keys(state.markets)].map((market) => {
    const doc = getDocument(state, market);
    const translation = market === 'hq' ? 'source' : state.translations[MARKET_LANGUAGE[market]];
    const blockers = checks(state, market).filter((check) => !check.pass)
      .map((check) => check.message);
    let translationLabel = 'not translated';
    if (typeof translation === 'string') translationLabel = translation;
    else if (translation) translationLabel = `${translation.language}: ${translation.provenance}`;
    const params = new URLSearchParams({
      path: doc.path,
      ...Object.fromEntries(Object.entries(state.contexts[market])
        .filter(([, value]) => value !== null)),
    });
    const url = `/tools/aida/showcase/index.html?${params}`;
    return {
      market,
      path: doc.path,
      context: clone(state.contexts[market]),
      revision: doc.revision,
      sourceRevision: doc.sourceRevision,
      acceptedSourceRevision: doc.acceptedSourceRevision,
      translation: translationLabel,
      review: doc.review,
      release: doc.release,
      blockers,
      actions: [{ label: 'Open workflow', href: `${url}#workflow` }, { label: 'Open rollout workspace', href: `${url}#rollout` }],
    };
  });
}
