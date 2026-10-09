import { sampleFactUpdate } from './connectors.js';
import { chapters, RFP } from './script.js';
import {
  createDemo, transition, checks, radarRows,
} from './model.js';
import {
  tabs, defaultTab, demoPath, chapterFromHash, escape, json, links,
  button, link, field, select, heading, badge, card,
  overview, assetView, deliveryView, marketFromSearch,
} from './view.js';

const KEY = 'bmw-aida-showcase-v4';
let state = createDemo();
let storage = true;
try {
  ['bmw-aida-showcase-v2', 'bmw-aida-showcase-v3'].forEach((old) => localStorage.removeItem(old));
  const saved = JSON.parse(localStorage.getItem(KEY) || 'null');
  if (saved?.demo && saved?.hq && saved?.personas && saved?.markets) state = saved;
} catch (e) { storage = false; }
const requestedMarket = marketFromSearch(window.location.search);
if (requestedMarket) state = transition(state, { type: 'MARKET', market: requestedMarket });
let requests = 0;
let currentSheet;
const main = document.querySelector('#content');
const message = document.querySelector('#message');
let messageTimer;

function notify(text, error = false) {
  message.textContent = text;
  message.classList.toggle('is-error', error);
  clearTimeout(messageTimer);
  messageTimer = setTimeout(() => { message.textContent = ''; }, error ? 12000 : 6500);
}

function apply(action) {
  state = transition(state, action);
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { storage = false; }
  render(); // eslint-disable-line no-use-before-define
  const done = action.type.replaceAll('_', ' ').toLowerCase();
  notify(`${done[0].toUpperCase()}${done.slice(1)} completed.`);
}

const documentOf = () => (state.market === 'hq' ? state.hq : state.markets[state.market]);
const actions = (html) => `<div class="showcase-actions">${html}</div>`;
const list = (items) => `<ul class="showcase-list">${items.map((item) => `<li>${escape(item)}</li>`).join('')}</ul>`;
const toolbar = () => `<div class="showcase-toolbar">${select('Role', 'actor', state.personas.map((p) => [p.id, p.label]), state.actor)}${select('Document context', 'market', ['hq', ...Object.keys(state.markets)].map((m) => [m, m === 'hq' ? 'HQ · English source' : `${m.toUpperCase()} · market copy`]), state.market)}<span class="showcase-clock">Release clock: ${escape(state.clock)}<br>Embargo: ${escape(state.embargo)}</span></div>`;
const quality = () => checks(state, state.market).map((c) => `<li>${badge(c.pass ? 'Pass' : 'Blocked', c.pass ? 'pass' : 'fail')} <strong>${escape(c.label)}</strong><small> ${escape(c.message)}</small></li>`).join('');
const timeline = (events) => `<ol class="showcase-timeline">${events.slice(-10).reverse().map((e) => `<li><strong>${escape(e.type || 'Message')}</strong> · ${escape(e.actor || e.mention || e.team || '')}<small>${escape(e.at)} · revision ${escape(e.revision || '—')} · ${escape(e.market || '')}</small>${e.message ? `<p>${escape(e.message)}</p>` : ''}</li>`).join('') || '<li>No activity yet. Start the workflow.</li>'}</ol>`;

