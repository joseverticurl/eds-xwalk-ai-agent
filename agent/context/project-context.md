# Project context: `eds-xwalk-ai-agent`

This repo provides a **runtime + rules** to help an AI agent generate and maintain **EDS blocks** that support **XWalk / Universal Editor** authoring.

It is not a full EDS site. It is a **tooling repo** that can:
- generate **backend** XWalk block JSON (Step 1)
- validate **user-provided** Universal Editor semantic HTML (Step 2)
- generate **frontend** JS/CSS from that HTML (Step 3)
- call **AEM Admin API** operations for project maintenance
- extract **design tokens** from Figma

## Core contract (non‑negotiable)

All block work follows the same sequence:

1) **Backend first** (XWalk JSON + models)  
2) **User provides Universal Editor HTML** (do not invent HTML)  
3) **Frontend** generation based on validated UE HTML

Hard constraints:
- **Index-based only**: FE must use positional access (`block.children[n]`, `row.children[n]`).  
  Never couple structure to `data-*` attributes (they may exist in UE HTML, but are not selectors).
- **One JS + one CSS per block**: `<block>/<block>.js` and `<block>/<block>.css`.

## Runtime endpoints (in this repo)

These are implemented by `mcp-server`:

- **Block generation**
  - `POST /generate/block/backend` (Step 1)
  - `POST /validate/ue-html` (Step 2 gate)
  - `POST /generate/block/frontend` (Step 3, supports `pattern: hero|carousel|tabs`)

- **Figma tokens**
  - `POST /transform/figma/tokens` (requires `FIGMA_TOKEN`)

- **AEM Admin API**
  - `POST /admin/*` (site config CRUD, status, preview update, publish/unpublish, cache purge, index trigger, sitemap generate)
  - Auth supported via API key and/or `auth_token` cookie forwarding (see `.env.example`)

- **Tool dispatch**
  - `GET /mcp/tools`
  - `POST /mcp/call` with `{ tool, arguments }`

## Environment variables (typical)

See `.env.example`. Common ones:
- `PORT`
- `AEM_ADMIN_API_BASE_URL`
- `AEM_ADMIN_API_KEY` (preferred when available)
- `AEM_ADMIN_AUTH_TOKEN` (cookie-based flow fallback)
- `FIGMA_TOKEN`

## Where “rules” live

This repo keeps the guidance close to the code:
- `AGENT.md`: the top-level behavior contract for the agent
- `.cursor/rules/`: Cursor-enforced project rules
- `agent/rules/`: human-readable global + block-level rules
- `agent/contracts/`: input/output contract docs
- `agent/validators/`: validation checklists
- `agent/examples/`: worked reference examples

## How to use this repo in practice

For a new block:

- **Step 1**: generate backend JSON + model fields (ordered)
- **Step 2**: paste UE HTML from the Universal Editor → validate
- **Step 3**: generate JS/CSS from the real structure (index-based)

For maintenance tasks:
- use Admin API endpoints for publish/unpublish, indexing, cache purge, sitemap generation, and site config CRUD.

For design-driven work:
- extract Figma tokens early, then map them into the target EDS repo’s token system (don’t blindly introduce `--figma-*` everywhere).
