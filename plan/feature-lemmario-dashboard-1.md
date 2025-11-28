---
goal: Implementazione Dashboard Interattiva per Navigazione Lemmario AtLiTeG
version: 1.0
date_created: 2025-11-28
last_updated: 2025-11-28
owner: Development Team
status: Planned
tags: [feature, dashboard, visualization, react, leaflet, docker]
---

# Introduction

![Status: Planned](https://img.shields.io/badge/status-Planned-blue)

Questo piano definisce l'implementazione completa di una dashboard web interattiva per la navigazione, analisi e visualizzazione dei dati del lemmario AtLiTeG (Atlante della lingua e dei testi della cultura gastronomica italiana). L'applicazione permetterà agli utenti di esplorare i lemmi attraverso filtri dinamici, mappa geografica interattiva, timeline storica e indice alfabetico, con sincronizzazione in tempo reale tra tutti i componenti.

Il progetto si basa sul mockup Figma presente in `/Lemmario_figma` e utilizza il dataset `Lemmi_forme_atliteg_updated.csv` insieme al GeoJSON `Ambiti geolinguistici newline.json` per le aree geografiche non puntuali.

## 1. Requirements & Constraints

### Data Requirements
- **REQ-001**: Caricare e parsare il file CSV `data/Lemmi_forme_atliteg_updated.csv` con i seguenti campi: IdLemma, Lemma, Forma, Coll.Geografica, Anno, Periodo, Categoria, Frequenza, URL, IdAmbito
- **REQ-002**: Caricare e parsare il file GeoJSON `data/Ambiti geolinguistici newline.json` per gestire le aree geografiche poligonali
- **REQ-003**: Mappare correttamente le attestazioni puntuali (località) e areali (poligoni) utilizzando IdAmbito
- **REQ-004**: Gestire categorie multiple separate da virgola nel campo Categoria

### Functional Requirements
- **REQ-005**: Implementare filtri globali dinamici per Categoria e Periodo con selezione multipla
- **REQ-006**: Implementare ricerca autocompletante su Lemma e Forma
- **REQ-007**: Implementare mappa Leaflet con OpenStreetMap centrata su Italia (42.5, 12.5)
- **REQ-008**: Visualizzare marker blu per località puntuali e poligoni per aree geografiche
- **REQ-009**: Implementare timeline interattiva con anni dal dataset, evidenziando anni con/senza attestazioni
- **REQ-010**: Implementare indice alfabetico cliccabile con filtro per lettera iniziale
- **REQ-011**: Implementare pannello dettaglio lemma con stato vuoto quando nessun lemma è selezionato
- **REQ-012**: Visualizzare metriche di riepilogo (località, lemmi, anni, attestazioni) sempre visibili

### Synchronization Requirements
- **REQ-013**: Sincronizzare in tempo reale tutti i componenti (Mappa, Filtri, Ricerca, Timeline, Indice, Dettaglio)
- **REQ-014**: Aggiornare mappa e altri componenti quando viene cliccata una lettera nell'indice alfabetico
- **REQ-015**: Aggiornare tutti i componenti quando viene selezionato un anno sulla timeline
- **REQ-016**: Filtrare dashboard per tutte le attestazioni di un lemma quando viene selezionato
- **REQ-017**: Non mostrare marker sulla mappa al primo caricamento (solo dopo filtri/ricerca)

### UI/UX Requirements
- **REQ-018**: Interfaccia graficamente identica al mockup presente in `/Lemmario_figma`
- **REQ-019**: Responsività ottimizzata per desktop e tablet
- **REQ-020**: Conformità WCAG 2.1 AA: navigazione da tastiera, aria-label, focus visibile, contrasto sufficiente
- **REQ-021**: Feedback visivo per stati di loading, stati vuoti, azioni utente
- **REQ-022**: Tooltip e messaggi di stato per azioni chiave (reset filtri, selezione lemma, caricamento dati)

### Technical Requirements
- **REQ-023**: Stack tecnologico: React 18.3+, TypeScript, Vite, Leaflet, Radix UI, Tailwind CSS
- **REQ-024**: Caricamento dati asincrono con feedback di loading
- **REQ-025**: Ottimizzazione per dataset grandi: virtualizzazione, lazy loading, debounce su ricerca
- **REQ-026**: Modularità del codice con componenti separati e riutilizzabili
- **REQ-027**: Gestione stato globale tramite React Context API

### Infrastructure Requirements
- **REQ-028**: Containerizzazione con Docker e Docker Compose
- **REQ-029**: Server web sulla porta 9000 per compatibilità con proxypass in produzione
- **REQ-030**: Build ottimizzata per produzione con code splitting e lazy loading

### Constraints
- **CON-001**: La mappa non deve mostrare marker al primo caricamento (solo dopo filtri/ricerca/selezione)
- **CON-002**: Le categorie sono a valore multiplo separate da virgola e devono essere gestite correttamente
- **CON-003**: Alcune attestazioni sono puntuali (località), altre areali (poligoni via IdAmbito)
- **CON-004**: Il design deve essere pixel-perfect rispetto al mockup Figma

### Guidelines
- **GUD-001**: Utilizzare il codice del mockup in `/Lemmario_figma` come riferimento per componenti UI
- **GUD-002**: Seguire le convenzioni React/TypeScript per naming e struttura dei file
- **GUD-003**: Implementare custom hooks per logica riutilizzabile (es. useDebounce, useFilteredData)
- **GUD-004**: Usare Radix UI per componenti accessibili out-of-the-box
- **GUD-005**: Applicare Tailwind CSS per styling coerente con il mockup

### Patterns
- **PAT-001**: Utilizzare Context API per stato globale (filtri, selezioni, dati)
- **PAT-002**: Implementare componenti controllati per filtri e ricerca
- **PAT-003**: Utilizzare React.memo per ottimizzare rendering di componenti pesanti (mappa, tabella)
- **PAT-004**: Implementare error boundaries per gestione errori robuста
- **PAT-005**: Utilizzare Suspense e lazy loading per code splitting

## 2. Implementation Steps

### Implementation Phase 1: Project Setup & Data Layer

**GOAL-001**: Configurare l'ambiente di sviluppo, struttura del progetto e layer di gestione dati

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-001 | Inizializzare progetto Vite + React + TypeScript nella root o sotto `/Lemmario_figma` con configurazione ottimizzata | | |
| TASK-002 | Installare dipendenze: react, react-dom, typescript, vite, tailwindcss, leaflet, @radix-ui/*, papaparse (CSV), axios | | |
| TASK-003 | Configurare Tailwind CSS con tema personalizzato basato sul mockup (colori, font, spaziature) | | |
| TASK-004 | Creare struttura cartelle: `/src/components`, `/src/hooks`, `/src/context`, `/src/utils`, `/src/types`, `/src/services` | | |
| TASK-005 | Definire TypeScript interfaces in `/src/types/lemma.ts`: `Lemma`, `GeoArea`, `FilterState`, `AppState` | | |
| TASK-006 | Implementare servizio `/src/services/dataLoader.ts` per caricamento asincrono CSV con PapaParse e GeoJSON | | |
| TASK-007 | Implementare parsing e normalizzazione dati: split categorie multiple, mapping IdAmbito con GeoJSON | | |
| TASK-008 | Creare custom hook `/src/hooks/useDataLoader.ts` per gestire stato di loading, errori e dati caricati | | |
| TASK-009 | Implementare test unitari per parsing CSV e mapping GeoJSON con dati di esempio | | |

### Implementation Phase 2: State Management & Context

**GOAL-002**: Implementare gestione stato globale e logica di sincronizzazione tra componenti

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-010 | Creare `/src/context/AppContext.tsx` con Context API per stato globale dell'applicazione | | |
| TASK-011 | Definire stato globale: filtri (categoria, periodo), ricerca, lemma selezionato, lettera selezionata, anno selezionato | | |
| TASK-012 | Implementare azioni (setters) per aggiornare stato: setFilters, setSearch, setSelectedLemma, setSelectedLetter, setSelectedYear | | |
| TASK-013 | Creare custom hook `/src/hooks/useFilteredData.ts` per calcolare dati filtrati in base a stato globale | | |
| TASK-014 | Implementare logica di sincronizzazione: quando cambia un filtro, aggiornare tutti i dati derivati (marker mappa, anni timeline, lettere indice) | | |
| TASK-015 | Creare custom hook `/src/hooks/useMetrics.ts` per calcolare metriche (count località, lemmi, anni, attestazioni) | | |
| TASK-016 | Implementare custom hook `/src/hooks/useDebounce.ts` per debouncing della ricerca (300ms) | | |
| TASK-017 | Scrivere test per logica di filtraggio e sincronizzazione stato | | |

### Implementation Phase 3: Core UI Components - Header & Filters

**GOAL-003**: Implementare componenti Header, Branding e Filtri globali

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-018 | Creare `/src/components/Header.tsx`: logo, titolo, sottotitolo, partner scientifici come da mockup | | |
| TASK-019 | Estrarre logo dal mockup Figma e posizionarlo in `/src/assets/logo.png` | | |
| TASK-020 | Applicare stili Tailwind per tipografia e layout header identici al mockup | | |
| TASK-021 | Creare `/src/components/Filters.tsx` con select multipli per Categoria e Periodo | | |
| TASK-022 | Utilizzare Radix UI Select component con supporto multi-selezione | | |
| TASK-023 | Popolare dinamicamente opzioni select da dati caricati (categorie uniche, periodi unici) | | |
| TASK-024 | Implementare pulsante "Reset Filters" che azzera tutti i filtri attivi tramite Context | | |
| TASK-025 | Aggiungere indicatori visivi per filtri attivi (badge count, highlight) | | |
| TASK-026 | Implementare aria-labels e navigazione da tastiera per accessibilità | | |
| TASK-027 | Testare componenti Header e Filters con diversi stati (filtri attivi, vuoti) | | |

### Implementation Phase 4: Geographical Map Component

**GOAL-004**: Implementare mappa geografica interattiva con Leaflet, marker e poligoni

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-028 | Creare `/src/components/GeographicalMap.tsx` con integrazione Leaflet e react-leaflet | | |
| TASK-029 | Configurare vista iniziale mappa: centro Italia (42.5, 12.5), zoom 6, tile OpenStreetMap | | |
| TASK-030 | Implementare logica: non mostrare marker al primo caricamento (CON-001) | | |
| TASK-031 | Renderizzare marker blu personalizzati per attestazioni puntuali (località con coordinate) | | |
| TASK-032 | Renderizzare poligoni per attestazioni areali (mapping IdAmbito con GeoJSON) | | |
| TASK-033 | Implementare popup al click su marker/poligono con Lemma, Forma, Anno | | |
| TASK-034 | Aggiungere clustering per marker quando sono numerosi (es. MarkerCluster) | | |
| TASK-035 | Visualizzare conteggio località e lemmi in alto a destra mappa (es. "12 locations • 15 lemmas") | | |
| TASK-036 | Sincronizzare marker con dati filtrati: aggiornare mappa quando cambiano filtri, ricerca, selezione timeline/indice | | |
| TASK-037 | Implementare gestione click su marker: selezionare lemma corrispondente e aggiornare pannello dettaglio | | |
| TASK-038 | Ottimizzare performance: React.memo per componente mappa, evitare re-render inutili | | |
| TASK-039 | Aggiungere aria-labels per accessibilità e controlli tastiera per zoom/pan | | |
| TASK-040 | Testare mappa con dataset completo e diversi scenari di filtraggio | | |

### Implementation Phase 5: Search Bar with Autocomplete

**GOAL-005**: Implementare barra di ricerca autocompletante su Lemma e Forma

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-041 | Creare `/src/components/SearchBar.tsx` posizionato sopra la mappa | | |
| TASK-042 | Utilizzare Radix UI Command component per autocompletamento accessibile | | |
| TASK-043 | Implementare logica di ricerca con debounce (300ms) su Lemma e Forma | | |
| TASK-044 | Visualizzare suggerimenti: Lemma principale, forme associate, località, anni | | |
| TASK-045 | Implementare navigazione tastiera nei suggerimenti (frecce su/giù, Enter per selezione) | | |
| TASK-046 | Al clic su suggerimento, filtrare dashboard per tutte le attestazioni del lemma selezionato | | |
| TASK-047 | Aggiornare Context con query di ricerca e lemma selezionato | | |
| TASK-048 | Evidenziare testo corrispondente nei suggerimenti (highlighting) | | |
| TASK-049 | Implementare stato vuoto quando nessun risultato trovato | | |
| TASK-050 | Aggiungere aria-labels e feedback screen reader per accessibilità | | |
| TASK-051 | Testare ricerca con dataset completo, casi edge (caratteri speciali, accenti) | | |

### Implementation Phase 6: Timeline Component

**GOAL-006**: Implementare timeline storica interattiva con navigazione anni

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-052 | Creare `/src/components/Timeline.tsx` con visualizzazione orizzontale anni | | |
| TASK-053 | Calcolare range anni dal dataset (es. 1300-1450) e generare punti timeline | | |
| TASK-054 | Evidenziare anni con attestazioni (punti blu pieni) vs anni senza (punti vuoti) | | |
| TASK-055 | Implementare stato selezionato (anno cliccato) con blu intenso | | |
| TASK-056 | Aggiungere frecce laterali per scorrere timeline (navigazione pagine di anni) | | |
| TASK-057 | Al click su anno, aggiornare Context e filtrare dashboard per quell'anno | | |
| TASK-058 | Sotto ogni punto, mostrare elenco sintetico lemmi e località attestati in quell'anno | | |
| TASK-059 | Visualizzare conteggio "15 anni con lemmi • 15 totali" in alto a destra | | |
| TASK-060 | Sincronizzare timeline con filtri, ricerca, selezione mappa/indice | | |
| TASK-061 | Implementare scroll orizzontale e navigazione tastiera (frecce, Tab) | | |
| TASK-062 | Aggiungere tooltip con dettagli anno al hover | | |
| TASK-063 | Ottimizzare rendering con virtualizzazione se gli anni sono molti | | |
| TASK-064 | Testare timeline con dataset completo e diversi filtri attivi | | |

### Implementation Phase 7: Alphabetical Index Component

**GOAL-007**: Implementare indice alfabetico con lettere cliccabili e filtro dinamico

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-065 | Creare `/src/components/AlphabeticalIndex.tsx` con layout alfabetico come da mockup | | |
| TASK-066 | Generare lista lettere alfabeto A-Z, evidenziare lettere che contengono lemmi | | |
| TASK-067 | Implementare click su lettera: aggiornare Context con lettera selezionata | | |
| TASK-068 | Filtrare e visualizzare solo lemmi che iniziano con lettera selezionata sotto l'indice | | |
| TASK-069 | Sincronizzare con mappa e timeline: al click lettera, aggiornare marker e anni visibili | | |
| TASK-070 | Ordinare lemmi in ordine alfabetico all'interno di ogni lettera | | |
| TASK-071 | Implementare virtualizzazione per lista lemmi sotto lettera (react-window o react-virtualized) | | |
| TASK-072 | Aggiungere stato attivo visivo per lettera selezionata | | |
| TASK-073 | Implementare navigazione tastiera e aria-labels per accessibilità | | |
| TASK-074 | Aggiornare indice in tempo reale in base a filtri, ricerca, selezione mappa/timeline | | |
| TASK-075 | Testare indice con dataset completo, verificare ordinamento e sincronizzazione | | |

### Implementation Phase 8: Lemma Detail Panel

**GOAL-008**: Implementare pannello dettaglio lemma con stato vuoto e occorrenze

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-076 | Creare `/src/components/LemmaDetail.tsx` posizionato a destra della mappa | | |
| TASK-077 | Implementare stato vuoto: quando nessun lemma selezionato, mostrare icona e messaggio "Seleziona un punto sulla mappa..." | | |
| TASK-078 | Quando lemma/i visualizzati da filtri/ricerca, elencare occorrenze in ordine alfabetico | | |
| TASK-079 | Visualizzare dettagli lemma selezionato: IdLemma, Lemma, Forma, Località, Anno, Periodo, Categoria, Frequenza, URL | | |
| TASK-080 | Rendere URL cliccabile, apertura in nuova tab con aria-label | | |
| TASK-081 | Gestire categorie multiple: visualizzare come badge o lista separata | | |
| TASK-082 | Implementare scroll interno per occorrenze multiple | | |
| TASK-083 | Aggiungere animazioni transizioni quando cambia lemma selezionato | | |
| TASK-084 | Implementare aria-live region per annunciare cambiamenti a screen reader | | |
| TASK-085 | Testare pannello con diversi stati: vuoto, singolo lemma, multiple occorrenze | | |

### Implementation Phase 9: Metrics & Summary Display

**GOAL-009**: Implementare visualizzazione metriche di riepilogo sempre visibili

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-086 | Creare `/src/components/MetricsSummary.tsx` per visualizzazione conteggi | | |
| TASK-087 | Posizionare metriche sopra mappa e timeline, sempre visibili | | |
| TASK-088 | Visualizzare: numero località attive, lemmi attivi, anni con attestazioni, totale attestazioni | | |
| TASK-089 | Aggiornare metriche in tempo reale quando cambiano filtri, ricerca, selezioni | | |
| TASK-090 | Utilizzare custom hook `useMetrics` per calcolare conteggi da dati filtrati | | |
| TASK-091 | Aggiungere icone informative per ogni metrica (Lucide React) | | |
| TASK-092 | Implementare animazioni contatori per feedback visivo su cambiamenti | | |
| TASK-093 | Aggiungere aria-labels per accessibilità metriche | | |
| TASK-094 | Testare metriche con diversi scenari filtraggio, verificare correttezza conteggi | | |

### Implementation Phase 10: Accessibility & UX Enhancements

**GOAL-010**: Garantire conformità WCAG 2.1 AA e ottimizzare esperienza utente

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-095 | Audit completo accessibilità con axe DevTools e Lighthouse | | |
| TASK-096 | Implementare focus visibile per tutti gli elementi interattivi (outline personalizzato) | | |
| TASK-097 | Aggiungere skip links per navigazione rapida a sezioni principali | | |
| TASK-098 | Verificare rapporto contrasto colori (WCAG AA: 4.5:1 per testo, 3:1 per componenti UI) | | |
| TASK-099 | Implementare gestione focus trap in modali/popup (Radix UI dovrebbe gestirlo) | | |
| TASK-100 | Aggiungere aria-live regions per annunci dinamici (risultati ricerca, cambi filtri) | | |
| TASK-101 | Implementare tooltip informativi con Radix UI Tooltip per azioni chiave | | |
| TASK-102 | Creare componente LoadingSpinner con aria-label e animazione | | |
| TASK-103 | Implementare stati vuoti informativi con icone e messaggi chiari per ogni componente | | |
| TASK-104 | Aggiungere feedback visivo per azioni: loading states, success/error messages (Sonner toast) | | |
| TASK-105 | Testare navigazione completa da tastiera: Tab, Shift+Tab, Enter, Escape, frecce | | |
| TASK-106 | Testare con screen reader (NVDA/JAWS su Windows, VoiceOver su macOS) | | |

### Implementation Phase 11: Performance Optimization

**GOAL-011**: Ottimizzare performance per dataset grandi e esperienza utente fluida

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-107 | Implementare code splitting con React.lazy e Suspense per componenti pesanti (mappa, timeline) | | |
| TASK-108 | Applicare React.memo a componenti che re-renderizzano frequentemente senza necessità | | |
| TASK-109 | Utilizzare useMemo per calcoli costosi (dati filtrati, metriche, aggregazioni) | | |
| TASK-110 | Utilizzare useCallback per funzioni passate come props a componenti memoizzati | | |
| TASK-111 | Implementare virtualizzazione per lista lemmi nell'indice alfabetico (react-window) | | |
| TASK-112 | Ottimizzare rendering mappa: limitare update, usare marker clustering, lazy load tile | | |
| TASK-113 | Implementare lazy loading per dati CSV/GeoJSON con loading progressivo se troppo grandi | | |
| TASK-114 | Aggiungere Web Workers per parsing CSV pesante in background (se necessario) | | |
| TASK-115 | Ottimizzare bundle size: tree shaking, dynamic imports, analisi con vite-bundle-visualizer | | |
| TASK-116 | Implementare service worker per caching dati CSV/GeoJSON (PWA capabilities) | | |
| TASK-117 | Testare performance con React DevTools Profiler e Chrome DevTools Performance | | |
| TASK-118 | Misurare metriche Web Vitals (LCP, FID, CLS) e ottimizzare se necessario | | |

### Implementation Phase 12: Docker & Deployment Setup

**GOAL-012**: Containerizzare applicazione e configurare deployment su porta 9000

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-119 | Creare `Dockerfile` multi-stage: build con Node.js, serve con Nginx | | |
| TASK-120 | Configurare Nginx per servire app sulla porta 9000 (REQ-029) | | |
| TASK-121 | Creare configurazione Nginx ottimizzata: gzip, caching headers, fallback SPA | | |
| TASK-122 | Creare `docker-compose.yml` per orchestrazione container | | |
| TASK-123 | Configurare volume per dati CSV/GeoJSON in `/data` accessibile dal container | | |
| TASK-124 | Aggiungere health check nel docker-compose per monitoraggio | | |
| TASK-125 | Creare script di build ottimizzata in `package.json`: `build:prod` con minificazione e tree-shaking | | |
| TASK-126 | Documentare comandi Docker in README: build, run, stop, logs | | |
| TASK-127 | Testare deployment locale con `docker-compose up` e verificare accessibilità su porta 9000 | | |
| TASK-128 | Configurare variabili ambiente per base URL, API endpoints se necessario (.env) | | |
| TASK-129 | Aggiungere `.dockerignore` per escludere file non necessari (node_modules, .git, ecc.) | | |

### Implementation Phase 13: Testing & Quality Assurance

**GOAL-013**: Implementare test end-to-end e garantire qualità del codice

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-130 | Configurare Vitest per unit testing e React Testing Library | | |
| TASK-131 | Scrivere unit test per custom hooks: useFilteredData, useMetrics, useDebounce | | |
| TASK-132 | Scrivere unit test per servizi: dataLoader, parsing CSV/GeoJSON | | |
| TASK-133 | Scrivere component test per Header, Filters, SearchBar con diverse props/stati | | |
| TASK-134 | Configurare Playwright o Cypress per test end-to-end | | |
| TASK-135 | Scrivere E2E test: scenario completo filtraggio (seleziona categoria → verifica mappa/timeline) | | |
| TASK-136 | Scrivere E2E test: ricerca lemma → selezione da autocomplete → verifica dettaglio | | |
| TASK-137 | Scrivere E2E test: click su anno timeline → verifica sincronizzazione mappa/indice | | |
| TASK-138 | Scrivere E2E test: click lettera indice → verifica filtro lemmi e aggiornamento mappa | | |
| TASK-139 | Scrivere E2E test: reset filtri → verifica stato iniziale ripristinato | | |
| TASK-140 | Configurare coverage report con threshold minimo (es. 80%) | | |
| TASK-141 | Integrare linting (ESLint) e formatting (Prettier) con pre-commit hooks (Husky) | | |
| TASK-142 | Eseguire audit sicurezza dipendenze con `npm audit` e risolvere vulnerabilità | | |

### Implementation Phase 14: Documentation & Handover

**GOAL-014**: Creare documentazione completa e materiali per handover

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-143 | Scrivere README.md completo: descrizione progetto, requisiti, installazione, sviluppo, deployment | | |
| TASK-144 | Documentare struttura dati CSV/GeoJSON in `docs/DATASET_SPECIFICATION.md` (già esistente, aggiornare se necessario) | | |
| TASK-145 | Creare documentazione architettura in `docs/ARCHITECTURE.md`: componenti, flussi dati, Context API | | |
| TASK-146 | Documentare componenti principali con JSDoc: props, behavior, esempi utilizzo | | |
| TASK-147 | Creare guida utente in `docs/USER_GUIDE.md`: come usare filtri, ricerca, mappa, timeline, indice | | |
| TASK-148 | Documentare deployment e configurazione produzione in `docs/DEPLOYMENT.md` | | |
| TASK-149 | Creare changelog in `CHANGELOG.md` con versioni e modifiche principali | | |
| TASK-150 | Preparare demo video o screenshot per documentazione visiva | | |
| TASK-151 | Scrivere contributing guidelines in `CONTRIBUTING.md` se progetto open source | | |
| TASK-152 | Revisionare tutti i commenti nel codice, rimuovere TODO/FIXME risolti | | |

## 3. Alternatives

### State Management Alternatives
- **ALT-001**: **Redux Toolkit** invece di React Context API
  - *Rationale*: Context API scelto per semplicità, Redux sarebbe overhead per questo progetto. Context sufficiente per gestire stato globale con performance accettabili usando useMemo/useCallback.

- **ALT-002**: **Zustand** per state management
  - *Rationale*: Zustand più leggero di Redux ma Context API nativo React più adatto per questo caso d'uso, no dipendenze esterne aggiuntive.

### Map Library Alternatives
- **ALT-003**: **Mapbox GL JS** invece di Leaflet
  - *Rationale*: Leaflet scelto per essere open source, nessun costo licensing, sufficiente per requisiti progetto (marker, poligoni, popup). Mapbox offrirebbe migliore performance ma con costi.

- **ALT-004**: **Google Maps** invece di Leaflet
  - *Rationale*: Leaflet + OpenStreetMap gratuiti e open source, Google Maps richiederebbe API key e billing. Leaflet sufficiente per funzionalità richieste.

### Data Loading Alternatives
- **ALT-005**: **Backend API** invece di caricamento CSV lato client
  - *Rationale*: Per MVP, caricamento client-side più semplice. Se dataset cresce molto (>10MB), considerare backend con API REST/GraphQL per paginazione e filtraggio server-side.

- **ALT-006**: **SQLite WASM** per query dataset in browser
  - *Rationale*: Interessante per dataset molto grandi, ma overhead complessità non giustificato per dimensione attuale dataset. JavaScript filtering sufficiente con ottimizzazioni.

### UI Framework Alternatives
- **ALT-007**: **Material-UI (MUI)** invece di Radix UI + Tailwind
  - *Rationale*: Radix UI più leggero, headless (maggiore controllo styling), migliore accessibilità out-of-the-box. MUI più pesante e opinionato.

- **ALT-008**: **Ant Design** invece di Radix UI
  - *Rationale*: Radix UI preferito per essere headless e permettere design custom pixel-perfect rispetto mockup Figma. Ant Design troppo opinionato.

## 4. Dependencies

### Core Dependencies
- **DEP-001**: React 18.3+ - Libreria UI principale
- **DEP-002**: TypeScript 5.0+ - Type safety e developer experience
- **DEP-003**: Vite 5.0+ - Build tool e dev server veloce
- **DEP-004**: Tailwind CSS 3.4+ - Utility-first CSS framework

### UI Component Libraries
- **DEP-005**: Radix UI - Componenti accessibili headless (Select, Dialog, Tooltip, Command, ecc.)
- **DEP-006**: Lucide React - Icon library moderna e tree-shakeable
- **DEP-007**: Sonner - Toast notifications elegant e accessibili

### Map & Geospatial
- **DEP-008**: Leaflet 1.9+ - Libreria mappa interattiva open source
- **DEP-009**: React Leaflet 4.2+ - React bindings per Leaflet
- **DEP-010**: Leaflet.markercluster - Plugin clustering marker per performance

### Data Handling
- **DEP-011**: PapaParse 5.4+ - Parser CSV performante e robusto
- **DEP-012**: Axios (o Fetch API nativo) - HTTP client per caricare file JSON/CSV

### Utilities
- **DEP-013**: clsx / tailwind-merge - Utility per gestione classi CSS condizionali
- **DEP-014**: date-fns - Libreria manipolazione date leggera (se necessario per timeline)
- **DEP-015**: react-window o react-virtualized - Virtualizzazione liste per performance

### Development & Testing
- **DEP-016**: Vitest - Test runner veloce compatibile con Vite
- **DEP-017**: React Testing Library - Testing componenti React
- **DEP-018**: Playwright o Cypress - Framework E2E testing
- **DEP-019**: ESLint + Prettier - Linting e code formatting
- **DEP-020**: Husky - Git hooks per pre-commit checks

### Infrastructure
- **DEP-021**: Docker - Containerizzazione applicazione
- **DEP-022**: Nginx - Web server per servire app in produzione
- **DEP-023**: Node.js 20+ - Runtime per build e development

## 5. Files

### Configuration Files
- **FILE-001**: `/package.json` - Dipendenze npm, scripts, metadata progetto
- **FILE-002**: `/tsconfig.json` - Configurazione TypeScript con strict mode
- **FILE-003**: `/vite.config.ts` - Configurazione Vite con ottimizzazioni build
- **FILE-004**: `/tailwind.config.js` - Tema Tailwind personalizzato (colori, font, spacing)
- **FILE-005**: `/postcss.config.js` - Configurazione PostCSS per Tailwind
- **FILE-006**: `/.eslintrc.json` - Regole ESLint per qualità codice
- **FILE-007**: `/.prettierrc` - Configurazione Prettier per formatting
- **FILE-008**: `/Dockerfile` - Multi-stage build per produzione
- **FILE-009**: `/docker-compose.yml` - Orchestrazione container
- **FILE-010**: `/.dockerignore` - File da escludere da build Docker
- **FILE-011**: `/.env.example` - Template variabili ambiente

### Source Files - Types
- **FILE-012**: `/src/types/lemma.ts` - Interface Lemma, GeoArea, FilterState, AppState
- **FILE-013**: `/src/types/index.ts` - Export centrale tipi

### Source Files - Services
- **FILE-014**: `/src/services/dataLoader.ts` - Caricamento e parsing CSV/GeoJSON
- **FILE-015**: `/src/services/geocoding.ts` - Mapping località → coordinate (se necessario)

### Source Files - Context
- **FILE-016**: `/src/context/AppContext.tsx` - Context API e Provider stato globale
- **FILE-017**: `/src/context/types.ts` - Tipi per Context

### Source Files - Hooks
- **FILE-018**: `/src/hooks/useDataLoader.ts` - Hook caricamento dati asincrono
- **FILE-019**: `/src/hooks/useFilteredData.ts` - Hook calcolo dati filtrati
- **FILE-020**: `/src/hooks/useMetrics.ts` - Hook calcolo metriche dashboard
- **FILE-021**: `/src/hooks/useDebounce.ts` - Hook debouncing ricerca
- **FILE-022**: `/src/hooks/index.ts` - Export centrale hooks

### Source Files - Components
- **FILE-023**: `/src/components/Header.tsx` - Componente header con branding
- **FILE-024**: `/src/components/Filters.tsx` - Componente filtri globali
- **FILE-025**: `/src/components/SearchBar.tsx` - Ricerca autocompletante
- **FILE-026**: `/src/components/GeographicalMap.tsx` - Mappa Leaflet interattiva
- **FILE-027**: `/src/components/Timeline.tsx` - Timeline storica navigabile
- **FILE-028**: `/src/components/AlphabeticalIndex.tsx` - Indice alfabetico cliccabile
- **FILE-029**: `/src/components/LemmaDetail.tsx` - Pannello dettaglio lemma
- **FILE-030**: `/src/components/MetricsSummary.tsx` - Metriche riepilogo
- **FILE-031**: `/src/components/LoadingSpinner.tsx` - Componente loading riutilizzabile
- **FILE-032**: `/src/components/EmptyState.tsx` - Componente stato vuoto riutilizzabile

### Source Files - Main
- **FILE-033**: `/src/App.tsx` - Componente root applicazione
- **FILE-034**: `/src/main.tsx` - Entry point React, rendering root
- **FILE-035**: `/src/index.css` - CSS globale e import Tailwind

### Source Files - Utils
- **FILE-036**: `/src/utils/categoryParser.ts` - Utility parsing categorie multiple
- **FILE-037**: `/src/utils/dataTransformers.ts` - Trasformazioni e normalizzazioni dati
- **FILE-038**: `/src/utils/validators.ts` - Validazioni dati CSV/GeoJSON

### Assets
- **FILE-039**: `/src/assets/logo.png` - Logo AtLiTeG estratto da mockup Figma
- **FILE-040**: `/public/favicon.ico` - Favicon applicazione

### Documentation
- **FILE-041**: `/README.md` - Documentazione principale progetto
- **FILE-042**: `/docs/DATASET_SPECIFICATION.md` - Specifiche struttura dati (già esistente)
- **FILE-043**: `/docs/ARCHITECTURE.md` - Documentazione architettura applicazione
- **FILE-044**: `/docs/USER_GUIDE.md` - Guida utente finale
- **FILE-045**: `/docs/DEPLOYMENT.md` - Guida deployment e configurazione
- **FILE-046**: `/CHANGELOG.md` - Storico versioni e modifiche
- **FILE-047**: `/CONTRIBUTING.md` - Linee guida contribuzione (opzionale)

### Test Files
- **FILE-048**: `/src/services/__tests__/dataLoader.test.ts` - Test servizio caricamento dati
- **FILE-049**: `/src/hooks/__tests__/useFilteredData.test.ts` - Test hook filtraggio
- **FILE-050**: `/src/components/__tests__/Filters.test.tsx` - Test componente filtri
- **FILE-051**: `/tests/e2e/filter-sync.spec.ts` - Test E2E sincronizzazione filtri
- **FILE-052**: `/tests/e2e/search-flow.spec.ts` - Test E2E flusso ricerca
- **FILE-053**: `/tests/e2e/timeline-interaction.spec.ts` - Test E2E interazione timeline
- **FILE-054**: `/vitest.config.ts` - Configurazione Vitest
- **FILE-055**: `/playwright.config.ts` o `/cypress.config.ts` - Configurazione E2E testing

### Nginx Configuration
- **FILE-056**: `/nginx/nginx.conf` - Configurazione Nginx per porta 9000 e SPA routing

## 6. Testing

### Unit Tests
- **TEST-001**: Test parsing CSV: verifica corretta lettura campi, gestione categorie multiple, mapping coordinate
- **TEST-002**: Test parsing GeoJSON: verifica caricamento poligoni, mapping IdAmbito
- **TEST-003**: Test hook useFilteredData: verifica filtraggio per categoria, periodo, ricerca, lettera, anno
- **TEST-004**: Test hook useMetrics: verifica calcolo corretto località, lemmi, anni, attestazioni
- **TEST-005**: Test hook useDebounce: verifica delay 300ms e cancellazione chiamate precedenti
- **TEST-006**: Test categoryParser utility: verifica split e normalizzazione categorie multiple
- **TEST-007**: Test componente Filters: verifica selezione multipla, reset, aggiornamento Context
- **TEST-008**: Test componente SearchBar: verifica autocomplete, navigazione tastiera, selezione

### Integration Tests
- **TEST-009**: Test integrazione Context + Filters: cambio filtri aggiorna stato globale
- **TEST-010**: Test integrazione Context + Map: dati filtrati aggiornano marker mappa
- **TEST-011**: Test integrazione SearchBar + LemmaDetail: selezione da ricerca aggiorna pannello
- **TEST-012**: Test caricamento dati completo: CSV + GeoJSON → mapping corretto → rendering componenti

### End-to-End Tests
- **TEST-013**: E2E scenario completo filtraggio categoria: seleziona "Salse" → verifica marker mappa aggiornati → verifica timeline aggiornata → verifica metriche aggiornate
- **TEST-014**: E2E flusso ricerca lemma: digita "aariso" → seleziona da autocomplete → verifica mappa centrata → verifica dettaglio visualizzato → verifica timeline evidenzia anni
- **TEST-015**: E2E interazione timeline: click anno 1325 → verifica mappa mostra solo marker di quell'anno → verifica indice mostra solo lemmi di quell'anno → verifica metriche aggiornate
- **TEST-016**: E2E click lettera indice: click "A" → verifica lista lemmi mostra solo "A*" → verifica mappa marker aggiornati → verifica timeline aggiornata
- **TEST-017**: E2E reset filtri: applica categoria + periodo + ricerca → click "Reset Filters" → verifica tutti filtri azzerati → verifica stato iniziale (mappa vuota, metriche totali)
- **TEST-018**: E2E accessibilità navigazione tastiera: naviga intera dashboard solo con Tab/Enter/Escape/Frecce → verifica focus visibile → verifica tutte azioni eseguibili
- **TEST-019**: E2E performance caricamento: carica dataset completo → misura LCP < 2.5s → verifica rendering lista virtualizzata → verifica map clustering funzionante
- **TEST-020**: E2E sincronizzazione completa: cambio filtro categoria → verifica tutti componenti aggiornati (mappa, timeline, indice, dettaglio, metriche) in tempo reale

### Accessibility Tests
- **TEST-021**: Audit axe DevTools: zero violazioni WCAG 2.1 AA
- **TEST-022**: Test contrasto colori: verifica tutti testi e UI components passano WCAG AA (4.5:1 testo, 3:1 UI)
- **TEST-023**: Test screen reader: verifica annunci corretti con NVDA/JAWS per cambio filtri, risultati ricerca, selezione lemma
- **TEST-024**: Test navigazione tastiera: verifica skip links, focus trap in modali, ordine tab logico
- **TEST-025**: Test Lighthouse: score Accessibility >= 95

### Performance Tests
- **TEST-026**: Test performance rendering: dataset completo (>1000 lemmi) → rendering componenti < 200ms
- **TEST-027**: Test virtualizzazione indice: scroll lista 1000+ lemmi → frame rate >= 60 FPS
- **TEST-028**: Test debounce ricerca: typing veloce → max 1 chiamata ogni 300ms
- **TEST-029**: Test bundle size: bundle production < 500KB (gzipped), utilizzare vite-bundle-visualizer
- **TEST-030**: Test Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1

## 7. Risks & Assumptions

### Risks
- **RISK-001**: **Dataset troppo grande per caricamento client-side**
  - *Mitigation*: Implementare lazy loading, considerare backend API se CSV > 5MB, compressione gzip
  
- **RISK-002**: **Performance mappa con molti marker (>500)**
  - *Mitigation*: Implementare marker clustering (Leaflet.markercluster), limitare marker visibili con viewport bounds
  
- **RISK-003**: **Coordinate mancanti per alcune località in CSV**
  - *Mitigation*: Geocoding service fallback (Nominatim API) o file mapping località → coordinate preparato in preprocessing
  
- **RISK-004**: **Mapping IdAmbito → GeoJSON poligoni non corretto**
  - *Mitigation*: Validazione data integrity, test mappatura, documentare struttura GeoJSON chiaramente
  
- **RISK-005**: **Browser compatibility per funzionalità moderne (ES2020+, CSS Grid)**
  - *Mitigation*: Transpiling con Vite/Babel, polyfill se necessario, target browsers: last 2 versions, >0.5%
  
- **RISK-006**: **Accessibilità mappa Leaflet limitata per screen reader**
  - *Mitigation*: Aggiungere tabella alternativa navigabile da tastiera con stessi dati, aria-labels su marker
  
- **RISK-007**: **Sincronizzazione stato complessa causa re-render eccessivi**
  - *Mitigation*: Profiling con React DevTools, ottimizzazione con useMemo/useCallback, Context splitting se necessario

### Assumptions
- **ASSUMPTION-001**: Dataset CSV `Lemmi_forme_atliteg_updated.csv` ha struttura consistente e campi sempre popolati (eccetto IdAmbito opzionale)
  
- **ASSUMPTION-002**: File GeoJSON `Ambiti geolinguistici newline.json` ha formato valido con ID matchabili a IdAmbito in CSV
  
- **ASSUMPTION-003**: Categorie multiple nel CSV sono sempre separate da virgola, nessun altro delimiter
  
- **ASSUMPTION-004**: Coordinate località sono in formato WGS84 (lat/lng decimali) compatibile con Leaflet
  
- **ASSUMPTION-005**: Utenti finali utilizzeranno principalmente desktop/tablet, mobile come secondario
  
- **ASSUMPTION-006**: Dataset non cambierà struttura frequentemente (schema stabile), aggiornamenti solo nuove righe
  
- **ASSUMPTION-007**: Ambiente di produzione ha reverse proxy configurato per gestire HTTPS, certificati, caching
  
- **ASSUMPTION-008**: Logo e asset grafici dal mockup Figma sono disponibili in formato esportabile (PNG/SVG)
  
- **ASSUMPTION-009**: Non sono richieste funzionalità di login/autenticazione, dashboard pubblica read-only
  
- **ASSUMPTION-010**: Browser target supportano JavaScript moderno, no IE11, Chrome/Firefox/Safari/Edge ultimi 2 anni

## 8. Related Specifications / Further Reading

### Internal Documentation
- [Requisiti Applicazione](/home/ale/docker/atliteg-map/requisiti.md) - Documento requisiti funzionali completo
- [Dataset Specification](/home/ale/docker/atliteg-map/docs/DATASET_SPECIFICATION.md) - Specifiche struttura dati CSV e GeoJSON
- [Mockup Figma](/home/ale/docker/atliteg-map/Lemmario_figma) - Codice mockup di riferimento per UI

### External References - React & TypeScript
- [React 18 Documentation](https://react.dev/) - Documentazione ufficiale React
- [TypeScript Handbook](https://www.typescriptlang.org/docs/) - Guida TypeScript
- [Vite Guide](https://vitejs.dev/guide/) - Documentazione Vite build tool

### External References - UI & Accessibility
- [Radix UI Documentation](https://www.radix-ui.com/) - Componenti accessibili headless
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) - Utility-first CSS framework
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/) - Web Content Accessibility Guidelines
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/) - Pattern accessibilità ARIA

### External References - Mapping & Geospatial
- [Leaflet Documentation](https://leafletjs.com/reference.html) - API Leaflet
- [React Leaflet Documentation](https://react-leaflet.js.org/) - React bindings Leaflet
- [OpenStreetMap Tile Usage Policy](https://operations.osmfoundation.org/policies/tiles/) - Policy tile OSM
- [GeoJSON Specification](https://geojson.org/) - Formato GeoJSON RFC 7946

### External References - Testing
- [Vitest Documentation](https://vitest.dev/) - Test runner moderno
- [React Testing Library](https://testing-library.com/react) - Testing componenti React
- [Playwright Documentation](https://playwright.dev/) - Framework E2E testing
- [axe DevTools](https://www.deque.com/axe/devtools/) - Accessibility testing tool

### External References - Performance
- [Web Vitals](https://web.dev/vitals/) - Metriche performance Google
- [React Performance Optimization](https://react.dev/learn/render-and-commit) - Ottimizzazione rendering React
- [react-window Documentation](https://react-window.vercel.app/) - Virtualizzazione liste

### External References - Docker
- [Docker Documentation](https://docs.docker.com/) - Documentazione Docker
- [Docker Compose Documentation](https://docs.docker.com/compose/) - Orchestrazione container
- [Nginx Documentation](https://nginx.org/en/docs/) - Web server Nginx
