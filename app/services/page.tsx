import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import ServicesSection from '@/components/ServicesSection';
import PaymentSection from '@/components/PaymentSection';

export const metadata: Metadata = {
  title: 'Services de location et transfert à Douala',
  description:
    'Location avec ou sans chauffeur, transfert aéroport, location à la journée ou longue durée à Douala avec Rodrigo Services.',
  alternates: { canonical: '/services' }
};

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <main className="bg-brand-cream">
        <section className="border-b border-brand-line bg-white">
          <div className="container py-10 sm:py-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-red">Services</p>
            <h1 className="mt-2 font-display text-3xl font-extrabold text-brand-ink sm:text-4xl">
              Nos services de location
            </h1>
            <p className="mt-2 max-w-2xl text-brand-gray">
              Tout ce qu’il faut pour vos déplacements à Douala et au Cameroun, simplement.
            </p>
          </div>
        </section>
        <div className="py-4">
          <ServicesSection />
        </div>
        <div className="pb-14">
          <PaymentSection />
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
