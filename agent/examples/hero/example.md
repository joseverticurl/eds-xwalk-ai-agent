# Example: `hero` (EDS XWalk)

This is a **repo-owned** reference example for **EDS + XWalk / Universal Editor** authoring integration.

It demonstrates the required 3-step flow:

1) **Backend first** (block-level JSON + model)  
2) **User provides Universal Editor HTML** (structure contract)  
3) **Frontend** (index-based JS + CSS)

---

## Step 1 — Backend (block-level JSON + model)

Location in a target EDS repo:

- `blocks/hero/_hero.json`

Example (minimal, illustrative):

```json
{
  "title": "Hero",
  "id": "hero",
  "plugins": {
    "xwalk": {
      "page": {
        "resourceType": "core/franklin/components/block/v1/block",
        "template": {
          "name": "Hero",
          "filter": "hero",
          "model": "hero"
        }
      }
    }
  },
  "models": [
    {
      "id": "hero",
      "fields": [
        { "component": "reference", "name": "image", "label": "Image", "valueType": "string", "multi": false },
        { "component": "text", "name": "imageAlt", "label": "Alt", "valueType": "string", "value": "" },
        { "component": "text", "name": "eyebrow", "label": "Eyebrow", "valueType": "string", "value": "" },
        { "component": "text", "name": "title", "label": "Title", "valueType": "string", "value": "" },
        { "component": "richtext", "name": "text", "label": "Text", "valueType": "string", "value": "" },
        { "component": "text", "name": "ctaText", "label": "CTA Text", "valueType": "string", "value": "" },
        { "component": "text", "name": "ctaHref", "label": "CTA Href", "valueType": "string", "value": "" }
      ]
    }
  ]
}
```

Notes:
- Field order is meaningful; it becomes the expected index contract for frontend extraction.
- In a real EDS repo, a build step merges models into root authoring files (e.g. `component-models.json`).

---

## Step 2 — Universal Editor HTML (sample contract)

The agent must **not** generate this. The user provides it from Universal Editor.

This snippet is only a **reference** for what index-based extraction may look like.

```html
<div class="hero">
  <div>
    <picture><!-- image --></picture>
  </div>
  <div><!-- imageAlt (may be missing if empty) --></div>
  <div><p>Eyebrow</p></div>
  <div><h1>Title</h1></div>
  <div><p>Rich text body</p></div>
  <div><a href="/somewhere">CTA</a></div>
</div>
```

---

## Step 3 — Frontend JS (index-based)

Target EDS repo location:

- `blocks/hero/hero.js`

Illustrative pattern:

```js
export default function decorate(block) {
  /**
   * Structure contract (index-based, from UE HTML):
   * - 0: image row
   * - 1: imageAlt row (optional; may be absent)
   * - 2: eyebrow row (optional)
   * - 3: title row
   * - 4: text row
   * - 5: cta row
   */

  const rows = Array.from(block.children);
  const imageRow = rows[0];
  const titleRow = rows.find((r) => r.querySelector('h1,h2,h3')) ?? rows[3];
  const ctaRow = rows.find((r) => r.querySelector('a[href]')) ?? rows[5];

  block.classList.add('hero--decorated');

  if (imageRow) imageRow.classList.add('hero__media');
  if (titleRow) titleRow.classList.add('hero__title');
  if (ctaRow) ctaRow.classList.add('hero__cta');
}
```

Rules:
- Do not select based on `data-*` attributes.
- Document the index contract; handle optional/missing rows safely.

---

## Step 3 — CSS (minimal)

Target EDS repo location:

- `blocks/hero/hero.css`

```css
.hero.hero--decorated {
  display: grid;
  gap: 16px;
}

.hero__media picture,
.hero__media img {
  display: block;
  width: 100%;
  height: auto;
}
```

