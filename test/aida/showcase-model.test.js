import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  createDemo, transition, radarRows, checks,
} from '../../tools/aida/showcase/model.js';

const act = (state, type, payload = {}) => transition(state, { type, ...payload });
const submit = (state, market = 'hq') => act(state, 'SUBMIT', {
  actor: market === 'hq' ? 'hq-author' : 'market-author', market,
});
const approve = (state, market = 'hq') => act(submit(state, market), 'APPROVE', {
  actor: market === 'hq' ? 'hq-reviewer' : 'market-reviewer',
  market,
  revision: market === 'hq' ? state.hq.revision : state.markets[market].revision,
});
const rollout = () => act(act(approve(createDemo()), 'TRANSLATE', {
  actor: 'translator', languages: ['de', 'fr'],
}), 'ROLLOUT', { actor: 'hq-author', markets: ['de', 'fr', 'be', 'at'] });
const updated = (state, components, fields) => approve(act(state, 'UPDATE_SOURCE', {
  actor: 'hq-author', components, fields,
}));
const reroll = (state, markets = ['de']) => act(act(state, 'TRANSLATE', {
  actor: 'translator', languages: ['de', 'fr'],
}), 'REROLLOUT', { actor: 'hq-author', markets });
const localize = (state, payload, market = 'de') => act(state, 'LOCALIZE', {
  actor: 'market-author', market, ...payload,
});
const freeze = (object) => {
  Object.values(object).forEach((value) => {
    if (value && typeof value === 'object') freeze(value);
  });
  return Object.freeze(object);
};

test('complete self-contained fixtures have independent contexts and explicit simulation boundaries', () => {
  const state = createDemo();
  assert.equal(state.hq.path, '/aida/showcase/en/news/i5-launch');
  assert.equal(state.markets.de.path, '/aida/showcase/de/de/news/i5-launch');
  assert.equal(state.markets.fr.path, '/aida/showcase/fr/fr/news/i5-launch');
  assert.equal(state.markets.be.path, '/aida/showcase/fr/be/news/i5-launch');
  assert.equal(state.markets.at.path, '/aida/showcase/de/at/news/i5-launch');
  assert.equal(state.planning.length, 64);
  assert.equal(state.planning.filter((market) => market.populated).length, 4);
  assert.ok(state.planning.filter((market) => !market.populated).every((market) => market.simulated));
  assert.deepEqual(Object.keys(state.contexts.hq).sort(), [
    'brand', 'org', 'language', 'region', 'market', 'importer', 'dealer', 'env', 'vehicle', 'topic',
  ].sort());
  assert.equal(state.contexts.be.language, 'fr');
  assert.equal(state.contexts.be.market, 'be');
  assert.equal(state.simulated, true);
  assert.match(state.boundary, /browser|local/i);
  assert.ok(state.personas.every((persona) => persona.simulated));
  assert.ok(state.rightsPolicy);
  assert.ok(state.events && state.notices && state.hq.history);
  assert.deepEqual(createDemo(), state);
});

test('transitions never mutate deeply frozen input or retain action object references', () => {
  const state = freeze(createDemo());
  const fields = { title: 'The BMW i5 launch.' };
  const next = act(state, 'SAVE', { actor: 'hq-author', fields });
  assert.notEqual(next, state);
  assert.equal(state.hq.revision, 1);
  assert.equal(next.hq.revision, 2);
  fields.title = 'Changed outside the model';
  assert.equal(next.hq.fields.title, 'The BMW i5 launch.');
  assert.equal(next.hq.history.at(-1).revision, 2);
  assert.ok(next.events.length > state.events.length);
});

test('unknown actions, markets, actors, and invalid fields reject without mutation', () => {
  const state = createDemo();
  assert.throws(() => act(state, 'NOPE'), /action/i);
  assert.throws(() => submit(state, 'xx'), /market/i);
  assert.throws(() => act(state, 'SAVE', { actor: 'real-admin', fields: { title: 'X' } }), /persona|actor/i);
  assert.throws(() => act(state, 'SAVE', { actor: 'market-author', fields: { title: 'X' } }), /author|rights|role/i);
  assert.throws(() => act(state, 'SAVE', { actor: 'hq-author', fields: { secret: 'X' } }), /field/i);
  assert.throws(() => act(state, 'SAVE', { actor: 'hq-author', fields: { title: 4 } }), /text|string/i);
  assert.equal(state.hq.revision, 1);
});

