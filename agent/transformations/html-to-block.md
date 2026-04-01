# Transformation: semantic HTML → block model + decoration plan

This transformation is used when the user provides **semantic HTML intent** (or a prototype HTML snippet) and we need to:
- design an authoring model (fields ordered)
- define a decoration strategy
- prepare UE HTML validation expectations

Important:
- If the HTML is not UE output, treat it as **intent only**.
- Step 2 still requires **real UE HTML** from the user.

## Inputs

- semantic HTML snippet (intent)
- required behaviors (static vs interactive)
- any design constraints (tokens, layout)

## Step A — Identify stable “rows” and “items”

Map the HTML into a structure that UE could plausibly emit:
- root block
- direct children as rows/sections
- repeated sets as items containers (authoring: `container` + `multi: true`)

## Step B — Derive ordered fields

For each row/item, derive fields:
- headings → `title`, `eyebrow`
- paragraphs → `text` (richtext)
- images → `image` (reference) + `imageAlt` (text)
- link → `ctaText`, `ctaHref`

For repeated items:
- container `items` with nested fields (ordered)

## Step C — Draft an index contract (conceptual)

Draft a contract like:
- `block.children[0]` = media row
- `block.children[1]` = content row
- `itemsRow.children[i]` = item \(i\)
- `item.children[0]` = title, etc.

This is a **planning artifact**. The final contract must be validated against real UE HTML.

## Step D — Prepare validation expectations

Express minimum expectations:
- min direct children
- min items
- min cells per item

## Step E — Decoration plan

Define which classes to add and whether JS is needed:
- prefer CSS-only
- if JS is required, keep it index-based, scoped, defensive

## Output

- proposed block name + pattern
- ordered fields for backend generation
- UE HTML expectations for validation
- decoration plan (classes, minimal DOM normalization)
