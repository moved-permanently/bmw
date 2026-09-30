import { buildBmwMedia } from '../../scripts/bmw-utils.js';
import installFactRefresh from '../../scripts/aida-showcase.js';

export default function decorate(block) {
  const sections = [...block.querySelectorAll('[data-component]')];
  if (sections.length) block.replaceChildren(...sections);
  block.querySelectorAll('.aida-showcase-media').forEach((media) => {
    const { element } = buildBmwMedia(media, {
      eager: block.classList.contains('stage'),
      video: { autoplay: false, controls: true, playButton: false },
    });
    if (element) media.replaceChildren(element);
  });
  if (block.classList.contains('refresh')) installFactRefresh(block);
}
