const logger = require('../services/logger');

/**
 * Middleware per gestione centralizzata degli errori
 */
const errorHandler = (err, req, res, next) => {
  logger.error('Error occurred', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip
  });
  
  // Multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      error: 'File too large',
      message: 'Maximum file size is 10MB'
    });
  }
  
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({
      success: false,
      error: 'Unexpected field',
      message: 'Only "file" field is allowed'
    });
  }
  
  // Generic error
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' 
      ? 'An error occurred' 
      : err.stack
  });
};

module.exports = errorHandler;
