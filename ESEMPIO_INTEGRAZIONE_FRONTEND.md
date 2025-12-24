# Esempio di Integrazione Frontend - Visualizzazione Confini Regionali

## Panoramica

Questo documento illustra come utilizzare il campo `reg_istat_code` aggiunto al CSV per visualizzare i confini delle regioni sulla mappa quando vengono mostrati lemmi regionali.

## Flusso di Lavoro

```
1. Utente cerca/filtra lemmi
   ↓
2. I risultati includono lemmi con tipo "Regione"
   ↓
3. Frontend legge il campo reg_istat_code
   ↓
4. Frontend carica il GeoJSON delle regioni
   ↓
5. Frontend filtra e visualizza i confini sulla mappa
```

## Struttura Dati

### Tipo TypeScript per Lemma (aggiornato)

```typescript
// types/lemma.ts
export interface Lemma {
  IdLemma: string;
  Lemma: string;
  Forma: string;
  'Coll.Geografica': string;
  Latitudine: string;
  Longitudine: string;
  'Tipo coll.Geografica': string;
  Anno: string;
  Periodo: string;
  IDPeriodo: string;
  Datazione: string;
  Categoria: string;
  Frequenza: string;
  URL: string;
  IdAmbito: string;
  reg_istat_code?: string;  // ← NUOVO CAMPO
}
```

### Tipo per le Feature GeoJSON

```typescript
// types/region.ts
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
```

## Implementazione

### 1. Hook per caricare le regioni

```typescript
// hooks/useRegions.ts
import { useState, useEffect } from 'react';
import type { RegionsGeoJSON, RegionFeature } from '@/types/region';

export function useRegions() {
  const [regions, setRegions] = useState<RegionsGeoJSON | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetch('/data/limits_IT_regions.geojson')
      .then(res => res.json())
      .then(data => {
        setRegions(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, []);

  const getRegionByCode = (code: string): RegionFeature | undefined => {
    return regions?.features.find(
      f => f.properties.reg_istat_code === code
    );
  };

  return { regions, loading, error, getRegionByCode };
}
```

### 2. Utility per filtrare regioni dai lemmi

```typescript
// utils/regionUtils.ts
import type { Lemma } from '@/types/lemma';
import type { RegionFeature } from '@/types/region';

/**
 * Estrae i codici ISTAT unici dai lemmi filtrati
 */
export function getRegionCodesFromLemmas(lemmas: Lemma[]): string[] {
  const codes = new Set<string>();

  lemmas.forEach(lemma => {
    if (lemma.reg_istat_code && lemma.reg_istat_code.trim()) {
      codes.add(lemma.reg_istat_code);
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
 */
export function countLemmasByRegion(lemmas: Lemma[]): Map<string, number> {
  const counts = new Map<string, number>();

  lemmas.forEach(lemma => {
    if (lemma.reg_istat_code) {
      const current = counts.get(lemma.reg_istat_code) || 0;
      counts.set(lemma.reg_istat_code, current + 1);
    }
  });

  return counts;
}
```

### 3. Integrazione nel componente GeographicalMap

```typescript
// components/GeographicalMap.tsx (esempio parziale)
import { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker } from 'react-leaflet';
import type { Lemma } from '@/types/lemma';
import { useRegions } from '@/hooks/useRegions';
import { getRegionCodesFromLemmas, filterRegionFeatures, countLemmasByRegion } from '@/utils/regionUtils';

interface GeographicalMapProps {
  lemmas: Lemma[];
  // ... altre props
}

export function GeographicalMap({ lemmas }: GeographicalMapProps) {
  const { regions, loading, error, getRegionByCode } = useRegions();

  // Estrai i codici regionali dai lemmi correnti
  const regionCodes = useMemo(
    () => getRegionCodesFromLemmas(lemmas),
    [lemmas]
  );

  // Filtra le feature GeoJSON per le regioni presenti
  const visibleRegions = useMemo(() => {
    if (!regions) return [];
    return filterRegionFeatures(regions.features, regionCodes);
  }, [regions, regionCodes]);

  // Conta i lemmi per regione (per tooltip/popup)
  const regionCounts = useMemo(
    () => countLemmasByRegion(lemmas),
    [lemmas]
  );

  // Stile per i confini regionali
  const regionStyle = (feature: any) => {
    const code = feature.properties.reg_istat_code;
    const count = regionCounts.get(code) || 0;

    // Colore più intenso per più lemmi
    const opacity = Math.min(0.3 + (count / 100) * 0.4, 0.7);

    return {
      fillColor: '#3b82f6',
      fillOpacity: opacity,
      color: '#1d4ed8',
      weight: 2,
      opacity: 0.8,
    };
  };

  // Handler per interazioni
  const onEachRegion = (feature: any, layer: any) => {
    const code = feature.properties.reg_istat_code;
    const name = feature.properties.reg_name;
    const count = regionCounts.get(code) || 0;

    layer.bindPopup(`
      <div class="region-popup">
        <h3>${name}</h3>
        <p>${count} lemmi trovati</p>
      </div>
    `);

    layer.on({
      mouseover: (e: any) => {
        const layer = e.target;
        layer.setStyle({
          weight: 3,
          color: '#0ea5e9',
          fillOpacity: 0.5,
        });
      },
      mouseout: (e: any) => {
        const layer = e.target;
        layer.setStyle(regionStyle(feature));
      },
    });
  };

  if (loading) return <div>Caricamento mappa...</div>;
  if (error) return <div>Errore caricamento regioni</div>;

  return (
    <MapContainer
      center={[42.5, 12.5]}
      zoom={6}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />

      {/* Layer dei confini regionali */}
      {visibleRegions.map((region) => (
        <GeoJSON
          key={region.properties.reg_istat_code}
          data={region}
          style={regionStyle}
          onEachFeature={onEachRegion}
        />
      ))}

      {/* Layer dei marker per città (lemmi con coordinate) */}
      {lemmas
        .filter(l => l.Latitudine && l.Latitudine !== '#N/A')
        .map((lemma, index) => (
          <Marker
            key={`${lemma.IdLemma}-${index}`}
            position={[
              parseFloat(lemma.Latitudine.replace(',', '.')),
              parseFloat(lemma.Longitudine.replace(',', '.'))
            ]}
          />
        ))}
    </MapContainer>
  );
}
```

