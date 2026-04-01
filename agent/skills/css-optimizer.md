# Skill: CSS Optimizer (EDS)

Purpose: improve block CSS while keeping EDS performance and maintainability.

## Inputs

- Block CSS (or the file path in the target EDS repo)
- Any known breakpoints / design requirements (from Figma or specs)
- Known EDS global styles/tokens (if present in the target repo)

## Rules

- Prefer **mobile-first** CSS.
- Keep selectors **shallow** (avoid deep descendant chains).
- Avoid layout thrash: minimize expensive properties and large paint areas.
- Don’t introduce new global styles unless explicitly required.
- Don’t invent a token system; only map to tokens if the target EDS project already uses them.

## What to do

- Remove redundant declarations and merge duplicates.
- Prefer `gap`, `flex`, `grid` over manual margins when appropriate.
- Normalize spacing units within the block (e.g., consistent `px` or `rem` strategy based on repo norms).
- Add `@media` queries only when layout truly changes.
- Ensure images are responsive (`max-width: 100%`, `height: auto`) where needed.

## Output

- Updated CSS with the same visual intent
- Short summary of what changed (performance / readability / maintainability)
