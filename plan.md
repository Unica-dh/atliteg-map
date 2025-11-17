# Piano di Sviluppo - Dashboard ATLITEG

## 📊 Panoramica del Progetto

Sviluppo di un'applicazione web interattiva per visualizzare e analizzare il dataset ATLITEG (Atlante della lingua e dei testi della cultura gastronomica italiana), contenente 6.236 attestazioni storiche di 365 lemmi gastronomici distribuiti geograficamente in Italia dal 1314 al 1899.

### Obiettivi Principali

- Trasformare i componenti Vue prototipali esistenti in visualizzazioni funzionali integrate con il dataset reale
- Implementare un sistema di filtri globali sincronizzato tra tutti i componenti
- Creare visualizzazioni geografiche interattive per l'analisi della distribuzione diatopica
- Fornire strumenti di analisi per studiare la variazione lessicale nel tempo e nello spazio

### Dataset: Caratteristiche Chiave

- **Records totali**: 6.236 attestazioni
- **Lemmi unici**: 365 termini gastronomici
- **Forme uniche**: 1.871 varianti dialettali/storiche
- **Arco temporale**: 1314-1899 (585 anni)
- **Copertura geografica**: ~100 località italiane (4 livelli gerarchici)
- **Categorie semantiche**: 90+ categorie (piatti, ingredienti, tecniche, ecc.)

### Distribuzione Geografica delle Forme

- **72,2%** forme locali (specifiche di una città)
- **7,9%** forme locali+regionali (2 livelli)
- **6,1%** forme regionali (solo livello regione)
- **4,7%** forme locali+sub-regionali
- **4,6%** forme locali+sovra-regionali
- **4,1%** forme transversali (tutti i 4 livelli)
- **0,4%** forme sub-regionali+sovra-regionali

### Lemmi ad Alta Variazione

| Lemma | Forme Distinte | Esempio Forme |
|-------|----------------|---------------|
| pane | 50 | pane, pan, payne, panis, panicello, paniccio, pagnotta |
| frittella | 30 | frittella, fritella, fritola, frittola, frittelle, frictella |
| cacio | 30 | cacio, cascio, caso, caseus, formaggio, caseolus |
| braciola | 28 | braciola, braciuola, braschola, carbonata, costoletta |

---

## 🗺️ Fase 1: Setup Dati e Parsing (1-2 settimane)

### Obiettivi

- Creare sistema di caricamento e parsing del CSV
- Implementare correzioni encoding e normalizzazioni
- Sviluppare funzioni di aggregazione dati
- Preparare file geocoordinate per la mappa

### Task Tecnici

#### 1.1 Installazione Dipendenze

```bash
npm install papaparse
npm install --save-dev @types/papaparse
```

#### 1.2 Creazione `src/utils/dataLoader.js`

**Funzioni da implementare:**

```javascript
// Parsing CSV con correzione encoding
function loadCSV(filePath) { /* ... */ }
function fixEncoding(text) { /* ... */ }

// Normalizzazione dati
function normalizeRecord(record) { 
  // .trim() su tutti i campi
  // Parsing categorie separate da virgola
  // Conversione Anno a number
}

// Aggregazione geografica
function classificaLivelloGeografico(record) {
  // Determina: città, regione, sub-regionale, sovra-regionale
}

function aggregaFormePerGeografia(records) {
  // Raggruppa forme per lemma e livello geografico
}

// Calcolo variabilità
function calcolaVariabilitaGeografica(lemma, records) {
  // Conta forme distinte per località
  // Identifica forme "marker" (esclusive di un'area)
}
```

#### 1.3 Creazione `src/data/geo-coordinates.json`

**Struttura:**

```json
{
  "città": {
    "Firenze": { "lat": 43.7696, "lon": 11.2558, "regione": "Toscana" },
    "Roma": { "lat": 41.9028, "lon": 12.4964, "regione": "Lazio" },
    "Venezia": { "lat": 45.4408, "lon": 12.3155, "regione": "Veneto" }
  },
  "regioni": {
    "Toscana": { "lat": 43.7711, "lon": 11.2486 },
    "Lazio": { "lat": 41.8719, "lon": 12.5674 }
  }
}
```

**Fonte coordinate**: OpenStreetMap Nominatim API o dati precompilati

#### 1.4 Gestione Problemi Dataset

| Problema | Soluzione |
|----------|-----------|
| Caratteri corrotti (Citt�) | `fixEncoding()` con mapping UTF-8 |
| Spazi trailing nei lemmi | `.trim()` in `normalizeRecord()` |
| Categorie multi-valore | `split(',').map(c => c.trim())` |
| Incongruenza Anno/Periodo | Validazione con priorità campo Anno |

### Deliverable

- [ ] `src/utils/dataLoader.js` completo e testato
- [ ] `src/data/geo-coordinates.json` con ~100 località
- [ ] Test unitari per funzioni di parsing e aggregazione
- [ ] Documentazione API delle funzioni utility

---

## 🗺️ Fase 2: Componente Mappa Geografica (2-3 settimane)

### Obiettivi

- Implementare mappa interattiva Italia con Leaflet.js
- Visualizzare distribuzione geografica forme/lemmi
- Sistema marker gerarchico (4 livelli geografici)
- Integrazione slider temporale

