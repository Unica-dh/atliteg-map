const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const config = require('./config/config');
const logger = require('./services/logger');
const errorHandler = require('./middleware/errorHandler');
const dataRoutes = require('./routes/data');
const adminRoutes = require('./routes/admin');

const app = express();

// Middleware globali
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    if (config.allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      logger.warn('CORS blocked', { origin });
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Request logging
app.use((req, res, next) => {
  logger.info('Request received', {
    method: req.method,
    path: req.path,
    ip: req.ip,
    userAgent: req.get('user-agent')
  });
  next();
});

// Health check
app.get('/health', (req, res) => {
  const healthcheck = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    checks: {
      dataFiles: 'checking...'
    }
  };
  
  // Verifica esistenza file dati
  const dataPath = path.join(__dirname, 'data/lemmi.json');
  fs.access(dataPath, fs.constants.R_OK, (err) => {
    if (err) {
      healthcheck.checks.dataFiles = 'error';
      healthcheck.status = 'degraded';
      res.status(503).json(healthcheck);
    } else {
      healthcheck.checks.dataFiles = 'ok';
      res.status(200).json(healthcheck);
    }
  });
});

// Routes
app.use('/api', dataRoutes);
app.use('/api/admin', adminRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested endpoint does not exist'
  });
});

// Error handler (deve essere ultimo)
app.use(errorHandler);

// Start server
const PORT = config.port;
app.listen(PORT, '0.0.0.0', () => {
  logger.info(`🚀 Backend API started on port ${PORT}`);
  logger.info(`Environment: ${config.nodeEnv}`);
  logger.info(`Allowed origins: ${config.allowedOrigins.join(', ')}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});
