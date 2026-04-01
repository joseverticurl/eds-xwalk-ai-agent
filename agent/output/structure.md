# Output structure (folder-wise responsibility)

This repo defines **what** gets generated and **where it belongs** in a target EDS project.

Important:
- This repo’s runtime generates **payloads/artifacts**; it does not directly commit into a consuming EDS site unless you copy/apply outputs there.
- The folder structure below is the **expected target** structure in an EDS repo.

## Block outputs (mandatory)

For a block named `<block>` (kebab-case):

### Step 1 — Backend (XWalk JSON)

- **Block JSON**:
  - `blocks/<block>/_<block>.json`
- **Models**:
  - May be embedded/returned as part of the payload and later merged into the target project’s model store (project-specific).

### Step 2 — Universal Editor HTML

- No files are generated here.
- Output is a **validation report** (pass/fail + actionable errors) based on the user-provided UE HTML snippet.

### Step 3 — Frontend (one JS + one CSS)

- `blocks/<block>/<block>.js`
- `blocks/<block>/<block>.css`

Constraints:
- FE is index-based only.
- Exactly one JS and one CSS per block folder.

## Supporting outputs (optional)

### Token bundles (from Figma)

This repo can output a token bundle (JSON list + CSS vars string). Where it is stored in a target EDS repo is project-dependent:

- **Global tokens**: a global CSS entrypoint or a shared tokens file.
- **Block-scoped tokens**: within the block CSS or as a small subset of CSS vars.

## Admin / maintenance outputs

Admin API calls produce operational results (status payloads, job results, etc.). They do not create local files by default.

## Runtime-owned docs (this repo)

The `agent/` folder contains the docs/rules/templates used to keep generation consistent:
- `agent/contracts/` (input/output contracts)
- `agent/rules/` (global + block rules)
- `agent/validators/` (checklists)
- `agent/examples/` (reference examples)
