export const tabs = [
  ['path', 'Demo path'], ['overview', 'Start here'], ['workflow', 'News workflow'], ['translate', 'Translate'],
  ['rollout', 'Market rollout'], ['radar', 'Action radar'], ['architecture', 'Architecture'],
  ['assets', 'Assets'], ['delivery', 'Delivery'],
];

export const defaultTab = 'path';

export const json = (value) => JSON.stringify(value, (key, v) => (key === 'demo' ? undefined : v), 2);

export const escape = (value = '') => String(value).replace(/[&<>"']/g, (char) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[char]));

export function marketFromSearch(search) {
  const market = new URLSearchParams(search).get('market');
  return ['hq', 'de', 'at', 'fr', 'be'].includes(market) ? market : null;
}

export function links(path) {
  if (!/^\/aida\/showcase\/[a-z0-9/-]+$/.test(path)) throw new Error('Invalid showcase path');
  const preview = `https://main--bmw--moved-permanently.aem.page${path}`;
  return {
    edit: `https://da.live/canvas#/moved-permanently/bmw${path}`,
    preview,
    live: `https://main--bmw--moved-permanently.aem.live${path}`,
    markdown: `${preview}.md`,
    fragment: `${preview}.plain.html`,
  };
}

export const button = (label, action, accent = false, attrs = '') => `<button type="button" class="spectrum-Button spectrum-Button--${accent ? 'accent spectrum-Button--fill' : 'secondary spectrum-Button--outline'}" data-action="${escape(action)}" ${attrs}><span class="spectrum-Button-label">${escape(label)}</span></button>`;
export const link = (label, href) => `<a class="spectrum-Button spectrum-Button--secondary spectrum-Button--outline" href="${escape(href)}" ${href.startsWith('#') ? '' : 'target="_blank" rel="noopener"'}><span class="spectrum-Button-label">${escape(label)}</span></a>`;
export const field = (label, name, value, multiline = false) => `<label class="showcase-field"><span class="spectrum-FieldLabel">${escape(label)}</span><span class="spectrum-Textfield">${multiline ? `<textarea class="spectrum-Textfield-input" name="${escape(name)}">${escape(value)}</textarea>` : `<input class="spectrum-Textfield-input" name="${escape(name)}" value="${escape(value)}">`}</span></label>`;
export const select = (label, name, options, value) => `<label class="showcase-field"><span class="spectrum-FieldLabel">${escape(label)}</span><select class="spectrum-Picker" name="${escape(name)}">${options.map(([id, text]) => `<option value="${escape(id)}" ${id === value ? 'selected' : ''}>${escape(text)}</option>`).join('')}</select></label>`;
export const heading = (eyebrow, title, text) => `<div class="showcase-eyebrow">${escape(eyebrow)}</div><h1>${escape(title)}</h1><p class="showcase-lead">${escape(text)}</p>`;
export const badge = (text, kind = '') => `<span class="showcase-status ${kind ? `is-${kind}` : ''}">${escape(text)}</span>`;
export const card = (title, body) => `<section class="showcase-card"><h2>${escape(title)}</h2>${body}</section>`;

export function overview() {
  const cards = [
    ['Home', 'A composed launch story: i5, iX3 video, news and market offer.', '/aida/showcase/en/home'],
    ['BMW i5', 'One vehicle entity, repeated facts, feature availability and reusable news.', '/aida/showcase/en/i5'],
    ['E-mobility', 'Editorial topics meet product entities and contextual teasers.', '/aida/showcase/en/e-mobility'],
  ];
  return `${heading('BMW RfP · Briefings I + III', 'Composable does not mean headless.', 'A complete editorial journey on real AEM pages, authored in Experience Workspace. Start with the experience. Then change the operating model behind it.')
  }<div class="showcase-grid">${cards.map(([title, text, path]) => {
    const urls = links(path);
    return card(title, `<p>${text}</p><div class="showcase-actions">${link('Open experience', urls.preview)}${link('Edit in Experience Workspace', urls.edit)}</div>`);
  }).join('')}</div>`
    + `<div class="showcase-kpis"><div class="showcase-kpi"><strong>3 compositions</strong><span>Home · car · topic, with shared news</span></div><div class="showcase-kpi"><strong>4 markets</strong><span>DE · AT · FR · BE, plus 64-market planning</span></div><div class="showcase-kpi"><strong>1 connected story</strong><span>Create → review → translate → adapt → release</span></div></div>${
      card('Walk the workflow', `<p>Roles, review, embargo, AI translation, notifications and release scheduling, end to end. In production they run on AEM identity, workflow and publishing. The linked editor and pages are live AEM.</p><div class="showcase-actions">${link('Start the news workflow', '#workflow')}${link('Inspect the architecture', '#architecture')}</div>`)}`;
}

export function assetView() {
  return `${heading('Assets · DAM connector', 'Find. Frame. Reference.', 'A useful authoring experience now, with a connector ready for BMW’s DAM. Today it searches already-public BMW assets; OTMM, its rights and private permissions plug into the same connector.')
  }<div class="showcase-note">Native insertion in Experience Workspace and Scene7/COSY delivery.</div>`
    + `<div class="showcase-actions">${link('Open BMW asset picker', '../asset-picker/asset-picker.html?path=/aida/showcase/fr/be/i5')}${link('Edit the Belgian car page', links('/aida/showcase/fr/be/i5').edit)}</div>`
    + '<iframe title="BMW asset catalogue" src="../asset-picker/asset-picker.html?path=/aida/showcase/fr/be/i5" style="width:100%;height:690px;border:1px solid #ddd;border-radius:12px;margin-top:24px"></iframe>'
    + `<div class="showcase-two" style="margin-top:24px">${card('Extend a format, without inventing pixels', `<p>Keep the complete photograph and extend a neutral canvas to the requested format. Generative extension can be added at the same step.</p><div class="showcase-actions">${button('16:9 canvas', 'EXTEND_WIDE')}${button('4:5 canvas', 'EXTEND_TALL')}</div><div id="extension" style="margin-top:16px;background:#e8e8e8;aspect-ratio:16/9;display:grid;place-items:center"><img alt="BMW i5 on an extended neutral canvas" src="https://bmw.scene7.com/is/image/BMW/freedom-in-frame-i5-bev-2:3to2?fit=constrain,1&wid=800" style="width:100%;height:100%;object-fit:contain"></div>`)}${card('Connector contract', '<ul class="showcase-list"><li>Stable asset ID, delivery URL and provider</li><li>Brand / family / model / market metadata</li><li>Approval, rights and expiry: unknown in the public fallback</li><li>Scene7 crops and sharpen preserve upstream reference</li><li>COSY vehicle renders retain configuration parameters</li><li>Video uses an observed BMW delivery reference</li></ul><p>Replace the catalogue adapter—not the author’s workflow—when OTMM is connected. Assets are referenced, not copied.</p>')}</div>`;
}

export function deliveryView() {
  const urls = links('/aida/showcase/en/i5');
  return `${heading('Delivery · useful HTML first', 'Compose once. Deliver openly.', 'The initial page carries content and facts. JavaScript progressively decorates the experience; a bounded refresh can check changing data without rebuilding the page as a headless application.')
  }<div class="showcase-grid">${card('Read the web page', `<p>Content is already present in the delivered document. AEM delivers complete HTML from the edge; no per-request application rendering.</p>${link('Open car page', urls.preview)}`)}${card('Reuse the same content', `<p>Markdown for agents and HTML fragments for lightweight reuse. No extra API assembly tier is required.</p><div class="showcase-actions">${link('Markdown', urls.markdown)}${link('HTML fragment', urls.fragment)}</div>`)}${card('Refresh one data source', `<p>Explicit action, one sheet request. Request counters here are actual instrumented fetches, not an estimate of global production traffic.</p>${`${button('Refresh WDH facts', 'REFRESH_DATA', true)}<div class="showcase-actions">${button('Apply sample WDH update', 'SAMPLE_WDH')}</div><p class="showcase-note">After loading the real sheet, propagate a labelled sample value to repeated stored HTML, Markdown and NewsArticle vehicle metadata. Nothing is published.</p>`}`)}</div>`
    + `<div class="showcase-kpis"><div class="showcase-kpi"><strong id="request-count">0</strong><span>WDH refresh requests</span></div><div class="showcase-kpi"><strong id="request-time">—</strong><span>Last fetch duration</span></div><div class="showcase-kpi"><strong id="request-bytes">—</strong><span>Last response payload bytes</span></div></div><pre id="delivery-result" class="showcase-code">Click Refresh WDH facts to inspect the actual payload.</pre>${
      card('Editorial insights and real telemetry', '<p>The workflow uses sample visits and conversions to explain the HQ feedback loop. AEM operational telemetry measures real traffic and Core Web Vitals; BMW’s analytics and task platform connect at the same points.</p>')}`;
}

export function chapterFromHash(hash, count) {
  const n = Number.parseInt(hash.replace(/^#path\/?/, ''), 10);
  if (!Number.isInteger(n) || n < 0) return 0;
  return Math.min(n, count - 1);
}

const showLink = ({ label, href }) => link(label, href);

export function demoPath(chapters, requested = 0, labels = {}) {
  const index = Math.max(0, Math.min(requested, chapters.length - 1));
  const chapter = chapters[index];
  const nav = chapters.map((c, i) => `<li><a href="#path/${i}" ${i === index ? 'aria-current="step"' : ''}><span>${i + 1}</span>${escape(c.title)}</a></li>`).join('');
  const prev = index > 0 ? `<a class="spectrum-Button spectrum-Button--secondary spectrum-Button--outline" href="#path/${index - 1}"><span class="spectrum-Button-label">← ${escape(chapters[index - 1].title)}</span></a>` : '<span></span>';
  const next = index < chapters.length - 1 ? `<a class="spectrum-Button spectrum-Button--accent spectrum-Button--fill" href="#path/${index + 1}"><span class="spectrum-Button-label">${escape(chapters[index + 1].title)} →</span></a>` : '';
  const refs = chapter.rfp.map((r) => `<span class="showcase-status">${escape(labels[r] || r)}</span>`).join(' ');
  return `<div class="showcase-path"><ol class="showcase-path-nav" aria-label="Demo chapters">${nav}</ol><article class="showcase-path-chapter">`
    + `<div class="showcase-eyebrow">Chapter ${index + 1} of ${chapters.length}</div><h1>${escape(chapter.title)}</h1><p class="showcase-path-refs">${refs}</p>`
    + `${card('Show', `<div class="showcase-actions">${chapter.show.map(showLink).join('')}</div>`)}`
    + `${card('Tell', `<ul class="showcase-list">${chapter.tell.map((t) => `<li>${escape(t)}</li>`).join('')}</ul>`)}`
    + `<p class="showcase-path-recap"><strong>Recap</strong> ${escape(chapter.recap)}</p>`
    + `<div class="showcase-path-step">${prev}${next}</div></article></div>`;
}
