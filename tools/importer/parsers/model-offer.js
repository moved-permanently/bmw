/* eslint-disable */
/* global WebImporter */
// Parser for block "model-offer" (source: .modeloffer.aem-GridColumn, cmp-modeloffer carousel of
// cmp-modelofferitem leasing offers). Block "Model Offer" (option slides-3 when the source shows
// three cards on desktop). One row per offer:
//   [car image (linked to the offer form) | flag paragraph (e.g. "Gewerbekunden"), h3 model name,
//    subtitle | price entries "label<br>value" (monthly rate value bold), list of leasing facts |
//    disclaimer (consumption / WLTP) | info-i texts: list items "<strong>label</strong> text"]
// Info-i texts are only available when bmw-cleanup keeps them (data-info-html on the field element).
import { replaceWithBlock, cell, text, cleanHref } from './_utils.js';
import { cleanInline } from './_media.js';
import { para, cosyImg } from './_vehicle.js';

export const selectors = ['.modeloffer.aem-GridColumn'];

function tooltipHtml(field) {
  if (!field) return '';
  const host = field.hasAttribute('data-info-html') ? field : field.querySelector('[data-info-html]');
  if (host) return host.getAttribute('data-info-html');
  const c = field.querySelector('[data-cmp-hook-tooltip="content"]');
  return c ? c.innerHTML : '';
}

function fieldText(el) {
  if (!el || /field--empty/.test(el.className)) return '';
  const t = el.querySelector('.cmp-modelofferitem__infoi-text') || el;
  const c = t.cloneNode(true);
  c.querySelectorAll('.cmp-infoi, [data-cmp-hook-tooltip]').forEach((x) => x.remove());
  return text(c);
}

function itemRow(document, item) {
  const q = (s) => item.querySelector(`.cmp-modelofferitem__${s}`);
  const tips = [];
  const addTip = (label, field) => {
    const html = tooltipHtml(field);
    if (!label || !html) return;
    const li = document.createElement('li');
    const strong = document.createElement('strong');
    strong.textContent = label;
    const d = document.createElement('div');
    d.innerHTML = html;
    d.querySelectorAll('[class]').forEach((e) => e.removeAttribute('class'));
    li.append(strong, document.createTextNode(' '), ...d.childNodes);
    tips.push(li);
  };

  // image
  const imgCell = [];
  const imgWrap = q('image');
  const img = imgWrap ? cosyImg(document, imgWrap) : null;
  if (img) {
    const a = imgWrap.querySelector('a[href]');
    if (a) {
      const link = document.createElement('a');
      link.href = cleanHref(a.getAttribute('href'));
      link.append(img);
      imgCell.push(para(document, link));
    } else imgCell.push(para(document, img));
  }

  // info
  const info = [];
  const flag = text(q('flag'));
  if (flag) info.push(para(document, document.createTextNode(flag)));
  const body = fieldText(q('bodytype'));
  if (body) info.push(para(document, document.createTextNode(body)));
  const name = fieldText(q('modelname'));
  if (name) {
    const h = document.createElement('h3');
    h.textContent = name;
    info.push(h);
    addTip(name, q('modelname'));
  }
  const sub = fieldText(q('modelsubtitle'));
  if (sub) info.push(para(document, document.createTextNode(sub)));

  // pricing
  const pricing = [];
  const pair = (labelKey, valueKey, bold) => {
    const label = fieldText(q(labelKey));
    const valueEl = q(valueKey);
    const value = fieldText(valueEl);
    if (!label && !value) return;
    const p = document.createElement('p');
    if (label) p.append(document.createTextNode(label));
    if (label && value) p.append(document.createElement('br'));
    if (value) {
      if (bold || (valueEl && valueEl.querySelector('b, strong'))) {
        const s = document.createElement('strong');
        s.textContent = value;
        p.append(s);
      } else p.append(document.createTextNode(value));
    }
    pricing.push(p);
    addTip(label, q(labelKey));
  };
  const deposit = fieldText(q('deposit'));
  if (deposit) pricing.push(para(document, document.createTextNode(deposit)));
  pair('monthlyratelabel', 'monthlyratevalue', true);
  const rateNote = fieldText(q('monthlyRateDisclaimer'));
  if (rateNote) pricing.push(para(document, document.createTextNode(rateNote)));
  pair('totalPriceLabel', 'totalPriceValue', false);
  ['leasingInfo', 'benefitsInfo'].forEach((key) => {
    const box = q(key);
    if (!box) return;
    const ul = document.createElement('ul');
    box.querySelectorAll('.cmp-modelofferitem__list-line, p, li').forEach((l) => {
      if (/field--empty/.test(l.className)) return;
      const t = text(l).replace(/^[✔✓]\s*/, '');
      if (!t || [...ul.children].some((x) => x.textContent === t)) return;
      const li = document.createElement('li');
      li.textContent = t;
      ul.append(li);
    });
    if (ul.children.length) pricing.push(ul);
  });

  // disclaimer
  const disc = [];
  const bottom = q('bottomdisclaimer');
  if (bottom) {
    const p = bottom.querySelector('.cmp-modelofferitem__infoi-text, p');
    if (p && text(p)) disc.push(cleanInline(document, p));
  }

  if (!imgCell.length && !info.length && !pricing.length) return null;
  const tipCell = [];
  if (tips.length) {
    const ul = document.createElement('ul');
    tips.forEach((li) => ul.append(li));
    tipCell.push(ul);
  }
  return [cell(document, imgCell), cell(document, info), cell(document, pricing), cell(document, disc), cell(document, tipCell)];
}

export default function parse(element, { document }) {
  const root = element.querySelector('.cmp-modeloffer');
  if (!root) return;
  const cells = [];
  root.querySelectorAll('.cmp-modelofferitem').forEach((item) => {
    const row = itemRow(document, item);
    if (row) cells.push(row);
  });
  if (!cells.length) return;
  const slides = Number(root.querySelector('.cmp-carousel')?.getAttribute('data-desktop-slides') || 2);
  replaceWithBlock(document, element, slides >= 3 ? 'Model Offer (slides-3)' : 'Model Offer', cells);
}
