/**
 * Parse common Figma share URLs into API inputs (fileKey, optional node id(s)).
 *
 * Supports:
 * - https://www.figma.com/design/{fileKey}/... ?node-id=1-2  → node "1:2"
 * - https://www.figma.com/design/{fileKey}/branch/{branchKey}/... → fileKey = branchKey (team branch file)
 * - https://www.figma.com/make/{fileKey}/...
 * - https://www.figma.com/board/{fileKey}/... (FigJam — fileKey only)
 */

export function parseFigmaUrl(input) {
  const raw = String(input ?? '').trim();
  if (!raw) {
    const err = new Error('`url` is required.');
    err.statusCode = 400;
    throw err;
  }

  let url;
  try {
    url = new URL(raw.includes('://') ? raw : `https://${raw}`);
  } catch {
    const err = new Error('Invalid Figma URL.');
    err.statusCode = 400;
    throw err;
  }

  const host = url.hostname.toLowerCase();
  if (!host.endsWith('figma.com')) {
    const err = new Error('URL must be a figma.com link.');
    err.statusCode = 400;
    throw err;
  }

  const path = url.pathname.replace(/\/+$/, '');
  const segments = path.split('/').filter(Boolean);

  let fileKey = null;
  let kind = 'unknown';
  const nodeIds = [];

  if (segments[0] === 'design') {
    kind = 'design';
    const branchIdx = segments.indexOf('branch');
    if (branchIdx !== -1 && segments[branchIdx + 1]) {
      fileKey = segments[branchIdx + 1];
    } else if (segments[1]) {
      fileKey = segments[1];
    }
  } else if (segments[0] === 'make') {
    kind = 'make';
    if (segments[1]) fileKey = segments[1];
  } else if (segments[0] === 'board') {
    kind = 'board';
    if (segments[1]) fileKey = segments[1];
  }

  if (!fileKey) {
    const err = new Error('Could not extract fileKey from Figma URL.');
    err.statusCode = 400;
    throw err;
  }

  const nodeParam = url.searchParams.get('node-id') ?? url.searchParams.get('node_id');
  if (nodeParam) {
    const normalized = decodeURIComponent(nodeParam).trim().replaceAll('-', ':');
    if (normalized) nodeIds.push(normalized);
  }

  return {
    kind,
    fileKey,
    nodeIds: nodeIds.length ? nodeIds : undefined,
    normalizedUrl: url.toString()
  };
}
