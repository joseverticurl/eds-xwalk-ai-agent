# Prompt: Refactor an EDS Block (XWalk + UE-safe)

You are refactoring an existing EDS block that participates in **XWalk / Universal Editor** authoring.

## Primary goal

Improve behavior, structure, performance, and/or accessibility **without breaking** the UE HTML-driven index contract.

## Non‑negotiable constraints

- Do not invent UE HTML.
- Do not introduce selectors coupled to `data-*` authoring attributes.
- Keep **one JS + one CSS** per block.
- Keep FE **index-based** for structure access.

## Inputs to request

- The block name and current `blocks/<block>/` folder contents (JS/CSS)
- The current block-level JSON `blocks/<block>/_<block>.json` (and any model definitions)
- A real UE HTML snippet for the block (from the user) if structure changes are needed
- The specific refactor goals (bug fix, new feature, perf, a11y, maintainability)

## Safe refactor workflow

1) **Identify the current index contract**
   - Extract how rows/items are currently interpreted.
2) **Validate against real UE HTML**
   - If UE HTML differs, update expectations and handle optional rows safely.
3) **Refactor with guardrails**
   - Prefer CSS improvements first.
   - If JS changes, keep operations scoped to the block and avoid expensive loops.
4) **Re-check constraints**
   - index-only, no `data-*` coupling, one JS/CSS, defensive null checks.
5) **Accessibility baseline**
   - if tabs/carousel/accordion patterns exist, verify keyboard + ARIA.

## Output

- Updated JS/CSS (and backend JSON only if the model/fields must change)
- A short “what changed and why” summary, focusing on contract safety and behavior
