# Componente LemmaDetail

**Versione:** 1.0  
**Ultima Modifica:** 2024-01-15  
**Stato:** Stabile

---

## Panoramica

Il componente `LemmaDetail` visualizza i dettagli delle forme grammaticali dei lemmi selezionati o filtrati. Mostra informazioni aggregate per lemma (categoria, URL vocabolario) e dettagli specifici per ogni forma (datazione, località, frequenza). Supporta visualizzazione multipla con scroll interno e animazioni fluide.

## Funzionalità

- **Visualizzazione adattiva**:
  - Lemma singolo selezionato (`selectedLemmaId`)
  - Risultati multipli da ricerca/filtri
  - Stato vuoto animato quando nessuna selezione
- **Raggruppamento intelligente**: Forme aggregate per lemma con somma occorrenze
- **Metadati strutturati**:
  - Livello lemma: categoria, URL vocabolario, totale occorrenze
  - Livello forma: forma testuale, località, datazione, frequenza
- **Link esterni**: Collegamento diretto a vocabolario.atliteg.org per approfondimenti
- **Scroll interno**: Altezza fissa 580px con overflow-y-auto
- **Header sticky**: Statistiche sempre visibili durante scroll
- **Animazioni**: Layout animations, stagger, transizioni entrata/uscita

## Props/API

Il componente `LemmaDetail` non accetta props. Recupera dati dai context globali.

### Dati Visualizzati

```typescript
// Da AppContext
const { filteredLemmi, filters } = useApp();

// Struttura Lemma
interface Lemma {
  IdLemma: string;           // ID univoco
  Lemma: string;             // Forma lemma (headword)
  Forma: string;             // Forma grammaticale specifica
  CollGeografica: string;    // Località geografica
  Datazione: string;         // Periodo datazione
  Anno: string;              // Anno (per timeline)
  Categoria: string;         // Categoria gastronomica
  Frequenza: string;         // Numero occorrenze
  URL: string;               // Link vocabolario.atliteg.org
  // ... altri campi
}
```

## Implementazione

### Logica di Visualizzazione

Il componente determina quali lemmi mostrare in base ai filtri attivi:

```typescript
const displayedLemmas = useMemo(() => {
  // Priorità 1: Lemma specifico selezionato
  if (filters.selectedLemmaId !== null) {
    return filteredLemmi.filter(
      (lemma: Lemma) => lemma.IdLemma === filters.selectedLemmaId
    );
  }
  
  // Priorità 2: Risultati da ricerca/filtri
  if (
    filters.searchQuery ||
    filters.categorie.length > 0 ||
    filters.periodi.length > 0 ||
    filters.selectedLetter !== null ||
    filters.selectedYear !== null
  ) {
    return filteredLemmi.slice().sort((a, b) => a.Lemma.localeCompare(b.Lemma));
  }
  
  // Default: nessun lemma
  return [];
}, [filteredLemmi, filters]);
```

### Raggruppamento per Lemma

Forme multiple dello stesso lemma aggregate in un'unica card:

```typescript
const groupedByLemma = useMemo(() => {
  const groups = new Map<string, Lemma[]>();
  
  displayedLemmas.forEach((lemma: Lemma) => {
    if (!groups.has(lemma.Lemma)) {
      groups.set(lemma.Lemma, []);
    }
    groups.get(lemma.Lemma)!.push(lemma);
  });
  
  // Ordina alfabeticamente
  return Array.from(groups.entries()).sort((a, b) => a[0].localeCompare(b[0]));
}, [displayedLemmas]);
```

### Calcolo Statistiche

```typescript
// Totale occorrenze (somma frequenze)
const totalOccorrenze = useMemo(() => {
  return displayedLemmas.reduce((sum, lemma) => {
    const freq = parseInt(lemma.Frequenza) || 0;
    return sum + freq;
  }, 0);
}, [displayedLemmas]);

// Totale forme uniche
const totalForme = useMemo(() => {
  return new Set(displayedLemmas.map(l => l.Forma)).size;
}, [displayedLemmas]);
```

### Struttura Card Lemma

Ogni lemma è renderizzato come card con header e lista forme:

```tsx
<div className="border border-border rounded-md">
  {/* Header Lemma */}
  <div className="px-1.5 py-1 bg-primary/5 border-b">
    <div className="flex items-center gap-1">
      <FileText className="w-4 h-4 text-primary" />
      <h3 className="text-sm font-semibold">{lemmaText}</h3>
      <span className="text-xs text-text-muted">{totalFreq} occ.</span>
      
      {/* Link vocabolario */}
      {url && (
        <a href={url} target="_blank" rel="noopener noreferrer">
          <ExternalLink className="w-4 h-4" />
        </a>
      )}
    </div>
    
    {/* Categoria */}
    {categoria && (
      <div className="text-xs">
        <span className="font-medium">Cat:</span> {categoria}
      </div>
    )}
  </div>
  
  {/* Lista Forme */}
  <div className="space-y-1 p-1.5">
    {occurrences.map(lemma => (
      <div className="bg-background-muted rounded p-1">
        <div className="grid grid-cols-2 gap-x-1.5">
          <div>Forma: {lemma.Forma}</div>
          <div><MapPin /> {lemma.CollGeografica}</div>
          <div><Calendar /> {lemma.Datazione}</div>
          <div><Hash /> freq.: {lemma.Frequenza}</div>
        </div>
      </div>
    ))}
  </div>
</div>
```

### Stato Vuoto

