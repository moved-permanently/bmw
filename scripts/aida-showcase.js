export default function installFactRefresh(block) {
  const link = block.querySelector('a[href$=".json"]');
  const status = block.querySelector('[role="status"]');
  const path = link?.getAttribute('href');
  if (!status || !/^\/aida\/showcase\/data\/wdh-(de|fr)\.json$/.test(path || '')) return;
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = link.textContent;
  link.replaceWith(button);
  let requested = false;
  button.addEventListener('click', async () => {
    if (requested) return;
    requested = true;
    button.disabled = true;
    status.textContent = '1 fact request · checking the published demo sheet…';
    try {
      const response = await fetch(path, { signal: AbortSignal.timeout(5000), cache: 'no-store' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const text = await response.text();
      if (text.length > 100000) throw new Error('Demo sheet exceeds size limit');
      const sheet = JSON.parse(text);
      const rows = Array.isArray(sheet.values) ? sheet.values : sheet.values?.data;
      if (!Array.isArray(rows) || rows.length > 200) throw new Error('Invalid demo sheet');
      const values = new Map(rows.filter((row) => typeof row.key === 'string' && ['string', 'number'].includes(typeof row.value)).map((row) => [row.key, `${row.value}${row.unit ? ` ${row.unit}` : ''}`]));
      let changed = 0;
      let missing = 0;
      document.querySelectorAll('a[href*="/data/wdh-"], [data-wdh]').forEach((element) => {
        const href = element.dataset.wdh || element.getAttribute('href');
        if (!href?.startsWith(`${path}#`)) return;
        const value = values.get(href.slice(path.length + 1));
        if (value === undefined) { missing += 1; return; }
        if (element.textContent !== value) { element.textContent = value; changed += 1; }
      });
      status.textContent = `1 fact request · ${changed} displayed values updated · ${missing} missing source keys`;
    } catch (error) {
      status.textContent = `1 fact request · refresh unavailable (${error.message}); initial authored values retained`;
    }
  });
}
