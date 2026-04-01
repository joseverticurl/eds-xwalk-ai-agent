# EDS XWALK AI Agent

An AI dev agent + runtime server to generate EDS blocks/pages and operate EDS projects via the AEM Admin API.

Admin API reference: [AEM Admin API](https://www.aem.live/docs/admin.html)

## Repo layout

- `agent/`: rules, prompts, templates, validators, extended skill playbooks
- `.cursor/`: Cursor **rules**, **commands**, and **project skills** (`.cursor/skills/*/SKILL.md`)
- `AGENTS.md`: how to use **sub-agents** for parallel audits in Cursor
- `mcp-server/`: runtime server (REST + MCP-style `POST /mcp/call`)
- `integrations/`: Cursor/Figma/AEM helpers
- `docs/`: architecture + usage docs
