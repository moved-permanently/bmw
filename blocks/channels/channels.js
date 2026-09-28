import { representations } from '../../scripts/aida-feeds.js';

/*
 * Channels: one page, every representation it is served in (page, Markdown for LLMs, HTML
 * fragment, JSON-LD, data), fetched live from the same origin.
 *  Row 1: link or path of the page.  Row 2 (optional): link or path of a JSON resource.
 */

const MAX = 8000;
const pathOf = (cell) => {
  if (!cell) return null;
  const raw = cell.querySelector('a')?.getAttribute('href') || cell.textContent.trim();
  if (!raw) return null;
  const url = new URL(raw, window.location.href);
  return `${url.pathname}${url.search}`;
};

async function load(rep) {
  const resp = await fetch(rep.url);
  if (!resp.ok) return `${resp.status} ${resp.statusText}`;
  const text = await resp.text();
  if (rep.id === 'jsonld') {
    const doc = new DOMParser().parseFromString(text, 'text/html');
    const ld = [...doc.querySelectorAll('script[type="application/ld+json"]')].map((s) => s.textContent);
    if (!ld.length) return 'No JSON-LD on this page.';
    return ld.map((s) => {
      try {
        return JSON.stringify(JSON.parse(s), null, 2);
      } catch (e) {
        return s;
      }
    }).join('\n\n');
  }
  if (rep.id === 'data') {
    try {
      return JSON.stringify(JSON.parse(text), null, 2);
    } catch (e) {
      return text;
    }
  }
  return text;
}

export default function decorate(block) {
  const [pageCell, dataCell] = [...block.children].map((row) => row.firstElementChild);
  const page = pathOf(pageCell);
  if (!page) return;
  const reps = representations(page, pathOf(dataCell));

  const nav = document.createElement('div');
  nav.className = 'channels-nav';
  nav.setAttribute('role', 'tablist');
  const panel = document.createElement('div');
  panel.className = 'channels-panel';
  panel.setAttribute('role', 'tabpanel');

  const show = async (rep, button) => {
    nav.querySelectorAll('button').forEach((b) => b.setAttribute('aria-selected', String(b === button)));
    const link = document.createElement('a');
    link.href = rep.url;
    link.textContent = rep.url;
    link.target = '_blank';
    const head = document.createElement('p');
    head.className = 'channels-url';
    head.append('GET ', link);
    if (rep.id === 'html') {
      const frame = document.createElement('iframe');
      frame.src = rep.url;
      frame.title = rep.label;
      frame.loading = 'lazy';
      panel.replaceChildren(head, frame);
      return;
    }
    const pre = document.createElement('pre');
    pre.textContent = 'Loading…';
    panel.replaceChildren(head, pre);
    const text = await load(rep);
    pre.textContent = text.length > MAX ? `${text.slice(0, MAX)}\n…` : text;
  };

  reps.forEach((rep, i) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('role', 'tab');
    button.textContent = rep.label;
    button.addEventListener('click', () => show(rep, button));
    nav.append(button);
    if (i === 1) show(rep, button);
  });

  block.replaceChildren(nav, panel);
}
