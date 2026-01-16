# GitHub Secrets Setup Guide

## Overview
Questa guida spiega come configurare i **GitHub Secrets** necessari per il deploy automatico in produzione.

## Secrets Richiesti

Il workflow CI/CD richiede i seguenti secrets:

### 1. DEPLOY_PATH
- **Descrizione**: Path assoluto della directory sul server di produzione dove è clonato il repository
- **Esempio**: `/home/username/atliteg-map`
- **Come ottenerlo**: Esegui `pwd` nella directory del progetto sul server

### 2. PRODUCTION_URL
- **Descrizione**: URL pubblico dell'applicazione in produzione
- **Esempio**: `https://atliteg.example.com`
- **Nota**: Questo è una *variable* non un secret (configuralo in Environment Variables)

### 3. FRONTEND_API_KEYS
- **Descrizione**: API keys per autenticare le richieste dal frontend al backend (separati da virgola per rotation)
- **Esempio**: `key1_abc123xyz,key2_def456uvw`
- **Generazione**: 
  ```bash
  openssl rand -hex 32
  ```
- **Importante**: Almeno una key deve corrispondere a `NEXT_PUBLIC_API_KEY`

### 4. NEXT_PUBLIC_API_KEY
- **Descrizione**: API key pubblica usata dal frontend (deve corrispondere a una delle keys in FRONTEND_API_KEYS)
- **Esempio**: `key1_abc123xyz`
- **Nota**: Deve essere **identica** a una delle chiavi in FRONTEND_API_KEYS

### 5. ADMIN_USERNAME
- **Descrizione**: Username per il login admin
- **Esempio**: `admin`
- **Default**: Se non impostato, usa `admin`

### 6. ADMIN_PASSWORD
- **Descrizione**: Password in chiaro per il login admin (opzione semplice)
- **Esempio**: `MySecureP@ssw0rd2024`
- **Alternativa**: Puoi usare `ADMIN_PASSWORD_HASH` invece (vedi sotto)
- **Importante**: Usa una password forte in produzione!

### 7. ADMIN_PASSWORD_HASH (opzionale)
- **Descrizione**: Hash bcrypt della password admin (opzione più sicura)
- **Generazione**: 
  ```bash
  cd lemmario-dashboard/server
  npm run generate-password-hash
  ```
- **Esempio**: `$2b$10$wqM4/4h7tknyFoihM8wLCuLTv9Ndbs3V1rQ70hsSQtOwa2k47wnQW`
- **Nota**: Se impostato, ha priorità su `ADMIN_PASSWORD`

### 8. JWT_SECRET
- **Descrizione**: Secret per firmare i JWT tokens
- **Generazione**:
  ```bash
  openssl rand -hex 32
  ```
- **Esempio**: `a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456`
- **Importante**: Deve essere almeno 32 caratteri

### 9. ALLOWED_ORIGINS
- **Descrizione**: Origini CORS permesse (separati da virgola)
- **Esempio**: `https://atliteg.example.com,http://localhost:9000`
- **Nota**: Include il dominio di produzione e opzionalmente localhost per test

## Come Configurare i Secrets su GitHub

### Passo 1: Vai alle Settings del Repository
1. Vai su GitHub: `https://github.com/Unica-dh/atliteg-map`
2. Click su **Settings** (tab in alto)
3. Nel menu laterale, vai su **Secrets and variables** → **Actions**

### Passo 2: Crea l'Environment "production"
1. Nel menu laterale, vai su **Environments**
2. Click su **New environment**
3. Nome: `production`
4. Click su **Configure environment**

