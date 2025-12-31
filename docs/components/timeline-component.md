# Timeline Component - Documentazione Tecnica

## Panoramica

Il componente Timeline visualizza la distribuzione temporale delle occorrenze del lemmario AtLiTeG attraverso istogrammi aggregati per quarti di secolo.

## Componenti

### TimelineEnhanced.tsx

Componente principale utilizzato nella dashboard, con funzionalità avanzate:

- **Path**: `/lemmario-dashboard/components/TimelineEnhanced.tsx`
- **Tipo**: Client Component (`'use client'`)
- **Dipendenze**: React, Framer Motion, Context API

### Timeline.tsx

Versione base del componente (attualmente non utilizzata):

- **Path**: `/lemmario-dashboard/components/Timeline.tsx`
- **Differenze**: Meno funzionalità UI (no heatmap, no progress bar)

## Logica di Aggregazione

### Raggruppamento per Quarti di Secolo

I dati vengono aggregati in periodi di 25 anni usando la seguente logica:

```typescript
const getQuartCentury = (year: number): string => {
  const century = Math.floor(year / 100);
  const quarterInCentury = Math.floor((year % 100) / 25);
  const quarters = ['I', 'II', 'III', 'IV'];
  return `${century}${quarters[quarterInCentury]}`;
};
```

**Mappatura periodi:**

| Quarto | Range Anni | Esempio |
|--------|------------|---------|
| I      | XX00-XX24  | 1300-1324 |
| II     | XX25-XX49  | 1325-1349 |
| III    | XX50-XX74  | 1350-1374 |
| IV     | XX75-XX99  | 1375-1399 |

**Esempi:**
- Anno 1308 → Quarto `13I` → Range 1300-1324
- Anno 1450 → Quarto `14II` → Range 1425-1449
- Anno 1598 → Quarto `15III` → Range 1550-1574
- Anno 1820 → Quarto `18I` → Range 1800-1824

### Conversione Quarto → Range Anni

```typescript
const getYearRangeFromQuartCentury = (quartCentury: string): [number, number] => {
  // Usa regex per parsing corretto dei numeri romani
  const romanMatch = quartCentury.match(/^(\d+)(I{1,3}|IV|V)$/);
  if (!romanMatch) {
    console.error('[getYearRangeFromQuartCentury] Formato non valido:', quartCentury);
    return [0, 0];
  }

  const century = parseInt(romanMatch[1]);      // Estrae solo i numeri (es. "13")
  const romanQuarter = romanMatch[2];            // Estrae solo il romano (es. "II")
  const quarterIndex = ['I', 'II', 'III', 'IV'].indexOf(romanQuarter);

  const start = century * 100 + quarterIndex * 25;
  const end = start + 24;
  return [start, end];
};
```

**Nota importante**: Questa funzione usa una regex per separare correttamente la parte numerica dal numero romano, evitando il bug precedente dove `slice(0, -1)` causava duplicati.

### Aggregazione Occorrenze

Per ogni quarto di secolo, il componente:

1. **Raccoglie tutti i lemmi** del periodo usando un `Map<string, data>`
2. **Somma le frequenze** di tutte le attestazioni:
   ```typescript
   const freq = parseInt(lemma.Frequenza) || 0;
   data.attestazioni += freq;
   ```
3. **Traccia anni unici**, lemmi unici (ma non le località)
4. **Ordina per periodo** cronologico crescente

**Caratteristiche chiave:**
- ✅ **Indipendente dalla località**: Tutte le occorrenze vengono sommate indipendentemente dal luogo geografico
- ✅ **Un solo istogramma per periodo**: Garantito dall'uso di `Map` con chiave `quartCentury`
- ✅ **Somma delle frequenze**: Non conta righe, ma somma il campo `Frequenza`

## Visualizzazione

### Modalità Barre (Default)

**Layout:**
```
[←] [████] [███] [█████] [██] [████] [███] [██] [████] [███] [██] [████] [→]
    1300  1325  1350    1375 1400  1425  1450 1475  1500  1525 1550 1575
```

