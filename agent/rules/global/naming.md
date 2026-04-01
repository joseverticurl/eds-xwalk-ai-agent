# Global Naming Rules (EDS)

- **block folder**: kebab-case (e.g. `hero`, `social-proof`, `product-carousel`)
- **block artifacts**: one JS + one CSS, both match folder name:
  - `blocks/<block>/<block>.js`
  - `blocks/<block>/<block>.css`
- **block-level JSON**: `blocks/<block>/_<block>.json`
- **model field names**: camelCase, no underscores (e.g. `imageAlt`, not `image_alt`)
