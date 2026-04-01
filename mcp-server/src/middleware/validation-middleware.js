export function requireJsonBody() {
  return (req, res, next) => {
    if (req.is('application/json')) return next();
    return res.status(415).json({ error: { message: 'Expected content-type: application/json' } });
  };
}

/**
 * Validate request body using a small schema.
 * Schema format:
 * - required: string[]
 * - properties: { [key]: { type?: 'string'|'number'|'boolean'|'object'|'array', minLength?: number } }
 */
export function validateBody(schema) {
  return (req, res, next) => {
    const body = req.body ?? {};

    const errors = [];
    const required = schema?.required ?? [];
    for (const key of required) {
      const v = body[key];
      if (v === undefined || v === null || (typeof v === 'string' && v.trim() === '')) {
        errors.push(`Missing \`${key}\``);
      }
    }

    const props = schema?.properties ?? {};
    for (const [key, rules] of Object.entries(props)) {
      const v = body[key];
      if (v === undefined || v === null) continue;

      const type = rules?.type;
      if (type && !matchesType(v, type)) {
        errors.push(`Invalid \`${key}\`: expected ${type}`);
        continue;
      }

      if (rules?.minLength !== undefined && typeof v === 'string' && v.length < rules.minLength) {
        errors.push(`Invalid \`${key}\`: must be at least ${rules.minLength} characters`);
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({ ok: false, errors });
    }

    return next();
  };
}

function matchesType(value, type) {
  switch (type) {
    case 'array':
      return Array.isArray(value);
    case 'object':
      return typeof value === 'object' && value !== null && !Array.isArray(value);
    default:
      return typeof value === type;
  }
}
