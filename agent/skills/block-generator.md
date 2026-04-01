# Skill: Block Generator (EDS XWalk)

Purpose: generate EDS blocks that support **XWalk / Universal Editor authoring** while strictly following the required lifecycle:

1) Backend JSON first  
2) User provides UE HTML  
3) Frontend JS/CSS based on real UE HTML

## Inputs to collect

- **Block name** (kebab-case)
- **Block title** (human readable)
- If design is from Figma: extract **design tokens** as needed (see `agent/skills/figma-token-extractor.md`)
- **Authoring fields** (ordered list):
  - `component` (text, richtext, reference, select, boolean, container, tab, …)
  - `name` (camelCase; no underscores)
  - `label`
  - optional: `valueType`, `value`, `multi`, `required`, `validation`, `condition`, `options`
- **Nested items**:
  - if a list: use `container` with `multi: true` and nested `fields`

## Step 1 — Generate backend JSON (XWalk)

Goal: produce the payload for:
- `blocks/<block-name>/_<block-name>.json`

Rules:
- If the block has fields, set `template.model` and ensure it matches the model `id`.
- Field order is meaningful and becomes the index contract.

Runtime support (this repo):
- Call `POST /generate/block/backend` with `{ blockName, title, fields }`.

Output:
- JSON payload + suggested target path.

## Step 2 — Require UE HTML (do not generate it)

Ask the user to paste the **Universal Editor generated HTML** for the block.

Then validate it:
- Call `POST /validate/ue-html` with `{ html, expectations }`.
- Expectations should reflect the minimum rows/cells needed for the index contract.

If validation fails:
- Explain which indices/rows are missing.
- Request updated UE HTML.

## Step 3 — Frontend (later step)

Only after UE HTML is validated:
- Generate exactly `blocks/<block-name>/<block-name>.js`
- Generate exactly `blocks/<block-name>/<block-name>.css`

Hard constraints:
- Index-based extraction only (`block.children[n]`, `row.children[n]`)
- Do not rely on `data-*` attributes for structure/selection
- One JS + one CSS per block folder
