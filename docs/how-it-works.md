# How it works (end-to-end)

This repo provides an **AI dev agent runtime** for EDS projects that use **XWalk / Universal Editor (UE)** authoring.

It does two things:
- **Rules + guidance** (in-repo): contracts, validators, examples, Cursor rules/commands.
- **Runtime** (`mcp-server/`): deterministic generators/validators + external integrations (Admin API, Figma) exposed via HTTP and an MCP-style dispatcher.

## Core workflow (non‑negotiable)

For every EDS block:

1) **Step 1 — Backend first**  
   Generate block-level XWalk JSON (and model fields) that define authoring.

2) **Step 2 — UE HTML (user-provided)**  
   The user must paste **actual UE-generated semantic HTML**. The agent validates it.

3) **Step 3 — Frontend from UE HTML**  
   Generate exactly one JS and one CSS file for the block, using **index-based structure access only**.

## Why the 3-step gate exists

- UE HTML is the real structure contract.
- Authoring fields can be optional; empty values can cause UE to omit rows/cells.
- Therefore, frontend code must be generated **from real UE output**, not from assumptions.

## Major components

### `agent/` (human + agent guidance)

- Rules, contracts, validators, examples, templates, and transformations used to keep behavior consistent:
  - `agent/contracts/`
  - `agent/rules/`
  - `agent/validators/`
  - `agent/examples/`

### `.cursor/` (Cursor behavior)

- `.cursor/rules/` enforces repo-wide non-negotiables.
- `.cursor/commands/` provides repeatable workflows (backend generation, validation, frontend generation, token extraction, MCP calls).

### `mcp-server/` (runtime)

Provides HTTP endpoints and an MCP-style dispatcher:
- Generation: backend + frontend
- Validation: UE HTML structure gate
- Transform: Figma tokens
- Admin: AEM Admin API operations

## Typical user flows

### Generate a block

- Call `POST /generate/block/backend`
- Paste UE HTML → call `POST /validate/ue-html`
- Call `POST /generate/block/frontend`

### Extract tokens from Figma

- Set `FIGMA_TOKEN`
- Call `POST /transform/figma/tokens` (or via `POST /mcp/call` with tool `transform.figma.tokens`)

### Maintain an EDS project (Admin API)

- Configure `AEM_ADMIN_API_BASE_URL`
- Call `/admin/*` operations with `apiKey` or `authToken` credentials

## Common failure modes (and what to do)

- **Frontend generation fails validation**: UE HTML doesn’t have enough rows/cells/items.  
  Fix by updating authoring fields/content and re-copying UE HTML.

- **Figma token extraction fails**: missing/invalid `FIGMA_TOKEN` or wrong `fileKey`.

- **Admin operations fail**: missing `AEM_ADMIN_API_BASE_URL` or invalid auth (`apiKey`/`authToken`).
