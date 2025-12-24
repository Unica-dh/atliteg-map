# Guida alla Sincronizzazione Dati

## Panoramica

Lo script `sync-data.sh` permette di sincronizzare i file nella cartella `/data` (che non sono sotto controllo Git) tra l'ambiente locale e il server remoto.

## Configurazione Server

- **Host**: 90.147.144.147
- **User**: dhruby
- **Path remoto**: `/home/dhruby/docker/atliteg-map/data`
- **Path locale**: `./data`

## Prerequisiti

### 1. Accesso SSH

Assicurati di poter accedere al server via SSH:

```bash
ssh dhruby@90.147.144.147
```

### 2. Configurazione SSH senza password (consigliata)

Per evitare di inserire la password ogni volta, configura l'autenticazione con chiave SSH:

```bash
# Genera una chiave SSH se non ce l'hai già
ssh-keygen -t ed25519 -C "your_email@example.com"

# Copia la chiave sul server remoto
ssh-copy-id dhruby@90.147.144.147
```

Dopo questa configurazione, potrai connetterti senza password.

### 3. rsync installato

Lo script usa `rsync` per la sincronizzazione. Su Linux è generalmente già installato.

## Utilizzo

### Comandi Principali

#### 1. Visualizzare l'aiuto
```bash
./sync-data.sh help
```

#### 2. Confrontare i file
Prima di sincronizzare, è buona pratica vedere le differenze:

```bash
./sync-data.sh compare
```

Questo mostra:
- File presenti solo in locale
- File presenti solo in remoto  
- File modificati più recenti

#### 3. Vedere le dimensioni
```bash
./sync-data.sh sizes
```

#### 4. Elencare i file
```bash
./sync-data.sh list
```

#### 5. Creare un backup locale
Prima di operazioni importanti:

```bash
./sync-data.sh backup
```

Crea una copia della directory locale con timestamp.

### Sincronizzazione

#### Push: Locale → Remoto

Invia i dati locali al server:

```bash
# Con dry-run (simulazione + conferma)
./sync-data.sh push

# Senza dry-run (diretto)
./sync-data.sh push --no-dry-run
```

**Quando usarlo:**
- Hai modificato/aggiunto file localmente
- Vuoi aggiornare il server con le tue modifiche

#### Pull: Remoto → Locale

Scarica i dati dal server:

```bash
# Con dry-run (simulazione + conferma)
./sync-data.sh pull

# Senza dry-run (diretto)
./sync-data.sh pull --no-dry-run
```

**Quando usarlo:**
- Hai modificato file sul server
- Vuoi scaricare dati dal server
- Stai configurando un nuovo ambiente locale

## Workflow Consigliato

### Scenario 1: Prima sincronizzazione (nuovo ambiente)

```bash
# 1. Confronta cosa c'è sul server
./sync-data.sh compare

# 2. Se necessario, scarica i dati dal server
./sync-data.sh pull
```

### Scenario 2: Aggiornamento dati locali al server

```bash
# 1. Crea un backup di sicurezza
./sync-data.sh backup

# 2. Confronta le differenze
./sync-data.sh compare

# 3. Invia i dati al server
./sync-data.sh push
```

### Scenario 3: Sincronizzazione bidirezionale

Se ci sono modifiche sia in locale che in remoto, procedi con cautela:

```bash
# 1. Backup locale
./sync-data.sh backup

# 2. Vedi le differenze
./sync-data.sh compare

# 3. Decidi quale direzione sincronizzare
# - Se le modifiche locali sono più importanti: push
# - Se le modifiche remote sono più importanti: pull
```

## File Sincronizzati

La cartella `/data` contiene:
- `Ambiti geolinguistici newline.json`
- `Ambiti geolinguistici newline.qmd`
- `Lemmi_forme_atliteg.csv`
- `Lemmi_forme_atliteg_updated.csv`
- `Lemmi_forme_atliteg_updated.backup.csv`
- `backup_completo.gpkg`
- `geojson.jpg`
- `limits_IT_regions.geojson`

## Esclusioni

Lo script esclude automaticamente:
- File temporanei (`*.tmp`)
- File di swap (`*.swp`)
- File di sistema (`.DS_Store`)

## Sicurezza

### Modalità Dry-Run

Per impostazione predefinita, i comandi `push` e `pull` eseguono prima una **dry-run** (simulazione):

1. Mostra cosa verrà sincronizzato
2. Chiede conferma prima di procedere

Questo previene sincronizzazioni accidentali.

### Opzione --no-dry-run

Usa solo se sei sicuro:

```bash
./sync-data.sh push --no-dry-run
```

⚠️ **Attenzione**: Questo salta la simulazione e procede direttamente.

## Troubleshooting

### Errore di connessione SSH

```
✗ Impossibile connettersi al server remoto
```

**Soluzione:**
1. Verifica che il server sia raggiungibile: `ping 90.147.144.147`
2. Verifica le credenziali SSH: `ssh dhruby@90.147.144.147`
3. Controlla il firewall

### Permission denied

**Soluzione:**
```bash
chmod +x sync-data.sh
```

### Directory non trovata

Se il server non ha la directory `/home/dhruby/docker/atliteg-map/data`:

```bash
# Lo script la crea automaticamente durante il push
./sync-data.sh push
```

### Conflitti di file

Se ci sono file sia in locale che in remoto con modifiche diverse:

1. Usa `compare` per vedere le differenze
2. Crea un backup: `./sync-data.sh backup`
3. Sincronizza nella direzione desiderata
4. Controlla manualmente i file conflittuali

## Automazione

### Cron Job per sincronizzazione automatica

Per automatizzare la sincronizzazione (ad esempio, ogni giorno alle 2:00):

```bash
# Modifica crontab
crontab -e

# Aggiungi questa riga
0 2 * * * cd /home/ale/docker/atliteg-map && ./sync-data.sh push --no-dry-run >> /var/log/atliteg-sync.log 2>&1
```

⚠️ **Nota**: L'automazione con `--no-dry-run` richiede attenzione. Assicurati che non ci siano conflitti.

## Note Importanti

1. **Backup**: Fai sempre un backup prima di sincronizzazioni importanti
2. **Dry-run**: Usa sempre la modalità predefinita (con dry-run) per operazioni manuali
3. **Direzione**: Assicurati di scegliere la direzione corretta (push vs pull)
4. **Conflitti**: In caso di dubbi, confronta prima con `compare`
5. **Git**: Questi file NON sono sotto controllo Git per design (sono dati di grandi dimensioni)

## Supporto

Per problemi o domande, consulta:
- La documentazione principale: [README.md](README.md)
- L'architettura: [system-architecture.md](../architecture/system-architecture.md)
- Questa guida: `./sync-data.sh help`
