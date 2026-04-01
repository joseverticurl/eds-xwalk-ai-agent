import { registerAdminRoutes } from './admin.js';
import { registerValidateRoutes } from './validate.js';
import { registerTransformRoutes } from './transform.js';
import { registerGenerateBlockRoutes } from './generate-block.js';

export function registerRoutes(app) {
  registerAdminRoutes(app);
  registerValidateRoutes(app);
  registerTransformRoutes(app);
  registerGenerateBlockRoutes(app);
}

