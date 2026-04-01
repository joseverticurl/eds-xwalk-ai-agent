---
name: eds-xwalk-block-workflow
description: >-
  Runs the mandatory EDS XWalk / Universal Editor block lifecycle (backend JSON first, user UE HTML, then index-based JS/CSS). Use when generating or refactoring EDS blocks, Franklin blocks, XWalk authoring, Universal Editor HTML, block-level JSON, component-models, or mcp-server generate/validate endpoints.
---

# EDS XWalk block workflow (Cursor skill)

## When this applies

Use for any **block** task: new block, refactor, or validating structure before FE.

## Non‑negotiable order

1. **Step 1 — Backend** — XWalk block JSON + ordered model fields (`blocks/<block>/_<block>.json` payload).  
   Do **not** emit UE HTML or FE yet.
2. **Step 2 — UE HTML** — User must provide **real** Universal Editor semantic HTML. Validate it (`POST /validate/ue-html` or tool `validate.ueHtml` via `POST /mcp/call`).
3. **Step 3 — Frontend** — Only after Step 2 passes: one `<block>.js` + one `<block>.css`, **index-based only** (`block.children[n]`, `row.children[n]`). No `data-*` for structure/selection.

## Runtime (local)

- Start server: `cd mcp-server && npm run dev` (default `http://localhost:8787`).
- Prefer unified dispatch: `POST /mcp/call` with `{ "tool": "...", "arguments": { ... } }`.
- Tools: `generate.block.backend`, `validate.ueHtml`, `generate.block.frontend`.

## Cursor commands

Use `.cursor/commands/generate-block-backend.md`, `validate-ue-html.md`, `generate-block-frontend.md`, or `orchestrate-block-xwalk.md` for the full sequence.

## Extended narrative

For checklists and examples, read `agent/skills/block-generator.md` and `agent/examples/*`.
