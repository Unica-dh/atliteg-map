import { Lemma, GeoArea } from '@/types/lemma';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || '';

/**
 * Carica i dati da backend API
 * I dati sono protetti e accessibili solo tramite API key
 */
export async function loadCSVData(): Promise<Lemma[]> {
  try {
    const startTime = performance.now();
    const response = await fetch(`${API_BASE_URL}/api/lemmi`, {
      headers: {
        'X-API-Key': API_KEY
      },
      cache: 'no-store', // Disabilita cache per avere sempre dati aggiornati
      next: { revalidate: 0 } // Next.js: rivalidazione immediata
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json() as Lemma[];
    const endTime = performance.now();

    console.log(`✅ Dati caricati da API: ${data.length} record in ${(endTime - startTime).toFixed(0)}ms`);

    return data;
  } catch (error) {
    console.error('❌ Errore nel caricamento dei dati:', error);
    throw error;
  }
}

/**
 * Carica GeoJSON da backend API
 */
export async function loadGeoJSON(): Promise<GeoArea[]> {
  try {
    const startTime = performance.now();
    const response = await fetch(`${API_BASE_URL}/api/geojson`, {
      headers: {
        'X-API-Key': API_KEY
      },
      cache: 'no-store', // Disabilita cache
      next: { revalidate: 0 } // Next.js: rivalidazione immediata
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json() as GeoArea[];
    const endTime = performance.now();

    console.log(`✅ GeoJSON caricato da API: ${data.length} features in ${(endTime - startTime).toFixed(0)}ms`);

    return data;
  } catch (error) {
    console.error('❌ Errore nel caricamento GeoJSON:', error);
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
