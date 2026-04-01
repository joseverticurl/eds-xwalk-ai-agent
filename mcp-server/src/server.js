import 'dotenv/config';
import express from 'express';

import { errorHandler } from './utils/error-handler.js';
import { createLogger } from './utils/logger.js';
import { getServerConfig } from './config/server-config.js';

import { registerRoutes } from './routes/index.js';

const log = createLogger({ name: 'server' });
const config = getServerConfig(process.env);

const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: config.jsonBodyLimit }));

app.get('/healthz', (req, res) => res.status(200).json({ ok: true }));

registerRoutes(app);

app.use(errorHandler({ log }));

app.listen(config.port, () => {
  log.info(`listening on port ${config.port}`);
});