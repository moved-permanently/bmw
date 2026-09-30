/* eslint-disable no-console */
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '../../..');
const read = (file) => JSON.parse(readFileSync(join(HERE, 'data', file), 'utf8'));
const editorial = read('editorial.json');
const copy = read('copy.json');
const CONTEXTS = [
  { id: 'en', lang: 'en', market: 'de' },
  { id: 'de/de', lang: 'de', market: 'de' },
  {
    id: 'de/at', lang: 'de', market: 'de', sourceContext: 'de/de', sparse: true,
  },
  { id: 'fr/fr', lang: 'fr', market: 'fr' },
  {
    id: 'fr/be', lang: 'fr', market: 'fr', fallback: true,
  },
];
const esc = (value) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');
const sheet = (data) => ({
  total: data.length, offset: 0, limit: data.length, data, ':type': 'sheet',
});
const rows = (value) => (Array.isArray(value) ? value : value?.data || []);
const wrap = (name, variant, content) => {
  const flat = content.replace(/<\/?(?:div|article)\b[^>]*>/g, '').replace(/ class="aida-showcase-[^"]*"/g, '');
  return `<div><div class="aida-showcase ${variant}"><div><div><p><em>component:${name}</em></p>${flat}</div></div></div></div>`;
};
const heading = (text, level = 2) => `<h${level}>${esc(text)}</h${level}>`;
const paragraph = (text) => `<p>${esc(text)}</p>`;
const cta = (href, label, primary = true) => `<p><${primary ? 'strong' : 'em'}><a href="${esc(href)}">${esc(label)}</a></${primary ? 'strong' : 'em'}></p>`;

/** Pure, deterministic local composition. No fetch, translation service or publication.
 * @returns {{pages: Object<string,string>, data: Object<string,object>}}
 */
