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

// ---------- typography / geometry of default components ----------

// heading level per source title style, as mapped by the source base CSS (h1-h3 = headline-1..3,
// h4 = subsection-1, h5 = subsection-2): imported headings take the level of their visual style
const STYLE_LEVEL = { 'headline-2': 2, 'headline-3': 3, 'subsection-1': 4, 'subsection-2': 5 };
const LEVEL_STYLE = { 1: 'headline-1', 2: 'headline-2', 3: 'headline-3', 4: 'subsection-1', 5: 'subsection-2' };

function titleTypo(t) {
  const m = (t.className || '').match(/style-title--((?:headline|subsection)-\d)(?=\s|$)/);
  return m ? m[1] : '';
}

/** Tag for a source title: the level of its style; the page H1 stays H1 (styled via section/columns option). */
function headingTag(t, h) {
  const src = /^H[1-6]$/.test(h.tagName) ? Number(h.tagName[1]) : 2;
  const style = titleTypo(t);
  if (src === 1 || !STYLE_LEVEL[style]) return `h${src}`;
  return `h${STYLE_LEVEL[style]}`;
}

/** Typography of the first title in the columns when it differs from its (imported) tag's default. */
function titleStyle(kids) {
  for (const k of kids) {
    const t = k.matches('.title') ? k : k.querySelector('.title');
    if (t) {
      const style = titleTypo(t);
      const h = t.querySelector('h1, h2, h3, h4, h5, h6');
      if (!style || !h) return '';
      const def = LEVEL_STYLE[headingTag(t, h)[1]];
      return style === def ? '' : `title-${style}`;
    }
  }
  return '';
}

// grid breakpoints of the source (aem-Grid): default >= 1280, large 1024-1279, medium 768-1023,
// small < 768 (the xlarge classes have no CSS on bmw.de)
const BPS = ['default', 'large', 'medium', 'small'];

function colGeo(el, bp) {
  const cls = el.className || '';
  const pick = (re) => { const m = cls.match(re); return m ? m[1] : null; };
  let w = pick(new RegExp(`(?:^|\\s)aem-GridColumn--${bp}--(\\d+|hide)(?=\\s|$)`));
  let o = pick(new RegExp(`aem-GridColumn--offset--${bp}--(\\d+)`));
  if (bp !== 'default') {
    if (w === null) w = pick(/(?:^|\s)aem-GridColumn--default--(\d+|hide)(?=\s|$)/);
    if (o === null) o = pick(/aem-GridColumn--offset--default--(\d+)/);
  }
  if (w === 'hide') return null;
  const g = el.parentElement && el.parentElement.closest('.aem-Grid');
  const gc = g ? g.className : '';
  const gm = gc.match(new RegExp(`aem-Grid--${bp}--(\\d+)`)) || gc.match(/aem-Grid--default--(\d+)/) || gc.match(/aem-Grid--(\d+)(?=\s|$)/);
  const gs = gm ? Number(gm[1]) : 12;
  return { w: Math.min(1, (Number(w) || gs) / gs), o: Math.min(1, (Number(o) || 0) / gs) };
}

/** Effective span/offset (12ths of the page grid) of a component per breakpoint: "w@o" or null. */
function leafGeo(el) {
  const chain = [];
  for (let n = el; n && n.tagName !== 'MAIN'; n = n.parentElement) {
    if (n.classList && n.classList.contains('aem-GridColumn')) chain.unshift(n);
  }
  const out = {};
  BPS.forEach((bp) => {
    let g = { o: 0, w: 1 };
    for (const c of chain) {
      const x = colGeo(c, bp);
      if (!x) { g = null; break; }
      g = { o: g.o + g.w * x.o, w: g.w * x.w };
    }
    out[bp] = g ? `${Math.max(1, Math.round(g.w * 12))}@${Math.round(g.o * 12)}` : null;
  });
  return out;
}

