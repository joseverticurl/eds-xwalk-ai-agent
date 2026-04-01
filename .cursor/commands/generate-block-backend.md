---
description: Generate EDS XWalk backend JSON (Step 1)
---

Generate **only Step 1** for an EDS XWalk block: the backend JSON payload for `blocks/<block-name>/_<block-name>.json`.

Ask for:
- block name (kebab-case)
- ordered field list (component/name/label/valueType + optional settings)

Then call the local runtime endpoint:
- `POST http://localhost:8787/generate/block/backend`

Do not generate UE HTML or frontend code.

