# Example: `carousel` (EDS XWalk)

Repo-owned reference for an **items/list** style block with XWalk authoring.

---

## Step 1 — Backend (block-level JSON + model)

Target EDS repo location:

- `blocks/carousel/_carousel.json`

Example (illustrative):

```json
{
  "title": "Carousel",
  "id": "carousel",
  "plugins": {
    "xwalk": {
      "page": {
        "resourceType": "core/franklin/components/block/v1/block",
        "template": { "name": "Carousel", "filter": "carousel", "model": "carousel" }
      }
    }
  },
  "models": [
    {
      "id": "carousel",
      "fields": [
        { "component": "text", "name": "title", "label": "Title", "valueType": "string", "value": "" },
        {
          "component": "container",
          "name": "items",
          "label": "Items",
          "multi": true,
          "fields": [
            { "component": "reference", "name": "image", "label": "Image", "valueType": "string", "multi": false },
            { "component": "text", "name": "imageAlt", "label": "Alt", "valueType": "string", "value": "" },
            { "component": "text", "name": "caption", "label": "Caption", "valueType": "string", "value": "" },
            { "component": "text", "name": "href", "label": "Link", "valueType": "string", "value": "" }
          ]
        }
      ]
    }
  ]
}
```

---

## Step 2 — Universal Editor HTML (sample contract)

User provides actual HTML. This is only an illustrative reference.

```html
<div class="carousel">
  <div><h2>Carousel title</h2></div>
  <div>
    <div>
      <picture><!-- image --></picture>
      <p>Caption</p>
      <p><a href="/x">Link</a></p>
    </div>
    <div>
      <picture><!-- image --></picture>
      <p>Caption</p>
      <p><a href="/y">Link</a></p>
    </div>
  </div>
</div>
```

---

## Step 3 — Frontend JS (index-based)

Target EDS repo location:

- `blocks/carousel/carousel.js`

```js
export default function decorate(block) {
  /**
   * Structure contract (index-based):
   * - 0: title row (optional)
   * - 1: items container row
   *   - each direct child inside items row is one item
   */

  const rows = Array.from(block.children);
  const itemsRow = rows[1] ?? rows[0];
  if (!itemsRow) return;

  const items = Array.from(itemsRow.children);
  block.classList.add('carousel--decorated');
  itemsRow.classList.add('carousel__items');

  items.forEach((item) => item.classList.add('carousel__item'));
}
```

---

## Step 3 — CSS (minimal)

Target EDS repo location:

- `blocks/carousel/carousel.css`

```css
.carousel__items {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(240px, 1fr);
  gap: 16px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
}

.carousel__item {
  scroll-snap-align: start;
}
```

