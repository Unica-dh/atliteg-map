# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**ATLITEG** (Atlante della lingua e dei testi della cultura gastronomica italiana) is an academic research dashboard that maps and visualizes Italian gastronomic language evolution and geographic distribution from medieval times to Italian unification. It provides interactive exploration of historical linguistic data from the VoSLIG (Vocabolario storico lingua italiana gastronomia).

**Key Collaborators**: Labgeo "Giuseppe Caraci" (Università Roma Tre), PRIN 2017 funding, prof.ssa Giovanna Frosini (Università per Stranieri di Siena)

**Tech Stack**: Next.js 16 (App Router, Turbopack), React 19, TypeScript, Tailwind CSS, React-Leaflet, Docker/Nginx

## Build and Development Commands

### Local Development
```bash
cd lemmario-dashboard
npm install
npm run dev  # Turbopack dev server at http://localhost:3000
```

### Production Build
```bash
cd lemmario-dashboard
npm run prebuild  # Runs scripts/preprocess-data.js (auto-runs before build)
npm run build     # Next.js static export to 'out/'
npm run start     # Serve static build at http://localhost:3000
```

### Docker Deployment
```bash
# From project root
docker compose build
docker compose up -d  # Runs at http://localhost:9000
docker compose logs -f lemmario-dashboard
docker compose down

# Rebuild after code changes
docker compose up --build -d
```

### Data Preprocessing
```bash
cd lemmario-dashboard
node scripts/preprocess-data.js  # Or: npm run preprocess
```

## Architecture Overview

### Static-First Data Flow

**CRITICAL**: This is a **static-first architecture** with no backend API. All data flows through pre-processed JSON files:

1. **Source data**: CSV files in `/data/` (volume-mounted in Docker)
2. **Preprocessing**: `scripts/preprocess-data.js` converts CSV → optimized JSON
3. **Frontend consumption**: Static JSON files served from `/public/data/`
4. **Data loader**: `services/dataLoader.ts` loads JSON with CSV fallback

### Directory Structure

```
atliteg-map/
├── data/                          # Source data (Docker volume mount)
│   └── Lemmi_forme_atliteg_updated.csv
├── lemmario-dashboard/            # Main Next.js app
│   ├── app/                       # App Router (page.tsx, layout.tsx)
│   ├── components/                # UI components
│   ├── context/                   # React Context (AppContext, HighlightContext)
│   ├── services/dataLoader.ts     # JSON/CSV loading with fallback
│   ├── hooks/                     # Custom hooks (useFilteredData, useMetrics, useDebounce)
│   ├── types/lemma.ts             # TypeScript interfaces
│   ├── public/data/               # Static data (lemmi.json, geojson.json)
│   ├── scripts/preprocess-data.js # Node.js data preprocessing
│   └── Dockerfile                 # Multi-stage build (Node → Nginx)
├── docs/                          # Architecture, deployment guides
└── docker-compose.yml
```

### State Management Pattern

- **AppContext** ([context/AppContext.tsx](lemmario-dashboard/context/AppContext.tsx)): Global state provider
  - Access via `useApp()` hook
  - State: `lemmi`, `geoAreas`, `filters`, `isLoading`, `metrics`
  - Methods: `setFilters()`, `resetFilters()`

- **useFilteredData** ([hooks/useFilteredData.ts](lemmario-dashboard/hooks/useFilteredData.ts)): Memoized filter logic
- **useMetrics** ([hooks/useMetrics.ts](lemmario-dashboard/hooks/useMetrics.ts)): Aggregated statistics
- **useDebounce**: 300ms search debouncing

### Key TypeScript Interfaces

See [types/lemma.ts](lemmario-dashboard/types/lemma.ts):

```typescript
interface Lemma {
  IdLemma: string;
  Lemma: string;
  Forma: string;
  CollGeografica: string;
  Latitudine: string;
  Longitudine: string;
  TipoCollGeografica: string;
  Anno: string;
  Periodo: string;
  Categoria: string;
  RegionIstatCode?: string;  // ISTAT region code
  // ... more fields
}

interface GeoArea {
  type: string;
  properties: { id: number; dialetto: string };
  geometry: { type: string; coordinates: number[][][][] };
}

interface FilterState {
  categorie: string[];
  periodi: string[];
  searchQuery: string;
  selectedLemmaId: string | null;
  selectedLetter: string | null;
  selectedYear: string | null;
}
```

