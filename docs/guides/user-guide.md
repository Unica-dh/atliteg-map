# Guida Utente - Dashboard Lemmario AtLiTeG

## Introduzione

La Dashboard Lemmario AtLiTeG è uno strumento interattivo per esplorare il corpus lessicale dell'italiano gastronomico storico. Permette di visualizzare, filtrare e analizzare lemmi attestati nel tempo e nello spazio geografico.

## Accesso all'Applicazione

### Ambiente di Produzione

L'applicazione è accessibile tramite il proxy configurato sulla porta 9000:

```
http://localhost:9000
```

### Primo Avvio

All'apertura, l'applicazione:

1. Carica automaticamente il dataset completo (CSV + GeoJSON)
2. Mostra la mappa geografica senza marker (visualizza solo le aree geografiche)
3. Mostra tutte le metriche globali del dataset
4. Presenta la timeline con tutti gli anni disponibili

## Interfaccia Utente

### Layout Principale

```
┌────────────────────────────────────────────────────┐
│                    Header                          │
│            AtLiTeG - Lemmario                      │
├────────────────────────────────────────────────────┤
│                                                    │
│  [Filtri] [Ricerca]                    [Metriche] │
│                                                    │
├────────────────────────────────────────────────────┤
│                                                    │
│              Mappa Geografica                      │
│          (Leaflet + OpenStreetMap)                 │
│                                                    │
├────────────────────────────────────────────────────┤
│              Timeline (Anni)                       │
├────────────────────────────────────────────────────┤
│   Indice Alfabetico   │   Dettaglio Lemma          │
│   (A-Z)              │   (Pannello laterale)      │
└────────────────────────────────────────────────────┘
```

## Componenti Interattivi

### 1. Filtri Globali

#### Filtro Categoria

- **Posizione**: In alto a sinistra
- **Tipo**: Multi-selezione
- **Funzionamento**:
  1. Click sul pulsante "Categoria"
  2. Si apre popover con lista categorie disponibili
  3. Seleziona una o più categorie con checkbox
  4. I filtri attivi vengono mostrati come badge
  5. Click sul badge rimuove il singolo filtro
  6. Pulsante "Resetta" rimuove tutti i filtri

**Esempio**: Selezionando "Dolci" + "Bevande" verranno mostrati solo i lemmi appartenenti a queste categorie.

#### Filtro Periodo

- **Posizione**: Accanto al filtro categoria
- **Tipo**: Multi-selezione
- **Funzionamento**: Identico al filtro categoria
- **Periodi disponibili**: Estratti dinamicamente dal dataset (es. "1300-1399", "1400-1499", etc.)

#### Reset Filtri

- **Posizione**: Pulsante "Resetta filtri" dopo i filtri attivi
- **Funzionamento**: Rimuove tutti i filtri applicati e riporta la dashboard allo stato iniziale

### 2. Barra di Ricerca

- **Posizione**: Centro superiore
- **Tipo**: Ricerca autocompletante con debouncing (300ms)
- **Funzionamento**:
  1. Digita almeno 2 caratteri
  2. Compare lista suggerimenti con:
     - Lemma (forma base)
     - Forma (variante attestata)
     - Località
     - Anno
  3. Usa frecce ↑/↓ per navigare suggerimenti
  4. Premi Enter o click per selezionare
  5. Il lemma selezionato viene evidenziato su mappa e timeline

**Esempio**: Digitando "vino" compaiono tutte le forme contenenti "vino" (vino, vini, vinello, etc.)

### 3. Metriche Riepilogative

- **Posizione**: In alto a destra
- **Contenuto**:
  - **Località**: Numero località uniche (con icona MapPin)
  - **Lemmi**: Numero lemmi unici (con icona BookOpen)
  - **Anni**: Numero anni con attestazioni (con icona Calendar)
  - **Attestazioni**: Totale attestazioni nel dataset (con icona FileText)

**Aggiornamento**: Le metriche si aggiornano in tempo reale quando applichi filtri.

### 4. Mappa Geografica

#### Visualizzazione Iniziale

