import { AdminApiClient } from '../services/admin/admin-api-client.js';
import { getAdminApiConfig } from '../config/admin-api-config.js';

/**
 * Minimal REST wrapper around AEM Admin API.
 * This is used both for debugging and for MCP tool handlers.
 */
export function registerAdminRoutes(app) {
  app.post('/admin/status/get', async (req, res, next) => {
    try {
      const client = createClient(req);
      const { org, site, ref, path } = req.body ?? {};
      const data = await client.statusGet({ org, site, ref, path });
      res.json(data);
    } catch (e) {
      next(e);
    }
  });

  app.post('/admin/preview/update', async (req, res, next) => {
    try {
      const client = createClient(req);
      const { org, site, ref, path, forceUpdateRedirects } = req.body ?? {};
      const data = await client.previewUpdate({ org, site, ref, path, forceUpdateRedirects });
      res.json(data);
    } catch (e) {
      next(e);
    }
  });

  app.post('/admin/live/publish', async (req, res, next) => {
    try {
      const client = createClient(req);
      const { org, site, ref, path, forceUpdateRedirects, disableNotifications } = req.body ?? {};
      const data = await client.livePublish({ org, site, ref, path, forceUpdateRedirects, disableNotifications });
      res.json(data);
    } catch (e) {
      next(e);
    }
  });

  app.post('/admin/live/unpublish', async (req, res, next) => {
    try {
      const client = createClient(req);
      const { org, site, ref, path, disableNotifications } = req.body ?? {};
      await client.liveUnpublish({ org, site, ref, path, disableNotifications });
      res.status(204).end();
    } catch (e) {
      next(e);
    }
  });

  app.post('/admin/cache/purge', async (req, res, next) => {
    try {
      const client = createClient(req);
      const { org, site, ref, path } = req.body ?? {};
      const data = await client.purgeLiveCache({ org, site, ref, path });
      res.json(data);
    } catch (e) {
      next(e);
    }
  });

  app.post('/admin/index/trigger', async (req, res, next) => {
    try {
      const client = createClient(req);
      const { org, site, ref, path } = req.body ?? {};
      const data = await client.indexTrigger({ org, site, ref, path });
      res.json(data);
    } catch (e) {
      next(e);
    }
  });

  app.post('/admin/sitemap/generate', async (req, res, next) => {
    try {
      const client = createClient(req);
      const { org, site, ref, path } = req.body ?? {};
      const data = await client.sitemapGenerate({ org, site, ref, path });
      res.json(data);
    } catch (e) {
      next(e);
    }
  });

  app.post('/admin/site-config/read', async (req, res, next) => {
    try {
      const client = createClient(req);
      const { org, site } = req.body ?? {};
      const data = await client.readSiteConfig({ org, site });
      res.json(data);
    } catch (e) {
      next(e);
    }
  });

  app.post('/admin/site-config/create', async (req, res, next) => {
    try {
      const client = createClient(req);
      const { org, site, config } = req.body ?? {};
      const data = await client.createSiteConfig({ org, site, config });
      res.status(201).json(data);
    } catch (e) {
      next(e);
    }
  });

  app.post('/admin/site-config/update', async (req, res, next) => {
    try {
      const client = createClient(req);
      const { org, site, config, versionName, migrate, validate } = req.body ?? {};
      const data = await client.updateSiteConfig({ org, site, config, versionName, migrate, validate });
      res.json(data);
    } catch (e) {
      next(e);
    }
  });

  app.post('/admin/site-config/delete', async (req, res, next) => {
    try {
      const client = createClient(req);
      const { org, site } = req.body ?? {};
      await client.deleteSiteConfig({ org, site });
      res.status(204).end();
    } catch (e) {
      next(e);
    }
  });
}

function createClient(req) {
  const baseUrl = getAdminApiConfig(process.env).baseUrl;
  const { apiKey, authToken } = req.body ?? {};
  const headerApiKey = req.get('x-admin-api-key');
  const headerAuthToken = req.get('x-admin-auth-token');

  return new AdminApiClient({
    baseUrl,
    apiKey: apiKey ?? headerApiKey ?? undefined,
    authToken: authToken ?? headerAuthToken ?? undefined
  });
}

