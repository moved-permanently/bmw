import { decorateFontIcons } from '../../scripts/bmw-utils.js';

/*
 * Color Switch (source .cmp-colorswitch): full-bleed car (exterior) or cabin (interior) image with
 * colour swatches. Clicking a swatch crossfades to that colour. Several vehicles: title with
 * previous / next arrows (and "1 / 3" indicator). Mobile: the image is taller than wide and can be
 * dragged sideways (gesture hint). Optional hotspot "+" on the image opens a slide-out layer.
 *  Rows (per vehicle):
 *   [vehicle title]                                   starts a vehicle
 *   [swatch image | colour name (+ note) | images: desktop, mobile, tablet
 *     [| layer: image, h3, text]]
 *   [link]                                  CTA of the vehicle (e.g. "Mehr Farben entdecken")
 * Options: exterior (default) | interior, hotspot-top-left … hotspot-bottom-right
 * (default middle-center).
 */

const DESKTOP_MQ = window.matchMedia('(min-width: 1024px)');
const HOTSPOT_POSITIONS = ['top-left', 'top-center', 'top-right', 'middle-left', 'middle-center',
  'middle-right', 'bottom-left', 'bottom-center', 'bottom-right'];
let seq = 0;

const cellText = (c) => (c ? c.textContent.replace(/\s+/g, ' ').trim() : '');
const imagesOf = (c) => (c ? [...c.querySelectorAll('img')] : []);

function iconEl(name, cls) {
  const i = document.createElement('span');
  i.className = `bmw-icon ${cls || ''}`.trim();
  i.dataset.icon = name;
  i.setAttribute('aria-hidden', 'true');
  i.textContent = name;
  return i;
}

/** Picture from authored images (desktop, mobile, tablet); cosy URLs are used as they are. */
function carPicture(imgs, alt) {
  const [desktop, mobile, tablet] = imgs.map((i) => i.currentSrc || i.src);
  const picture = document.createElement('picture');
  const add = (media, url) => {
    if (!url) return;
    const s = document.createElement('source');
    s.media = media;
    s.srcset = url;
    picture.append(s);
  };
  add('(max-width: 767px)', mobile);
  add('(max-width: 1023px)', tablet || mobile);
  const img = document.createElement('img');
  img.src = desktop || mobile || '';
  img.alt = alt || '';
  img.loading = 'lazy';
  img.decoding = 'async';
  img.draggable = false;
  picture.append(img);
  return picture;
}

function parseVehicles(block) {
  const vehicles = [];
  let current = null;
  const ensure = () => {
    if (!current) {
      current = { title: '', colors: [], ctas: [] };
      vehicles.push(current);
    }
    return current;
  };
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const filled = cells.filter((c) => c.textContent.trim() || c.querySelector('img, a'));
    if (!filled.length) return;
    if (filled.length === 1 && !filled[0].querySelector('img')) {
      const c = filled[0];
      const links = [...c.querySelectorAll('a[href]')];
      if (links.length && cellText(c) === links.map((a) => a.textContent.trim()).join(' ').trim()) {
        ensure().ctas.push(...links);
      } else {
        current = { title: cellText(c), colors: [], ctas: [] };
        vehicles.push(current);
      }
      return;
    }
    const [swatchCell, nameCell, imgCell, layerCell] = cells;
    const paras = nameCell ? [...nameCell.querySelectorAll('p')] : [];
    const name = paras.length ? paras[0].textContent.trim() : cellText(nameCell);
    const note = paras.length > 1 ? paras.slice(1).map((p) => p.textContent.trim()).join(' ') : '';
    ensure().colors.push({
      swatch: imagesOf(swatchCell)[0] || null,
      name,
      note,
      images: imagesOf(imgCell),
      layer: layerCell && (layerCell.textContent.trim() || layerCell.querySelector('img')) ? layerCell : null,
    });
  });
  return vehicles.filter((v) => v.colors.length);
}

