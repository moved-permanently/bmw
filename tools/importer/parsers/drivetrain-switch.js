/* eslint-disable */
/* global WebImporter */
// Parser for block "drivetrain-switch" (source: .drivetrainswitch.aem-GridColumn, cmp-drivetrain-switch).
// Table rows:
//   [group label (+ branding img, e.g. BMW M) | list: one item per drivetrain card: car image + name;
//    the current page's card is plain text, the others link to their page (#drivetrain)]
//   [series name ("1", "X3") | car image]                        (model card)
//   [fact label | fact value] ...                                (key technical data)
//   [links]: "Technische Daten" (strong = dark button), "Zum Vergleich hinzufügen" (plain link)
//   [disclaimer text]                                            (WLTP consumption line)
import { replaceWithBlock, cleanHref, text, cell, imgEl, normalizeImageUrl } from './_utils.js';
import { cleanInline } from './_media.js';
import { cosyImg, para, inlinePara, vehicleCta } from './_vehicle.js';

export const selectors = ['.drivetrainswitch.aem-GridColumn'];

export default function parse(element, { document }) {
  const root = element.querySelector('.cmp-drivetrain-switch');
  if (!root) return;
  const cells = [];

  // 1. drivetrain groups
  root.querySelectorAll('.cmp-drivetrain-switch__models-group').forEach((group) => {
    const label = [];
    const t = text(group.querySelector('.cmp-drivetrain-switch__models-group-title'));
    if (t) label.push(para(document, document.createTextNode(t)));
    const brand = group.querySelector('.cmp-drivetrain-switch__subbrand-image');
    if (brand && brand.getAttribute('src')) {
      label.push(para(document, imgEl(document, normalizeImageUrl(brand.getAttribute('src')), brand.getAttribute('alt') || '')));
    }
    const ul = document.createElement('ul');
    group.querySelectorAll('.cmp-drivetrain-switch__models-card').forEach((card) => {
      const li = document.createElement('li');
      const img = cosyImg(document, card.querySelector('.cmp-drivetrain-switch__models-card-image-wrapper') || card, '');
      if (img) li.append(img);
      const name = text(card.querySelector('.cmp-drivetrain-switch__models-card-name')) || text(card);
      if (card.tagName === 'A' && card.getAttribute('href')) {
        const a = document.createElement('a');
        a.href = cleanHref(card.getAttribute('href'));
        a.textContent = name;
        li.append(a);
      } else {
        li.append(document.createTextNode(name));
      }
      ul.append(li);
    });
    if (ul.children.length) cells.push([cell(document, label), ul]);
  });

  // 2. model card (series name + image)
  const mc = root.querySelector('.cmp-drivetrain-switch__modelcard .cmp-modelhubcard');
  if (mc) {
    const series = text(mc.querySelector('.cmp-modelhubcard__seriesname'));
    const img = cosyImg(document, mc.querySelector('.cmp-modelhubcard__image') || mc);
    if (img) cells.push([series || ' ', para(document, img)]);
  }

  // 3. key facts
  root.querySelectorAll('.cmp-drivetrain-switch__techdata tr.cmp-technicaldatafact').forEach((tr) => {
    const label = tr.querySelector('.cmp-technicaldatafact__label');
    const value = tr.querySelector('.cmp-technicaldatafact__value');
    if (!text(label) && !text(value)) return;
    cells.push([cell(document, inlinePara(document, label)), cell(document, inlinePara(document, value))]);
  });

  // 4. CTAs
  const links = [];
  root.querySelectorAll('.cmp-drivetrain-switch__techdata-cta .button').forEach((b) => {
    const p = vehicleCta(document, b);
    if (p) links.push(p);
  });
  if (links.length) cells.push([cell(document, links)]);

  // 5. disclaimer
  const disc = [...root.querySelectorAll('.cmp-drivetrain-switch__disclaimer .cmp-text > p, .cmp-drivetrain-switch__disclaimer .cmp-text > ul')]
    .filter((p) => text(p)).map((p) => cleanInline(document, p));
  if (disc.length) cells.push([cell(document, disc)]);

  if (!cells.length) return;
  replaceWithBlock(document, element, 'Drivetrain Switch', cells);
}
