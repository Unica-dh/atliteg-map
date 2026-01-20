# GitHub Actions Secrets e Variables - Guida Multi-Dominio

## Panoramica

Dopo l'implementazione del supporto multi-dominio, il workflow GitHub Actions richiede secrets e variables aggiuntivi per funzionare correttamente.

## Secrets Richiesti

I secrets sono valori sensibili criptati che vengono passati al workflow durante l'esecuzione. Configurali in:

**GitHub Repository** → **Settings** → **Secrets and variables** → **Actions** → **Secrets**

### Secrets Esistenti (Già Configurati)

Questi dovrebbero già essere presenti nel repository:

| Secret Name | Descrizione | Esempio |
|-------------|-------------|---------|
| `DEPLOY_PATH` | Path assoluto sul server dove risiede il progetto | `/home/user/atliteg-map` |
| `FRONTEND_API_KEYS` | Chiavi API per il frontend (comma-separated) | `key1,key2,key3` |
| `NEXT_PUBLIC_API_KEY` | Chiave API pubblica Next.js (deve matchare una da FRONTEND_API_KEYS) | `key1` |
| `ADMIN_USERNAME` | Username amministratore backend | `admin` |
| `ADMIN_PASSWORD` | Password amministratore backend | `SecurePassword123!` |
| `JWT_SECRET` | Secret per firma JWT tokens | `random_jwt_secret_string` |
| `ALLOWED_ORIGINS` | Domini CORS permessi (comma-separated) | Vedi sotto ⬇️ |

### ⚠️ Secrets da Aggiornare

#### 1. `ALLOWED_ORIGINS`

**Valore VECCHIO** (single domain):
```
http://localhost:3000,http://localhost:9000,https://atlante.atliteg.org
```

**Valore NUOVO** (multi-domain):
```
http://localhost:3000,http://localhost:9000,https://atlante.atliteg.org,https://linguistica.dh.unica.it
```

**Come aggiornare**:
1. Vai su **Settings** → **Secrets and variables** → **Actions** → **Secrets**
2. Trova `ALLOWED_ORIGINS`
3. Click **Update**
4. Incolla il nuovo valore
5. Click **Update secret**

#### 2. `NEXT_PUBLIC_SITE_URL` (NUOVO - DA CREARE)

**Valore**:
```
https://atlante.atliteg.org
```

**Descrizione**: Dominio primario utilizzato nei metadata SEO (Open Graph, canonical URL).

**Come creare**:
1. Vai su **Settings** → **Secrets and variables** → **Actions** → **Secrets**
2. Click **New repository secret**
3. Name: `NEXT_PUBLIC_SITE_URL`
4. Secret: `https://atlante.atliteg.org`
5. Click **Add secret**

**Nota**: Se vuoi usare `linguistica.dh.unica.it/atliteg` come dominio primario, imposta:
```
https://linguistica.dh.unica.it/atliteg
```

## Variables (Opzionali)

Le variables sono valori non sensibili visibili nei log. Configurale in:

**GitHub Repository** → **Settings** → **Secrets and variables** → **Actions** → **Variables**

### Variables per Test Multi-Dominio

#### `RUN_DOMAIN_TESTS` (Opzionale)

**Valore**: `true` o `false`

**Descrizione**: Abilita l'esecuzione dello script [test-deployment.sh](../../test-deployment.sh) dopo il deploy per verificare l'accessibilità su entrambi i domini.

**Default**: Se non impostata, i test non vengono eseguiti.

**Come creare**:
1. Vai su **Settings** → **Secrets and variables** → **Actions** → **Variables**
2. Click **New repository variable**
3. Name: `RUN_DOMAIN_TESTS`
4. Value: `true`
5. Click **Add variable**

**Nota**: I test sono configurati con `continue-on-error: true`, quindi anche se falliscono il deploy prosegue.

#### `PRODUCTION_URL` (Opzionale)

**Valore**: URL del sito in produzione

**Descrizione**: Usato nel campo `environment.url` del workflow per fornire un link rapido all'applicazione deployata.

**Valore consigliato**:
```
https://atlante.atliteg.org
```

## Riepilogo Configurazione

### Checklist Secrets

