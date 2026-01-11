const Papa = require('papaparse');
const fs = require('fs').promises;
const path = require('path');
const logger = require('./logger');

class CSVProcessor {
  constructor() {
    this.jobs = new Map(); // In-memory job tracking
  }
  
  async processCSV(csvFilePath, jobId) {
    const startTime = Date.now();
    
    try {
      // Update job status
      this.jobs.set(jobId, {
        status: 'processing',
        startedAt: new Date().toISOString()
      });
      
      logger.info('Starting CSV processing', { jobId, csvFilePath });
      
      // Leggi CSV
      const csvContent = await fs.readFile(csvFilePath, 'utf-8');
      
      // Parse CSV (same logic as preprocessing script)
      const result = await new Promise((resolve, reject) => {
        Papa.parse(csvContent, {
          header: true,
          skipEmptyLines: true,
          transformHeader: (header) => {
            const headerMap = {
              'IdLemma': 'IdLemma',
              'Lemma': 'Lemma',
              'Forma': 'Forma',
              'Coll.Geografica': 'CollGeografica',
              'Latitudine': 'Latitudine',
              'Longitudine': 'Longitudine',
              'Tipo coll.Geografica': 'TipoCollGeografica',
              'Anno': 'Anno',
              'Periodo': 'Periodo',
              'IDPeriodo': 'IDPeriodo',
              'Datazione': 'Datazione',
              'Categoria': 'Categoria',
              'Frequenza': 'Frequenza',
              'URL': 'URL',
              'IdAmbito': 'IdAmbito',
              'reg_istat_code': 'RegionIstatCode',
            };
            return headerMap[header] || header;
          },
          complete: (results) => resolve(results),
          error: (error) => reject(error)
        });
      });
      
      const lemmi = result.data;
      const warnings = [];
      
      // Validazione base
      if (lemmi.length === 0) {
        throw new Error('CSV file is empty');
      }
      
      logger.info('CSV parsed successfully', { jobId, recordCount: lemmi.length });
      
      // Salva JSON ottimizzato
      const outputPath = path.join(__dirname, '../data/lemmi.json');
      await fs.writeFile(outputPath, JSON.stringify(lemmi, null, 0));
      
      logger.info('JSON file written', { jobId, outputPath });
      
      // Backup CSV originale
      const backupDir = path.join(__dirname, '../uploads/backup');
      await fs.mkdir(backupDir, { recursive: true });
      const backupPath = path.join(backupDir, `${jobId}_${path.basename(csvFilePath)}`);
      await fs.copyFile(csvFilePath, backupPath);
      
      logger.info('CSV backed up', { jobId, backupPath });
      
      // Rimuovi CSV temporaneo
      await fs.unlink(csvFilePath);
      
      const endTime = Date.now();
      const duration = Math.round((endTime - startTime) / 1000);
      
      // Update job status
      const jobResult = {
        status: 'completed',
        startedAt: this.jobs.get(jobId).startedAt,
        completedAt: new Date().toISOString(),
        duration: `${duration}s`,
        recordCount: lemmi.length,
        warnings,
        output: {
          lemmiJson: outputPath,
          recordCount: lemmi.length
        }
      };
      
      this.jobs.set(jobId, jobResult);
      
      logger.info('CSV processing completed', { jobId, ...jobResult });
      
      return jobResult;
      
    } catch (error) {
      // Update job status
      const failedStatus = {
        status: 'failed',
        error: error.message,
        startedAt: this.jobs.get(jobId)?.startedAt,
        failedAt: new Date().toISOString()
      };
      
      this.jobs.set(jobId, failedStatus);
      
      logger.error('CSV processing failed', { jobId, error: error.message, stack: error.stack });
      throw error;
    }
  }
  
  getJobStatus(jobId) {
    return this.jobs.get(jobId) || { status: 'not_found' };
  }
}

module.exports = new CSVProcessor();
