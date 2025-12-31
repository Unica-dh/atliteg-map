# Bounded Context

## Vocabulary

- **Lemma**: A lexicographical headword representing a gastronomic term from historical Italian texts (medieval to Italian Unification).
- **Forma**: A specific morphological variant of a lemma (e.g., inflections, dialectal forms).
- **Attestazione**: An occurrence/citation of a lemma in historical texts with geographical and temporal metadata.
Collocazione
- **Geografica**: Geographical location where a term is attested (can be a specific locality or administrative region).
- **VoSLIG**: Vocabolario storico della lingua italiana della gastronomia - the historical dictionary dataset.
- **Timeline**: Chronological visualization showing temporal distribution of attestations aggregated by quarter-century (25-year periods).
- **Treemap**: Hierarchical visualization organizing lemmas by linguistic categories.
- **Clustering**: Dynamic aggregation of map markers based on zoom level - all markers display as circles (never individual pins).
ISTAT
- **Code**: Italian statistical region identifier (e.g., "06" for Friuli-Venezia Giulia).
- **Marker**: Geographical point on the map representing attestation locations, always displayed as circles with color-coded frequency indicators.
Ambiti geolinguistici: Geolinguistic areas represented as GeoJSON polygonal regions.

## Invariants

- Tech stack: Next.js 16 (App Router), React 19.2, TypeScript, Tailwind CSS, React-Leaflet, PapaParse
- Deployment: Docker + Docker Compose + Nginx (production port 9000, dev port 3000)
- Data architecture: Static files only (no backend API) - CSV preprocessed to JSON at build time
- Data synchronization: CSV files in lemmario-dashboard/public/data/ must be preprocessed and copied to data/ volume mount
- Map visualization: All markers MUST be displayed as circles (never individual pins), with dynamic clustering based on zoom
- Timeline aggregation: Occurrences MUST be aggregated by quarter-century (25-year periods) independent of geographical location
- Regional data: Regions with attestations but no specific locality coordinates use Tipo coll.Geografica="Regione" and reg_istat_code
- Color coding: Map markers use blue/orange/red frequency indicators based on occurrence count
- Build process: MUST run preprocess-data.js script before Next.js build to generate lemmi.json and geojson.json
- Docker volume mounts: Changes to CSV require regeneration of JSON AND copying to data/ directory AND container restart
- No circular dependencies allowed in component tree
- All geographical coordinates must use WGS84 (EPSG:4326)
- Academic research context: Data represents historical linguistic research funded by PRIN 2017
