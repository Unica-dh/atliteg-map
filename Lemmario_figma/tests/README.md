# Test Automatici Dashboard Lemmario

## Panoramica

Questa directory contiene test end-to-end (E2E) per verificare le funzionalità principali della dashboard del lemmario.

## Tecnologie

- **Playwright**: Framework per test E2E su browser multipli
- Test eseguiti su: Chrome, Firefox, Safari, Mobile Chrome, Mobile Safari

## Struttura Test

### `filters.spec.ts` - Test Filtri
Verifica le funzionalità dei filtri categoria e periodo:
- Apertura dropdown filtri
- Selezione/deselezione categorie
- Selezione/deselezione periodi
- Reset filtri
- Combinazione multipli filtri
- Aggiornamento conteggio risultati

### `map.spec.ts` - Test Mappa
Verifica il rendering e le funzionalità della mappa geografica:
- Caricamento mappa Leaflet
- Visualizzazione markers sulle coordinate
- Apertura popup al click su marker
- Visualizzazione lista lemmi nei popup
- Selezione lemma da popup
- Evidenziamento marker per lemma selezionato
- Controlli zoom
- Caricamento layer GeoJSON (opzionale)

## Setup

### Installazione Dipendenze

```bash
# Installare Playwright
npm install -D @playwright/test

# Installare browser
npx playwright install
```

### Configurazione

Il file `playwright.config.ts` contiene la configurazione:
- **baseURL**: `http://localhost:9000` (URL dell'applicazione)
- **timeout**: 30s per test
- **retries**: 2 in CI, 0 in locale
- **webServer**: Avvia automaticamente `npm run dev` prima dei test

## Esecuzione Test

### Tutti i test
```bash
npx playwright test
```

### Test specifico
```bash
npx playwright test tests/filters.spec.ts
npx playwright test tests/map.spec.ts
```

### Test su browser specifico
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Modalità UI interattiva
```bash
npx playwright test --ui
```

### Debug mode
```bash
npx playwright test --debug
```

### Headed mode (vedi browser)
```bash
npx playwright test --headed
```

## Report

### Visualizzare report HTML
```bash
npx playwright show-report
```

Il report include:
- Screenshot su fallimenti
- Video su retry
- Trace su primo retry

## Test Coverage

### Filtri
- ✅ Apertura dropdown categoria
- ✅ Apertura dropdown periodo
- ✅ Filtro per categoria
- ✅ Filtro per periodo
- ✅ Reset filtri
- ✅ Combinazione filtri

### Mappa
- ✅ Rendering mappa Leaflet
- ✅ Visualizzazione markers
- ✅ Apertura popup
- ✅ Lista lemmi in popup
- ✅ Selezione lemma
- ✅ Evidenziamento marker
- ✅ Controlli zoom
- ✅ Caricamento GeoJSON

## CI/CD Integration

### GitHub Actions
```yaml
name: Playwright Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - name: Install dependencies
        run: npm ci
      - name: Install Playwright
        run: npx playwright install --with-deps
      - name: Run tests
        run: npx playwright test
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

## Best Practices

1. **Selettori Stabili**: Usare ruoli ARIA e label quando possibile
2. **Attese Intelligenti**: Usare `waitForLoadState`, `waitForSelector`
3. **Isolation**: Ogni test indipendente (beforeEach reset)
4. **Assertion Chiare**: Messaggi descrittivi per fallimenti
5. **Screenshot/Video**: Solo su fallimento per efficienza

## Troubleshooting

### Test timeout
- Aumentare timeout in `playwright.config.ts`
- Verificare che server sia in esecuzione
- Controllare network e caricamento dati

### Selettori non trovati
- Verificare che elemento sia visibile
- Controllare timing (aggiungere wait)
- Usare Playwright Inspector: `npx playwright test --debug`

### Browser non installati
```bash
npx playwright install
```

## Manutenzione

### Aggiungere nuovi test
1. Creare file `.spec.ts` in `tests/`
2. Seguire struttura esistente
3. Documentare funzionalità testata
4. Eseguire test localmente
5. Verificare su tutti i browser

### Update selettori
Se UI cambia, aggiornare selettori in:
- `filters.spec.ts`: Selettori dropdown, checkbox
- `map.spec.ts`: Selettori marker, popup, layer

## Risorse

- [Playwright Documentation](https://playwright.dev/)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Selectors Guide](https://playwright.dev/docs/selectors)
- [Debugging Guide](https://playwright.dev/docs/debug)
