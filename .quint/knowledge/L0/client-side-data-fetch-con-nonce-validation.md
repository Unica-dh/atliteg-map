---
scope: Static sites con build process, richiede Nginx + JavaScript client, compatibile con Docker volumes
kind: system
content_hash: 5b117c9acca77021034f238f5314abc7
---

# Hypothesis: Client-Side Data Fetch con Nonce Validation

Proteggi i file JSON usando un sistema di nonce generato server-side che impedisce direct linking ma consente fetch client-side legittimo:

1. **Build-time Nonce Generation**: Durante npm run build, genera un nonce crittografico random (es. UUID v4)
2. **File Renaming**: Rinomina lemmi.json → lemmi-{nonce}.json durante il build
3. **Embed Nonce in HTML**: Inietta il nonce nell'index.html come meta tag o inline script: 
   ```html
   <script>window.DATA_NONCE = "{nonce}"</script>
   ```
4. **Client Fetch**: L'app React fetcha `/data/lemmi-${window.DATA_NONCE}.json`
5. **Nginx Security**: 
   - Blocca pattern `/data/*.json` (no nonce)
   - Consenti solo `/data/*-[a-f0-9-]{36}.json`
   - Aggiungi Header CSP per prevenire exfiltration

**Data Update Process**:
- SSH al server → modifica CSV in lemmario-dashboard/public/data/
- Esegui `npm run preprocess` (genera nuovo nonce + rinomina file)
- Copia in ./data/ volume
- Rebuild container (nuovo nonce in HTML)

**Security**: Il nonce cambia ad ogni build, invalidando vecchi link. Direct GET senza nonce → 403 Forbidden.

## Rationale
{"anomaly": "JSON files are publicly accessible at predictable URLs (/data/lemmi.json), allowing unauthorized scraping and direct linking", "approach": "Security through obscurity using cryptographic nonces - files exist but are not guessable, while legitimate app has nonce embedded at build time", "alternatives_rejected": ["JWT tokens (requires backend server)", "Basic Auth (breaks Nginx static serving model)"]}