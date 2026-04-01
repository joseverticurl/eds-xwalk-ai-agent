---
description: Manage EDS site config via Admin API (/admin/site-config/*)
---

**Skill:** `.cursor/skills/eds-aem-admin-api/SKILL.md`

Use these endpoints to create/read/update/delete site configuration via the runtime server.

Auth (choose one):
- Include `apiKey` in JSON body, or send header `x-admin-api-key`
- Include `authToken` in JSON body, or send header `x-admin-auth-token`

Endpoints:
- `POST http://localhost:8787/admin/site-config/read`
- `POST http://localhost:8787/admin/site-config/create`
- `POST http://localhost:8787/admin/site-config/update`
- `POST http://localhost:8787/admin/site-config/delete`

Typical payload fields:
- `org`: string
- `site`: string
- `config`: object (for create/update)
- `apiKey` or `authToken`: string (optional if using headers)

Return the response JSON and clearly summarize what changed.

