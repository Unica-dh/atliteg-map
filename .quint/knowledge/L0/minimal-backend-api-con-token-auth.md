---
scope: Progetti disposti ad aggiungere backend layer, richiede Node.js runtime + process manager (PM2), aumenta complessità architetturale
kind: system
content_hash: a87b3c885babae992c787bee8839fb85
---

# Hypothesis: Minimal Backend API con Token Auth

Introduce un minimal Node.js backend per servire i dati con autenticazione, mantenendo Nginx per il frontend statico:

1. **Architecture Change**:
   - Nginx serve frontend statico su porta 9000
   - Node.js Express API su porta 3001 (internal only)
   - Nginx reverse proxy `/api/data/*` → `http://localhost:3001`

2. **Backend Implementation** (minimal Express server):
   ```javascript
   const express = require('express');
   const fs = require('fs');
   const app = express();
   
   // Token stored in environment variable
   const API_TOKEN = process.env.DATA_API_TOKEN;
   
   app.get('/data/lemmi', (req, res) => {
     const token = req.headers['x-api-token'];
     if (token !== API_TOKEN) {
       return res.status(403).json({ error: 'Unauthorized' });
     }
     const data = fs.readFileSync('/app/data/lemmi.json');
     res.json(JSON.parse(data));
   });
   
   app.listen(3001);
   ```

3. **Client-Side**: Frontend fetcha con token embedded:
   ```javascript
   fetch('/api/data/lemmi', {
     headers: { 'X-API-Token': process.env.NEXT_PUBLIC_API_TOKEN }
   })
   ```

4. **Data Update**: 
   - SSH upload CSV → /data/ directory
   - POST request to `/api/admin/reload` (authenticated) triggers preprocess script
   - Backend reloads JSON in-memory

5. **Security**:
   - Token rotabile via environment variable
   - CORS configurato per consentire solo origin della dashboard
   - Rate limiting su API endpoints

**Nginx blocking**:
```nginx
location /data/ {
    deny all;  # Blocca accesso diretto, force attraverso /api/
}
```

## Rationale
{"anomaly": "Static file serving cannot provide authentication - conflicts with 'no HTTP GET access' requirement", "approach": "Introduce minimal backend as data gateway with token authentication, maintaining static frontend architecture", "alternatives_rejected": ["Full API rewrite (overkill for read-only data)", "OAuth/JWT (too complex for single-user scenario)"]}