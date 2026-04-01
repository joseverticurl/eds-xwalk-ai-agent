# Pre-generation hook (checklist)

Run this checklist before generating anything (especially before Step 3).

## Block identity

- [ ] **blockName** provided (kebab-case)
- [ ] **title** provided (human readable)
- [ ] Confirm this is **new** block vs reuse/variant (see `agent/decisions/when-to-create-block.md`)

## Step 1 readiness (backend / model)

- [ ] Authoring fields collected as an **ordered list**
- [ ] Field names are **camelCase**, no underscores
- [ ] Repeated items use `container` + `multi: true` with nested ordered `fields`
- [ ] Optional vs required fields decided (avoid optional structural fields early in order if it shifts rows)

## Step 2 readiness (UE HTML)

- [ ] **UE HTML is required from the user** (agent must not invent it)
- [ ] Validation expectations prepared:
  - [ ] min direct children/rows
  - [ ] per-row min cells (if applicable)
  - [ ] min items for containers (if applicable)

## Step 3 readiness (frontend)

- [ ] Confirm **pattern** (if any): `hero` | `carousel` | `tabs` | `generic`
- [ ] Confirm constraints:
  - [ ] index-based only (`block.children[n]`, `row.children[n]`)
  - [ ] no `data-*` selector coupling
  - [ ] exactly one `<block>.js` and one `<block>.css`

## Optional: design / tokens

- [ ] If design source is Figma:
  - [ ] token extraction requested (if needed): `POST /transform/figma/tokens`
  - [ ] decide mapping strategy (reuse existing project tokens vs add limited new vars)
