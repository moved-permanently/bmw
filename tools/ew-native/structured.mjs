/* eslint-disable max-len */
/*
 * Native DA Structured Content for the BMW showcase: two narrow editorial schemas, the Schema
 * Editor storage format, editor.path routing for the task-owned demo folders and sample records.
 * WDH stays the source of truth for technical data: an offer references a WDH model and the field
 * names to show; the market-offer block reads the values from the WDH market sheet at render time.
 * Not AEM Content Fragments; no references, workflow or ownership governance (DA SC limits).
 */

const SITE = '/moved-permanently/bmw';
export const FOLDERS = ['/aida/structured/news', '/aida/structured/offers'];

const MODELS = ['61HG', '71FJ', '81FK', '31HR'];
const OFFER_FIELDS = ['electricRange', 'electricConsumption', 'acceleration', 'power', 'fromPrice', 'dcCharge10to80', 'topSpeed'];
const scene7 = {
  type: 'string',
  title: 'Image (BMW Scene7 URL)',
  description: 'Public BMW Scene7 image link, e.g. from the BMW assets picker.',
  pattern: '^https://bmw\\.scene7\\.com/is/image/BMW/',
};
const text = (title, extra = {}) => ({ type: 'string', title, ...extra });
const longText = (title, extra = {}) => ({
  type: 'string', title, 'x-semantic-type': 'long-text', ...extra,
});
const date = (title) => ({ type: 'string', title, format: 'date' });

export const SCHEMAS = {
  news: {
    type: 'object',
    title: 'BMW news story',
    description: 'Editorial news record. Tech values belong in WDH, not in the story text.',
    required: ['headline', 'teaser', 'publishDate'],
    properties: {
      headline: text('Headline', { maxLength: 120 }),
      teaser: longText('Teaser', { maxLength: 300 }),
      body: longText('Body text'),
      publishDate: date('Publication date'),
      category: text('Category', { enum: ['product', 'technology', 'sustainability', 'company'] }),
      market: text('Market', { enum: ['de', 'fr'] }),
      modelCode: text('Related model (WDH code)', { enum: MODELS }),
      image: scene7,
      imageAlt: text('Image description'),
      ctaLabel: text('Link label'),
      ctaUrl: text('Link URL', { pattern: '^(https://|/)' }),
      source: text('Source note'),
    },
  },
  'market-offer': {
    type: 'object',
    title: 'BMW market offer',
    description: 'Editorial offer for one market. Tech values and prices are shown from WDH, never typed here.',
    required: ['headline', 'market', 'modelCode'],
    properties: {
      headline: text('Headline', { maxLength: 120 }),
      claim: longText('Claim', { maxLength: 200 }),
      market: text('Market', { enum: ['de', 'fr'] }),
      modelCode: text('Model (WDH code)', { enum: MODELS }),
      wdhFields: {
        type: 'array',
        title: 'WDH values to show',
        maxItems: 4,
        items: text('WDH field', { enum: OFFER_FIELDS }),
      },
      image: scene7,
      imageAlt: text('Image description'),
      validFrom: date('Valid from'),
      validUntil: date('Valid until'),
      ctaLabel: text('Button label'),
      ctaUrl: text('Button URL', { pattern: '^(https://|/)' }),
      legalNote: longText('Editorial legal note'),
      source: text('Source note'),
    },
  },
};

/** Schema Editor storage format (/.da/forms/schemas/<id>.html). */
export function schemaDocument(schema) {
  return `<body><header></header><main><div><pre><code>${JSON.stringify(schema, null, 2)}</code></pre></div></main><footer></footer></body>`;
}

/** editor.path rows: documents in the demo folders open in the native form editor. */
export function editorRoutes() {
  return FOLDERS.map((f) => ({ key: 'editor.path', value: `${SITE}${f}=https://da.live/form#` }));
}

const DEMO = 'Demo record: public BMW information and BMW RfP briefing copy, not a live offer.';
const record = (path, schemaName, title, data) => ({ path, json: { metadata: { title, schemaName }, data } });

