# Authoring guidelines (XWalk + Universal Editor)

These guidelines exist to keep backend model definitions, UE HTML output, and frontend decoration logic consistent.

## Golden rules

- **Model field order is the structure contract**.
  - The order you define fields in the backend model strongly influences the **UE HTML order**.
  - Frontend logic must be **index-based** and therefore depends on this order.
- **The agent must not generate UE HTML**.
  - UE HTML is the source of truth for Step 3; the user must paste actual UE output.
- **Optional/empty authoring fields can remove rows/cells**.
  - If an author leaves an optional field empty, UE may emit less HTML than expected.
  - Frontend must be defensive (null checks) and validation must catch “too few rows/cells”.

## Field design guidelines

- **Use camelCase** field names (no underscores).
- Prefer clear, explicit primitives:
  - text / richtext for copy
  - reference for images/assets
  - select/boolean for controlled choices
- Use `container` + `multi: true` for repeated items (cards, slides, tabs, FAQs).
- Keep nested containers shallow where possible (deep nesting complicates UE HTML and increases brittleness).

## Index contract expectations (frontend)

Because FE must use index-based access, every interactive block should document a contract like:
- `block.children[0]` is the title row
- `block.children[1]` is the items row
- `itemsRow.children[i]` is item \(i\)
- `item.children[0]` is label, `item.children[1]` is content, etc.

Important:
- UE HTML may include `data-aue-*` or other `data-*` attributes, but FE must not depend on them for structure/selection.

## Validation expectations (Step 2)

Validation should encode the *minimum* structure required to safely decorate:
- minimum number of direct child rows
- minimum rows/cells per item
- minimum item count for multi containers

Validation should **not** require exact tag names (UE can vary tags), but can check:
- presence of headings/links/images as warnings (not hard failures) where helpful

## Common patterns

### List / cards / carousel items

- Model uses `container` with `multi: true`
- UE commonly emits:
  - one “items row”
  - each item as a direct child element inside that row
  - each item contains ordered children for each nested field

Frontend should:
- treat each item as one unit
- add classes to items and subparts based on indices
- avoid deep selectors; keep DOM operations scoped to the block

### Tabs

- Each tab item typically has:
  - label (child 0)
  - panel (child 1)

Frontend must:
- implement keyboard-accessible tab behavior if it introduces buttons/roles
- ensure correct ARIA (`tablist`, `tab`, `tabpanel`, `aria-selected`, relationships)

### Rich text (RTE)

- Prefer CSS-only styling.
- Only add JS if there is a clear requirement (e.g. transform embedded content), and scope it to the block.

## Practical authoring tips (for consistent UE HTML)

- If a field is structurally required (e.g. every carousel item must have an image), mark it required or enforce it in content guidance.
- Avoid mixing “optional structural” fields early in the order if it makes the row indexing brittle.
  - Example: put optional eyebrow text after the title, not before, if UE would omit it and shift indices.
- Prefer grouping:
  - title + text + CTA together
  - media grouped together
  - repeated items always under one container field
