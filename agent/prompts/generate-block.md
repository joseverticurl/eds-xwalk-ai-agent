# Prompt: Generate EDS Block (XWalk workflow)

You are generating an EDS block with XWalk / Universal Editor authoring integration.

## Mandatory process order

1. **Backend first**: produce the block-level JSON for `blocks/<block-name>/_<block-name>.json` and any model entries that will be merged into root authoring files (e.g. `component-models.json`).
2. **Stop** and request **user-provided Universal Editor HTML**.
3. Only after HTML is provided and validated, generate `<block-name>.css` and `<block-name>.js`.

## Hard constraints

- Do **not** generate UE HTML.
- Frontend must be **index-based** only: access by position, not by `data-*` attributes.
- Generate **exactly one** JS and **exactly one** CSS file per block folder, named exactly `<block-name>.js` / `<block-name>.css`.

## Inputs (expected)

- Block name (kebab-case)
- Authoring field requirements (ordered list, with component types)
- Any nested items / child rows behavior
- Any content rules (required/optional fields)

## Output format for Step 1 (backend only)

Return:

- A JSON object representing `blocks/<block-name>/_<block-name>.json`, including:
  - block component definition(s) under `plugins.xwalk.page.template`
  - referenced `model` id(s) (if fields exist)
  - model definitions with ordered `fields`

Then ask the user to paste the Universal Editor generated HTML for Step 2.
