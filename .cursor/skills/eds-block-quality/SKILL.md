---
name: eds-block-quality
description: >-
  Applies accessibility and performance expectations to EDS block JS/CSS and UE-driven DOM. Use when reviewing or generating block frontend, tabs, carousel, keyboard support, focus, contrast, or bundle size.
---

# Block quality (a11y + performance) — Cursor skill

## Accessibility (minimum)

- Real interactive elements (`button` / `a`); keyboard reachable; visible focus.
- Images: meaningful `alt` or empty for decorative.
- Tabs: correct ARIA (`tablist`, `tab`, `tabpanel`, `aria-selected`, relationships).
- See `agent/skills/accessibility-check.md` and `agent/validators/accessibility-validator.md`.

## Performance (minimum)

- CSS-first; minimal JS; no heavy deps by default.
- Scoped DOM work; avoid layout thrash in loops.
- See `agent/skills/css-optimizer.md` and `agent/validators/performance-validator.md`.

## When generating FE

After Step 3 output, run through the checklists above before calling the task done.
