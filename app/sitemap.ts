import { MetadataRoute } from 'next';
import { site } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url;
  const now = new Date();
  const routes = ['', '/vehicles', '/services', '/tarifs', '/reservation', '/about', '/contact', '/blog'];
  return routes.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: path === '' ? 'weekly' : 'monthly',
    priority: path === '' ? 1 : path === '/reservation' || path === '/vehicles' ? 0.9 : 0.6
  }));
}
