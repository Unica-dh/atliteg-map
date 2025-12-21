'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { Lemma, GeoArea, FilterState, AppState, Metrics } from '@/types/lemma';
import { loadCSVData, loadGeoJSON, parseCategorie } from '@/services/dataLoader';
import { SearchIndex } from '@/utils/searchIndex';

interface AppContextValue extends AppState {
  setFilters: (filters: Partial<FilterState>) => void;
  resetFilters: () => void;
  metrics: Metrics;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

const initialFilterState: FilterState = {
  categorie: [],
  periodi: [],
  searchQuery: '',
  selectedLemmaId: null,
  selectedLetter: null,
  selectedYear: null,
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [lemmi, setLemmi] = useState<Lemma[]>([]);
  const [geoAreas, setGeoAreas] = useState<GeoArea[]>([]);
  const [filters, setFiltersState] = useState<FilterState>(initialFilterState);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchIndex, setSearchIndex] = useState<SearchIndex | null>(null);

  // Caricamento dati iniziale
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const [csvData, geoData] = await Promise.all([
          loadCSVData(),
          loadGeoJSON()
        ]);
        setLemmi(csvData);
        setGeoAreas(geoData);

        // Crea indice di ricerca ottimizzato
        console.time('🔍 Building search index');
        const index = new SearchIndex(csvData);
        setSearchIndex(index);
        console.timeEnd('🔍 Building search index');

        setError(null);
      } catch (err) {
        setError('Errore nel caricamento dei dati');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Calcolo lemmi filtrati (OTTIMIZZATO)
  const filteredLemmi = useMemo(() => {
    let result = lemmi;

    // OTTIMIZZAZIONE: Se c'è una ricerca, usa l'indice ottimizzato
    if (filters.searchQuery && searchIndex) {
      // Ricerca veloce O(k) invece di O(n)
      result = searchIndex.search(filters.searchQuery, 10000); // Limite alto per non perdere risultati
    }

    // Filtro per categorie
    if (filters.categorie.length > 0) {
      result = result.filter(lemma => {
        const lemmaCategorie = parseCategorie(lemma.Categoria);
        return filters.categorie.some(cat => lemmaCategorie.includes(cat));
      });
    }

    // Filtro per periodi
    if (filters.periodi.length > 0) {
      result = result.filter(lemma => filters.periodi.includes(lemma.Periodo));
    }

    // Filtro per lettera selezionata
    if (filters.selectedLetter) {
      result = result.filter(lemma =>
        lemma.Lemma.toLowerCase().startsWith(filters.selectedLetter!.toLowerCase())
      );
    }

    // Filtro per anno selezionato
    if (filters.selectedYear) {
      result = result.filter(lemma => lemma.Anno === filters.selectedYear);
    }

    // Filtro per lemma selezionato
    if (filters.selectedLemmaId) {
      result = result.filter(lemma => lemma.IdLemma === filters.selectedLemmaId);
    }

    return result;
  }, [lemmi, filters, searchIndex]);

  // Calcolo metriche
  const metrics = useMemo((): Metrics => {
    const localita = new Set(filteredLemmi.map(l => l.CollGeografica)).size;
    const lemmiUnici = new Set(filteredLemmi.map(l => l.IdLemma)).size;
    const anni = new Set(filteredLemmi.map(l => l.Anno)).size;
    const attestazioni = filteredLemmi.length;

    return {
      totalLocalita: localita,
      totalLemmi: lemmiUnici,
      totalAnni: anni,
      totalAttestazioni: attestazioni
    };
  }, [filteredLemmi]);

  const setFilters = (newFilters: Partial<FilterState>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFiltersState(initialFilterState);
  };

  const value: AppContextValue = {
    lemmi,
    geoAreas,
    filteredLemmi,
    filters,
    isLoading,
    error,
    setFilters,
    resetFilters,
    metrics
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp deve essere usato all\'interno di AppProvider');
  }
  return context;
}
