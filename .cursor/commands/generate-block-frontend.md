---
description: Generate EDS block frontend (Step 3: JS + CSS)
---

**Skills:** `.cursor/skills/eds-xwalk-block-workflow/SKILL.md` (Step 3) · `.cursor/skills/eds-block-quality/SKILL.md` (review)

Generate **Step 3** frontend artifacts for an EDS XWalk block from **user-provided Universal Editor HTML**.

Requirements:
- UE HTML must be provided (do not invent it).
- Must follow index-based structure; do not rely on `data-*` for structure/selection.
- Generate exactly one JS and one CSS file (names match block folder).

Ask for:
- `blockName` (kebab-case)
- `pattern` (optional): `hero` | `carousel` | `tabs` (default: generic)
- UE HTML snippet (from Universal Editor)

Then call the runtime endpoint:
- `POST http://localhost:8787/generate/block/frontend`

Input:

```json
{
  "blockName": "hero",
  "pattern": "hero",
  "ueHtml": "<div class=\"hero\">...</div>"
}
```

Return:
- `blocks/<block>/<block>.js` content
- `blocks/<block>/<block>.css` content

