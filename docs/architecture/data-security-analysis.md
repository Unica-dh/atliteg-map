# Analisi Sicurezza Dati: File CSV e JSON

## Documento di Analisi
**Data**: 2026-01-10  
**Versione**: 1.0  
**Autore**: GitHub Copilot Analysis  

---

## 1. Executive Summary

Questo documento analizza come l'applicazione AtLiTeG Map utilizza i file CSV e JSON contenuti nelle directory `/data` e `/lemmario-dashboard/public/data`, e propone soluzioni tecniche per rendere tali file non accessibili dall'esterno, proteggendo i dati sensibili mantenendo la piena funzionalità dell'applicazione.

**Stato attuale**: L'applicazione è già parzialmente protetta tramite configurazione Nginx che blocca l'accesso ai file CSV.

**Raccomandazione principale**: Implementare la soluzione n°1 (API Backend) per una protezione completa e scalabile.

---

## 2. Analisi del Flusso Dati Attuale

### 2.1 Architettura Dati

L'applicazione AtLiTeG Map utilizza una architettura **client-side data loading** con le seguenti caratteristiche:

```
┌─────────────────────────────────────────────────────────────┐
│                    FLUSSO DATI CORRENTE                      │
└─────────────────────────────────────────────────────────────┘

1. DATI SORGENTE (Repository)
   /data/
   ├── lemmi.json                    (2.5 MB - dati processati)
   ├── geojson.json                  (302 KB - aree geografiche)
   ├── Ambiti geolinguistici newline.json (355 KB)
   └── limits_IT_regions.geojson     (2.9 MB - confini regionali)

2. PREPROCESSING (Build Time)
   scripts/preprocess-data.js
   ├── Legge: Lemmi_forme_atliteg_updated.csv (1.2 MB)
   ├── Trasforma: CSV → JSON ottimizzato
   └── Output: public/data/lemmi.json

3. DATI PUBBLICI (Serviti al Client)
   /lemmario-dashboard/public/data/
   ├── lemmi.json                    ✅ Accessibile via /data/lemmi.json
   ├── geojson.json                  ✅ Accessibile via /data/geojson.json
   ├── limits_IT_regions.geojson     ✅ Accessibile via /data/limits_IT_regions.geojson
   ├── Lemmi_forme_atliteg.csv       🔒 BLOCCATO da Nginx
   ├── Lemmi_forme_atliteg_updated.csv 🔒 BLOCCATO da Nginx
   └── Ambiti geolinguistici newline.json ✅ Accessibile

4. CARICAMENTO CLIENT (Browser)
   services/dataLoader.ts
   ├── fetch('/data/lemmi.json')           → Main dataset
   ├── fetch('/data/geojson.json')         → Geographic areas
   └── fetch('/data/limits_IT_regions.geojson') → Regional boundaries
```

### 2.2 File di Dati Presenti

#### Directory `/data` (Root Repository)
File non serviti direttamente al client, usati solo per preprocessing:

| File | Dimensione | Uso | Accessibile al Client? |
|------|-----------|-----|----------------------|
| `lemmi.json` | 2.5 MB | Preprocessato da CSV | ❌ No (non copiato in out/) |
| `geojson.json` | 302 KB | Aree geografiche | ❌ No (non copiato in out/) |
| `Ambiti geolinguistici newline.json` | 355 KB | Aree dialettali | ❌ No (non copiato in out/) |
| `limits_IT_regions.geojson` | 2.9 MB | Confini regionali | ❌ No (non copiato in out/) |

#### Directory `/lemmario-dashboard/public/data`
File serviti staticamente tramite Nginx:

| File | Dimensione | Uso | Accessibile al Client? |
|------|-----------|-----|----------------------|
| `lemmi.json` | 2.5 MB | Dataset principale (preprocessato) | ✅ Sì - Necessario |
| `geojson.json` | 302 KB | Aree geografiche | ✅ Sì - Necessario |
| `limits_IT_regions.geojson` | 2.9 MB | Confini regionali italiane | ✅ Sì - Necessario |
| `Ambiti geolinguistici newline.json` | 355 KB | Aree dialettali (newline-delimited) | ✅ Sì - Fallback legacy |
| `Lemmi_forme_atliteg.csv` | 1.2 MB | CSV originale | 🔒 **BLOCCATO** da Nginx |
| `Lemmi_forme_atliteg_updated.csv` | 1.2 MB | CSV processato con IdAmbito | 🔒 **BLOCCATO** da Nginx |

### 2.3 Codice di Caricamento Dati

#### File: `services/dataLoader.ts`

