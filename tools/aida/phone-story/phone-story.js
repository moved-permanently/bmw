import { DA_EDITOR } from '../editor.js';
import {
  createChannel, SOURCE_URL, SOURCE_PATH, publicReadURL,
} from './consumer.js';

const byId = (id) => document.getElementById(id);
const STEPS = [
  {
    id: 'source',
    title: 'Start with the authored news story.',
    copy: 'This is a normal AEM page, edited in Experience Workspace. The website presents it with BMW page blocks.',
    instructions: ['Open the website and show the headline, image and vehicle facts.', 'Return here. The phone is empty until you request the content.'],
    note: 'Say: “The author creates a story, not a separate copy for each channel.”',
  },
  {
    id: 'app',
    title: 'Read the same content in a different design.',
    copy: 'CURVE is an independent phone-style reader. It takes the headline and introduction from Markdown, and the image and linked vehicle values from the HTML fragment.',
    instructions: ['Click Refresh content below the phone.', 'Compare its headline, photograph and figures with the website. The layout is different; the authored content is the same.'],
    note: 'Say: “This channel owns its design. AEM provides the content in open formats.” CURVE is not the My BMW App.',
  },
  {
    id: 'edit',
    title: 'Change the source, not the app.',
    copy: 'Use the editor to make a small, visible headline change. You do not need to edit app code or enter a second headline.',
    instructions: ['Open Edit the source. In Content view, add “A new perspective.” to the headline.', 'Save and use Preview, then check the website preview. Do not Publish.', 'Return here before refreshing. The phone still shows the version you fetched earlier.'],
    note: 'Public demo source only. Preview changes the shared preview content. Keep the original headline so you can restore it after presenting.',
  },
  {
    id: 'refresh',
    title: 'Fetch again. See the authored change.',
    copy: 'The app keeps its previous reading until you ask for an update. Refresh fetches the public preview formats again and compares them with the last successful reading.',
    instructions: ['Click Refresh content. The phone should now show your changed headline.', 'Point to Content updated and the before/after text below it.', 'If the old headline is returned, check Preview, allow the edge cache to update, then refresh again.'],
    note: 'Say: “One source change, two reading experiences.” Restore the original headline in the editor, save and Preview; refresh here once more.',
  },
  {
    id: 'architecture',
    title: 'Open formats, with no second content store.',
    copy: 'Experience Workspace saves the page. AEM Preview delivers Markdown and an HTML fragment. This app reads those formats and renders its own design.',
    instructions: ['Open Inspect the delivered content to show the two source formats.', 'The vehicle figures are authored values with WDH source links; the app does not query live WDH.', 'DA hosts this app as an extension. Its public-content proxy handles cross-origin reads; no author credentials are sent to the source.'],
    note: 'This is a custom preview consumer, not a production mobile integration. There is no automatic synchronization, offline cache or protected launch-content setup. A production app would use approved live content and its own access rules.',
  },
];

byId('editor-link').href = `${DA_EDITOR}/canvas#/moved-permanently/bmw${SOURCE_PATH}`;
['website-link', 'read-story'].forEach((id) => { byId(id).href = SOURCE_URL; });
byId('markdown-link').href = `${SOURCE_URL}.md`;
byId('fragment-link').href = `${SOURCE_URL}.plain.html`;

let stepIndex = 0;
function showStep() {
  const index = STEPS.findIndex(({ id }) => `#${id}` === window.location.hash);
  stepIndex = index < 0 ? 0 : index;
  const step = STEPS[stepIndex];
  byId('step-number').textContent = `Step ${stepIndex + 1} of ${STEPS.length}`;
  byId('step-title').textContent = step.title;
  byId('step-copy').textContent = step.copy;
  byId('step-note').textContent = step.note;
  byId('step-instructions').replaceChildren(...step.instructions.map((text) => {
    const li = document.createElement('li');
    li.textContent = text;
    return li;
  }));
  document.querySelectorAll('[data-step]').forEach((a) => {
    if (a.dataset.step === step.id) a.setAttribute('aria-current', 'step');
    else a.removeAttribute('aria-current');
  });
  byId('previous').disabled = stepIndex === 0;
  byId('next').disabled = stepIndex === STEPS.length - 1;
  byId('next').textContent = stepIndex === STEPS.length - 1 ? 'End of walkthrough'
    : `Next: ${['', 'the app', 'make a change', 'see it here', 'how it works'][stepIndex + 1]}`;
}
byId('previous').addEventListener('click', () => { window.location.hash = STEPS[Math.max(0, stepIndex - 1)].id; });
byId('next').addEventListener('click', () => { window.location.hash = STEPS[Math.min(STEPS.length - 1, stepIndex + 1)].id; });
window.addEventListener('hashchange', showStep);
showStep();

