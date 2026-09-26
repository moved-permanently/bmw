/* eslint-disable */
/* global WebImporter */
// Parser for block "microsite" (source: .microsite.aem-GridColumn, cmp-microsite: several micro pages of which
// one is visible; the URL hash selects the page containing the element with that id).
// Inside a questionnaire the questionnaire parser handles the micro pages (this parser leaves them alone).
// Block "Microsite": one row per page: <page id> | page content.
import { replaceWithBlock } from './_utils.js';
import { pageRows } from './questionnaire.js';

export const selectors = ['.microsite.aem-GridColumn'];

export default function parse(element, { document }) {
  if (element.closest('.cmp-questionnaire')) return;
  const cmp = element.querySelector('.cmp-microsite');
  if (!cmp) return;
  const rows = pageRows(document, cmp, new Set());
  if (!rows.length) return;
  replaceWithBlock(document, element, 'Microsite', rows);
}
