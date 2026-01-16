# 🔐 Piano di Sicurezza Dati Lemmi

**Data**: 16 gennaio 2026  
**Criticità**: 🔴 ALTA - Dati sensibili tracciati su git  
**Obiettivo**: Rimuovere completamente i file lemmi da git e garantire sicurezza

---

## 🚨 Situazione Attuale (CRITICA)

### File Sensibili Tracciati su Git
```
❌ data/lemmi.json (2.5 MB)
❌ data/Lemmi_forme_atliteg.csv
❌ data/Lemmi_forme_atliteg_updated.csv
❌ lemmario-dashboard/public/data/lemmi.json
❌ lemmario-dashboard/public/data/Lemmi_forme_atliteg.csv
❌ lemmario-dashboard/public/data/Lemmi_forme_atliteg_updated.csv
❌ lemmario-dashboard/server/data/lemmi.json
❌ test_10_lemmi.csv
```

**RISCHIO**: Questi file sono nel repository git e potrebbero essere:
- Visibili nello storico git
- Accessibili su GitHub/remote
- Scaricabili da chiunque abbia accesso al repo

---

## 📋 Piano di Intervento (6 Fasi)

### FASE 1: Backup Sicuro
**Obiettivo**: Salvare i dati prima di rimuoverli da git

**Azioni**:
```bash
# 1. Crea directory backup FUORI dal repository
mkdir -p ~/atliteg-lemmi-backup-$(date +%Y%m%d)

# 2. Copia tutti i file lemmi
cp data/lemmi.json ~/atliteg-lemmi-backup-*/
cp data/*.csv ~/atliteg-lemmi-backup-*/
cp lemmario-dashboard/server/data/lemmi.json ~/atliteg-lemmi-backup-*/lemmi-server.json

# 3. Verifica backup
ls -lh ~/atliteg-lemmi-backup-*/
```

**Risultato atteso**: ✅ Backup sicuro fuori dal repository

---

### FASE 2: Aggiornamento .gitignore
**Obiettivo**: Impedire tracking futuro di file sensibili

**File da creare/modificare**: `.gitignore`

**Regole da aggiungere**:
```gitignore
# ========================================
# DATI SENSIBILI - NON TRACCIARE MAI!
# ========================================

# File lemmi (dati sensibili)
**/lemmi.json
**/Lemmi_*.csv
**/*lemmi*.csv
**/*lemmi*.json

# Directory dati sensibili
data/*.csv
data/*.json
!data/*.geojson  # GeoJSON pubblici OK
!data/limits_IT_regions.geojson

# Backend data (solo server runtime)
lemmario-dashboard/server/data/*.json
lemmario-dashboard/server/data/*.csv
!lemmario-dashboard/server/data/.gitkeep

# Public data (già spostati, non dovrebbero esistere)
lemmario-dashboard/public/data/*.csv
lemmario-dashboard/public/data/lemmi.json
lemmario-dashboard/public/data/Lemmi_*.csv

# Upload e backup (runtime only)
lemmario-dashboard/server/uploads/*
!lemmario-dashboard/server/uploads/.gitkeep
lemmario-dashboard/server/uploads/backup/*

# Build output
lemmario-dashboard/out/

# Test files
test_*.csv
*_test.csv
*_TEST.csv

# Deleted files (già spostati)
deleted/
```

**Comando**:
```bash
# Aggiungi le regole a .gitignore
cat >> .gitignore << 'EOF'

# ========================================
# DATI SENSIBILI - NON TRACCIARE MAI!
# ========================================
[regole sopra]
EOF
```

**Risultato atteso**: ✅ .gitignore aggiornato

---

### FASE 3: Rimozione dal Working Tree
**Obiettivo**: Rimuovere file dal tracking git (ma mantenerli su disco)

**Comando**:
```bash
# IMPORTANTE: --cached rimuove da git MA mantiene su disco!

# Rimuovi file lemmi dalla root
git rm --cached data/lemmi.json
git rm --cached data/Lemmi_*.csv
git rm --cached test_10_lemmi.csv

# Rimuovi da public (già spostati in deleted/)
git rm --cached lemmario-dashboard/public/data/lemmi.json
git rm --cached lemmario-dashboard/public/data/Lemmi_*.csv

# Rimuovi da server/data
git rm --cached lemmario-dashboard/server/data/lemmi.json

# Verifica cosa verrà committato
git status
```

**Risultato atteso**: ✅ File rimossi da git index ma presenti su disco

---

### FASE 4: Commit Rimozione
**Obiettivo**: Committare la rimozione dei file sensibili