### Task Tecnici

#### 2.1 Installazione Dipendenze

```bash
npm install leaflet vue-leaflet
npm install leaflet.markercluster
npm install --save-dev @types/leaflet
```

#### 2.2 Modifica `GeographicalDistributionMap.vue`

**Nuove funzionalità:**

1. **Base Map Setup**
   - Tiles storiche o OpenStreetMap
   - Centro: Italia (lat: 42.8333, lon: 12.8333)
   - Zoom iniziale: 6-7

2. **Sistema Marker Differenziato**
   - **Città**: marker rossi, dimensione proporzionale a numero attestazioni
   - **Regione**: cerchi blu semitrasparenti
   - **Sub-regionale**: poligoni verdi
   - **Sovra-regionale**: overlay viola

3. **Popup Informativi**
   ```
   [Località] (Regione)
   - Lemma: [nome]
   - Forme trovate: [lista]
   - Attestazioni: [numero]
   - Periodo: [range anni]
   ```

4. **Clustering**
   - Raggruppamento automatico marker quando zoom < 8
   - Click su cluster per espandere

5. **Slider Temporale**
   - Range: 1314-1899
   - Step: 10 anni
   - Filtra marker in tempo reale

#### 2.3 Integrazione State Management

```javascript
// In GeographicalDistributionMap.vue
import { useLemmaStore } from '@/stores/lemmaStore'

const store = useLemmaStore()
const filteredRecords = computed(() => store.getFilteredRecords())

// Reagisce ai filtri globali
watch(() => store.activeFilters, () => {
  updateMarkers()
})
```

### Deliverable

- [ ] Mappa interattiva funzionante con tiles Italia
- [ ] 4 tipi di marker/layer per livelli geografici
- [ ] Popup con dettagli attestazioni
- [ ] Slider temporale integrato
- [ ] Clustering marker implementato
- [ ] Sincronizzazione con filtri globali

---

## 📊 Fase 3: Treemap Categorie (1 settimana)

### Obiettivi

- Visualizzazione gerarchica delle 90+ categorie
- Dimensione proporzionale a numero attestazioni
- Interattività per drill-down

### Task Tecnici

#### 3.1 Installazione Dipendenze

**Opzione A: D3.js**
```bash
npm install d3
```

**Opzione B: ECharts** (consigliato per facilità)
```bash
npm install echarts vue-echarts
```

#### 3.2 Modifica `LemmaCategoriesTreemap.vue`

**Con ECharts:**

```javascript
import { use } from 'echarts/core'
import { TreemapChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'

use([TreemapChart, CanvasRenderer])

// Preparazione dati
const categoryHierarchy = computed(() => {
  const records = store.records
  const grouped = groupBy(records, 'Categoria')
  
  return {
    name: 'Categorie ATLITEG',
    children: Object.entries(grouped).map(([cat, items]) => ({
      name: cat,
      value: items.length,
      children: groupBy(items, 'Lemma').map(([lemma, recs]) => ({
        name: lemma,
        value: recs.length
      }))
    }))
  }
})

// Configurazione ECharts
const option = {
  series: [{
    type: 'treemap',
    data: categoryHierarchy.value.children,
    levels: [
      { itemStyle: { borderColor: '#777', borderWidth: 0, gapWidth: 1 } },
      { colorSaturation: [0.35, 0.5], itemStyle: { borderWidth: 5, gapWidth: 1 } },
      { colorSaturation: [0.2, 0.3], itemStyle: { borderWidth: 2, gapWidth: 1 } }
    ]
  }]
}
```

**Interazioni:**

- Click su categoria → filtra tutti componenti per quella categoria
- Hover → tooltip con: nome categoria, numero lemmi, numero attestazioni
- Breadcrumb per risalire nella gerarchia

### Deliverable

- [ ] Treemap funzionante con dati reali
- [ ] Gerarchia a 2 livelli (Categoria → Lemma)
- [ ] Colorazione per categoria semantica
- [ ] Tooltip informativi
- [ ] Click per filtrare dashboard
- [ ] Breadcrumb navigazione

---

## 📋 Fase 4: Tabella Dettagli (1 settimana)

### Obiettivi

- Sostituire dati mock con dataset ATLITEG
- Implementare sorting multi-colonna
- Aggiungere filtri per colonna
- Esportazione CSV/Excel

### Task Tecnici

#### 4.1 Modifica `LemmaDetailsTable.vue`

**Colonne tabella:**

| Colonna | Sortable | Filterable | Tipo |
|---------|----------|------------|------|
| Lemma | ✅ | ✅ (autocomplete) | String |
| Forma | ✅ | ✅ (testo) | String |
| Categoria | ✅ | ✅ (multi-select) | Array |
| Località | ✅ | ✅ (autocomplete) | String |
| Regione | ✅ | ✅ (multi-select) | String |
| Anno | ✅ | ✅ (range slider) | Number |
| Periodo | ✅ | ❌ | String |
| Opera | ❌ | ✅ (testo) | String |

**Funzionalità avanzate:**

