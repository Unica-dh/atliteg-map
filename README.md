# Dashboard Linguistico ATLITEG

Dashboard interattiva per la visualizzazione e l'analisi di dati linguistici con mappe geografiche, treemap delle categorie e tabelle dettagliate.

## Tecnologie Utilizzate

- **Vue 3** - Framework JavaScript progressivo
- **Vite** - Build tool e dev server veloce
- **Tailwind CSS v4** - Framework CSS utility-first
- **Vue DevTools** - Strumenti di debug per Vue

## Requisiti di Sistema

- **Node.js**: versione `^20.19.0` oppure `>=22.12.0`
- **npm**: versione 8 o superiore (incluso con Node.js)

## Configurazione IDE Consigliata

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (disabilitare Vetur se installato).

## Configurazione Browser Consigliata

- Browser basati su Chromium (Chrome, Edge, Brave, ecc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Attiva Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Attiva Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Installazione e Avvio in Locale

### 1. Verifica versione Node.js

```sh
node --version
```

Se necessario, installa la versione corretta di Node.js da [nodejs.org](https://nodejs.org/) o usa un version manager come [nvm](https://github.com/nvm-sh/nvm).

### 2. Clona il repository

```sh
git clone <url-repository>
cd atliteg-map
```

### 3. Installa le dipendenze

```sh
npm install
```

### 4. Avvia il server di sviluppo

```sh
npm run dev
```

Il server sarà disponibile all'indirizzo `http://localhost:5173/` (la porta potrebbe variare se la 5173 è già in uso).

### 5. Build per produzione

Per creare una build ottimizzata per la produzione:

```sh
npm run build
```

I file compilati saranno generati nella cartella `dist/`.

### 6. Anteprima della build di produzione

Per testare la build di produzione in locale:

```sh
npm run preview
```

## Struttura del Progetto

```
src/
├── App.vue                           # Componente root
├── main.js                           # Entry point dell'applicazione
├── index.css                         # Stili globali
├── components/
│   ├── Dashboard.vue                 # Layout principale del dashboard
│   ├── TopNavBar.vue                 # Barra di navigazione superiore
│   ├── GlobalFilterBar.vue           # Barra dei filtri globali
│   ├── GeographicalDistributionMap.vue  # Mappa geografica interattiva
│   ├── LemmaCategoriesTreemap.vue    # Treemap delle categorie
│   └── LemmaDetailsTable.vue         # Tabella dettagli lemmi
└── assets/                           # Assets statici e CSS
```

## Personalizzazione

Vedi la [Documentazione di Vite](https://vite.dev/config/) per la configurazione avanzata.

Per personalizzare Tailwind CSS, modifica il file `tailwind.config.js`.
