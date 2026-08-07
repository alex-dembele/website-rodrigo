import { test, expect } from '@playwright/test';
import { MOT_DE_PASSE_TEST } from '../playwright.config';

/**
 * L'espace de gestion est la porte d'entrée du gérant sur le contenu du site :
 * on vérifie qu'elle s'ouvre avec le bon mot de passe, qu'elle reste fermée
 * sinon, et que le formulaire d'ajout guide au lieu de laisser passer
 * n'importe quoi.
 */

async function seConnecter(page: import('@playwright/test').Page) {
  await page.goto('/admin');
  await page.getByLabel('Mot de passe').fill(MOT_DE_PASSE_TEST);
  await page.getByRole('button', { name: 'Entrer' }).click();
  await expect(page.getByRole('heading', { name: /voiture/ })).toBeVisible();
}

test.describe('Espace de gestion', () => {
  test('demande un mot de passe avant tout', async ({ page }) => {
    await page.goto('/admin');
    await expect(page.getByRole('heading', { name: 'Espace de gestion' })).toBeVisible();
    await expect(page.getByLabel('Mot de passe')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Ajouter une voiture' })).toHaveCount(0);
  });

  test('refuse un mauvais mot de passe', async ({ page }) => {
    await page.goto('/admin');
    await page.getByLabel('Mot de passe').fill('essai-au-hasard');
    await page.getByRole('button', { name: 'Entrer' }).click();
    await expect(page.getByText('Mot de passe incorrect.')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Ajouter une voiture' })).toHaveCount(0);
  });

  test('le contenu n’est pas lisible sans être connecté', async ({ request }) => {
    const response = await request.get('/api/admin/content');
    expect(response.status()).toBe(401);
  });

  test('les modifications sont refusées sans être connecté', async ({ request }) => {
    const response = await request.post('/api/admin/vehicles', { data: { id: 'pirate' } });
    expect(response.status()).toBe(401);
  });

  test('affiche la flotte une fois connecté', async ({ page }) => {
    await seConnecter(page);
    await expect(page.getByRole('article').first()).toBeVisible();
    await expect(page.getByText('Toyota RAV4').first()).toBeVisible();
    await expect(page.getByText('/jour').first()).toBeVisible();
  });

  test('le formulaire d’ajout explique ce qui manque', async ({ page }) => {
    await seConnecter(page);
    await page.getByRole('button', { name: 'Ajouter une voiture' }).click();

    const modal = page.getByRole('heading', { name: 'Ajouter une voiture' });
    await expect(modal).toBeVisible();

    // formulaire vide : on attend des messages en français, pas une erreur technique
    await page.getByRole('button', { name: 'Enregistrer' }).click();
    await expect(page.getByText('Indique le modèle de la voiture.')).toBeVisible();
    await expect(page.getByText(/prix par jour en FCFA/)).toBeVisible();
  });

  test('la déconnexion referme l’accès', async ({ page }) => {
    await seConnecter(page);
    await page.getByRole('button', { name: 'Quitter' }).click();
    await expect(page.getByLabel('Mot de passe')).toBeVisible();
  });

  test('l’espace de gestion n’est pas proposé aux moteurs de recherche', async ({ request }) => {
    const robots = await (await request.get('/robots.txt')).text();
    expect(robots).toContain('/admin');
  });
});