- Mostra solo le aree geografiche (poligoni) caricate dal GeoJSON
- Nessun marker visibile (comportamento conforme a CON-001)
- Zoom automatico per inquadrare tutte le aree

#### Interazioni

**Applicazione Filtri**:
1. Applica uno o più filtri (categoria, periodo, ricerca, etc.)
2. La mappa mostra marker per le località dei lemmi filtrati
3. I marker sono raggruppati con clustering per performance

**Click su Marker**:
1. Si apre popup con:
   - Nome località
   - Numero lemmi trovati
   - Lista primi 5 lemmi
   - Link "Mostra tutti" (se > 5)
2. Click su lemma nel popup → seleziona lemma e apre pannello dettaglio

**Click su Poligono Area**:
1. Si apre popup con:
   - Nome area geografica (IdAmbito)
   - Numero località nell'area
   - Numero lemmi totali

**Navigazione Mappa**:
- Drag per spostare
- Scroll/pinch per zoom
- Pulsanti +/- per zoom discreto
- Pulsante Home per reset zoom iniziale

### 5. Timeline Storica

#### Visualizzazione

- **Asse orizzontale**: Anni dal dataset (es. 1300-1900)
- **Marker**: Pallini per ogni anno con attestazioni
  - Verde: Anno con attestazioni
  - Grigio chiaro: Anno senza attestazioni
- **Scroll**: Frecce sinistra/destra o drag per scorrere

#### Interazioni

**Click su Anno**:
1. L'anno viene evidenziato (pallino più grande, bordo dorato)
2. La dashboard filtra tutti i lemmi per quell'anno
3. La mappa aggiorna i marker
4. L'indice alfabetico mostra solo lemmi di quell'anno
5. Le metriche si aggiornano

**Hover su Anno**:
- Tooltip mostra:
  - Anno
  - Numero attestazioni
  - Primi 3 lemmi

**Deseleziona Anno**:
- Click nuovamente sull'anno selezionato
- Click su pulsante "Reset" nella timeline

### 6. Indice Alfabetico

#### Visualizzazione

- **Layout**: Lettere A-Z disposte orizzontalmente
- **Badge**: Numero lemmi per lettera
- **Stato lettere**:
  - Normale: Lettera con lemmi disponibili
  - Evidenziata: Lettera selezionata
  - Disabilitata: Lettera senza lemmi (grigia)

#### Interazioni

**Click su Lettera**:
1. La lettera viene evidenziata
2. Sotto compare lista lemmi che iniziano con quella lettera
3. Lemmi raggruppati per forma base
4. Ogni gruppo mostra tutte le forme attestate

**Click su Lemma nella Lista**:
1. Il lemma viene selezionato
2. Si apre il pannello dettaglio
3. La mappa centra il marker della località
4. La timeline evidenzia l'anno

**Scroll Lista**:
- La lista è virtualizzata per performance
- Scroll verticale per navigare lemmi

### 7. Pannello Dettaglio Lemma

#### Quando si Apre

- Click su lemma in qualsiasi componente (mappa, timeline, indice, ricerca)
- Il pannello laterale si apre con animazione

#### Contenuto

**Intestazione**:
- Forma base (Lemma) in grassetto grande
- Pulsante chiusura (X) in alto a destra

**Informazioni Principali**:
- **Forma attestata**: Variante specifica
- **Località**: Dove è attestato
- **Anno**: Anno attestazione
- **Periodo**: Fascia temporale
- **Frequenza**: Numero attestazioni

**Categorie**:
- Badge colorati per ogni categoria
- Categorie multiple visualizzate tutte

**Tutte le Attestazioni**:
- Sezione scrollabile
- Lista completa attestazioni del lemma
- Ordinate cronologicamente
- Ogni attestazione mostra: forma, località, anno

**Link Esterno**:
- Pulsante "Visualizza risorsa" (se disponibile)
- Apre link in nuova tab
- Icona external link

**Stato Vuoto**:
- Quando nessun lemma è selezionato:
  - Icona libro
  - Testo "Nessun lemma selezionato"
  - Invito a cliccare su un lemma

## Flussi di Lavoro Tipici

### Scenario 1: Esplorazione Geografica

