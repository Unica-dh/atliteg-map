# 🔐 Piano Sicurezza Dati - Executive Summary

**Data**: 16 gennaio 2026  
**Status**: 🔴 AZIONE RICHIESTA  
**Criticità**: ALTA

## 🚨 Problema Identificato

**8 file sensibili** con dati lemmi sono attualmente tracciati su git:
- `data/lemmi.json` (2.5 MB)
- `data/Lemmi_*.csv` (multipli)
- `lemmario-dashboard/public/data/lemmi.json`
- `lemmario-dashboard/server/data/lemmi.json`
- File di test

**Rischio**: Dati di ricerca sensibili esposti nello storico git e potenzialmente su GitHub.

## ✅ Soluzione Implementata

### Documentazione Creata

1. **[LEMMI_DATA_SECURITY_PLAN.md](docs/security/LEMMI_DATA_SECURITY_PLAN.md)**
   - Piano completo in 6 fasi
   - Timeline: ~70 minuti
   - Checklist esecuzione

2. **[DATA_SECURITY.md](DATA_SECURITY.md)**
   - Guida setup per sviluppatori
   - Best practices sicurezza
   - Troubleshooting

### Script Automatizzati

3. **[scripts/remove-lemmi-from-git.sh](scripts/remove-lemmi-from-git.sh)**
   - Esegue Fasi 1-4 (backup, .gitignore, rimozione, commit)
   - Sicuro: mantiene file su disco
   - Interattivo: richiede conferma

4. **[scripts/remove-lemmi-from-history.sh](scripts/remove-lemmi-from-history.sh)**
   - Esegue Fase 5 (pulizia storico git)
   - ⚠️ CRITICO: riscrive storia git
   - Backup automatico `.git.backup`

### Sicurezza Nginx

5. **nginx.conf aggiornato**
   - Blocca `/data/`, `/server/`, `/uploads/`
   - Blocca file `.csv` e pattern `lemmi`
   - Return 404 invece di 403 (non rivela esistenza)

## 📋 Azioni Richieste

### Immediate (Oggi)

```bash
# 1. Esegui script rimozione (Fasi 1-4)
./scripts/remove-lemmi-from-git.sh

# 2. Verifica commit
git log -1 --stat
git ls-files | grep -i lemmi
```

### Critiche (Entro 48h)

```bash
# 3. Pulisci storico git (Fase 5)
./scripts/remove-lemmi-from-history.sh

# 4. Verifica pulizia
git log --all --full-history -- "*lemmi*"

# 5. Test clone locale
git clone . ../test-clone
```

### Coordinamento Team

**Prima del force push**:
1. ✅ Avvisare tutti i collaboratori
2. ✅ Attendere che committino tutto
3. ✅ Scegliere momento di minor attività
4. ✅ Preparare messaggio istruzioni

### Force Push (Solo dopo coordinamento)

```bash
# Riconnetti remote (se necessario dopo filter-repo)
git remote add origin <url>

# Force push
git push origin UI-for-csv-upload --force
git push origin master --force  # se necessario
```

### Post-Push

Tutti i collaboratori devono:
```bash
git fetch origin
git reset --hard origin/UI-for-csv-upload
git clean -fd
```

## 🧪 Test di Sicurezza

### Verifica Git
```bash
# DEVE essere vuoto:
git ls-files | grep -i lemmi | grep -E "\.(csv|json)$"

# DEVE essere vuoto:
git log --all --full-history -- "*lemmi*"
```

### Verifica Nginx
```bash
# DEVE fallire (404):
curl -I http://localhost:9000/data/lemmi.json

# DEVE funzionare:
curl -H "X-API-Key: $KEY" http://localhost:9000/api/lemmi
```

## 📊 Checklist Completa

- [ ] **Fase 1**: Backup file lemmi
- [ ] **Fase 2**: Aggiornamento .gitignore
- [ ] **Fase 3**: Rimozione da git tracking
- [ ] **Fase 4**: Commit modifiche
- [ ] **Fase 5**: Pulizia storico git
- [ ] **Fase 6**: Coordinamento team
- [ ] **Fase 6**: Force push
- [ ] **Post**: Aggiornamento nginx.conf in production
- [ ] **Post**: Verifica sicurezza production
- [ ] **Post**: Aggiornamento README.md

## 🔒 Risultato Finale

Dopo l'esecuzione completa:
- ✅ File lemmi NON in git (né tracking né storico)
- ✅ .gitignore previene futuri commit accidentali
- ✅ File disponibili solo runtime su server
- ✅ Nginx blocca download diretto
- ✅ Dati accessibili solo via API con autenticazione

## 🆘 Recovery

In caso di problemi durante Fase 5:
```bash
# Ripristina backup
rm -rf .git
mv .git.backup .git

# Riprova o contatta team lead
```

## 📞 Responsabilità

- **Esecuzione**: Ale (sviluppatore)
- **Coordinamento team**: Team lead
- **Verifica sicurezza**: Security officer
- **Deployment production**: DevOps

## ⏱️ Timeline Proposta

| Giorno | Azioni |
|--------|--------|
| **Oggi** | Fasi 1-4 + test locale |
| **+1** | Fase 5 (pulizia storico) + verifica |
| **+2** | Coordinamento team + force push |
| **+3** | Deployment production + verifica finale |

---

**Prossimo Step**: Eseguire `./scripts/remove-lemmi-from-git.sh`

**Domande?** Consulta [LEMMI_DATA_SECURITY_PLAN.md](docs/security/LEMMI_DATA_SECURITY_PLAN.md)
