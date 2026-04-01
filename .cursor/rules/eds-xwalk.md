---
description: EDS XWalk generation rules (backend→UE HTML→frontend)
---

You are working in the `eds-xwalk-ai-agent` repo.

## Non‑negotiable workflow (XWalk / Universal Editor)

- **Step 1 — Backend first**: generate XWalk block-level JSON for `blocks/<block-name>/_<block-name>.json` (and any model definitions).
- **Step 2 — User provides UE HTML**: do **not** invent HTML; treat user-provided UE HTML as the structure contract.
- **Step 3 — Frontend**: only after Step 2 validation, generate `<block-name>.js` and `<block-name>.css`.

## Hard constraints

- **Index-based only**: extract DOM content by index (`block.children[n]`, `row.children[n]`). Never rely on `data-*` attributes for structure/selection.
- **One JS + one CSS per block**: names must match folder name exactly.
- **Field order drives structure**: authoring field order maps to UE HTML order; optional/empty fields may cause missing rows/cells → validate against real UE HTML.

## Runtime endpoints in this repo

- `POST /generate/block/backend` → Step‑1 backend JSON generator
- `POST /validate/ue-html` → Step‑2 UE HTML validator gate
- `POST /generate/block/frontend` → Step‑3 FE generator (JS+CSS from UE HTML). Supports `pattern: hero|carousel|tabs`.
- `POST /transform/figma/tokens` → extract design tokens from Figma (requires `FIGMA_TOKEN`)
- `POST /admin/*` → AEM Admin API operations (site config CRUD, preview/publish/unpublish/cache/index/sitemap/status)

## Tool dispatch (MCP-style)

- `GET /mcp/tools` → list available tools
- `POST /mcp/call` → call a tool by name with `{ tool, arguments }`

## Cursor integration in this repo

- **Project skills** (for discovery): `.cursor/skills/*/SKILL.md` — read the skill whose `description` matches the user task.
- **Commands**: `.cursor/commands/` — use **`orchestrate-block-xwalk.md`** for the full 3-step block flow.
- **Sub-agents**: see root **`AGENTS.md`** and **`audit-repo-with-subagents.md`** for parallel audits.

