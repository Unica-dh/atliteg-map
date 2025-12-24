# Checklist Test Manuale - Dashboard Lemmario AtLiTeG

## Data Test: __________
## Tester: __________

---

## 1. Test Caricamento Iniziale

- [ ] **1.1** L'applicazione si carica senza errori
- [ ] **1.2** Viene visualizzato il loading spinner durante il caricamento
- [ ] **1.3** L'header è visibile con logo e titolo
- [ ] **1.4** La barra dei filtri è presente e accessibile
- [ ] **1.5** Le metriche mostrano i valori corretti (località, lemmi, anni, attestazioni)
- [ ] **1.6** La mappa è vuota al primo caricamento (nessun marker)
- [ ] **1.7** L'indice alfabetico mostra tutte le lettere
- [ ] **1.8** Il pannello dettaglio lemma mostra lo stato vuoto

**Note:**
_______________________________________________________________

---

## 2. Test Filtri

### 2.1 Filtro Categoria

- [ ] **2.1.1** Il menu a tendina categoria è popolato dinamicamente
- [ ] **2.1.2** È possibile selezionare una singola categoria
- [ ] **2.1.3** È possibile selezionare multiple categorie
- [ ] **2.1.4** Selezionando una categoria, la mappa si aggiorna con i marker
- [ ] **2.1.5** La timeline si aggiorna mostrando solo gli anni con quella categoria
- [ ] **2.1.6** L'indice alfabetico si aggiorna
- [ ] **2.1.7** Le metriche si aggiornano correttamente

**Note:**
_______________________________________________________________

### 2.2 Filtro Periodo

- [ ] **2.2.1** Il menu a tendina periodo è popolato dinamicamente
- [ ] **2.2.2** È possibile selezionare un singolo periodo
- [ ] **2.2.3** È possibile selezionare multipli periodi
- [ ] **2.2.4** Tutti i componenti si sincronizzano correttamente

**Note:**
_______________________________________________________________

### 2.3 Filtri Combinati

- [ ] **2.3.1** Categoria + Periodo funzionano insieme (AND logic)
- [ ] **2.3.2** I risultati sono corretti e coerenti
- [ ] **2.3.3** Le metriche riflettono i dati filtrati

**Note:**
_______________________________________________________________

### 2.4 Reset Filtri

- [ ] **2.4.1** Il pulsante "Reset Filters" è visibile
- [ ] **2.4.2** Click su reset azzera tutti i filtri
- [ ] **2.4.3** La mappa si svuota (torna allo stato iniziale)
- [ ] **2.4.4** Tutti i componenti tornano allo stato iniziale

**Note:**
_______________________________________________________________

---

## 3. Test Ricerca

### 3.1 Funzionalità Base

- [ ] **3.1.1** La barra di ricerca è visibile e accessibile
- [ ] **3.1.2** Digitando appare l'autocompletamento dopo 300ms
- [ ] **3.1.3** I suggerimenti mostrano Lemma, Forma, Località, Anno
- [ ] **3.1.4** I suggerimenti sono pertinenti alla ricerca

**Note:**
_______________________________________________________________

### 3.2 Interazione

- [ ] **3.2.1** Click su suggerimento filtra la dashboard
- [ ] **3.2.2** Tutti i componenti si sincronizzano con la selezione
- [ ] **3.2.3** Il testo di ricerca evidenzia le corrispondenze (highlighting)
- [ ] **3.2.4** Il pulsante X cancella la ricerca

**Note:**
_______________________________________________________________

### 3.3 Navigazione Tastiera

- [ ] **3.3.1** Tab porta il focus sulla barra di ricerca
- [ ] **3.3.2** Freccia giù/su naviga tra i suggerimenti
- [ ] **3.3.3** Enter seleziona il suggerimento evidenziato
- [ ] **3.3.4** Escape chiude l'autocompletamento

**Note:**
_______________________________________________________________

### 3.4 Casi Particolari

- [ ] **3.4.1** Ricerca senza risultati mostra messaggio appropriato
- [ ] **3.4.2** Ricerca con caratteri speciali funziona
- [ ] **3.4.3** Ricerca con accenti funziona correttamente

**Note:**
_______________________________________________________________

---

## 4. Test Mappa Geografica

### 4.1 Visualizzazione

- [ ] **4.1.1** La mappa si carica correttamente con OpenStreetMap
- [ ] **4.1.2** Vista iniziale centrata su Italia (42.5, 12.5)
- [ ] **4.1.3** Zoom iniziale mostra l'intera penisola
- [ ] **4.1.4** Controlli zoom funzionano correttamente
- [ ] **4.1.5** Drag per spostare mappa funziona