## Critical Data Update Workflow

**⚠️ IMPORTANT**: Due to Docker volume mounting, updating CSV data requires a specific procedure:

### The Problem
Docker Compose mounts `./data/` from host, which **overwrites** files generated during build. Pre-processed JSON files are lost.

### Correct Update Procedure

1. **Edit CSV in the correct location**:
   ```bash
   nano lemmario-dashboard/public/data/Lemmi_forme_atliteg_updated.csv
   ```

2. **Regenerate JSON files**:
   ```bash
   cd lemmario-dashboard
   node scripts/preprocess-data.js
   # Verify output: "✅ CSV processato: XXXX record"
   ```

3. **Copy ALL files to Docker-mounted directory**:
   ```bash
   # From project root
   cp lemmario-dashboard/public/data/Lemmi_forme_atliteg_updated.csv data/
   cp lemmario-dashboard/public/data/lemmi.json data/
   cp lemmario-dashboard/public/data/geojson.json data/
   ```

4. **Restart Docker container**:
   ```bash
   docker compose restart lemmario-dashboard
   ```

### Verify Update
```bash
docker compose exec lemmario-dashboard sh -c \
  'cat /usr/share/nginx/html/data/lemmi.json' | \
  python3 -c "import json, sys; data=json.load(sys.stdin); print(f'Record totali: {len(data)}')"
```

### Adding Regional Data

To add entries for a new region (e.g., Friuli-Venezia Giulia with ISTAT code "06"):
- Set `Coll.Geografica` to region name
- Set `Latitudine` and `Longitudine` to `#N/A`
- Set `Tipo coll.Geografica` to `Regione`
- Set `reg_istat_code` to ISTAT code (e.g., "06")
- Follow the update procedure above

## Component Architecture

### Core Components

- **Header.tsx**: Fixed-top logo + project metadata (Next.js Image component)
- **GeographicalMap.tsx**: Leaflet map with MarkerCluster, GeoJSON layers, SSR-safe
- **Filters.tsx**: Category + period multi-select (Radix UI), updates AppContext
- **LemmaDetail.tsx**: Modal dialog (Radix UI) with etymology, locations, timeline
- **SearchBar.tsx**: Debounced search (300ms)
- **MetricsSummary.tsx**: Dashboard metrics from `useMetrics`
- **MapBoundedPopup.tsx**: Accordion-based popup for map markers
- **AlphabeticalIndex.tsx**: Interactive letter navigation
- **CompactToolbar.tsx**: Filter controls and actions

### Leaflet Integration Patterns

**CRITICAL**: Leaflet popups use raw DOM, not React DOM. To render React components in popups:

```typescript
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

// On popup close - cleanup to prevent memory leaks
marker.on('popupclose', () => {
  popupContainer.innerHTML = '';  // Unmount React component
});
```

**Key Rules**:
1. Always use `createRoot(container)` for React 18+ compatibility
2. Clean up on `popupclose` to prevent memory leaks
3. Pass callbacks via props (e.g., `onClose={() => marker.closePopup()}`)

### SSR Compatibility for Leaflet

```typescript
// Dynamic import for SSR-incompatible libraries
if (typeof window !== 'undefined') {
  require('leaflet.markercluster');
}

// Or use Next.js dynamic import
import dynamic from 'next/dynamic';
const MapComponent = dynamic(() => import('./Map'), { ssr: false });
```

### Marker Clustering Configuration

