export const tabs = [
  ['overview', 'Start here'], ['workflow', 'News workflow'], ['translate', 'Translate'],
  ['rollout', 'Market rollout'], ['radar', 'Action radar'], ['architecture', 'Architecture'],
  ['assets', 'Assets'], ['delivery', 'Delivery'],
];

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
  return `${heading('BMW RfP · Briefings I + III', 'Composable does not mean headless.', 'A complete editorial journey, connected to real Document Authoring and Edge Delivery pages. Start with the experience. Then change the operating model behind it.')
  }<div class="showcase-grid">${cards.map(([title, text, path]) => {
    const urls = links(path);
    return card(title, `<p>${text}</p><div class="showcase-actions">${link('Open experience', urls.preview)}${link('Edit in DA', urls.edit)}</div>`);
  }).join('')}</div>`
    + `<div class="showcase-kpis"><div class="showcase-kpi"><strong>3 compositions</strong><span>Home · car · topic, with shared news</span></div><div class="showcase-kpi"><strong>4 market fixtures</strong><span>DE · AT · FR · BE, plus 64-market planning</span></div><div class="showcase-kpi"><strong>1 connected story</strong><span>Create → review → translate → adapt → release</span></div></div>${
      card('Rehearse without extra access', `<p>Each session has its own browser-local state. Roles, review, embargo, AI, notifications and the release scheduler are explicit simulations—not native security or production publishing. The linked DA editor and published EDS fixtures are real.</p><div class="showcase-actions">${link('Start the news workflow', '#workflow')}${link('Inspect the architecture', '#architecture')}</div>`)}`;
}

export function assetView() {
  return `${heading('Assets · OTMM substitute', 'Find. Frame. Reference.', 'A useful authoring experience now, with a connector boundary ready for BMW’s chosen DAM. The catalogue contains already-public assets, not authoritative rights or private DAM permissions.')
  }<div class="showcase-note">Native DA insertion and real Scene7/COSY delivery. The OTMM catalogue and generative-extension capability are substituted; no BMW IMS entitlement is assumed.</div>`
    + `<div class="showcase-actions">${link('Open BMW asset picker', '../asset-picker/asset-picker.html?path=/aida/showcase/fr/be/i5')}${link('Edit the Belgian car page', links('/aida/showcase/fr/be/i5').edit)}</div>`
    + '<iframe title="BMW asset catalogue" src="../asset-picker/asset-picker.html?path=/aida/showcase/fr/be/i5" style="width:100%;height:690px;border:1px solid #ddd;border-radius:12px;margin-top:24px"></iframe>'
    + `<div class="showcase-two" style="margin-top:24px">${card('Extend a format, without inventing pixels', `<p>Layout-extension substitute: retain the complete selected photograph and extend a neutral canvas to the requested format. This is not AI outpainting.</p><div class="showcase-actions">${button('16:9 canvas', 'EXTEND_WIDE')}${button('4:5 canvas', 'EXTEND_TALL')}</div><div id="extension" style="margin-top:16px;background:#e8e8e8;aspect-ratio:16/9;display:grid;place-items:center"><img alt="BMW i5 on an extended neutral canvas" src="https://bmw.scene7.com/is/image/BMW/freedom-in-frame-i5-bev-2:3to2?fit=constrain,1&wid=800" style="width:100%;height:100%;object-fit:contain"></div>`)}${card('Connector contract', '<ul class="showcase-list"><li>Stable asset ID, delivery URL and provider</li><li>Brand / family / model / market metadata</li><li>Approval, rights and expiry: unknown in the public fallback</li><li>Scene7 crops and sharpen preserve upstream reference</li><li>COSY vehicle renders retain configuration parameters</li><li>Video uses an observed BMW delivery reference</li></ul><p>Replace the catalogue adapter—not the author’s workflow—when OTMM becomes available. A public reference is not a copied media object or a governance guarantee.</p>')}</div>`;
}

export function deliveryView() {
  const urls = links('/aida/showcase/en/i5');
  return `${heading('Delivery · useful HTML first', 'Compose once. Deliver openly.', 'The initial page carries content and facts. JavaScript progressively decorates the experience; a bounded refresh can check changing data without rebuilding the page as a headless application.')
  }<div class="showcase-grid">${card('Read the web page', `<p>Content is already present in the server-delivered document. EDS delivers HTML; this is not per-request application server rendering.</p>${link('Open car page', urls.preview)}`)}${card('Reuse the same content', `<p>Markdown for agents and HTML fragments for lightweight reuse. No extra API assembly tier is required.</p><div class="showcase-actions">${link('Markdown', urls.markdown)}${link('HTML fragment', urls.fragment)}</div>`)}${card('Refresh one data source', `<p>Explicit action, one sheet request. Request counters here are actual instrumented fetches, not an estimate of global production traffic.</p>${`${button('Refresh WDH facts', 'REFRESH_DATA', true)}<div class="showcase-actions">${button('Apply mock WDH update', 'MOCK_WDH')}</div><p class="showcase-note">After loading the real sheet, propagate a labelled synthetic value to repeated stored HTML, Markdown and NewsArticle vehicle metadata. Nothing is published.</p>`}`)}</div>`
    + `<div class="showcase-kpis"><div class="showcase-kpi"><strong id="request-count">0</strong><span>Explicit data refresh requests in this session</span></div><div class="showcase-kpi"><strong id="request-time">—</strong><span>Last fetch duration, measured locally</span></div><div class="showcase-kpi"><strong id="request-bytes">—</strong><span>Last response payload bytes</span></div></div><pre id="delivery-result" class="showcase-code">Click Refresh WDH facts to inspect the actual payload.</pre>${
      card('Separate simulated editorial insights from real telemetry', '<p>The workflow shows generated visit/conversion fixtures to explain the HQ feedback loop. These are not BMW production analytics. EDS Operational Telemetry and a chosen analytics/task platform are separate integrations; attach them at the connector boundary.</p>')}`;
}
