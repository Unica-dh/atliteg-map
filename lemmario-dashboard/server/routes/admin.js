const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const config = require('../config/config');
const csvProcessor = require('../services/csvProcessor');
const adminAuthMiddleware = require('../middleware/adminAuth');
const { uploadLimiter } = require('../middleware/rateLimit');
const logger = require('../services/logger');

const router = express.Router();

// POST /api/admin/login - Autenticazione admin
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Validazione input
    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'Username and password required' 
      });
    }
    
    // Verifica credenziali
    if (username !== config.adminUsername) {
      logger.warn('Login failed: invalid username', { username, ip: req.ip });
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid credentials' 
      });
    }
    
    // Supporta sia password in chiaro che hash bcrypt
    let validPassword = false;
    
    if (config.adminPassword) {
      // Se c'è ADMIN_PASSWORD (in chiaro), confronta direttamente
      validPassword = (password === config.adminPassword);
    } else {
      // Altrimenti usa l'hash bcrypt (ADMIN_PASSWORD_HASH)
      validPassword = await bcrypt.compare(password, config.adminPasswordHash);
    }
    
    if (!validPassword) {
      logger.warn('Login failed: invalid password', { username, ip: req.ip });
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid credentials' 
      });
    }
    
    // Genera JWT
    const token = jwt.sign(
      { 
        username, 
        role: 'admin',
        iat: Math.floor(Date.now() / 1000)
      },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );
    
    // Audit log
    logger.info('Admin login successful', { username, ip: req.ip });
    
    res.json({
      success: true,
      token,
      expiresIn: config.jwtExpiresIn,
      user: { username, role: 'admin' }
    });
    
  } catch (error) {
    logger.error('Login error', { error: error.message });
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

// Configurazione upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const safeFilename = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, `${timestamp}_${safeFilename}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: config.upload.maxFileSize,
    files: 1
  },
  fileFilter: (req, file, cb) => {
    // Accetta solo CSV
    const isValidMime = config.upload.allowedMimeTypes.includes(file.mimetype);
    const isValidExt = file.originalname.toLowerCase().endsWith('.csv');
    
    if (isValidMime || isValidExt) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'));
    }
  }
});

// POST /api/admin/upload - Upload CSV
router.post('/upload', 
  adminAuthMiddleware,
  uploadLimiter,
  upload.single('file'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'No file uploaded'
        });
      }
      
      const jobId = uuidv4();
      const uploadInfo = {
        jobId,
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        uploadedBy: req.user.username,
        uploadedAt: new Date().toISOString(),
        status: 'processing'
      };
      
      // Audit log
      logger.info('CSV upload received', uploadInfo);
      
      // Avvia processamento asincrono
      csvProcessor.processCSV(req.file.path, jobId)
        .then(result => {
          logger.info('CSV processing completed', { 
            jobId, 
            records: result.recordCount 
          });
        })
        .catch(error => {
          logger.error('CSV processing failed', { 
            jobId, 
            error: error.message 
          });
        });
      
      res.json({
        success: true,
        message: 'Upload successful, processing started',
        jobId,
        statusUrl: `/api/admin/status/${jobId}`
      });
      
    } catch (error) {
      logger.error('Upload error', { error: error.message });
      res.status(500).json({
        success: false,
        error: error.message || 'Upload failed'
      });
    }
  }
);

// GET /api/admin/status/:jobId - Verifica stato processamento
router.get('/status/:jobId', 
  adminAuthMiddleware,
  (req, res) => {
    try {
      const { jobId } = req.params;
      const status = csvProcessor.getJobStatus(jobId);
      
      if (status.status === 'not_found') {
        return res.status(404).json({
          success: false,
          error: 'Job not found'
        });
      }
      
      res.json({
        success: true,
        jobId,
        ...status
      });
      
    } catch (error) {
      logger.error('Status check error', { error: error.message });
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
);

module.exports = router;
