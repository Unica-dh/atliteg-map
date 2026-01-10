const jwt = require('jsonwebtoken');
const logger = require('../services/logger');
const config = require('../config/config');

/**
 * Middleware per autenticazione admin con JWT
 */
const adminAuthMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>
  
  if (!token) {
    logger.warn('Admin access denied: missing token', { ip: req.ip, path: req.path });
    return res.status(401).json({ 
      error: 'Unauthorized',
      message: 'Missing authentication token' 
    });
  }
  
  try {
    const payload = jwt.verify(token, config.jwtSecret);
    
    // Verifica ruolo admin
    if (payload.role !== 'admin') {
      logger.warn('Admin access denied: insufficient permissions', { 
        ip: req.ip, 
        path: req.path,
        username: payload.username 
      });
      return res.status(403).json({ 
        error: 'Forbidden',
        message: 'Insufficient permissions' 
      });
    }
    
    req.user = payload;
    logger.info('Admin access granted', { 
      username: payload.username,
      ip: req.ip,
      path: req.path 
    });
    next();
    
  } catch (error) {
    logger.warn('Admin access denied: invalid token', { 
      ip: req.ip, 
      path: req.path,
      error: error.message 
    });
    return res.status(401).json({ 
      error: 'Unauthorized',
      message: 'Invalid or expired token' 
    });
  }
};

module.exports = adminAuthMiddleware;
