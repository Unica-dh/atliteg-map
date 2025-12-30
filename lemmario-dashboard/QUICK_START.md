# 🚀 Quick Start Guide - Dashboard Lemmario AtLiTeG

## Avvio Rapido

### Prerequisiti

- Node.js 18+ installato
- Docker e Docker Compose (opzionale, solo per produzione)

### Sviluppo Locale

```bash
# 1. Vai nella directory del progetto
cd /home/ale/docker/atliteg-map/lemmario-dashboard

# 2. Installa le dipendenze (se non già fatto)
npm install

# 3. Avvia il server di sviluppo
npm run dev

# 4. Apri il browser
# L'app sarà disponibile su http://localhost:3000
```

### Produzione con Docker

```bash
# 1. Vai nella directory del progetto
cd /home/ale/docker/atliteg-map/lemmario-dashboard

# 2. Builda e avvia i container
docker-compose up --build

# 3. Apri il browser
# L'app sarà disponibile su http://localhost:9000
```

## 📱 Come Usare l'Applicazione

### 1. Esplorazione Iniziale

All'apertura dell'app vedrai:

- **Header** con logo e titolo del progetto
- **Barra filtri** in alto (Categoria, Periodo, Reset)
- **Metriche** che mostrano totali (località, lemmi, anni, attestazioni)
- **Mappa** vuota (nessun marker al primo caricamento)
- **Timeline** con gli anni del dataset
- **Indice alfabetico** con lettere A-Z
- **Pannello dettaglio** vuoto (con messaggio informativo)

### 2. Applicare Filtri

#### Filtro per Categoria

1. Click sul menu a tendina "Categoria"
2. Seleziona una o più categorie (es. "Salse", "Dolci")
3. La mappa si popola con i marker
4. Tutti i componenti si aggiornano automaticamente

#### Filtro per Periodo

1. Click sul menu a tendina "Periodo"
2. Seleziona uno o più periodi storici
3. I dati si filtrano di conseguenza

#### Reset Filtri

- Click sul pulsante "Reset Filters" per azzerare tutti i filtri

### 3. Ricerca

1. Click sulla barra di ricerca sopra la mappa
2. Inizia a digitare un lemma o una forma
3. Appariranno suggerimenti con autocompletamento
4. Click su un suggerimento per selezionare quel lemma
5. Usa ↑↓ per navigare, Enter per selezionare
6. Click su X per cancellare la ricerca

### 4. Mappa Interattiva

- **Zoom**: Usa i controlli + e - o rotella del mouse
- **Pan**: Trascina la mappa con il mouse
- **Cluster circolari**: Tutti i marker sono visualizzati come cerchi con numeri (somma delle occorrenze)
  - I cerchi **blu** indicano bassa frequenza (< 20 occorrenze)
  - I cerchi **arancioni** indicano media frequenza (20-100 occorrenze)
  - I cerchi **rossi** indicano alta frequenza (> 100 occorrenze)
  - Il numero all'interno mostra la somma totale delle occorrenze dei lemmi
  - Anche i marker singoli sono visualizzati come cerchi (non come pin)
- **Clustering dinamico**: I cerchi si aggregano automaticamente in base allo zoom
  - Quando fai zoom out, i cerchi vicini si uniscono mostrando la somma delle occorrenze
  - Quando fai zoom in, i cluster si espandono mostrando cerchi più piccoli
  - Click su un cluster per fare zoom sulla zona
- **Poligoni**: Aree geografiche sono evidenziate con poligoni colorati
- **Conteggio**: In alto a destra vedi "X locations • Y lemmas"

### 5. Timeline Storica

- **Navigazione**: Usa le frecce ← → per scorrere gli anni
- **Selezione**: Click su un anno per filtrare i dati di quell'anno
- **Legenda**:
  - Punti blu pieni = anni con attestazioni
  - Punti vuoti = anni senza attestazioni
  - Punto blu intenso = anno selezionato
- **Info**: Sotto ogni anno vedi i lemmi e località attestati

### 6. Indice Alfabetico

- **Lettere evidenziate**: Contengono lemmi
- **Lettere grigie**: Nessun lemma per quella lettera
- **Click lettera**: Filtra e mostra tutti i lemmi che iniziano con quella lettera
- **Lista sotto**: Vedi l'elenco completo dei lemmi per la lettera selezionata

### 7. Pannello Dettaglio Lemma

Quando selezioni un lemma (da mappa, ricerca o indice), vedrai:

- **Lemma principale** con numero di forme
- **Forme**: Tutte le varianti attestate
- **Località**: Dove è attestato
- **Anno/Periodo**: Datazione
- **Categorie**: Tag semantici (es. "Salse", "Dolci")
- **Frequenza**: Se disponibile
- **URL**: Link a risorse esterne
- **IdAmbito**: Se relativo ad area geografica

