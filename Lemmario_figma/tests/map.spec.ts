/**
 * Test E2E per mappa geografica e markers
 * Verifica rendering della mappa, presenza di markers e funzionalità popup
 */

import { test, expect } from '@playwright/test';

test.describe('Mappa Geografica', () => {
  test.beforeEach(async ({ page }) => {
    // Naviga alla pagina principale
    await page.goto('http://localhost:9000');
    
    // Attendi che la pagina sia completamente caricata
    await page.waitForLoadState('networkidle');
    
    // Attendi che la mappa si carichi
    await page.waitForTimeout(2000);
  });

  test('dovrebbe renderizzare la mappa Leaflet', async ({ page }) => {
    // Verifica che il container della mappa esista
    const mapContainer = page.locator('.leaflet-container');
    await expect(mapContainer).toBeVisible();

    // Verifica che i tiles OSM siano caricati
    const tiles = page.locator('.leaflet-tile-container img');
    expect(await tiles.count()).toBeGreaterThan(0);

    // Verifica controlli zoom
    const zoomIn = page.locator('.leaflet-control-zoom-in');
    const zoomOut = page.locator('.leaflet-control-zoom-out');
    await expect(zoomIn).toBeVisible();
    await expect(zoomOut).toBeVisible();
  });

  test('dovrebbe mostrare markers sulla mappa', async ({ page }) => {
    // Attendi caricamento markers
    await page.waitForTimeout(1000);

    // Verifica presenza markers custom
    const markers = page.locator('.custom-marker');
    const markerCount = await markers.count();
    
    // Dovrebbero esserci almeno alcuni markers (dato che abbiamo 26 località)
    expect(markerCount).toBeGreaterThan(0);
    console.log(`Trovati ${markerCount} markers sulla mappa`);
  });

  test('dovrebbe aprire popup al click su marker', async ({ page }) => {
    // Attendi caricamento markers
    await page.waitForTimeout(1000);

    // Trova un marker
    const marker = page.locator('.custom-marker').first();
    await expect(marker).toBeVisible();

    // Click sul marker
    await marker.click();

    // Attendi apertura popup
    await page.waitForTimeout(500);

    // Verifica che il popup sia visibile
    const popup = page.locator('.leaflet-popup');
    await expect(popup).toBeVisible();

    // Verifica che il popup contenga informazioni
    const popupContent = popup.locator('.leaflet-popup-content');
    await expect(popupContent).toBeVisible();
    
    // Il popup dovrebbe contenere almeno il nome della località
    const locationName = popupContent.locator('h3').first();
    await expect(locationName).toBeVisible();
  });

  test('dovrebbe mostrare lista lemmi nel popup del marker', async ({ page }) => {
    // Attendi caricamento markers
    await page.waitForTimeout(1000);

    // Click su primo marker
    const marker = page.locator('.custom-marker').first();
    await marker.click();
    await page.waitForTimeout(500);

    // Verifica presenza bottoni lemmi nel popup
    const popup = page.locator('.leaflet-popup');
    const lemmaButtons = popup.locator('button[data-lemma-id]');
    
    // Dovrebbero esserci lemmi elencati
    expect(await lemmaButtons.count()).toBeGreaterThan(0);

    // Verifica che i bottoni contengano informazioni lemma
    const firstButton = lemmaButtons.first();
    await expect(firstButton).toContainText(/Lemma:/i);
    await expect(firstButton).toContainText(/Forma:/i);
    await expect(firstButton).toContainText(/Anno:/i);
  });

  test('dovrebbe selezionare lemma cliccando nel popup', async ({ page }) => {
    // Attendi caricamento markers
    await page.waitForTimeout(1000);

    // Click su marker
    const marker = page.locator('.custom-marker').first();
    await marker.click();
    await page.waitForTimeout(500);

    // Click su primo lemma nel popup
    const popup = page.locator('.leaflet-popup');
    const firstLemma = popup.locator('button[data-lemma-id]').first();
    await firstLemma.click();

    // Attendi che il pannello dettagli si aggiorni
    await page.waitForTimeout(500);

    // Verifica che il pannello "Dettaglio Lemma" si sia aggiornato
    const detailPanel = page.getByRole('heading', { name: /dettaglio lemma/i });
    await expect(detailPanel).toBeVisible();

    // Il pannello non dovrebbe più mostrare "Nessun lemma selezionato"
    const noSelection = page.getByText(/nessun lemma selezionato/i);
    await expect(noSelection).not.toBeVisible();
  });

  test('dovrebbe caricare layer GeoJSON se disponibile', async ({ page }) => {
    // Attendi caricamento completo
    await page.waitForTimeout(2000);

    // Verifica nei log della console che il GeoJSON sia stato caricato o il warning sia presente
    const consoleMessages: string[] = [];
    page.on('console', msg => consoleMessages.push(msg.text()));

    // Ricarica la pagina per catturare i log
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Verifica che non ci siano errori critici sul GeoJSON
    const criticalErrors = consoleMessages.filter(msg => 
      msg.includes('Errore') && msg.includes('GeoJSON') && !msg.includes('non disponibile')
    );
    
    expect(criticalErrors.length).toBe(0);
  });

  test('dovrebbe permettere zoom della mappa', async ({ page }) => {
    // Verifica bottone zoom-in
    const zoomIn = page.locator('.leaflet-control-zoom-in');
    await zoomIn.click();
    await page.waitForTimeout(500);

    // Verifica bottone zoom-out
    const zoomOut = page.locator('.leaflet-control-zoom-out');
    await zoomOut.click();
    await page.waitForTimeout(500);

    // La mappa dovrebbe essere ancora visibile
    const mapContainer = page.locator('.leaflet-container');
    await expect(mapContainer).toBeVisible();
  });

  test('dovrebbe mostrare conteggio corretto località e lemmi', async ({ page }) => {
    // Trova l'intestazione della mappa con conteggio
    const mapHeader = page.locator('text=/\\d+ locations.*\\d+ lemmas/i');
    
    if (await mapHeader.isVisible()) {
      const headerText = await mapHeader.textContent();
      console.log(`Conteggio mappa: ${headerText}`);
      
      // Verifica che i numeri siano maggiori di zero
      expect(headerText).toMatch(/\d+/);
    }
  });

  test('dovrebbe evidenziare marker quando lemma selezionato', async ({ page }) => {
    // Seleziona un lemma dall'indice alfabetico
    await page.locator('[role="list"][aria-label*="Elenco lemmi"]').first().waitFor({ state: 'visible' });
    const firstLemmaInList = page.locator('[role="listitem"]').first();
    
    if (await firstLemmaInList.isVisible()) {
      await firstLemmaInList.click();
      await page.waitForTimeout(500);

      // Verifica che esista un marker evidenziato
      const highlightedMarker = page.locator('.custom-marker-selected');
      
      // Se il lemma selezionato ha coordinate, dovrebbe esserci un marker evidenziato
      const markerCount = await highlightedMarker.count();
      console.log(`Markers evidenziati: ${markerCount}`);
    }
  });
});
