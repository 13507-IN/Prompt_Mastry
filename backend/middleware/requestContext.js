const crypto = require('crypto');

function requestContext(req, res, next) {
  const requestId = crypto.randomUUID();
  const startNs = process.hrtime.bigint();

  req.requestId = requestId;
  res.setHeader('x-request-id', requestId);

  res.on('finish', () => {
    const durationMs = Number(process.hrtime.bigint() - startNs) / 1_000_000;

    const line = {
      level: 'info',
      requestId,
      method: req.method,
      path: req.originalUrl || req.url,
      statusCode: res.statusCode,
      durationMs: Number(durationMs.toFixed(2)),
      ip: req.ip,
      timestamp: new Date().toISOString(),
    };

    console.log(JSON.stringify(line));
  });

  next();
}

module.exports = {
  requestContext,
};
