# Output naming rules (EDS)

These naming rules are enforced because they simplify discovery, reduce ambiguity, and keep generation deterministic.

## Blocks

- **Block folder**: kebab-case
  - ✅ `hero`, `product-carousel`, `social-proof`
  - ❌ `ProductCarousel`, `social_proof`

- **Frontend artifacts**: exactly one JS + one CSS matching folder name:
  - `blocks/<block>/<block>.js`
  - `blocks/<block>/<block>.css`

- **Backend artifact**: block-level JSON:
  - `blocks/<block>/_<block>.json`

## Models and fields

- **Model id**: typically matches the block name (kebab-case) unless the target project uses a different convention.
- **Field names**: camelCase, no underscores
  - ✅ `imageAlt`, `ctaText`, `ctaHref`
  - ❌ `image_alt`, `cta_text`

## CSS classes (recommended)

Keep CSS selectors simple and shallow:
- Base: `.blockname` (from UE HTML)
- Decorated modifier: `.blockname--decorated` (added by JS)
- Subparts: `.blockname__part` (BEM-ish)

Example:
- `.hero.hero--decorated`
- `.hero__media`, `.hero__title`

## Generated output identifiers

- Avoid exporting multiple entrypoints from a block JS file.
- Prefer a single `export default function decorate(block) { ... }`.

## Forbidden naming patterns

- Do not create multiple JS/CSS files per block (no `hero-variant.js` etc.).
- Do not encode semantic meaning in file names beyond the block name (keep it consistent).
