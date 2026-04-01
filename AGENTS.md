# Agent orchestration (Cursor)

This repo uses **rules**, **project skills**, **commands**, and **sub-agents** together.

## Project skills (auto-discovery)

Canonical Cursor skills live under `.cursor/skills/*/SKILL.md`. Each file has YAML `name` and `description`.  
**Apply the skill whose description matches the user’s task** (block workflow, Figma tokens, Admin API, quality review).

Extended playbooks and examples: `agent/skills/*.md`, `agent/examples/`, `agent/rules/`.

## Commands

Repeatable workflows: `.cursor/commands/*.md`.  
Run the **orchestration** command for full block flow: `.cursor/commands/orchestrate-block-xwalk.md`.

## Sub-agents (parallel exploration)

For **wide audits** (docs, runtime, Cursor config), use **multiple explores in one turn** — e.g. three Task subagents with prompts like:

1. **Docs agent**: List placeholder or empty `docs/**/*.md` and `agent/**/*.md`; report gaps vs `docs/completion-checklist.md`.
2. **Runtime agent**: Verify `mcp-server` routes, `mcp-schema.json`, and `mcp-handler.js` tool names stay aligned; suggest `npm run test` and `npm run smoke`.
3. **Cursor agent**: Verify `.cursor/rules/`, `.cursor/commands/`, and `.cursor/skills/` cover backend, validate, frontend, Figma, admin, and MCP dispatch.

Merge results into one summary with pass/fail and follow-ups.

## Rules

- `.cursor/rules/eds-xwalk.md` — non‑negotiable XWalk workflow and constraints.
- `.cursor/rules/cursor-orchestration.mdc` — how to combine skills, commands, and sub-agents in this repo.
