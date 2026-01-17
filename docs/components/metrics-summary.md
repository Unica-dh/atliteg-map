# Componente MetricsSummary

**Versione:** 1.0  
**Ultima Modifica:** 2024-01-15  
**Stato:** Stabile

---

## Panoramica

Il componente `MetricsSummary` visualizza un riepilogo delle metriche aggregate del dataset filtrato: numero totale di lemmi, forme, occorrenze, anni e località. Fornisce feedback visivo immediato sull'impatto dei filtri applicati con animazioni interattive.

## Funzionalità

- **5 metriche principali** visualizzate in una riga orizzontale compatta
- **Aggiornamento reattivo**: Valori ricalcolati automaticamente quando cambiano filtri
- **Animazioni interattive**:
  - Fade-in staggered all'apertura (0.05s delay tra metriche)
  - Scale-up al hover con sollevamento verticale
  - Rotazione icona (360°) al hover
  - Pulse colore su cambio valore
- **Icone contestuali**: Ogni metrica con icona Lucide React dedicata
- **Design responsivo**: Layout flex-wrap per adattamento mobile

## Props/API

Il componente `MetricsSummary` non accetta props. Recupera metriche da `AppContext`.

### Metriche Visualizzate

```typescript
interface Metrics {
  totalLemmi: number;       // Numero lemmi unici
  totalForme: number;       // Numero forme grammaticali uniche
  totalOccorrenze: number;  // Somma frequenze
  totalAnni: number;        // Numero anni distinti
  totalLocalita: number;    // Numero località geografiche uniche
}
```

## Implementazione

### Struttura Dati Metriche

Array di configurazione per rendering dinamico:

```typescript
const metricsArray = [
  { 
    icon: FileText, 
    label: 'Lemmi', 
    value: metrics.totalLemmi, 
    color: 'text-accent', 
    delay: 0 
  },
  { 
    icon: Layers, 
    label: 'Forme', 
    value: metrics.totalForme, 
    color: 'text-primary', 
    delay: 0.05 
  },
  { 
    icon: Hash, 
    label: 'Occorrenze', 
    value: metrics.totalOccorrenze, 
    color: 'text-accent-hover', 
    delay: 0.1 
  },
  { 
    icon: Calendar, 
    label: 'Anni', 
    value: metrics.totalAnni, 
    color: 'text-primary-hover', 
    delay: 0.15 
  },
  { 
    icon: MapPin, 
    label: 'Località', 
    value: metrics.totalLocalita, 
    color: 'text-primary', 
    delay: 0.2 
  },
];
```

### Rendering Metrica Singola

Ogni metrica è un `motion.div` con animazioni multiple:

```tsx
<motion.div
  className="flex items-center gap-1.5 cursor-default"
  initial={{ opacity: 0, y: -10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ ...motionConfig.transitions.medium, delay }}
  whileHover={{ scale: 1.05, y: -2 }}
>
  {/* Icona con rotazione al hover */}
  <motion.div
    whileHover={{ rotate: 360 }}
    transition={{ duration: 0.5 }}
  >
    <Icon className={`w-4 h-4 ${color}`} />
  </motion.div>
  
  {/* Label */}
  <span className="text-sm text-text-secondary">{label}:</span>
  
  {/* Valore con animazione cambio */}
  <motion.span
    className="text-lg font-semibold text-text-primary"
    key={value}
    initial={{ scale: 1.2, color: '#0B5FA5' }}
    animate={{ scale: 1, color: '#1F2937' }}
    transition={motionConfig.spring.fast}
  >
    {value}
  </motion.span>
</motion.div>
```

### Animazione Cambio Valore

Quando una metrica cambia (es. applicazione filtro), il valore:

1. **Scale up** iniziale (1.2x) in blu primario
2. **Scale down** a dimensione normale (1x) con colore testo standard
3. **Transizione spring** fluida (motionConfig.spring.fast)

```typescript
// key={value} forza re-render quando valore cambia
<motion.span
  key={value}
  initial={{ scale: 1.2, color: '#0B5FA5' }}
  animate={{ scale: 1, color: '#1F2937' }}
/>
```

### Layout Responsive

```tsx
<div className="flex items-center justify-between gap-4 flex-wrap">
  {metricsArray.map(metric => <MetricItem {...metric} />)}
</div>
```

- **Desktop**: Tutte le metriche in una riga
- **Mobile**: Wrap automatico su righe multiple con `flex-wrap`

## Hooks e Dipendenze

### Hook Utilizzati

- **`useApp()`**: Accesso a `metrics` (oggetto Metrics calcolato)

### Dipendenze Esterne

- **Framer Motion**: motion components per animazioni
- **Lucide React**: Icone MapPin, FileText, Calendar, Hash, Layers
- **lib/motion-config**: Preset animazioni (transitions.medium, spring.fast)

### Context

```typescript
const { metrics } = useApp();

// metrics è calcolato in AppContext da useMetrics hook
const metrics = useMetrics(filteredLemmi);
```

### Calcolo Metriche (AppContext)

Le metriche sono calcolate dal hook `useMetrics`:

