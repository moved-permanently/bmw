/*
 * Final import step: generated block options and section-metadata styles use the semantic
 * authoring vocabulary (scripts/bmw-style-names.js) instead of the internal numeric utilities
 * the parsers / sections transformer derive from the source (cmp-spacing steps, grid spans).
 */
import { toSemanticBlockOptions, toSemanticSectionStyles } from '../../scripts/bmw-style-names.js';

const toClassName = (s) => s.trim().toLowerCase().replace(/[^0-9a-z]+/g, '-').replace(/^-+|-+$/g, '');

/**
 * "Hero Teaser (bottom, cols-10)" -> "Hero Teaser (bottom, text-width-five-sixths)".
 * @param {string} name block table header
 * @returns {string}
 */
export function semanticBlockName(name) {
  const m = name.match(/^(.*?)\s*\((.*)\)\s*$/);
  if (!m) return name;
  const options = m[2].split(',').map(toClassName).filter(Boolean);
  const { options: semantic, exceptions } = toSemanticBlockOptions(toClassName(m[1]), options);
  if (exceptions.length || semantic.join() === options.join()) return name;
  return `${m[1]} (${semantic.join(', ')})`;
}

/**
 * "spacing-top-16, spacing-bottom-16, content-8-center"
 *   -> "space-regular, content-two-thirds-centered".
 * @param {string} value section-metadata style value
 * @returns {string}
 */
export function semanticSectionStyle(value) {
  const styles = value.split(',').map(toClassName).filter(Boolean);
  const { styles: semantic, exceptions } = toSemanticSectionStyles(styles);
  return exceptions.length || semantic.join() === styles.join() ? value : semantic.join(', ');
}

// eslint-disable-next-line no-unused-vars
export default function transform(hookName, element, payload) {
  if (hookName !== 'afterTransform') return;
  element.querySelectorAll('table').forEach((table) => {
    const header = table.querySelector('tr > th, tr > td');
    if (!header) return;
    const name = header.textContent.replace(/\s+/g, ' ').trim();
    if (/^section metadata$/i.test(name)) {
      [...table.querySelectorAll('tr')].forEach((tr) => {
        const [key, value] = tr.children;
        if (key && value && /^style$/i.test(key.textContent.trim())) {
          const semantic = semanticSectionStyle(value.textContent);
          if (semantic !== value.textContent) value.textContent = semantic;
        }
      });
      return;
    }
    const semantic = semanticBlockName(name);
    if (semantic !== name) header.textContent = semantic;
  });
}
