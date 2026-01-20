# Checklist Deploy Multi-Dominio AtLiTeG

## 📋 Modifiche Implementate

Questa guida rapida riassume le modifiche apportate per supportare l'accesso da entrambi i domini:
- `https://atlante.atliteg.org`
- `https://linguistica.dh.unica.it/atliteg`

## ✅ File Modificati

### 1. [lemmario-dashboard/app/layout.tsx](lemmario-dashboard/app/layout.tsx)
- ✅ Aggiunto supporto dinamico per `metadataBase` usando `NEXT_PUBLIC_SITE_URL`
- ✅ Metadata SEO (Open Graph, canonical URL) ora usano il dominio dalla variabile d'ambiente

### 2. [lemmario-dashboard/nginx.conf](lemmario-dashboard/nginx.conf)
- ✅ `server_name` aggiornato per includere entrambi i domini
- ✅ Ora accetta richieste da `atlante.atliteg.org` e `linguistica.dh.unica.it`

### 3. [.env](.env)
- ✅ Aggiunta variabile `NEXT_PUBLIC_SITE_URL` per il dominio primario
- ✅ Aggiornato `ALLOWED_ORIGINS` per includere entrambi i domini HTTPS

### 4. [test-deployment.sh](test-deployment.sh) (NUOVO)
- ✅ Script di test automatico per verificare deployment su entrambi i domini
- ✅ Verifica HTTP status, meta tags, SSL, performance

### 5. [docs/guides/multi-domain-deployment.md](docs/guides/multi-domain-deployment.md) (NUOVO)
- ✅ Documentazione completa su configurazione multi-dominio
- ✅ Guida troubleshooting e configurazione DNS/reverse proxy

### 6. [CLAUDE.md](CLAUDE.md)
- ✅ Aggiunta sezione "Multi-Domain Support"
- ✅ Aggiunta sezione "Testing Remote Deployment"

## 🚀 Procedura di Deploy

### Passo 1: Verificare le Variabili d'Ambiente

Controlla che il file `.env` contenga:

```bash
# Site URL (dominio primario per SEO)
NEXT_PUBLIC_SITE_URL=https://atlante.atliteg.org

# CORS (entrambi i domini)
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:9000,https://atlante.atliteg.org,https://linguistica.dh.unica.it
```

### Passo 2: Build e Deploy Docker

```bash
# From project root
docker compose down
docker compose build
docker compose up -d
```

### Passo 3: Verificare Health Check

```bash
# Verifica che i container siano healthy
docker compose ps

# Dovrebbe mostrare:
# atliteg-lemmario-dashboard   healthy
# atliteg-backend              healthy
```

### Passo 4: Test Locale (Opzionale)

Se vuoi testare in locale prima del deploy in produzione:

```bash
# Aggiungi in /etc/hosts
sudo nano /etc/hosts

# Aggiungi queste righe:
127.0.0.1 atlante.atliteg.org
127.0.0.1 linguistica.dh.unica.it

# Test
curl http://atlante.atliteg.org:9000
curl http://linguistica.dh.unica.it:9000
```

### Passo 5: Configurare Reverse Proxy (Produzione)

Sul server di produzione, configura il reverse proxy upstream (es. Nginx) per SSL termination:

```nginx
# /etc/nginx/sites-available/atliteg

# Dominio primario
server {
    listen 443 ssl http2;
    server_name atlante.atliteg.org;

    ssl_certificate /etc/letsencrypt/live/atlante.atliteg.org/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/atlante.atliteg.org/privkey.pem;

    location / {
        proxy_pass http://localhost:9000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Dominio secondario (con subpath /atliteg)
server {
    listen 443 ssl http2;
    server_name linguistica.dh.unica.it;

    ssl_certificate /etc/letsencrypt/live/linguistica.dh.unica.it/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/linguistica.dh.unica.it/privkey.pem;

    location /atliteg {
        rewrite ^/atliteg(/.*)$ $1 break;
        proxy_pass http://localhost:9000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /atliteg/ {
        proxy_pass http://localhost:9000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**IMPORTANTE**: Il trailing slash in `proxy_pass http://localhost:9000/;` è fondamentale per `linguistica.dh.unica.it/atliteg`.

