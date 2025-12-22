# Copilot Instructions for atliteg-map

## Project Overview
- **atliteg-map** maps & visualizes Italian gastronomic language evolution and geographic distribution from medieval era to unification.
- Next.js 16 (App Router) + React + TypeScript + Tailwind CSS + Leaflet for interactive maps.
- Data: static JSON/CSV files (pre-processed for performance).
- Containerized deployment: Docker + Nginx.
- Primary research context: VoSLIG (Vocabolario storico lingua italiana gastronomia).

## Architecture & Data Flow
- **Static-first**: All frontend data from `/public/data/` (no backend API).
- **Data layer**: `dataLoader.ts` loads pre-processed JSON (faster than CSV); falls back to CSV legacy parsing.
- **State management**: `AppContext` (React Context) manages lemmi, geoAreas, filters, metrics.
- **Hooks**: `useFilteredData` (filters lemmi), `useMetrics` (aggregates counts), `useDebounce` (search optimization).

## Key Components & Structure
- **/lemmario-dashboard/**: Main app
  - `app/`: Next.js App Router (page.tsx, layout.tsx, globals.css)
  - `components/`: Reusable UI (Header.tsx, GeographicalMap.tsx, Filters.tsx, LemmaDetail.tsx, Timeline.tsx)
  - `context/AppContext.tsx`: Global state (lemmi, filters, metrics)
  - `services/dataLoader.ts`: JSON + CSV loading with fallback
  - `hooks/`: Custom hooks (useFilteredData, useMetrics, useDebounce)
  - `types/lemma.ts`: TypeScript interfaces (Lemma, GeoArea, FilterState)
  - `public/data/`: Static data files (lemmi.json, geoAreas.json, etc.)
  - `public/`: Assets (logo, images, marker icons)
- **/data/**: Source data (raw CSV, JSON, metadata)
- **/docs/**: Architecture, deployment, dataset specs
- **/process_data.py**: Python preprocessing (CSV → optimized JSON)

## Critical Developer Workflows
- **Local dev**: `cd lemmario-dashboard && npm install && npm run dev` (Turbopack, http://localhost:3000)
- **Build & deploy**: `npm run build && npm run start`
- **Docker**: `docker-compose build && docker-compose up -d` (root or lemmario-dashboard/)
- **Data pipeline**: 
  1. Add/update files in `data/` (CSV, JSON)
  2. Run `process_data.py` to preprocess
  3. Copy results to `public/data/` (frontend must access from here)
  4. Restart app to load new data
- **Testing**: Check `TEST_CHECKLIST.md` for manual testing scenarios

## Component Patterns
- **Header.tsx**: Logo + project metadata (fixed at top, uses Image component for logo assets)
- **GeographicalMap.tsx**: Leaflet map with MarkerCluster, GeoJSON layers; handles SSR issues with dynamic imports
- **Filters.tsx**: Category + period dropdowns; updates AppContext via `setFilters()`
- **LemmaDetail.tsx**: Modal showing lemma etymology, locations, timeline
- **Timeline.tsx**: Temporal visualization of lemma occurrences
- **SearchBar.tsx**: Debounced search via `useDebounce` hook
- **MetricsSummary.tsx**: Renders metrics (locations, lemmi, years, attestations) from `useMetrics` hook

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

**Adding a new filter:**
1. Extend `FilterState` interface in `types/lemma.ts`
2. Add filter UI in `components/Filters.tsx`
3. Update `useFilteredData` hook logic to apply filter
4. Update `MetricsSummary` if affects metrics display

**Modifying map layers:**
- Edit `GeographicalMap.tsx` for marker behavior, clustering, GeoJSON rendering
- Ensure SSR compatibility: use dynamic imports for leaflet plugins (see markercluster)
- Icons and assets must be in `/public/` (use Image component for optimized assets)

**Data loading fallbacks:**
- `dataLoader.ts` prefers JSON (preprocessed) but falls back to CSV parsing
- If adding new CSV columns, update type in `lemma.ts` and parser in `dataLoader.ts`
- Always copy updated data to `public/data/` before frontend access

**Styling conventions:**
- Use Tailwind utility classes (no custom CSS except in `globals.css`)
- Responsive breakpoints: `md:` for tablet/desktop, base for mobile
- Colors: primary blue (#0B5FA5), white text on dark backgrounds (`text-white/95`)

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
