/* eslint-disable max-len */
/*
 * Curated BMW library for Document Authoring / Experience Workspace: block documents (one per
 * block family; each variant followed by library-metadata), page templates and the blocks /
 * templates sheets, in the formats da-live reads (adobe/da-live blocks/edit/da-library and
 * blocks/canvas/ew-panel-extensions). Pure: returns { files: { '/library/…': html | sheet } }.
 *
 * Content rules: semantic style names only (scripts/bmw-style-names.js); media are existing public
 * BMW Scene7 references authored as links (site config aem.assets.image.type = link, smart-crop
 * suffix kept); tech values are WDH bindings (/aida/data/wdh-de.json#<code>.<field>) whose text
 * is the sheet value, so WDH stays the only source of technical data.
 */
import { valuesFromSheet } from '../../scripts/aida-wdh.js';

export const ORIGIN = 'https://content.da.live/moved-permanently/bmw';
const WDH_SHEET = '/aida/data/wdh-de.json';

const IMG = {
  i5: ['https://bmw.scene7.com/is/image/BMW/P001_SL_G60-8135_Ext_Dsk_v001', 'BMW i5 exterior'],
  i5Film: ['https://bmw.scene7.com/is/content/BMW/P001_SL_G60-8135_Ext_Dsk_v001', 'BMW i5 film'],
  driving: ['https://bmw.scene7.com/is/image/BMW/g60_bev_electric-driving-performance_dsk_fb_en', 'BMW i5 electric driving'],
  charging: ['https://bmw.scene7.com/is/image/BMW/g60_bev_charging-options_1_home-charging:3to2', 'BMW i5 charging at home'],
  interior: ['https://bmw.scene7.com/is/image/BMW/alpina_cutdown_interior_1920_1024_fb', 'Illustrative BMW ALPINA interior'],
  ix3: ['https://bmw.scene7.com/is/image/BMW/na5_stage_1920_1024_fb', 'BMW iX3 exterior'],
};

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const p = (html) => `<p>${html}</p>`;
const link = ([href, text]) => `<a href="${href}">${esc(text)}</a>`;
const media = (...imgs) => imgs.map((i) => p(link(i))).join('');
const primary = (href, text) => p(`<strong><a href="${href}">${esc(text)}</a></strong>`);
const outline = (href, text) => p(`<em><a href="${href}">${esc(text)}</a></em>`);
const textLink = (href, text) => p(`<a href="${href}">${esc(text)}</a>`);
/** A block table: rows of cells (cell = inner HTML). */
const block = (cls, rows) => `<div class="${cls}">${rows.map((cells) => `<div>${cells.map((c) => `<div>${c}</div>`).join('')}</div>`).join('')}</div>`;
const keyValues = (cls, pairs) => block(cls, pairs.map(([k, v]) => [k, v]));
const sectionStyle = (style) => keyValues('section-metadata', [['Style', style]]);
const section = (...parts) => `<div>${parts.join('')}</div>`;
const page = (sections) => `<body><header></header><main>${sections.join('')}</main><footer></footer></body>\n`;
const meta = (description, tags) => `<div class="library-metadata"><div><div>description</div><div>${esc(description)}</div></div><div><div>searchtags</div><div>${esc(tags)}</div></div></div>`;
const variant = (heading, html, description, tags) => `<h2>${esc(heading)}</h2>${html}${meta(description, tags)}`;

function wdhBinder(sheet) {
  const values = valuesFromSheet(sheet);
  return (key) => {
    const v = values.get(key);
    if (!v) throw new Error(`WDH sheet has no value for ${key}`);
    return `<a href="${WDH_SHEET}#${key}">${esc(v.display)}</a>`;
  };
}

function content(wdh) {
  const kpis = block('car-kpis', [
    [wdh('61HG.electricRange'), 'Max. range (WLTP)'],
    [wdh('61HG.electricConsumption'), 'Combined electric power consumption (WLTP)'],
    [wdh('61HG.acceleration'), 'Acceleration, 0–100 km/h'],
  ]);
  const wltp = block('disclaimer', [[p(wdh('61HG.wltp'))]]);
  const assist = block('card-list', [
    ['<h2>Integrated features</h2><p>Assistance systems that make every journey more relaxed.</p>'],
    ['Driving Assistant Professional', p('Keeps you in lane and at a safe distance in stop-and-go traffic and on longer journeys.')],
    ['Parking Assistant Professional', p('Manoeuvres the vehicle into and out of parking spaces and remembers routes of up to 200 metres.')],
    ['BMW Digital Key Plus', p('Locks, unlocks and starts the vehicle with a compatible smartphone or smartwatch.')],
  ]);
  const newsTeaser = block('columns layout-wide-narrow middle inset-second-start', [[
    media(IMG.interior),
    `<h3>How the BMW Group extends sustainability to the vehicle interior.</h3>${p('Smell is just one part of what defines a vehicle interior. Materials are selected and tested long before series production.')}${textLink('/aida/showcase/en/news/interior', 'Read the story')}`,
  ]]);
  return {
    kpis, wltp, assist, newsTeaser,
  };
}

