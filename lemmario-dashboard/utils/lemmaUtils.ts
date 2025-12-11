import { Lemma } from '@/types/lemma';

/**
 * Verifica se un lemma ha coordinate valide
 */
export function hasValidCoordinates(lemma: Lemma): boolean {
  const lat = parseFloat(lemma.Latitudine);
  const lng = parseFloat(lemma.Longitudine);
  return !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0;
}

/**
 * Ottiene le coordinate di un lemma
 */
export function getCoordinates(lemma: Lemma): [number, number] | null {
  if (!hasValidCoordinates(lemma)) return null;
  return [parseFloat(lemma.Latitudine), parseFloat(lemma.Longitudine)];
}

/**
 * Verifica se un lemma ha un IdAmbito (area geografica)
 */
export function hasIdAmbito(lemma: Lemma): boolean {
  return !!lemma.IdAmbito && lemma.IdAmbito.trim() !== '';
}

/**
 * Ottiene tutte le categorie da un lemma (split e trim)
 */
export function getCategories(lemma: Lemma): string[] {
  if (!lemma.Categoria) return [];
  return lemma.Categoria.split(',').map(cat => cat.trim()).filter(Boolean);
}

/**
 * Verifica se un lemma appartiene a una categoria
 */
export function hasCategory(lemma: Lemma, category: string): boolean {
  return getCategories(lemma).includes(category);
}

/**
 * Verifica se un lemma corrisponde a una query di ricerca
 */
export function matchesSearch(lemma: Lemma, query: string): boolean {
  const normalizedQuery = query.toLowerCase().trim();
  if (!normalizedQuery) return true;
  
  return (
    lemma.Lemma.toLowerCase().includes(normalizedQuery) ||
    lemma.Forma.toLowerCase().includes(normalizedQuery) ||
    lemma.CollGeografica.toLowerCase().includes(normalizedQuery)
  );
}

/**
 * Ottiene il display name per un lemma (preferenza: Lemma > Forma)
 */
export function getDisplayName(lemma: Lemma): string {
  return lemma.Lemma || lemma.Forma || 'Senza nome';
}

/**
 * Ottiene l'anno di un lemma (preferenza: Anno > parse da Periodo)
 */
export function getYear(lemma: Lemma): number | null {
  if (lemma.Anno) {
    const year = parseInt(lemma.Anno);
    if (!isNaN(year)) return year;
  }
  
  // Prova a estrarre anno dal periodo
  if (lemma.Periodo) {
    const match = lemma.Periodo.match(/\d{4}/);
    if (match) {
      const year = parseInt(match[0]);
      if (!isNaN(year)) return year;
    }
  }
  
  return null;
}

/**
 * Verifica se un lemma è dell'anno specificato
 */
export function isFromYear(lemma: Lemma, year: string | number): boolean {
  const lemmaYear = getYear(lemma);
  if (lemmaYear === null) return false;
  return lemmaYear === (typeof year === 'string' ? parseInt(year) : year);
}

/**
 * Ottiene la località di un lemma
 */
export function getLocation(lemma: Lemma): string {
  return lemma.CollGeografica || 'Località sconosciuta';
}

/**
 * Verifica se due lemmi sono dello stesso lemma base (stesso IdLemma)
 */
export function isSameLemma(lemma1: Lemma, lemma2: Lemma): boolean {
  return lemma1.IdLemma === lemma2.IdLemma;
}

/**
 * Ottiene una descrizione breve di un lemma per tooltip/preview
 */
export function getLemmaPreview(lemma: Lemma): string {
  const parts = [
    `Lemma: ${lemma.Lemma}`,
    `Forma: ${lemma.Forma}`,
    `Località: ${lemma.CollGeografica}`,
  ];
  
  if (lemma.Anno) {
    parts.push(`Anno: ${lemma.Anno}`);
  } else if (lemma.Periodo) {
    parts.push(`Periodo: ${lemma.Periodo}`);
  }
  
  return parts.join(' • ');
}

/**
 * Filtra lemmi per categorie
 */
export function filterByCategories(lemmi: Lemma[], categories: string[]): Lemma[] {
  if (categories.length === 0) return lemmi;
  return lemmi.filter(lemma => 
    categories.some(cat => hasCategory(lemma, cat))
  );
}

/**
 * Filtra lemmi per periodi
 */
export function filterByPeriods(lemmi: Lemma[], periods: string[]): Lemma[] {
  if (periods.length === 0) return lemmi;
  return lemmi.filter(lemma => periods.includes(lemma.Periodo));
}

/**
 * Filtra lemmi per query di ricerca
 */
export function filterBySearch(lemmi: Lemma[], query: string): Lemma[] {
  if (!query.trim()) return lemmi;
  return lemmi.filter(lemma => matchesSearch(lemma, query));
}
