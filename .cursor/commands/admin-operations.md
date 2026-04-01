---
description: Run Admin API operations (status/publish/cache/index/sitemap)
---

**Skill:** `.cursor/skills/eds-aem-admin-api/SKILL.md`

Use these endpoints for operational tasks on an EDS project via the runtime server.

Auth (choose one):
- `apiKey` in JSON body or `x-admin-api-key` header
- `authToken` in JSON body or `x-admin-auth-token` header

Endpoints:
- `POST http://localhost:8787/admin/status/get`
- `POST http://localhost:8787/admin/preview/update`
- `POST http://localhost:8787/admin/live/publish`
- `POST http://localhost:8787/admin/live/unpublish`
- `POST http://localhost:8787/admin/cache/purge`
- `POST http://localhost:8787/admin/index/trigger`
- `POST http://localhost:8787/admin/sitemap/generate`

Typical payload fields:
- `org`: string
- `site`: string
- optional: `ref`, `path` (depends on operation)
- optional: `apiKey` or `authToken` (if not using headers)

Return the response JSON and summarize the action taken.

