# Proposte di Miglioramento per il Popup della Mappa Geografica

## Contesto
Attualmente il popup della mappa geografica mostra tutti i lemmi associati a una località o area geografica in un'unica lista scrollabile. Quando sono presenti molti lemmi (es. più di 10-15), il popup diventa difficile da consultare e l'esperienza utente risulta compromessa.

**Struttura attuale:**
- Un popup con `max-height: 300px` e `overflow-y: auto`
- Per ogni lemma: titolo, categoria, lista di forme con anno e frequenza
- Tutto visualizzato contemporaneamente in scroll verticale

## Proposta 1: Popup con Tabs per Categoria

### Descrizione
Organizzare i lemmi in **tabs orizzontali** raggruppati per categoria gastronomica. Questo riduce il carico visivo mostrando solo una categoria alla volta.

### Vantaggi
- ✅ Riduce drasticamente il contenuto visibile contemporaneamente
- ✅ Permette di navigare rapidamente tra categorie correlate
- ✅ Mantiene il contesto categoriale del VoSLIG
- ✅ Facile da implementare con Tailwind CSS

### Implementazione
```tsx
// Struttura del popup
<div className="popup-tabs">
  {/* Tab Headers */}
  <div className="flex border-b overflow-x-auto">
    {categories.map(cat => (
      <button 
        className={`px-3 py-2 text-sm whitespace-nowrap ${
          activeTab === cat ? 'border-b-2 border-blue-500 font-semibold' : ''
        }`}
      >
        {cat} ({lemmiPerCategoria[cat]})
      </button>
    ))}
  </div>
  
  {/* Tab Content */}
  <div className="p-3 max-h-[250px] overflow-y-auto">
    {/* Lemmi della categoria attiva */}
  </div>
</div>
```

### Mockup visivo
```
┌─────────────────────────────────┐
│ Salse (12) │ Condimenti (8) │..│
├─────────────────────────────────┤
│                                 │
│ **agliata**                     │
│ Categoria: Salse                │
│ • alleata (1465) - freq: 3      │
│ • alleatam (1465)               │
│                                 │
│ **agresta_1**                   │
│ Categoria: Salse                │
│ • agresta (1465) - freq: 9      │
│                                 │
│         [scroll area]           │
└─────────────────────────────────┘
```

### Metriche
- **Spazio ottimizzato**: 60-80% (solo 1 categoria visibile)
- **Click richiesti**: 1 per cambiare categoria
- **Complessità implementativa**: Bassa

---

## Proposta 2: Popup Accordion Collapsible

### Descrizione
Trasformare ogni lemma in un **item accordion** inizialmente collassato, mostrando solo il nome. L'utente può espandere solo i lemmi di interesse.

### Vantaggi
- ✅ Vista compatta iniziale: solo elenco nomi
- ✅ Espansione on-demand riduce cognitive load
- ✅ Permette comparazione rapida tra lemmi
- ✅ Ottimo per località con 20+ lemmi

### Implementazione
```tsx
// Ogni lemma come accordion item
<div className="border-b last:border-0">
  <button 
    onClick={() => toggleLemma(lemmaId)}
    className="w-full flex justify-between items-center p-2 hover:bg-gray-50"
  >
    <span className="font-semibold">{lemmaName}</span>
    <span className="text-xs text-gray-500">{formeCount} forme</span>
    <ChevronIcon className={expanded ? 'rotate-180' : ''} />
  </button>
  
  {expanded && (
    <div className="pl-4 pr-2 pb-2 bg-gray-50">
      <p className="text-xs text-gray-600">Categoria: {categoria}</p>
      <ul className="text-sm space-y-1 mt-1">
        {forme.map(forma => (
          <li>• {forma.nome} ({forma.anno}) - freq: {forma.freq}</li>
        ))}
      </ul>
    </div>
  )}
</div>
```

