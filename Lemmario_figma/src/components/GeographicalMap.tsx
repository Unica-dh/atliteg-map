import { useEffect, useRef, useState } from 'react';
import { Search, MapPin } from 'lucide-react';
import { Input } from './ui/input';
import { Lemma } from '../data/mockData';
import L from 'leaflet';

interface GeographicalMapProps {
  lemmas: Lemma[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onLocationSelect: (category: string) => void;
  onLemmaSelect: (lemma: Lemma) => void;
  selectedLemma: Lemma | null;
}

export function GeographicalMap({
  lemmas,
  searchQuery,
  onSearchChange,
  onLocationSelect,
  onLemmaSelect,
  selectedLemma,
}: GeographicalMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const markerLemmasRef = useRef<Map<string, Lemma[]>>(new Map());
  const autocompleteRef = useRef<HTMLDivElement>(null);
  const [showAutocomplete, setShowAutocomplete] = useState(false);

  // Get all unique lemmas for autocomplete (use all mockLemmas, not filtered)
  const [allLemmas, setAllLemmas] = useState<Lemma[]>([]);

  // Filter lemmas for autocomplete suggestions - group by Lemma name
  const autocompleteSuggestions = (() => {
    if (!searchQuery.trim()) return [];
    
    // Filter lemmas that match the search query
    const matchingLemmas = allLemmas.filter(lemma => 
      lemma.Lemma.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lemma.Forma.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    // Group by Lemma name to show only one result per lemma
    const lemmaGroups = matchingLemmas.reduce((acc, lemma) => {
      const lemmaName = lemma.Lemma.toLowerCase();
      if (!acc[lemmaName]) {
        acc[lemmaName] = [];
      }
      acc[lemmaName].push(lemma);
      return acc;
    }, {} as Record<string, Lemma[]>);
    
    // Create unique suggestions with all forms
    return Object.entries(lemmaGroups).slice(0, 10).map(([lemmaName, lemmaGroup]) => {
      const uniqueForms = Array.from(new Set(lemmaGroup.map(l => l.Forma)));
      return {
        lemma: lemmaGroup[0], // Use first lemma as representative
        allForms: uniqueForms,
        locations: Array.from(new Set(lemmaGroup.map(l => l.CollGeografica)))
      };
    });
  })();

  // Handle click outside to close autocomplete
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (autocompleteRef.current && !autocompleteRef.current.contains(event.target as Node)) {
        setShowAutocomplete(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get all lemmas for autocomplete when component mounts
  useEffect(() => {
    // Import all lemmas from mockData
    import('../data/mockData').then(module => {
      setAllLemmas(module.mockLemmas);
    });
  }, []);

  // Group lemmas by location
  const locationGroups = lemmas.reduce((acc, lemma) => {
    const location = lemma.CollGeografica;
    if (!acc[location]) {
      acc[location] = [];
    }
    acc[location].push(lemma);
    return acc;
  }, {} as Record<string, Lemma[]>);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Add Leaflet CSS to document head
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
      link.crossOrigin = '';
      document.head.appendChild(link);
    }

    // Wait a bit for CSS to load
    setTimeout(() => {
      if (!mapContainerRef.current || mapRef.current) return;

      // Create map centered on Italy
      const map = L.map(mapContainerRef.current, {
        center: [42.5, 12.5], // Center of Italy
        zoom: 6,
        zoomControl: true,
        scrollWheelZoom: true,
      });

      // Add OpenStreetMap tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      mapRef.current = map;
    }, 100);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update markers when lemmas change
  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Create custom icon using divIcon (no image files needed)
    const customIcon = L.divIcon({
      className: 'custom-marker',
      html: `<div style="
        background-color: #0284c7;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      "></div>`,
      iconSize: [26, 26],
      iconAnchor: [13, 13],
    });

    // Add markers for each location
    Object.entries(locationGroups).forEach(([location, locationLemmas]) => {
      const lemma = locationLemmas[0];
      if (!lemma.lat || !lemma.lng) return;

      const marker = L.marker([lemma.lat, lemma.lng], { icon: customIcon })
        .addTo(mapRef.current!);

      // Create popup content with clickable lemmas
      const popupContent = `
        <div style="min-width: 200px;">
          <h3 style="font-weight: 600; margin-bottom: 8px; font-size: 14px;">${location}</h3>
          <p style="color: #6b7280; margin-bottom: 8px; font-size: 13px;">
            ${locationLemmas.length} lemma${locationLemmas.length > 1 ? 's' : ''}
          </p>
          <div style="max-height: 200px; overflow-y: auto;">
            ${locationLemmas.map((l, index) => `
              <button 
                data-lemma-id="${l.IdLemma}"
                style="
                  width: 100%;
                  text-align: left;
                  padding: 6px 8px;
                  border: none;
                  background: ${index % 2 === 0 ? '#f9fafb' : 'white'};
                  cursor: pointer;
                  border-radius: 4px;
                  margin-bottom: 2px;
                  font-size: 12px;
                "
                onmouseover="this.style.background='#dbeafe'"
                onmouseout="this.style.background='${index % 2 === 0 ? '#f9fafb' : 'white'}'"
              >
                <div><strong>Lemma:</strong> ${l.Lemma}</div>
                <div style="color: #6b7280;"><strong>Forma:</strong> ${l.Forma}</div>
                <div style="color: #6b7280;"><strong>Anno:</strong> ${l.Anno}</div>
              </button>
            `).join('')}
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);
      
      marker.on('popupopen', () => {
        // Add click listeners to lemma buttons in popup
        const popup = marker.getPopup();
        if (popup) {
          const popupElement = popup.getElement();
          if (popupElement) {
            const buttons = popupElement.querySelectorAll('[data-lemma-id]');
            buttons.forEach((button) => {
              button.addEventListener('click', (e) => {
                const lemmaId = (e.currentTarget as HTMLElement).getAttribute('data-lemma-id');
                const selectedLemma = locationLemmas.find(l => l.IdLemma === lemmaId);
                if (selectedLemma) {
                  onLemmaSelect(selectedLemma);
                  marker.closePopup();
                }
              });
            });
          }
        }
      });

      markersRef.current.push(marker);
      markerLemmasRef.current.set(marker._leaflet_id.toString(), locationLemmas);
    });
  }, [lemmas, locationGroups, onLocationSelect, onLemmaSelect]);

  // Handle selectedLemma changes - open popup for selected lemma
  useEffect(() => {
    if (!mapRef.current || !selectedLemma) return;

    // Find the marker that contains the selected lemma
    for (const marker of markersRef.current) {
      const markerId = marker._leaflet_id.toString();
      const locationLemmas = markerLemmasRef.current.get(markerId);
      
      if (locationLemmas && locationLemmas.some(l => l.IdLemma === selectedLemma.IdLemma)) {
        // Found the marker with the selected lemma
        
        // Update marker icon to highlight it
        const highlightedIcon = L.divIcon({
          className: 'custom-marker-selected',
          html: `<div style="
            background-color: #2563eb;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            border: 4px solid #fbbf24;
            box-shadow: 0 4px 12px rgba(0,0,0,0.4);
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          "></div>
          <style>
            @keyframes pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: .5; }
            }
          </style>`,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });
        
        marker.setIcon(highlightedIcon);
        
        // Pan to marker
        mapRef.current.setView(marker.getLatLng(), Math.max(mapRef.current.getZoom(), 8), {
          animate: true,
          duration: 0.5,
        });
        
        // Open popup
        marker.openPopup();
        
        // Reset other markers to default icon
        markersRef.current.forEach(m => {
          if (m !== marker) {
            const defaultIcon = L.divIcon({
              className: 'custom-marker',
              html: `<div style="
                background-color: #0284c7;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                border: 3px solid white;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              "></div>`,
              iconSize: [26, 26],
              iconAnchor: [13, 13],
            });
            m.setIcon(defaultIcon);
          }
        });
        
        break;
      }
    }
  }, [selectedLemma]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-gray-900">Geographical Distribution of Lemmas</h2>
        <div className="flex items-center gap-2 text-gray-600">
          <MapPin className="w-4 h-4" />
          <span>
            {Object.keys(locationGroups).length} location{Object.keys(locationGroups).length !== 1 ? 's' : ''} • {lemmas.length} lemma{lemmas.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative" ref={autocompleteRef}>
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
        <Input
          type="text"
          placeholder="Cerca per lemma o forma"
          value={searchQuery}
          onChange={(e) => {
            onSearchChange(e.target.value);
            setShowAutocomplete(true);
          }}
          onFocus={() => setShowAutocomplete(true)}
          className="pl-10"
        />
        {showAutocomplete && autocompleteSuggestions.length > 0 && (
          <div
            className="absolute left-0 top-full mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto"
          >
            {autocompleteSuggestions.map((suggestion) => (
              <button
                key={suggestion.lemma.IdLemma}
                className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0"
                onClick={() => {
                  onLemmaSelect(suggestion.lemma);
                  onSearchChange(suggestion.lemma.Lemma);
                  setShowAutocomplete(false);
                }}
              >
                <div className="text-sm">
                  <div className="text-gray-900">
                    <span className="text-gray-500">Lemma:</span> <strong>{suggestion.lemma.Lemma}</strong>
                  </div>
                  <div className="text-gray-600 text-xs mt-1">
                    <span>Forme: {suggestion.allForms.join(', ')}</span> • <span>Anno: {suggestion.lemma.Anno}</span> • <span>{suggestion.locations.join(', ')}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Map Container */}
      <div 
        ref={mapContainerRef} 
        className="w-full h-[400px] rounded-lg overflow-hidden border border-gray-200"
        style={{ zIndex: 0 }}
      />
    </div>
  );
}