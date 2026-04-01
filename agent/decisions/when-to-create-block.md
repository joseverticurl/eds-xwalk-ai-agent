# Decision: when to create a new block

This decision record helps the agent (and humans) choose between:
- **reusing** an existing block
- creating a **new** block
- implementing a variation via **CSS-only** or content/model tweaks

## Default preference order

1) **Reuse existing** block in the target EDS repo (best: least maintenance)
2) **Extend/variant** via model + CSS (no JS, no new interaction)
3) **Create new block** only when necessary

## Create a new block when…

- The section requires a **new authoring model** not representable as a safe variation of an existing block.
- The section has a **distinct interaction pattern** (tabs/carousel/accordion) that would complicate an existing block or add conditional behavior that harms maintainability.
- The design requires a **different DOM structure contract** that would break index-based logic of the existing block.
- The block will be reused across multiple pages and needs a stable contract.

## Do NOT create a new block when…

- It’s just a **styling change** (spacing, colors, typography) → use CSS.
- It’s a **content change** (labels, copy, images) → adjust authoring content.
- It’s a small layout tweak that can be handled by a **single additional field** or a CSS modifier class without changing structure.
- The “new block” would mostly duplicate an existing block with minor differences.

## Quick checklist (before deciding)

- Does the target EDS repo already have a block that matches \(\ge 80\%\) of requirements?
- Can the requirement be met **without JS**?
- Will the UE HTML emitted for the variation remain **stable** (index contract won’t drift)?
- Would adding the feature introduce complex conditional rendering in JS/CSS?
- Will authors understand the model (fields are clear, minimal, ordered)?

## Examples

- **New block**: “tabs” for product details when only one panel visible and needs keyboard support.
- **Reuse + CSS**: hero variant with different alignment and background color.
- **Reuse + model tweak**: add optional eyebrow to an existing hero (but beware optional-row shifting; validate UE HTML).
