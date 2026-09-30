const button = document.querySelector('#conversion');
button?.addEventListener('click', async () => {
  button.disabled = true;
  try {
    const response = await fetch('/api/cta', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ id: button.dataset.id }) });
    if (!response.ok) throw new Error('Event could not be recorded');
    button.textContent = 'Local demo CTA event recorded';
  } catch (error) {
    button.textContent = error.message;
    button.disabled = false;
  }
});
