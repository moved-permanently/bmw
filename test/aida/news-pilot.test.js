import { test } from 'node:test';
import assert from 'node:assert/strict';

const implementation = await import('../../tools/aida/pilot/workflow.js').catch(() => ({}));
const now = '2026-09-30T10:00:00.000Z';
const actors = {
  author: { id: 'hq-author', role: 'author', market: 'hq' },
  reviewer: { id: 'hq-reviewer', role: 'reviewer', market: 'hq' },
  publisher: { id: 'publisher', role: 'publisher', market: '*' },
  deAuthor: { id: 'de-author', role: 'author', market: 'de' },
  deReviewer: { id: 'de-reviewer', role: 'reviewer', market: 'de' },
  frAuthor: { id: 'fr-author', role: 'author', market: 'fr' },
};
function setup(embargo = now) {
  assert.equal(typeof implementation.createWorkflow, 'function', 'Missing connected news lifecycle implementation');
  const flow = implementation.createWorkflow(undefined, () => Date.parse(now));
  const article = flow.create(actors.author, {
    slug: 'i5-launch',
    market: 'hq',
    title: 'BMW i5: launch news',
    description: 'A launch summary.',
    body: 'The BMW i5 eDrive40 launch story.',
    legal: 'Demo legal statement.',
    embargo,
  });
  return { flow, id: article.id };
}
function approve(flow, id, author = actors.author, reviewer = actors.reviewer) {
  flow.submit(author, id);
  flow.decide(reviewer, id, 'approve', 'Editorial checks complete.', 'body');
}

