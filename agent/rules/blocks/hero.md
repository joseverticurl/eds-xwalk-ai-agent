# Block rules: `hero` (EDS + XWalk)

These rules specialize the global rules for the `hero` pattern.

## Workflow (mandatory)

1) Backend JSON + model fields first  
2) User provides UE HTML (do not invent) + validate  
3) Frontend JS/CSS from validated UE HTML

## Typical authoring model (ordered)

Common fields (order matters):
- image (reference)
- imageAlt (text, optional)
- eyebrow (text, optional)
- title (text)
- text (richtext, optional)
- ctaText (text, optional)
- ctaHref (text, optional)

Guidance:
- Keep “structural” rows stable. If `image` and `title` are required, keep them early.
- Optional rows may be omitted by UE when empty; Step 2 validation must allow for that and Step 3 must be defensive.

## UE HTML expectations (contract guidance)

UE output varies by project and content, so do not hardcode tags.

Minimum expectations to safely decorate:
- There is a media row containing an image/picture (or a placeholder when image absent)
- There is a heading row (h1/h2/h3 somewhere in the block)
- CTA may be absent; if present it typically contains a link

## Frontend rules (Step 3)

- Must be **index-based only** for structure: `block.children[n]`, `row.children[n]`.
- Do not select by `data-*` attributes (including `data-aue-*`).
- Prefer minimal JS:
  - add classes to stable parts (media/title/cta)
  - normalize DOM only when needed for layout

## Accessibility

- If CTA exists, ensure it is a real `a` or `button` and remains keyboard reachable.
- Ensure image alt handling:
  - informative images should have meaningful `alt`
  - decorative images should have empty `alt`

## Performance

- No heavy JS for hero.
- Avoid large DOM rewrites; keep operations scoped to the block.
