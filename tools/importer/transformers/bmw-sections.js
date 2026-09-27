/* eslint-disable */
/* global WebImporter */
// bmw.de → EDS document structure.
// Runs afterTransform (block parsers have already replaced their components with block tables).
//  - every top-level AEM grid column of <main> becomes a section (<hr> separated)
//  - container spacing/alignment classes become section-metadata styles
//  - remaining AEM default components (title/text/button/image/list) become default content
//  - button popovers of type "page" become "layer" sections opened by a #layer-* link
//  - side-by-side grid columns without blocks become a "columns" block
//    (cols-A-B spans, stack-md | md-A-B tablet layout, middle, inset-N-start|end|both, title-<style>)

const SPACING_RE = /style-common--cmp-spacing-(top|bottom)-(\d+)/g;

// AEM grid classes: aem-GridColumn--<bp>--<N> = width, --<bp>--none/newline = row behaviour (not a
// width!), --offset--<bp>--<N> = offset. Widths are relative to the parent aem-Grid--<bp>--<N>.
function gridSpan(el, bp) {
  const m = (el.className || '').match(new RegExp(`(?:^|\\s)aem-GridColumn--${bp}--(\\d+)(?=\\s|$)`));
  return m ? Number(m[1]) : null;
}

function gridOffset(el, bp) {
  const m = (el.className || '').match(new RegExp(`aem-GridColumn--offset--${bp}--(\\d+)`));
  return m ? Number(m[1]) : 0;
}

/** Number of columns of the aem-Grid that holds grid column el (default 12). */
function gridSize(el) {
  const g = el.parentElement && el.parentElement.closest('.aem-Grid');
  const cls = g ? g.className : '';
  const m = cls.match(/aem-Grid--default--(\d+)/) || cls.match(/aem-Grid--(\d+)(?=\s|$)/);
  return m ? Number(m[1]) : 12;
}

function gridWidth(el) {
  return gridSpan(el, 'default') || gridSize(el);
}

/** Side spacing of a column's config-style container at >= 1024px (recorded by bmw-cleanup from
 * the inline per-container <style>), looking through single nested containers. */
function cellInset(kid) {
  let node = kid;
  for (let d = 0; d < 3 && node; d += 1) {
    const c = node.querySelector(':scope > .cmp-container');
    if (!c) return '';
    if (c.hasAttribute('data-bmw-inset')) return c.getAttribute('data-bmw-inset');
    const inner = gridChildren(c).filter((k) => !isHidden(k));
    node = inner.length === 1 && componentName(inner[0]) === 'container' ? inner[0] : null;
  }
  return '';
}

/** Typography of the first title in the columns when it differs from its tag's default. */
function titleStyle(kids) {
  for (const k of kids) {
    const t = k.matches('.title') ? k : k.querySelector('.title');
    if (t) {
      const m = (t.className || '').match(/style-title--((?:headline|subsection)-\d)/);
      const h = t.querySelector('h1, h2, h3, h4, h5, h6');
      if (!m || !h) return '';
      // tag defaults as in the source base CSS: h1-h3 headline-N, h4/h5 subsection-1/2
      const def = { 1: 'headline-1', 2: 'headline-2', 3: 'headline-3', 4: 'subsection-1', 5: 'subsection-2' }[h.tagName[1]];
      return m[1] === def ? '' : `title-${m[1]}`;
    }
  }
  return '';
}

const isCtaOnly = (n) => n.tagName === 'P' && n.querySelectorAll('a').length === 1
  && n.textContent.trim() === n.querySelector('a').textContent.trim();

/** Layout of side-by-side grid columns in 12ths (see blocks/columns):
 * { spans, md: null | 'stack' | [spans], middle, insets: [side|''], title } */
function columnsInfo(visible, gs) {
  const scale = (w) => Math.min(12, Math.max(1, Math.round((w * 12) / gs)));
  const widths = visible.map(gridWidth);
  // tablet (768-1023): source medium widths; missing = same as desktop
  const mdW = visible.map((k, i) => gridSpan(k, 'medium') || widths[i]);
  let md = null;
  if (mdW.every((w) => w >= gs)) md = 'stack';
  else if (mdW.some((w, i) => w !== widths[i])) md = mdW.map(scale);
  // vertical centring (flex container "align center")
  const holder = visible[0].parentElement && visible[0].parentElement.closest('.cmp-container');
  return {
    spans: widths.map(scale),
    md,
    middle: !!holder && /cmp-container--flex-align-center/.test(holder.className),
    insets: visible.map(cellInset),
    title: titleStyle(visible),
  };
}

/** A cell whose only content is a Columns block built by flatten (nested grid): its info. */
function nestedColumns(ctx, nodes) {
  return nodes.length === 1 && ctx.columns && ctx.columns.get(nodes[0]);
}

/** Merges nested single-row Columns into the parent row (a 6+6 grid of 3+3 cards = 4 cards). */
function mergeNested(ctx, info, cells) {
  const out = { ...info, spans: [], md: info.md === 'stack' ? 'stack' : [], insets: [], cells: [] };
  cells.forEach((nodes, i) => {
    const child = nestedColumns(ctx, nodes);
    if (!child) {
      out.cells.push(nodes);
      out.spans.push(info.spans[i]);
      if (Array.isArray(out.md)) out.md.push(info.md ? info.md[i] : info.spans[i]);
      out.insets.push(info.insets[i]);
      return;
    }
    const parentMd = info.md ? info.md[i] : info.spans[i];
    child.cells.forEach((c, j) => {
      out.cells.push(c);
      out.spans.push(Math.max(1, Math.round((info.spans[i] * child.spans[j]) / 12)));
      if (Array.isArray(out.md)) {
        // a nested row stacked on tablet: each of its cells takes the parent cell's width
        const childMd = Array.isArray(child.md) ? child.md[j] : child.spans[j];
        out.md.push(child.md === 'stack' ? parentMd : Math.max(1, Math.round((parentMd * childMd) / 12)));
      }
      out.insets.push(child.insets[j] || '');
    });
    out.title = out.title || child.title;
  });
  if (Array.isArray(out.md) && out.md.every((w, i) => w === out.spans[i])) out.md = null;
  return out;
}

