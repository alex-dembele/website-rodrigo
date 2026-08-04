import type { Metadata } from 'next';
import './globals.css';
import { site } from '@/lib/site';
import { vehicles, vehicleLabel } from '@/lib/vehicles';

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: 'Rodrigo Services — Location de voiture à Douala (avec ou sans chauffeur)',
    template: '%s | Rodrigo Services Douala'
  },
  description: site.description,
  keywords: [
    'location voiture Douala',
    'location voiture Cameroun',
    'louer voiture Douala',
    'location avec chauffeur Douala',
    'transfert aéroport Douala',
    'agence location voiture Bonamoussadi',
    'Rodrigo Services',
    'Toyota Avensis location',
    'Toyota RAV4 location',
    'paiement Orange Money MTN MoMo'
  ],
  applicationName: 'Rodrigo Services',
  authors: [{ name: 'Rodrigo Services' }],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'fr_CM',
    url: site.url,
    siteName: 'Rodrigo Services',
    title: 'Rodrigo Services — Location de voiture à Douala',
    description: site.description,
    images: [{ url: '/og.jpg', width: 1200, height: 630, alt: 'Rodrigo Services — Location de voiture à Douala' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rodrigo Services — Location de voiture à Douala',
    description: site.description,
    images: ['/og.jpg']
  },
  icons: {
    icon: [{ url: '/icon.png', type: 'image/png' }],
    apple: '/apple-icon.png'
  },
  robots: { index: true, follow: true },
  manifest: '/manifest.webmanifest'
};

function StructuredData() {
  const clean = (n: string) => n.replace(/[^\d+]/g, '');
  const json = {
    '@context': 'https://schema.org',
    '@type': 'AutoRental',
    name: site.name,
    description: site.description,
    url: site.url,
    image: `${site.url}/og.jpg`,
    logo: `${site.url}/brand/logo.png`,
    telephone: clean(site.phone),
    contactPoint: [
      { '@type': 'ContactPoint', contactType: 'reservations', telephone: clean(site.whatsappDisplay), availableLanguage: ['fr', 'en'] }
    ],
    email: site.email,
    priceRange: 'FCFA',
    currenciesAccepted: 'XAF',
    paymentAccepted: 'Orange Money, MTN Mobile Money, Espèces',
    areaServed: { '@type': 'City', name: 'Douala' },
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address,
      addressLocality: site.city,
      addressCountry: 'CM'
    },
    geo: { '@type': 'GeoCoordinates', latitude: site.geo.lat, longitude: site.geo.lng },
    openingHours: 'Mo-Su 08:00-20:00',
    makesOffer: vehicles
      .filter((v) => v.available)
      .map((v) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Car',
          name: vehicleLabel(v),
          vehicleTransmission: v.transmission,
          fuelType: v.fuel,
          seatingCapacity: v.seats,
          image: v.gallery[0] ? `${site.url}${v.gallery[0]}` : undefined
        },
        priceCurrency: 'XAF',
        price: v.pricePerDay,
        priceSpecification: { '@type': 'UnitPriceSpecification', price: v.pricePerDay, priceCurrency: 'XAF', unitCode: 'DAY' }
      }))
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }} />;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        {children}
        <StructuredData />
      </body>
    </html>
  );
}