Dopo aver configurato:

```bash
# Verifica configurazione
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### Passo 6: Configurare SSL (Let's Encrypt)

```bash
# Installa certbot se non presente
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx

# Ottieni certificati per entrambi i domini
sudo certbot --nginx -d atlante.atliteg.org
sudo certbot --nginx -d linguistica.dh.unica.it

# Verifica auto-renewal
sudo certbot renew --dry-run
```

### Passo 7: Test Post-Deploy

Esegui lo script di test automatico:

```bash
chmod +x test-deployment.sh
./test-deployment.sh
```

Output atteso:

```
╔════════════════════════════════════════════════════╗
║  AtLiTeG Multi-Domain Deployment Test Suite       ║
╚════════════════════════════════════════════════════╝

Testing domains:
  • https://atlante.atliteg.org
  • https://linguistica.dh.unica.it/atliteg

════════════════════════════════════════════════════
Testing: https://atlante.atliteg.org
════════════════════════════════════════════════════
✓ HTTP 200 OK: https://atlante.atliteg.org
✓ Content-Type is HTML: https://atlante.atliteg.org
✓ Page title contains 'AtLiTeG': https://atlante.atliteg.org
✓ Meta tags present (3 found): https://atlante.atliteg.org
✓ Static assets accessible (2/2): https://atlante.atliteg.org
✓ SSL certificate valid until: Dec 15 12:00:00 2026 GMT
✓ Response time OK (0.234s < 3s): https://atlante.atliteg.org

════════════════════════════════════════════════════
Testing: https://linguistica.dh.unica.it/atliteg
════════════════════════════════════════════════════
✓ HTTP 200 OK: https://linguistica.dh.unica.it/atliteg
✓ Content-Type is HTML: https://linguistica.dh.unica.it/atliteg
✓ Page title contains 'AtLiTeG': https://linguistica.dh.unica.it/atliteg
✓ Meta tags present (3 found): https://linguistica.dh.unica.it/atliteg
✓ Static assets accessible (2/2): https://linguistica.dh.unica.it/atliteg
✓ SSL certificate valid until: Dec 15 12:00:00 2026 GMT
✓ Response time OK (0.189s < 3s): https://linguistica.dh.unica.it/atliteg

════════════════════════════════════════════════════
Test Summary
════════════════════════════════════════════════════
Tests passed: 14
Tests failed: 0

✓ All tests passed! Deployment is healthy.
```

## 🔍 Test Manuali Aggiuntivi

```bash
# Test HTTP headers
curl -I https://atlante.atliteg.org
curl -I https://linguistica.dh.unica.it/atliteg

# Test meta tags SEO
curl -s https://atlante.atliteg.org | grep -i 'meta property="og:url"'
curl -s https://linguistica.dh.unica.it/atliteg | grep -i 'meta property="og:url"'

# Test API backend (se pubblico)
curl -I https://atlante.atliteg.org/api/lemmi

