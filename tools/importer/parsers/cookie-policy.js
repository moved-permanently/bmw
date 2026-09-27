/* eslint-disable */
/* global WebImporter */
// Parser for block "cookie-policy" (source: .cookie-policy.aem-GridColumn, an empty
// .epaas-policy-page-container that the ePaaS consent controller fills at runtime with the cookie
// policy and consent settings). Block "Cookie Policy", one cell: label of the fallback button that
// opens the consent settings while ePaaS is unreachable.
import { replaceWithBlock } from './_utils.js';

export const selectors = ['.cookie-policy.aem-GridColumn'];

export default function parse(element, { document }) {
  if (!element.querySelector('.epaas-policy-page-container')) return;
  replaceWithBlock(document, element, 'Cookie Policy', [['Cookie-Einstellungen']]);
}
