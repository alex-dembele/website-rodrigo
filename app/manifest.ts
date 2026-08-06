import { MetadataRoute } from 'next';
import { site } from '@/lib/site';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} — Location de voiture à Douala`,
    short_name: site.name,
    description: 'Location de voiture à Douala, avec ou sans chauffeur. Paiement Orange Money & MTN MoMo.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#D12630',
    lang: 'fr',
    icons: [
      { src: '/icon.png', sizes: '512x512', type: 'image/png' },
      { src: '/apple-icon.png', sizes: '180x180', type: 'image/png' }
    ]
  };
}
