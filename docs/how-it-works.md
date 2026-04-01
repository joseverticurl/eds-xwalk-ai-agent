# How it works (end-to-end)

This repo provides an **AI dev agent runtime** for EDS projects that use **XWalk / Universal Editor (UE)** authoring.

It does two things:
- **Rules + guidance** (in-repo): contracts, validators, examples, Cursor rules, **project skills** (`.cursor/skills/`), commands, and **`AGENTS.md`** (sub-agent patterns).
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

- `.cursor/rules/` enforces repo-wide non-negotiables (`eds-xwalk.md`) and orchestration (`cursor-orchestration.mdc`).
- `.cursor/skills/` holds **project skills** — short workflows with YAML frontmatter so the agent can pick the right playbook.
- `.cursor/commands/` provides repeatable workflows (REST and MCP-only variants, orchestration, audits).
- Root **`AGENTS.md`** documents parallel **sub-agent** usage for large audits.

### `mcp-server/` (runtime)

Provides HTTP endpoints and an MCP-style dispatcher:
- Generation: backend + frontend
- Validation: UE HTML structure gate
- Transform: Figma tokens
- Admin: AEM Admin API operations

## Typical user flows

### Generate a block

- Prefer **one integration surface**: `POST /mcp/call` with tools `generate.block.backend` → `validate.ueHtml` → `generate.block.frontend` (see `docs/mcp-usage.md` and `.cursor/commands/orchestrate-block-xwalk.md`).
- Or use direct REST: `POST /generate/block/backend`, `POST /validate/ue-html`, `POST /generate/block/frontend`.
- **From Figma URL + block name + user story (optional):** see [`docs/workflow-figma-user-story.md`](./workflow-figma-user-story.md) and `.cursor/commands/generate-block-from-figma-and-story.md` (UE HTML still required for Step 3).

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

## Verifying the runtime

- **Unit tests**: `cd mcp-server && npm run test`
- **Smoke demo** (server must be running): `cd mcp-server && npm run smoke`
