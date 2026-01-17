# ROADMAP - Atliteg Map

**Versione:** 1.0  
**Ultima Modifica:** 17 Gennaio 2026  
**Stato:** In Corso

---

## Panoramica

Questo documento consolida tutte le proposte di miglioramento futuro per il progetto AtLiTeG Map, organizzate per priorità e categoria. La roadmap include:

- Correzioni critiche identificate dal feedback cliente
- Miglioramenti funzionali e UI/UX
- Ottimizzazioni performance
- Espansioni future del sistema
- Miglioramenti alla documentazione

---

## Versione Corrente e Stato

**Versione Corrente:** 2.0 (Dashboard Production Ready)  
**Data Release:** 23 Dicembre 2025  
**Ambiente:** Produzione - http://localhost:9000

### Stato Attuale Implementazione
- ✅ Dashboard completa con tutti i componenti core (9 componenti React)
- ✅ Sistema popup mappa con accordion, filtri e fullscreen map-bounded
- ✅ Timeline storica con visualizzazione quarti di secolo
- ✅ Indice alfabetico interattivo
- ✅ Filtri categoria e periodo con sincronizzazione globale
- ✅ Ricerca autocompletante con debounce
- ✅ Deployment Docker containerizzato
- ⚠️ Bug critici identificati da feedback cliente (da risolvere)

---

## Roadmap per Priorità

### 🔴 Alta Priorità (prossimi 1-3 mesi)

#### **CRITICA - Correzione Bug Dati**

**1.1 Visualizzazione Dati Regionali**
- **Problema:** Le regioni amministrative (Lazio, Lombardia, Sicilia, Toscana) non vengono proiettate sulla mappa
- **Problema Correlato:** Confini Friuli errati, sovrapposizione layer Friuli/Veneto
- **Azione:** Verificare uso corretto `limits_IT_regions.geojson`, separare layer geolinguistici da confini amministrativi
- **File:** `GeographicalMap.tsx`, `useRegions.ts`
- **Stima:** 2-3 giorni
- **Target:** v2.1 (Febbraio 2026)

**1.2 Logica Conteggio Forme vs Occorrenze**
- **Problema:** Il sistema conta righe CSV invece di forme uniche e frequenze
- **Comportamento Atteso:**
  - **Forme:** Conteggio varianti stringa uniche (es. "agliata", "alliata", "alleata" = 3 forme)
  - **Occorrenze:** Somma valori frequenza (non righe CSV)
- **Azione:** Refactoring `useMetrics.ts`, `lemmaUtils.ts`, badge numerici, cluster mappa
- **File:** `useMetrics.ts`, `lemmaUtils.ts`, `MetricsSummary.tsx`, `LemmaDetail.tsx`, `GeographicalMap.tsx`
- **Stima:** 3-4 giorni
- **Target:** v2.1 (Febbraio 2026)

**1.3 Filtro Regionale con Contesto Lemma**
- **Problema:** Click su regione mostra tutte le forme, ignorando il lemma/ricerca corrente
- **Comportamento Atteso:** Mostrare solo forme della regione filtrate per lemma selezionato
- **Azione:** Aggiornare logica click handler poligoni GeoJSON con filtro contestuale
- **File:** `GeographicalMap.tsx`
- **Stima:** 1-2 giorni
- **Target:** v2.1 (Febbraio 2026)

**1.4 Timeline - Date e Proiezioni Errate**
- **Problema:** Date errate (es. 1791-1899 mostrato come 1675-1824), duplicazione barre, conteggio 362 lemmi invece di 365
- **Azione:** Debugging algoritmo proiezione timeline, verifica mappatura date → quarti secolo
- **File:** `Timeline.tsx`, `TimelineEnhanced.tsx`
- **Stima:** 2-3 giorni
- **Target:** v2.1 (Febbraio 2026)

**1.5 Flusso Reset Filtri Ricerca**
- **Problema:** Sequenza "Ricerca Indice → Consultazione → Nuova ricerca testuale" porta a zero risultati (pagina vuota)
- **Azione:** Implementare reset automatico filtri indice quando si inizia nuova ricerca testuale
- **File:** `SearchBar.tsx`, `AppContext.tsx`, `useFilteredData.ts`
- **Stima:** 1 giorno
- **Target:** v2.1 (Febbraio 2026)

