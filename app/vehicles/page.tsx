import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { vehicles } from '@/lib/vehicles';
import VehicleCard from '@/components/VehicleCard';

export default function VehiclesPage() {
  return (
    <main className="bg-brand-base min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1">
        <section className="container py-32">
          <div className="space-y-6 text-center mb-20 mt-12">
            <p className="font-sans text-[10px] font-bold uppercase tracking-[0.5em] text-brand-gold">Conduite d'exception</p>
            <h1 className="font-display text-5xl font-medium uppercase leading-[0.9] tracking-tight text-white md:text-7xl">
              Notre <br/> Flotte
            </h1>
            <p className="mx-auto max-w-2xl font-sans text-sm font-light leading-relaxed text-slate-400">
              Découvrez notre gamme de voitures sélectionnées pour offrir confort, performance et sécurité absolues.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
            {vehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
