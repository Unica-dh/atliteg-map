import { Lemma, GeoArea } from '@/types/lemma';

/**
 * Carica i dati da file JSON pre-processato
 * Vantaggi: nessun parsing client-side, JSON ottimizzato, più veloce del CSV
 * I file JSON vengono generati dallo script scripts/preprocess-data.js
 */
export async function loadCSVData(): Promise<Lemma[]> {
  try {
    const startTime = performance.now();
    const response = await fetch('/data/lemmi.json');

    if (!response.ok) {
      // Fallback al vecchio sistema se il file non esiste
      console.warn('⚠️ JSON pre-processato non trovato, usando CSV (lento)');
      return loadCSVLegacy();
    }

    const data = await response.json() as Lemma[];
    const endTime = performance.now();

    console.log(`✅ Dati JSON caricati: ${data.length} record in ${(endTime - startTime).toFixed(0)}ms`);

    return data;
  } catch (error) {
    console.error('Errore nel caricamento dei dati:', error);
    // Fallback
    return loadCSVLegacy();
  }
}

/**
 * Carica GeoJSON pre-processato
 */
export async function loadGeoJSON(): Promise<GeoArea[]> {
  try {
    const startTime = performance.now();
    const response = await fetch('/data/geojson.json');

    if (!response.ok) {
      // Fallback
      console.warn('⚠️ GeoJSON pre-processato non trovato, usando originale');
      return loadGeoJSONLegacy();
    }

    const data = await response.json() as GeoArea[];
    const endTime = performance.now();

    console.log(`✅ GeoJSON caricato: ${data.length} features in ${(endTime - startTime).toFixed(0)}ms`);

    return data;
  } catch (error) {
    console.error('Errore nel caricamento GeoJSON:', error);
    return loadGeoJSONLegacy();
  }
}

/**
 * Fallback: caricamento legacy con CSV (manteniamo per compatibilità)
 */
async function loadCSVLegacy(): Promise<Lemma[]> {
  const Papa = (await import('papaparse')).default;

  const response = await fetch('/data/Lemmi_forme_atliteg_updated.csv');
  const csvText = await response.text();

  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => {
        const headerMap: { [key: string]: string } = {
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
      complete: (results) => {
        resolve(results.data as Lemma[]);
      },
      error: (error: Error) => {
        reject(error);
      }
    });
  });
}

/**
 * Fallback: caricamento legacy GeoJSON
 */
async function loadGeoJSONLegacy(): Promise<GeoArea[]> {
  const response = await fetch('/data/Ambiti geolinguistici newline.json');
  const text = await response.text();

  const lines = text.trim().split('\n');
  const features: GeoArea[] = lines
    .filter(line => line.trim())
    .map(line => JSON.parse(line));

  return features;
}

export function parseCategorie(categoriaString: string): string[] {
  if (!categoriaString) return [];
  return categoriaString.split(',').map(cat => cat.trim()).filter(Boolean);
}

export function getUniqueCategorie(lemmi: Lemma[]): string[] {
  const categorieSet = new Set<string>();
  lemmi.forEach(lemma => {
    parseCategorie(lemma.Categoria).forEach(cat => categorieSet.add(cat));
  });
  return Array.from(categorieSet).sort();
}

export function getUniquePeriodi(lemmi: Lemma[]): string[] {
  const periodiSet = new Set<string>();
  lemmi.forEach(lemma => {
    if (lemma.Periodo) periodiSet.add(lemma.Periodo);
  });
  return Array.from(periodiSet).sort();
}

export function getUniqueAnni(lemmi: Lemma[]): string[] {
  const anniSet = new Set<string>();
  lemmi.forEach(lemma => {
    if (lemma.Anno) anniSet.add(lemma.Anno);
  });
  return Array.from(anniSet).sort();
}
