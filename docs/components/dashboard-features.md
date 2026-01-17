# Dashboard Lemmario AtLiTeG - Funzionalità e Componenti

**Versione**: 1.0.0  
**Ultima Modifica**: 2025-12-10  
**Stato**: Stabile - Production Ready

---

## Panoramica

La Dashboard Lemmario è l'applicazione principale del progetto AtLiTeG Map, sviluppata per visualizzare e analizzare l'evoluzione storica e la distribuzione geografica della lingua gastronomica italiana.

### Stack Tecnologico

```
Frontend:
  - Next.js 16.0.8 (App Router + Turbopack)
  - React 19
  - TypeScript 5
  - Tailwind CSS 3.4
  
UI Components:
  - Radix UI (accessibilità)
  - Lucide React (icone)
  
Mappa:
  - Leaflet 1.9+
  - React-Leaflet 4.2+
  
Dati:
  - PapaParse (parsing CSV)
  
Build & Deploy:
  - Docker + Docker Compose
  - Nginx
  - Multi-stage build
```

---

## Componenti Implementati

### Core Components

#### Header.tsx
- Header con logo, titolo e informazioni del progetto
- Branding e identità visiva
- Link risorse esterne

#### Filters.tsx
- Filtri globali per Categoria e Periodo
- Selezione multipla con dropdown
- Reset filtri
- Sincronizzazione con tutti i componenti

#### SearchBar.tsx
- Barra di ricerca autocompletante su Lemma e Forma
- Debounce 300ms per ottimizzare le performance
- Highlighting risultati ricerca
- Navigazione tastiera (↑↓ Enter Esc)

#### GeographicalMap.tsx
- Mappa interattiva con Leaflet e OpenStreetMap
- Vista centrata su Italia (42.5, 12.5)
- Marker blu per località puntuali
- Supporto poligoni per aree geografiche (IdAmbito)
- Popup con Lemma, Forma, Anno
- Conteggio località e lemmi
- Zoom e pan
- **Importante**: Non mostra marker al primo caricamento

#### Timeline.tsx
- Timeline storica interattiva con navigazione anni
- Visualizzazione orizzontale degli anni
- Evidenziazione anni con/senza attestazioni
- Navigazione con frecce laterali
- Selezione anno con filtro dashboard
- Elenco lemmi e località per anno
- Conteggio anni con lemmi / totali

#### AlphabeticalIndex.tsx
- Indice alfabetico cliccabile con filtro per lettera
- Lettere A-Z
- Evidenziazione lettere con lemmi
- Click lettera filtra dashboard
- Visualizzazione lemmi per lettera selezionata
- Aggiornamento dinamico

#### LemmaDetail.tsx
- Pannello dettaglio lemma con visualizzazione occorrenze
- Stato vuoto quando nessun lemma selezionato
- Raggruppamento per lemma con occorrenze
- Visualizzazione Forma, Località, Anno/Periodo
- Categorie multiple con badge
- Link risorse esterne
- IdAmbito per aree geografiche

#### MetricsSummary.tsx
- Visualizzazione metriche di riepilogo
- Conteggio località
- Conteggio lemmi unici
- Conteggio anni
- Conteggio attestazioni totali
- Aggiornamento in tempo reale

#### LoadingSpinner.tsx
- Indicatore di caricamento
- Stati di loading per componenti

---

## Architettura Applicazione

### State Management
- **AppContext.tsx** - Context API per gestione stato globale
- **FilterState** - Gestione filtri (categoria, periodo, ricerca, lettera, anno, lemma)
- **Sincronizzazione** - Tutti i componenti sincronizzati in tempo reale

### Data Layer
- **dataLoader.ts** - Caricamento asincrono CSV e GeoJSON
- **types/lemma.ts** - Definizioni TypeScript per Lemma, GeoArea, FilterState, AppState
- **Parsing CSV** - Trasformazione corretta degli header con mapping
- **Parsing GeoJSON** - Gestione file newline-delimited JSON

### Custom Hooks (3 hooks)
1. **useDebounce.ts** - Debouncing valori
2. **useMetrics.ts** - Calcolo metriche
3. **useFilteredData.ts** - Gestione dati filtrati

### Utilities
1. **formatting.ts** - Funzioni formattazione (20+ funzioni)
2. **lemmaUtils.ts** - Utility specifiche lemmi (15+ funzioni)
3. **lib/utils.ts** - Utility Tailwind (cn helper)

### Routing & Layout
- **app/layout.tsx** - Layout principale con AppProvider
- **app/page.tsx** - Pagina principale con tutti i componenti integrati
- **app/globals.css** - Stili globali e variabili CSS
- **Dynamic import** - Mappa caricata dinamicamente per evitare SSR

