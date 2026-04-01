import { generateBlockBackendJson } from '../services/generation/block-backend-generator.js';
import { generateBlockFrontend } from '../services/generation/block-frontend-generator.js';

export async function generateBlockBackend(req, res, next) {
  try {
    const { blockName, title, modelId, fields, hasModel } = req.body ?? {};
    const payload = generateBlockBackendJson({ blockName, title, modelId, fields, hasModel });
    res.json({
      ok: true,
      artifact: {
        path: `blocks/${String(blockName ?? '').trim()}/_${String(blockName ?? '').trim()}.json`,
        kind: 'block-backend-json',
        json: payload
      }
    });
  } catch (e) {
    next(e);
  }
}

export async function generateBlockFrontendArtifacts(req, res, next) {
  try {
    const { blockName, ueHtml, pattern } = req.body ?? {};
    const out = generateBlockFrontend({ blockName, ueHtml, pattern });
    res.json({ ok: true, ...out });
  } catch (e) {
    next(e);
  }
}
