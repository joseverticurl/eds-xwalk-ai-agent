# Skill: Accessibility Check (EDS blocks)

Purpose: ensure generated blocks meet baseline accessibility expectations.

## Inputs

- UE HTML snippet (preferred) or rendered block DOM structure
- JS behavior (keyboard interactions, focus management)
- Visual requirements (contrast, states)

## Checks (minimum)

- **Images**
  - `img` has meaningful `alt` (or empty alt when decorative)
- **Links & buttons**
  - interactive elements are keyboard reachable
  - no click handlers on non-interactive elements without keyboard equivalents
  - visible focus styles (or ensure focus is not removed)
- **Headings**
  - heading levels are reasonable (don’t skip levels without reason)
- **ARIA**
  - only add ARIA when needed; ensure roles/attributes are correct
  - for tabs: `role="tablist"`, `role="tab"`, `role="tabpanel"`, `aria-selected`, `aria-controls`, `aria-labelledby`
- **Color contrast**
  - flag likely low contrast pairs (requires design/token values to confirm)

## Output

- A checklist report:
  - Pass / warn / fail items
  - concrete fixes (specific attributes/roles to add, or DOM structure changes)