# Test certificati SSL
echo | openssl s_client -servername atlante.atliteg.org -connect atlante.atliteg.org:443 2>/dev/null | openssl x509 -noout -dates
echo | openssl s_client -servername linguistica.dh.unica.it -connect linguistica.dh.unica.it:443 2>/dev/null | openssl x509 -noout -dates
```

## 🎯 Verifica Funzionalità

Apri un browser e verifica manualmente:

### Su https://atlante.atliteg.org
- ✅ Homepage carica correttamente
- ✅ Mappa geografica visibile e interattiva
- ✅ Filtri funzionano (categorie, periodi)
- ✅ Ricerca lemmi funziona
- ✅ Dettagli lemma si aprono al click
- ✅ Meta tags SEO corretti (View Source → cerca "og:url")

### Su https://linguistica.dh.unica.it/atliteg
- ✅ Homepage carica correttamente
- ✅ Mappa geografica visibile e interattiva
- ✅ Filtri funzionano (categorie, periodi)
- ✅ Ricerca lemmi funziona
- ✅ Dettagli lemma si aprono al click
- ✅ Meta tags SEO corretti (View Source → cerca "og:url")

### Console Browser (F12)
- ✅ Nessun errore CORS
- ✅ Nessun errore 404 su assets
- ✅ API calls funzionano (`/api/lemmi`, `/api/health`)

## 🐛 Troubleshooting

### Problema: 404 Not Found su linguistica.dh.unica.it/atliteg

**Causa**: Reverse proxy non configurato correttamente.

**Soluzione**: Verifica il trailing slash in `proxy_pass`:
```nginx
location /atliteg/ {
    proxy_pass http://localhost:9000/;  # Trailing slash!
}
```

### Problema: CORS Error in Console

**Causa**: Dominio non in `ALLOWED_ORIGINS`.

**Soluzione**:
```bash
# Aggiungi in .env
ALLOWED_ORIGINS=https://atlante.atliteg.org,https://linguistica.dh.unica.it

# Restart backend
docker compose restart backend
```

### Problema: Certificato SSL non valido

**Causa**: Certificato mancante o scaduto.

**Soluzione**:
```bash
# Rigenera con Let's Encrypt
sudo certbot certonly --nginx -d atlante.atliteg.org
sudo certbot certonly --nginx -d linguistica.dh.unica.it

# Reload Nginx
sudo systemctl reload nginx
```

### Problema: Metadata SEO mostrano URL sbagliato

**Causa**: `NEXT_PUBLIC_SITE_URL` non impostato.

**Soluzione**:
```bash
# In .env
NEXT_PUBLIC_SITE_URL=https://atlante.atliteg.org

# Rebuild
docker compose up --build -d lemmario-dashboard
```

## 📊 Monitoraggio Continuo

Setup cron job per monitoraggio automatico:

```bash
# Aggiungi in crontab
crontab -e

# Test ogni 5 minuti
*/5 * * * * /path/to/atliteg-map/test-deployment.sh >> /var/log/atliteg-health.log 2>&1 || echo "AtLiTeG health check failed at $(date)" | mail -s "Alert: AtLiTeG" admin@example.com
```

## 🔐 Configurazione GitHub Actions

Il workflow GitHub Actions è stato aggiornato per supportare il multi-dominio. Devi configurare i seguenti secrets:

### Secrets da Aggiornare/Creare

1. **`ALLOWED_ORIGINS`** (AGGIORNA)
   ```
   https://atlante.atliteg.org,https://linguistica.dh.unica.it
   ```

2. **`NEXT_PUBLIC_SITE_URL`** (NUOVO)
   ```
   https://atlante.atliteg.org
   ```

3. **`RUN_DOMAIN_TESTS`** (OPZIONALE - Variable, non Secret)
   ```
   true
   ```

Per la guida completa sulla configurazione dei secrets, consulta:
[GitHub Actions Secrets Guide](docs/guides/github-actions-secrets.md)

## 📚 Documentazione Completa

Per informazioni dettagliate, consulta:
- [Multi-Domain Deployment Guide](docs/guides/multi-domain-deployment.md)
- [GitHub Actions Secrets](docs/guides/github-actions-secrets.md)
- [CLAUDE.md](CLAUDE.md#multi-domain-support)
- [Nginx Configuration](lemmario-dashboard/nginx.conf)
- [Test Script](test-deployment.sh)
- [Workflow GitHub Actions](.github/workflows/deploy-production.yml)

## ✉️ Supporto

Per problemi o domande:
- GitHub Issues: [Segnala un problema](https://github.com/Unica-dh/atliteg-map/issues)
- Email: [Contatta il team](mailto:admin@example.com)

---

**Versione**: 1.0.0
**Data**: 2026-01-20
**Autore**: Claude Code (Anthropic)