**Comando**:
```bash
git add .gitignore
git commit -m "security: remove sensitive lemmi data files from tracking

- Remove all lemmi.json and Lemmi_*.csv from git tracking
- Add comprehensive .gitignore rules for sensitive data
- Files remain on local filesystem but not in git
- BREAKING: Users must provide their own lemmi data files

SECURITY: These files contain sensitive research data and must not be in version control.

Affected files:
- data/lemmi.json
- data/Lemmi_*.csv
- lemmario-dashboard/public/data/lemmi.json
- lemmario-dashboard/public/data/Lemmi_*.csv
- lemmario-dashboard/server/data/lemmi.json
- test_10_lemmi.csv"
```

**Risultato atteso**: ✅ Commit con rimozione file sensibili

---

### FASE 5: Rimozione dallo Storico Git (CRITICO)
**Obiettivo**: Eliminare completamente i file dallo storico git

**⚠️ ATTENZIONE**: Questa operazione riscrive la storia git!

**Opzione A: git filter-repo (CONSIGLIATO)**
```bash
# 1. Installa git-filter-repo (se non presente)
pip3 install git-filter-repo

# 2. Crea backup del repository
cp -r .git .git.backup

# 3. Rimuovi file dallo storico
git filter-repo --path data/lemmi.json --invert-paths --force
git filter-repo --path data/Lemmi_forme_atliteg.csv --invert-paths --force
git filter-repo --path data/Lemmi_forme_atliteg_updated.csv --invert-paths --force
git filter-repo --path lemmario-dashboard/public/data/lemmi.json --invert-paths --force
git filter-repo --path lemmario-dashboard/public/data/Lemmi_forme_atliteg.csv --invert-paths --force
git filter-repo --path lemmario-dashboard/public/data/Lemmi_forme_atliteg_updated.csv --invert-paths --force
git filter-repo --path lemmario-dashboard/server/data/lemmi.json --invert-paths --force
git filter-repo --path test_10_lemmi.csv --invert-paths --force

# 4. Verifica dimensione repository (dovrebbe essere più piccolo)
du -sh .git
```

**Opzione B: BFG Repo-Cleaner (ALTERNATIVA)**
```bash
# 1. Download BFG
wget https://repo1.maven.org/maven2/com/madgag/bfg/1.14.0/bfg-1.14.0.jar

# 2. Rimuovi file grandi (>1M) dallo storico
java -jar bfg-1.14.0.jar --delete-files "lemmi.json"
java -jar bfg-1.14.0.jar --delete-files "Lemmi_*.csv"

# 3. Cleanup
git reflog expire --expire=now --all
git gc --prune=now --aggressive
```

**Risultato atteso**: ✅ File completamente rimossi dallo storico git

---

### FASE 6: Force Push e Coordinamento Team
**Obiettivo**: Aggiornare il repository remoto e coordinare il team

**⚠️ COORDINAMENTO NECESSARIO**: Avvisare tutti i collaboratori!

**Messaggio al Team**:
```
🔐 IMPORTANTE - Rewrite Storia Git Repository

Abbiamo rimosso dati sensibili (file lemmi) dallo storico git.

AZIONE RICHIESTA da TUTTI i collaboratori:

1. Commit e push di tutto il lavoro in sospeso PRIMA del rewrite
2. Backup locale del proprio lavoro
3. Dopo il force push:
   - git fetch origin
   - git reset --hard origin/UI-for-csv-upload (o master)
   - git clean -fd

IMPORTANTE: Non fare merge del vecchio storico!
```

**Comandi Force Push**:
```bash
# 1. Verifica remote
git remote -v

# 2. Force push (riscrive storico remoto)
git push origin UI-for-csv-upload --force
git push origin master --force  # Se necessario

# 3. Verifica su GitHub che i file non siano più presenti
```

**Risultato atteso**: ✅ Repository remoto aggiornato senza file sensibili

---

## 🔒 Sicurezza Server Production

### Configurazione Nginx (CRITICA)
**Obiettivo**: Impedire download diretto dei file lemmi

**File**: `lemmario-dashboard/nginx.conf`

**Regole da aggiungere**:
```nginx
# BLOCCA accesso diretto a file dati sensibili
location ~ ^/data/.*\.(csv|json)$ {
    deny all;
    return 404;
}

# BLOCCA directory server/ (backend only)
location ~ ^/server/ {
    deny all;
    return 404;
}

# PERMETTI solo API backend
location /api/ {
    proxy_pass http://backend:3001;
    # ... resto config proxy
}
```

**Verifica**:
```bash
# Questi DEVONO fallire (404/403):
curl http://localhost:9000/data/lemmi.json
curl http://localhost:9000/server/data/lemmi.json

# Questo DEVE funzionare (con API key):
curl -H "X-API-Key: $API_KEY" http://localhost:9000/api/lemmi
```

---

## 📁 Struttura File Finale

