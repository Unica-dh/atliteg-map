'use client';

import { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON, useMap } from 'react-leaflet';
import { useApp } from '@/context/AppContext';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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

export function GeographicalMap() {
  const { filteredLemmi, geoAreas, setFilters } = useApp();

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

  // Prepara aree geografiche poligonali
  const polygons = useMemo(() => {
    const result: Array<{ geoArea: any; lemmi: any[] }> = [];
    
    filteredLemmi.forEach(lemma => {
      if (lemma.IdAmbito && lemma.IdAmbito.trim()) {
        const idAmbito = parseInt(lemma.IdAmbito);
        const geoArea = geoAreas.find(area => area.properties.id === idAmbito);
        
        if (geoArea) {
          const existing = result.find(r => r.geoArea.properties.id === idAmbito);
          if (existing) {
            existing.lemmi.push(lemma);
          } else {
            result.push({ geoArea, lemmi: [lemma] });
          }
        }
      }
    });
    
    return result;
  }, [filteredLemmi, geoAreas]);

  const totalLocations = markers.length + polygons.length;
  const totalLemmas = new Set(filteredLemmi.map(l => l.IdLemma)).size;

  return (
    <div className="relative h-[600px] w-full">
      {/* Contatore in alto a destra */}
      <div className="absolute top-4 right-4 z-[1000] bg-white px-4 py-2 rounded-md shadow-lg">
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

        {/* Marker puntuali */}
        {markers.map((marker, idx) => (
          <Marker
            key={`marker-${idx}`}
            position={[marker.lat, marker.lng]}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-lg">{marker.lemma.Lemma}</h3>
                <p className="text-sm"><strong>Forma:</strong> {marker.lemma.Forma}</p>
                <p className="text-sm"><strong>Località:</strong> {marker.lemma.CollGeografica}</p>
                <p className="text-sm"><strong>Anno:</strong> {marker.lemma.Anno}</p>
              </div>
            </Popup>
          </Marker>
        ))}

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
            onEachFeature={(feature, layer) => {
              layer.bindPopup(`
                <div class="p-2">
                  <h3 class="font-bold text-lg">${poly.geoArea.properties.dialetto}</h3>
                  <p class="text-sm"><strong>Attestazioni:</strong> ${poly.lemmi.length}</p>
                  <p class="text-sm"><strong>Lemmi:</strong> ${[...new Set(poly.lemmi.map(l => l.Lemma))].join(', ')}</p>
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
