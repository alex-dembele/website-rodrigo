import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Rodrigo Services – Location de Voitures à Douala',
  description: 'Rodrigo Services propose une location de voitures premium à Douala avec SUV, berlines, 4x4, chauffeurs et transferts aéroport.',
  metadataBase: new URL('https://www.rodrigoservices.cm'),
  openGraph: {
    title: 'Rodrigo Services – Location de Voitures à Douala',
    description: 'Louez la voiture parfaite à Douala avec Rodrigo Services. Réservation rapide, paiement sécurisé et service premium.',
    url: 'https://www.rodrigoservices.cm',
    siteName: 'Rodrigo Services',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rodrigo Services',
    description: 'Location de voitures premium à Douala avec réservation rapide et service local.'
  },
  icons: {
    icon: '/favicon.svg'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
