import { registerAdminRoutes } from './admin.js';
import { registerValidateRoutes } from './validate.js';
import { registerTransformRoutes } from './transform.js';

export function registerRoutes(app) {
  registerAdminRoutes(app);
  registerValidateRoutes(app);
  registerTransformRoutes(app);
}