/** Block library: id, name (as listed), document sections. */
function blockDocs(wdh) {
  const c = content(wdh);
  return [
    {
      id: 'stage',
      name: 'Stage',
      sections: [
        section(variant(
          'Vehicle stage',
          block('hero-teaser no-autoplay middle text-width-five-twelfths gradient-left ratio-16-7 mobile-ratio-3-4', [
            [media(IMG.i5, IMG.i5Film)],
            [`<h1>The new BMW i5</h1>${p('The BMW i5. 100% electric.')}${primary('/aida/showcase/en/i5', 'Discover now')}${outline('/aida/showcase/en/e-mobility', 'Electric mobility')}`],
          ]),
          'Full-width launch stage for a model page: image or film, headline, claim and up to two buttons (bold link = primary, italic link = outline).',
          'hero, stage, launch, vehicle, model, video',
        )),
        section(variant(
          'Topic stage',
          block('hero-stage small', [
            [media(IMG.driving)],
            [`<h1>BMW electric cars.</h1>${p('Dynamic. Comfortable. 100% electric.')}`],
          ]),
          'Compact stage for topic and news pages: one image, headline and a short subline.',
          'hero, stage, topic, news, small',
        )),
      ],
    },
    {
      id: 'key-figures',
      name: 'Key figures',
      sections: [section(variant(
        'Key figures (WDH)',
        c.kpis,
        'Three to four headline tech values. Insert each value from the side panel "WDH values" so it stays bound to the market sheet; the label sits next to it.',
        'kpi, key figures, tech data, wdh, range, consumption',
      ))],
    },
    {
      id: 'video',
      name: 'Video',
      sections: [section(variant(
        'Model film',
        block('video controls ratio-16-9', [[media(IMG.i5, IMG.i5Film)]]),
        'Inline film with a poster image: poster image link first, then the Scene7 video link (link text = video title).',
        'video, film, media, scene7',
      ))],
    },
    {
      id: 'assist-features',
      name: 'Assist features',
      sections: [section(variant(
        'Assist features',
        c.assist,
        'Intro on the left, expandable feature cards on the right. One row per feature: title and description; check market availability in Preflight.',
        'assist, features, driving assistant, equipment, card list',
      ))],
    },
    {
      id: 'news-teaser',
      name: 'News teaser',
      sections: [section(variant(
        'News teaser',
        c.newsTeaser,
        'Teaser for one story: wide image left, headline, short summary and a link to the article.',
        'news, teaser, story, article, editorial',
      ))],
    },
    {
      id: 'disclaimer',
      name: 'Disclaimer',
      sections: [
        section(variant(
          'WLTP statement',
          c.wltp,
          'Legally required consumption and emissions statement, bound to the WDH sheet of the market (full WLTP statement value).',
          'disclaimer, wltp, legal, consumption, emissions',
        )),
        section(variant(
          'Disclaimer with info',
          block('disclaimer info', [[p('Illustrative briefing lease, not a live offer.')]]),
          'Small print with an info button that opens the shared WLTP explanation.',
          'disclaimer, info, legal, small print',
        )),
      ],
    },
    {
      id: 'cta',
      name: 'Call to action',
      sections: [section(variant(
        'Next steps',
        block('cta-collection', [[`${p('Your BMW i5')}${primary('/aida/showcase/en/i5', 'Configure')}${outline('https://www.bmw.de/de/fastlane/dealer-locator.html', 'Find a dealer')}${textLink('/aida/showcase/en/e-mobility', 'Electric mobility')}`]]),
        'Button that opens a panel with the next steps: first paragraph = label, then a primary button (bold link), an outline button (italic link) and text links.',
        'cta, call to action, buttons, configure, dealer',
      ))],
    },
  ];
}

const templateMeta = (title, description) => keyValues('template-metadata', [
  ['Title', esc(title)], ['Description', esc(description)], ['html-lang', 'en'],
]);

