---
description: Audit repo completion using parallel Cursor sub-agents
---

Run a **multi-agent repo audit** before declaring “done” or releasing.

## Instructions

1. Read **`AGENTS.md`** for the recommended sub-agent split.
2. In **one user message**, launch **three** parallel explores (or equivalent sub-agents):
   - **Docs & agent guidance**: empty/placeholder files under `docs/` and `agent/`; alignment with `docs/completion-checklist.md`.
   - **mcp-server runtime**: routes vs `mcp-schema.json` vs `mcp-handler.js`; suggest `npm run test` and `npm run smoke` with server running.
   - **Cursor integration**: `.cursor/rules/`, `.cursor/commands/`, `.cursor/skills/` — coverage for backend, validate, frontend, Figma, admin, MCP.
3. Merge into one report: **pass / gap / suggested fix**.

## Skills (optional spot checks)

- Block workflow: `.cursor/skills/eds-xwalk-block-workflow/SKILL.md`
- Figma: `.cursor/skills/eds-figma-design-tokens/SKILL.md`
- Admin: `.cursor/skills/eds-aem-admin-api/SKILL.md`
