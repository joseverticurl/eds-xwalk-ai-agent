# Block rules: `carousel` (EDS + XWalk)

These rules specialize the global rules for a list/items style block (carousel-like).

## Workflow (mandatory)

1) Backend JSON + model fields first  
2) User provides UE HTML (do not invent) + validate  
3) Frontend JS/CSS from validated UE HTML

## Typical authoring model (ordered)

Common fields (order matters):
- title (text, optional)
- items (container, `multi: true`)
  - image (reference)
  - imageAlt (text, optional)
  - caption (text, optional)
  - href (text, optional)

Guidance:
- Use a single `items` container. Avoid multiple parallel lists (harder to keep aligned).
- If `href` exists, prefer the item to contain an actual link element in UE output.

## UE HTML expectations (contract guidance)

Minimum expectations:
- Items container row exists
- Items container has at least 1 direct child item
- Each item has at least 1 meaningful child node (media or text)

Important:
- Do not rely on specific wrapper tags; validate by structure (rows/items) and soft checks (has link, has picture).

## Frontend rules (Step 3)

- Index-based only for structure.
- Prefer CSS scroll snapping first:
  - `overflow-x: auto`
  - `scroll-snap-type: x mandatory`
  - `scroll-snap-align: start` on items
- Only add JS controls if required by UX; keep JS minimal and scoped.
- Add classes:
  - `.carousel__items` on items row
  - `.carousel__item` on each item

## Accessibility

- If JS adds navigation buttons:
  - buttons must be keyboard reachable
  - provide accessible labels (`aria-label`)
  - ensure focus does not get trapped

## Performance

- Avoid measuring layout for every item.
- Avoid observers unless needed; keep work proportional to number of items.
