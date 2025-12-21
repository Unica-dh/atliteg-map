'use client';

import { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import { useApp } from '@/context/AppContext';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

// Import dinamico per evitare problemi SSR
if (typeof window !== 'undefined') {
  require('leaflet.markercluster');
}

// Fix per icone Leaflet in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function MapUpdater({ markers }: { markers: any[] }) {
  const map = useMap();

  useEffect(() => {
    if (markers.length > 0) {
      const bounds = L.latLngBounds(markers.map(m => [m.lat, m.lng]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [markers, map]);

  return null;
}

// Componente per gestire MarkerCluster con React Leaflet
function MarkerClusterGroup({ children, markers }: { children?: React.ReactNode; markers: any[] }) {
  const map = useMap();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Crea il cluster group con opzioni ottimizzate
    const markerClusterGroup = (L as any).markerClusterGroup({
      // Opzioni di performance
      chunkedLoading: true,
      chunkInterval: 200,
      chunkDelay: 50,

      // Opzioni di clustering
      maxClusterRadius: 80,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      disableClusteringAtZoom: 16, // Zoom alto mostra tutti i marker

      // Icone cluster personalizzate
      iconCreateFunction: function(cluster: any) {
        const count = cluster.getChildCount();
        let size = 'small';
        let className = 'marker-cluster-small';

        if (count > 100) {
          size = 'large';
          className = 'marker-cluster-large';
        } else if (count > 20) {
          size = 'medium';
          className = 'marker-cluster-medium';
        }

        return L.divIcon({
          html: `<div><span>${count}</span></div>`,
          className: `marker-cluster ${className}`,
          iconSize: L.point(40, 40)
        });
      }
    });

    // Aggiungi marker al cluster
    markers.forEach(marker => {
      const leafletMarker = L.marker([marker.lat, marker.lng]);
      leafletMarker.bindPopup(`
        <div class="p-2">
          <h3 class="font-bold text-lg">${marker.lemma.Lemma}</h3>
          <p class="text-sm"><strong>Forma:</strong> ${marker.lemma.Forma}</p>
          <p class="text-sm"><strong>Località:</strong> ${marker.lemma.CollGeografica}</p>
          <p class="text-sm"><strong>Anno:</strong> ${marker.lemma.Anno}</p>
        </div>
      `);
      markerClusterGroup.addLayer(leafletMarker);
    });

    // Aggiungi alla mappa
    map.addLayer(markerClusterGroup);

    // Cleanup
    return () => {
      map.removeLayer(markerClusterGroup);
    };
  }, [map, markers]);

  return null;
}

export function GeographicalMap() {
  const { filteredLemmi, geoAreas } = useApp();

  // Cache Map per IdAmbito -> GeoArea (ottimizzazione)
  const geoAreasMap = useMemo(() => {
    const map = new Map<number, any>();
    geoAreas.forEach(area => {
      map.set(area.properties.id, area);
    });
    return map;
  }, [geoAreas]);

  // Prepara marker per località puntuali
  const markers = useMemo(() => {
    const result: Array<{ lat: number; lng: number; lemma: any }> = [];

    filteredLemmi.forEach(lemma => {
      // Solo località con coordinate valide
      if (lemma.Latitudine && lemma.Longitudine &&
          lemma.Latitudine !== '#N/A' && lemma.Longitudine !== '#N/A') {
        const lat = parseFloat(lemma.Latitudine.replace(',', '.'));
        const lng = parseFloat(lemma.Longitudine.replace(',', '.'));

        if (!isNaN(lat) && !isNaN(lng)) {
          result.push({ lat, lng, lemma });
        }
      }
    });

    return result;
  }, [filteredLemmi]);

  // Prepara aree geografiche poligonali (OTTIMIZZATO con Map)
  const polygons = useMemo(() => {
    const polygonMap = new Map<number, { geoArea: any; lemmi: any[] }>();

    filteredLemmi.forEach(lemma => {
      if (lemma.IdAmbito && lemma.IdAmbito.trim()) {
        const idAmbito = parseInt(lemma.IdAmbito);
        const geoArea = geoAreasMap.get(idAmbito);

        if (geoArea) {
          if (!polygonMap.has(idAmbito)) {
            polygonMap.set(idAmbito, { geoArea, lemmi: [] });
          }
          polygonMap.get(idAmbito)!.lemmi.push(lemma);
        }
      }
    });

    return Array.from(polygonMap.values());
  }, [filteredLemmi, geoAreasMap]);

  const totalLocations = markers.length + polygons.length;
  const totalLemmas = new Set(filteredLemmi.map(l => l.IdLemma)).size;

  return (
    <div className="relative h-[820px] w-full">
      {/* Contatore in alto a destra */}
      <div className="absolute top-4 right-4 z-[800] bg-white px-4 py-2 rounded-md shadow-lg">
        <p className="text-sm font-medium text-gray-700">
          {totalLocations} locations • {totalLemmas} lemmas
        </p>
      </div>

      <MapContainer
        center={[42.5, 12.5]}
        zoom={6}
        style={{ height: '100%', width: '100%' }}
        className="rounded-lg"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Marker puntuali con clustering */}
        {markers.length > 0 && <MarkerClusterGroup markers={markers} />}

        {/* Poligoni aree geografiche */}
        {polygons.map((poly, idx) => (
          <GeoJSON
            key={`polygon-${idx}`}
            data={poly.geoArea as any}
            style={{
              fillColor: '#3b82f6',
              fillOpacity: 0.3,
              color: '#2563eb',
              weight: 2
            }}
            onEachFeature={(_, layer) => {
              layer.bindPopup(`
                <div class="p-2">
                  <h3 class="font-bold text-lg">${poly.geoArea.properties.dialetto}</h3>
                  <p class="text-sm"><strong>Attestazioni:</strong> ${poly.lemmi.length}</p>
                  <p class="text-sm"><strong>Lemmi:</strong> ${[...new Set(poly.lemmi.map((l: any) => l.Lemma))].join(', ')}</p>
                </div>
              `);
            }}
          />
        ))}

        {markers.length > 0 && <MapUpdater markers={markers} />}
      </MapContainer>
    </div>
  );
}