function templateDocs(wdh) {
  const c = content(wdh);
  return [
    {
      id: 'news-story',
      key: 'News story',
      description: 'Stage, lead, body, key figures, WLTP statement and a related story.',
      sections: [
        section(block('hero-stage small', [[media(IMG.i5)], [`<h1>The BMW i5. 100% electric.</h1>${p('A short subline that names the news.')}`]]), sectionStyle('space-below-tight-m')),
        section(`${p('<strong>Lead:</strong> summarise the news in one or two sentences – what, who, when.')}<h2>Body heading</h2>${p('Tell the story. Insert tech values from the side panel "WDH values" instead of typing them.')}`, c.kpis, c.wltp, primary('/aida/showcase/en/i5', 'Discover now'), sectionStyle('content-two-thirds-centered, space-above-related-l, space-below-regular')),
        section('<h2>More stories</h2>', c.newsTeaser, sectionStyle('space-regular')),
        section(templateMeta('News story title', 'One sentence that describes the story for search and social media.')),
      ],
    },
    {
      id: 'vehicle-launch',
      key: 'Vehicle launch',
      description: 'Launch stage, key figures from WDH, WLTP statement, film, assist features and next steps.',
      sections: [
        section(block('hero-teaser no-autoplay middle text-width-five-twelfths gradient-left ratio-16-7 mobile-ratio-3-4', [
          [media(IMG.i5, IMG.i5Film)],
          [`<h1>The new BMW i5</h1>${p('The BMW i5. 100% electric.')}${primary('/aida/showcase/en/i5', 'Configure')}${outline('https://www.bmw.de/de/fastlane/dealer-locator.html', 'Find a dealer')}`],
        ]), c.wltp, sectionStyle('space-below-tight-m')),
        section('<h2>Key figures</h2>', c.kpis, c.wltp, sectionStyle('space-regular')),
        section('<h2>The film</h2>', block('video controls ratio-16-9', [[media(IMG.i5, IMG.i5Film)]]), sectionStyle('space-regular')),
        section(c.assist, sectionStyle('space-regular')),
        section(block('cta-collection', [[`${p('Your BMW i5')}${primary('/aida/showcase/en/i5', 'Configure')}${outline('https://www.bmw.de/de/fastlane/dealer-locator.html', 'Find a dealer')}`]]), sectionStyle('space-regular')),
        section(templateMeta('Model name: launch page title', 'The model, its drive and its key benefit in one sentence.')),
      ],
    },
    {
      id: 'e-mobility-topic',
      key: 'E-mobility topic',
      description: 'Topic stage, two image/text teasers (range, charging) and a related story.',
      sections: [
        section(block('hero-stage small', [[media(IMG.driving)], [`<h1>BMW electric cars.</h1>${p('Dynamic. Comfortable. 100% electric.')}`]]), sectionStyle('space-below-tight-m')),
        section(block('columns layout-wide-narrow middle inset-second-start', [[
          media(IMG.driving),
          `<h2>The range of electric cars.</h2>${p('Describe the topic in two or three sentences and link to the model.')}${primary('/aida/showcase/en/i5', 'Learn more')}`,
        ]]), sectionStyle('space-regular')),
        section(block('columns layout-wide-narrow middle inset-second-start', [[
          media(IMG.charging),
          `<h2>Charging at home and on the go.</h2>${p('Explain the charging options in plain words.')}${primary('https://www.bmw.de/de/elektroauto/home-charging.html', 'More about charging at home')}${outline('https://www.bmw.de/de/elektroauto/public-charging.html', 'More about charging on the go')}`,
        ]]), c.wltp, sectionStyle('space-regular')),
        section('<h2>Related story</h2>', c.newsTeaser, sectionStyle('space-regular')),
        section(templateMeta('Topic page title', 'What the reader learns on this topic page, in one sentence.')),
      ],
    },
  ];
}

const sheet = (data) => ({
  total: data.length, limit: data.length, offset: 0, data, ':type': 'sheet',
});

/**
 * @param {{wdh: object}} opts the DE WDH market sheet (DA /aida/data/wdh-de.json)
 * @returns {{files: Object<string, string|object>}}
 */
export function buildLibrary({ wdh }) {
  const bind = wdhBinder(wdh);
  const blocks = blockDocs(bind);
  const templates = templateDocs(bind);
  const files = {};
  blocks.forEach((b) => { files[`/library/blocks/${b.id}.html`] = page(b.sections); });
  templates.forEach((t) => { files[`/library/templates/${t.id}.html`] = page(t.sections); });
  files['/library/blocks.json'] = sheet(blocks.map((b) => ({ name: b.name, path: `${ORIGIN}/library/blocks/${b.id}` })));
  files['/library/templates.json'] = sheet(templates.map((t) => ({ key: t.key, value: `${ORIGIN}/library/templates/${t.id}`, description: t.description })));
  return { files };
}

/** Library entries (ids, listed names / keys) independent of the WDH values. */
export const BLOCKS = blockDocs(() => '').map(({ id, name }) => ({ id, name }));
export const TEMPLATES = templateDocs(() => '').map(({ id, key, description }) => ({ id, key, description }));
