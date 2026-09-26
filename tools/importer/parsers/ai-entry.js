/* eslint-disable */
/* global WebImporter */
// Parser for block "ai-entry" (source: .aientry.aem-GridColumn, cmp-aientry: "BMW AI Assistant fragen" entry field
// with cycling suggestions, or only the button with style-aientry--button-only / --ghost-button-dark).
// Block "AI Entry" [ (button-only) | (ghost-dark) ]:
//   row 1: label ("BMW AI Assistant fragen")
//   row 2: list of suggestions (cycled in the placeholder)
//   row 3 (optional): disclaimer text below the field
import { replaceWithBlock, text } from './_utils.js';

export const selectors = ['.aientry.aem-GridColumn'];

export default function parse(element, { document }) {
  const cmp = element.querySelector('.cmp-aientry');
  if (!cmp) return;
  const label = text(cmp.querySelector('.cmp-aientry__placeholder-text'))
    || text(cmp.querySelector('.cmp-aientry__direct-access-button'))
    || (cmp.querySelector('.cmp-aientry__input') || { getAttribute: () => '' }).getAttribute('aria-label')
    || 'BMW AI Assistant fragen';
  const p = document.createElement('p');
  p.textContent = label;
  const rows = [[p]];
  const suggestions = [...cmp.querySelectorAll('.cmp-aientry__suggestion')].map((li) => text(li)).filter(Boolean);
  if (suggestions.length) {
    const ul = document.createElement('ul');
    suggestions.forEach((s) => {
      const li = document.createElement('li');
      li.textContent = s;
      ul.append(li);
    });
    rows.push([ul]);
  }
  const disclaimer = cmp.querySelector('.cmp-aientry__disclaimer');
  if (disclaimer && text(disclaimer)) {
    const d = document.createElement('p');
    d.textContent = text(disclaimer);
    if (rows.length === 1) rows.push(['']);
    rows.push([d]);
  }
  const cls = element.className || '';
  const opts = [];
  if (/style-aientry--button-only/.test(cls)) opts.push('button-only');
  if (/style-aientry--ghost-button-dark/.test(cls)) opts.push('ghost-dark');
  replaceWithBlock(document, element, opts.length ? `AI Entry (${opts.join(', ')})` : 'AI Entry', rows);
}
