const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    const xApiKey = req.headers['x-api-key'] || '';

    let token = '';
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.slice(7);
    } else if (authHeader) {
      token = authHeader;
    }

    const rawKey = token || xApiKey;

    if (!rawKey) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication credentials are required. Please provide a Bearer Token or API Key.'
        }
      });
    }

    const authServerUrl = process.env.RISHIRAJ_AUTH_URL || 'https://rishiraj-auth.onrender.com';

    // 1. Try local JWT verification if secret is available (fastest — no network call)
    if (process.env.JWT_ACCESS_SECRET) {
      try {
        const decoded = jwt.verify(rawKey, process.env.JWT_ACCESS_SECRET);
        if (decoded) {
          req.user = {
            userId: String(decoded.sub || decoded.userId || decoded.id),
            tenantId: decoded.tenantId,
            role: decoded.role,
            type: 'user_token'
          };
          return next();
        }
      } catch (_jwtErr) {
        // Secret mismatch or invalid token — fall through to remote verification
      }
    }

    // 2. Verify token via Rishiraj-Auth server (secure — no secret needed)
    try {
      const response = await fetch(`${authServerUrl}/auth/verify-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: rawKey })
      });

      if (response.ok) {
        const result = await response.json();
        if (result && result.valid && result.user) {
          req.user = {
            userId: result.user.userId,
            tenantId: result.user.tenantId,
            role: result.user.role || 'user',
            type: 'user_token'
          };
          return next();
        }
      }
    } catch (verifyErr) {
      console.error('Failed to verify token via Rishiraj-Auth /auth/verify-token:', verifyErr.message);
    }

    // 3. Validate as an API Key against Rishiraj-Auth server (for machine clients)
    try {
      const response = await fetch(`${authServerUrl}/api-keys/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${rawKey}`,
          'x-api-key': rawKey
        }
      });

      if (response.ok) {
        const result = await response.json();
        if (result && result.valid) {
          req.user = {
            userId: result.userId,
            tenantId: result.tenantId,
            keyId: result.keyId,
            name: result.name,
            type: 'api_key'
          };
          return next();
        }
      }
    } catch (fetchErr) {
      console.error('Failed to validate API key via Rishiraj-Auth:', fetchErr.message);
    }

    // All verification methods failed
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Invalid or expired Authentication credentials.'
      }
    });

  } catch (error) {
    console.error('Authentication middleware error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An internal error occurred during authentication.'
      }
    });
  }
};

module.exports = authMiddleware;
