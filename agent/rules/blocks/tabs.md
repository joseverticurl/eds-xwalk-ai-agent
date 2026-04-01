# Block rules: `tabs` (EDS + XWalk)

These rules specialize the global rules for the tabs interaction pattern.

## Workflow (mandatory)

1) Backend JSON + model fields first  
2) User provides UE HTML (do not invent) + validate  
3) Frontend JS/CSS from validated UE HTML

## Typical authoring model (ordered)

Common fields:
- tabs (container, `multi: true`)
  - label (text)
  - content (richtext)

Guidance:
- Keep label and content together in one item to avoid list alignment issues.

## UE HTML expectations (contract guidance)

Minimum expectations:
- Tabs container row exists
- It has at least 1 tab item
- Each tab item has at least 2 children:
  - child 0: label
  - child 1: panel/content container

## Frontend rules (Step 3)

- Index-based only for structure (items and their children by index).
- Do not select by `data-*` attributes.
- Prefer building an accessible tab UI:
  - create `button` elements for tabs
  - move/copy panel content into `role="tabpanel"` containers

## Accessibility (required)

Minimum:
- `role="tablist"` on the tabs container
- each tab:
  - `role="tab"`
  - `aria-selected`
  - `aria-controls`
  - is a focusable element (use `button`)
- each panel:
  - `role="tabpanel"`
  - `aria-labelledby`
  - hide inactive panels with `hidden`

Keyboard:
- Click activation is required.
- Arrow key navigation is recommended when feasible; if implemented, keep it consistent and predictable.

## Performance

- Avoid re-rendering all panels on every click; toggle `hidden` and `aria-selected`.
- Keep DOM queries scoped and minimal.
