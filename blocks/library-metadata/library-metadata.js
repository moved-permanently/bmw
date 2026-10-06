/**
 * Library metadata (description / searchtags of a DA block library variant): read by the editor's
 * block library, never shown on a page.
 * @param {Element} block The library-metadata block element
 */
export default function decorate(block) {
  block.hidden = true;
  block.setAttribute('aria-hidden', 'true');
}
