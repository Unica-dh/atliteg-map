---
scope: Progetti Docker Compose con deployment continuo, requires disk space per multiple images (~500MB × 5 = 2.5GB), Ubuntu/Linux servers
kind: system
content_hash: f0c1dc4d0025cb0ec2f25b6c889dd7d8
---

# Hypothesis: Docker Image Tagging with Git SHA Rollback

Tag ogni immagine Docker con il Git commit SHA (es. atliteg-dashboard:abc123f) invece di usare solo :latest. Mantieni le ultime N immagini (es. 5) sul server. Per il rollback: 
1. Aggiungi step di health check post-deployment (verifica HTTP 200 su endpoint critici)
2. Se health check fallisce, identifica l'ultima immagine funzionante dal registry locale Docker
3. Esegui docker compose down && docker compose up -d con la vecchia immagine specificata
4. Notifica fallimento deployment su GitHub Actions

Implementazione:
- Modifica docker-compose.yml per usare variabile d'ambiente IMAGE_TAG
- Workflow salva SHA corrente prima del build
- Script di rollback automatico nel workflow if: failure()
- Cleanup periodico di immagini vecchie (retention 5 versioni)

## Rationale
{"anomaly": "Deployments always use :latest tag - impossible to revert to previous working version without git revert + rebuild", "approach": "Semantic versioning tramite Git SHA permette rollback istantaneo senza rebuild, health checks automatizzano la detection di failure", "alternatives_rejected": ["Manual rollback (troppo lento, richiede intervento umano)", "Git tag semantico (overhead di tagging manuale per ogni deploy)"]}