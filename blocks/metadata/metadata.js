/*
 * Page metadata table. On EDS the pipeline turns it into <meta> tags and strips it from the
 * markup; only the local preview (.plain.html) still delivers it as a block. Remove it.
 */
export default function decorate(block) {
  // local preview: expose the simple text rows as <meta> tags (as the EDS pipeline would)
  [...block.children].forEach((row) => {
    if (row.children.length < 2 || row.children[1].querySelector('img, picture, a')) return;
    const name = row.children[0].textContent.trim().toLowerCase().replace(/\s+/g, '-');
    if (!name || document.head.querySelector(`meta[name="${name}"]`)) return;
    const meta = document.createElement('meta');
    meta.name = name;
    meta.content = row.children[1].textContent.trim();
    document.head.append(meta);
  });
  const wrapper = block.parentElement;
  block.remove();
  if (wrapper && wrapper.classList.contains('metadata-wrapper') && !wrapper.children.length) {
    wrapper.remove();
  }
}
