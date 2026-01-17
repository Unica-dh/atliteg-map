# Componente AlphabeticalIndex

**Versione:** 1.0  
**Ultima Modifica:** 2024-01-15  
**Stato:** Stabile

---

## Panoramica

Il componente `AlphabeticalIndex` fornisce un indice alfabetico interattivo per navigare i lemmi del vocabolario. Supporta selezione per lettera con evidenziazione cross-componente, visualizzazione lemmi raggruppati, e integrazione con il sistema di filtri globali.

## Funzionalità

- **Alfabeto completo A-Z** con 26 bottoni interattivi
- **Indicatori visivi** per lettere con/senza lemmi disponibili
- **Selezione lettera**: Click attiva filtro + evidenziazione
- **Hover temporaneo**: Anteprima evidenziazione senza selezione
- **Grid responsive**: 2-4 colonne per visualizzazione lemmi
- **Raggruppamento**: Lemmi aggregati con somma occorrenze
- **Masonry layout**: Grid auto-rows per altezze variabili
- **Scroll interno**: Max-height 256px per lista lemmi
- **Animazioni fluide**: Stagger per lettere e lemmi, transizioni apertura/chiusura
- **Chiusura opzionale**: Prop `onClose` per rendering in modal

## Props/API

```typescript
interface AlphabeticalIndexProps {
  onClose?: () => void;  // Callback opzionale per chiudere componente (usato in modal)
}
```

### Esempio

```tsx
// Standalone
<AlphabeticalIndex />

// In modal con chiusura
<AlphabeticalIndex onClose={() => setShowIndex(false)} />
```

## Implementazione

### Generazione Alfabeto

```typescript
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

// Determina lettere con lemmi disponibili
const lettersWithLemmi = useMemo(() => {
  const letters = new Set<string>();
  lemmi.forEach(lemma => {
    if (lemma.Lemma) {
      letters.add(lemma.Lemma[0].toUpperCase());
    }
  });
  return letters;
}, [lemmi]);
```

### Filtraggio Lemmi per Lettera

Usa array `lemmi` originale (non `filteredLemmi`) per evitare che `selectedLemmaId` filtri l'indice stesso:

```typescript
const displayedLemmi = useMemo(() => {
  if (!filters.selectedLetter) return [];

  const lemmiForLetter = lemmi.filter(lemma =>
    lemma.Lemma.toLowerCase().startsWith(filters.selectedLetter!.toLowerCase())
  );

  // Raggruppa per lemma (key = Lemma)
  const grouped = lemmiForLetter.reduce((acc, lemma) => {
    if (!acc[lemma.Lemma]) {
      acc[lemma.Lemma] = [];
    }
    acc[lemma.Lemma].push(lemma);
    return acc;
  }, {} as Record<string, typeof lemmi>);

  // Ordina alfabeticamente
  return Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b));
}, [lemmi, filters.selectedLetter]);
```

### Gestione Click Lettera

Toggle lettera selezionata + evidenziazione multi-elemento:

```typescript
const handleLetterClick = (letter: string) => {
  if (filters.selectedLetter === letter) {
    // Deselect
    setFilters({ selectedLetter: null });
    clearHighlight();
  } else {
    // Select
    setFilters({ selectedLetter: letter });
    
    // Evidenzia tutti lemmi, aree geo, anni correlati
    const lemmiIds = lemmi
      .filter(l => l.Lemma.toLowerCase().startsWith(letter.toLowerCase()))
      .map(l => l.IdLemma);
    
    const geoAreas = [...new Set(
      lemmi
        .filter(l => l.Lemma.toLowerCase().startsWith(letter.toLowerCase()))
        .map(l => l.CollGeografica)
    )];
    
    const years = [...new Set(
      lemmi
        .filter(l => l.Lemma.toLowerCase().startsWith(letter.toLowerCase()))
        .map(l => parseInt(l.Anno))
        .filter(y => !isNaN(y))
    )];
    
    highlightMultiple({
      lemmaIds,
      geoAreaIds: geoAreas,
      years,
      letters: [letter],
      source: 'index',
      type: 'select'
    });
  }
};
```

