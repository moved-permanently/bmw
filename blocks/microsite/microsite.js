/*
 * Microsite (source cmp-microsite): several micro pages in one block, one visible at a time; the
 * URL hash selects the page (the page with that id or containing an element with that id), like the
 * source microsite-v1 (hashchange). Rows: <page id> | page content.
 */

function hashId() {
  try {
    return decodeURIComponent(window.location.hash.replace(/^#/, ''));
  } catch {
    return window.location.hash.replace(/^#/, '');
  }
}

export default function decorate(block) {
  const pages = [];
  [...block.children].forEach((row, i) => {
    const [idCell, content] = row.children;
    if (!content && !idCell) return;
    const page = document.createElement('div');
    page.className = 'microsite-page';
    page.id = (content ? idCell.textContent.trim() : '') || `microsite-page-${i + 1}`;
    page.hidden = pages.length > 0;
    page.append(...(content || idCell).childNodes);
    pages.push(page);
  });
  if (!pages.length) return;
  block.replaceChildren(...pages);

  const show = () => {
    const id = hashId();
    if (!id) return;
    const target = pages.find((p) => p.id === id || p.querySelector(`[id="${CSS.escape(id)}"]`));
    if (!target) return;
    pages.forEach((p) => { p.hidden = p !== target; });
  };
  window.addEventListener('hashchange', show);
  show();
}
