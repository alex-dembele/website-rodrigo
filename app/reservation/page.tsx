import type { Metadata } from 'next';
import { ShieldCheck, Clock, Wallet } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ReservationForm from '@/components/ReservationForm';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Réserver une voiture à Douala',
  description:
    'Réservez en ligne votre voiture à Douala avec Rodrigo Auto Services : choisissez le véhicule, les dates, avec ou sans chauffeur. Confirmation par WhatsApp, acompte par Orange Money ou MTN MoMo.',
  alternates: { canonical: '/reservation' }
};

const reassurance = [
  { icon: Clock, text: 'Réponse par WhatsApp dans la journée' },
  { icon: Wallet, text: `Acompte ${site.payment.depositPercent}% par OM ou MoMo` },
  { icon: ShieldCheck, text: 'Aucun paiement prélevé sur le site' }
];

export default async function ReservationPage({
  searchParams
}: {
  searchParams: Promise<{ vehicle?: string; from?: string; to?: string; location?: string }>;
}) {
  const { vehicle, from, to, location } = await searchParams;

  return (
    <>
      <Navbar />
      <main className="bg-brand-cream">
        <section className="border-b border-brand-line bg-white !py-0">
          <div className="container py-7">
            <h1 className="font-display text-2xl font-extrabold text-brand-ink sm:text-3xl">
              Réserve ta voiture en 2 minutes
            </h1>
            <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
              {reassurance.map((r) => (
                <li key={r.text} className="flex items-center gap-2 text-sm text-brand-gray">
                  <r.icon className="h-4 w-4 text-brand-red" />
                  {r.text}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="container !pt-8">
          <ReservationForm
            initialVehicleId={vehicle}
            initialPickupDate={from}
            initialReturnDate={to}
            initialLocation={location}
          />
        </section>
      </main>
      {/* la barre de réservation est collée en bas sur mobile : on lui réserve
          sa place pour qu'elle ne recouvre jamais la fin du pied de page */}
      <div className="pb-24 lg:pb-0">
        <Footer />
      </div>
    </>
  );
}
