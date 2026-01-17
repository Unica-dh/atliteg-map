# Componente SearchBar

**Versione:** 1.0  
**Ultima Modifica:** 2024-01-15  
**Stato:** Stabile

---

## Panoramica

Il componente `SearchBar` fornisce una barra di ricerca intelligente con autocompletamento e suggerimenti per lemmi e forme. Supporta ricerca debounced, navigazione da tastiera, e integrazione con il sistema di evidenziazione cross-componente.

## Funzionalità

- **Ricerca in tempo reale** con debouncing (300ms) per ottimizzare le performance
- **Autocompletamento** con suggerimenti limitati a 10 risultati unici
- **Evidenziazione testo** con highlight dei caratteri corrispondenti
- **Navigazione tastiera**: Arrow Up/Down, Enter, Escape
- **Integrazione highlight**: Evidenziazione temporanea al hover e permanente alla selezione
- **Deduplicazione**: Previene suggerimenti duplicati per lemma+forma identici
- **Animazioni fluide** per apertura/chiusura suggerimenti e cancellazione
- **Feedback visivo**: Stato vuoto con icona e messaggio quando nessun risultato

## Props/API

Il componente `SearchBar` non accetta props. Interagisce direttamente con i context globali.

### Stato Interno

```typescript
const [query, setQuery] = useState('');                    // Testo input utente
const [suggestions, setSuggestions] = useState<Lemma[]>([]);  // Risultati autocomplete
const [isOpen, setIsOpen] = useState(false);               // Visibilità dropdown suggerimenti
const [highlightedIndex, setHighlightedIndex] = useState(-1);  // Indice navigazione tastiera
```

## Implementazione

### Logica di Ricerca con Debouncing

La ricerca è ottimizzata con timeout di 300ms per evitare query eccessive durante la digitazione:

```typescript
useEffect(() => {
  const timeoutId = setTimeout(() => {
    if (query.length > 0) {
      const uniqueResults = new Map<string, Lemma>();
      const lowerQuery = query.toLowerCase();

      for (const lemma of lemmi) {
        if (uniqueResults.size >= 10) break;  // Max 10 risultati

        const matches =
          lemma.Lemma.toLowerCase().includes(lowerQuery) ||
          lemma.Forma.toLowerCase().includes(lowerQuery);

        if (matches) {
          // Chiave normalizzata per evitare duplicati
          const key = `${lemma.Lemma.toLowerCase().trim()}|${lemma.Forma.toLowerCase().trim()}`;
          if (!uniqueResults.has(key)) {
            uniqueResults.set(key, lemma);
          }
        }
      }

      setSuggestions(Array.from(uniqueResults.values()));
      setIsOpen(uniqueResults.size > 0);
    }
  }, 300);

  return () => clearTimeout(timeoutId);
}, [query, lemmi]);
```

### Deduplicazione Risultati

Utilizza una `Map` con chiave composta `lemma|forma` normalizzata per garantire unicità dei suggerimenti anche in presenza di varianti case-insensitive o spazi.

### Gestione Selezione

Quando l'utente seleziona un lemma, il componente:

1. **Reset completo dei filtri** per evitare conflitti
2. **Imposta filtri specifici** per il lemma selezionato
3. **Evidenzia** lemma, area geografica e anno correlati
4. **Chiude** dropdown suggerimenti

```typescript
const handleSelect = (lemma: Lemma) => {
  // Reset completo filtri
  setFilters({
    searchQuery: lemma.Lemma,
    selectedLemmaId: lemma.IdLemma,
    selectedLetter: null,
    selectedYear: null,
    categorie: [],
    periodi: []
  });
  
  setQuery(lemma.Lemma);
  setIsOpen(false);
  
  // Evidenzia lemma + correlati
  const year = parseInt(lemma.Anno);
  highlightMultiple({
    lemmaIds: [lemma.IdLemma],
    geoAreaIds: [lemma.CollGeografica],
    years: !isNaN(year) ? [year] : [],
    source: 'search',
    type: 'select'
  });
};
```

### Navigazione Tastiera

Supporto completo per interazione da tastiera:

```typescript
const handleKeyDown = (e: React.KeyboardEvent) => {
  if (!isOpen) return;

  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
      break;
    case 'ArrowUp':
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
      break;
    case 'Enter':
      e.preventDefault();
      if (highlightedIndex >= 0) {
        handleSelect(suggestions[highlightedIndex]);
      }
      break;
    case 'Escape':
      setIsOpen(false);
      setHighlightedIndex(-1);
      break;
  }
};
```

### Evidenziazione Testo

Funzione utility per evidenziare caratteri corrispondenti nei suggerimenti:

