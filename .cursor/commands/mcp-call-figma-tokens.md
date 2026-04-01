---
description: Extract Figma tokens via MCP dispatcher (tool: transform.figma.tokens)
---

Use the unified dispatcher endpoint to extract design tokens from Figma.

Requirements:
- `FIGMA_TOKEN` must be set in the environment that runs `mcp-server`.

Call:
- `POST http://localhost:8787/mcp/call`

Payload:

```json
{
  "tool": "transform.figma.tokens",
  "arguments": {
    "fileKey": "<FIGMA_FILE_KEY>"
  }
}
```

Return:
- `tokenBundle.tokens`
- `tokenBundle.cssVars`