test('save permits only HQ editable fields and invalidates approval and release schedule', () => {
  let state = approve(createDemo());
  state = act(state, 'SCHEDULE', { actor: 'publisher', at: state.embargo });
  state = act(state, 'SAVE', { actor: 'hq-author', fields: { description: 'An updated BMW i5 launch description.' } });
  assert.equal(state.hq.review, 'draft');
  assert.equal(state.hq.approvedRevision, null);
  assert.equal(state.hq.schedule, null);
  assert.throws(() => act(state, 'SAVE', { actor: 'hq-author', market: 'de', fields: { title: 'X' } }), /HQ|hq/i);
});

test('submit gates metadata, BMW glossary and WLTP legal text', () => {
  for (const fields of [{ title: '' }, { legal: '' }, { body: 'The bmw I5 launch.' }]) {
    const state = act(createDemo(), 'SAVE', { actor: 'hq-author', fields });
    assert.ok(checks(state).some((check) => !check.pass));
    assert.throws(() => submit(state), /check|governance/i);
  }
});

test('review requires submission, proper role, different persona and current revision', () => {
  const initial = createDemo();
  assert.throws(() => act(initial, 'APPROVE', { actor: 'hq-reviewer', revision: 1 }), /submit|review/i);
  const state = submit(initial);
  assert.throws(() => act(state, 'APPROVE', { actor: 'hq-author', revision: 1 }), /self|reviewer|role/i);
  assert.throws(() => act(state, 'APPROVE', { actor: 'hq-reviewer', revision: 0 }), /revision/i);
  const approved = act(state, 'APPROVE', { actor: 'hq-reviewer', revision: 1 });
  assert.equal(approved.hq.approvedRevision, 1);
  assert.equal(approved.hq.review, 'approved');
  assert.throws(() => act(act(state, 'SAVE', { actor: 'hq-author', fields: { title: 'BMW i5 updated.' } }), 'APPROVE', {
    actor: 'hq-reviewer', revision: 1,
  }), /revision|submit|review/i);
});

test('reject needs actionable field, feedback, simulated mention and review team', () => {
  const state = submit(createDemo());
  for (const feedback of [undefined, {}, { field: 'legal', message: 'Fix', mention: 'hq-author' }]) {
    assert.throws(() => act(state, 'REJECT', { actor: 'hq-reviewer', feedback }), /feedback|team/i);
  }
  const rejected = act(state, 'REJECT', {
    actor: 'hq-reviewer',
    feedback: {
      field: 'legal', message: 'Clarify the WLTP statement.', mention: 'hq-author', team: 'Legal',
    },
  });
  assert.equal(rejected.hq.review, 'rejected');
  assert.equal(rejected.inbox.at(-1).mention, 'hq-author');
  assert.equal(rejected.hq.feedback.field, 'legal');
  const corrected = act(rejected, 'SAVE', { actor: 'hq-author', fields: { legal: 'BMW i5 eDrive40 combined energy consumption: 14.7–17.8 kWh/100 km (WLTP).' } });
  assert.equal(approve(corrected).hq.review, 'approved');
});

test('translation is an approved-source batch with glossary, style and TM provenance', () => {
  assert.throws(() => act(createDemo(), 'TRANSLATE', { actor: 'translator' }), /approv/i);
  const state = act(approve(createDemo()), 'TRANSLATE', { actor: 'translator', languages: ['de', 'fr'] });
  for (const language of ['de', 'fr']) {
    const translation = state.translations[language];
    assert.equal(translation.sourceRevision, state.hq.revision);
    assert.match(translation.text, /BMW.*eDrive.*WLTP/s);
    assert.deepEqual(translation.glossary, ['BMW', 'eDrive', 'WLTP']);
    assert.ok(translation.style);
    assert.ok(translation.provenance);
  }
  assert.throws(() => act(state, 'TRANSLATE', { actor: 'translator', languages: ['xx'] }), /language/i);
});

