require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { prisma } = require('./prismaClient');
const { requestContext } = require('./middleware/requestContext');
const { sendSuccess, sendError } = require('./utils/apiResponse');

let helmet;
try {
  helmet = require('helmet');
} catch (_error) {
  helmet = null;
}

const app = express();

function getAllowedOrigins() {
  const values = [process.env.FRONTEND_URL, process.env.FRONTEND_URLS]
    .filter(Boolean)
    .flatMap((entry) => entry.split(','))
    .map((entry) => entry.trim())
    .filter(Boolean);

  if (values.length === 0) {
    return ['http://localhost:3000'];
  }

  return [...new Set(values)];
}

const allowedOrigins = getAllowedOrigins();

app.disable('x-powered-by');
app.use(requestContext);

if (helmet) {
  app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
    })
  );
} else {
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('Referrer-Policy', 'no-referrer');
    next();
  });
}

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('CORS origin not allowed'));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: process.env.REQUEST_BODY_LIMIT || '1mb' }));
app.use(express.urlencoded({ extended: true, limit: process.env.REQUEST_BODY_LIMIT || '1mb' }));

app.get('/_/backend/health/live', (_req, res) => {
  return sendSuccess(res, {
    status: 'ok',
    service: 'backend',
    timestamp: new Date().toISOString(),
  });
});

app.get('/_/backend/health/ready', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return sendSuccess(res, {
      status: 'ok',
      checks: {
        database: 'ok',
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return sendError(res, {
      status: 503,
      code: 'SERVICE_NOT_READY',
      message: 'Service readiness checks failed',
      details: {
        database: 'unavailable',
        reason: error?.message || 'Unknown database error',
      },
    });
  }
});

app.get('/_/backend/health', (_req, res) => {
  return sendSuccess(res, {
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/projects', require('./routes/projects'));
app.use('/api/questions', require('./routes/questions'));
app.use('/api/generate', require('./routes/generate'));

app.use((req, res) => {
  return sendError(res, {
    status: 404,
    code: 'ENDPOINT_NOT_FOUND',
    message: 'Endpoint not found',
    details: { path: req.path },
  });
});

app.use((err, req, res, _next) => {
  console.error('Server error:', err);

  if (err?.message === 'CORS origin not allowed') {
    return sendError(res, {
      status: 403,
      code: 'CORS_FORBIDDEN',
      message: 'Origin is not allowed',
      details: { origin: req.headers.origin || null },
    });
  }

  return sendError(res, {
    status: 500,
    code: 'INTERNAL_SERVER_ERROR',
    message: 'Internal server error',
    details: { reason: err?.message || 'Unknown error' },
  });
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Backend server running on port ${PORT}`);
    console.log(`CORS allowlist: ${allowedOrigins.join(', ')}`);
  });

  process.on('SIGTERM', async () => {
    console.log('SIGTERM received, shutting down gracefully');
    server.close(async () => {
      await prisma.$disconnect();
      process.exit(0);
    });
  });
}

module.exports = app;