### Hover Temporaneo

Evidenziazione al passaggio del mouse senza selezione permanente:

```typescript
const handleLetterHover = (letter: string | null) => {
  if (!letter) {
    clearHighlight();
    return;
  }
  
  const lemmiIds = lemmi
    .filter(l => l.Lemma.toLowerCase().startsWith(letter.toLowerCase()))
    .map(l => l.IdLemma);
  
  highlightMultiple({
    lemmaIds,
    letters: [letter],
    source: 'index',
    type: 'hover'  // Evidenziazione temporanea
  });
};
```

### Selezione Lemma da Indice

Reset completo filtri per focalizzare solo sul lemma selezionato:

```typescript
const handleLemmaClick = (lemma: string, idLemma: string) => {
  setFilters({
    selectedLemmaId: idLemma,
    searchQuery: lemma,
    selectedLetter: null,      // Reset lettera
    selectedYear: null,        // Reset anno
    categorie: [],             // Reset categorie
    periodi: []                // Reset periodi
  });
  clearHighlight();
  
  // Chiude indice se in modal
  if (onClose) {
    onClose();
  }
};
```

### Grid Layout Lemmi

Layout masonry responsive con grid CSS:

```tsx
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-64 overflow-y-auto"
     style={{ gridAutoRows: 'min-content' }}>
  {displayedLemmi.map(([lemma, occorrenze]) => {
    const totalFreq = occorrenze.reduce((sum, o) => {
      const freq = parseInt(o.Frequenza);
      return sum + (isNaN(freq) ? 0 : freq);
    }, 0);
    
    return (
      <motion.button
        layoutId={`lemma-card-${occorrenze[0].IdLemma}`}
        whileHover={{ scale: 1.03, y: -2 }}
        className="bg-background-muted rounded p-2 hover:bg-primary-light"
      >
        <h4>{lemma}</h4>
        <p>{totalFreq} occ.</p>
      </motion.button>
    );
  })}
</div>
```

### Stati Visivi Lettere

```typescript
const isSelected = filters.selectedLetter === letter;
const isHighlighted = isLetterHighlighted(letter);

className={`
  ${hasLemmi ? 'cursor-pointer' : 'cursor-not-allowed opacity-20'}
  ${isSelected
    ? 'bg-primary text-white shadow-md'
    : isHighlighted
      ? 'bg-primary-light text-primary ring-2 ring-primary'
      : hasLemmi
        ? 'bg-background-muted text-primary hover:bg-primary-light'
        : 'bg-background-muted text-text-muted'
  }
`}
```

## Hooks e Dipendenze

### Hook Utilizzati

- **`useApp()`**: Accesso a `lemmi`, `filteredLemmi`, `filters`, `setFilters()`
- **`useHighlight()`**: Funzioni `highlightMultiple()`, `clearHighlight()`, `isLetterHighlighted()`, `isLemmaHighlighted()`
- **`useMemo()`**: Memoizzazione alfabeto, lettere disponibili, lemmi visualizzati
- **`useState()`**: Non usato (stato gestito da context)

### Dipendenze Esterne

- **Framer Motion**: AnimatePresence, motion, LayoutGroup per animazioni
- **Lucide React**: Icona X per bottone chiusura
- **MotionWrapper**: StaggerContainer, StaggerItem per animazioni scaglionate
- **lib/motion-config**: Preset animazioni (spring.fast, transitions.medium)

### Context

```typescript
// AppContext
const { lemmi, filteredLemmi, filters, setFilters } = useApp();

// HighlightContext
const { highlightMultiple, clearHighlight, isLetterHighlighted, isLemmaHighlighted } = useHighlight();
```

## Esempi d'Uso

### Utilizzo Standard (Sidebar)

