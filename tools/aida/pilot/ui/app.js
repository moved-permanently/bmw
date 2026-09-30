/* eslint-disable no-use-before-define */
const $ = (selector) => document.querySelector(selector);
let csrf;
let state;
let selected;
const message = (text, error = false) => {
  $('#message').textContent = text;
  $('#message').className = error ? 'error' : 'success';
};
const element = (tag, text, className) => Object.assign(document.createElement(tag), {
  textContent: text, ...(className ? { className } : {}),
});
const isoInput = (iso) => iso.slice(0, 16);
async function api(path, data) {
  const response = await fetch(path, data ? {
    method: 'POST', headers: { 'content-type': 'application/json', ...(csrf ? { 'x-pilot-csrf': csrf } : {}) }, body: JSON.stringify(data),
  } : {});
  const body = await response.json();
  if (!response.ok) throw new Error(body.error || `Request failed: ${response.status}`);
  return body;
}
function link(text, href) {
  const anchor = element('a', text);
  anchor.href = href;
  anchor.target = '_blank';
  anchor.rel = 'noreferrer';
  return anchor;
}
function button(text, callback) {
  const control = element('button', text);
  control.type = 'button';
  control.addEventListener('click', async () => {
    control.disabled = true;
    try {
      await callback();
    } catch (error) {
      message(error.message, true);
    } finally {
      control.disabled = false;
    }
  });
  return control;
}
async function command(action, extra = {}) {
  const result = await api('/api/action', { action, id: selected, ...extra });
  await refresh();
  message(`${action}: recorded in the local rehearsal. No native EDS publication occurred.`);
  return result;
}
function listNotices() {
  const inbox = $('#notifications');
  inbox.replaceChildren();
  const notices = state.notifications.slice(-15).reverse();
  if (!notices.length) inbox.append(element('p', 'No notifications for this persona yet.', 'muted'));
  notices.forEach((n) => {
    const item = element('p', `${n.type} · ${n.id}\n${n.message}\n${n.at}`, 'inbox-item');
    inbox.append(item);
  });
}
function showMetrics() {
  const scope = ['hq', '*'].includes(state.actor.market) ? 'HQ' : state.actor.market.toUpperCase();
  $('#insights-title').textContent = `${scope} insights · this rehearsal only`;
  const labels = {
    published: 'Articles with a local public release',
    inReview: 'Revisions in review',
    rejections: 'Review rejections',
    rolloutTotal: 'Market copies created',
    rolloutPublished: 'Market copies on current public revision',
    meanApprovalMinutes: 'Mean approval time (minutes)',
    pageRequests: 'Local HTML requests',
    ctaEvents: 'Local demo CTA events',
  };
  $('#metrics').replaceChildren(...Object.entries(labels).map(([key, title]) => {
    const card = element('div', '', 'metric');
    const value = state.metrics[key];
    let display = value ?? '—';
    if (typeof value === 'number' && !Number.isInteger(value)) display = value.toFixed(1);
    card.append(element('strong', display), element('span', title));
    return card;
  }));
}
function showArticles() {
  const area = $('#articles');
  area.replaceChildren();
  if (!state.articles.length) area.append(element('p', 'No stories. Create a draft below.', 'muted'));
  state.articles.forEach((article) => {
    const control = button(`${article.market.toUpperCase()} · ${article.title || article.slug}\n${article.status} · revision ${article.revision}${article.sourceId ? ` · HQ revision ${article.sourceRevision}` : ' · originated here'}`, () => { selected = article.id; showEditor(); showAudit(); });
    control.className = 'story';
    area.append(control);
  });
}
function showAudit() {
  const audit = $('#audit');
  audit.replaceChildren();
  state.events.filter((e) => !selected || e.id === selected).slice(-20).reverse().forEach((e) => audit.append(element('p', `${e.action} · r${e.revision} · ${e.actor}\n${e.comment ? `${e.field}: ${e.comment}\n` : ''}${e.at}`, 'audit-item')));
  const article = state.articles.find((a) => a.id === selected);
  if (article?.versions.length > 1) {
    const details = document.createElement('details');
    details.append(element('summary', 'Compare the two latest revisions'));
    const [previous, latest] = article.versions.slice(-2);
    const changes = Object.keys(latest.fields)
      .filter((k) => latest.fields[k] !== previous.fields[k]);
    changes.forEach((key) => {
      const text = `${key}:\nBEFORE: ${previous.fields[key]}\nAFTER: ${latest.fields[key]}`;
      details.append(element('p', text, 'audit-item'));
    });
    if (!changes.length) {
      details.append(element('p', 'No textual changes; source revision or workflow changed.'));
    }
    audit.append(details);
  }
}
function showEditor() {
  const editor = $('#editor');
  editor.replaceChildren();
  const article = state.articles.find((a) => a.id === selected);
  if (!article) { editor.append(element('p', 'Select an article.')); return; }
  const { actor } = state;
  editor.append(element('h3', `${article.title} · r${article.revision}`), element('p', `Status: ${article.status} · embargo ${article.embargo}${article.scheduledAt ? ` · release ${article.scheduledAt}` : ''}`));
  const publicPath = `/news/${article.id}`;
  const folder = {
    hq: 'en', de: 'de/de', at: 'de/at', fr: 'fr/fr', be: 'fr/be',
  }[article.market];
  const nativePath = `/aida/${folder}/news/${article.slug}`;
  const links = element('p', '', 'links');
  links.append(link('Public route (404 until release)', publicPath), link('DA editor (separate source)', `https://da.live/edit#/moved-permanently/bmw${nativePath}`));
  if (article.approvedRevision === article.revision) links.append(link('Download approved DA HTML (after embargo)', `/api/export/${article.id}`));
  editor.append(links);
  if (article.sourceId) editor.append(element('p', 'HQ fields are centrally owned in this pilot. Local introduction and CTA survive source updates. This is an explicit field contract, not general DA field-level permissions.', 'notice'));
  const form = document.createElement('form');
  const editable = actor.role === 'author' && actor.market === article.market && article.status !== 'in-review';
  ['title', 'description', 'body', 'legal', 'embargo', 'localIntro', 'localCta'].forEach((field) => {
    const label = element('label', field);
    const input = document.createElement(['body', 'legal', 'localIntro'].includes(field) ? 'textarea' : 'input');
    input.name = field;
    if (field === 'embargo') { input.type = 'datetime-local'; input.value = isoInput(article[field]); } else input.value = article[field];
    input.disabled = !editable || (article.sourceId && !['localIntro', 'localCta'].includes(field));
    label.append(input);
    form.append(label);
  });
  if (editable) {
    const save = element('button', 'Save revision (invalidates approval/schedule)');
    form.append(save);
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      try {
        const fields = Object.fromEntries(new FormData(form));
        if (fields.embargo) fields.embargo = `${fields.embargo}:00Z`;
        await command('edit', { fields });
      } catch (error) { message(error.message, true); }
    });
  }
  editor.append(form);
  const controls = element('div', '', 'controls');
  if (actor.role === 'author' && actor.market === article.market) {
    if (['draft', 'changes-requested'].includes(article.status)) controls.append(button('Submit for review', () => command('submit')));
    if (article.market === 'hq' && article.approvedRevision === article.revision) controls.append(button('Roll out / re-roll out to DE, AT, FR, BE', () => command('rollout', { markets: ['de', 'at', 'fr', 'be'] })));
  }
  if (actor.role === 'reviewer' && actor.market === article.market && article.status === 'in-review') {
    const fieldLabel = element('label', 'Feedback field');
    const field = document.createElement('select');
    ['title', 'description', 'body', 'legal', 'localIntro', 'localCta'].forEach((key) => field.append(new Option(key, key)));
    fieldLabel.append(field);
    const feedback = document.createElement('textarea');
    feedback.placeholder = 'Review feedback (required for rejection)';
    feedback.setAttribute('aria-label', 'Review feedback');
    controls.append(
      fieldLabel,
      feedback,
      button('Reject & unlock', () => command('reject', { field: field.value, comment: feedback.value })),
      button('Approve current revision (does NOT publish)', () => command('approve', { field: field.value, comment: feedback.value })),
      button('Create one-hour guest review link', async () => {
        const result = await command('review-link');
        const panel = element('p', '', 'notice');
        panel.append(link('Open scoped guest review', result.path), document.createTextNode(` · expires ${result.expiresAt}. Share only with authorized reviewers on this machine. Bearer capability, not named-user identity. No email sent.`));
        editor.append(panel);
      }),
    );
  }
  if (actor.role === 'publisher' && ['approved', 'scheduled'].includes(article.status)) {
    const when = document.createElement('input');
    when.type = 'datetime-local';
    when.setAttribute('aria-label', 'Local release time UTC');
    const earliest = Math.max(Date.now() + 90000, Date.parse(article.embargo));
    when.value = isoInput(new Date(earliest).toISOString());
    controls.append(button('Publish locally now', async () => {
      // eslint-disable-next-line no-alert
      if (window.confirm('Release this approved revision to localhost only? This does not publish to EDS.')) await command('publish');
    }), element('label', 'Release time UTC'), when, button('Schedule local release', () => command('schedule', { when: `${when.value}:00Z` })));
  }
  editor.append(controls);
}
async function refresh() {
  if (!csrf) return;
  state = await api('/api/state');
  $('#identity').textContent = `${state.actor.label} · simulated persona`;
  showMetrics(); showArticles(); showEditor(); listNotices(); showAudit();
}
$('#actor').addEventListener('change', async () => {
  if (!$('#actor').value) return;
  try {
    const session = await api('/api/session', { actorId: $('#actor').value });
    csrf = session.csrf;
    selected = undefined;
    await refresh();
    message(`Acting as ${session.actor.label}. Identity is simulated; permission checks run on the local server.`);
  } catch (error) { message(error.message, true); }
});
$('#refresh').addEventListener('click', () => refresh().catch((error) => message(error.message, true)));
$('#create').embargo.value = isoInput(new Date(Date.now() + 90000).toISOString());
$('#create').addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!state) { message('Select an author persona.', true); return; }
  try {
    const fields = Object.fromEntries(new FormData(event.currentTarget));
    fields.embargo = `${fields.embargo}:00Z`;
    fields.market = state.actor.market;
    const article = await api('/api/action', { action: 'create', fields });
    selected = article.id;
    await refresh();
    message('Draft created. All public formats remain unavailable until release.');
  } catch (error) { message(error.message, true); }
});
api('/api/actors').then(({ actors }) => actors.forEach((actor) => $('#actor').append(new Option(actor.label, actor.id)))).catch((error) => message(error.message, true));
