# Componente Filters

**Versione:** 1.0  
**Ultima Modifica:** 2024-01-15  
**Stato:** Stabile

---

## Panoramica

Il componente `Filters` fornisce un'interfaccia di filtraggio avanzata per categorie e periodi dei lemmi. Supporta selezione multipla, ricerca interna, e si adatta responsivamente ai dispositivi mobili con modal a schermo intero e dropdown posizionati su desktop.

## Funzionalità

- **Selezione multipla** di categorie e periodi tramite dropdown personalizzati
- **Ricerca interna** nelle opzioni di filtro con debouncing
- **Azioni rapide**: "Seleziona tutti" e "Deseleziona tutti"
- **Badge visivi** per filtri attivi con possibilità di rimozione individuale
- **Pulsante Reset** per cancellare tutti i filtri in un colpo solo
- **Responsive design**:
  - Desktop: dropdown posizionati con portali
  - Mobile: modal a schermo intero (z-index 9999)
- **Animazioni fluide** con Framer Motion per apertura/chiusura e interazioni
- **Accessibilità** con ARIA labels e gestione tastiera

## Props/API

### Componente Principale: `Filters`

Nessuna prop richiesta. Il componente accede direttamente al contesto globale.

### Sub-componente: `MultiSelect`

```typescript
interface MultiSelectProps {
  label: string;              // Etichetta del filtro (es. "Categoria", "Periodo")
  options: string[];          // Array di opzioni disponibili
  selectedValues: string[];   // Valori attualmente selezionati
  onChange: (values: string[]) => void;  // Callback per cambiamenti
  placeholder: string;        // Testo placeholder quando nessuna selezione
  color?: 'blue' | 'purple';  // Schema colori (default: 'blue')
}
```

## Implementazione

### Architettura del Componente

Il componente è strutturato in due parti principali:

1. **`MultiSelect`**: Componente riutilizzabile per dropdown con selezione multipla
   - Gestisce stato locale per apertura, ricerca, posizionamento
   - Utilizza portali React per rendering fuori dal DOM parent
   - Implementa rilevamento viewport per mobile/desktop
   - Debouncing per ridimensionamento finestra (150ms)

2. **`Filters`**: Wrapper che coordina i filtri categoria e periodo
   - Recupera opzioni uniche dai lemmi caricati
   - Gestisce sincronizzazione con `AppContext`
   - Visualizza badge per filtri attivi
   - Fornisce pulsante reset globale

### Logica di Filtraggio

```typescript
// Recupero opzioni uniche dai lemmi
const categorie = useMemo(() => getUniqueCategorie(lemmi), [lemmi]);
const periodi = useMemo(() => getUniquePeriodi(lemmi), [lemmi]);

// Toggle singola opzione
const toggleOption = (value: string) => {
  const newValues = selectedValues.includes(value)
    ? selectedValues.filter(v => v !== value)
    : [...selectedValues, value];
  onChange(newValues);
};
```

### Posizionamento Dinamico (Desktop)

Il dropdown usa posizionamento fisso (`position: fixed`) calcolato rispetto al pulsante trigger:

```typescript
useEffect(() => {
  const updatePosition = () => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
        width: Math.max(rect.width, 320)
      });
    }
  };
  
  updatePosition();
  window.addEventListener('scroll', updatePosition, true);
  window.addEventListener('resize', updatePosition);
}, [isOpen]);
```

### Modal Mobile

Su viewport `< 768px`, il dropdown si trasforma in modal centrato:

```typescript
// Backdrop blur: z-[9998]
// Modal: z-[9999] (sotto AlphabeticalIndex z-[10000])
<motion.div className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-[9999]">
  {/* Header con titolo e bottone chiusura */}
  {/* Contenuto con ricerca e opzioni */}
  {/* Footer con pulsante "Applica" */}
</motion.div>
```

## Hooks e Dipendenze

### Hook Utilizzati

- **`useApp()`**: Accesso a `lemmi`, `filters`, `setFilters()`, `resetFilters()`
- **`useMemo()`**: Memoizzazione liste categorie/periodi, opzioni filtrate
- **`useState()`**: Stato locale per dropdown (isOpen, searchQuery, posizione)
- **`useRef()`**: Riferimenti DOM per dropdown e pulsante trigger
- **`useEffect()`**: Gestione eventi (click outside, scroll, resize)

### Dipendenze Esterne

- **React Portal**: `createPortal()` per rendering dropdown/modal in `document.body`
- **Framer Motion**: Animazioni (AnimatePresence, motion components)
- **Lucide React**: Icone (X, ChevronDown, Search, Check)
- **MotionWrapper**: `StaggerContainer`, `StaggerItem` per animazioni staggered
- **dataLoader**: `getUniqueCategorie()`, `getUniquePeriodi()` per estrarre opzioni

### Servizi

```typescript
// Estrazione valori unici da lemmi
getUniqueCategorie(lemmi: Lemma[]): string[]
getUniquePeriodi(lemmi: Lemma[]): string[]
```

## Esempi d'Uso

### Utilizzo Standard

```tsx
import { Filters } from '@/components/Filters';

export default function Page() {
  return (
    <div>
      {/* Barra filtri sempre visibile sotto header */}
      <Filters />
      
      {/* Contenuto filtrato */}
      <MainContent />
    </div>
  );
}
```

### Reset Programmatico

```tsx
const { resetFilters } = useApp();

// Reset tutti i filtri
<button onClick={resetFilters}>
  Cancella filtri
</button>
```

### Accesso Stato Filtri

```tsx
const { filters } = useApp();

console.log(filters.categorie);  // ["Verdure", "Cereali"]
console.log(filters.periodi);    // ["XIII sec.", "XIV sec."]
```

## Note

### Performance

- **Memoizzazione**: Categorie e periodi sono calcolati solo quando `lemmi` cambia
- **Debouncing**: Ricerca interna con debounce implicito nel filtering
- **Virtual scrolling**: Non implementato; max 512px altezza dropdown per performance

### Accessibilità

- **Keyboard navigation**: Supporto per Esc, Enter, Space
- **ARIA labels**: `aria-expanded`, `aria-haspopup` per screen readers
- **Focus management**: Focus trap non implementato (click outside chiude)

### Z-Index Hierarchy

```
10000: AlphabeticalIndex mobile modal
9999:  Filters dropdown/modal
9998:  Filters backdrop (mobile)
```

### Limitazioni

- **Multi-select non nativo**: Usa checkbox personalizzati invece di `<select multiple>`
- **Max opzioni visualizzate**: Nessun limite hard, ma scroll dopo 32rem (512px)
- **Ricerca avanzata**: Solo ricerca testuale case-insensitive, no fuzzy search

### Personalizzazione Colori

Il componente supporta due schemi colore predefiniti:

```typescript
// Blu (categorie)
color="blue"  // border-primary, bg-primary, text-primary

// Viola (periodi)  
color="purple" // border-accent, bg-accent, text-accent
```

Per aggiungere nuovi colori, estendere `colorClasses` in `MultiSelect`.
