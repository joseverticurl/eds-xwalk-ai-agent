---
description: Call any tool via /mcp/call (unified dispatcher)
---

**Skill:** match task to `.cursor/skills/*/SKILL.md` (block / figma / admin / quality)

Use the unified tool dispatcher endpoint for consistent execution of generation/validation/transform/admin tools.

Endpoints:
- `GET http://localhost:8787/mcp/tools` to list supported tools
- `POST http://localhost:8787/mcp/call` to call a tool by name

Payload shape:

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

Return the `result` from the dispatcher, and if it includes artifacts, present them as file-path + content.

