# 🚀 Quick Start: Deploy Automatico con Self-Hosted Runner

## ✅ Cosa è stato implementato

È stato configurato un sistema di **deploy automatico** con **self-hosted runner** che si attiva ogni volta che fai un merge o un commit sul branch `master`.

### Perché Self-Hosted Runner?
Il server è protetto da VPN. Un runner installato sul server:
- ✅ Non richiede SSH dall'esterno (niente problemi firewall/VPN)
- ✅ Deploy più veloce (esecuzione locale)
- ✅ Più sicuro (nessuna esposizione porte)
- ✅ Configurazione semplificata (1 solo secret invece di 4!)

### Il workflow esegue automaticamente:
1. 📥 **Git pull** del codice aggiornato sul server remoto
2. 🏗️ **Build** delle immagini Docker con `docker compose build --no-cache`
3. 🔄 **Restart** dei container con `docker compose down` e `docker compose up -d`
4. 🧹 **Pulizia** delle risorse Docker non utilizzate
5. 🔍 **Verifica** dello stato dei container

### File creati/modificati:
- ✅ `.github/workflows/deploy-production.yml` - Workflow GitHub Actions (già esistente, verificato)
- ✅ `github-actions.md` - Documentazione completa per la configurazione
- ✅ `test-ssh-connection.example.sh` - Script per testare la connessione SSH
- ✅ `README.md` - Aggiunto riferimento al deploy automatico
- ✅ `CHANGELOG.md` - Documentata la nuova funzionalità
- ✅ `.gitignore` - Aggiunto file di test locale

---

## 🔧 Cosa devi fare tu (Configurazione manuale richiesta)

### Passo 1: Installa il Self-Hosted Runner sul server

**Opzione A - Installazione Automatica (Raccomandata):**

```bash
# 1. Copia lo script sul server
scp install-github-runner.sh dhruby@90.147.144.147:~/

# 2. Connettiti al server
ssh dhruby@90.147.144.147

# 3. Rendi eseguibile e lancia lo script
chmod +x install-github-runner.sh
./install-github-runner.sh

# 4. Segui le istruzioni interattive:
#    - Owner: Unica-dh
#    - Repository: atliteg-map
#    - TOKEN: ottienilo da https://github.com/Unica-dh/atliteg-map/settings/actions/runners/new
```

Lo script installerà automaticamente il runner come servizio systemd.

**Opzione B - Installazione Manuale:**

Consulta la sezione "Opzione 2: Installazione Manuale" in `github-actions.md`

### Passo 2: Verifica che il runner sia online

1. **Vai su:** https://github.com/Unica-dh/atliteg-map/settings/actions/runners
2. **Dovresti vedere il runner con:**
   - ✅ Status: **Idle** (verde = pronto per lavorare)
   - 🏷️ Labels: **self-hosted, Linux, X64**
   - 💻 Nome: simile a **hostname-runner**

**Se il runner è Offline:**
```bash
# Sul server, controlla i log
sudo journalctl -u actions.runner.Unica-dh-atliteg-map.*.service -f

# Oppure riavvia il servizio
sudo ~/actions-runner/svc.sh restart
```

### Passo 3: Configura il Secret DEPLOY_PATH (UNICO SECRET!)

Con il self-hosted runner serve solo **1 secret** invece di 4! 🎉

1. **Vai su GitHub:**
   - https://github.com/Unica-dh/atliteg-map
   - Clicca su **Settings** → **Environments**

2. **Crea/Seleziona l'Environment:**
   - Clicca **New environment** (se non esiste)
   - Nome: `production`
   - Clicca **Configure environment**

3. **Aggiungi il Secret:**
   - Nella sezione **Environment secrets**, clicca **Add secret**
   - **Name:** `DEPLOY_PATH`
   - **Value:** `/home/dhruby/atliteg-map`
   - Clicca **Add secret**

4. **(Opzionale) Aggiungi la Variabile PRODUCTION_URL:**
   - Nella sezione **Environment variables**, clicca **Add variable**
   - **Name:** `PRODUCTION_URL`
   - **Value:** `http://90.147.144.147:9000`
   - Clicca **Add variable**

---

## 🧪 Test del Workflow

### Opzione 1: Test manuale
1. Vai su GitHub → **Actions**
2. Seleziona il workflow **Deploy to Production**
3. Clicca **Run workflow**
4. Seleziona branch `master`
5. Clicca **Run workflow**
6. Osserva i log in tempo reale

### Opzione 2: Test automatico
1. Fai un commit su un branch qualsiasi
2. Crea una Pull Request verso `master`
3. Fai il merge della PR
4. Il workflow si attiverà automaticamente!

---

## 📊 Monitoraggio

### Visualizzare i log del deploy
- GitHub → **Actions** → Seleziona l'esecuzione
- Ogni step ha emoji e messaggi chiari:
  - 📥 Git Pull
  - 🏗️ Build
  - 🔄 Restart
  - 🧹 Cleanup
  - 🔍 Verifica

### In caso di errore
- Controlla i log del workflow su GitHub Actions
- Ogni step mostra esattamente dove si è verificato l'errore
- Consulta la sezione **Troubleshooting** in `github-actions.md`

---

## 📚 Documentazione Completa

Per maggiori dettagli, consulta:
- **Setup completo:** [github-actions.md](github-actions.md)
- **Workflow:** [.github/workflows/deploy-production.yml](.github/workflows/deploy-production.yml)

---

## ❓ Domande Frequenti

**Q: Devo configurare qualcosa sul server remoto?**  
A: Sì, assicurati che siano installati Git, Docker e Docker Compose. Lo script `test-ssh-connection.local.sh` verifica tutto questo.

**Q: Posso usare la mia chiave SSH esistente?**  
A: Sì, ma è consigliato creare una chiave dedicata per maggiore sicurezza.

**Q: Cosa succede se il deploy fallisce?**  
A: Il workflow si ferma e ti notifica. Controlla i log su GitHub Actions per identificare il problema.

**Q: Posso disabilitare il deploy automatico?**  
A: Sì, puoi modificare il workflow per rimuovere il trigger automatico su `push` e lasciare solo `workflow_dispatch` (esecuzione manuale).

**Q: Come faccio a testare prima su un ambiente di staging?**  
A: Puoi creare un secondo environment chiamato `staging` con secrets diversi e un workflow separato per il branch `develop`.

---

## 🎉 Hai finito!

Dopo aver configurato i secrets, ogni volta che fai un merge su `master`, il deploy avverrà automaticamente! 🚀
