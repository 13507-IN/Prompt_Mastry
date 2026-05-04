function createMemoryRateLimiter({ windowMs, limit, keyPrefix = 'global' }) {
  const store = new Map();

  return function rateLimiter(req, res, next) {
    const key = `${keyPrefix}:${req.ip || req.socket?.remoteAddress || 'unknown'}`;
    const now = Date.now();
    const existing = store.get(key);

    if (!existing || existing.expiresAt <= now) {
      store.set(key, { count: 1, expiresAt: now + windowMs });
      return next();
    }

    if (existing.count >= limit) {
      const retryAfter = Math.ceil((existing.expiresAt - now) / 1000);
      res.setHeader('Retry-After', String(Math.max(1, retryAfter)));
      return res.status(429).json({
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many requests, please retry later.',
        },
      });
    }

    existing.count += 1;
    store.set(key, existing);
    return next();
  };
}

module.exports = {
  createMemoryRateLimiter,
};
