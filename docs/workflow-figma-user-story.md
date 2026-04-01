# Workflow: Figma URL + component name + user story

## What you can expect from this repo today

| Input | What the system does |
| --- | --- |
| **Figma URL** | **`POST /parse/figma-url`** or tool **`parse.figma.url`** → `fileKey`, optional `nodeIds` (no network). With **`FIGMA_TOKEN`**, **`transform.figma.tokens`** returns design tokens. |
| **Component / block name** | You choose **`blockName`** (kebab-case); it drives filenames and JSON id. |
| **User story** | Best: **paste text** in Cursor. **PDF** is not parsed by `mcp-server`; extract text in your PDF tool or paste into chat. |
| **Backend (Step 1)** | **`generate.block.backend`** once **`fields[]`** are defined (agent proposes them from Figma + story). |
| **Frontend (Step 3)** | Still requires **real Universal Editor HTML** after authoring in AEM. Figma and story **do not** replace UE output. |

## Why UE HTML is still required

Universal Editor emits the **actual DOM order** for your model. Figma and PDFs inform **intent** and **field design**; they are not a guaranteed match to UE’s HTML. The agent policy is: **no invented UE HTML** for production FE.

## Cursor entry point

Use **`.cursor/commands/generate-block-from-figma-and-story.md`** for the full guided sequence.
