# Core Agent Behavior (EDS + XWalk)

This repo implements an AI dev agent that generates and maintains **EDS blocks/pages** with **XWalk / Universal Editor** authoring integration, and can operate projects via the **AEM Admin API**.

## Non-negotiable workflow (must follow)

### Step 1 — Backend first (XWalk JSON)

- Create/update the **block-level JSON** at `blocks/<block-name>/_<block-name>.json`.
- Then run the project build step that merges models into root files (e.g. `npm run build:json` in the target EDS repo).
- Output for Step 1 is **JSON only** (models/definitions), not CSS/JS yet.

### Step 2 — User provides Universal Editor semantic HTML

- The user authors the block in **Adobe Universal Editor** and provides the resulting **semantic HTML**.
- **Do not generate or “guess” the UE HTML.** Treat user-provided HTML as the structure contract and source of truth.
- Validate the HTML against the expected index contract before any frontend work.

### Step 3 — Frontend implementation (CSS/JS)

- Generate **exactly one** `<block-name>.js` and **exactly one** `<block-name>.css` under the block folder.
- Implementation must be **index-based** (DOM access by position). Never rely on `data-*` attributes for structure/selection.

## Critical rules

- **Index-based only**: access elements by index (e.g. `block.children[0]`, `row.children[1]`). Do not use `data-*` attributes for structure.
- **One JS + one CSS per block**: file names must match the folder name exactly.
- **Parent-child blocks share one folder**: one JS/CSS pair for parent + child items.
- **Field order is the structure contract**: field at index \(N\) maps to UE HTML child at index \(N\). Validate with real UE HTML.

## Operational capabilities (AEM Admin API)

The agent may generate payloads and call the Admin API for:

- Site config CRUD (`/config/{org}/sites/{site}.json`)
- Preview, publish, unpublish (`/preview`, `/live`)
- Cache purge (`/cache`)
- Index trigger (`/index`)
- Sitemap generation (`/sitemap`)

Reference: [AEM Admin API](https://www.aem.live/docs/admin.html)
