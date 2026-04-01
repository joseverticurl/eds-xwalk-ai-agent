import { analyzeUeHtmlStructure, hasAuthoringDataAttributes } from '../html/ue-html-analyzer.js';

/**
 * Step-3 generator: produce `<block-name>.js` + `<block-name>.css` from UE HTML.
 *
 * Rules (from implementation-guide):
 * - User-provided HTML is mandatory (we analyze it; we don't invent it)
 * - Index-based selection only (no data-* coupling)
 * - One JS/CSS per block, names must match folder
 */
export function generateBlockFrontend({ blockName, ueHtml, pattern }) {
  const normalizedBlockName = normalizeBlockName(blockName);
  if (!ueHtml || typeof ueHtml !== 'string' || !ueHtml.trim()) {
    const err = new Error('Missing `ueHtml` (Universal Editor HTML).');
    err.statusCode = 400;
    throw err;
  }

  const analysis = analyzeUeHtmlStructure(ueHtml);
  if (!analysis.rootTagName) {
    const err = new Error('UE HTML has no root element.');
    err.statusCode = 400;
    throw err;
  }

  const structureLines = analysis.directChildren.map((c, i) => ` * - ${i}: <${c.tagName}>`);
  const warnData = hasAuthoringDataAttributes(ueHtml)
    ? `\n * Note: UE HTML may include authoring data-* attributes. Do not select by them; use indices only.\n `
    : '';

  const normalizedPattern = normalizePattern(pattern);
  const js = buildJs({ blockName: normalizedBlockName, structureLines, warnData, pattern: normalizedPattern });
  const css = buildCss({ blockName: normalizedBlockName, rowCount: analysis.directChildren.length, pattern: normalizedPattern });

  return {
    blockName: normalizedBlockName,
    pattern: normalizedPattern,
    analysis,
    artifacts: [
      {
        kind: 'block-frontend-js',
        path: `blocks/${normalizedBlockName}/${normalizedBlockName}.js`,
        content: js
      },
      {
        kind: 'block-frontend-css',
        path: `blocks/${normalizedBlockName}/${normalizedBlockName}.css`,
        content: css
      }
    ]
  };
}

function buildJs({ blockName, structureLines, warnData, pattern }) {
  if (pattern === 'hero') return buildHeroJs({ blockName, structureLines, warnData });
  if (pattern === 'carousel') return buildCarouselJs({ blockName, structureLines, warnData });
  if (pattern === 'tabs') return buildTabsJs({ blockName, structureLines, warnData });

  return `export default function decorate(block) {
  /**
   * Structure contract (index-based, derived from UE HTML):
${structureLines.join('\n')}
   *${warnData}
   *
   * Rules:
   * - index-based extraction only (block.children[n])
   * - do not rely on data-* attributes for structure/selection
   */

  const rows = Array.from(block.children);

  block.classList.add('${blockName}--decorated');

  // Assign stable row classes for styling hooks.
  rows.forEach((row, i) => {
    row.classList.add('${blockName}__row', '${blockName}__row--' + i);
  });

  // Optional: label common content patterns without relying on data-*.
  rows.forEach((row) => {
    if (row.querySelector('picture, img')) row.classList.add('${blockName}__media');
    if (row.querySelector('a[href]')) row.classList.add('${blockName}__link-row');
    if (row.querySelector('h1, h2, h3')) row.classList.add('${blockName}__heading-row');
  });
}
`;
}

function buildCss({ blockName, rowCount, pattern }) {
  if (pattern === 'hero') return buildHeroCss({ blockName });
  if (pattern === 'carousel') return buildCarouselCss({ blockName });
  if (pattern === 'tabs') return buildTabsCss({ blockName });

  const rowRules = Array.from({ length: Math.min(rowCount, 10) }, (_, i) => `.${blockName}__row--${i} { }`).join('\n\n');
  return `.${blockName}.${blockName}--decorated {
  display: grid;
  gap: 16px;
}

.${blockName}__row {
  min-width: 0;
}

/* Optional semantic hooks (set by JS based on actual content) */
.${blockName}__media picture,
.${blockName}__media img {
  display: block;
  width: 100%;
  height: auto;
}

/* Row-specific hooks (index-based) */
${rowRules}
`;
}

function buildHeroJs({ blockName, structureLines, warnData }) {
  return `export default function decorate(block) {
  /**
   * Structure contract (index-based, derived from UE HTML):
${structureLines.join('\n')}
   *${warnData}
   *
   * Rules:
   * - index-based extraction only (block.children[n])
   * - do not rely on data-* attributes for structure/selection
   */

  const rows = Array.from(block.children);
  block.classList.add('${blockName}--decorated');

  // Stable row classes
  rows.forEach((row, i) => row.classList.add('${blockName}__row', '${blockName}__row--' + i));

  const mediaRow = rows[0];
  const headingRow = rows.find((r) => r.querySelector('h1, h2, h3')) ?? rows[1];
  const linkRow = rows.find((r) => r.querySelector('a[href]'));

  if (mediaRow) mediaRow.classList.add('${blockName}__media');
  if (headingRow) headingRow.classList.add('${blockName}__heading');
  if (linkRow) linkRow.classList.add('${blockName}__cta');
}
`;
}

