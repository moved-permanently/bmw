/*
 * AI Entry (source cmp-aientry): "BMW AI Assistant fragen" entry field with cycling suggestions in
 * the placeholder and a send button; sending (or the button of the "button-only" variant) opens the
 * BMW AI Assistant of the help sidebar (scripts/bmw-sidebar.js) with the typed question.
 * Rows: 1 = label, 2 = list of suggestions, 3 (optional) = disclaimer text.
 * Options: button-only (only the "BMW AI Assistant fragen" button), ghost-dark (outline button).
 * Placed right after a hero teaser (the importer moves nested blocks behind their parent), the
 * field moves into the hero text like on the source.
 */
import loadSidebar, { openAiAssistant } from '../../scripts/bmw-sidebar.js';

const MIN_LENGTH = 2;

function icon(name, className = '') {
  const span = document.createElement('span');
  span.className = `bmw-icon ${className}`.trim();
  span.dataset.icon = name;
  span.setAttribute('aria-hidden', 'true');
  span.textContent = name;
  return span;
}

function button(className, label, iconName, text) {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = className;
  b.setAttribute('aria-label', label);
  b.append(icon(iconName));
  if (text) b.append(document.createTextNode(text));
  return b;
}

/** Moves the block into the text of a directly preceding hero teaser (source: inside the stage). */
function moveIntoHero(block) {
  const wrapper = block.parentElement;
  const prev = wrapper && wrapper.previousElementSibling;
  if (!prev || !prev.querySelector(':scope > .hero-teaser')) return;
  let tries = 0;
  const place = () => {
    const content = prev.querySelector('.hero-teaser-content');
    if (content) {
      content.append(block);
      block.classList.add('ai-entry-in-hero');
      if (!wrapper.children.length) wrapper.remove();
      return;
    }
    tries += 1;
    if (tries < 50) setTimeout(place, 100);
  };
  place();
}

export default function decorate(block) {
  const rows = [...block.children];
  const label = (rows[0] && rows[0].textContent.trim()) || 'BMW AI Assistant fragen';
  const suggestions = rows[1]
    ? [...rows[1].querySelectorAll('li')].map((li) => li.textContent.trim()).filter(Boolean)
    : [];
  const disclaimerHtml = rows[2] ? rows[2].firstElementChild?.innerHTML.trim() : '';

  const group = document.createElement('div');
  group.className = 'ai-entry-input-group';
  const wrap = document.createElement('div');
  wrap.className = 'ai-entry-input-wrapper';
  const fade = document.createElement('span');
  fade.className = 'ai-entry-input-fade';
  fade.setAttribute('aria-hidden', 'true');

  const placeholder = document.createElement('span');
  placeholder.className = 'ai-entry-placeholder ai-entry-placeholder-animated';
  placeholder.setAttribute('aria-hidden', 'true');
  const ptext = document.createElement('span');
  ptext.className = 'ai-entry-placeholder-text';
  ptext.textContent = label;
  const list = document.createElement('ul');
  list.className = 'ai-entry-suggestions';
  suggestions.forEach((s, i) => {
    const li = document.createElement('li');
    li.className = 'ai-entry-suggestion';
    li.style.setProperty('--suggestion-index', i);
    const sfade = document.createElement('span');
    sfade.className = 'ai-entry-suggestion-fade';
    li.append(sfade, document.createTextNode(s));
    list.append(li);
  });
  placeholder.style.setProperty('--suggestions-count', suggestions.length || 1);
  placeholder.append(icon('speech_bubble_sparkles', 'ai-entry-input-icon'), ptext, list);
  if (!suggestions.length) placeholder.classList.remove('ai-entry-placeholder-animated');

  const input = document.createElement('input');
  input.type = 'search';
  input.maxLength = 200;
  input.autocomplete = 'off';
  input.className = 'ai-entry-input';
  input.setAttribute('aria-label', label);
  if (suggestions.length) input.setAttribute('aria-description', suggestions.join(','));
  const clear = button('ai-entry-input-clear', 'Eingabe löschen', 'error_sign');
  wrap.append(fade, placeholder, input, clear);

  const submit = button('ai-entry-submit', label, 'paper_plane');
  group.append(wrap, submit);
  if (disclaimerHtml) {
    const disclaimer = document.createElement('div');
    disclaimer.className = 'ai-entry-disclaimer';
    disclaimer.innerHTML = disclaimerHtml;
    group.append(disclaimer);
  }

  const direct = document.createElement('div');
  direct.className = 'ai-entry-direct-access';
  const directButton = button('ai-entry-direct-access-button', label, 'paper_plane', label);
  direct.append(directButton);

  block.replaceChildren(group, direct);

  // behaviour (source aientry-v1)
  const update = () => {
    const ok = input.value.length >= MIN_LENGTH;
    submit.disabled = !ok;
    clear.classList.toggle('is-visible', ok);
  };
  const hidePlaceholder = () => placeholder.classList.add('is-hidden');
  const send = () => {
    if (input.value.length < MIN_LENGTH) return;
    openAiAssistant(input.value);
  };
  input.addEventListener('focus', () => {
    hidePlaceholder();
    update();
  });
  input.addEventListener('input', update);
  input.addEventListener('scroll', () => fade.classList.toggle('is-visible', input.scrollLeft > 0));
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && input.value.length >= MIN_LENGTH) {
      e.preventDefault();
      send();
    }
  });
  const onBlur = (from, to) => {
    if ((from === input && to !== clear) || (from === clear && to !== input)) {
      clear.classList.remove('is-visible');
      if (!input.value.length) {
        placeholder.classList.remove('is-hidden');
        submit.disabled = false;
      }
    }
  };
  input.addEventListener('blur', (e) => onBlur(input, e.relatedTarget));
  clear.addEventListener('blur', (e) => onBlur(clear, e.relatedTarget));
  clear.addEventListener('mousedown', (e) => e.preventDefault());
  clear.addEventListener('click', () => {
    input.value = '';
    input.focus();
    update();
  });
  submit.addEventListener('click', () => openAiAssistant(input.value));
  directButton.addEventListener('click', () => openAiAssistant());

  // chat state: after the assistant opened, the field is replaced by the direct access button
  window.addEventListener('aichat_open', () => {
    block.classList.add('chat-open');
    directButton.disabled = true;
  });
  ['chatwidget_minimize', 'chatwidget_close', 'chatwidget_return'].forEach((ev) => {
    window.addEventListener(ev, ({ detail }) => {
      if (detail && detail.appId === 'ckm') {
        block.classList.add('chat-open');
        directButton.disabled = false;
      }
    });
  });

  // suggestions longer than the field scroll sideways (source --suggestion-overflow-amount)
  requestAnimationFrame(() => {
    list.querySelectorAll('.ai-entry-suggestion').forEach((li) => {
      const overflow = li.scrollWidth - list.offsetWidth;
      if (overflow > 0) {
        li.style.setProperty('--suggestion-overflow-amount', `-${overflow}px`);
        li.style.setProperty('--suggestion-overflow-fade', 'running');
      }
    });
  });

  moveIntoHero(block);
  loadSidebar();
}
