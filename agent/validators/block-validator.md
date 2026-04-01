# Block Validator (EDS + XWalk)

This validator enforces the critical rules from `implementation-guide.md`.

## Backend (Step 1) checks

- Block-level JSON exists at `blocks/<block-name>/_<block-name>.json`
- If the block has authoring fields, `plugins.xwalk.page.template.model` is present and matches a model `id`
- Field order is explicitly defined (array order is meaningful)
- Field names are camelCase (avoid underscores)

## Universal Editor HTML (Step 2) checks

- UE HTML is provided (agent must not invent HTML)
- Structure contract is documented (index → meaning)
- HTML contains enough children/rows/cells to satisfy the contract

## Frontend (Step 3) checks

- Exactly one JS file and one CSS file per block folder:
  - `<block-name>.js`
  - `<block-name>.css`
- JS uses index-based access only:
  - ✅ `block.children[0]`, `row.children[1]`
  - ❌ selectors coupled to structure like `[data-foo]` or `data-aue-*`
- JS documents the index contract (JSDoc at `decorate()` top)
- No reliance on `data-*` for structure/selection (they may exist in UE HTML, but must not be used as selectors)
