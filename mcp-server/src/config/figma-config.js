export function getFigmaConfig(env) {
  return {
    apiBaseUrl: (env.FIGMA_API_BASE_URL ?? 'https://api.figma.com').replace(/\/+$/, ''),
    token: env.FIGMA_TOKEN ?? ''
  };
}

