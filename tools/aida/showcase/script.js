const PREVIEW = 'https://main--bmw--moved-permanently.aem.page';
const LIVE = 'https://main--bmw--moved-permanently.aem.live';
const SITE = 'moved-permanently/bmw';
const canvas = (path) => `https://da.live/canvas#/${SITE}${path}`;
const source = (path) => `https://da.live/edit#/${SITE}${path}`;
const app = (name) => `https://da.live/apps/${name}#/${SITE}`;
const page = (path) => `${PREVIEW}${path}`;

export const RFP = {
  'I 1a': 'Briefing I · 1a Content modeling',
  'I 1b': 'Briefing I · 1b Create / adapt content',
  'I 2': 'Briefing I · 2 Stakeholder review',
  'I 3': 'Briefing I · 3 Push & translate',
  'I 4': 'Briefing I · 4 Market review / adapt / publish',
  'I 5': 'Briefing I · 5 KPI / data insights',
  'III Architecture': 'Briefing III · Content architecture',
  'III Workflows': 'Briefing III · Workflows & quality gates',
  'III AI translation': 'Briefing III · AI / automation',
  'III Connectors': 'Briefing III · Content connectors (WDH, DAM)',
  'III Modeling': 'Briefing III · Content modeling (car, topic, news, assets)',
  'III Composition': 'Briefing III · Composition (home, car, topic pages)',
  'III Localization': 'Briefing III · Translate, rollout, localize, re-rollout',
  'III Governance': 'Briefing III · Governance checks & rollout status',
  'III Delivery': 'Briefing III · Delivery / front end',
};

