# Configurazione Credenziali Admin

## 🚀 Setup Rapido (3 passi)

1. **Copia il file .env.example**:
   ```bash
   cp .env.example .env
   ```

2. **Modifica il file `.env`** e scrivi le tue credenziali:
   ```env
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=la_tua_password
   ```

3. **Riavvia i container**:
   ```bash
   docker compose restart backend
   ```

✅ **Fatto!** Ora puoi accedere con le tue credenziali.

## 📝 Credenziali di Default (Development)

⚠️ **ATTENZIONE**: Queste credenziali sono configurate di default per lo sviluppo locale.
**DEVI cambiarle in produzione!**

- **Username**: `admin`
- **Password**: `admin`

## 🔐 Due Modi per Configurare la Password

### Metodo 1: Password in Chiaro (SEMPLICE) ⭐ Raccomandato per iniziare

Scrivi semplicemente la password nel file `.env`:

```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD=miaPasswordSegreta123
```

**Vantaggi**:
- ✅ Semplicissimo da configurare
- ✅ Perfetto per sviluppo locale
- ✅ Facile da cambiare

**Nota**: Il file `.env` è già in `.gitignore`, quindi non viene committato nel repository.

### Metodo 2: Hash Bcrypt (PIÙ SICURO) 🔒 Raccomandato per produzione

Per maggiore sicurezza (es. in produzione), usa un hash bcrypt invece della password in chiaro.

**Opzione A - Script automatico**:

```bash
npm install
npm run generate-password-hash
```

Lo script ti chiederà la password e genererà l'hash già pronto da copiare.

**Opzione B - Comando manuale**:

```bash
docker compose exec backend node -e "require('bcrypt').hash('la_tua_password', 10).then(h => console.log(h))"
```

Poi copia l'hash nel `.env`:

```env
ADMIN_USERNAME=admin
# ADMIN_PASSWORD=admin  # <-- Commenta o rimuovi questa riga
ADMIN_PASSWORD_HASH=$$2b$$10$$il_tuo_hash_qui
```

⚠️ **IMPORTANTE**: Nel file `.env` usa `$$` invece di `$` per escapare i caratteri speciali.

## 🔑 Altre Variabili di Sicurezza

### JWT Secret

Genera un secret sicuro per i token JWT:

```bash
# Opzione 1: OpenSSL
openssl rand -hex 32

# Opzione 2: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Aggiorna `.env`:
```env
JWT_SECRET=il_tuo_secret_generato_qui
```

### API Keys Frontend

Genera chiavi API sicure per il frontend:

```bash
openssl rand -hex 24
```

Aggiorna `.env`:
```env
FRONTEND_API_KEYS=chiave_api_generata_qui
NEXT_PUBLIC_API_KEY=chiave_api_generata_qui
```

## ✅ Verifica Configurazione

Dopo aver modificato `.env`, riavvia i container:

```bash
docker compose restart backend
```

Testa il login dall'interfaccia web:

```
http://localhost:9000/admin/upload
```

Oppure via API:

```bash
curl -X POST http://localhost:9000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"la_tua_password"}' | jq
```

Se vedi `"success": true`, la configurazione è corretta! 🎉

## 🔒 Sicurezza - Best Practices

### Per Sviluppo Locale
- ✅ Usa `ADMIN_PASSWORD` (in chiaro) per semplicità
- ✅ Password semplice va bene (es. `admin`)
- ✅ Testa frequentemente

### Per Produzione
- 🔐 Usa `ADMIN_PASSWORD_HASH` (bcrypt)
- 🔐 Password forte (min 12 caratteri, maiuscole, minuscole, numeri, simboli)
- 🔐 Genera JWT_SECRET con almeno 32 caratteri random
- 🔐 Usa chiavi API univoche e complesse
- 🔐 Cambia tutte le credenziali di default
- 🔐 Considera l'uso di secret manager (AWS Secrets, Azure Key Vault, ecc.)

### Generale
- ✅ Il file `.env` è già nel `.gitignore` - non verrà committato
- ✅ Non condividere mai il file `.env` con credenziali reali
- ✅ Fai backup del file `.env` in un luogo sicuro
- ✅ Rigenera credenziali periodicamente

## 📁 File di Configurazione

| File | Scopo | Committato |
|------|-------|------------|
| `.env` | Credenziali reali | ❌ NO (in .gitignore) |
| `.env.example` | Template e documentazione | ✅ SI |
| `docker-compose.yml` | Usa le variabili dal `.env` | ✅ SI |

## 🛠️ Troubleshooting

### ❌ Login fallito dopo cambio password

**Soluzione**:
1. Verifica che le credenziali nel `.env` siano corrette
2. Se usi `ADMIN_PASSWORD_HASH`, controlla di aver escapato con `$$`
3. Riavvia il backend: `docker compose restart backend`
4. Controlla i log: `docker compose logs backend | grep -i login`

### ❌ Variabile non impostata

Se vedi warning tipo `The "wqM4" variable is not set`:

**Soluzione**:
- I `$` nell'hash non sono stati escapati correttamente
- Nel file `.env` devi usare `$$` invece di `$`
- Esempio: `$$2b$$10$$abcdef...` invece di `$2b$10$abcdef...`

### ❌ Token JWT scaduto

I token durano 24 ore.

**Soluzione**:
- Rifai il login dall'interfaccia admin
- Il token verrà rinnovato automaticamente

### ❌ CORS error dal browser

**Soluzione**:
Assicurati che `ALLOWED_ORIGINS` nel `.env` includa l'URL del frontend:
```env
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:9000
```

## 📚 Comandi Utili

```bash
# Installa dipendenze per script helper
npm install

# Genera hash password interattivo
npm run generate-password-hash

# Riavvia solo il backend
docker compose restart backend

# Visualizza log del backend
docker compose logs -f backend

# Testa login via API
curl -X POST http://localhost:9000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}' | jq

# Genera JWT secret sicuro
openssl rand -hex 32

# Genera API key sicura
openssl rand -hex 24
```

## 🎯 Quick Reference

| Variabile | Tipo | Default Dev | Esempio Production |
|-----------|------|-------------|-------------------|
| `ADMIN_USERNAME` | String | `admin` | `admin` |
| `ADMIN_PASSWORD` | String | `admin` | `MySecureP@ss2024!` |
| `ADMIN_PASSWORD_HASH` | Bcrypt | - | `$$2b$$10$$...` |
| `JWT_SECRET` | String | `your_jwt_secret_change_in_production` | `a1b2c3d4e5f6...` (32+ chars) |
| `FRONTEND_API_KEYS` | String | `default_dev_key` | `sk_prod_abc123xyz...` |
| `NEXT_PUBLIC_API_KEY` | String | `default_dev_key` | `sk_prod_abc123xyz...` |
| `ALLOWED_ORIGINS` | CSV | `http://localhost:3000,http://localhost:9000` | `https://atliteg.example.com` |
