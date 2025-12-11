import { useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { Lemma } from '@/types/lemma';

/**
 * Hook per ottenere i dati filtrati
 * Wrapper conveniente per accedere a filteredLemmi dal Context
 */
export function useFilteredData() {
  const { filteredLemmi } = useApp();
  return filteredLemmi;
}

/**
 * Hook per ottenere lemmi raggruppati per località
 */
export function useLemmiByLocation() {
  const { filteredLemmi } = useApp();

  const lemmiByLocation = useMemo(() => {
    const grouped = new Map<string, Lemma[]>();
    
    filteredLemmi.forEach(lemma => {
      const location = lemma.CollGeografica;
      if (!grouped.has(location)) {
        grouped.set(location, []);
      }
      grouped.get(location)!.push(lemma);
    });

    return Array.from(grouped.entries())
      .map(([location, lemmi]) => ({
        location,
        lemmi,
        count: lemmi.length,
      }))
      .sort((a, b) => b.count - a.count);
  }, [filteredLemmi]);

  return lemmiByLocation;
}

/**
 * Hook per ottenere lemmi raggruppati per anno
 */
export function useLemmiByYear() {
  const { filteredLemmi } = useApp();

  const lemmiByYear = useMemo(() => {
    const grouped = new Map<string, Lemma[]>();
    
    filteredLemmi.forEach(lemma => {
      const year = lemma.Anno || 'Sconosciuto';
      if (!grouped.has(year)) {
        grouped.set(year, []);
      }
      grouped.get(year)!.push(lemma);
    });

    return Array.from(grouped.entries())
      .map(([year, lemmi]) => ({
        year,
        lemmi,
        count: lemmi.length,
      }))
      .sort((a, b) => {
        if (a.year === 'Sconosciuto') return 1;
        if (b.year === 'Sconosciuto') return -1;
        return parseInt(a.year) - parseInt(b.year);
      });
  }, [filteredLemmi]);

  return lemmiByYear;
}

/**
 * Hook per ottenere lemmi unici (no duplicati)
 */
export function useUniqueLemmi() {
  const { filteredLemmi } = useApp();

  const uniqueLemmi = useMemo(() => {
    const seen = new Set<string>();
    const unique: Lemma[] = [];

    filteredLemmi.forEach(lemma => {
      if (!seen.has(lemma.IdLemma)) {
        seen.add(lemma.IdLemma);
        unique.push(lemma);
      }
    });

    return unique.sort((a, b) => a.Lemma.localeCompare(b.Lemma));
  }, [filteredLemmi]);

  return uniqueLemmi;
}
