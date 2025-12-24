# Copilot Instructions for atliteg-map

## Project Overview
- **atliteg-map** maps & visualizes Italian gastronomic language evolution and geographic distribution from medieval era to unification.
- Next.js 16 (App Router, Turbopack) + React 19 + TypeScript + Tailwind CSS + Leaflet for interactive maps.
- Data: static JSON/CSV files (pre-processed for performance).
- Containerized deployment: Docker + Nginx (multi-stage build, static export).
- Primary research context: VoSLIG (Vocabolario storico lingua italiana gastronomia).
- Academic collaboration: Labgeo "Giuseppe Caraci" (Università Roma Tre), PRIN 2017 funding.

## Architecture & Data Flow
- **Static-first**: All frontend data from `/public/data/` (no backend API).
- **Data layer**: `dataLoader.ts` loads pre-processed JSON (faster than CSV); falls back to CSV legacy parsing.
- **State management**: `AppContext` (React Context) manages lemmi, geoAreas, filters, metrics.
- **Hooks**: `useFilteredData` (filters lemmi), `useMetrics` (aggregates counts), `useDebounce` (search optimization).
- **Build pipeline**: Next.js static export → Docker multi-stage → Nginx serving on port 9000.

## Key Components & Structure
- **/lemmario-dashboard/**: Main app (Next.js 16 project)
  - `app/`: Next.js App Router (page.tsx, layout.tsx, globals.css)
  - `components/`: Reusable UI (Header, GeographicalMap, Filters, LemmaDetail, Timeline, MapBoundedPopup)
  - `context/`: React Context providers (AppContext, HighlightContext)
  - `services/dataLoader.ts`: JSON + CSV loading with fallback
  - `hooks/`: Custom hooks (useFilteredData, useMetrics, useDebounce, useReducedMotion)
  - `types/lemma.ts`: TypeScript interfaces (Lemma, GeoArea, FilterState, Metrics)
  - `public/data/`: Static data files (lemmi.json, geoAreas.json, CSV files)
  - `public/`: Assets (logo, images, marker icons)
  - `scripts/preprocess-data.js`: Node.js data preprocessing (runs pre-build)
  - `Dockerfile`: Multi-stage build (Node build → Nginx static serve)
  - `nginx.conf`: Nginx configuration for SPA routing
- **/data/**: Source data (raw CSV, JSON, GeoJSON metadata)
- **/docs/**: Architecture, deployment, dataset specs, proposals, test reports
- **/process_data.py**: Python preprocessing (CSV → optimized JSON) - legacy

## Critical Developer Workflows

### Local Development
```bash
cd lemmario-dashboard
npm install
npm run dev  # Turbopack dev server at http://localhost:3000
```

### Production Build & Deploy
```bash
# Local production build
cd lemmario-dashboard
npm run prebuild  # Runs scripts/preprocess-data.js
npm run build     # Next.js static export to 'out/'
npm run start     # Serve static build with npx serve@latest

# Docker deployment (from project root)
docker compose build
docker compose up -d  # Runs at http://localhost:9000
docker compose logs -f lemmario-dashboard  # View logs
docker compose down  # Stop container

# Docker rebuild (after code changes)
docker compose up --build -d
```

### Data Pipeline
1. **Add/update source data**: Place CSV/JSON in `data/` directory
2. **Preprocess data**: Run `node lemmario-dashboard/scripts/preprocess-data.js` OR `npm run preprocess` (auto-runs on `npm run build`)
3. **Copy to public**: Data must be in `lemmario-dashboard/public/data/` for frontend access
4. **Rebuild & restart**: `npm run build` or `docker compose up --build -d`

### Testing & Validation
- Manual testing: Follow `lemmario-dashboard/TEST_CHECKLIST.md`
- Check build output: Verify `lemmario-dashboard/out/` after build
- Test Docker health: `docker compose ps` (should show "healthy" status)
- Browser DevTools: Check console for data loading errors

## Component Patterns

### Core UI Components
- **Header.tsx**: Fixed-top logo + project metadata, uses Next.js Image component
- **GeographicalMap.tsx**: Leaflet map with MarkerCluster, GeoJSON layers, SSR-safe dynamic imports
- **Filters.tsx**: Category + period multi-select dropdowns (Radix UI), updates AppContext
- **LemmaDetail.tsx**: Modal dialog (Radix UI) showing etymology, locations, timeline
- **Timeline.tsx**: Temporal visualization with year markers
- **SearchBar.tsx**: Debounced search (300ms) via `useDebounce` hook
- **MetricsSummary.tsx**: Dashboard metrics from `useMetrics` hook
- **MapBoundedPopup.tsx**: Accordion-based popup for map markers (see Leaflet Integration below)

### Leaflet Integration Patterns

#### Rendering React Components in Leaflet Popups
**CRITICAL**: Leaflet popups use raw DOM, not React DOM. To render React components inside popups:

```tsx
import { createRoot } from 'react-dom/client';

// In marker creation:
const popupContainer = document.createElement('div');
const popup = L.popup({ maxWidth: 900, className: 'custom-popup' });
marker.bindPopup(popup);

// On popup open - mount React component
marker.on('popupopen', () => {
  const root = createRoot(popupContainer);
  root.render(<YourReactComponent {...props} />);
  popup.setContent(popupContainer);
});

// On popup close - cleanup to avoid memory leaks
marker.on('popupclose', () => {
  popupContainer.innerHTML = ''; // Unmount React component
});
```