test('manual translation correction persists and is reused for the same source revision', () => {
  let state = act(approve(createDemo()), 'TRANSLATE', { actor: 'translator' });
  const text = 'La BMW i5 avec eDrive : lancement électrique. Données WLTP.';
  state = act(state, 'CORRECT_TRANSLATION', { actor: 'translator', language: 'fr', text });
  assert.equal(state.translations.fr.provenance, 'manual correction / translation memory');
  state = act(state, 'TRANSLATE', { actor: 'translator', languages: ['fr'] });
  assert.equal(state.translations.fr.text, text);
  assert.ok(Object.values(state.translationMemory).some((entry) => entry.text === text));
  assert.throws(() => act(state, 'CORRECT_TRANSLATION', { actor: 'translator', language: 'fr', text: '' }), /text|translation/i);
});

test('rollout needs current approved source and current fixture translations', () => {
  assert.throws(() => act(approve(createDemo()), 'ROLLOUT', { actor: 'hq-author' }), /translation/i);
  const state = rollout();
  for (const market of Object.values(state.markets)) {
    assert.equal(market.acceptedSourceRevision, state.hq.revision);
    assert.equal(market.sourceRevision, state.hq.revision);
    assert.equal(market.rolledOut, true);
    assert.equal(market.review, 'draft');
  }
  const changed = act(state, 'UPDATE_SOURCE', { actor: 'hq-author', fields: { title: 'BMW i5 source revision two.' } });
  assert.equal(changed.hq.approvedRevision, null);
  assert.throws(() => act(changed, 'ROLLOUT', { actor: 'hq-author' }), /approv/i);
  assert.throws(() => act(approve(changed), 'ROLLOUT', { actor: 'hq-author' }), /translation|stale/i);
});

test('market localization permits local overrides but never source metadata or legal bypass', () => {
  const state = rollout();
  const localized = localize(state, { fields: { localIntro: 'Discover the BMW i5 in Austria.', localCta: 'Book a test drive', headline: 'The BMW i5, locally.' } }, 'at');
  assert.equal(localized.markets.at.fields.localIntro, 'Discover the BMW i5 in Austria.');
  assert.equal(localized.markets.at.revision, state.markets.at.revision + 1);
  assert.equal(localized.markets.at.acceptedSourceRevision, state.hq.revision);
  assert.throws(() => localize(state, { fields: { title: 'Changed source title' } }), /field|override/i);
  assert.throws(() => localize(state, { fields: { acceptedSourceRevision: 99 } }), /field|override/i);
  assert.throws(() => act(state, 'LOCALIZE', { actor: 'publisher', fields: { localIntro: 'X' }, market: 'de' }), /author|role/i);
  const bad = localize(state, { fields: { disclaimer: 'No legal statement' } });
  assert.throws(() => submit(bad, 'de'), /check|governance/i);
});

test('rerollout retains local intro/CTA and locally moved stable teaser id while upstream text updates', () => {
  let state = localize(rollout(), {
    fields: { localIntro: 'Local introduction', localCta: 'Local offer' },
    components: { move: [{ id: 'teaser', index: 0 }] },
  });
  state = reroll(updated(state, { update: [{ id: 'teaser', fields: { text: 'Updated upstream BMW i5 teaser.' } }] }));
  const market = state.markets.de;
  assert.equal(market.components[0].id, 'teaser');
  assert.equal(market.components[0].text, 'Updated upstream BMW i5 teaser.');
  assert.equal(market.fields.localIntro, 'Local introduction');
  assert.equal(market.fields.localCta, 'Local offer');
  assert.equal(market.conflicts.length, 0);
  assert.equal(market.acceptedSourceRevision, state.hq.revision);
});

