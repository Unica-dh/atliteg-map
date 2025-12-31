---
scope: ATLITEG project data management, Docker Compose + Nginx static site deployment, VPN-protected Ubuntu server
kind: episteme
content_hash: 0969225197b7471d79f168b4d42ec0b9
---

# Hypothesis: Secure Data Update Strategy Decision

Decision context for choosing the best strategy to update CSV data (Lemmi_forme_atliteg_updated.csv) and derived JSON files (lemmi.json, geojson.json) while ensuring these files are NOT accessible via direct HTTP GET requests from the web. The solution must balance security, operational simplicity, and the static-site architecture constraints of the ATLITEG project.

## Rationale
{"anomaly": "Current system exposes JSON files publicly via HTTP GET and requires 4-step manual procedure for data updates with no authentication mechanism", "approach": "Evaluate multiple strategies for secure data updates considering static-site constraints, operational complexity, and defense-in-depth security principles", "alternatives_rejected": []}