function workflow() {
  const doc = documentOf();
  const isHq = state.market === 'hq';
  const editable = isHq && state.actor === 'hq-author';
  return `${heading('Briefing I · create / review / release', 'One launch. A complete editorial loop.', 'Create, request review, reject with field feedback, correct and approve. Each role maps to AEM identity and permissions.')
    + toolbar()}<div class="showcase-two">${card(isHq ? 'HQ news source' : `${state.market.toUpperCase()} market news`, `${badge(doc.review, doc.review === 'approved' ? 'pass' : 'warn')} <small>Revision ${doc.revision} · approved ${doc.approvedRevision ?? '—'} · ${escape(doc.release)}</small><form id="news-form"><fieldset ${editable ? '' : 'disabled'} style="border:0;padding:16px 0 0">${field('Headline / SEO title', 'title', doc.fields.title)}${field('Description', 'description', doc.fields.description)}${field('Article body', 'body', doc.fields.body, true)}${field('Legal statement', 'legal', doc.fields.legal, true)}</fieldset>${editable ? button('Save source revision', 'SAVE', true) : '<p class="showcase-note">Switch to HQ author and HQ source to edit central fields. Market changes happen in Market rollout.</p>'}</form>${actions(button('Request review', 'SUBMIT', true) + button('Approve revision', 'APPROVE') + button('Preview this revision', 'PREVIEW') + link('Open in Experience Workspace', links(doc.path).edit))}${doc.feedback ? `<div class="showcase-conflict"><strong>Changes requested · ${escape(doc.feedback.field)}</strong><p>${escape(doc.feedback.message)}</p><small>To ${escape(doc.feedback.mention)} · ${escape(doc.feedback.team)} · inbox</small></div>` : ''}`)}${card('Reviewer feedback & quality gates', `${field('Feedback on legal field', 'feedback', 'Please confirm the market-specific WLTP statement before release.', true)}${actions(button('Reject with field feedback', 'REJECT') + button('Assign editorial team', 'ASSIGN') + button('Notify review team', 'NOTIFY'))}<ul class="showcase-list">${quality()}</ul><p class="showcase-note">A release stays blocked until the embargo time and policy allow it. Preview access protection and scheduled publishing enforce the embargo on live pages.</p>`)}</div>`
    + `<div class="showcase-two" style="margin-top:24px">${card('Release preparation', `${field('Scheduled time (timezone required)', 'schedule', doc.schedule?.at || state.embargo)}${actions(button('Schedule release', 'SCHEDULE', true) + button('Advance clock 120 minutes', 'ADVANCE_TIME') + button('Run scheduled release', 'PUBLISH'))}<p>${badge(doc.release, doc.release === 'released' ? 'pass' : 'warn')} · frozen revision ${doc.schedule?.revision ?? '—'}</p><p class="showcase-note">Live pages are scheduled in Experience Workspace with Schedule Publish.</p>`)}${card('Version history & inbox', timeline(state.events) + timeline(state.inbox) + actions(button('Export task handoff', 'EXPORT_TASKS') + button('Record sample insights', 'METRIC')))}</div>`;
}

function translate() {
  const results = Object.values(state.translations);
  return `${heading('Briefing I + III · scaled localization', 'Translate the page. Keep the contract.', 'The connector separates the model choice (BMW can bring its own) from glossary, editorial style, memory and human correction.')
    + toolbar() + card('Batch translation with a human feedback loop', `<p>Choose Translation specialist after current HQ approval. One action produces the DE and FR translations; four markets consume them. Optional automation: the HQ author triggers translation and four-market rollout in one step.</p>${actions(button('Translate DE + FR', 'TRANSLATE', true) + button('Automate translation → rollout', 'AUTO_TRANSLATE_ROLLOUT') + link('Open AEM Translate', 'https://da.live/apps/loc#/moved-permanently/bmw'))}<p class="showcase-note">Model: configurable · Glossary: BMW, eDrive, WLTP · Style: concise premium editorial · Memory: corrections scoped to source text and language.</p>`)
  }<div class="showcase-two" style="margin-top:24px">${results.map((t) => card(`${t.language.toUpperCase()} · revision ${t.revision}`, `<p>${badge(t.sourceRevision === state.hq.revision ? 'Current source' : 'Source changed', t.sourceRevision === state.hq.revision ? 'pass' : 'warn')} · source r${t.sourceRevision}</p>${field('Manual translation correction', `translation-${t.language}`, t.text, true)}${actions(button('Save correction to memory', 'CORRECT_TRANSLATION', false, `data-language="${t.language}"`))}<p class="showcase-note">${escape(t.provenance)}</p><details><summary>Whole-page translation</summary><pre class="showcase-code">${escape(json(t.document || t))}</pre></details>`)).join('') || card('No translations yet', '<p>Approve the HQ revision, switch to Translation specialist and run the batch.</p>')}</div>`;
}

