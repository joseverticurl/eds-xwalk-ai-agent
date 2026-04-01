# Skill: Figma Token Extractor (EDS)

Purpose: extract **design tokens** (colors / typography / effects) from Figma and package them in a form that can be mapped into an EDS project.

This repo supports token extraction via the runtime endpoint:
- `POST /transform/figma/tokens`

## Inputs

- **Figma fileKey** (required)
- Optional: specific **nodeIds** to include (in addition to style nodes)
- Desired output usage:
  - **global tokens** (shared across the EDS site), or
  - **block-scoped tokens** (only used in one block)

## Runtime requirements

- Set `FIGMA_TOKEN` in the environment that runs `mcp-server`.
- Start server: `cd mcp-server && npm run dev`

## Steps

1) **Extract tokens**

Call:

```json
POST /transform/figma/tokens
{
  "fileKey": "<FIGMA_FILE_KEY>"
}
```

2) **Review the bundle**

The response includes:
- `tokenBundle.tokens[]` (normalized list)
- `tokenBundle.cssVars` (generated `:root { --figma-... }` convenience output)

3) **Decide how to map into EDS**

Guidelines:

- **Prefer existing tokens**: if the target EDS repo already has CSS variables/tokens, map to those instead of adding new ones.
- **Global vs block-scoped**:
  - Use **global tokens** when the same values appear across many components/pages (brand colors, typography scale).
  - Use **block-scoped** values when they are truly unique to one block.
- **Avoid token explosion**: don’t create a token per one-off spacing value.

## Output formats

### A) JSON token bundle (recommended for tooling)

- Keep the returned `tokens[]` as the canonical source.
- Store in a target location decided by the consuming project (not enforced by this repo).

### B) CSS variables (convenience)

- Use `tokenBundle.cssVars` to bootstrap CSS vars quickly.
- If adopting globally, place under a global CSS entrypoint in the target EDS repo.
- If block-scoped, paste only the needed vars into the block CSS (or inline constants instead).

## Notes / constraints

- Figma “tokens” may exist as named styles; extraction here is **style-based**.
- This skill does not assume any specific token naming scheme beyond `--figma-*`.
- Token naming/mapping should follow the target EDS project’s conventions.

