# Example: `tabs` (EDS XWalk)

Repo-owned reference for a block with **two correlated lists** (tab labels + tab panels).

---

## Step 1 — Backend (block-level JSON + model)

Target EDS repo location:

- `blocks/tabs/_tabs.json`

Example (illustrative):

```json
{
  "title": "Tabs",
  "id": "tabs",
  "plugins": {
    "xwalk": {
      "page": {
        "resourceType": "core/franklin/components/block/v1/block",
        "template": { "name": "Tabs", "filter": "tabs", "model": "tabs" }
      }
    }
  },
  "models": [
    {
      "id": "tabs",
      "fields": [
        {
          "component": "container",
          "name": "tabs",
          "label": "Tabs",
          "multi": true,
          "fields": [
            { "component": "text", "name": "label", "label": "Label", "valueType": "string", "value": "" },
            { "component": "richtext", "name": "content", "label": "Content", "valueType": "string", "value": "" }
          ]
        }
      ]
    }
  ]
}
```

---

## Step 2 — Universal Editor HTML (sample contract)

User provides actual HTML. This is only a reference.

```html
<div class="tabs">
  <div>
    <div>
      <p>Tab A</p>
      <div><p>Panel A content</p></div>
    </div>
    <div>
      <p>Tab B</p>
      <div><p>Panel B content</p></div>
    </div>
  </div>
</div>
```

---

## Step 3 — Frontend JS (index-based, accessible)

Target EDS repo location:

- `blocks/tabs/tabs.js`

```js
export default function decorate(block) {
  /**
   * Structure contract (index-based):
   * - 0: tabs container row
   *   - each direct child is a tab item
   *     - item.children[0] = label
   *     - item.children[1] = panel
   */

  const containerRow = block.children[0];
  if (!containerRow) return;

  const items = Array.from(containerRow.children);
  const tablist = document.createElement('div');
  tablist.setAttribute('role', 'tablist');

  const panels = document.createElement('div');

  items.forEach((item, i) => {
    const labelEl = item.children[0];
    const panelEl = item.children[1];
    const labelText = labelEl?.textContent?.trim() || `Tab ${i + 1}`;

    const tabId = `tab-${i}`;
    const panelId = `panel-${i}`;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.id = tabId;
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-controls', panelId);
    btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    btn.textContent = labelText;

    const panel = document.createElement('div');
    panel.id = panelId;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', tabId);
    panel.hidden = i !== 0;
    if (panelEl) panel.append(...Array.from(panelEl.childNodes));

    btn.addEventListener('click', () => {
      const tabs = tablist.querySelectorAll('[role="tab"]');
      tabs.forEach((t, idx) => t.setAttribute('aria-selected', idx === i ? 'true' : 'false'));
      Array.from(panels.children).forEach((p, idx) => (p.hidden = idx !== i));
    });

    tablist.appendChild(btn);
    panels.appendChild(panel);
  });

  block.textContent = '';
  block.classList.add('tabs--decorated');
  block.append(tablist, panels);
}
```

Rules:
- Still index-based (no `data-*` coupling).
- Adds basic ARIA roles/attributes for accessibility.

---

## Step 3 — CSS (minimal)

Target EDS repo location:

- `blocks/tabs/tabs.css`

```css
.tabs--decorated [role="tablist"] {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tabs--decorated [role="tabpanel"] {
  margin-top: 16px;
}
```