function columnsOptions(info) {
  const opts = [`cols-${info.spans.join('-')}`];
  if (info.md === 'stack') opts.push('stack-md');
  else if (info.md) opts.push(`md-${info.md.join('-')}`);
  if (info.middle) opts.push('middle');
  info.insets.forEach((side, i) => { if (side) opts.push(`inset-${i + 1}-${side}`); });
  if (info.title) opts.push(info.title);
  return opts;
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
  // quote variant: <blockquote class="cmp-text__quote"><div class="cmp-text">…</div><cite>source</cite></blockquote>
  const quote = col.querySelector('blockquote.cmp-text__quote');
  if (quote) {
    const bq = doc.createElement('blockquote');
    nodes.forEach((n) => bq.append(n));
    const cite = quote.querySelector('cite, .cmp-text__quote-source');
    if (cite && cite.textContent.trim()) {
      const p = doc.createElement('p');
      const em = doc.createElement('em');
      em.textContent = cite.textContent.replace(/\s+/g, ' ').trim();
      p.append(em);
      bq.append(p);
    }
    return [bq];
  }
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

// default content emitted by parsers next to their block tables (e.g. a heading before a table)
const LOOSE = /^(H[1-6]|P|UL|OL|BLOCKQUOTE)$/;

/** AEM component placed directly in a container without a grid (no .aem-GridColumn), e.g.
 * .cmp-container > .title — its first class is the component name (title, text, image, video, …). */
function isNonGridComponent(c, parent) {
  if (c.tagName !== 'DIV' || !parent.classList || !parent.classList.contains('cmp-container')) return false;
  const first = c.classList[0] || '';
  return !!first && first !== 'aem-Grid' && !first.startsWith('cmp-') && !first.startsWith('aem-');
}

function gridChildren(el) {
  // direct grid columns below el (through non-column wrappers; some pages nest a second <main>)
  const out = [];
  const walk = (node) => {
    [...node.children].forEach((c) => {
      if (c.tagName === 'TABLE') out.push(c);
      else if (c.classList.contains('aem-GridColumn')) out.push(c);
      else if (LOOSE.test(c.tagName) && c.hasAttribute('data-bmw-loose')) out.push(c);
      else if (isNonGridComponent(c, node)) out.push(c);
      else if (/^(DIV|SECTION|ARTICLE|MAIN|ASIDE)$/.test(c.tagName)) walk(c);
    });
  };
  walk(el);
  return out;
}

function flatten(doc, el, ctx) {
  if (el.tagName === 'TABLE') return [el];
  if (LOOSE.test(el.tagName)) { el.removeAttribute('data-bmw-loose'); return [el]; }
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
  // side-by-side columns → columns block (only if no nested blocks). Widths are relative to the
  // parent grid (a 5-wide nested grid with two 5-wide children stacks them).
  const visible = kids.filter((k) => !isHidden(k));
  const gs = visible.length ? gridSize(visible[0]) : 12;
  const widths = visible.map(gridWidth);
  const sum = visible.reduce((a, k, i) => a + widths[i] + gridOffset(k, 'default'), 0);
  const newline = visible.slice(1).some((k) => /aem-GridColumn--default--newline/.test(k.className || ''));
  if (visible.length >= 2 && !newline && widths.every((w) => w < gs) && sum <= gs) {
    let cells = visible.map((k) => flatten(doc, k, ctx));
    let info = columnsInfo(visible, gs);
    if (cells.some((c) => nestedColumns(ctx, c))) {
      info = mergeNested(ctx, info, cells);
      ({ cells } = info);
    }
    const hasBlock = cells.some((c) => c.some((n) => n.tagName === 'TABLE'));
    // a row of CTAs is a button group, not columns
    const ctaRow = cells.every((c) => c.every(isCtaOnly));
    if (!hasBlock && !ctaRow && cells.filter((c) => c.length).length >= 2) {
      const row = cells.map((c) => { const d = doc.createElement('div'); c.forEach((n) => d.append(n)); return d; });
      const table = block(doc, `Columns (${columnsOptions(info).join(', ')})`, [row]);
      // remember the layout so a parent grid can merge this row into its own (nested grids)
      if (!ctx.columns) ctx.columns = new Map();
      ctx.columns.set(table, { ...info, cells });
      return [table];
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
  let tops = gridChildren(main);
  // whole page wrapped in one container holding a second <main> (e.g. X1 technical data): its inner
  // containers are the real sections
  if (tops.length === 1 && tops[0].querySelector && tops[0].querySelector('main')) {
    tops = gridChildren(tops[0]).flatMap((t) => {
      const kids = t.tagName === 'TABLE' ? [] : gridChildren(t);
      const plain = componentName(t) === 'container' && !sectionStyles(t).length;
      return plain && kids.length > 1 && kids.every((k) => componentName(k) === 'container' || k.tagName === 'TABLE') ? kids : [t];
    });
  }
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
