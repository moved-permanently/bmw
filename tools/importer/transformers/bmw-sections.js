/* eslint-disable */
/* global WebImporter */
// bmw.de → EDS document structure.
// Runs afterTransform (block parsers have already replaced their components with block tables).
//  - every top-level AEM grid column of <main> becomes a section (<hr> separated)
//  - container spacing/alignment classes become section-metadata styles
//  - remaining AEM default components (title/text/button/image/list) become default content
//  - button popovers of type "page" become "layer" sections opened by a #layer-* link
//  - side-by-side grid columns without blocks become a "columns" block

const SPACING_RE = /style-common--cmp-spacing-(top|bottom)-(\d+)/g;

function gridWidth(el) {
  const m = (el.className || '').match(/aem-GridColumn--default--(\d+|none)/);
  return m && m[1] !== 'none' ? Number(m[1]) : 12;
}

function isHidden(el) {
  return /aem-GridColumn--default--hide/.test(el.className || '');
}

function sectionStyles(el) {
  const styles = new Set();
  const cls = el.className || '';
  let m;
  SPACING_RE.lastIndex = 0;
  while ((m = SPACING_RE.exec(cls))) styles.add(`spacing-${m[1]}-${m[2]}`);
  if (/style-container--center/.test(cls)) styles.add('center');
  const hasBg = /style-container--background/.test(cls);
  if (/style-container--dark|style-common--dark-background/.test(cls) || (hasBg && /ctx-mode--dark/.test(cls))) styles.add('dark');
  else if (hasBg) styles.add('grey');
  if (/style-container--background-normalwidth/.test(cls)) styles.add('contained');
  return [...styles];
}

function cleanInline(doc, node) {
  // keep inline formatting and links, drop AEM wrappers/classes
  const clone = node.cloneNode(true);
  clone.querySelectorAll('[class]').forEach((e) => e.removeAttribute('class'));
  clone.querySelectorAll('span').forEach((s) => s.replaceWith(...s.childNodes));
  clone.querySelectorAll('a[href]').forEach((a) => {
    a.setAttribute('href', cleanHref(a.getAttribute('href')));
    [...a.attributes].forEach((at) => { if (!['href', 'title'].includes(at.name)) a.removeAttribute(at.name); });
  });
  return clone;
}

