function successEnvelope(data, meta) {
  if (meta && Object.keys(meta).length > 0) {
    return { success: true, data, meta };
  }
  return { success: true, data };
}

function errorEnvelope(code, message, details) {
  const payload = {
    success: false,
    error: {
      code,
      message,
    },
  };

  if (details !== undefined) {
    payload.error.details = details;
  }

  return payload;
}

function sendSuccess(res, data, status = 200, meta) {
  return res.status(status).json(successEnvelope(data, meta));
}

function sendError(res, opts = {}) {
  if (typeof opts === 'string') {
    console.error(
      '[DEPRECATED] sendError called with positional args (code, message) instead of { code, message, status, details }.',
      new Error().stack
    );
    const code = opts;
    const message = arguments[2] || 'Unknown error';
    return res.status(500).json(errorEnvelope(code, message, undefined));
  }

  const { status = 500, code = 'INTERNAL_ERROR', message = 'Internal server error', details } = opts;
  return res.status(status).json(errorEnvelope(code, message, details));
}

module.exports = {
  successEnvelope,
  errorEnvelope,
  sendSuccess,
  sendError,
};
