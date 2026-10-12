import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as view from '../../tools/aida/showcase/view.js';

const architecture = () => {
  assert.equal(typeof view.architectureView, 'function', 'The architecture explanation needs a testable view');
  return view.architectureView();
};
const text = (html) => html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');

test('architecture follows the content from its sources through authoring to the website', () => {
  const html = architecture();
  const flow = html.match(/<ol\b[^>]*aria-label="From sources to website"[^>]*>([\s\S]*?)<\/ol>/)?.[1];
  assert.ok(flow, 'A labelled flow should explain the connections, not just name technologies');
  assert.match(flow, /Data and media[\s\S]*Experience Workspace[\s\S]*AEM website/);
  assert.match(text(html), /content.*saved.*Experience Workspace/i);
  assert.match(text(html), /code.*GitHub/i);
});

test('architecture explains a linked WDH value and how it is checked', () => {
  const html = architecture();
  const copy = text(html);
  assert.match(copy, /513–627 km/);
  assert.match(copy, /stores.*text.*reference/i);
  assert.match(copy, /Preflight.*compares/i);
  assert.match(copy, /without.*WDH request/i);
  assert.match(html, /href="https:\/\/main--bmw--moved-permanently\.aem\.page\/aida\/showcase\/de\/de\/i5"/);
});

test('architecture explains language reuse, market ownership and the limits of the populated example', () => {
  const copy = text(architecture());
  assert.match(copy, /German.*Germany.*Austria/i);
  assert.match(copy, /French.*France.*Belgium/i);
  assert.match(copy, /local.*(introduction|CTA|call to action)/i);
  assert.match(copy, /Austria.*German.*Belgium.*French.*data/i);
  assert.match(copy, /four markets.*64.*planning/i);
  assert.match(copy, /brands.*separate.*sites/i);
});

test('architecture distinguishes content publication from code releases and production controls', () => {
  const html = architecture();
  const copy = text(html);
  assert.match(copy, /preview.*publish.*live/i);
  assert.match(copy, /merging.*main.*code/i);
  assert.match(copy, /does not publish.*content/i);
  assert.match(copy, /DEV.*TEST.*STAGE.*LIVE/);
  assert.match(copy, /identity.*preview.*protection/i);
  assert.match(html, /href="https:\/\/main--bmw--moved-permanently\.aem\.page\/aida\/showcase\/en\/i5\.md"/);
});

test('architecture names working connections and says what still needs connecting', () => {
  const copy = text(architecture());
  assert.match(copy, /WDH.*supplied exports.*live.*connection/i);
  assert.match(copy, /OTMM.*not connected/i);
  assert.match(copy, /Salesforce.*not connected/i);
  assert.match(copy, /translation.*prepared.*text/i);
  assert.match(copy, /saved locally in your browser/i);
  assert.match(copy, /do not change.*linked pages/i);
});

test('architecture replaces raw contracts with prose and is used by the architecture route', () => {
  const html = architecture();
  assert.doesNotMatch(html, /<pre\b|<code\b|Context contract|Connector contracts|Share capabilities|Preserve contexts|independent dimensions/i);
  const app = readFileSync(new URL('../../tools/aida/showcase/app.js', import.meta.url), 'utf8');
  assert.match(app, /architecture: architectureView/);
  assert.doesNotMatch(app, /function architecture\(/);
});
