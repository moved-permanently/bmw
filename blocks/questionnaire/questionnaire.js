/*
 * Questionnaire (source cmp-questionnaire + cmp-microsite, e.g. the BMW Financial Services
 * "Formularfinder"): one page per question / result; the URL hash selects the visible page.
 * Rows:
 *   <page id> | page content [| answers-N]   question text, answer links, result text, downloads;
 *                                            answers-N = answer tile width N/12 (default 2)
 *   questions | q1, q2, ...                  ids of the question pages
 *   rules     | "condition = result" per paragraph (+ and, | or, ! not, parentheses)
 *   fallback  | page shown when no rule matches (optional)
 * Answers: links to "#<page id>" go there directly, links to "#<answer id>" are evaluated by the
 * rules; answer ids are <question id>a<n> (n = position on the page), as on the source.
 */

const KEYS = ['questions', 'rules', 'fallback'];
const DOWNLOAD_RE = /\.(pdf|zip|docx?|xlsx?|pptx?)(\?|#|$)|\.coredownload\./i;

/** Evaluates "q2a1+q3a1", "q2a1|q2a2", "!(q1a1)" against the given answer ids. */
export function evaluateCondition(condition, answered) {
  const src = (condition || '').replace(/\s+/g, '');
  if (!src || !/^[()+|!a-zA-Z0-9_]+$/.test(src)) return false;
  let pos = 0;
  const peek = () => src[pos];
  let parseOr;
  const parseAtom = () => {
    if (peek() === '!') {
      pos += 1;
      return !parseAtom();
    }
    if (peek() === '(') {
      pos += 1;
      const v = parseOr();
      if (peek() === ')') pos += 1;
      return v;
    }
    const m = src.slice(pos).match(/^[a-zA-Z0-9_]+/);
    if (!m) throw new Error('syntax');
    pos += m[0].length;
    return answered.has(m[0]);
  };
  const parseAnd = () => {
    let v = parseAtom();
    while (peek() === '+') {
      pos += 1;
      v = parseAtom() && v;
    }
    return v;
  };
  parseOr = () => {
    let v = parseAnd();
    while (peek() === '|') {
      pos += 1;
      v = parseAnd() || v;
    }
    return v;
  };
  try {
    const result = parseOr();
    return pos === src.length ? result : false;
  } catch {
    return false;
  }
}

function hashId() {
  try {
    return decodeURIComponent(window.location.hash.replace(/^#/, ''));
  } catch {
    return window.location.hash.replace(/^#/, '');
  }
}

function decorateDownloads(root) {
  root.querySelectorAll('p').forEach((p) => {
    const links = p.querySelectorAll('a[href]');
    if (links.length !== 1 || p.textContent.trim() !== links[0].textContent.trim()) return;
    const a = links[0];
    if (!DOWNLOAD_RE.test(a.getAttribute('href'))) return;
    p.classList.add('questionnaire-download');
    a.classList.add('questionnaire-download-link');
    a.setAttribute('download', '');
    const icon = document.createElement('span');
    icon.className = 'bmw-icon';
    icon.dataset.icon = 'download';
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = 'download';
    a.prepend(icon);
  });
}

export default function decorate(block) {
  const pages = [];
  const config = { questions: [], rules: [], fallback: null };
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const key = cells[0] ? cells[0].textContent.trim() : '';
    if (!key) return;
    const lower = key.toLowerCase();
    if (KEYS.includes(lower)) {
      const value = cells[1];
      if (!value) return;
      if (lower === 'questions') {
        config.questions = value.textContent.split(/[\s,;]+/).filter(Boolean);
      } else if (lower === 'rules') {
        const lines = value.querySelectorAll('p, li').length
          ? [...value.querySelectorAll('p, li')].map((p) => p.textContent)
          : value.textContent.split('\n');
        lines.forEach((line) => {
          const m = line.match(/^\s*(.+?)\s*(=>|=|→|->)\s*([A-Za-z0-9_-]+)\s*$/);
          if (m) config.rules.push({ condition: m[1], result: m[3] });
        });
      } else {
        config.fallback = value.textContent.trim() || null;
      }
      return;
    }
    const opts = cells[2] ? cells[2].textContent.trim() : '';
    const cols = (opts.match(/answers-(\d+)/) || [])[1];
    pages.push({ id: key, content: cells[1] || document.createElement('div'), cols });
  });
  if (!pages.length) return;

  const pageIds = new Set(pages.map((p) => p.id));
  const questions = new Set(config.questions);
  const answers = []; // {questionId, answerId}
  const container = document.createElement('div');
  container.className = 'questionnaire-pages';
  const pageEls = pages.map((page, index) => {
    const el = document.createElement('div');
    el.className = 'questionnaire-page';
    el.id = page.id;
    el.hidden = index !== 0;
    if (page.cols) el.style.setProperty('--questionnaire-answer-cols', page.cols);
    el.append(...page.content.childNodes);
    decorateDownloads(el);
    let n = 0;
    [...el.querySelectorAll('p')].forEach((p) => {
      const links = p.querySelectorAll('a[href^="#"]');
      if (links.length !== 1 || p.textContent.trim() !== links[0].textContent.trim()) return;
      const a = links[0];
      a.classList.add('questionnaire-answer');
      const label = document.createElement('span');
      label.className = 'questionnaire-answer-text';
      label.append(...a.childNodes);
      a.append(label);
      if (questions.has(page.id)) {
        n += 1;
        a.dataset.questionId = page.id;
        a.dataset.answerId = `${page.id}a${n}`;
      }
    });
    // consecutive answer paragraphs form one row of tiles
    let group = null;
    [...el.children].forEach((child) => {
      if (child.tagName === 'P' && child.querySelector('a.questionnaire-answer')) {
        if (!group) {
          group = document.createElement('div');
          group.className = 'questionnaire-answers';
          child.before(group);
        }
        group.append(child);
      } else {
        group = null;
      }
    });
    container.append(el);
    return el;
  });
  block.replaceChildren(container);

  const show = (id) => {
    const target = pageEls.find((el) => el.id === id);
    if (!target) return false;
    pageEls.forEach((el) => { el.hidden = el !== target; });
    return true;
  };

  const checkRules = (answerId) => {
    const answered = new Set(answers.map((a) => a.answerId));
    const rule = config.rules.find((r) => r.condition.includes(answerId)
      && evaluateCondition(r.condition, answered));
    const result = rule ? rule.result : config.fallback;
    if (result) window.location.hash = result;
  };

  block.addEventListener('click', (e) => {
    const a = e.target.closest('a.questionnaire-answer');
    if (!a || !block.contains(a)) return;
    const target = decodeURIComponent(a.getAttribute('href').substring(1));
    if (!pageIds.has(target)) e.preventDefault();
    const { questionId, answerId } = a.dataset;
    if (!questionId) return;
    const i = answers.findIndex((x) => x.questionId === questionId);
    const entry = { questionId, answerId, answerText: a.textContent.trim() };
    if (i >= 0) answers[i] = entry;
    else answers.push(entry);
    checkRules(answerId);
  });

  window.addEventListener('hashchange', () => show(hashId()));
  if (window.location.hash) show(hashId());
}
