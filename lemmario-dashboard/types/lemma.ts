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
  RegionIstatCode?: string; // Codice ISTAT regione (es. "03", "19")
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

export interface RegionProperties {
  reg_name: string;
  reg_istat_code_num: number;
  reg_istat_code: string;
}

export interface RegionFeature {
  type: 'Feature';
  properties: RegionProperties;
  geometry: {
    type: 'Polygon' | 'MultiPolygon';
    coordinates: number[][][] | number[][][][];
  };
}

export interface RegionsGeoJSON {
  type: 'FeatureCollection';
  features: RegionFeature[];
  bbox: number[];
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
  totalLemmi: number;
  totalForme: number;
  totalOccorrenze: number;
  totalAnni: number;
  totalLocalita: number;
}
