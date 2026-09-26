/* eslint-disable */
/* global WebImporter */
// Parser for block "questionnaire" (source: .questionnaire.aem-GridColumn, cmp-questionnaire wrapping a
// cmp-microsite: one micro page per question / result, switched by the URL hash; answers either link to the
// next page directly (href="#q6") or are evaluated against rules ("q2a1+q3a1" -> q4)).
// Block "Questionnaire":
//   page rows : <page id> | page content (text, answer links, download links) [| "answers-3" = tile width 3/12]
//               answer links: href "#<page id>" (direct) or "#<answer id>" (evaluated by the rules);
//               answer ids follow the source convention <question id>a<n> (n = position on the page)
//   questions : comma separated ids of the question pages (source data-questions-info)
//   rules     : one paragraph per rule "condition = result" (+ = and, | = or, ! = not, parentheses)
//   fallback  : (optional) page shown when no rule matches
import { replaceWithBlock, text, cleanHref } from './_utils.js';
import { textNodes, titleNodes } from './_media.js';

export const selectors = ['.questionnaire.aem-GridColumn'];

const AUTO_ID = /^(container|text|title|button|download|image|tabs|accordion)-[0-9a-f]+$/;

/** Links of Download block tables (created by the download parser, which runs first). */
function downloadLinks(document, table) {
  return [...table.querySelectorAll('a[href]')].map((a) => {
    const p = document.createElement('p');
    const link = document.createElement('a');
    link.href = a.getAttribute('href');
    link.textContent = text(a);
    p.append(link);
    return p;
  });
}

function buttonNode(document, col) {
  const b = col.querySelector('a.cmp-button, button.cmp-button');
  if (!b) return null;
  const label = text(b.querySelector('.cmp-button__text') || b);
  let href = b.tagName === 'A' ? b.getAttribute('href') : '';
  if (!href && b.id) href = `#${b.id}`;
  if (!href || !label) return null;
  const p = document.createElement('p');
  const a = document.createElement('a');
  a.href = href.startsWith('#') ? href : cleanHref(href);
  a.textContent = label;
  p.append(a);
  return p;
}

export function pageRows(document, microsite, knownIds) {
  const rows = [];
  microsite.querySelectorAll('.cmp-microsite__micropage').forEach((page, i) => {
    const ids = [...page.querySelectorAll('[id]')].map((e) => e.id).filter((id) => id && !AUTO_ID.test(id));
    const id = ids.find((x) => knownIds.has(x)) || ids.find((x) => !/a\d+$/.test(x)) || `page-${i + 1}`;
    const nodes = [];
    let answerCols = 0;
    const comps = [...page.querySelectorAll('.title.aem-GridColumn, .text.aem-GridColumn, .button.aem-GridColumn, table')]
      .filter((c) => !c.parentElement.closest('.title.aem-GridColumn, .text.aem-GridColumn, .button.aem-GridColumn, table'));
    comps.forEach((c) => {
      if (c.tagName === 'TABLE') nodes.push(...downloadLinks(document, c));
      else if (c.classList.contains('title')) nodes.push(...titleNodes(document, c));
      else if (c.classList.contains('text')) nodes.push(...textNodes(document, c));
      else {
        const p = buttonNode(document, c);
        if (p) nodes.push(p);
        const m = (c.className || '').match(/aem-GridColumn--default--(\d+)/);
        if (m) answerCols = Math.max(answerCols, Number(m[1]));
      }
    });
    const d = document.createElement('div');
    nodes.forEach((n) => d.append(n));
    const row = [id, d];
    if (answerCols && answerCols !== 2) row.push(`answers-${answerCols}`);
    rows.push(row);
  });
  return rows;
}

export default function parse(element, { document }) {
  const cmp = element.querySelector('.cmp-questionnaire') || element;
  const microsite = cmp.querySelector('.cmp-microsite') || cmp;
  let questions = [];
  let rules = [];
  try { questions = JSON.parse(cmp.getAttribute('data-questions-info') || '[]'); } catch (e) { questions = []; }
  try { rules = JSON.parse(cmp.getAttribute('data-rules-info') || '[]'); } catch (e) { rules = []; }
  const known = new Set(questions.map((q) => q.labelId));
  rules.forEach((r) => known.add(r.result));
  const rows = pageRows(document, microsite, known);
  if (questions.length) rows.push(['questions', questions.map((q) => q.labelId).join(', ')]);
  if (rules.length) {
    const d = document.createElement('div');
    rules.forEach((r) => {
      const p = document.createElement('p');
      p.textContent = `${r.condition} = ${r.result}`;
      d.append(p);
    });
    rows.push(['rules', d]);
  }
  const fallback = cmp.getAttribute('data-fallback-result');
  if (fallback) rows.push(['fallback', fallback]);
  replaceWithBlock(document, element, 'Questionnaire', rows);
}
