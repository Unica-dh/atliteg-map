import { useMemo } from 'react';
import type { Lemma, DashboardMetrics } from '../types';

/**
 * Hook per calcolare le metriche della dashboard
 */
export function useMetrics(lemmas: Lemma[]): DashboardMetrics {
  return useMemo(() => {
    const locations = new Set<string>();
    const lemmaIds = new Set<number>();
    const years = new Set<number>();

    lemmas.forEach(lemma => {
      if (lemma.CollGeografica) {
        locations.add(lemma.CollGeografica);
      }
      lemmaIds.add(lemma.IdLemma);
      if (lemma.Anno > 0) {
        years.add(lemma.Anno);
      }
    });

    // Calcola anni totali nel range
    const yearArray = Array.from(years).sort((a, b) => a - b);
    const minYear = yearArray.length > 0 ? yearArray[0] : 0;
    const maxYear = yearArray.length > 0 ? yearArray[yearArray.length - 1] : 0;
    const totalYears = maxYear > minYear ? maxYear - minYear + 1 : yearArray.length;

    return {
      totalLocations: locations.size,
      totalLemmas: lemmaIds.size,
      totalYears,
      yearsWithData: years.size,
      totalAttestations: lemmas.length,
    };
  }, [lemmas]);
}
