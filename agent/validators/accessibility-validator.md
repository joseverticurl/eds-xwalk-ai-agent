# Accessibility validator (EDS blocks)

Use this checklist after Step 3 generation (or after a refactor) to confirm baseline accessibility.

## Global checks (all blocks)

- **Interactive elements**
  - [ ] Clickable UI uses `button`/`a` (not `div` with click handlers)
  - [ ] Keyboard reachable (tab order)
  - [ ] Visible focus state is not removed

- **Images**
  - [ ] Informative images have meaningful `alt`
  - [ ] Decorative images have empty `alt=""`

- **Headings**
  - [ ] Heading levels are reasonable for the page context
  - [ ] No purely visual headings implemented as non-heading tags unless required by semantics

- **Links**
  - [ ] Link text is meaningful (avoid “click here”)
  - [ ] External links (if any) follow project conventions

## Pattern checks

### Tabs (required if tabs behavior exists)

- [ ] `role="tablist"` exists
- [ ] Each tab:
  - [ ] `role="tab"`
  - [ ] is a `button` (or focusable equivalent)
  - [ ] has `aria-selected`
  - [ ] has `aria-controls` pointing to its panel
- [ ] Each panel:
  - [ ] `role="tabpanel"`
  - [ ] has `aria-labelledby` pointing to its tab
  - [ ] non-active panels are hidden (`hidden` or equivalent)

Keyboard (minimum):
- [ ] Tab key moves focus to a tab
- [ ] Enter/Space activates the focused tab (if using buttons, native behavior covers this)

### Carousel (only if JS adds controls)

- [ ] Prev/Next controls are `button`s
- [ ] Buttons have accessible labels (`aria-label`)
- [ ] Focus order is predictable and does not trap users

## Output

Produce a short report:
- Pass / warn / fail items
- Concrete fixes (what attribute/role/element to change)
