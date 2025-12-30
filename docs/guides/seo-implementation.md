# Guida Implementazione SEO - AtLiTeG Dashboard

## Panoramica

Questa guida documenta la strategia di ottimizzazione per i motori di ricerca (SEO), Answer Engines (AEO) e Generative AI (GEO) implementata per la Dashboard AtLiTeG. L'obiettivo è massimizzare la visibilità del progetto nei motori di ricerca tradizionali (Google, Bing), nelle risposte generate da AI (ChatGPT, Perplexity, Gemini, Claude) e negli Answer Engines (Google SGE, Bing Chat).

## Strategia SEO Adottata

### 1. Technical SEO Foundation

L'applicazione è una **Single Page Application (SPA)** con export statico Next.js, che richiede un approccio specifico per garantire l'indicizzazione corretta:

- ✅ **Static Export**: `output: 'export'` in `next.config.ts` per generazione HTML statico
- ✅ **Metadata statico**: Tutti i metadati sono generati al momento della build
- ✅ **Sitemap automatica**: File `sitemap.xml` generato dinamicamente
- ✅ **Robots.txt**: Direttive crawler per controllo indicizzazione
- ✅ **Performance ottimizzata**: Turbopack, image optimization, lazy loading

### 2. Metadata Completi (SEO Classico)

#### File: `lemmario-dashboard/app/layout.tsx`

Implementazione di metadati avanzati secondo le best practices Next.js 16:

```typescript
export const metadata: Metadata = {
  metadataBase: new URL('https://atlante.atliteg.org'),
  title: {
    default: "AtLiTeG - Atlante Gastronomico Italiano",
    template: "%s | AtLiTeG"
  },
  description: "Esplora l'evoluzione della lingua gastronomica italiana...",
  keywords: [
    "AtLiTeG", "Atlante Gastronomico", "Lingua Italiana", 
    "Storia della Gastronomia", "VoSLIG", "Geolinguistica", 
    "Mappe Storiche", "Vocabolario Storico"
  ],
  authors: [
    { name: "Università per Stranieri di Siena" },
    { name: "Labgeo Giuseppe Caraci" }
  ],
  creator: "AtLiTeG Research Group",
  publisher: "Università per Stranieri di Siena",
  // ... robots, openGraph, twitter
};
```

**Benefici:**
- Titoli ottimizzati per CTR (Click-Through Rate)
- Descrizioni accattivanti per i risultati di ricerca
- Keywords semanticamente rilevanti
- Segnali di autorevolezza (autori, publisher)

#### Open Graph & Twitter Cards

Ottimizzazione per condivisione social:

```typescript
openGraph: {
  title: "AtLiTeG - Atlante Gastronomico Italiano",
  description: "Esplora l'evoluzione della lingua gastronomica italiana...",
  url: "https://atlante.atliteg.org",
  siteName: "AtLiTeG",
  locale: "it_IT",
  type: "website",
  images: [{
    url: "/immagine-testata.jpg",
    width: 1200,
    height: 630,
    alt: "AtLiTeG Dashboard Preview",
  }],
}
```

**Benefici:**
- Anteprime ricche su LinkedIn, Facebook, Twitter
- Aumento engagement social
- Brand visibility migliorata

### 3. Dati Strutturati JSON-LD (Schema.org)

#### File: `lemmario-dashboard/components/JsonLd.tsx`

Implementazione di **Schema.org** tramite JSON-LD per aiutare Google e le AI a comprendere il contesto scientifico del progetto:

```typescript
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "name": "AtLiTeG - Atlante della lingua...",
      "url": "https://www.atliteg.org",
      "logo": "https://atlante.atliteg.org/atliteg-logo.png"
    },
    {
      "@type": "Dataset",
      "name": "Vocabolario storico della lingua italiana...",
      "license": "https://creativecommons.org/licenses/by-nc-sa/4.0/",
      "isAccessibleForFree": true
    },
    {
      "@type": "WebApplication",
      "name": "AtLiTeG Dashboard",
      "applicationCategory": "EducationalApplication"
    }
  ]
}
```

**Benefici:**
- Google può mostrare **Rich Results** (risultati arricchiti)
- AI systems comprendono il tipo di contenuto (dataset scientifico)
- Segnali E-E-A-T (Expertise, Experience, Authoritativeness, Trust)
- Possibilità di apparire in Google Dataset Search

### 4. Sitemap e Robots.txt