```typescript
// CARICAMENTO PRINCIPALE - Preferisce JSON preprocessato
export async function loadCSVData(): Promise<Lemma[]> {
  const response = await fetch('/data/lemmi.json');
  if (!response.ok) {
    return loadCSVLegacy(); // Fallback a CSV
  }
  return await response.json();
}

// FALLBACK LEGACY - Carica CSV direttamente (lento)
async function loadCSVLegacy(): Promise<Lemma[]> {
  const response = await fetch('/data/Lemmi_forme_atliteg_updated.csv');
  const csvText = await response.text();
  // Parsing con PapaParse...
}

// CARICAMENTO GEOJSON
export async function loadGeoJSON(): Promise<GeoArea[]> {
  const response = await fetch('/data/geojson.json');
  if (!response.ok) {
    return loadGeoJSONLegacy(); // Fallback
  }
  return await response.json();
}
```

#### File: `hooks/useRegions.ts`

```typescript
// CARICAMENTO CONFINI REGIONALI
const response = await fetch('/data/limits_IT_regions.geojson');
const data = await response.json() as RegionsGeoJSON;
```

**⚠️ PROBLEMA**: Tutti i dati vengono caricati tramite `fetch()` client-side, rendendo necessaria l'esposizione pubblica dei file JSON.

---

## 3. Protezioni Attuali

### 3.1 Configurazione Nginx (lemmario-dashboard/nginx.conf)

