export function buildDesignTokens({ styles, nodesById }) {
  // Output shape is intentionally generic so it can be mapped into EDS projects.
  // - tokens: normalized token list
  // - cssVars: CSS variable representation (optional convenience)
  const tokens = [];

  // Styles list comes from GET /files/:key/styles
  // Each item has: key, name, style_type, node_id
  const styleItems = styles?.meta?.styles ?? [];

  for (const s of styleItems) {
    const styleType = s.style_type; // FILL / TEXT / EFFECT / GRID
    const name = s.name;
    const key = s.key;
    const nodeId = s.node_id;

    const node = nodesById?.[nodeId]?.document;
    const tokenBase = {
      source: 'figma',
      figma: { key, nodeId, styleType, name }
    };

    if (styleType === 'FILL') {
      const fills = node?.fills;
      const solid = Array.isArray(fills) ? fills.find((f) => f?.type === 'SOLID') : null;
      const rgba = solid?.color ? figmaColorToRgba(solid.color, solid.opacity) : null;
      const hex = rgba ? rgbaToHex(rgba) : null;
      tokens.push({
        ...tokenBase,
        kind: 'color',
        value: { rgba, hex }
      });
      continue;
    }

    if (styleType === 'TEXT') {
      const style = node?.style ?? {};
      tokens.push({
        ...tokenBase,
        kind: 'typography',
        value: pick(style, ['fontFamily', 'fontPostScriptName', 'fontWeight', 'fontSize', 'lineHeightPx', 'letterSpacing', 'textCase', 'textDecoration'])
      });
      continue;
    }

    if (styleType === 'EFFECT') {
      tokens.push({
        ...tokenBase,
        kind: 'effect',
        value: { effects: node?.effects ?? [] }
      });
      continue;
    }

    tokens.push({ ...tokenBase, kind: 'unknown', value: {} });
  }

  const cssVars = tokensToCssVars(tokens);
  return { tokens, cssVars };
}

export function tokensToCssVars(tokens) {
  const lines = [':root {'];

  for (const t of tokens) {
    const varName = toCssVarName(t?.figma?.name ?? 'token');
    if (t.kind === 'color' && t.value?.hex) {
      lines.push(`  ${varName}: ${t.value.hex};`);
    } else if (t.kind === 'typography' && t.value?.fontSize) {
      lines.push(`  ${varName}--font-size: ${t.value.fontSize}px;`);
      if (t.value?.lineHeightPx) lines.push(`  ${varName}--line-height: ${t.value.lineHeightPx}px;`);
      if (t.value?.fontWeight) lines.push(`  ${varName}--font-weight: ${t.value.fontWeight};`);
      if (t.value?.fontFamily) lines.push(`  ${varName}--font-family: ${quoteFontFamily(t.value.fontFamily)};`);
    }
  }

  lines.push('}');
  return lines.join('\n');
}

export function toCssVarName(name) {
  const cleaned = String(name)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
  return `--figma-${cleaned || 'token'}`;
}

function figmaColorToRgba(color, opacity) {
  const o = typeof opacity === 'number' ? opacity : 1;
  const r = Math.round((color.r ?? 0) * 255);
  const g = Math.round((color.g ?? 0) * 255);
  const b = Math.round((color.b ?? 0) * 255);
  return { r, g, b, a: o };
}

function rgbaToHex({ r, g, b }) {
  const to2 = (n) => n.toString(16).padStart(2, '0');
  return `#${to2(clamp255(r))}${to2(clamp255(g))}${to2(clamp255(b))}`;
}

function clamp255(n) {
  const x = Number(n);
  if (!Number.isFinite(x)) return 0;
  return Math.max(0, Math.min(255, Math.round(x)));
}

function pick(obj, keys) {
  const out = {};
  for (const k of keys) {
    if (obj?.[k] !== undefined) out[k] = obj[k];
  }
  return out;
}

function quoteFontFamily(f) {
  const s = String(f);
  return /[\s,]/.test(s) ? `"${s}"` : s;
}

