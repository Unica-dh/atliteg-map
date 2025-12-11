export interface Lemma {
  IdLemma: string;
  Lemma: string;
  Forma: string;
  CollGeografica: string;
  Latitudine: string;
  Longitudine: string;
  TipoCollGeografica: string;
  Anno: string;
  Periodo: string;
  IDPeriodo: string;
  Datazione: string;
  Categoria: string;
  Frequenza: string;
  URL: string;
  IdAmbito: string;
}

export interface GeoArea {
  type: string;
  properties: {
    id: number;
    dialetto: string;
  };
  geometry: {
    type: string;
    coordinates: number[][][][];
  };
}

export interface FilterState {
  categorie: string[];
  periodi: string[];
  searchQuery: string;
  selectedLemmaId: string | null;
  selectedLetter: string | null;
  selectedYear: string | null;
}

export interface AppState {
  lemmi: Lemma[];
  geoAreas: GeoArea[];
  filteredLemmi: Lemma[];
  filters: FilterState;
  isLoading: boolean;
  error: string | null;
}

export interface Metrics {
  totalLocalita: number;
  totalLemmi: number;
  totalAnni: number;
  totalAttestazioni: number;
}
