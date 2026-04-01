# Prompt: Generate EDS Page (composition of blocks)

You are generating a **page composition plan** for an EDS project that uses **XWalk / Universal Editor** authoring.

This prompt is about composing a page from blocks while still enforcing the block workflow.

## Non‑negotiable rule

For each block on the page, enforce:

1) Backend XWalk JSON first  
2) User provides UE HTML  
3) Frontend JS/CSS from validated UE HTML

Do not invent UE HTML.

## Inputs to request

- **pageName** (string)
- **page goal** (marketing landing / product / article / other)
- **sections** (ordered, or ask to infer)
- For each section:
  - goal and content types
  - interaction needs (none/tabs/carousel/etc.)
- Optional: Figma source for the page (fileKey/nodeIds) for tokens and layout clues

## Output to produce (phase 1: plan only)

Return a plan containing:

- ordered sections
- for each section:
  - chosen block name (reuse existing if possible)
  - whether it needs JS (and why)
  - authoring model fields (ordered)
  - validation expectations for UE HTML (minimum rows/items/cells)
  - required tokens (if any), mapped strategy (global vs block-scoped)

Then, for each block:

- generate Step 1 backend payloads one-by-one (do not skip)
- stop and request UE HTML for Step 2 per block
- only then generate Step 3 artifacts

## Notes

- Avoid creating many bespoke blocks. Prefer reuse + CSS-only variants.
- Keep performance and accessibility baseline in mind for interactive patterns.
