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

function sendError(res, { status = 500, code = 'INTERNAL_ERROR', message = 'Internal server error', details } = {}) {
  return res.status(status).json(errorEnvelope(code, message, details));
}

module.exports = {
  successEnvelope,
  errorEnvelope,
  sendSuccess,
  sendError,
};
