# Configurazione GitHub Actions per Deploy Automatico con Self-Hosted Runner

## 📋 Panoramica
Questo documento fornisce le istruzioni per configurare il deploy automatico utilizzando un **GitHub Actions Self-Hosted Runner** installato direttamente sul server.

## 🎯 Perché Self-Hosted Runner?

Il server è protetto da VPN e non è raggiungibile da Internet pubblico. Un self-hosted runner:
- ✅ Gira direttamente sul server (niente problemi di rete/firewall)
- ✅ Non richiede SSH dall'esterno
- ✅ Deploy più veloce (nessuna latenza di rete)
- ✅ Più sicuro (nessuna esposizione SSH)
- ✅ Esegue i comandi direttamente sul server

---

## 🚀 Installazione Self-Hosted Runner

### Prerequisiti
- Accesso SSH al server
- Sudo privileges
- Docker e Docker Compose già installati
- Accesso come amministratore al repository GitHub

### Opzione 1: Installazione Automatica (Consigliata)

1. **Copia lo script sul server:**
   ```bash
   # Dal tuo computer locale
   scp install-github-runner.sh dhruby@90.147.144.147:~/
   ```

2. **Esegui lo script sul server:**
   ```bash
   # Connettiti al server
   ssh dhruby@90.147.144.147
   
   # Rendi eseguibile lo script
   chmod +x install-github-runner.sh
   
   # Esegui l'installazione
   ./install-github-runner.sh
   ```

3. **Segui le istruzioni interattive:**
   - Inserisci owner: `Unica-dh`
   - Inserisci repository: `atliteg-map`
   - Ottieni il TOKEN da: https://github.com/Unica-dh/atliteg-map/settings/actions/runners/new
   - Incolla il TOKEN quando richiesto

### Opzione 2: Installazione Manuale

Se preferisci installare manualmente, segui questi step:

1. **Connettiti al server:**
   ```bash
   ssh dhruby@90.147.144.147
   ```

2. **Crea directory per il runner:**
   ```bash
   mkdir -p ~/actions-runner && cd ~/actions-runner
   ```

3. **Download GitHub Actions Runner:**
   ```bash
   # Ottieni l'ultima versione
   RUNNER_VERSION=$(curl -s https://api.github.com/repos/actions/runner/releases/latest | grep -oP '"tag_name": "\K(.*)(?=")')
   
   # Download per Linux x64
   curl -o actions-runner-linux-x64-${RUNNER_VERSION#v}.tar.gz -L \
     https://github.com/actions/runner/releases/download/${RUNNER_VERSION}/actions-runner-linux-x64-${RUNNER_VERSION#v}.tar.gz
   
   # Estrai
   tar xzf ./actions-runner-linux-*.tar.gz
   rm ./actions-runner-linux-*.tar.gz
   ```

4. **Ottieni il token di configurazione:**
   - Vai su: https://github.com/Unica-dh/atliteg-map/settings/actions/runners/new
   - Copia il TOKEN che appare

5. **Configura il runner:**
   ```bash
   ./config.sh --url https://github.com/Unica-dh/atliteg-map \
     --token YOUR_TOKEN_HERE \
     --name "$(hostname)-runner" \
     --work _work \
     --labels "self-hosted,Linux,X64" \
     --unattended
   ```

6. **Installa come servizio:**
   ```bash
   sudo ./svc.sh install $(whoami)
   sudo ./svc.sh start
   sudo ./svc.sh status
   ```

---

## 🔐 Secrets da Configurare

Con il self-hosted runner, devi configurare solo **1 secret** (invece di 4! 🎉):

### 1. `DEPLOY_PATH` ✅ (UNICO SECRET NECESSARIO)
**Descrizione:** Percorso assoluto della directory del progetto sul server.

**Per il tuo caso specifico:**
```
DEPLOY_PATH: /home/dhruby/atliteg-map
```

**Come configurarlo:**
1. Vai su GitHub.com
2. Naviga al repository: https://github.com/Unica-dh/atliteg-map
3. Clicca su **Settings** → **Environments**
4. Clicca su environment **production** (crealo se non esiste)
5. Nella sezione **Environment secrets**, clicca **Add secret**
6. **Name:** `DEPLOY_PATH`
7. **Value:** `/home/dhruby/atliteg-map`
8. Clicca **Add secret**

✅ **Fatto!** Non servono SSH_PRIVATE_KEY, SSH_HOST, SSH_USER perché il runner gira già sul server!

---

### 2. `PRODUCTION_URL` (Variabile - OPZIONALE)
**Descrizione:** URL pubblico dell'applicazione (solo per riferimento visivo su GitHub).

**Esempio:** `http://90.147.144.147:9000` o `https://atliteg.unica.it`

**Come configurarlo:**
1. Vai su **Settings** → **Environments** → **production**
2. Nella sezione **Environment variables**, clicca **Add variable**
3. **Name:** `PRODUCTION_URL`
4. **Value:** URL della tua applicazione
5. Clicca **Add variable**

---

## ✅ Riepilogo: Cosa Serve

Con il self-hosted runner, la configurazione è drasticamente semplificata:

| Cosa | Necessario? | Valore |
|------|-------------|---------|
| Self-hosted runner installato sul server | ✅ Sì | Usa `install-github-runner.sh` |
| Secret `DEPLOY_PATH` | ✅ Sì | `/home/dhruby/atliteg-map` |
| Variable `PRODUCTION_URL` | ⚪ Opzionale | URL pubblico dell'app |
| ~~Secret `SSH_PRIVATE_KEY`~~ | ❌ Non più necessario | Runner sul server |
| ~~Secret `SSH_HOST`~~ | ❌ Non più necessario | Runner sul server |
| ~~Secret `SSH_USER`~~ | ❌ Non più necessario | Runner sul server |


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
