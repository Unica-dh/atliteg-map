# Guida al Caricamento CSV - AtLiTeG Backend

Questa guida spiega come utilizzare la funzionalità di caricamento CSV attraverso l'API backend di AtLiTeG.

## Prerequisiti

- Docker e Docker Compose installati
- Applicazione AtLiTeG in esecuzione (vedi [DOCKER_DEPLOY.md](DOCKER_DEPLOY.md))
- Tool `curl` e `jq` installati (opzionali ma consigliati)
- File CSV con i lemmi da caricare

## Panoramica del Processo

Il caricamento di un nuovo CSV segue questi passaggi:

1. **Autenticazione Admin**: Login per ottenere un token JWT
2. **Upload del File**: Caricamento del CSV tramite API autenticata
3. **Monitoraggio**: Verifica dello stato di processamento
4. **Validazione**: Controllo che i nuovi dati siano stati caricati correttamente

## 1. Autenticazione Admin

Prima di caricare un file, è necessario autenticarsi come amministratore per ottenere un token JWT.

### Richiesta

```bash
curl -X POST http://localhost:9000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}' | jq
```

### Risposta (Successo)

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNzM2NjEyMzQ1LCJleHAiOjE3MzY2MTU5NDV9.xyz..."
}
```

### Risposta (Errore)

```json
{
  "success": false,
  "message": "Credenziali non valide"
}
```

**⚠️ IMPORTANTE**: Salva il token ricevuto - sarà necessario per tutti i passaggi successivi.

## 2. Caricamento del File CSV

Utilizza il token JWT ricevuto per caricare il file CSV.

### Richiesta

```bash
curl -X POST http://localhost:9000/api/admin/upload \
  -H "Authorization: Bearer TUO_TOKEN_QUI" \
  -F "file=@/percorso/al/tuo/file.csv" | jq
```

**Esempio con percorso reale**:

```bash
curl -X POST http://localhost:9000/api/admin/upload \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -F "file=@./data/Lemmi_forme_atliteg_updated.csv" | jq
```

### Risposta (Successo)

```json
{
  "success": true,
  "message": "File caricato con successo. Processamento in corso...",
  "jobId": "1736612345678_Lemmi_forme_atliteg_updated.csv"
}
```

### Risposta (Errori Comuni)

**Token non valido o scaduto**:
```json
{
  "success": false,
  "message": "Token non valido o scaduto"
}
```

**File non fornito**:
```json
{
  "success": false,
  "message": "Nessun file fornito"
}
```

**Rate limit superato**:
```json
{
  "success": false,
  "message": "Troppi upload. Riprova tra qualche minuto."
}
```

**⚠️ IMPORTANTE**: Salva il `jobId` per monitorare lo stato del processamento.

## 3. Monitoraggio dello Stato di Processamento

Controlla lo stato di elaborazione del file caricato utilizzando il `jobId`.

### Richiesta

```bash
curl http://localhost:9000/api/admin/status/1736612345678_Lemmi_forme_atliteg_updated.csv \
  -H "Authorization: Bearer TUO_TOKEN_QUI" | jq
```

### Risposte Possibili

**In elaborazione**:
```json
{
  "jobId": "1736612345678_Lemmi_forme_atliteg_updated.csv",
  "status": "processing",
  "message": "Processamento in corso..."
}
```

**Completato con successo**:
```json
{
  "jobId": "1736612345678_Lemmi_forme_atliteg_updated.csv",
  "status": "completed",
  "message": "File processato con successo",
  "result": {
    "recordsProcessed": 6236,
    "outputFiles": ["lemmi.json", "geojson.json"],
    "processingTime": "2.5s"
  }
}
```

**Errore durante il processamento**:
```json
{
  "jobId": "1736612345678_Lemmi_forme_atliteg_updated.csv",
  "status": "error",
  "message": "Errore durante il processamento del CSV",
  "error": "Colonna 'lemma' mancante nel CSV"
}
```

**Job non trovato**:
```json
{
  "success": false,
  "message": "Job non trovato"
}
```

## 4. Validazione dei Dati Caricati

Dopo che il processamento è completato, verifica che i nuovi dati siano disponibili.

### Verifica tramite API

```bash
# Controlla il numero totale di lemmi caricati
curl -H "X-API-Key: default_dev_key" \
  http://localhost:9000/api/lemmi | jq '. | length'