```typescript
// hooks/useMetrics.ts
export function useMetrics(lemmi: Lemma[]): Metrics {
  return useMemo(() => {
    const uniqueLemmi = new Set(lemmi.map(l => l.Lemma));
    const uniqueForme = new Set(lemmi.map(l => l.Forma));
    const uniqueAnni = new Set(lemmi.map(l => l.Anno).filter(a => a));
    const uniqueLocalita = new Set(lemmi.map(l => l.CollGeografica));
    
    const totalOccorrenze = lemmi.reduce((sum, l) => {
      return sum + (parseInt(l.Frequenza) || 0);
    }, 0);
    
    return {
      totalLemmi: uniqueLemmi.size,
      totalForme: uniqueForme.size,
      totalOccorrenze,
      totalAnni: uniqueAnni.size,
      totalLocalita: uniqueLocalita.size,
    };
  }, [lemmi]);
}
```

## Esempi d'Uso

### Utilizzo Standard (Layout)

```tsx
import { MetricsSummary } from '@/components/MetricsSummary';

export default function Page() {
  return (
    <>
      <Header />
      <MetricsSummary />  {/* Sotto header, sopra contenuto */}
      <MainContent />
    </>
  );
}
```

### Monitoraggio Metriche

```tsx
const { metrics } = useApp();

console.log('Metriche correnti:', {
  lemmi: metrics.totalLemmi,
  forme: metrics.totalForme,
  occorrenze: metrics.totalOccorrenze,
  anni: metrics.totalAnni,
  località: metrics.totalLocalita,
});
```

### Verifica Filtri Attivi

Confrontare metriche filtrate vs totali:

```tsx
const { lemmi, filteredLemmi, metrics } = useApp();

const totalDataset = useMetrics(lemmi);
const currentMetrics = metrics; // Basato su filteredLemmi

console.log(`Visualizzando ${currentMetrics.totalLemmi}/${totalDataset.totalLemmi} lemmi`);
```

## Note

### Performance

- **Memoizzazione**: Metriche calcolate una sola volta in `useMetrics` hook
- **Reattività**: Aggiornamento automatico quando `filteredLemmi` cambia
- **Set per unicità**: Deduplicazione O(n) efficiente con Set
- **Reduce per somma**: Singola iterazione per totale occorrenze

### Accessibilità

- **Cursor default**: `cursor-default` indica elemento non cliccabile
- **Icone decorative**: Accompagnate da label testuale
- **Contrasto colori**: Tutte le combinazioni rispettano WCAG AA

### Animazioni

```typescript
// Fade-in staggered (0.05s per metrica)
initial={{ opacity: 0, y: -10 }}
animate={{ opacity: 1, y: 0 }}
transition={{ ...motionConfig.transitions.medium, delay }}

// Hover container
whileHover={{ scale: 1.05, y: -2 }}

// Hover icona
whileHover={{ rotate: 360 }}
transition={{ duration: 0.5 }}

// Cambio valore
key={value}
initial={{ scale: 1.2, color: '#0B5FA5' }}
animate={{ scale: 1, color: '#1F2937' }}
transition={motionConfig.spring.fast}
```

### Responsive Design

- **Gap adattivo**: `gap-4` tra metriche
- **Flex-wrap**: Wrap automatico su viewport stretti
- **Font sizes**:
  - Label: `text-sm` (14px)
  - Valore: `text-lg` (18px)
  - Icona: `w-4 h-4` (16px)

### Limitazioni

- **Nessun drill-down**: Click su metriche non attiva filtri o dettagli
- **Nessun tooltip**: Info aggiuntive non disponibili al hover
- **Formato numerico semplice**: No separatori migliaia o abbreviazioni (es. 1.2K)
- **Larghezze variabili**: Metriche non allineate verticalmente (numeri grandi spostano layout)

### Palette Colori Icone

```typescript
text-accent        // Viola (#8B5CF6) - Lemmi
text-primary       // Blu (#0B5FA5) - Forme, Località
text-accent-hover  // Viola scuro - Occorrenze
text-primary-hover // Blu scuro - Anni
```

### Ordine Metriche

L'ordine è intenzionale per rilevanza:

1. **Lemmi**: Metric primaria (headwords)
2. **Forme**: Dettaglio grammaticale
3. **Occorrenze**: Volume dati
4. **Anni**: Copertura temporale
5. **Località**: Copertura geografica

### Styling Container

```tsx
<div className="bg-white border-b border-border">
  <div className="max-w-container mx-auto px-lg py-1.5">
    {/* Metriche */}
  </div>
</div>
```

- **Sfondo bianco**: Distingue da header (gradiente blu)
- **Border bottom**: Separatore visivo dal contenuto
- **Padding verticale minimo**: `py-1.5` per compattezza
- **Container max-width**: Consistente con layout globale

### Ottimizzazioni Possibili

- Tooltip con dettagli aggiuntivi (percentuale rispetto al totale)
- Click per attivare filtri correlati
- Animazioni condizionali (solo quando metriche cambiano, non al mount)
- Formatting numeri (separatori migliaia, abbreviazioni K/M)
- Export snapshot metriche
- Grafici sparkline per trend