**1.6 Visualizzazione Campo Datazione**
- **Problema:** Visualizzato campo `anno` (logica interna) invece di `datazione` (campo descrittivo scientifico)
- **Azione:** Sostituire globalmente `anno` con `datazione` in popup mappa, dettaglio forme, timeline
- **File:** `MapBoundedPopup.tsx`, `LemmaDetail.tsx`, `Timeline.tsx`
- **Stima:** 1 giorno
- **Target:** v2.1 (Febbraio 2026)

#### **ALTA - UI/UX Critical Fixes**

**1.7 Deduplicazione Suggerimenti Ricerca**
- **Problema:** Forma "julienne" compare più volte nei suggerimenti (una per ogni occorrenza)
- **Comportamento Atteso:** Ogni forma deve comparire una sola volta
- **Azione:** Implementare Set deduplication su suggerimenti ricerca
- **File:** `SearchBar.tsx`
- **Stima:** 0.5 giorni
- **Target:** v2.1 (Febbraio 2026)

**1.8 Filtri Dropdown - Z-Index**
- **Problema:** Menu a tendina filtri compaiono dietro altri elementi (problema layering)
- **Azione:** Verificare e correggere `z-index` dropdown Radix UI
- **File:** `Filters.tsx`, `globals.css`
- **Stima:** 0.5 giorni
- **Target:** v2.1 (Febbraio 2026)

**1.9 Indice Alfabetico - Feedback Selezione**
- **Problema:** Selezione lemma da indice non mostra filtro attivo nella fascia filtri
- **Comportamento Atteso:** Lemma selezionato deve apparire come "chip" o badge in fascia filtri con opzione reset
- **Azione:** Aggiungere UI feedback visivo lemma selezionato in header filtri
- **File:** `AlphabeticalIndex.tsx`, `Filters.tsx`
- **Stima:** 1 giorno
- **Target:** v2.1 (Febbraio 2026)

**1.10 Popup Mappa - Frequenza = 1**
- **Problema:** Frequenza non visualizzata se valore = 1
- **Azione:** Mostrare sempre frequenza, anche per valore 1
- **File:** `MapBoundedPopup.tsx`
- **Stima:** 0.5 giorni
- **Target:** v2.1 (Febbraio 2026)

---

### 🟡 Media Priorità (3-6 mesi)

#### **FUNZIONALITÀ - Miglioramenti UX**

**2.1 Riorganizzazione Fascia Metriche**
- **Attuale:** Località, Lemmi, Attestazioni, Anni
- **Nuovo ordine:** Lemmi, Forme (nuovo), Occorrenze (ex Attestazioni), Anni, Località
- **Azione:** Aggiungere conteggio "Forme" (forme uniche), rinominare "Att:" → "Occorrenze"
- **File:** `MetricsSummary.tsx`, `useMetrics.ts`
- **Stima:** 1 giorno
- **Target:** v2.2 (Aprile 2026)

**2.2 Timeline - Miglioramenti Etichette**
- **Attuale:** Etichette codificate (es. "13I"), numero totale anni visibile
- **Proposto:**
  - Rimuovere codici secolo (es. "13I")
  - Mostrare solo arco temporale in grassetto (es. "1300-1324")
  - Aumentare spaziatura istogramma/etichetta
  - Rimuovere numero totale anni
  - Cambiare "Anni con lemmi" → "Anni con attestazioni"
- **File:** `Timeline.tsx`, `TimelineEnhanced.tsx`
- **Stima:** 1-2 giorni
- **Target:** v2.2 (Aprile 2026)

**2.3 Timeline - Navigazione Frecce Occorrenze**
- **Problema:** Barra scroll orizzontale poco usabile con arco temporale ampio
- **Proposto:** Frecce avanti/indietro per saltare da occorrenza a occorrenza
- **Azione:** Implementare pulsanti "← Precedente" / "Successivo →" che centrano timeline su prossimo anno con attestazioni
- **File:** `Timeline.tsx`
- **Stima:** 2 giorni
- **Target:** v2.2 (Aprile 2026)

