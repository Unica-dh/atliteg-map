# Riepilogo: Sicurezza Dati CSV e JSON

**Documento completo**: [data-security-analysis.md](./data-security-analysis.md)

---

## 📋 Sintesi Rapida

### Stato Attuale ✅

L'applicazione AtLiTeG Map **già protegge** i file CSV dall'accesso esterno tramite configurazione Nginx:

- ✅ **CSV bloccati**: `Lemmi_forme_atliteg.csv` e `Lemmi_forme_atliteg_updated.csv` → 403 Forbidden
- ⚠️ **JSON accessibili**: `lemmi.json`, `geojson.json`, `limits_IT_regions.geojson` → Necessari per funzionamento app

### Architettura Corrente

```
Browser → fetch('/data/lemmi.json') → Nginx → File JSON pubblico
Browser → fetch('/data/*.csv')      → Nginx → ❌ 403 Forbidden
```

**Problema**: I file JSON (2.5 MB + 3 MB) sono pubblicamente scaricabili perché l'app è una SPA pura client-side.

---

## 🛡️ Soluzioni Proposte

### 1️⃣ Backend API con Autenticazione 🏆 **RACCOMANDATA**

**Cosa**: Creare backend Node.js/Express che serve dati tramite API protette

**Pro**:
- ✅ Sicurezza reale (autenticazione JWT/API key)
- ✅ Rate limiting integrato
- ✅ Nessun vendor lock-in
- ✅ Costo sostenibile

**Contro**:
- ❌ Richiede backend sempre attivo
- ❌ ~3-5 giorni sviluppo

**Costo**: +20-30% risorse server

**Esempio**:
```typescript
// Frontend
const response = await fetch('/api/lemmi', {
  headers: { 'X-API-Key': API_KEY }
});

// Backend (Express)
app.get('/api/lemmi', authMiddleware, async (req, res) => {
  const data = await fs.readFile('./private-data/lemmi.json');
  res.json(JSON.parse(data));
});
```

---

### 2️⃣ Server-Side Rendering (SSR) con Next.js

**Cosa**: Usare Next.js SSR per caricare dati lato server

**Pro**:
- ✅ Nativo Next.js (funzionalità built-in)
- ✅ SEO migliorato
- ✅ Sicurezza integrata

**Contro**:
- ❌ No più static export (server Node.js richiesto)
- ❌ +50% costi hosting
- ❌ Breaking change architettura

**Costo**: 2-3 giorni refactoring

**Esempio**:
```typescript
// app/page.tsx - Server Component
async function loadData() {
  const data = await fs.readFile('./private-data/lemmi.json');
  return JSON.parse(data);
}

export default async function Page() {
  const lemmi = await loadData();
  return <Dashboard initialData={lemmi} />;
}
```

---

### 3️⃣ Cifratura Client-Side

**Cosa**: Cifrare JSON e decifrare nel browser con chiave embedded

**Pro**:
- ✅ Mantiene architettura statica
- ✅ Setup veloce (~1-2 giorni)
- ✅ Costi invariati

**Contro**:
- ❌ **Sicurezza limitata**: chiave ispezionabile nel bundle
- ❌ Offuscamento ≠ protezione vera
- ❌ +50-100ms latenza decifratura

**Costo**: Nessun aumento operativo

⚠️ **Attenzione**: Questa è solo offuscamento, non protezione reale!

---

### 4️⃣ CDN con URL Firmati (AWS CloudFront)

**Cosa**: Usare CDN con URL temporanei firmati

**Pro**:
- ✅ Sicurezza massima
- ✅ Scalabilità globale
- ✅ Audit trail completo

**Contro**:
- ❌ Costi elevati (~$50-100/mese AWS)
- ❌ Vendor lock-in
- ❌ Complessità configurazione

**Costo**: 3-4 giorni setup

---

### 5️⃣ Token-Based Access con Nginx Lua

**Cosa**: Generare token JWT per accesso ai file

**Pro**:
- ✅ Controllo accessi granulare
- ✅ File serviti da Nginx (performante)