1. **Sorting Avanzato**
   ```javascript
   const sortTable = (column) => {
     if (sortColumn.value === column) {
       sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
     } else {
       sortColumn.value = column
       sortDirection.value = 'asc'
     }
   }
   ```

2. **Paginazione**
   - Opzioni: 10, 25, 50, 100 righe
   - Navigazione pagine con ... per salti
   - Info: "Showing 1-25 of 6236 records"

3. **Esportazione Dati**
   ```bash
   npm install xlsx
   ```
   
   ```javascript
   import * as XLSX from 'xlsx'
   
   const exportToExcel = () => {
     const ws = XLSX.utils.json_to_sheet(filteredRecords.value)
     const wb = XLSX.utils.book_new()
     XLSX.utils.book_append_sheet(wb, ws, 'ATLITEG')
     XLSX.writeFile(wb, 'atliteg_export.xlsx')
   }
   ```

4. **Highlight Ricerca**
   - Evidenzia termini cercati nella GlobalFilterBar
   - Usa `<mark>` tag con CSS custom

### Deliverable

- [ ] Tabella con dati reali ATLITEG
- [ ] Sorting multi-colonna funzionante
- [ ] Filtri per colonna integrati
- [ ] Paginazione configurabile
- [ ] Esportazione Excel/CSV
- [ ] Highlight termini ricercati

---

## 🎛️ Fase 5: Filtri Globali & State Management (1 settimana)

### Obiettivi

- Implementare Pinia store per stato condiviso
- Creare filtri funzionanti in GlobalFilterBar
- Sincronizzare tutti i componenti con i filtri

### Task Tecnici

#### 5.1 Installazione Pinia

```bash
npm install pinia
```

#### 5.2 Creazione `src/stores/lemmaStore.js`

```javascript
import { defineStore } from 'pinia'
import { loadCSV, aggregaFormePerGeografia } from '@/utils/dataLoader'

export const useLemmaStore = defineStore('lemma', {
  state: () => ({
    // Dati grezzi
    rawRecords: [],
    
    // Dati aggregati
    lemmaList: [],
    categoryList: [],
    localityList: [],
    
    // Filtri attivi
    activeFilters: {
      lemma: '',           // ricerca testo
      categories: [],      // multi-select
      localities: [],      // multi-select
      timeRange: [1314, 1899],
      geographicLevel: 'all'  // all | città | regione | sub | sovra
    },
    
    // UI state
    selectedLemma: null,
    mapCenter: { lat: 42.8333, lon: 12.8333 },
    mapZoom: 6
  }),
  
  getters: {
    // Records filtrati secondo activeFilters
    filteredRecords(state) {
      let filtered = state.rawRecords
      
      // Filtro lemma (case-insensitive)
      if (state.activeFilters.lemma) {
        const search = state.activeFilters.lemma.toLowerCase()
        filtered = filtered.filter(r => 
          r.Lemma.toLowerCase().includes(search) ||
          r.Forma.toLowerCase().includes(search)
        )
      }
      
      // Filtro categorie
      if (state.activeFilters.categories.length > 0) {
        filtered = filtered.filter(r => 
          state.activeFilters.categories.some(cat => 
            r.Categoria.includes(cat)
          )
        )
      }
      
      // Filtro località
      if (state.activeFilters.localities.length > 0) {
        filtered = filtered.filter(r => 
          state.activeFilters.localities.includes(r['Città'])
        )
      }
      
      // Filtro temporale
      const [minYear, maxYear] = state.activeFilters.timeRange
      filtered = filtered.filter(r => 
        r.Anno >= minYear && r.Anno <= maxYear
      )
      
      // Filtro livello geografico
      if (state.activeFilters.geographicLevel !== 'all') {
        filtered = filtered.filter(r => {
          // Logica classificazione geografica
        })
      }
      
      return filtered
    },
    
    // Aggregazioni per visualizzazioni
    recordsByCategory(state) {
      return groupBy(this.filteredRecords, 'Categoria')
    },
    
    recordsByLocality(state) {
      return groupBy(this.filteredRecords, 'Città')
    },
    
    temporalDistribution(state) {
      const byDecade = {}
      this.filteredRecords.forEach(r => {
        const decade = Math.floor(r.Anno / 10) * 10
        byDecade[decade] = (byDecade[decade] || 0) + 1
      })
      return byDecade
    }
  },
  
  actions: {
    async loadData() {
      this.rawRecords = await loadCSV('/data/Lemmi_forme_atliteg.csv')
      this.lemmaList = [...new Set(this.rawRecords.map(r => r.Lemma))].sort()
      this.categoryList = [...new Set(this.rawRecords.flatMap(r => r.Categoria))].sort()
      this.localityList = [...new Set(this.rawRecords.map(r => r['Città']))].sort()
    },
    
    updateFilter(filterName, value) {
      this.activeFilters[filterName] = value
    },
    
    resetFilters() {
      this.activeFilters = {
        lemma: '',
        categories: [],
        localities: [],
        timeRange: [1314, 1899],
        geographicLevel: 'all'
      }
    },
    
    selectLemma(lemma) {
      this.selectedLemma = lemma
      // Centra mappa sulla prima località del lemma
      const firstRecord = this.rawRecords.find(r => r.Lemma === lemma)
      if (firstRecord) {
        // TODO: geocode località e aggiorna mapCenter
      }
    }
  }
})
```

