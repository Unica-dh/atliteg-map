'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import { useApp } from '@/context/AppContext';
import { useHighlight } from '@/context/HighlightContext';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

// Import dinamico per evitare problemi SSR
if (typeof window !== 'undefined') {
  require('leaflet.markercluster');
}

// Icona marker minimale con supporto highlighting
const createMinimalIcon = (highlighted = false, selected = false) => {
  const fillColor = selected ? '#1d4ed8' : highlighted ? '#2563eb' : '#3b82f6';
  const className = selected ? 'minimal-marker-icon selected' : highlighted ? 'minimal-marker-icon highlighted' : 'minimal-marker-icon';
  
  return L.divIcon({
    html: `<svg width="20" height="28" viewBox="0 0 20 28" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 0C4.48 0 0 4.48 0 10c0 7 10 18 10 18s10-11 10-18c0-5.52-4.48-10-10-10z"
            fill="${fillColor}" stroke="#1e40af" stroke-width="1.5"/>
      <circle cx="10" cy="10" r="4" fill="white"/>
    </svg>`,
    className,
    iconSize: [20, 28],
    iconAnchor: [10, 28],
    popupAnchor: [0, -28]
  });
};

function MapUpdater({ markers, highlightedAreas }: { markers: any[]; highlightedAreas: Set<string> }) {
  const map = useMap();
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (markers.length > 0 && !hasInitialized.current) {
      const bounds = L.latLngBounds(markers.map(m => [m.lat, m.lng]));
      map.fitBounds(bounds, { 
        padding: [50, 50],
        animate: true,
        duration: 0.8
      });
      hasInitialized.current = true;
    }
  }, [markers, map]);

  // FlyTo animation quando ci sono aree evidenziate
  useEffect(() => {
    if (highlightedAreas.size > 0 && markers.length > 0) {
      const highlightedMarkers = markers.filter(m => 
        m.lemmi.some((l: any) => highlightedAreas.has(l.CollGeografica))
      );
      
      if (highlightedMarkers.length > 0) {
        const bounds = L.latLngBounds(highlightedMarkers.map(m => [m.lat, m.lng]));
        map.flyToBounds(bounds, {
          padding: [80, 80],
          duration: 1.2,
          easeLinearity: 0.25,
          animate: true
        });
      }
    }
  }, [highlightedAreas, markers, map]);

  return null;
}

