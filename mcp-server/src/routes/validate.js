import { requireJsonBody, validateBody } from '../middleware/validation-middleware.js';
import { analyzeUeHtmlStructure, hasAuthoringDataAttributes } from '../services/html/ue-html-analyzer.js';

/**
 * Validation routes to support the Step 2 “User provides UE HTML” workflow gate.
 */
export function registerValidateRoutes(app) {
  app.post(
    '/validate/ue-html',
    requireJsonBody(),
    validateBody({
      required: ['html'],
      properties: { html: { type: 'string', minLength: 1 }, expectations: { type: 'object' } }
    }),
    async (req, res) => {
      const { html, expectations } = req.body ?? {};
      const result = validateUeHtml({ html, expectations });
      res.status(result.ok ? 200 : 400).json(result);
    }
  );
}

/**
 * @param {object} input
 * @param {string} input.html - Universal Editor generated semantic HTML snippet
 * @param {object} [input.expectations]
 * @param {number} [input.expectations.minDirectChildren] - minimum required direct children of the block root
 * @param {Array<{index:number,minChildren?:number,tagName?:string}>} [input.expectations.rows]
 */
export function validateUeHtml({ html, expectations }) {
  const errors = [];
  const warnings = [];

  const normalized = normalizeHtml(html, errors);
  if (!normalized) return { ok: false, errors, warnings };

  const analysis = analyzeUeHtmlStructure(normalized);
  if (!analysis.rootTagName) {
    return { ok: false, errors: ['No root element found in provided HTML'], warnings: [] };
  }

  warnings.push(...authoringWarnings(normalized));

  const directChildren = analysis.directChildren;
  validateMinDirectChildren(directChildren, expectations?.minDirectChildren, errors);
  validateExpectedRows(directChildren, expectations?.rows, errors);

  return { ok: errors.length === 0, errors, warnings };
}

function normalizeHtml(html, errors) {
  if (!html || typeof html !== 'string' || !html.trim()) {
    errors.push('Missing `html` (Universal Editor output)');
    return '';
  }
  return String(html);
}

function authoringWarnings(html) {
  return hasAuthoringDataAttributes(html)
    ? ['HTML contains authoring data-* attributes (ok), but frontend code must not rely on them for structure/selection.']
    : [];
}

function validateMinDirectChildren(directChildren, min, errors) {
  if (typeof min !== 'number') return;
  if (directChildren.length >= min) return;
  errors.push(`Expected at least ${min} direct child elements, found ${directChildren.length}.`);
}

function validateExpectedRows(directChildren, rows, errors) {
  if (!Array.isArray(rows)) return;
  for (const row of rows) validateRow(directChildren, row, errors);
}

function validateRow(directChildren, row, errors) {
  const idx = row?.index;
  if (typeof idx !== 'number') return;

  const el = directChildren[idx];
  if (!el) {
    errors.push(`Missing direct child at index ${idx}.`);
    return;
  }

  const expectedTag = row?.tagName ? String(row.tagName).toLowerCase() : '';
  if (expectedTag && el.tagName.toLowerCase() !== expectedTag) {
    errors.push(`Child[${idx}] expected <${expectedTag}>, found <${el.tagName.toLowerCase()}>.`);
  }

  const minChildren = row?.minChildren;
  if (typeof minChildren === 'number' && el.directChildTagNames.length < minChildren) {
    errors.push(`Child[${idx}] expected at least ${minChildren} child elements, found ${el.directChildTagNames.length}.`);
  }
}

// NOTE: HTML tokenization helpers were moved to `services/html/ue-html-analyzer.js`
