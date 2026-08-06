import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import VehicleCard from '@/components/VehicleCard';
import Reveal from '@/components/Reveal';
import { vehicles } from '@/lib/vehicles';

export const metadata: Metadata = {
  title: 'Nos voitures à louer à Douala',
  description:
    'Découvrez les voitures de Rodrigo Services à Douala : Toyota Avensis berline en boîte manuelle ou automatique et SUV Toyota RAV4. Tarifs en FCFA, avec ou sans chauffeur.',
  alternates: { canonical: '/vehicles' }
};

export default function VehiclesPage() {
  return (
    <>
      <Navbar />
      <main className="bg-brand-cream">
        <section className="border-b border-brand-line bg-white">
          <div className="container py-10 sm:py-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-red">Notre flotte</p>
            <h1 className="mt-2 font-display text-3xl font-extrabold text-brand-ink sm:text-4xl">Nos voitures</h1>
            <p className="mt-2 max-w-2xl text-brand-gray">
              Des véhicules Toyota fiables et entretenus, à des prix clairs. Choisis ta voiture et réserve
              en quelques clics.
            </p>
          </div>
        </section>

        <section className="container py-10 sm:py-12">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {vehicles.map((v, idx) => (
              <Reveal key={v.id} delay={idx * 90} className="h-full">
                <VehicleCard vehicle={v} />
              </Reveal>
            ))}
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
