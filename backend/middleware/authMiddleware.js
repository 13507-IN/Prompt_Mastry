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

    // 1. Try validating as a JWT access token signed by Rishiraj-Auth
    if (process.env.JWT_ACCESS_SECRET) {
      try {
        const decoded = jwt.verify(rawKey, process.env.JWT_ACCESS_SECRET, {
          issuer: 'auth-system',
          audience: 'auth-system-users'
        });

        if (decoded) {
          req.user = {
            userId: decoded.sub,
            tenantId: decoded.tenantId,
            role: decoded.role,
            type: 'user_token'
          };
          return next();
        }
      } catch (jwtErr) {
        // If it's a JWT but has expired or is invalid, do NOT fail immediately; it might be an API Key instead.
      }
    }

    // 2. Validate as an API Key against Rishiraj-Auth server
    const authServerUrl = process.env.RISHIRAJ_AUTH_URL || 'http://localhost:4000';
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
      console.error('Failed to communicate with Rishiraj-Auth server for key validation:', fetchErr);
    }

    // If both failed:
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
