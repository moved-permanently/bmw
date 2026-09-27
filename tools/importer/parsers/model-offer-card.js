/* eslint-disable */
/* global WebImporter */
// Parser for stand-alone leasing offer cards built from plain containers (shop-online offer pages): a grey
// (style-container--secondary) clickable container with a flag title ("Privatkunden"), the model name
// (headline-3, info-i with the equipment), a subtitle, a COSY car rendering (embed) and a grey price box
// (disclaimer-1 labels with info-i + body-1 values, body-2 "✔ …<br>✔ …" facts); the consumption
// disclaimer follows the card. Emits the "Model Offer (wide)" block with one row in the model-offer
// format: [image (link) | flag, h3 name, subtitle | "label<br>value" entries, facts list | disclaimer |
// info-i texts "<strong>label</strong> text"]. Cards inside carousels / model offers are left to those parsers.
import { replaceWithBlock, cell, text, cleanHref } from './_utils.js';
import { cleanInline } from './_media.js';
import { para, cosyImg } from './_vehicle.js';

const CARD = '.container.style-container--background-normalwidth.style-container--secondary';
export const selectors = [`${CARD}.aem-GridColumn`];

const own = (c) => text(c.querySelector('.cmp-title__text, .cmp-text__paragraph, .cmp-text p') || c);
const tipHtml = (c) => {
  const host = c.hasAttribute('data-info-html') ? c : c.querySelector('[data-info-html]');
  return host ? host.getAttribute('data-info-html') : '';
};

export default function parse(element, { document }) {
  if (element.parentElement && element.parentElement.closest(`${CARD}, .carousel, .modeloffer, .cmp-carousel, .cmp-modeloffer, .tabs, .accordion`)) return;
  const box = [...element.querySelectorAll(CARD)].find((b) => /Monatliche Rate|Gesamtpreis/.test(b.textContent));
  const titles = [...element.querySelectorAll('.title')];
  const nameComp = titles.find((t) => !/style-title--flag/.test(t.className) && !box?.contains(t));
  if (!box || !nameComp) return;

  const tips = [];
  const addTip = (label, comp) => {
    const html = tipHtml(comp);
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

  // image (the whole source card links to the offer form)
  const imgCell = [];
  // (the embed parser has already turned the COSY embed into an image component: .image .cmp-image > img)
  const pic = element.querySelector('.embed picture, .image picture, .image img, picture, img');
  const img = pic ? cosyImg(document, pic) : null;
  if (img) {
    const a = element.querySelector('a.cmp-container__click-area[href]');
    if (a) {
      const link = document.createElement('a');
      link.href = cleanHref(a.getAttribute('href'));
      link.append(img);
      imgCell.push(para(document, link));
    } else imgCell.push(para(document, img));
  }

  // info: flag, name, subtitle
  const info = [];
  const flag = titles.find((t) => /style-title--flag/.test(t.className));
  if (flag && own(flag)) info.push(para(document, document.createTextNode(own(flag))));
  const name = own(nameComp);
  const h = document.createElement('h3');
  h.textContent = name;
  info.push(h);
  addTip(name, nameComp);
  [...element.querySelectorAll('.text')].filter((t) => !box.contains(t) && own(t)).forEach((t) => {
    info.push(para(document, document.createTextNode(own(t))));
  });

  // pricing: label (disclaimer-1) + value (body-1) pairs, facts (✔ lines)
  const pricing = [];
  let label = null;
  [...box.querySelectorAll('.text')].forEach((t) => {
    const txt = own(t);
    if (!txt) return;
    if (/✔|✓/.test(txt)) {
      const ul = document.createElement('ul');
      const src = t.querySelector('.cmp-text__paragraph, p') || t;
      const lines = [];
      let cur = '';
      src.childNodes.forEach((n) => {
        if (n.nodeName === 'BR') { lines.push(cur); cur = ''; } else cur += n.textContent;
      });
      lines.push(cur);
      lines.flatMap((l) => l.split(/[✔✓]/)).map((l) => l.replace(/\s+/g, ' ').trim()).filter(Boolean).forEach((l) => {
        const li = document.createElement('li');
        li.textContent = l;
        ul.append(li);
      });
      if (ul.children.length) pricing.push(ul);
      return;
    }
    if (/style-text--disclaimer/.test(t.className)) {
      if (label) pricing.push(para(document, document.createTextNode(label)));
      label = txt;
      addTip(txt, t);
      return;
    }
    const p = document.createElement('p');
    if (label) p.append(document.createTextNode(label), document.createElement('br'));
    if (t.querySelector('b, strong')) {
      const s = document.createElement('strong');
      s.textContent = txt;
      p.append(s);
    } else p.append(document.createTextNode(txt));
    pricing.push(p);
    label = null;
  });
  if (label) pricing.push(para(document, document.createTextNode(label)));

  // consumption disclaimer(s) right after the card
  const disc = [];
  let sib = element.nextElementSibling;
  while (sib && (/(^|\s)ghost(\s|$)/.test(sib.className) || (sib.matches('.text') && /style-text--disclaimer/.test(sib.className)))) {
    const next = sib.nextElementSibling;
    if (sib.matches('.text')) {
      const p = sib.querySelector('.cmp-text__paragraph, .cmp-text p, p');
      if (p && text(p)) disc.push(cleanInline(document, p));
      sib.remove();
    }
    sib = next;
  }

  const tipCell = [];
  if (tips.length) {
    const ul = document.createElement('ul');
    tips.forEach((li) => ul.append(li));
    tipCell.push(ul);
  }
  const row = [cell(document, imgCell), cell(document, info), cell(document, pricing), cell(document, disc), cell(document, tipCell)];
  replaceWithBlock(document, element, 'Model Offer (wide)', [row]);
}