// Componente per gestire MarkerCluster con React Leaflet e Highlighting
function MarkerClusterGroup({ 
  children, 
  markers, 
  highlightedLemmi,
  highlightedAreas 
}: { 
  children?: React.ReactNode; 
  markers: any[];
  highlightedLemmi: Set<string>;
  highlightedAreas: Set<string>;
}) {
  const map = useMap();
  const clusterGroupRef = useRef<any>(null);
  const markersMapRef = useRef<Map<string, L.Marker>>(new Map());

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Crea il cluster group con opzioni ottimizzate e animazioni
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
      disableClusteringAtZoom: 16,
      
      // Animazioni
      animate: true,
      animateAddingMarkers: true,
      spiderfyDistanceMultiplier: 1.5,

      // Icone cluster personalizzate con animazioni
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

    clusterGroupRef.current = markerClusterGroup;
    const newMarkersMap = new Map<string, L.Marker>();

    // Aggiungi marker al cluster
    markers.forEach((marker, index) => {
      // Check se marker è evidenziato
      const isHighlighted = marker.lemmi.some((l: any) => 
        highlightedLemmi.has(l.IdLemma) || highlightedAreas.has(l.CollGeografica)
      );
      
      const isSelected = marker.lemmi.some((l: any) => highlightedLemmi.has(l.IdLemma));

      const leafletMarker = L.marker([marker.lat, marker.lng], {
        icon: createMinimalIcon(isHighlighted, isSelected)
      });

      // Aggiungi classe per spawn animation
      setTimeout(() => {
        const markerElement = leafletMarker.getElement();
        if (markerElement) {
          markerElement.classList.add('marker-spawning');
        }
      }, index * 30); // Stagger spawn

      // Raggruppa per Lemma
      const lemmaGroups = new Map<string, any[]>();
      marker.lemmi.forEach((lemma: any) => {
        const lemmaKey = lemma.Lemma;
        if (!lemmaGroups.has(lemmaKey)) {
          lemmaGroups.set(lemmaKey, []);
        }
        lemmaGroups.get(lemmaKey)!.push(lemma);
      });

      // Costruisci HTML del popup con tutte le forme
      let popupContent = '<div class="p-2" style="max-height: 300px; overflow-y: auto;">';

      lemmaGroups.forEach((lemmi, lemmaName) => {
        popupContent += `<div class="mb-3"><h3 class="font-bold text-base">${lemmaName}</h3>`;

        // Estrai categoria (comune a tutti)
        const categoria = lemmi[0].Categoria || '';
        if (categoria) {
          popupContent += `<p class="text-xs text-gray-600 mb-1"><strong>Categoria:</strong> ${categoria}</p>`;
        }

        // Lista forme
        popupContent += '<ul class="text-sm space-y-0.5 ml-2">';
        lemmi.forEach((lemma: any) => {
          popupContent += `<li><em>${lemma.Forma}</em> (${lemma.Anno || lemma.Periodo || 'n.d.'})`;
          if (lemma.Frequenza && lemma.Frequenza !== '1') {
            popupContent += ` - freq: ${lemma.Frequenza}`;
          }
          popupContent += '</li>';
        });
        popupContent += '</ul></div>';
      });

      popupContent += '</div>';

      leafletMarker.bindPopup(popupContent, { maxWidth: 300 });
      
      // Store marker reference con key unico
      const markerKey = `${marker.lat}-${marker.lng}`;
      newMarkersMap.set(markerKey, leafletMarker);
      
      markerClusterGroup.addLayer(leafletMarker);
    });

    markersMapRef.current = newMarkersMap;

    // Aggiungi alla mappa
    map.addLayer(markerClusterGroup);

    // Cleanup
    return () => {
      map.removeLayer(markerClusterGroup);
    };
  }, [map, markers, highlightedLemmi, highlightedAreas]);

  // Update marker icons quando highlighting cambia
  useEffect(() => {
    if (!clusterGroupRef.current || markersMapRef.current.size === 0) return;

    markers.forEach(marker => {
      const markerKey = `${marker.lat}-${marker.lng}`;
      const leafletMarker = markersMapRef.current.get(markerKey);
      
      if (leafletMarker) {
        const isHighlighted = marker.lemmi.some((l: any) => 
          highlightedLemmi.has(l.IdLemma) || highlightedAreas.has(l.CollGeografica)
        );
        const isSelected = marker.lemmi.some((l: any) => highlightedLemmi.has(l.IdLemma));
        
        // Update icon
        leafletMarker.setIcon(createMinimalIcon(isHighlighted, isSelected));
      }
    });
  }, [highlightedLemmi, highlightedAreas, markers]);

  return null;
}