### 8. Sincronizzazione

Tutti i componenti sono sincronizzati:

- Seleziona una **categoria** → Mappa, timeline e indice si aggiornano
- Cerca un **lemma** → Tutti i componenti mostrano solo quel lemma
- Click su **lettera** → Mappa e timeline filtrate per quella lettera
- Click su **anno** → Tutti i componenti mostrano solo quell'anno
- Click su **marker** → Dettaglio lemma si aggiorna

## 🎮 Flussi di Utilizzo Comuni

### Scenario 1: "Voglio vedere tutte le attestazioni di una categoria specifica"

1. Seleziona categoria dal filtro (es. "Salse")
2. Osserva i marker sulla mappa
3. Scorri la timeline per vedere la distribuzione temporale
4. Click su un marker per dettagli

### Scenario 2: "Cerco un lemma specifico"

1. Digita il nome nella barra di ricerca
2. Seleziona il lemma dall'autocompletamento
3. Vedi tutte le sue occorrenze sulla mappa
4. Leggi i dettagli nel pannello destro

### Scenario 3: "Esploro un periodo storico"

1. Seleziona periodo dal filtro (es. "XIV secolo")
2. Naviga la timeline per vedere gli anni con attestazioni
3. Click su un anno specifico
4. Osserva lemmi e località sulla mappa

### Scenario 4: "Voglio vedere tutti i lemmi che iniziano con una lettera"

1. Click sulla lettera nell'indice alfabetico (es. "A")
2. Vedi l'elenco completo sotto l'indice
3. Osserva la distribuzione geografica sulla mappa
4. Click su un lemma per dettagli

### Scenario 5: "Analisi geografica di una categoria in un periodo"

1. Seleziona categoria (es. "Vini")
2. Seleziona periodo (es. "XV secolo")
3. Osserva la concentrazione geografica sulla mappa
4. Esplora i singoli lemmi

## ⚡ Scorciatoie da Tastiera

- **Tab**: Naviga tra i controlli
- **Enter**: Attiva pulsanti e conferma selezioni
- **Escape**: Chiude dropdown e autocompletamento
- **↑ ↓**: Naviga suggerimenti ricerca
- **Space**: Attiva checkbox/toggle

## 🔧 Troubleshooting

### "La mappa non mostra marker"

**Causa**: Comportamento normale al primo caricamento

**Soluzione**: Applica un filtro o effettua una ricerca

### "Nessun risultato trovato"

**Causa**: Filtri troppo restrittivi

**Soluzione**: Click su "Reset Filters" e riprova

### "L'applicazione è lenta"

**Causa**: Dataset grande con tutti i dati visibili

**Soluzione**: Usa i filtri per ridurre i dati visualizzati

### "Errore nel caricamento dei dati"

**Causa**: File CSV o GeoJSON non trovati

**Soluzione**:
1. Verifica che i file siano in `public/data/`
2. Controlla la console del browser (F12)
3. Ricarica la pagina (Ctrl+R / Cmd+R)

## 📊 Interpretare le Metriche

Le metriche in alto mostrano:

- **Località**: Numero di località uniche con attestazioni
- **Lemmi**: Numero di lemmi unici
- **Anni**: Numero di anni con attestazioni
- **Attestazioni**: Numero totale di occorrenze

Questi valori cambiano in base ai filtri applicati.

## 💡 Tips & Tricks

1. **Combinazione filtri**: Combina categoria + periodo per analisi specifiche
2. **Reset veloce**: Usa "Reset Filters" per ricominciare da capo
3. **Esplora timeline**: Usa le frecce per scoprire pattern temporali
4. **Dettaglio lemma**: Scorri il pannello destro per vedere tutte le forme
5. **Zoom mappa**: Usa lo zoom per vedere dettagli geografici

## 🎯 Obiettivi dell'Applicazione

Questa dashboard ti permette di:

- ✅ Esplorare il corpus del Lemmario AtLiTeG
- ✅ Visualizzare la distribuzione geografica dei lemmi
- ✅ Analizzare l'evoluzione temporale del lessico gastronomico
- ✅ Filtrare e cercare attestazioni specifiche
- ✅ Navigare il dataset in modo intuitivo e interattivo

## 📚 Risorse Aggiuntive

- **Documentazione completa**: Vedi `README.md`
- **Dettagli implementazione**: Vedi `IMPLEMENTAZIONE.md`
- **Test checklist**: Vedi `TEST_CHECKLIST.md`

## 🆘 Supporto

Per problemi o domande:

1. Controlla questa guida
2. Leggi la documentazione completa
3. Verifica la console del browser (F12)
4. Controlla i logs (Docker: `docker-compose logs -f`)

---

**Buona esplorazione del Lemmario AtLiTeG!** 🍝🍷📖