**Contro**:
- ❌ Richiede nginx-lua-module
- ❌ Complessità configurazione

**Costo**: 2-3 giorni

---

## 📊 Confronto Rapido

| Soluzione | Sicurezza | Complessità | Costo Dev | Costo Ops |
|-----------|-----------|-------------|-----------|-----------|
| **Backend API** 🏆 | ⭐⭐⭐⭐⭐ | Media | 3-5 gg | Medio |
| SSR Next.js | ⭐⭐⭐⭐⭐ | Bassa | 2-3 gg | Alto |
| Cifratura | ⭐⭐ | Media | 1-2 gg | Basso |
| CDN Firmato | ⭐⭐⭐⭐⭐ | Alta | 3-4 gg | Alto |
| Token Access | ⭐⭐⭐⭐ | Alta | 2-3 gg | Medio |

---

## ✅ Raccomandazione per AtLiTeG Map

### Soluzione: **Backend API** (Soluzione 1)

**Perché**:
1. Bilanciamento ottimale sicurezza/costo
2. Nessun vendor lock-in (self-hosted)
3. Flessibilità per funzionalità future (analytics, data export limitato)
4. Stack tecnologico coerente (Node.js/TypeScript)

### Roadmap (5 giorni totali)

1. **Giorno 1**: Setup backend Express + routes API
2. **Giorno 2**: Modifica frontend (dataLoader.ts)
3. **Giorno 3**: Docker multi-service + Nginx proxy
4. **Giorno 4**: Testing end-to-end + ottimizzazioni
5. **Giorno 5**: Deploy produzione + monitoring

---

## 🔍 Azioni Immediate (Oggi)

### 1. Valutare Sensibilità Dati

**Domanda chiave**: I dati VoSLIG sono pubblici o riservati?

- **Se pubblici/open-access**: Protezione attuale (CSV bloccati) è sufficiente
- **Se riservati/sensibili**: Implementare Backend API

### 2. Aggiungere Rate Limiting (10 minuti)

```nginx
# nginx.conf - Aggiungere prima di location ~ ^/data/
limit_req_zone $binary_remote_addr zone=data_limit:10m rate=10r/s;

location ~ ^/data/.*\.(json|geojson)$ {
    limit_req zone=data_limit burst=20 nodelay;
    expires 1d;
    try_files $uri =404;
}
```

**Effetto**: Massimo 10 richieste/secondo per IP → previene scraping massivo

### 3. Aggiungere Monitoring (5 minuti)

```nginx
# nginx.conf - Logging accessi dati
location ~ ^/data/.*\.(json|geojson)$ {
    access_log /var/log/nginx/data-access.log combined;
    # ... resto config
}
```

**Uso**: `docker exec lemmario-dashboard tail -f /var/log/nginx/data-access.log`

---

## 📚 Risorse

- **Documento completo**: [data-security-analysis.md](./data-security-analysis.md) (37 KB, 1181 righe)
- **Next.js Security**: https://nextjs.org/docs/pages/building-your-application/configuring/security
- **Nginx Access Control**: https://nginx.org/en/docs/http/ngx_http_access_module.html
- **OWASP API Security**: https://owasp.org/www-project-api-security/

---

## ❓ FAQ

### Q: I file JSON sono già scaricabili?
**A**: Sì, chiunque può accedere a `/data/lemmi.json` (2.5 MB). È necessario per il funzionamento dell'app SPA.

### Q: I CSV sono protetti?
**A**: Sì ✅, Nginx blocca accesso a tutti i `.csv` con HTTP 403.

### Q: Quanto costa proteggere completamente?
**A**: Backend API = ~5 giorni sviluppo + 20-30% costi server mensili.

### Q: C'è una soluzione veloce?
**A**: Sì, aggiungere rate limiting Nginx (10 minuti) previene scraping massivo.

### Q: Devo cambiare architettura?
**A**: Dipende. Backend API mantiene SPA ma aggiunge server Node.js. SSR richiede refactoring completo.

---

**Ultimo aggiornamento**: 2026-01-10  
**Autore**: GitHub Copilot Analysis
