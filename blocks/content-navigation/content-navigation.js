import { findAnchorTarget, scrollToElement } from '../../scripts/bmw-utils.js';

/*
 * Content Navigation (source cmp-contentnavigation v3): in-page / sub-page navigation bar that
 * sticks to the top of the viewport once scrolled past.
 * Rows (classified by content):
 *   plain text                          -> title (shown from 1280px)
 *   <a href="#id">Label</a> [| hint]    -> anchor link (hint = heading text of the target section)
 *   <a href="/page">Label</a>           -> page link (active when it is the current page)
 *   <strong><a> / <em><a> (buttons)     -> CTA on the right (primary / outline)
 * Option hide: invisible at its flow position, only shown while fixed at the top.
 * Mobile (< 768px): a bar with the current entry + CTA; the entry opens the full list.
 */

const MOBILE_MQ = window.matchMedia('(max-width: 767px)');

function icon(name) {
  const span = document.createElement('span');
  span.className = 'bmw-icon';
  span.dataset.icon = name;
  span.setAttribute('aria-hidden', 'true');
  span.textContent = name;
  return span;
}

function contentPath(pathname) {
  // local preview serves pages below /content
  return pathname.replace(/^\/content(?=\/)/, '').replace(/\.html$/, '').replace(/\/$/, '');
}

function readRows(block) {
  const items = [];
  const ctas = [];
  let title = '';
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const first = cells[0];
    if (!first) return;
    const a = first.querySelector('a[href]');
    if (!a) {
      if (!title && first.textContent.trim()) title = first.textContent.trim();
      return;
    }
    const isButton = a.classList.contains('button') || a.closest('strong, em');
    if (isButton) {
      let kind = 'primary';
      if (a.classList.contains('secondary') || (!a.classList.contains('button') && a.closest('em') && !a.closest('strong'))) kind = 'secondary';
      ctas.push({ href: a.getAttribute('href'), label: a.textContent.trim(), kind });
      return;
    }
    items.push({
      href: a.getAttribute('href'),
      label: a.textContent.trim(),
      hint: cells[1] ? cells[1].textContent.trim() : '',
    });
  });
  return { items, ctas, title };
}

