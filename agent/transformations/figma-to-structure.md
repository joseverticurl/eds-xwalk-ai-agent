# Transformation: Figma → authoring structure

This document describes how to go from a Figma design to:
- a block choice/pattern
- an ordered authoring model (fields + containers)
- a token extraction/mapping plan

## Inputs

- Figma **fileKey** (required)
- Optional **nodeIds** (to focus extraction)
- Target EDS project conventions (if known): existing CSS vars/tokens, typography scale, spacing system

## Step A — Extract tokens (optional but recommended)

Use the runtime:
- `POST /transform/figma/tokens`

Outputs:
- a normalized token list
- a `cssVars` convenience output (typically `--figma-*`)

Mapping guidance:
- Prefer existing project tokens if they exist.
- Promote only repeated values to tokens; keep one-offs inline.

## Step B — Identify block candidates

From the design, classify components:
- static section (no interaction) → generic block + CSS
- correlated panels → tabs
- horizontal list of items → carousel (CSS snap first)
- long-form content → rte

## Step C — Derive authoring model fields

For each component, extract author-intent fields:
- headings (text)
- body copy (richtext)
- images/media (reference + optional alt)
- links/cta (ctaText/ctaHref)
- repeated items (container multi with nested fields)

Rules:
- Field order must reflect the intended reading order.
- Avoid deep nesting unless necessary.
- Use camelCase field names.

## Step D — Prepare UE HTML expectations (validation)

Do not guess UE HTML tags. Instead define minimum structural expectations:
- block has min direct children rows
- items row exists for lists
- tab item has label + panel

These become Step 2 validator inputs.

## Deliverables from this transformation

- Proposed block name(s) and pattern (`hero|carousel|tabs|generic|rte`)
- Ordered fields definition (backend Step 1)
- Token bundle + mapping notes
- UE HTML validation expectations (Step 2)