**2.4 Dettaglio Forme - Riorganizzazione Layout**
- **Modifiche richieste:**
  - Altezza = altezza mappa (match visivo blocco mappa+timeline)
  - Allargare gabbia testo (ridurre margini laterali)
  - Spostare "Dettaglio forme" più in alto
  - Invertire ordine: Prima Forme, poi Lemma
  - Badge numerico = frequenza occorrenze (non numero forme)
  - Posizionare categorie e risorse a livello lemma (non ripetute per forma)
  - Link vocabolario.atliteg.org accanto al lemma (non ripetuto per forme)
  - Spostare conteggio occorrenze accanto a numero forme (sotto titolo)
- **File:** `LemmaDetail.tsx`
- **Stima:** 2-3 giorni
- **Target:** v2.2 (Aprile 2026)

**2.5 Mappa - Marker Meno Invasivi**
- **Attuale:** Marker blu con ombreggiatura
- **Proposto:** Icone più piccole, senza ombra, stile minimale
- **Azione:** Ridisegnare custom icon Leaflet marker (dimensioni ridotte, no drop-shadow)
- **File:** `GeographicalMap.tsx`, `public/marker-icon.png`
- **Stima:** 1 giorno
- **Target:** v2.2 (Aprile 2026)

**2.6 Cluster Mappa - Visualizzazione Frequenza**
- **Attuale:** Numero nel cluster = località o forme (non chiaro)
- **Proposto:** Numero = somma frequenze (occorrenze totali)
- **Azione:** Aggiornare `iconCreateFunction` MarkerClusterGroup per calcolare somma frequenze
- **File:** `GeographicalMap.tsx`
- **Stima:** 1 giorno
- **Target:** v2.2 (Aprile 2026)

**2.7 Popup Mappa - Rimozione Campo Categoria**
- **Azione:** Rimuovere "Categoria alimentare" da popup (ridondante con dettaglio forme)
- **File:** `MapBoundedPopup.tsx`
- **Stima:** 0.5 giorni
- **Target:** v2.2 (Aprile 2026)

**2.8 Indice Alfabetico - Rimozione Località**
- **Azione:** Rimuovere località dalla lista indice (dato parziale e inutile in contesto)
- **File:** `AlphabeticalIndex.tsx`
- **Stima:** 0.5 giorni
- **Target:** v2.2 (Aprile 2026)

**2.9 Ricerca - Semplificazione Suggerimenti**
- **Attuale:** Suggerimenti mostrano luogo e anno (es. "alliata napoli")
- **Proposto:** Mostrare solo forma o lemma (evitare confusione suggerimenti località diverse)
- **Azione:** Rimuovere indicazioni luogo da suggerimenti autocomplete
- **File:** `SearchBar.tsx`
- **Stima:** 1 giorno
- **Target:** v2.2 (Aprile 2026)

#### **UI - Micro-miglioramenti**

**2.10 Tipografia Fascia Metriche**
- **Azione:** Aumentare font-size per migliorare leggibilità
- **File:** `MetricsSummary.tsx`, `globals.css`
- **Stima:** 0.5 giorni
- **Target:** v2.2 (Aprile 2026)

**2.11 Ricerca - Allineamento Verticale**
- **Azione:** Allineare verticalmente testo cercato e pulsante "X" reset
- **File:** `SearchBar.tsx`
- **Stima:** 0.5 giorni
- **Target:** v2.2 (Aprile 2026)

**2.12 Micro-copy Globale - "freq."**
- **Azione:** Sostituire `freq:` con `freq.:` (aggiunta punto) in tutti i componenti
- **File:** `MapBoundedPopup.tsx`, `LemmaDetail.tsx`, ricerca globale
- **Stima:** 0.5 giorni
- **Target:** v2.2 (Aprile 2026)

#### **PERFORMANCE - Ottimizzazioni**