**Key Rules**:
1. Always use `createRoot(container)` for React 18+ compatibility
2. Clean up on `popupclose` to prevent memory leaks
3. Pass callbacks via props (e.g., `onClose={() => marker.closePopup()}`)
4. Apply custom styles via `globals.css` with Leaflet class overrides

#### SSR Compatibility
```tsx
// Dynamic import for SSR-incompatible libraries
if (typeof window !== 'undefined') {
  require('leaflet.markercluster');
}

// Or use Next.js dynamic
import dynamic from 'next/dynamic';
const MapComponent = dynamic(() => import('./Map'), { ssr: false });
```

#### Marker Clustering Configuration
```tsx
const markerClusterGroup = L.markerClusterGroup({
  maxClusterRadius: 80,
  disableClusteringAtZoom: 16,
  showCoverageOnHover: false,
  animate: false, // Disable for stability
  chunkedLoading: true, // Performance optimization
  iconCreateFunction: (cluster) => {
    const count = cluster.getChildCount();
    return L.divIcon({
      html: `<div><span>${count}</span></div>`,
      className: 'marker-cluster marker-cluster-medium',
      iconSize: L.point(40, 40)
    });
  }
});
```

## State Management & Hooks Pattern
- **AppContext**: Provides global state (`lemmi`, `geoAreas`, `filters`, `isLoading`, `metrics`)
  - Use `useApp()` hook in components to access context
  - Call `setFilters()` to update filters (triggers re-renders)
  - Call `resetFilters()` to clear all filters
- **useFilteredData**: Memoized hook that filters lemmi based on current filters (category, period, search, letter)
- **useMetrics**: Calculates aggregated stats (location count, lemma count, year range, attestation count)
- **useDebounce**: Debounces search queries to avoid excessive re-renders (300ms delay)
- **Lemma type structure**: `{ id, lemma, forms, categorie, periodi, geoAree, numerosità, formazioni_storiche, risorse, etymology }`
- **GeoArea type**: `{ properties: { id, nome }, geometry: { type, coordinates } }` (GeoJSON format)

## Common Implementation Patterns

### Adding a new filter:
1. Extend `FilterState` interface in `types/lemma.ts`
2. Add filter UI in `components/Filters.tsx`
3. Update `useFilteredData` hook logic to apply filter
4. Update `MetricsSummary` if affects metrics display

### Modifying map layers:
- Edit `GeographicalMap.tsx` for marker behavior, clustering, GeoJSON rendering
- Ensure SSR compatibility: use dynamic imports for leaflet plugins (see markercluster)
- Icons and assets must be in `/public/` (use Image component for optimized assets)
- For React components in popups: use `createRoot` pattern (see Leaflet Integration above)

### Data loading fallbacks:
- `dataLoader.ts` prefers JSON (preprocessed) but falls back to CSV parsing
- If adding new CSV columns, update type in `lemma.ts` and parser in `dataLoader.ts`
- Always copy updated data to `public/data/` before frontend access

### Styling conventions:
- Use Tailwind utility classes (no custom CSS except in `globals.css`)
- Responsive breakpoints: `md:` for tablet/desktop, base for mobile
- Colors: primary blue (#0B5FA5), white text on dark backgrounds (`text-white/95`)
- For Leaflet popups: override in `globals.css` with `.leaflet-popup` selectors

### Multi-column responsive layouts:
```tsx
// Example: 3 columns on large, 2 on medium, 1 on mobile
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
  {columns.map((col, idx) => (
    <div key={idx} className="space-y-2">
      {col.map(item => <Item key={item.id} {...item} />)}
    </div>
  ))}
</div>
```

### Accordion patterns:
```tsx
const [expanded, setExpanded] = useState<Set<string>>(new Set());

const toggle = (id: string) => {
  setExpanded(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });
};

// Render with ChevronDownIcon rotation
<button onClick={() => toggle(id)}>
  <ChevronDownIcon className={`w-4 h-4 transition-transform ${
    expanded.has(id) ? 'rotate-180' : ''
  }`} />
</button>
```

## Integration & External Dependencies
- **Next.js 16 (App Router)**: Routing and SSR/SSG
- **React-Leaflet**: Map rendering
- **PapaParse**: CSV parsing in browser
- **Docker/Nginx**: Containerized deployment

## Key Files Reference
- [types/lemma.ts](lemmario-dashboard/types/lemma.ts) - All TypeScript interfaces (Lemma, GeoArea, FilterState, Metrics)
- [context/AppContext.tsx](lemmario-dashboard/context/AppContext.tsx) - Global state provider & useApp hook
- [services/dataLoader.ts](lemmario-dashboard/services/dataLoader.ts) - JSON/CSV loading with fallback
- [components/GeographicalMap.tsx](lemmario-dashboard/components/GeographicalMap.tsx) - Leaflet map with markers
- [hooks/useFilteredData.ts](lemmario-dashboard/hooks/useFilteredData.ts) - Filter logic for lemmi
- [hooks/useMetrics.ts](lemmario-dashboard/hooks/useMetrics.ts) - Aggregated stats calculation
- [app/page.tsx](lemmario-dashboard/app/page.tsx) - Main page layout
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) - Detailed system design
