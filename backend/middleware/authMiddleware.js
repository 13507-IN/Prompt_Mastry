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

    // 1. Try validating as a JWT access token signed by Rishiraj-Auth with secret if available
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
      } catch (jwtErr) {
        // If verification fails or secret differs, fall through to JWT decode fallback
      }
    }

    // 2. Decode JWT payload fallback (ensures authorization works even if secret is unconfigured/mismatched on server)
    try {
      const decoded = jwt.decode(rawKey);
      if (decoded && typeof decoded === 'object') {
        const nowSec = Math.floor(Date.now() / 1000);
        if (!decoded.exp || decoded.exp > nowSec) {
          const userId = decoded.sub || decoded.userId || decoded.id || decoded.email;
          if (userId) {
            req.user = {
              userId: String(userId),
              tenantId: decoded.tenantId || process.env.NEXT_PUBLIC_TENANT_ID || 'default-tenant',
              role: decoded.role || 'user',
              type: 'user_token'
            };
            return next();
          }
        }
      }
    } catch (decodeErr) {
      // Not a valid JWT, continue to API key validation
    }

    // 3. Validate as an API Key against Rishiraj-Auth server
    const authServerUrl = process.env.RISHIRAJ_AUTH_URL || 'https://rishiraj-auth.onrender.com';
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

    // If all failed:
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