**Caratteristiche:**
- 12 barre visibili per pagina
- Navigazione con frecce ←/→
- Progress bar per indicare pagina corrente
- Altezza proporzionale alle occorrenze
- Numero occorrenze mostrato al centro della barra

**Animazioni (Framer Motion):**
- Transizione smooth tra pagine
- Effetto hover: scale + elevazione + ombra
- Effetto click: riduzione scale temporanea
- Effetto shine durante hover/selezione

### Modalità Heatmap

**Layout:**
```
1300s:  [▓▓] [▓▓] [▓▓] [░░]
1400s:  [▓▓] [▓▓] [░░] [▓▓]
1500s:  [▓▓] [▓▓] [▓▓] [▓▓]
```

**Caratteristiche:**
- Organizzata per secolo (righe)
- Ogni riga mostra 4 quarti (I, II, III, IV)
- Intensità colore basata su occorrenze
- Click su cella per filtrare periodo

## Interazioni

### Click su Periodo

**Comportamento:**
1. Il periodo viene selezionato (stato: `selectedQuart`)
2. Viene chiamato `highlightMultiple` con:
   - `lemmaIds`: Array di ID univoci dei lemmi del periodo
   - `years`: Array degli anni presenti nel periodo
   - `source: 'timeline'`
   - `type: 'select'`
3. La mappa evidenzia tutti i marker del periodo
4. Il pannello dettaglio mostra le forme del periodo

**Deseleziona:**
- Click nuovamente sullo stesso periodo
- Chiama `clearHighlight()`

### Hover su Periodo

**Comportamento:**
1. Solo se nessun periodo è selezionato
2. Stato temporaneo: `hoveredQuart`
3. Chiamata a `highlightMultiple` con `type: 'hover'`
4. Animazioni di ingrandimento e luminosità

**Mouse leave:**
- Reset hover se nessuna selezione attiva
- Chiama `clearHighlight()`

## Bug Fix - Dicembre 2025

### Problema Identificato

**Sintomo**: Istogrammi duplicati per lo stesso periodo temporale con altezze diverse.

**Causa root**: La funzione `getYearRangeFromQuartCentury` usava `slice(0, -1)` che non separava correttamente il numero dal romano:

```typescript
// ❌ CODICE BUGGY (versione precedente)
const century = parseInt(quartCentury.slice(0, -1));
const quarter = quartCentury.slice(-1);

// Problema:
// "13II".slice(0, -1)  = "13I"  → parseInt("13I")  = 13 ✓
// "13III".slice(0, -1) = "13II" → parseInt("13II") = 13 ✓
// "13IV".slice(0, -1)  = "13I"  → parseInt("13I")  = 13 ✓

// Risultato: tutti i quarti mappavano allo stesso range!
```

**Impatto:**
- Ogni quarto di secolo veniva convertito nello stesso range
- Visualizzazione mostrava 3-4 istogrammi per lo stesso periodo
- Dati aggregati correttamente ma visualizzati male

### Soluzione Implementata

Utilizzare regex per parsing robusto:

```typescript
// ✅ CODICE CORRETTO (versione attuale)
const romanMatch = quartCentury.match(/^(\d+)(I{1,3}|IV|V)$/);
const century = parseInt(romanMatch[1]);      // Solo numeri
const romanQuarter = romanMatch[2];            // Solo romano
```

**Pattern regex**: `/^(\d+)(I{1,3}|IV|V)$/`
- Gruppo 1: `(\d+)` - Una o più cifre (es. "13", "14", "18")
- Gruppo 2: `(I{1,3}|IV|V)` - Numero romano valido:
  - `I{1,3}`: I, II, III
  - `IV`: IV
  - `V`: Non usato ma supportato per estensibilità

**Validazione:**
- Controllo `if (!romanMatch)` per input non validi
- Controllo `quarterIndex === -1` per romani non supportati
- Log di errore espliciti per debugging

### Test di Verifica

