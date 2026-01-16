# 🔐 Data Security & Setup

## ⚠️ IMPORTANTE: Dati Sensibili

I file di dati lemmi **NON sono inclusi** in questo repository per ragioni di sicurezza e privacy.  
Contengono dati di ricerca sensibili del progetto VoSLIG.

## 📁 File Necessari per l'Esecuzione

Per far funzionare l'applicazione, è necessario fornire i seguenti file:

### File Required (Non in Git)

```
lemmario-dashboard/server/data/lemmi.json    # Dati lemmi processati
```

### File Opzionali

```
data/lemmi.json                              # Backup/sorgente originale
data/Lemmi_forme_atliteg_updated.csv         # CSV originale
```

## 🚀 Setup per Sviluppo Locale

### 1. Ottieni i File Dati

Contatta i responsabili del progetto per ottenere i file `lemmi.json`:
- **Responsabili Atlante**: Giovanni Urraci, Monica Alba
- **PI PRIN**: Prof.ssa Giovanna Frosini

### 2. Posiziona i File

```bash
# File principale (OBBLIGATORIO)
cp /path/to/your/lemmi.json lemmario-dashboard/server/data/

# Verifica permessi
chmod 600 lemmario-dashboard/server/data/lemmi.json
```

### 3. Avvia l'Applicazione

```bash
docker compose up -d
```

L'applicazione caricherà i dati da `lemmario-dashboard/server/data/lemmi.json` tramite API.

## 🔒 Sicurezza Production

### Configurazione Server

1. **Carica file via SCP/SFTP** (MAI via git):
   ```bash
   scp lemmi.json user@server:/var/atliteg/data/
   ```

2. **Set permessi restrittivi**:
   ```bash
   chmod 600 /var/atliteg/data/lemmi.json
   chown app-user:app-group /var/atliteg/data/lemmi.json
   ```

3. **Volume Docker**:
   ```yaml
   volumes:
     - /var/atliteg/data:/app/data:ro  # Read-only!
   ```

### Nginx Security

Il file `nginx.conf` include protezioni per impedire download diretto:

```nginx
# ❌ BLOCCO file dati sensibili
location /data/ { deny all; return 404; }
location ~ \.(csv)$ { deny all; return 404; }
location ~ (lemmi|Lemmi_).*\.(json|csv)$ { deny all; return 404; }
```

**Test sicurezza**:
```bash
# Questi DEVONO fallire (404):
curl http://your-domain/data/lemmi.json          # ❌
curl http://your-domain/server/data/lemmi.json   # ❌

# Questo DEVE funzionare (con API key):
curl -H "X-API-Key: $KEY" http://your-domain/api/lemmi  # ✅
```

## 📤 Upload CSV Admin

L'applicazione include un'interfaccia admin per caricare nuovi dati:

1. Vai a `http://localhost:9000/admin/upload`
2. Login con credenziali admin (vedi `.env`)
3. Carica file CSV
4. I dati vengono processati e salvati in `server/data/lemmi.json`

## 🔐 Best Practices

### ✅ DO
- Carica file dati via SCP/SFTP o interfaccia admin
- Usa permessi restrittivi (600) sui file dati
- Mantieni backup sicuri fuori dal repository
- Usa variabili d'ambiente per credenziali

### ❌ DON'T
- **MAI** committare file lemmi.json o .csv in git
- **MAI** condividere file dati pubblicamente
- **MAI** esporre directory `/data` o `/server` via web
- **MAI** usare API key di default in production

## 🆘 Troubleshooting

### Errore: "Dati non trovati"

```bash
# Verifica che il file esista
ls -lh lemmario-dashboard/server/data/lemmi.json

# Se mancante, copia dai backup
cp /backup/lemmi.json lemmario-dashboard/server/data/
```

### Errore: "API error 500"

```bash
# Verifica permessi
chmod 600 lemmario-dashboard/server/data/lemmi.json

# Verifica proprietario
chown $(whoami) lemmario-dashboard/server/data/lemmi.json

# Riavvia backend
docker compose restart backend
```

## 📚 Documentazione Aggiuntiva

- [Piano Sicurezza Dati](docs/security/LEMMI_DATA_SECURITY_PLAN.md)
- [Guida Upload CSV](docs/guides/upload-refresh-guide.md)
- [Test Report Backend-Only](docs/guides/backend-only-test-report.md)

---

**RICORDA**: I dati lemmi sono proprietà intellettuale del progetto VoSLIG e non possono essere redistribuiti senza autorizzazione. 🔐
