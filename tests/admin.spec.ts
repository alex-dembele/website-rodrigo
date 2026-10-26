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
    const bascule = await request.patch('/api/admin/vehicles', { data: { id: 'hilux', available: false } });
    expect(bascule.status()).toBe(401);
    const ordre = await request.post('/api/admin/order', { data: { ids: ['hilux'] } });
    expect(ordre.status()).toBe(401);
  });

  test('le gérant reste connecté : la session ne tombe pas au bout de quelques heures', async ({ page, context }) => {
    await seConnecter(page);
    const session = (await context.cookies()).find((c) => c.name === 'rodrigo_session');
    expect(session).toBeDefined();
    const joursRestants = (session!.expires * 1000 - Date.now()) / 86_400_000;
    expect(joursRestants).toBeGreaterThan(300);
  });

  test('chaque voiture a un interrupteur « En ligne »', async ({ page }) => {
    await seConnecter(page);
    const interrupteurs = page.getByRole('switch');
    await expect(interrupteurs.first()).toBeVisible();
    expect(await interrupteurs.count()).toBe(await page.getByRole('article').count());
    await expect(interrupteurs.first()).toHaveAttribute('aria-checked', 'true');
  });

  test('les flèches préparent un nouvel ordre, qu’on peut annuler', async ({ page }) => {
    await seConnecter(page);
    const premiere = (await page.getByRole('article').first().getByRole('heading').textContent())!;
    await page.getByRole('button', { name: /^Descendre / }).first().click();

    await expect(page.getByText('Nouvel ordre pas encore enregistré.')).toBeVisible();
    await expect(page.getByRole('article').nth(1).getByRole('heading')).toHaveText(premiere);

    await page.getByRole('button', { name: 'Annuler' }).click();
    await expect(page.getByText('Nouvel ordre pas encore enregistré.')).toHaveCount(0);
    await expect(page.getByRole('article').first().getByRole('heading')).toHaveText(premiere);
  });

  test('la fiche permet d’indiquer des dates de location', async ({ page }) => {
    await seConnecter(page);
    await page.getByRole('button', { name: 'Modifier' }).first().click();
    await page.getByRole('button', { name: 'Ajouter une location' }).click();
    await expect(page.getByLabel('Du', { exact: true })).toBeVisible();
    await expect(page.getByLabel('Au', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Retirer cette location' }).click();
    await expect(page.getByLabel('Du', { exact: true })).toHaveCount(0);
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

test.describe('Accès à l’espace de gestion', () => {
  test('un lien du pied de page y mène, sans avoir à taper l’adresse', async ({ page }) => {
    await page.goto('/');
    const lien = page.getByRole('link', { name: /Gérer le site/ });
    await expect(lien).toBeVisible();
    await lien.click();
    await expect(page.getByRole('heading', { name: 'Espace de gestion' })).toBeVisible();
  });
});

/**
 * Le serveur de test n'a pas de dépôt configuré : tout enregistrement échoue
 * côté serveur. C'est exactement le cas qui doit rester visible pour le gérant
 * — un échec silencieux lui ferait croire que sa modification est passée.
 */
test.describe('Retour après une modification', () => {
  async function seConnecterAdmin(page: import('@playwright/test').Page) {
    await page.goto('/admin');
    await page.getByLabel('Mot de passe').fill(MOT_DE_PASSE_TEST);
    await page.getByRole('button', { name: 'Entrer' }).click();
    await expect(page.getByRole('button', { name: 'Ajouter une voiture' })).toBeVisible();
  }

  test('un enregistrement qui échoue est annoncé, pas avalé', async ({ page }) => {
    await seConnecterAdmin(page);
    await page.getByRole('button', { name: 'Ajouter une voiture' }).click();

    await page.getByLabel('Modèle').fill('Toyota Corolla');
    await page.getByLabel('Prix par jour, sans chauffeur').fill('20000');
    await page.getByLabel('Phrase qui aide à choisir').fill('Petite et économique');
    await page.getByLabel('Description').fill('Une berline compacte pour la ville.');
    // sans photo : on la déclare indisponible pour que la fiche soit valable
    await page.locator('label', { hasText: 'En ligne' }).getByRole('checkbox').uncheck();

    await page.getByRole('button', { name: 'Enregistrer' }).click();

    // le bouton doit se débloquer et une explication doit apparaître
    await expect(page.getByText(/pas encore activé|échoué|connexion/i).first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Enregistrer' })).toBeEnabled();
  });

  test('masquer une voiture qui échoue est annoncé, et la voiture reste en ligne', async ({ page }) => {
    await seConnecterAdmin(page);
    const interrupteur = page.getByRole('switch').first();
    await interrupteur.click();
    await expect(page.getByRole('status')).toBeVisible();
    await expect(page.getByText('Rien n’a été modifié sur le site.')).toBeVisible();
    await expect(interrupteur).toHaveAttribute('aria-checked', 'true');
  });

  test('un nouvel ordre qui échoue est annoncé et reste à enregistrer', async ({ page }) => {
    await seConnecterAdmin(page);
    await page.getByRole('button', { name: /^Descendre / }).first().click();
    await page.getByRole('button', { name: 'Enregistrer l’ordre' }).click();
    await expect(page.getByText('Rien n’a été modifié sur le site.')).toBeVisible();
    await expect(page.getByText('Nouvel ordre pas encore enregistré.')).toBeVisible();
  });

  test('une suppression qui échoue est annoncée', async ({ page }) => {
    await seConnecterAdmin(page);
    await page.getByRole('button', { name: /^Supprimer / }).first().click();
    await page.getByRole('button', { name: 'Supprimer définitivement' }).click();

    await expect(page.getByRole('status')).toBeVisible();
    await expect(page.getByText(/n’a pas pu être supprimée|Pas de connexion/)).toBeVisible();
    await expect(page.getByText('Rien n’a été modifié sur le site.')).toBeVisible();
  });
});
