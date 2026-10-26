import { test, expect } from '@playwright/test';

const PAGES = [
  '/',
  '/vehicles',
  '/tarifs',
  '/services',
  '/reservation',
  '/about',
  '/contact',
  '/blog',
  '/blog/louer-une-voiture-a-douala'
];

test.describe('Pages du site', () => {
  for (const path of PAGES) {
    test(`${path} s'affiche sans erreur ni débordement`, async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', (e) => errors.push(e.message));
      page.on('response', (r) => {
        if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`);
      });

      await page.goto(path, { waitUntil: 'networkidle' });

      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      expect(errors).toEqual([]);

      // aucun débordement horizontal (cause n°1 des pages cassées sur mobile)
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth
      );
      expect(overflow).toBeLessThanOrEqual(1);
    });
  }

  test('toutes les photos de véhicules se chargent', async ({ page }) => {
    await page.goto('/vehicles', { waitUntil: 'networkidle' });
    const broken = await page.evaluate(() =>
      [...document.querySelectorAll('img')]
        .filter((img) => !img.complete || img.naturalWidth === 0)
        .map((img) => img.currentSrc || img.src)
    );
    expect(broken).toEqual([]);
  });

  test('le bouton WhatsApp flottant pointe vers le bon numéro', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: /WhatsApp/ }).first()).toHaveAttribute(
      'href',
      /wa\.me\/4915772809304/
    );
  });

  test('le second numéro peut être appelé depuis le pied de page et la page contact', async ({ page }) => {
    for (const path of ['/', '/contact']) {
      await page.goto(path);
      const lien = page.locator('main, footer').locator('a[href="tel:+4917663048623"]').first();
      await expect(lien).toBeVisible();
      await expect(lien).toHaveText('+49 176 63048623');
    }
  });

  test('sur un petit écran, le logo ne passe pas sous les boutons de l’en-tête', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await page.goto('/');
    const marge = await page.evaluate(() => {
      const barre = document.querySelector('header .container')!;
      const logo = barre.children[0];
      let finTexte = 0;
      const textes = document.createTreeWalker(logo, NodeFilter.SHOW_TEXT);
      while (textes.nextNode()) {
        const r = document.createRange();
        r.selectNodeContents(textes.currentNode);
        for (const rect of r.getClientRects()) finTexte = Math.max(finTexte, rect.right);
      }
      const boutons = [...barre.children].find((c) => c !== logo && getComputedStyle(c).display !== 'none')!;
      return boutons.getBoundingClientRect().left - finTexte;
    });
    expect(marge).toBeGreaterThanOrEqual(0);
  });

  test('aucun numéro fictif n’est affiché aux clients', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('body')).not.toContainText('6XX XX XX XX', { useInnerText: true });
  });

  test('chaque moyen de paiement affiche son numéro et son bénéficiaire', async ({ page }) => {
    await page.goto('/');
    const body = page.locator('body');
    await expect(body).toContainText('+237 676 71 21 91');
    await expect(body).toContainText('Rodrigo Auto Services');
    await expect(body).toContainText('+237 695 85 99 80');
    await expect(body).toContainText('Emmanuel Nations Azemkeng');
  });

  test('le badge du hero annonce le prix de la voiture photographiée', async ({ page }) => {
    await page.goto('/');
    const hero = page.getByRole('banner').or(page.locator('main section').first());
    await expect(hero.getByText('40 000 FCFA').first()).toBeVisible();
  });
});
