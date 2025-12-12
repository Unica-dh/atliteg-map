# Configurazione GitHub Actions per Deploy Automatico

## 📋 Panoramica
Questo documento fornisce le istruzioni per configurare i GitHub Secrets necessari per il workflow di deploy automatico.

## 🔐 Secrets da Configurare

Il workflow `deploy-production.yml` richiede i seguenti secrets per funzionare correttamente:

### 1. `SSH_PRIVATE_KEY`
**Descrizione:** Chiave privata SSH per l'autenticazione sul server remoto.

**Come ottenerla:**
```bash
# Sul tuo computer locale, genera una nuova chiave SSH (se non ne hai già una)
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_deploy_key

# Visualizza la chiave PRIVATA (da inserire in GitHub Secrets)
cat ~/.ssh/github_deploy_key

# Visualizza la chiave PUBBLICA (da aggiungere al server remoto)
cat ~/.ssh/github_deploy_key.pub
```

**Configurazione sul server remoto:**
```bash
# Connettiti al server remoto
ssh user@your-server.com

# Aggiungi la chiave pubblica al file authorized_keys
echo "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAICgoDg0PKppiFtlSXN1WfgLnX8l20nBoj3+fcVr2fB4f github-actions-deploy" >> ~/.ssh/authorized_keys

# Verifica i permessi
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

---

### 2. `SSH_HOST`
**Descrizione:** Indirizzo IP o hostname del server remoto.

**Esempio:** `192.168.1.100` oppure `server.example.com`

**Come ottenerlo:**
```bash
# Se sei già connesso al server remoto
hostname -I

# Oppure controlla la configurazione del tuo provider
```

---

### 3. `SSH_USER`
**Descrizione:** Username per l'accesso SSH al server remoto.

**Esempio:** `ubuntu`, `root`, `deploy`, ecc.

**Come ottenerlo:**
```bash
# È l'utente che usi normalmente per connetterti via SSH
ssh YOUR_USER@server.com
```

---

### 4. `DEPLOY_PATH`
**Descrizione:** Percorso assoluto della directory del progetto sul server remoto.

**Esempio:** `/home/ubuntu/atliteg-map` oppure `/var/www/atliteg-map`

**Come ottenerlo:**
```bash
# Connettiti al server e naviga nella directory del progetto
ssh user@server.com
cd /path/to/your/project
pwd  # Questo ti darà il percorso completo
```

---

## ⚙️ Procedura di Configurazione su GitHub

### Passo 1: Accedi alle impostazioni del repository
1. Vai su GitHub.com
2. Naviga al repository `Unica-dh/atliteg-map`
3. Clicca su **Settings** (Impostazioni)

### Passo 2: Configura l'Environment Production (Opzionale ma Raccomandato)
1. Nel menu laterale, clicca su **Environments**
2. Clicca su **New environment**
3. Nome: `production`
4. (Opzionale) Configura protezioni come:
   - Required reviewers (revisori richiesti prima del deploy)
   - Wait timer (tempo di attesa prima del deploy)
   - Deployment branches (limita i branch che possono deployare)

### Passo 3: Configura i Secrets
1. Puoi configurare i secrets a livello di:
   - **Repository** (Secrets and variables → Actions)
   - **Environment** (Environments → production → Add secret) [Raccomandato]

2. Per usare l'environment, vai in **Environments** → **production** → **Add secret**
3. Aggiungi i seguenti secrets uno alla volta:

#### Secret: SSH_PRIVATE_KEY
- **Name:** `SSH_PRIVATE_KEY`
- **Value:** Incolla l'intero contenuto della chiave privata (inclusi `-----BEGIN OPENSSH PRIVATE KEY-----` e `-----END OPENSSH PRIVATE KEY-----`)
- Clicca **Add secret**

#### Secret: SSH_HOST
- **Name:** `SSH_HOST`
- **Value:** `your-server-ip-or-hostname`
- Clicca **Add secret**

#### Secret: SSH_USER
- **Name:** `SSH_USER`
- **Value:** `your-username`
- Clicca **Add secret**

#### Secret: DEPLOY_PATH
- **Name:** `DEPLOY_PATH`
- **Value:** `/path/to/project/on/remote/server`
- Clicca **Add secret**

### 5. `PRODUCTION_URL` (Variabile, non Secret)
**Descrizione:** URL pubblico dell'applicazione in produzione (opzionale, per riferimento).

**Esempio:** `https://atliteg.unica.it` oppure `http://192.168.1.100:9000`