1. **Obiettivo**: Scoprire lemmi gastronomici di una specifica area geografica
2. **Passi**:
   - Apri l'applicazione (mappa mostra solo aree)
   - Applica filtro categoria (es. "Dolci")
   - La mappa mostra marker nelle località con dolci
   - Click su marker di interesse
   - Popup mostra lemmi trovati
   - Click su lemma per vedere dettagli completi
3. **Risultato**: Hai scoperto i dolci attestati in quella località

### Scenario 2: Ricerca Temporale

1. **Obiettivo**: Esplorare lemmi di un periodo storico specifico
2. **Passi**:
   - Scorri la timeline
   - Click su anno di interesse (es. 1550)
   - Dashboard filtra per quell'anno
   - Mappa mostra marker località con attestazioni 1550
   - Indice mostra solo lemmi del 1550
   - Esplora risultati
3. **Risultato**: Hai scoperto il lessico gastronomico del 1550

### Scenario 3: Ricerca Specifica

1. **Obiettivo**: Trovare informazioni su un lemma specifico
2. **Passi**:
   - Digita nome lemma nella barra ricerca (es. "pane")
   - Compaiono suggerimenti
   - Seleziona lemma desiderato
   - Pannello dettaglio si apre automaticamente
   - Visualizza tutte le attestazioni
   - Mappa centra sulla località
4. **Risultato**: Hai trovato tutte le info sul lemma cercato

### Scenario 4: Analisi Combinata

1. **Obiettivo**: Analizzare dolci del Cinquecento in Toscana
2. **Passi**:
   - Applica filtro categoria "Dolci"
   - Applica filtro periodo "1500-1599"
   - Sulla mappa, zoom su Toscana
   - Click marker località toscane
   - Esplora lemmi nei popup
   - Usa indice alfabetico per navigare sistematicamente
   - Confronta attestazioni nel pannello dettaglio
3. **Risultato**: Hai mappato i dolci cinquecenteschi toscani

### Scenario 5: Reset e Nuova Esplorazione

1. **Obiettivo**: Ricominciare esplorazione da zero
2. **Passi**:
   - Click pulsante "Resetta filtri"
   - Oppure rimuovi manualmente badge filtri attivi
   - Click anno selezionato nella timeline per deselezionarlo
   - Dashboard torna allo stato iniziale
   - Metriche mostrano totali globali
   - Mappa mostra solo aree (nessun marker)
3. **Risultato**: Pronto per nuova esplorazione

## Accessibilità

### Navigazione da Tastiera

**Tab/Shift+Tab**: Naviga tra elementi interattivi
**Enter/Space**: Attiva pulsanti e seleziona opzioni
**Escape**: Chiude dialog/popover aperti
**Frecce ↑/↓**: Naviga suggerimenti ricerca
**Frecce ←/→**: Scorre timeline

### Screen Reader

Tutti i componenti hanno ARIA labels descrittivi:
- Pulsanti: `aria-label` espliciti
- Liste: `role="list"` e `role="listitem"`
- Regioni: `role="region"` con `aria-labelledby`
- Stato selezione: `aria-selected`
- Conteggi: `aria-label` con numeri

### Contrasto Colori

- Testo su sfondo: 4.5:1 (WCAG AA)
- Componenti UI: 3:1 (WCAG AA)
- Focus visibile: Outline dorato 2px

## Prestazioni

### Ottimizzazioni Implementate

**Debouncing Ricerca**: Attesa 300ms prima di filtrare
**Marker Clustering**: Raggruppamento automatico marker vicini
**Virtualizzazione**: Liste alfabeto con react-window
**Memoizzazione**: Calcoli pesanti cachati (filtri, metriche)
**Code Splitting**: Componenti pesanti caricati on-demand

### Consigli per Prestazioni Ottimali

1. **Usa filtri specifici**: Filtrare riduce il numero di marker sulla mappa
2. **Evita filtri troppo ampi**: Migliaia di marker rallentano il rendering
3. **Usa clustering**: Zoom out raggruppa automaticamente marker
4. **Chiudi pannelli non usati**: Riduce memoria in uso

