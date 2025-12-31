---
scope: Docker Compose projects con dati statici su volume, richiede spazio disco per backup (~100MB × 3 = 300MB per ATLITEG), Linux con rsync
kind: system
content_hash: eb2765e026a4ec372dcd37b6d6eadd74
---

# Hypothesis: Hybrid Rollback con Docker Volume Snapshots

Combina Docker image tagging + volume snapshots per rollback completo di applicazione E dati:

1. Prima del deployment, crea snapshot del volume ./data usando rsync:
   - rsync -a ./data/ ./data-backups/backup-$(date +%Y%m%d-%H%M%S)/
   - Mantieni ultimi 3 backup (retention policy)
2. Tagga immagine Docker con timestamp: atliteg:$(date +%Y%m%d-%H%M%S)
3. Salva mapping timestamp -> git SHA in metadata file
4. Post-deployment health check:
   - Verifica container health
   - Test funzionale: curl -f http://localhost:9000/data/lemmi.json
   - Controlla log Docker per errori (docker logs --since 30s)
5. Rollback automatico se failure:
   - Ripristina volume data da ultimo backup
   - Riavvia container con immagine precedente
   - Recovery time: ~30 secondi

Gestione retention:
- Cleanup automatico backup > 7 giorni
- Alert se spazio disco < 20%

## Rationale
{"anomaly": "Current deployment doesn't backup the critical ./data volume - CSV/JSON updates could break application without recovery path", "approach": "Protect both application code (via Docker images) and static data (via volume snapshots) for complete rollback capability", "alternatives_rejected": ["Docker volume plugins (requires additional infrastructure)", "S3/remote backup (VPN constraints make external services problematic)"]}