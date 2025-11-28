/**
 * Utility per validazione dati CSV e GeoJSON
 */

import type { Lemma, GeoArea } from '../types';

/**
 * Valida un lemma
 * @param lemma - Lemma da validare
 * @returns true se il lemma è valido
 */
export function isValidLemma(lemma: Lemma): boolean {
  return (
    lemma.IdLemma > 0 &&
    lemma.Lemma.length > 0 &&
    lemma.Forma.length > 0
  );
}

/**
 * Valida un array di lemmi
 * @param lemmas - Array di lemmi da validare
 * @returns Oggetto con risultati validazione
 */
export function validateLemmas(lemmas: Lemma[]): {
  valid: Lemma[];
  invalid: Lemma[];
  errors: string[];
} {
  const valid: Lemma[] = [];
  const invalid: Lemma[] = [];
  const errors: string[] = [];

  lemmas.forEach((lemma, index) => {
    if (isValidLemma(lemma)) {
      valid.push(lemma);
    } else {
      invalid.push(lemma);
      errors.push(`Lemma ${index} non valido: ${JSON.stringify(lemma)}`);
    }
  });

  return { valid, invalid, errors };
}

/**
 * Valida le coordinate di un lemma
 * @param lemma - Lemma da validare
 * @returns true se le coordinate sono valide
 */
export function hasValidCoordinates(lemma: Lemma): boolean {
  if (lemma.lat === undefined || lemma.lng === undefined) {
    return false;
  }

  return (
    lemma.lat >= -90 &&
    lemma.lat <= 90 &&
    lemma.lng >= -180 &&
    lemma.lng <= 180
  );
}

/**
 * Valida una GeoArea
 * @param geoArea - GeoArea da validare
 * @returns true se la GeoArea è valida
 */
export function isValidGeoArea(geoArea: GeoArea): boolean {
  return (
    geoArea.id.length > 0 &&
    geoArea.geometry !== undefined &&
    (geoArea.geometry.type === 'Polygon' || geoArea.geometry.type === 'MultiPolygon')
  );
}

/**
 * Valida un array di GeoArea
 * @param geoAreas - Array di GeoArea da validare
 * @returns Oggetto con risultati validazione
 */
export function validateGeoAreas(geoAreas: GeoArea[]): {
  valid: GeoArea[];
  invalid: GeoArea[];
  errors: string[];
} {
  const valid: GeoArea[] = [];
  const invalid: GeoArea[] = [];
  const errors: string[] = [];

  geoAreas.forEach((geoArea, index) => {
    if (isValidGeoArea(geoArea)) {
      valid.push(geoArea);
    } else {
      invalid.push(geoArea);
      errors.push(`GeoArea ${index} non valida: ${geoArea.id}`);
    }
  });

  return { valid, invalid, errors };
}

/**
 * Valida formato CSV
 * @param csvText - Testo CSV
 * @returns true se il CSV sembra valido
 */
export function isValidCSVFormat(csvText: string): boolean {
  if (!csvText || csvText.trim().length === 0) {
    return false;
  }

  const lines = csvText.trim().split('\n');
  if (lines.length < 2) {
    return false; // Almeno header + 1 riga
  }

  // Verifica che l'header contenga almeno alcuni campi chiave
  const header = lines[0].toLowerCase();
  const requiredFields = ['idlemma', 'lemma', 'forma'];
  
  return requiredFields.some(field => header.includes(field));
}

/**
 * Valida formato GeoJSON
 * @param jsonData - Dati JSON
 * @returns true se il GeoJSON sembra valido
 */
export function isValidGeoJSONFormat(jsonData: any): boolean {
  return (
    jsonData &&
    jsonData.type === 'FeatureCollection' &&
    Array.isArray(jsonData.features)
  );
}
