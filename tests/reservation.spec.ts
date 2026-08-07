import { test, expect, type Page } from '@playwright/test';

const WHATSAPP_NUMBER = '4915772809304';

// Le récapitulatif existe en deux exemplaires (colonne sur ordinateur, barre
// collante sur mobile) : on ne cible que celui affiché sur le viewport courant.
const total = (page: Page) => page.locator('[data-testid="total"]:visible');
const deposit = (page: Page) => page.locator('[data-testid="deposit"]:visible');
const submit = (page: Page) => page.locator('[data-testid="submit-whatsapp"]:visible');

test.describe('Parcours de réservation', () => {
  test('la recherche du hero mène à un devis chiffré', async ({ page }) => {
    await page.goto('/');
    await page.getByLabel('Voiture', { exact: true }).selectOption({ label: 'Toyota RAV4 — Grise' });
    await page.getByRole('button', { name: 'Voir le prix' }).click();

    await expect(page).toHaveURL(/\/reservation\?.*vehicle=rav4-grise/);
    // les dates sont pré-remplies : le prix s'affiche sans aucune saisie
    await expect(total(page)).toHaveText('40 000 FCFA');
  });

  test('la voiture choisie sur une carte arrive sélectionnée', async ({ page }) => {
    await page.goto('/vehicles');
    await page
      .getByRole('article')
      .filter({ hasText: 'Grise, boîte automatique' })
      .getByRole('link', { name: 'Réserver' })
      .click();

    await expect(page).toHaveURL(/vehicle=avensis-auto/);
    await expect(
      page.getByRole('button', { name: /Toyota Avensis Grise, boîte automatique/ })
    ).toHaveAttribute('aria-pressed', 'true');
  });

  test('le devis suit la durée et l’option chauffeur', async ({ page }) => {
    await page.goto('/reservation?vehicle=avensis-manuelle&from=2030-01-10&to=2030-01-13');
    await expect(total(page)).toHaveText('75 000 FCFA'); // 3 jours x 25 000

    await page.getByRole('button', { name: 'Avec chauffeur' }).click();
    await expect(total(page)).toHaveText('105 000 FCFA'); // + 3 jours x 10 000
    await expect(deposit(page)).toHaveText('31 500 FCFA'); // acompte de 30 %
  });

  test('un formulaire incomplet ne part pas et signale les champs fautifs', async ({ page }) => {
    await page.goto('/reservation');
    await submit(page).click();

    await expect(page.getByText('Indique ton nom.')).toBeVisible();
    await expect(page.getByText('Indique un numéro joignable.')).toBeVisible();
  });

  test('une demande complète ouvre WhatsApp sur le bon numéro', async ({ page, context }) => {
    await page.goto('/reservation?vehicle=rav4-grise&from=2030-03-01&to=2030-03-03');
    await page.getByLabel('Nom complet').fill('Jean Mbarga');
    await page.getByLabel('Téléphone / WhatsApp').fill('677 00 11 22');

    const [waPage] = await Promise.all([
      context.waitForEvent('page'),
      submit(page).click()
    ]);

    // wa.me redirige vers api.whatsapp.com, qui encode le message en form-urlencoded
    const url = decodeURIComponent(waPage.url()).replace(/\+/g, ' ');
    expect(url).toMatch(/wa\.me|api\.whatsapp\.com/);
    expect(url).toContain(WHATSAPP_NUMBER);
    expect(url).toContain('Toyota RAV4');
    expect(url).toContain('Jean Mbarga');
    expect(url).toContain('80 000 FCFA'); // 2 jours x 40 000

    // l'envoi est confirmé et les infos de paiement se déplient
    await expect(page.getByText('Demande envoyée')).toBeVisible();
  });
});
