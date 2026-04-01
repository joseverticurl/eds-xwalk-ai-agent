# Block rules: `rte` (EDS + XWalk)

These rules specialize the global rules for a rich text block.

## Workflow (mandatory)

1) Backend JSON + model fields first  
2) User provides UE HTML (do not invent) + validate  
3) Frontend CSS (and JS only if absolutely necessary)

## Typical authoring model (ordered)

- content (richtext)

Guidance:
- Keep the model minimal.
- Prefer semantic HTML output from UE; do not force extra wrappers in JS.

## UE HTML expectations (contract guidance)

Minimum expectations:
- The block contains content nodes (paragraphs, headings, lists, links, etc.)

Validation should be lenient:
- do not require specific tags
- warn (not fail) if content is empty

## Frontend rules (Step 3)

- Prefer **CSS-only** styling for typography and spacing.
- Only add JS for:
  - deterministic transforms needed for embedded content
  - very small enhancements (e.g. add classes to certain elements)

Hard constraints still apply:
- index-based only for any structural access
- no `data-*` selector coupling
- one JS and one CSS file per block if JS is used

## Accessibility

- Do not interfere with native semantics.
- Ensure link styles and focus styles remain visible.

## Performance

- Avoid walking the entire subtree unnecessarily.
- Avoid expensive transforms on large rich text content.
