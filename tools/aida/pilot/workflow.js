import { createHash } from 'node:crypto';

export const ACTORS = [
  {
    id: 'hq-author', role: 'author', market: 'hq', label: 'HQ creator',
  },
  {
    id: 'hq-reviewer', role: 'reviewer', market: 'hq', label: 'HQ stakeholder',
  },
  ...['de', 'at', 'fr', 'be'].flatMap((market) => [
    {
      id: `${market}-author`, role: 'author', market, label: `${market.toUpperCase()} creator`,
    },
    {
      id: `${market}-reviewer`, role: 'reviewer', market, label: `${market.toUpperCase()} approver`,
    },
  ]),
  {
    id: 'publisher', role: 'publisher', market: '*', label: 'Release operator',
  },
];
export const MARKETS = ['hq', 'de', 'at', 'fr', 'be'];
const CENTRAL = ['title', 'description', 'body', 'legal', 'embargo'];
const LOCAL = ['localIntro', 'localCta'];
const copy = (value) => structuredClone(value);
const digest = (token) => createHash('sha256').update(token).digest('hex');
const requireThat = (condition, message) => { if (!condition) throw new Error(message); };
function date(value) {
  requireThat(typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(value) && Number.isFinite(Date.parse(value)) && /(?:Z|[+-]\d{2}:\d{2})$/.test(value), 'A valid date with time and timezone is required');
  const [year, month, day] = value.slice(0, 10).split('-').map(Number);
  const calendar = new Date(Date.UTC(year, month - 1, day));
  requireThat(calendar.getUTCFullYear() === year && calendar.getUTCMonth() === month - 1
    && calendar.getUTCDate() === day, 'Invalid calendar date');
  return new Date(value).toISOString();
}

