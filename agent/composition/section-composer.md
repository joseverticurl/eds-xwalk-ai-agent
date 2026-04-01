# Section composer (EDS + XWalk)

This document defines how to go from a **section intent** (what the section should accomplish) to:

- a recommended **block choice**
- an ordered **authoring model** (fields and nested containers)
- a **UE HTML validation expectation** (minimum structure, index contract)

It exists to keep generation consistent and to avoid inventing structure that UE won’t actually emit.

## Inputs to the composer

- **Section goal**: e.g. “hero”, “feature list”, “testimonials”, “comparison table”, “faq”, “cta strip”
- **Content types**: images? links? lists? rich text? embedded media?
- **Interaction requirement**: none / tabs / carousel / accordion / filtering
- **Design source**: Figma file/node (optional) + tokens (optional)
- **A11y constraints**: keyboard support required for interactions
- **Perf constraints**: default to CSS; minimal JS

## Selection rules (block choice)

- Prefer **existing blocks** in the target EDS repo before creating a new one.
- Prefer **CSS-only** blocks when the section has no interaction.
- Use **tabs** when there is a small set of correlated panels where only one should be visible at a time.
- Use **carousel** only when horizontal scroll snapping is insufficient and explicit navigation is required.
- Use **rte** for long-form content blocks; avoid extra wrappers and JS.

## Authoring model design rules

- **Field order is the contract**: it drives UE HTML order and thus index-based FE extraction.
- Use `container` + `multi: true` for repeated items (cards, slides, features, testimonials).
- Avoid “computed” fields; store explicit author intent when possible.
- Use camelCase field names; no underscores.

## UE HTML expectations (validation guidance)

The agent must never generate UE HTML. Instead:

- define the **minimum expectations** necessary to safely generate index-based JS/CSS
- validate user-provided UE HTML against those expectations (children count, rows, cells)

Examples of expectations to encode:
- **minDirectChildren** of the block root
- **minRows** and per-row **minCells**
- “has at least one link” / “has at least one heading” (soft checks)

## Common section recipes

### Hero (pattern: `hero`)

- **Recommended block**: `hero`
- **Fields (ordered)**:
  - image (reference)
  - imageAlt (text, optional)
  - eyebrow (text, optional)
  - title (text)
  - text (richtext, optional)
  - ctaText (text, optional)
  - ctaHref (text, optional)
- **Validation expectations (minimum)**:
  - block has at least 2 rows (image + title)
  - at least one heading exists (h1/h2/h3) somewhere inside

### Feature list (pattern: generic list)

- **Recommended block**: `feature-list`
- **Fields (ordered)**:
  - title (text, optional)
  - items (container multi):
    - title (text)
    - text (richtext, optional)
    - icon (reference, optional)
    - href (text, optional)
- **Validation expectations (minimum)**:
  - block has an items container row
  - items row has at least 1 item

### Carousel (pattern: `carousel`)

- **Recommended block**: `carousel`
- **Fields (ordered)**:
  - title (text, optional)
  - items (container multi):
    - image (reference)
    - imageAlt (text, optional)
    - caption (text, optional)
    - href (text, optional)
- **Validation expectations (minimum)**:
  - items container exists
  - items container has at least 1 item
  - each item has at least 1 child node (image or text)

### Tabs (pattern: `tabs`)

- **Recommended block**: `tabs`
- **Fields (ordered)**:
  - tabs (container multi):
    - label (text)
    - content (richtext)
- **Validation expectations (minimum)**:
  - tab items container exists
  - each item has 2 children (label + panel/content container)

### Rich text (pattern: `rte`)

- **Recommended block**: `rte`
- **Fields (ordered)**:
  - content (richtext)
- **Validation expectations (minimum)**:
  - block has at least 1 child containing content

## Output from the composer (what to hand to generators)

The composer should produce:

- **Backend input**: `blockName`, `title`, `fields[]` (ordered)
- **Validator input**: UE HTML expectations (min structure + optional warnings)
- **Frontend input**: `blockName`, `ueHtml`, and (optional) `pattern`