export default function decorate(block) {
  const { items, ctas, title } = readRows(block);
  if (!items.length && !ctas.length) return;
  const hide = block.classList.contains('hide');

  const nav = document.createElement('nav');
  nav.className = 'content-navigation-bar';
  nav.setAttribute('aria-label', title || 'Sekundärnavigation');
  const inner = document.createElement('div');
  inner.className = 'content-navigation-inner';

  if (title) {
    const t = document.createElement('p');
    t.className = 'content-navigation-title';
    t.textContent = title;
    inner.append(t);
  }

  // mobile toggle (current entry)
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'content-navigation-toggle';
  toggle.setAttribute('aria-expanded', 'false');
  const toggleLabel = document.createElement('span');
  toggleLabel.className = 'content-navigation-toggle-label';
  toggle.append(toggleLabel, icon('arrow_chevron_down'));

  const scroller = document.createElement('div');
  scroller.className = 'content-navigation-scroller';
  const list = document.createElement('ul');
  list.className = 'content-navigation-list';
  list.id = `content-navigation-list-${Math.random().toString(36).slice(2, 8)}`;
  toggle.setAttribute('aria-controls', list.id);
  const prev = document.createElement('button');
  prev.type = 'button';
  prev.className = 'content-navigation-arrow content-navigation-prev';
  prev.setAttribute('aria-hidden', 'true');
  prev.tabIndex = -1;
  prev.append(icon('arrow_chevron_left'));
  const next = prev.cloneNode(true);
  next.className = 'content-navigation-arrow content-navigation-next';
  next.replaceChildren(icon('arrow_chevron_right'));

  const here = contentPath(window.location.pathname);
  const links = items.map((item) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.className = 'content-navigation-link';
    a.href = item.href;
    a.textContent = item.label;
    if (item.hint) a.dataset.hint = item.hint;
    if (!item.href.startsWith('#')) {
      try {
        const u = new URL(item.href, window.location.href);
        if (u.origin === window.location.origin && contentPath(u.pathname) === here && !u.hash) {
          a.classList.add('is-active');
          a.setAttribute('aria-current', 'page');
        }
      } catch { /* ignore */ }
    }
    li.append(a);
    list.append(li);
    return a;
  });
  scroller.append(prev, list, next);

  const ctaWrap = document.createElement('div');
  ctaWrap.className = 'content-navigation-ctas';
  ctas.forEach((c) => {
    const a = document.createElement('a');
    a.href = c.href;
    a.className = `button ${c.kind} content-navigation-cta`;
    a.textContent = c.label;
    ctaWrap.append(a);
  });

  if (items.length) inner.append(toggle, scroller);
  if (ctas.length) inner.append(ctaWrap);
  else block.classList.add('no-cta');
  nav.append(inner);
  block.replaceChildren(nav);

  /* ---------- behaviour ---------- */
  const barHeight = () => nav.querySelector('.content-navigation-inner').offsetHeight || 0;
  const anchorLinks = links.filter((a) => a.getAttribute('href').startsWith('#'));
  const targets = new Map();
  const targetOf = (a) => {
    if (!targets.has(a) || !targets.get(a) || !targets.get(a).isConnected) {
      targets.set(a, findAnchorTarget(a.getAttribute('href'), a.dataset.hint));
    }
    return targets.get(a);
  };

  const setOpen = (open) => {
    block.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    document.documentElement.style.overflow = open ? 'hidden' : '';
  };
  toggle.addEventListener('click', () => setOpen(!block.classList.contains('is-open')));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && block.classList.contains('is-open')) {
      setOpen(false);
      toggle.focus();
    }
  });
  MOBILE_MQ.addEventListener('change', () => setOpen(false));

  const updateArrows = () => {
    const max = list.scrollWidth - list.clientWidth;
    const left = list.scrollLeft > 1;
    const right = max - list.scrollLeft > 1;
    scroller.classList.toggle('has-prev', left);
    scroller.classList.toggle('has-next', right);
  };
  const step = (dir) => list.scrollBy({ left: dir * list.clientWidth * 0.6, behavior: 'smooth' });
  prev.addEventListener('click', () => step(-1));
  next.addEventListener('click', () => step(1));
  list.addEventListener('scroll', updateArrows, { passive: true });
  window.addEventListener('resize', updateArrows);

  // source: the entry of the section in view is highlighted; before the first section is reached
  // only the current page's entry is highlighted (the mobile toggle shows the first entry) and the
  // horizontal list keeps its scroll position
  const pageActive = links.find((a) => a.getAttribute('aria-current') === 'page');
  const setActive = (active) => {
    const current = active || pageActive;
    links.forEach((a) => {
      a.classList.toggle('is-active', a === current);
      if (a === active) a.setAttribute('aria-current', 'location');
      else if (a !== pageActive) a.removeAttribute('aria-current');
    });
    const label = current || links[0];
    toggleLabel.textContent = label ? label.textContent : '';
    if (active && !MOBILE_MQ.matches) {
      // keep the active entry visible in the horizontal list
      const l = current.offsetLeft;
      const r = l + current.offsetWidth;
      if (l < list.scrollLeft || r > list.scrollLeft + list.clientWidth) {
        list.scrollTo({ left: l - 48, behavior: 'smooth' });
      }
    }
  };

  links.forEach((a) => {
    if (!a.getAttribute('href').startsWith('#')) return;
    a.addEventListener('click', (e) => {
      const target = targetOf(a);
      setOpen(false);
      if (!target) return;
      e.preventDefault();
      scrollToElement(target, barHeight());
      window.history.replaceState(null, '', a.getAttribute('href'));
    });
  });

  let ticking = false;
  const update = () => {
    ticking = false;
    // not rendered yet (section still loading): stay in place
    const rendered = block.getClientRects().length > 0;
    const fixed = rendered && block.getBoundingClientRect().top <= 0 && window.scrollY > 0;
    block.classList.toggle('is-fixed', fixed);
    if (hide) nav.inert = !fixed;
    if (anchorLinks.length) {
      const line = barHeight() + window.innerHeight * 0.25;
      let active = null;
      anchorLinks.forEach((a) => {
        const t = targetOf(a);
        if (t && t.getBoundingClientRect().top <= line) active = a;
      });
      // no highlight before the first section is reached
      setActive(fixed ? active : null);
    } else {
      setActive(null);
    }
  };
  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(update);
    }
  }, { passive: true });
  window.addEventListener('resize', update);
  // re-evaluate once the section becomes visible / the layout settles
  new IntersectionObserver(() => {
    update();
    updateArrows();
  }).observe(block);
  window.addEventListener('load', update);
  update();
  window.requestAnimationFrame(updateArrows);
}
