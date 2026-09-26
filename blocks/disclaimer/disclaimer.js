import { findAnchorTarget, scrollToElement } from '../../scripts/bmw-utils.js';

/*
 * Disclaimer (source .text.style-text--disclaimer-1): small print at 70 % opacity.
 *  Row 1: the disclaimer text (links to "#bottom" jump to the legal notes at the page end).
 *  Row 2 (optional): page-specific info-i tooltip text.
 * Options: info (info-i button with the shared WLTP text from /de/fragments/wltp-info unless row 2
 * provides a text), light (white text on dark backgrounds).
 * Tooltip as on the source (tippy): desktop popover beside the icon (side with the most room),
 * mobile full-screen sheet; closes on the close button, Escape or a click outside.
 */

const WLTP_FRAGMENT = '/de/fragments/wltp-info';
const MOBILE_MQ = '(max-width: 767px)';
let fragmentPromise;
let open = null; // { block, button, tooltip }
let listenersBound = false;
let idCounter = 0;

/** Content prefix of the current page (the local preview serves content below /content). */
function contentPrefix() {
  const { pathname } = window.location;
  const idx = pathname.indexOf('/de/');
  return idx > 0 ? pathname.substring(0, idx) : '';
}

function loadWltpText() {
  if (!fragmentPromise) {
    fragmentPromise = fetch(`${contentPrefix()}${WLTP_FRAGMENT}.plain.html`)
      .then((resp) => (resp.ok ? resp.text() : ''))
      .then((html) => {
        const div = document.createElement('div');
        div.innerHTML = html;
        // unwrap the section div of the .plain.html
        const inner = div.children.length === 1 && div.firstElementChild.tagName === 'DIV'
          ? div.firstElementChild : div;
        return inner.innerHTML.trim();
      })
      .catch(() => '');
  }
  return fragmentPromise;
}

function closeTooltip({ focus = true } = {}) {
  if (!open) return;
  const { button, tooltip } = open;
  tooltip.hidden = true;
  tooltip.classList.remove('is-open');
  document.documentElement.style.removeProperty('overflow');
  button.setAttribute('aria-expanded', 'false');
  if (focus) button.focus({ preventScroll: true });
  open = null;
}

/** Places the popover beside the button (like tippy "auto": the side with the most room). */
function position(block, button, tooltip) {
  if (window.matchMedia(MOBILE_MQ).matches) {
    tooltip.dataset.placement = 'sheet';
    return;
  }
  const box = tooltip.querySelector('.disclaimer-tooltip-box');
  const arrow = tooltip.querySelector('.disclaimer-tooltip-arrow');
  const r = button.getBoundingClientRect();
  const vw = document.documentElement.clientWidth;
  const vh = window.innerHeight;
  const room = {
    left: r.left, right: vw - r.right, top: r.top, bottom: vh - r.bottom,
  };
  const placement = Object.keys(room).reduce((a, b) => (room[b] > room[a] ? b : a));
  tooltip.dataset.placement = placement;
  const bw = box.offsetWidth;
  const bh = box.offsetHeight;
  const gap = 12;
  const cx = r.left + r.width / 2;
  const cy = r.top + r.height / 2;
  let x;
  let y;
  if (placement === 'left' || placement === 'right') {
    x = placement === 'left' ? r.left - gap - bw : r.right + gap;
    y = Math.min(Math.max(8, cy - bh / 2), Math.max(8, vh - bh - 8));
    arrow.style.top = `${Math.round(cy - y)}px`;
    arrow.style.left = '';
  } else {
    y = placement === 'top' ? r.top - gap - bh : r.bottom + gap;
    x = Math.min(Math.max(8, cx - bw / 2), vw - bw - 8);
    arrow.style.left = `${Math.round(cx - x)}px`;
    arrow.style.top = '';
  }
  // coordinates relative to the block (position: relative)
  const b = block.getBoundingClientRect();
  tooltip.style.setProperty('--disclaimer-tooltip-x', `${Math.round(x - b.left)}px`);
  tooltip.style.setProperty('--disclaimer-tooltip-y', `${Math.round(y - b.top)}px`);
}

function bindListeners() {
  if (listenersBound) return;
  listenersBound = true;
  document.addEventListener('click', (e) => {
    if (!open) return;
    if (open.tooltip.contains(e.target) || open.button.contains(e.target)) return;
    closeTooltip({ focus: false });
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeTooltip();
  });
  window.addEventListener('resize', () => closeTooltip({ focus: false }));
}