---

## Funzionalità Implementate

### Filtri e Ricerca
- ✅ Filtro per Categoria (selezione multipla)
- ✅ Filtro per Periodo (selezione multipla)
- ✅ Ricerca autocompletante su Lemma e Forma
- ✅ Reset filtri
- ✅ Debounce su ricerca (300ms)
- ✅ Highlighting risultati ricerca
- ✅ Navigazione tastiera (↑↓ Enter Esc)

### Mappa Geografica
- ✅ Mappa Leaflet con OpenStreetMap
- ✅ Vista centrata su Italia (42.5, 12.5)
- ✅ Marker blu per località puntuali
- ✅ Supporto poligoni per aree geografiche (IdAmbito)
- ✅ Popup con Lemma, Forma, Anno
- ✅ Conteggio località e lemmi
- ✅ Zoom e pan
- ✅ Non mostra marker al primo caricamento
- ✅ Aggiornamento dinamico in base a filtri

### Timeline
- ✅ Visualizzazione orizzontale degli anni
- ✅ Evidenziazione anni con/senza attestazioni
- ✅ Navigazione con frecce laterali
- ✅ Selezione anno con filtro dashboard
- ✅ Elenco lemmi e località per anno
- ✅ Conteggio anni con lemmi / totali

### Indice Alfabetico
- ✅ Lettere alfabeto A-Z
- ✅ Evidenziazione lettere con lemmi
- ✅ Click lettera filtra dashboard
- ✅ Visualizzazione lemmi per lettera selezionata
- ✅ Aggiornamento dinamico

### Dettaglio Lemma
- ✅ Visualizzazione dettagli lemma selezionato
- ✅ Stato vuoto quando nessun lemma selezionato
- ✅ Raggruppamento per lemma con occorrenze
- ✅ Visualizzazione Forma, Località, Anno/Periodo
- ✅ Categorie multiple con badge
- ✅ Link risorse esterne
- ✅ IdAmbito per aree geografiche

### Metriche
- ✅ Conteggio località
- ✅ Conteggio lemmi unici
- ✅ Conteggio anni
- ✅ Conteggio attestazioni totali
- ✅ Aggiornamento in tempo reale

### Sincronizzazione Completa
- ✅ Filtri ↔️ Mappa
- ✅ Filtri ↔️ Timeline
- ✅ Filtri ↔️ Indice
- ✅ Filtri ↔️ Dettaglio Lemma
- ✅ Ricerca ↔️ Tutti i componenti
- ✅ Selezione Lettera ↔️ Tutti i componenti
- ✅ Selezione Anno ↔️ Tutti i componenti
- ✅ Selezione Lemma ↔️ Tutti i componenti

---

## UI/UX

### Design e Styling
- ✅ Design responsivo (desktop e tablet)
- ✅ Tailwind CSS per styling
- ✅ Componenti Radix UI per accessibilità
- ✅ Lucide React icons
- ✅ Loading states
- ✅ Empty states
- ✅ Hover effects
- ✅ Transition animations

### Accessibilità (WCAG 2.1 AA)
- ✅ Navigazione da tastiera
- ✅ ARIA labels
- ✅ Focus visibile
- ✅ Screen reader support
- ✅ Tooltip informativi
- ✅ Contrasto colori appropriato

---

## Containerizzazione

### Docker
- ✅ Dockerfile multi-stage
- ✅ Docker Compose
- ✅ Nginx reverse proxy
- ✅ Porta 9000 per produzione
- ✅ Build ottimizzata per produzione

### Configurazione
- **next.config.ts** - Configurazione Next.js con output standalone
- **tailwind.config.ts** - Configurazione Tailwind CSS
- **tsconfig.json** - Configurazione TypeScript
- **package.json** - Dipendenze e script
- **nginx.conf** - Configurazione Nginx per produzione

---

## Data Management

### Sorgenti Dati
- **CSV**: `Lemmi_forme_atliteg_updated.csv`
- **GeoJSON**: `Ambiti geolinguistici newline.json`

### Gestione
- ✅ Parsing asincrono
- ✅ Error handling
- ✅ Categorie multiple (split per virgola)
- ✅ Mapping IdAmbito → Poligoni
- ✅ Trasformazione header CSV
- ✅ Gestione file newline-delimited JSON

### Note Importanti
- Il CSV deve essere in `/public/data/Lemmi_forme_atliteg_updated.csv`
- Il GeoJSON deve essere in `/public/data/Ambiti geolinguistici newline.json`
- Gli header del CSV vengono trasformati (es. "Coll.Geografica" → "CollGeografica")

