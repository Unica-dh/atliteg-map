# Piano di Integrazione Regioni - ATLITEG Map

## Obiettivo
Aggiornare il database CSV per includere gli identificatori regionali (reg_istat_code) in modo da visualizzare i confini delle regioni sulla mappa quando appaiono lemmi di quelle regioni.

## Analisi dei File

### 1. File GeoJSON: limits_IT_regions.geojson
- Contiene i confini geografici di tutte le 20 regioni italiane
- Struttura delle proprietà:
  ```json
  {
    "reg_name": "Lombardia",
    "reg_istat_code_num": 3,
    "reg_istat_code": "03"
  }
  ```

### 2. File CSV: Lemmi_forme_atliteg_updated.csv
- Contiene 6237 righe di dati
- Colonne rilevanti:
  - `Coll.Geografica`: Nome della località (città, regione, ambito geografico)
  - `Tipo coll.Geografica`: Tipo di collocazione
  - `Latitudine`, `Longitudine`: Coordinate (quando disponibili)

- Tipi di collocazione geografica:
  - **Città** (4509 record) - hanno coordinate
  - **Regione** (599 record) - NON hanno coordinate (#N/A)
  - **Ambito geografico sovra regionale** (210 record)
  - **Ambito geografico sub regionale** (176 record)

### 3. Regioni presenti nel CSV
Attualmente solo 5 regioni sono presenti come "Tipo coll.Geografica = Regione":
- Lazio
- Lombardia
- Sicilia
- Toscana
- Veneto

## Mapping Regioni CSV → GeoJSON

| Nome CSV | Nome GeoJSON | reg_istat_code |
|----------|--------------|----------------|
| Lazio | Lazio | 12 |
| Lombardia | Lombardia | 03 |
| Sicilia | Sicilia | 19 |
| Toscana | Toscana | 09 |
| Veneto | Veneto | 05 |

**Nota**: I nomi corrispondono esattamente, quindi il mapping sarà diretto.

## Strategia di Implementazione

### Fase 1: Aggiunta Colonna al CSV
Aggiungere una nuova colonna `reg_istat_code` al file CSV che conterrà:
- Il codice ISTAT della regione (es. "03" per Lombardia) quando `Tipo coll.Geografica = "Regione"`
- Vuoto per le altre tipologie (Città, Ambito geografico, etc.)

### Fase 2: Script di Aggiornamento
Creare uno script Node.js che:
1. Legge il file CSV esistente
2. Legge il file GeoJSON per ottenere il mapping regioni → codici ISTAT
3. Per ogni riga del CSV:
   - Se `Tipo coll.Geografica === "Regione"`
   - Cerca il nome in `Coll.Geografica`
   - Trova il corrispondente `reg_istat_code` nel GeoJSON
   - Popola la nuova colonna `reg_istat_code`
4. Salva il CSV aggiornato come `Lemmi_forme_atliteg_updated.csv`

### Fase 3: Test
Creare un test che verifica:
- Tutte le 599 righe con "Regione" hanno un `reg_istat_code` valido
- I codici ISTAT sono corretti per ogni regione
- Le righe non-regionali hanno il campo vuoto
- Il numero totale di righe è invariato (6237)

### Fase 4: Integrazione Frontend
Dopo l'aggiornamento del CSV, il frontend potrà:
1. Leggere il campo `reg_istat_code` dai dati dei lemmi
2. Quando vengono visualizzati lemmi con `reg_istat_code` valorizzato
3. Caricare il GeoJSON e filtrare la feature corrispondente
4. Visualizzare il confine della regione sulla mappa

## Vantaggi della Soluzione

1. **Non invasiva**: Aggiunge solo una colonna senza modificare dati esistenti
2. **Scalabile**: Se in futuro si aggiungono altre regioni, basta eseguire lo script
3. **Performante**: Il codice ISTAT permette una ricerca diretta nel GeoJSON
4. **Manutenibile**: Lo script può essere riutilizzato per aggiornamenti futuri

## File da Creare

1. `scripts/update-region-codes.js` - Script di aggiornamento
2. `scripts/test-region-codes.js` - Test di verifica
3. `data/Lemmi_forme_atliteg_updated.csv` - CSV aggiornato (backup automatico dell'originale)

## Passi Successivi

1. ✅ Analizzare i file esistenti
2. 🔄 Creare lo script di aggiornamento
3. ⏳ Creare il test
4. ⏳ Eseguire lo script e verificare i risultati
5. ⏳ Integrare la visualizzazione nel frontend
