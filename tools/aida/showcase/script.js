import { DA_EDITOR } from '../editor.js';

const PREVIEW = 'https://main--bmw--moved-permanently.aem.page';
const LIVE = 'https://main--bmw--moved-permanently.aem.live';
const SITE = 'moved-permanently/bmw';
const canvas = (path) => `${DA_EDITOR}/canvas#/${SITE}${path}`;
const app = (name) => `${DA_EDITOR}/apps/${name}#/${SITE}`;
const page = (path) => `${PREVIEW}${path}`;
const files = (path) => `${DA_EDITOR}/#/${SITE}${path}`;
const INBOX = `${DA_EDITOR}/app/adobe-rnd/aem-apps/tools/apps/publish-requests-inbox/publish-requests-inbox?org=moved-permanently&site=bmw&env=ci&ref=ewdemo&nx=ewdemo`;

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
    title: 'Agenda: Briefings I and III',
    rfp: [],
    tell: [
      'We follow one story through Briefing I: HQ creates the BMW i5 launch once, and stakeholders review it before the embargo.',
      'AI translates it, markets adapt and publish it, and status and insights come back to HQ. The agenda links both briefings to the chapters below.',
      'The starting point: bmw.de, migrated and running on AEM, authored in Experience Workspace.',
    ],
    show: [
      { label: 'bmw.de home on AEM', href: page('/de/home') },
      { label: 'BMW i5 page on AEM', href: page('/de/neufahrzeuge/bmw-i/i5/bmw-i5-ueberblick') },
    ],
    agenda: [
      { rfp: 'I 1a', chapters: ['model'] },
      { rfp: 'I 1b', chapters: ['edit', 'assets', 'review', 'release'] },
      { rfp: 'I 2', chapters: ['review'] },
      { rfp: 'I 3', chapters: ['data', 'translate', 'rollout', 'status'] },
      { rfp: 'I 4', chapters: ['review', 'rollout', 'status', 'release'] },
      { rfp: 'I 5', chapters: ['insights'] },
      { rfp: 'III Architecture', chapters: ['release', 'architecture'] },
      { rfp: 'III Workflows', chapters: ['review', 'status', 'release'] },
      { rfp: 'III AI translation', chapters: ['quality', 'translate'] },
      { rfp: 'III Connectors', chapters: ['data', 'assets'] },
      { rfp: 'III Modeling', chapters: ['model', 'assets', 'delivery'] },
      { rfp: 'III Composition', chapters: ['edit', 'model'] },
      { rfp: 'III Localization', chapters: ['translate', 'rollout'] },
      { rfp: 'III Governance', chapters: ['quality', 'status', 'insights'] },
      { rfp: 'III Delivery', chapters: ['delivery'] },
    ],
    recap: 'Both briefings mapped to the demo chapters, from content modeling to delivery and insights.',
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
      { label: 'Market offer as a form (FR)', href: `${DA_EDITOR}/form#/${SITE}/aida/structured/offers/bmw-i5-launch-fr` },
    ],
    recap: 'One content model for car, topic and news: blocks for pages, schemas for data.',
  },
  {
    id: 'data',
    title: 'Vehicle data from WDH',
    rfp: ['III Connectors', 'I 3'],
    tell: [
      'Technical data is linked to WDH, not typed: range, consumption, power and price come from the WDH extract.',
      'Authors insert market-specific values and formatting with the WDH picker; Preflight flags values that no longer match the extract.',
      'The proxy worker removes WDH links from the delivered HTML without browser JavaScript. It keeps the saved values and their source references; it does not fetch fresh WDH data.',
    ],
    show: [
      { label: 'DE and FR offers from WDH', href: page('/aida/structured/teasers') },
      { label: 'WDH picker in the editor (FR/BE)', href: canvas('/aida/fr/be/i5') },
      { label: 'WDH extract (FR)', href: page('/aida/data/wdh-fr.json') },
      { label: 'WDH proxy worker: i5 HTML without data links', href: 'https://wdh-proxy.aem-poc-lab.workers.dev/aida/showcase/de/de/i5' },
    ],
    recap: 'WDH references connect market figures to their source; the worker removes clickable data links before delivery.',
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
    ],
    recap: 'Brand, compliance and SEO checks happen where the author works.',
  },
  {
    id: 'review',
    title: 'Review, reject, approve',
    rfp: ['I 1b', 'I 2', 'I 4', 'III Workflows'],
    tell: [
      'HQ puts the i5 launch pages into a launch review package and requests review; stakeholders open a review link to exactly these pages.',
      'The reviewer comments on the headline right in the page and rejects; the author fixes it, resolves the comment and requests review again.',
      'The approval covers these frozen pages, and approving with a date schedules the go-live for the embargo time.',
    ],
    show: [
      { label: 'HQ i5 launch news in the editor', href: canvas('/aida/showcase/en/news/i5-launch') },
      { label: 'Launch review packages', href: app('snapshots') },
    ],
    recap: 'Stakeholder feedback on the page itself, a correction, and an approval of exactly the pages that go live.',
  },
  {
    id: 'translate',
    title: 'Translate with AI',
    rfp: ['I 3', 'III AI translation', 'III Localization'],
    tell: [
      'The whole page is translated in one go, into several languages at once.',
      'A glossary keeps BMW terms such as eDrive, xDrive and Driving Assistant Professional untranslated.',
      'The translation service is pluggable: BMW’s own AI fits in, and translation memory stays in the translation service BMW already uses.',
    ],
    show: [
      { label: 'Translate and roll out', href: app('loc') },
    ],
    recap: 'AI translation at scale, with BMW’s glossary, style and human feedback.',
  },
  {
    id: 'rollout',
    title: 'Roll out and localize',
    rfp: ['I 3', 'I 4', 'III Localization'],
    tell: [
      'English source → German and French → Germany, Austria, France and Belgium; each market adapts its copy, for example Germany shows the Highway Assistant and France does not offer it.',
      'The Belgian market requests publication in the editor: it compares the page with what is live, then market review and legal review approve it, each notified by email; the last approval publishes.',
      'When HQ updates the source and rolls out again, local changes stay: the editor shows each conflict with the HQ text next to the local one, and the market decides.',
    ],
    show: [
      { label: 'Belgian i5 launch news in the editor', href: canvas('/aida/showcase/fr/be/news/i5-launch') },
      { label: 'Publish requests inbox', href: INBOX },
      { label: 'Germany: BMW i5', href: page('/aida/showcase/de/de/i5') },
      { label: 'France: BMW i5', href: page('/aida/showcase/fr/fr/i5') },
      { label: 'Belgium: BMW i5', href: page('/aida/showcase/fr/be/i5') },
    ],
    recap: 'Push centrally, adapt and approve locally, update again without losing local work.',
  },
  {
    id: 'status',
    title: 'Status across all markets',
    rfp: ['I 3', 'I 4', 'III Governance', 'III Workflows'],
    tell: [
      'One view of every page in every market: which copies exist, whether the source changed since, which review step a page waits on and how many comments are open.',
      'WDH values that drifted are flagged per market.',
      'Each cell links to the next action: edit, review, preview, check; Files shows what is in preview and what is live.',
    ],
    show: [
      { label: 'Rollout radar', href: `${DA_EDITOR}/app/${SITE}/tools/aida/radar/radar?ref=main&root=/aida/showcase` },
      { label: 'Belgian news in Files: review and publish status', href: files('/aida/showcase/fr/be/news') },
    ],
    recap: 'HQ sees the rollout status of all markets and what blocks each one.',
  },
  {
    id: 'release',
    title: 'Embargo and go-live',
    rfp: ['I 1b', 'I 4', 'III Workflows', 'III Architecture'],
    tell: [
      'Preview and live are separate: nothing is public until it is published; preview can be access-protected.',
      'Schedule the publish for the exact embargo time from the editor, or approve a launch review package with its go-live date so all its pages go live together.',
      'Code moves through DEV, TEST, STAGE and LIVE as branches; content has preview and live.',
    ],
    show: [
      { label: 'Schedule publish from the editor', href: canvas('/aida/de/de/i5') },
      { label: 'Scheduler', href: `${DA_EDITOR}/apps/scheduler` },
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
      'AEM operational telemetry measures real visits and Core Web Vitals of every page out of the box.',
      'The same data can be broken down per market, next to the rollout status HQ already sees.',
      'Analytics and task tools such as Workfront connect at the same points.',
    ],
    show: [
      { label: 'How AEM operational telemetry works', href: 'https://www.aem.live/docs/operational-telemetry' },
    ],
    recap: 'From publishing to learning: real usage per page and market goes back to HQ.',
  },
  {
    id: 'architecture',
    title: 'Architecture for BMW Group',
    rfp: ['III Architecture'],
    tell: [
      'Authors bring vehicle facts, media and offers into pages in Experience Workspace. AEM publishes the pages; site code is managed separately in GitHub.',
      'German serves Germany and Austria; French serves France and Belgium. Each market can adapt its pages. Other brands would have separate sites and content.',
      'The architecture view explains the working connections and what still needs connecting: WDH feeds, OTMM, Salesforce, translation AI and shared review services.',
    ],
    show: [
      { label: 'Architecture', href: '#architecture' },
    ],
    recap: 'Source systems provide facts and media. Authors build pages. AEM publishes them.',
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
