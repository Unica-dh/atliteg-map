# Stato Implementazione Dashboard Lemmario AtLiTeG

## ✅ Implementato

### Core Infrastructure
- [x] Progetto Next.js 16 con TypeScript configurato
- [x] Turbopack abilitato (default in v16)
- [x] App Router con layout moderno
- [x] Tailwind CSS configurato
- [x] Context API per stato globale (AppContext)
- [x] TypeScript types completi (Lemma, GeoArea, FilterState, etc.)

### Data Layer
- [x] Servizio dataLoader per CSV e GeoJSON
- [x] PapaParse per parsing CSV
- [x] Parsing categorie multiple
- [x] Gestione coordinate e aree geografiche
- [x] Funzioni utility (getUniqueCategorie, getUniquePeriodi, getUniqueAnni)

### Componenti UI
- [x] Header con branding
- [x] Filters con selezione multipla e reset
- [x] MetricsSummary con 4 metriche principali
- [x] GeographicalMap con Leaflet (marker puntuali + poligoni)
- [x] AlphabeticalIndex con 26 lettere cliccabili
- [x] LoadingSpinner per stati di caricamento

### Features Implementate
- [x] Filtro per categoria (selezione multipla)
- [x] Filtro per periodo (selezione multipla)
- [x] Badge visivi per filtri attivi
- [x] Reset filtri globale
- [x] Mappa interattiva con marker e popup
- [x] Aree geografiche poligonali da GeoJSON
- [x] Indice alfabetico con lettere attive/inattive
- [x] Visualizzazione lemmi per lettera selezionata
- [x] Metriche real-time sincronizzate
- [x] Auto-zoom mappa su risultati

### Docker & Deployment
- [x] Dockerfile multi-stage (Node build + Nginx serve)
- [x] docker-compose.yml configurato
- [x] Nginx configurato su porta 9000
- [x] Health check endpoint
- [x] Configurazione produzione ottimizzata

### Documentation
- [x] README.md completo
- [x] Struttura progetto documentata
- [x] Istruzioni sviluppo e deployment

## 🚧 Da Completare/Migliorare

### Componenti Mancanti
- [ ] SearchBar con autocompletamento (requisito originale)
- [ ] Timeline storica navigabile con anni
- [ ] Pannello dettaglio lemma laterale
- [ ] Gestione stato vuoto per pannello dettaglio

### Features da Aggiungere
- [ ] Ricerca testuale con debounce e suggerimenti
- [ ] Timeline con punti pieni/vuoti per anni con/senza attestazioni
- [ ] Navigazione timeline con frecce
- [ ] Click anno timeline → filtro dashboard
- [ ] Click marker mappa → selezione lemma e pannello dettaglio
- [ ] Sincronizzazione bidirezionale tra tutti i componenti

### Ottimizzazioni
- [ ] Virtualizzazione lista lemmi (react-window)
- [ ] Clustering marker mappa (leaflet.markercluster)
- [ ] Lazy loading componenti pesanti
- [ ] Service Worker per caching dati
- [ ] Web Workers per parsing CSV pesante

### Testing
- [ ] Unit tests (Vitest + React Testing Library)
- [ ] E2E tests (Playwright)
- [ ] Test accessibilità (axe-core)
- [ ] Coverage report

### Accessibilità
- [ ] Audit completo con axe DevTools
- [ ] Test con screen reader
- [ ] Navigazione completa da tastiera
- [ ] Skip links
- [ ] Aria-live regions per aggiornamenti dinamici

### Design
- [ ] Allineamento pixel-perfect al mockup Figma
- [ ] Animazioni e transizioni
- [ ] Responsive ottimizzato per mobile
- [ ] Dark mode (opzionale)

## 📋 Prossimi Passi Prioritari

### 1. SearchBar con Autocompletamento
Creare componente `components/SearchBar.tsx`:
- Input con debounce (300ms)
- Suggerimenti su Lemma e Forma
- Mostra forme associate, località, anni
- Al clic: filtro su IdLemma

### 2. Timeline Storica
Creare componente `components/Timeline.tsx`:
- Calcola range anni da dataset
- Punti blu pieni (con attestazioni) vs vuoti (senza)
- Anno selezionato in blu intenso
- Frecce per navigazione
- Elenco lemmi sotto ogni punto

### 3. Pannello Dettaglio Lemma
Creare componente `components/LemmaDetail.tsx`:
- Stato vuoto: icona + "Seleziona un punto sulla mappa..."
- Lemma selezionato: tutti i dettagli
- URL cliccabile
- Categorie come badge
- Scroll per occorrenze multiple

### 4. Sincronizzazione Completa
- Click marker mappa → setFilters({ selectedLemmaId })
- Click anno timeline → setFilters({ selectedYear })
- Click lettera indice → setFilters({ selectedLetter })
- Tutti i componenti reagiscono a filteredLemmi

## 🐛 Bug Known / Problemi

- [ ] Grid alfabeto a 13 colonne potrebbe non essere ottimale (provare 9x3)
- [ ] Leaflet SSR warning (risolto con dynamic import, ma verificare)
- [ ] Performance con >1000 marker (implementare clustering)
- [ ] Parsing coordinate con virgola vs punto (verificato funzionante)

## 🎯 Come Procedere

### Sviluppo Locale
```bash
cd lemmario-dashboard
npm run dev
# Apri http://localhost:3000
```

### Test Docker
```bash
cd lemmario-dashboard
docker-compose up --build
# Apri http://localhost:9000
```

### Aggiungere Componente Mancante
1. Creare file in `components/NomeComponente.tsx`
2. Importare `useApp()` da context
3. Usare `filteredLemmi` e `setFilters` per interazioni
4. Importare in `app/page.tsx` e aggiungere al layout

### Esempio SearchBar
```typescript
// components/SearchBar.tsx
'use client';

import { useApp } from '@/context/AppContext';
import { useState, useMemo } from 'react';
import { useDebounce } from '@/hooks/useDebounce'; // da creare

export function SearchBar() {
  const { lemmi, setFilters } = useApp();
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  const suggestions = useMemo(() => {
    if (!debouncedQuery) return [];
    const q = debouncedQuery.toLowerCase();
    return lemmi
      .filter(l => 
        l.Lemma.toLowerCase().includes(q) || 
        l.Forma.toLowerCase().includes(q)
      )
      .slice(0, 10); // Max 10 suggerimenti
  }, [debouncedQuery, lemmi]);

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Cerca per lemma o forma..."
        className="w-full px-4 py-2 border rounded-md"
      />
      {suggestions.length > 0 && (
        <div className="absolute top-full mt-1 w-full bg-white border rounded-md shadow-lg">
          {suggestions.map(s => (
            <button
              key={s.IdLemma}
              onClick={() => {
                setFilters({ selectedLemmaId: s.IdLemma });
                setQuery('');
              }}
              className="w-full px-4 py-2 text-left hover:bg-gray-100"
            >
              <strong>{s.Lemma}</strong> - {s.Forma} ({s.CollGeografica}, {s.Anno})
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
```

## 📚 Risorse

- [Next.js 16 Docs](https://nextjs.org/docs)
- [Leaflet Documentation](https://leafletjs.com/reference.html)
- [React Leaflet](https://react-leaflet.js.org/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Lucide Icons](https://lucide.dev/)

## 📞 Supporto

Per domande o problemi, consultare:
- README.md nella root
- Documentazione inline nei componenti
- Piano di implementazione in `/plan/feature-lemmario-dashboard-1.md`
