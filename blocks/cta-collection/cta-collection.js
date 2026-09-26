import { decorateFontIcons } from '../../scripts/bmw-utils.js';

/*
 * CTA Collection (source .button + cmp-ctacollection-popover): a button that opens a small panel
 * with a heading, CTA buttons and text links.
 * Content: one cell — first paragraph = button label / panel heading, then one link per paragraph:
 *   <strong><a> primary button, <em><a> outline button, plain <a> text link (":icon:" allowed).
 *   If every link has the same formatting (older imports), the first link is the primary button,
 *   the second the outline button and the rest are text links (source layout).
 * Option sticky: the button is fixed top-right once the page is scrolled past the block's position
 * (model pages, "Ihr BMW X5"); the desktop panel opens in place of the button, mobile shows a
 * bottom sheet.
 */

const MOBILE_MQ = '(max-width: 767px)';
const CLOSE_MS = 300;

function kindOf(a) {
  if (!a.classList.contains('button')) return 'link';
  if (a.classList.contains('primary') || a.classList.contains('accent')) return 'primary';
  return 'secondary';
}

function classify(links) {
  const kinds = links.map(kindOf);
  if (links.length >= 2 && kinds.every((k) => k === kinds[0])) {
    return links.map((a, i) => {
      if (i === 0) return 'primary';
      return i === 1 ? 'secondary' : 'link';
    });
  }
  return kinds;
}

function buildButton(a, kind) {
  const link = document.createElement('a');
  link.href = a.href;
  link.className = `button ${kind}`;
  link.append(...a.childNodes);
  if (a.title) link.title = a.title;
  return link;
}

function buildTextLink(a) {
  const link = document.createElement('a');
  link.href = a.href;
  link.className = 'cta-collection-textlink';
  const label = document.createElement('span');
  label.className = 'cta-collection-textlink-label';
  label.append(...a.childNodes);
  link.append(label);
  decorateFontIcons(link, { text: true });
  // model compare links carry the compare icon on the source
  if (!link.querySelector('.bmw-icon') && /vergleichen/i.test(a.href)) {
    const icon = document.createElement('span');
    icon.className = 'icon bmw-icon';
    icon.dataset.icon = 'arrows_left_right';
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = 'arrows_left_right';
    link.append(icon);
  }
  // icons authored before the label move behind it (source: icon after text)
  link.querySelectorAll('.bmw-icon').forEach((i) => link.append(i));
  return link;
}

export default function decorate(block) {
  const sticky = block.classList.contains('sticky');
  const cell = block.querySelector(':scope > div > div') || block;
  const links = [...cell.querySelectorAll('a[href]')];
  const headingEl = [...cell.querySelectorAll('p, h2, h3, h4, h5, h6')]
    .find((el) => !el.querySelector('a') && el.textContent.trim());
  const label = headingEl ? headingEl.textContent.trim() : (links[0] && links[0].textContent.trim()) || '';
  if (!links.length) return;

  const kinds = classify(links);
  const buttons = document.createElement('div');
  buttons.className = 'cta-collection-buttons';
  const textlinks = document.createElement('div');
  textlinks.className = 'cta-collection-textlinks';
  links.forEach((a, i) => {
    if (kinds[i] === 'link') textlinks.append(buildTextLink(a));
    else buttons.append(buildButton(a, kinds[i]));
  });

  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = 'button primary cta-collection-trigger';
  trigger.textContent = label;
  trigger.setAttribute('aria-haspopup', 'dialog');
  trigger.setAttribute('aria-expanded', 'false');

  const dialog = document.createElement('dialog');
  dialog.className = 'cta-collection-popover';
  dialog.setAttribute('aria-label', label);
  const panel = document.createElement('div');
  panel.className = 'cta-collection-panel';
  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'cta-collection-close';
  close.setAttribute('aria-label', 'Schließen');
  close.innerHTML = '<span class="bmw-icon" data-icon="close" aria-hidden="true">close</span>';
  const heading = document.createElement('p');
  heading.className = 'cta-collection-heading';
  heading.textContent = label;
  panel.append(close, heading);
  if (buttons.children.length) panel.append(buttons);
  if (buttons.children.length && textlinks.children.length) {
    const sep = document.createElement('div');
    sep.className = 'cta-collection-separator';
    panel.append(sep);
  }
  if (textlinks.children.length) panel.append(textlinks);
  dialog.append(panel);

  const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const place = () => {
    panel.style.removeProperty('--cta-collection-top');
    panel.style.removeProperty('--cta-collection-left');
    if (sticky || window.matchMedia(MOBILE_MQ).matches) return;
    // inline trigger: the panel opens over the button, kept inside the viewport
    const r = trigger.getBoundingClientRect();
    const width = panel.offsetWidth;
    const maxLeft = document.documentElement.clientWidth - width - 16;
    const maxTop = Math.max(16, window.innerHeight - panel.offsetHeight - 16);
    const left = Math.min(Math.max(16, r.left), maxLeft);
    const top = Math.min(Math.max(16, r.top), maxTop);
    panel.style.setProperty('--cta-collection-left', `${Math.round(left)}px`);
    panel.style.setProperty('--cta-collection-top', `${Math.round(top)}px`);
  };
  const closeDialog = () => {
    if (!dialog.open || dialog.classList.contains('is-closing')) return;
    const finish = () => {
      dialog.classList.remove('is-open', 'is-closing');
      dialog.close();
      trigger.setAttribute('aria-expanded', 'false');
      trigger.focus({ preventScroll: true });
    };
    if (reduced()) {
      finish();
      return;
    }
    dialog.classList.add('is-closing');
    setTimeout(finish, CLOSE_MS);
  };
  trigger.addEventListener('click', () => {
    dialog.classList.remove('is-closing');
    dialog.showModal();
    dialog.classList.add('is-open');
    place();
    trigger.setAttribute('aria-expanded', 'true');
    close.focus({ preventScroll: true });
  });
  close.addEventListener('click', closeDialog);
  dialog.addEventListener('cancel', (e) => {
    e.preventDefault();
    closeDialog();
  });
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) closeDialog();
  });

  block.replaceChildren(trigger, dialog);

  if (sticky) {
    // fixed top-right once the block's own position has been scrolled past (source sticky-visible)
    let ticking = false;
    const update = () => {
      ticking = false;
      const visible = block.getBoundingClientRect().top < 0;
      block.classList.toggle('is-visible', visible);
    };
    window.addEventListener('scroll', () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    }, { passive: true });
    update();
  }
}
