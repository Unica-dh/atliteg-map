# **Documento di Revisione e Bug Report: Progetto AtLiTeG**

Questo documento sintetizza le richieste di modifica funzionale, estetica e la risoluzione dei bug per l'Atlante elaborato sui dati del VoSLIG.

## **2\. Riepilogo statistiche**

Riorganizzare l'ordine e la nomenclatura delle informazioni come segue:

1. **Lemmi**  
2. **Forme** (Nuovo campo da aggiungere, deve conteggiare le forme  
3. **Occorrenze** (Precedentemente denominato "Att:")  
4. **Anni** (Verificare la correttezza del dato: valore atteso \~48)  
5. **Località**

## **3\. Barra di Ricerca**

* **Semplificazione:** Rimuovere i selettori/indicazioni relativi a luogo e anno direttamente dalla barra.  
* **De-duplicazione:** Una singola forma deve comparire una sola volta nei suggerimenti/risultati, indipendentemente dal numero di attestazioni collegate. Attualmemte compare tante volte quante sono le sue forme. (Ad esempio la forma “Julienne” ha queste forme “julienne, giulien (2 volte), giulienne (3 volte), giuliana (2 volte). Invece dovrebbe apparire un risultato solo sia per “giulien” che per “giulienne” anche per “giuliana”.

## **5\. Rappresentazione Cartografica (Mappa)**

* **Visualizzazione:** Sostituire i marcatori attuali con icone meno invasive, più piccole e prive di ombreggiatura.  
* **Pop-up informativo:**  
  * Rendere il layout più compatto (ridurre l'interlinea).  
  * Rimuovere il campo "Località" (informazione ridondante rispetto alla posizione geografica).  
  * Inserire i valori del campo “categoria”

## **6\. Dettaglio Forme**

* **Layout:**  
  * Correggere l’altezza del riquadro affinché sia la stessa della mappa. Attualmente è imposto a 820px e va bene però deve essere impostato a tutto il div che contiene il anche bordo bianco altrimenti visivamente il blocco mappa+timeline e dettaglio forme appiono di altezza diverse .  
  * Spostare il conteggio delle "Occorrenze" accanto al numero di "Forme" (sotto il titolo principale).  
  * Rimuovere il conteggio totale dei lemmi da questa sezione specifica.  
  * Posizionare il link esterno verso [https://vocabolario.atliteg.org/](https://vocabolario.atliteg.org/) affianco al lemma e non alle singole forme per evitare tanti link uguali  
* **Campi e Metadati:**  
  * **Spostamento:** I campi "Categorie" e "Risorsa" vanno spostati in cima (livello Lemma), poiché sono proprietà comuni a tutte le forme sottostanti.  
  * **Rimozione:** Verifica se è stato eliminato il campo "ID ambito" e le ripetizioni di categoria/risorsa all'interno dei singoli riquadri delle forme.

## **7\. Linea del Tempo (Timeline Storica)**

* **Nomenclatura:** Rinominare in **"Linea del tempo"**.  
* **Interazione e Scala:**  
  * Raggruppare i dati per **quarti di secolo** anziché per anno singolo.  
  * Inserire vicino ad ogni indicatore il riferimento all’anno e mostrarlo solo per i punti attivi/selezionati.  
  * La barra di scorrimento che appare sotto quando l’arco temporale è molto ampio non è di facile utilizzo. Evitare lo scorrimento alterale e trovare una soluzione con delle frecce avanti/indietro al cui clic si passa da una occorrenza all’altra. fare delle proposte  
* **Testi:**  
  * Rimuovere l'indicazione del numero totale di anni.  
  * Modificare "Anni con lemmi" in **"Anni con attestazioni"**.

## **9\. Bug Report (Azioni Prioritarie)**

| Priorità | Componente | Descrizione Bug |
| :---- | :---- | :---- |
| **CRITICA** | Visualizzazione Dati | **Dati incompleti nei pop-up:** Se più forme insistono sulla stessa località (es. "agliata" a Napoli), il sistema ne mostra solo una. Devono essere elencate tutte le occorrenze (es. *alliata* 1314, *alleata* 1314 e 1366, *alleatam*, ecc.). |
| **CRITICA** | Interazione Mappa | **Filtro aree errato:** Il clic sulle aree regionali evidenziate mostra tutte le forme della regione e non solo quelle filtrate per il lemma selezionato. |
| **ALTA** | UI/Layering | **Filtri non cliccabili:** I menu a tendina dei filtri compaiono dietro altri elementi della pagina (problema di z-index). |
| **MEDIA** | Logica Indice | **Navigazione bloccata:** La selezione di un lemma filtra l'indice stesso, impedendo di tornare alla lista completa senza resettare tutto. |