test('rerollout creates property conflicts for local headline, asset, CTA and disclaimer', () => {
  let state = localize(rollout(), {
    components: {
      update: [
        { id: 'hero', fields: { headline: 'Local BMW i5', asset: '/media/local.jpg', cta: 'Local CTA' } },
        { id: 'disclaimer', fields: { text: 'Local WLTP statement.' } },
      ],
    },
  });
  state = reroll(updated(state, {
    update: [
      { id: 'hero', fields: { headline: 'Upstream BMW i5', asset: '/media/upstream.jpg', cta: 'Upstream CTA' } },
      { id: 'disclaimer', fields: { text: 'Upstream WLTP statement.' } },
    ],
  }));
  assert.equal(state.markets.de.conflicts.length, 4);
  assert.ok(state.markets.de.conflicts.every((conflict) => conflict.id && conflict.path && conflict.upstream !== undefined));
  assert.notEqual(state.markets.de.acceptedSourceRevision, state.hq.revision);
  assert.equal(state.markets.de.sourceRevision, state.hq.revision);
  assert.throws(() => submit(state, 'de'), /conflict|check|governance/i);
});

test('resolutions reject invalid id/choice/manual values and accept upstream, local and manual decisions', () => {
  let state = localize(rollout(), { components: { update: [{ id: 'hero', fields: { headline: 'Local BMW i5', asset: '/media/local.jpg', cta: 'Local CTA' } }] } });
  state = reroll(updated(state, { update: [{ id: 'hero', fields: { headline: 'Source BMW i5', asset: '/media/source.jpg', cta: 'Source CTA' } }] }));
  const [headline, asset, cta] = state.markets.de.conflicts;
  assert.throws(() => act(state, 'RESOLVE', {
    actor: 'market-author', market: 'de', conflictId: 'missing', choice: 'local',
  }), /conflict/i);
  assert.throws(() => act(state, 'RESOLVE', {
    actor: 'market-author', market: 'de', conflictId: headline.id, choice: 'both',
  }), /choice/i);
  assert.throws(() => act(state, 'RESOLVE', {
    actor: 'market-author', market: 'de', conflictId: headline.id, choice: 'manual', value: '',
  }), /manual|text/i);
  for (const [conflict, choice, value] of [[headline, 'manual', 'Manually reviewed BMW i5'], [asset, 'upstream'], [cta, 'local']]) {
    state = act(state, 'RESOLVE', {
      actor: 'market-author', market: 'de', conflictId: conflict.id, choice, value,
    });
  }
  assert.equal(state.markets.de.conflicts.length, 0);
  assert.equal(state.markets.de.acceptedSourceRevision, state.hq.revision);
  const hero = state.markets.de.components.find((component) => component.id === 'hero');
  assert.equal(hero.headline, 'Manually reviewed BMW i5');
  assert.equal(hero.asset, '/media/source.jpg');
  assert.equal(hero.cta, 'Local CTA');
});

test('component add/remove, feature and competing reorder changes expose resolvable conflicts', () => {
  let state = localize(rollout(), {
    components: {
      update: [{ id: 'features', fields: { text: 'Local Parking Assistant' } }, { id: 'story', fields: { text: 'Local story' } }],
      move: [{ id: 'teaser', index: 0 }],
      add: [{ id: 'local-offer', type: 'teaser', text: 'Local offer' }],
      remove: ['disclaimer'],
    },
  });
  state = reroll(updated(state, {
    update: [{ id: 'features', fields: { text: 'Upstream Parking Assistant' } }, { id: 'disclaimer', fields: { text: 'Updated WLTP disclaimer' } }],
    remove: ['story'],
    move: [{ id: 'features', index: 0 }],
    add: [{ id: 'local-offer', type: 'teaser', text: 'Upstream offer' }],
  }));
  assert.ok(state.markets.de.conflicts.some((conflict) => conflict.path === 'order'));
  assert.ok(state.markets.de.conflicts.some((conflict) => conflict.path.includes('story')));
  assert.ok(state.markets.de.conflicts.some((conflict) => conflict.path.includes('disclaimer')));
  assert.ok(state.markets.de.conflicts.some((conflict) => conflict.path.includes('features')));
  assert.ok(state.markets.de.conflicts.some((conflict) => conflict.path.includes('local-offer')));
  for (const conflict of [...state.markets.de.conflicts]) {
    state = act(state, 'RESOLVE', {
      actor: 'market-author', market: 'de', conflictId: conflict.id, choice: 'upstream',
    });
  }
  assert.equal(state.markets.de.conflicts.length, 0);
  assert.equal(state.markets.de.components[0].id, 'features');
  assert.ok(!state.markets.de.components.some((component) => component.id === 'story'));
});

