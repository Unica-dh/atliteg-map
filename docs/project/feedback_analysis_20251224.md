# Documento di Requisiti e Segnalazioni - Atliteg Map
**Data:** 24 Dicembre 2025
**Fonte:** Feedback Cliente via Email

## 1. Bug Critici (Priorità Alta)

Questi problemi impediscono il corretto utilizzo dell'applicazione o mostrano dati palesemente errati.

### 1.1. Visualizzazione Dati Regionali
*   **Problema:** I dati relativi alle regioni amministrative (Lazio, Lombardia, Sicilia, Toscana, ecc.) non vengono proiettati sulla carta. Attualmente sembra funzionare solo il Veneto (con errori).
*   **Problema Correlato:** I confini del Friuli sono errati e la selezione del Friuli evidenzia anche il Veneto. C'è sovrapposizione tra i layer.
*   **Causa Ipotizzata dal Cliente:** Si stanno usando layer geolinguistici invece dei confini amministrativi regionali.
*   **Azione Richiesta:** Assicurarsi che il sistema utilizzi i confini amministrativi corretti per queste visualizzazioni.

### 1.2. Filtro per Regione (Click su Mappa)
*   **Problema:** Cliccando su una regione evidenziata, il sistema mostra *tutte* le forme attestate in quella regione, ignorando il filtro del lemma attualmente selezionato.
*   **Comportamento Atteso:** Il click sulla regione deve mostrare solo le forme della regione che appartengono al lemma/ricerca corrente.

### 1.3. Linea del Tempo (Timeline)
*   **Problema Proiezione:** Date errate (es. *julienne* 1791-1899 viene mostrato come 1675-1824).
*   **Problema Duplicazione:** Le barre dei primi quarti di secolo vengono spesso ripetute graficamente.
*   **Problema Conteggio:** Se non si seleziona nulla, la timeline conta 362 lemmi invece di 365 (possibile perdita di dati nel trasferimento alla timeline).

### 1.4. Flusso di Ricerca e Reset
*   **Problema:** La sequenza "Ricerca da Indice -> Consultazione -> Nuova ricerca testuale" porta a zero risultati (pagina bianca/vuota).
*   **Diagnosi:** I filtri applicati dall'indice alfabetico non vengono resettati correttamente quando si inizia una nuova ricerca testuale.

### 1.5. Popup Mappa
*   **Problema:** La frequenza non viene visualizzata se il valore è pari a 1.

---

## 2. Logica dei Dati (Core Business Logic)

È necessaria una revisione profonda di come vengono calcolati e mostrati i numeri. Attualmente il sistema conta le righe del CSV, ma il cliente richiede una logica semantica.

### 2.1. Definizione di "Forme" vs "Occorrenze"
*   **Attuale:** Conteggio righe CSV.
*   **Richiesto:**
    *   **Numero Forme:** Conteggio delle varianti stringa *uniche* associate al lemma (es. "agliata", "alliata", "alleata" = 3 forme).
    *   **Numero Occorrenze (Frequenza):** Somma dei valori di frequenza (o conteggio delle attestazioni reali, non delle righe se raggruppate).
    *   **Applicazione:** Questa logica va applicata ovunque: Fascia Informazioni, Dettaglio Forme, Badge numerici, Cluster sulla mappa.

### 2.2. Visualizzazione Date ("Anno" vs "Datazione")
*   **Regola:** Non mostrare mai all'utente il campo `anno` (usato per ordinamento/logica interna).
*   **Azione:** Mostrare sempre e solo il campo `datazione` (stringa descrittiva/scientifica).
*   **Dove:** Popup mappa, Dettaglio forme.

---

## 3. Interfaccia Utente (UI) e User Experience (UX)

### 3.1. Barra di Ricerca e Indice (Header/Sidebar)
*   **Semplificazione Ricerca:**
    *   Rimuovere indicazioni di luogo dai risultati dell'autocomplete.
    *   Mostrare ogni forma una sola volta (deduplicazione).
    *   *Opzionale:* Valutare di mostrare solo il lemma di riferimento.
    *   *Obiettivo:* Evitare confusione (es. "alliata napoli" vs "alliata ferrara" suggerisce mappe diverse, il che è falso).
*   **Indice Alfabetico:**
    *   Rimuovere le località dalla lista (dato parziale e inutile in questo contesto).
    *   **Feedback Selezione:** Quando si seleziona un lemma dall'indice, questo deve apparire come "chip" o filtro attivo nella fascia dei filtri (come promemoria e per permettere il reset).
*   **Layout:** Allineare verticalmente il testo cercato e la "X" di reset.

### 3.2. Mappa (GeographicalMap)
*   **Cluster e Marker:**
    *   **Sempre Cluster:** Mantenere la visualizzazione a "cerchio con numero" anche a zoom ravvicinato (evitare che si aprano in pin singoli se non strettamente necessario, o usare uno stile uniforme).
    *   **Numero nel Cerchio:** Deve indicare la **Frequenza** (somma delle occorrenze), non il numero di località né il numero di forme.
*   **Popup:**
    *   Rimuovere "Categoria alimentare".
    *   Usare "Datazione" al posto di "Anno".
*   **Pulizia:** Eliminare tooltip/targhette "locations" e "lemma" (ridondanti).

### 3.3. Dettaglio Forme (Sidebar Destra)
*   **Layout:**
    *   Altezza: Deve essere uguale all'altezza della mappa.
    *   Larghezza Testo: Allargare la gabbia del testo (ridurre margini laterali) per sfruttare tutto lo spazio.
    *   Header: Spostare il titolo "Dettaglio forme" più in alto per guadagnare spazio.
*   **Gerarchia:** Invertire l'ordine visivo: Prima le **Forme**, poi il **Lemma**.
*   **Dati:** Il badge numerico deve mostrare la frequenza (occorrenze), non il numero di forme.

### 3.4. Linea del Tempo (Timeline Component)
*   **Layout:** Aumentare spaziatura tra istogramma ed etichetta "Linea del tempo".
*   **Etichette Barre:**
    *   Rimuovere codici secolo (es. "13I").
    *   Lasciare solo arco temporale (es. "1300-1324") in **grassetto**.
*   **Heatmap:** Sostituire il numero del quarto con l'arco temporale esplicito.
*   **Leggibilità:** Rendere più visibile il numero di occorrenze (sia su barre che heatmap).

### 3.5. Fascia Informazioni (Top Bar)
*   **Tipografia:** Aumentare la dimensione del font per migliorare la leggibilità.

---

## 4. Micro-copy e Testi

*   **Sostituzione Globale:** Cambiare ovunque `freq:` in `freq.:` (aggiunta punto).

---

## Piano di Azione Suggerito

1.  **Fix Dati (Priorità Max):** Modificare `useMetrics.ts` e `lemmaUtils.ts` per implementare la nuova logica di conteggio (Forme vs Occorrenze) e correggere il bug della timeline.
2.  **Fix Map Logic:** Verificare in `GeographicalMap.tsx` e `useRegions.ts` il caricamento del GeoJSON `limits_IT_regions.geojson` e la logica di filtraggio al click.
3.  **Refactoring UI:**
    *   Aggiornare `SearchBar.tsx` per la deduplicazione.
    *   Aggiornare `LemmaDetail.tsx` per il layout e l'uso di `datazione`.
    *   Aggiornare `Timeline.tsx` per le etichette e il fix delle date.
4.  **CSS/Stili:** Aumentare font-size in `MetricsSummary.tsx` e aggiustare i margini.
