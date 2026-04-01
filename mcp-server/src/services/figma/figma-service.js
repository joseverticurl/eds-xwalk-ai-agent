import { getFigmaConfig } from '../../config/figma-config.js';

export class FigmaService {
  constructor({ env }) {
    this.config = getFigmaConfig(env);
  }

  async getFileStyles({ fileKey }) {
    // https://www.figma.com/developers/api#get-file-styles-endpoint
    return this.#getJson(`/v1/files/${encodeURIComponent(fileKey)}/styles`);
  }

  async getFileNodes({ fileKey, nodeIds }) {
    // https://www.figma.com/developers/api#get-file-nodes-endpoint
    const ids = Array.isArray(nodeIds) ? nodeIds : String(nodeIds).split(',').map((s) => s.trim()).filter(Boolean);
    const qs = new URLSearchParams({ ids: ids.join(',') });
    return this.#getJson(`/v1/files/${encodeURIComponent(fileKey)}/nodes?${qs.toString()}`);
  }

  async getStylesByKeys({ styleKeys }) {
    // https://www.figma.com/developers/api#get-styles-endpoint
    const keys = Array.isArray(styleKeys) ? styleKeys : [];
    const qs = new URLSearchParams({ ids: keys.join(',') });
    return this.#getJson(`/v1/styles?${qs.toString()}`);
  }

  async #getJson(path) {
    const url = `${this.config.apiBaseUrl}${path}`;
    const token = this.config.token;
    if (!token) {
      const err = new Error('FIGMA_TOKEN is not set. Set FIGMA_TOKEN in your environment to enable server-side Figma API calls.');
      err.statusCode = 400;
      throw err;
    }
    const res = await fetch(url, {
      headers: {
        'x-figma-token': token,
        accept: 'application/json'
      }
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      const err = new Error(`Figma API request failed (${res.status}): ${path}`);
      err.statusCode = res.status;
      err.details = text;
      throw err;
    }
    return await res.json();
  }
}

