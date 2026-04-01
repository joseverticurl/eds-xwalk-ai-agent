---
name: eds-aem-admin-api
description: >-
  Operates AEM Edge Delivery / EDS projects via the Admin API through this repo's mcp-server proxy. Use when the user mentions site config, publish, unpublish, preview, cache purge, index, sitemap, org/site, or admin.hlx.
---

# AEM Admin API (Cursor skill)

## Configuration

- `AEM_ADMIN_API_BASE_URL` (optional; defaults per `mcp-server` config).
- Auth: `apiKey` or `authToken` in JSON body, or headers `x-admin-api-key` / `x-admin-auth-token`.

## Endpoints

All under `POST http://localhost:8787/admin/...` (see `mcp-server/README.md`).

MCP: `admin.*` tools via `POST /mcp/call`.

## Cursor commands

- `.cursor/commands/admin-site-config.md`
- `.cursor/commands/admin-operations.md`

## Safety

- Prefer **read/status** before destructive operations.
- Never log secrets.
