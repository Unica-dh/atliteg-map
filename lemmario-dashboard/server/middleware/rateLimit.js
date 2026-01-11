const rateLimit = require('express-rate-limit');
const config = require('../config/config');

// Rate limit per API dati (frontend)
const dataApiLimiter = rateLimit({
  windowMs: config.rateLimit.dataApi.windowMs,
  max: config.rateLimit.dataApi.max,
  message: {
    error: 'Too Many Requests',
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limit per upload admin (più restrittivo)
const uploadLimiter = rateLimit({
  windowMs: config.rateLimit.uploadApi.windowMs,
  max: config.rateLimit.uploadApi.max,
  message: {
    error: 'Too Many Requests',
    message: 'Upload limit exceeded. Please wait before uploading again.'
  },
  skipSuccessfulRequests: false,
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { dataApiLimiter, uploadLimiter };