#### 5.3 Modifica `src/main.js`

```javascript
import { createPinia } from 'pinia'

const app = createApp(App)
app.use(createPinia())
app.mount('#app')
```

#### 5.4 Implementazione `GlobalFilterBar.vue`

**Componenti filtro:**

1. **Ricerca Lemma/Forma**
   ```vue
   <input 
     type="search"
     v-model="store.activeFilters.lemma"
     placeholder="Cerca lemma o forma..."
     @input="debouncedSearch"
   />
   ```

2. **Dropdown Categorie (Multi-select)**
   ```bash
   npm install @vueform/multiselect
   ```
   
   ```vue
   <Multiselect
     v-model="store.activeFilters.categories"
     :options="store.categoryList"
     mode="tags"
     placeholder="Seleziona categorie..."
   />
   ```

3. **Range Slider Temporale**
   ```bash
   npm install @vueform/slider
   ```
   
   ```vue
   <Slider
     v-model="store.activeFilters.timeRange"
     :min="1314"
     :max="1899"
     :tooltips="true"
   />
   ```

4. **Località (Autocomplete)**
   ```vue
   <Multiselect
     v-model="store.activeFilters.localities"
     :options="store.localityList"
     mode="tags"
     :searchable="true"
     placeholder="Filtra per località..."
   />
   ```

5. **Livello Geografico (Radio)**
   ```vue
   <div class="radio-group">
     <label v-for="level in ['all', 'città', 'regione', 'sub', 'sovra']">
       <input 
         type="radio" 
         v-model="store.activeFilters.geographicLevel"
         :value="level"
       />
       {{ levelLabels[level] }}
     </label>
   </div>
   ```

6. **Pulsante Reset**
   ```vue
   <button @click="store.resetFilters()">
     Ripristina Filtri
   </button>
   ```

### Deliverable

- [ ] Pinia store configurato e funzionante
- [ ] GlobalFilterBar con tutti i 5 tipi di filtro
- [ ] Sincronizzazione real-time tra filtri e visualizzazioni
- [ ] Pulsante reset funzionante
- [ ] Debounce su ricerca testo (300ms)
- [ ] URL params per condivisione filtri (opzionale)

---

## 📈 Fase 6: Visualizzazioni Aggiuntive (2 settimane)

### 6.1 Timeline Temporale (3-4 giorni)

**Obiettivo**: Grafico a linee che mostra numero attestazioni nel tempo

**Libreria**: Chart.js o ECharts

```bash
npm install chart.js vue-chartjs
```

**Implementazione**:
- Asse X: decenni (1314-1899, step 10)
- Asse Y: numero attestazioni
- Linee multiple per confrontare categorie
- Area sotto curva colorata per periodo storico (Medioevo, Rinascimento, ecc.)

### 6.2 Network Graph Lemma-Forma (3-4 giorni)

**Obiettivo**: Visualizzare relazioni tra lemmi e varianti

**Libreria**: vis-network o D3 force layout

```bash
npm install vis-network
```

**Struttura**:
- Nodi lemma (grandi, colore categoria)
- Nodi forma (piccoli, collegati al lemma di origine)
- Link peso = numero attestazioni
- Clustering per categoria semantica

### 6.3 Heatmap Località × Categoria (2-3 giorni)

**Obiettivo**: Matrice che incrocia località e categorie

**Libreria**: ECharts heatmap

**Dati**:
- Righe: 100 località
- Colonne: 90 categorie
- Valore cella: numero attestazioni
- Colore: scala da bianco (0) a rosso scuro (max)

### 6.4 Statistiche Dashboard (1-2 giorni)

**Componente**: `src/components/StatsPanel.vue`

**Metriche da visualizzare**:

```vue
<div class="stats-grid">
  <!-- Card 1: Totali -->
  <div class="stat-card">
    <h3>{{ filteredRecords.length }}</h3>
    <p>Attestazioni</p>
  </div>
  
  <!-- Card 2: Lemmi unici -->
  <div class="stat-card">
    <h3>{{ uniqueLemmas.length }}</h3>
    <p>Lemmi</p>
  </div>
  
  <!-- Card 3: Forme uniche -->
  <div class="stat-card">
    <h3>{{ uniqueForms.length }}</h3>
    <p>Forme</p>
  </div>
  
  <!-- Card 4: Arco temporale -->
  <div class="stat-card">
    <h3>{{ temporalRange }}</h3>
    <p>Anni coperti</p>
  </div>
  
  <!-- Card 5: Località coperte -->
  <div class="stat-card">
    <h3>{{ uniqueLocalities.length }}</h3>
    <p>Località</p>
  </div>
  
  <!-- Card 6: Categoria più attestata -->
  <div class="stat-card">
    <h3>{{ topCategory.name }}</h3>
    <p>{{ topCategory.count }} attestazioni</p>
  </div>
</div>
```

### Deliverable

- [ ] Timeline temporale funzionante
- [ ] Network graph lemma-forma interattivo
- [ ] Heatmap località × categoria
- [ ] Pannello statistiche con 6+ metriche
- [ ] Tutti i grafici reagiscono ai filtri globali

