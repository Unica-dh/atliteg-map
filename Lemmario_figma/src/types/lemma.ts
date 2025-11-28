import type { Geometry } from 'geojson';

/**
 * Interfaccia principale per un lemma del dataset AtLiTeG
 */
export interface Lemma {
  IdLemma: number;
  Lemma: string;
  Forma: string;
  CollGeografica: string;
  Anno: number;
  Periodo: string;
  Categoria: string; // Categorie multiple separate da virgola
  Frequenza: number;
  URL: string;
  IdAmbito?: string; // Opzionale: ID per mapping con GeoJSON poligoni
  lat?: number; // Coordinate per località puntuali
  lng?: number;
}

/**
 * Interfaccia per area geografica poligonale (da GeoJSON)
 */
export interface GeoArea {
  id: string;
  name: string;
  geometry: Geometry;
  properties?: Record<string, any>;
}

/**
 * Stato filtri globali
 */
export interface FilterState {
  categorie: string[]; // Selezione multipla
  periodi: string[]; // Selezione multipla
  searchQuery: string;
  selectedLetter: string | null;
  selectedYear: number | null;
  selectedLemma: Lemma | null;
}

/**
 * Stato globale applicazione
 */
export interface AppState {
  lemmas: Lemma[];
  geoAreas: GeoArea[];
  filters: FilterState;
  isLoading: boolean;
  error: string | null;
}

/**
 * Metriche dashboard
 */
export interface DashboardMetrics {
  totalLocations: number;
  totalLemmas: number;
  totalYears: number;
  yearsWithData: number;
  totalAttestations: number;
}
