---
description: Extract design tokens from Figma styles
---

Extract design tokens (colors/typography/effects) from a Figma file using the runtime endpoint.

Requirements:
- `FIGMA_TOKEN` must be set in the environment that runs `mcp-server`.

Call:
- `POST http://localhost:8787/transform/figma/tokens` with `{ "fileKey": "<fileKey>" }`

Return:
- `tokenBundle.tokens` and `tokenBundle.cssVars`