---

## 🎨 Fase 7: UI/UX Refinement (1 settimana)

### 7.1 Design System

**Palette colori categoriche**:
```css
:root {
  /* Categorie principali */
  --cat-piatti: #e74c3c;
  --cat-ingredienti: #3498db;
  --cat-tecniche: #2ecc71;
  --cat-utensili: #f39c12;
  --cat-alimenti: #9b59b6;
  
  /* Livelli geografici */
  --geo-citta: #c0392b;
  --geo-regione: #2980b9;
  --geo-sub: #27ae60;
  --geo-sovra: #8e44ad;
  
  /* UI */
  --bg-primary: #ffffff;
  --bg-secondary: #f8f9fa;
  --text-primary: #2c3e50;
  --text-secondary: #7f8c8d;
  --border-color: #ecf0f1;
}
```

**Tipografia**:
```css
@import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700&family=Open+Sans:wght@400;600&display=swap');

body {
  font-family: 'Open Sans', sans-serif;
}

h1, h2, h3 {
  font-family: 'Merriweather', serif;
}
```

### 7.2 Responsive Design

**Breakpoints**:
- Mobile: < 640px (layout single-column)
- Tablet: 640px - 1024px (layout 2-column)
- Desktop: > 1024px (layout 3-column)

**Adattamenti mobile**:
- Mappa a schermo intero con pulsante toggle
- Treemap collassabile
- Tabella con scroll orizzontale
- Filtri in modal/drawer invece che barra fissa

### 7.3 Animazioni e Transizioni

```css
/* Transizioni smooth per filtri */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

/* Animazione marker mappa */
@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.marker-highlight {
  animation: pulse 1s infinite;
}
```

### 7.4 Accessibilità (A11y)

**Checklist**:
- [ ] Tutti i pulsanti hanno `aria-label`
- [ ] Grafici hanno `role="img"` e descrizione testuale
- [ ] Contrasto colori WCAG AA compliant
- [ ] Navigazione da tastiera funzionante
- [ ] Screen reader tested (NVDA/JAWS)
- [ ] Focus indicators visibili

### 7.5 Loading States & Error Handling

```vue
<!-- Loading skeleton per tabella -->
<div v-if="isLoading" class="skeleton">
  <div class="skeleton-row" v-for="i in 10" :key="i"></div>
</div>

<!-- Messaggio errore -->
<div v-if="error" class="error-banner">
  <Icon name="alert-circle" />
  <p>{{ error.message }}</p>
  <button @click="retry">Riprova</button>
</div>

<!-- Empty state -->
<div v-if="!isLoading && filteredRecords.length === 0" class="empty-state">
  <Icon name="search-x" />
  <h3>Nessun risultato</h3>
  <p>Prova a modificare i filtri di ricerca</p>
  <button @click="store.resetFilters()">Reset Filtri</button>
</div>
```

### Deliverable

- [ ] Design system documentato
- [ ] Responsive layout testato su 3+ breakpoints
- [ ] Animazioni smooth implementate
- [ ] Accessibilità WCAG AA
- [ ] Loading/error/empty states per tutti i componenti
- [ ] Dark mode (opzionale)

---

## ⚡ Fase 8: Performance Optimization (1 settimana)

### 8.1 Ottimizzazioni Dataset

**Lazy loading CSV**:
```javascript
// Carica solo 1000 record iniziali
const initialLoad = async () => {
  const allRecords = await loadCSV()
  store.rawRecords = allRecords.slice(0, 1000)
  
  // Carica il resto in background
  setTimeout(() => {
    store.rawRecords = allRecords
  }, 2000)
}
```

**Memoization aggregazioni**:
```javascript
import { memoize } from 'lodash-es'

const aggregaFormePerGeografiaMemo = memoize(
  aggregaFormePerGeografia,
  (records) => JSON.stringify(records.map(r => r.id))
)
```

### 8.2 Virtual Scrolling Tabella

```bash
npm install vue-virtual-scroller
```

```vue
<RecycleScroller
  :items="filteredRecords"
  :item-size="50"
  key-field="id"
>
  <template #default="{ item }">
    <tr>
      <td>{{ item.Lemma }}</td>
      <td>{{ item.Forma }}</td>
      <!-- ... -->
    </tr>
  </template>
</RecycleScroller>
```

### 8.3 Debouncing e Throttling

```javascript
import { debounce, throttle } from 'lodash-es'

// Ricerca lemma con debounce 300ms
const debouncedSearch = debounce((value) => {
  store.updateFilter('lemma', value)
}, 300)

// Update mappa con throttle 100ms
const throttledMapUpdate = throttle(() => {
  updateMapMarkers()
}, 100)
```

### 8.4 Code Splitting

```javascript
// Lazy load componenti pesanti
const NetworkGraph = defineAsyncComponent(() =>
  import('@/components/NetworkGraph.vue')
)

const Heatmap = defineAsyncComponent(() =>
  import('@/components/Heatmap.vue')
)
```

### 8.5 Web Workers per Aggregazioni

