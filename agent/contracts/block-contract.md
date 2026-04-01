# Block Contract (EDS + XWalk)

This contract defines the minimum required inputs/outputs for the “Generate Block” workflow.

## Inputs

### Step 1 (Backend / XWalk JSON)

- **blockName**: string (kebab-case)
- **title**: string (human label)
- **definition**:
  - **resourceType**: string (typically `core/franklin/components/block/v1/block`)
  - **template**:
    - **name**: string
    - **filter**: string (usually same as `blockName`)
    - **model**: string (required if the block has authoring fields)
- **model** (required if authoring fields exist):
  - **id**: string (must match `template.model`)
  - **fields**: ordered array of field definitions:
    - **component**: string (e.g. `text`, `richtext`, `reference`, `container`, `tab`)
    - **name**: string (camelCase; avoid underscores)
    - **label**: string
    - optional: `value`, `valueType`, `required`, `multi`, `validation`, `condition`, `options`

### Step 2 (Universal Editor HTML)

- **ueHtml**: string (mandatory)
- **structureContract**: explicit mapping of index → meaning, for example:
  - `block.children[0]` = title row
  - `block.children[1]` = image row
  - `block.children[2]` = CTA row

### Step 3 (Frontend)

- **css**: `<block-name>.css`
- **js**: `<block-name>.js`

## Outputs

### Step 1 outputs (backend only)

- `blocks/<block-name>/_<block-name>.json`
- Any merged/derived model content that will be produced by the build step in the target EDS repo (e.g. updates to `component-models.json`)

### Step 2 outputs

- Validation result of UE HTML against the structure contract (pass/fail + actionable errors)

### Step 3 outputs

- `<block-name>.css` and `<block-name>.js` that:
  - use index-based extraction only
  - do not rely on `data-*` attributes for structure/selection
  - document the index contract in the JS (JSDoc)