```

**Risposta attesa**: Numero totale di record (es. `6236`)

### Verifica tramite Frontend

1. Apri il browser a http://localhost:9000
2. Attendi il caricamento della mappa
3. Verifica che i numeri nelle statistiche siano aggiornati:
   - **Lemmi**: 365
   - **Forme**: 1886
   - **Occorrenze**: 97261
   - **Località**: 26

### Verifica Log Backend

Controlla i log del backend per confermare il successo:

```bash
docker compose logs backend | tail -50
```

Cerca messaggi come:
```
✅ CSV processato con successo: 6236 record
📁 File salvati: lemmi.json, geojson.json
```

## Formato del File CSV

Il file CSV deve rispettare la seguente struttura:

### Colonne Obbligatorie

| Colonna | Tipo | Descrizione | Esempio |
|---------|------|-------------|---------|
| `lemma` | String | Lemma principale | `aceto` |
| `forme` | String | Forme varianti (separate da `;`) | `aceto;azeto;açeto` |
| `categorie` | String | Categorie (separate da `;`) | `condimento;liquido` |
| `periodi` | String | Periodi storici (separate da `;`) | `13I;13II;14I` |
| `geoAree` | String | Aree geografiche (separate da `;`) | `Toscana;Veneto` |
| `numerosità` | Number | Numero occorrenze | `150` |

### Esempio di Righe CSV

```csv
lemma,forme,categorie,periodi,geoAree,numerosità,formazioni_storiche,risorse,etymology
aceto,aceto;azeto;açeto,condimento;liquido,13I;13II;14I,Toscana;Veneto,150,acētum,VoSLIG,lat. acētum
aglio,aglio;aio;ajo,verdura;condimento,13III;14I,Toscana;Lombardia,320,allium,VoSLIG,lat. allium
```

### Encoding

- **Obbligatorio**: UTF-8
- **Separatore**: virgola (`,`)
- **Quote**: Doppi apici (`"`) per campi con virgole

## Sicurezza e Limitazioni

### Rate Limiting

- **Upload**: Massimo **5 caricamenti per ora** per IP
- **Login**: Massimo **5 tentativi per 15 minuti** per IP

Se superi il limite, riceverai un errore 429:
```json
{
  "success": false,
  "message": "Troppi upload. Riprova tra qualche minuto."
}
```

### Token JWT

- **Scadenza**: 1 ora dall'emissione
- **Rinnovo**: Esegui nuovamente il login quando il token scade
- **Storage**: Non salvare mai il token in file non protetti

### Backup Automatico

Prima di sovrascrivere i dati esistenti, il sistema crea automaticamente un backup:

- **Posizione**: `lemmario-dashboard/server/data/backup/`
- **Formato**: `lemmi_backup_YYYYMMDD_HHMMSS.json`
- **Conservazione**: Tutti i backup vengono mantenuti

Puoi visualizzare i backup nel container:

```bash
docker compose exec backend ls -lah /app/data/backup/
```

## Troubleshooting

### Problema: "Token non valido o scaduto"

**Soluzione**: Esegui nuovamente il login per ottenere un nuovo token.

```bash
curl -X POST http://localhost:9000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}' | jq
```

### Problema: "Job non trovato"

**Causa**: Il `jobId` è errato o il job è stato completato da troppo tempo.

**Soluzione**: 
1. Verifica di aver copiato correttamente il `jobId`
2. I job completati vengono mantenuti solo per un periodo limitato

### Problema: "Errore durante il processamento del CSV"

**Causa**: Il file CSV non è formattato correttamente.

**Soluzione**:
1. Verifica che tutte le colonne obbligatorie siano presenti
2. Controlla l'encoding del file (deve essere UTF-8)
3. Valida il formato CSV (separatori, quote, caratteri speciali)

### Problema: Upload si blocca durante il processamento

**Causa**: File CSV troppo grande o errori nel parsing.

**Soluzione**:
1. Controlla i log del backend: `docker compose logs backend`
2. Verifica che il file non superi le dimensioni massime (100MB)
3. Prova con un subset dei dati per isolare il problema

