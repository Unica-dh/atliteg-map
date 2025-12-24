/**
 * Demo End-to-End - Simulazione completa del flusso
 *
 * Questo script dimostra come verrebbe utilizzato il campo reg_istat_code
 * in una applicazione reale, simulando:
 * 1. Caricamento dati CSV
 * 2. Caricamento GeoJSON regioni
 * 3. Filtro per lemma specifico
 * 4. Estrazione regioni da visualizzare
 * 5. Preparazione dati per la mappa
 */

const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const DATA_DIR = path.join(__dirname, '../data');
const CSV_FILE = path.join(DATA_DIR, 'Lemmi_forme_atliteg_updated.csv');
const GEOJSON_FILE = path.join(DATA_DIR, 'limits_IT_regions.geojson');

// Colori per l'output console
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
};

/**
 * Carica il GeoJSON delle regioni
 */
function loadRegionsGeoJSON() {
  const geojson = JSON.parse(fs.readFileSync(GEOJSON_FILE, 'utf8'));
  console.log(`${colors.green}✓${colors.reset} Caricato GeoJSON con ${geojson.features.length} regioni`);
  return geojson;
}

/**
 * Carica tutti i lemmi dal CSV
 */
async function loadLemmas() {
  const lemmas = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(CSV_FILE)
      .pipe(csv())
      .on('data', (row) => lemmas.push(row))
      .on('end', () => {
        console.log(`${colors.green}✓${colors.reset} Caricati ${lemmas.length} lemmi dal CSV`);
        resolve(lemmas);
      })
      .on('error', reject);
  });
}

/**
 * Simula una ricerca utente
 */
function searchLemmas(lemmas, searchTerm) {
  console.log(`\n${colors.cyan}${colors.bright}🔍 RICERCA: "${searchTerm}"${colors.reset}`);

  const results = lemmas.filter(l =>
    l.Lemma.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.Forma.toLowerCase().includes(searchTerm.toLowerCase())
  );

  console.log(`${colors.yellow}→${colors.reset} Trovati ${results.length} risultati`);
  return results;
}

/**
 * Estrae codici regionali unici dai risultati
 */
function extractRegionCodes(lemmas) {
  const codes = new Set();
  lemmas.forEach(l => {
    if (l.reg_istat_code && l.reg_istat_code.trim()) {
      codes.add(l.reg_istat_code);
    }
  });
  return Array.from(codes);
}

/**
 * Conta lemmi per regione
 */
function countByRegion(lemmas) {
  const counts = new Map();
  lemmas.forEach(l => {
    if (l.reg_istat_code) {
      const count = counts.get(l.reg_istat_code) || 0;
      counts.set(l.reg_istat_code, count + 1);
    }
  });
  return counts;
}

/**
 * Filtra le feature GeoJSON per i codici specificati
 */
function filterGeoJSONFeatures(geojson, codes) {
  return geojson.features.filter(f =>
    codes.includes(f.properties.reg_istat_code)
  );
}

/**
 * Prepara i dati per la visualizzazione mappa
 */
function prepareMapData(lemmas, regionFeatures) {
  const markers = [];
  const regions = [];

  // Prepara marker per città (con coordinate)
  lemmas.forEach(lemma => {
    if (lemma.Latitudine && lemma.Latitudine !== '#N/A') {
      markers.push({
        type: 'city',
        name: lemma['Coll.Geografica'],
        lemma: lemma.Lemma,
        forma: lemma.Forma,
        lat: parseFloat(lemma.Latitudine.replace(',', '.')),
        lng: parseFloat(lemma.Longitudine.replace(',', '.')),
        categoria: lemma.Categoria,
      });
    }
  });

  // Prepara confini regionali
  regionFeatures.forEach(feature => {
    regions.push({
      type: 'region',
      code: feature.properties.reg_istat_code,
      name: feature.properties.reg_name,
      geometry: feature.geometry,
    });
  });

  return { markers, regions };
}

/**
 * Visualizza i risultati in modo user-friendly
 */
