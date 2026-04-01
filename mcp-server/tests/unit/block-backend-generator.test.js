import test from 'node:test';
import assert from 'node:assert/strict';

import { generateBlockBackendJson } from '../../src/services/generation/block-backend-generator.js';

test('generateBlockBackendJson: produces block json with model and normalized names', () => {
  const json = generateBlockBackendJson({
    blockName: 'Hero Banner',
    title: 'Hero',
    fields: [{ component: 'text', name: 'title', label: 'Title', valueType: 'string' }]
  });

  assert.equal(json.id, 'hero-banner');
  assert.equal(json.title, 'Hero');
  assert.equal(json.plugins?.xwalk?.page?.template?.filter, 'hero-banner');
  assert.equal(json.plugins?.xwalk?.page?.template?.model, 'hero-banner');
  assert.ok(Array.isArray(json.models));
  assert.equal(json.models[0].id, 'hero-banner');
  assert.equal(json.models[0].fields[0].name, 'title');
});

test('generateBlockBackendJson: rejects underscore field names', () => {
  assert.throws(
    () =>
      generateBlockBackendJson({
        blockName: 'x',
        title: 'X',
        fields: [{ component: 'text', name: 'image_alt', label: 'Alt', valueType: 'string' }]
      }),
    /must not include underscores/i
  );
});

