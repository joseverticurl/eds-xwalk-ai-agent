/**
 * Validation routes to support the Step 2 “User provides UE HTML” workflow gate.
 */
export function registerValidateRoutes(app) {
  app.post('/validate/ue-html', async (req, res) => {
    const { html, expectations } = req.body ?? {};
    const result = validateUeHtml({ html, expectations });
    res.status(result.ok ? 200 : 400).json(result);
  });
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

  if (!html || typeof html !== 'string' || !html.trim()) {
    return { ok: false, errors: ['Missing `html` (Universal Editor output)'], warnings: [] };
  }

  const normalized = String(html);
  const rootTag = findFirstRootTag(normalized);
  if (!rootTag) {
    return { ok: false, errors: ['No root element found in provided HTML'], warnings: [] };
  }

  // Note: UE HTML may contain data-* attributes; we only warn so callers don’t rely on them.
  if (/\bdata-aue-|\bdata-gen-/i.test(normalized)) {
    warnings.push('HTML contains authoring data-* attributes (ok), but frontend code must not rely on them for structure/selection.');
  }

  const directChildren = getDirectChildTagsOfFirstRoot(normalized);
  const minDirectChildren = expectations?.minDirectChildren;
  if (typeof minDirectChildren === 'number' && directChildren.length < minDirectChildren) {
    errors.push(`Expected at least ${minDirectChildren} direct child elements, found ${directChildren.length}.`);
  }

  const rows = expectations?.rows;
  if (Array.isArray(rows)) {
    for (const row of rows) {
      const idx = row?.index;
      if (typeof idx !== 'number') continue;
      const el = directChildren[idx];
      if (!el) {
        errors.push(`Missing direct child at index ${idx}.`);
        continue;
      }
      if (row.tagName && el.tagName.toLowerCase() !== String(row.tagName).toLowerCase()) {
        errors.push(`Child[${idx}] expected <${row.tagName}>, found <${el.tagName.toLowerCase()}>.`);
      }
      if (typeof row.minChildren === 'number') {
        const rowKids = el.directChildTagNames;
        if (rowKids.length < row.minChildren) {
          errors.push(`Child[${idx}] expected at least ${row.minChildren} child elements, found ${rowKids.length}.`);
        }
      }
    }
  }

  return { ok: errors.length === 0, errors, warnings };
}

function findFirstRootTag(html) {
  const tags = tokenizeTags(html);
  for (const t of tags) {
    if (t.type === 'open' && t.depth === 0) return t;
  }
  return null;
}

function getDirectChildTagsOfFirstRoot(html) {
  const tags = tokenizeTags(html);
  const rootOpen = tags.find((t) => t.type === 'open' && t.depth === 0);
  if (!rootOpen) return [];

  const directChildren = [];
  for (let i = rootOpen.i + 1; i < tags.length; i++) {
    const t = tags[i];
    if (t.type === 'close' && t.tagName === rootOpen.tagName && t.depth === 0) break;

    // A direct child opens at depth 1.
    if (t.type === 'open' && t.depth === 1) {
      const child = {
        tagName: t.tagName,
        directChildTagNames: []
      };

      // Collect child direct children at depth 2 until this child closes back to depth 1.
      for (let j = i + 1; j < tags.length; j++) {
        const u = tags[j];
        if (u.type === 'close' && u.tagName === t.tagName && u.depth === 1) break;
        if (u.type === 'open' && u.depth === 2) child.directChildTagNames.push(u.tagName);
      }

      directChildren.push(child);
    }
  }

  return directChildren;
}

function tokenizeTags(html) {
  // Very small tag tokenizer sufficient for UE snippets:
  // - ignores comments/doctype
  // - tracks depth of element nesting
  // - handles self-closing tags
  const tags = [];
  const voidTags = new Set([
    'area',
    'base',
    'br',
    'col',
    'embed',
    'hr',
    'img',
    'input',
    'link',
    'meta',
    'param',
    'source',
    'track',
    'wbr'
  ]);

  let depth = 0;
  let idx = 0;
  while (idx < html.length) {
    const lt = html.indexOf('<', idx);
    if (lt === -1) break;
    const gt = html.indexOf('>', lt + 1);
    if (gt === -1) break;

    const raw = html.slice(lt + 1, gt).trim();
    idx = gt + 1;

    if (!raw || raw.startsWith('!') || raw.startsWith('?')) continue;
    if (raw.startsWith('--')) continue; // malformed comment chunk

    const isClose = raw.startsWith('/');
    const body = isClose ? raw.slice(1).trim() : raw;
    const tagName = body.split(/\s+/)[0]?.toLowerCase();
    if (!tagName) continue;

    const selfClosing = /\/\s*$/.test(body) || voidTags.has(tagName);

    if (isClose) {
      depth = Math.max(0, depth - 1);
      tags.push({ type: 'close', tagName, depth, i: tags.length });
      continue;
    }

    tags.push({ type: 'open', tagName, depth, i: tags.length, selfClosing });
    if (!selfClosing) depth += 1;
  }

  return tags;
}
