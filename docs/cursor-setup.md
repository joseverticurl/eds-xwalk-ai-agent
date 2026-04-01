# Cursor setup

This repo is designed to be used from Cursor with:
- project rules (`.cursor/rules/`)
- repeatable commands (`.cursor/commands/`)
- optional runtime tool calls via the MCP dispatcher (`/mcp/call`)

## Quick start

1) **Install dependencies**

```bash
cd mcp-server
npm install
```

2) **Start the runtime**

```bash
cd mcp-server
npm run dev
```

3) **Use Cursor commands**

See `.cursor/commands/` for:
- Step 1: backend JSON generation
- Step 2: UE HTML validation
- Step 3: frontend generation
- Figma token extraction
- MCP call (unified dispatcher)

## Recommended workflow inside Cursor

- Follow the enforced 3-step flow:
  - backend → user UE HTML → frontend
- Prefer calling tools via `POST /mcp/call` for a single consistent interface.

## Environment variables

Copy `.env.example` and fill only what you need:
- `FIGMA_TOKEN` for token extraction
- `AEM_ADMIN_API_*` for admin operations

## Using sub-agents (recommended)

When auditing or extending the repo:
- Use a “docs” sub-agent to check for missing/placeholder docs
- Use a “runtime” sub-agent to verify tool/schema alignment and endpoints
- Use a “cursor-config” sub-agent to ensure rules/commands cover all workflows

This avoids missing things across folders and keeps the checks parallel.
