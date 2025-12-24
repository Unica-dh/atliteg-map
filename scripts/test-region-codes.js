const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const DATA_DIR = path.join(__dirname, '../data');
const CSV_FILE = path.join(DATA_DIR, 'Lemmi_forme_atliteg_updated.csv');
const GEOJSON_FILE = path.join(DATA_DIR, 'limits_IT_regions.geojson');

/**
 * Carica tutti i codici ISTAT validi dal GeoJSON
 */
function loadValidRegionCodes() {
  const geojsonData = JSON.parse(fs.readFileSync(GEOJSON_FILE, 'utf8'));
  const validCodes = new Set();
  const codeToName = new Map();

  geojsonData.features.forEach(feature => {
    const { reg_name, reg_istat_code } = feature.properties;
    validCodes.add(reg_istat_code);
    codeToName.set(reg_istat_code, reg_name);
  });

  return { validCodes, codeToName };
}

/**
 * Esegue tutti i test sul CSV aggiornato
 */
async function runTests() {
  console.log('🧪 INIZIO TEST VALIDAZIONE CODICI REGIONALI\n');

  const { validCodes, codeToName } = loadValidRegionCodes();
  console.log(`✓ Caricati ${validCodes.size} codici ISTAT validi dal GeoJSON\n`);

  const tests = {
    totalRows: 0,
    regionRows: 0,
    regionRowsWithCode: 0,
    regionRowsWithoutCode: 0,
    nonRegionRows: 0,
    nonRegionRowsWithCode: 0,
    invalidCodes: [],
    regionCodeDistribution: new Map(),
    errors: []
  };

  return new Promise((resolve, reject) => {
    fs.createReadStream(CSV_FILE)
      .pipe(csv())
      .on('data', (row) => {
        tests.totalRows++;

        const tipoCollocazione = row['Tipo coll.Geografica'];
        const regionCode = row.reg_istat_code || '';
        const nomeRegione = row['Coll.Geografica'];

        // Test 1: Tutte le righe con tipo "Regione" devono avere un codice
        if (tipoCollocazione === 'Regione') {
          tests.regionRows++;

          if (regionCode) {
            tests.regionRowsWithCode++;

            // Test 2: Il codice deve essere valido
            if (!validCodes.has(regionCode)) {
              tests.invalidCodes.push({
                row: tests.totalRows,
                regione: nomeRegione,
                code: regionCode
              });
              tests.errors.push(`Riga ${tests.totalRows}: Codice ISTAT non valido "${regionCode}" per regione "${nomeRegione}"`);
            }

            // Conta la distribuzione
            const count = tests.regionCodeDistribution.get(regionCode) || 0;
            tests.regionCodeDistribution.set(regionCode, count + 1);
          } else {
            tests.regionRowsWithoutCode++;
            tests.errors.push(`Riga ${tests.totalRows}: Regione "${nomeRegione}" senza codice ISTAT`);
          }
        } else {
          // Test 3: Le righe NON-regione NON devono avere codice
          tests.nonRegionRows++;
          if (regionCode) {
            tests.nonRegionRowsWithCode++;
            tests.errors.push(`Riga ${tests.totalRows}: Tipo "${tipoCollocazione}" ha codice regionale "${regionCode}" (dovrebbe essere vuoto)`);
          }
        }
      })
      .on('end', () => {
        console.log('--- RISULTATI TEST ---\n');

        // Test 1: Conteggio righe
        console.log('📊 Test 1: Conteggio Righe');
        console.log(`  Totale righe: ${tests.totalRows}`);
        console.log(`  Righe con tipo "Regione": ${tests.regionRows}`);
        console.log(`  Righe "Regione" con codice: ${tests.regionRowsWithCode}`);
        console.log(`  Righe "Regione" senza codice: ${tests.regionRowsWithoutCode}`);

        const test1Pass = tests.regionRowsWithoutCode === 0;
        console.log(`  ${test1Pass ? '✅' : '❌'} ${test1Pass ? 'PASS' : 'FAIL'}: Tutte le regioni hanno un codice\n`);

        // Test 2: Validità codici
        console.log('🔍 Test 2: Validità Codici ISTAT');
        console.log(`  Codici non validi trovati: ${tests.invalidCodes.length}`);

        const test2Pass = tests.invalidCodes.length === 0;
        console.log(`  ${test2Pass ? '✅' : '❌'} ${test2Pass ? 'PASS' : 'FAIL'}: Tutti i codici sono validi\n`);

        if (!test2Pass) {
          console.log('  Dettagli codici non validi:');
          tests.invalidCodes.forEach(({ row, regione, code }) => {
            console.log(`    Riga ${row}: "${regione}" → "${code}"`);
          });
          console.log('');
        }

        // Test 3: Righe non-regione
        console.log('🚫 Test 3: Righe Non-Regione');
        console.log(`  Totale righe non-regione: ${tests.nonRegionRows}`);
        console.log(`  Righe non-regione con codice (errore): ${tests.nonRegionRowsWithCode}`);

        const test3Pass = tests.nonRegionRowsWithCode === 0;
        console.log(`  ${test3Pass ? '✅' : '❌'} ${test3Pass ? 'PASS' : 'FAIL'}: Nessuna riga non-regione ha codice\n`);

        // Test 4: Distribuzione codici
        console.log('📈 Test 4: Distribuzione Codici per Regione');
        const sortedDistribution = Array.from(tests.regionCodeDistribution.entries())
          .sort((a, b) => a[0].localeCompare(b[0]));

        sortedDistribution.forEach(([code, count]) => {
          const regionName = codeToName.get(code) || 'Sconosciuta';
          console.log(`  ${code} - ${regionName.padEnd(25)} ${count} record`);
        });

        const test4Pass = tests.regionCodeDistribution.size > 0;
        console.log(`  ${test4Pass ? '✅' : '❌'} ${test4Pass ? 'PASS' : 'FAIL'}: Almeno una regione mappata\n`);

        // Test 5: Numero totale righe invariato
        console.log('🔢 Test 5: Integrità Dati');
        const expectedRows = 6236; // 6237 totale - 1 header
        console.log(`  Righe attese: ${expectedRows}`);
        console.log(`  Righe trovate: ${tests.totalRows}`);

        const test5Pass = tests.totalRows === expectedRows;
        console.log(`  ${test5Pass ? '✅' : '❌'} ${test5Pass ? 'PASS' : 'FAIL'}: Numero di righe corretto\n`);

        // Riepilogo finale
        console.log('\n--- RIEPILOGO ---');
        const allTestsPass = test1Pass && test2Pass && test3Pass && test4Pass && test5Pass;

        if (allTestsPass) {
          console.log('✅ TUTTI I TEST SUPERATI!');
          console.log('\nIl CSV è stato aggiornato correttamente con i codici ISTAT regionali.');
          console.log('I lemmi delle 5 regioni presenti possono ora essere visualizzati sulla mappa.');
        } else {
          console.log('❌ ALCUNI TEST FALLITI');
          console.log(`\nTotale errori: ${tests.errors.length}`);

          if (tests.errors.length > 0 && tests.errors.length <= 10) {
            console.log('\nPrimi errori:');
            tests.errors.slice(0, 10).forEach(err => console.log(`  - ${err}`));
          }
        }

        console.log('\n--- STATISTICHE FINALI ---');
        console.log(`Regioni con dati: ${tests.regionCodeDistribution.size}/20 regioni italiane`);
        console.log(`Record regionali totali: ${tests.regionRowsWithCode}`);
        console.log(`Percentuale copertura: ${((tests.regionCodeDistribution.size / 20) * 100).toFixed(1)}%`);

        resolve({
          allTestsPass,
          tests,
          summary: {
            totalRows: tests.totalRows,
            regionRows: tests.regionRows,
            regionsCovered: tests.regionCodeDistribution.size,
            errorCount: tests.errors.length
          }
        });
      })
      .on('error', (error) => {
        console.error('❌ Errore durante la lettura del CSV:', error);
        reject(error);
      });
  });
}

// Esegui i test
if (require.main === module) {
  runTests()
    .then(result => {
      process.exit(result.allTestsPass ? 0 : 1);
    })
    .catch(error => {
      console.error('Errore fatale:', error);
      process.exit(1);
    });
}

module.exports = { runTests, loadValidRegionCodes };
