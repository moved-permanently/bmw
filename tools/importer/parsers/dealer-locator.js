/* eslint-disable */
/* global WebImporter */
// Parser for block "dealer-locator" (source: .dealerlocator.aem-GridColumn, cmp-dealerlocator).
// The source component is an inline script calling window.dloaas.api.start(JSON.parse('{...}')).
// Block content: one key/value row per config property (source order). Non-string values and strings
// that would read as a JSON literal ("5", "true") are written as JSON so the block restores the types.
// The cleanup transformer removes <script> before parsing, so the config is recovered from (in order):
// a script left in the element, the scripts of the live window document, the global
// onScriptLoadCallback the inline script defined when the snapshot was loaded, or the source default.
import { replaceWithBlock } from './_utils.js';

export const selectors = ['.dealerlocator.aem-GridColumn'];

// config of www.bmw.de/de/fastlane/dealer-locator.html (2026-09), used if the script is gone
const DEFAULT_CONFIG = {"country":"DE","continentsCountriesPath":null,"showGoogleMapsDisclaimer":true,"addressSelection":["name","street","postalCode///city"],"language":"de","showFilters":true,"mapProvider":"here","isReverseGeocoding":true,"maximumDealersShownInList":60,"apiUrl":"/c2b-localsearch/services/api/v4/clients/BMWSTAGE2_DLO/DE/pois","configId":"master","dealerDetails":{"emailAddress":true,"website":true,"address":true,"contactInformation":true,"routeToDealer":true,"areaCodePhoneAndFax":true,"offeredService":false,"countryCodePhoneAndFax":false},"dealersToDisplay":[],"worldwide":false,"isIntegrated":false,"singleSearchFieldEnabled":false,"initialBrand":"BMW_BMWM","centerLng":"10.451526000000058","brands":[{"brand":"BMW_BMWM","filters":[{"name":"newCars","selected":false,"hiddenForUser":false},{"name":"usedCars","selected":false,"hiddenForUser":false},{"name":"repairServices","selected":false,"hiddenForUser":false},{"name":"mCertified","selected":false,"hiddenForUser":false}]}],"hideDistanceInDealersList":false,"minimumDealersPerCountry":"5","osaEnabled":true,"osatCsvPath":"/content/dam/bmw/marketDE/bmw_de/datastore/17012022_BMW_OTV.csv","layoutMode":"listAndMap","goToRegistrationBtnShow":false,"campaign":{"dealer":[],"active":false},"minimumDealersToDisplayInSearch":0,"centerLat":"51.165691","unitSystem":"km","maxDealers":700,"osaSource":"csv"};

function unescapeJs(s) {
  return s
    .replace(/\\x([0-9a-fA-F]{2})/g, (m, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/\\u([0-9a-fA-F]{4})/g, (m, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/\\(['"\/\\])/g, '$1');
}

function configFromSource(src) {
  if (!src || src.indexOf('dloaas') < 0) return null;
  const m = src.match(/start\(\s*JSON\.parse\(\s*'([\s\S]*?)'\s*\)\s*\)/);
  if (m) {
    try { return JSON.parse(unescapeJs(m[1])); } catch (e) { /* next */ }
  }
  const o = src.match(/start\(\s*(\{[\s\S]*\})\s*\)/);
  if (o) {
    try { return JSON.parse(o[1]); } catch (e) { /* next */ }
  }
  return null;
}

function findConfig(element) {
  const sources = [];
  element.querySelectorAll('script').forEach((s) => sources.push(s.textContent));
  try {
    window.document.querySelectorAll('script').forEach((s) => sources.push(s.textContent));
  } catch (e) { /* no window */ }
  try {
    if (typeof window.onScriptLoadCallback === 'function') sources.push(window.onScriptLoadCallback.toString());
  } catch (e) { /* no window */ }
  for (const src of sources) {
    const cfg = configFromSource(src);
    if (cfg) return cfg;
  }
  return DEFAULT_CONFIG;
}

const LITERAL_RE = /^(true|false|null|-?\d+(\.\d+)?([eE][+-]?\d+)?|".*"|\[.*\]|\{.*\})$/;

function valueText(v) {
  if (typeof v === 'string') return LITERAL_RE.test(v.trim()) ? JSON.stringify(v) : v;
  return JSON.stringify(v);
}

export default function parse(element, { document }) {
  const config = findConfig(element);
  const rows = Object.entries(config).map(([k, v]) => [k, valueText(v)]);
  replaceWithBlock(document, element, 'Dealer Locator', rows);
}
