# 🚀 Quick Start: Configurazione Deploy Automatico

## ✅ Cosa è stato implementato

È stato configurato un sistema di **deploy automatico** che si attiva ogni volta che fai un merge o un commit sul branch `master`.

### Il workflow esegue automaticamente:
1. 📥 **Git pull** del codice aggiornato sul server remoto
2. 🏗️ **Build** delle immagini Docker con `docker compose build --no-cache`
3. 🔄 **Restart** dei container con `docker compose down` e `docker compose up -d`
4. 🧹 **Pulizia** delle risorse Docker non utilizzate
5. 🔍 **Verifica** dello stato dei container

### File creati/modificati:
- ✅ `.github/workflows/deploy-production.yml` - Workflow GitHub Actions (già esistente, verificato)
- ✅ `docs/GITHUB_ACTIONS_SETUP.md` - Documentazione completa per la configurazione
- ✅ `test-ssh-connection.example.sh` - Script per testare la connessione SSH
- ✅ `README.md` - Aggiunto riferimento al deploy automatico
- ✅ `CHANGELOG.md` - Documentata la nuova funzionalità
- ✅ `.gitignore` - Aggiunto file di test locale

---

## 🔧 Cosa devi fare tu (Configurazione manuale richiesta)

### Passo 1: Prepara la chiave SSH

Sul tuo computer locale:

```bash
# Genera una nuova chiave SSH dedicata al deploy
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_deploy_key

# Copia la chiave PUBBLICA e aggiungila al server remoto
cat ~/.ssh/github_deploy_key.pub
# Copiala negli appunti
```

Sul server remoto:

```bash
# Connettiti al server
ssh user@your-server.com

# Aggiungi la chiave pubblica
echo "INCOLLA_QUI_LA_CHIAVE_PUBBLICA" >> ~/.ssh/authorized_keys

# Verifica i permessi
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

### Passo 2: Testa la connessione SSH (IMPORTANTE!)

Prima di configurare GitHub, verifica che tutto funzioni:

```bash
# Crea una copia locale dello script di test
cp test-ssh-connection.example.sh test-ssh-connection.local.sh

# Modifica con i tuoi valori reali
nano test-ssh-connection.local.sh
# Sostituisci:
# - SSH_HOST con l'IP o hostname del server
# - SSH_USER con il tuo username
# - DEPLOY_PATH con il percorso del progetto sul server
# - SSH_KEY_PATH se diverso da ~/.ssh/github_deploy_key

# Rendi eseguibile lo script
chmod +x test-ssh-connection.local.sh

# Esegui il test
./test-ssh-connection.local.sh
```

Se tutti i test passano ✅, puoi procedere al passo successivo!

### Passo 3: Configura GitHub Secrets

1. **Vai su GitHub:**
   - Repository: `https://github.com/Unica-dh/atliteg-map`
   - Clicca su **Settings**

2. **Crea l'Environment (Raccomandato):**
   - Menu laterale → **Environments**
   - Clicca **New environment**
   - Nome: `production`
   - (Opzionale) Configura protezioni come "Required reviewers"

3. **Aggiungi i Secrets:**
   - Vai in **Environments** → **production**
   - Per ogni secret, clicca **Add secret**:

   **Secret 1: SSH_PRIVATE_KEY**
   ```bash
   # Copia il contenuto della chiave PRIVATA
   cat ~/.ssh/github_deploy_key
   ```
   - Name: `SSH_PRIVATE_KEY`
   - Value: [Incolla TUTTO il contenuto, inclusi `-----BEGIN` e `-----END`]

   **Secret 2: SSH_HOST**
   - Name: `SSH_HOST`
   - Value: `192.168.1.100` (o il tuo IP/hostname)

   **Secret 3: SSH_USER**
   - Name: `SSH_USER`
   - Value: `ubuntu` (o il tuo username)

   **Secret 4: DEPLOY_PATH**
   - Name: `DEPLOY_PATH`
   - Value: `/home/ubuntu/atliteg-map` (o il tuo path completo)

4. **Aggiungi Variabile (Opzionale):**
   - Nella sezione **Environment variables**
   - Name: `PRODUCTION_URL`
   - Value: `https://atliteg.unica.it` (o il tuo URL pubblico)

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
- Consulta la sezione **Troubleshooting** in `docs/GITHUB_ACTIONS_SETUP.md`

---

## 📚 Documentazione Completa

Per maggiori dettagli, consulta:
- **Setup completo:** [docs/GITHUB_ACTIONS_SETUP.md](docs/GITHUB_ACTIONS_SETUP.md)
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