function buildLayer(layerCell, onClose) {
  const panel = document.createElement('div');
  panel.className = 'color-switch-slideout';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-modal', 'false');
  panel.tabIndex = -1;
  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'color-switch-slideout-close';
  close.setAttribute('aria-label', 'Schließen');
  close.append(iconEl('close'));
  close.addEventListener('click', onClose);
  const content = document.createElement('div');
  content.className = 'color-switch-slideout-content';
  const pic = layerCell.querySelector('picture, img');
  if (pic) {
    const media = document.createElement('div');
    media.className = 'color-switch-slideout-image';
    media.append(pic.closest('picture') || pic);
    const img = media.querySelector('img');
    if (img) img.classList.add('color-switch-slideout-img');
    panel.append(media);
  }
  [...layerCell.children].forEach((el) => {
    if (el.textContent.trim()) content.append(el);
  });
  // paragraphs that ended up wrapping block content (after media extraction) are unwrapped
  content.querySelectorAll('p').forEach((p) => {
    if (p.querySelector('h1, h2, h3, h4, h5, h6, p, ul, ol')) p.replaceWith(...p.childNodes);
  });
  const h = content.querySelector('h1, h2, h3, h4, h5, h6');
  if (h) {
    seq += 1;
    h.id = h.id || `color-switch-layer-${seq}`;
    panel.setAttribute('aria-labelledby', h.id);
  }
  panel.append(content, close);
  return panel;
}

/** Horizontal drag of the (wider than the viewport) image on mobile / tablet. */
function enablePanning(stage, wrapper, onFirstPan) {
  let x = null;
  let startX = 0;
  let startOffset = 0;
  let dragging = false;
  const bounds = () => {
    const min = Math.min(0, stage.clientWidth - wrapper.scrollWidth);
    return { min, max: 0 };
  };
  const apply = (val) => {
    const { min, max } = bounds();
    x = Math.max(min, Math.min(max, val));
    wrapper.style.transform = DESKTOP_MQ.matches ? '' : `translateX(${x}px)`;
  };
  const reset = () => {
    // start at the right end (front of the car), like the source
    if (DESKTOP_MQ.matches) {
      wrapper.style.transform = '';
      x = null;
      return;
    }
    apply(bounds().min);
  };
  wrapper.addEventListener('pointerdown', (e) => {
    if (DESKTOP_MQ.matches || e.button !== 0) return;
    dragging = true;
    startX = e.clientX;
    startOffset = x == null ? bounds().min : x;
    wrapper.setPointerCapture(e.pointerId);
    wrapper.classList.add('is-dragging');
  });
  wrapper.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    apply(startOffset + (e.clientX - startX));
    if (Math.abs(e.clientX - startX) > 5) onFirstPan();
  });
  const end = () => {
    dragging = false;
    wrapper.classList.remove('is-dragging');
  };
  wrapper.addEventListener('pointerup', end);
  wrapper.addEventListener('pointercancel', end);
  stage.addEventListener('keydown', (e) => {
    if (DESKTOP_MQ.matches || !['ArrowLeft', 'ArrowRight'].includes(e.key)) return;
    e.preventDefault();
    apply((x == null ? bounds().min : x) + (e.key === 'ArrowLeft' ? 60 : -60));
    onFirstPan();
  });
  wrapper.addEventListener('load', reset, true);
  window.addEventListener('resize', reset);
  DESKTOP_MQ.addEventListener('change', reset);
  return reset;
}

