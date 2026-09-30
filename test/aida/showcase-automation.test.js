import test from 'node:test';
import assert from 'node:assert/strict';
import { createDemo, transition } from '../../tools/aida/showcase/model.js';

test('approved HQ content can trigger atomic simulated language-to-market automation', () => {
  let state = createDemo();
  state = transition(state, { type: 'SUBMIT', actor: 'hq-author', market: 'hq' });
  state = transition(state, {
    type: 'APPROVE', actor: 'hq-reviewer', market: 'hq', revision: state.hq.revision,
  });
  const before = structuredClone(state);
  const automated = transition(state, { type: 'AUTO_TRANSLATE_ROLLOUT', actor: 'hq-author', market: 'hq' });
  assert.deepEqual(state, before);
  assert.equal(Object.keys(automated.translations).length, 2);
  assert.ok(Object.values(automated.markets).every((market) => market.rolledOut));
  assert.ok(automated.events.some((event) => event.type === 'TRANSLATE' && event.actor === 'translator'));
  assert.ok(automated.events.some((event) => event.type === 'ROLLOUT' && event.actor === 'hq-author'));
});

test('automation never bypasses current-source approval or its allowed simulated trigger role', () => {
  const state = createDemo();
  assert.throws(() => transition(state, { type: 'AUTO_TRANSLATE_ROLLOUT', actor: 'hq-author' }), /approval/i);
  assert.throws(() => transition(state, { type: 'AUTO_TRANSLATE_ROLLOUT', actor: 'market-author' }), /HQ|role/i);
});