**2.13 Virtualizzazione Popup Mappa (casi estremi)**
- **Scenario:** Località con 200+ lemmi (raro ma possibile)
- **Proposta:** Integrare `react-window` per virtualizzazione lista accordion
- **Beneficio:** Rendering ottimizzato, no lag con dataset grandi
- **File:** `MapBoundedPopup.tsx`
- **Stima:** 3-4 giorni
- **Target:** v2.3 (Giugno 2026)

**2.14 Code Splitting Avanzato**
- **Proposta:** Lazy loading componenti non-critici (Timeline, AlphabeticalIndex, LemmaDetail)
- **Beneficio:** Riduzione initial bundle size (-15-20%)
- **File:** `app/page.tsx`, dynamic imports
- **Stima:** 1-2 giorni
- **Target:** v2.3 (Giugno 2026)

---

### 🟢 Bassa Priorità (6-12 mesi)

#### **FUNZIONALITÀ - Espansioni Future**

**3.1 Ricerca Testuale in Popup Mappa**
- **Descrizione:** Searchbar interna al popup per filtrare lemmi (oltre a filtri categoria/periodo)
- **Beneficio:** Trovare lemmi specifici in località con 50+ lemmi
- **Implementazione:** Searchbar sopra filtri dropdown, debounced search (300ms), highlighting risultati
- **File:** `MapBoundedPopup.tsx`
- **Stima:** 2-3 giorni
- **Target:** v3.0 (Settembre 2026)

**3.2 Export CSV da Popup Mappa**
- **Descrizione:** Pulsante download CSV nel header popup
- **Formato:** Lemma, Forma, Anno, Categoria, Frequenza (solo lemmi visibili, rispetta filtri attivi)
- **File:** `MapBoundedPopup.tsx`
- **Stima:** 1-2 giorni
- **Target:** v3.0 (Settembre 2026)

**3.3 Preset Filtri Rapidi**
- **Descrizione:** Dropdown preset per workflow comuni
- **Esempi:** "Solo XIV secolo", "Solo Salse e Condimenti", "Lemmi con >5 forme"
- **File:** `Filters.tsx`
- **Stima:** 2-3 giorni
- **Target:** v3.0 (Settembre 2026)

**3.4 Condivisione Link con Stato**
- **Descrizione:** URL riflette filtri/ricerca/anno corrente (bookmarkable state)
- **Beneficio:** Condividere link a visualizzazioni specifiche (es. "Salse nel XV secolo a Napoli")
- **Implementazione:** Query params in URL, React Router state sync
- **File:** `AppContext.tsx`, `app/page.tsx`
- **Stima:** 3-4 giorni
- **Target:** v3.0 (Settembre 2026)

**3.5 Confronto Lemmi (Split View)**
- **Descrizione:** Selezionare 2-3 lemmi e visualizzare confronto side-by-side (forme, geografia, cronologia)
- **Beneficio:** Analisi comparativa per ricerca linguistica
- **Implementazione:** Modal overlay con layout grid 2-3 colonne
- **File:** Nuovo componente `LemmaComparison.tsx`
- **Stima:** 5-6 giorni
- **Target:** v3.1 (Novembre 2026)

**3.6 Heatmap Temporale Avanzata**
- **Descrizione:** Visualizzazione alternativa timeline come heatmap 2D (secolo × categoria)
- **Beneficio:** Pattern temporali per categoria alimentare
- **Implementazione:** Libreria D3.js o Recharts
- **File:** Nuovo componente `TemporalHeatmap.tsx`
- **Stima:** 4-5 giorni
- **Target:** v3.1 (Novembre 2026)

**3.7 Grafico Treemap Categorie**
- **Descrizione:** Visualizzazione gerarchica categorie → lemmi → forme (diagramma ad albero)
- **Beneficio:** Overview rapido distribuzione categorie
- **Implementazione:** Recharts Treemap component
- **File:** Nuovo componente `CategoryTreemap.tsx`
- **Stima:** 3-4 giorni
- **Target:** v3.1 (Novembre 2026)

#### **TESTING - Quality Assurance**