**Note:**
_______________________________________________________________

### 4.2 Marker

- [ ] **4.2.1** Nessun marker al primo caricamento
- [ ] **4.2.2** Marker appaiono dopo applicazione filtri
- [ ] **4.2.3** Marker sono blu e ben visibili
- [ ] **4.2.4** Marker raggruppano località con stesso nome (clustering?)

**Note:**
_______________________________________________________________

### 4.3 Popup

- [ ] **4.3.1** Click su marker apre popup
- [ ] **4.3.2** Popup mostra Lemma, Forma, Anno
- [ ] **4.3.3** Popup è ben formattato e leggibile
- [ ] **4.3.4** Click fuori popup lo chiude

**Note:**
_______________________________________________________________

### 4.4 Poligoni (Aree Geografiche)

- [ ] **4.4.1** Lemmi con IdAmbito mostrano poligoni
- [ ] **4.4.2** Poligoni sono visibili e distinti dai marker
- [ ] **4.4.3** Click su poligono mostra popup
- [ ] **4.4.4** Colori poligoni sono appropriati

**Note:**
_______________________________________________________________

### 4.5 Conteggi

- [ ] **4.5.1** In alto a destra mappa: "X locations • Y lemmas"
- [ ] **4.5.2** Conteggi sono corretti e si aggiornano dinamicamente
- [ ] **4.5.3** Conteggi sincronizzati con filtri

**Note:**
_______________________________________________________________

---

## 5. Test Timeline

### 5.1 Visualizzazione

- [ ] **5.1.1** Timeline mostra range completo anni (es. 1300-1450)
- [ ] **5.1.2** Anni con attestazioni: punti blu pieni
- [ ] **5.1.3** Anni senza attestazioni: punti vuoti
- [ ] **5.1.4** Layout orizzontale chiaro e leggibile

**Note:**
_______________________________________________________________

### 5.2 Navigazione

- [ ] **5.2.1** Freccia sinistra scorre indietro
- [ ] **5.2.2** Freccia destra scorre avanti
- [ ] **5.2.3** Frecce disabilitate agli estremi
- [ ] **5.2.4** Paginazione funziona correttamente

**Note:**
_______________________________________________________________

### 5.3 Interazione

- [ ] **5.3.1** Click su anno lo seleziona (blu intenso)
- [ ] **5.3.2** Secondo click sullo stesso anno lo deseleziona
- [ ] **5.3.3** Selezione anno filtra tutti i componenti
- [ ] **5.3.4** Sotto ogni anno: elenco sintetico lemmi e località

**Note:**
_______________________________________________________________

### 5.4 Conteggi

- [ ] **5.4.1** "X anni con lemmi • Y totali" visibile in alto a destra
- [ ] **5.4.2** Conteggi corretti e aggiornati dinamicamente

**Note:**
_______________________________________________________________

---

## 6. Test Indice Alfabetico

### 6.1 Visualizzazione

- [ ] **6.1.1** Lettere A-Z tutte visibili
- [ ] **6.1.2** Lettere con lemmi sono evidenziate/cliccabili
- [ ] **6.1.3** Lettere senza lemmi sono disabilitate
- [ ] **6.1.4** Layout chiaro e accessibile

**Note:**
_______________________________________________________________

### 6.2 Interazione

- [ ] **6.2.1** Click su lettera la seleziona
- [ ] **6.2.2** Sotto l'indice appaiono i lemmi che iniziano con quella lettera
- [ ] **6.2.3** Mappa si aggiorna mostrando solo quelle occorrenze
- [ ] **6.2.4** Timeline si aggiorna di conseguenza

**Note:**
_______________________________________________________________

### 6.3 Sincronizzazione

- [ ] **6.3.1** Filtri aggiornano le lettere disponibili
- [ ] **6.3.2** Ricerca aggiorna l'indice
- [ ] **6.3.3** Selezione anno aggiorna l'indice

**Note:**
_______________________________________________________________

---

## 7. Test Pannello Dettaglio Lemma

### 7.1 Stato Vuoto

- [ ] **7.1.1** Al caricamento mostra icona e messaggio
- [ ] **7.1.2** Messaggio chiaro e informativo
- [ ] **7.1.3** Design coerente con il resto dell'app

**Note:**
_______________________________________________________________

### 7.2 Visualizzazione Dettagli

