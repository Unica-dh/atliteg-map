import { defineConfig, devices } from '@playwright/test';

/**
 * Configurazione Playwright per test E2E
 * https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  
  /* Timeout per ogni test */
  timeout: 30 * 1000,
  
  /* Configurazione expect */
  expect: {
    timeout: 5000,
  },
  
  /* Esegui test in parallelo */
  fullyParallel: true,
  
  /* Fallback in caso di test falliti in CI */
  forbidOnly: !!process.env.CI,
  
  /* Retry test falliti in CI */
  retries: process.env.CI ? 2 : 0,
  
  /* Numero worker in parallelo */
  workers: process.env.CI ? 1 : undefined,
  
  /* Reporter */
  reporter: [
    ['html'],
    ['list'],
  ],
  
  /* Configurazione condivisa per tutti i progetti */
  use: {
    /* URL base per test */
    baseURL: 'http://localhost:9000',
    
    /* Screenshot solo su fallimento */
    screenshot: 'only-on-failure',
    
    /* Video solo su retry */
    video: 'retain-on-failure',
    
    /* Traccia solo su retry */
    trace: 'on-first-retry',
  },

  /* Configura progetti per browser multipli */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* Test su mobile viewport */
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  /* Esegui server locale prima dei test */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:9000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