/** Text alignment of a component: style-title--centered or the nearest container alignment. */
function isCentered(el) {
  if (/style-title--centered/.test(el.className || '')) return true;
  for (let n = el; n && n.tagName !== 'MAIN'; n = n.parentElement) {
    const cl = n.classList;
    if (cl && (cl.contains('style-container--center') || cl.contains('style-container--start') || cl.contains('style-container--end'))) {
      return cl.contains('style-container--center');
    }
  }
  return false;
}

/** Records a default component (title/text/button) that ends up as default content. */
function recordLeaf(ctx, el, kind, extra, nodes) {
  if (!ctx.leaves || ctx.inLayer) return;
  ctx.leaves.push({
    kind, geo: leafGeo(el), center: isCentered(el), nodes, ...extra,
  });
}

const FULL = '12@0';
function spanToken(sig) {
  const [w, o] = sig.split('@').map(Number);
  if (w >= 12) return '12';
  if (o === 0) return `${w}`;
  if (o * 2 + w === 12) return `${w}-center`;
  return `${w}-offset-${o}`;
}

/** Section styles derived from the default components of a section: content-N[-center|-offset-O]
 * (+ content-lg-/md-/sm- overrides), center, body-2, h1-<style>. */
function leafStyles(all) {
  const leaves = all.filter((l) => !l.side);
  const styles = [];
  const texts = leaves.filter((l) => l.kind === 'title' || l.kind === 'text');
  const pool = texts.length ? texts : leaves;
  if (!pool.length) return null;
  // dominant geometry of the titles/texts (ties: first); button spans are button widths
  if (texts.length) {
    const key = (l) => BPS.map((bp) => l.geo[bp] || FULL).join(' ');
    const counts = new Map();
    texts.forEach((l) => counts.set(key(l), (counts.get(key(l)) || 0) + 1));
    const best = [...counts.entries()].reduce((a, b) => (b[1] > a[1] ? b : a))[0].split(' ');
    const [xl, lg, md, sm] = best;
    if (xl !== FULL) styles.push(`content-${spanToken(xl)}`);
    if (lg !== xl) styles.push(`content-lg-${spanToken(lg)}`);
    if (md !== lg) styles.push(`content-md-${spanToken(md)}`);
    if (sm !== FULL) styles.push(`content-sm-${spanToken(sm)}`);
  }
  const centered = pool.filter((l) => l.center).length;
  if (centered * 2 > pool.length) styles.push('center');
  const body = leaves.filter((l) => l.kind === 'text' && l.body);
  if (body.filter((l) => l.body === 'body-2').length * 2 > body.length) styles.push('body-2');
  const h1 = leaves.find((l) => l.kind === 'title' && l.h1Style);
  if (h1) styles.push(`h1-${h1.h1Style}`);
  return styles;
}

const isCtaOnly = (n) => n.tagName === 'P' && n.querySelectorAll('a').length === 1
  && n.textContent.trim() === n.querySelector('a').textContent.trim();

/** Layout of side-by-side grid columns in 12ths (see blocks/columns):
 * { spans, md: null | 'stack' | [spans], middle, insets: [side|''], title } */