## Credenziali di Default

### ⚠️ PER SOLO TESTING - CAMBIARE IN PRODUZIONE

```
Admin Username: admin
Admin Password: admin
API Key Frontend: default_dev_key
JWT Secret: your_jwt_secret_change_in_production
```

### Come Cambiare le Credenziali

Modifica il file `.env` nella root del progetto:

```env
ADMIN_USERNAME=tuo_nuovo_username
ADMIN_PASSWORD_HASH=$2b$10$HASH_DELLA_TUA_PASSWORD
FRONTEND_API_KEYS=tua_nuova_api_key_sicura
JWT_SECRET=tuo_jwt_secret_molto_lungo_e_casuale
```

Per generare l'hash della password:

```bash
node -e "console.log(require('bcrypt').hashSync('tua_password', 10))"
```

## Logging e Audit

Tutti i caricamenti CSV vengono registrati nei log per audit e debugging.

### Visualizzare i Log

```bash
# Log in tempo reale
docker compose logs -f backend

# Ultimi 100 log
docker compose logs backend --tail=100

# Log salvati nel container
docker compose exec backend cat /app/logs/combined.log
```

### Informazioni Registrate

- Timestamp del caricamento
- Username dell'admin
- Nome del file caricato
- Numero di record processati
- Eventuali errori
- Tempo di processamento

## Script di Esempio Completo

Ecco uno script bash completo per automatizzare il processo di upload:

```bash
#!/bin/bash

# Configurazione
API_URL="http://localhost:9000"
USERNAME="admin"
PASSWORD="admin"
CSV_FILE="./data/Lemmi_forme_atliteg_updated.csv"

echo "🔐 Step 1: Login admin..."
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/api/admin/login" \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"$USERNAME\",\"password\":\"$PASSWORD\"}")

TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.token')

if [ "$TOKEN" == "null" ]; then
  echo "❌ Errore: Login fallito"
  echo $LOGIN_RESPONSE | jq
  exit 1
fi

echo "✅ Login effettuato con successo"

echo ""
echo "📤 Step 2: Upload del CSV..."
UPLOAD_RESPONSE=$(curl -s -X POST "$API_URL/api/admin/upload" \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@$CSV_FILE")

JOB_ID=$(echo $UPLOAD_RESPONSE | jq -r '.jobId')

if [ "$JOB_ID" == "null" ]; then
  echo "❌ Errore: Upload fallito"
  echo $UPLOAD_RESPONSE | jq
  exit 1
fi

echo "✅ File caricato con successo"
echo "📋 Job ID: $JOB_ID"

echo ""
echo "⏳ Step 3: Monitoraggio stato..."
sleep 2

STATUS="processing"
while [ "$STATUS" == "processing" ]; do
  STATUS_RESPONSE=$(curl -s "$API_URL/api/admin/status/$JOB_ID" \
    -H "Authorization: Bearer $TOKEN")
  
  STATUS=$(echo $STATUS_RESPONSE | jq -r '.status')
  echo "📊 Stato: $STATUS"
  
  if [ "$STATUS" == "processing" ]; then
    sleep 2
  fi
done

echo ""
if [ "$STATUS" == "completed" ]; then
  echo "✅ Processamento completato con successo!"
  echo $STATUS_RESPONSE | jq
else
  echo "❌ Errore durante il processamento"
  echo $STATUS_RESPONSE | jq
fi
```

Salva questo script come `upload_csv.sh`, rendilo eseguibile e usalo:

```bash
chmod +x upload_csv.sh
./upload_csv.sh
```

## Riferimenti

- [DOCKER_DEPLOY.md](DOCKER_DEPLOY.md) - Guida completa al deployment
- [BACKEND_IMPLEMENTATION_SUMMARY.md](BACKEND_IMPLEMENTATION_SUMMARY.md) - Documentazione API completa
- [build-docker.sh](build-docker.sh) - Script di build automatico

## Supporto

Per problemi o domande:
1. Controlla i log: `docker compose logs backend`
2. Verifica lo stato dei container: `docker compose ps`
3. Consulta la documentazione API in [BACKEND_IMPLEMENTATION_SUMMARY.md](BACKEND_IMPLEMENTATION_SUMMARY.md)
