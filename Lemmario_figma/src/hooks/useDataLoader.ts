import { useState, useEffect } from 'react';
import type { Lemma, GeoArea } from '../types';
import { loadLemmasCSV, loadGeoAreasJSON, mapLemmasToGeoAreas } from '../services/dataLoader';

interface UseDataLoaderReturn {
  lemmas: Lemma[];
  geoAreas: GeoArea[];
  isLoading: boolean;
  error: string | null;
  reload: () => void;
}

/**
 * Hook per caricare i dati CSV e GeoJSON in modo asincrono
 */
export function useDataLoader(
  csvPath: string = '/data/Lemmi_forme_atliteg_updated.csv',
  geoJsonPath: string = '/data/Ambiti geolinguistici newline.json'
): UseDataLoaderReturn {
  const [lemmas, setLemmas] = useState<Lemma[]>([]);
  const [geoAreas, setGeoAreas] = useState<GeoArea[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadTrigger, setReloadTrigger] = useState(0);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setIsLoading(true);
      setError(null);

      try {
        // Carica CSV e GeoJSON in parallelo
        const [loadedLemmas, loadedGeoAreas] = await Promise.all([
          loadLemmasCSV(csvPath),
          loadGeoAreasJSON(geoJsonPath).catch(() => {
            // GeoJSON è opzionale, se fallisce continua senza
            console.warn('GeoJSON non disponibile, continuando senza aree geografiche');
            return [];
          }),
        ]);

        if (!isMounted) return;

        // Mappa lemmi con aree geografiche
        const mappedLemmas = mapLemmasToGeoAreas(loadedLemmas, loadedGeoAreas);

        setLemmas(mappedLemmas);
        setGeoAreas(loadedGeoAreas);
      } catch (err) {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : 'Errore sconosciuto nel caricamento dati');
        console.error('Errore caricamento dati:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [csvPath, geoJsonPath, reloadTrigger]);

  const reload = () => {
    setReloadTrigger((prev: number) => prev + 1);
  };

  return {
    lemmas,
    geoAreas,
    isLoading,
    error,
    reload,
  };
}