### Mockup visivo
```
┌─────────────────────────────────┐
│ Località: Verona                │
│ 22 lemmi trovati                │
├─────────────────────────────────┤
│ ▶ agliata              3 forme  │
│ ▼ agresta              9 forme  │
│   Categoria: Condimenti vari    │
│   • agresta (1465) - freq: 9    │
│   • agrestam (1465) - freq: 3   │
│   • agreste (1465)              │
│ ▶ agresta_1            2 forme  │
│ ▶ anduglia             5 forme  │
│         [scroll area]           │
└─────────────────────────────────┘
```

### Metriche
- **Spazio ottimizzato**: 70-90% (stato collassato)
- **Click richiesti**: 1 per lemma da espandere
- **Complessità implementativa**: Media

---

## Proposta 3: Popup con Ricerca e Filtri Interni

### Descrizione
Aggiungere una **searchbar** e **filtri dropdown** all'interno del popup per consentire filtraggio real-time dei lemmi visualizzati.

### Vantaggi
- ✅ Utente trova rapidamente il lemma desiderato
- ✅ Combina filtraggio per categoria + ricerca testuale
- ✅ Riduce scroll necessario
- ✅ Pattern familiare agli utenti

### Implementazione
```tsx
<div className="popup-filterable">
  {/* Search e Filtri */}
  <div className="p-2 border-b bg-gray-50 sticky top-0 z-10">
    <input 
      type="text"
      placeholder="Cerca lemma..."
      className="w-full px-3 py-1.5 text-sm border rounded mb-2"
      value={searchTerm}
      onChange={e => setSearchTerm(e.target.value)}
    />
    <select 
      className="w-full px-3 py-1.5 text-sm border rounded"
      value={filterCategoria}
      onChange={e => setFilterCategoria(e.target.value)}
    >
      <option value="">Tutte le categorie ({totalLemmi})</option>
      {categories.map(cat => (
        <option value={cat}>{cat} ({countPerCat[cat]})</option>
      ))}
    </select>
  </div>
  
  {/* Lista Lemmi Filtrati */}
  <div className="p-2 max-h-[220px] overflow-y-auto">
    {filteredLemmi.length === 0 ? (
      <p className="text-sm text-gray-500 text-center py-4">
        Nessun lemma trovato
      </p>
    ) : (
      filteredLemmi.map(lemma => /* rendering lemma */)
    )}
  </div>
  
  {/* Footer con conteggio */}
  <div className="p-2 border-t bg-gray-50 text-xs text-gray-600">
    {filteredLemmi.length} di {totalLemmi} lemmi
  </div>
</div>
```

### Mockup visivo
```
┌─────────────────────────────────┐
│ [Cerca lemma...           ] 🔍 │
│ [Tutte le categorie (22)  ] ▼  │
├─────────────────────────────────┤
│                                 │
│ **agliata**                     │
│ Categoria: Salse                │
│ • alleata (1465) - freq: 3      │
│                                 │
│ **agresta**                     │
│ Categoria: Condimenti vari      │
│ • agresta (1465) - freq: 9      │
│                                 │
│         [scroll area]           │
├─────────────────────────────────┤
│ 2 di 22 lemmi                   │
└─────────────────────────────────┘
```

### Metriche
- **Spazio ottimizzato**: Variabile (dipende da filtro)
- **Click richiesti**: 0 (ricerca), 1 (filtro categoria)
- **Complessità implementativa**: Media-Alta

---

## Proposta 4: Popup Multi-Colonna con Virtualizzazione

### Descrizione
Visualizzare i lemmi in **due colonne affiancate** per sfruttare meglio lo spazio orizzontale, con **virtualizzazione** per renderizzare solo gli elementi visibili nello scroll.

### Vantaggi
- ✅ Raddoppia il contenuto visibile senza aumentare altezza
- ✅ Virtualizzazione migliora performance con 100+ lemmi
- ✅ Riduce scrolling necessario del 40-50%
- ✅ Layout più moderno e professionale

