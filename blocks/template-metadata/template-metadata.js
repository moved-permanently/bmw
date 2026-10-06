/**
 * Template metadata of a DA library template (becomes the page metadata when the template is
 * inserted): never shown on the template's own preview.
 * @param {Element} block The template-metadata block element
 */
export default function decorate(block) {
  block.hidden = true;
  block.setAttribute('aria-hidden', 'true');
}
