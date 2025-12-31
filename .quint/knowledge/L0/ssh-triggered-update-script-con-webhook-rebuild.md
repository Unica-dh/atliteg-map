---
kind: system
scope: Server con SSH access, progetti dove dataset è relativamente piccolo (<10MB compressed), richiede rebuild per ogni data update
content_hash: 7180e3844581a84d485e25709da46cdc
---

# Hypothesis: SSH-Triggered Update Script con Webhook Rebuild

Automatizza l'update dei dati tramite script SSH che gestisce l'intero pipeline, proteggendo i dati via filesystem permissions:

1. **Upload Script**: Crea script `update-data.sh` sul server:
   ```bash
   #!/bin/bash
   # Accetta CSV via stdin o file path
   CSV_PATH=$1
   DEPLOY_PATH=/path/to/atliteg-map
   
   # Valida CSV (check header, format)
   validate_csv "$CSV_PATH" || exit 1
   
   # Copia in lemmario-dashboard/public/data/
   cp "$CSV_PATH" "$DEPLOY_PATH/lemmario-dashboard/public/data/Lemmi_forme_atliteg_updated.csv"
   
   # Preprocessa
   cd "$DEPLOY_PATH/lemmario-dashboard"
   node scripts/preprocess-data.js
   
   # Sincronizza con volume Docker
   cp public/data/*.json "$DEPLOY_PATH/data/"
   
   # Restart container
   cd "$DEPLOY_PATH"
   docker compose restart lemmario-dashboard
   ```

2. **SSH Access Control**: Solo utenti autorizzati con chiave SSH possono eseguire lo script
3. **Nginx Security**: Modifica nginx.conf per bloccare /data/ completamente:
   ```nginx
   location /data/ {
       deny all;  # Nessun accesso HTTP
   }
   ```
4. **Client-Side Bundling**: Cambia architettura - bundla lemmi.json direttamente nel JavaScript bundle durante build (import JSON as module)

**Data Access**: Dati embedded nel bundle JS (non fetchable), caricati direttamente in memoria al page load.

## Rationale
{"anomaly": "Current manual 4-step update process is error-prone and data files remain HTTP-accessible", "approach": "Combine automation (SSH script) with architectural change (bundle data in JS) to eliminate HTTP exposure entirely", "alternatives_rejected": ["Keep JSON fetchable (security requirement violated)", "Separate API server (violates static-site constraint)"]}