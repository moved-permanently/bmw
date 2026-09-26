/*
 * Page metadata table. On EDS the pipeline turns it into <meta> tags and strips it from the
 * markup; only the local preview (.plain.html) still delivers it as a block. Remove it.
 */
export default function decorate(block) {
  const wrapper = block.parentElement;
  block.remove();
  if (wrapper && wrapper.classList.contains('metadata-wrapper') && !wrapper.children.length) {
    wrapper.remove();
  }
}