function buildVehicle(block, vehicle, vIndex, hotspotPos) {
  const item = document.createElement('div');
  item.className = 'color-switch-item';
  item.dataset.index = String(vIndex);

  const stage = document.createElement('div');
  stage.className = 'color-switch-stage';
  stage.setAttribute('role', 'region');
  stage.setAttribute('aria-label', 'Verschiebbarer Bildcontainer – Pfeil nach links/rechts verwenden, um das Bild zu verschieben');
  stage.tabIndex = 0;
  const wrapper = document.createElement('div');
  wrapper.className = 'color-switch-images';
  vehicle.colors.forEach((c, i) => {
    const holder = document.createElement('div');
    holder.className = 'color-switch-image';
    holder.setAttribute('aria-hidden', i ? 'true' : 'false');
    if (!i) holder.classList.add('is-selected');
    const alt = c.images[0] ? c.images[0].alt : '';
    holder.append(carPicture(c.images, alt || `${vehicle.title} in ${c.name}`.trim()));
    wrapper.append(holder);
  });
  stage.append(wrapper);

  // gesture hint (mobile)
  const hint = document.createElement('div');
  hint.className = 'color-switch-hint';
  hint.setAttribute('aria-hidden', 'true');
  hint.append(iconEl('arrow_right', 'color-switch-hint-arrow'), iconEl('hand_pointing_up', 'color-switch-hint-hand'));
  stage.append(hint);
  const hideHint = () => item.classList.add('hint-done');

  // hotspot + slide-out layers
  const layers = vehicle.colors.map((c) => c.layer);
  let hotspot = null;
  let openLayer = null;
  const layerPanels = [];
  const closeLayer = () => {
    if (!openLayer) return;
    block.classList.remove('slideout-open');
    openLayer.classList.remove('is-open');
    const panel = openLayer;
    openLayer = null;
    setTimeout(() => { if (panel !== openLayer) panel.hidden = true; }, 600);
    if (hotspot) hotspot.focus({ preventScroll: true });
  };
  if (layers.some(Boolean)) {
    const grid = document.createElement('div');
    grid.className = 'color-switch-hotspots';
    hotspot = document.createElement('button');
    hotspot.type = 'button';
    hotspot.className = `color-switch-hotspot color-switch-hotspot-${hotspotPos}`;
    hotspot.setAttribute('aria-label', 'Details anzeigen');
    hotspot.append(iconEl('plus'));
    grid.append(hotspot);
    stage.append(grid);
    layers.forEach((l, i) => {
      if (!l) {
        layerPanels[i] = null;
        return;
      }
      const panel = buildLayer(l, closeLayer);
      panel.hidden = true;
      layerPanels[i] = panel;
      item.append(panel);
    });
    const backdrop = document.createElement('div');
    backdrop.className = 'color-switch-backdrop';
    backdrop.addEventListener('click', closeLayer);
    item.append(backdrop);
  }

  // nav: title (+ arrows), swatches, colour name, CTA
  const controls = document.createElement('div');
  controls.className = 'color-switch-controls';
  const name = document.createElement('div');
  name.className = 'color-switch-colorname';
  name.setAttribute('aria-live', 'polite');
  const nameText = document.createElement('span');
  const note = document.createElement('span');
  note.className = 'color-switch-colornote';
  name.append(nameText, note);
  const swatches = document.createElement('ul');
  swatches.className = 'color-switch-swatches';
  let selected = 0;
  const select = (i) => {
    selected = i;
    [...wrapper.children].forEach((h, k) => {
      h.classList.toggle('is-selected', k === i);
      h.setAttribute('aria-hidden', k === i ? 'false' : 'true');
    });
    [...swatches.querySelectorAll('button')].forEach((b, k) => {
      b.classList.toggle('is-selected', k === i);
      b.setAttribute('aria-pressed', String(k === i));
    });
    nameText.textContent = vehicle.colors[i].name;
    note.textContent = vehicle.colors[i].note ? ` ${vehicle.colors[i].note}` : '';
    if (hotspot) hotspot.hidden = !layerPanels[i];
    if (openLayer) closeLayer();
  };
  vehicle.colors.forEach((c, i) => {
    const li = document.createElement('li');
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'color-switch-swatch';
    b.dataset.title = `Farbe des Fahrzeugs ändern in: ${c.name}`;
    b.setAttribute('aria-label', `Farbe des Fahrzeugs ändern in: ${c.name}`);
    if (c.note) b.classList.add('is-unavailable');
    if (c.swatch) {
      const img = document.createElement('img');
      img.src = c.swatch.currentSrc || c.swatch.src;
      img.alt = '';
      img.loading = 'lazy';
      b.append(img);
    }
    b.addEventListener('click', () => select(i));
    li.append(b);
    swatches.append(li);
  });
  const swatchRow = document.createElement('div');
  swatchRow.className = 'color-switch-swatch-row';
  swatchRow.append(swatches);
  vehicle.ctas.forEach((a) => {
    const p = document.createElement('p');
    p.className = 'color-switch-cta';
    if (!a.classList.contains('button')) a.classList.add('link-arrow');
    p.append(a);
    swatchRow.append(p);
  });
  const picker = document.createElement('div');
  picker.className = 'color-switch-picker';
  picker.append(name, swatchRow);
  controls.append(picker);
  stage.append(controls);
  item.append(stage);

  if (hotspot) {
    hotspot.addEventListener('click', () => {
      const panel = layerPanels[selected];
      if (!panel) return;
      panel.hidden = false;
      panel.querySelectorAll('img').forEach((img) => { img.loading = 'eager'; });
      // next frame so the slide-in transition runs
      requestAnimationFrame(() => {
        panel.classList.add('is-open');
        block.classList.add('slideout-open');
        openLayer = panel;
        panel.focus({ preventScroll: true });
      });
    });
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeLayer();
    });
  }

  const resetPan = enablePanning(stage, wrapper, hideHint);
  select(0);
  return { item, resetPan, hideHint };
}

