/**
 * Minimal HTML structure analyzer for Universal Editor snippets.
 *
 * We intentionally avoid a full DOM dependency. This is sufficient to:
 * - detect a root tag
 * - list direct child element tag names of the root (index contract)
 * - list direct child tag names for each direct child (helpful for expectations)
 */
export function analyzeUeHtmlStructure(html) {
  const normalized = String(html ?? '');
  const tags = tokenizeTags(normalized);
  const rootOpen = tags.find((t) => t.type === 'open' && t.depth === 0) ?? null;
  if (!rootOpen) return { rootTagName: '', directChildren: [] };

  const directChildren = collectDirectChildren(tags, rootOpen);
  return { rootTagName: rootOpen.tagName, directChildren };
}

export function hasAuthoringDataAttributes(html) {
  return /\bdata-aue-|\bdata-gen-/i.test(String(html ?? ''));
}

function collectDirectChildren(tags, rootOpen) {
  const out = [];
  for (let i = rootOpen.i + 1; i < tags.length; i++) {
    const t = tags[i];
    if (isRootClose(t, rootOpen)) break;
    if (t.type === 'open' && t.depth === 1) out.push(buildChild(tags, i));
  }
  return out;
}

function isRootClose(tag, rootOpen) {
  return tag.type === 'close' && tag.tagName === rootOpen.tagName && tag.depth === 0;
}

function buildChild(tags, openIdx) {
  const t = tags[openIdx];
  const child = { tagName: t.tagName, directChildTagNames: [] };
  for (let j = openIdx + 1; j < tags.length; j++) {
    const u = tags[j];
    if (u.type === 'close' && u.tagName === t.tagName && u.depth === 1) break;
    if (u.type === 'open' && u.depth === 2) child.directChildTagNames.push(u.tagName);
  }
  return child;
}

function tokenizeTags(html) {
  return tokenizeTagsInternal(html);
}

function tokenizeTagsInternal(html) {
  const tags = [];
  const voidTags = getVoidTags();

  let depth = 0;
  let idx = 0;
  while (idx < html.length) {
    const slice = nextTagSlice(html, idx);
    if (!slice) break;
    idx = slice.nextIdx;

    const raw = slice.raw;
    if (shouldIgnoreRawTag(raw)) continue;

    const parsed = parseRawTag(raw, voidTags);
    if (!parsed) continue;

    if (parsed.type === 'close') {
      depth = Math.max(0, depth - 1);
      tags.push({ type: 'close', tagName: parsed.tagName, depth, i: tags.length });
      continue;
    }

    tags.push({ type: 'open', tagName: parsed.tagName, depth, i: tags.length, selfClosing: parsed.selfClosing });
    if (!parsed.selfClosing) depth += 1;
  }

  return tags;
}

function nextTagSlice(html, startIdx) {
  const lt = html.indexOf('<', startIdx);
  if (lt === -1) return null;
  const gt = html.indexOf('>', lt + 1);
  if (gt === -1) return null;
  return { raw: html.slice(lt + 1, gt).trim(), nextIdx: gt + 1 };
}

function shouldIgnoreRawTag(raw) {
  if (!raw) return true;
  if (raw.startsWith('!') || raw.startsWith('?')) return true;
  if (raw.startsWith('--')) return true;
  return false;
}

function parseRawTag(raw, voidTags) {
  const isClose = raw.startsWith('/');
  const body = isClose ? raw.slice(1).trim() : raw;
  const tagName = body.split(/\s+/)[0]?.toLowerCase();
  if (!tagName) return null;

  const selfClosing = /\/\s*$/.test(body) || voidTags.has(tagName);
  return { type: isClose ? 'close' : 'open', tagName, selfClosing };
}

function getVoidTags() {
  return new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);
}

