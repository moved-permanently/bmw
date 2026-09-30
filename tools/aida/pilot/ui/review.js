const token = window.location.hash.slice(1);
window.history.replaceState(null, '', '/review');
const status = document.querySelector('#status');
const form = document.querySelector('#decision');
async function request(data) {
  const response = await fetch('/api/review', { headers: { 'x-review-token': token, ...(data ? { 'content-type': 'application/json' } : {}) }, ...(data ? { method: 'POST', body: JSON.stringify(data) } : {}) });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error);
  return result;
}
request().then(({ article, expiresAt }) => {
  status.textContent = `Review revision ${article.revision} · expires ${expiresAt}`;
  const area = document.querySelector('#article');
  ['title', 'description', 'localIntro', 'body', 'legal', 'localCta'].forEach((key) => {
    if (!article[key]) return;
    const heading = document.createElement('h2');
    heading.textContent = key;
    const text = document.createElement('p');
    text.textContent = article[key];
    area.append(heading, text);
  });
  form.hidden = false;
}).catch((error) => {
  status.textContent = error.message;
  status.className = 'error';
});
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const buttons = [...form.querySelectorAll('button')];
  buttons.forEach((button) => { button.disabled = true; });
  try {
    const result = await request({
      ...Object.fromEntries(new FormData(form)), decision: event.submitter.value,
    });
    status.textContent = result.message;
    form.hidden = true;
    document.querySelector('#article').replaceChildren();
  } catch (error) {
    status.textContent = error.message;
    status.className = 'error';
    buttons.forEach((button) => { button.disabled = false; });
  }
});