export default function decorate(block) {
  const interior = block.classList.contains('interior');
  if (!interior) block.classList.add('exterior');
  const hotspotPos = HOTSPOT_POSITIONS.find((p) => block.classList.contains(`hotspot-${p}`)) || 'middle-center';
  const vehicles = parseVehicles(block);
  if (!vehicles.length) return;

  const items = vehicles.map((v, i) => buildVehicle(block, v, i, hotspotPos));
  const itemsWrap = document.createElement('div');
  itemsWrap.className = 'color-switch-items';
  items.forEach(({ item }, i) => {
    if (i) item.hidden = true;
    itemsWrap.append(item);
  });

  // title bar (vehicle name, arrows, number indicator)
  const nav = document.createElement('div');
  nav.className = 'color-switch-nav';
  const multi = vehicles.length > 1;
  let current = 0;
  const indicator = document.createElement('div');
  indicator.className = 'color-switch-counter';
  indicator.setAttribute('role', 'status');
  const titleRow = document.createElement('div');
  titleRow.className = 'color-switch-title-row';
  const title = document.createElement('p');
  title.className = 'color-switch-title';
  title.setAttribute('role', 'heading');
  title.setAttribute('aria-level', '2');
  titleRow.append(title);
  const prev = document.createElement('button');
  const next = document.createElement('button');
  [[prev, 'arrow_left', 'Vorheriges Fahrzeug', 'prev'], [next, 'arrow_right', 'Nächstes Fahrzeug', 'next']].forEach(([b, icon, label, cls]) => {
    b.type = 'button';
    b.className = `color-switch-arrow color-switch-arrow-${cls}`;
    b.setAttribute('aria-label', label);
    b.append(iconEl(icon));
  });
  if (multi) titleRow.append(prev, next);
  const line = document.createElement('div');
  line.className = 'color-switch-line';
  if (multi) nav.append(indicator);
  nav.append(titleRow, line);
  const show = (i) => {
    current = i;
    items.forEach(({ item }, k) => {
      item.hidden = k !== i;
      item.classList.toggle('is-active', k === i);
    });
    title.textContent = vehicles[i].title;
    indicator.textContent = `${i + 1} / ${vehicles.length}`;
    prev.disabled = i === 0;
    next.disabled = i === vehicles.length - 1;
    if (vehicles.some((v) => v.title)) items[i].item.querySelector('.color-switch-controls').prepend(nav);
    items[i].resetPan();
  };
  prev.addEventListener('click', () => current > 0 && show(current - 1));
  next.addEventListener('click', () => current < vehicles.length - 1 && show(current + 1));

  block.replaceChildren(itemsWrap);
  if (!vehicles.some((v) => v.title)) block.classList.add('no-title');
  show(0);
  decorateFontIcons(block);

  // gesture hint once the block is in view (mobile only; hidden on desktop by CSS)
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        io.disconnect();
        block.classList.add('hint-visible');
        setTimeout(() => items.forEach((it) => it.hideHint()), 4500);
      }
    }, { threshold: 0.5 });
    io.observe(block);
  }
}