export function GeographicalMap() {
  const { filteredLemmi, geoAreas } = useApp();  const { highlightState } = useHighlight();
  const [isLoading, setIsLoading] = useState(true);
  // Cache Map per IdAmbito -> GeoArea (ottimizzazione)
  const geoAreasMap = useMemo(() => {
    const map = new Map<number, any>();
    geoAreas.forEach(area => {
      map.set(area.properties.id, area);
    });
    return map;
  }, [geoAreas]);

  // Prepara marker per località puntuali (raggruppati per coordinate)
  const markers = useMemo(() => {
    // Raggruppa per coordinate per gestire forme multiple nella stessa località
    const coordMap = new Map<string, { lat: number; lng: number; lemmi: any[] }>();

    filteredLemmi.forEach(lemma => {
      // Solo località con coordinate valide
      if (lemma.Latitudine && lemma.Longitudine &&
          lemma.Latitudine !== '#N/A' && lemma.Longitudine !== '#N/A') {
        const lat = parseFloat(lemma.Latitudine.replace(',', '.'));
        const lng = parseFloat(lemma.Longitudine.replace(',', '.'));

        if (!isNaN(lat) && !isNaN(lng)) {
          const key = `${lat.toFixed(6)},${lng.toFixed(6)}`;

          if (!coordMap.has(key)) {
            coordMap.set(key, { lat, lng, lemmi: [] });
          }
          coordMap.get(key)!.lemmi.push(lemma);
        }
      }
    });

    return Array.from(coordMap.values());
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

  // Loading effect
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [filteredLemmi]);

  return (
    <div className="relative h-[580px] w-full">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="map-loading-overlay">
          <div className="map-loading-spinner"></div>
        </div>
      )}

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
        zoomControl={true}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Marker puntuali con clustering e highlighting */}
        {markers.length > 0 && (
          <MarkerClusterGroup 
            markers={markers}
            highlightedLemmi={highlightState.highlightedLemmaIds}
            highlightedAreas={highlightState.highlightedGeoAreas}
          />
        )}

        {/* Poligoni aree geografiche con highlighting */}
        {polygons.map((poly, idx) => {
          // Check se polygon è evidenziato
          const isHighlighted = poly.lemmi.some((l: any) => 
            highlightState.highlightedLemmaIds.has(l.IdLemma) ||
            highlightState.highlightedGeoAreas.has(l.CollGeografica)
          );

          // Raggruppa per Lemma per visualizzazione organizzata
          const lemmaGroups = new Map<string, any[]>();
          poly.lemmi.forEach((lemma: any) => {
            const lemmaKey = lemma.Lemma;
            if (!lemmaGroups.has(lemmaKey)) {
              lemmaGroups.set(lemmaKey, []);
            }
            lemmaGroups.get(lemmaKey)!.push(lemma);
          });

          // Costruisci popup con tutte le forme raggruppate
          let popupContent = '<div class="p-2" style="max-height: 300px; overflow-y: auto;">';
          popupContent += `<h3 class="font-bold text-base mb-2">${poly.geoArea.properties.dialetto}</h3>`;
          popupContent += `<p class="text-xs text-gray-600 mb-2"><strong>Attestazioni:</strong> ${poly.lemmi.length}</p>`;

          lemmaGroups.forEach((lemmi, lemmaName) => {
            popupContent += `<div class="mb-2"><h4 class="font-semibold text-sm">${lemmaName}</h4>`;

            // Categoria (comune)
            const categoria = lemmi[0].Categoria || '';
            if (categoria) {
              popupContent += `<p class="text-xs text-gray-600"><strong>Categoria:</strong> ${categoria}</p>`;
            }

            // Forme
            popupContent += '<ul class="text-xs ml-2 mt-1">';
            lemmi.forEach((lemma: any) => {
              popupContent += `<li><em>${lemma.Forma}</em> (${lemma.Anno || lemma.Periodo || 'n.d.'})`;
              if (lemma.Frequenza && lemma.Frequenza !== '1') {
                popupContent += ` - freq: ${lemma.Frequenza}`;
              }
              popupContent += '</li>';
            });
            popupContent += '</ul></div>';
          });

          popupContent += '</div>';

          return (
            <GeoJSON
              key={`polygon-${idx}`}
              data={poly.geoArea as any}
              style={{
                fillColor: isHighlighted ? '#2563eb' : '#3b82f6',
                fillOpacity: isHighlighted ? 0.5 : 0.3,
                color: isHighlighted ? '#1e40af' : '#2563eb',
                weight: isHighlighted ? 3 : 2,
                className: isHighlighted ? 'highlighted' : ''
              }}
              onEachFeature={(_, layer) => {
                layer.bindPopup(popupContent, { maxWidth: 350 });
              }}
            />
          );
        })}

        {markers.length > 0 && (
          <MapUpdater 
            markers={markers} 
            highlightedAreas={highlightState.highlightedGeoAreas}
          />
        )}
      </MapContainer>
    </div>
  );
}
