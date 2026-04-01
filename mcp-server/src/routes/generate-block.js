import express from 'express';
import { generateBlockBackend, generateBlockFrontendArtifacts } from '../controllers/block-controller.js';
import { requireJsonBody, validateBody } from '../middleware/validation-middleware.js';

export function registerGenerateBlockRoutes(app) {
  const router = express.Router();

  // Step 1: backend JSON generation only (no UE HTML, no FE)
  router.post(
    '/backend',
    requireJsonBody(),
    validateBody({
      required: ['blockName', 'fields'],
      properties: {
        blockName: { type: 'string', minLength: 1 },
        title: { type: 'string' },
        modelId: { type: 'string' },
        hasModel: { type: 'boolean' },
        fields: { type: 'array' }
      }
    }),
    generateBlockBackend
  );

  // Step 3: frontend artifacts (JS/CSS) generated from user-provided UE HTML
  router.post(
    '/frontend',
    requireJsonBody(),
    validateBody({
      required: ['blockName', 'ueHtml'],
      properties: {
        blockName: { type: 'string', minLength: 1 },
        ueHtml: { type: 'string', minLength: 1 },
        pattern: { type: 'string' }
      }
    }),
    generateBlockFrontendArtifacts
  );

  app.use('/generate/block', router);
}
