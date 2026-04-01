import test from 'node:test';
import assert from 'node:assert/strict';

import { parseFigmaUrl } from '../../src/utils/parse-figma-url.js';

test('parseFigmaUrl: design file + node-id', () => {
  const r = parseFigmaUrl('https://www.figma.com/design/abc123XYZ/MyFile?node-id=10-20');
  assert.equal(r.kind, 'design');
  assert.equal(r.fileKey, 'abc123XYZ');
  assert.deepEqual(r.nodeIds, ['10:20']);
});

test('parseFigmaUrl: branch uses branchKey as fileKey', () => {
  const r = parseFigmaUrl('https://www.figma.com/design/parentKey/branch/branchKey456/Name');
  assert.equal(r.fileKey, 'branchKey456');
});

test('parseFigmaUrl: make', () => {
  const r = parseFigmaUrl('https://figma.com/make/makeKey123/Playground');
  assert.equal(r.kind, 'make');
  assert.equal(r.fileKey, 'makeKey123');
});

test('parseFigmaUrl: rejects non-figma', () => {
  assert.throws(() => parseFigmaUrl('https://example.com/x'), /figma\.com/);
});
