# Block guidelines (EDS + XWalk)

These guidelines describe what “complete” block generation means in this repo.

## Non‑negotiable workflow

1) **Backend first**: XWalk block JSON + ordered authoring model fields  
2) **UE HTML is user-provided**: validate real Universal Editor output  
3) **Frontend from UE HTML**: generate one JS + one CSS file per block folder

## Folder-wise responsibility (target EDS repo)

For block `<block>`:
- Backend: `blocks/<block>/_<block>.json`
- Frontend: `blocks/<block>/<block>.js` and `blocks/<block>/<block>.css`

## Frontend constraints

- **Index-based structure access only**:
  - ✅ `block.children[0]`, `row.children[1]`
  - ❌ `block.querySelector('[data-aue-*]')`
- **Do not couple to `data-*`**:
  - UE may emit authoring attributes, but the FE must not depend on them.
- **Defensive code**:
  - optional/empty authoring fields may remove rows/cells; handle missing indices safely

## Authoring model guidelines

- Field order is meaningful and becomes the structure contract.
- Use `container` + `multi: true` for repeated items (cards, carousel items, tabs).
- Field names are camelCase; avoid underscores.

## Pattern guidance

- **Hero**: minimal JS; class assignment; optional rows may be omitted.
- **Carousel**: prefer CSS scroll snapping; add JS controls only when required.
- **Tabs**: must implement baseline ARIA + keyboard support if JS creates a tab UI.
- **RTE**: prefer CSS-only styling; JS only for small deterministic transforms.

See `agent/rules/blocks/` and `agent/examples/` for concrete references.