export function buildContent({ catalogue, wdh } = {}) {
  if (!Array.isArray(catalogue) || !catalogue.length) throw new Error('A public BMW asset catalogue is required');
  const assets = Object.fromEntries(Object.entries(editorial.assets).map(([name, ref]) => {
    const asset = catalogue.find((entry) => entry.id === ref.id);
    if (!asset || !/^https:\/\/(bmw\.scene7\.com\/is\/image\/|prod\.cosy\.bmw\.cloud\/)/.test(asset.url)) {
      throw new Error(`Missing observed catalogue asset: ${name} (${ref.id})`);
    }
    return [name, { ...asset, alt: ref.alt }];
  }));
  const sheets = Object.fromEntries(['de', 'fr'].map((market) => {
    const initial = read(`wdh-${market}.json`);
    const incoming = wdh?.[market];
    const values = new Map(rows(initial.values).map((row) => [row.key, row]));
    rows(incoming?.values).forEach((row) => values.set(row.key, {
      ...values.get(row.key),
      ...row,
      source: row.source || `/aida/data/wdh-${market}.json`,
      sourceKey: row.sourceKey || `values.${row.key}`,
      sourceKind: row.sourceKind || 'external-wdh',
    }));
    const i5 = rows(initial.models).find((model) => model.code === '61HG');
    const formatted = (field) => {
      const row = values.get(`61HG.${field}`);
      return `${row.value}${row.unit ? ` ${row.unit}` : ''}`;
    };
    const t = copy[market];
    const statement = `${i5.name}: ${t.consumptionLabel}: ${formatted('electricConsumption')} (WLTP); ${t.co2}: ${formatted('co2')} (WLTP); ${t.co2Class}: ${formatted('co2Class')}; ${t.rangeLabel}: ${formatted('electricRange')} (WLTP)`;
    if (!rows(incoming?.values).some((row) => row.key === '61HG.wltp')) {
      values.set('61HG.wltp', {
        key: '61HG.wltp',
        code: '61HG',
        field: 'wltp',
        value: statement,
        unit: '',
        source: i5.source,
        sourceKey: 'vehicles[0].technicalData.emissionsConsumptionWltp',
        sourceKind: 'derived-demo-wltp-statement',
        sourceMarket: market,
        demo: true,
      });
    }
    const models = rows(initial.models).map((model) => ({
      ...model,
      jsonld: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Vehicle',
        '@id': `/aida/showcase/data/models.json#${model.code}`,
        name: model.name,
        brand: { '@type': 'Brand', name: 'BMW' },
        additionalProperty: [...values.values()].filter((row) => row.code === model.code && row.field !== 'wltp').map((row) => ({ '@type': 'PropertyValue', name: row.field, value: `${row.value}${row.unit ? ` ${row.unit}` : ''}` })),
      }),
    }));
    return [market, structuredClone({
      ...initial, values: sheet([...values.values()]), models: sheet(models),
    })];
  }));
  const pages = {};
  const data = {
    '/aida/showcase/data/wdh-de.json': sheets.de,
    '/aida/showcase/data/wdh-fr.json': sheets.fr,
    '/aida/showcase/data/models.json': sheet(structuredClone(editorial.models)),
    '/aida/showcase/data/news.json': sheet(editorial.news.flatMap((story) => ['en', 'de', 'fr'].map((lang) => ({
      id: story.id,
      lang,
      ...story[lang],
      image: assets[story.asset].url,
      source: editorial.source,
      sourceKind: story.sourceKind,
      demo: true,
    })))),
  };
  const compositions = [];
  const newsIndex = [];
  CONTEXTS.forEach((context) => {
    const { id, lang, market } = context;
    const t = copy[lang];
    const base = `/aida/showcase/${id}`;
    const values = new Map(rows(sheets[market]?.values).map((row) => [row.key, row]));
    const display = (key) => {
      const row = values.get(key);
      if (!row || row.value === undefined) throw new Error(`Missing WDH fixture: ${market}/${key}`);
      return `${row.value}${row.unit ? ` ${row.unit}` : ''}`;
    };
    const fact = (key) => `<a href="/aida/showcase/data/wdh-${market}.json#${key}">${esc(display(key))}</a>`;
    const image = (name, video = false) => `<p><a href="${esc(assets[name].url)}">${esc(assets[name].alt)}</a></p>${video ? `<p><a href="${esc((name === 'i5' ? editorial.i5Video : editorial.video).url)}">BMW ${name} film</a></p>` : ''}`;
    const note = () => `<p>${esc(t.demo)}${context.fallback ? ` ${esc(t.belgium)}` : ''}${context.sparse ? ` ${esc(t.austria)}` : ''}</p>`;
    const fallback = () => (market === 'fr' ? `<p class="aida-showcase-note">${esc(t.fallback)}</p>` : '');
    const legal = () => `<p class="aida-showcase-note">BMW i5 eDrive40: ${esc(t.consumptionLabel)}: ${fact('61HG.electricConsumption')} (WLTP); ${esc(t.co2)}: ${fact('61HG.co2')} (WLTP); ${esc(t.co2Class)}: ${fact('61HG.co2Class')}; ${esc(t.rangeLabel)}: ${fact('61HG.electricRange')}. ${fact('61HG.wltp')}. ${esc(t.legal)}</p>`;
    const local = (slug) => `${context.sparse && slug.startsWith('news/') && slug !== 'news/i5-launch' ? `/aida/showcase/${context.sourceContext}` : base}/${slug}`;
    const price = (code) => `<p>${esc(t.from)} ${fact(`${code}.fromPrice`)}</p><p>${esc(t.leasing)} ${fact(`${code}.leasePrice`)}</p><p class="aida-showcase-note">${esc(t.leaseFixture)}</p>`;
    const configure = () => (market === 'fr'
      ? 'https://configure.bmw.fr/fr_FR/configure/G60E/61HG'
      : 'https://configure.bmw.de/de_DE/configure/G60E/61HG');
    const stats = (code, fields) => `<ul>${fields.map(([label, field]) => `<li><p>${esc(label)}</p><p>${fact(`${code}.${field}`)}</p></li>`).join('')}</ul>`;
    const i5Fields = [[t.rangeLabel, 'electricRange'], [t.consumptionLabel, 'electricConsumption'], [t.chargeLabel, 'additionalRangeDC']];
    const vehicle = (code) => ({
      '@type': 'Vehicle',
      '@id': `/aida/showcase/data/models.json#${code}`,
      name: editorial.models.find((model) => model.code === code).name,
      brand: { '@type': 'Brand', name: 'BMW' },
      description: t.demo,
      additionalProperty: ['electricRange', 'electricConsumption', 'power', 'acceleration'].filter((field) => values.has(`${code}.${field}`)).map((field) => ({ '@type': 'PropertyValue', name: field, value: display(`${code}.${field}`) })),
    });
    const document = (slug, title, description, type, content, code) => {
      const path = local(slug);
      const ld = {
        '@context': 'https://schema.org', '@type': type, '@id': path, name: title, description, inLanguage: lang,
      };
      if (type === 'NewsArticle') {
        ld.headline = title;
        ld.publisher = { '@type': 'Organization', name: 'BMW demo' };
        ld.image = assets[editorial.news.find((story) => slug === `news/${story.id}`).asset].url;
        if (code) ld.about = vehicle(code);
      }
      if (type === 'Vehicle') Object.assign(ld, vehicle(code), { '@id': path, url: path });
      const metadata = [['Title', title], ['Description', description], ['html-lang', lang], ['aida-context', id], ['aida-demo', 'true'], ['json-ld', JSON.stringify(ld)], ...(code ? [['wdh-model', code]] : [])];
      const meta = `<div><div class="metadata">${metadata.map(([key, value]) => `<div><div>${esc(key)}</div><div>${esc(value)}</div></div>`).join('')}</div></div>`;
      pages[path] = `<body><header></header><main>${content}${meta}</main><footer></footer></body>\n`;
      compositions.push({
        path, type, context: id, components: [...content.matchAll(/<p><em>component:([^<]+)<\/em><\/p>/g)].map((match) => match[1]).join(','), demo: true,
      });
    };
    const stage = (name, title, subtitle, asset, extra = '') => wrap(name, 'stage', `${image(asset, name === 'main-teaser-i5')}<div class="aida-showcase-copy">${heading(title, 1)}${paragraph(subtitle)}${extra}</div>`);
    const story = (storyId) => editorial.news.find((entry) => entry.id === storyId);
    const teaser = (entry, short = false) => `<article>${image(entry.asset)}<div class="aida-showcase-copy">${heading(entry[lang].title, 3)}${paragraph(entry[lang][short ? 'teaserShort' : 'teaserLong'])}${cta(local(`news/${entry.id}`), t.learn, false)}</div></article>`;
    const modelCard = (model) => `<article>${image(model.asset)}<div class="aida-showcase-copy">${heading(model.name, 3)}${paragraph(model.drivetrain === 'BEVE' ? t.electric : 'Plug-in hybrid')}${price(model.code)}${stats(model.code, model.drivetrain === 'BEVE' ? [[t.rangeLabel, 'electricRange'], [t.acceleration, 'acceleration']] : [[t.power, 'power'], [t.acceleration, 'acceleration']])}${cta(model.code === '61HG' ? local('i5') : `https://www.bmw.de${assets[model.asset].sources[0]}.html`, t.discover, false)}</div></article>`;
    const related = editorial.models.filter((model) => model.discovery && ['BEVE', 'PHEV'].includes(model.drivetrain) && model.code !== '61HG');
    const electricModels = editorial.models.filter((model) => model.discovery && model.drivetrain === 'BEVE');
    const emob = () => wrap('emob-section', 'grid', `${heading(t.allElectric)}<div class="aida-showcase-grid"><article>${image('charging')}${heading(t.charging, 3)}${paragraph(t.chargingCopy)}<p>${esc(t.chargeSentence)}: ${fact('61HG.additionalRangeDC')}.</p>${cta(local('e-mobility'), t.learn, false)}</article><article>${image('range')}${heading(t.range, 3)}${paragraph(t.rangeShort)}${cta(local('e-mobility'), t.learn, false)}</article><article>${image('i5')}${heading(t.electric, 3)}${paragraph(t.electricCopy)}${cta(local('e-mobility'), t.learn, false)}</article></div>`);

    document(
      'home',
      t.home,
      t.subtitle,
      'WebPage',
      `${stage('main-teaser-i5', t.home, t.subtitle, 'i5', `${cta(configure(), t.configure)}${cta(local('i5'), t.discover, false)}${legal()}`)
      + wrap('video-teaser-ix3', 'feature video', `${image('ix3', true)}<div class="aida-showcase-copy">${heading(t.ix3)}<p>${esc(t.rangeLabel)}: ${fact('31HR.electricRange')}.</p>${cta(local('e-mobility'), t.discover)}${fallback()}</div>`)
      + wrap('small-teaser-emob', 'feature', `${image('charging')}<div class="aida-showcase-copy">${heading(t.charging)}${paragraph(t.chargingCopy)}${cta(local('e-mobility'), t.learn)}</div>`)
      + wrap('teaser-list', 'grid', `${heading(t.newsList)}<div class="aida-showcase-grid">${['cannes', 'concept-m'].map((key) => teaser(story(key))).join('')}<article>${image('ix3')}${heading(t.xTitle, 3)}${paragraph(t.xCopy)}${cta(local('e-mobility'), t.learn, false)}</article>${['interior', '3-series'].map((key) => teaser(story(key))).join('')}</div>`)
      + (id === 'de/de' ? wrap('summer-offer', 'feature', `${image('range')}<div class="aida-showcase-copy">${heading(t.summer)}${paragraph(t.summerCopy)}${cta('https://www.bmw.de/de/shop/ls/dp/ConnectedDrive', t.summerCta)}</div>`) : '')
      }<div>${note()}</div>`,
    );

    document(
      'i5',
      t.car,
      t.subtitle,
      'Vehicle',
      stage('main-teaser-i5', t.car, t.subtitle, 'i5', `${price('61HG')}${cta(configure(), t.configure)}${cta(local('news/i5-launch'), t.offer, false)}`)
      + wrap('car-kpi', 'kpi', `${heading(t.keyFigures)}${stats('61HG', i5Fields)}${legal()}`)
      + emob()
      + wrap('news-teaser', 'grid', `<div class="aida-showcase-grid">${teaser(story('interior'), true)}</div>`)
      + wrap('electrified-models', 'grid', `${heading(t.related)}<div class="aida-showcase-grid">${related.map(modelCard).join('')}</div>${fallback()}`)
      + wrap('assist-features', 'grid', `${heading(t.features)}<div class="aida-showcase-grid"><article>${heading('Driving Assistant Professional', 3)}<p>${esc(t.drivingCopy)}: ${fact('61HG.drivingAssistantSpeed')}.</p></article>${market === 'de' ? `<article>${heading(t.highway, 3)}<p>${esc(t.highwayCopy)}: ${fact('61HG.highwayAssistantSpeed')}.</p></article>` : ''}<article>${heading(t.parking, 3)}${paragraph(t.parkingCopy)}</article></div>`)
      + wrap('fact-refresh', 'refresh', `${heading(t.refresh)}${paragraph(t.refreshCopy)}<p><a href="/aida/showcase/data/wdh-${market}.json">${esc(t.refreshButton)}</a></p><p role="status">${esc(t.initialStatus)}</p>${note()}`),
      '61HG',
    );

    document(
      'e-mobility',
      t.topic,
      t.topicSubtitle,
      'WebPage',
      `${stage('stage-emob', t.topic, t.topicSubtitle, 'range')
      + wrap('topic-range', 'feature', `${image('range')}<div class="aida-showcase-copy">${heading(t.topicRange)}${paragraph(t.topicRangeCopy)}${cta(local('i5'), t.learn)}</div>`)
      + wrap('model-range', 'grid', `${heading(t.lineup)}<div class="aida-showcase-grid">${electricModels.map(modelCard).join('')}</div>${legal()}${fallback()}`)
      + wrap('topic-charging', 'feature', `${image('charging')}<div class="aida-showcase-copy">${heading(t.topicCharging)}${paragraph(t.topicChargingCopy)}${cta('https://www.bmw.de/de/elektroauto/laden/zuhause-laden.html', t.homeCharging)}${cta('https://www.bmw.de/de/elektroauto/laden/unterwegs-laden.html', t.publicCharging, false)}</div>`)
      + wrap('news-hydrogen', 'grid', `<div class="aida-showcase-grid">${teaser(story('hydrogen'))}</div>`)
      }<div>${note()}</div>`,
    );

    editorial.news.filter((entry) => !context.sparse || entry.id === 'i5-launch').forEach((entry) => {
      const news = entry[lang];
      document(
        `news/${entry.id}`,
        news.title,
        news.teaserShort,
        'NewsArticle',
        stage('news-stage', news.title, news.teaserShort, entry.asset)
        + wrap('news-body', 'article', `${paragraph(news.teaserLong)}${entry.code ? `${stats(entry.code, i5Fields)}${legal()}${cta(local('i5'), t.discover)}` : ''}<p class="aida-showcase-note">${esc(entry.sourceKind)} · ${esc(editorial.source)}</p>${note()}`),
        entry.code,
      );
      newsIndex.push({
        path: local(`news/${entry.id}`), id: entry.id, context: id, title: news.title, description: news.teaserShort, image: assets[entry.asset].url, demo: true,
      });
    });
  });
  data['/aida/showcase/data/compositions.json'] = sheet(compositions);
  data['/aida/showcase/news-index.json'] = sheet(newsIndex);
  return { pages, data };
}

export function writeContent(content, { out = join(ROOT, 'tools/aida/content/out/showcase'), plain } = {}) {
  const write = (file, text) => {
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, text);
  };
  Object.entries(content.pages).forEach(([path, body]) => {
    write(join(out, `${path}.html`), body);
    if (plain) write(join(plain, `${path}.plain.html`), body.match(/<main>([\s\S]*)<\/main>/)[1]);
  });
  Object.entries(content.data).forEach(([path, value]) => {
    const text = `${JSON.stringify(value, null, 2)}\n`;
    write(join(out, path), text);
    if (plain) write(join(plain, path), text);
  });
  return {
    out,
    plain: plain || null,
    pages: Object.keys(content.pages).length,
    data: Object.keys(content.data).length,
  };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  if (args.some((arg) => arg !== '--plain')) throw new Error('Usage: node tools/aida/showcase/content.mjs [--plain]');
  const catalogue = JSON.parse(readFileSync(join(ROOT, 'tools/aida/asset-picker/catalogue.json'), 'utf8'));
  const result = writeContent(buildContent({ catalogue }), { plain: args.includes('--plain') ? join(ROOT, 'drafts') : null });
  console.log(JSON.stringify(result, null, 2));
}