### Implementazione
```tsx
// Usando react-window per virtualizzazione (opzionale)
import { FixedSizeList } from 'react-window';

<div className="popup-multicolumn">
  <div className="grid grid-cols-2 gap-3 p-2 max-h-[300px] overflow-y-auto">
    {/* Colonna 1 */}
    <div className="space-y-3">
      {leftColumnLemmi.map(lemma => (
        <div className="text-sm">
          <h4 className="font-semibold">{lemma.nome}</h4>
          <p className="text-xs text-gray-600">{lemma.categoria}</p>
          <ul className="text-xs ml-2">
            {lemma.forme.map(f => <li>• {f.nome} ({f.anno})</li>)}
          </ul>
        </div>
      ))}
    </div>
    
    {/* Colonna 2 */}
    <div className="space-y-3">
      {rightColumnLemmi.map(lemma => /* stesso rendering */)}
    </div>
  </div>
</div>
```

### Mockup visivo
```
┌─────────────────────────────────────────────┐
│ **agliata**          │ **agresta_1**        │
│ Cat: Salse           │ Cat: Condimenti vari │
│ • alleata (1465) -3  │ • agresta (1465) -9  │
│ • alleatam (1465)    │ • agrestam (1465) -3 │
│                      │ • agreste (1465)     │
│ **agresta**          │ **anduglia**         │
│ Cat: Condimenti vari │ Cat: Carni lavorate  │
│ • agresta (1465) -9  │ • anduglia (1465) -5 │
│                      │                      │
│          [scroll verticale]                 │
└─────────────────────────────────────────────┘
```

### Metriche
- **Spazio ottimizzato**: 50% (doppia densità)
- **Click richiesti**: 0 (scroll semplificato)
- **Complessità implementativa**: Alta (se con virtualizzazione)

---

## Proposta 5: Popup Espandibile/Fullscreen Mode

### Descrizione
Aggiungere un pulsante **"Espandi"** nel popup che apre una **modal fullscreen** o drawer laterale con tutte le informazioni, mantenendo il popup compatto per default.

### Vantaggi
- ✅ Popup rimane leggero per consultazione rapida
- ✅ Fullscreen mode offre spazio illimitato per dettagli
- ✅ Può includere funzioni avanzate (ordinamento, export, condivisione)
- ✅ Migliore UX per analisi approfondita

### Implementazione
```tsx
// Popup compatto con pulsante espandi
<div className="popup-compact">
  <div className="flex justify-between items-center p-2 border-b">
    <h3 className="font-bold">Località: {nomeLocalita}</h3>
    <button 
      onClick={() => setFullscreenMode(true)}
      className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      Espandi ⤢
    </button>
  </div>
  
  {/* Vista compatta: primi 5 lemmi */}
  <div className="p-2 max-h-[200px] overflow-y-auto">
    {lemmi.slice(0, 5).map(lemma => /* rendering compatto */)}
  </div>
  
  {lemmi.length > 5 && (
    <div className="p-2 border-t text-center">
      <button 
        onClick={() => setFullscreenMode(true)}
        className="text-sm text-blue-600 hover:underline"
      >
        Mostra tutti i {lemmi.length} lemmi
      </button>
    </div>
  )}
</div>

// Modal fullscreen (condizionale)
{fullscreenMode && (
  <Modal onClose={() => setFullscreenMode(false)}>
    <div className="h-screen flex flex-col">
      {/* Header con chiudi, filtri, ordinamento */}
      <header className="p-4 border-b">
        <h2>{nomeLocalita} - {lemmi.length} lemmi</h2>
        {/* Filtri avanzati, ordinamento, searchbar */}
      </header>
      
      {/* Contenuto scrollabile senza limiti */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lemmi.map(lemma => /* rendering completo con tutti i dettagli */)}
        </div>
      </div>
    </div>
  </Modal>
)}
```