**3.8 Test Automatizzati Unit**
- **Descrizione:** Unit tests per utilities, hooks, context
- **Copertura Target:** 70%+ utilities, 50%+ hooks
- **Stack:** Vitest + React Testing Library
- **File:** `__tests__/` directory, `vitest.config.ts`
- **Stima:** 1 settimana
- **Target:** v3.2 (Gennaio 2027)

**3.9 Test E2E Cypress**
- **Descrizione:** End-to-end tests per user flows critici
- **Scenari:** Ricerca → Filtro → Selezione Lemma → Visualizzazione Mappa, Timeline navigation, Popup interactions
- **Stack:** Cypress
- **File:** `cypress/` directory, `cypress.config.ts`
- **Stima:** 1 settimana
- **Target:** v3.2 (Gennaio 2027)

**3.10 Performance Testing**
- **Descrizione:** Benchmark automatizzati rendering, lighthouse CI
- **Metriche:** LCP <2.5s, FID <100ms, CLS <0.1, bundle size <500KB
- **Stack:** Lighthouse CI, web-vitals
- **Stima:** 2-3 giorni
- **Target:** v3.2 (Gennaio 2027)

#### **DOCUMENTAZIONE**

**3.11 Documentazione Componenti Mancanti**
- **Lista componenti non documentati:**
  - Header.tsx
  - Filters.tsx
  - SearchBar.tsx
  - AlphabeticalIndex.tsx
  - LemmaDetail.tsx
  - MetricsSummary.tsx
  - MapBoundedPopup.tsx (parzialmente in popup-system.md)
  - TimelineEnhanced.tsx
  - Altri 10+ componenti utility
- **Formato:** Markdown simile a `popup-system.md` (Props/API, Esempi, Testing)
- **Stima:** 1 settimana
- **Target:** v3.0 (Settembre 2026)

**3.12 Video Tutorial Utente**
- **Descrizione:** Screencast 5-10 minuti uso dashboard (ricerca, filtri, mappa, timeline)
- **Formato:** MP4, hosted su YouTube o Vimeo, embedded in docs
- **Stima:** 2 giorni (preparazione + registrazione + editing)
- **Target:** v3.0 (Settembre 2026)

**3.13 API Documentation (OpenAPI/Swagger)**
- **Descrizione:** Specifica OpenAPI 3.0 per backend API
- **Beneficio:** Auto-generazione client SDK, testing interattivo
- **File:** `openapi.yaml`, Swagger UI integration
- **Stima:** 2-3 giorni
- **Target:** v3.2 (Gennaio 2027)

---

## Roadmap per Categoria

### 🐛 Bug Fix (7 items - Alta Priorità)

| ID | Descrizione | Priorità | Target |
|----|-------------|----------|--------|
| 1.1 | Visualizzazione dati regionali | CRITICA | v2.1 |
| 1.2 | Logica conteggio forme vs occorrenze | CRITICA | v2.1 |
| 1.3 | Filtro regionale con contesto lemma | CRITICA | v2.1 |
| 1.4 | Timeline - Date e proiezioni errate | CRITICA | v2.1 |
| 1.5 | Flusso reset filtri ricerca | CRITICA | v2.1 |
| 1.6 | Visualizzazione campo datazione | CRITICA | v2.1 |
| 1.10 | Popup mappa - Frequenza = 1 | ALTA | v2.1 |

**Stima Totale Bug Fix:** 10-14 giorni  
**Target Release:** v2.1 (Febbraio 2026)

---

### 🎨 UI/UX (15 items)

**Alta Priorità (3 items):**
- 1.7 - Deduplicazione suggerimenti ricerca
- 1.8 - Filtri dropdown z-index
- 1.9 - Indice alfabetico feedback selezione