export function createWorkflow(initial, clock = Date.now) {
  let state = copy(initial || {
    articles: {}, events: [], notices: [], grants: [], traffic: [],
  });
  const timestamp = () => new Date(clock()).toISOString();
  const get = (id) => {
    const article = state.articles[id];
    requireThat(article, 'Article not found');
    return article;
  };
  const permitted = (actor, article, role) => {
    const allowed = actor?.role === role && (actor.market === '*' || actor.market === article.market);
    requireThat(allowed, 'Permission denied for this role or market');
  };
  const event = (actor, article, action, detail = {}) => {
    state.events.push({
      at: timestamp(),
      actor: actor.id,
      id: article.id,
      revision: article.revision,
      action,
      ...detail,
    });
  };
  const notify = (article, role, type, message, market = article.market) => {
    state.notices.push({
      at: timestamp(), id: article.id, market, role, type, message,
    });
  };
  const revoke = (article) => { state.grants = state.grants.filter((g) => g.id !== article.id); };
  const reset = (article) => {
    article.status = 'draft';
    article.approvedRevision = null;
    article.scheduledAt = null;
    revoke(article);
  };
  const validate = (fields) => {
    Object.entries(fields).forEach(([key, value]) => {
      requireThat([...CENTRAL, ...LOCAL].includes(key), `Unknown or protected field: ${key}`);
      requireThat(typeof value === 'string' && value.length <= 20000, `Invalid field: ${key}`);
      if (key === 'embargo') date(value);
    });
  };
  const checks = (article) => ['title', 'description', 'body', 'legal'].map((field) => ({
    field, pass: Boolean(article[field]?.trim()), message: `${field} must be present`,
  }));
  const saveVersion = (article) => {
    const fields = Object.fromEntries([...CENTRAL, ...LOCAL].map((k) => [k, article[k]]));
    article.versions.push({ revision: article.revision, at: timestamp(), fields });
  };
  const create = (actor, fields) => {
    const { slug, market = actor.market, ...content } = fields;
    requireThat(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug || '') && slug.length <= 100, 'Invalid article slug');
    requireThat(MARKETS.includes(market), 'Invalid market');
    const id = `${market}--${slug}`;
    requireThat(!state.articles[id], 'Article already exists');
    permitted(actor, { market }, 'author');
    validate(content);
    const article = {
      id,
      slug,
      market,
      sourceId: null,
      sourceRevision: null,
      revision: 1,
      title: '',
      description: '',
      body: '',
      legal: '',
      embargo: timestamp(),
      localIntro: '',
      localCta: '',
      ...content,
      status: 'draft',
      approvedRevision: null,
      scheduledAt: null,
      submittedBy: null,
      versions: [],
      release: null,
    };
    article.embargo = date(article.embargo);
    saveVersion(article);
    state.articles[id] = article;
    event(actor, article, 'created');
    return copy(article);
  };
  const edit = (actor, id, fields) => {
    const article = get(id);
    permitted(actor, article, 'author');
    requireThat(article.status !== 'in-review', 'The revision is locked for review; reject it before editing');
    validate(fields);
    if (article.sourceId) requireThat(Object.keys(fields).every((k) => LOCAL.includes(k)), 'Central fields are owned by HQ; only local fields can be changed');
    Object.assign(article, fields);
    article.embargo = date(article.embargo);
    article.revision += 1;
    reset(article);
    saveVersion(article);
    event(actor, article, 'edited', { fields: Object.keys(fields) });
    notify(article, 'reviewer', 'approval-invalidated', 'Content changed: a new revision requires review.');
    return copy(article);
  };
  const submit = (actor, id) => {
    const article = get(id);
    permitted(actor, article, 'author');
    requireThat(['draft', 'changes-requested'].includes(article.status), 'Only a draft can be submitted');
    const failed = checks(article).filter((c) => !c.pass);
    requireThat(!failed.length, failed.map((c) => c.message).join('; '));
    article.status = 'in-review';
    article.submittedBy = actor.id;
    event(actor, article, 'review-requested');
    notify(article, 'reviewer', 'review-requested', `Review revision ${article.revision}.`);
    return copy(article);
  };
  const decide = (actor, id, decision, comment = '', field = 'body') => {
    const article = get(id);
    permitted(actor, article, 'reviewer');
    requireThat(article.status === 'in-review', 'Article is not in review');
    requireThat(actor.id !== article.submittedBy, 'Self approval is not allowed');
    requireThat(['approve', 'reject'].includes(decision), 'Invalid review decision');
    requireThat([...CENTRAL, ...LOCAL].includes(field), 'Invalid feedback field');
    requireThat(typeof comment === 'string' && comment.length <= 4000, 'Invalid feedback');
    requireThat(decision !== 'reject' || comment.trim(), 'Rejection requires feedback');
    article.status = decision === 'approve' ? 'approved' : 'changes-requested';
    article.approvedRevision = decision === 'approve' ? article.revision : null;
    revoke(article);
    event(actor, article, `review-${decision === 'approve' ? 'approved' : 'rejected'}`, { comment, field });
    notify(article, 'author', `review-${decision === 'approve' ? 'approved' : 'rejected'}`, comment || 'Approved for release preparation.');
    if (article.market !== 'hq') {
      notify(
        article,
        'author',
        `market-${decision === 'approve' ? 'approved' : 'rejected'}`,
        `${article.market.toUpperCase()} review: ${decision} at revision ${article.revision}.`,
        'hq',
      );
    }
    return copy(article);
  };
  const currentSource = (article) => {
    if (!article.sourceId) return true;
    const source = get(article.sourceId);
    return source.approvedRevision === source.revision
      && article.sourceRevision === source.revision;
  };
  const releaseable = (actor, article) => {
    permitted(actor, article, 'publisher');
    requireThat(article.approvedRevision === article.revision && ['approved', 'scheduled'].includes(article.status), 'Current revision must be approved');
    requireThat(currentSource(article), 'HQ source changed: approve and re-roll out before releasing');
    requireThat(checks(article).every((c) => c.pass), 'Quality checks failed');
  };
  const publish = (actor, id) => {
    const article = get(id);
    releaseable(actor, article);
    requireThat(clock() >= Date.parse(article.embargo), 'Embargo has not elapsed');
    requireThat(!article.scheduledAt || clock() >= Date.parse(article.scheduledAt), 'Scheduled release time has not elapsed');
    article.release = {
      id,
      slug: article.slug,
      market: article.market,
      revision: article.revision,
      ...Object.fromEntries([...CENTRAL, ...LOCAL].map((k) => [k, article[k]])),
      publishedAt: timestamp(),
    };
    article.status = 'published';
    article.scheduledAt = null;
    event(actor, article, 'published');
    notify(article, 'author', 'published', 'This revision is public in the local pilot. EDS release is separate.');
    if (article.market !== 'hq') {
      notify(
        article,
        'author',
        'market-published',
        `${article.market.toUpperCase()} locally released revision ${article.revision}. EDS is separate.`,
        'hq',
      );
    }
    return copy(article);
  };
  const schedule = (actor, id, when) => {
    const article = get(id);
    releaseable(actor, article);
    const at = date(when);
    requireThat(Date.parse(at) >= Date.parse(article.embargo) && Date.parse(at) > clock(), 'Release date must be in the future and on or after embargo');
    article.scheduledAt = at;
    article.status = 'scheduled';
    event(actor, article, 'scheduled', { when: at });
    return copy(article);
  };
  const rollout = (actor, id, markets) => {
    const source = get(id);
    permitted(actor, source, 'author');
    requireThat(source.market === 'hq' && source.approvedRevision === source.revision, 'An approved HQ source is required');
    requireThat(Array.isArray(markets) && markets.length && new Set(markets).size === markets.length && markets.every((m) => MARKETS.includes(m) && m !== 'hq'), 'Invalid rollout markets');
    markets.forEach((market) => {
      const previous = state.articles[`${market}--${source.slug}`];
      requireThat(!previous || previous.sourceId === id, 'A local article already uses this slug');
      requireThat(previous?.status !== 'in-review', 'A market review is locked; no rollout changes were applied');
    });
    return markets.map((market) => {
      const targetId = `${market}--${source.slug}`;
      const previous = state.articles[targetId];
      if (previous?.sourceRevision === source.revision) return copy(previous);
      const article = previous || {
        ...copy(source), id: targetId, market, sourceId: id, localIntro: '', localCta: '', versions: [], release: null, revision: 0,
      };
      CENTRAL.forEach((field) => { article[field] = source[field]; });
      article.sourceRevision = source.revision;
      article.revision += 1;
      article.submittedBy = null;
      reset(article);
      saveVersion(article);
      state.articles[targetId] = article;
      event(actor, article, previous ? 'source-updated' : 'rolled-out', { sourceId: id, sourceRevision: source.revision });
      notify(article, 'author', previous ? 'source-updated' : 'rollout-created', 'Review the changed HQ fields, localize your fields, then submit for market approval. Translation is a separate DA/BYO-AI step.');
      return copy(article);
    });
  };
  const grantReview = (actor, id, token, expiresAt) => {
    const article = get(id);
    permitted(actor, article, 'reviewer');
    requireThat(article.status === 'in-review', 'Article is not in review');
    requireThat(typeof token === 'string' && token.length >= 24, 'Invalid review capability');
    state.grants.push({
      digest: digest(token),
      id,
      revision: article.revision,
      expiresAt: date(expiresAt),
      actor: copy(actor),
    });
  };
  const guestReview = (token) => {
    if (typeof token !== 'string' || token.length < 24) return null;
    const grant = state.grants.find((g) => g.digest === digest(token));
    const article = grant && state.articles[grant.id];
    if (!article || clock() >= Date.parse(grant.expiresAt)
      || article.revision !== grant.revision || article.status !== 'in-review') return null;
    return { article: copy(article), actor: copy(grant.actor), expiresAt: grant.expiresAt };
  };
  const guestDecide = (token, decision, comment, field) => {
    const review = guestReview(token);
    requireThat(review, 'Invalid or expired review link');
    return decide({ ...review.actor, id: `guest:${review.actor.id}` }, review.article.id, decision, comment, field);
  };
  const publicArticle = (id) => copy(state.articles[id]?.release || null);
  const publicIndex = (market) => Object.values(state.articles)
    .filter((a) => a.release && (!market || a.market === market))
    .map((a) => copy(a.release))
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  const recordTraffic = (id, type) => {
    const article = get(id);
    requireThat(article.release, 'Article is not public');
    state.traffic.push({
      at: timestamp(), id, revision: article.release.revision, type,
    });
  };
  const metrics = (market) => {
    const articles = Object.values(state.articles).filter((a) => !market || a.market === market);
    const ids = new Set(articles.map((a) => a.id));
    const events = state.events.filter((e) => ids.has(e.id));
    const traffic = state.traffic.filter((e) => ids.has(e.id));
    const approvedEvents = events.filter((e) => e.action === 'review-approved');
    const durations = approvedEvents.map((e) => {
      const start = state.events.find((s) => s.id === e.id && s.revision === e.revision && s.action === 'review-requested');
      return start ? (Date.parse(e.at) - Date.parse(start.at)) / 60000 : null;
    }).filter((v) => v !== null);
    return {
      source: 'local-pilot',
      articles: articles.length,
      published: articles.filter((a) => a.release).length,
      inReview: articles.filter((a) => a.status === 'in-review').length,
      rejections: events.filter((e) => e.action === 'review-rejected').length,
      rolloutTotal: articles.filter((a) => a.sourceId).length,
      rolloutPublished: articles
        .filter((a) => a.sourceId && a.release?.revision === a.revision).length,
      meanApprovalMinutes: durations.length
        ? durations.reduce((a, b) => a + b, 0) / durations.length : null,
      pageRequests: traffic.filter((e) => e.type === 'page-request').length,
      ctaEvents: traffic.filter((e) => e.type === 'cta').length,
    };
  };
  return {
    create,
    edit,
    submit,
    decide,
    publish,
    schedule,
    rollout,
    grantReview,
    guestReview,
    guestDecide,
    get: (id) => copy(get(id)),
    list: () => copy(Object.values(state.articles)),
    checks: (id) => checks(get(id)),
    currentSource: (id) => currentSource(get(id)),
    publicArticle,
    publicIndex,
    metrics,
    snapshot: () => copy(state),
    restore: (previous) => { state = copy(previous); },
    notifications: (actor) => copy(state.notices
      .filter((n) => n.role === actor.role && (actor.market === '*' || n.market === actor.market))),
    recordPageRequest: (id) => recordTraffic(id, 'page-request'),
    recordConversion: (id) => recordTraffic(id, 'cta'),
    publishDue: () => Object.values(state.articles)
      .filter((a) => a.status === 'scheduled' && Date.parse(a.scheduledAt) <= clock())
      .flatMap((article) => {
        const actor = { id: 'release-service', role: 'publisher', market: '*' };
        if (currentSource(article)) return [publish(actor, article.id)];
        article.status = 'release-blocked';
        const message = 'HQ source changed: approve, re-roll out and reapprove the market revision.';
        event(actor, article, 'release-blocked', { reason: message });
        notify(article, 'author', 'release-blocked', message);
        notify(article, 'publisher', 'release-blocked', message);
        return [];
      }),
  };
}