### Mockup visivo - Popup Compatto
```
┌─────────────────────────────────┐
│ Località: Verona     [Espandi ⤢]│
├─────────────────────────────────┤
│ **agliata**                     │
│ • alleata (1465) - freq: 3      │
│                                 │
│ **agresta**                     │
│ • agresta (1465) - freq: 9      │
│                                 │
│ **agresta_1**                   │
│ • agresta (1465) - freq: 9      │
│                                 │
│ (+ altri 2 lemmi)               │
├─────────────────────────────────┤
│   [Mostra tutti i 22 lemmi]     │
└─────────────────────────────────┘
```

### Mockup visivo - Modal Fullscreen
```
┌───────────────────────────────────────────────────────────┐
│ ✕  Verona - 22 lemmi                                      │
│    [Cerca...] [Categoria▼] [Ordina per▼] [Download CSV]  │
├───────────────────────────────────────────────────────────┤
│                                                           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐               │
│  │ agliata  │  │ agresta  │  │ anduglia │               │
│  │ Salse    │  │ Condim.  │  │ Carni    │               │
│  │ 3 forme  │  │ 9 forme  │  │ 5 forme  │               │
│  │ 1465     │  │ 1465     │  │ 1465     │               │
│  └──────────┘  └──────────┘  └──────────┘               │
│                                                           │
│  [altri lemmi in griglia...]                             │
│                                                           │
│                                                           │
└───────────────────────────────────────────────────────────┘
```

### Metriche
- **Spazio ottimizzato popup**: 80% (solo 5 lemmi)
- **Spazio modal**: Illimitato
- **Click richiesti**: 1 per aprire modal
- **Complessità implementativa**: Media-Alta

---

## Confronto e Raccomandazioni

### Tabella Comparativa

| Proposta | Spazio Ottimizzato | Facilità d'Uso | Complessità Tecnica | Performance | Scalabilità |
|----------|-------------------|----------------|---------------------|-------------|-------------|
| **1. Tabs per Categoria** | ⭐⭐⭐ (60-80%) | ⭐⭐⭐⭐ | ⭐⭐ (Bassa) | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ (fino a ~50 lemmi) |
| **2. Accordion** | ⭐⭐⭐⭐ (70-90%) | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ (Media) | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ (fino a ~100 lemmi) |
| **3. Ricerca+Filtri** | ⭐⭐⭐⭐⭐ (variabile) | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ (Media-Alta) | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ (100+ lemmi) |
| **4. Multi-Colonna** | ⭐⭐⭐⭐ (50%) | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ (Alta) | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ (con virtualizzazione) |
| **5. Fullscreen Mode** | ⭐⭐⭐⭐⭐ (popup compatto) | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ (Media-Alta) | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ (illimitata) |

### Raccomandazione Finale

**Approccio Ibrido Consigliato:** Combinare **Proposta 2 (Accordion)** + **Proposta 5 (Fullscreen Mode)**

#### Implementazione in 2 fasi:

**FASE 1 - Quick Win (1-2 ore di sviluppo):**
- Implementare accordion collapsible nel popup
- Mostrare solo nome lemma + conteggio forme (collassato)
- Espansione on-click per dettagli completi
- Limite popup a max 300px come attuale

**FASE 2 - Enhancement (3-4 ore di sviluppo):**
- Aggiungere pulsante "Espandi" nel header del popup
- Modal fullscreen con griglia multi-colonna
- Ricerca e filtri integrati nella modal
- Export CSV dei lemmi della località

#### Benefici dell'approccio ibrido:
✅ **UX ottimale**: popup compatto per scan rapido, modal per analisi profonda  
✅ **Scalabilità**: funziona con 5 lemmi come con 100+  
✅ **Accessibilità**: keyboard navigation, screen reader friendly  
✅ **Performance**: caricamento lazy della modal, accordion leggero  
✅ **Flessibilità**: utente sceglie livello di dettaglio necessario

---

## Considerazioni Tecniche

### Dipendenze Necessarie
- **Accordion**: Nessuna (Tailwind + React state)
- **Modal**: `@headlessui/react` (già in uso?) o custom
- **Virtualizzazione** (opzionale): `react-window` o `react-virtual`

