require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { prisma } = require('./prismaClient');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Health check endpoint
app.get('/_/backend/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/projects', require('./routes/projects'));
app.use('/api/questions', require('./routes/questions'));
app.use('/api/generate', require('./routes/generate'));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found', path: req.path });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    error: err.message || 'Internal server error',
    code: err.code || null
  });
});

const PORT = process.env.PORT || 5000;

// Only listen in development (when not running on Vercel)
if (process.env.NODE_ENV !== 'production') {
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Backend Server running on port ${PORT}`);
    console.log(`CORS origin: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  });

  // Handle graceful shutdown
  process.on('SIGTERM', async () => {
    console.log('SIGTERM received, shutting down gracefully...');
    server.close(async () => {
      await prisma.$disconnect();
      process.exit(0);
    });
  });
}

// Export app for Vercel serverless/services
module.exports = app;
