import type { Metadata } from 'next';
import Link from 'next/link';
import { Check } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { vehicles, DRIVER_PRICE_PER_DAY } from '@/lib/vehicles';
import { fcfa, site } from '@/lib/site';
import Reveal from '@/components/Reveal';

export const metadata: Metadata = {
  title: 'Tarifs de location de voiture à Douala',
  description:
    'Tarifs clairs en FCFA pour la location de voiture à Douala chez Rodrigo Services : Avensis, RAV4, Hilux. Option chauffeur, acompte par Orange Money et MTN MoMo.',
  alternates: { canonical: '/tarifs' }
};

export default function TarifsPage() {
  return (
    <>
      <Navbar />
      <main className="bg-brand-cream">
        <section className="border-b border-brand-line bg-white">
          <div className="container py-10 sm:py-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-red">Tarifs</p>
            <h1 className="mt-2 font-display text-3xl font-extrabold text-brand-ink sm:text-4xl">
              Des prix simples et clairs
            </h1>
            <p className="mt-2 max-w-2xl text-brand-gray">
              Tous nos tarifs sont en francs CFA, par jour. L’option chauffeur est à
              +{fcfa(DRIVER_PRICE_PER_DAY)}/jour. Réductions possibles sur les longues durées — demande-nous.
            </p>
          </div>
        </section>

        <section className="container py-10 sm:py-12">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {vehicles.map((v, idx) => (
              <Reveal key={v.id} delay={idx * 90} className="h-full">
              <article className="flex h-full flex-col rounded-2xl border border-brand-line bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card">
                <p className="text-sm font-semibold text-brand-gray">{v.type}</p>
                <h2 className="mt-1 font-display text-xl font-bold text-brand-ink">{v.name}</h2>
                <p className="mt-4 font-display text-3xl font-extrabold text-brand-ink">
                  {fcfa(v.pricePerDay)}
                  <span className="text-base font-medium text-brand-gray">/jour</span>
                </p>
                <ul className="mt-5 flex-1 space-y-2 text-sm text-brand-gray">
                  {v.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-brand-red" /> {f}
                    </li>
                  ))}
                </ul>
                {v.comingSoon ? (
                  <span className="mt-6 rounded-full bg-brand-soft px-5 py-3 text-center text-sm font-semibold text-brand-gray">
                    Bientôt disponible
                  </span>
                ) : (
                  <Link
                    href={`/reservation?vehicle=${v.id}`}
                    className="mt-6 rounded-full bg-brand-red px-5 py-3 text-center font-semibold text-white shadow-red transition-transform hover:-translate-y-0.5"
                  >
                    Réserver
                  </Link>
                )}
              </article>
              </Reveal>
            ))}
          </div>

          <div className="mt-10 rounded-2xl border border-brand-line bg-white p-6 shadow-soft">
            <h2 className="font-display text-lg font-bold text-brand-ink">Bon à savoir</h2>
            <ul className="mt-3 space-y-2 text-sm text-brand-gray">
              <li>• Un acompte de {site.payment.depositPercent}% (Orange Money ou MTN MoMo) confirme la réservation.</li>
              <li>• Le solde se règle à la remise du véhicule.</li>
              <li>• Carburant et déplacements hors de Douala à discuter selon le trajet.</li>
              <li>• Une pièce d’identité (et le permis pour l’auto-conduite) est demandée.</li>
            </ul>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