```typescript
const highlightText = (text: string, query: string) => {
  if (!query) return text;
  const parts = text.split(new RegExp(`(${query})`, 'gi'));
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark key={i} className="bg-yellow-200 text-gray-900">
        {part}
      </mark>
    ) : (
      part
    )
  );
};
```

### Integrazione con HighlightContext

Al hover sui suggerimenti, evidenziazione temporanea degli elementi correlati:

```typescript
const handleSuggestionHover = (lemma: Lemma, index: number) => {
  setHighlightedIndex(index);

  const year = parseInt(lemma.Anno);
  highlightMultiple({
    lemmaIds: [lemma.IdLemma],
    geoAreaIds: [lemma.CollGeografica],
    years: !isNaN(year) ? [year] : [],
    source: 'search',
    type: 'hover'  // Evidenziazione temporanea
  });
};
```

## Hooks e Dipendenze

### Hook Utilizzati

- **`useApp()`**: Accesso a `lemmi`, `setFilters()`
- **`useHighlight()`**: Funzioni `highlightMultiple()`, `clearHighlight()`, `isLemmaHighlighted()`
- **`useState()`**: Gestione stato locale (query, suggestions, isOpen, highlightedIndex)
- **`useEffect()`**: Debouncing ricerca, gestione click outside
- **`useRef()`**: Riferimenti DOM per input e dropdown suggerimenti

### Dipendenze Esterne

- **Framer Motion**: AnimatePresence, motion components per animazioni
- **Lucide React**: Icone Search, X
- **MotionWrapper**: StaggerContainer, StaggerItem per animazioni scaglionate
- **lib/motion-config**: Configurazioni preset per animazioni

### Context

```typescript
// AppContext
const { lemmi, setFilters } = useApp();

// HighlightContext  
const { highlightMultiple, clearHighlight, isLemmaHighlighted } = useHighlight();
```

## Esempi d'Uso

### Utilizzo Standard

```tsx
import { SearchBar } from '@/components/SearchBar';

export default function Page() {
  return (
    <div className="container">
      <SearchBar />
      {/* Altri componenti reagiranno ai filtri impostati */}
    </div>
  );
}
```

### Accesso Programmatico

```tsx
const { filters } = useApp();

// Verifica se ricerca attiva
if (filters.searchQuery) {
  console.log(`Ricerca: "${filters.searchQuery}"`);
  console.log(`Lemma selezionato: ${filters.selectedLemmaId}`);
}
```

### Clear Programmatico

```tsx
const { setFilters } = useApp();
const { clearHighlight } = useHighlight();

// Reset ricerca
setFilters({ searchQuery: '', selectedLemmaId: null });
clearHighlight();
```

## Note

### Performance

- **Debouncing 300ms**: Riduce query durante digitazione rapida
- **Limite 10 risultati**: Previene rendering eccessivo nel dropdown
- **Early break**: Loop interrotto appena raggiunti 10 risultati
- **Deduplicazione O(1)**: Usa Map invece di array con `find()`

### Accessibilità

- **ARIA attributes**:
  - `aria-label="Cerca lemmi o forme"`
  - `aria-autocomplete="list"`
  - `aria-controls="search-suggestions"`
  - `aria-expanded={isOpen}`
  - `role="listbox"` per dropdown
  - `role="option"` per suggerimenti
  - `aria-selected` per navigazione tastiera

### Z-Index

```
1000: Dropdown suggerimenti (sotto Filters 9999)
```

### Limitazioni

- **Ricerca case-insensitive**: No supporto per ricerca case-sensitive
- **No fuzzy search**: Ricerca esatta con `includes()`, no tolleranza errori
- **No regex avanzate**: Ricerca semplice senza pattern complessi
- **Memoria**: Mantiene tutti i lemmi in memoria per ricerca

### Stati UI

1. **Idle**: Input vuoto, nessun suggerimento
2. **Loading**: Debouncing attivo (300ms), visualmente identico a idle
3. **Results**: Suggerimenti visibili con animazioni
4. **No Results**: Messaggio "Nessun risultato trovato" con icona
5. **Selected**: Suggerimenti chiusi, filtri applicati

### Comportamento Click Outside

```typescript
useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (
      suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node) &&
      inputRef.current && !inputRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  document.addEventListener('mousedown', handleClickOutside);
  return () => document.removeEventListener('mousedown', handleClickOutside);
}, []);
```

### Ottimizzazioni Possibili

- Implementare `SearchIndex` con trie o indice invertito
- Aggiungere ricerca fuzzy con Levenshtein distance
- Virtualizzazione per > 100 risultati
- Web Workers per ricerca in background
- Caching risultati recenti