```javascript
// src/workers/aggregation.worker.js
self.onmessage = (e) => {
  const { records, groupBy } = e.data
  const result = computeAggregation(records, groupBy)
  self.postMessage(result)
}

// In component
const worker = new Worker('/workers/aggregation.worker.js')
worker.postMessage({ records: store.rawRecords, groupBy: 'Categoria' })
worker.onmessage = (e) => {
  aggregatedData.value = e.data
}
```

### 8.6 Bundle Size Optimization

```bash
# Analisi bundle
npm run build -- --mode analyze

# Tree-shaking lodash
npm install lodash-es
# Importa solo funzioni necessarie
import debounce from 'lodash-es/debounce'
```

### Deliverable

- [ ] Lazy loading CSV implementato
- [ ] Virtual scrolling per tabella (>1000 righe)
- [ ] Debounce/throttle su filtri e map
- [ ] Code splitting per componenti pesanti
- [ ] Web workers per aggregazioni intensive
- [ ] Bundle size < 500KB (gzipped)

---

## 🧪 Fase 9: Testing (1 settimana)

### 9.1 Unit Testing

```bash
npm install -D vitest @vue/test-utils happy-dom
```

**Test da scrivere**:

```javascript
// tests/utils/dataLoader.test.js
describe('dataLoader', () => {
  test('fixEncoding corregge caratteri UTF-8', () => {
    expect(fixEncoding('Citt�')).toBe('Città')
  })
  
  test('normalizeRecord rimuove spazi trailing', () => {
    const record = { Lemma: 'pane ', Forma: 'panis ' }
    expect(normalizeRecord(record).Lemma).toBe('pane')
  })
  
  test('aggregaFormePerGeografia conta correttamente', () => {
    const result = aggregaFormePerGeografia(mockRecords)
    expect(result['pane']['città']).toHaveLength(50)
  })
})

// tests/stores/lemmaStore.test.js
describe('lemmaStore', () => {
  test('filteredRecords applica filtro lemma', () => {
    const store = useLemmaStore()
    store.rawRecords = mockRecords
    store.activeFilters.lemma = 'pane'
    expect(store.filteredRecords.every(r => 
      r.Lemma.includes('pane')
    )).toBe(true)
  })
})
```

**Coverage target**: > 80%

### 9.2 Component Testing

```javascript
// tests/components/GlobalFilterBar.test.js
import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'

describe('GlobalFilterBar', () => {
  test('aggiorna store quando cambia input', async () => {
    const wrapper = mount(GlobalFilterBar, {
      global: { plugins: [createPinia()] }
    })
    
    await wrapper.find('input[type="search"]').setValue('pane')
    expect(useLemmaStore().activeFilters.lemma).toBe('pane')
  })
})
```

### 9.3 E2E Testing

```bash
npm install -D @playwright/test
```

```javascript
// e2e/dashboard.spec.js
import { test, expect } from '@playwright/test'

test('filtro categoria aggiorna mappa e tabella', async ({ page }) => {
  await page.goto('http://localhost:5173')
  
  // Seleziona categoria "Pasta"
  await page.click('[data-testid="category-filter"]')
  await page.click('text=Pasta')
  
  // Verifica aggiornamento
  const markerCount = await page.locator('.leaflet-marker-icon').count()
  expect(markerCount).toBeGreaterThan(0)
  
  const tableRows = await page.locator('tbody tr').count()
  expect(tableRows).toBeLessThan(6236)
})
```

### 9.4 Visual Regression Testing

```bash
npm install -D @storybook/vue3 chromatic
```

**Snapshot test per**:
- Stati loading
- Empty states
- Error states
- Diversi breakpoints responsive

### 9.5 Performance Testing

```javascript
// tests/performance/rendering.test.js
test('rendering 6236 righe < 3 secondi', async () => {
  const start = performance.now()
  const wrapper = mount(LemmaDetailsTable, {
    props: { records: allRecords }
  })
  await wrapper.vm.$nextTick()
  const duration = performance.now() - start
  expect(duration).toBeLessThan(3000)
})
```

### Deliverable

- [ ] 50+ unit tests con coverage > 80%
- [ ] 20+ component tests
- [ ] 10+ E2E tests (happy paths principali)
- [ ] Visual regression tests per 5+ componenti
- [ ] Performance benchmark documentato
- [ ] CI/CD pipeline con test automatici

---

## 📚 Fase 10: Documentazione (3-4 giorni)

### 10.1 Documentazione Codice

**JSDoc per funzioni utility**:
```javascript
/**
 * Classifica il livello geografico di un record ATLITEG
 * @param {Object} record - Record CSV con campi Città, Regione, ecc.
 * @returns {string[]} Array di livelli: ['città', 'regione', 'sub-regionale', 'sovra-regionale']
 * @example
 * classificaLivelloGeografico({ Città: 'Firenze', Regione: 'Toscana' })
 * // => ['città', 'regione']
 */
function classificaLivelloGeografico(record) { }
```

### 10.2 README Aggiornato

Sezioni da aggiungere:
- **Architettura**: Diagramma componenti e flusso dati
- **Dataset**: Link a DATASET_SPECIFICATION.md
- **Deployment**: Istruzioni Netlify/Vercel
- **Contribuire**: Linee guida per PR
- **Crediti**: Team, università, finanziatori

### 10.3 Guida Utente

