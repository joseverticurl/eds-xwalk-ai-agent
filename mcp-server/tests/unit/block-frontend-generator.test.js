import test from 'node:test';
import assert from 'node:assert/strict';

import { generateBlockFrontend } from '../../src/services/generation/block-frontend-generator.js';

test('generateBlockFrontend: returns js+css artifacts and analysis', () => {
  const out = generateBlockFrontend({
    blockName: 'hero',
    pattern: 'hero',
    ueHtml: '<div class="hero"><div><picture></picture></div><div><h1>Title</h1></div></div>'
  });

  assert.equal(out.blockName, 'hero');
  assert.equal(out.pattern, 'hero');
  assert.ok(out.analysis?.rootTagName);
  assert.equal(out.artifacts.length, 2);

  const js = out.artifacts.find((a) => a.kind === 'block-frontend-js');
  const css = out.artifacts.find((a) => a.kind === 'block-frontend-css');
  assert.ok(js?.content.includes('export default function decorate'));
  assert.ok(css?.content.includes('.hero'));
});

test('generateBlockFrontend: requires ueHtml', () => {
  assert.throws(() => generateBlockFrontend({ blockName: 'x', ueHtml: '' }), /Missing `ueHtml`/);
});

