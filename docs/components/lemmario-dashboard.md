# AtLiTeG - Dashboard Lemmario Interattivo

Dashboard web interattiva per la navigazione, analisi e visualizzazione dei dati del lemmario AtLiTeG (Atlante della Lingua e dei Testi della Cultura Gastronomica Italiana).

## 🚀 Caratteristiche

- **Mappa Geografica Interattiva**: Visualizzazione delle attestazioni su mappa con Leaflet e OpenStreetMap
- **Filtri Dinamici**: Filtro per categoria e periodo con aggiornamento real-time
- **Indice Alfabetico**: Navigazione per lettera con visualizzazione occorrenze
- **Metriche Real-time**: Statistiche sempre aggiornate su località, lemmi, anni e attestazioni
- **Animazioni Fluide**: Sistema motion completo con Framer Motion per UX premium
- **Responsive Design**: Ottimizzato per desktop e tablet
- **Accessibilità**: Conforme WCAG 2.1 AA con supporto `prefers-reduced-motion`

## 🛠️ Stack Tecnologico

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Linguaggio**: TypeScript
- **UI**: React 18.3, Tailwind CSS
- **Animazioni**: Framer Motion 11+
- **Mappa**: Leaflet, React-Leaflet
- **Parsing**: PapaParse (CSV)
- **Icone**: Lucide React
- **Deployment**: Docker, Nginx

## 🎨 Motion System

Il progetto include un sistema motion completo e accessibile:

- **Configurazione centralizzata** in `/lib/motion-config.ts`
- **Hooks personalizzati** per accessibilità (`useReducedMotion`)
- **Componenti wrapper** (`FadeIn`, `SlideIn`, `ScaleIn`, `StaggerContainer`)
- **Supporto completo** per `prefers-reduced-motion`
- **Documentazione** in `../architecture/motion-system.md`

### Test Animazioni

Visita `/motion-test` per vedere tutti gli effetti in azione:
```bash
# Locale
http://localhost:3000/motion-test

# Docker
http://localhost:9000/motion-test
```

## 📋 Requisiti

- Node.js 20+ (per sviluppo)
- Docker & Docker Compose (per deployment)

## 🔧 Installazione

### Sviluppo Locale

```bash
# Installa dipendenze
npm install

# Avvia server di sviluppo con Turbopack
npm run dev

# Apri browser su http://localhost:3000
```

### Build di Produzione

```bash
# Build statico
npm run build

# Preview build locale
npm run start
```

### Deployment con Docker

```bash
# Build immagine Docker
docker-compose build

# Avvia container
docker-compose up -d

# L'applicazione sarà disponibile su http://localhost:9000
```

## 📂 Struttura Progetto

```
lemmario-dashboard/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Layout root con AppProvider
│   └── page.tsx           # Pagina principale
├── components/            # Componenti React
│   ├── Header.tsx
│   ├── Filters.tsx
│   ├── GeographicalMap.tsx
│   ├── MetricsSummary.tsx
│   ├── AlphabeticalIndex.tsx
│   └── LoadingSpinner.tsx
├── context/               # Context API
│   └── AppContext.tsx
├── services/              # Servizi e API
│   └── dataLoader.ts
├── types/                 # TypeScript types
│   └── lemma.ts
├── lib/                   # Utilities
│   └── utils.ts
├── public/                # Asset statici
│   └── data/             # CSV e GeoJSON
├── Dockerfile             # Multi-stage build
├── docker-compose.yml     # Orchestrazione container
├── nginx.conf             # Configurazione Nginx
└── next.config.ts         # Configurazione Next.js
```

## 📊 Dati

L'applicazione utilizza due fonti dati principali:

- **CSV**: `Lemmi_forme_atliteg_updated.csv` - Contiene i lemmi con coordinate e metadati
- **GeoJSON**: `Ambiti geolinguistici newline.json` - Definisce le aree geografiche poligonali

## 🎯 Funzionalità Principali

### Filtri Globali
- Selezione multipla per **Categoria** e **Periodo**
- Reset immediato con pulsante dedicato
- Badge visivi per filtri attivi

### Mappa Geografica
- Marker blu per località puntuali
- Poligoni per aree geografiche (IdAmbito)
- Popup con dettagli: Lemma, Forma, Località, Anno
- Auto-zoom sui risultati filtrati
- Contatore località e lemmi visualizzati

### Timeline Storica
- **Aggregazione per quarti di secolo**: Periodi di 25 anni (es. 1300-1324, 1325-1349)
- **Istogrammi verticali**: Altezza proporzionale alle occorrenze totali del periodo
- **Somma indipendente da località**: Ogni barra rappresenta il totale delle occorrenze nel periodo, indipendentemente dalla posizione geografica
- **Navigazione paginata**: Frecce per scorrere tra i diversi periodi (12 per pagina)
- **Doppia modalità visualizzazione**:
  - Barre verticali (default)
  - Heatmap organizzata per secolo
- **Interattività**: Click su periodo per filtrare tutti i dati correlati
- **Implementazione**:
  - Componente: `TimelineEnhanced.tsx`
  - Funzione aggregazione: `getQuartCentury(year)` - Converte anno in quarto di secolo (13I, 13II, 13III, 13IV)
  - Funzione conversione: `getYearRangeFromQuartCentury(quartCentury)` - Converte quarto in range anni usando regex per parsing corretto dei numeri romani

### Indice Alfabetico
- 26 lettere dell'alfabeto
- Lettere attive/inattive in base ai dati disponibili
- Click su lettera mostra tutti i lemmi corrispondenti
- Ordinamento alfabetico automatico

### Metriche Dashboard
- **Località**: Numero località uniche
- **Lemmi**: Numero lemmi univoci
- **Anni**: Copertura temporale
- **Attestazioni**: Totale occorrenze

## 🐳 Docker

### Build e Deploy

```bash
# Build
docker-compose build

# Start in background
docker-compose up -d

# Logs
docker-compose logs -f

# Stop
docker-compose down

# Rebuild completo
docker-compose up -d --build --force-recreate
```

### Porta

L'applicazione è configurata per girare sulla **porta 9000** per compatibilità con proxy pass in produzione.

### Health Check

Endpoint disponibile su `http://localhost:9000/health`

## 🌐 Deployment in Produzione

L'applicazione è pre-configurata per deployment dietro un reverse proxy:

```nginx
# Esempio configurazione proxy
location /lemmario/ {
    proxy_pass http://localhost:9000/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

## 🔍 Ottimizzazioni

- **Turbopack**: Build rapida e dev server performante
- **Static Export**: Output completamente statico
- **Code Splitting**: Componenti lazy-loaded
- **Memoization**: useMemo/useCallback per calcoli costosi
- **Gzip Compression**: Abilitata in Nginx
- **Asset Caching**: Header cache ottimizzati

## 📱 Responsività

- Desktop: Layout 3 colonne (mappa 2/3, indice 1/3)
- Tablet: Layout adattivo
- Mobile: Stack verticale

## ♿ Accessibilità

- Navigazione completa da tastiera
- Aria-labels su tutti gli elementi interattivi
- Focus visibile
- Contrasto colori WCAG AA
- Screen reader friendly

## 🧪 Testing

```bash
# Unit tests (da implementare)
npm test

# E2E tests (da implementare)
npm run test:e2e
```

## 📝 Licenza

Consultare il file LICENSE nella root del progetto.

## 👥 Autori

Progetto AtLiTeG - Atlante della Lingua e dei Testi della Cultura Gastronomica