## Risoluzione Problemi

### Mappa Non Carica

**Problema**: Mappa mostra area grigia
**Soluzione**:
1. Verifica connessione Internet (usa tile OpenStreetMap)
2. Controlla console browser per errori
3. Ricarica pagina (Ctrl+R o Cmd+R)

### Ricerca Non Funziona

**Problema**: Suggerimenti non compaiono
**Soluzione**:
1. Verifica di aver digitato almeno 2 caratteri
2. Attendi 300ms (debounce delay)
3. Verifica che ci siano risultati corrispondenti

### Filtri Non Applicano

**Problema**: Filtri selezionati ma dashboard non cambia
**Soluzione**:
1. Verifica che badge filtri siano visibili
2. Controlla che dataset abbia risultati per quei filtri
3. Resetta filtri e riapplica

### Marker Non Visibili

**Problema**: Mappa senza marker dopo filtro
**Soluzione**:
1. **Comportamento normale se nessun filtro applicato** (CON-001)
2. Applica almeno un filtro (categoria, periodo, ricerca, anno, lettera)
3. Verifica che ci siano risultati con quelle condizioni
4. Zoom out per vedere se marker sono fuori viewport

### Performance Lente

**Problema**: Applicazione risponde lentamente
**Soluzione**:
1. Applica filtri più specifici
2. Riduci numero marker visibili (zoom in)
3. Chiudi pannelli aperti
4. Ricarica pagina per liberare memoria
5. Usa browser moderno (Chrome, Firefox, Edge)

## Requisiti di Sistema

### Browser Supportati

- Chrome/Edge: v90+
- Firefox: v88+
- Safari: v14+
- Opera: v76+

### Requisiti Minimi

- Risoluzione: 1280x720 (consigliata 1920x1080)
- RAM: 4GB
- Connessione: Banda larga per tile mappa

### Requisiti Consigliati

- Risoluzione: 1920x1080 o superiore
- RAM: 8GB
- Connessione: Fibra
- GPU: Accelerazione hardware abilitata

## Limitazioni Note

1. **Marker iniziali**: Nessun marker visibile senza filtri (design choice)
2. **Dataset statico**: Dati caricati una volta all'avvio (no real-time updates)
3. **Offline**: Richiede connessione per tile mappa
4. **Export**: Non è possibile esportare dati filtrati (feature futura)
5. **Condivisione**: URL non preserva stato filtri (feature futura)

## Supporto e Feedback

Per segnalazioni bug, richieste funzionalità o domande:

- **Repository**: [GitHub AtLiTeG](https://github.com/your-org/atliteg-map)
- **Issues**: [GitHub Issues](https://github.com/your-org/atliteg-map/issues)
- **Email**: support@atliteg.example.com

## Changelog

### v1.0.0 (Corrente)

- ✅ Visualizzazione mappa geografica interattiva
- ✅ Timeline storica navigabile
- ✅ Indice alfabetico
- ✅ Filtri multi-selezione (categoria, periodo)
- ✅ Ricerca autocompletante
- ✅ Pannello dettaglio lemma
- ✅ Metriche riepilogative
- ✅ Accessibilità WCAG 2.1 AA
- ✅ Docker deployment

### Future Releases

- 🔄 Export dati filtrati (CSV/JSON)
- 🔄 Condivisione URL con stato filtri
- 🔄 Grafici e statistiche avanzate
- 🔄 Confronto periodi/località
- 🔄 Dark mode
- 🔄 PWA (offline support)

## Glossario

**Lemma**: Forma base normalizzata di una parola (es. "vino")
**Forma**: Variante attestata del lemma (es. "vini", "vinello")
**Attestazione**: Occorrenza documentata di una forma in un testo
**Località**: Luogo geografico dove è attestata una forma
**Periodo**: Fascia temporale di attestazione (es. "1300-1399")
**Categoria**: Classificazione semantica del lemma (es. "Bevande", "Dolci")
**IdAmbito**: Identificatore area geografica GeoJSON
**Clustering**: Raggruppamento marker vicini per performance
**Debouncing**: Ritardo nella ricerca per ridurre chiamate