### 4. Componente Legenda Regioni

```typescript
// components/RegionLegend.tsx
import type { Lemma } from '@/types/lemma';
import { countLemmasByRegion } from '@/utils/regionUtils';
import { useRegions } from '@/hooks/useRegions';

interface RegionLegendProps {
  lemmas: Lemma[];
}

export function RegionLegend({ lemmas }: RegionLegendProps) {
  const { regions } = useRegions();
  const regionCounts = countLemmasByRegion(lemmas);

  if (regionCounts.size === 0) return null;

  return (
    <div className="region-legend bg-white p-4 rounded shadow">
      <h3 className="font-semibold mb-2">Regioni</h3>
      <ul className="space-y-1">
        {Array.from(regionCounts.entries())
          .sort((a, b) => b[1] - a[1])
          .map(([code, count]) => {
            const region = regions?.features.find(
              f => f.properties.reg_istat_code === code
            );
            return (
              <li key={code} className="flex justify-between text-sm">
                <span className="flex items-center">
                  <span
                    className="w-4 h-4 mr-2 rounded"
                    style={{ backgroundColor: '#3b82f6' }}
                  />
                  {region?.properties.reg_name || code}
                </span>
                <span className="font-medium">{count}</span>
              </li>
            );
          })}
      </ul>
    </div>
  );
}
```

## Esempio d'Uso Completo

```typescript
// app/page.tsx (esempio semplificato)
import { useState, useMemo } from 'react';
import { GeographicalMap } from '@/components/GeographicalMap';
import { RegionLegend } from '@/components/RegionLegend';
import type { Lemma } from '@/types/lemma';

export default function DashboardPage() {
  const [lemmas, setLemmas] = useState<Lemma[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  // Filtra lemmi per regione selezionata
  const filteredLemmas = useMemo(() => {
    if (!selectedRegion) return lemmas;
    return lemmas.filter(l => l.reg_istat_code === selectedRegion);
  }, [lemmas, selectedRegion]);

  return (
    <div className="dashboard">
      <div className="map-container">
        <GeographicalMap lemmas={filteredLemmas} />
      </div>
      <div className="sidebar">
        <RegionLegend
          lemmas={filteredLemmas}
          onRegionClick={setSelectedRegion}
        />
      </div>
    </div>
  );
}
```

## Funzionalità Avanzate

### 1. Evidenziazione al Hover

```typescript
const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

// Nello stile:
const regionStyle = (feature: any) => {
  const isHovered = hoveredRegion === feature.properties.reg_istat_code;
  return {
    fillColor: isHovered ? '#60a5fa' : '#3b82f6',
    fillOpacity: isHovered ? 0.6 : 0.3,
    // ...
  };
};
```

### 2. Zoom Automatico sulla Regione

```typescript
import { useMap } from 'react-leaflet';
import * as L from 'leaflet';

function fitBoundsToRegions(regionFeatures: RegionFeature[]) {
  const map = useMap();

  useEffect(() => {
    if (regionFeatures.length > 0) {
      const bounds = L.geoJSON(regionFeatures as any).getBounds();
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [regionFeatures, map]);
}
```

### 3. Filtro Interattivo

```typescript
// Click sulla regione per filtrare i lemmi
const onRegionClick = (regionCode: string) => {
  // Filtra i lemmi solo di quella regione
  setActiveFilter({ type: 'region', value: regionCode });
};
```

## Testing

```typescript
// __tests__/regionUtils.test.ts
import { getRegionCodesFromLemmas, countLemmasByRegion } from '@/utils/regionUtils';
import type { Lemma } from '@/types/lemma';

describe('regionUtils', () => {
  const mockLemmas: Partial<Lemma>[] = [
    { reg_istat_code: '03', Lemma: 'test1' },
    { reg_istat_code: '03', Lemma: 'test2' },
    { reg_istat_code: '19', Lemma: 'test3' },
    { reg_istat_code: '', Lemma: 'test4' },
  ];

  test('getRegionCodesFromLemmas extracts unique codes', () => {
    const codes = getRegionCodesFromLemmas(mockLemmas as Lemma[]);
    expect(codes).toEqual(['03', '19']);
  });

  test('countLemmasByRegion counts correctly', () => {
    const counts = countLemmasByRegion(mockLemmas as Lemma[]);
    expect(counts.get('03')).toBe(2);
    expect(counts.get('19')).toBe(1);
  });
});
```

## Note Implementative

1. **Performance**: Carica il GeoJSON una sola volta e riutilizzalo
2. **Caching**: Considera di usare SWR o React Query per il caching
3. **Mobile**: Disabilita alcune interazioni su dispositivi touch
4. **Accessibility**: Aggiungi ARIA labels per le regioni
5. **Colori**: Usa una scala di colori per densità di lemmi

## Prossimi Passi

- [ ] Implementare il componente GeographicalMap con supporto regioni
- [ ] Aggiungere la legenda delle regioni
- [ ] Testare con i dati reali
- [ ] Ottimizzare le performance del rendering GeoJSON
- [ ] Aggiungere animazioni di transizione