```tsx
import { AlphabeticalIndex } from '@/components/AlphabeticalIndex';

export default function Page() {
  return (
    <div className="flex gap-4">
      <aside className="w-80">
        <AlphabeticalIndex />
      </aside>
      <main>
        {/* Contenuto principale */}
      </main>
    </div>
  );
}
```

### Utilizzo in Modal

```tsx
import { AlphabeticalIndex } from '@/components/AlphabeticalIndex';
import { useState } from 'react';

export default function Page() {
  const [showIndex, setShowIndex] = useState(false);
  
  return (
    <>
      <button onClick={() => setShowIndex(true)}>
        Apri Indice
      </button>
      
      {showIndex && (
        <div className="fixed inset-0 bg-black/50 z-50">
          <div className="bg-white p-4 rounded">
            <AlphabeticalIndex onClose={() => setShowIndex(false)} />
          </div>
        </div>
      )}
    </>
  );
}
```

### Accesso Stato Lettera

```tsx
const { filters } = useApp();

if (filters.selectedLetter) {
  console.log(`Lettera selezionata: ${filters.selectedLetter}`);
}
```

## Note

### Performance

- **Memoizzazione**: `lettersWithLemmi` e `displayedLemmi` calcolati solo quando dipendenze cambiano
- **Set per unicità**: `Set` per deduplicazione aree geo e anni (O(1) lookup)
- **Early break**: Nessun early break implementato, itera tutti lemmi
- **Scroll virtuale**: Non implementato, max 256px con scroll nativo

### Accessibilità

- **ARIA labels**: `aria-label` descrittivo su ogni bottone lettera
- **Keyboard navigation**: Supporto nativo browser per bottoni
- **Focus indicators**: Ring focus visibile su bottoni
- **Disabled state**: `disabled={!hasLemmi}` per lettere senza lemmi

### Animazioni

```typescript
// Lettere: Stagger 0.02s
<StaggerContainer staggerDelay={0.02}>
  {alphabet.map(letter => (
    <StaggerItem key={letter}>
      <motion.button whileHover={{ scale: 1.15, y: -2 }} />
    </StaggerItem>
  ))}
</StaggerContainer>

// Lemmi: Stagger 0.03s
<StaggerContainer staggerDelay={0.03}>
  {displayedLemmi.map(([lemma, occorrenze]) => (
    <StaggerItem key={lemma}>
      <motion.button layoutId={`lemma-card-${occorrenze[0].IdLemma}`} />
    </StaggerItem>
  ))}
</StaggerContainer>
```

### Limitazioni

- **Solo alfabeto latino**: A-Z, nessun supporto per caratteri accentati o speciali
- **Case insensitive**: Ricerca con `toLowerCase()`, no distinzione maiuscole
- **Nessun filtro aggiuntivo**: Mostra sempre tutti i lemmi per lettera, ignorando filtri categoria/periodo
- **Scroll non sincronizzato**: Nessuna sincronizzazione scroll tra indice e lista principale

### Comportamento Filtri

Importante: `displayedLemmi` usa array `lemmi` originale, NON `filteredLemmi`, per evitare che:

1. `selectedLemmaId` nasconda l'indice stesso
2. Filtri categoria/periodo riducano opzioni disponibili
3. Ricerca interferisca con navigazione alfabetica

Questo garantisce che l'indice mostri sempre tutte le lettere e lemmi disponibili nel dataset completo.

### Grid Responsive

```
Mobile (<768px):   2 colonne
Tablet (768-1024): 3 colonne
Desktop (>1024):   4 colonne
```

### Z-Index

Il componente non definisce z-index fisso. Quando usato in modal, il parent deve gestire layering.

### Ottimizzazioni Possibili

- Virtual scrolling per > 100 lemmi per lettera
- Indicatori quantità lemmi per lettera (badge numerico)
- Filtri combinati (lettera + categoria)
- Scroll-to-letter sincronizzato con lista principale
- Supporto caratteri accentati (À, È, ecc.)
