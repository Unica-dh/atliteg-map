# Specifica del Dataset Lemmi_forme_atliteg.csv

## 1. Panoramica

Il file `Lemmi_forme_atliteg.csv` è il dataset principale del progetto ATLITEG (Atlante Lessicale dell'Italiano Tardo-antico e Medievale della Gastronomia). Contiene dati strutturati sulla terminologia gastronomica italiana storica, tracciando l'evoluzione lessicale nel tempo e nello spazio geografico.

### Statistiche generali
- **Totale record**: 6.236 righe (escludendo l'intestazione)
- **Lemmi unici**: 365
- **Forme uniche**: 1.871
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
**Descrizione**: Variante grafica attestata del lemma nelle fonti storiche

**Caratteristiche**:
- Tipo: Stringa
- 1.871 forme uniche per 365 lemmi (media ~5 forme per lemma)
- Include varianti dialettali, grafiche e morfologiche
- Riflette l'evoluzione ortografica storica

**Esempi per il lemma `agliata`:
- `alleata` (Napoli, 1314)
- `alleatam` (forma latina)
- `aggiada` (Genova, 1893)
- `agliata` (forma standard)
- `alliata`
- `aggiadda`

**Relazioni**:
- Un lemma può avere molte forme (1:N)
- La stessa forma può apparire in contesti diversi (spazio-temporali)

**Uso nel frontend**:
- Visualizzazione dettagli varianti
- Analisi evoluzione ortografica
- Filtri di ricerca avanzata

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

- **Lemma**: Forma normalizzata/dizionariale di una parola (headword)
- **Forma**: Variante grafica o morfologica attestata nelle fonti
- **Attestazione**: Occorrenza documentata di un termine in un contesto specifico
- **Corpus**: Insieme dei testi analizzati
- **Frequenza**: Numero di occorrenze nel corpus
- **Treemap**: Visualizzazione gerarchica con aree proporzionali
- **Geocoding**: Conversione nome località → coordinate geografiche
- **Long tail distribution**: Distribuzione con molti valori bassi e pochi molto alti

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

