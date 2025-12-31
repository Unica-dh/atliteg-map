---
scope: Qualsiasi progetto GitHub con Actions, adatto per progetti a basso traffico dove few-minutes downtime è accettabile
kind: system
content_hash: f7c1689e145d98fb4259896db26ac9ae
---

# Hypothesis: Minimal Health-Check Rollback via Workflow Revert

Approccio minimale che estende il workflow esistente con rollback tramite GitHub Actions workflow_dispatch:

1. Aggiungi health check robusto post-deployment nel workflow corrente:
   - Wait 15s per container startup
   - curl --fail --retry 3 http://localhost:9000
   - docker ps --filter "health=healthy" | grep atliteg
   - Verifica JSON endpoints: curl -f http://localhost:9000/data/lemmi.json | jq length
2. Se health check fallisce -> workflow fails (no auto-rollback)
3. Crea nuovo workflow 'rollback-production.yml':
   - Trigger: workflow_dispatch con input parameter 'target_commit_sha'
   - Checkout target commit
   - Build + Deploy stack completo
   - Lista ultimi 10 deployment riusciti nel README
4. Manual rollback process: Operatore esegue workflow manualmente da GitHub UI

Pro: Zero complessità infrastrutturale, usa solo GitHub Actions features
Contro: Rollback manuale (non automatico), recovery time 3-5 minuti

## Rationale
{"anomaly": "Current workflow lacks even basic health verification - deployments succeed even if application is broken", "approach": "Add safety net with comprehensive health checks and manual rollback capability, avoiding over-engineering for academic project", "alternatives_rejected": ["Fully automated rollback (might rollback false positives)", "No health checks (current broken state)"]}