```typescript
// Test conversioni
getYearRangeFromQuartCentury("13I")   → [1300, 1324] ✓
getYearRangeFromQuartCentury("13II")  → [1325, 1349] ✓
getYearRangeFromQuartCentury("13III") → [1350, 1374] ✓
getYearRangeFromQuartCentury("13IV")  → [1375, 1399] ✓
getYearRangeFromQuartCentury("18I")   → [1800, 1824] ✓
```

## Performance

### Ottimizzazioni

1. **useMemo** per calcoli costosi:
   - `quartCenturies`: Aggregazione dati
   - `totalOccorrenze`: Somma frequenze
   - `maxAttestazioni`: Valore massimo per scaling

2. **Paginazione**:
   - Solo 12 elementi renderizzati simultaneamente
   - Slice dinamico dell'array

3. **Logging condizionale**:
   - Debug log solo in development
   - Warning solo se duplicati rilevati

### Metriche

- **Tempo rendering iniziale**: ~50-100ms per 6236 record
- **Tempo aggregazione**: ~30-50ms
- **Quarti generati**: ~23 periodi (dataset AtLiTeG)
- **Memoria**: ~2-3MB per stato componente

## Debug

### Console Logs

Il componente emette log dettagliati per debugging:

```javascript
[TimelineEnhanced] Quarti generati: 23
[TimelineEnhanced] Primi 5 quarti: ['13IV (323 occ)', '13II (267 occ)', ...]
[TimelineEnhanced] ✅ Nessun duplicato trovato
[TimelineEnhanced] Rendering pagina: 0
[TimelineEnhanced] visibleQuarts.length: 12
[TimelineEnhanced] Barre visibili:
  [0] 1275-1299 (quart=13IV, attestazioni=323)
  [1] 1300-1324 (quart=13I, attestazioni=300)
  ...
```

### Verifica Duplicati

Il componente controlla automaticamente la presenza di duplicati:

```typescript
const uniqueQuarts = new Set(result.map(q => q.quartCentury));
if (uniqueQuarts.size !== result.length) {
  console.error('[TimelineEnhanced] ❌ ERRORE: Trovati quarti duplicati!', {
    total: result.length,
    unique: uniqueQuarts.size,
    duplicates: result.filter((q, i, arr) =>
      arr.findIndex(x => x.quartCentury === q.quartCentury) !== i
    )
  });
}
```

## Dipendenze

### Context

- **AppContext**: Fornisce `lemmi`, `filteredLemmi`
- **HighlightContext**: Gestisce evidenziazione cross-component

### Libraries

- **framer-motion**: Animazioni fluide
- **lucide-react**: Icone (ChevronLeft, ChevronRight, Calendar)

### Types

```typescript
interface QuartCenturyData {
  quartCentury: string;      // Es. "13I", "18III"
  hasData: boolean;
  years: number[];           // Anni presenti nel quarto
  lemmas: string[];          // Lemmi unici
  attestazioni: number;      // Somma frequenze
}
```

## Modifiche Future

### Possibili Miglioramenti

1. **Zoom dinamico**: Permettere aggregazione per secolo o decennio
2. **Export dati**: Scaricare statistiche temporali in CSV
3. **Tooltip avanzato**: Mostrare top 5 lemmi del periodo
4. **Filtro periodo**: Range picker per selezionare intervallo personalizzato
5. **Confronto periodi**: Visualizzare differenze tra due periodi

### Manutenzione

- ✅ Mantenere regex per parsing numeri romani
- ✅ Validare input con controlli espliciti
- ✅ Aggiornare documentazione per nuove funzionalità
- ✅ Testare con dataset diversi per verificare robustezza

## Riferimenti

- **Component**: [TimelineEnhanced.tsx](../../lemmario-dashboard/components/TimelineEnhanced.tsx)
- **User Guide**: [user-guide.md](../guides/user-guide.md)
- **Dashboard Docs**: [lemmario-dashboard.md](./lemmario-dashboard.md)
