import { Lemma } from '@/types/lemma';

/**
 * Indice di ricerca ottimizzato per ricerca testuale veloce
 * Usa Map per lookup O(1) invece di linear search O(n)
 */
export class SearchIndex {
  private lemmaIndex: Map<string, Lemma[]> = new Map();
  private formaIndex: Map<string, Lemma[]> = new Map();
  private prefixIndex: Map<string, Set<string>> = new Map();

  constructor(lemmi: Lemma[]) {
    this.buildIndex(lemmi);
  }

  /**
   * Costruisce gli indici per ricerca rapida
   * Complessità: O(n * m) dove n = numero lemmi, m = lunghezza media parola
   */
  private buildIndex(lemmi: Lemma[]): void {
    lemmi.forEach(lemma => {
      // Indice per Lemma (normalizzato lowercase)
      const lemmaKey = lemma.Lemma.toLowerCase();
      if (!this.lemmaIndex.has(lemmaKey)) {
        this.lemmaIndex.set(lemmaKey, []);
      }
      this.lemmaIndex.get(lemmaKey)!.push(lemma);

      // Indice per Forma (normalizzato lowercase)
      const formaKey = lemma.Forma.toLowerCase();
      if (!this.formaIndex.has(formaKey)) {
        this.formaIndex.set(formaKey, []);
      }
      this.formaIndex.get(formaKey)!.push(lemma);

      // Indice prefissi per autocomplete (primi 3 caratteri)
      for (let i = 1; i <= Math.min(lemmaKey.length, 5); i++) {
        const prefix = lemmaKey.substring(0, i);
        if (!this.prefixIndex.has(prefix)) {
          this.prefixIndex.set(prefix, new Set());
        }
        this.prefixIndex.get(prefix)!.add(lemmaKey);

        // Anche per forma
        const formaPrefix = formaKey.substring(0, i);
        if (!this.prefixIndex.has(formaPrefix)) {
          this.prefixIndex.set(formaPrefix, new Set());
        }
        this.prefixIndex.get(formaPrefix)!.add(formaKey);
      }
    });

    console.log(`🔍 Search index built: ${this.lemmaIndex.size} lemmi, ${this.formaIndex.size} forme, ${this.prefixIndex.size} prefixes`);
  }

  /**
   * Ricerca veloce per query
   * Complessità: O(k) dove k = numero risultati (invece di O(n))
   */
  search(query: string, limit: number = 10): Lemma[] {
    if (!query || query.trim().length === 0) {
      return [];
    }

    const normalizedQuery = query.toLowerCase().trim();
    const results = new Set<Lemma>();

    // Ricerca esatta in lemma
    const exactLemmaMatches = this.lemmaIndex.get(normalizedQuery) || [];
    exactLemmaMatches.forEach(lemma => results.add(lemma));

    // Ricerca esatta in forma
    const exactFormaMatches = this.formaIndex.get(normalizedQuery) || [];
    exactFormaMatches.forEach(lemma => results.add(lemma));

    // Se abbiamo già abbastanza risultati esatti, ritorna
    if (results.size >= limit) {
      return Array.from(results).slice(0, limit);
    }

    // Ricerca per prefisso (per completamento automatico)
    const possibleKeys = this.prefixIndex.get(normalizedQuery) || new Set();
    for (const key of possibleKeys) {
      if (results.size >= limit) break;

      const lemmaMatches = this.lemmaIndex.get(key) || [];
      lemmaMatches.forEach(lemma => {
        if (results.size < limit) results.add(lemma);
      });

      const formaMatches = this.formaIndex.get(key) || [];
      formaMatches.forEach(lemma => {
        if (results.size < limit) results.add(lemma);
      });
    }

    // Se ancora non abbiamo abbastanza, ricerca substring (fallback)
    if (results.size < limit) {
      for (const [key, lemmas] of this.lemmaIndex) {
        if (results.size >= limit) break;
        if (key.includes(normalizedQuery)) {
          lemmas.forEach(lemma => {
            if (results.size < limit) results.add(lemma);
          });
        }
      }

      for (const [key, lemmas] of this.formaIndex) {
        if (results.size >= limit) break;
        if (key.includes(normalizedQuery)) {
          lemmas.forEach(lemma => {
            if (results.size < limit) results.add(lemma);
          });
        }
      }
    }

    return Array.from(results).slice(0, limit);
  }

  /**
   * Suggerimenti per autocomplete
   */
  getSuggestions(prefix: string, limit: number = 10): string[] {
    const normalizedPrefix = prefix.toLowerCase().trim();
    const suggestions = this.prefixIndex.get(normalizedPrefix) || new Set();
    return Array.from(suggestions).slice(0, limit);
  }
}
