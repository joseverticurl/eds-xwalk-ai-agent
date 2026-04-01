# Cursor setup

This repo is designed to be used from Cursor with:
- project rules (`.cursor/rules/`)
- **project skills** (`.cursor/skills/*/SKILL.md`) — YAML `description` drives when the agent should apply them
- repeatable commands (`.cursor/commands/`)
- optional runtime tool calls via the MCP dispatcher (`/mcp/call`)
- agent orchestration notes (**`AGENTS.md`**) — sub-agent patterns for wide audits

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
- **Full block flow**: `orchestrate-block-xwalk.md`
- Step 1: backend JSON generation (REST: `generate-block-backend.md` · MCP: `mcp-call-generate-block-backend.md`)
- Step 2: UE HTML validation (REST: `validate-ue-html.md` · MCP: `mcp-call-validate-ue-html.md`)
- Step 3: frontend generation (REST: `generate-block-frontend.md` · MCP: `mcp-call-generate-block-frontend.md`)
- Figma token extraction
- MCP call (unified dispatcher)
- Repo audit with sub-agents: `audit-repo-with-subagents.md`

## Recommended workflow inside Cursor

- Follow the enforced 3-step flow:
  - backend → user UE HTML → frontend
- Prefer calling tools via `POST /mcp/call` for a single consistent interface.

## Environment variables

Copy `.env.example` and fill only what you need:
- `FIGMA_TOKEN` for token extraction
- `AEM_ADMIN_API_*` for admin operations

## Using sub-agents (recommended)

See **`AGENTS.md`** at the repo root and the command **`audit-repo-with-subagents.md`**.

When auditing or extending the repo:
- Use a “docs” sub-agent to check for missing/placeholder docs
- Use a “runtime” sub-agent to verify tool/schema alignment and endpoints
- Use a “cursor-config” sub-agent to ensure rules/commands/**skills** cover all workflows

This avoids missing things across folders and keeps the checks parallel.