function columnsInfo(visible, gs) {
  const scale = (w) => Math.min(12, Math.max(1, Math.round((w * 12) / gs)));
  const widths = visible.map(gridWidth);
  // tablet (768-1023): source medium spans relative to the medium grid size (aem-Grid--medium--N);
  // a column without a medium span keeps its default fraction
  const pg = visible[0].parentElement && visible[0].parentElement.closest('.aem-Grid');
  const mdGs = Number(((pg ? pg.className : '').match(/aem-Grid--medium--(\d+)/) || [])[1] || gs);
  const mdF = visible.map((k, i) => {
    const m = gridSpan(k, 'medium');
    return m ? Math.min(1, m / mdGs) : widths[i] / gs;
  });
  const mdW = mdF.map((f) => Math.min(12, Math.max(1, Math.round(f * 12))));
  let md = null;
  if (mdF.every((f) => f >= 1)) md = 'stack';
  else if (mdW.some((w, i) => w !== scale(widths[i]))) md = mdW;
  // vertical centring (flex container "align center")
  const holder = visible[0].parentElement && visible[0].parentElement.closest('.cmp-container');
  return {
    spans: widths.map(scale),
    md,
    middle: !!holder && /cmp-container--flex-align-center/.test(holder.className),
    // flex row-reverse container: cells side by side in reverse order (stacked: authored order)
    reverse: !!holder && /cmp-container--flex-row-reverse/.test(holder.className),
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
  const out = { ...info, spans: [], md: [], insets: [], cells: [] };
  // tablet width of parent cell i (a parent stacked on tablet: full width)
  const parentMdOf = (i) => {
    if (info.md === 'stack') return 12;
    return Array.isArray(info.md) ? info.md[i] : info.spans[i];
  };
  cells.forEach((nodes, i) => {
    const child = nestedColumns(ctx, nodes);
    const parentMd = parentMdOf(i);
    if (!child) {
      out.cells.push(nodes);
      out.spans.push(info.spans[i]);
      out.md.push(parentMd);
      out.insets.push(info.insets[i]);
      return;
    }
    child.cells.forEach((c, j) => {
      out.cells.push(c);
      out.spans.push(Math.max(1, Math.round((info.spans[i] * child.spans[j]) / 12)));
      // a nested row stacked on tablet: each of its cells takes the parent cell's width
      let childMd = child.spans[j];
      if (Array.isArray(child.md)) childMd = child.md[j];
      out.md.push(child.md === 'stack' ? parentMd : Math.max(1, Math.round((parentMd * childMd) / 12)));
      out.insets.push(child.insets[j] || '');
    });
    out.title = out.title || child.title;
  });
  if (out.md.every((w) => w >= 12)) out.md = 'stack';
  else if (out.md.every((w, i) => w === out.spans[i])) out.md = null;
  return out;
}

function columnsOptions(info) {
  const opts = [`cols-${info.spans.join('-')}`];
  if (info.md === 'stack') opts.push('stack-md');
  else if (info.md) opts.push(`md-${info.md.join('-')}`);
  if (info.middle) opts.push('middle');
  if (info.reverse) opts.push('reverse');
  info.insets.forEach((side, i) => { if (side) opts.push(`inset-${i + 1}-${side}`); });
  if (info.title) opts.push(info.title);
  return opts;
}

function isHidden(el) {
  return /aem-GridColumn--default--hide/.test(el.className || '');
}

/** Header text of a block table (WebImporter.Blocks.createBlock). */
function tableName(t) {
  const th = t.querySelector('tr > th, tr > td');
  return th ? th.textContent.replace(/\s+/g, ' ').trim() : '';
}

function tableRows(t) {
  return [...t.querySelectorAll('tr')].filter((tr) => tr.closest('table') === t).slice(1);
}

/** Content nodes of a table cell (a single wrapper div is unwrapped). */
function cellNodes(td) {
  if (!td) return [];
  const kids = [...td.childNodes].filter((n) => n.nodeType === 1 || n.textContent.trim());
  if (kids.length === 1 && kids[0].tagName === 'DIV') return [...kids[0].childNodes];
  return kids;
}

/** Side-by-side cells holding Video / Download blocks (e.g. video | text, image | text + download):
 * the blocks become Columns cell content (blocks/columns builds them at runtime):
 *  - a video cell (the video alone) = poster + video links; its options → video-<option>
 *  - a download row = <p>:download: <a href title="PDF, 1 MB">Label</a></p> (outline → download-outline)
 *  - cells of only Link Lists: their heading + list nodes; options link-lists, link-list-<option>
 * Returns { cells, options } or null when a cell holds any other block. */
function embedBlocks(doc, cells) {
  const options = [];
  let ok = true;
  const out = cells.map((c) => {
    if (!ok) return c;
    const res = [];
    c.forEach((n) => {
      if (!ok) return;
      if (n.tagName !== 'TABLE') { res.push(n); return; }
      const name = tableName(n);
      const opts = ((name.match(/\(([^)]*)\)/) || [])[1] || '').split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
      if (/^video\b/i.test(name) && c.length === 1) {
        const td = tableRows(n)[0] && tableRows(n)[0].querySelector('td');
        const nodes = cellNodes(td);
        if (!nodes.length) { ok = false; return; }
        res.push(...nodes);
        opts.forEach((o) => options.push(`video-${o}`));
      } else if (/^link list\b/i.test(name) && c.every((x) => x.tagName === 'TABLE' && /^link list\b/i.test(tableName(x)))) {
        // link lists (e.g. sitemap columns): heading + list per list, rebuilt by blocks/columns
        const td = tableRows(n)[0] && tableRows(n)[0].querySelector('td');
        res.push(...cellNodes(td));
        options.push('link-lists', ...opts.map((o) => `link-list-${o}`));
      } else if (/^download\b/i.test(name)) {
        if (opts.includes('outline')) options.push('download-outline');
        tableRows(n).forEach((tr) => {
          const [linkTd, metaTd] = [...tr.children];
          const a = linkTd && linkTd.querySelector('a[href]');
          if (!a) return;
          const link = doc.createElement('a');
          link.href = a.getAttribute('href');
          link.textContent = a.textContent.trim();
          const meta = metaTd ? metaTd.textContent.replace(/\s+/g, ' ').trim() : '';
          if (meta) link.setAttribute('title', meta);
          const p = doc.createElement('p');
          p.append(':download: ', link);
          res.push(p);
        });
      } else ok = false;
    });
    return res;
  });
  return ok ? { cells: out, options: [...new Set(options)] } : null;
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

function convertTitle(doc, col, ctx) {
  const h = col.querySelector('h1, h2, h3, h4, h5, h6, .cmp-title__text');
  if (!h) return [];
  if (/style-title__text--eyebrow/.test(col.className || '')) {
    // eyebrow (small uppercase label above a heading) -> <p><sub>label</sub></p> (runtime: p.eyebrow)
    const p = doc.createElement('p');
    const sub = doc.createElement('sub');
    sub.append(...cleanInline(doc, h).childNodes);
    if (!sub.textContent.trim()) return [];
    p.append(sub);
    recordLeaf(ctx, col, 'title', { h1Style: '' }, [p]);
    return [p];
  }
  const tag = headingTag(col, h);
  const out = doc.createElement(tag);
  out.append(...cleanInline(doc, h).childNodes);
  if (!out.textContent.trim()) return [];
  const style = titleTypo(col);
  recordLeaf(ctx, col, 'title', { h1Style: tag === 'h1' && style && style !== 'headline-1' ? style : '' }, [out]);
  return [out];
}

/** Plain running-text paragraph (no image, not a stand-alone link / button). */
function isProse(n) {
  if (!n || n.tagName !== 'P' || n.querySelector('img, picture')) return false;
  const links = n.querySelectorAll('a');
  return !(links.length === 1 && n.textContent.trim() === links[0].textContent.trim());
}

/** Paragraphs of one source text component have no gap between them (source p { margin: 0 });
 * authors space them with empty <p>&nbsp;</p> lines. Consecutive prose paragraphs are joined into
 * one paragraph with line breaks (<br> per paragraph break, one more per spacer line), which
 * renders the source rhythm without runtime support. Returns the nodes to keep. */
function joinTightParagraphs(doc, items) {
  const out = [];
  let prev = null; // last kept node of the same component
  let spacers = 0;
  items.forEach((it) => {
    if (it.spacer) {
      if (prev) spacers += 1;
      return;
    }
    const n = it.node;
    if (prev && isProse(prev) && isProse(n)) {
      for (let i = 0; i <= spacers; i += 1) prev.append(doc.createElement('br'));
      prev.append(...n.childNodes);
    } else {
      out.push(n);
      prev = n;
    }
    spacers = 0;
  });
  return out;
}

function convertText(doc, col, ctx) {
  const root = col.querySelector('.cmp-text') || col;
  const items = [];
  [...root.children].forEach((c) => {
    if (c.matches('.cmp-infoi, [data-cmp-hook-tooltip]')) return;
    if (/^(P|UL|OL|H[1-6]|TABLE|BLOCKQUOTE)$/.test(c.tagName)) {
      const n = cleanInline(doc, c);
      if (n.textContent.trim() || n.querySelector('img')) items.push({ node: n });
      else if (c.tagName === 'P') items.push({ spacer: true });
    } else if (c.textContent.trim()) {
      const p = doc.createElement('p');
      p.append(...cleanInline(doc, c).childNodes);
      items.push({ node: p });
    }
  });
  const cls0 = col.className || '';
  const nodes = /style-text--disclaimer/.test(cls0) || col.querySelector('blockquote.cmp-text__quote')
    ? items.filter((it) => it.node).map((it) => it.node)
    : joinTightParagraphs(doc, items);
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
  // source body text: style-text--body-1, else the base body size (body-2)
  const body = /style-text--body-1(?=\s|$)/.test(cls) ? 'body-1' : 'body-2';
  recordLeaf(ctx, col, 'text', { body }, nodes);
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
  if (/style-button--as-link(?=\s|$)/.test(cls)) p.append(link);
  else if (/style-button--primary/.test(cls)) { const s = doc.createElement('strong'); s.append(link); p.append(s); }
  else if (/style-button--outline/.test(cls)) { const e = doc.createElement('em'); e.append(link); p.append(e); }
  else if (/style-button--(dark|nba-dark|light)/.test(cls)) {
    const s = doc.createElement('strong'); const e = doc.createElement('em'); e.append(link); s.append(e); p.append(s);
  } else p.append(link);
  recordLeaf(ctx, col, 'button', {}, [p]);
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
  const alt = (img.getAttribute('alt') || '').trim();
  // responsive crops of the source <picture>: mobile (max-width <= 767), tablet (max-width <= 1023)
  let mobile = '';
  let tablet = '';
  if (pic) {
    pic.querySelectorAll('source').forEach((s) => {
      const max = Number(((s.getAttribute('media') || '').match(/max-width:\s*(\d+)/) || [])[1] || 0);
      const u = normalizeImageUrl(s.getAttribute('srcset') || s.getAttribute('data-srcset') || '');
      if (!u || u.startsWith('data:') || !max) return;
      if (max <= 767) mobile = mobile || u;
      else if (max <= 1023) tablet = tablet || u;
    });
  }
  mobile = mobile || url;
  tablet = tablet || mobile;
  // order desktop, mobile, tablet (tablet omitted when equal to mobile; single img when all equal)
  const urls = [url];
  if (mobile !== url || tablet !== url) {
    urls.push(mobile);
    if (tablet !== mobile) urls.push(tablet);
  }
  const p = doc.createElement('p');
  urls.forEach((u) => {
    const out = doc.createElement('img');
    out.src = u;
    out.alt = alt;
    p.append(out);
  });
  const res = [p];
  // EU AI label (source .cmp-image__ai-label) -> :ai_eu_label: paragraph right after the image
  if (col.querySelector('.cmp-image__ai-label')) {
    const lbl = doc.createElement('p');
    lbl.textContent = ':ai_eu_label:';
    res.push(lbl);
  }
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

const NEWLINE_RE = /aem-GridColumn--default--newline/;

/** Whether grid columns form one row of side-by-side columns. */
function isColumnsRow(visible, gs) {
  const widths = visible.map(gridWidth);
  const sum = visible.reduce((a, k, i) => a + widths[i] + gridOffset(k, 'default'), 0);
  const newline = visible.slice(1).some((k) => NEWLINE_RE.test(k.className || ''));
  return visible.length >= 2 && !newline && widths.every((w) => w < gs) && sum <= gs;
}

/** Splits grid columns into rows (aem-Grid wrapping: running width + offset > grid size, newline). */
function gridRows(visible, gs) {
  const rows = [];
  let cur = [];
  let sum = 0;
  visible.forEach((k) => {
    const w = gridWidth(k) + gridOffset(k, 'default');
    if (cur.length && (sum + w > gs || NEWLINE_RE.test(k.className || ''))) {
      rows.push(cur);
      cur = [];
      sum = 0;
    }
    cur.push(k);
    sum += w;
  });
  if (cur.length) rows.push(cur);
  return rows;
}

/** One row of side-by-side grid columns -> Columns block (or stacked content when not possible).
 * Widths are relative to the parent grid (a 5-wide nested grid with two 5-wide children stacks them). */
function flattenRow(doc, visible, gs, ctx) {
  const leafMark = ctx.leaves ? ctx.leaves.length : 0;
  let cells = visible.map((k) => flatten(doc, k, ctx));
  let info = columnsInfo(visible, gs);
  if (cells.some((c) => nestedColumns(ctx, c))) {
    info = mergeNested(ctx, info, cells);
    ({ cells } = info);
  }
  const hasBlock = cells.some((c) => c.some((n) => n.tagName === 'TABLE'));
  // videos / downloads beside text stay side by side: embedded into the Columns cells
  const embed = hasBlock ? embedBlocks(doc, cells) : null;
  if (embed) cells = embed.cells;
  // a row of CTAs is a button group, not columns
  const ctaRow = cells.every((c) => c.every(isCtaOnly));
  if ((!hasBlock || embed) && !ctaRow && cells.filter((c) => c.length).length >= 2) {
    const row = cells.map((c) => { const d = doc.createElement('div'); c.forEach((n) => d.append(n)); return d; });
    const table = block(doc, `Columns (${[...columnsOptions(info), ...(embed ? embed.options : [])].join(', ')})`, [row]);
    // remember the layout so a parent grid can merge this row into its own (nested grids)
    if (!ctx.columns) ctx.columns = new Map();
    ctx.columns.set(table, { ...info, cells });
    // components inside the columns block do not shape the section's default content
    if (ctx.leaves) ctx.leaves.length = leafMark;
    return [table];
  }
  // text beside a block (e.g. video | text) is stacked as default content: its source span is
  // not a layout of the section's default content
  if (hasBlock && ctx.leaves) ctx.leaves.slice(leafMark).forEach((l) => { l.side = true; });
  return cells.flat();
}

/** Own spacing of a grid child ({ top, bottom } in source spacing steps): classes of a component /
 * container, or the data-bmw-spacing recorded by replaceWithBlock for parsed components. */
function ownSpacing(el) {
  const src = el.tagName === 'TABLE' ? (el.getAttribute('data-bmw-spacing') || '').split(' ').map((x) => `style-common--cmp-spacing-${x}`).join(' ') : (el.className || '');
  const out = {};
  let m;
  SPACING_RE.lastIndex = 0;
  while ((m = SPACING_RE.exec(src))) out[m[1]] = Math.max(out[m[1]] || 0, Number(m[2]));
  SPACING_RE.lastIndex = 0;
  return out;
}

/** Adds (or raises) a spacing-top|bottom-N option on a block table. */
function setTableSpacing(t, side, n) {
  const head = t.querySelector('tr > th, tr > td');
  if (!head || /^(section )?metadata\b/i.test(tableName(t))) return;
  let name = tableName(t);
  const re = new RegExp(`spacing-${side}-(\\d+)`);
  const cur = name.match(re);
  if (cur) {
    if (Number(cur[1]) >= n) return;
    name = name.replace(re, `spacing-${side}-${n}`);
  } else if (/\)\s*$/.test(name)) name = name.replace(/\)\s*$/, `, spacing-${side}-${n})`);
  else name = `${name} (spacing-${side}-${n})`;
  head.textContent = name;
}