#### File: `lemmario-dashboard/app/sitemap.ts`

Sitemap automatica per guidare i crawler:

```typescript
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://atlante.atliteg.org',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    }
  ];
}
```

**Benefici:**
- Indicizzazione più rapida e completa
- Controllo sulle priorità di crawl
- Segnalazione automatica aggiornamenti

#### File: `lemmario-dashboard/app/robots.ts`

Direttive per i crawler:

```typescript
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/private/',
    },
    sitemap: 'https://atlante.atliteg.org/sitemap.xml',
  };
}
```

**Benefici:**
- Controllo esplicito su cosa indicizzare
- Ottimizzazione crawl budget
- Riferimento diretto alla sitemap

### 5. Generative Engine Optimization (GEO)

#### File: `lemmario-dashboard/public/llms.txt`

File descrittivo specifico per AI crawlers (standard emergente):

```markdown
# AtLiTeG - Atlante della lingua e dei testi della cultura gastronomica italiana

## Descrizione
AtLiTeG è un progetto di ricerca che mappa l'evoluzione storica...

## Contenuti Principali
- **Lemmario**: Raccolta di termini gastronomici storici...
- **Mappa Geolinguistica**: Visualizzazione della distribuzione...

## Accesso ai Dati
I dati sono visualizzabili attraverso la dashboard interattiva...

## Crediti
Progetto PRIN 2017XRCZTM - Università per Stranieri di Siena...
```

**Benefici:**
- Fornisce contesto chiaro alle AI (ChatGPT, Claude, Perplexity)
- Facilita citazioni corrette da parte dei sistemi generativi
- Migliora la comprensione del dataset e delle sue finalità
- Standard futuro-compatibile per AI crawling

### 6. Viewport e Mobile Optimization

```typescript
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0B5FA5",
};
```

**Benefici:**
- Ottimizzazione per mobile-first indexing (priorità Google)
- Theme color per PWA integration
- Migliore esperienza utente mobile = segnale di ranking positivo

## Checklist Verifica Post-Deploy

Dopo il deployment, verifica che tutto funzioni correttamente:

### 1. Verifica File Generati

```bash
# Verifica che sitemap.xml esista
curl https://atlante.atliteg.org/sitemap.xml

# Verifica che robots.txt esista
curl https://atlante.atliteg.org/robots.txt

# Verifica che llms.txt esista
curl https://atlante.atliteg.org/llms.txt
```

### 2. Verifica Metadata

Apri la pagina in un browser e usa **Ispeziona elemento** per verificare:

```html
<!-- Nel <head> devono essere presenti: -->
<title>AtLiTeG - Atlante Gastronomico Italiano</title>
<meta name="description" content="Esplora l'evoluzione...">
<meta property="og:title" content="AtLiTeG...">
<meta property="og:image" content="/immagine-testata.jpg">
<script type="application/ld+json">{"@context":"https://schema.org"...}</script>
```

### 3. Test con Strumenti SEO

#### Google Rich Results Test
1. Vai su: https://search.google.com/test/rich-results
2. Inserisci URL: `https://atlante.atliteg.org`
3. Verifica che i dati strutturati siano riconosciuti (Organization, Dataset, WebApplication)

#### Open Graph Debugger
1. Vai su: https://www.opengraph.xyz/
2. Inserisci URL: `https://atlante.atliteg.org`
3. Verifica che l'anteprima social appaia correttamente

#### Schema Markup Validator
1. Vai su: https://validator.schema.org/
2. Inserisci l'HTML della pagina o l'URL
3. Verifica che non ci siano errori nel JSON-LD

### 4. Registrazione in Google Search Console