test('scheduling needs publisher, current approval, source freshness, checks and embargo', () => {
  const state = rollout();
  assert.throws(() => act(state, 'SCHEDULE', { actor: 'publisher', market: 'de', at: state.embargo }), /approv/i);
  const approved = approve(state, 'de');
  assert.throws(() => act(approved, 'SCHEDULE', { actor: 'market-author', market: 'de', at: state.embargo }), /publisher|role/i);
  assert.throws(() => act(approved, 'SCHEDULE', { actor: 'publisher', market: 'de', at: '2030-05-01T09:00:00.000Z' }), /embargo/i);
  assert.throws(() => act(approved, 'SCHEDULE', { actor: 'publisher', market: 'de', at: 'tomorrow' }), /time|date/i);
  const stale = updated(approved, undefined, { title: 'BMW i5 changed source.' });
  assert.throws(() => act(stale, 'SCHEDULE', { actor: 'publisher', market: 'de', at: state.embargo }), /fresh|source|check/i);
});

test('dry-run publish enforces simulated clock and frozen scheduled revision', () => {
  let state = approve(rollout(), 'de');
  state = act(state, 'SCHEDULE', { actor: 'publisher', market: 'de', at: state.embargo });
  const { revision } = state.markets.de;
  assert.equal(state.markets.de.schedule.revision, revision);
  assert.throws(() => act(state, 'PUBLISH', { actor: 'publisher', market: 'de', dryRun: true }), /clock|time|embargo/i);
  state = act(state, 'ADVANCE_TIME', { minutes: 120 });
  assert.throws(() => act(state, 'PUBLISH', { actor: 'publisher', market: 'de', dryRun: false }), /dry.run|simulat/i);
  state = act(state, 'PUBLISH', { actor: 'publisher', market: 'de', dryRun: true });
  assert.equal(state.markets.de.publishedRevision, revision);
  assert.equal(state.markets.de.release, 'simulated-published');
  assert.equal(state.markets.de.published.simulated, true);
  const edited = localize(state, { fields: { localIntro: 'Another edit' } });
  assert.equal(edited.markets.de.schedule, null);
  assert.throws(() => act(edited, 'PUBLISH', { actor: 'publisher', market: 'de', dryRun: true }), /schedule|approv/i);
});

test('demo clock is bounded and counters are validated, local and explicitly simulated', () => {
  const state = createDemo();
  for (const minutes of [-1, Infinity, 100000, '120']) {
    assert.throws(() => act(state, 'ADVANCE_TIME', { minutes }), /clock|minutes|bound/i);
  }
  assert.throws(() => act(state, 'METRIC', { visits: 1, conversions: 2 }), /conversion|metric/i);
  assert.throws(() => act(state, 'METRIC', { visits: -1, conversions: 0 }), /metric|counter/i);
  const next = act(state, 'METRIC', { market: 'be', visits: 120, conversions: 8 });
  assert.deepEqual(next.metrics.be, { visits: 120, conversions: 8, simulated: true });
  assert.equal(state.metrics.be.visits, 0);
});