function rollout() {
  const doc = documentOf();
  return `${heading('Briefing III · localize / re-rollout', 'Upstream freshness. Local ownership.', 'One stable component ID lets a moved teaser receive upstream text without losing its local position. Explicit conflicts are resolved property by property—not hidden behind a timestamp.')
    + toolbar()}<div class="showcase-two">${card('HQ orchestration', `<ol class="showcase-list"><li>Approve the current HQ source.</li><li>Translate DE + FR.</li><li>Roll out four populated markets.</li><li>Adapt the Belgian/French copy.</li><li>Update HQ, reapprove and retranslate.</li><li>Re-roll out and resolve differences.</li></ol>${actions(button('Roll out 4 markets', 'ROLLOUT', true) + button('Update HQ story + asset + component', 'UPDATE_SOURCE') + button('Re-roll out approved source', 'REROLLOUT'))}<p class="showcase-note">64-market planning is represented by a manifest. Four markets have content; the other sixty are planning slots.</p>`)}${card('Market adaptation', `${badge(doc.rolledOut ? 'Rolled out' : 'Not rolled out', doc.rolledOut ? 'pass' : 'warn')} <small>Accepted source r${doc.acceptedSourceRevision} / current HQ r${state.hq.revision}</small><p>The adaptation changes hero title, asset, disclaimer and CTA; adds a market section, removes a section and moves a teaser. Feature availability is a separate market gate.</p>${field('Local introduction', 'localIntro', doc.fields.localIntro || 'Belgium launch: contact your local BMW partner.')}${field('Local CTA target', 'localCta', doc.fields.localCta || '/aida/showcase/fr/be/i5')}${actions(button('Apply Belgian adaptation', 'LOCALIZE', true))}<p class="showcase-note">Field policy: central technical facts stay inherited; local intro/CTA and labelled component overrides belong to the market.</p>`)}</div>`
    + `<div class="showcase-two" style="margin-top:24px">${card('Composed market document', doc.components.map((c, i) => `<div class="showcase-note"><strong>${i + 1}. ${escape(c.id)}</strong> · ${escape(c.type)}<br>${escape(c.text || c.headline || '')}${c.asset ? `<small> · asset ref ${escape(c.asset)}</small>` : ''}${c.cta ? `<small> · CTA ${escape(c.cta)}</small>` : ''}</div>`).join(''))}${card('Resolve differences', doc.conflicts.map((c) => `<div class="showcase-conflict"><h3>${escape(c.path)}</h3><p><strong>Local:</strong> ${escape(typeof c.local === 'object' ? JSON.stringify(c.local) : c.local)}</p><p><strong>Upstream:</strong> ${escape(typeof c.upstream === 'object' ? JSON.stringify(c.upstream) : c.upstream)}</p>${field('Manual resolution (text or JSON for a component/order)', `manual-${c.id}`, typeof c.local === 'object' ? JSON.stringify(c.local) : c.local)}${actions(['upstream', 'local', 'manual'].map((choice) => button({ upstream: 'Take upstream', local: 'Keep local', manual: 'Use manual value' }[choice], 'RESOLVE', false, `data-conflict="${escape(c.id)}" data-choice="${choice}"`)).join(''))}</div>`).join('') || '<p>No unresolved conflicts. After an upstream change and re-rollout, conflicts appear here where both sides changed the same property.</p>')}</div>`;
}