**Come configurarlo:**
- Vai in **Environments** → **production**
- Nella sezione **Environment variables**, clicca **Add variable**
- Name: `PRODUCTION_URL`
- Value: `https://your-domain.com`

---

## 🧪 Test della Configurazione

### Test 1: Connessione SSH Manuale
Prima di configurare GitHub Actions, verifica che la connessione SSH funzioni:

```bash
# Dal tuo computer locale
ssh -i ~/.ssh/github_deploy_key user@your-server.com "echo 'Connessione riuscita!'"
```

### Test 2: Trigger Manuale del Workflow
1. Vai su **Actions** nel repository GitHub
2. Seleziona il workflow **Deploy to Production**
3. Clicca su **Run workflow**
4. Seleziona il branch `master`
5. Clicca **Run workflow**

---

## 📝 Requisiti sul Server Remoto

Assicurati che sul server remoto siano installati:

- ✅ Git
- ✅ Docker
- ✅ Docker Compose

**Verifica installazione:**
```bash
ssh user@server.com << 'ENDSSH'
echo "Versione Git:"
git --version

echo "Versione Docker:"
docker --version

echo "Versione Docker Compose:"
docker-compose --version
ENDSSH
```

---

## 🔄 Funzionamento del Workflow

### Trigger Automatico
Il workflow si attiva automaticamente quando:
- Viene fatto un push sul branch `master`
- Viene fatto un merge di una Pull Request su `master`

### Trigger Manuale
Puoi anche avviare il workflow manualmente da GitHub Actions → Run workflow

### Fasi del Deploy
1. **📥 Git Pull:** Aggiorna il codice sul server remoto
2. **🏗️ Build:** Ricostruisce le immagini Docker
3. **🔄 Restart:** Riavvia i container con la nuova versione
4. **🧹 Pulizia:** Rimuove risorse Docker non utilizzate
5. **🔍 Verifica:** Controlla che tutto sia funzionante

---

## 🐛 Troubleshooting

### Errore: "Permission denied (publickey)"
- Verifica che la chiave pubblica sia stata aggiunta correttamente al file `~/.ssh/authorized_keys` sul server remoto
- Controlla i permessi: `chmod 600 ~/.ssh/authorized_keys`

### Errore: "docker: command not found"
- Assicurati che Docker sia installato sul server remoto
- Verifica che l'utente abbia i permessi per eseguire comandi Docker (aggiungi al gruppo docker: `sudo usermod -aG docker $USER`)

### Errore: "No such file or directory"
- Verifica che il percorso `DEPLOY_PATH` sia corretto
- Assicurati che il repository sia stato clonato sul server remoto

### I log non sono chiari
- Vai su GitHub → Actions → Seleziona l'esecuzione del workflow
- Clicca su ogni step per vedere i log dettagliati
- Ogni step ha emoji e messaggi chiari per identificare dove si è verificato l'errore

---

## 📊 Monitoraggio

### Visualizzare i Log
1. Vai su GitHub → **Actions**
2. Seleziona l'esecuzione del workflow
3. Clicca su **Deploy Application** per vedere tutti gli step
4. Ogni step mostra log dettagliati con emoji per facile identificazione

### Log sul Server
```bash
# Connettiti al server e visualizza i log dei container
ssh user@server.com
cd /path/to/project
docker-compose logs -f --tail=100
```

---

## 🔒 Sicurezza

### Best Practices
- ✅ Non condividere mai le chiavi private
- ✅ Usa chiavi SSH dedicate per il deploy
- ✅ Limita i permessi dell'utente sul server remoto
- ✅ Mantieni i secrets aggiornati
- ✅ Rigenera le chiavi periodicamente

### Rotazione delle Chiavi
Per cambiare la chiave SSH:
1. Genera una nuova coppia di chiavi
2. Aggiorna il secret `SSH_PRIVATE_KEY` su GitHub
3. Aggiungi la nuova chiave pubblica al server remoto
4. Rimuovi la vecchia chiave pubblica dal server

---

## 📞 Supporto

Per problemi o domande:
1. Controlla i log del workflow su GitHub Actions
2. Verifica la configurazione dei secrets
3. Testa manualmente la connessione SSH
4. Consulta la documentazione di Docker e Docker Compose

---

## 📅 Manutenzione

### Checklist Periodica
- [ ] Verificare che i secrets siano ancora validi
- [ ] Controllare lo spazio disco sul server remoto
- [ ] Monitorare i log per eventuali errori ricorrenti
- [ ] Aggiornare Docker e Docker Compose sul server
- [ ] Pulire immagini e volumi Docker non utilizzati

---

**Ultimo aggiornamento:** 12 dicembre 2025
