---
name: eds-figma-design-tokens
description: >-
  Extracts design tokens from Figma for EDS via this repo's runtime. Use when the user mentions Figma, design tokens, styles, fileKey, or mapping CSS variables to an EDS site.
---

# Figma design tokens (Cursor skill)

## Requirements

- `FIGMA_TOKEN` in the environment of the process running `mcp-server`.

## Calls

- REST: `POST http://localhost:8787/transform/figma/tokens` with `{ "fileKey": "...", "nodeIds": [...] }` (optional `nodeIds`).
- MCP: `POST /mcp/call` with tool `transform.figma.tokens` and the same arguments.

## Mapping

- Prefer the **target EDS repo's** existing token/CSS variable names; avoid token sprawl.
- For playbook detail see `agent/skills/figma-token-extractor.md`.

## Cursor command

`.cursor/commands/extract-figma-tokens.md` or `.cursor/commands/mcp-call-figma-tokens.md`.
