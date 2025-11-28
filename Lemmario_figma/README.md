# Dashboard Lemmario AtLiTeG

Dashboard interattiva per la navigazione e analisi del lemmario **AtLiTeG** (Atlante della lingua e dei testi della cultura gastronomica italiana dall'età medievale all'Unità).

![Status: In Progress](https://img.shields.io/badge/status-In%20Progress-yellow)

## 📋 Descrizione

Applicazione web moderna e responsiva per esplorare il corpus documentale del progetto PRIN 2017XRCZTM. Consente di:

- 🗺️ Visualizzare attestazioni su mappa geografica interattiva
- 🔍 Cercare lemmi e forme con autocompletamento
- 📊 Filtrare per categoria e periodo temporale
- 📅 Navigare attraverso una timeline storica
- 🔤 Esplorare l'indice alfabetico
- 📈 Visualizzare metriche e statistiche in tempo reale

## 🚀 Quick Start

### Prerequisiti

- Node.js 20+
- npm o yarn
- Docker e Docker Compose (per deployment)

### Installazione

```bash
# Clona il repository
git clone https://github.com/caprowsky/atliteg-map.git
cd atliteg-map/Lemmario_figma

# Installa dipendenze
npm install

# Avvia server di sviluppo
npm run dev
```

L'applicazione sarà disponibile su `http://localhost:5173`

### Build per Produzione

```bash
# Build ottimizzata
npm run build:prod

# Preview build locale
npm run preview
```

## 🐳 Deployment con Docker

### Build e avvio container

```bash
# Dalla root del progetto
cd /home/ale/docker/atliteg-map

# Build e avvio
docker-compose up -d

# Visualizza logs
docker-compose logs -f lemmario-dashboard

# Stop container
docker-compose down
```

L'applicazione sarà disponibile su `http://localhost:9000`

### Rebuild dopo modifiche

```bash
docker-compose up -d --build
```

## 📁 Struttura Progetto

```
Lemmario_figma/
├── src/
│   ├── components/       # Componenti React
│   │   ├── ui/          # Componenti UI base (Radix)
│   │   ├── Header.tsx
│   │   ├── Filters.tsx
│   │   ├── GeographicalMap.tsx
│   │   ├── SearchBar.tsx
│   │   ├── Timeline.tsx
│   │   ├── AlphabeticalIndex.tsx
│   │   ├── LemmaDetail.tsx
│   │   └── MetricsSummary.tsx
│   ├── context/          # Context API
│   │   └── AppContext.tsx
│   ├── hooks/            # Custom hooks
│   │   ├── useDataLoader.ts
│   │   ├── useFilteredData.ts
│   │   ├── useMetrics.ts
│   │   └── useDebounce.ts
│   ├── services/         # Servizi caricamento dati
│   │   └── dataLoader.ts
│   ├── types/            # TypeScript interfaces
│   │   └── lemma.ts
│   ├── utils/            # Utility functions
│   │   ├── categoryParser.ts
│   │   ├── dataTransformers.ts
│   │   └── validators.ts
│   ├── App.tsx           # Componente root
│   └── main.tsx          # Entry point
├── public/
│   └── data/             # Dataset CSV e GeoJSON
├── nginx/
│   └── nginx.conf        # Configurazione Nginx
├── Dockerfile            # Multi-stage build
├── docker-compose.yml    # Orchestrazione (nella root)
└── package.json
```

## 🛠️ Stack Tecnologico

- **Framework**: React 18.3 + TypeScript
- **Build Tool**: Vite 6.3
- **Styling**: Tailwind CSS 3.4
- **UI Components**: Radix UI (headless components)
- **Map**: Leaflet 1.9 + React Leaflet
- **Data Parsing**: PapaParse (CSV)
- **Icons**: Lucide React
- **State Management**: React Context API
- **Containerization**: Docker + Nginx

## 📊 Dataset

L'applicazione utilizza due file di dati principali:

1. **`Lemmi_forme_atliteg_updated.csv`** - Corpus lemmi con campi:
   - IdLemma, Lemma, Forma
   - Coll.Geografica, Anno, Periodo
   - Categoria (valori multipli separati da virgola)
   - Frequenza, URL, IdAmbito

2. **`Ambiti geolinguistici newline.json`** - GeoJSON con poligoni per aree geografiche

I file sono caricati da `/public/data/` in sviluppo e da `/data/` in produzione (volume Docker).

## 🎨 Funzionalità Principali

### Filtri Globali
- Selezione multipla per Categoria e Periodo
- Reset immediato di tutti i filtri
- Sincronizzazione in tempo reale con tutti i componenti

### Mappa Geografica
- Visualizzazione marker per località puntuali
- Visualizzazione poligoni per aree geografiche
- Popup con dettagli al click
- Clustering automatico per performance
- Conteggio località e lemmi attivi

### Ricerca Autocompletante
- Ricerca su Lemma e Forma
- Suggerimenti con forme associate e località
- Navigazione da tastiera
- Selezione filtra tutta la dashboard

### Timeline Storica
- Navigazione per anno
- Evidenziazione anni con/senza attestazioni
- Click su anno filtra dashboard
- Dettagli lemmi e località per anno

### Indice Alfabetico
- Lettere cliccabili
- Filtro dinamico per lettera iniziale
- Sincronizzazione con mappa e timeline
- Lista virtualizzata per performance

### Pannello Dettaglio
- Visualizzazione dettagli lemma selezionato
- Stato vuoto quando nessuna selezione
- Link esterni a risorse

## ♿ Accessibilità

L'applicazione è sviluppata seguendo le linee guida **WCAG 2.1 AA**:

- ✅ Navigazione completa da tastiera
- ✅ ARIA labels e roles appropriati
- ✅ Focus visibile su elementi interattivi
- ✅ Contrasto colori conforme (4.5:1 per testo)
- ✅ Screen reader compatible
- ✅ Skip links per navigazione rapida

## 🚀 Performance

Ottimizzazioni implementate:

- Code splitting con React.lazy
- Virtualizzazione liste lunghe (react-window)
- Debouncing ricerca (300ms)
- React.memo per componenti pesanti
- useMemo/useCallback per calcoli costosi
- Marker clustering sulla mappa
- Bundle size < 500KB (gzipped)
- Lazy loading componenti

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage report
npm run test:coverage
```

## 📝 Scripts Disponibili

```bash
npm run dev          # Server sviluppo (porta 5173)
npm run build        # Build produzione
npm run build:prod   # Build produzione ottimizzata
npm run preview      # Preview build locale
npm run lint         # Linting ESLint
npm run format       # Formatting Prettier
```

## 🔧 Configurazione

### Variabili Ambiente

Crea un file `.env` nella root (vedi `.env.example`):

```env
VITE_DATA_PATH=/data
VITE_API_BASE_URL=http://localhost:9000
```

### Porta Server

Per modificare la porta di produzione, edita:
- `docker-compose.yml` (ports: "XXXX:9000")
- `nginx/nginx.conf` (listen XXXX)

## 📖 Documentazione Aggiuntiva

- [Requisiti Funzionali](../requisiti.md)
- [Specifiche Dataset](../docs/DATASET_SPECIFICATION.md)
- [Piano di Implementazione](../plan/feature-lemmario-dashboard-1.md)

## 🤝 Contribuire

Per contribuire al progetto:

1. Fork del repository
2. Crea un branch feature (`git checkout -b feature/AmazingFeature`)
3. Commit modifiche (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Apri una Pull Request

## 📄 Licenza

Questo progetto è parte del PRIN 2017XRCZTM.

PI: Prof.ssa Giovanna Frosini, Università per Stranieri di Siena

In collaborazione con Labgeo "Giuseppe Caraci", Università Roma Tre.

## 🙏 Riconoscimenti

- Mockup originale: [Figma Design](https://www.figma.com/design/MqhjHbW4e14NebARfzEean/Dashboard-per-Navigare-Lemmario)
- Dati: Vocabolario storico della lingua italiana della gastronomia (VoSLIG)
- Tiles mappa: OpenStreetMap contributors

## 📞 Supporto

Per problemi o domande, aprire una issue su GitHub o contattare il team di sviluppo.

---

**Versione**: 0.1.0  
**Ultimo aggiornamento**: 28 novembre 2025