Quando nessun lemma è selezionato/filtrato:

```tsx
<div className="card p-8 flex flex-col items-center justify-center" 
     style={{ height: '580px' }}>
  <motion.div
    animate={{
      scale: [1, 1.1, 1],
      rotate: [0, 5, -5, 0]
    }}
    transition={{
      duration: 3,
      repeat: Infinity,
      repeatType: 'reverse'
    }}
  >
    <FileText className="w-16 h-16 text-gray-300" />
  </motion.div>
  <h3>Nessun lemma selezionato</h3>
  <p>Seleziona un punto sulla mappa, effettua una ricerca...</p>
</div>
```

### Layout Fisso con Scroll

```tsx
<div className="card !p-0 flex flex-col overflow-hidden" 
     style={{ height: '580px' }}>
  {/* Header sticky */}
  <div className="sticky top-0 bg-white z-10 border-b">
    <h2>Dettaglio Forme</h2>
    <div>{totalForme} forme • {totalOccorrenze} occorrenze</div>
  </div>
  
  {/* Content scrollabile */}
  <div className="flex-1 overflow-y-auto space-y-1.5 px-1.5 pb-1.5">
    {groupedByLemma.map(...)}
  </div>
</div>
```

## Hooks e Dipendenze

### Hook Utilizzati

- **`useApp()`**: Accesso a `filteredLemmi`, `filters`
- **`useMemo()`**: Memoizzazione `displayedLemmas`, `groupedByLemma`, statistiche
- **Tutti gli hook PRIMA di early return**: Evita errore React hook rules

### Dipendenze Esterne

- **Framer Motion**: AnimatePresence, motion, LayoutGroup per animazioni
- **Lucide React**: Icone FileText, MapPin, Calendar, Hash, ExternalLink
- **MotionWrapper**: FadeIn per stato vuoto
- **lib/motion-config**: Preset animazioni

### Tipi

```typescript
import { Lemma } from '@/types/lemma';
```

## Esempi d'Uso

### Utilizzo Standard (Layout)

```tsx
import { LemmaDetail } from '@/components/LemmaDetail';

export default function Page() {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="col-span-2">
        {/* Mappa o contenuto principale */}
      </div>
      <div>
        <LemmaDetail />
      </div>
    </div>
  );
}
```

### Monitoraggio Stato

```tsx
const { filters, filteredLemmi } = useApp();

console.log('Lemma selezionato:', filters.selectedLemmaId);
console.log('Risultati filtrati:', filteredLemmi.length);
```

## Note

### Performance

- **Memoizzazione**: `displayedLemmas` e `groupedByLemma` ricalcolati solo quando `filteredLemmi` o `filters` cambiano
- **Map per raggruppamento**: O(n) per grouping, O(n log n) per sorting
- **Nessun virtualization**: Tutte le card renderizzate, scroll nativo
- **LayoutGroup**: Framer Motion layout animations possono impattare con molti elementi (>100)

### Accessibilità

- **Struttura semantica**: `<h2>`, `<h3>` per gerarchia headings
- **Link esterni**: `target="_blank"` + `rel="noopener noreferrer"` per sicurezza
- **Icone decorative**: Accessibili senza `aria-label` (accompagnate da testo)

### Responsive

- **Grid 2 colonne**: Dati forma disposti in grid responsiva
- **Padding minimale**: `!p-0` su card per massimizzare spazio verticale
- **Altezza fissa**: 580px su tutti i viewport (no responsive height)

### Limitazioni

- **Nessun virtualization**: Rendering completo di tutte le card (può essere lento con >100 lemmi)
- **Altezza fissa**: Non si adatta a viewport piccoli (<600px height)
- **Sorting semplice**: Solo alfabetico, no sorting per frequenza o datazione
- **Nessun filtering interno**: Mostra tutte le forme del lemma, no filtri per località/periodo

### Animazioni

```typescript
// Transizione cambio filtri
<motion.div
  key={filters.selectedLemmaId || filters.searchQuery || 'all'}
  initial={{ opacity: 0, x: 20 }}
  animate={{ opacity: 1, x: 0 }}
  exit={{ opacity: 0, x: -20 }}
  transition={motionConfig.transitions.medium}
/>

// Layout animation card
<motion.div
  layout
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  exit={{ opacity: 0, scale: 0.95 }}
  transition={motionConfig.spring.soft}
/>

// Stato vuoto loop
<motion.div
  animate={{
    scale: [1, 1.1, 1],
    rotate: [0, 5, -5, 0]
  }}
  transition={{
    duration: 3,
    repeat: Infinity,
    type: 'tween'  // Non 'spring' per keyframe arrays
  }}
/>
```

### Hook Order Compliance

**IMPORTANTE**: Il componente rispetta le React Rules of Hooks chiamando tutti gli hook PRIMA del return condizionale:

```typescript
// ✅ CORRETTO: Hooks chiamati sempre
const displayedLemmas = useMemo(...);
const groupedByLemma = useMemo(...);
const totalOccorrenze = useMemo(...);
const totalForme = useMemo(...);

// DOPO tutti gli hook
if (displayedLemmas.length === 0) {
  return <EmptyState />;
}

return <Content />;
```

### Ottimizzazioni Possibili

- Virtual scrolling per > 50 lemmi
- Lazy loading forme (inizialmente nascoste, espandibili)
- Sorting configurabile (alfabetico, frequenza, datazione)
- Filtering forme per località/periodo
- Export dati in CSV/JSON
- Paginazione invece di scroll infinito