- [ ] **7.2.1** Selezione lemma mostra dettagli
- [ ] **7.2.2** Tutte le proprietà visibili: Forma, Località, Anno/Periodo
- [ ] **7.2.3** Categorie mostrate come badge
- [ ] **7.2.4** URL cliccabile e apre in nuova tab
- [ ] **7.2.5** IdAmbito visualizzato quando presente
- [ ] **7.2.6** Frequenza mostrata quando disponibile

**Note:**
_______________________________________________________________

### 7.3 Raggruppamento

- [ ] **7.3.1** Occorrenze raggruppate per lemma
- [ ] **7.3.2** Conteggio forme visibile per ogni lemma
- [ ] **7.3.3** Ordine alfabetico dei lemmi

**Note:**
_______________________________________________________________

### 7.4 Scroll

- [ ] **7.4.1** Con molti lemmi, scroll funziona correttamente
- [ ] **7.4.2** Header del pannello rimane fisso
- [ ] **7.4.3** Performance accettabile con molti dati

**Note:**
_______________________________________________________________

---

## 8. Test Metriche

### 8.1 Visualizzazione

- [ ] **8.1.1** Metriche sempre visibili (sticky/fixed?)
- [ ] **8.1.2** Conteggio località
- [ ] **8.1.3** Conteggio lemmi unici
- [ ] **8.1.4** Conteggio anni
- [ ] **8.1.5** Conteggio attestazioni totali

**Note:**
_______________________________________________________________

### 8.2 Aggiornamento

- [ ] **8.2.1** Metriche si aggiornano con filtri
- [ ] **8.2.2** Metriche si aggiornano con ricerca
- [ ] **8.2.3** Metriche si aggiornano con selezioni
- [ ] **8.2.4** Valori sempre corretti e coerenti

**Note:**
_______________________________________________________________

---

## 9. Test Sincronizzazione Globale

### 9.1 Scenario Complesso 1: Filtro → Ricerca → Selezione

- [ ] **9.1.1** Applicare filtro categoria
- [ ] **9.1.2** Effettuare ricerca
- [ ] **9.1.3** Selezionare anno sulla timeline
- [ ] **9.1.4** Verificare che tutti i componenti siano sincronizzati

**Note:**
_______________________________________________________________

### 9.2 Scenario Complesso 2: Indice → Mappa → Dettaglio

- [ ] **9.2.1** Selezionare lettera nell'indice
- [ ] **9.2.2** Click su marker sulla mappa
- [ ] **9.2.3** Verificare dettaglio lemma corretto
- [ ] **9.2.4** Verificare coerenza con timeline

**Note:**
_______________________________________________________________

### 9.3 Scenario Complesso 3: Filtri Multipli

- [ ] **9.3.1** Applicare categoria + periodo + ricerca
- [ ] **9.3.2** Selezionare anno
- [ ] **9.3.3** Selezionare lettera
- [ ] **9.3.4** Verificare che risultati siano l'intersezione corretta

**Note:**
_______________________________________________________________

---

## 10. Test Accessibilità

### 10.1 Navigazione Tastiera

- [ ] **10.1.1** Tab naviga tra tutti i controlli
- [ ] **10.1.2** Ordine di focus logico
- [ ] **10.1.3** Focus visibile su tutti gli elementi
- [ ] **10.1.4** Enter/Space attivano pulsanti e controlli

**Note:**
_______________________________________________________________

### 10.2 ARIA Labels

- [ ] **10.2.1** Tutti i controlli hanno aria-label appropriati
- [ ] **10.2.2** Stati (expanded, selected) dichiarati correttamente
- [ ] **10.2.3** Landmark regions definiti (main, nav, header)

**Note:**
_______________________________________________________________

### 10.3 Screen Reader

- [ ] **10.3.1** Header letto correttamente
- [ ] **10.3.2** Filtri annunciati
- [ ] **10.3.3** Metriche leggibili
- [ ] **10.3.4** Componenti interattivi identificabili

**Note:**
_______________________________________________________________

### 10.4 Contrasto

- [ ] **10.4.1** Testo su sfondo: contrasto ≥ 4.5:1
- [ ] **10.4.2** Controlli interattivi: contrasto ≥ 3:1
- [ ] **10.4.3** Stati hover/focus visibili

**Note:**
_______________________________________________________________

---

## 11. Test Responsive

### 11.1 Desktop (1920x1080)

- [ ] **11.1.1** Layout a 3 colonne funziona bene
- [ ] **11.1.2** Tutti i componenti visibili
- [ ] **11.1.3** Nessun overflow orizzontale

**Note:**
_______________________________________________________________

### 11.2 Desktop Small (1366x768)

- [ ] **11.2.1** Layout si adatta correttamente
- [ ] **11.2.2** Leggibilità mantenuta

