# Performance validator (EDS blocks)

Use this checklist after Step 3 generation (or refactor) to confirm baseline performance.

## Global checks (all blocks)

- **JS footprint**
  - [ ] JS exists only when needed (CSS-first)
  - [ ] No heavy dependencies introduced by default
  - [ ] No global polling (intervals/timeouts loops) unless justified

- **DOM scope**
  - [ ] DOM queries are scoped to the block (`block.querySelector...`), not document-wide, unless unavoidable
  - [ ] Work is proportional to block size (rows/items), not whole page

- **Layout thrash avoidance**
  - [ ] Avoid repeated layout reads (`getBoundingClientRect`, `offsetHeight`) in loops
  - [ ] Batch DOM writes where possible

- **Images**
  - [ ] Images are responsive (`width: 100%`, `height: auto` where appropriate)
  - [ ] Avoid forcing large repaints via expensive properties

## Pattern checks

### Tabs

- [ ] Switching tabs toggles state without rebuilding all DOM repeatedly
- [ ] Uses `hidden` / minimal attribute changes for panels

### Carousel

- [ ] Prefers CSS scroll snapping first
- [ ] If JS is used, it does not measure layout per frame

## Output

Produce a short report:
- Pass / warn / fail items
- Recommended changes (specific code-level actions)
