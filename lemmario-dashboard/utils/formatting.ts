/**
 * Formatta una data/anno per la visualizzazione
 */
export function formatYear(year: string | number | undefined): string {
  if (!year) return 'N/D';
  return year.toString();
}

/**
 * Formatta un periodo per la visualizzazione
 */
export function formatPeriod(period: string | undefined): string {
  if (!period) return 'Non specificato';
  return period;
}

/**
 * Formatta un numero con separatori di migliaia
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('it-IT').format(num);
}

/**
 * Tronca un testo alla lunghezza specificata aggiungendo "..."
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * Capitalizza la prima lettera di una stringa
 */
export function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Normalizza una stringa per la ricerca (lowercase, trim, rimuove accenti)
 */
export function normalizeForSearch(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

/**
 * Verifica se una stringa contiene un'altra (case-insensitive)
 */
export function containsIgnoreCase(text: string, search: string): boolean {
  return normalizeForSearch(text).includes(normalizeForSearch(search));
}

/**
 * Ottiene le iniziali da un nome (es. "Giovanni Rossi" -> "GR")
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

/**
 * Parse delle coordinate geografiche
 */
export function parseCoordinates(lat: string, lng: string): [number, number] | null {
  const latNum = parseFloat(lat);
  const lngNum = parseFloat(lng);
  
  if (isNaN(latNum) || isNaN(lngNum)) return null;
  return [latNum, lngNum];
}

/**
 * Genera un colore consistente basato su una stringa (per categorie, etc.)
 */
export function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const hue = hash % 360;
  return `hsl(${hue}, 70%, 60%)`;
}

/**
 * Ordina un array di stringhe con supporto per numeri
 */
export function sortAlphanumeric(a: string, b: string): number {
  return a.localeCompare(b, 'it', { numeric: true, sensitivity: 'base' });
}

/**
 * Raggruppa array per una chiave
 */
export function groupBy<T, K extends keyof any>(
  array: T[],
  getKey: (item: T) => K
): Record<K, T[]> {
  return array.reduce((result, item) => {
    const key = getKey(item);
    if (!result[key]) {
      result[key] = [];
    }
    result[key].push(item);
    return result;
  }, {} as Record<K, T[]>);
}

/**
 * Rimuove duplicati da un array
 */
export function unique<T>(array: T[]): T[] {
  return Array.from(new Set(array));
}

/**
 * Rimuove duplicati da un array basandosi su una chiave
 */
export function uniqueBy<T, K>(array: T[], getKey: (item: T) => K): T[] {
  const seen = new Set<K>();
  return array.filter(item => {
    const key = getKey(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
