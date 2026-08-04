import { test, expect } from '@playwright/test';

const PAGES = ['/', '/vehicles', '/tarifs', '/services', '/reservation', '/about', '/contact', '/blog'];

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

  test('aucun numéro fictif n’est affiché aux clients', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('body')).not.toContainText('6XX XX XX XX', { useInnerText: true });
  });
});