**File**: `docs/USER_GUIDE.md`

**Contenuto**:
1. Introduzione al progetto ATLITEG
2. Come usare i filtri
3. Interpretare la mappa geografica
4. Leggere il treemap
5. Analizzare la tabella dettagli
6. Esportare dati
7. FAQ

### 10.4 Storybook Componenti

```bash
npm install -D @storybook/vue3
npx storybook init
```

**Stories da creare**:
- `GlobalFilterBar.stories.js`
- `GeographicalDistributionMap.stories.js`
- `LemmaCategoriesTreemap.stories.js`
- `LemmaDetailsTable.stories.js`

### 10.5 Changelog

**File**: `CHANGELOG.md`

```markdown
# Changelog

## [1.0.0] - 2025-XX-XX

### Added
- Mappa geografica interattiva con 4 livelli gerarchici
- Treemap categorie con drill-down
- Tabella dettagli con esportazione Excel
- Filtri globali sincronizzati
- Timeline temporale 1314-1899

### Fixed
- Correzione encoding UTF-8 nel dataset
- Normalizzazione spazi trailing nei lemmi

### Performance
- Virtual scrolling per tabelle > 1000 righe
- Web workers per aggregazioni pesanti
```

### Deliverable

- [ ] JSDoc completo per tutte le funzioni pubbliche
- [ ] README.md aggiornato con architettura e deployment
- [ ] USER_GUIDE.md con screenshot
- [ ] Storybook deployato online
- [ ] CHANGELOG.md con versioning semantico
- [ ] API documentation (se applicabile)

---

## 🚀 Fase 11: Deployment (2-3 giorni)

### 11.1 Build di Produzione

**Ottimizzazioni `vite.config.js`**:
```javascript
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['vue', 'pinia'],
          'maps': ['leaflet', 'vue-leaflet'],
          'charts': ['echarts', 'vue-echarts']
        }
      }
    },
    chunkSizeWarningLimit: 600
  }
})
```

### 11.2 Hosting Statico

**Opzione A: Netlify**
```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**Opzione B: Vercel**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

**Opzione C: GitHub Pages**
```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### 11.3 Environment Variables

```env
# .env.production
VITE_APP_TITLE=Dashboard ATLITEG
VITE_API_BASE_URL=https://api.atliteg.it
VITE_MAPBOX_TOKEN=your_token_here
VITE_GOOGLE_ANALYTICS=UA-XXXXX-Y
```

### 11.4 Monitoring

**Google Analytics**:
```javascript
// src/utils/analytics.js
import { useGtag } from 'vue-gtag-next'

export function trackFilterUsage(filterType, value) {
  useGtag().event('filter_change', {
    filter_type: filterType,
    filter_value: value
  })
}
```

**Sentry Error Tracking**:
```bash
npm install @sentry/vue
```

```javascript
// src/main.js
import * as Sentry from '@sentry/vue'

Sentry.init({
  app,
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [new Sentry.BrowserTracing()],
  tracesSampleRate: 0.1
})
```

### 11.5 SEO & Social Media

**Meta tags in `index.html`**:
```html
<head>
  <title>ATLITEG - Atlante Gastronomia Italiana Storica</title>
  <meta name="description" content="Visualizza 6.236 attestazioni storiche di termini gastronomici italiani dal 1314 al 1899">
  
  <!-- Open Graph -->
  <meta property="og:title" content="Dashboard ATLITEG">
  <meta property="og:description" content="Atlante interattivo della lingua gastronomica italiana storica">
  <meta property="og:image" content="/og-image.png">
  <meta property="og:url" content="https://atliteg.it">
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Dashboard ATLITEG">
  <meta name="twitter:description" content="Esplora la distribuzione geografica dei lemmi gastronomici storici">
  <meta name="twitter:image" content="/twitter-card.png">
</head>
```

**Sitemap**:
```xml
<!-- public/sitemap.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://atliteg.it/</loc>
    <lastmod>2025-11-16</lastmod>
    <priority>1.0</priority>
  </url>
</urlset>
```

### 11.6 Post-Deployment Testing

**Checklist**:
- [ ] Tutti i link funzionanti
- [ ] CSV caricato correttamente
- [ ] Mappa tiles caricano
- [ ] Filtri sincronizzati
- [ ] Performance Lighthouse > 90
- [ ] Mobile responsive testato
- [ ] Error tracking attivo
- [ ] Analytics raccoglie dati

### Deliverable

- [ ] Build ottimizzato deployato su hosting
- [ ] CI/CD pipeline configurato
- [ ] Environment variables configurate
- [ ] Monitoring (Analytics + Sentry) attivo
- [ ] SEO meta tags completi
- [ ] Sitemap generato
- [ ] Post-deployment checklist completata
- [ ] Custom domain configurato (opzionale)

---

## 📊 Riepilogo Timeline

