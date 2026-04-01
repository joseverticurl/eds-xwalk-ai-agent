---
description: Generate block frontend JS+CSS via MCP only (tool: generate.block.frontend)
---

**Skills:** `.cursor/skills/eds-xwalk-block-workflow/SKILL.md` (Step 3) · `.cursor/skills/eds-block-quality/SKILL.md`

Generate **Step 3** only using the unified dispatcher (no direct REST).

## Prerequisites

- Step 2 passed: real UE HTML from the user was validated (`validate.ueHtml`).
- Runtime running: `.cursor/commands/run-mcp-server.md`

## Call

- `POST http://localhost:8787/mcp/call`

## Payload

```json
{
  "tool": "generate.block.frontend",
  "arguments": {
    "blockName": "hero",
    "pattern": "hero",
    "ueHtml": "<div class=\"hero\">...</div>"
  }
}
```

`pattern` is optional: `hero` | `carousel` | `tabs` (default generic).

Return `result` artifacts (`blocks/<block>/<block>.js` and `.css` contents).