function buildTooltip(id) {
  const tooltip = document.createElement('div');
  tooltip.className = 'disclaimer-tooltip';
  tooltip.id = id;
  tooltip.setAttribute('role', 'dialog');
  tooltip.setAttribute('aria-label', 'Information');
  tooltip.hidden = true;
  tooltip.innerHTML = `<div class="disclaimer-tooltip-box">
    <div class="disclaimer-tooltip-header"><button type="button" class="disclaimer-tooltip-close" aria-label="Schließen"><span class="bmw-icon" data-icon="close" aria-hidden="true">close</span></button></div>
    <div class="disclaimer-tooltip-content"></div>
    <span class="disclaimer-tooltip-arrow" aria-hidden="true"></span>
  </div>`;
  tooltip.querySelector('.disclaimer-tooltip-close').addEventListener('click', (e) => {
    e.stopPropagation();
    closeTooltip();
  });
  return tooltip;
}

async function toggleTooltip(block, button, tooltip, getContent) {
  if (open && open.button === button) {
    closeTooltip();
    return;
  }
  closeTooltip({ focus: false });
  const content = tooltip.querySelector('.disclaimer-tooltip-content');
  if (!content.innerHTML.trim()) {
    const html = await getContent();
    if (!html) return;
    content.innerHTML = html;
  }
  open = { block, button, tooltip };
  button.setAttribute('aria-expanded', 'true');
  tooltip.hidden = false;
  position(block, button, tooltip);
  tooltip.classList.add('is-open');
  if (tooltip.dataset.placement === 'sheet') {
    document.documentElement.style.overflow = 'hidden';
    tooltip.querySelector('.disclaimer-tooltip-close').focus({ preventScroll: true });
  }
}

function buildInfoButton(tooltipId) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'disclaimer-infoi';
  button.setAttribute('aria-label', 'Information');
  button.setAttribute('aria-expanded', 'false');
  button.setAttribute('aria-controls', tooltipId);
  button.innerHTML = '<span class="bmw-icon" data-icon="information" aria-hidden="true">information</span>';
  return button;
}

/** "#…" links (source: "#bottom" = legal notes at the page end) scroll to their target. */
function decorateAnchorLinks(text) {
  text.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.classList.add('disclaimer-link');
    a.addEventListener('click', (e) => {
      const hash = a.getAttribute('href');
      let target = findAnchorTarget(hash);
      if (!target && hash === '#bottom') {
        // the legal notes are the last content section of model pages
        const sections = [...document.querySelectorAll('main > .section:not(.layer)')];
        target = sections[sections.length - 1];
        if (target && !target.id) target.id = 'bottom';
      }
      if (!target) return;
      e.preventDefault();
      scrollToElement(target, 16);
      window.history.replaceState(null, '', hash);
    });
  });
}

export default function decorate(block) {
  const [first, second] = [...block.children];
  const text = document.createElement('div');
  text.className = 'disclaimer-text';
  const cell = first && (first.firstElementChild || first);
  if (cell) {
    // a single paragraph arrives unwrapped (text directly in the cell)
    const looseText = [...cell.childNodes]
      .some((n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim());
    if (looseText || !cell.querySelector('p, ul, ol')) {
      const p = document.createElement('p');
      p.append(...cell.childNodes);
      text.append(p);
    } else {
      text.append(...cell.childNodes);
    }
  }
  decorateAnchorLinks(text);

  const tooltipCell = second && (second.firstElementChild || second);
  const ownTooltip = tooltipCell && tooltipCell.textContent.trim() ? tooltipCell.innerHTML.trim() : '';
  const children = [text];
  if (block.classList.contains('info') || ownTooltip) {
    idCounter += 1;
    const tooltip = buildTooltip(`disclaimer-tooltip-${idCounter}`);
    const button = buildInfoButton(tooltip.id);
    const getContent = ownTooltip ? async () => ownTooltip : loadWltpText;
    button.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleTooltip(block, button, tooltip, getContent);
    });
    const last = text.lastElementChild;
    if (last && last.tagName === 'P') last.append(button);
    else text.append(button);
    children.push(tooltip);
    block.classList.add('has-infoi');
    bindListeners();
  }
  block.replaceChildren(...children);
}
