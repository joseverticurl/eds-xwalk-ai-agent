# EDS XWALK AI Agent MCP Server

This server is the runtime layer that can call the **AEM Admin API** to manage EDS project configuration and operations.

Admin API docs: [AEM Admin API](https://www.aem.live/docs/admin.html)

## Quick start

- Install deps:

```bash
cd mcp-server
npm install
```

- Run:

```bash
npm run dev
```

Server listens on `PORT` (default `8787`).

## Auth

The Admin API supports:

- **API key auth (recommended)**: `authorization: token <API_KEY>`
- **Cookie auth**: `cookie: auth_token=<value>`

This server accepts either per-request:

- JSON body fields: `apiKey` or `authToken`
- or headers: `x-admin-api-key` or `x-admin-auth-token`

## Endpoints (initial set)

- **Site config**
  - `POST /admin/site-config/read`
  - `POST /admin/site-config/create`
  - `POST /admin/site-config/update`
  - `POST /admin/site-config/delete`
- **Operations**
  - `POST /admin/status/get`
  - `POST /admin/preview/update`
  - `POST /admin/live/publish`
  - `POST /admin/live/unpublish`
  - `POST /admin/cache/purge`
  - `POST /admin/index/trigger`
  - `POST /admin/sitemap/generate`
- **Transform**
  - `POST /transform/figma/tokens` (extract design tokens from Figma styles)

## Example: update site config

```bash
curl -X POST http://localhost:8787/admin/site-config/update ^
  -H "content-type: application/json" ^
  -d "{\"org\":\"myorg\",\"site\":\"mysite\",\"apiKey\":\"<API_KEY>\",\"config\":{\"version\":1,\"created\":\"2020-01-01T00:00:00Z\",\"lastModified\":\"2020-01-01T00:00:00Z\",\"content\":{},\"code\":{}}}"
```

## Example: extract Figma design tokens

Set `FIGMA_TOKEN` in your environment, then call:

```bash
curl -X POST http://localhost:8787/transform/figma/tokens ^
  -H "content-type: application/json" ^
  -d "{\"fileKey\":\"<FIGMA_FILE_KEY>\"}"
```