function radar() {
  const rows = radarRows(state);
  return `${heading('Briefing I + III · work status', 'The next action, not just a red cell.', 'Source acceptance, translation, review and release are separate evidence. The rollout radar links to authoring and translation; this view adds the workflow state.')
  }<div class="showcase-actions">${link('Open rollout radar', 'https://da.live/app/moved-permanently/bmw/tools/aida/radar/radar?ref=main')}${link('AEM Translate', 'https://da.live/apps/loc#/moved-permanently/bmw')}${button('Export status evidence', 'EXPORT_STATE')}</div>`
    + `<div class="showcase-kpis"><div class="showcase-kpi"><strong>${rows.filter((r) => r.review === 'approved').length} / ${rows.length}</strong><span>Current approvals</span></div><div class="showcase-kpi"><strong>${rows.reduce((sum, r) => sum + r.blockers.length, 0)}</strong><span>Readiness blockers, not publish status</span></div><div class="showcase-kpi"><strong>${state.planning.length}</strong><span>Market planning slots · 4 populated</span></div></div>`
    + `<div class="showcase-table-wrap"><table class="showcase-table spectrum-Table"><thead><tr>${['Context', 'Source acceptance', 'Translation', 'Review / release', 'Blockers', 'Next action'].map((h) => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr><td><strong>${r.market.toUpperCase()}</strong><small>Document r${r.revision} · ${escape(r.context.language)}</small></td><td>Accepted r${r.acceptedSourceRevision}<small>HQ r${state.hq.revision}</small></td><td>${escape(r.translation)}</td><td>${badge(r.review, r.review === 'approved' ? 'pass' : 'warn')}<small>${escape(r.release)}</small></td><td>${r.blockers.length ? escape(r.blockers.join(' ')) : badge('Checks passed', 'pass')}</td><td><a href="#${r.market === 'hq' ? 'workflow' : 'rollout'}" data-context="${r.market}">Resolve / review</a><a href="${links(r.path).edit}" target="_blank" rel="noopener">Edit</a><a href="${links(r.path).preview}" target="_blank" rel="noopener">Preview</a></td></tr>`).join('')}</tbody></table></div>${
      card('HQ feedback and task handoff', `<p>Visits and conversions below are sample values. Task export is a JSON handoff to a task tool such as Workfront.</p><div class="showcase-actions">${button('Generate sample insight', 'METRIC')}${button('Export tasks', 'EXPORT_TASKS')}</div><pre class="showcase-code">${escape(json(state.metrics))}</pre>`)}`;
}

function architecture() {
  return `${heading('Briefing III · architecture', 'Share capabilities. Preserve contexts.', 'Brands, languages, regions, markets, importers and dealers are independent dimensions. Environment promotion is a separate technical axis—not the parent of the content model.')
  }<div class="showcase-grid">${card('Content and domain entities', list(['Car: stable WDH product code, typed facts, variants and feature references', 'Topic: editorial narrative and product/news relationships', 'News: article source plus contextual teaser text', 'Asset reference: provider identity, delivery URL, rights metadata boundary']))}${card('Ownership and reuse', list(['Shared schemas, connectors and editor capabilities', 'Brand-specific components and content spaces; no implicit cross-brand content pool', 'Language sources; translate localizable properties only', 'Market/importer/dealer instances with controlled local ownership']))}${card('Technical environments', list(['DEV: branch code and local test content', 'TEST: tested branch preview', 'STAGE: reviewed content snapshots / release policy', 'LIVE: published content and main code', 'Promotion and identity policy are set up with BMW']))}</div>`
    + `<div class="showcase-two" style="margin-top:24px">${card('Context contract', `<pre class="showcase-code">${escape(json(state.contexts))}</pre>`)}${card('Connector contracts', list(['WDH extract → market sheet → stored HTML facts → optional bounded refresh', 'OTMM → reference/crop/format extension (public BMW catalogue until connected)', 'Salesforce/API → market offer record (sample offer data)', 'Documents → Experience Workspace → AEM HTML, fragments and Markdown', 'BMW AI (bring your own) → glossary/style/memory → human corrections', 'Notifications/tasks/analytics → inbox, task export, KPIs']))}</div>${
      card('A production path, without a platform rewrite', '<p>Connect each integration with an authenticated adapter, authoritative metadata and audit storage. Validate protected preview/media, real identities and publisher separation. Keep the content contracts, authoring extensions and delivery blocks.</p>')}`;
}

const views = {
  overview,
  workflow,
  translate,
  rollout,
  radar,
  architecture,
  assets: assetView,
  delivery: deliveryView,
};

function render() {
  const tab = window.location.hash.slice(1).split('/')[0] || defaultTab;
  document.querySelector('#navigation').innerHTML = tabs.map(([id, label]) => `<a href="#${id}" ${id === tab ? 'aria-current="page"' : ''}>${label}</a>`).join('');
  main.innerHTML = tab === 'path' || !views[tab]
    ? demoPath(chapters, chapterFromHash(window.location.hash, chapters.length), RFP)
    : views[tab]();
  if (!storage) main.insertAdjacentHTML('afterbegin', '<p class="showcase-note">Storage unavailable. Changes last until this tab closes; export evidence first.</p>');
}

function download(name, value) {
  const url = URL.createObjectURL(new Blob([JSON.stringify(value, null, 2)], { type: 'application/json' }));
  const anchor = document.createElement('a');
  anchor.href = url; anchor.download = name; anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function actionFor(target) {
  const type = target.dataset.action;
  const form = new FormData(document.querySelector('#news-form') || document.createElement('form'));
  const value = (name) => main.querySelector(`[name="${CSS.escape(name)}"]`)?.value;
  const doc = documentOf();
  const base = { type };
  switch (type) {
    case 'SAVE': return { ...base, fields: Object.fromEntries(['title', 'description', 'body', 'legal'].map((k) => [k, form.get(k)])) };
    case 'REJECT': return {
      ...base,
      feedback: {
        field: 'legal', message: value('feedback'), mention: state.market === 'hq' ? 'hq-author' : 'market-author', team: 'Legal + editorial review',
      },
    };
    case 'APPROVE': return { ...base, revision: doc.revision };
    case 'TRANSLATE': return { ...base, languages: ['de', 'fr'] };
    case 'CORRECT_TRANSLATION': return { ...base, language: target.dataset.language, text: value(`translation-${target.dataset.language}`) };
    case 'ROLLOUT': case 'REROLLOUT': return { ...base, market: 'hq', markets: ['de', 'at', 'fr', 'be'] };
    case 'LOCALIZE': return {
      ...base,
      fields: {
        localIntro: value('localIntro'), localCta: value('localCta'), headline: 'La BMW i5. Votre lancement local.', heroAsset: '/aida/showcase/data/asset-i5-be', disclaimer: 'Données WLTP indicatives. Conditions du marché belge.',
      },
      components: {
        update: [{ id: 'hero', fields: { headline: 'La BMW i5. Votre lancement local.', asset: '/aida/showcase/data/asset-i5-be', cta: value('localCta') } }], add: [{ id: 'market-contact', type: 'text', text: 'Contactez votre partenaire BMW en Belgique.' }], remove: ['features'], move: [{ id: 'teaser', index: 1 }],
      },
    };
    case 'UPDATE_SOURCE': return {
      ...base,
      market: 'hq',
      fields: {
        title: 'The BMW i5 launch. Now with a charging story.', headline: 'The BMW i5. A new charging chapter.', heroAsset: '/aida/showcase/data/asset-i5-update', disclaimer: 'Updated WLTP statement from source data.',
      },
      components: { update: [{ id: 'hero', fields: { headline: 'The BMW i5. A new charging chapter.', asset: '/aida/showcase/data/asset-i5-update', cta: '/aida/showcase/en/i5' } }, { id: 'teaser', fields: { text: 'BMW i5 eDrive: the updated upstream electric story.' } }, { id: 'features', fields: { text: 'Parking Assistant, updated availability.' } }], add: [{ id: 'charging', type: 'text', text: 'BMW Charging: a new upstream section.' }, { id: 'charging-asset', type: 'image', asset: '/aida/showcase/data/asset-charging-update' }] },
    };
    case 'RESOLVE': {
      const conflict = doc.conflicts.find((c) => c.id === target.dataset.conflict);
      let manual = value(`manual-${conflict.id}`);
      if (conflict.path === 'order' || (conflict.path.startsWith('components.') && conflict.path.split('.').length === 2)) manual = JSON.parse(manual);
      return {
        ...base, conflictId: conflict.id, choice: target.dataset.choice, value: manual,
      };
    }
    case 'SCHEDULE': return { ...base, at: value('schedule') };
    case 'ADVANCE_TIME': return { ...base, minutes: 120 };
    case 'PUBLISH': return { ...base, demoRelease: true };
    case 'ASSIGN': return { ...base, team: 'Legal + editorial review', stakeholder: state.market === 'hq' ? 'hq-reviewer' : 'market-reviewer' };
    case 'NOTIFY': return { ...base, message: 'Review requested. Open the assigned document revision from the radar.', exportTasks: false };
    case 'METRIC': return { ...base, visits: 1200, conversions: 48 };
    default: return base;
  }
}

main.addEventListener('change', (event) => {
  if (event.target.name === 'actor') apply({ type: 'ACTOR', id: event.target.value });
  if (event.target.name === 'market') apply({ type: 'MARKET', market: event.target.value });
});
main.addEventListener('click', async (event) => {
  const context = event.target.closest('[data-context]');
  if (context) apply({ type: 'MARKET', market: context.dataset.context });
  const target = event.target.closest('[data-action]');
  if (!target) return;
  try {
    const type = target.dataset.action;
    if (type === 'PREVIEW') {
      const doc = documentOf();
      const dialog = document.createElement('dialog');
      dialog.id = 'revision-preview';
      dialog.className = 'showcase-card';
      dialog.style.maxWidth = '800px';
      dialog.innerHTML = `<p class="showcase-eyebrow">Revision preview · ${escape(doc.market)} · r${doc.revision}</p><h1>${escape(doc.fields.title)}</h1><p>${escape(doc.fields.description)}</p><p>${escape(doc.fields.localIntro)}</p><p style="white-space:pre-wrap">${escape(doc.fields.body)}</p><p><small>${escape(doc.fields.disclaimer || doc.fields.legal)}</small></p><p class="showcase-note">Exact revision under review. The linked AEM page is published separately; protected review links come from AEM preview access control.</p>${button('Close preview', 'CLOSE_PREVIEW')}`;
      dialog.querySelector('button').addEventListener('click', () => { dialog.close(); dialog.remove(); });
      document.body.append(dialog); dialog.showModal(); return;
    }
    if (type === 'EXPORT_STATE') { download('bmw-showcase-evidence.json', state); return; }
    if (type === 'EXPORT_TASKS') { download('bmw-showcase-task-handoff.json', { demo: true, inbox: state.inbox, events: state.events }); return; }
    if (type.startsWith('EXTEND_')) {
      document.querySelector('#extension').style.aspectRatio = type === 'EXTEND_WIDE' ? '16/9' : '4/5';
      notify('Format extended with neutral canvas. Not generated pixels or AI outpainting.'); return;
    }
    if (type === 'SAMPLE_WDH') {
      const result = sampleFactUpdate(currentSheet);
      document.querySelector('#delivery-result').textContent = json(result);
      notify(result.boundary); return;
    }
    if (type === 'REFRESH_DATA') {
      target.disabled = true;
      const start = performance.now();
      requests += 1;
      const response = await fetch('/aida/showcase/data/wdh-de.json');
      if (!response.ok) throw new Error(`WDH response ${response.status}`);
      const text = await response.text();
      document.querySelector('#request-count').textContent = requests;
      document.querySelector('#request-time').textContent = `${Math.round(performance.now() - start)} ms`;
      document.querySelector('#request-bytes').textContent = `${new TextEncoder().encode(text).length.toLocaleString()} B`;
      document.querySelector('#delivery-result').textContent = JSON.stringify(JSON.parse(text), null, 2);
      currentSheet = JSON.parse(text);
      target.disabled = false; return;
    }
    apply(actionFor(target));
  } catch (error) { target.disabled = false; notify(error.message, true); }
});
document.querySelector('#reset').addEventListener('click', () => {
  // eslint-disable-next-line no-alert
  if (window.confirm('Start the demo over? Published pages are unchanged.')) apply({ type: 'RESET' });
});
window.addEventListener('hashchange', render);
document.addEventListener('keydown', (event) => {
  const tab = window.location.hash.slice(1).split('/')[0] || defaultTab;
  if (tab !== 'path' || event.target.closest('input, textarea, select') || event.altKey || event.metaKey || event.ctrlKey) return;
  const step = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
  if (!step) return;
  const next = chapterFromHash(window.location.hash, chapters.length) + step;
  if (next >= 0 && next < chapters.length) window.location.hash = `#path/${next}`;
});
render();