function cleanHref(href) {
  if (!href) return '';
  const h = href.trim();
  if (/^(#|mailto:|tel:|javascript:)/.test(h)) return h;
  try {
    const u = new URL(h, 'https://www.bmw.de/');
    if (u.hostname === 'www.bmw.de') {
      u.pathname = u.pathname.replace('/content/bmw/marketDE/bmw_de/', '/');
      if (/^\/de\/.*\.html$/.test(u.pathname) && !/\/(shop|s|sl|dlo|faas)\//.test(u.pathname) && !u.pathname.includes('.asset.')) {
        let p = u.pathname.replace(/\.html$/, '');
        if (p === '/de/index') p = '/de/home';
        return `${p}${u.search}${u.hash}`;
      }
    }
    return u.href;
  } catch (e) { return h; }
}

function normalizeImageUrl(src) {
  if (!src) return '';
  const first = src.split(',')[0].trim().split(/\s+/)[0];
  let abs;
  try { abs = new URL(first, 'https://www.bmw.de/').href; } catch (e) { return first; }
  if (!/\/is\/image\//.test(abs)) return abs;
  const [base, query = ''] = abs.split('?');
  const keep = query.split('&').filter((p) => p && !['wid', 'hei', 'fmt', 'qlt', 'fit', 'scl', 'size', 'dpr'].includes(p.split('=')[0]));
  return keep.length ? `${base}?${keep.join('&')}` : base;
}

function block(doc, name, rows) {
  return WebImporter.Blocks.createBlock(doc, { name, cells: rows });
}

// ---------- default components ----------

function convertTitle(doc, col) {
  const h = col.querySelector('h1, h2, h3, h4, h5, h6, .cmp-title__text');
  if (!h) return [];
  const tag = /^H[1-6]$/.test(h.tagName) ? h.tagName.toLowerCase() : 'h2';
  const out = doc.createElement(tag);
  out.append(...cleanInline(doc, h).childNodes);
  if (!out.textContent.trim()) return [];
  return [out];
}

function convertText(doc, col) {
  const root = col.querySelector('.cmp-text') || col;
  const nodes = [];
  [...root.children].forEach((c) => {
    if (c.matches('.cmp-infoi, [data-cmp-hook-tooltip]')) return;
    if (/^(P|UL|OL|H[1-6]|TABLE|BLOCKQUOTE)$/.test(c.tagName)) {
      const n = cleanInline(doc, c);
      if (n.textContent.trim() || n.querySelector('img')) nodes.push(n);
    } else if (c.textContent.trim()) {
      const p = doc.createElement('p');
      p.append(...cleanInline(doc, c).childNodes);
      nodes.push(p);
    }
  });
  if (!nodes.length) return [];
  const cls = col.className || '';
  if (/style-text--disclaimer/.test(cls)) {
    const variant = [];
    const infoHtml = col.getAttribute('data-info-html');
    if (col.getAttribute('data-info') === 'wltp') variant.push('info');
    if (/style-text--light/.test(cls)) variant.push('light');
    const name = variant.length ? `Disclaimer (${variant.join(', ')})` : 'Disclaimer';
    const c = doc.createElement('div');
    nodes.forEach((n) => c.append(n));
    const rows = [[c]];
    if (infoHtml) {
      // page-specific tooltip text → second row (shown in the info-i tooltip)
      const t = doc.createElement('div');
      t.innerHTML = infoHtml;
      t.querySelectorAll('[class]').forEach((e) => e.removeAttribute('class'));
      rows.push([t]);
    }
    return [block(doc, name, rows)];
  }
  return nodes;
}

function convertButton(doc, col, ctx) {
  const btn = col.querySelector('a.cmp-button, button.cmp-button, a[href]');
  if (!btn) return [];
  const label = (btn.querySelector('.cmp-button__text') || btn).textContent.replace(/\s+/g, ' ').trim();
  if (!label) return [];
  const cls = col.className || '';
  let href = btn.tagName === 'A' ? cleanHref(btn.getAttribute('href')) : '';
  const popover = col.querySelector('.cmp-popover');
  const out = [];
  if (popover && popover.getAttribute('data-popover-type') === 'page') {
    ctx.layerCount += 1;
    const id = `layer-${ctx.layerCount}`;
    href = `#${id}`;
    const content = popover.querySelector('[data-cmp-hook-popover="content"], .cmp-popover__content') || popover;
    ctx.layers.push({ id, title: label, el: content });
  } else if (popover && popover.getAttribute('data-popover-type') === 'ctacollection') {
    // CTA collection: emit its links as a button group (sticky variant handled by CSS/section style)
    popover.querySelectorAll('a[href]').forEach((a) => {
      const t = a.textContent.replace(/\s+/g, ' ').trim();
      if (!t) return;
      const p = doc.createElement('p');
      const link = doc.createElement('a');
      link.href = cleanHref(a.getAttribute('href'));
      link.textContent = t;
      const wrap = /primary/.test(a.className) ? doc.createElement('strong') : doc.createElement('em');
      wrap.append(link); p.append(wrap); out.push(p);
    });
    if (out.length) {
      const c = doc.createElement('div');
      const h = doc.createElement('p'); h.textContent = label; c.append(h);
      out.forEach((p) => c.append(p));
      return [block(doc, /sticky/.test(cls) ? 'CTA Collection (sticky)' : 'CTA Collection', [[c]])];
    }
  }
  if (!href) return [];
  const link = doc.createElement('a');
  link.href = href;
  link.textContent = label;
  const p = doc.createElement('p');
  // bmw button styles: as-link → plain link, primary → blue (strong), outline → outline (em),
  // dark/nba/light default buttons → dark filled "accent" (strong+em)
  if (/style-button--as-link/.test(cls)) p.append(link);
  else if (/style-button--primary/.test(cls)) { const s = doc.createElement('strong'); s.append(link); p.append(s); }
  else if (/style-button--outline/.test(cls)) { const e = doc.createElement('em'); e.append(link); p.append(e); }
  else if (/style-button--(dark|nba-dark|light)/.test(cls)) {
    const s = doc.createElement('strong'); const e = doc.createElement('em'); e.append(link); s.append(e); p.append(s);
  } else p.append(link);
  return [p];
}

function convertImage(doc, col) {
  const img = col.querySelector('img');
  if (!img) return [];
  const pic = col.querySelector('picture');
  let src = img.getAttribute('src') || img.getAttribute('data-src') || '';
  if (pic) {
    const desktop = [...pic.querySelectorAll('source')].pop();
    if (!src && desktop) src = desktop.getAttribute('srcset');
  }
  const url = normalizeImageUrl(src);
  if (!url || url.startsWith('data:')) return [];
  const out = doc.createElement('img');
  out.src = url;
  out.alt = (img.getAttribute('alt') || '').trim();
  const p = doc.createElement('p');
  p.append(out);
  const res = [p];
  const caption = col.querySelector('figcaption, .cmp-image__title');
  if (caption && caption.textContent.trim()) {
    const c = doc.createElement('p');
    const em = doc.createElement('em');
    em.textContent = caption.textContent.trim();
    c.append(em); res.push(c);
  }
  return res;
}

// ---------- flattening ----------

function componentName(col) { return (col.className || '').split(/\s+/)[0]; }

function gridChildren(el) {
  // direct grid columns below el (through non-column wrappers)
  const out = [];
  const walk = (node) => {
    [...node.children].forEach((c) => {
      if (c.tagName === 'TABLE') out.push(c);
      else if (c.classList.contains('aem-GridColumn')) out.push(c);
      else if (c.tagName === 'DIV' || c.tagName === 'SECTION' || c.tagName === 'ARTICLE') walk(c);
    });
  };
  walk(el);
  return out;
}

function flatten(doc, el, ctx) {
  if (el.tagName === 'TABLE') return [el];
  if (isHidden(el)) return [];
  const name = componentName(el);
  switch (name) {
    case 'title': return convertTitle(doc, el);
    case 'text': return convertText(doc, el);
    case 'button': return convertButton(doc, el, ctx);
    case 'image': return convertImage(doc, el);
    default: break;
  }
  const kids = gridChildren(el);
  if (!kids.length) {
    // unknown leaf component: keep headings/paragraphs/links/images as default content
    const leftovers = [];
    el.querySelectorAll('h1, h2, h3, h4, h5, h6, p, ul, ol, table, img').forEach((n) => {
      if (n.parentElement.closest('p, ul, ol, table')) return;
      if (n.tagName === 'IMG') { const p = doc.createElement('p'); const i = doc.createElement('img'); i.src = normalizeImageUrl(n.getAttribute('src')); i.alt = n.alt || ''; p.append(i); leftovers.push(p); return; }
      if (n.textContent.trim()) leftovers.push(cleanInline(doc, n));
    });
    if (leftovers.length && !['zone'].includes(name)) ctx.unknown[name] = (ctx.unknown[name] || 0) + 1;
    return leftovers;
  }
  // side-by-side columns → columns block (only if no nested blocks)
  const visible = kids.filter((k) => !isHidden(k));
  const widths = visible.map(gridWidth);
  const sum = widths.reduce((a, b) => a + b, 0);
  if (visible.length >= 2 && widths.every((w) => w < 12) && sum <= 12 + 0.01) {
    const cells = visible.map((k) => flatten(doc, k, ctx));
    const hasBlock = cells.some((c) => c.some((n) => n.tagName === 'TABLE'));
    if (!hasBlock && cells.filter((c) => c.length).length >= 2) {
      const row = cells.map((c) => { const d = doc.createElement('div'); c.forEach((n) => d.append(n)); return d; });
      return [block(doc, `Columns (cols-${widths.join('-')})`, [row])];
    }
    return cells.flat();
  }
  return visible.flatMap((k) => flatten(doc, k, ctx));
}

function metaTable(doc, styles, extra = {}) {
  const rows = [];
  if (styles.length) rows.push(['style', styles.join(', ')]);
  Object.entries(extra).forEach(([k, v]) => rows.push([k, v]));
  if (!rows.length) return null;
  return block(doc, 'Section Metadata', rows);
}

export default function transform(hookName, element, payload) {
  if (hookName !== 'afterTransform') return;
  const doc = element.ownerDocument;
  const main = element.querySelector('main') || element;
  const ctx = { layers: [], layerCount: 0, unknown: {} };
  const tops = gridChildren(main);
  const out = [];
  const pushSection = (nodes, meta) => {
    if (!nodes.length) return;
    if (out.length) out.push(doc.createElement('hr'));
    nodes.forEach((n) => out.push(n));
    if (meta) out.push(meta);
  };
  let pending = [];
  let pendingStyles = null;
  const flush = () => { pushSection(pending, metaTable(doc, pendingStyles || [])); pending = []; pendingStyles = null; };
  tops.forEach((top) => {
    const nodes = flatten(doc, top, ctx);
    if (!nodes.length) return;
    const isContainer = componentName(top) === 'container' || top.tagName === 'TABLE' || nodes.some((n) => n.tagName === 'TABLE');
    if (!isContainer) {
      // loose default components (e.g. page H1) join the following section
      pending.push(...nodes);
      return;
    }
    const styles = top.tagName === 'TABLE' ? [] : sectionStyles(top);
    pending.push(...nodes);
    pendingStyles = styles;
    // keep in-page anchor targets such as the consumption footnotes (#bottom)
    const anchor = top.id === 'bottom' || (top.querySelector && top.querySelector('#bottom')) ? 'bottom' : null;
    if (anchor) {
      pushSection(pending, metaTable(doc, pendingStyles || [], { id: anchor }));
      pending = []; pendingStyles = null;
    } else flush();
    // layers collected while flattening this section follow it
    while (ctx.layers.length) {
      const layer = ctx.layers.shift();
      const lnodes = flatten(doc, layer.el, ctx);
      pushSection(lnodes, metaTable(doc, ['layer'], { id: layer.id, title: layer.title }));
    }
  });
  flush();
  main.replaceChildren(...out);
  payload.unknownComponents = ctx.unknown;
}
