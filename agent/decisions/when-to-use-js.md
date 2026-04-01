# Decision: when to use JavaScript in a block

EDS blocks should be **CSS-first**. JavaScript is allowed only when it provides necessary interaction or structural transformation that cannot reasonably be done with CSS alone.

## Default rule

- If the block is readable and usable without JS, prefer **no JS** (or minimal enhancement only).

## Use JS when…

- There is required **interaction**:
  - tabs switching (must be keyboard accessible)
  - carousel navigation (if simple scroll snapping is insufficient)
  - accordion expand/collapse (if required)
  - filtering/sorting (if required)
- There is a required **DOM normalization** step to make UE HTML usable/stylable while preserving content:
  - grouping children into wrappers based on indices
  - moving nodes into semantic containers
- There is required **accessibility behavior** not achievable with CSS:
  - focus management
  - keyboard navigation patterns

## Do NOT use JS when…

- The requirement is purely visual:
  - layout, spacing, typography, colors
  - hover/focus/active styles
  - responsive behavior
- The requirement can be achieved with:
  - CSS Grid/Flexbox
  - scroll snapping
  - native HTML elements (details/summary) where appropriate (validate UE output feasibility)

## If JS is used, hard constraints apply

- **Index-based only**: use positional access for structure (`block.children[n]`, `row.children[n]`).
- **No `data-*` coupling**: do not select by `data-aue-*` or other `data-*`.
- **Scoped DOM operations**: only touch inside the block.
- **Defensive**: handle missing optional rows/cells safely.
- **One JS file** per block (and one CSS).

## Interaction-specific guidance

### Tabs

- Must implement baseline ARIA:
  - `role="tablist"`, `role="tab"`, `role="tabpanel"`
  - `aria-selected`, `aria-controls`, `aria-labelledby`
- Buttons must be keyboard reachable; support click at minimum (arrow-key support is recommended when feasible).

### Carousel

- Prefer CSS scroll snapping first.
- Only add JS controls if:
  - explicit next/prev buttons are required
  - pagination state is required
  - snapping behavior needs programmatic control

## Performance guardrails

- Avoid observers/intervals unless required.
- Avoid global listeners; if needed, register minimal listeners and cleanly scope them.
- Avoid expensive layout reads in loops; batch operations.
