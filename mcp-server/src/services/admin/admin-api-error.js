export class AdminApiError extends Error {
  constructor(message, { status, details } = {}) {
    super(message);
    this.name = 'AdminApiError';
    this.statusCode = status ?? 500;
    this.details = details;
  }
}

