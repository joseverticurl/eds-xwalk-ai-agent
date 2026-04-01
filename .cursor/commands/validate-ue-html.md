---
description: Validate Universal Editor HTML (Step 2 gate)
---

**Skill:** `.cursor/skills/eds-xwalk-block-workflow/SKILL.md` (Step 2)

Validate user-provided Universal Editor HTML against an index-based structure contract.

Call:
- `POST http://localhost:8787/validate/ue-html`

If validation fails, explain the missing indices/rows/cells and ask the user for updated UE HTML.

