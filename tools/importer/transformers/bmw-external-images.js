/* eslint-disable */
/* global WebImporter */
// BMW-hosted images that the EDS/DA pipeline cannot ingest (the Akamai-protected www.bmw.de DAM and the
// cosy vehicle-render service) are carried as links, like the Scene7 images: <a href="IMG-URL">alt</a>,
// or <a href="/page" title="IMG-URL">alt</a> for linked images. scripts/scripts.js
// (buildExternalImageLinks) renders them back into <picture> at runtime. Runs afterTransform.

const EMPTY_ALT = 'Image without alt text';

function isExternalBmwImage(url) {
  let u;
  try { u = new URL(url, 'https://www.bmw.de/'); } catch (e) { return false; }
  if (u.hostname === 'prod.cosy.bmw.cloud') return true;
  if (u.hostname === 'www.bmw.de' && /^\/content\/dam\/|\.coreimg\./.test(u.pathname)
    && /\.(png|jpe?g|gif|webp|svg|avif)$/i.test(u.pathname)) return true;
  return false;
}

export default function transform(hookName, element, payload) {
  if (hookName !== 'afterTransform') return;
  const doc = element.ownerDocument;
  element.querySelectorAll('img').forEach((img) => {
    const src = img.getAttribute('src') || '';
    if (!isExternalBmwImage(src)) return;
    const alt = (img.getAttribute('alt') || '').trim() || EMPTY_ALT;
    // linked image: keep navigation href, stash the image URL in title
    let node = img;
    if (node.parentElement && node.parentElement.tagName === 'PICTURE') node = node.parentElement;
    const parent = node.parentElement;
    if (parent && parent.tagName === 'A' && parent.children.length === 1 && !parent.textContent.trim()) {
      parent.setAttribute('title', src);
      parent.textContent = alt;
      return;
    }
    if (parent && parent.tagName === 'A') return; // mixed-content anchor: leave as is
    const a = doc.createElement('a');
    a.href = src;
    a.textContent = alt;
    node.replaceWith(a);
  });
}
