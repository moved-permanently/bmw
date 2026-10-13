import { isAuthoringFrame } from './bmw-utils.js';

const STORAGE_KEY = 'bmw-showcase-acknowledged';
let started = false;

function isAcknowledged() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

function isExcluded() {
  return isAuthoringFrame()
    || window.self !== window.top
    || window.location.pathname.startsWith('/tools/');
}

export default async function showShowcaseNotice() {
  if (started || isExcluded() || isAcknowledged()) return;
  started = true;

  const styled = await new Promise((resolve) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `${window.hlx?.codeBasePath || ''}/scripts/bmw-showcase-notice.css`;
    link.onload = () => resolve(true);
    link.onerror = () => resolve(false);
    document.head.append(link);
  });
  if (!styled || isExcluded() || isAcknowledged()) return;

  const dialog = document.createElement('dialog');
  dialog.className = 'bmw-showcase-notice';
  dialog.lang = 'en';
  const title = document.createElement('h2');
  title.id = 'bmw-showcase-notice-title';
  title.textContent = 'Technical showcase';
  const text = document.createElement('p');
  text.id = 'bmw-showcase-notice-description';
  text.textContent = 'This page is a technical showcase, not an official BMW website. '
    + 'It is for demonstration purposes only.';
  const acknowledge = document.createElement('button');
  acknowledge.type = 'button';
  acknowledge.className = 'button primary';
  acknowledge.textContent = 'I understand';
  acknowledge.addEventListener('click', () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, 'true');
    } catch { /* Storage may be blocked; still dismiss for this page. */ }
    dialog.close();
  });
  dialog.setAttribute('aria-labelledby', title.id);
  dialog.setAttribute('aria-describedby', text.id);
  dialog.addEventListener('cancel', (event) => event.preventDefault());
  dialog.addEventListener('close', () => dialog.remove());
  dialog.append(title, text, acknowledge);
  document.body.append(dialog);
  dialog.showModal();
}