export const RECORDS = [
  record('/aida/structured/news/bmw-i5-electric', 'news', 'The BMW i5. 100% electric.', {
    headline: 'The BMW i5. 100% electric.',
    teaser: 'The BMW i5 eDrive40 brings electric driving to the business sedan. Range, charging and consumption figures come from WDH on every page that shows them.',
    body: 'The BMW i5 combines the comfort of the BMW 5 Series Sedan with a fully electric drive. Charging at home, at public stations and on longer journeys is planned by the vehicle and the My BMW App.\nTechnical data for each market is maintained in WDH and inserted into pages as bound values.',
    publishDate: '2026-10-01',
    category: 'product',
    market: 'de',
    modelCode: '61HG',
    image: 'https://bmw.scene7.com/is/image/BMW/P001_SL_G60-8135_Ext_Dsk_v001',
    imageAlt: 'BMW i5 exterior',
    ctaLabel: 'Discover the BMW i5',
    ctaUrl: '/aida/showcase/en/i5',
    source: DEMO,
  }),
  record('/aida/structured/news/charging-at-home', 'news', 'Charging at home and on the go.', {
    headline: 'Charging at home and on the go.',
    teaser: 'From the wallbox at home to fast charging on the motorway: the charging options for BMW electric cars in brief.',
    body: 'Charge as fast as possible while travelling, near a café, or conveniently at a wallbox at home.\nBMW Charging brings the options together so you can choose the one that fits your day.',
    publishDate: '2026-09-24',
    category: 'technology',
    market: 'de',
    image: 'https://bmw.scene7.com/is/image/BMW/g60_bev_charging-options_1_home-charging:3to2',
    imageAlt: 'BMW i5 charging at home',
    ctaLabel: 'More about charging at home',
    ctaUrl: 'https://www.bmw.de/de/elektroauto/home-charging.html',
    source: DEMO,
  }),
  record('/aida/structured/offers/bmw-i5-launch-de', 'market-offer', 'BMW i5 launch offer (DE)', {
    headline: 'Der neue BMW i5. Jetzt bei Ihrem BMW Partner.',
    claim: '100% elektrisch. Vereinbaren Sie jetzt eine Probefahrt.',
    market: 'de',
    modelCode: '61HG',
    wdhFields: ['electricRange', 'electricConsumption', 'fromPrice'],
    image: 'https://bmw.scene7.com/is/image/BMW/P001_SL_G60-8135_Ext_Dsk_v001',
    imageAlt: 'BMW i5 Exterieur',
    validFrom: '2026-10-01',
    validUntil: '2026-12-31',
    ctaLabel: 'Probefahrt vereinbaren',
    ctaUrl: 'https://www.bmw.de/faas/form/de-de/bmw/tda/test-drive-request.html',
    source: DEMO,
  }),
  record('/aida/structured/offers/bmw-i5-launch-fr', 'market-offer', 'BMW i5 launch offer (FR)', {
    headline: 'La nouvelle BMW i5. Chez votre partenaire BMW.',
    claim: '100 % électrique. Réservez votre essai.',
    market: 'fr',
    modelCode: '61HG',
    wdhFields: ['electricRange', 'electricConsumption', 'fromPrice'],
    image: 'https://bmw.scene7.com/is/image/BMW/P001_SL_G60-8135_Ext_Dsk_v001',
    imageAlt: 'BMW i5 extérieur',
    validFrom: '2026-10-01',
    validUntil: '2026-12-31',
    ctaLabel: 'Découvrir BMW France',
    ctaUrl: 'https://www.bmw.fr/',
    source: DEMO,
  }),
];

/** Normal BMW page consuming the market-offer records through the JSON delivery endpoint. */
export function teaserPage() {
  const offers = RECORDS.filter((r) => r.json.metadata.schemaName === 'market-offer');
  const rows = offers.map((r) => `<div><div><a href="${r.path}">${r.json.metadata.title}</a></div></div>`).join('');
  return '<body><header></header><main>'
    + '<div><h1>BMW i5 launch offers by market</h1><p>Each card is a structured content record (form → JSON) with tech values from the market\'s WDH sheet.</p>'
    + '<div class="section-metadata"><div><div>Style</div><div>space-below-tight-m</div></div></div></div>'
    + `<div><div class="offer-teaser">${rows}</div><div class="section-metadata"><div><div>Style</div><div>space-regular</div></div></div></div>`
    + '<div><div class="metadata"><div><div>Title</div><div>BMW i5 launch offers by market</div></div><div><div>html-lang</div><div>en</div></div></div></div>'
    + '</main><footer></footer></body>\n';
}
