Requisiti per l'Applicazione Web di Navigazione del Lemmario

1. Scopo del Documento

Questo documento definisce i requisiti funzionali per un'applicazione web (dashboard) interattiva. Lo scopo dell'applicazione è consentire la navigazione, l'analisi e la visualizzazione dei dati contenuti nel corpus documentale Lemmi_forme_atliteg.csv.

I requisiti qui elencati sono stati definiti attraverso una sessione di prototipazione iterativa.

2. Fonte Dati Principale

L'applicazione deve connettersi ed elaborare il file Lemmi_forme_atliteg_updated.csv presente nella cartella "data". I campi chiave del dataset che devono essere utilizzati per le funzionalità dell'interfaccia utente includono, ma non sono limitati a:

IdLemma (Identificativo univoco del lemma)

Lemma (La forma base normalizzata)

Forma (La variante attestata)

Coll.Geografica (La località dell'attestazione. La maggior parte delle attestazioni è puntuale ma alcune sono riferite ad aree geografiche definite da poligoni. I poligono sono nel geojson in data/Ambiti geolinguistici newline.json definiti da un ID, l'ID di riferiment, quando l'attenzione non è puntiforme, è specificato nel campo IdAmbito)

Anno (L'anno specifico dell'attestazione)

Periodo (La fascia temporale, es. "I quarto del XIV secolo")

Categoria (La classificazione semantica a valoe multiplo, es. "Salse". Ogni categoria è separata da virgola)

Frequenza (numero intero)

URL (rimanda ad una risorsa esterna) 

IdAmbito (indica quale area geografica associare a ciascuna forma/lemma)



## 3. Requisiti Funzionali e Componenti

L'applicazione deve essere strutturata come una dashboard interattiva, moderna e responsiva, composta dai seguenti componenti principali (come da mockup presente in /Lemmario_figma dove è presente una versione mockup realizzata con figma make ed estratta in forma di codice. Tale codice può essere preso come esempio. Un ulteriore screenshot è presente in /lemmario_figma/screenshot.png

### 3.1 Header e Branding

- Visualizzazione del logo e del titolo del progetto in alto.
- Sottotitolo descrittivo e riferimenti ai partner scientifici.

### 3.2 Barra dei Filtri Globali

- **Filtro per Categoria**: menu a tendina (select) con selezione singola o multipla, popolato dinamicamente sulla base delle caterogie presenti nella colonna "categoria"
- **Filtro per Periodo**: menu a tendina (select) con selezione singola o multipla, popolato dinamicamente dalla colonna "periodo"
- **Pulsante "Reset Filters"** per azzerare tutti i filtri attivi.
- I filtri devono essere sempre visibili e accessibili.

### 3.3 Mappa Geografica Interattiva

- Implementazione con Leaflet e tile OpenStreetMap.
- Vista iniziale centrata sull'Italia (42.5, 12.5), zoom adeguato a mostrare l'intera penisola.
- Inizialmente, al primo caricamento non deve mostrare alcun marker
- Marker blu personalizzati per ogni località (Coll.Geografica) presente nei dati filtrati o area geografica se l'occorrenza non è puntiforme ma è un'area sulla base dei dati presenti nel geojson
- Al click su un marker, apertura di un popup con:
	- **Lemma**
	- **Forma**
	- **Anno**
- La mappa mostra solo i marker relativi ai dati filtrati (sincronizzazione completa con filtri e ricerca) e si aggiorna dinamicamente se viene cliccato un valore nella timeline o nel blocco Indice alfabetico
- In alto a destra della mappa, visualizzazione del conteggio di località e lemmi attivi (es. "12 locations • 15 lemmas").

### 3.4 Barra di Ricerca (Autocompletamento)

- Ricerca principale autocompletante deve permettere di cercare sia sul lemma che sulla forma.
- Suggerimenti mostrano: Lemma principale, elenco delle forme associate, località e anni.
- Selezionando un lemma, la dashboard si filtra per tutte le attestazioni (forme e località) di quel lemma.
- La barra di ricerca è posizionata sopra la mappa.

### 3.5 Timeline Storica Interattiva

- Visualizzazione orizzontale degli anni coperti dal dataset (es. 1300-1450).
- Evidenziazione degli anni con attestazioni (punti blu pieni), anni senza attestazioni (punti vuoti), anno selezionato (blu intenso).
- Navigazione tramite frecce laterali per scorrere la timeline.
- Al click su un anno, la dashboard si filtra per quell'anno (sincronizzazione con mappa, tabella, filtri, indice).
- Sotto ogni punto della timeline, elenco sintetico dei lemmi e località attestati in quell'anno.
- In alto a destra, conteggio anni con lemmi e totale anni (es. "15 anni con lemmi • 15 totali").

### 3.6 Indice alfabetico

- Tabella completa che mostra nella forma di un indice i lemmi ordinati in ordine alfabetico come da mockup.
- Le lettere dell'alfabeto che contengono parole sono cliccabili
- Al clic sulla lettera si aggiornano la mappa e la timeline mostrando solo le occorrenze corrispondenti. Nella parte sotto all'indicie vengono mostrate tutte le occorrenze che iniziano con quella lettera
- L'indice si aggiorna in tempo reale in base a filtri, ricerca, selezione sulla mappa, timeline.

### 3.7 Pannello Dettaglio Lemma

- Area dedicata (a destra della mappa) che mostra i dettagli del lemma selezionato (da mappa, ricerca o tabella).
- Se nessun lemma è selezionato, visualizzazione di uno stato "vuoto" con icona e messaggio (es. "Seleziona un punto sulla mappa per visualizzare i dettagli del lemma").
- Se uno o più lemmi sono visualizzati come risultato dei filtri o ricerca vengono elencate le occorrenze corrispondenti in ordine alfabetico 

### 3.8 Micro-interazioni e Accessibilità

- Tutti i componenti devono essere accessibili da tastiera (tabindex, aria-label, focus visibile).
- Tooltip e messaggi di stato per azioni chiave (es. reset filtri, selezione lemma, caricamento dati).
- Feedback visivo per loading e stati vuoti.

### 3.9 Metriche di Riepilogo

- Visualizzazione sintetica del numero di località, lemmi, anni e attestazioni attive in base ai filtri.
- Queste metriche devono essere sempre visibili sopra la mappa e la timeline.

## 4. Requisiti di Interazione, Sincronizzazione e UX

- Sincronizzazione completa tra tutti i componenti (Mappa, Filtri, Ricerca, Timeline, Tabella, Dettaglio Lemma).
- Ogni azione di filtro, ricerca, selezione sulla mappa o timeline aggiorna in tempo reale tutti i componenti.
- La selezione di un lemma filtra la dashboard su tutte le sue attestazioni (forme, località, anni).
- La selezione di un anno sulla timeline filtra la dashboard su tutte le attestazioni di quell'anno.
- Evidenziazione visiva dei filtri attivi e possibilità di reset immediato.
- Stato "vuoto" chiaro e informativo quando nessun dato corrisponde ai filtri.

## 5. Requisiti di UI, Responsività e Accessibilità

- L'interfaccia deve essere responsiva e ottimizzata per desktop e tablet.
- Utilizzo di spaziature, tipografia e colori coerenti con il mockup.
- Tutti i componenti devono essere accessibili (WCAG 2.1 AA): navigazione da tastiera, contrasto sufficiente, etichette aria, focus visibile.
- Deve essere graficamente identica al mockup presente in /Lemmario_figma

## 6. Requisiti Tecnici e di Performance

- L'applicativo deve essere gestito e avviato con un comando docker compose e poiché in ambiente di produzione deve essere posizionato dietro ad un proxypass, il server web deve essere su porta 9000 così da facilitare il mapping
- Caricamento dati asincrono e feedback di loading.
- Ottimizzazione per dataset di grandi dimensioni (virtualizzazione, lazy loading, debounce su ricerca).
- Modularità del codice e separazione dei componenti.

## 7. Requisiti di Test e Documentazione

- Test end-to-end delle principali interazioni (filtri, ricerca, mappa, timeline, tabella).
- Documentazione aggiornata su struttura dati, componenti e flussi di interazione.