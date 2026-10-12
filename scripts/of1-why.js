/**
 * "Why this page?" demo widget for the generative home page.
 * Shows which audience was matched and why, the figures behind it from the bmw.de
 * audience report, which parts are AI-written, and lets the presenter flip audiences.
 */
import { AUDIENCES } from './audience.js';

const AI_WRITTEN = 'Hero headline, hero subline and section heading are written by OF1 per visitor.';
const LOCKED = 'Links, prices, legal text and images are authored and never generated.';

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function signalRows(signals) {
  const rows = [
    ['Device', signals.device],
    ['Ad click ID', signals.clickId],
    ['UTM source / medium', [signals.utmSource, signals.utmMedium].filter(Boolean).join(' / ') || null],
    ['Campaign / keyword', signals.campaign],
    ['Referrer', signals.referrer],
    ['Demo override', signals.override],
  ];
  return rows.map(([k, v]) => [k, v || 'none']);
}

function switchTo(key) {
  const url = new URL(window.location.href);
  url.searchParams.set('aud', key);
  window.location.assign(url.toString());
}

export default function init(resolution) {
  if (document.querySelector('.of1-why')) return;
  const meta = AUDIENCES[resolution.audience];
  const root = el('aside', 'of1-why');
  root.setAttribute('aria-label', 'Why this page');

  const toggle = el('button', 'of1-why-toggle');
  toggle.type = 'button';
  toggle.setAttribute('aria-expanded', 'false');
  toggle.append(el('span', 'of1-why-dot'), el('span', 'of1-why-pill', `Audience: ${meta.label}`));

  const panel = el('div', 'of1-why-panel');
  panel.hidden = true;
  panel.append(el('h2', 'of1-why-title', 'Why this page?'));

  const matched = el('p', 'of1-why-matched');
  matched.append(el('strong', '', meta.label), document.createTextNode(` · ${meta.share} · ${meta.mobile}`));
  panel.append(matched, el('p', 'of1-why-reason', `Rule: ${resolution.rule}. ${resolution.why}.`));

  const sig = el('dl', 'of1-why-signals');
  signalRows(resolution.signals).forEach(([k, v]) => {
    sig.append(el('dt', '', k), el('dd', '', v));
  });
  panel.append(el('h3', '', 'Signals detected'), sig);

  panel.append(
    el('h3', '', 'What the data shows'),
    el('p', '', meta.today),
    el('h3', '', 'What this page does about it'),
    el('p', '', meta.best),
    el('h3', '', 'AI-written vs locked'),
    el('p', '', AI_WRITTEN),
    el('p', '', LOCKED),
  );

  const switcher = el('div', 'of1-why-switch');
  switcher.append(el('h3', '', 'Switch audience'));
  Object.entries(AUDIENCES).forEach(([key, a]) => {
    const b = el('button', 'of1-why-option', a.label);
    b.type = 'button';
    if (key === resolution.audience) b.setAttribute('aria-pressed', 'true');
    b.addEventListener('click', () => switchTo(key));
    switcher.append(b);
  });
  panel.append(switcher);
  panel.append(el('p', 'of1-why-note', 'Source: bmw.de Audiences and Landing Page Redesign (AEM Optel, 10 Aug to 9 Oct 2026).'));

  toggle.addEventListener('click', () => {
    const open = panel.hidden;
    panel.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
  });

  root.append(panel, toggle);
  document.body.append(root);
  const css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = `${window.hlx.codeBasePath}/styles/of1-why.css`;
  document.head.append(css);
}
