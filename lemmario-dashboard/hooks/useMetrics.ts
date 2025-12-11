import { useMemo } from 'react';
import { useApp } from '@/context/AppContext';

/**
 * Hook per calcolare le metriche dell'applicazione
 * Le metriche sono già calcolate nel Context, quindi questo hook
 * è un wrapper conveniente per accedervi
 */
export function useMetrics() {
  const { metrics } = useApp();
  return metrics;
}

/**
 * Hook per ottenere statistiche dettagliate sui dati filtrati
 */
export function useDetailedMetrics() {
  const { filteredLemmi, lemmi } = useApp();

  const detailedMetrics = useMemo(() => {
    // Calcola statistiche sui dati filtrati
    const totalFiltered = filteredLemmi.length;
    const totalAll = lemmi.length;
    const percentageFiltered = totalAll > 0 ? (totalFiltered / totalAll) * 100 : 0;

    // Categorie più frequenti
    const categorieCount = new Map<string, number>();
    filteredLemmi.forEach(lemma => {
      if (lemma.Categoria) {
        lemma.Categoria.split(',').forEach(cat => {
          const catTrimmed = cat.trim();
          categorieCount.set(catTrimmed, (categorieCount.get(catTrimmed) || 0) + 1);
        });
      }
    });

    const topCategorie = Array.from(categorieCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    // Periodi più frequenti
    const periodiCount = new Map<string, number>();
    filteredLemmi.forEach(lemma => {
      if (lemma.Periodo) {
        periodiCount.set(lemma.Periodo, (periodiCount.get(lemma.Periodo) || 0) + 1);
      }
    });

    const topPeriodi = Array.from(periodiCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return {
      totalFiltered,
      totalAll,
      percentageFiltered,
      topCategorie,
      topPeriodi,
    };
  }, [filteredLemmi, lemmi]);

  return detailedMetrics;
}
