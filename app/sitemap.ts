import { MetadataRoute } from 'next';
import { site } from '@/lib/site';
import { articles } from '@/lib/articles';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url;
  const now = new Date();
  const routes = ['', '/vehicles', '/services', '/tarifs', '/reservation', '/about', '/contact', '/blog'];

  return [
    ...routes.map((path) => ({
      url: `${base}${path}`,
      lastModified: now,
      changeFrequency: (path === '' ? 'weekly' : 'monthly') as 'weekly' | 'monthly',
      priority: path === '' ? 1 : path === '/reservation' || path === '/vehicles' ? 0.9 : 0.6
    })),
    ...articles.map((a) => ({
      url: `${base}/blog/${a.slug}`,
      lastModified: new Date(a.date),
      changeFrequency: 'yearly' as const,
      priority: 0.5
    }))
  ];
}
