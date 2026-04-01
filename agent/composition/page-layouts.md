# Page layouts (EDS + XWalk)

This document defines **re-usable page layout recipes** as *ordered sections* composed of blocks.

The goal is to standardize:
- which blocks are typically used together
- which authoring fields they require (and in what order)
- what **Universal Editor (UE) HTML** structure to expect per block (without inventing the HTML)

## Non‑negotiable workflow

For **every block** in a layout, the agent must follow:

1) **Step 1 — Backend first**: generate XWalk block JSON + model fields (ordered).  
2) **Step 2 — UE HTML**: user provides UE-generated semantic HTML; validate it.  
3) **Step 3 — Frontend**: generate one `<block>.js` + one `<block>.css`, index-based only.

## Layout recipes

Each layout below is a *composition plan*, not a guarantee. If the target EDS site already has equivalent blocks, prefer reuse over new blocks.

### Layout: Marketing landing page

- **Section A — Hero**
  - **Block**: `hero` (pattern: `hero`)
  - **Typical fields (ordered)**:
    - image (reference)
    - imageAlt (text, optional)
    - eyebrow (text, optional)
    - title (text)
    - text (richtext, optional)
    - ctaText (text, optional)
    - ctaHref (text, optional)
  - **Notes**:
    - Field order is the index contract driver; optional empty fields may remove rows → validate against real UE HTML.

- **Section B — Trust / logos**
  - **Block**: `carousel` (pattern: `carousel`) or a CSS-only grid block if no interaction is required
  - **Typical fields (ordered)**:
    - title (text, optional)
    - items (container multi)
      - image (reference)
      - imageAlt (text, optional)
      - caption (text, optional)
      - href (text, optional)
  - **Notes**:
    - If the design is a static row of logos, prefer no JS.

- **Section C — Feature list**
  - **Block**: `feature-list` (pattern: generic)
  - **Typical fields (ordered)**:
    - title (text, optional)
    - items (container multi)
      - title (text)
      - text (richtext, optional)
      - icon (reference, optional)
      - href (text, optional)

- **Section D — Tabs (optional)**
  - **Block**: `tabs` (pattern: `tabs`)
  - **Typical fields (ordered)**:
    - tabs (container multi)
      - label (text)
      - content (richtext)
  - **Notes**:
    - Tabs must follow baseline ARIA roles and keyboard support if JS is introduced.

- **Section E — CTA strip**
  - **Block**: `cta` (pattern: generic)
  - **Typical fields (ordered)**:
    - title (text)
    - text (richtext, optional)
    - ctaText (text)
    - ctaHref (text)

### Layout: Product detail page

- **Section A — Product hero**
  - **Block**: `hero` (pattern: `hero`) or `product-hero` if requirements differ
  - **Typical fields (ordered)**:
    - image (reference)
    - imageAlt (text, optional)
    - title (text)
    - price (text, optional)
    - rating (text, optional)
    - description (richtext, optional)
    - ctaText (text)
    - ctaHref (text)

- **Section B — Tabs for details**
  - **Block**: `tabs` (pattern: `tabs`)
  - **Typical fields (ordered)**:
    - tabs[]: label + content

- **Section C — Related products**
  - **Block**: `carousel` (pattern: `carousel`)
  - **Typical fields (ordered)**:
    - title (text, optional)
    - items[]: image + title + href (+ optional price)

### Layout: Documentation / article page

- **Section A — Article header**
  - **Block**: `article-header` (pattern: generic)
  - **Typical fields (ordered)**:
    - title (text)
    - eyebrow (text, optional)
    - meta (text, optional)

- **Section B — Rich text content**
  - **Block**: `rte` (pattern: `rte`)
  - **Typical fields (ordered)**:
    - content (richtext)
  - **Notes**:
    - Prefer minimal JS; most behavior should be styling + semantic HTML.

## Token usage (Figma)

If a layout is based on Figma:
- extract **design tokens** once per page (or per project) and map them to the target EDS repo conventions.
- avoid “token explosion”; only elevate repeated values to tokens.

Runtime support in this repo:
- `POST /transform/figma/tokens`
