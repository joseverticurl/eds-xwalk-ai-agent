export function getServerConfig(env) {
  const port = Number.parseInt(env.PORT ?? '8787', 10);
  if (!Number.isFinite(port) || port <= 0) {
    throw new Error(`Invalid PORT: ${env.PORT}`);
  }

  return {
    port,
    jsonBodyLimit: env.JSON_BODY_LIMIT ?? '2mb'
  };
}

