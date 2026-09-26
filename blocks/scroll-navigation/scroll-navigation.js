import { findAnchorTarget, scrollToElement } from '../../scripts/bmw-utils.js';

/*
 * Scroll Navigation (source cmp-scrollnavigation): fixed bullet navigation at the right edge
 * (desktop >= 1024px) with a label tooltip per section and active-section highlighting.
 * Rows: <a href="#id">Label</a> [| hint = heading text of the target section].
 * The bullets fade in once the page is scrolled past the block's position; all labels show briefly
 * the first time, the active label flashes on every section change, all labels show on hover.
 */

export default function decorate(block) {
  const entries = [...block.children].map((row) => {
    const [cell, hintCell] = [...row.children];
    const a = cell && cell.querySelector('a[href^="#"]');
    if (!a) return null;
    return {
      href: a.getAttribute('href'),
      label: a.textContent.trim(),
      hint: hintCell ? hintCell.textContent.trim() : '',
    };
  }).filter(Boolean);
  if (!entries.length) return;

  const nav = document.createElement('nav');
  nav.className = 'scroll-navigation-nav';
  nav.setAttribute('aria-label', 'Navigation auf der Seite');
  const list = document.createElement('ul');
  list.className = 'scroll-navigation-list';
  const links = entries.map((entry) => {
    const li = document.createElement('li');
    li.className = 'scroll-navigation-item';
    const a = document.createElement('a');
    a.className = 'scroll-navigation-link';
    a.href = entry.href;
    a.dataset.hint = entry.hint;
    const tip = document.createElement('span');
    tip.className = 'scroll-navigation-tooltip';
    tip.textContent = entry.label;
    const bullet = document.createElement('span');
    bullet.className = 'scroll-navigation-bullet';
    bullet.setAttribute('aria-hidden', 'true');
    a.append(tip, bullet);
    li.append(a);
    list.append(li);
    return a;
  });
  nav.append(list);
  block.replaceChildren(nav);

  const targets = new Map();
  const targetOf = (a) => {
    const known = targets.get(a);
    if (known && known.isConnected) return known;
    const t = findAnchorTarget(a.getAttribute('href'), a.dataset.hint);
    targets.set(a, t);
    return t;
  };

  links.forEach((a) => {
    a.addEventListener('click', (e) => {
      const t = targetOf(a);
      if (!t) return;
      e.preventDefault();
      scrollToElement(t, 0);
      window.history.replaceState(null, '', a.getAttribute('href'));
      a.focus({ preventScroll: true });
    });
  });

  let active = null;
  let shownOnce = false;
  let ticking = false;
  const update = () => {
    ticking = false;
    const visible = block.getBoundingClientRect().top < 0;
    if (visible && !shownOnce) {
      shownOnce = true;
      nav.classList.add('show-all-tooltips');
      setTimeout(() => nav.classList.remove('show-all-tooltips'), 4500);
    }
    block.classList.toggle('is-visible', visible);
    const line = window.innerHeight / 2;
    let current = null;
    links.forEach((a) => {
      const t = targetOf(a);
      if (!t) return;
      const r = t.getBoundingClientRect();
      if (r.top <= line && r.bottom > 0) current = a;
    });
    if (current !== active) {
      if (active) {
        active.classList.remove('is-active');
        active.removeAttribute('aria-current');
      }
      active = current;
      if (active) {
        active.classList.add('is-active');
        active.setAttribute('aria-current', 'location');
      }
    }
  };
  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(update);
    }
  }, { passive: true });
  window.addEventListener('resize', update);
  update();
}