### Passo 3: Aggiungi i Secrets
Per ogni secret:
1. Click su **Add secret** (o **Add environment secret** se dentro l'environment)
2. **Name**: Nome del secret (es. `ADMIN_PASSWORD`)
3. **Value**: Valore del secret (es. `MySecurePassword123`)
4. Click su **Add secret**

### Passo 4: Aggiungi la Variable PRODUCTION_URL
1. Nel tab **Variables** (accanto a Secrets)
2. Click su **Add variable**
3. **Name**: `PRODUCTION_URL`
4. **Value**: `https://your-domain.com`
5. Click su **Add variable**

## Checklist Configurazione

Usa questa checklist per verificare di aver configurato tutto:

- [ ] `DEPLOY_PATH` configurato
- [ ] `PRODUCTION_URL` configurato (come variable)
- [ ] `FRONTEND_API_KEYS` generato e configurato
- [ ] `NEXT_PUBLIC_API_KEY` configurato (corrisponde a una key in FRONTEND_API_KEYS)
- [ ] `ADMIN_USERNAME` configurato
- [ ] `ADMIN_PASSWORD` O `ADMIN_PASSWORD_HASH` configurato
- [ ] `JWT_SECRET` generato (min 32 chars) e configurato
- [ ] `ALLOWED_ORIGINS` configurato con dominio di produzione
- [ ] Environment "production" creato
- [ ] Self-hosted runner configurato e attivo

## Test della Configurazione

### 1. Test Locale
Prima di fare deploy, testa localmente con un file `.env`:

```bash
# Crea .env nella root del progetto
cat > .env << EOF
FRONTEND_API_KEYS=your_test_key
NEXT_PUBLIC_API_KEY=your_test_key
ADMIN_USERNAME=admin
ADMIN_PASSWORD=testpassword
JWT_SECRET=test_jwt_secret_min_32_chars_here_12345
ALLOWED_ORIGINS=http://localhost:9000
NEXT_PUBLIC_API_URL=http://backend:3001
EOF

# Build e run
docker compose up --build -d

# Verifica
docker compose ps
docker compose logs backend | grep -i error
```

### 2. Test Login Admin
```bash
# Ottieni JWT token
curl -X POST http://localhost:9000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"testpassword"}'

# Dovrebbe rispondere con: {"success":true,"token":"..."}
```

### 3. Test API
```bash
# Test endpoint pubblico
curl -H "X-API-Key: your_test_key" http://localhost:9000/api/lemmi

# Dovrebbe rispondere con i dati lemmi
```

## Troubleshooting

### Errore: "ADMIN_PASSWORD_HASH variable is not set"
- **Causa**: Secret non configurato o workflow non lo legge
- **Soluzione**: Verifica che il secret sia nell'environment "production", non nei repository secrets

### Errore: "container atliteg-backend is unhealthy"
- **Causa**: Backend non riesce ad avviarsi (spesso per variabili mancanti)
- **Soluzione**: 
  1. Controlla i log: `docker compose logs backend`
  2. Verifica che tutti i secrets siano configurati
  3. Verifica che il file `.env` sia stato creato dal workflow

### Errore: "Unauthorized" nelle chiamate API
- **Causa**: API key non corrisponde
- **Soluzione**: Verifica che `NEXT_PUBLIC_API_KEY` sia identica a una delle keys in `FRONTEND_API_KEYS`

### Errore: "Invalid username or password"
- **Causa**: Credenziali admin errate o hash non valido
- **Soluzione**: 
  - Se usi `ADMIN_PASSWORD`: verifica il valore del secret
  - Se usi `ADMIN_PASSWORD_HASH`: rigenera l'hash con `npm run generate-password-hash`

## Sicurezza

### Best Practices
1. ✅ **Mai committare** file `.env` in git (già in `.gitignore`)
2. ✅ **Ruota le API keys** periodicamente (usa più keys in FRONTEND_API_KEYS)
3. ✅ **Usa password forti** per admin (min 12 caratteri, mix di lettere/numeri/simboli)
4. ✅ **Limita l'accesso** ai GitHub Secrets (solo maintainers)
5. ✅ **Monitora i log** per tentativi di accesso non autorizzati
6. ✅ **Usa HTTPS** in produzione (configurato in Nginx)

### Rotation delle API Keys
Per ruotare le keys senza downtime:

1. Aggiungi una nuova key a `FRONTEND_API_KEYS`:
   ```
   old_key,new_key
   ```
2. Deploy (entrambe le keys funzionano)
3. Aggiorna `NEXT_PUBLIC_API_KEY` con la nuova key
4. Deploy di nuovo
5. Rimuovi la vecchia key da `FRONTEND_API_KEYS`
6. Deploy finale

## Riferimenti

- [GitHub Actions Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Docker Compose Environment Variables](https://docs.docker.com/compose/environment-variables/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- `.env.example` - Template di configurazione locale
- `docs/guides/deployment-guide.md` - Guida deployment completa