1. Accedi a [Google Search Console](https://search.google.com/search-console)
2. Aggiungi la proprietà `https://atlante.atliteg.org`
3. Verifica la proprietà (metodo DNS o file HTML)
4. Sottometti la sitemap: `https://atlante.atliteg.org/sitemap.xml`
5. Monitora l'indicizzazione e eventuali errori

### 5. Monitoraggio Performance SEO

Metriche da monitorare in Search Console:

- **Impressioni**: Quante volte il sito appare nei risultati
- **Click**: Quanti utenti cliccano dai risultati
- **CTR**: Percentuale di click (target: >3%)
- **Posizione media**: Ranking medio nelle SERP (target: top 10)
- **Core Web Vitals**: LCP, CLS, INP (già ottimizzati nel codice)

## Strategia Contenuti SEO

### Keyword Strategy

Keywords primarie da monitorare:
- "Atlante gastronomico italiano"
- "Storia lingua gastronomica italiana"
- "Vocabolario storico gastronomia"
- "VoSLIG"
- "Geolinguistica gastronomia"
- "Cucina medievale italiana"
- "Cucina rinascimentale italiana"

### Content Gaps da Colmare

Per migliorare ulteriormente il ranking, considera di aggiungere:

1. **Pagina "Chi Siamo"**: Rafforzare E-E-A-T con biografie team
2. **Pagina "Metodologia"**: Spiegare come i dati sono stati raccolti
3. **Blog/News**: Pubblicare articoli su scoperte linguistiche
4. **FAQ**: Rispondere alle domande comuni (ottimo per featured snippets)
5. **Glossario**: Definizioni termini tecnici geolinguistici

### Ottimizzazione On-Page Futura

Se si aggiungono nuove pagine:

```typescript
// Esempio per pagina "Chi Siamo"
export const metadata = {
  title: "Chi Siamo",
  description: "Il team di ricerca AtLiTeG dell'Università per Stranieri di Siena...",
  openGraph: {
    title: "Chi Siamo | AtLiTeG",
    description: "Il team di ricerca...",
  }
};
```

## Link Building Strategy

Per aumentare l'autorità del dominio:

1. **Citazioni Accademiche**: Pubblicare articoli scientifici che linkano al progetto
2. **Partnership Universitarie**: Ottenere backlink da .edu domains
3. **Digital PR**: Comunicati stampa su testate di settore (umanistica digitale)
4. **Directory Scientifiche**: Registrazione in cataloghi dataset (CLARIN, DARIAH)
5. **Social Media**: Condividere risultati su Twitter/X (account accademici)
6. **Wikipedia**: Aggiungere riferimento nella voce "Cucina italiana" o "Lingua italiana"

## Troubleshooting

### Problema: Sitemap non accessibile

**Soluzione**: Verifica che Nginx stia servendo correttamente i file statici:

```nginx
# In nginx.conf
location / {
    try_files $uri $uri/ /index.html;
}
```

### Problema: JSON-LD non validato

**Soluzione**: Usa il [Google Structured Data Testing Tool](https://validator.schema.org/) per debug

### Problema: Open Graph image non appare

**Soluzione**: 
1. Verifica che `/immagine-testata.jpg` esista in `public/`
2. Dimensioni consigliate: 1200x630px
3. Peso massimo: <1MB
4. Formato: JPG o PNG

### Problema: CTR basso in Search Console

**Soluzione**:
1. Rendi title e description più accattivanti
2. Aggiungi call-to-action ("Esplora gratis", "Scopri")
3. Usa numeri/statistiche ("1000+ lemmi storici")
4. Testa varianti con A/B testing

## Risorse Utili

### Strumenti SEO
- [Google Search Console](https://search.google.com/search-console)
- [Bing Webmaster Tools](https://www.bing.com/webmasters)
- [Rich Results Test](https://search.google.com/test/rich-results)
- [Schema.org Validator](https://validator.schema.org/)
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)

### Documentazione
- [Next.js Metadata API](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Schema.org Dataset](https://schema.org/Dataset)
- [Schema.org Organization](https://schema.org/Organization)
- [Google Search Central](https://developers.google.com/search)
- [llms.txt Proposal](https://llmstxt.org/)

### Guide SEO
- [Google SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [E-E-A-T Guidelines](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
- [Core Web Vitals](https://web.dev/vitals/)

## Conclusioni

L'implementazione SEO/AEO/GEO per AtLiTeG è completa e segue le best practices moderne. I principali vantaggi:

✅ **Indicizzazione ottimale** tramite sitemap e robots.txt  
✅ **Rich snippets** grazie a Schema.org JSON-LD  
✅ **Social sharing** migliorato con Open Graph  
✅ **AI-ready** con llms.txt per citazioni corrette  
✅ **E-E-A-T signals** con autori e publisher identificati  
✅ **Mobile-first** con viewport ottimizzato  

Monitora regolarmente Google Search Console e adatta la strategia in base ai dati di performance.

---

**Ultima revisione**: 30 dicembre 2025  
**Riferimento PR**: [#32 Enhance SEO and metadata](https://github.com/Unica-dh/atliteg-map/pull/32)