**Media Priorità (12 items):**
- 2.1 - Riorganizzazione fascia metriche
- 2.2 - Timeline miglioramenti etichette
- 2.3 - Timeline navigazione frecce occorrenze
- 2.4 - Dettaglio forme riorganizzazione layout
- 2.5 - Mappa marker meno invasivi
- 2.6 - Cluster mappa visualizzazione frequenza
- 2.7 - Popup mappa rimozione categoria
- 2.8 - Indice alfabetico rimozione località
- 2.9 - Ricerca semplificazione suggerimenti
- 2.10 - Tipografia fascia metriche
- 2.11 - Ricerca allineamento verticale
- 2.12 - Micro-copy globale "freq."

**Stima Totale UI/UX:** 12-16 giorni  
**Target Release:** v2.1-v2.2 (Febbraio-Aprile 2026)

---

### ⚡ Performance (2 items)

- 2.13 - Virtualizzazione popup mappa (3-4 giorni) - v2.3
- 2.14 - Code splitting avanzato (1-2 giorni) - v2.3

**Stima Totale Performance:** 4-6 giorni  
**Target Release:** v2.3 (Giugno 2026)

---

### 🚀 Funzionalità (7 items)

**Media Priorità (1 item):**
- 2.1 - Riorganizzazione fascia metriche (include nuovo campo "Forme")

**Bassa Priorità (6 items):**
- 3.1 - Ricerca testuale in popup mappa (2-3 giorni)
- 3.2 - Export CSV da popup mappa (1-2 giorni)
- 3.3 - Preset filtri rapidi (2-3 giorni)
- 3.4 - Condivisione link con stato (3-4 giorni)
- 3.5 - Confronto lemmi split view (5-6 giorni)
- 3.6 - Heatmap temporale avanzata (4-5 giorni)
- 3.7 - Grafico treemap categorie (3-4 giorni)

**Stima Totale Funzionalità:** 20-27 giorni  
**Target Release:** v3.0-v3.1 (Settembre-Novembre 2026)

---

### 🧪 Testing (3 items)

- 3.8 - Test automatizzati unit (1 settimana) - v3.2
- 3.9 - Test E2E Cypress (1 settimana) - v3.2
- 3.10 - Performance testing (2-3 giorni) - v3.2

**Stima Totale Testing:** 2.5-3 settimane  
**Target Release:** v3.2 (Gennaio 2027)

---

### 📚 Documentazione (3 items)

- 3.11 - Documentazione componenti mancanti (1 settimana) - v3.0
- 3.12 - Video tutorial utente (2 giorni) - v3.0
- 3.13 - API documentation OpenAPI (2-3 giorni) - v3.2

**Stima Totale Documentazione:** 1.5-2 settimane  
**Target Release:** v3.0-v3.2 (Settembre 2026-Gennaio 2027)

---

## Timeline Releases

### v2.1 - Bug Fix Release (Febbraio 2026)
**Focus:** Correzione tutti i bug critici identificati dal feedback cliente

- ✅ 7 bug fix critici/alta priorità
- ✅ 3 UI/UX fix alta priorità
- **Durata:** 3-4 settimane
- **Deployment:** Produzione (Docker)

### v2.2 - UX Enhancement Release (Aprile 2026)
**Focus:** Miglioramenti UI/UX media priorità

- ✅ 12 UI/UX miglioramenti media priorità
- **Durata:** 2-3 settimane
- **Deployment:** Produzione

### v2.3 - Performance Release (Giugno 2026)
**Focus:** Ottimizzazioni performance

- ✅ Virtualizzazione popup mappa
- ✅ Code splitting avanzato
- **Durata:** 1 settimana
- **Deployment:** Produzione

### v3.0 - Feature Expansion (Settembre 2026)
**Focus:** Nuove funzionalità utente

- ✅ Ricerca popup mappa
- ✅ Export CSV
- ✅ Preset filtri
- ✅ Condivisione link con stato
- ✅ Documentazione componenti
- ✅ Video tutorial
- **Durata:** 3-4 settimane
- **Deployment:** Produzione

### v3.1 - Advanced Analytics (Novembre 2026)
**Focus:** Strumenti analisi avanzata

- ✅ Confronto lemmi split view
- ✅ Heatmap temporale
- ✅ Grafico treemap categorie
- **Durata:** 2-3 settimane
- **Deployment:** Produzione

