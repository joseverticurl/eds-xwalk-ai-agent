import { registerAdminRoutes } from './admin.js';
import { registerValidateRoutes } from './validate.js';
import { registerTransformRoutes } from './transform.js';
import { registerGenerateBlockRoutes } from './generate-block.js';
import { registerFigmaParseRoutes } from './figma-parse.js';

export function registerRoutes(app) {
  registerAdminRoutes(app);
  registerValidateRoutes(app);
  registerTransformRoutes(app);
  registerFigmaParseRoutes(app);
  registerGenerateBlockRoutes(app);
}