export const chapters = [
  {
    id: 'journey',
    title: 'One launch, every market',
    rfp: ['I 1a', 'I 1b', 'I 2', 'I 3', 'I 4', 'I 5'],
    tell: [
      'HQ creates the BMW i5 launch story once; stakeholders review it before the embargo.',
      'AI translates it, it is pushed into the markets, and each market reviews, adapts and publishes.',
      'Status and insights flow back to HQ. Everything shown runs on AEM, authored in Experience Workspace.',
    ],
    show: [
      { label: 'bmw.de home on AEM', href: page('/de/home') },
      { label: 'BMW i5 page on AEM', href: page('/de/neufahrzeuge/bmw-i/i5/bmw-i5-ueberblick') },
    ],
    recap: 'Create → review → translate → roll out → adapt → publish → learn: one connected journey.',
  },
  {
    id: 'edit',
    title: 'Edit what you see',
    rfp: ['I 1b', 'III Composition'],
    tell: [
      'Authors work on the page itself: click into the BMW i5 page and change text, images and order.',
      'The same page as a structured document: blocks and section styles with BMW names.',
      'Several authors work at once, comment in context and restore any earlier version.',
    ],
    show: [
      { label: 'Visual editing: BMW i5 (Germany)', href: canvas('/aida/de/de/i5') },
      { label: 'Document view: BMW i5', href: source('/aida/de/de/i5') },
      { label: 'Preview: BMW i5', href: page('/aida/de/de/i5') },
    ],
    recap: 'WYSIWYG for marketers, clean structure underneath, collaboration and versions built in.',
  },
  {
    id: 'model',
    title: 'Model car, topic and news',
    rfp: ['I 1a', 'III Modeling', 'III Composition'],
    tell: [
      'Pages are composed from reusable BMW blocks: hero, car KPIs, feature list, teaser list, video.',
      'Templates start a news story, a vehicle launch or an e-mobility topic in one click.',
      'Where data needs a strict shape, structured content uses a schema and a form, delivered as JSON.',
    ],
    show: [
      { label: 'Home composition', href: page('/aida/showcase/en/home') },
      { label: 'Car page: BMW i5', href: page('/aida/showcase/en/i5') },
      { label: 'Topic page: e-mobility', href: page('/aida/showcase/en/e-mobility') },
      { label: 'News article', href: page('/aida/showcase/en/news/i5-launch') },
      { label: 'Schemas: news and market offer', href: app('schema') },
      { label: 'Market offer as a form (FR)', href: `https://da.live/form#/${SITE}/aida/structured/offers/bmw-i5-launch-fr` },
    ],
    recap: 'One content model for car, topic and news: blocks for pages, schemas for data.',
  },
  {
    id: 'data',
    title: 'Vehicle data from WDH',
    rfp: ['III Connectors', 'I 3'],
    tell: [
      'Technical data is linked to WDH, not typed: range, consumption, power and price come from the WDH extract.',
      'Each market gets its own values and formatting, for example consumption and price in Germany and in France.',
      'Authors insert values from the WDH picker; a check flags any value that no longer matches WDH.',
    ],
    show: [
      { label: 'DE and FR offers from WDH', href: page('/aida/structured/teasers') },
      { label: 'WDH picker in the editor (FR/BE)', href: canvas('/aida/fr/be/i5') },
      { label: 'WDH extract (FR)', href: page('/aida/data/wdh-fr.json') },
    ],
    recap: 'WDH stays the source of truth; pages always show the market’s current values.',
  },
  {
    id: 'assets',
    title: 'Assets: find, crop, reuse',
    rfp: ['I 1b', 'III Modeling', 'III Connectors'],
    tell: [
      'Find BMW images and films across the site in the media library.',
      'Insert by reference from BMW’s image delivery: crop, frame and sharpen without copying files.',
      'Extend a format for a new placement; the asset connector is ready for BMW’s DAM.',
    ],
    show: [
      { label: 'Media Library', href: app('media-library') },
      { label: 'BMW asset picker', href: '#assets' },
      { label: 'Editor with asset picker (FR/BE)', href: canvas('/aida/fr/be/i5') },
    ],
    recap: 'Reference, crop, extend: assets stay governed at the source.',
  },
  {
    id: 'quality',
    title: 'Quality gates before review',
    rfp: ['III Governance', 'III AI translation'],
    tell: [
      'Preflight checks the page in the editor: WLTP statement, current WDH values, market feature availability, brand terms, SEO.',
      'The AI assistant reviews the page with BMW skills and lists what needs attention.',
      'Authors fix issues before anyone is asked to review.',
    ],
    show: [
      { label: 'Belgian i5 page: run Preflight', href: canvas('/aida/fr/be/i5') },
      { label: 'Quality gates in the workflow', href: '#workflow' },
    ],
    recap: 'Brand, compliance and SEO checks happen where the author works.',
  },
  {
    id: 'review',
    title: 'Review, reject, approve',
    rfp: ['I 1b', 'I 2', 'I 4', 'III Workflows'],
    tell: [
      'The author requests review; the reviewer rejects with feedback on a specific field.',
      'The author corrects, resubmits, and the exact revision is approved by a team or a named stakeholder.',
      'A launch review package freezes a set of pages and gives stakeholders a review link.',
    ],
    show: [
      { label: 'Workflow: request, reject, approve', href: '#workflow' },
      { label: 'Launch review packages', href: app('snapshots') },
    ],
    recap: 'A feedback loop with a rejection, a correction and an approval bound to one revision.',
  },
  {
    id: 'translate',
    title: 'Translate with AI',
    rfp: ['I 3', 'III AI translation', 'III Localization'],
    tell: [
      'The whole page is translated in one go, into several languages at once.',
      'A glossary keeps BMW terms such as eDrive, xDrive and Driving Assistant Professional untranslated.',
      'The translation provider is pluggable: BMW’s own AI fits in; human corrections feed translation memory.',
    ],
    show: [
      { label: 'Translate and roll out', href: app('loc') },
      { label: 'Batch translation with corrections', href: '#translate' },
    ],
    recap: 'AI translation at scale, with BMW’s glossary, style and human feedback.',
  },
  {
    id: 'rollout',
    title: 'Roll out and localize',
    rfp: ['I 3', 'I 4', 'III Localization'],
    tell: [
      'English source → German and French → Germany, Austria, France and Belgium.',
      'Markets adapt locally: Germany shows the Highway Assistant, France does not offer it; Belgium drops a section. The workflow demo covers data format, disclaimer, hero image, headline, CTA, added and removed sections and a new order.',
      'A new HQ update rolls out again: local changes stay, conflicts are resolved property by property.',
    ],
    show: [
      { label: 'Germany: BMW i5', href: page('/aida/showcase/de/de/i5') },
      { label: 'France: BMW i5', href: page('/aida/showcase/fr/fr/i5') },
      { label: 'Belgium: BMW i5', href: page('/aida/showcase/fr/be/i5') },
      { label: 'Localize and re-roll out', href: '#rollout' },
    ],
    recap: 'Push centrally, adapt locally, update again without losing local work.',
  },
  {
    id: 'status',
    title: 'Status across all markets',
    rfp: ['I 3', 'I 4', 'III Governance', 'III Workflows'],
    tell: [
      'One view of every page in every market: source freshness, translation, review and release.',
      'WDH values that drifted are flagged per market.',
      'Each row links to the next action: edit, preview, check.',
    ],
    show: [
      { label: 'Rollout radar', href: `https://da.live/app/${SITE}/tools/aida/radar/radar?ref=main` },
      { label: 'Action radar', href: '#radar' },
    ],
    recap: 'HQ sees the rollout status of all markets and what blocks each one.',
  },
  {
    id: 'release',
    title: 'Embargo and go-live',
    rfp: ['I 1b', 'I 4', 'III Workflows', 'III Architecture'],
    tell: [
      'Preview and live are separate: nothing is public until it is published; preview can be access-protected.',
      'Schedule the publish for the exact embargo time, or launch a whole package of pages together.',
      'Code moves through DEV, TEST, STAGE and LIVE as branches; content has preview and live.',
    ],
    show: [
      { label: 'Schedule publish from the editor', href: canvas('/aida/de/de/i5') },
      { label: 'Scheduler', href: 'https://da.live/apps/scheduler' },
      { label: 'Launch review packages', href: app('snapshots') },
      { label: 'Preview', href: page('/aida/showcase/en/i5') },
      { label: 'Live', href: `${LIVE}/aida/showcase/en/i5` },
    ],
    recap: 'Embargo-safe: scheduled, packaged releases on separate preview and live tiers.',
  },
  {
    id: 'delivery',
    title: 'Deliver and reuse',
    rfp: ['III Delivery', 'III Modeling'],
    tell: [
      'Pages arrive as complete HTML: fast, readable for search engines and AI agents.',
      'The same content is available as Markdown, as an HTML fragment and, for structured content, as JSON.',
      'A single data refresh can update changing values without turning the site into an application.',
    ],
    show: [
      { label: 'Car page', href: page('/aida/showcase/en/i5') },
      { label: 'As Markdown', href: page('/aida/showcase/en/i5.md') },
      { label: 'As HTML fragment', href: page('/aida/showcase/en/i5.plain.html') },
      { label: 'Market offer as JSON', href: `https://da-sc.adobeaem.workers.dev/preview/${SITE}/aida/structured/offers/bmw-i5-launch-fr` },
      { label: 'Data refresh', href: '#delivery' },
    ],
    recap: 'Compose once, deliver as HTML, Markdown, fragments or JSON.',
  },
  {
    id: 'insights',
    title: 'Insights back to HQ',
    rfp: ['I 5', 'III Governance'],
    tell: [
      'AEM measures real visits and Core Web Vitals of every page out of the box.',
      'Creators see the KPIs of their pages; HQ sees them per market next to the rollout status.',
      'Analytics and task tools such as Workfront connect at the same points. The numbers shown are sample values.',
    ],
    show: [
      { label: 'KPIs next to the rollout status', href: '#radar' },
    ],
    recap: 'From publishing to learning: KPIs per page and market, pushed to HQ.',
  },
  {
    id: 'architecture',
    title: 'Architecture for BMW Group',
    rfp: ['III Architecture'],
    tell: [
      'Brands and organizations are their own sites that share code and capabilities, not one content pool.',
      'Language source → languages → regions → markets → importers → dealers, each with clear ownership.',
      'Environments are a separate axis: DEV, TEST, STAGE and LIVE for code and integrations.',
    ],
    show: [
      { label: 'Architecture', href: '#architecture' },
    ],
    recap: 'Independent contexts, shared capabilities, one operating model.',
  },
  {
    id: 'recap',
    title: 'Recap',
    rfp: ['I 1a', 'I 1b', 'I 2', 'I 3', 'I 4', 'I 5', 'III Architecture'],
    tell: [
      'Collaboration, versions and rollback, localization, governance, AI and rollout: all shown on BMW content.',
      'Native AEM capabilities are product; BMW-specific apps such as the radar, Preflight and the pickers are extensions that Adobe or any partner can build.',
      'Next: connect BMW identity, WDH, DAM, translation AI, analytics and Workfront.',
    ],
    show: [
      { label: 'Back to the start', href: '#path/0' },
    ],
    recap: 'One connected content operating system for BMW, on AEM.',
  },
];