**Note:**
_______________________________________________________________

### 11.3 Tablet Landscape (1024x768)

- [ ] **11.3.1** Layout responsive funziona
- [ ] **11.3.2** Componenti riorganizzati se necessario

**Note:**
_______________________________________________________________

### 11.4 Tablet Portrait (768x1024)

- [ ] **11.4.1** Layout a colonna singola?
- [ ] **11.4.2** Scroll verticale funziona bene
- [ ] **11.4.3** Touch gestures funzionano su mappa

**Note:**
_______________________________________________________________

---

## 12. Test Performance

### 12.1 Caricamento

- [ ] **12.1.1** Tempo caricamento iniziale < 3s
- [ ] **12.1.2** Feedback di loading chiaro
- [ ] **12.1.3** Nessun flash of unstyled content (FOUC)

**Note:**
_______________________________________________________________

### 12.2 Interazione

- [ ] **12.2.1** Filtri si applicano velocemente (< 500ms)
- [ ] **12.2.2** Ricerca debounced senza lag
- [ ] **12.2.3** Mappa si aggiorna fluidamente
- [ ] **12.2.4** Scroll smooth senza jank

**Note:**
_______________________________________________________________

### 12.3 Dataset Grande

- [ ] **12.3.1** Con tutti i filtri resettati, performance accettabile
- [ ] **12.3.2** Nessun freeze dell'UI
- [ ] **12.3.3** Memory usage ragionevole

**Note:**
_______________________________________________________________

---

## 13. Test Errori e Edge Cases

### 13.1 Gestione Errori

- [ ] **13.1.1** Errore caricamento CSV: messaggio appropriato
- [ ] **13.1.2** Errore caricamento GeoJSON: gestito gracefully
- [ ] **13.1.3** Pulsante reload funziona

**Note:**
_______________________________________________________________

### 13.2 Dati Mancanti

- [ ] **13.2.1** Lemmi senza coordinate: non mostrati su mappa
- [ ] **13.2.2** Lemmi senza anno: gestiti correttamente
- [ ] **13.2.3** Categorie vuote: non causano errori

**Note:**
_______________________________________________________________

### 13.3 Casi Limite

- [ ] **13.3.1** Filtri che non producono risultati: messaggio chiaro
- [ ] **13.3.2** Ricerca senza match: feedback appropriato
- [ ] **13.3.3** Anno senza attestazioni: gestito correttamente

**Note:**
_______________________________________________________________

---

## 14. Test Browser Compatibility

### 14.1 Chrome/Edge (Chromium)

- [ ] **14.1.1** Funzionalità complete
- [ ] **14.1.2** Rendering corretto
- [ ] **14.1.3** Performance ottimale

**Note:**
_______________________________________________________________

### 14.2 Firefox

- [ ] **14.2.1** Funzionalità complete
- [ ] **14.2.2** Rendering corretto
- [ ] **14.2.3** Performance buona

**Note:**
_______________________________________________________________

### 14.3 Safari

- [ ] **14.3.1** Funzionalità complete
- [ ] **14.3.2** Rendering corretto
- [ ] **14.3.3** Nessun bug specifico Safari

**Note:**
_______________________________________________________________

---

## 15. Test Docker

### 15.1 Build

- [ ] **15.1.1** `docker-compose build` completa con successo
- [ ] **15.1.2** Dimensione immagine ragionevole
- [ ] **15.1.3** Nessun warning critico

**Note:**
_______________________________________________________________

### 15.2 Run

- [ ] **15.2.1** `docker-compose up` avvia senza errori
- [ ] **15.2.2** Applicazione accessibile su porta 9000
- [ ] **15.2.3** Nginx serve file statici correttamente
- [ ] **15.2.4** Hot reload NON attivo in produzione

**Note:**
_______________________________________________________________

### 15.3 Logs

- [ ] **15.3.1** Logs container puliti e informativi
- [ ] **15.3.2** Nessun errore nei logs
- [ ] **15.3.3** Health check (se implementato) funziona

**Note:**
_______________________________________________________________

---

## Riepilogo Finale

### Totale Test Eseguiti: _____ / 189

### Test Passati: _____
### Test Falliti: _____
### Test Bloccati: _____

### Issue Critici Trovati:
1. _________________________________________________________________
2. _________________________________________________________________
3. _________________________________________________________________

### Issue Minori Trovati:
1. _________________________________________________________________
2. _________________________________________________________________
3. _________________________________________________________________

### Raccomandazioni:
_____________________________________________________________________
_____________________________________________________________________
_____________________________________________________________________

### Firma Tester: _________________ Data: _____________
