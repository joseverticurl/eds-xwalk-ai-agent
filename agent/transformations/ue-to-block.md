# Transformation: UE HTML → stable index contract → frontend decoration

This transformation is the heart of Step 2 → Step 3:

- take **real Universal Editor output HTML** (from the user)
- analyze its high-level structure (rows/items)
- define a stable **index contract**
- generate FE decoration that is index-based and defensive

## Inputs

- UE HTML snippet for the block (required)
- chosen pattern (optional): `hero|carousel|tabs|generic|rte`
- known authoring fields order (from Step 1)

## Step A — Normalize view of the structure

- Identify the first root element in the snippet (the block wrapper).
- Enumerate its direct children: these are the primary “rows”.
- For rows that are containers, enumerate their direct children as “items”.

## Step B — Define the index contract

Produce a mapping such as:

- `block.children[0]` = media row
- `block.children[1]` = title row
- `block.children[2]` = items row
- `itemsRow.children[i]` = item \(i\)
- `item.children[0]` = label, `item.children[1]` = panel

Rules:
- Prefer contracts based on **direct children indices** (stable).
- Avoid contracts based on deep descendant positions (fragile).
- If optional rows may be missing, document them as optional and code defensively.

## Step C — Validate minimum expectations

Before generating JS/CSS:
- ensure the block has enough direct children to satisfy the contract
- ensure item containers have at least one item (if required)
- for correlated item structures (tabs), ensure each item has required child count

## Step D — Decoration strategy

Default strategy:
- Add a `--decorated` modifier class to the block
- Add part classes to rows/items based on index
- Only restructure DOM when necessary for styling/interaction

## Step E — Generate frontend artifacts

JS:
- index-based structure access only
- no `data-*` selection coupling
- document the contract in `decorate()` JSDoc

CSS:
- mobile-first
- shallow selectors
- scoped to the block

## Output

- a validated index contract (for documentation + JS JSDoc)
- a decoration plan (classes and any DOM normalization)
