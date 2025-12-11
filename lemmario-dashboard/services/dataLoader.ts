import Papa from 'papaparse';
import { Lemma, GeoArea } from '@/types/lemma';

export async function loadCSVData(): Promise<Lemma[]> {
  try {
    const response = await fetch('/data/Lemmi_forme_atliteg_updated.csv');
    const csvText = await response.text();
    
    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header) => {
          // Mappa gli header del CSV ai nomi delle proprietà TypeScript
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
          };
          return headerMap[header] || header;
        },
        complete: (results) => {
          const lemmi = results.data as Lemma[];
          resolve(lemmi);
        },
        error: (error: Error) => {
          reject(error);
        }
      });
    });
  } catch (error) {
    console.error('Errore nel caricamento del CSV:', error);
    throw error;
  }
}

export async function loadGeoJSON(): Promise<GeoArea[]> {
  try {
    const response = await fetch('/data/Ambiti geolinguistici newline.json');
    const text = await response.text();
    
    // Il file contiene una feature per riga, non un FeatureCollection
    const lines = text.trim().split('\n');
    const features: GeoArea[] = lines
      .filter(line => line.trim())
      .map(line => JSON.parse(line));
    
    return features;
  } catch (error) {
    console.error('Errore nel caricamento del GeoJSON:', error);
    throw error;
  }
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
