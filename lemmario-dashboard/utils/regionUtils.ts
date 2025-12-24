import type { Lemma, RegionFeature } from '@/types/lemma';

/**
 * Estrae i codici ISTAT unici dai lemmi filtrati
 * Considera solo i lemmi con RegionIstatCode valorizzato
 */
export function getRegionCodesFromLemmas(lemmas: Lemma[]): string[] {
  const codes = new Set<string>();

  lemmas.forEach(lemma => {
    if (lemma.RegionIstatCode && lemma.RegionIstatCode.trim()) {
      codes.add(lemma.RegionIstatCode);
    }
  });

  return Array.from(codes);
}

/**
 * Filtra le feature GeoJSON per i codici specificati
 */
export function filterRegionFeatures(
  allFeatures: RegionFeature[],
  codes: string[]
): RegionFeature[] {
  return allFeatures.filter(
    feature => codes.includes(feature.properties.reg_istat_code)
  );
}

/**
 * Conta i lemmi per regione
 * Restituisce una Map con chiave = codice ISTAT, valore = count
 */
export function countLemmasByRegion(lemmas: Lemma[]): Map<string, number> {
  const counts = new Map<string, number>();

  lemmas.forEach(lemma => {
    if (lemma.RegionIstatCode && lemma.RegionIstatCode.trim()) {
      const current = counts.get(lemma.RegionIstatCode) || 0;
      counts.set(lemma.RegionIstatCode, current + 1);
    }
  });

  return counts;
}

/**
 * Ottiene il nome della regione dal codice ISTAT
 */
export function getRegionName(
  code: string,
  features: RegionFeature[]
): string | undefined {
  const feature = features.find(f => f.properties.reg_istat_code === code);
  return feature?.properties.reg_name;
}