function displayResults(searchTerm, results, regionCodes, geojson) {
  console.log(`\n${colors.bright}═══════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.bright}  RISULTATI PER: "${searchTerm}"${colors.reset}`);
  console.log(`${colors.bright}═══════════════════════════════════════════════${colors.reset}\n`);

  // Statistiche generali
  console.log(`${colors.blue}📊 Statistiche:${colors.reset}`);
  console.log(`   Totale risultati: ${results.length}`);

  const citiesCount = results.filter(r => r['Tipo coll.Geografica'] === 'Città').length;
  const regionsCount = results.filter(r => r['Tipo coll.Geografica'] === 'Regione').length;

  console.log(`   └─ Città: ${citiesCount}`);
  console.log(`   └─ Regioni: ${regionsCount}`);
  console.log(`   └─ Altri: ${results.length - citiesCount - regionsCount}`);

  // Regioni da visualizzare sulla mappa
  if (regionCodes.length > 0) {
    console.log(`\n${colors.magenta}🗺️  Regioni da visualizzare sulla mappa:${colors.reset}`);
    const regionCounts = countByRegion(results);

    regionCodes.forEach(code => {
      const feature = geojson.features.find(f => f.properties.reg_istat_code === code);
      const count = regionCounts.get(code) || 0;

      if (feature) {
        console.log(`   ${colors.green}▓${colors.reset} ${feature.properties.reg_name.padEnd(25)} [${code}] - ${count} lemmi`);
      }
    });
  } else {
    console.log(`\n${colors.yellow}⚠${colors.reset}  Nessuna regione da visualizzare`);
  }

  // Esempi di lemmi trovati
  console.log(`\n${colors.cyan}📝 Esempi di lemmi trovati:${colors.reset}`);
  results.slice(0, 5).forEach((lemma, i) => {
    const location = lemma['Coll.Geografica'];
    const tipo = lemma['Tipo coll.Geografica'];
    const regionCode = lemma.reg_istat_code || '-';

    console.log(`   ${i + 1}. "${lemma.Forma}" (${lemma.Lemma})`);
    console.log(`      └─ ${location} [${tipo}] ${regionCode !== '-' ? `[Codice: ${regionCode}]` : ''}`);
  });

  if (results.length > 5) {
    console.log(`   ... e altri ${results.length - 5} risultati`);
  }

  console.log(`\n${colors.bright}═══════════════════════════════════════════════${colors.reset}\n`);
}

/**
 * Simula preparazione dati per frontend
 */
function simulateFrontendPayload(results, regionFeatures) {
  const mapData = prepareMapData(results, regionFeatures);

  console.log(`${colors.yellow}📦 Dati preparati per il frontend:${colors.reset}`);
  console.log(`   Marker città: ${mapData.markers.length}`);
  console.log(`   Confini regionali: ${mapData.regions.length}`);

  if (mapData.markers.length > 0) {
    console.log(`\n   ${colors.cyan}Esempio marker città:${colors.reset}`);
    console.log(`   `, JSON.stringify(mapData.markers[0], null, 2).split('\n').join('\n    '));
  }

  if (mapData.regions.length > 0) {
    console.log(`\n   ${colors.magenta}Esempio confine regionale:${colors.reset}`);
    const example = { ...mapData.regions[0] };
    delete example.geometry; // Rimuovi geometry per brevità
    console.log(`   `, JSON.stringify(example, null, 2).split('\n').join('\n    '));
    console.log(`    ... (geometry omessa per brevità)`);
  }

  return mapData;
}

/**
 * Main demo function
 */
async function runDemo() {
  console.log(`\n${colors.bright}${colors.green}╔════════════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.bright}${colors.green}║  DEMO END-TO-END - INTEGRAZIONE CODICI REGIONALI      ║${colors.reset}`);
  console.log(`${colors.bright}${colors.green}╚════════════════════════════════════════════════════════╝${colors.reset}\n`);

  try {
    // 1. Carica dati
    console.log(`${colors.bright}Fase 1: Caricamento Dati${colors.reset}`);
    const geojson = loadRegionsGeoJSON();
    const allLemmas = await loadLemmas();

    // 2. Simula ricerche diverse
    const searchTerms = ['agliata', 'pasta', 'dolce'];

    for (const term of searchTerms) {
      const results = searchLemmas(allLemmas, term);

      if (results.length === 0) {
        console.log(`${colors.yellow}⚠${colors.reset} Nessun risultato trovato\n`);
        continue;
      }

      // 3. Estrai codici regionali
      const regionCodes = extractRegionCodes(results);

      // 4. Filtra GeoJSON
      const regionFeatures = filterGeoJSONFeatures(geojson, regionCodes);

      // 5. Mostra risultati
      displayResults(term, results, regionCodes, geojson);

      // 6. Prepara dati per frontend
      simulateFrontendPayload(results, regionFeatures);

      console.log(`\n${colors.bright}${'─'.repeat(60)}${colors.reset}\n`);
    }

    // Summary finale
    console.log(`${colors.bright}${colors.green}✅ DEMO COMPLETATA CON SUCCESSO${colors.reset}`);
    console.log(`\nQuesto dimostra come il frontend utilizzerà i codici ISTAT per:`);
    console.log(`  1. Identificare quali regioni sono presenti nei risultati`);
    console.log(`  2. Filtrare il GeoJSON per ottenere solo i confini necessari`);
    console.log(`  3. Visualizzare i confini sulla mappa insieme ai marker città`);
    console.log(`  4. Fornire statistiche e interazioni all'utente\n`);

  } catch (error) {
    console.error(`${colors.bright}❌ Errore:${colors.reset}`, error.message);
    process.exit(1);
  }
}

// Esegui la demo
if (require.main === module) {
  runDemo();
}

module.exports = { runDemo };