test('assignment, notifications and task export remain a simulated in-browser inbox', () => {
  let state = act(createDemo(), 'ASSIGN', { actor: 'hq-author', team: 'Legal', stakeholder: 'hq-reviewer' });
  assert.deepEqual(state.hq.assignment, { team: 'Legal', stakeholder: 'hq-reviewer' });
  state = act(state, 'NOTIFY', { actor: 'hq-author', message: 'Please review legal.', exportTasks: true });
  assert.match(state.inbox.at(-1).message, /review legal/);
  assert.ok(state.taskExport.every((task) => task.simulated));
  assert.throws(() => act(state, 'ASSIGN', { actor: 'hq-author', team: '', stakeholder: 'real-person' }), /team|persona|stakeholder/i);
});

test('radar offers traceable rows, context, independent revisions, blockers and local action links', () => {
  const state = rollout();
  const rows = radarRows(state);
  assert.equal(rows.length, 5);
  const row = rows.find((item) => item.market === 'be');
  for (const key of ['path', 'context', 'revision', 'sourceRevision', 'translation', 'review', 'release', 'blockers', 'actions']) {
    assert.ok(Object.hasOwn(row, key), key);
  }
  assert.equal(row.context.language, 'fr');
  assert.equal(row.acceptedSourceRevision, state.hq.revision);
  assert.ok(row.actions.every((action) => action.href.startsWith('/aida/showcase/')));
  assert.ok(checks(state).every((check) => typeof check.id === 'string'
    && typeof check.label === 'string' && typeof check.pass === 'boolean' && typeof check.message === 'string'));
});

test('selected simulated actor and market defaults work, and source is the HQ compatibility alias', () => {
  let state = createDemo();
  assert.equal(state.source, state.hq);
  state = act(state, 'ACTOR', { id: 'hq-author' });
  state = act(state, 'SAVE', { fields: { title: 'The BMW i5 selected actor.' } });
  assert.equal(state.source, state.hq);
  assert.equal(state.source.fields.title, 'The BMW i5 selected actor.');
  state = act(rollout(), 'ACTOR', { id: 'market-author' });
  state = act(state, 'MARKET', { market: 'be' });
  state = act(state, 'LOCALIZE', { fields: { localIntro: 'Belgian introduction' } });
  assert.equal(state.markets.be.fields.localIntro, 'Belgian introduction');
  assert.throws(() => act(state, 'ACTOR', { id: 'real-admin' }), /persona|actor/i);
});

test('saved HQ body and legal fields drive their preview components', () => {
  const state = act(createDemo(), 'SAVE', {
    actor: 'hq-author',
    fields: { body: 'The BMW i5 with eDrive. Updated launch.', legal: 'Updated BMW i5 WLTP fixture.' },
  });
  assert.equal(state.hq.components.find((c) => c.id === 'story').text, state.hq.fields.body);
  assert.equal(state.hq.components.find((c) => c.id === 'disclaimer').text, state.hq.fields.legal);
});

test('translation memory reuse follows unchanged source text, not unrelated title revisions', () => {
  let state = act(approve(createDemo()), 'TRANSLATE', { actor: 'translator' });
  const text = 'La BMW i5 avec eDrive. Texte corrigé, données WLTP.';
  state = act(state, 'CORRECT_TRANSLATION', { actor: 'translator', language: 'fr', text });
  state = updated(state, undefined, { title: 'Updated BMW i5 metadata.' });
  state = act(state, 'TRANSLATE', { actor: 'translator' });
  assert.equal(state.translations.fr.text, text);
  assert.equal(state.translations.fr.sourceRevision, state.hq.revision);
});

test('rerollout needs a populated initial rollout', () => {
  const state = act(approve(createDemo()), 'TRANSLATE', { actor: 'translator' });
  assert.throws(() => act(state, 'REROLLOUT', { actor: 'hq-author', markets: ['de'] }), /roll.*first|initial.*roll/i);
});

test('market override assets must be fixture paths', () => {
  const localized = localize(rollout(), { fields: { heroAsset: 'javascript:alert(1)' } });
  assert.equal(checks(localized, 'de').find((c) => c.id === 'assets').pass, false);
});

test('RESET is a fresh deterministic initial state without retaining browser session changes', () => {
  const changed = act(createDemo(), 'ADVANCE_TIME', { minutes: 5 });
  assert.deepEqual(act(changed, 'RESET'), createDemo());
});