function buildHeroCss({ blockName }) {
  return `.${blockName}.${blockName}--decorated {
  display: grid;
  gap: 16px;
}

.${blockName}__media picture,
.${blockName}__media img {
  display: block;
  width: 100%;
  height: auto;
}

.${blockName}__cta a {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
`;
}

function buildCarouselJs({ blockName, structureLines, warnData }) {
  return `export default function decorate(block) {
  /**
   * Structure contract (index-based, derived from UE HTML):
${structureLines.join('\n')}
   *${warnData}
   *
   * Suggested contract for carousel:
   * - 0: optional title row
   * - 1: items container row (each direct child = one item)
   */

  const rows = Array.from(block.children);
  block.classList.add('${blockName}--decorated');

  // Prefer row[1] as items row; fallback to row[0] if authoring omitted title.
  const itemsRow = rows[1] ?? rows[0];
  if (!itemsRow) return;

  itemsRow.classList.add('${blockName}__items');
  const items = Array.from(itemsRow.children);
  items.forEach((item, i) => item.classList.add('${blockName}__item', '${blockName}__item--' + i));
}
`;
}

function buildCarouselCss({ blockName }) {
  return `.${blockName}__items {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(240px, 1fr);
  gap: 16px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  padding-bottom: 8px;
}

.${blockName}__item {
  scroll-snap-align: start;
}

.${blockName}__item picture,
.${blockName}__item img {
  display: block;
  width: 100%;
  height: auto;
}
`;
}

function buildTabsJs({ blockName, structureLines, warnData }) {
  return `export default function decorate(block) {
  /**
   * Structure contract (index-based, derived from UE HTML):
${structureLines.join('\n')}
   *${warnData}
   *
   * Suggested contract for tabs:
   * - 0: container row
   *   - each direct child is a tab item
   *     - item.children[0] = label
   *     - item.children[1] = panel
   */

  const containerRow = block.children[0];
  if (!containerRow) return;

  const items = Array.from(containerRow.children);
  const tablist = document.createElement('div');
  tablist.setAttribute('role', 'tablist');

  const panels = document.createElement('div');
  panels.classList.add('${blockName}__panels');

  items.forEach((item, i) => {
    const labelEl = item.children[0];
    const panelEl = item.children[1];

    const labelText = labelEl?.textContent?.trim() || \`Tab \${i + 1}\`;
    const tabId = \`${blockName}-tab-\${i}\`;
    const panelId = \`${blockName}-panel-\${i}\`;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.id = tabId;
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-controls', panelId);
    btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    btn.textContent = labelText;

    const panel = document.createElement('div');
    panel.id = panelId;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', tabId);
    panel.hidden = i !== 0;
    if (panelEl) panel.append(...Array.from(panelEl.childNodes));

    btn.addEventListener('click', () => {
      const tabs = tablist.querySelectorAll('[role="tab"]');
      tabs.forEach((t, idx) => t.setAttribute('aria-selected', idx === i ? 'true' : 'false'));
      Array.from(panels.children).forEach((p, idx) => (p.hidden = idx !== i));
    });

    tablist.appendChild(btn);
    panels.appendChild(panel);
  });

  block.textContent = '';
  block.classList.add('${blockName}--decorated');
  block.append(tablist, panels);
}
`;
}

function buildTabsCss({ blockName }) {
  return `.${blockName}.${blockName}--decorated [role="tablist"] {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.${blockName}.${blockName}--decorated [role="tab"] {
  cursor: pointer;
}

.${blockName}__panels {
  margin-top: 16px;
}
`;
}

function normalizePattern(pattern) {
  const p = String(pattern ?? '').trim().toLowerCase();
  if (!p) return 'generic';
  if (p === 'hero' || p === 'carousel' || p === 'tabs') return p;
  return 'generic';
}

function normalizeBlockName(name) {
  const s = String(name ?? '').trim();
  if (!s) {
    const err = new Error('`blockName` is required.');
    err.statusCode = 400;
    throw err;
  }
  return s
    .toLowerCase()
    .replaceAll(/[_\s]+/g, '-')
    .replaceAll(/[^a-z0-9-]/g, '')
    .replaceAll(/-+/g, '-')
    .replaceAll(/^-+|-+$/g, '');
}

