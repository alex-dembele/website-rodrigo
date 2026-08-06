import { test, expect } from '@playwright/test';

test.describe('Conseils', () => {
  test('chaque article de la liste s’ouvre en entier', async ({ page }) => {
    await page.goto('/blog');

    const links = page.getByRole('link', { name: 'Lire l’article' });
    await expect(links).toHaveCount(3);

    await links.first().click();
    await expect(page).toHaveURL(/\/blog\/[a-z-]+$/);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    // un article complet, pas un résumé : plusieurs sections et une FAQ
    expect(await page.getByRole('heading', { level: 2 }).count()).toBeGreaterThan(3);
    await expect(page.getByRole('heading', { name: 'Questions fréquentes' })).toBeVisible();
    expect((await page.locator('article').innerText()).length).toBeGreaterThan(2000);
  });

  test('l’aperçu de l’accueil pointe vers les articles', async ({ page }) => {
    await page.goto('/');
    const link = page.getByRole('link', { name: /Lire l’article/ }).first();
    await expect(link).toHaveAttribute('href', /\/blog\/[a-z-]+$/);
  });

  test('un article expose ses données structurées', async ({ page }) => {
    await page.goto('/blog/payer-orange-money-mtn-momo');
    const types = await page.evaluate(() =>
      [...document.querySelectorAll('script[type="application/ld+json"]')]
        .flatMap((s) => {
          const data = JSON.parse(s.textContent || '{}');
          return data['@graph'] ?? [data];
        })
        .map((node: { '@type': string }) => node['@type'])
    );
    expect(types).toContain('BlogPosting');
    expect(types).toContain('FAQPage');
    expect(types).toContain('BreadcrumbList');
  });

  test('les articles sont listés dans le sitemap', async ({ request }) => {
    const xml = await (await request.get('/sitemap.xml')).text();
    for (const slug of [
      'louer-une-voiture-a-douala',
      'avec-ou-sans-chauffeur',
      'payer-orange-money-mtn-momo'
    ]) {
      expect(xml).toContain(`/blog/${slug}`);
    }
  });

  test('une adresse d’article inconnue renvoie une 404', async ({ page }) => {
    const response = await page.goto('/blog/article-inexistant');
    expect(response?.status()).toBe(404);
  });
});
