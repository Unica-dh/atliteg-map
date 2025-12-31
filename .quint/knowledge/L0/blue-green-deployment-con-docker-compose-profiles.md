---
scope: Applicazioni stateless senza database, richiede ~2x risorse (due container simultanei durante deployment), Linux con Nginx
kind: system
content_hash: 63a044cb7835b76914b2674650e365a3
---

# Hypothesis: Blue-Green Deployment con Docker Compose Profiles

Implementa deployment blue-green usando Docker Compose profiles e Nginx reverse proxy switching:

1. Definisci due stack completi in docker-compose.yml: 'blue' (porta 9001) e 'green' (porta 9002)
2. Nginx reverse proxy su porta 9000 punta all'ambiente attivo (inizialmente blue)
3. Workflow deployment:
   - Build nuovo codice nell'ambiente inattivo (green)
   - Esegui smoke tests su porta 9002
   - Se test passano: switch Nginx config per puntare a green (atomic symlink swap)
   - Reload Nginx gracefully
   - Se test falliscono: elimina ambiente green, mantieni blue attivo
4. Rollback: revert symlink Nginx + reload (< 1 secondo downtime)

Richiede:
- Aggiunta Nginx container a docker-compose.yml
- Volume per Nginx config con symlinks (active -> blue.conf | green.conf)
- Script switch-environment.sh per gestire cambio atomico

## Rationale
{"anomaly": "Single-stack deployment causa downtime durante restart e nessun modo di testare nuova versione before going live", "approach": "Blue-green permette testing in produzione con zero-downtime switchover e rollback istantaneo", "alternatives_rejected": ["Canary deployment (troppo complesso per single-server setup)", "Rolling update (non applicabile a single-instance deployment)"]}