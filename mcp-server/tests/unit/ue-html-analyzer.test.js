import test from 'node:test';
import assert from 'node:assert/strict';

import { analyzeUeHtmlStructure, hasAuthoringDataAttributes } from '../../src/services/html/ue-html-analyzer.js';

test('analyzeUeHtmlStructure: finds root and direct children', () => {
  const html = '<div class="hero"><div><picture></picture></div><div><h1>Title</h1></div></div>';
  const analysis = analyzeUeHtmlStructure(html);
  assert.equal(analysis.rootTagName, 'div');
  assert.equal(analysis.directChildren.length, 2);
  assert.equal(analysis.directChildren[0].tagName, 'div');
});

test('hasAuthoringDataAttributes: detects data-aue attributes', () => {
  assert.equal(hasAuthoringDataAttributes('<div data-aue-type="text"></div>'), true);
  assert.equal(hasAuthoringDataAttributes('<div></div>'), false);
});

