/**
 * Utility per parsing e gestione categorie multiple
 */

/**
 * Parsa una stringa di categorie separate da virgola
 * @param categoriaString - Stringa con categorie separate da virgola
 * @returns Array di categorie normalizzate
 */
export function parseCategories(categoriaString: string): string[] {
  if (!categoriaString) return [];
  
  return categoriaString
    .split(',')
    .map(cat => cat.trim())
    .filter(cat => cat.length > 0);
}

/**
 * Verifica se un lemma appartiene a una specifica categoria
 * @param lemmaCategorie - Stringa categorie del lemma
 * @param targetCategory - Categoria da cercare
 * @returns true se il lemma appartiene alla categoria
 */
export function lemmaHasCategory(lemmaCategorie: string, targetCategory: string): boolean {
  const categories = parseCategories(lemmaCategorie);
  return categories.includes(targetCategory);
}

/**
 * Verifica se un lemma appartiene ad almeno una delle categorie specificate
 * @param lemmaCategorie - Stringa categorie del lemma
 * @param targetCategories - Array di categorie da cercare
 * @returns true se il lemma appartiene ad almeno una categoria
 */
export function lemmaHasAnyCategory(lemmaCategorie: string, targetCategories: string[]): boolean {
  if (!targetCategories || targetCategories.length === 0) return true;
  
  const categories = parseCategories(lemmaCategorie);
  return targetCategories.some(target => categories.includes(target));
}

/**
 * Normalizza il nome di una categoria
 * @param category - Nome categoria da normalizzare
 * @returns Nome categoria normalizzato
 */
export function normalizeCategory(category: string): string {
  return category.trim();
}
