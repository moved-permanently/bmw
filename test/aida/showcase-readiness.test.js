import test from 'node:test';
import assert from 'node:assert/strict';
import { createDemo, transition, checks } from '../../tools/aida/showcase/model.js';

const rolledOut = () => {
  let state = createDemo();
  const act = (action) => { state = transition(state, action); };
  act({ type: 'SUBMIT', actor: 'hq-author', market: 'hq' });
  act({ type: 'APPROVE', actor: 'hq-reviewer', market: 'hq', revision: state.hq.revision });
  act({ type: 'TRANSLATE', actor: 'translator' });
  act({ type: 'ROLLOUT', actor: 'hq-author', market: 'hq', markets: ['be'] });
  act({ type: 'SUBMIT', actor: 'market-author', market: 'be' });
  act({ type: 'APPROVE', actor: 'market-reviewer', market: 'be', revision: state.markets.be.revision });
  return state;
};

test('a corrected translation is a readiness change even when the HQ source revision has not changed', () => {
  const initial = rolledOut();
  const changed = transition(initial, { type: 'CORRECT_TRANSLATION', actor: 'translator', language: 'fr', text: 'BMW i5 eDrive : correction humaine. Données WLTP illustratives.' });
  assert.equal(changed.hq.revision, initial.hq.revision);
  assert.ok(checks(changed, 'be').some((check) => check.id === 'translation' && !check.pass));
  assert.throws(() => transition(changed, { type: 'SCHEDULE', actor: 'publisher', market: 'be', at: changed.embargo }), /translation|Governance/i);
});

test('re-rollout accepts the current translation revision and requires fresh market approval', () => {
  let state = rolledOut();
  state = transition(state, { type: 'CORRECT_TRANSLATION', actor: 'translator', language: 'fr', text: 'BMW i5 eDrive : correction humaine. Données WLTP illustratives.' });
  state = transition(state, { type: 'REROLLOUT', actor: 'hq-author', market: 'hq', markets: ['be'] });
  assert.equal(state.markets.be.translationRevision, state.translations.fr.revision);
  assert.ok(checks(state, 'be').find((check) => check.id === 'translation').pass);
  assert.equal(state.markets.be.approvedRevision, null);
});
