import Papa from 'papaparse';
import type { Lemma, GeoArea } from '../types';
import type { FeatureCollection } from 'geojson';

/**
 * Carica e parsa il file CSV dei lemmi
 */
export async function loadLemmasCSV(csvPath: string): Promise<Lemma[]> {
  try {
    const response = await fetch(csvPath);
    const csvText = await response.text();

    return new Promise((resolve, reject) => {
      Papa.parse<any>(csvText, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        complete: (results) => {
          try {
            const lemmas = results.data.map((row: any) => {
              // Parsing delle coordinate - gestisce formato italiano con virgola
              let lat: number | undefined;
              let lng: number | undefined;
              
              if (row.Latitudine && row.Latitudine !== '#N/A') {
                const latStr = String(row.Latitudine).replace(',', '.');
                lat = parseFloat(latStr);
                if (isNaN(lat)) lat = undefined;
              }
              
              if (row.Longitudine && row.Longitudine !== '#N/A') {
                const lngStr = String(row.Longitudine).replace(',', '.');
                lng = parseFloat(lngStr);
                if (isNaN(lng)) lng = undefined;
              }
              
              return {
                IdLemma: parseInt(row.IdLemma) || 0,
                Lemma: row.Lemma || '',
                Forma: row.Forma || '',
                CollGeografica: row['Coll.Geografica'] || row.CollGeografica || '',
                Anno: parseInt(row.Anno) || 0,
                Periodo: row.Periodo || '',
                Categoria: row.Categoria || '',
                Frequenza: parseInt(row.Frequenza) || 0,
                URL: row.URL || '',
                IdAmbito: row.IdAmbito || undefined,
                lat,
                lng,
              };
            });
            resolve(lemmas.filter(l => l.IdLemma > 0)); // Filtra righe invalide
          } catch (error) {
            reject(new Error(`Errore nel parsing CSV: ${error}`));
          }
        },
        error: (error) => {
          reject(new Error(`Errore nel parsing CSV: ${error.message}`));
        },
      });
    });
  } catch (error) {
    throw new Error(`Errore nel caricamento CSV: ${error}`);
  }
}

/**
 * Carica e parsa il file GeoJSON delle aree geografiche
 */
export async function loadGeoAreasJSON(jsonPath: string): Promise<GeoArea[]> {
  try {
    const response = await fetch(jsonPath);
    const geoJson: FeatureCollection = await response.json();

    if (!geoJson.features) {
      throw new Error('GeoJSON non contiene features');
    }

    return geoJson.features.map((feature, index) => ({
      id: feature.properties?.id || feature.properties?.ID || `area-${index}`,
      name: feature.properties?.name || feature.properties?.nome || `Area ${index}`,
      geometry: feature.geometry,
      properties: feature.properties || {},
    }));
  } catch (error) {
    throw new Error(`Errore nel caricamento GeoJSON: ${error}`);
  }
}

/**
 * Normalizza le categorie multiple separate da virgola
 */
export function parseCategories(categoriaString: string): string[] {
  if (!categoriaString) return [];
  return categoriaString
    .split(',')
    .map(cat => cat.trim())
    .filter(cat => cat.length > 0);
}

/**
 * Estrae tutte le categorie uniche dal dataset
 */
export function extractUniqueCategories(lemmas: Lemma[]): string[] {
  const categoriesSet = new Set<string>();
  
  lemmas.forEach(lemma => {
    const categories = parseCategories(lemma.Categoria);
    categories.forEach(cat => categoriesSet.add(cat));
  });

  return Array.from(categoriesSet).sort();
}

/**
 * Estrae tutti i periodi unici dal dataset
 */
export function extractUniquePeriods(lemmas: Lemma[]): string[] {
  const periodsSet = new Set<string>();
  
  lemmas.forEach(lemma => {
    if (lemma.Periodo) {
      periodsSet.add(lemma.Periodo);
    }
  });

  return Array.from(periodsSet).sort();
}

/**
 * Mappa i lemmi con le aree geografiche utilizzando IdAmbito
 */
export function mapLemmasToGeoAreas(lemmas: Lemma[], geoAreas: GeoArea[]): Lemma[] {
  const geoAreaMap = new Map(geoAreas.map(area => [area.id, area]));

  return lemmas.map(lemma => {
    // Se il lemma ha IdAmbito, cerca l'area corrispondente
    if (lemma.IdAmbito && geoAreaMap.has(lemma.IdAmbito)) {
      // Il lemma è associato a un'area geografica poligonale
      return {
        ...lemma,
        // Potremmo calcolare un centroide per visualizzazione sommaria
        // ma per ora manteniamo solo il riferimento
      };
    }
    // Altrimenti è una località puntuale (lat/lng dovrebbero essere presenti)
    return lemma;
  });
}
