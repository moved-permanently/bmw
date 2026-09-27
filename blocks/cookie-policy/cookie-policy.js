import { loadConsent, showConsentSettings } from '../../scripts/bmw-consent.js';

/*
 * Cookie Policy (source .cookie-policy: an empty .epaas-policy-page-container that the BMW ePaaS
 * consent controller fills with the cookie policy and the per-category consent settings when it
 * initialises). The block provides that container, then starts the consent controller
 * (scripts/bmw-consent.js, idempotent). While ePaaS is unreachable (fallback consent banner),
 * the authored text is shown with a button that opens the consent settings.
 * Content: one cell, the label of the fallback button (e.g. "Cookie-Einstellungen").
 */
export default function decorate(block) {
  const label = block.textContent.replace(/\s+/g, ' ').trim() || 'Cookie-Einstellungen';
  const container = document.createElement('div');
  container.className = 'epaas-policy-page-container';
  const fallback = document.createElement('div');
  fallback.className = 'cookie-policy-fallback';
  fallback.hidden = true;
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'button';
  button.textContent = label;
  button.addEventListener('click', () => showConsentSettings());
  fallback.append(button);
  block.replaceChildren(container, fallback);

  // the container is in the DOM now: starting the consent controller here (idempotent, also
  // started by scripts.js) lets ePaaS find it when it initialises
  loadConsent().then((mode) => { fallback.hidden = mode !== 'fallback'; });
}
