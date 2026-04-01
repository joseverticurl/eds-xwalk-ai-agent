import fs from 'node:fs/promises';
import path from 'node:path';

import { requireJsonBody, validateBody } from '../middleware/validation-middleware.js';
import { generateBlockBackendJson } from '../services/generation/block-backend-generator.js';
import { generateBlockFrontend } from '../services/generation/block-frontend-generator.js';
import { validateUeHtml } from '../routes/validate.js';
import { FigmaService } from '../services/figma/figma-service.js';
import { buildDesignTokens } from '../services/figma/tokens.js';
import { AdminApiClient } from '../services/admin/admin-api-client.js';
import { getAdminApiConfig } from '../config/admin-api-config.js';

/**
 * Minimal MCP-style tool dispatcher over HTTP.
 *
 * Endpoints:
 * - GET  /mcp/tools  -> returns tool list from `mcp-schema.json`
 * - POST /mcp/call   -> { tool: string, arguments: object } -> { ok, result }
 *
 * This is not a full stdio MCP transport, but provides the same "tool name -> handler" behavior.
 */
export function registerMcpHandlers(app) {
  app.get('/mcp/tools', async (req, res, next) => {
    try {
      const schema = await readSchema();
      res.json({ ok: true, tools: schema.tools ?? [] });
    } catch (e) {
      next(e);
    }
  });

  app.post(
    '/mcp/call',
    requireJsonBody(),
    validateBody({
      required: ['tool', 'arguments'],
      properties: { tool: { type: 'string', minLength: 1 }, arguments: { type: 'object' } }
    }),
    async (req, res, next) => {
      try {
        const { tool, arguments: args } = req.body ?? {};
        const result = await dispatchToolCall({ tool, args, req });
        res.json({ ok: true, tool, result });
      } catch (e) {
        next(e);
      }
    }
  );
}

async function readSchema() {
  const schemaPath = path.resolve(process.cwd(), 'src', 'mcp', 'mcp-schema.json');
  const raw = await fs.readFile(schemaPath, 'utf8');
  return JSON.parse(raw);
}

async function dispatchToolCall({ tool, args, req }) {
  switch (tool) {
    case 'generate.block.backend': {
      const { blockName, title, modelId, fields, hasModel } = args ?? {};
      const json = generateBlockBackendJson({ blockName, title, modelId, fields, hasModel });
      return {
        artifact: {
          path: `blocks/${String(blockName ?? '').trim()}/_${String(blockName ?? '').trim()}.json`,
          kind: 'block-backend-json',
          json
        }
      };
    }
    case 'generate.block.frontend': {
      const { blockName, ueHtml, pattern } = args ?? {};
      return generateBlockFrontend({ blockName, ueHtml, pattern });
    }
    case 'validate.ueHtml': {
      const { html, expectations } = args ?? {};
      return validateUeHtml({ html, expectations });
    }
    case 'transform.figma.tokens': {
      const { fileKey, nodeIds } = args ?? {};
      const figma = new FigmaService({ env: process.env });
      const styles = await figma.getFileStyles({ fileKey });
      const styleNodeIds = (styles?.meta?.styles ?? []).map((s) => s?.node_id).filter(Boolean);
      const extraNodeIds = Array.isArray(nodeIds) ? nodeIds : [];
      const ids = Array.from(new Set([...styleNodeIds, ...extraNodeIds]));

      const nodesById = {};
      const chunkSize = 100;
      for (let i = 0; i < ids.length; i += chunkSize) {
        const chunk = ids.slice(i, i + chunkSize);
        const nodes = await figma.getFileNodes({ fileKey, nodeIds: chunk });
        const got = nodes?.nodes ?? {};
        for (const [id, val] of Object.entries(got)) nodesById[id] = val;
      }

      return { fileKey, tokenBundle: buildDesignTokens({ styles, nodesById }) };
    }
    default: {
      if (tool.startsWith('admin.')) return dispatchAdmin({ tool, args, req });
      const err = new Error(`Unknown tool: ${tool}`);
      err.statusCode = 400;
      throw err;
    }
  }
}

function dispatchAdmin({ tool, args }) {
  const baseUrl = getAdminApiConfig(process.env).baseUrl;
  const client = new AdminApiClient({
    baseUrl,
    apiKey: args?.apiKey ?? undefined,
    authToken: args?.authToken ?? undefined
  });

  switch (tool) {
    case 'admin.siteConfig.read':
      return client.readSiteConfig(args);
    case 'admin.siteConfig.create':
      return client.createSiteConfig(args);
    case 'admin.siteConfig.update':
      return client.updateSiteConfig(args);
    case 'admin.siteConfig.delete':
      return client.deleteSiteConfig(args);
    case 'admin.status.get':
      return client.statusGet(args);
    case 'admin.preview.update':
      return client.previewUpdate(args);
    case 'admin.live.publish':
      return client.livePublish(args);
    case 'admin.live.unpublish':
      return client.liveUnpublish(args);
    case 'admin.cache.purge':
      return client.purgeLiveCache(args);
    case 'admin.index.trigger':
      return client.indexTrigger(args);
    case 'admin.sitemap.generate':
      return client.sitemapGenerate(args);
    default: {
      const err = new Error(`Unknown admin tool: ${tool}`);
      err.statusCode = 400;
      throw err;
    }
  }
}
