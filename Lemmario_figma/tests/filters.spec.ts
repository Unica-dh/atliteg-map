/**
 * Test E2E per funzionalità filtri
 * Verifica che i dropdown funzionino e i filtri vengano applicati correttamente
 */

import { test, expect } from '@playwright/test';

test.describe('Filtri Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Naviga alla pagina principale
    await page.goto('http://localhost:9000');
    
    // Attendi che la pagina sia completamente caricata
    await page.waitForLoadState('networkidle');
  });

  test('dovrebbe aprire il dropdown categorie al click', async ({ page }) => {
    // Trova il pulsante filtro categoria
    const categoryButton = page.getByRole('button', { name: /filtra per categoria/i });
    await expect(categoryButton).toBeVisible();

    // Click sul pulsante
    await categoryButton.click();

    // Verifica che il popover si apra con la lista categorie
    const popover = page.locator('[data-slot="popover-content"]');
    await expect(popover).toBeVisible();

    // Verifica che ci siano categorie visualizzate
    const checkboxes = popover.locator('label').filter({ has: page.locator('button[role="checkbox"]') });
    await expect(checkboxes.first()).toBeVisible();
  });

  test('dovrebbe aprire il dropdown periodi al click', async ({ page }) => {
    // Trova il pulsante filtro periodo
    const periodButton = page.getByRole('button', { name: /filtra per periodo/i });
    await expect(periodButton).toBeVisible();

    // Click sul pulsante
    await periodButton.click();

    // Verifica che il popover si apra con la lista periodi
    const popover = page.locator('[data-slot="popover-content"]');
    await expect(popover).toBeVisible();

    // Verifica che ci siano periodi visualizzati
    const checkboxes = popover.locator('label').filter({ has: page.locator('button[role="checkbox"]') });
    await expect(checkboxes.first()).toBeVisible();
  });

  test('dovrebbe filtrare i risultati per categoria', async ({ page }) => {
    // Ottieni il numero iniziale di lemmi
    const initialCount = await page.locator('[aria-label*="lemmi trovati"]').first().textContent();
    
    // Apri dropdown categorie
    await page.getByRole('button', { name: /filtra per categoria/i }).click();
    
    // Attendi popover
    const popover = page.locator('[data-slot="popover-content"]');
    await expect(popover).toBeVisible();

    // Seleziona la prima categoria disponibile
    const firstCategory = popover.locator('label').filter({ has: page.locator('button[role="checkbox"]') }).first();
    await firstCategory.click();

    // Chiudi il popover cliccando fuori
    await page.mouse.click(10, 10);
    
    // Attendi aggiornamento dati
    await page.waitForTimeout(500);

    // Verifica che il filtro sia applicato (badge visibile)
    const badge = page.locator('[variant="secondary"]').first();
    await expect(badge).toBeVisible();

    // Verifica che il numero di lemmi sia cambiato
    const filteredCount = await page.locator('[aria-label*="lemmi trovati"]').first().textContent();
    expect(filteredCount).not.toBe(initialCount);
  });

  test('dovrebbe filtrare i risultati per periodo', async ({ page }) => {
    // Ottieni il numero iniziale di lemmi
    const initialCount = await page.locator('[aria-label*="lemmi trovati"]').first().textContent();
    
    // Apri dropdown periodi
    await page.getByRole('button', { name: /filtra per periodo/i }).click();
    
    // Attendi popover
    const popover = page.locator('[data-slot="popover-content"]');
    await expect(popover).toBeVisible();

    // Seleziona il primo periodo disponibile
    const firstPeriod = popover.locator('label').filter({ has: page.locator('button[role="checkbox"]') }).first();
    await firstPeriod.click();

    // Chiudi il popover cliccando fuori
    await page.mouse.click(10, 10);
    
    // Attendi aggiornamento dati
    await page.waitForTimeout(500);

    // Verifica che il filtro sia applicato (badge visibile)
    const badge = page.locator('[variant="secondary"]').first();
    await expect(badge).toBeVisible();

    // Verifica che il numero di lemmi sia cambiato
    const filteredCount = await page.locator('[aria-label*="lemmi trovati"]').first().textContent();
    expect(filteredCount).not.toBe(initialCount);
  });

  test('dovrebbe resettare i filtri', async ({ page }) => {
    // Applica un filtro categoria
    await page.getByRole('button', { name: /filtra per categoria/i }).click();
    const popover = page.locator('[data-slot="popover-content"]');
    await popover.locator('label').first().click();
    await page.mouse.click(10, 10);
    
    // Verifica che badge filtro sia visibile
    await expect(page.locator('[variant="secondary"]').first()).toBeVisible();

    // Click su reset
    const resetButton = page.getByRole('button', { name: /reset/i });
    if (await resetButton.isVisible()) {
      await resetButton.click();

      // Verifica che badge non sia più visibile
      await expect(page.locator('[variant="secondary"]').first()).not.toBeVisible();
    }
  });

  test('dovrebbe combinare filtri categoria e periodo', async ({ page }) => {
    // Applica filtro categoria
    await page.getByRole('button', { name: /filtra per categoria/i }).click();
    let popover = page.locator('[data-slot="popover-content"]');
    await popover.locator('label').first().click();
    await page.mouse.click(10, 10);

    // Applica filtro periodo
    await page.getByRole('button', { name: /filtra per periodo/i }).click();
    popover = page.locator('[data-slot="popover-content"]');
    await popover.locator('label').first().click();
    await page.mouse.click(10, 10);

    // Verifica che entrambi i filtri siano attivi
    const badges = page.locator('[variant="secondary"]');
    expect(await badges.count()).toBeGreaterThanOrEqual(2);
  });
});
