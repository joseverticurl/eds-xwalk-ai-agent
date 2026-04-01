# Post-generation hook (verification)

Run this after generating artifacts to ensure the output is safe, consistent, and “EDS-ready”.

## Step 1 outputs (backend)

- [ ] Block JSON produced for: `blocks/<block>/_<block>.json`
- [ ] If authoring fields exist:
  - [ ] `template.model` is set
  - [ ] A model with matching `id` exists
  - [ ] Field order is correct and intentional

## Step 2 outputs (UE HTML validation)

- [ ] UE HTML was **provided by the user**
- [ ] UE HTML passes minimum expectations:
  - [ ] enough rows/cells for index contract
  - [ ] enough items for containers (if any)
- [ ] Any warnings recorded (e.g. missing headings/links/images) are acceptable or resolved

## Step 3 outputs (frontend)

- [ ] Exactly one JS and one CSS file exist for the block:
  - [ ] `blocks/<block>/<block>.js`
  - [ ] `blocks/<block>/<block>.css`
- [ ] JS is **index-based only**:
  - [ ] uses `block.children[n]` and `row.children[n]`
  - [ ] does not use `[data-*]` selectors for structure/selection
- [ ] JS documents index contract in `decorate()` JSDoc
- [ ] Defensive handling exists for optional/missing rows/cells (null checks, optional chaining)
- [ ] DOM operations are scoped to the block (no global queries unless unavoidable)

## Accessibility baseline

- [ ] Interactive elements are real `button` / `a`
- [ ] Keyboard access is preserved
- [ ] Focus style is visible (not removed)
- [ ] If pattern is tabs: ARIA roles/attributes are correct

## Performance baseline

- [ ] No heavy dependencies added
- [ ] Minimal JS; CSS-first where possible
- [ ] No repeated forced layout reads in loops

## Design tokens (if used)

- [ ] Tokens are mapped to the target project’s conventions
- [ ] Avoided token explosion (only kept reusable values)