| Fase | Durata | Dipendenze | Priorità |
|------|--------|-----------|----------|
| 1. Data Setup | 1-2 settimane | - | 🔴 ALTA |
| 2. Mappa Geografica | 2-3 settimane | Fase 1 | 🔴 ALTA |
| 3. Treemap | 1 settimana | Fase 1 | 🟡 MEDIA |
| 4. Tabella | 1 settimana | Fase 1 | 🔴 ALTA |
| 5. Filtri & Store | 1 settimana | Fase 1 | 🔴 ALTA |
| 6. Viz Aggiuntive | 2 settimane | Fase 5 | 🟡 MEDIA |
| 7. UI/UX | 1 settimana | Fasi 2-6 | 🟢 BASSA |
| 8. Performance | 1 settimana | Fasi 2-6 | 🟡 MEDIA |
| 9. Testing | 1 settimana | Tutte | 🔴 ALTA |
| 10. Documentazione | 3-4 giorni | Tutte | 🟢 BASSA |
| 11. Deployment | 2-3 giorni | Fase 9 | 🔴 ALTA |

**Totale stimato**: 10-13 settimane (2,5-3 mesi)

**MVP (Minimum Viable Product)**: Fasi 1, 2, 4, 5, 11 = **4-5 settimane**

---

## 🎯 Milestone Principali

### Milestone 1: Dati Funzionanti (Settimana 2)
- ✅ CSV parsato e normalizzato
- ✅ Geo-coordinates preparate
- ✅ Funzioni aggregazione testate

### Milestone 2: Visualizzazioni Core (Settimana 7)
- ✅ Mappa geografica interattiva
- ✅ Tabella dettagli con esportazione
- ✅ Filtri globali sincronizzati

### Milestone 3: Feature Complete (Settimana 9)
- ✅ Tutte le visualizzazioni implementate
- ✅ UI/UX polish completato
- ✅ Performance ottimizzata

### Milestone 4: Production Ready (Settimana 11)
- ✅ Testing completo
- ✅ Documentazione pronta
- ✅ Deploy online funzionante

---

## 🔧 Stack Tecnologico Finale

### Frontend Framework
- **Vue 3** (Composition API)
- **Vite** (build tool)
- **Pinia** (state management)

### UI & Styling
- **Tailwind CSS v4**
- **@vueform/multiselect** (filtri multi-select)
- **@vueform/slider** (slider temporale)

### Visualizzazioni
- **Leaflet.js + vue-leaflet** (mappa geografica)
- **ECharts + vue-echarts** (treemap, timeline, heatmap)
- **vis-network** (network graph)
- **Chart.js + vue-chartjs** (grafici statistici)

### Data Processing
- **PapaParse** (parsing CSV)
- **lodash-es** (utility functions)

### Testing
- **Vitest** (unit tests)
- **@vue/test-utils** (component tests)
- **Playwright** (E2E tests)

### Deployment & Monitoring
- **Netlify** / **Vercel** (hosting)
- **Google Analytics** (analytics)
- **Sentry** (error tracking)

---

## 📋 Prossimi Passi

1. **Revisione Piano**: Confermare timeline e priorità con stakeholder
2. **Setup Ambiente**: Installare Node.js, clonare repo, configurare IDE
3. **Kick-off Fase 1**: Iniziare parsing CSV e creazione geo-coordinates
4. **Stand-up Settimanali**: Review progresso e blockers
5. **Demo Milestone**: Presentare risultati a fine di ogni milestone

---

## 🤝 Team & Risorse

### Ruoli Necessari
- **Frontend Developer** (Vue.js) - 1 persona full-time
- **Data Analyst** (opzionale) - per validazione dataset
- **Designer UX/UI** (opzionale) - per mockup e branding
- **Tester QA** (opzionale) - per testing approfondito

### Supporto Accademico
- **Prof.ssa Giovanna Frosini** - Supervisione scientifica
- **Labgeo "Giuseppe Caraci"** - Consulenza cartografica

### Risorse Esterne
- **Documentazione ATLITEG**: [inserire link]
- **VoSLIG**: [inserire link]
- **Repository GitHub**: [inserire link]

---

## ❓ FAQ

### Come gestire lemmi con 50+ forme?
- Implementare paginazione nelle popup mappa
- Treemap con drill-down
- Filtro "mostra solo forme principali" (top 10 per attestazioni)

### Dataset si aggiornerà in futuro?
- Prevedere endpoint API per caricamento dinamico
- Versioning dataset (v1.0, v1.1, ecc.)
- Sistema di cache con invalidazione

### Come condividere visualizzazione specifica?
- Serializzare filtri in URL params: `?lemma=pane&year=1400-1600&cat=pasta`
- Pulsante "Condividi" genera link permanente
- Opzionalmente: salvare viste personalizzate con autenticazione

### Performance con dataset più grandi?
- Attuale: 6.236 record gestibili in browser
- Futuro (50k+ record): backend API con paginazione server-side
- Considerare IndexedDB per caching locale

---

## 📄 Licenza e Crediti

**Licenza**: [Da definire - consigliato CC BY-NC-SA 4.0 per dati accademici]

**Crediti**:
- Dataset: PRIN 2017 - Università per Stranieri di Siena
- Sviluppo: [Nome team/sviluppatore]
- Cartografia: Labgeo "Giuseppe Caraci" - Università Roma Tre
- Finanziamento: PRIN 2017

---

**Documento creato**: 16 novembre 2025  
**Versione**: 1.0  
**Autore**: GitHub Copilot  
**Ultima modifica**: 16 novembre 2025
