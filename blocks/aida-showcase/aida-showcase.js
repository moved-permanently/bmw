import { buildBmwMedia, getImageRefs, getVideoRefs } from '../../scripts/bmw-utils.js';
import installFactRefresh from '../../scripts/aida-showcase.js';

const create = (tag, className) => {
  const element = document.createElement(tag);
  if (className) element.className = className;
  return element;
};
const isMedia = (node) => node.matches('picture, img') || node.querySelector('picture, img')
  || getImageRefs(node).length || getVideoRefs(node).length;

function compose(container, nodes) {
  const media = create('div', 'aida-showcase-media');
  const copy = create('div', 'aida-showcase-copy');
  let body = false;
  nodes.forEach((node) => {
    if (!body && isMedia(node)) media.append(node);
    else { body = true; copy.append(node); }
  });
  if (media.children.length) container.append(media);
  if (copy.children.length) container.append(copy);
}

function reconstruct(block) {
  const nodes = [...block.children].flatMap((row) => [...row.children]
    .flatMap((cell) => [...cell.children]));
  const section = create('section');
  const marker = nodes[0]?.textContent.trim().match(/^component:([a-z0-9-]+)$/);
  if (marker) {
    [, section.dataset.component] = marker;
    nodes.shift().remove();
  }
  if (block.classList.contains('grid')) {
    const grid = create('div', 'aida-showcase-grid');
    let card;
    let content = [];
    const flush = () => {
      if (card) { compose(card, content); grid.append(card); }
      content = [];
    };
    nodes.forEach((node) => {
      if (isMedia(node) || (node.matches('h3') && (!card || content.some((item) => item.matches('h3'))))) {
        flush();
        card = create('article');
      }
      if (card) content.push(node);
      else section.append(node);
    });
    flush();
    section.append(grid);
  } else if (block.classList.contains('stage') || block.classList.contains('feature')) {
    compose(section, nodes);
  } else section.append(...nodes);
  block.replaceChildren(section);
}

function decorateKpis(block) {
  block.querySelectorAll('ul').forEach((list) => {
    const pairs = [...list.children].map((item) => [...item.children]);
    if (!pairs.length || !pairs.every((pair) => pair.length === 2 && pair.every((node) => node.matches('p')))) return;
    const definitions = create('dl', 'aida-showcase-kpis');
    pairs.forEach(([label, value]) => {
      const pair = create('div');
      const term = create('dt');
      const detail = create('dd');
      term.append(...label.childNodes);
      detail.append(...value.childNodes);
      pair.append(term, detail);
      definitions.append(pair);
    });
    list.replaceWith(definitions);
  });
}

export default function decorate(block) {
  const sections = [...block.querySelectorAll('[data-component]')];
  if (sections.length) block.replaceChildren(...sections);
  else reconstruct(block);
  decorateKpis(block);
  block.querySelectorAll('.aida-showcase-media').forEach((media) => {
    const { element } = buildBmwMedia(media, {
      eager: block.classList.contains('stage'),
      video: { autoplay: false, controls: true, playButton: false },
    });
    if (element) media.replaceChildren(element);
  });
  block.querySelectorAll('p').forEach((paragraph) => {
    if ([...paragraph.querySelectorAll('[data-wdh]')].some((fact) => fact.dataset.wdh.endsWith('.wltp'))) paragraph.classList.add('aida-showcase-note');
  });
  if (block.classList.contains('refresh')) installFactRefresh(block);
}
