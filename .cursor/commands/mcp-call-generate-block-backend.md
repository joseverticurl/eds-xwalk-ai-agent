---
description: Generate block backend JSON via MCP only (tool: generate.block.backend)
---

**Skill:** `.cursor/skills/eds-xwalk-block-workflow/SKILL.md` (Step 1)

Generate **Step 1** only using the unified dispatcher (no direct REST).

## Prerequisites

- Runtime running: `.cursor/commands/run-mcp-server.md`

## Call

- `POST http://localhost:8787/mcp/call`

## Payload

```json
{
  "tool": "generate.block.backend",
  "arguments": {
    "blockName": "hero",
    "title": "Hero",
    "fields": [
      { "component": "text", "name": "title", "label": "Title", "valueType": "string" }
    ]
  }
}
```

Optional arguments (see `mcp-server/src/mcp/mcp-schema.json`): `modelId`, `hasModel`.

Return the JSON artifact from `result`. Do **not** generate UE HTML or frontend.
