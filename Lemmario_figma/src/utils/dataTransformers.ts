/**
 * Utility per trasformazioni e normalizzazioni dati
 */

import type { Lemma, GeoArea } from '../types';

/**
 * Normalizza un lemma assicurando che tutti i campi siano validi
 * @param rawLemma - Dati grezzi del lemma
 * @returns Lemma normalizzato
 */
export function normalizeLemma(rawLemma: any): Lemma | null {
  try {
    // Validazione campi obbligatori
    if (!rawLemma.IdLemma || !rawLemma.Lemma) {
      return null;
    }

    return {
      IdLemma: parseInt(rawLemma.IdLemma) || 0,
      Lemma: String(rawLemma.Lemma).trim(),
      Forma: String(rawLemma.Forma || rawLemma.Lemma).trim(),
      CollGeografica: String(rawLemma['Coll.Geografica'] || rawLemma.CollGeografica || '').trim(),
      Anno: parseInt(rawLemma.Anno) || 0,
      Periodo: String(rawLemma.Periodo || '').trim(),
      Categoria: String(rawLemma.Categoria || '').trim(),
      Frequenza: parseInt(rawLemma.Frequenza) || 0,
      URL: String(rawLemma.URL || '').trim(),
      IdAmbito: rawLemma.IdAmbito ? String(rawLemma.IdAmbito).trim() : undefined,
      lat: rawLemma.lat ? parseFloat(rawLemma.lat) : undefined,
      lng: rawLemma.lng ? parseFloat(rawLemma.lng) : undefined,
    };
  } catch (error) {
    console.error('Errore normalizzazione lemma:', error);
    return null;
  }
}

/**
 * Mappa un lemma con una GeoArea usando IdAmbito
 * @param lemma - Lemma da mappare
 * @param geoAreas - Array di aree geografiche
 * @returns Lemma con coordinate dal centroide del poligono se trovato
 */
export function mapLemmaToGeoArea(lemma: Lemma, geoAreas: GeoArea[]): Lemma {
  // Se il lemma ha già coordinate, non fare nulla
  if (lemma.lat !== undefined && lemma.lng !== undefined) {
    return lemma;
  }

  // Se non ha IdAmbito, non possiamo mapparlo
  if (!lemma.IdAmbito) {
    return lemma;
  }

  // Cerca la GeoArea corrispondente
  const geoArea = geoAreas.find(area => area.id === lemma.IdAmbito);
  if (!geoArea) {
    return lemma;
  }

  // Calcola il centroide del poligono (semplificato)
  const centroid = calculateCentroid(geoArea.geometry);
  
  return {
    ...lemma,
    lat: centroid.lat,
    lng: centroid.lng,
  };
}

/**
 * Calcola il centroide di una geometria GeoJSON
 * @param geometry - Geometria GeoJSON
 * @returns Coordinate del centroide
 */
function calculateCentroid(geometry: any): { lat: number; lng: number } {
  // Gestione semplificata per Polygon e MultiPolygon
  let coordinates: number[][][] = [];

  if (geometry.type === 'Polygon') {
    coordinates = [geometry.coordinates[0]]; // Solo l'anello esterno
  } else if (geometry.type === 'MultiPolygon') {
    coordinates = geometry.coordinates.map((poly: number[][][]) => poly[0]);
  } else {
    // Default fallback
    return { lat: 42.5, lng: 12.5 };
  }

  // Calcola la media delle coordinate
  let totalLat = 0;
  let totalLng = 0;
  let count = 0;

  coordinates.forEach(ring => {
    ring.forEach(coord => {
      totalLng += coord[0];
      totalLat += coord[1];
      count++;
    });
  });

  return {
    lat: totalLat / count,
    lng: totalLng / count,
  };
}

/**
 * Raggruppa lemmi per località
 * @param lemmas - Array di lemmi
 * @returns Map con località come chiave e array di lemmi come valore
 */
export function groupLemmasByLocation(lemmas: Lemma[]): Map<string, Lemma[]> {
  const groups = new Map<string, Lemma[]>();

  lemmas.forEach(lemma => {
    const location = lemma.CollGeografica || 'Sconosciuta';
    const existing = groups.get(location) || [];
    groups.set(location, [...existing, lemma]);
  });

  return groups;
}

/**
 * Raggruppa lemmi per anno
 * @param lemmas - Array di lemmi
 * @returns Map con anno come chiave e array di lemmi come valore
 */
export function groupLemmasByYear(lemmas: Lemma[]): Map<number, Lemma[]> {
  const groups = new Map<number, Lemma[]>();

  lemmas.forEach(lemma => {
    if (lemma.Anno > 0) {
      const existing = groups.get(lemma.Anno) || [];
      groups.set(lemma.Anno, [...existing, lemma]);
    }
  });

  return groups;
}

/**
 * Estrae il range di anni dal dataset
 * @param lemmas - Array di lemmi
 * @returns Oggetto con anno minimo e massimo
 */
export function getYearRange(lemmas: Lemma[]): { min: number; max: number } {
  const validYears = lemmas
    .map(l => l.Anno)
    .filter(year => year > 0);

  if (validYears.length === 0) {
    return { min: 1300, max: 1500 };
  }

  return {
    min: Math.min(...validYears),
    max: Math.max(...validYears),
  };
}
