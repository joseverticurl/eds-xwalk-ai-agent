# Completion Checklist (EDS XWalk AI Agent)

This checklist defines what “complete” means for this repo.

## A) Code generation (Blocks)

- [x] **Step 1 Backend JSON**: Generate `blocks/<name>/_<name>.json` payload from a field spec.
  - Endpoint/tool: `generate.block.backend` / `POST /generate/block/backend`
  - Validates: blockName + ordered fields; rejects invalid names (e.g. underscores).

- [x] **Step 2 UE HTML gate**: Validate user-provided UE HTML before frontend generation.
  - Endpoint/tool: `validate.ueHtml` / `POST /validate/ue-html`
  - Enforces: HTML is provided; supports structure expectations (minDirectChildren, row indices).

- [x] **Step 3 Frontend**: Generate exactly one `<name>.js` + `<name>.css` per block.
  - Endpoint/tool: `generate.block.frontend` / `POST /generate/block/frontend`
  - Enforces: index-based selection only; no reliance on `data-*`; file naming matches folder.

- [x] **Pattern support**: At least `hero`, `carousel`, `tabs` supported (explicit `pattern` option).

## B) Design tokens (Figma)

- [x] Extract tokens (colors/typography/effects) from Figma file styles.
  - Endpoint/tool: `transform.figma.tokens` / `POST /transform/figma/tokens`
  - Requires: `FIGMA_TOKEN`
  - Outputs: JSON tokens + CSS vars convenience output.

## C) Project operations (AEM Admin API)

- [x] Site config CRUD (read/create/update/delete)
- [x] Preview update / publish / unpublish
- [x] Cache purge / index trigger / sitemap generate / status

## D) Tool dispatch

- [x] A single “tool call” endpoint that accepts `{ tool, arguments }` and dispatches to handlers.
- [x] Tool names match `mcp-server/src/mcp/mcp-schema.json`.

## E) Documentation + demo

- [x] `mcp-server/README.md` documents endpoints + env vars
- [x] `npm run smoke` exercises: backend → validate UE HTML → frontend

