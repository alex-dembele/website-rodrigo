import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import ReservationForm from '@/components/ReservationForm';

export const metadata: Metadata = {
  title: 'Réserver une voiture à Douala',
  description:
    'Réservez en ligne votre voiture à Douala avec Rodrigo Services : choisissez le véhicule, les dates, avec ou sans chauffeur. Confirmation par WhatsApp, acompte par Orange Money ou MTN MoMo.',
  alternates: { canonical: '/reservation' }
};

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
        <section className="border-b border-brand-line bg-white">
          <div className="container py-10 sm:py-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-red">Réservation</p>
            <h1 className="mt-2 font-display text-3xl font-extrabold text-brand-ink sm:text-4xl">
              Réserve ta voiture en 2 minutes
            </h1>
            <p className="mt-2 max-w-2xl text-brand-gray">
              Remplis les infos ci-dessous, envoie ta demande par WhatsApp ou email, et nous te confirmons
              rapidement la disponibilité. Le paiement se fait par Orange Money ou MTN MoMo.
            </p>
          </div>
        </section>

        <section className="container py-10 sm:py-12">
          <ReservationForm
            initialVehicleId={vehicle}
            initialPickupDate={from}
            initialReturnDate={to}
            initialLocation={location}
          />
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
