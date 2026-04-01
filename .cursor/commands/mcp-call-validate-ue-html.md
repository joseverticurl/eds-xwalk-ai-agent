---
description: Validate UE HTML via MCP dispatcher (tool: validate.ueHtml)
---

Use the unified dispatcher endpoint to validate Universal Editor HTML.

Call:
- `POST http://localhost:8787/mcp/call`

Payload:

```json
{
  "tool": "validate.ueHtml",
  "arguments": {
    "html": "<div class=\"hero\">...</div>",
    "expectations": {
      "minDirectChildren": 2
    }
  }
}
```

Return the validation result. If `ok` is false, list errors and request updated UE HTML.

