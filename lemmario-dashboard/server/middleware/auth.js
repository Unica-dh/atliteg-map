const logger = require('../services/logger');
const config = require('../config/config');

/**
 * Middleware per autenticazione API key (frontend)
 */
const authMiddleware = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey) {
    logger.warn('API access denied: missing API key', { ip: req.ip, path: req.path });
    return res.status(401).json({ 
      error: 'Unauthorized',
      message: 'Missing API key' 
    });
  }
  
  if (!config.frontendApiKeys.includes(apiKey)) {
    logger.warn('API access denied: invalid API key', { ip: req.ip, path: req.path });
    return res.status(401).json({ 
      error: 'Unauthorized',
      message: 'Invalid API key' 
    });
  }
  
  // Log accesso (solo in debug mode per non loggare troppo)
  if (process.env.LOG_LEVEL === 'debug') {
    logger.debug('API access granted', {
      endpoint: req.path,
      ip: req.ip,
      apiKey: apiKey.substring(0, 8) + '...'
    });
  }
  
  next();
};

module.exports = authMiddleware;
