# Guida al Deploy con Docker

Questa guida spiega come costruire e avviare l'applicazione AtLiTeG usando Docker.

## Prerequisiti

- Docker e Docker Compose installati
- Node.js 18+ (per la build locale degli artifacts)
- npm

## Processo di Build

L'applicazione utilizza un approccio ibrido: alcune parti vengono costruite localmente prima di essere copiate nei container Docker. Questo risolve problemi di compatibilità con npm in ambienti containerizzati.

### Opzione 1: Script Automatico (Consigliato)

Usa lo script di build automatico che gestisce tutti i passaggi:

```bash
./build-docker.sh
```

Lo script eseguirà automaticamente:
1. Installazione dipendenze frontend
2. Build dell'applicazione Next.js
3. Installazione dipendenze backend  
4. Build delle immagini Docker

### Opzione 2: Build Manuale

Se preferisci eseguire i passaggi manualmente:

#### 1. Build Frontend

```bash
cd lemmario-dashboard
npm install
NEXT_PUBLIC_API_URL= NEXT_PUBLIC_API_KEY=default_dev_key npm run build
```

Questo crea la directory `out/` con i file statici ottimizzati.
Il frontend usa URL relativi per le chiamate API, che vengono proxate da nginx al backend.

#### 2. Build Backend

```bash
cd lemmario-dashboard/server
npm install
cd ../..
```

Questo installa le dipendenze Node.js che verranno copiate nel container.

#### 3. Build Docker Images

```bash
docker compose build
```

## Avvio dei Container

Una volta completata la build:

```bash
docker compose up -d
```

## Verifica

Controlla che i container siano in esecuzione e healthy:

```bash
docker compose ps
```

Dovresti vedere:
- `atliteg-backend` - Status: healthy
- `atliteg-lemmario-dashboard` - Status: healthy

## Test dell'Applicazione

### Frontend
Apri il browser su: http://localhost:9000

### Verifica Protezione Dati
I file CSV e JSON non devono essere accessibili direttamente:

```bash
# Questi comandi devono restituire 403 Forbidden
curl -I http://localhost:9000/data/lemmi.json
curl -I http://localhost:9000/data/Lemmi_forme_atliteg_updated.csv
```

### Backend API
Il backend è accessibile solo internamente ai container, non direttamente dall'host per motivi di sicurezza.

## Logs

Visualizza i log dei container:

```bash
# Tutti i log
docker compose logs -f

# Solo backend
docker compose logs -f backend

# Solo frontend
docker compose logs -f lemmario-dashboard
```

## Stop e Rimozione

```bash
# Stop dei container
docker compose down

# Stop e rimozione volumi
docker compose down -v
```

## Troubleshooting

### Errore: "/out": not found

Significa che il frontend non è stato buildato. Esegui:

```bash
cd lemmario-dashboard
npm install
NEXT_PUBLIC_API_URL=http://backend:3001 NEXT_PUBLIC_API_KEY=default_dev_key npm run build
```

### Errore: Cannot find module 'express'

Significa che le dipendenze backend non sono installate. Esegui:

```bash
cd lemmario-dashboard/server
npm install
```

### Backend unhealthy

Controlla i log per vedere l'errore:

```bash
docker compose logs backend
```

## Configurazione Ambiente

Per modificare le variabili di ambiente, crea un file `.env` nella root del progetto:

```env
# Backend
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=$2b$10$...
FRONTEND_API_KEYS=your_api_key
JWT_SECRET=your_secret

# Frontend (rebuild richiesto)
NEXT_PUBLIC_API_URL=http://backend:3001
NEXT_PUBLIC_API_KEY=your_api_key
```

**Importante**: Dopo aver modificato le variabili `NEXT_PUBLIC_*`, devi rifare il build del frontend.

## Produzione

Per deploy in produzione:

1. **Cambia le credenziali di default** in `.env`
2. **Genera password hash sicuri**: `node -e "console.log(require('bcrypt').hashSync('your_password', 10))"`
3. **Usa chiavi API robuste**: almeno 32 caratteri random
4. **Configura HTTPS** con reverse proxy (nginx/traefik)
5. **Abilita firewall** per limitare l'accesso

## Rebuild Dopo Modifiche

Se modifichi il codice:

```bash
# Frontend (modiche a React/Next.js)
cd lemmario-dashboard
npm run build
cd ..
docker compose build lemmario-dashboard
docker compose up -d lemmario-dashboard

# Backend (modifiche a Express/API)
docker compose build backend
docker compose up -d backend
```