- [ ] `DEPLOY_PATH` - Configurato
- [ ] `FRONTEND_API_KEYS` - Configurato
- [ ] `NEXT_PUBLIC_API_KEY` - Configurato
- [ ] `ADMIN_USERNAME` - Configurato
- [ ] `ADMIN_PASSWORD` - Configurato
- [ ] `JWT_SECRET` - Configurato
- [ ] `ALLOWED_ORIGINS` - ⚠️ **DA AGGIORNARE** (aggiungere `https://linguistica.dh.unica.it`)
- [ ] `NEXT_PUBLIC_SITE_URL` - ⚠️ **DA CREARE** (es: `https://atlante.atliteg.org`)

### Checklist Variables (Opzionali)

- [ ] `RUN_DOMAIN_TESTS` - Opzionale (imposta a `true` per abilitare test automatici)
- [ ] `PRODUCTION_URL` - Opzionale (es: `https://atlante.atliteg.org`)

## Verifica Configurazione

Dopo aver configurato i secrets, puoi verificare che tutto funzioni:

### 1. Esecuzione Manuale del Workflow

1. Vai su **Actions** → **Deploy to Production**
2. Click **Run workflow**
3. Seleziona branch `master`
4. Click **Run workflow**

### 2. Verifica Log Workflow

Durante l'esecuzione, controlla i log:

**Step "🏗️ Build dell'applicazione"**:
```bash
📋 Environment variables configured (values hidden for security)
```

Verifica che non ci siano errori relativi a variabili mancanti.

**Step "🧪 Test accessibilità multi-dominio"** (se abilitato):
```bash
🧪 Test accessibilità multi-dominio
🚀 Esecuzione test su entrambi i domini...
✓ HTTP 200 OK: https://atlante.atliteg.org
✓ HTTP 200 OK: https://linguistica.dh.unica.it/atliteg
```

### 3. Verifica Manuale Post-Deploy

Dopo il deploy, testa manualmente entrambi i domini:

```bash
# SSH sul server
ssh user@production-server

# Vai nella directory del progetto
cd /path/to/atliteg-map

# Esegui test manualmente
./test-deployment.sh
```

## Troubleshooting

### Errore: "NEXT_PUBLIC_SITE_URL not set"

**Causa**: Secret `NEXT_PUBLIC_SITE_URL` non configurato.

**Soluzione**: Crea il secret come descritto sopra.

### Errore: CORS in browser console

**Causa**: `ALLOWED_ORIGINS` non include tutti i domini.

**Soluzione**: Aggiorna `ALLOWED_ORIGINS` per includere:
```
https://atlante.atliteg.org,https://linguistica.dh.unica.it
```

### Warning: "RUN_DOMAIN_TESTS variable not found"

**Causa**: Variable `RUN_DOMAIN_TESTS` non configurata.

**Soluzione**: Questo è normale se non vuoi eseguire i test automatici. Per abilitarli, crea la variable con valore `true`.

### Test multi-dominio fallisce

**Causa**: I domini potrebbero non essere ancora configurati correttamente (DNS, reverse proxy, SSL).

**Soluzione**: Lo step è configurato con `continue-on-error: true`, quindi il deploy continuerà. Controlla:
1. DNS puntano al server corretto
2. Reverse proxy configurato per entrambi i domini
3. Certificati SSL validi e non scaduti

## Sicurezza

### Best Practices

1. **Non committare secrets nel codice**
   - I secrets devono essere SOLO in GitHub Secrets, mai nel `.env` committato
   - Aggiungi `.env` al `.gitignore`

2. **Ruota le credenziali regolarmente**
   - Cambia `JWT_SECRET` ogni 3-6 mesi
   - Rigenera `FRONTEND_API_KEYS` periodicamente
   - Aggiorna password amministratore

3. **Limita i permessi**
   - Solo utenti/team autorizzati devono avere accesso ai secrets
   - Usa GitHub Environments per richiedere approval su deploy production

4. **Monitora i log**
   - Controlla i log del workflow per accessi non autorizzati
   - I secrets non vengono mai stampati nei log (GitHub li maschera automaticamente)

### Audit Secrets

Per verificare quali secrets sono configurati:

1. Vai su **Settings** → **Secrets and variables** → **Actions** → **Secrets**
2. Verifica la lista dei secrets (i valori sono nascosti)
3. Controlla la data di ultimo aggiornamento

## Riferimenti

- [Workflow GitHub Actions](../../.github/workflows/deploy-production.yml)
- [Variabili d'ambiente Docker](.env)
- [Guida Multi-Dominio](multi-domain-deployment.md)
- [Script di test](../../test-deployment.sh)
- [GitHub Docs: Encrypted Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)

---

**Ultimo aggiornamento**: 2026-01-20
