import { useMemo } from 'react';
import type { Lemma, FilterState } from '../types';
import { parseCategories } from '../services/dataLoader';

/**
 * Hook per calcolare i dati filtrati in base allo stato globale
 */
export function useFilteredData(lemmas: Lemma[], filters: FilterState): Lemma[] {
  return useMemo(() => {
    return lemmas.filter(lemma => {
      // Filtro per categorie (selezione multipla)
      if (filters.categorie.length > 0) {
        const lemmaCategories = parseCategories(lemma.Categoria);
        const hasMatchingCategory = lemmaCategories.some(cat => 
          filters.categorie.includes(cat)
        );
        if (!hasMatchingCategory) return false;
      }

      // Filtro per periodi (selezione multipla)
      if (filters.periodi.length > 0) {
        if (!filters.periodi.includes(lemma.Periodo)) return false;
      }

      // Filtro per ricerca (lemma o forma)
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const matchesLemma = lemma.Lemma.toLowerCase().includes(query);
        const matchesForma = lemma.Forma.toLowerCase().includes(query);
        if (!matchesLemma && !matchesForma) return false;
      }

      // Filtro per lettera selezionata
      if (filters.selectedLetter) {
        const firstLetter = lemma.Lemma.charAt(0).toUpperCase();
        if (firstLetter !== filters.selectedLetter) return false;
      }

      // Filtro per anno selezionato
      if (filters.selectedYear !== null) {
        if (lemma.Anno !== filters.selectedYear) return false;
      }

      // Filtro per lemma selezionato (mostra tutte le attestazioni del lemma)
      if (filters.selectedLemma) {
        if (lemma.IdLemma !== filters.selectedLemma.IdLemma) return false;
      }

      return true;
    });
  }, [lemmas, filters]);
}