```
atliteg-map/
├── .gitignore                          ✅ Aggiornato con regole sicurezza
├── data/
│   ├── .gitkeep                       ✅ Tracciato (placeholder)
│   ├── limits_IT_regions.geojson      ✅ Tracciato (pubblico)
│   ├── lemmi.json                     ⛔ NON tracciato (locale only)
│   └── Lemmi_*.csv                    ⛔ NON tracciato (locale only)
├── lemmario-dashboard/
│   ├── public/data/
│   │   ├── geojson.json               ✅ Tracciato (pubblico)
│   │   ├── lemmi.json                 ⛔ NON DEVE ESISTERE (rimosso)
│   │   └── Lemmi_*.csv                ⛔ NON DEVE ESISTERE (rimosso)
│   └── server/
│       ├── data/
│       │   ├── .gitkeep               ✅ Tracciato (placeholder)
│       │   ├── lemmi.json             ⛔ NON tracciato (runtime only)
│       │   └── geojson.json           ✅ Tracciato (pubblico)
│       └── uploads/
│           ├── .gitkeep               ✅ Tracciato (placeholder)
│           └── backup/                ⛔ NON tracciato (runtime only)
└── deleted/                           ⛔ NON tracciato (temp directory)
```

---

## ✅ Checklist Esecuzione

### Pre-Requisiti
- [ ] Coordinamento con tutti i collaboratori
- [ ] Backup completo del repository
- [ ] Verifica che nessuno stia lavorando sul repo

### Fase 1: Backup
- [ ] Backup lemmi fuori dal repository
- [ ] Verifica integrità backup

### Fase 2: .gitignore
- [ ] Aggiornamento .gitignore
- [ ] Verifica con `git check-ignore`

### Fase 3-4: Rimozione Immediata
- [ ] git rm --cached dei file sensibili
- [ ] Commit rimozione
- [ ] Verifica con `git ls-files | grep lemmi`

### Fase 5: Pulizia Storico
- [ ] Installazione git-filter-repo
- [ ] Backup .git
- [ ] Esecuzione filter-repo
- [ ] Verifica dimensione repository
- [ ] Verifica con `git log --all --full-history -- "*lemmi*"`

### Fase 6: Deployment
- [ ] Avviso al team
- [ ] Force push a remote
- [ ] Verifica su GitHub
- [ ] Configurazione Nginx production
- [ ] Test sicurezza con curl

---

## 🧪 Test di Sicurezza Finale

### Test 1: Verifica Git
```bash
# DEVONO restituire vuoto:
git ls-files | grep -i lemmi | grep -E "\.(csv|json)$"
git log --all --full-history -- "*lemmi*.csv"
git log --all --full-history -- "*lemmi*.json"
```

### Test 2: Verifica Filesystem
```bash
# DEVONO esistere (runtime):
ls lemmario-dashboard/server/data/lemmi.json

# NON DEVONO esistere (rimossi):
ls lemmario-dashboard/public/data/lemmi.json 2>/dev/null && echo "❌ ERRORE" || echo "✅ OK"
```

### Test 3: Verifica Nginx
```bash
# DEVE fallire (404):
curl -I http://localhost:9000/data/lemmi.json

# DEVE funzionare (con API key):
curl -H "X-API-Key: $API_KEY" http://localhost:9000/api/lemmi | jq 'length'
```

---

## 📖 Documentazione da Aggiornare

1. **README.md**: Aggiungere sezione "Data Files Setup"
2. **CONTRIBUTING.md**: Avvisare di NON committare file lemmi
3. **deployment-guide.md**: Spiegare come fornire file lemmi in production
4. **.env.example**: Documentare dove ottenere i dati

---

## 🚀 Deployment Production

### Setup Iniziale Server
```bash
# 1. Crea directory dati
mkdir -p /var/atliteg/data

# 2. Carica file lemmi (via SCP/SFTP - NON git!)
scp lemmi.json user@server:/var/atliteg/data/

# 3. Set permessi (solo app può leggere)
chmod 600 /var/atliteg/data/lemmi.json
chown app-user:app-group /var/atliteg/data/lemmi.json

# 4. Volume Docker
docker run -v /var/atliteg/data:/app/data ...
```

---

## ⏱️ Timeline Esecuzione

| Fase | Tempo | Criticità |
|------|-------|-----------|
| 1. Backup | 5 min | 🟢 Bassa |
| 2. .gitignore | 10 min | 🟡 Media |
| 3-4. Rimozione immediata | 15 min | 🟠 Alta |
| 5. Pulizia storico | 30 min | 🔴 Critica |
| 6. Force push | 10 min | 🔴 Critica |
| **TOTALE** | **~70 min** | |

---

## 📞 Contatti Emergenza

In caso di problemi:
1. STOP! Non fare altri push
2. Ripristina backup: `mv .git.backup .git`
3. Contatta team lead
4. Documenta l'errore

---

**RICORDA**: I dati lemmi sono sensibili e non devono MAI essere in git! 🔐