/** flatten() of a stacked grid child: the child's own spacing becomes a spacing option of the block
 * it starts / ends with (source margins between components inside a section container). */
function flattenChild(doc, k, ctx) {
  const nodes = flatten(doc, k, ctx);
  const sp = ownSpacing(k);
  const first = nodes[0];
  const last = nodes[nodes.length - 1];
  if (sp.top && first && first.tagName === 'TABLE') setTableSpacing(first, 'top', sp.top);
  if (sp.bottom && last && last.tagName === 'TABLE') setTableSpacing(last, 'bottom', sp.bottom);
  return nodes;
}

function flatten(doc, el, ctx) {
  if (el.tagName === 'TABLE') return [el];
  if (LOOSE.test(el.tagName)) { el.removeAttribute('data-bmw-loose'); return [el]; }
  if (isHidden(el)) return [];
  const name = componentName(el);
  switch (name) {
    case 'title': return convertTitle(doc, el, ctx);
    case 'text': return convertText(doc, el, ctx);
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
  if (isColumnsRow(visible, gs)) return flattenRow(doc, visible, gs, ctx);
  // several grid rows (running width > grid size or a newline column), e.g. image 7 | text 5 followed
  // by a full-width disclaimer: rows of side-by-side columns become Columns blocks of their own
  const rows = gridRows(visible, gs);
  if (rows.length > 1 && rows.some((r) => isColumnsRow(r, gs))) {
    return rows.flatMap((r) => (isColumnsRow(r, gs)
      ? flattenRow(doc, r, gs, ctx) : r.flatMap((k) => flattenChild(doc, k, ctx))));
  }
  return visible.flatMap((k) => flattenChild(doc, k, ctx));
}

const layoutKey = (styles) => (styles || []).filter((st) => st.startsWith('content-') || st === 'center').join(',');

/** Splits a section's nodes into groups of default-content runs with the same layout (runs are
 * separated by blocks; blocks before a layout change start the next group). Text beside a block
 * (side leaves) forms plain groups without layout styles. */
function sectionGroups(nodes, leaves) {
  const byNode = new Map();
  leaves.forEach((l) => (l.nodes || []).forEach((n) => byNode.set(n, l)));
  const runs = [];
  let cur = null;
  const isText = (l) => !l.side && (l.kind === 'title' || l.kind === 'text');
  const ownKey = (l) => layoutKey(leafStyles([l]));
  nodes.forEach((n) => {
    if (n.tagName === 'TABLE') { runs.push({ table: true, nodes: [n], leaves: [] }); cur = null; return; }
    const l = byNode.get(n);
    // text beside a block and the following regular default content form separate runs
    if (cur && l && cur.side !== undefined && cur.side !== !!l.side) cur = null;
    // a title/text laid out differently from the texts before it (e.g. a centred 8-column title over
    // full-width text) starts a run of its own: the source spans are per component
    if (cur && l && isText(l) && !cur.leaves.includes(l) && cur.textKey !== undefined && ownKey(l) !== cur.textKey) {
      cur = { nodes: [], leaves: [], split: n };
      runs.push(cur);
    }
    if (!cur) { cur = { nodes: [], leaves: [] }; runs.push(cur); }
    cur.nodes.push(n);
    if (l && !cur.leaves.includes(l)) {
      cur.leaves.push(l); cur.side = !!l.side;
      if (isText(l) && cur.textKey === undefined) cur.textKey = ownKey(l);
    }
  });
  runs.forEach((r) => {
    if (r.table) return;
    const texts = r.leaves.filter((l) => !l.side && (l.kind === 'title' || l.kind === 'text'));
    if (texts.length) r.key = layoutKey(leafStyles(texts));
    else if (r.leaves.some((l) => l.side)) r.key = 'side';
  });
  const groups = [{ runs: [], key: undefined }];
  runs.forEach((r) => {
    let g = groups[groups.length - 1];
    if (!r.table && r.key !== undefined) {
      if (g.key === undefined) g.key = r.key;
      else if (g.key !== r.key) {
        const moved = [];
        while (g.runs.length && g.runs[g.runs.length - 1].table) moved.unshift(g.runs.pop());
        g = { runs: moved, key: r.key };
        // continuation of the previous text (no block in between): the gap default content has
        // between these elements
        if (!moved.length && r.split) g.gap = contentGap(r.split);
        groups.push(g);
      }
    }
    g.runs.push(r);
  });
  return groups.filter((g) => g.runs.length).map((g) => ({
    nodes: g.runs.flatMap((r) => r.nodes), leaves: g.runs.flatMap((r) => r.leaves), plain: g.key === 'side', gap: g.gap,
  }));
}

/** Top margin (spacing step) default content gives element n after another element (styles.css). */
function contentGap(n) {
  if (/^H[1-3]$/.test(n.tagName)) return 16;
  if (/^H[4-6]$/.test(n.tagName)) return 10;
  if (isCtaOnly(n) || (n.tagName === 'P' && n.querySelector('img'))) return 8;
  return 4;
}

/** Block table whose name carries a spacing-top-N option. */
function blockTopSpacing(n) {
  if (!n || n.tagName !== 'TABLE') return false;
  const head = n.querySelector('tr > th, tr > td');
  return !!head && /spacing-top-\d+/.test(head.textContent);
}

/** Emits one source section (container styles + default components) as one or more EDS sections. */
function emitSection(doc, nodes, base, leaves, extra, push) {
  const splittable = !base.some((st) => /^(dark|grey|contained|layer)$/.test(st));
  const groups = splittable ? sectionGroups(nodes, leaves) : [{ nodes, leaves, plain: false }];
  groups.forEach((g, i) => {
    const ls = g.plain ? null : leafStyles(g.leaves);
    let styles = ls ? [...base.filter((st) => st !== 'center'), ...ls] : [...base];
    if (g.plain) styles = styles.filter((st) => st !== 'center');
    if (groups.length > 1) {
      if (i > 0) styles = styles.filter((st) => !st.startsWith('spacing-top-'));
      if (i < groups.length - 1) styles = styles.filter((st) => !st.startsWith('spacing-bottom-'));
      // the gap between the default content and the following block inside a section
      if (i > 0 && g.gap) styles.unshift(`spacing-top-${g.gap}`);
      else if (i > 0 && !blockTopSpacing(g.nodes[0])) styles.unshift('spacing-top-8');
    }
    push(g.nodes, metaTable(doc, [...new Set(styles)], i === 0 ? extra : {}));
  });
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
  const ctx = { layers: [], layerCount: 0, unknown: {}, leaves: [] };
  let tops = gridChildren(main);
  // whole page wrapped in one container holding a second <main> (e.g. X1 technical data): its inner
  // containers are the real sections
  // (same for a page whose content sits in one plain full-width container, e.g. BMW ALPINA)
  const single = tops.length === 1 && tops[0].tagName !== 'TABLE' ? tops[0] : null;
  if (single && (single.querySelector('main')
    || (componentName(single) === 'container' && !sectionStyles(single).length && gridChildren(single).length > 1))) {
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
  let pendingBase = null; // container styles of the pending section (null: loose components only)
  const emit = (extra = {}) => {
    if (pending.length) emitSection(doc, pending, pendingBase || [], ctx.leaves, extra, pushSection);
    ctx.leaves = []; pending = []; pendingBase = null;
  };
  tops.forEach((top) => {
    const nodes = flatten(doc, top, ctx);
    if (!nodes.length) return;
    const isContainer = componentName(top) === 'container' || top.tagName === 'TABLE' || nodes.some((n) => n.tagName === 'TABLE');
    if (!isContainer) {
      // loose default components (e.g. page H1) join the following section
      pending.push(...nodes);
      return;
    }
    pending.push(...nodes);
    pendingBase = top.tagName === 'TABLE' ? [] : sectionStyles(top);
    // keep in-page anchor targets such as the consumption footnotes (#bottom)
    const anchor = top.id === 'bottom' || (top.querySelector && top.querySelector('#bottom')) ? 'bottom' : null;
    emit(anchor ? { id: anchor } : {});
    // layers collected while flattening this section follow it
    while (ctx.layers.length) {
      const layer = ctx.layers.shift();
      ctx.inLayer = true;
      const lnodes = flatten(doc, layer.el, ctx);
      ctx.inLayer = false;
      pushSection(lnodes, metaTable(doc, ['layer'], { id: layer.id, title: layer.title }));
    }
  });
  emit();
  main.replaceChildren(...out);
  main.querySelectorAll('[data-bmw-spacing]').forEach((t) => t.removeAttribute('data-bmw-spacing'));
  payload.unknownComponents = ctx.unknown;
}
