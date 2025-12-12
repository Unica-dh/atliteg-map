# Copilot Instructions for atliteg-map

## Project Overview
- **atliteg-map** is a research-driven web application for mapping and visualizing the historical evolution and geographic distribution of Italian gastronomic language and texts.
- The main dashboard (lemmario-dashboard) is a Next.js 16 (App Router) app using React, TypeScript, Tailwind CSS, and Leaflet for interactive maps.
- Data is sourced from CSV and JSON files (see `data/` and `lemmario-dashboard/public/data/`).
- The project is containerized for deployment (Docker, Docker Compose, Nginx).

## Key Components & Structure
- **/lemmario-dashboard/**: Main web app. Key folders:
  - `app/`: Next.js App Router pages/layouts
  - `components/`: React UI components (e.g., `GeographicalMap.tsx`, `Filters.tsx`)
  - `services/`: Data loading and parsing (e.g., `dataLoader.ts` uses PapaParse for CSV)
  - `types/`: TypeScript types (e.g., `lemma.ts`)
  - `public/data/`: Static data files (mirrors root `data/`)
- **/data/**: Source data (CSV, JSON, QMD)
- **/docs/**: Project documentation (architecture, API, deployment, dataset specs)
- **/process_data.py**: Data preprocessing/conversion script

## Developer Workflows
- **Local development**: `npm install` & `npm run dev` in `lemmario-dashboard/` (uses Turbopack)
- **Production build**: `npm run build` & `npm run start`
- **Docker deployment**: `docker-compose build` & `docker-compose up -d` (see both root and lemmario-dashboard docker-compose.yml)
- **Data updates**: Place new/updated files in `data/`, then copy to `lemmario-dashboard/public/data/` for frontend access
- **Data parsing**: Use `PapaParse` in frontend for CSV; Python script for preprocessing

## Project-Specific Patterns
- **Data flow**: All frontend data access is via static files in `public/data/` (no backend API)
- **Component conventions**: React function components, hooks for data/metrics, context for app state
- **Styling**: Tailwind CSS utility classes; global styles in `app/globals.css`
- **Map integration**: `GeographicalMap.tsx` uses React-Leaflet; map config in component
- **Type safety**: All data structures typed in `types/lemma.ts` and related files

## Integration & External Dependencies
- **Next.js 16 (App Router)**: Routing and SSR/SSG
- **React-Leaflet**: Map rendering
- **PapaParse**: CSV parsing in browser
- **Docker/Nginx**: Containerized deployment

## References
- See `README.md` (root and lemmario-dashboard/) for setup, requirements, and troubleshooting
- See `docs/` for architecture, API, and deployment details
- See `process_data.py` for data conversion logic

---

**Example: Adding a new data file**
1. Place the file in `data/`
2. Copy it to `lemmario-dashboard/public/data/`
3. Update data loading logic in `services/dataLoader.ts` if needed

**Example: Adding a new metric**
- Add logic in `hooks/useMetrics.ts` and update `MetricsSummary.tsx`

**Example: Custom map layer**
- Extend `GeographicalMap.tsx` and update data format if required

---

For further conventions, see `docs/ARCHITECTURE.md` and `docs/DATASET_SPECIFICATION.md`.
