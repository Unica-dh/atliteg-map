---
scope: Qualsiasi progetto Git-based con CI/CD, applicabile a stack tecnologici diversi, richiede solo filesystem storage per history
kind: system
content_hash: 4a3fddbc306251765378705d2ead2f3e
---

# Hypothesis: Git-based Rollback con Deployment Snapshots

Strategia conservativa che usa Git come source of truth per rollback:

1. Workflow mantiene file .deployment-history.json con ultimi N deployment riusciti (SHA + timestamp + status)
2. Pre-deployment: Crea Git tag automatico 'deploy-YYYY-MM-DD-HHmmss' sul commit corrente
3. Post-deployment health check avanzato:
   - HTTP health endpoint (/api/health)
   - Verifica integrità dati (check se lemmi.json è caricabile)
   - Response time threshold (< 2s)
4. Se health check fallisce:
   - Leggi ultimo deployment riuscito da .deployment-history.json
   - Git reset --hard al SHA precedente
   - Rebuild Docker images
   - Redeploy
5. Notifica su GitHub Actions con dettagli errore

Vantaggi: Semplice, usa infrastruttura esistente, nessun overhead storage
Svantaggi: Rollback richiede rebuild (~2-3 minuti recovery time)

## Rationale
{"anomaly": "Current workflow has no historical tracking of successful deployments or automated recovery procedure", "approach": "Leverage Git immutability and tagging for reliable rollback state, trade recovery speed for simplicity", "alternatives_rejected": ["Database snapshot rollback (no database in this project)", "Kubernetes-style revision history (overkill for Docker Compose)"]}