# Script di Gestione Codici ISTAT Regionali

Questa directory contiene gli script per aggiornare il database CSV con i codici ISTAT delle regioni italiane, permettendo la visualizzazione dei confini regionali sulla mappa.

## File

### update-region-codes.js
Script principale che aggiorna il CSV aggiungendo la colonna `reg_istat_code`.

**Funzionalità:**
- Legge il file GeoJSON delle regioni per ottenere il mapping nome → codice ISTAT
- Crea automaticamente un backup del CSV originale
- Aggiunge la colonna `reg_istat_code` a tutte le righe
- Popola il codice ISTAT solo per le righe con `Tipo coll.Geografica = "Regione"`
- Genera statistiche di esecuzione

**Utilizzo:**
```bash
node scripts/update-region-codes.js
```

**Output:**
- `data/Lemmi_forme_atliteg_updated.csv` - CSV aggiornato
- `data/Lemmi_forme_atliteg_updated.backup.csv` - Backup automatico

### test-region-codes.js
Suite di test completa per validare l'aggiornamento del CSV.

**Test eseguiti:**
1. **Conteggio Righe**: Verifica che tutte le righe "Regione" abbiano un codice
2. **Validità Codici**: Verifica che tutti i codici ISTAT siano validi
3. **Righe Non-Regione**: Verifica che le righe non-regionali non abbiano codice
4. **Distribuzione**: Mostra la distribuzione dei record per regione
5. **Integrità Dati**: Verifica che il numero totale di righe sia invariato

**Utilizzo:**
```bash
node scripts/test-region-codes.js
```

**Exit Code:**
- `0` - Tutti i test superati
- `1` - Uno o più test falliti

## Struttura Dati

### CSV Originale
```csv
IdLemma,Lemma,Forma,Coll.Geografica,Latitudine,Longitudine,Tipo coll.Geografica,...
2106,agliata,agliata,Lombardia,#N/A,#N/A,Regione,...
```

### CSV Aggiornato
```csv
IdLemma,Lemma,Forma,Coll.Geografica,Latitudine,Longitudine,Tipo coll.Geografica,...,reg_istat_code
2106,agliata,agliata,Lombardia,#N/A,#N/A,Regione,...,03
```

### GeoJSON Regioni
```json
{
  "properties": {
    "reg_name": "Lombardia",
    "reg_istat_code_num": 3,
    "reg_istat_code": "03"
  }
}
```

## Risultati Aggiornamento

### Statistiche
- **Righe totali**: 6236
- **Righe con tipo "Regione"**: 599
- **Regioni mappate**: 5/20 (25%)

### Distribuzione Record per Regione
| Codice ISTAT | Regione | Record |
|--------------|---------|--------|
| 03 | Lombardia | 140 |
| 05 | Veneto | 8 |
| 09 | Toscana | 200 |
| 12 | Lazio | 181 |
| 19 | Sicilia | 70 |

## Dipendenze

Pacchetti npm necessari:
```bash
npm install csv-parser csv-writer
```

## Workflow Completo

1. **Backup**: Lo script crea automaticamente un backup del CSV
2. **Aggiornamento**: Esegui lo script di aggiornamento
   ```bash
   node scripts/update-region-codes.js
   ```
3. **Validazione**: Esegui i test
   ```bash
   node scripts/test-region-codes.js
   ```
4. **Verifica manuale**: Controlla alcuni record
   ```bash
   grep ',Regione,' data/Lemmi_forme_atliteg_updated.csv | head -10
   ```

## Ripristino da Backup

Se necessario ripristinare la versione originale:
```bash
cp data/Lemmi_forme_atliteg_updated.backup.csv data/Lemmi_forme_atliteg_updated.csv
```

## Estensione Futura

Per aggiungere supporto ad altre regioni:
1. Aggiungi i dati nel CSV con `Tipo coll.Geografica = "Regione"`
2. Usa il nome esatto della regione come nel GeoJSON
3. Riesegui lo script di aggiornamento

**Nomi regioni validi** (dal GeoJSON):
- Piemonte
- Valle d'Aosta/Vallée d'Aoste
- Lombardia
- Trentino-Alto Adige/Südtirol
- Veneto
- Friuli-Venezia Giulia
- Liguria
- Emilia-Romagna
- Toscana
- Umbria
- Marche
- Lazio
- Abruzzo
- Molise
- Campania
- Puglia
- Basilicata
- Calabria
- Sicilia
- Sardegna

## Note Tecniche

- I codici ISTAT sono stringhe di 2 caratteri (es. "03", "19")
- Le regioni senza coordinate hanno `Latitudine = #N/A` e `Longitudine = #N/A`
- Il backup viene sempre ricreato ad ogni esecuzione dello script
- Il CSV usa la virgola come delimitatore
- Le coordinate nel CSV usano la virgola come separatore decimale (es. "43,7696")
