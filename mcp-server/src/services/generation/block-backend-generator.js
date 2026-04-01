/**
 * Deterministic Step-1 generator for EDS XWalk block-level JSON.
 *
 * Produces a JSON payload intended for:
 * - blocks/<block-name>/_<block-name>.json
 *
 * This repo does not run the downstream merge step (e.g. build:json) because that
 * happens in the target EDS project. We generate the input artifact here.
 */
export function generateBlockBackendJson({ blockName, title, modelId, fields, hasModel = true }) {
  const normalizedBlockName = normalizeBlockName(blockName);
  const id = normalizedBlockName;
  const humanTitle = title?.trim() || titleFromBlockName(normalizedBlockName);
  const normalizedModelId = hasModel ? normalizeModelId(modelId ?? normalizedBlockName) : undefined;

  const definition = {
    title: humanTitle,
    id,
    plugins: {
      xwalk: {
        page: {
          resourceType: 'core/franklin/components/block/v1/block',
          template: {
            name: titleToTemplateName(humanTitle),
            filter: normalizedBlockName,
            ...(normalizedModelId ? { model: normalizedModelId } : {})
          }
        }
      }
    }
  };

  const models = normalizedModelId
    ? [
        {
          id: normalizedModelId,
          fields: normalizeFields(fields ?? [])
        }
      ]
    : [];

  return normalizedModelId ? { ...definition, models } : definition;
}

function normalizeBlockName(name) {
  const s = String(name ?? '').trim();
  if (!s) throw userError('`blockName` is required.');
  // Keep kebab-case-ish, but don’t over-police; just normalize spaces/underscores.
  return s
    .toLowerCase()
    .replaceAll(/[_\s]+/g, '-')
    .replaceAll(/[^a-z0-9-]/g, '')
    .replaceAll(/-+/g, '-')
    .replaceAll(/^-+|-+$/g, '');
}

function normalizeModelId(id) {
  const s = String(id ?? '').trim();
  if (!s) return '';
  // XWalk examples prefer lowercase ids; avoid spaces.
  return s
    .toLowerCase()
    .replaceAll(/[_\s]+/g, '-')
    .replaceAll(/[^a-z0-9-]/g, '')
    .replaceAll(/-+/g, '-')
    .replaceAll(/^-+|-+$/g, '');
}

function titleFromBlockName(blockName) {
  return blockName
    .split('-')
    .filter(Boolean)
    .map((p) => p.slice(0, 1).toUpperCase() + p.slice(1))
    .join(' ');
}

function titleToTemplateName(title) {
  // Keep it simple and stable: remove non-alphanumerics, no spaces.
  return String(title ?? '')
    .replaceAll(/[^a-zA-Z0-9 ]/g, '')
    .trim()
    .split(/\s+/)
    .map((w) => w.slice(0, 1).toUpperCase() + w.slice(1))
    .join('');
}

function normalizeFields(fields) {
  if (!Array.isArray(fields)) throw userError('`fields` must be an array.');
  return fields.map((f, idx) => normalizeField(f, idx));
}

function normalizeField(field, idx) {
  if (!field || typeof field !== 'object') throw userError(`fields[${idx}] must be an object.`);
  const component = String(field.component ?? '').trim();
  const name = String(field.name ?? '').trim();
  const label = String(field.label ?? '').trim();
  if (!component) throw userError(`fields[${idx}].component is required.`);
  if (!name) throw userError(`fields[${idx}].name is required.`);
  if (!label) throw userError(`fields[${idx}].label is required.`);

  // This is a known gotcha in XWalk/UE contexts; enforce early.
  if (name.includes('_')) throw userError(`fields[${idx}].name must not include underscores. Use camelCase (got: "${name}").`);

  const out = {
    component,
    name,
    label,
    ...(field.valueType ? { valueType: field.valueType } : {}),
    ...(field.value === undefined ? {} : { value: field.value }),
    ...(field.multi === undefined ? {} : { multi: Boolean(field.multi) }),
    ...(field.required === undefined ? {} : { required: Boolean(field.required) })
  };

  // Support container fields for multifields.
  if (component === 'container' && Array.isArray(field.fields)) {
    out.fields = normalizeFields(field.fields);
  }

  // Allow pass-through of common optional configs without making the generator too strict.
  const optionalKeys = ['description', 'validation', 'condition', 'options', 'readOnly', 'hidden'];
  for (const k of optionalKeys) {
    const v = field[k];
    if (v !== undefined) out[k] = v;
  }

  return out;
}

function userError(message) {
  const err = new Error(message);
  err.statusCode = 400;
  return err;
}