### Accessibilità (WCAG 2.1)
- Accordion: `aria-expanded`, `role="button"`, keyboard navigation (Enter/Space)
- Modal: focus trap, ESC per chiudere, `aria-modal`, focus restoration
- Tabs: `role="tablist"`, `aria-selected`, arrow keys navigation

### Performance Considerations
- Accordion: nessun overhead (solo CSS conditional rendering)
- Modal: lazy loading con dynamic import `React.lazy()`
- Virtualizzazione: essenziale solo con 100+ lemmi simultanei

### Mobile Responsiveness
- Accordion: funziona nativamente su mobile (touch friendly)
- Modal: fullscreen su mobile, può includere bottom sheet pattern
- Tabs: overflow-x-auto con scroll touch su mobile

---

## Prossimi Passi

1. **Validazione con utenti**: Test A/B su dataset reali (località con 5, 20, 50+ lemmi)
2. **Prototipo interattivo**: Mockup Figma o CodePen per validation
3. **Implementazione incrementale**: 
   - Settimana 1: Accordion base
   - Settimana 2: Modal fullscreen
   - Settimana 3: Ricerca/filtri nella modal
4. **Metriche di successo**:
   - Tempo medio per trovare lemma target < 10 secondi
   - Riduzione scroll > 60%
   - Feedback utenti positivo > 80%

---

## Appendice: Esempi di Codice Completo

### Esempio Accordion Completo

```tsx
'use client';

import { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface AccordionPopupProps {
  lemmaGroups: Map<string, any[]>;
}

export function AccordionPopup({ lemmaGroups }: AccordionPopupProps) {
  const [expandedLemmi, setExpandedLemmi] = useState<Set<string>>(new Set());

  const toggleLemma = (lemmaName: string) => {
    setExpandedLemmi(prev => {
      const next = new Set(prev);
      if (next.has(lemmaName)) {
        next.delete(lemmaName);
      } else {
        next.add(lemmaName);
      }
      return next;
    });
  };

  return (
    <div className="max-h-[300px] overflow-y-auto">
      {Array.from(lemmaGroups.entries()).map(([lemmaName, lemmi]) => {
        const isExpanded = expandedLemmi.has(lemmaName);
        const categoria = lemmi[0]?.Categoria || '';
        
        return (
          <div key={lemmaName} className="border-b last:border-0">
            <button
              onClick={() => toggleLemma(lemmaName)}
              className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
              aria-expanded={isExpanded}
            >
              <div className="flex-1 text-left">
                <h3 className="font-semibold text-sm">{lemmaName}</h3>
                <p className="text-xs text-gray-500">{categoria}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 px-2 py-0.5 bg-gray-100 rounded">
                  {lemmi.length} {lemmi.length === 1 ? 'forma' : 'forme'}
                </span>
                <ChevronDownIcon 
                  className={`w-4 h-4 text-gray-400 transition-transform ${
                    isExpanded ? 'rotate-180' : ''
                  }`}
                />
              </div>
            </button>

            {isExpanded && (
              <div className="px-4 pb-3 bg-gray-50 border-t">
                <ul className="space-y-1 text-sm">
                  {lemmi.map((lemma: any, idx: number) => (
                    <li key={idx} className="flex items-baseline gap-2">
                      <span className="text-gray-400">•</span>
                      <em>{lemma.Forma}</em>
                      <span className="text-gray-600 text-xs">
                        ({lemma.Anno || lemma.Periodo || 'n.d.'})
                      </span>
                      {lemma.Frequenza && lemma.Frequenza !== '1' && (
                        <span className="text-xs text-blue-600">
                          freq: {lemma.Frequenza}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
```

---

**Documento creato:** 23 dicembre 2025  
**Versione:** 1.0  
**Autore:** GitHub Copilot  
**Progetto:** atliteg-map - Lemmario Dashboard
