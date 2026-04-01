---
description: End-to-end EDS block — backend, UE HTML validation, frontend (XWalk)
---

Orchestrate the **full** EDS XWalk block pipeline.

## Before you start

1. Read the project skill: **`.cursor/skills/eds-xwalk-block-workflow/SKILL.md`**
2. Ensure the runtime is up: **`.cursor/commands/run-mcp-server.md`**

## Steps (strict order)

### Step 1 — Backend

- Collect `blockName`, `title`, ordered `fields[]`.
- Prefer **MCP-only**: `.cursor/commands/mcp-call-generate-block-backend.md`  
- Or REST: `POST http://localhost:8787/generate/block/backend`
- Output JSON only. **Stop** — do not write UE HTML or FE.

### Step 2 — UE HTML

- Ask the user for **real** Universal Editor HTML.
- Call `POST http://localhost:8787/validate/ue-html` **or** tool `validate.ueHtml` via `/mcp/call`.
- If validation fails, explain gaps and ask for updated HTML.

### Step 3 — Frontend

- Ask for `pattern` if needed: `hero` | `carousel` | `tabs` | generic.
- Prefer **MCP-only**: `.cursor/commands/mcp-call-generate-block-frontend.md`  
- Or REST: `POST http://localhost:8787/generate/block/frontend`
- For quality bar, read **`.cursor/skills/eds-block-quality/SKILL.md`** and spot-check output.

## Reference

- Rules: `.cursor/rules/eds-xwalk.md`
- Sub-agent pattern for audits: `AGENTS.md`
