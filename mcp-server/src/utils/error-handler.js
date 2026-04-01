export function errorHandler({ log }) {
  return (err, req, res, next) => {
    const status = err?.statusCode ?? err?.status ?? 500;

    const payload = {
      error: {
        message: err?.message ?? 'Unknown error',
        status
      }
    };

    if (status >= 500) {
      log?.error?.('request failed', {
        status,
        method: req.method,
        path: req.path,
        message: err?.message,
        stack: err?.stack
      });
    }

    res.status(status).json(payload);
    next?.();
  };
}

