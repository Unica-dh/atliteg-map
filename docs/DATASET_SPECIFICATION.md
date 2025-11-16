# Specifica del Dataset Lemmi_forme_atliteg.csv

## 1. Panoramica

Il file `Lemmi_forme_atliteg.csv` è il dataset principale del progetto ATLITEG (Atlante Lessicale dell'Italiano Tardo-antico e Medievale della Gastronomia). Contiene dati strutturati sulla terminologia gastronomica italiana storica, tracciando l'evoluzione lessicale nel tempo e nello spazio geografico.

### Caratteristica distintiva: Variazione diatopica

Il dataset documenta la **relazione tra LEMMA (forma base normalizzata) e FORMA (variante attestata) in funzione della GEOGRAFIA**. Questa relazione rivela pattern di variazione dialettale e diffusione lessicale attraverso l'Italia storica:

- **Forme locali** (72,2%): varianti attestate solo in città specifiche (es. `aggiada` solo a Genova)
- **Forme regionali** (6,3%): varianti attestate solo in regioni (es. `brasole` in Lazio e Toscana)
- **Forme macro-areali** (5,4%): varianti in ambiti sovra-regionali (es. `brasciola` in Italia meridionale intermedia)
- **Forme trasversali** (4,1%): varianti panitaliane attestate a tutti i livelli geografici (es. `agliata`)

Questa struttura permette di analizzare **isoglosse storiche**, **diffusione di forme di prestigio**, e **persistenza di varianti dialettali**.

### Statistiche generali

- **Totale record**: 6.236 righe (escludendo l'intestazione)
- **Lemmi unici**: 365
- **Forme uniche**: 1.871 (media 5,1 forme per lemma)
- **Distribuzione geografica forme**:
  - 1.411 forme solo locali (città)
  - 154 forme locale+regionale
  - 123 forme solo regionali
  - 81 forme trasversali (tutti i livelli)
- **Lemmi con alta variabilità geografica**: 165 (45,2%) hanno forme su più livelli geografici
- **Periodo temporale**: 1314 - 1899 (circa 585 anni)
- **Separatore**: punto e virgola (`;`)
- **Codifica**: UTF-8 (con problemi di encoding su caratteri accentati)

---

## 2. Struttura delle colonne

### 2.1 IdLemma (Integer)
**Descrizione**: Identificatore numerico univoco del lemma (headword lessicale)

**Caratteristiche**:
- Tipo: Intero
- Range: 32 - 8603
- Non sequenziale
- Utilizzato per raggruppare forme varianti dello stesso lemma
- Chiave per il collegamento al sito web ATLITEG

**Esempi**:
- `2105` → aarìso
- `4133` → acciugata
- `2106` → agliata

**Uso nel frontend**: Identificatore per aggregare dati e creare gerarchie lemma → forme

---

### 2.2 Lemma (String)
**Descrizione**: Forma normalizzata/lemmatizzata del termine gastronomico

**Caratteristiche**:
- Tipo: Stringa
- Lunghezza variabile
- Può contenere spazi e caratteri speciali
- Forma di riferimento per raggruppamento varianti
- Alcune forme contengono underscore per disambiguazione (es. `agresta_1`)

**Esempi**:
- `aarìso`
- `acciugata`
- `agliata`
- `agnolotto`
- `agresta_1` (variante disambiguata)

**Note speciali**:
- Presenza di caratteri accentati mal codificati (es. `aar�so` invece di `aarìso`)
- Alcuni lemmi terminano con spazio (es. `agnolotto `)

**Uso nel frontend**: 
- Etichetta principale nei componenti
- Filtro di ricerca
- Chiave per navigazione

---

### 2.3 Forma (String)
**Descrizione**: Variante grafica/fonetica attestata del lemma nelle fonti storiche

**Caratteristiche**:
- Tipo: Stringa
- 1.871 forme uniche per 365 lemmi (media ~5 forme per lemma)
- Include varianti dialettali, grafiche e morfologiche
- Riflette l'evoluzione ortografica storica e la variazione diatopica (geografica)

**Esempi per il lemma `agliata`**:
- `alleata` (Napoli, 1314)
- `alleatam` (forma latina)
- `aggiada` (Genova, 1893)
- `agliata` (forma standard)
- `alliata`
- `aggiadda`

**Relazioni**:
- Un lemma può avere molte forme (1:N)
- La stessa forma può apparire in contesti diversi (spazio-temporali)

**Relazione Forma-Geografia** (vedi sezione 3.4):
- **72,2%** delle forme sono attestate **solo a livello locale** (città specifiche)
- **7,9%** sono forme **condivise tra città e regioni**
- **4,1%** sono forme **trasversali** (attestate a tutti i livelli geografici: città, regioni, macro-aree)

**Uso nel frontend**:
- Visualizzazione dettagli varianti
- Analisi evoluzione ortografica
- Filtri di ricerca avanzata
- **Mappa distribuzione geografica delle forme dialettali**

---

### 2.4 Coll.Geografica (String)
**Descrizione**: Località o area geografica dove il termine è attestato

**Caratteristiche**:
- Tipo: Stringa
- Località più frequenti (top 10):
  1. Roma (1.155 attestazioni)
  2. Napoli (850)
  3. Firenze (547)
  4. Torino (402)
  5. Milano (363)
  6. Bologna (362)
  7. Genova (314)
  8. Ferrara (268)
  9. Toscana (200 - regione)
  10. Lazio (181 - regione)

**Granularità variabile**: può essere città, regione o ambito geografico

**Problemi di encoding**: caratteri accentati corrotti (es. `Citt�` invece di `Città`)

**Uso nel frontend**:
- **Componente mappa geografica** (GeographicalDistributionMap.vue)
- Filtri geografici
- Analisi distribuzione spaziale
- Necessità di geocoding per coordinate

---

### 2.5 Tipo coll.Geografica (String - Enum)
**Descrizione**: Classificazione della granularità geografica

**Valori possibili** (4 categorie):
1. `Città` → località urbana specifica (es. Roma, Napoli)
2. `Regione` → regione italiana (es. Toscana, Lazio)
3. `Ambito geografico sub regionale` → area sub-regionale (es. Toscana sud-orientale)
4. `Ambito geografico sovra regionale` → area sovra-regionale (es. Italia mediana, Italia meridionale intermedia)

**Distribuzione**: La maggior parte dei record si riferisce a città specifiche

**Problemi**: Encoding corrotto `Citt�` invece di `Città`

**Uso nel frontend**:
- Filtro gerarchico per livello geografico
- Visualizzazione mappa con diversi livelli di zoom
- Aggregazione dati per granularità

---

### 2.6 Anno (Integer)
**Descrizione**: Anno di attestazione del termine nelle fonti

**Caratteristiche**:
- Tipo: Intero
- Range: **1314 - 1899** (585 anni)
- Distribuzione non uniforme
- Anni più rappresentati: periodi di maggiore produzione letteraria gastronomica

**Esempi**:
- `1314` → attestazioni medievali precoci
- `1609`, `1627` → periodo barocco (Roma)
- `1820`, `1852` → epoca ottocentesca

**Uso nel frontend**:
- Timeline temporale
- Filtri per periodo storico
- Analisi evoluzione diacronica
- **Componente GlobalFilterBar** per range temporale

---

### 2.7 Periodo (String)
**Descrizione**: Classificazione del periodo storico in quarti di secolo

**Caratteristiche**:
- Tipo: Stringa
- Formato standardizzato: `[I|II|III|IV] quarto del [XIV-XIX] secolo`
- 23 valori distinti

**Valori completi**:
- Secolo XIV: I, III, IV quarto
- Secolo XV: I, II, III, IV quarto
- Secolo XVI: I, II, III, IV quarto
- Secolo XVII: I, II, III, IV quarto
- Secolo XVIII: II, III, IV quarto
- Secolo XIX: I, II, III, IV quarto
- Eccezione: `I quarto dell'XI secolo` (probabilmente errore: 1526 → XVI secolo)

**Uso nel frontend**:
- Filtri temporali predefiniti
- Visualizzazioni aggregate per periodo
- Etichette human-readable per timeline

---

### 2.8 IDPeriodo (Integer)
**Descrizione**: Identificatore numerico sequenziale del periodo

**Caratteristiche**:
- Tipo: Intero
- Range: 1 - 36
- Sequenza ordinata cronologicamente
- Facilita ordinamento e confronti

**Mappatura esempio**:
- `1` → I quarto dell'XI secolo (anomalia)
- `13` → I quarto del XIV secolo
- `20` → IV quarto del XV secolo
- `36` → IV quarto del XIX secolo

**Uso nel frontend**:
- Ordinamento cronologico
- Filtri numerici
- Aggregazioni per periodo

---

### 2.9 Datazione (String)
**Descrizione**: Datazione precisa o range temporale dell'attestazione

**Caratteristiche**:
- Tipo: Stringa
- Formato variabile e non standardizzato
- Include:
  - Date precise: `1609`, `1893, 8ª ed.`
  - Range di secoli: `Sec. XIV primo quarto`
  - Range di anni: `1308-1314`, `1461-1465`
  - Date specifiche: `3 agosto 1524`, `16/02/1476`
  - Riferimenti editoriali: `1820, 6ª ed.`, `1852, 7ª ed.`
  - Periodi generici: `fine XV sec.-inizio XVI sec.`, `Sec. XIV secondo terzo`

**Esempi**:
- `1308-1314`
- `1820, 6ª ed.`
- `Sec. XV ultimo quarto`
- `7 gennaio 1554 - 23 ottobre 1556`

**Uso nel frontend**:
- Visualizzazione dettagliata tooltip
- Informazioni contestuali
- Non adatta per filtri automatici (formato non strutturato)

---

### 2.10 Categoria (String - Multi-value)
**Descrizione**: Classificazione tematico-semantica del termine gastronomico

**Caratteristiche**:
- Tipo: Stringa (spesso multi-valore)
- Separatore multi-categoria: virgola (`,`)
- **1.714 record** (27,5%) hanno categorie multiple
- Totale categorie uniche: ~90

**Categorie principali** (top 15):
1. **Carni derivati e preparazioni a base di carne** (792 occorrenze)
2. **Paste e pastelli anche con ripieno** (531)
3. **Farina e derivati** (495)
4. **Brodi brodetti minestre zuppe** (474)
5. **Latte latticini e formaggi** (387)
6. **Condimenti vari** (360)
7. **Dolci e dessert** (303)
8. **Salse** (161)
9. **Frutta frutta secca e preparazioni** (139)
10. **Conserve e confetture** (124)
11. **Insalate e verdure** (111)
12. **Pesci e preparazioni a base di pesce**
13. **Volatili e preparazioni a base di volatili**
14. **Uova e preparazioni**
15. **Vini e bevande**

**Combinazioni frequenti**:
- `Brodi brodetti minestre zuppe,Carni derivati e preparazioni a base di carne` (168)
- `Carni derivati e preparazioni a base di carne,Condimenti vari` (110)
- `Brodi brodetti minestre zuppe,Dolci e dessert` (101)
- `Arredi per la tavola,Utensili di cucina`
- `Operazioni di cucina`

**Categorie specialistiche**:
- `Spezie e sostanze aromatiche`
- `Funghi e tartufi`
- `Riso e risotti`
- `Torte salate`
- `Legumi e preparazioni`
- `Ortaggi e preparazioni`

**Uso nel frontend**:
- **LemmaCategoriesTreemap.vue** per visualizzazione gerarchica
- **GlobalFilterBar** per filtri multi-selezione
- Analisi categorie dominanti per periodo/località
- Necessità di parsing per gestire multi-categoria

**Nota critica**: Alcune categorie contengono spazi irregolari e potrebbero richiedere normalizzazione

---

### 2.11 Frequenza (Integer)
**Descrizione**: Numero di occorrenze del termine nel corpus della specifica fonte

**Caratteristiche**:
- Tipo: Intero
- Range: **0 - 2.120**
- Media: **15,6** occorrenze per record
- Distribuzione fortemente asimmetrica (long tail)

**Statistiche**:
- Minimo: 0 (presenza senza occorrenze numerabili)
- Massimo: 2.120 (termine molto frequente)
- Mediana: molto più bassa della media (distribuzione skewed)

**Interpretazione**:
- Valori bassi (1-5): termini rari/specialistici
- Valori medi (6-50): termini comuni
- Valori alti (>100): termini fondamentali/frequentissimi

**Esempi estremi**:
- `2120` → massima frequenza
- `1705`, `1549`, `1361` → termini molto frequenti
- Molti termini con frequenza 1-3 (hapax o rari)

**Uso nel frontend**:
- Dimensionamento visuale (bubble size, word cloud)
- **LemmaCategoriesTreemap**: dimensione nodi
- Filtri per importanza/rilevanza
- Heatmap di distribuzione

---

### 2.12 URL (String - URL)
**Descrizione**: Link alla scheda dettagliata del lemma sul sito ATLITEG

**Caratteristiche**:
- Tipo: URL (String)
- Pattern: `https://www.atliteg.org/lemmi/{lemma}/{IdLemma}`
- Sempre valorizzato (non null)

**Formato esempio**:
```
https://www.atliteg.org/lemmi/aarso/2105
https://www.atliteg.org/lemmi/agliata/2106
https://www.atliteg.org/lemmi/zuppiera/7551
```

**Struttura URL**:
- Base: `https://www.atliteg.org/lemmi/`
- Slug lemma: versione URL-friendly del lemma
- ID numerico: `IdLemma`

**Uso nel frontend**:
- Link esterni per approfondimenti
- **LemmaDetailsTable**: colonna link
- Call-to-action per maggiori dettagli
- Potenziale integrazione API

---

## 3. Relazioni e struttura dati

### 3.1 Modello concettuale

```
LEMMA (1) ─────┬───── (N) ATTESTAZIONI
               │
               └─ IdLemma (chiave)
               └─ Lemma (etichetta)
               └─ URL (riferimento)

ATTESTAZIONE
├─ IdLemma (FK)
├─ Forma (variante)
├─ Localizzazione
│  ├─ Coll.Geografica
│  └─ Tipo coll.Geografica
├─ Temporalizzazione
│  ├─ Anno
│  ├─ Periodo
│  ├─ IDPeriodo
│  └─ Datazione
├─ Classificazione
│  ├─ Categoria (multi-value)
│  └─ Frequenza
└─ URL (riferimento)
```

### 3.2 Cardinalità

- **1 Lemma** → **N Attestazioni** (1:N)
- **1 Lemma** → **N Forme** (1:N, mediamente 5 forme per lemma)
- **1 Forma** → **N Attestazioni** (può essere attestata in più contesti)
- **1 Localizzazione** → **N Attestazioni** (N:N)
- **1 Categoria** → **N Attestazioni** (N:N)

### 3.3 Granularità dati

Il dataset ha granularità a livello di **attestazione singola**:
- Ogni riga = 1 attestazione di 1 forma di 1 lemma in 1 contesto spazio-temporale

---

### 3.4 Relazione Lemma-Forma-Geografia: Variazione Diatopica

**Concetto chiave**: Il dataset documenta la **variazione diatopica** (geografica) del lessico gastronomico italiano storico. La relazione tra **Lemma** (termine base normalizzato) e **Forma** (variante attestata) è strettamente correlata alla **granularità geografica** dell'attestazione.

#### 3.4.1 Pattern di distribuzione geografica

**Analisi statistica delle 1.954 coppie forma-geografia uniche**:

| Pattern di distribuzione | N. forme | % | Descrizione |
|--------------------------|----------|---|-------------|
| **Solo locale** (città) | 1.411 | 72,2% | Forme attestate esclusivamente in contesti urbani specifici |
| **Locale + Regionale** | 154 | 7,9% | Forme condivise tra città e regioni |
| **Solo regionale** | 123 | 6,3% | Forme attestate solo a livello regionale |
| **Solo macro-area** | 105 | 5,4% | Forme attestate solo in ambiti sub/sovra-regionali |
| **Trasversali** (tutti i livelli) | 81 | 4,1% | Forme attestate in città, regioni E macro-aree |
| **Locale + Macro** | 54 | 2,8% | Forme in città e macro-aree (ma non regioni) |
| **Regionale + Macro** | 26 | 1,3% | Forme in regioni e macro-aree (ma non città) |

#### 3.4.2 Interpretazione linguistica

**Forme locali (72,2%)**:
- Rappresentano **varianti dialettali** strettamente legate a un centro urbano
- Riflettono particolarità grafiche/fonetiche di scriptae locali
- Esempi: `aggiada` (Genova), `aggiadda` (Genova) per il lemma `agliata`

**Forme regionali**:
- Indicano **koinè regionali** o forme standardizzate a livello di regione storica
- Possono rappresentare forme di prestigio regionale
- Esempi: `brasole` (Lazio, Toscana) per il lemma `braciola`

**Forme macro-areali**:
- Documentano **isoglosse** sovra-regionali
- Riflettono aree linguistiche omogenee (es. Italia mediana, Italia meridionale intermedia)
- Esempi: `brasciola` (Italia meridionale intermedia) per il lemma `braciola`

**Forme trasversali (4,1%)**:
- Rappresentano **forme panitaliane** o standardizzate
- Attestate a tutti i livelli geografici, spesso la forma più conservativa
- Esempi: `agliata`, `agresta`, `agresto`, `amido`

#### 3.4.3 Distribuzione delle forme per lemma

**Analisi di 365 lemmi**:
- **189 lemmi** (51,8%) hanno forme attestate **solo a livello città**
- **165 lemmi** (45,2%) hanno forme su **più livelli geografici**
- **142 lemmi** (38,9%) hanno forme sia in città che in regioni
- **6 lemmi** (1,6%) hanno forme attestate **solo a livello regionale**

**Lemmi con alta variazione geografica** (esempi):

1. **`pane`**: 50 forme distinte
   - 49 forme a livello città: `pain`, `pains`, `pambollito`, `pan azimo`, `pan bagnato`, ecc.
   - 6 forme a livello regione: `pan`, `panata`, `pane`, ecc.
   - 4 forme macro-areali: `pane`, `panello`, ecc.

2. **`cacio`**: 30 forme distinte
   - 24 forme a livello città: `caccio`, `cacio`, `caciola`, `cascetto`, ecc.
   - 11 forme a livello regione: `cacio`, `cascio`, `caseo`, ecc.
   - 7 forme macro-areali: `casci`, `casciata`, ecc.

3. **`braciola`**: 28 forme distinte
   - 27 forme a livello città: `braciola`, `bracioletta`, `braciolettine`, ecc.
   - 4 forme a livello regione: `braciole`, `brasciole`, `brasole`, `braxolle`
   - 1 forma macro-areale: `brasciola` (Italia meridionale intermedia)

4. **`frittella`**: 30 forme distinte
   - 23 forme città, 8 forme regione, 8 forme macro-areali
   - Forte variazione grafica: `affrittellano`, `afrittellate`, `frictella`, ecc.

#### 3.4.4 Gerarchia semantico-geografica

Il dataset permette di ricostruire una **gerarchia di diffusione**:

```
LEMMA (concetto astratto)
  │
  ├─── FORMA STANDARD/TRASVERSALE (panitaliana)
  │     ├─ Attestata in macro-aree
  │     ├─ Attestata in regioni
  │     └─ Attestata in città
  │
  ├─── FORMA REGIONALE (koinè)
  │     ├─ Attestata in regioni specifiche
  │     └─ A volte estesa a città della regione
  │
  └─── FORMA LOCALE (dialettale)
        └─ Attestata solo in città specifica
```

**Esempio pratico - Lemma `agliata`**:

```
agliata (lemma base - salsa all'aglio)
  │
  ├─ "agliata" [TRASVERSALE]
  │   ├─ Toscana sud-orientale (ambito sub-regionale)
  │   ├─ Italia mediana (ambito sovra-regionale)
  │   ├─ Lazio, Toscana, Lombardia (regioni)
  │   └─ Venezia, Napoli, Roma, Firenze, Ferrara (città)
  │
  ├─ "alleata" [LOCALE - variante napoletana medievale]
  │   └─ Napoli (1314, 1366)
  │
  ├─ "alleatam" [LOCALE - forma latina]
  │   └─ Napoli, Bolzano (XIV-XV sec.)
  │
  ├─ "aggiada" [LOCALE - variante genovese]
  │   └─ Genova (1893)
  │
  └─ "aggiadda" [LOCALE - ulteriore variante genovese]
      └─ Genova (1893)
```

#### 3.4.5 Implicazioni per il frontend

**Visualizzazioni consigliate**:

1. **Mappa coropletica stratificata**:
   - Livello 1 (zoom out): macro-aree con forme sovra-regionali
   - Livello 2 (zoom medio): regioni con forme regionali
   - Livello 3 (zoom in): città con forme locali specifiche

2. **Grafo relazionale Lemma-Forme**:
   - Nodo centrale: lemma
   - Nodi satelliti: forme
   - Colore nodi: tipo geografico (città=blu, regione=verde, macro=arancione)
   - Dimensione nodi: frequenza

3. **Timeline evoluzione forme per area**:
   - Asse X: tempo (Anno)
   - Asse Y: livello geografico (città, regione, macro-area)
   - Punti: attestazioni di forme specifiche
   - Colori: forme diverse

4. **Heatmap variazione dialettale**:
   - Righe: lemmi
   - Colonne: aree geografiche
   - Calore: numero forme distinte
   - Identifica lemmi con alta variabilità geografica

**Filtri avanzati**:

- **Per pattern geografico**: "Mostra solo forme locali", "Mostra solo forme trasversali"
- **Per variabilità**: "Lemmi con >10 forme", "Lemmi con forme in tutte le regioni"
- **Per conservatività**: "Forme attestate solo nel periodo X ma in geografia Y"

**Metriche derivate**:

```javascript
// Indice di variabilità geografica di un lemma
function calcolaIndiceVariabilitaGeografica(lemma) {
  const forme = getFormeLemma(lemma);
  const tipiGeo = new Set(forme.map(f => f.tipoGeografico));
  const localitaUniche = new Set(forme.map(f => f.localita));
  
  return {
    numeroForme: forme.length,
    livellGeografici: tipiGeo.size,
    localitaCoperte: localitaUniche.size,
    indice: (forme.length * tipiGeo.size) / localitaUniche.size
  };
}

// Identifica forme "marker" di un'area
function identificaFormeMarker(area) {
  return forme.filter(f => 
    f.localita === area && 
    !f.attestataAltrove
  );
}
```

---

## 4. Problematiche e anomalie

### 4.1 Problemi di encoding

**Problema**: Caratteri accentati corrotti

**Esempi**:
- `Citt�` invece di `Città`
- `aar�so` invece di `aarìso`
- `suppa` → `s�pp�a`

**Impatto**: 
- Visualizzazione corrotta nel frontend
- Necessità di correzione o mapping

**Soluzione proposta**:
1. Correzione batch del file sorgente
2. Mapping dictionary per conversione
3. Gestione fallback nel frontend

### 4.2 Anomalie temporali

**Problema**: Record con periodo errato

**Esempio**: 
```
Anno: 1526
Periodo: "I quarto dell'XI secolo"
IDPeriodo: 1
```

**Causa**: Probabile errore di data entry (XI secolo vs XVI secolo)

**Impatto**: Filtri temporali incoerenti

**Soluzione**: Validazione e correzione basata su colonna `Anno`

### 4.3 Spazi irregolari

**Problema**: Lemmi con trailing/leading spaces

**Esempio**: `agnolotto ` (con spazio finale)

**Impatto**: 
- Confronti stringa falliti
- Duplicati apparenti

**Soluzione**: Trim automatico in fase di parsing

### 4.4 Formato Datazione non strutturato

**Problema**: Campo testuale senza formato standard

**Esempi**:
- `1609`
- `1820, 6ª ed.`
- `fine XV sec.-inizio XVI sec.`
- `7 gennaio 1554 - 23 ottobre 1556`

**Impatto**: Difficile parsing automatico per filtri

**Soluzione**: Utilizzare colonne `Anno` e `IDPeriodo` per filtri programmatici

### 4.5 Categorie multi-valore

**Problema**: Campo testuale con separatore virgola

**Esempio**: `Carni derivati e preparazioni a base di carne,Condimenti vari`

**Impatto**: 
- Necessità di splitting per analisi
- Complessità filtri

**Soluzione**: 
- Parsing lato frontend
- Normalizzazione categorie
- UI multi-select

---

## 5. Raccomandazioni per il frontend

### 5.1 Parsing e normalizzazione

**Priorità alta**:
1. **Correzione encoding UTF-8**: fix caratteri accentati all'import
2. **Trim stringhe**: rimuovere spazi irregolari
3. **Parsing categorie**: split multi-valore in array
4. **Normalizzazione località**: mapping per geocoding
5. **Aggregazione forme per livello geografico**: calcolare metriche di variazione diatopica

**Esempio codice parsing**:
```javascript
function parseCSVRow(row) {
  return {
    idLemma: parseInt(row.IdLemma),
    lemma: row.Lemma.trim(),
    forma: row.Forma.trim(),
    localita: fixEncoding(row['Coll.Geografica']),
    tipoLocalita: fixEncoding(row['Tipo coll.Geografica']),
    anno: parseInt(row.Anno),
    periodo: row.Periodo,
    idPeriodo: parseInt(row.IDPeriodo),
    datazione: row.Datazione,
    categorie: row.Categoria.split(',').map(c => c.trim()),
    frequenza: parseInt(row.Frequenza),
    url: row.URL
  };
}

// Funzione per classificare livello geografico
function classificaLivelloGeografico(tipoLocalita) {
  if (tipoLocalita.includes('Citt')) return 'locale';
  if (tipoLocalita === 'Regione') return 'regionale';
  if (tipoLocalita.includes('sub')) return 'sub-regionale';
  if (tipoLocalita.includes('sovra')) return 'sovra-regionale';
  return 'altro';
}

// Funzione per aggregare forme per lemma e geografia
function aggregaFormePerGeografia(attestazioni) {
  const lemmi = {};
  
  attestazioni.forEach(att => {
    if (!lemmi[att.idLemma]) {
      lemmi[att.idLemma] = {
        lemma: att.lemma,
        formeLocali: new Set(),
        formeRegionali: new Set(),
        formeSubRegionali: new Set(),
        formeSovraRegionali: new Set(),
        formeTrasversali: new Set()
      };
    }
    
    const livello = classificaLivelloGeografico(att.tipoLocalita);
    
    switch(livello) {
      case 'locale':
        lemmi[att.idLemma].formeLocali.add(att.forma);
        break;
      case 'regionale':
        lemmi[att.idLemma].formeRegionali.add(att.forma);
        break;
      case 'sub-regionale':
        lemmi[att.idLemma].formeSubRegionali.add(att.forma);
        break;
      case 'sovra-regionale':
        lemmi[att.idLemma].formeSovraRegionali.add(att.forma);
        break;
    }
  });
  
  // Identifica forme trasversali
  Object.values(lemmi).forEach(lemma => {
    const alleForme = new Set([
      ...lemma.formeLocali,
      ...lemma.formeRegionali,
      ...lemma.formeSubRegionali,
      ...lemma.formeSovraRegionali
    ]);
    
    alleForme.forEach(forma => {
      let presenzeLivelli = 0;
      if (lemma.formeLocali.has(forma)) presenzeLivelli++;
      if (lemma.formeRegionali.has(forma)) presenzeLivelli++;
      if (lemma.formeSubRegionali.has(forma) || lemma.formeSovraRegionali.has(forma)) presenzeLivelli++;
      
      if (presenzeLivelli >= 3) {
        lemma.formeTrasversali.add(forma);
      }
    });
  });
  
  return lemmi;
}
```

### 5.2 Indicizzazione

**Indici consigliati** per performance:

1. **IdLemma**: raggruppamento forme
2. **Anno**: filtri temporali
3. **IDPeriodo**: ordinamento cronologico
4. **Coll.Geografica**: filtri geografici
5. **Categorie**: filtri tematici (array index)

### 5.3 Aggregazioni chiave

**Dashboard metrics**:

1. **Lemmi per periodo**: `GROUP BY IDPeriodo, COUNT DISTINCT IdLemma`
2. **Distribuzione geografica**: `GROUP BY Coll.Geografica, SUM(Frequenza)`
3. **Categorie dominanti**: `GROUP BY Categoria, COUNT(*)`
4. **Evoluzione forme**: `GROUP BY IdLemma, Anno, COUNT DISTINCT Forma`

### 5.4 Componenti UI

#### GeographicalDistributionMap.vue
- **Dati**: località, tipo località, frequenza aggregata
- **Necessità**: coordinate geografiche (geocoding)
- **Interattività**: click → dettagli attestazioni, filtri temporali

#### LemmaCategoriesTreemap.vue
- **Dati**: categorie (split multi-valore), frequenza aggregata
- **Gerarchia**: categoria principale → sottocategorie
- **Dimensione nodi**: somma frequenze

#### LemmaDetailsTable.vue
- **Dati**: tutte le colonne per lemma selezionato
- **Ordinamento**: Anno, Frequenza, Localita
- **Paginazione**: se >50 attestazioni

#### GlobalFilterBar.vue
- **Filtri**:
  - Range temporale (Anno: 1314-1899)
  - Periodo (dropdown 23 valori)
  - Località (autocomplete)
  - Tipo località (4 checkbox)
  - Categorie (multi-select)
  - Range frequenza (min-max)

### 5.5 Performance

**Ottimizzazioni**:

1. **Lazy loading**: carica dati paginati
2. **Virtual scrolling**: per liste lunghe
3. **Memoization**: cache aggregazioni
4. **Web Workers**: parsing CSV in background
5. **IndexedDB**: cache locale dataset

**Stima dimensioni**:
- File CSV: ~1-2 MB
- Parsed JSON: ~3-5 MB
- Gestibile in memoria browser

### 5.6 Geocoding località

**Località da mappare** (coordinate lat/lng):

**Città principali**:
- Roma, Napoli, Firenze, Torino, Milano, Bologna, Genova, Ferrara, Venezia, Mantova, Siena, Padova, Como, Macerata, Bolzano, Fermo

**Regioni**:
- Toscana, Lazio, Lombardia, Sicilia, Friuli-Venezia Giulia

**Ambiti sub-regionali**:
- Toscana sud-orientale, Toscana occidentale

**Ambiti sovra-regionali**:
- Italia mediana, Italia meridionale intermedia (coordinate centroidi approssimate)

**Soluzione proposta**: file JSON di mapping località → coordinate

```json
{
  "Roma": { "lat": 41.9028, "lng": 12.4964, "type": "Città" },
  "Napoli": { "lat": 40.8518, "lng": 14.2681, "type": "Città" },
  "Toscana": { "lat": 43.7711, "lng": 11.2486, "type": "Regione" }
}
```

---

## 6. Schema dati target (JSON parsed)

**Struttura ottimale post-parsing**:

```typescript
interface Attestazione {
  idLemma: number;
  lemma: string;
  forma: string;
  localita: {
    nome: string;
    tipo: 'Città' | 'Regione' | 'Ambito geografico sub regionale' | 'Ambito geografico sovra regionale';
    coordinate?: { lat: number; lng: number };
  };
  temporalita: {
    anno: number;
    periodo: string;
    idPeriodo: number;
    datazione: string;
  };
  categorie: string[];
  frequenza: number;
  url: string;
}

interface Lemma {
  id: number;
  lemma: string;
  forme: string[];
  attestazioni: Attestazione[];
  statistiche: {
    totaleAttestazioni: number;
    frequenzaTotale: number;
    periodoInizio: number;
    periodoFine: number;
    localitaUniche: number;
    categorieUniche: string[];
  };
  url: string;
}
```

---

## 7. Metriche e KPI

### 7.1 Metriche descrittive

| Metrica | Valore |
|---------|--------|
| Totale attestazioni | 6.236 |
| Lemmi unici | 365 |
| Forme uniche | 1.871 |
| Ratio forme/lemma | ~5,1 |
| Range temporale | 585 anni (1314-1899) |
| Località uniche | ~100+ |
| Categorie uniche | ~90 |
| Record multi-categoria | 1.714 (27,5%) |
| Frequenza media | 15,6 |
| Frequenza max | 2.120 |

### 7.2 Dashboard KPI

**Visualizzazioni consigliate**:

1. **Timeline distribuzione attestazioni** (anno x count)
2. **Mappa coropletica Italia** (località x frequenza)
3. **Treemap categorie** (categoria x frequenza)
4. **Top 10 lemmi** (lemma x frequenza totale)
5. **Evoluzione forme** (anno x count forme distinte)
6. **Heatmap spazio-temporale** (località x periodo x frequenza)

---

## 8. Esempi di query analitiche

### Query 1: Lemmi più frequenti
```javascript
const topLemmi = attestazioni
  .reduce((acc, a) => {
    acc[a.idLemma] = acc[a.idLemma] || { lemma: a.lemma, frequenza: 0 };
    acc[a.idLemma].frequenza += a.frequenza;
    return acc;
  }, {});
```

### Query 2: Evoluzione temporale categoria
```javascript
const evoluzioneCarni = attestazioni
  .filter(a => a.categorie.includes('Carni derivati e preparazioni a base di carne'))
  .reduce((acc, a) => {
    acc[a.anno] = (acc[a.anno] || 0) + 1;
    return acc;
  }, {});
```

### Query 3: Distribuzione geografica lemma
```javascript
function distribuzioneGeografica(idLemma) {
  return attestazioni
    .filter(a => a.idLemma === idLemma)
    .reduce((acc, a) => {
      acc[a.localita.nome] = (acc[a.localita.nome] || 0) + a.frequenza;
      return acc;
    }, {});
}
```

### Query 4: Categorie dominanti per periodo
```javascript
const categoriePeriodo = attestazioni
  .reduce((acc, a) => {
    const key = a.temporalita.periodo;
    acc[key] = acc[key] || {};
    a.categorie.forEach(cat => {
      acc[key][cat] = (acc[key][cat] || 0) + 1;
    });
    return acc;
  }, {});
```

### Query 5: Analisi variazione geografica per lemma
```javascript
// Calcola indice di variabilità geografica
function analizzaVariazioneGeografica(idLemma) {
  const attestazioni = getAttestazioniLemma(idLemma);
  
  const formePerLivello = {
    locale: new Set(),
    regionale: new Set(),
    subRegionale: new Set(),
    sovraRegionale: new Set()
  };
  
  const formePerLocalita = {};
  
  attestazioni.forEach(att => {
    const livello = classificaLivelloGeografico(att.tipoLocalita);
    
    if (livello === 'locale') formePerLivello.locale.add(att.forma);
    if (livello === 'regionale') formePerLivello.regionale.add(att.forma);
    if (livello.includes('sub')) formePerLivello.subRegionale.add(att.forma);
    if (livello.includes('sovra')) formePerLivello.sovraRegionale.add(att.forma);
    
    if (!formePerLocalita[att.localita]) {
      formePerLocalita[att.localita] = new Set();
    }
    formePerLocalita[att.localita].add(att.forma);
  });
  
  return {
    totaleFormeUniche: new Set(attestazioni.map(a => a.forma)).size,
    formeLocali: formePerLivello.locale.size,
    formeRegionali: formePerLivello.regionale.size,
    formeSubRegionali: formePerLivello.subRegionale.size,
    formeSovraRegionali: formePerLivello.sovraRegionale.size,
    localitaConFormeUniche: Object.entries(formePerLocalita)
      .filter(([_, forme]) => forme.size === 1)
      .map(([loc, _]) => loc),
    indiceVariabilita: (
      formePerLivello.locale.size + 
      formePerLivello.regionale.size + 
      formePerLivello.subRegionale.size + 
      formePerLivello.sovraRegionale.size
    ) / Object.keys(formePerLocalita).length
  };
}
```

### Query 6: Identificazione forme marker di un'area
```javascript
// Trova forme attestate esclusivamente in una specifica area geografica
function identificaFormeMarker(areaGeografica, tipoArea = 'Città') {
  const formeArea = attestazioni
    .filter(a => a.localita === areaGeografica && a.tipoLocalita === tipoArea)
    .map(a => ({ forma: a.forma, lemma: a.lemma, idLemma: a.idLemma }));
  
  const formeMarker = [];
  
  formeArea.forEach(({ forma, lemma, idLemma }) => {
    const attestazioniForma = attestazioni.filter(a => 
      a.idLemma === idLemma && a.forma === forma
    );
    
    const soloInQuestArea = attestazioniForma.every(a => 
      a.localita === areaGeografica
    );
    
    if (soloInQuestArea) {
      formeMarker.push({
        lemma,
        forma,
        frequenzaTotale: attestazioniForma.reduce((sum, a) => sum + a.frequenza, 0),
        periodoInizio: Math.min(...attestazioniForma.map(a => a.anno)),
        periodoFine: Math.max(...attestazioniForma.map(a => a.anno))
      });
    }
  });
  
  return formeMarker.sort((a, b) => b.frequenzaTotale - a.frequenzaTotale);
}

// Esempio di utilizzo
const formeGenovesi = identificaFormeMarker('Genova', 'Città');
// Risultato: forme come "aggiada", "aggiadda" per il lemma "agliata"
```

### Query 7: Evoluzione spazio-temporale di una forma
```javascript
// Traccia la diffusione geografica di una forma nel tempo
function tracciaEvoluzioneForma(idLemma, forma) {
  const attestazioniForma = attestazioni
    .filter(a => a.idLemma === idLemma && a.forma === forma)
    .sort((a, b) => a.anno - b.anno);
  
  const timeline = attestazioniForma.map(att => ({
    anno: att.anno,
    localita: att.localita,
    tipoLocalita: att.tipoLocalita,
    livelloGeografico: classificaLivelloGeografico(att.tipoLocalita),
    frequenza: att.frequenza
  }));
  
  // Analizza pattern di espansione geografica
  const livelli = [...new Set(timeline.map(t => t.livelloGeografico))];
  const espansioneGeografica = livelli.length > 1;
  
  const direzioneDiffusione = espansioneGeografica
    ? (livelli.includes('locale') && livelli.includes('regionale') 
        ? 'dal_locale_al_regionale' 
        : 'pattern_complesso')
    : 'stabile';
  
  return {
    forma,
    timeline,
    primaAttestazione: timeline[0],
    ultimaAttestazione: timeline[timeline.length - 1],
    durataDiffusione: timeline[timeline.length - 1].anno - timeline[0].anno,
    livelliGeografici: livelli,
    direzioneDiffusione,
    localitaRaggiunta: [...new Set(timeline.map(t => t.localita))]
  };
}
```

---

## 9. Checklist implementazione

### Fase 1: Data Processing
- [ ] Fix encoding UTF-8 caratteri accentati
- [ ] Trim spazi superflui
- [ ] Parse categorie multi-valore
- [ ] Validazione anomalie temporali
- [ ] Creazione mapping geocoding

### Fase 2: Data Modeling
- [ ] Definizione interfacce TypeScript
- [ ] Normalizzazione struttura dati
- [ ] Indicizzazione chiavi
- [ ] Aggregazioni pre-calcolate

### Fase 3: UI Components
- [ ] GlobalFilterBar con tutti i filtri
- [ ] GeographicalDistributionMap con mappa Italia
- [ ] LemmaCategoriesTreemap con gerarchia
- [ ] LemmaDetailsTable con sorting/paging
- [ ] Dashboard metriche riepilogative

### Fase 4: Performance
- [ ] Implementazione lazy loading
- [ ] Cache IndexedDB
- [ ] Web Workers parsing
- [ ] Ottimizzazione rendering liste

### Fase 5: Testing
- [ ] Test parsing dataset completo
- [ ] Test filtri combinati
- [ ] Test performance con 6K record
- [ ] Test edge cases (encoding, nulls)

---

## 10. Glossario

### Termini linguistici

- **Lemma**: Forma normalizzata/dizionariale di una parola (headword), rappresenta il concetto lessicale astratto
- **Forma**: Variante grafica, fonetica o morfologica attestata nelle fonti storiche
- **Attestazione**: Occorrenza documentata di un termine in un contesto specifico spazio-temporale
- **Corpus**: Insieme dei testi analizzati
- **Frequenza**: Numero di occorrenze di una forma nel corpus
- **Variazione diatopica**: Variazione linguistica nello spazio geografico (dialettale)
- **Isoglossa**: Linea geografica che delimita l'estensione di un fenomeno linguistico
- **Koinè**: Varietà linguistica sovraregionale, forma di compromesso tra dialetti
- **Scripta**: Tradizione scrittoria locale con convenzioni ortografiche proprie

### Classificazione geografica delle forme

- **Forma locale**: Variante attestata esclusivamente in una o più città specifiche (es. `aggiada` → solo Genova)
- **Forma regionale**: Variante attestata solo a livello di regione/i (es. `brasole` → Lazio e Toscana)
- **Forma macro-areale**: Variante attestata in ambiti sub-regionali o sovra-regionali (es. `brasciola` → Italia meridionale intermedia)
- **Forma trasversale**: Variante attestata a tutti i livelli geografici - città, regioni e macro-aree (es. `agliata`)
- **Forma marker**: Variante esclusiva di un'area geografica, indicatore di specificità dialettale

### Pattern di diffusione

- **Forma panitaliana**: Forma standardizzata o di grande diffusione attestata in molteplici aree geografiche
- **Forma di prestigio**: Variante che si diffonde da un centro culturale importante ad aree limitrofe
- **Variante conservativa**: Forma arcaica mantenuta in area geografica limitata
- **Espansione geografica**: Processo di diffusione di una forma da un livello locale a uno regionale/macro

### Termini tecnici

- **Treemap**: Visualizzazione gerarchica con aree proporzionali ai valori
- **Geocoding**: Conversione nome località → coordinate geografiche (latitudine, longitudine)
- **Long tail distribution**: Distribuzione statistica con molti valori bassi e pochi molto alti
- **Granularità geografica**: Livello di dettaglio della localizzazione (città < regione < macro-area)
- **Indice di variabilità**: Metrica che quantifica la diversità delle forme di un lemma su più livelli geografici

---

## Note finali

Questo dataset rappresenta una risorsa linguistica preziosa per:
- **Ricerca storico-linguistica**: evoluzione del lessico gastronomico
- **Digital humanities**: analisi diacroniche e geocentriche
- **Didattica**: insegnamento storia della lingua italiana
- **Divulgazione**: accessibilità patrimonio linguistico-culturale

Il frontend deve bilanciare:
- **Rigore scientifico**: preservare complessità e sfumature dei dati
- **Accessibilità**: rendere fruibili pattern e insight a utenti non specialisti
- **Performance**: gestire efficacemente volume dati e interattività

