import { AdminApiError } from './admin-api-error.js';

/**
 * AEM Admin API client.
 *
 * Auth:
 * - Preferred: API key via `authorization: token <API_KEY>` (configured as apiKey)
 * - Alternative: cookie auth via `cookie: auth_token=<value>` (configured as authToken)
 *
 * Docs: https://www.aem.live/docs/admin.html
 */
export class AdminApiClient {
  constructor({ baseUrl, apiKey, authToken }) {
    if (!baseUrl) throw new Error('AdminApiClient requires baseUrl');
    this.baseUrl = baseUrl.replace(/\/+$/, '');
    this.apiKey = apiKey;
    this.authToken = authToken;
  }

  // ---- config (site) ----
  async readSiteConfig({ org, site }) {
    return this.#requestJson({
      method: 'GET',
      path: `/config/${encodeURIComponent(org)}/sites/${encodeURIComponent(site)}.json`
    });
  }

  async createSiteConfig({ org, site, config }) {
    return this.#requestJson({
      method: 'PUT',
      path: `/config/${encodeURIComponent(org)}/sites/${encodeURIComponent(site)}.json`,
      body: config
    });
  }

  async updateSiteConfig({ org, site, config, versionName, migrate, validate }) {
    const qs = new URLSearchParams();
    if (versionName) qs.set('versionName', versionName);
    if (typeof migrate === 'boolean') qs.set('migrate', String(migrate));
    if (typeof validate === 'boolean') qs.set('validate', String(validate));

    return this.#requestJson({
      method: 'POST',
      path: `/config/${encodeURIComponent(org)}/sites/${encodeURIComponent(site)}.json${qs.size ? `?${qs.toString()}` : ''}`,
      body: config
    });
  }

  async deleteSiteConfig({ org, site }) {
    await this.#requestRaw({
      method: 'DELETE',
      path: `/config/${encodeURIComponent(org)}/sites/${encodeURIComponent(site)}.json`
    });
  }

  // ---- operations (examples) ----
  async purgeLiveCache({ org, site, ref, path }) {
    return this.#requestJson({
      method: 'POST',
      path: `/cache/${encodeURIComponent(org)}/${encodeURIComponent(site)}/${encodeURIComponent(ref)}/${stripLeadingSlash(path)}`
    });
  }

  async previewUpdate({ org, site, ref, path, forceUpdateRedirects }) {
    const qs = new URLSearchParams();
    if (typeof forceUpdateRedirects === 'boolean') qs.set('forceUpdateRedirects', String(forceUpdateRedirects));
    return this.#requestJson({
      method: 'POST',
      path: `/preview/${encodeURIComponent(org)}/${encodeURIComponent(site)}/${encodeURIComponent(ref)}/${stripLeadingSlash(path)}${qs.size ? `?${qs.toString()}` : ''}`
    });
  }

  async livePublish({ org, site, ref, path, forceUpdateRedirects, disableNotifications }) {
    const qs = new URLSearchParams();
    if (typeof forceUpdateRedirects === 'boolean') qs.set('forceUpdateRedirects', String(forceUpdateRedirects));
    if (typeof disableNotifications === 'boolean') qs.set('disableNotifications', String(disableNotifications));
    return this.#requestJson({
      method: 'POST',
      path: `/live/${encodeURIComponent(org)}/${encodeURIComponent(site)}/${encodeURIComponent(ref)}/${stripLeadingSlash(path)}${qs.size ? `?${qs.toString()}` : ''}`
    });
  }

  async liveUnpublish({ org, site, ref, path, disableNotifications }) {
    const qs = new URLSearchParams();
    if (typeof disableNotifications === 'boolean') qs.set('disableNotifications', String(disableNotifications));
    await this.#requestRaw({
      method: 'DELETE',
      path: `/live/${encodeURIComponent(org)}/${encodeURIComponent(site)}/${encodeURIComponent(ref)}/${stripLeadingSlash(path)}${qs.size ? `?${qs.toString()}` : ''}`
    });
  }

  async sitemapGenerate({ org, site, ref, path }) {
    return this.#requestJson({
      method: 'POST',
      path: `/sitemap/${encodeURIComponent(org)}/${encodeURIComponent(site)}/${encodeURIComponent(ref)}/${stripLeadingSlash(path)}`
    });
  }

  async indexTrigger({ org, site, ref, path }) {
    return this.#requestJson({
      method: 'POST',
      path: `/index/${encodeURIComponent(org)}/${encodeURIComponent(site)}/${encodeURIComponent(ref)}/${stripLeadingSlash(path)}`
    });
  }

  async statusGet({ org, site, ref, path }) {
    return this.#requestJson({
      method: 'GET',
      path: `/status/${encodeURIComponent(org)}/${encodeURIComponent(site)}/${encodeURIComponent(ref)}/${stripLeadingSlash(path)}`
    });
  }

  // ---- low level ----
  async #requestJson({ method, path, body, headers }) {
    const res = await this.#requestRaw({ method, path, body, headers });
    if (res.status === 204) return null;
    const text = await res.text();
    if (!text) return null;
    try {
      return JSON.parse(text);
    } catch {
      throw new AdminApiError(`Expected JSON but got: ${text.slice(0, 200)}`, { status: res.status });
    }
  }

  async #requestRaw({ method, path, body, headers }) {
    const url = `${this.baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;
    const reqHeaders = new Headers(headers ?? {});

    if (!reqHeaders.has('accept')) reqHeaders.set('accept', 'application/json');

    const auth = this.#buildAuthHeaders();
    for (const [k, v] of Object.entries(auth)) reqHeaders.set(k, v);

    let reqBody = undefined;
    if (body !== undefined) {
      reqHeaders.set('content-type', 'application/json');
      reqBody = JSON.stringify(body);
    }

    const res = await fetch(url, { method, headers: reqHeaders, body: reqBody, redirect: 'manual' });
    if (res.ok) return res;

    const errText = await safeText(res);
    throw new AdminApiError(`Admin API request failed: ${method} ${path}`, {
      status: res.status,
      details: errText
    });
  }

  #buildAuthHeaders() {
    if (this.apiKey) {
      return { authorization: `token ${this.apiKey}` };
    }
    if (this.authToken) {
      return { cookie: `auth_token=${this.authToken}` };
    }
    return {};
  }
}

function stripLeadingSlash(path) {
  return String(path ?? '').replace(/^\/+/, '');
}

async function safeText(res) {
  try {
    return await res.text();
  } catch {
    return '';
  }
}

