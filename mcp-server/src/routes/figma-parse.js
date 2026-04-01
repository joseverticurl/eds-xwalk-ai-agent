import { requireJsonBody, validateBody } from '../middleware/validation-middleware.js';
import { parseFigmaUrl } from '../utils/parse-figma-url.js';

export function registerFigmaParseRoutes(app) {
  app.post(
    '/parse/figma-url',
    requireJsonBody(),
    validateBody({
      required: ['url'],
      properties: { url: { type: 'string', minLength: 12 } }
    }),
    async (req, res, next) => {
      try {
        const { url } = req.body ?? {};
        const parsed = parseFigmaUrl(url);
        res.json({ ok: true, ...parsed });
      } catch (e) {
        next(e);
      }
    }
  );
}