```nginx
server {
    listen 9000;
    root /usr/share/nginx/html;

    # ✅ PROTEZIONE 1: Servire solo JSON/GeoJSON
    location ~ ^/data/.*\.(json|geojson)$ {
        expires 1d;
        add_header Cache-Control "public, must-revalidate";
        try_files $uri =404;
    }

    # ✅ PROTEZIONE 2: Bloccare accesso a tutti gli altri file in /data
    location /data/ {
        deny all;
    }

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

**Funzionamento**:
1. **Regex match** `^/data/.*\.(json|geojson)$` → Serve file JSON/GeoJSON con cache 1 giorno
2. **Fallback** `/data/` → Blocca **tutti gli altri file** (CSV, immagini non logo, backup)
3. **Risultato**: CSV sono **già protetti** ✅

### 3.2 File Attualmente Bloccati

- ❌ `/data/Lemmi_forme_atliteg.csv` → 403 Forbidden
- ❌ `/data/Lemmi_forme_atliteg_updated.csv` → 403 Forbidden
- ❌ `/data/Ambiti geolinguistici newline.qmd` → 403 Forbidden
- ❌ Qualsiasi altro file non-JSON in `/data/`

### 3.3 File Attualmente Accessibili

- ✅ `/data/lemmi.json` → **Necessario** per l'applicazione
- ✅ `/data/geojson.json` → **Necessario** per l'applicazione
- ✅ `/data/limits_IT_regions.geojson` → **Necessario** per l'applicazione
- ✅ `/data/Ambiti geolinguistici newline.json` → Fallback legacy (può essere rimosso)
- ✅ `/data/logo/*.png` → Immagini logo (necessarie)

### 3.4 Analisi Rischi Attuali

| Rischio | Livello | Mitigato? | Note |
|---------|---------|-----------|------|
| Download CSV sorgente | 🔴 Alto | ✅ Sì | Bloccato da Nginx |
| Download JSON dati completi | 🟡 Medio | ❌ No | **Necessario per funzionamento app** |
| Scraping dataset via API | 🟡 Medio | ❌ No | Nessun rate limiting |
| CORS bypass | 🟢 Basso | ✅ Sì | Same-origin policy |
| DDoS su file statici | 🟡 Medio | ⚠️ Parziale | Cache Nginx (1 giorno) |

**🔑 Problema Chiave**: I file JSON sono **pubblicamente accessibili** perché l'applicazione è una **SPA pura** senza backend. Chiunque può scaricare `/data/lemmi.json` e ottenere l'intero dataset.

---

## 4. Soluzioni Proposte

### Soluzione 1: API Backend con Autenticazione 🏆 **RACCOMANDATA**

**Descrizione**: Creare un backend Node.js/Express che serva i dati tramite API REST protette.

#### Architettura

```
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│   Browser    │ ─HTTP→  │  API Backend │ ─READ→  │  Data Files  │
│  (React SPA) │ ←JSON─  │ (Node/Express)│ ←────  │  (Private)   │
└──────────────┘         └──────────────┘         └──────────────┘
                              │
                              ├─ Authentication (JWT/API Key)
                              ├─ Rate Limiting
                              ├─ CORS Policy
                              └─ Data Filtering
```

#### Implementazione

**1. Struttura Backend**

```
lemmario-dashboard/
├── server/
│   ├── index.js              # Express server
│   ├── routes/
│   │   ├── lemmi.js          # GET /api/lemmi
│   │   ├── geojson.js        # GET /api/geojson
│   │   └── regions.js        # GET /api/regions
│   ├── middleware/
│   │   ├── auth.js           # JWT/API key validation
│   │   └── rateLimit.js      # Rate limiting
│   ├── data/                 # Private data directory
│   │   ├── lemmi.json
│   │   ├── geojson.json
│   │   └── limits_IT_regions.geojson
│   └── package.json
├── public/                    # Solo file pubblici (no data)
└── src/                       # Frontend React
```

**2. Codice Backend (server/index.js)**

```javascript
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting: 100 requests per 15 minutes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests, please try again later.'
});
app.use('/api/', limiter);

// Authentication middleware (optional - API key)
const authMiddleware = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  const validKey = process.env.API_KEY;
  
  if (validKey && apiKey !== validKey) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

// Data routes
app.get('/api/lemmi', authMiddleware, async (req, res) => {
  try {
    const dataPath = path.join(__dirname, 'data', 'lemmi.json');
    const data = await fs.readFile(dataPath, 'utf-8');
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ error: 'Failed to load data' });
  }
});

app.get('/api/geojson', authMiddleware, async (req, res) => {
  try {
    const dataPath = path.join(__dirname, 'data', 'geojson.json');
    const data = await fs.readFile(dataPath, 'utf-8');
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ error: 'Failed to load data' });
  }
});

app.get('/api/regions', authMiddleware, async (req, res) => {
  try {
    const dataPath = path.join(__dirname, 'data', 'limits_IT_regions.geojson');
    const data = await fs.readFile(dataPath, 'utf-8');
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ error: 'Failed to load data' });
  }
});

app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});
```

**3. Modifica Frontend (services/dataLoader.ts)**

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

export async function loadCSVData(): Promise<Lemma[]> {
  const response = await fetch(`${API_BASE_URL}/api/lemmi`, {
    headers: {
      'X-API-Key': API_KEY || ''
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to load data');
  }
  
  return await response.json();
}

export async function loadGeoJSON(): Promise<GeoArea[]> {
  const response = await fetch(`${API_BASE_URL}/api/geojson`, {
    headers: {
      'X-API-Key': API_KEY || ''
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to load data');
  }
  
  return await response.json();
}
```

**4. Docker Deployment**

```dockerfile
# Dockerfile multi-service
FROM node:20-alpine AS backend-builder
WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci --production
COPY server/ ./

FROM node:20-alpine AS frontend-builder
WORKDIR /app
COPY lemmario-dashboard/package*.json ./
RUN npm ci
COPY lemmario-dashboard/ ./
RUN npm run build

FROM node:20-alpine AS production
WORKDIR /app

# Copy backend
COPY --from=backend-builder /app/server ./server

# Copy frontend build
COPY --from=frontend-builder /app/out ./public

# Copy private data to backend
COPY data/ ./server/data/

# Serve both frontend (static) and backend (API)
EXPOSE 3000 3001

# Use process manager to run both services
CMD ["node", "server/index.js"]
```

**5. Nginx Configuration (Proxy to Backend)**

```nginx
server {
    listen 9000;
    root /usr/share/nginx/html;

    # Proxy API requests to Node backend
    location /api/ {
        proxy_pass http://backend:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        
        # Rate limiting
        limit_req zone=api_limit burst=20 nodelay;
    }

    # Block direct access to /data
    location /data/ {
        deny all;
    }

    # Serve frontend SPA
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

#### Vantaggi

✅ **Controllo completo**: Autenticazione, rate limiting, logging  
✅ **Flessibilità**: Possibilità di filtrare/trasformare dati  
✅ **Sicurezza**: File dati mai esposti direttamente  
✅ **Monitoraggio**: Analytics su utilizzo API  
✅ **Scalabilità**: Possibilità di aggiungere caching (Redis), database, etc.  

#### Svantaggi

❌ **Complessità**: Richiede backend aggiuntivo  
❌ **Costi**: Server backend sempre attivo  
❌ **Latenza**: Overhead di una richiesta HTTP aggiuntiva  
❌ **Manutenzione**: Codice backend da mantenere  

#### Impatto sul Progetto

- **Costo di sviluppo**: ~3-5 giorni per implementazione completa
- **Costo operativo**: +20-30% risorse server (backend Node.js)
- **Compatibilità**: Richiede modifiche a `dataLoader.ts` e `useRegions.ts`

---

### Soluzione 2: Server-Side Rendering (SSR) con Next.js Data Fetching

**Descrizione**: Sfruttare le funzionalità SSR/SSG di Next.js per caricare dati lato server.

#### Architettura

```
┌──────────────┐         ┌──────────────────┐         ┌──────────────┐
│   Browser    │ ─HTTP→  │  Next.js Server  │ ─READ→  │  Data Files  │
│  (Hydrated   │ ←HTML─  │  (getServerSide  │ ←────  │  (Private)   │
│   React)     │         │   Props/SSG)     │         │              │
└──────────────┘         └──────────────────┘         └──────────────┘
```

#### Implementazione

**1. Rimuovere `output: 'export'` da next.config.ts**

```typescript
// next.config.ts - PRIMA (Static Export)
const nextConfig: NextConfig = {
  output: 'export',  // ❌ RIMUOVERE
  images: { unoptimized: true }
};

// next.config.ts - DOPO (SSR Enabled)
const nextConfig: NextConfig = {
  // output: 'export' non specificato = SSR abilitato
  images: { 
    unoptimized: false  // Ottimizzazione immagini abilitata
  }
};
```

**2. Modificare page.tsx per usare Server Components**

```typescript
// app/page.tsx - Server Component (Next.js 16+)
import { readFile } from 'fs/promises';
import path from 'path';
import type { Lemma, GeoArea } from '@/types/lemma';

async function loadServerData() {
  const dataDir = path.join(process.cwd(), 'private-data');
  
  const [lemmiData, geoData, regionsData] = await Promise.all([
    readFile(path.join(dataDir, 'lemmi.json'), 'utf-8'),
    readFile(path.join(dataDir, 'geojson.json'), 'utf-8'),
    readFile(path.join(dataDir, 'limits_IT_regions.geojson'), 'utf-8')
  ]);
  
  return {
    lemmi: JSON.parse(lemmiData) as Lemma[],
    geoAreas: JSON.parse(geoData) as GeoArea[],
    regions: JSON.parse(regionsData)
  };
}

export default async function HomePage() {
  const data = await loadServerData();
  
  return (
    <AppProvider initialData={data}>
      <Dashboard />
    </AppProvider>
  );
}
```

**3. Modificare AppContext per accettare dati iniziali**

```typescript
// context/AppContext.tsx
interface AppProviderProps {
  children: React.ReactNode;
  initialData?: {
    lemmi: Lemma[];
    geoAreas: GeoArea[];
    regions: any;
  };
}

export function AppProvider({ children, initialData }: AppProviderProps) {
  const [lemmi, setLemmi] = useState<Lemma[]>(initialData?.lemmi || []);
  const [geoAreas, setGeoAreas] = useState<GeoArea[]>(initialData?.geoAreas || []);
  // ... resto dello stato
  
  useEffect(() => {
    // Solo se non ci sono dati iniziali (fallback client-side)
    if (!initialData) {
      loadData();
    }
  }, [initialData]);
  
  // ...
}
```

**4. Struttura Directory**

```
lemmario-dashboard/
├── private-data/             # 🔒 Mai servito al client
│   ├── lemmi.json
│   ├── geojson.json
│   └── limits_IT_regions.geojson
├── public/                   # Solo asset pubblici
│   ├── logo/
│   └── images/
├── app/
│   ├── page.tsx              # Server Component
│   └── layout.tsx
└── next.config.ts
```

**5. Dockerfile per SSR**

```dockerfile
# Multi-stage build per Next.js SSR
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:20-alpine AS production
WORKDIR /app

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Copy private data
COPY --from=builder /app/private-data ./private-data

EXPOSE 3000

CMD ["npm", "start"]  # Avvia Next.js server
```

#### Vantaggi

✅ **Nativo Next.js**: Sfrutta funzionalità built-in  
✅ **SEO migliore**: HTML renderizzato lato server  
✅ **Performance iniziale**: First Contentful Paint più veloce  
✅ **Sicurezza**: File mai esposti al client  
✅ **Cache intelligente**: Next.js caching automatico  

#### Svantaggi

❌ **Server sempre attivo**: Non più static export  
❌ **Costi hosting**: Richiede Node.js runtime (no static hosting)  
❌ **Architettura diversa**: Cambio da SPA a SSR/SSG  
❌ **Complessità deployment**: No più semplice Nginx  

#### Impatto sul Progetto

- **Costo di sviluppo**: ~2-3 giorni per refactoring
- **Costo operativo**: +50% (server Node.js sempre attivo vs Nginx statico)
- **Compatibilità**: Breaking change - richiede riscrittura AppContext

---

### Soluzione 3: Offuscamento e Cifratura Client-Side

**Descrizione**: Cifrare i file JSON e decifrarli lato client con chiave embedded.

#### Architettura

```
┌──────────────┐         ┌──────────────────┐
│   Browser    │ ─HTTP→  │  Nginx (Static)  │
│              │ ←ENC──  │  Encrypted JSON  │
└──────────────┘         └──────────────────┘
       │
       ├─ Decrypt with embedded key
       └─ Use decrypted data
```

#### Implementazione

**1. Script di Cifratura (scripts/encrypt-data.js)**

```javascript
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const ALGORITHM = 'aes-256-gcm';
const KEY = crypto.randomBytes(32); // Genera chiave casuale
const IV_LENGTH = 16;

function encrypt(text) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  
  const authTag = cipher.getAuthTag();
  
  return {
    encrypted,
    iv: iv.toString('base64'),
    authTag: authTag.toString('base64')
  };
}

// Cifra tutti i file JSON
const files = ['lemmi.json', 'geojson.json', 'limits_IT_regions.geojson'];
const outputDir = path.join(__dirname, '../public/data-encrypted');

fs.mkdirSync(outputDir, { recursive: true });

files.forEach(filename => {
  const inputPath = path.join(__dirname, '../public/data', filename);
  const data = fs.readFileSync(inputPath, 'utf-8');
  
  const { encrypted, iv, authTag } = encrypt(data);
  
  const outputPath = path.join(outputDir, filename + '.enc');
  fs.writeFileSync(outputPath, JSON.stringify({
    data: encrypted,
    iv,
    authTag
  }));
  
  console.log(`✅ Cifrato: ${filename} → ${filename}.enc`);
});

// Salva chiave in un file separato (da includere nel bundle)
fs.writeFileSync(
  path.join(__dirname, '../src/utils/decryption-key.ts'),
  `export const DECRYPTION_KEY = '${KEY.toString('base64')}';\n`
);

console.log('🔑 Chiave salvata in src/utils/decryption-key.ts');
```

**2. Funzione di Decifratura (utils/decrypt.ts)**

```typescript
import { DECRYPTION_KEY } from './decryption-key';

interface EncryptedData {
  data: string;
  iv: string;
  authTag: string;
}

async function decrypt(encryptedData: EncryptedData): Promise<string> {
  const key = Uint8Array.from(atob(DECRYPTION_KEY), c => c.charCodeAt(0));
  const iv = Uint8Array.from(atob(encryptedData.iv), c => c.charCodeAt(0));
  const authTag = Uint8Array.from(atob(encryptedData.authTag), c => c.charCodeAt(0));
  const ciphertext = Uint8Array.from(atob(encryptedData.data), c => c.charCodeAt(0));

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    key,
    { name: 'AES-GCM' },
    false,
    ['decrypt']
  );

  const decrypted = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv,
      tagLength: 128
    },
    cryptoKey,
    new Uint8Array([...ciphertext, ...authTag])
  );

  const decoder = new TextDecoder();
  return decoder.decode(decrypted);
}

export async function loadEncryptedJSON<T>(filename: string): Promise<T> {
  const response = await fetch(`/data-encrypted/${filename}.enc`);
  const encrypted = await response.json() as EncryptedData;
  const decrypted = await decrypt(encrypted);
  return JSON.parse(decrypted);
}
```

**3. Modificare DataLoader (services/dataLoader.ts)**

```typescript
import { loadEncryptedJSON } from '@/utils/decrypt';

export async function loadCSVData(): Promise<Lemma[]> {
  try {
    return await loadEncryptedJSON<Lemma[]>('lemmi.json');
  } catch (error) {
    console.error('Failed to load encrypted data:', error);
    throw error;
  }
}

export async function loadGeoJSON(): Promise<GeoArea[]> {
  return await loadEncryptedJSON<GeoArea[]>('geojson.json');
}
```

**4. Build Pipeline**

```json
// package.json
{
  "scripts": {
    "prebuild": "node scripts/preprocess-data.js && node scripts/encrypt-data.js",
    "build": "next build"
  }
}
```

#### Vantaggi

✅ **Compatibilità**: Mantiene architettura SPA statica  
✅ **Deployment semplice**: Nginx statico, no backend  
✅ **Costi bassi**: Hosting statico economico  
✅ **Performance**: Cifratura hardware-accelerated (Web Crypto API)  

#### Svantaggi

❌ **Sicurezza limitata**: Chiave embedded nel bundle (ispezionabile)  
❌ **Falsa sicurezza**: Offuscamento ≠ vera protezione  
❌ **Overhead**: Decifratura aggiunge latenza (~50-100ms per file grandi)  
❌ **Complessità**: Gestione chiavi, rotazione, etc.  

⚠️ **ATTENZIONE**: Questa soluzione fornisce solo **offuscamento**, non vera sicurezza. Un attaccante motivato può estrarre la chiave dal bundle JavaScript e decifrare i dati.

#### Impatto sul Progetto

- **Costo di sviluppo**: ~1-2 giorni
- **Costo operativo**: Nessun aumento
- **Compatibilità**: Modifiche minime a dataLoader

---

### Soluzione 4: Content Delivery Network (CDN) con URL Firmati

**Descrizione**: Usare CDN (AWS CloudFront, Cloudflare) con URL firmati temporanei.

#### Architettura

```
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│   Browser    │ ─GET→   │  Next.js API │ ─SIGN→  │  CDN (S3)    │
│              │ ←URL──  │    Route     │         │  Private     │
└──────────────┘         └──────────────┘         │  Bucket      │
       │                                           └──────────────┘
       └────────── GET signed URL ─────────────────→
```

#### Implementazione

**1. Configurazione AWS S3 + CloudFront**

```bash
# Crea bucket S3 privato
aws s3 mb s3://atliteg-data-private --region eu-west-1

# Carica dati
aws s3 cp lemmario-dashboard/public/data/ s3://atliteg-data-private/data/ --recursive

# Configura CloudFront distribution con Signed URLs
aws cloudfront create-distribution \
  --origin-domain-name atliteg-data-private.s3.eu-west-1.amazonaws.com \
  --trusted-signers self
```

**2. Next.js API Route (app/api/data/[file]/route.ts)**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getSignedUrl } from '@aws-sdk/cloudfront-signer';

const CLOUDFRONT_DOMAIN = process.env.CLOUDFRONT_DOMAIN;
const CLOUDFRONT_KEY_PAIR_ID = process.env.CLOUDFRONT_KEY_PAIR_ID;
const CLOUDFRONT_PRIVATE_KEY = process.env.CLOUDFRONT_PRIVATE_KEY;

export async function GET(
  request: NextRequest,
  { params }: { params: { file: string } }
) {
  const { file } = params;
  
  // Validazione file richiesto
  const allowedFiles = ['lemmi.json', 'geojson.json', 'limits_IT_regions.geojson'];
  if (!allowedFiles.includes(file)) {
    return NextResponse.json({ error: 'Invalid file' }, { status: 400 });
  }
  
  // Genera URL firmato (valido 5 minuti)
  const signedUrl = getSignedUrl({
    url: `https://${CLOUDFRONT_DOMAIN}/data/${file}`,
    keyPairId: CLOUDFRONT_KEY_PAIR_ID,
    privateKey: CLOUDFRONT_PRIVATE_KEY,
    dateLessThan: new Date(Date.now() + 5 * 60 * 1000).toISOString()
  });
  
  return NextResponse.json({ url: signedUrl });
}
```

**3. Modificare DataLoader (services/dataLoader.ts)**

```typescript
async function getSignedDataUrl(filename: string): Promise<string> {
  const response = await fetch(`/api/data/${filename}`);
  const { url } = await response.json();
  return url;
}

export async function loadCSVData(): Promise<Lemma[]> {
  const signedUrl = await getSignedDataUrl('lemmi.json');
  const response = await fetch(signedUrl);
  return await response.json();
}

export async function loadGeoJSON(): Promise<GeoArea[]> {
  const signedUrl = await getSignedDataUrl('geojson.json');
  const response = await fetch(signedUrl);
  return await response.json();
}
```

#### Vantaggi

✅ **Sicurezza vera**: URL temporanei, non indovinabili  
✅ **Scalabilità**: CDN globale, bassa latenza  
✅ **Controllo accessi**: Revoca URL, logging dettagliato  
✅ **Compliance**: Supporto audit trail, encryption at rest  

#### Svantaggi

❌ **Costi elevati**: AWS/Cloudflare fees  
❌ **Complessità**: Gestione chiavi, IAM, configurazione CDN  
❌ **Vendor lock-in**: Dipendenza da servizi cloud  
❌ **Latenza aggiuntiva**: 2 richieste invece di 1 (GET signed URL + GET data)  

#### Impatto sul Progetto

- **Costo di sviluppo**: ~3-4 giorni (setup AWS, API routes)
- **Costo operativo**: ~50-100 USD/mese (AWS CloudFront + S3)
- **Compatibilità**: Richiede Next.js API routes (SSR necessario)

---

### Soluzione 5: Lazy Loading con Token-Based Access

**Descrizione**: Implementare sistema di token monouso per accesso ai dati.

#### Architettura

```
1. Browser → GET /api/token → Next.js API → JWT token
2. Browser → GET /data/lemmi.json?token=xyz → Nginx → Valida token → Serve file
```

#### Implementazione

**1. Next.js API Route (app/api/token/route.ts)**

```typescript
import { SignJWT } from 'jose';
import { NextResponse } from 'next/server';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function GET() {
  // Genera token JWT valido 10 minuti
  const token = await new SignJWT({ purpose: 'data-access' })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('10m')
    .setIssuedAt()
    .sign(SECRET);
  
  return NextResponse.json({ token });
}
```

**2. Nginx Lua per Validazione Token**

```nginx
# Richiede nginx-lua-module
server {
    listen 9000;
    
    location ~ ^/data/.*\.(json|geojson)$ {
        access_by_lua_block {
            local jwt = require "resty.jwt"
            local token = ngx.var.arg_token
            
            if not token then
                ngx.status = 401
                ngx.say("Missing token")
                return ngx.exit(401)
            end
            
            local jwt_obj = jwt:verify(os.getenv("JWT_SECRET"), token)
            
            if not jwt_obj.verified then
                ngx.status = 401
                ngx.say("Invalid token")
                return ngx.exit(401)
            end
        }
        
        try_files $uri =404;
    }
}
```

**3. Modificare DataLoader**

```typescript
let cachedToken: string | null = null;
let tokenExpiry: number = 0;

async function getToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken;
  }
  
  const response = await fetch('/api/token');
  const { token } = await response.json();
  
  cachedToken = token;
  tokenExpiry = Date.now() + 8 * 60 * 1000; // 8 minuti (margine sicurezza)
  
  return token;
}

export async function loadCSVData(): Promise<Lemma[]> {
  const token = await getToken();
  const response = await fetch(`/data/lemmi.json?token=${token}`);
  return await response.json();
}
```

#### Vantaggi

✅ **Controllo accessi**: Token temporanei  
✅ **Performance**: File serviti direttamente da Nginx (dopo validazione)  
✅ **Flessibilità**: Possibilità di rate limiting per token  

#### Svantaggi

❌ **Complessità Nginx**: Richiede nginx-lua-module  
❌ **Sincronizzazione**: Secret key condiviso tra Next.js e Nginx  
❌ **Manutenzione**: Gestione scadenza token, refresh logic  

#### Impatto sul Progetto

- **Costo di sviluppo**: ~2-3 giorni
- **Costo operativo**: +10% (nginx con Lua)
- **Compatibilità**: Richiede Nginx rebuild con modulo Lua

---

## 5. Confronto Soluzioni

| Criterio | Backend API | SSR Next.js | Cifratura | CDN Firmato | Token Access |
|----------|-------------|-------------|-----------|-------------|--------------|
| **Sicurezza** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Complessità** | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Costo Sviluppo** | 3-5 giorni | 2-3 giorni | 1-2 giorni | 3-4 giorni | 2-3 giorni |
| **Costo Operativo** | Medio | Alto | Basso | Alto | Medio |
| **Performance** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Compatibilità** | Breaking | Breaking | Minimo | Breaking | Medio |
| **Scalabilità** | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Manutenibilità** | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐ | ⭐⭐ |

### Raccomandazioni per Caso d'Uso

| Scenario | Soluzione Raccomandata | Motivo |
|----------|----------------------|--------|
| **Progetto accademico, budget limitato** | **Backend API** | Bilanciamento sicurezza/costo, nessun vendor lock-in |
| **Dati altamente sensibili, compliance** | **CDN Firmato** | Massima sicurezza, audit trail completo |
| **Deploy rapido, protezione base** | **Cifratura Client** | Setup veloce, mantiene architettura statica |
| **SEO critico, performance prioritaria** | **SSR Next.js** | Benefici SEO + sicurezza integrata |
| **Budget elevato, scalabilità globale** | **CDN Firmato** | Performance globale, sicurezza enterprise |

---

## 6. Raccomandazione Finale

### Per AtLiTeG Map: **Soluzione 1 - Backend API** 🏆

**Motivazioni**:

1. **Sicurezza Adeguata**: Protezione reale dei dati senza complessità enterprise
2. **Costo Sostenibile**: No vendor lock-in, hosting self-managed
3. **Flessibilità Futura**: Possibilità di aggiungere funzionalità (user auth, analytics, data export limitato)
4. **Coerenza Tecnologica**: Mantiene stack Node.js/TypeScript
5. **Manutenibilità**: Codice backend semplice, testabile

### Roadmap di Implementazione

#### Fase 1: Preparazione (1 giorno)
- [ ] Setup backend Express in `lemmario-dashboard/server/`
- [ ] Configurare variabili ambiente (API_KEY, ALLOWED_ORIGINS)
- [ ] Creare routes API base (`/api/lemmi`, `/api/geojson`, `/api/regions`)

#### Fase 2: Integrazione Frontend (1 giorno)
- [ ] Modificare `services/dataLoader.ts` per chiamare API
- [ ] Modificare `hooks/useRegions.ts` per chiamare API
- [ ] Aggiungere error handling e retry logic
- [ ] Testare in locale (backend + frontend)

#### Fase 3: Docker & Deploy (1 giorno)
- [ ] Creare Dockerfile multi-stage (backend + frontend)
- [ ] Aggiornare docker-compose.yml
- [ ] Configurare Nginx come reverse proxy
- [ ] Testare build Docker locale

#### Fase 4: Testing & Ottimizzazione (1 giorno)
- [ ] Test end-to-end
- [ ] Performance testing (load time comparisons)
- [ ] Implementare caching (Redis opzionale)
- [ ] Documentazione API

#### Fase 5: Deploy Produzione (1 giorno)
- [ ] Deploy su server di staging
- [ ] Validazione con stakeholder
- [ ] Migrazione produzione con rollback plan
- [ ] Monitoraggio post-deploy

**Totale stimato**: 5 giorni lavorativi

---

## 7. Alternative No-Code

### Opzione A: Hosting su Piattaforme PaaS con Auth

Piattaforme come **Vercel**, **Netlify**, **Cloudflare Pages** offrono:
- **Edge Functions**: Backend serverless integrato
- **Auth Built-in**: Autenticazione senza codice custom
- **Rate Limiting**: Integrato nella piattaforma

**Setup Vercel**:
```bash
# Converti a Next.js API routes
vercel deploy

# Configura environment variables
vercel env add API_KEY production
```

**Costo**: $20-50/mese (piano Pro)

### Opzione B: GitHub Releases (Solo Dataset Pubblici)

Se i dati **non sono sensibili**:
- Pubblicare dataset come GitHub Releases
- Versioning automatico
- Download tracciabile

**Non adatto per AtLiTeG** (dati di ricerca, potenzialmente sensibili)

---

## 8. Considerazioni Legali e Privacy

### GDPR Compliance

Se i dati contengono informazioni personali o sensibili:

1. **Data Minimization**: Verificare se tutti i campi sono necessari pubblicamente
2. **Purpose Limitation**: Documentare scopo raccolta dati
3. **Consent**: Se applicabile, raccogliere consenso utenti
4. **Right to Access**: Implementare endpoint per data export

### Licenze Dati

Verificare licenza dataset VoSLIG:
- **Open Data**: Se licenza permissiva (CC-BY, CC0) → protezione opzionale
- **Restricted Access**: Se licenza restrittiva → protezione **obbligatoria**

---

## 9. Conclusioni

### Stato Attuale: Protezione Parziale ✅

L'applicazione **già blocca** accesso ai file CSV tramite configurazione Nginx, ma i file JSON sono **pubblicamente accessibili** per necessità architetturali (SPA pura).

### Azioni Immediate Consigliate

1. **Valutare sensibilità dati**: Se dataset è pubblico/open-access, protezione attuale potrebbe essere sufficiente
2. **Implementare rate limiting**: Nginx `limit_req` per prevenire scraping massivo
3. **Aggiungere monitoring**: Log accessi a `/data/*.json` per analytics

### Azioni Long-Term (Se Dati Sensibili)

1. **Implementare Backend API** (Soluzione 1)
2. **Aggiungere autenticazione** se necessario
3. **Pianificare migrazione a SSR** per benefici SEO

---

## 10. Appendice

### A. Comandi Utili

```bash
# Test blocco CSV
curl -I https://your-domain.com/data/Lemmi_forme_atliteg.csv
# Atteso: HTTP 403 Forbidden

# Test accesso JSON
curl -I https://your-domain.com/data/lemmi.json
# Atteso: HTTP 200 OK

# Verifica dimensione file scaricabili
du -sh lemmario-dashboard/public/data/*.json

# Monitor accessi in real-time
docker logs -f lemmario-dashboard | grep "GET /data"
```

### B. Checklist Sicurezza

- [x] CSV bloccati da Nginx
- [ ] Rate limiting su `/data/*` endpoint
- [ ] Logging accessi dati
- [ ] HTTPS obbligatorio (no HTTP)
- [ ] Headers sicurezza (X-Frame-Options, CSP)
- [ ] Backend API con autenticazione
- [ ] Monitoring anomalie (download massivi)

### C. Risorse Aggiuntive

- [Next.js Security Best Practices](https://nextjs.org/docs/pages/building-your-application/configuring/security)
- [Nginx Access Control](https://nginx.org/en/docs/http/ngx_http_access_module.html)
- [OWASP API Security Top 10](https://owasp.org/www-project-api-security/)
- [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)

---

**Documento approvato per**: Discussione con team, valutazione opzioni  
**Prossimi step**: Decidere soluzione preferita → Implementazione → Testing → Deploy