test('new drafts cannot appear in any public representation', () => {
  const { flow, id } = setup();
  assert.equal(flow.publicArticle(id), null);
  assert.deepEqual(flow.publicIndex(), []);
});
test('review locks a revision and rejection requires anchored feedback', () => {
  const { flow, id } = setup();
  flow.submit(actors.author, id);
  assert.throws(() => flow.edit(actors.author, id, { body: 'Changed' }), /review/i);
  assert.throws(() => flow.decide(actors.reviewer, id, 'reject', '', 'body'), /feedback/i);
  flow.decide(actors.reviewer, id, 'reject', 'Please clarify the legal statement.', 'legal');
  assert.equal(flow.get(id).status, 'changes-requested');
  flow.edit(actors.author, id, { legal: 'Corrected legal statement.' });
  assert.equal(flow.get(id).revision, 2);
  assert.equal(flow.get(id).status, 'draft');
  assert.ok(flow.notifications(actors.author).some((n) => n.type === 'review-rejected'));
});
test('self approval, wrong-market edits and non-publisher publication are denied', () => {
  const { flow, id } = setup();
  flow.submit(actors.author, id);
  assert.throws(() => flow.decide({ ...actors.author, role: 'reviewer' }, id, 'approve', '', 'body'), /self/i);
  assert.throws(() => flow.decide(actors.deReviewer, id, 'approve', '', 'body'), /permission/i);
  flow.decide(actors.reviewer, id, 'approve', '', 'body');
  assert.throws(() => flow.publish(actors.author, id), /permission/i);
  assert.throws(() => flow.edit(actors.frAuthor, id, { title: 'Other market' }), /permission/i);
});
test('embargo is checked by the release service, including direct publish calls', () => {
  const { flow, id } = setup('2026-10-01T10:00:00.000Z');
  approve(flow, id);
  assert.throws(() => flow.publish(actors.publisher, id), /embargo/i);
  flow.schedule(actors.publisher, id, '2026-10-01T10:00:00.000Z');
  assert.equal(flow.publishDue().length, 0);
  assert.equal(flow.publicArticle(id), null);
});
test('scheduled release waits for both release time and approved revision', () => {
  let clock = Date.parse(now);
  const flow = implementation.createWorkflow(undefined, () => clock);
  const article = flow.create(actors.author, {
    slug: 'scheduled', market: 'hq', title: 'Scheduled', description: 'Summary', body: 'Body', legal: 'Legal', embargo: now,
  });
  approve(flow, article.id);
  flow.schedule(actors.publisher, article.id, '2026-09-30T11:00:00.000Z');
  clock += 3600000;
  assert.equal(flow.publishDue().length, 1);
  assert.equal(flow.publicArticle(article.id).title, 'Scheduled');
});
test('an edit cancels scheduling and approval but retains the previous public release', () => {
  const { flow, id } = setup();
  approve(flow, id);
  flow.publish(actors.publisher, id);
  flow.edit(actors.author, id, { title: 'New draft title' });
  assert.equal(flow.publicArticle(id).title, 'BMW i5: launch news');
  assert.equal(flow.get(id).approvedRevision, null);
  assert.throws(() => flow.publish(actors.publisher, id), /approved/i);
  approve(flow, id);
  flow.schedule(actors.publisher, id, '2026-09-30T11:00:00Z');
  flow.edit(actors.author, id, { body: 'Changed again' });
  assert.equal(flow.get(id).scheduledAt, null);
});
test('rollout preserves local fields and moved content while invalidating market approvals', () => {
  const { flow, id } = setup();
  approve(flow, id);
  const [de] = flow.rollout(actors.author, id, ['de', 'fr']);
  flow.edit(actors.deAuthor, de.id, { localIntro: 'German launch offer', localCta: 'Ask a local retailer' });
  assert.throws(() => flow.edit(actors.deAuthor, de.id, { body: 'Override HQ' }), /central/i);
  approve(flow, de.id, actors.deAuthor, actors.deReviewer);
  flow.publish(actors.publisher, de.id);
  flow.edit(actors.author, id, { body: 'HQ revision two' });
  approve(flow, id);
  flow.rollout(actors.author, id, ['de']);
  const updated = flow.get(de.id);
  assert.equal(updated.body, 'HQ revision two');
  assert.equal(updated.localIntro, 'German launch offer');
  assert.equal(updated.localCta, 'Ask a local retailer');
  assert.equal(updated.status, 'draft');
  assert.equal(updated.approvedRevision, null);
  assert.equal(flow.publicArticle(de.id).body, 'The BMW i5 eDrive40 launch story.');
  assert.ok(flow.notifications(actors.deAuthor).some((n) => n.type === 'source-updated'));
});
test('rollout blocks locked reviews and prevents partial multi-market updates', () => {
  const { flow, id } = setup();
  approve(flow, id);
  const [, fr] = flow.rollout(actors.author, id, ['de', 'fr']);
  flow.submit(actors.frAuthor, fr.id);
  flow.edit(actors.author, id, { body: 'New source' });
  approve(flow, id);
  assert.throws(() => flow.rollout(actors.author, id, ['de', 'fr']), /review/i);
  assert.equal(flow.list().find((a) => a.market === 'de').revision, 1);
});
test('markets can originate news without an HQ source and use their own review', () => {
  const { flow } = setup();
  const local = flow.create(actors.deAuthor, {
    slug: 'retailer-event', market: 'de', title: 'Local event', description: 'Local event news', body: 'German market authored news', legal: 'Event terms', embargo: now,
  });
  assert.equal(local.sourceId, null);
  approve(flow, local.id, actors.deAuthor, actors.deReviewer);
  flow.publish(actors.publisher, local.id);
  assert.equal(flow.publicIndex('de').length, 1);
});
test('quality checks and strict dates stop invalid or incomplete submissions', () => {
  const { flow, id } = setup();
  assert.throws(() => flow.edit(actors.author, id, { embargo: 'tomorrow' }), /date/i);
  flow.edit(actors.author, id, { description: '' });
  assert.throws(() => flow.submit(actors.author, id), /description/i);
  assert.throws(() => flow.create(actors.author, { slug: '../bad', market: 'hq' }), /slug/i);
});
test('revision-scoped guest review links expire, are revoked by rejection and contain no token in durable state', () => {
  const { flow, id } = setup();
  flow.submit(actors.author, id);
  const token = 'an-opaque-test-capability-not-a-user-secret';
  flow.grantReview(actors.reviewer, id, token, '2026-09-30T11:00:00Z');
  assert.equal(flow.guestReview(token).article.id, id);
  assert.doesNotMatch(JSON.stringify(flow.snapshot()), new RegExp(token));
  assert.equal(flow.guestReview('wrong'), null);
  flow.guestDecide(token, 'reject', 'Clarify the headline.', 'title');
  assert.equal(flow.guestReview(token), null);
  assert.equal(flow.get(id).status, 'changes-requested');
});
test('expired tokens cannot read or approve any content', () => {
  const { flow, id } = setup();
  flow.submit(actors.author, id);
  flow.grantReview(actors.reviewer, id, 'expired-test-capability-token', '2026-09-30T09:00:00Z');
  assert.equal(flow.guestReview('expired-test-capability-token'), null);
  assert.throws(() => flow.guestDecide('expired-test-capability-token', 'approve', '', 'body'), /expired|invalid/i);
});
test('operational KPIs are calculated from actual audit events, not seeded marketing results', () => {
  const { flow, id } = setup();
  assert.equal(flow.metrics().published, 0);
  approve(flow, id);
  flow.rollout(actors.author, id, ['de', 'fr']);
  flow.publish(actors.publisher, id);
  flow.recordPageRequest(id);
  flow.recordConversion(id);
  assert.equal(flow.metrics().published, 1);
  assert.equal(flow.metrics().pageRequests, 1);
  assert.equal(flow.metrics().ctaEvents, 1);
  assert.equal(flow.metrics().rolloutTotal, 2);
  assert.equal(flow.metrics().source, 'local-pilot');
  assert.ok(flow.snapshot().events.every((e) => e.at && e.actor && e.revision));
});
test('unknown fields, identities and malicious content remain untrusted data', () => {
  const { flow, id } = setup();
  assert.throws(() => flow.edit(actors.author, id, { status: 'approved' }), /field/i);
  assert.throws(() => flow.create({ id: 'fake', role: 'publisher', market: '*' }, { slug: 'x', market: 'hq' }), /permission/i);
  flow.edit(actors.author, id, { body: '<script>alert(1)</script>' });
  approve(flow, id);
  flow.publish(actors.publisher, id);
  assert.match(flow.publicArticle(id).body, /<script>/);
});

test('invalid calendar dates are rejected rather than silently normalized', () => {
  const { flow, id } = setup();
  assert.throws(() => flow.edit(actors.author, id, { embargo: '2026-02-30T10:00:00Z' }), /date/i);
});
test('a market cannot release a stale source after HQ changes its release conditions', () => {
  const { flow, id } = setup();
  approve(flow, id);
  const [de] = flow.rollout(actors.author, id, ['de']);
  approve(flow, de.id, actors.deAuthor, actors.deReviewer);
  flow.edit(actors.author, id, { embargo: '2026-10-01T10:00:00Z' });
  assert.throws(() => flow.publish(actors.publisher, de.id), /source/i);
});

test('market decisions and publication actively notify HQ in the local inbox', () => {
  const { flow, id } = setup();
  approve(flow, id);
  const [de] = flow.rollout(actors.author, id, ['de']);
  approve(flow, de.id, actors.deAuthor, actors.deReviewer);
  assert.ok(flow.notifications(actors.author).some((n) => n.type === 'market-approved' && n.id === de.id));
  flow.publish(actors.publisher, de.id);
  assert.ok(flow.notifications(actors.author).some((n) => n.type === 'market-published' && n.id === de.id));
});