const formatTime = (value) => new Intl.DateTimeFormat('en-GB', {
  hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short',
}).format(new Date(value));
let shownItem = null;

function renderChanges(state) {
  byId('change-summary').hidden = !state.contentChanged || state.status !== 'fetched';
  const changes = [];
  if (state.previousItem && state.item) {
    ['title', 'teaser'].forEach((key) => {
      if (state.previousItem[key] !== state.item[key]) {
        changes.push(`${key === 'title' ? 'Headline' : 'Introduction'}: “${state.previousItem[key]}” → “${state.item[key]}”`);
      }
    });
    if (JSON.stringify(state.previousItem.image) !== JSON.stringify(state.item.image)) changes.push('The authored image changed.');
    if (JSON.stringify(state.previousItem.values) !== JSON.stringify(state.item.values)) changes.push('The authored vehicle values or legal statement changed.');
  }
  byId('changes').replaceChildren(...changes.map((text) => {
    const li = document.createElement('li');
    li.textContent = text;
    return li;
  }));
}

function render(state) {
  const busy = state.status === 'fetching';
  byId('refresh').disabled = busy;
  byId('reset').disabled = busy;
  byId('refresh').querySelector('span').textContent = busy ? 'Fetching content…' : 'Refresh content';
  byId('status').dataset.state = state.status;
  byId('status').textContent = {
    unfetched: 'Not fetched · Refresh to load',
    fetching: state.item ? 'Fetching · Previous content still shown' : 'Fetching authored content…',
    fetched: state.contentChanged ? 'Fetched from preview · Content changed' : 'Fetched from preview',
    stale: 'Refresh failed · Previous content shown',
    error: 'No content fetched · Preview unavailable',
  }[state.status];
  byId('last-fetched').textContent = state.fetchedAt ? `Last successful fetch · ${formatTime(state.fetchedAt)}` : '';
  byId('fetch-error').hidden = !state.error;
  byId('fetch-error').textContent = state.error ? `${state.error} Check that the source is previewed, then try Refresh content again.` : '';
  byId('changed').hidden = !state.contentChanged || state.status !== 'fetched';
  renderChanges(state);
  if (!state.item) {
    shownItem = null;
    byId('empty').hidden = false;
    byId('story').hidden = true;
    byId('story-image').removeAttribute('src');
    return;
  }
  if (state.item === shownItem) return;
  const { item } = state;
  shownItem = item;
  byId('empty').hidden = true;
  byId('story').hidden = false;
  byId('story-title').textContent = item.title;
  byId('story-teaser').textContent = item.teaser;
  byId('story-teaser').hidden = !item.teaser;
  const image = byId('story-image');
  image.hidden = !item.image;
  byId('image-note').hidden = !!item.image;
  if (item.image) {
    image.alt = item.image.alt || 'Authored story image';
    image.src = item.image.url;
  } else image.removeAttribute('src');
  byId('facts').replaceChildren(...item.facts.map((fact) => {
    const row = document.createElement('div');
    const label = document.createElement('dt');
    const value = document.createElement('dd');
    const link = document.createElement('a');
    label.textContent = fact.label;
    link.textContent = fact.text;
    link.href = fact.href;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    value.append(link);
    row.append(label, value);
    return row;
  }));
  byId('facts').closest('.fact-panel').hidden = !item.facts.length;
  byId('legal').textContent = item.legal;
  byId('legal').hidden = !item.legal;
}
byId('story-image').addEventListener('error', () => {
  byId('story-image').hidden = true;
  byId('image-note').hidden = false;
});
const channel = createChannel({
  fetcher: (url, options) => fetch(publicReadURL(url, window.location.origin), options),
  onChange: render,
});
byId('refresh').addEventListener('click', () => channel.refresh());
byId('reset').addEventListener('click', () => {
  channel.reset();
  window.location.hash = 'source';
});
render(channel.state);
