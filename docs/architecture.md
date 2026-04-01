# Architecture

This repo is split into:
- **Guidance** (`agent/`, `.cursor/`, `AGENT.md`) — how the agent should behave
- **Runtime** (`mcp-server/`) — deterministic endpoints/tools that execute generation/validation/transforms/admin calls
- **Playground** (`playground/`) — sample inputs used by the smoke demo

## Repository map

- `AGENT.md`: top-level behavior contract (3-step workflow + constraints)
- `.cursor/rules/`: Cursor-enforced rules
- `.cursor/commands/`: repeatable local workflows
- `agent/`: deeper guidance (contracts, rules, validators, examples, templates, transformations)
- `mcp-server/`: Node runtime (Express) exposing endpoints + MCP-style dispatcher
- `playground/sample-inputs/`: known-good inputs for demo/testing

## Request lifecycle (runtime)

Typical route flow:

1) Express route (e.g. `POST /generate/block/frontend`)
2) JSON body enforcement + schema validation middleware
3) Controller handler
4) Service call (generator/validator/transformer)
5) Standard JSON response with `ok`, results, and (when relevant) artifacts

## MCP-style dispatcher

The runtime also provides:
- `GET /mcp/tools` — lists supported tools from `mcp-schema.json`
- `POST /mcp/call` — calls a tool by name with `{ tool, arguments }`

This is the recommended “single integration surface” for Cursor/agents.

## Data contracts (why they exist)

- **Authoring model fields order** drives UE HTML order.
- UE HTML is the **source of truth** for frontend structure.
- Frontend generation must therefore:
  - be **index-based** for structure
  - be **defensive** for optional/missing rows
  - avoid `data-*` attribute coupling

## Extending the system

### Add a new block pattern

- Update frontend generator pattern support (`mcp-server/src/services/generation/block-frontend-generator.js`)
- Add a rule doc under `agent/rules/blocks/`
- Add a worked example under `agent/examples/`
- Optionally add a new Cursor command under `.cursor/commands/`

### Add a new MCP tool

- Add tool schema to `mcp-server/src/mcp/mcp-schema.json`
- Implement handling in `mcp-server/src/mcp/mcp-handler.js`
- (Optional) add a `.cursor/commands/` doc for it
