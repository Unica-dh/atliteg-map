import { useState, useEffect } from 'react';
import type { RegionsGeoJSON, RegionFeature } from '@/types/lemma';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || '';

/**
 * Hook per caricare e gestire i confini regionali dal backend API
 * Carica il file limits_IT_regions.geojson tramite API protetta
 */
export function useRegions() {
  const [regions, setRegions] = useState<RegionsGeoJSON | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadRegions() {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/regions`, {
          headers: {
            'X-API-Key': API_KEY
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to load regions: ${response.statusText}`);
        }

        const data = await response.json() as RegionsGeoJSON;
        setRegions(data);
        setError(null);

        console.log(`✅ Regioni caricate da API: ${data.features.length} regioni`);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error');
        setError(error);
        console.error('❌ Errore caricamento regioni:', error);
      } finally {
        setLoading(false);
      }
    }

    loadRegions();
  }, []);

  /**
   * Trova una regione per codice ISTAT
   * @param code Codice ISTAT a 2 cifre (es. "03", "19")
   */
  const getRegionByCode = (code: string): RegionFeature | undefined => {
    if (!regions || !code) return undefined;
    return regions.features.find(
      f => f.properties.reg_istat_code === code
    );
  };

  /**
   * Filtra le regioni per un array di codici ISTAT
   * @param codes Array di codici ISTAT
   */
  const getRegionsByCodes = (codes: string[]): RegionFeature[] => {
    if (!regions || !codes.length) return [];
    return regions.features.filter(
      f => codes.includes(f.properties.reg_istat_code)
    );
  };

  return {
    regions,
    loading,
    error,
    getRegionByCode,
    getRegionsByCodes
  };
}
