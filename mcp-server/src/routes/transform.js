import { FigmaService } from '../services/figma/figma-service.js';
import { buildDesignTokens } from '../services/figma/tokens.js';
import { requireJsonBody, validateBody } from '../middleware/validation-middleware.js';

export function registerTransformRoutes(app) {
  app.post(
    '/transform/figma/tokens',
    requireJsonBody(),
    validateBody({
      required: ['fileKey'],
      properties: { fileKey: { type: 'string', minLength: 1 }, nodeIds: { type: 'array' } }
    }),
    async (req, res, next) => {
      try {
        const { fileKey, nodeIds } = req.body ?? {};

        const figma = new FigmaService({ env: process.env });

      const styles = await figma.getFileStyles({ fileKey });
      const styleNodeIds = (styles?.meta?.styles ?? [])
        .map((s) => s?.node_id)
        .filter(Boolean);

      // Optionally include additional nodeIds the caller wants included.
      const extraNodeIds = Array.isArray(nodeIds) ? nodeIds : [];
      const ids = Array.from(new Set([...styleNodeIds, ...extraNodeIds]));

      // Figma API has limits; chunk if needed (simple chunking).
      const nodesById = {};
      const chunkSize = 100;
      for (let i = 0; i < ids.length; i += chunkSize) {
        const chunk = ids.slice(i, i + chunkSize);
        const nodes = await figma.getFileNodes({ fileKey, nodeIds: chunk });
        const got = nodes?.nodes ?? {};
        for (const [id, val] of Object.entries(got)) nodesById[id] = val;
      }

      const tokenBundle = buildDesignTokens({ styles, nodesById });
        res.json({
          ok: true,
          fileKey,
          tokenBundle
        });
      } catch (e) {
        next(e);
      }
    }
  );
}
