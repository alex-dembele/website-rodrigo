import { defineConfig, devices } from '@playwright/test';

export const MOT_DE_PASSE_TEST = 'mot-de-passe-de-test';

/**
 * Tests de bout en bout : ils vérifient surtout que le parcours de
 * réservation reste simple et fonctionnel (choix de la voiture, dates,
 * devis, envoi WhatsApp) sur mobile comme sur ordinateur.
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : [['list']],
  use: {
    baseURL: 'http://127.0.0.1:3000',
    trace: 'on-first-retry',
    locale: 'fr-FR',
    timezoneId: 'Africa/Douala'
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } }
  ],
  webServer: {
    command: 'npm run build && npm run start -- --port 3000',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    env: {
      // Mot de passe valable uniquement pour le serveur local des tests.
      ADMIN_PASSWORD: MOT_DE_PASSE_TEST,
      // Neutralise le dépôt, même si un .env en définit un : les tests lisent
      // les fiches du disque et ne peuvent commiter nulle part.
      CONTENT_REPO: '',
      CONTENT_REPO_TOKEN: '',
      CONTENT_APP_ID: '',
      CONTENT_APP_PRIVATE_KEY: ''
    }
  }
});
