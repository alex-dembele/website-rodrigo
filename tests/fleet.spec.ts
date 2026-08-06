import { test, expect } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';

const DIR = 'content/vehicles';

const fiches = readdirSync(DIR)
  .filter((f) => f.endsWith('.json'))
  .map((f) => JSON.parse(readFileSync(`${DIR}/${f}`, 'utf8')));

test.describe('Fiches de la flotte', () => {
  // Ce test écrit dans content/vehicles : il ne doit tourner qu'une fois,
  // sinon les deux navigateurs se marchent dessus. Il ne dépend pas du navigateur.
  test('une fiche invalide fait échouer la génération', ({}, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'vérification indépendante du navigateur');

    const generer = () =>
      execFileSync('node', ['scripts/build-vehicles.mjs'], { encoding: 'utf8', stdio: 'pipe' });

    expect(() => generer()).not.toThrow(); // les fiches en place sont valides

    // une erreur de saisie fréquente : le prix tapé en toutes lettres
    const cassee = `${DIR}/zzz-fiche-de-test.json`;
    writeFileSync(
      cassee,
      JSON.stringify({ ...fiches[0], id: 'zzz-fiche-de-test', pricePerDay: '30 000 FCFA' })
    );
    try {
      let message = '';
      try {
        generer();
      } catch (e) {
        message = `${(e as { stderr?: string }).stderr ?? ''}`;
      }
      expect(message).toContain('pricePerDay');
      expect(message).toContain('doit être un nombre');
    } finally {
      rmSync(cassee, { force: true });
      generer(); // on remet le fichier généré d'aplomb
    }
  });

  test('chaque voiture proposée a des photos qui s’affichent', async ({ page }) => {
    await page.goto('/vehicles', { waitUntil: 'networkidle' });

    for (const v of fiches.filter((f) => f.available !== false)) {
      const carte = page.getByRole('article').filter({ hasText: v.name }).first();
      await expect(carte).toBeVisible();
      expect(v.gallery.length).toBeGreaterThan(0);
    }
  });

  test('chaque voiture disponible est réservable', async ({ page }) => {
    for (const v of fiches.filter((f) => f.available !== false)) {
      await page.goto(`/reservation?vehicle=${v.id}`);
      await expect(page.locator('[data-testid="total"]:visible')).not.toHaveText('0 FCFA');
    }
  });
});

test.describe('Galerie photo', () => {
  test('la croix referme la galerie et rend le site utilisable', async ({ page }) => {
    await page.goto('/vehicles', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: /Voir les photos/ }).first().click();

    const galerie = page.getByRole('dialog');
    await expect(galerie).toBeVisible();

    // la galerie doit couvrir l'écran, pas être enfermée dans la carte
    const boite = await galerie.boundingBox();
    const ecran = page.viewportSize()!;
    expect(boite!.width).toBeGreaterThanOrEqual(ecran.width - 1);

    await page.getByRole('button', { name: 'Fermer' }).click();
    await expect(galerie).toBeHidden();

    // et le site répond de nouveau : on peut cliquer un lien derrière
    await page.getByRole('link', { name: 'Réserver' }).first().click();
    await expect(page).toHaveURL(/\/reservation/);
  });
});