### v3.2 - Quality Assurance (Gennaio 2027)
**Focus:** Testing e stabilità

- ✅ Test unit automatizzati
- ✅ Test E2E Cypress
- ✅ Performance testing
- ✅ API documentation OpenAPI
- **Durata:** 3-4 settimane
- **Deployment:** Produzione

---

## Metriche Successo

### KPI v2.1 (Bug Fix)
- ✅ Zero bug critici aperti
- ✅ Dati regionali 100% corretti (20/20 regioni)
- ✅ Logica conteggio validata (forme ≠ occorrenze)
- ✅ Timeline date accurate (365/365 lemmi)

### KPI v2.2 (UX Enhancement)
- ✅ User satisfaction score ≥ 4.5/5 (feedback cliente)
- ✅ Tempo medio task completamento -20% (es. ricerca lemma)
- ✅ Leggibilità migliorata (font-size, spaziatura)

### KPI v2.3 (Performance)
- ✅ Lighthouse Performance Score ≥ 90
- ✅ Popup mappa <100ms render (200+ lemmi)
- ✅ Bundle size <450KB gzipped

### KPI v3.0 (Features)
- ✅ Adozione export CSV ≥20% utenti
- ✅ Condivisione link ≥10 condivisioni/settimana
- ✅ Video tutorial ≥1000 views

### KPI v3.2 (Quality)
- ✅ Code coverage ≥70% utilities, ≥50% hooks
- ✅ E2E tests coprono 10+ user flows critici
- ✅ Zero regressioni da release precedenti

---

## Note

### Prioritizzazione

La priorità degli item è stata determinata considerando:

1. **Impatto utente:** Bug critici > UX > Performance > Nuove funzionalità
2. **Complessità implementazione:** Quick wins (0.5-1 giorno) priorità maggiore
3. **Dipendenze:** Bug dati (1.2) blocca metriche corrette in altri componenti
4. **Feedback cliente:** Tutti i bug critici identificati in `bugs-and-features.md` e `feedback_analysis_20251224.md` sono alta priorità

### Flessibilità

Questa roadmap è **living document** e verrà aggiornata in base a:

- Feedback utenti e stakeholder
- Nuove richieste cliente
- Risultati testing e performance monitoring
- Disponibilità risorse sviluppo

### Approccio Agile

Le release seguono metodologia **Agile/Scrum**:

- Sprint 2 settimane
- Review e retrospettiva a fine sprint
- Deploy continuo in ambiente staging
- Deploy produzione a fine release

### Migrazioni Future (Post-v3.2)

Potenziali evoluzioni architetturali (fuori scope roadmap corrente):

- **Backend API GraphQL:** Sostituire REST con GraphQL per query flessibili
- **Real-time Collaboration:** WebSocket per editing collaborativo annotazioni
- **Mobile App:** React Native app per iOS/Android
- **Multi-language Support:** i18n per inglese, francese (oltre italiano)
- **Advanced Search:** Elasticsearch per ricerca full-text avanzata con fuzzy matching
- **User Authentication:** Sistema login per salvare filtri, preferenze, annotazioni personali

### Riferimenti

**Fonti Proposte Miglioramento:**
- `docs/components/dashboard-features.md` - Feature status e funzionalità implementate
- `docs/components/popup-system.md` - Sistema popup (proposte alternative, estensioni future)
- `docs/project/bugs-and-features.md` - Bug report cliente
- `docs/project/feedback_analysis_20251224.md` - Analisi feedback dettagliata
- `docs/ANALISI_DOCUMENTAZIONE.md` - Analisi copertura documentazione

**Documenti Correlati:**
- `docs/project/CHANGELOG.md` - Storico modifiche versioni
- `docs/architecture/requirements.md` - Requisiti funzionali (30 req)
- `docs/guides/testing.md` - Procedure testing
- `docs/guides/deployment-guide.md` - Guida deployment

---

**Documento creato:** 17 Gennaio 2026  
**Prossima revisione:** 1 Febbraio 2026 (post-release v2.1)  
**Responsabile:** Team AtLiTeG Development
