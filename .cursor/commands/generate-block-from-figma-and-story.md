---
description: Block from Figma URL + component name + optional user story (then UE HTML for FE)
---

**Skills:** `.cursor/skills/eds-xwalk-block-workflow/SKILL.md` · `.cursor/skills/eds-figma-design-tokens/SKILL.md`

Use when the user provides **(1) a Figma URL**, **(2) a block/component name** (kebab-case), and optionally **(3) a user story**.

## Important contract (XWalk / UE)

- **Backend JSON + tokens** can be driven from Figma + story + your field proposal.
- **Frontend JS/CSS** must still follow **real Universal Editor HTML** after authors build the block in UE.  
  Do **not** treat Figma-only HTML as the final UE contract.

**PDF user story:** this repo does not parse PDF inside `mcp-server`. Ask the user to **paste plain text** from the PDF (or attach PDF in chat so you can read it in Cursor).

## Step A — Parse Figma URL (no auth)

Call one of:

- `POST http://localhost:8787/parse/figma-url` with `{ "url": "<FIGMA_URL>" }`
- `POST http://localhost:8787/mcp/call` with `{ "tool": "parse.figma.url", "arguments": { "url": "<FIGMA_URL>" } }`

Capture `fileKey` and optional `nodeIds`.

## Step B — Design context (optional, Cursor)

If **Figma MCP** is enabled, call `get_design_context` for the same `fileKey` / node to inform layout and field suggestions (reference only, not UE HTML).

## Step C — Tokens (optional)

With `FIGMA_TOKEN` on the server:

- `transform.figma.tokens` with `fileKey` and `nodeIds` from Step A  
Map tokens to the target EDS project where possible.

## Step D — Propose authoring `fields[]` (you, in chat)

From: component name, Figma context, user story text — output an **ordered** `fields` array (`component`, `name`, `label`, `valueType`, nested `container` / `multi` as needed).  
Rules: camelCase `name`, no underscores, order = structure contract.

## Step E — Step 1 backend

- `generate.block.backend` or `POST /generate/block/backend` with `blockName`, `title`, `fields`.

Stop and tell the user to **author in Universal Editor** and **paste UE HTML**.

## Step F — Step 2 + 3

- `validate.ueHtml` → `generate.block.frontend` (see `orchestrate-block-xwalk.md`).
