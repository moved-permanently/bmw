import { valuesFromSheet, syncBindings, textOf } from '../../../scripts/aida-wdh.js';
import { getMetadata, setMetadata } from '../../../scripts/aida-doc.js';

// eslint-disable-next-line import/prefer-default-export
export function sampleFactUpdate(source) {
  const original = valuesFromSheet(source).get('61HG.electricRange');
  if (!original) throw new Error('Load the actual WDH source before applying a sample update.');
  const row = { ...original, value: '520–630', unit: 'km' };
  const about = {
    '@type': 'Vehicle',
    name: 'BMW i5 eDrive40',
    additionalProperty: [{ '@type': 'PropertyValue', name: 'electricRange', value: original.display }],
  };
  const ld = {
    '@context': 'https://schema.org', '@type': 'NewsArticle', headline: 'BMW i5 connector example', about,
  };
  const anchor = `<a href="/aida/showcase/data/wdh-de.json#61HG.electricRange">${textOf(original.display)}</a>`;
  const document = setMetadata(`<main><div><h1>BMW i5 connector example</h1><p>Range: ${anchor}</p><p>Repeated range in charging story: ${anchor}</p></div><div></div></main>`, 'json-ld', JSON.stringify(ld));
  const synced = syncBindings(document, 'de', valuesFromSheet({ values: [row] }));
  const updatedLd = JSON.parse(getMetadata(synced.html, 'json-ld'));
  updatedLd.about.additionalProperty[0].value = `${row.value} ${row.unit}`;
  const html = setMetadata(synced.html, 'json-ld', JSON.stringify(updatedLd));
  return {
    demo: true,
    boundary: 'Sample WDH update applied to stored HTML, Markdown and NewsArticle metadata. Not published; the BMW page and WDH source are unchanged.',
    sourceValue: original.display,
    updatedValue: `${row.value} ${row.unit}`,
    html,
    markdown: `# BMW i5 connector example\n\nRange: ${row.value} ${row.unit}\n\nRepeated range in charging story: ${row.value} ${row.unit}`,
    jsonld: updatedLd,
    changes: synced.changes,
  };
}
