/**
 * Structured content form metadata (x-schema-name / title written by da.live/form): not shown;
 * the record title becomes the document title (the served <title> is the first heading).
 * @param {Element} block The da-form block element
 */
export default function decorate(block) {
  const title = [...block.children].find((row) => row.firstElementChild?.textContent.trim() === 'title');
  const value = title?.children[1]?.textContent.trim();
  if (value) document.title = value;
  block.hidden = true;
  block.setAttribute('aria-hidden', 'true');
}
