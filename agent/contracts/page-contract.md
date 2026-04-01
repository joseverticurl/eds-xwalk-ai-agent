# Page Contract (EDS XWalk) — Minimal

This repo currently focuses on **block** generation. This contract defines the minimal shape for future page generation.

## Inputs

- **pageName**: string
- **layout**: array of sections (ordered)
  - each section references blocks + their configuration (authoring model inputs)
- **designSource**: optional Figma URL/node or screenshots

## Outputs

- A page composition plan (block order + required authoring fields)
- Optional: authoring config payloads (site/page metadata) if the target EDS project supports it

## Constraints

- Blocks follow the same 3-step workflow (backend → UE HTML → frontend).
