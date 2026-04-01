export function getAdminApiConfig(env) {
  return {
    baseUrl: (env.AEM_ADMIN_API_BASE_URL ?? 'https://admin.hlx.page').replace(/\/+$/, '')
  };
}

