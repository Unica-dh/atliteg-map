---
scope: GitHub-hosted projects con self-hosted runner, adatto a dati semi-static (update frequency < 1/giorno), richiede rebuild per ogni update
kind: system
content_hash: d6e0e27e12d970ed9cbabba85b21498a
---

# Hypothesis: GitHub Actions Data Upload Workflow con Encrypted Secrets

Usa GitHub come secure data repository e Actions per automatizzare l'update pipeline, eliminando accesso HTTP ai raw data:

1. **Data Storage**: Committa CSV aggiornato nel repository GitHub (private repo)
2. **Automated Pipeline** (GitHub Actions workflow):
   ```yaml
   name: Update Data
   on:
     workflow_dispatch:
       inputs:
         csv_file:
           description: 'Path to updated CSV in repo'
           required: true
   
   jobs:
     update:
       runs-on: self-hosted
       steps:
         - name: Checkout repo
           uses: actions/checkout@v4
         
         - name: Preprocess CSV
           run: |
             cd lemmario-dashboard
             node scripts/preprocess-data.js
         
         - name: Sync to Docker volume
           run: |
             cp lemmario-dashboard/public/data/*.json ./data/
         
         - name: Restart container
           run: docker compose restart lemmario-dashboard
   ```

3. **Data Access Security**: 
   - Nginx blocca completamente /data/: `location /data/ { deny all; }`
   - Dati bundled durante build come static imports:
     ```typescript
     import lemmiData from '@/data/lemmi.json' assert { type: 'json' };
     ```
   - JSON embedded nel JavaScript bundle (not fetchable)

4. **Update Process**:
   - Researcher aggiorna CSV localmente
   - Commit + push to GitHub
   - Esegui workflow manualmente da GitHub UI
   - Self-hosted runner rebuilda automaticamente

5. **Audit Trail**: Git history fornisce full audit trail di tutte le modifiche ai dati

**Build Optimization**: Webpack/Next.js tree-shaking riduce bundle size se non tutti i dati sono usati.

## Rationale
{"anomaly": "Manual SSH-based updates lack audit trail and automation; HTTP-served JSON files violate security requirement", "approach": "Leverage GitHub as secure data store + CI/CD for automation + data bundling to eliminate HTTP exposure", "alternatives_rejected": ["Keep data in separate private storage (adds infrastructure)", "Manual git commits only (no automation)"]}