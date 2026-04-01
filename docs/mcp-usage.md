# MCP usage (tools + examples)

This repo’s runtime (`mcp-server/`) exposes an MCP-style dispatcher so Cursor/agents can call **one endpoint** consistently:

- `GET /mcp/tools` — list tools
- `POST /mcp/call` — call a tool by name

## Prereqs

- Node \(>= 18\)
- Install and run the server:

```bash
cd mcp-server
npm install
npm run dev
```

Server defaults to `http://localhost:8787`.

## List tools

```bash
curl http://localhost:8787/mcp/tools
```

## Call a tool

Payload shape:

```json
{
  "tool": "generate.block.frontend",
  "arguments": {
    "blockName": "hero",
    "pattern": "hero",
    "ueHtml": "<div class=\"hero\">...</div>"
  }
}
```

## Core tools (recommended)

**Cursor command shortcuts** (MCP-only path):

- `mcp-call-generate-block-backend.md`
- `mcp-call-validate-ue-html.md`
- `mcp-call-generate-block-frontend.md`

**Tool names** (use in `POST /mcp/call`):

- `generate.block.backend`
  - **Purpose**: Step 1 backend XWalk JSON + model fields
  - **Key args**: `blockName`, `title`, `fields[]`

- `validate.ueHtml`
  - **Purpose**: Step 2 gate; validate UE HTML structure expectations
  - **Key args**: `html`, optional `expectations`

- `generate.block.frontend`
  - **Purpose**: Step 3; generate `<block>.js` + `<block>.css` from UE HTML
  - **Key args**: `blockName`, `ueHtml`, optional `pattern`

- `transform.figma.tokens`
  - **Purpose**: extract Figma design tokens
  - **Key args**: `fileKey`, optional `nodeIds`
  - **Requires**: `FIGMA_TOKEN` in server env

## Admin tools

All Admin API calls are exposed as `admin.*` tools (see `/mcp/tools` output).

Auth:
- Prefer API key: set `AEM_ADMIN_API_KEY` or pass `apiKey` in arguments.
- Cookie auth: pass `authToken` (maps to `auth_token` cookie semantics).

## Gotchas

- **Do not invent UE HTML**: Step 2 requires real UE output.
- **Index-based frontend**: generated JS must use indices for structure, not `data-*`.
- **Optional fields**: empty authoring fields may remove rows → validate and code defensively.