---

## Requisiti Implementati (30/30 - 100%)

### Data Requirements (4/4)
- ✅ REQ-001: Caricamento CSV
- ✅ REQ-002: Caricamento GeoJSON
- ✅ REQ-003: Mapping attestazioni puntuali/areali
- ✅ REQ-004: Gestione categorie multiple

### Functional Requirements (8/8)
- ✅ REQ-005: Filtri dinamici
- ✅ REQ-006: Ricerca autocompletante
- ✅ REQ-007: Mappa Leaflet
- ✅ REQ-008: Marker e poligoni
- ✅ REQ-009: Timeline interattiva
- ✅ REQ-010: Indice alfabetico
- ✅ REQ-011: Pannello dettaglio
- ✅ REQ-012: Metriche

### Synchronization Requirements (5/5)
- ✅ REQ-013: Sincronizzazione globale
- ✅ REQ-014: Indice → Mappa/Timeline
- ✅ REQ-015: Timeline → Tutti componenti
- ✅ REQ-016: Lemma → Dashboard
- ✅ REQ-017: Mappa vuota all'avvio

### UI/UX Requirements (5/5)
- ✅ REQ-018: Design come mockup
- ✅ REQ-019: Responsività
- ✅ REQ-020: Accessibilità WCAG 2.1 AA
- ✅ REQ-021: Feedback visivo
- ✅ REQ-022: Tooltip e messaggi

### Technical Requirements (5/5)
- ✅ REQ-023: Stack React/TS/Next.js
- ✅ REQ-024: Caricamento asincrono
- ✅ REQ-025: Ottimizzazioni performance
- ✅ REQ-026: Modularità codice
- ✅ REQ-027: Context API

### Infrastructure Requirements (3/3)
- ✅ REQ-028: Docker/Docker Compose
- ✅ REQ-029: Porta 9000
- ✅ REQ-030: Build ottimizzata

---

## Come Eseguire

### Modalità Sviluppo
```bash
cd lemmario-dashboard
npm install
npm run dev
```
Apri: http://localhost:3000

### Modalità Produzione con Docker
```bash
cd lemmario-dashboard
docker-compose up --build
```
Apri: http://localhost:9000

---

## Performance

### Ottimizzazioni
- La mappa usa dynamic import per evitare SSR
- I componenti pesanti usano React.memo
- La ricerca usa debounce (300ms)
- Il dataset completo viene caricato all'avvio
- Code splitting automatico di Next.js
- Build ottimizzata per produzione

### Produzione
- Il server web è sulla porta 9000
- Nginx serve i file statici
- Build ottimizzata con code splitting
- Container multi-stage per dimensioni ridotte

---

## Metriche Progetto

- **Componenti React**: 9
- **Custom Hooks**: 3
- **Utility Functions**: 35+
- **TypeScript Interfaces**: 6
- **Linee di Codice**: ~3500 LOC
- **File Creati**: 35+
- **Dipendenze npm**: 20+

---

## Testing

Per informazioni dettagliate sui test, consultare:
- [TEST_CHECKLIST.md](../guides/test-checklist.md) - 189 checkpoints di test
- [testing.md](../guides/testing.md) - Procedure di testing

### Test Scenari Principali

#### Test Filtri
1. Selezionare una o più categorie → Verifica aggiornamento mappa, timeline, indice
2. Selezionare uno o più periodi → Verifica sincronizzazione
3. Combinare filtri multipli → Verifica comportamento
4. Click "Reset Filters" → Verifica ripristino stato iniziale

#### Test Ricerca
1. Digitare testo nella barra di ricerca → Verifica autocompletamento
2. Selezionare un suggerimento → Verifica filtro lemma
3. Navigare suggerimenti con tastiera (↑↓ Enter) → Verifica accessibilità
4. Cancellare ricerca con X → Verifica reset

#### Test Sincronizzazione
1. Filtro → Verifica aggiornamento tutti i componenti
2. Ricerca → Verifica sincronizzazione
3. Click lettera indice → Verifica mappa e timeline
4. Click anno timeline → Verifica mappa e indice
5. Combinazioni multiple → Verifica coerenza

---

## Stato Generale

**L'applicazione è completamente funzionale e pronta per la produzione.**

Tutti i requisiti del documento `requirements.md` sono stati implementati con successo.

---

## Note

Per maggiori dettagli tecnici, consultare:
- [lemmario-dashboard.md](./lemmario-dashboard.md) - Documentazione tecnica completa
- [ARCHITECTURE.md](../architecture/system-architecture.md) - Architettura sistema
- [deployment-guide.md](../guides/deployment-guide.md) - Guida deployment
