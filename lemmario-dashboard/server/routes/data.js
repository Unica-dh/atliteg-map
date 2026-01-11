const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const authMiddleware = require('../middleware/auth');
const { dataApiLimiter } = require('../middleware/rateLimit');
const logger = require('../services/logger');

const router = express.Router();

// GET /api/lemmi - Recupero dati lemmi
router.get('/lemmi', 
  authMiddleware,
  dataApiLimiter,
  async (req, res) => {
    try {
      const dataPath = path.join(__dirname, '../data/lemmi.json');
      const data = await fs.readFile(dataPath, 'utf-8');
      
      // Parse e ritorna
      const lemmi = JSON.parse(data);
      
      res.json(lemmi);
      
    } catch (error) {
      logger.error('Error loading lemmi data', { error: error.message });
      res.status(500).json({ 
        error: 'Failed to load data',
        message: 'Internal server error'
      });
    }
  }
);

// GET /api/geojson - Recupero dati GeoJSON
router.get('/geojson', 
  authMiddleware,
  dataApiLimiter,
  async (req, res) => {
    try {
      const dataPath = path.join(__dirname, '../data/geojson.json');
      const data = await fs.readFile(dataPath, 'utf-8');
      
      const geojson = JSON.parse(data);
      
      res.json(geojson);
      
    } catch (error) {
      logger.error('Error loading geojson data', { error: error.message });
      res.status(500).json({ 
        error: 'Failed to load data',
        message: 'Internal server error'
      });
    }
  }
);

// GET /api/regions - Recupero dati regioni italiane
router.get('/regions', 
  authMiddleware,
  dataApiLimiter,
  async (req, res) => {
    try {
      const dataPath = path.join(__dirname, '../data/limits_IT_regions.geojson');
      const data = await fs.readFile(dataPath, 'utf-8');
      
      const regions = JSON.parse(data);
      
      res.json(regions);
      
    } catch (error) {
      logger.error('Error loading regions data', { error: error.message });
      res.status(500).json({ 
        error: 'Failed to load data',
        message: 'Internal server error'
      });
    }
  }
);

module.exports = router;