```typescript
const markerClusterGroup = L.markerClusterGroup({
  maxClusterRadius: 80,
  disableClusteringAtZoom: 16,
  showCoverageOnHover: false,
  animate: false,          // Disable for stability
  chunkedLoading: true,    // Performance optimization
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

## Common Implementation Patterns

### Adding a New Filter
1. Extend `FilterState` interface in [types/lemma.ts](lemmario-dashboard/types/lemma.ts)
2. Add filter UI in [components/Filters.tsx](lemmario-dashboard/components/Filters.tsx)
3. Update `useFilteredData` hook logic to apply filter
4. Update `MetricsSummary` if filter affects metrics display

### Modifying Map Layers
- Edit [components/GeographicalMap.tsx](lemmario-dashboard/components/GeographicalMap.tsx)
- Ensure SSR compatibility: use dynamic imports for leaflet plugins
- Icons/assets must be in `/public/` (use Next.js Image for optimization)
- For React components in popups: use `createRoot` pattern above

### Data Loading Fallbacks
- [services/dataLoader.ts](lemmario-dashboard/services/dataLoader.ts) prefers JSON but falls back to CSV parsing
- If adding new CSV columns: update type in `lemma.ts` and parser in `dataLoader.ts`
- Always copy updated data to `public/data/` before frontend access

### Styling Conventions
- Use Tailwind utility classes (no custom CSS except in `globals.css`)
- Responsive breakpoints: `md:` for tablet/desktop, base for mobile
- Primary color: blue (`#0B5FA5`)
- Text: `text-white/95` on dark backgrounds
- Leaflet popup overrides: use `.leaflet-popup` selectors in `globals.css`

### Multi-Column Responsive Layouts
```tsx
// 3 columns on large, 2 on medium, 1 on mobile
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
  {columns.map((col, idx) => (
    <div key={idx} className="space-y-2">
      {col.map(item => <Item key={item.id} {...item} />)}
    </div>
  ))}
</div>
```

### Accordion Pattern with State
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

## Deployment and CI/CD

### GitHub Actions Self-Hosted Runner

The project uses a self-hosted runner for automated deployment to production (behind VPN).

**Workflow**: [.github/workflows/deploy-production.yml](.github/workflows/deploy-production.yml)

**Triggers**:
- Push or merge to `master` branch
- Manual dispatch via GitHub Actions UI

**Workflow Steps**:
1. Git pull latest code
2. Docker build images
3. Restart containers
4. Cleanup unused Docker resources
5. Verify deployment health

**Setup Guides**:
- [docs/guides/deploy-quickstart.md](docs/guides/deploy-quickstart.md) - Quick start
- [docs/guides/github-actions.md](docs/guides/github-actions.md) - Full setup
- [install-github-runner.sh](install-github-runner.sh) - Runner installation script

### Remote Data Synchronization

Use [sync-data.sh](sync-data.sh) to sync `/data/` directory with remote server:

```bash
./sync-data.sh push      # Local → remote (with dry-run preview)
./sync-data.sh pull      # Remote → local (with dry-run preview)
./sync-data.sh compare   # Compare differences
./sync-data.sh backup    # Create local backup
```

## SEO Configuration

The project implements comprehensive SEO optimization (score: 100/100):

- **Metadata**: Title, description, keywords (see [app/layout.tsx](lemmario-dashboard/app/layout.tsx))
- **Open Graph**: Facebook/LinkedIn sharing tags
- **Twitter Cards**: Twitter-specific metadata
- **Schema.org JSON-LD**: Structured data for search engines (see [components/JsonLd.tsx](lemmario-dashboard/components/JsonLd.tsx))
- **Sitemap**: Auto-generated XML sitemap
- **Favicon**: Multi-platform icons (favicon, Apple icons)
- **Partner Logos**: Semantic markup in footer (Università Roma Tre, Siena, DH Unica, AtLiTeG)

## Key File Reference

- [types/lemma.ts](lemmario-dashboard/types/lemma.ts) - All TypeScript interfaces
- [context/AppContext.tsx](lemmario-dashboard/context/AppContext.tsx) - Global state provider
- [services/dataLoader.ts](lemmario-dashboard/services/dataLoader.ts) - JSON/CSV loading
- [components/GeographicalMap.tsx](lemmario-dashboard/components/GeographicalMap.tsx) - Leaflet map
- [hooks/useFilteredData.ts](lemmario-dashboard/hooks/useFilteredData.ts) - Filter logic
- [hooks/useMetrics.ts](lemmario-dashboard/hooks/useMetrics.ts) - Statistics calculation
- [app/page.tsx](lemmario-dashboard/app/page.tsx) - Main page layout
- [scripts/preprocess-data.js](lemmario-dashboard/scripts/preprocess-data.js) - Data preprocessing
- [docker-compose.yml](docker-compose.yml) - Docker orchestration
- [README.md](README.md) - User documentation
