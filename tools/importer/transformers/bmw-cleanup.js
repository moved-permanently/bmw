/* eslint-disable */
/* global WebImporter */
// Removes bmw.de chrome and non-content before parsing; strips leftovers afterwards.

const CHROME = [
  'header', 'footer', '.globalnavigation', '.mybmwflyout', '.stickysidebar', '.cmp-stickysidebar',
  '.experiencefragment:has(.cmp-globalnavigation)', '.tronenabler', '.ghost', '#epaas-consentdrawer-shadowhost',
  'epaas-consent-drawer-shell', '.cookie-policy script', '.skiptomaincontent', '.cmp-skiptomaincontent',
  'script', 'style', 'noscript', 'link', 'meta', 'iframe[src*="doubleclick"]', 'iframe[src*="criteo"]',
  'iframe[src="javascript:void(0)"]', '[data-cmp-hook-tooltip="template"]', '.cmp-infoi',
  '.cmp-epaasnotavailablebanner', '.epaasnotavailablebanner',
];

const WLTP_START = 'Die angegebenen Werte wurden nach dem vorgeschriebenen Messverfahren WLTP ermittelt';

export default function transform(hookName, element, payload) {
  const doc = element.ownerDocument;
  if (hookName === 'beforeTransform') {
    // AEM personalization toggles: keep the default variation only
    element.querySelectorAll('.xftoggle').forEach((x) => {
      const variations = x.querySelectorAll(':scope [data-variation], :scope .cmp-xftoggle__variation');
      if (variations.length > 1) [...variations].slice(1).forEach((v) => v.remove());
    });
    // info-i tooltips: remember their text on the owning component before the markup is removed.
    // Standard WLTP text -> data-info="wltp" (shared fragment /de/fragments/wltp-info); others inline.
    element.querySelectorAll('.cmp-infoi').forEach((infoi) => {
      const content = infoi.querySelector('[data-cmp-hook-tooltip="content"]');
      const owner = infoi.closest('.aem-GridColumn') || infoi.parentElement;
      if (!content || !owner) return;
      const txt = content.textContent.replace(/\s+/g, ' ').trim();
      if (!txt) return;
      if (txt.startsWith(WLTP_START)) {
        owner.setAttribute('data-info', 'wltp');
        if (!doc.documentElement.getAttribute('data-wltp-info')) doc.documentElement.setAttribute('data-wltp-info', content.innerHTML.trim());
      } else {
        owner.setAttribute('data-info-html', content.innerHTML.trim());
      }
    });
    CHROME.forEach((sel) => {
      try { element.querySelectorAll(sel).forEach((el) => el.remove()); } catch (e) { /* :has unsupported */ }
    });
    // hidden a11y helpers that would leak text
    element.querySelectorAll('.cmp-button__icon, .sr-only:empty').forEach((el) => el.remove());
    // comments
    const walker = doc.createTreeWalker(element, 128 /* NodeFilter.SHOW_COMMENT */);
    const comments = [];
    while (walker.nextNode()) comments.push(walker.currentNode);
    comments.forEach((c) => c.remove());
  }
  if (hookName === 'afterTransform') {
    element.querySelectorAll('[data-tracking-linkid], [data-component-path], [data-loader], [data-info], [data-info-html]').forEach((el) => {
      ['data-tracking-linkid', 'data-component-path', 'data-loader', 'data-info', 'data-info-html'].forEach((a) => el.removeAttribute(a));
    });
  }
}
