const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { createObjectCsvWriter } = require('csv-writer');

const DATA_DIR = path.join(__dirname, '../data');
const CSV_INPUT = path.join(DATA_DIR, 'Lemmi_forme_atliteg_updated.csv');
const CSV_BACKUP = path.join(DATA_DIR, 'Lemmi_forme_atliteg_updated.backup.csv');
const CSV_OUTPUT = path.join(DATA_DIR, 'Lemmi_forme_atliteg_updated.csv');
const GEOJSON_FILE = path.join(DATA_DIR, 'limits_IT_regions.geojson');

/**
 * Carica il mapping regioni dal file GeoJSON
 * @returns {Map<string, string>} Map con chiave=nome regione, valore=reg_istat_code
 */
function loadRegionMapping() {
  const geojsonData = JSON.parse(fs.readFileSync(GEOJSON_FILE, 'utf8'));
  const mapping = new Map();

  geojsonData.features.forEach(feature => {
    const { reg_name, reg_istat_code } = feature.properties;
    mapping.set(reg_name, reg_istat_code);
  });

  console.log(`✓ Caricato mapping di ${mapping.size} regioni dal GeoJSON`);
  return mapping;
}

/**
 * Legge il CSV e aggiunge il campo reg_istat_code
 */
async function updateCSV() {
  console.log('Inizio aggiornamento CSV con codici ISTAT regionali...\n');

  // Carica il mapping delle regioni
  const regionMapping = loadRegionMapping();

  // Backup del file originale
  console.log('Creazione backup...');
  fs.copyFileSync(CSV_INPUT, CSV_BACKUP);
  console.log(`✓ Backup creato: ${CSV_BACKUP}\n`);

  // Leggi tutte le righe del CSV
  const rows = [];
  const stats = {
    total: 0,
    withRegion: 0,
    withRegionCode: 0,
    unmappedRegions: new Set()
  };

  return new Promise((resolve, reject) => {
    fs.createReadStream(CSV_INPUT)
      .pipe(csv())
      .on('data', (row) => {
        stats.total++;

        // Inizializza il campo reg_istat_code vuoto
        row.reg_istat_code = '';

        // Se è una regione, cerca il codice ISTAT
        const tipoCollocazione = row['Tipo coll.Geografica'];
        const nomeRegione = row['Coll.Geografica'];

        if (tipoCollocazione === 'Regione') {
          stats.withRegion++;

          const regionCode = regionMapping.get(nomeRegione);
          if (regionCode) {
            row.reg_istat_code = regionCode;
            stats.withRegionCode++;
          } else {
            stats.unmappedRegions.add(nomeRegione);
            console.warn(`⚠ Regione non trovata nel mapping: "${nomeRegione}"`);
          }
        }

        rows.push(row);
      })
      .on('end', async () => {
        console.log('\n--- Statistiche Lettura CSV ---');
        console.log(`Righe totali: ${stats.total}`);
        console.log(`Righe con tipo "Regione": ${stats.withRegion}`);
        console.log(`Righe con reg_istat_code assegnato: ${stats.withRegionCode}`);

        if (stats.unmappedRegions.size > 0) {
          console.log(`\n⚠ Regioni non mappate (${stats.unmappedRegions.size}):`);
          stats.unmappedRegions.forEach(r => console.log(`  - ${r}`));
        }

        // Scrivi il nuovo CSV
        console.log('\nScrittura CSV aggiornato...');

        const csvWriter = createObjectCsvWriter({
          path: CSV_OUTPUT,
          header: [
            { id: 'IdLemma', title: 'IdLemma' },
            { id: 'Lemma', title: 'Lemma' },
            { id: 'Forma', title: 'Forma' },
            { id: 'Coll.Geografica', title: 'Coll.Geografica' },
            { id: 'Latitudine', title: 'Latitudine' },
            { id: 'Longitudine', title: 'Longitudine' },
            { id: 'Tipo coll.Geografica', title: 'Tipo coll.Geografica' },
            { id: 'Anno', title: 'Anno' },
            { id: 'Periodo', title: 'Periodo' },
            { id: 'IDPeriodo', title: 'IDPeriodo' },
            { id: 'Datazione', title: 'Datazione' },
            { id: 'Categoria', title: 'Categoria' },
            { id: 'Frequenza', title: 'Frequenza' },
            { id: 'URL', title: 'URL' },
            { id: 'IdAmbito', title: 'IdAmbito' },
            { id: 'reg_istat_code', title: 'reg_istat_code' }
          ]
        });

        try {
          await csvWriter.writeRecords(rows);
          console.log(`✓ CSV aggiornato salvato: ${CSV_OUTPUT}`);

          console.log('\n--- Riepilogo Codici ISTAT Assegnati ---');
          const regionCounts = new Map();
          rows.forEach(row => {
            if (row.reg_istat_code) {
              const count = regionCounts.get(row.reg_istat_code) || 0;
              regionCounts.set(row.reg_istat_code, count + 1);
            }
          });

          Array.from(regionCounts.entries())
            .sort((a, b) => a[0].localeCompare(b[0]))
            .forEach(([code, count]) => {
              const regionName = Array.from(regionMapping.entries())
                .find(([_, c]) => c === code)?.[0] || 'Sconosciuta';
              console.log(`  ${code} (${regionName}): ${count} record`);
            });

          console.log('\n✅ Aggiornamento completato con successo!');
          resolve(stats);
        } catch (error) {
          console.error('❌ Errore durante la scrittura del CSV:', error);
          reject(error);
        }
      })
      .on('error', (error) => {
        console.error('❌ Errore durante la lettura del CSV:', error);
        reject(error);
      });
  });
}

// Esegui lo script
if (require.main === module) {
  updateCSV().catch(error => {
    console.error('Errore fatale:', error);
    process.exit(1);
  });
}

module.exports = { updateCSV, loadRegionMapping };
